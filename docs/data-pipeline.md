# Data pipeline

The site's data is a **released artefact**, not a live fetch.
[3d-omics/database-build](https://github.com/3d-omics/database-build) builds
`3domics-<YYYY.MM.DD>.sqlite` from Airtable and publishes it; this repo pins one release
in [catalog.json](../catalog.json) and renders it at build time.

```
Airtable ──(database-build, elsewhere)──▶ 3domics-<DV>.sqlite ──(render)──▶ JSON tree ──▶ bundle
                                              pinned by catalog.json │
                                                                     └──▶ normalized JSON export
ENA public run reports ──(snapshot refresh)──▶ public/ena-run-metadata.json ──▶ sample detail pages
BioSamples records ──(snapshot refresh)──▶ public/biosample-metadata.json ──▶ material sample ERS IDs
```

`npm run generate-data` is five steps:

| Step | Command | What it does |
|---|---|---|
| 1 | `npm run fetch-catalog` | Downloads `catalog.json`'s `source` into `.catalog/3domics.sqlite`, verifies its SHA-256 against `sha256`, exits non-zero on mismatch. Re-uses the cached file when it already matches. |
| 2 | `3domics-db-build render .catalog/3domics.sqlite --into .` | Writes the nine record dumps and the CSVs and their `_json` conversions. |
| 3 | `python3 src/scripts/export-catalogue.py` | Verifies the versioned contracts against the catalogue, writes `public/catalogue-v<schema_version>.json.gz`, and removes the retired hierarchy file before the site build. |
| 4 | `npm run build-search-index` | Writes the ignored `public/search-index.json` from the rendered records and MAG metadata. Dev and production builds regenerate it automatically. The browser fetches it only when search is used. |
| 5 | `npm run fetch-cryosection-images` | Checks the pinned image archive against the catalogue and stages the extracted images under the ignored `public/cryosection-images/`. Dev and production builds repeat this step. |

### ENA run metadata

Macro- and microsample pages with an ENA run accession show the public run's study and sample
accessions, biological sample metadata, sequencing method, instrument, read totals and
FASTQ links. These fields come from the [ENA Portal API file report](https://ena-docs.readthedocs.io/en/latest/retrieval/programmatic-access/file-reports.html),
not from the catalogue. The committed [ENA snapshot](../public/ena-run-metadata.json)
records the retrieval date and the catalogue SHA-256. The browser loads this local file;
it does not contact ENA at runtime.

After changing the catalogue pin and running `npm run generate-data`, refresh the
snapshot with `npm run refresh-ena-metadata`. It fetches each trial's ENA study report,
checks the catalogue's run accessions, and fetches any remaining runs directly. It
writes nothing if a run cannot be resolved. `npm run build` verifies that the snapshot
matches the pinned catalogue and covers every linked run, without contacting ENA.
Samples without an ENA accession retain their catalogue sample details.

The ENA snapshot also carries each run's BioSamples accession (SAMEA) and
secondary INSDC sample accession (ERS). The build search step joins these to
macrosample IDs and publishes `public/macrosample-identifiers.json`, which the
table loads on demand and visitors can download. The
catalogue's material BioSamples accessions come
from the Airtable `accession` field; schema 3 maps it to
`macrosamples.biosample_accession` and renders it as `BioSamples accession`.
These are kept separate from sequencing BioSamples where both exist.
The same ENA snapshot also populates microsample table and search identifiers
and the downloadable `public/microsample-identifiers.json` crosswalk.

After a catalogue bump, run `npm run refresh-biosample-metadata` as well. It reads
the rendered material accessions, snapshots their public BioSamples SRA/ERS
cross-references, checks that each accession names its macrosample, and ties
the result to the catalogue SHA-256. The production
build checks both snapshots before bundling. The `2026.10.09` catalogue was
freshly built from Airtable and carries the repaired material accessions under
schema 3.

## Prerequisites

Follow the checksummed wheel installation in the [README](../README.md#first-time-setup).

**No Airtable token.** This repo has none and needs none.

`catalog.json` carries two independent pins:

| Key | Meaning |
|---|---|
| `data_version` | Which catalogue version (`YYYY.MM.DD`) |
| `schema_version` | The catalogue's schema generation, as recorded in its `catalog_meta` |
| `sha256` | The artefact's checksum, enforced on download |
| `source` | Where to get it — a Zenodo file-content URL |
| `cryosection_images` | Image ZIP URL and SHA-256 from the same Zenodo record version |
| `concept_doi` | Cite this: always resolves to the latest version |
| `version_doi` | The immutable deposit this commit builds against |
| `license` | The catalogue's licence (CC-BY-4.0) |
| `builder` | Which `database-build` tag renders it |
| `builder_wheel` | Where to get that builder as a wheel, over anonymous HTTPS |
| `builder_sha256` | The wheel's checksum, enforced before it is installed |
| `builder_concept_doi` | Cite this for the software: always the latest builder |
| `builder_version_doi` | The immutable builder deposit this commit installs |

Both halves of a build are therefore citable and pinned: the catalogue
([10.5281/zenodo.22159111](https://doi.org/10.5281/zenodo.22159111)) and the program that
rendered it ([10.5281/zenodo.22159536](https://doi.org/10.5281/zenodo.22159536)). They are
separate records because they are different things — data and software — and because the
site pins them independently.

The catalogue is deposited on Zenodo, not attached to a GitHub release: it is open access
under CC-BY-4.0, citable, and outlives the repository. `source` is pinned to the *version*
record rather than the concept DOI, because a reproducible build must never follow
"latest".

Bumping `data_version` changes the data; bumping `builder` changes the renderer. Neither
forces the other. Because `render` reads the catalogue through the *installed builder's*
bundled mapping, the two must remain compatible — which is why both are pinned in one
reviewable file.

To work against a catalogue you built yourself:

```bash
CATALOG_FILE=../database-build/3domics.sqlite npm run generate-data
```

The pin is not enforced in that mode and the script warns. Do not commit output from it.

## Stage 1 — catalogue → record dumps

Nine files, rebuilt from the catalogue's seven tables and two SQL views. They keep
Airtable's record shape (`[{ id, createdTime, fields }]`) exactly, which is why no
application code changed in the migration:



| Output file | Catalogue source | Origin | Notes |
|---|---|---|---|
| `animaltrialexperiment.json` | table `experiments` | `tblIv5AygbJtitB14` | |
| `animalspecimen.json` | table `specimens` | `tbldS5LFsxJ9KHZzm` | |
| `intestinalsectionsample.json` | table `macrosamples` | `tbl0X0ElXWistmHa4` | surfaced in the UI as "Macrosamples" |
| `experimentswithgenomeinfo.json` | view `experiments_with_genomes` | `tblIv5AygbJtitB14` | same table as trials, different view |
| `cryosection.json` | table `cryosections` | `tblC7ttwMXX9aOFNQ` | 90 records in `2026.10.09`; complete cryosections only, see below |
| `cryosectionimage.json` | view `cryosections_with_image` | `tblC7ttwMXX9aOFNQ` | same table, image view, ~78 records |
| `microsample.json` | table `microsamples` | `tblCkV1GWTGEaiUBC` | ~5 300 records |
| `microsampleswithcoordination.json` | table `microsample_sequencing` | `tbl6uGSGiUXIp0K3z` | ~4 090 records, X/Y pixel coordinates |
| `macrosample.json` | table `macrosample_sequencing` | `tbld4FX1XjMrjBS0R` | a third base |

Written to `src/assets/data/airtable/` (git-ignored) as
`[{ id, createdTime, fields }]`, plus `_metadata.json` carrying `lastFetched` and the
per-table record counts that the [Home page](../src/pages/Home.tsx) displays.

The two pairs that came from one Airtable table via different views
(`animaltrialexperiment` / `experimentswithgenomeinfo`, `cryosection` / `cryosectionimage`)
are now SQL views over one stored table, distinguished by a flag column — one fetch
instead of two.

**The current builder requires complete cryosections.** It keeps a cryosection when
its Airtable record holds exactly one CSV in `microsample_counts_csv` and one image in
`cropped_image`. Any other cryosection is left out, along with its microsamples
in both `microsample.json` and `microsampleswithcoordination.json`. They appear
in the first catalogue built after their attachments are complete. The rule is
`require_attachments` and `left_out_with` in `database-build`'s
`scripts/build_mapping.py`, not here.

The image attachment is `cropped_image` (field `flddr5QOjLO1V2jS1`) in the
Cryosection table `tblC7ttwMXX9aOFNQ` of Airtable base `appKakM1bnKSekwuW`.
The image-enabled JSON list comes from Airtable view `viwcoSwyCzinecGM6`.
The builder now downloads each image, records its checksum in `source_files`,
and packages a checked image ZIP alongside the catalogue on Zenodo. When
`catalog.json` pins that ZIP, `fetch-cryosection-images.py` verifies and stages
its files under `public/cryosection-images/`; the site serves those files from
GitHub Pages and overlays pixel coordinates from
`microsampleswithcoordination.json`. The build fails if an image or its checksum
is missing. The `2026.10.09` release has 90 image files in the ZIP, including
the two `G103bI309` sections previously missing from the site.

**The catalogue carries 73 of Airtable's 496 columns**, only what the site reads. A dump
rendered from it is therefore a subset of an Airtable dump, and adding a column is a
deliberate edit to `database-build`'s `scripts/build_mapping.py`, not a config change
here.

## Stage 2 — count matrices → CSV + JSON

The CSVs are **no longer committed inputs**. They are attachments on Airtable records,
downloaded and parsed by the builder, stored in the catalogue, and re-emitted here
alongside the column-major JSON (`{ "column": [v1, v2, …] }`) the chart hooks expect.
All six directories are git-ignored.

| Rendered CSV | Rendered JSON | Count |
|---|---|---|
| `src/assets/data/genome_metadata/` | `genome_metadata_json/` | 8 — one per experiment C, F, G, H, I, J, K, M |
| `src/assets/data/macro_genome_counts/` | `macro_genome_counts_json/` | 8 |
| `src/assets/data/microsample_counts/` | `microsample_counts_json/` | **90**, one per cryosection |

Genome metadata columns: `genome, domain, phylum, class, order, family, genus, species,
completeness, contamination, length`.

> It is **76**, not the 68 that used to be committed here, and not the 83–84 the old
> script's log claimed. Eight files were attached in Airtable but missing from git —
> `G103bI309A`, `G103bI309B`, `G121eI114B`, `J015eD104A`, `J015eD104B`, `J024eD104A`,
> `J024eD104B`, `M041aI101A` — and the migration restored them.

The count matrices are stored **sparse** in the catalogue (zeros dropped, about
five-sixths of the microsample cells), with both axes kept in their original order so
`render` rebuilds the dense CSV exactly, including rows that are entirely zero.

To add data for a new cryosection or experiment, attach the CSV to the Airtable record
and cut a new data release. Dropping a file into these folders does nothing — the next
render overwrites it.

## Stage 3 — normalized catalogue

The committed [`catalogue-v3.sql`](../public/catalogue-v3.sql) describes the SQL
tables, views and indexes separately from their contents. The committed
[`catalogue-v3.schema.json`](../public/catalogue-v3.schema.json) describes the
normalized JSON export. The exporter checks the pinned SQLite structure against
both contracts before writing `public/catalogue-v<schema_version>.json.gz`.
Version 2 remains documented by [SQL](../public/catalogue-v2.sql) and
[JSON Schema](../public/catalogue-v2.schema.json); the current production pin
selects version 3. The export's fixed table
names contain arrays of records; record IDs are values in named fields. The
compressed export is git-ignored and downloaded only on request. See
[the schema guide](catalogue-schema.md) for the relationship inventory and the
no-Airtable import route.
The exporter also writes ignored `src/assets/data/catalogue-build.json`, so the
download page names the schema actually rendered. In local-catalogue mode it
labels the page as a preview and omits the pinned release DOI. An export removes
the old generated JSON download of the other supported schema version, so a
later site build cannot accidentally include stale local data.

Builder 0.3.0 no longer creates the old nested hierarchy export. The portal
exports the normalized, schema-described catalogue instead.

### ID conventions used by the website

Some website views link records through positional string slicing rather than
foreign keys:

- a **cryosection** ID's first 6 characters identify its macrosample
  (`G103bI301A` → `G103bI`);
- a **microsample** `Code`'s first 6 characters identify its macrosample the same way;
- some views group microsamples with cryosections by matching those 6-character prefixes;
- the **first character** of any ID is the experiment letter — used throughout the UI,
  e.g. `experimentId = cryosection.charAt(0)`.

Any ID scheme change can break those views silently. Preserve the 6-character prefix rule until the views use explicit relationships.

## Metabolomics workbooks

The six `.xlsx` files in `src/assets/data/metabolomics/` (33 MB, ~14 MB for experiment G
alone) are the **only committed data left in this repo**. The catalogue passes the
workbooks through as source files rather than parsing them into tables, so `render` does
not write them and they are **not** touched by the pipeline. They are fetched and parsed in
the browser by
[useMetaboliteExcelFileData](../src/hooks/useMetaboliteExcelFileData.ts), which reads
sheets **by numeric index**:

| Index | Expected sheet |
|---|---|
| 1 | Sample Metadata |
| 3 | Reordered Abundances (original) |
| 4 | Normalized Abundances |

Adding an experiment's metabolomics data requires three edits: drop the workbook in the
folder, add it to the static import map in that hook, and add a `case` to
[getExperimentOptions](../src/config/metaboliteOptions.ts) for its treatment and
timepoint labels.

## Failure modes to watch for

The old pipeline's signature failure — Airtable errors swallowed, empty tables, exit `0`,
deploy anyway — is gone. What replaced it:

| Failure | Behaviour |
|---|---|
| Release not found, or network error | `fetch-catalog` exits non-zero with the HTTP status |
| Downloaded bytes do not match the pin | `fetch-catalog` exits non-zero, moves the file to `.catalog/3domics.sqlite.rejected`, renders nothing |
| Interrupted download | Written to `.partial` and only renamed on success, so it can never be mistaken for a cache hit |
| Builder expects a column the catalogue lacks | `render` fails; keep the two `catalog.json` pins in step |
| A table collapsed upstream | Caught in `database-build` at build time by row floors and `--compare-to`, before a release exists |

The remaining silent failure is **an unmapped column**: a field the site reads that the
catalogue does not carry renders as blank rather than as an error. One is known —
`'MAG catalogue description'` on the MAG Catalogue page. See
[AGENTS.md §6.7](../AGENTS.md).

**After a pin bump, verify:**

```bash
npm run generate-data                                # must exit 0; watch for the checksum line
cat src/assets/data/airtable/_metadata.json          # every recordCount non-zero
npx vitest run                                       # 76 files / 600 tests
npx tsc --noEmit                                     # 4 known errors, no new ones
```
