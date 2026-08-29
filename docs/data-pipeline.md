# Data pipeline

The site's data is a **released artefact**, not a live fetch.
[3d-omics/database-build](https://github.com/3d-omics/database-build) builds
`3domics-<YYYY.MM.DD>.sqlite` from Airtable and publishes it; this repo pins one release
in [catalog.json](../catalog.json) and renders it at build time.

```
Airtable ──(database-build, elsewhere)──▶ 3domics-<DV>.sqlite ──(render)──▶ JSON tree ──▶ bundle
                                              pinned by catalog.json
```

`npm run generate-data` is two steps:

| Step | Command | What it does |
|---|---|---|
| 1 | `npm run fetch-catalog` | Downloads `catalog.json`'s `source` into `.catalog/3domics.sqlite`, verifies its SHA-256 against `sha256`, exits non-zero on mismatch. Re-uses the cached file when it already matches. |
| 2 | `3domics-db-build render .catalog/3domics.sqlite --into .` | Writes all 187 files: the nine record dumps, the CSVs and their `_json` conversions, and `public/experiment-hierarchy.json`. |

## Prerequisites

```bash
pip install "git+https://github.com/3d-omics/database-build.git@$(node -p "require('./catalog.json').builder")"
```

**No Airtable token.** This repo has none and needs none.

`catalog.json` carries two independent pins:

| Key | Meaning |
|---|---|
| `data_version` | Which catalogue version (`YYYY.MM.DD`) |
| `schema_version` | The catalogue's schema generation, as recorded in its `catalog_meta` |
| `sha256` | The artefact's checksum, enforced on download |
| `source` | Where to get it — a Zenodo file-content URL |
| `concept_doi` | Cite this: always resolves to the latest version |
| `version_doi` | The immutable deposit this commit builds against |
| `license` | The catalogue's licence (CC-BY-4.0) |
| `builder` | Which `database-build` tag renders it |
| `builder_wheel` | Where to get that builder as a wheel, over anonymous HTTPS |
| `builder_sha256` | The wheel's checksum, enforced before it is installed |

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
| `cryosection.json` | table `cryosections` | `tblC7ttwMXX9aOFNQ` | ~116 records |
| `cryosectionimage.json` | view `cryosections_with_image` | `tblC7ttwMXX9aOFNQ` | same table, image view, ~92 records |
| `microsample.json` | table `microsamples` | `tblCkV1GWTGEaiUBC` | ~5 800 records |
| `microsampleswithcoordination.json` | table `microsample_sequencing` | `tbl6uGSGiUXIp0K3z` | ~4 460 records, X/Y pixel coordinates |
| `macrosample.json` | table `macrosample_sequencing` | `tbld4FX1XjMrjBS0R` | a third base |

Written to `src/assets/data/airtable/` (git-ignored) as
`[{ id, createdTime, fields }]`, plus `_metadata.json` carrying `lastFetched` and the
per-table record counts that the [Home page](../src/pages/Home.tsx) displays.

The two pairs that came from one Airtable table via different views
(`animaltrialexperiment` / `experimentswithgenomeinfo`, `cryosection` / `cryosectionimage`)
are now SQL views over one stored table, distinguished by a flag column — one fetch
instead of two.

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
| `src/assets/data/genome_metadata/` | `genome_metadata_json/` | 6 — one per experiment G, H, I, J, K, M |
| `src/assets/data/macro_genome_counts/` | `macro_genome_counts_json/` | 6 |
| `src/assets/data/microsample_counts/` | `microsample_counts_json/` | **76**, one per cryosection with counts |

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

## Stage 3 — the experiment hierarchy

Rebuilds `public/experiment-hierarchy.json`, the nested JSON that the
[Download Database Schema](../src/pages/DownloadDatabaseSchema.tsx) page hands to users
for `jq` querying. Shape:

```
Projects → Experiments → Individuals → Macrosamples → Microsamples
                                     ↘ Cryosections ↗
```

Current content: 1 project, 8 experiments (C, F, G, H, I, J, K, M), 526 individuals,
1 466 macrosamples, **116** cryosections, 5 808 microsamples.

This file used to be tracked in git, which made it the one place a bad pipeline run left
a committable artefact — and the committed copy had indeed gone stale, holding 107
cryosections against its own inputs' 116. It is now rendered like everything else and
git-ignored.

The builder's hierarchy step is a port of this repo's `buildExperimentHierarchy`, and
`database-build`'s `tests/test_hierarchy_parity.py` runs the original TypeScript over the
same records and diffs the bytes, so the port is checked rather than trusted.

### ID conventions the hierarchy relies on

The linkage between levels is **positional string slicing**, not foreign keys:

- a **cryosection** ID's first 6 characters identify its macrosample
  (`G103bI301A` → `G103bI`);
- a **microsample** `Code`'s first 6 characters identify its macrosample the same way;
- microsamples are attached to cryosections by matching those 6-character prefixes;
- the **first character** of any ID is the experiment letter — used throughout the UI,
  e.g. `experimentId = cryosection.charAt(0)`.

Any ID scheme change breaks the hierarchy silently. Preserve the 6-character prefix rule.

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
npx vitest run                                       # 63 files / 475 tests
npx tsc --noEmit                                     # 4 known errors, no new ones
```
