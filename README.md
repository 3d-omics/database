# 3D'omics Data Portal

The public data catalogue of the [3D'omics](https://3domics.eu) EU project: animal
trials, specimens, intestinal macrosamples, cryosections, laser-microdissected
microsamples, MAG catalogues, microbial community composition and metabolomics.

A static React single-page app — no backend, no runtime API. All content is compiled
into the site at build time from a **pinned, checksummed catalogue release** —
`3domics-<YYYY.MM.DD>.sqlite`, built by
[3d-omics/database-build](https://github.com/3d-omics/database-build) — plus committed
Excel workbooks, and published to GitHub Pages under `/database/`.

The site holds no Airtable credentials. [catalog.json](catalog.json) names exactly which
catalogue release a commit was built against, which is what makes a deploy reproducible
and the dataset citable.

**Vite 6 · React 18 · TypeScript · Tailwind + daisyUI · TanStack Table · Chart.js ·
Plotly · D3**

---

## Documentation

| | |
|---|---|
| [AGENTS.md](AGENTS.md) | **Start here** — working agreement, commands, conventions, gotchas |
| [docs/architecture.md](docs/architecture.md) | Routes, page-to-data map, components, hooks |
| [docs/data-pipeline.md](docs/data-pipeline.md) | The catalogue pin, rendering, the hierarchy file, ID conventions |
| [docs/deployment.md](docs/deployment.md) | GitHub Pages, base path, deep-link redirects |
| [docs/known-issues.md](docs/known-issues.md) | Current assessment and prioritised backlog |

---

## First-time setup

```bash
git clone https://github.com/3d-omics/database.git
cd database
npm ci

# The renderer that turns the catalogue into the site's JSON tree.
# Use the version catalog.json pins.
pip install "git+https://github.com/3d-omics/database-build.git@$(node -p "require('./catalog.json').builder")"

npm run generate-data     # MUST run before anything else — see note below
npm run dev               # http://localhost:5173/database/
```

> **The generated data is not in the repository.** `src/assets/data/airtable/*.json`, the
> CSV folders, their `_json` conversions and `public/experiment-hierarchy.json` are all
> git-ignored, and 27 source files import them directly. Until you run
> `npm run generate-data`, `dev`, `build`, `test` and `tsc` all fail with
> `Cannot find module 'assets/data/airtable/…'`.

No Airtable token is needed, or accepted. `generate-data` downloads the pinned release
over HTTPS and verifies its SHA-256 before rendering.

---

## Updating site data

Site data changes by **bumping the pin**, not by re-fetching. Data is published from
[database-build](https://github.com/3d-omics/database-build) as a tagged release; the
website chooses which release to build against.

### 1. Point catalog.json at the new release

```json
{
  "data_version": "2026.09.15",
  "schema_version": "1",
  "sha256": "<from 3domics-2026.09.15.sqlite.sha256 in the release>",
  "source": "https://github.com/3d-omics/database-build/releases/download/data-v2026.09.15/3domics-2026.09.15.sqlite",
  "builder": "v0.1.0"
}
```

Copy the `sha256` from the release's `.sha256` asset — do not compute it from a local
build. A local build of the same records has a different `source_snapshot` and therefore
different bytes.

### 2. Render and check locally

```bash
npm run generate-data
npm run dev
```

`generate-data` fails loudly on a checksum mismatch rather than deploying whatever it
got. There is no silent-empty-table failure mode any more: the catalogue enforces row
floors at build time, in the other repo.

### 3. Open a PR

The pin bump is the whole diff — one file, five lines, reviewable. Merging to `main`
deploys it.

**To change what the data *contains***, or to add a column the site needs but the
catalogue does not carry, the change belongs in `database-build`: edit the column lists
in its `scripts/build_mapping.py`, regenerate the mapping, cut a new data release, then
bump the pin here.

---

## Working on the code

```bash
npm run test        # Vitest watch mode
npx vitest run      # single pass — 63 files, 475 tests
npx tsc --noEmit    # typecheck; not run by the build or by CI
npm run build       # production build into dist/
npm run preview     # serve the production build locally
```

CI **does not run tests or typecheck** before deploying, so run them yourself before
pushing to `main`. Tests verify component logic against mocked data, not data content —
you do not need to run them for a pin bump alone.

## Files you must never edit by hand

These are rendered from the pinned catalogue by `npm run generate-data`, are all
git-ignored, and any manual change will be overwritten:

- `src/assets/data/airtable/`
- `src/assets/data/genome_metadata/` and `genome_metadata_json/`
- `src/assets/data/macro_genome_counts/` and `macro_genome_counts_json/`
- `src/assets/data/microsample_counts/` and `microsample_counts_json/`
- `public/experiment-hierarchy.json`
- `.catalog/` — the downloaded catalogue itself

The CSVs used to be committed and drifted stale against Airtable; they now come from the
release, which is where the eight missing count files came back from. The Excel
workbooks under `src/assets/data/metabolomics/` are **still committed** and edited by
hand — the catalogue passes them through rather than parsing them.

## Quick reference

| Task | Command |
|---|---|
| Render the pinned data | `npm run generate-data` |
| Download the catalogue only | `npm run fetch-catalog` |
| Run locally | `npm run dev` |
| Tests | `npx vitest run` |
| Typecheck | `npx tsc --noEmit` |
| Production build | `npm run build` |
| Deploy | `git push origin main` |
| Update the data | edit `catalog.json`, open a PR |
