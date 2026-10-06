# Catalogue schema and exports

The released SQLite catalogue is the source of the portal's data. Its **schema
version 2** is specified separately from the records by
[`catalogue-v2.sql`](../public/catalogue-v2.sql). The equivalent normalized JSON
export is described by [`catalogue-v2.schema.json`](../public/catalogue-v2.schema.json),
using [JSON Schema 2020-12](https://json-schema.org/draft/2020-12). Both contracts are
committed and checked against the pinned catalogue when the website data is rendered.
The current pinned data version is in [`catalog.json`](../catalog.json).
The candidate **schema version 3** is specified by
[`catalogue-v3.sql`](../public/catalogue-v3.sql) and
[`catalogue-v3.schema.json`](../public/catalogue-v3.schema.json). It has been
validated against a migration of the pinned release but is not yet the
website's published data version.

The `/database-schema` web page offers both schema files, the normalized JSON
export and the older hierarchy. **The hierarchy is populated data, not a
schema.** Its record names and IDs are object keys. The normalized export instead
has fixed table keys and arrays of rows, with identifiers in named fields:

```json
{
  "data_version": "2026.09.22",
  "schema_version": "2",
  "tables": {
    "experiments": [{"experiment_id": "G", "name": "..."}],
    "specimens": [{"specimen_id": "G001", "experiment_id": "G"}]
  }
}
```

The example omits other fields and tables; the actual export follows the JSON
Schema. It is generated from the pinned catalogue, never hand-edited. Download
it as `catalogue-v2.json.gz` and decompress before validating or querying:

```bash
gzip -dc catalogue-v2.json.gz | jq '.tables.experiments[] | {experiment_id, name}'
```

## Tables and identifiers

| Table | Stable record identifier or row meaning |
|---|---|
| `experiments` | `experiment_id`: trial letter |
| `specimens` | `specimen_id`: individual animal |
| `macrosamples` | `macrosample_id`: intestinal sample |
| `cryosections` | `cryosection_id`: catalogued section with the required attachments |
| `microsamples` | `microsample_id`: source microsample |
| `macrosample_sequencing` | `library_id`: sequencing library, distinct from a macrosample ID |
| `microsample_sequencing` | `airtable_record_id`: sequencing/coordinate record; `microsample_id` is a library identifier, distinct from the source microsample ID |
| `genome_metadata` | A genome within an experiment and a source file |
| `macro_genome_counts`, `microsample_counts` | Sparse genome-by-sample counts; zeros are omitted |
| `matrix_axes` | Original row and column order for each count matrix, including all-zero rows |
| `source_files` | Source attachment manifest with checksums and row counts |
| `catalog_meta` | Data version, schema version, builder and source snapshot |

The SQL file is the exact structural contract of catalogue schema 2: table and
view declarations and indexes. The JSON Schema specifies each table's columns,
scalar types, nullability and fixed row shape. It cannot check relationships
between rows by itself. Its `x-relations` annotation lists cross-row links;
the exporter and importer enforce only the links marked `enforced: true`.

## Relationships and current limits

The following links are directly supported by IDs in the released catalogue:

```text
experiments.experiment_id <- specimens.experiment_id
specimens.specimen_id     <- macrosamples.specimen_id
macrosamples.macrosample_id <- cryosections.macrosample_id
```

These describe the intended biological hierarchy. They are **not all enforced
as SQLite foreign keys in schema 2**. In the 2026.09.22 release, eight
`macrosamples.specimen_id` values have no `specimens` row. The source records
must be curated before making that relationship mandatory. Furthermore,
840 `microsamples.cryosection_id` values have no matching released cryosection.
`microsamples.cryosection_id` and `microsample_sequencing.microsample_id` are
not direct foreign keys to the same-named ID columns of the apparent parent
tables. Do not join them by column name alone. The current website hierarchy
uses the documented six-character macrosample prefix convention; see
[the pipeline guide](data-pipeline.md#id-conventions-the-hierarchy-relies-on).

Sequencing **run** accessions (`ERR…`), BioSample accessions (`SAMEA…`) and ENA
sample accessions (`ERS…`) are different entities. The current catalogue carries
the run accession in the macro- and microsample sequencing records; it does not
yet model all run-to-sample relationships. A future schema change should give
multiple runs per library their own rows rather than overwrite a single field.

## Using a catalogue without Airtable

The [published SQLite release](https://zenodo.org/records/22894102) can be
queried with any SQLite client. To build this website from a compatible local
catalogue, install the pinned renderer as described in the
[README](../README.md#first-time-setup), then run:

```bash
CATALOG_FILE=/path/to/compatible.sqlite npm run generate-data
```

The local-file mode does not enforce the pinned checksum. The renderer checks
that every mapped table and column it needs exists. To create a compatible
catalogue from independently curated records, use the normalized JSON shape
described above and import it without any Airtable account:

```bash
npm run import-catalogue -- my-catalogue.json --output my-catalogue.sqlite
CATALOG_FILE=./my-catalogue.sqlite npm run generate-data
```

The importer accepts schema 2 or 3 according to `schema_version` in the JSON,
validates table names, fields, scalar types, declared relationships and SQLite
integrity, and enables SQLite foreign-key enforcement for schema 3. It cannot
establish that a biological identifier is correct or that
an external accession resolves. Attachment provenance in `source_files` should
be kept accurate for a newly curated catalogue.

Schema changes require a new schema version, an updated renderer and contracts,
validation against a complete release, and a new pinned catalogue. A change to
records alone changes the data version, not the schema version.

Schema 3 adds primary keys for the five core
entity tables, foreign keys for the specimen-to-experiment and
cryosection-to-macrosample links, and real-valued sequencing pixel coordinates.
The builder migrated the 2026.09.22 release without Airtable. All rows in its
13 tables, the 107 source-file manifest entries, and both supported foreign
keys passed validation. Its normalized JSON export also passes JSON Schema
2020-12 validation and round-trips through the importer without changing any
table row. Schema 3 has not replaced the schema-2 release pinned by this
website; publishing and pinning it requires a separate release.
The [schema-3 validation record](schema3-validation.md) lists the checks and
candidate checksum.
