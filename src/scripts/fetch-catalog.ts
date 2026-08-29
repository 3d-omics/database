/**
 * Download the catalogue pinned in catalog.json and verify its checksum.
 *
 * The site holds no Airtable credentials. Its data is a released artefact —
 * `3domics-<data_version>.sqlite`, built by 3d-omics/database-build — and
 * catalog.json names exactly which one. That is what makes a deploy
 * reproducible: rebuilding an old commit rebuilds against the catalogue that
 * commit pinned, not against today's Airtable.
 *
 * `npm run generate-data` runs this and then renders the catalogue into the
 * JSON tree the app imports.
 *
 * Set CATALOG_FILE to a local .sqlite to work against a catalogue you built
 * yourself. The pin is not enforced in that mode, so the tree you get is not
 * the tree a deploy would get.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

interface Catalog {
  data_version: string;
  schema_version: string;
  sha256: string;
  source: string;
  builder: string;
}

const ROOT = process.cwd();
const CATALOG_JSON = path.join(ROOT, 'catalog.json');
const CACHE_DIR = path.join(ROOT, '.catalog');
const CATALOG_PATH = path.join(CACHE_DIR, '3domics.sqlite');

async function sha256(file: string): Promise<string> {
  const hash = crypto.createHash('sha256');
  await pipeline(fs.createReadStream(file), hash);
  return hash.digest('hex');
}

function readPin(): Catalog {
  if (!fs.existsSync(CATALOG_JSON)) {
    throw new Error(`No catalog.json at ${CATALOG_JSON}`);
  }
  const pin = JSON.parse(fs.readFileSync(CATALOG_JSON, 'utf-8')) as Catalog;
  for (const key of ['data_version', 'schema_version', 'sha256', 'source', 'builder'] as const) {
    if (!pin[key]) throw new Error(`catalog.json is missing "${key}"`);
  }
  return pin;
}

async function download(url: string, into: string): Promise<void> {
  console.log(`⬇️  ${url}`);
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`${response.status} ${response.statusText} fetching ${url}`);
  }
  // Write to a partial file first, so an interrupted download can never be
  // mistaken for a cached catalogue on the next run.
  const partial = `${into}.partial`;
  await pipeline(Readable.fromWeb(response.body as any), fs.createWriteStream(partial));
  fs.renameSync(partial, into);
}

async function main(): Promise<void> {
  const pin = readPin();
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const local = process.env.CATALOG_FILE;
  if (local) {
    if (!fs.existsSync(local)) throw new Error(`CATALOG_FILE not found: ${local}`);
    fs.copyFileSync(local, CATALOG_PATH);
    const digest = await sha256(CATALOG_PATH);
    console.log(`⚠️  Using local catalogue ${local}`);
    console.log(`⚠️  sha256 ${digest}`);
    if (digest !== pin.sha256) {
      console.log(`⚠️  This is NOT the catalogue catalog.json pins (${pin.sha256}).`);
      console.log('⚠️  A deploy would render different data. Do not commit output built this way.');
    }
    console.log(`✅ ${CATALOG_PATH}`);
    return;
  }

  if (fs.existsSync(CATALOG_PATH) && (await sha256(CATALOG_PATH)) === pin.sha256) {
    console.log(`✅ Catalogue ${pin.data_version} already cached at ${CATALOG_PATH}`);
    return;
  }

  console.log(`📦 Catalogue ${pin.data_version} (schema ${pin.schema_version})`);
  await download(pin.source, CATALOG_PATH);

  const digest = await sha256(CATALOG_PATH);
  if (digest !== pin.sha256) {
    // Leave the bad file for inspection but make it unusable as a cache hit.
    fs.renameSync(CATALOG_PATH, `${CATALOG_PATH}.rejected`);
    throw new Error(
      `Checksum mismatch for ${pin.source}\n` +
        `  expected ${pin.sha256}\n` +
        `  got      ${digest}\n` +
        `The rejected file is at ${CATALOG_PATH}.rejected`
    );
  }

  const size = (fs.statSync(CATALOG_PATH).size / 1024 / 1024).toFixed(1);
  console.log(`✅ Verified ${size} MB against the pin → ${CATALOG_PATH}`);
}

main().catch((error) => {
  console.error(`❌ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
