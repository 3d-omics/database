# Schema-3 release candidate validation

This record describes the **2026-10-06 draft**. On 2026-10-09, schema 3 was
extended with nullable `macrosamples.biosample_accession`. The checksum below
therefore identifies the old candidate, not a catalogue matching the current
schema-3 contract. The updated builder migrated the then-pinned
2026.10.07 schema-2 catalogue to schema 3 locally and validated its structure,
integrity and relationships. Its 1,466 macrosample rows have null material
accessions because migration cannot recover Airtable fields absent from the
source release. The later live-source build was published as catalogue
`2026.10.09`; see [catalog.json](../catalog.json) for its checksum and DOI.

Schema 3 was tested as a **schema-only migration** of the public
[2026.09.22 catalogue](https://doi.org/10.5281/zenodo.22894102). The portal
now pins an Airtable-sourced schema-3 release and builder 0.3.0 wheel. The
checks below describe only the earlier migration candidate.

The input SQLite file matched the SHA-256 in [`catalog.json`](../catalog.json).
The migration stamped `data_version=2026.10.06`, `schema_version=3`, and
`built_with_3domics_db_build=0.3.0`. The candidate SQLite SHA-256 is
`5d83a7955ff592685e0289639fa4d3fd809963275c3c427accc51474fe7d42fe`.
Re-running the migration produced the same bytes.

## What changed

- The experiment, specimen, macrosample, cryosection and microsample IDs are
  non-null SQLite primary keys.
- Specimen-to-experiment and cryosection-to-macrosample links are SQLite foreign
  keys. Seven additional supported relationships are checked by the versioned
  JSON Schema's `x-relations` annotations.
- `microsample_sequencing.pixel_x` and `pixel_y` have `REAL` affinity. Existing
  integer coordinates have the same numeric values.

The [schema guide](catalogue-schema.md) explains why other apparent parent
links are not foreign keys. In particular, eight macrosamples have no released
specimen parent and 840 microsamples have no released cryosection parent.
Sequencing `microsample_id` values are in a separate identifier namespace.

## Checks run on the candidate

| Check | Result |
|---|---|
| Versioned SQL structure, `PRAGMA integrity_check`, `PRAGMA foreign_key_check` | Passed |
| Nine enforced `x-relations` | Zero unresolved values |
| Row-by-row comparison with schema 2, excluding updated `catalog_meta` | All values in the other 12 tables compare equal and remain in the same order |
| JSON Schema 2020-12 validation of normalized export | Passed with `jsonschema` 4.25.0 |
| JSON export → SQLite import → row comparison | All 13 tables identical to the candidate |
| Published source archive against `source_files` manifest | All 107 files matched SHA-256 and size |
| Public builder 0.1.0 renderer on the schema-3 candidate | 213 files rendered; every mapped column present |
| Vite production build from that rendered data | Passed; schema-3 download files present |
| `3dtk` schema-3 branch | 254 tests passed; catalogue info, microsample query and count-matrix listing worked against the candidate |
| Builder 0.3.0 wheel built and installed offline | Its `validate` command accepted the candidate |
| Zenodo release dry run | Catalogue, SHA-256 sidecar and repackaged source archive produced and checked; no deposit made |

Core row counts remain 8 experiments, 526 specimens, 1,466 macrosamples, 85
cryosections, 5,334 microsamples and 4,093 microsample sequencing records. The
107 `source_files` rows and their attachment checksums are unchanged.

## Reproduce the migration

After downloading and verifying the input catalogue against `catalog.json`, run
the builder 0.3.0 source or wheel:

```bash
3domics-db-build upgrade-schema 3domics-2026.09.22.sqlite \
  --output 3domics-2026.10.06.sqlite --data-version 2026.10.06
3domics-db-build validate 3domics-2026.10.06.sqlite
```

`upgrade-schema` now compares every copied data and provenance row before
finishing. To test a portal build with this local candidate, set
`CATALOG_FILE=/path/to/3domics-2026.10.06.sqlite` when running
`npm run generate-data`. The page labels local output as a preview and selects
the matching schema-3 download.

The migration candidate was superseded by the Airtable-sourced `2026.10.09`
catalogue. Its distinct validation and BioSamples scope are recorded in the
[F/H/M release audit](../outputs/experiment-fhm-biosamples-2026-10-08/README.md).
