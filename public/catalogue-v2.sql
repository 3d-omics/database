-- 3D'omics catalogue schema 2. SQL structure of the pinned 2026.09.22 release.
-- This file describes tables and views, not catalogue records.
-- See docs/catalogue-schema.md for relationship semantics and known gaps.

CREATE TABLE "catalog_meta" (key TEXT PRIMARY KEY, value TEXT NOT NULL);

CREATE TABLE "cryosections" ("airtable_record_id" TEXT, "airtable_created_time" TEXT, "cryosection_id" TEXT, "macrosample_id" TEXT, "microsample_count" INTEGER, "position" TEXT, "slide_date" TEXT, "slide" TEXT, "has_image" INTEGER NOT NULL DEFAULT 0);

CREATE TABLE "experiments" ("airtable_record_id" TEXT, "airtable_created_time" TEXT, "experiment_id" TEXT, "name" TEXT, "type" TEXT, "start_date" TEXT, "end_date" TEXT, "description" TEXT, "bioproject_accession" TEXT, "bioproject_link" TEXT, "mag_description" TEXT, "mag_completeness_avg" REAL, "mag_contamination_avg" REAL, "mag_new_species_pct" REAL, "mag_count" INTEGER, "doi" TEXT, "link" TEXT, "has_genome_catalogue" INTEGER NOT NULL DEFAULT 0);

CREATE TABLE "genome_metadata" ("experiment_id" TEXT, "source_id" TEXT, "genome" TEXT, "domain" TEXT, "phylum" TEXT, "class" TEXT, "order" TEXT, "family" TEXT, "genus" TEXT, "species" TEXT, "completeness" REAL, "contamination" REAL, "length" INTEGER);

CREATE TABLE "macro_genome_counts" ("experiment_id" TEXT, "source_id" TEXT, "genome" TEXT, "macrosample" TEXT, "count" REAL);

CREATE TABLE "macrosample_sequencing" ("airtable_record_id" TEXT, "airtable_created_time" TEXT, "library_id" TEXT, "ena_link" TEXT, "run_accession" TEXT, "experimental_unit" TEXT);

CREATE TABLE "macrosamples" ("airtable_record_id" TEXT, "airtable_created_time" TEXT, "macrosample_id" TEXT, "code" TEXT, "container" TEXT, "data_type" TEXT, "description" TEXT, "ena_accession" TEXT, "ena_link" TEXT, "specimen_id" TEXT, "preservative" TEXT, "sample_type" TEXT, "metabolights_accession" TEXT, "metabolights_link" TEXT);

CREATE TABLE "matrix_axes" (source_id TEXT NOT NULL, axis TEXT NOT NULL, position INTEGER NOT NULL, key TEXT NOT NULL, PRIMARY KEY (source_id, axis, position));

CREATE TABLE "microsample_counts" ("cryosection_id" TEXT, "source_id" TEXT, "genome" TEXT, "microsample" TEXT, "count" REAL);

CREATE TABLE "microsample_sequencing" ("airtable_record_id" TEXT, "airtable_created_time" TEXT, "microsample_id" TEXT, "cryosection_id" TEXT, "shape" TEXT, "size" REAL, "pixel_x" INTEGER, "pixel_y" INTEGER, "ena_link" TEXT, "run_accession" TEXT);

CREATE TABLE "microsamples" ("airtable_record_id" TEXT, "airtable_created_time" TEXT, "microsample_id" TEXT, "collection_method" TEXT, "cryosection_id" TEXT, "date" TEXT, "ena_accession" TEXT, "ena_link" TEXT, "lm_batch" TEXT, "size" REAL, "x_coord" REAL, "y_coord" REAL, "sample_type" TEXT);

CREATE TABLE "source_files" (source_id TEXT PRIMARY KEY, table_name TEXT NOT NULL, attachment_key TEXT NOT NULL, target_table TEXT, owner_column TEXT NOT NULL, owner_value TEXT, filename TEXT NOT NULL, sha256 TEXT NOT NULL, size_bytes INTEGER NOT NULL, row_count INTEGER, kind TEXT NOT NULL, airtable_record_id TEXT NOT NULL);

CREATE TABLE "specimens" ("airtable_record_id" TEXT, "airtable_created_time" TEXT, "specimen_id" TEXT, "biosample_accession" TEXT, "biosample_link" TEXT, "experiment_id" TEXT, "experiment_record_id" TEXT, "pen" TEXT, "slaughtering_date" TEXT, "slaughtering_day_count" INTEGER, "treatment_name" TEXT, "treatment" TEXT, "weight" REAL, "dpi" INTEGER, "treatment_group" TEXT, "sex" TEXT, "species_scientific" TEXT, "species_common" TEXT, "taxid" TEXT, "lifestage" TEXT);

CREATE UNIQUE INDEX "idx_cryosections_cryosection_id" ON "cryosections" ("cryosection_id");

CREATE UNIQUE INDEX "idx_experiments_experiment_id" ON "experiments" ("experiment_id");

CREATE INDEX "idx_genome_metadata_genome" ON "genome_metadata" ("genome");

CREATE INDEX "idx_macro_genome_counts_genome" ON "macro_genome_counts" ("genome");

CREATE INDEX "idx_macro_genome_counts_source_id" ON "macro_genome_counts" ("source_id");

CREATE UNIQUE INDEX "idx_macrosample_sequencing_library_id" ON "macrosample_sequencing" ("library_id");

CREATE UNIQUE INDEX "idx_macrosamples_macrosample_id" ON "macrosamples" ("macrosample_id");

CREATE INDEX "idx_microsample_counts_genome" ON "microsample_counts" ("genome");

CREATE INDEX "idx_microsample_counts_source_id" ON "microsample_counts" ("source_id");

CREATE UNIQUE INDEX "idx_microsample_sequencing_microsample_id" ON "microsample_sequencing" ("microsample_id");

CREATE UNIQUE INDEX "idx_microsamples_microsample_id" ON "microsamples" ("microsample_id");

CREATE UNIQUE INDEX "idx_specimens_specimen_id" ON "specimens" ("specimen_id");

CREATE VIEW "cryosections_with_image" AS SELECT * FROM "cryosections" WHERE "has_image" = 1;

CREATE VIEW "experiments_with_genomes" AS SELECT * FROM "experiments" WHERE "has_genome_catalogue" = 1;
