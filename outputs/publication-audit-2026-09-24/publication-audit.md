# 3D'omics biosample and sequencing publication audit

Audit date: 2026-09-24

Portal catalogue: `2026.09.22` / schema `2`

Catalogue release: <https://doi.org/10.5281/zenodo.22894102>

Post-audit update (2026-10-08): the 12 Experiment C specimen BioSamples were
corrected and verified in EBI; their catalogue accessions remain valid. The
curator confirmed that C013–C015 were excluded and their sample rows should
leave the next catalogue release. The counts below describe the original
2026-09-24 snapshot.

## Executive conclusion

Publication itself is largely complete. Every accession already shown in the portal is public: all 526 specimen BioSample accessions resolve, and all 5,986 macro/microsample run accessions occur in the official ENA project reports with FASTQ locations. The main gaps are incorrect assignments and incomplete synchronization between ENA, the Airtable-derived source tables, and the rendered portal.

Do not bulk-fill blank fields before resolving the two P0 correctness issues:

1. All 12 Experiment C specimen links resolve to public BioSamples named `C001aK` through `C012aK`, whose public `level` is `macrosample`, not `specimen`.
2. For 96 of the 112 Experiment G metagenomic macrosamples, the portal's linked ERR accession has an ENA `library_name` beginning with a different macrosample ID. ENA contains a unique `D1L1I1` run named for each current macrosample, so a deterministic proposed remapping is provided, but it should be confirmed against the laboratory sample sheet before editing the source.

## Coverage snapshot

| Check | Result | Interpretation |
|---|---:|---|
| Experiment BioProjects | 8/8 populated; 7 unique projects | I and K share `PRJEB86262` |
| Specimen BioSamples publicly resolvable | 526/526 | All returned public metadata |
| Specimen BioSamples semantically consistent | 514/526 | The 12 Experiment C mappings are inconsistent |
| Portal run accessions public in ENA | 5,986/5,986 | 652 macro + 5,334 micro; all have FASTQ locations |
| Unique public sequencing BioSamples behind portal runs | 5,986 | All have a SAMEA and an ERS accession, but the portal exposes only the ERR run |
| Public BioProject runs not represented by a portal ERR field | 589 | Candidates for addition or explicit exclusion |
| Microsample count-matrix columns linked locally to ENA | 4,093/4,494 | All remaining 401 are public and recoverable from ENA |
| Macrosample count-matrix columns linked to ENA | 517/524 | Seven technical-control columns have no public run matching the library alias |

“Has FASTQ” means that the ENA report publishes non-empty FASTQ locations. The files themselves were not downloaded or checksum-verified in this audit.

## Prioritized findings

### P0 — correct wrong assignments first

#### Experiment C specimen BioSamples

`SAMEA120503842`–`SAMEA120503853` are public, but their public names are `C001aK`–`C012aK` and all report `level=macrosample`. The portal assigns them to specimens `C001`–`C012`. The first record also contains a self-referential “derived from” relationship, which is consistent with a record having been reused or overwritten, but that cause must be confirmed by the submitter.

Action: determine whether the original specimen records were overwritten. Either correct the records in BioSamples or replace the portal values with distinct specimen-level accessions.

Resolved 2026-10-08: all 12 records now have names `C001`–`C012`, `level=specimen`, and no self-link. The correction retained their existing accessions and structured data; see the [repair plan and verification record](../experiment-c-repair-2026-10-08/README.md). The structured `sample` blocks remain duplicated on the `aK` child records and should be checked against the original submission sheet.

Exact records: [`biosample-semantic-mismatches.csv`](biosample-semantic-mismatches.csv)

#### Experiment G macrosample-to-run mapping

Only 16 of 112 current Experiment G mappings agree with the macrosample ID embedded in ENA's `library_name`; 96 do not. For example, portal sample `G002aJ` points to `ERR15738791`, whose ENA library is `G107bJD1L1I1`. ENA's library `G002aJD1L1I1` is instead run `ERR15738804`.

Action: verify the ENA library names against the sequencing/laboratory sample sheet. If confirmed, repair the upstream library-to-experimental-unit links rather than editing rendered JSON.

Exact current and proposed mappings: [`g-macrosample-accession-mismatches.csv`](g-macrosample-accession-mismatches.csv)

### P1 — synchronize public ENA content into the source

#### 589 public runs in the seven BioProjects are not represented by a portal ERR field

| Experiment | Type | Count | Situation |
|---|---|---:|---|
| C | Macro | 24 | Additional `R2` runs for existing portal macrosamples |
| G | Macro | 65 | Additional `R1` runs for existing portal macrosamples |
| G | Micro | 474 | Samples from 16 cryosections absent from the pinned catalogue |
| G | Micro | 2 | `b`-suffixed alternate/resequenced samples related to `G019eI105A018/019` |
| J | Macro | 24 | Additional `R3` runs for existing portal macrosamples |

The 16 absent Experiment G cryosections are:

| Cryosection | Public runs | Cryosection | Public runs |
|---|---:|---|---:|
| `G103bI301A` | 36 | `G103bI301B` | 36 |
| `G103bO201A` | 12 | `G103bO201B` | 12 |
| `G103bO201C` | 12 | `G103bO202A` | 12 |
| `G103bO202B` | 12 | `G103bO202C` | 12 |
| `G121eD101C` | 36 | `G121eI101B` | 36 |
| `G121eI102A` | 42 | `G121eI103A` | 36 |
| `G121eI103B` | 36 | `G121eO301A` | 72 |
| `G121eO302A` | 36 | `G121eO302B` | 36 |

Under the current builder, a cryosection is excluded if the required count CSV, pixel-coordinate CSV, and image are not all present. For each ID, check whether the Airtable cryosection record is absent or merely lacks an attachment; then complete it and cut a new catalogue release. Additional macro runs require a one-to-many sample/run representation instead of overwriting the existing single run field.

Exact ENA metadata and actions: [`ena-public-runs-not-in-portal.csv`](ena-public-runs-not-in-portal.csv)

#### 401 recoverable microsample cross-reference gaps

All 4,494 positive microsample columns in count matrices have a public ENA run and FASTQ locations. The local `microsample_sequencing` table contains mappings for only 4,093, so 401 genome-detail rows render without their ENA link even though the corresponding data are published.

- 324 missing mappings cover all columns of seven cryosections: `G121eI104A`, `G121eI104B`, `J015eD104A`, `J015eD104B`, `J024eD104A`, `J024eD104B`, and `M041aI101A`.
- 77 more mappings are missing across 31 partially mapped cryosections.

Action: import the ENA `run_alias` → ERR/SAMEA/ERS/sample-alias mapping into the microsample sequencing source table.

Exact import list: [`microsample-matrix-crossref-gaps.csv`](microsample-matrix-crossref-gaps.csv)

#### Sequencing sample accessions exist but are not exposed

Every one of the 5,986 portal ERR runs has its own public BioSamples SAMEA and ENA ERS accession. The current catalogue stores only the ERR run on macro/microsample records.

Action: if users need biosample-level discovery, add `biosample_accession` and `ena_sample_accession` to the upstream mapping/catalogue and display or export them separately from the run accession. Do not relabel ERR values as sample accessions.

Complete run-to-sample map: [`portal-run-to-biosample-map.csv`](portal-run-to-biosample-map.csv)

### P1/P2 — decide whether blank technical libraries should be published or exempted

Twenty-three in-scope `macrosample_sequencing` rows have no run accession and no public ENA run matching their library ID. Seven are technical-control columns used in macro count matrices (`F000` ×2, `G000` ×2, `H000` ×2, `M000` ×1); these are the important ones because the portal can show counts without an ENA destination. The other 16 do not occur in the count matrices.

Action: for each row, mark it explicitly as unsequenced/exempt or submit and populate the public run. Avoid leaving publication intent implicit in a blank field.

Exact triage list: [`macrosample-library-no-public-run.csv`](macrosample-library-no-public-run.csv)

### P1/P2 — hierarchy gaps

Six published Experiment C macrosamples (`C013aF/H`, `C014aF/H`, `C015aF/H`) point to specimen IDs that are absent from the portal. Two legacy Experiment D macrosamples are also orphaned even though D is not a catalogued experiment.

Curator resolution (2026-10-08): C013–C015 were excluded from the trial and must not be included in the portal catalogue. Do not create specimen BioSamples for them. Exclude the six macrosample rows and their nine sequencing-library rows from the next source snapshot; see [`excluded-records.csv`](../experiment-c-repair-2026-10-08/excluded-records.csv). The public ENA runs remain archived. Decide separately whether the two D records belong in the current portal scope.

Exact records: [`hierarchy-orphans.csv`](hierarchy-orphans.csv)

## Recommended execution order

1. The 12 Experiment C BioSample semantics were corrected on 2026-10-08. Validate the 96 proposed Experiment G run remappings.
2. Import the 401 recoverable micro cross-references; this repairs existing genome-detail links without new publication.
3. Decide the portal's data model for multiple sequencing runs per macro/microsample, then add the 113 additional macro runs and review the two `b`-suffixed micro runs.
4. Complete or intentionally exclude the 16 Experiment G cryosections represented by 474 already-public runs.
5. Triage the 23 unpublished/blank macro library rows, prioritizing the seven used in count matrices.
6. Add sequencing-level SAMEA and ERS fields if biosample discovery is a goal.
7. Exclude the C013–C015 source rows, cut a new catalogue release, bump `catalog.json`, rerender, and repeat this audit against ENA.

## Files in this audit

| File | Rows (excluding header) | Purpose |
|---|---:|---|
| `experiment-summary.csv` | 8 | Experiment-level coverage and gap counts |
| `biosample-semantic-mismatches.csv` | 12 | P0 Experiment C BioSample corrections |
| `g-macrosample-accession-mismatches.csv` | 96 | P0 Experiment G current/proposed run mapping |
| `ena-public-runs-not-in-portal.csv` | 589 | Public project runs absent from portal run fields |
| `microsample-matrix-crossref-gaps.csv` | 401 | ENA-backed rows missing from the local micro sequencing join |
| `macrosample-library-no-public-run.csv` | 23 | Blank/unpublished library triage |
| `portal-run-to-biosample-map.csv` | 5,986 | ERR → SAMEA/ERS mapping for all current portal runs |
| `hierarchy-orphans.csv` | 8 | Macro records with no parent specimen |

## Method and limits

- Local truth was the pinned SQLite catalogue named in [`catalog.json`](../../catalog.json), not live Airtable.
- Public run metadata came from the seven unique project accessions through the official ENA file-report endpoint. ENA documents that project accessions can be supplied to a `read_run` report: <https://ena-docs.readthedocs.io/en/latest/retrieval/programmatic-access/file-reports.html>.
- BioSample existence and metadata were checked through the official BioSamples REST resource for every one of the 526 portal accessions: <https://www.ebi.ac.uk/biosamples/docs/references/api/search>.
- “Not in portal” means the ERR accession is absent from the pinned catalogue's macro/microsample accession fields. It does not automatically mean the run must be in scope; the supplied classification is intended for curator review.
- Proposed Experiment G corrections use the macrosample ID prefix in ENA `library_name`. They are strong candidates, not a substitute for checking the submitter's sample sheet.
- This audit cannot see incomplete cryosections excluded before catalogue creation, except where their already-public ENA aliases reveal them.
