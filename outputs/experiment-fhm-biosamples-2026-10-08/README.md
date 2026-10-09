# Experiment F, H and M BioSamples relationship repair

Prepared 2026-10-08 and updated 2026-10-09 from the pinned Zenodo catalogue
`2026.10.07`, the 3D'omics Airtable source, submission base
`appo0ok4ztwGLQp77`, public BioSamples records, the ENA run map, and the
public MetaboLights study `MTBLS13488`. The initial audit was read-only;
the F/H/M BioSamples updates followed on 2026-10-09. A later Airtable token
update allowed all 806 issued F/H/M child accessions to be written to the
portal Airtable sample records and verified by readback.

## F repair on 2026-10-09

The Samples table in the dedicated BioSamples submission base contains exactly
150 F rows:
144 B digesta and six A whole-section samples. All 150 names, parent specimen
accessions, material types, containers, and preservatives match the pinned
catalogue. These rows explicitly set `level=macrosample` and release
`2025-11-01`, the same day as their parent specimens. They had no assigned
BioSample accessions or public exact-name matches before this repair.

All 150 now have public child BioSamples. Each has one outgoing `derived from`
link to the row's specimen BioSample and structured intestinal section, type,
preservative, and container details. An independent readback verified all 150
children and the reverse links on all 144 represented parent specimens. For
example, [`F001aB`](https://www.ebi.ac.uk/biosamples/samples/SAMEA123916957)
is derived from
[`F001`](https://www.ebi.ac.uk/biosamples/samples/SAMEA120632660).
The [source snapshot](f-biosamples-submission-source.csv),
[issued-accession ledger](biosamples-creation/f/updated_f-biosamples-create-from-source.csv),
and [public audit](f-biosamples-final-audit.csv) preserve the evidence.

Four F specimens—`F099`, `F100`, `F124`, and `F125`—have no child among these
150 samples because they have no row in the dedicated Samples submission table
or pinned catalogue. Portal Airtable does contain five caecum-right A–E rows for
each. Those original 20 rows have blank release, accession, and ENA fields; the
[source snapshot](f-four-specimens-caecum-right.csv) and
[four B candidates](f-four-b-candidates.csv) show them. An
[unsubmitted four-row creation proposal](f-four-b-create-proposed.csv) uses
`2025-11-01`, inferred from the other F submission rows. That proposal remains
unsubmitted; the newer D/E metabolomics rows provide children for all four.

## F metabolomics BioSamples added on 2026-10-09

The separate Airtable **Metabolomics samples** table contains 300 F rows,
all created at `2026-10-09T02:56:41Z`: 150 D digesta and 150 E tissue, two for
each `F001`–`F150`. Their names and material descriptions match the 300 D/E
rows in portal Airtable. The
[initial 300-row snapshot](f-metabolomics-submission-source-2026-10-09.csv)
and [snapshot after storage was added](f-metabolomics-submission-source-after-storage.csv)
record the source values. None of these rows is in the pinned catalogue.
The live portal Airtable view used by `database-build` also contains zero F
D/E rows. Keep them outside the catalogue until they have a real
MetaboLights study accession.

For `F001`–`F148`, 296 rows have parent specimen accessions, taxId `9031`,
organism and species, and storage `-70 ºC`. The user confirmed the source
`release` formula's `2025-06-01` value and instructed us to exclude the extra
animals `F149` and `F150`. Their four D/E rows lack parent and taxonomy and
were not submitted. The 296-row
[submission payload](f-metabolomics-biosamples-create-from-source.csv) and
[parent mapping](f-metabolomics-parent-mapping.csv) record the approved scope.
The earlier [creation draft](f-metabolomics-biosamples-create-draft.csv) and
[excluded rows](f-metabolomics-excluded-draft.csv) remain as review history.
The child release date precedes the F parents' `2025-11-01` date because the
confirmed Airtable formula was used. All F D/E rows still lack a MetaboLights
study accession and metabolomics data value; no study cross-reference can be
assigned from the available source.

All 296 included D/E rows have now been registered as BioSamples. Each has
one `derived from` relationship to its own F specimen BioSample and structured
origin, material type, container, preservative and `-70 ºC` storage. They
provide two D/E children for every one of the 148 F specimen BioSamples,
including `F099`, `F100`, `F124`, and `F125`. For example,
[`F001aD`](https://www.ebi.ac.uk/biosamples/samples/SAMEA123918107) and
[`F001aE`](https://www.ebi.ac.uk/biosamples/samples/SAMEA123918108) both
derive from [`F001`](https://www.ebi.ac.uk/biosamples/samples/SAMEA120632660).
The [issued-accession ledger](biosamples-creation/f_de/updated_f-metabolomics-biosamples-create-from-source.csv),
[reviewed link plan](biosamples-creation/f_de/plan/plan.json), and
[public audit](f-metabolomics-biosamples-final-audit.csv) record the repair.

All 296 F D/E portal Airtable `accession` values now equal the issued child
accessions; each batch was reread after writing. The
[record-ID crosswalk](f-metabolomics-airtable-accession-update.csv) and
[portal import](f-metabolomics-portal-accessions-import.csv) preserve the
mapping. The separate **Metabolomics samples** submission table has no
`accession` field in its schema. Its first write attempt returned HTTP 422
`UNKNOWN_FIELD_NAME`. The
[submission import](f-metabolomics-submission-accessions-import.csv) is a
crosswalk only until that table has a suitable field; the public BioSamples
records and portal accessions do not depend on it.

The 150 F A/B child accessions were also written to both portal Airtable and
the dedicated **Samples** submission table, with every batch reread for
verification. The [record-ID patch](f-airtable-accession-update.csv),
[portal import](f-airtable-accessions-import.csv), and
[submission import](f-submission-accessions-import.csv) preserve the mapping.
The existing ENA `D…` sequencing BioSamples remain separate, as in G's
sequencing-sample pattern.

## H/M repair on 2026-10-09

The 360 H/M metabolomics macrosamples now have their own public BioSamples:
200 in H and 160 in M. Each has `level=macrosample`, the source taxId and
species, an outgoing `derived from` link to its specimen BioSample, and
structured container, origin, material type, and `-70 ºC` storage details.
The child release date is the submission base's `2025-06-01` formula value;
this is earlier than the parents' `2025-11-01` release date. The source date
was used for the approved repair and remains a provenance issue to review.

For example, `M005aM` is now
[`SAMEA123916804`](https://www.ebi.ac.uk/biosamples/samples/SAMEA123916804),
derived from specimen
[`SAMEA120628645`](https://www.ebi.ac.uk/biosamples/samples/SAMEA120628645).
The complete name-to-accession ledger is
[`updated_hm-biosamples-create-from-source.csv`](biosamples-creation/updated_hm-biosamples-create-from-source.csv),
and [`hm-biosamples-final-audit.csv`](hm-biosamples-final-audit.csv) records
the independently re-read public state. The repair plans, backups and apply
journals are in [`biosamples-creation/`](biosamples-creation/).

All 360 H/M portal Airtable macrosample `accession` values now equal the
issued child accessions; every batch was reread after writing.
[`hm-airtable-accession-update.csv`](hm-airtable-accession-update.csv) and the
two-column [`hm-airtable-accessions-import.csv`](hm-airtable-accessions-import.csv)
preserve the source-to-BioSamples mapping. Their rows in the separate
**Metabolomics samples** submission table also have no `accession` field.

The 346 public `MTBLS13488` sample-sheet rows still cite specimen
BioSamples: [`hm-metabolights-accession-update-draft.csv`](hm-metabolights-accession-update-draft.csv)
now gives the exact child accession replacement for each row without changing
study-specific sample names. Fourteen H/M catalogue macrosamples have no
matching public study row. Updating the study requires edit access to
`MTBLS13488`; it has not been changed here.

An [upload-ready sample sheet](metabolights-upload/s_MTBLS13488.txt) was made
from the public 442-row ISA-Tab file on 2026-10-09. It changes exactly the 346
verified `Factor Value[BioSamples accession]` cells and no other cells. The
[manifest](metabolights-upload/manifest.json) records the source and corrected
SHA-256 hashes. The public study has not been edited; recheck its source hash
before uploading this file in the MetaboLights editor.

The audit findings below describe the state before the F/H/M repair unless a
later status is stated explicitly.

## Interpret sample codes within each experiment

A code letter is not a cross-experiment sample type. The G pattern below was
identified from each row's description, ENA run, MetaboLights study link, and
public BioSample, not from the final letter of its ID. The relevant catalogue
groups are:

| Experiment | Code and count | Catalogue description | Linked data |
| --- | ---: | --- | --- |
| F | A: 6 | Caecum right, entire section with content | Neither ENA nor MetaboLights |
| F | B: 144 | Caecum right, digesta | ENA runs |
| G | I: 18 | Caecum right, entire section with content | Neither ENA nor MetaboLights |
| G | J: 112 | Caecum right, digesta | ENA runs |
| G | M: 114; N: 114 | Caecum right, digesta; tissue | MetaboLights `MTBLS13315` |
| H | J: 100 | Caecum right, digesta | ENA runs |
| H | M: 100; N: 100 | Caecum right, digesta; tissue | MetaboLights `MTBLS13488` |
| M | J: 74 | Caecum right, digesta | ENA runs |
| M | M: 80; N: 80 | Caecum right, digesta; tissue | MetaboLights `MTBLS13488` |

G also has one D and two O whole-section samples; M has two H and twelve I
whole-section samples. None of these has an ENA run or MetaboLights study link.

## Experiment G control

The pinned catalogue has 114 G specimens and 228 M/N metabolomics
macrosamples. An audit of every public parent and child BioSample found exactly
two `derived from` M/N children per specimen. All 228 child names match the
catalogue, point to the correct parent, have `level=macrosample` and taxId
`9031`, and were released on `2025-06-01`. There are no missing or extra
BioSamples links in this part of G's hierarchy. All 180 H/M parents likewise
have the expected catalogue names, taxIds and organism, and belong to
`Webin-69627`.

G's 112 J sequencing macrosamples use 112 separate ENA BioSamples named `D…`.
None has a BioSamples relationship or `level` characteristic. Thus the G
pattern links biological M/N metabolomics macrosamples, not the J sequencing
BioSamples.

In the public G MetaboLights sample sheet (`MTBLS13315`), 225 of those 228 M/N
children appear under their catalogue names and cite their **child** BioSample
accessions correctly. The three absent rows are `G003aM`, `G078aM` and
`G102aM`; their child BioSamples and links nevertheless exist. G is complete
as a BioSamples hierarchy, but its MetaboLights cross-reference is incomplete.

## Findings before the F/H/M repair

- All 328 pinned F/H/M specimen BioSamples resolve as `level=specimen` and have
  no public relationships: F 148, H 100, M 80.
- The pinned catalogue has 698 macrosamples under those specimens: F 150,
  H 300, M 248. Exact-name searches of the public BioSamples index returned
  no record for any of the 698 macrosample IDs. This does not rule out a record
  submitted under another name.
- In Airtable's same macrosample view, the `parent_biosample` lookup matches
  the pinned specimen accession for all 698 rows, while `accession` is blank
  for all 698. The `child_biosamples` lookup on the ExperimentalUnit table is
  marked invalid by Airtable's schema endpoint.
- ENA identifies 318 distinct public `D…` sequencing BioSamples for 318
  macrosamples (F 144, H 100, M 74). These have no public relationships,
  no `level` characteristic, and taxId `749906` (gut metagenome). They are
  sequencing samples, not accessioned biological macrosamples.
- H and M have 360 MetaboLights-linked digesta/tissue macrosamples (coded M/N
  in these two experiments: 200 H, 160 M), each with a matching Airtable parent
  BioSample. The draft contains exactly every H/M catalogue macrosample with a
  MetaboLights study accession, irrespective of code. All 360 Airtable records
  still lack child `accession` and `data_release` values. The `storage` field is
  now `-70 ºC` for all 360 in both Airtable bases.
- The separate Airtable submission base has exactly those 360 H/M metabolomics
  rows, with names, parent accessions, taxIds, material types, origins, and
  containers matching the draft. Its `release` field is a hard-coded formula
  returning `2025-06-01T00:00:00.000Z` for every row, while every H/M parent
  BioSample was released on `2025-11-01`. The formula date is a source value,
  but its earlier-than-parent timing needs confirmation before public
  submission.
- Before repair, `M005aM` listed `SAMEA120628645` as `parent_sample` in
  Airtable, but BioSamples had no child `M005aM` or public relationship. The
  link is now established as described above.
- The public MetaboLights sample sheet for `MTBLS13488` contains 346 rows
  matching those M/N macrosamples. Each row cites its **specimen** BioSample
  accession; the M and N rows for one specimen reuse that accession. Fourteen
  catalogue M/N macrosamples have no matching MetaboLights row: `H039cM`,
  `H073eM`, and both M/N samples for `M014`, `M016`, `M029`, `M040`, `M049`,
  and `M050`.
- Only 20 of the 346 matching H/M MetaboLights sample names equal the catalogue
  macrosample ID; 326 use another naming convention. All 346 study rows map
  one-to-one to a catalogue macrosample by specimen BioSample accession and
  material type (`Intestinal Content` = digesta; `Tissue` = tissue). Their names
  can be preserved when updating the BioSample accession field. Exact-name
  BioSamples searches found 48 of the 326 alternate study names, but all 49
  matched records are unrelated human samples (taxId `646099` or `9606`) with
  no project Webin owner; name alone is not an identity match.
- Four F specimens (`F099`, `F100`, `F124`, `F125`) have no macrosample in the
  pinned catalogue. Their later D/E Airtable rows are also absent from it. The
  six M specimens above have macrosamples but no ENA run.

## Review files

- [`candidate-links.csv`](candidate-links.csv) gives the 698 catalogue
  macrosamples, their specimen BioSample parent, and the distinct ENA
  sequencing BioSample where one exists. The 318 ENA accessions are
  **candidates for biological derivation review**, not approved direct links.
- [`hm-metabolomics-draft.csv`](hm-metabolomics-draft.csv) maps all 360 H/M
  MetaboLights-linked macrosamples to their specimen BioSample and the public
  MetaboLights row. Its child accessions and release values now match the
  issued BioSamples. It is a crosswalk, not a submission file.
- [`g-biosamples-audit.csv`](g-biosamples-audit.csv) and
  [`g-metabolights-audit.csv`](g-metabolights-audit.csv) record the 228 G child
  relationship and study-sheet checks.
- [`hm-biosamples-create-draft.csv`](hm-biosamples-create-draft.csv) contains
  the 360 proposed H/M child names, taxIds, species, and Webin owner. Its
  required `release` field is blank, so it cannot be submitted as-is.
- [`hm-metabolomics-submission-source.csv`](hm-metabolomics-submission-source.csv)
  snapshots the exact 360 rows in Airtable base `appo0ok4ztwGLQp77`, including
  its hard-coded release formula result and `-70 ºC` storage values.
- [`hm-biosamples-create-from-source.csv`](hm-biosamples-create-from-source.csv)
  is a reviewable 360-row BioSamples creation payload using that exact formula
  date. It was submitted; the separate updated ledger records the issued
  accessions. The earlier-than-parent date remains a source issue.
- [`hm-biosamples-structured-draft.csv`](hm-biosamples-structured-draft.csv)
  lists the 360 source-backed container, origin, material type, and storage
  values to add after each child BioSample receives an accession.
- [`hm-metabolights-accession-update-draft.csv`](hm-metabolights-accession-update-draft.csv)
  identifies the 346 study rows where the specimen accession should be
  replaced by the issued child accession, leaving study-specific sample names
  untouched. This file is ready for a MetaboLights editor to apply.

## Scope of the repaired hierarchy

The dedicated submission base settled F's biological sample policy for the
150 rows in the pinned catalogue: both A and B were prepared with specimen
parents and a release date. They have now been accessioned and linked. The
144 ENA `D…` records remain sequencing BioSamples with taxId `749906`; the
catalogue's biological B records have chicken taxId `9031`. They should not
be substituted for one another. Linking each D record as a descendant of its
B record is a separate provenance update and is not needed to traverse the
catalogue specimen-to-macrosample hierarchy.

The four F specimens without a pinned-catalogue macrosample have source A–E
rows, including B digesta, but those older rows were omitted from the
dedicated Samples submission table and lack a release date. Their newer D/E
metabolomics rows have the confirmed release date, parent and taxonomy, and
now provide a public child path. The additional F D/E rows remain outside the
pinned catalogue and the `database-build` Airtable view. Their BioSamples and
portal Airtable accessions remain recorded for a later release after a
MetaboLights study accession is available. The next catalogue release should
carry only the 150 F A/B and 360 H/M child accessions on existing rows.

## Database-build visibility check on 2026-10-09

The live `database-build` macrosample source view
`viwfyjXFn1AHSpWdk` returned 1,466 rows. A record-ID and accession
comparison against the issued-accession ledgers found all 150 F A/B rows and
all 360 H/M rows in that view, with the expected `accession` values. None of
the 296 F D/E rows was in the view, although their portal records have the
expected accessions. For example, a direct read of the **Sample** table in
`app9370SI6jEJttkB` returns `F001aD` with `SAMEA123918107`, while the
table's **Website view** (`viwfyjXFn1AHSpWdk`) omits that record. The view is
the row filter configured in `database-build`.

The missing MetaboLights study accession appears to explain the view
exclusion. Across the full portal Sample table, all 756 digesta/tissue rows
without an ENA accession but with a MetaboLights accession are in the Website
view; none of the 1,819 comparable rows without a MetaboLights accession is.
All 300 F D/E rows lack a study accession and are outside the view. Airtable's
metadata API does not expose the view's filter formula, so this is an
inference from the live records, not a direct inspection of the rule. The
`Metabolights accession` field must remain blank until a real identifier
exists: Airtable's `Metabolights link` formula builds an editor URL from any
nonblank value, and the site renders that URL as a link. A status such as
"Coming soon" belongs in a separate field or display label. Keep all F D/E
rows out of the Website view until a real study accession is recorded.

On 2026-10-09, `database-build` 0.3.0 was published as
[software](https://doi.org/10.5281/zenodo.23255074), and a fresh Airtable build
was published as [catalogue 2026.10.09](https://doi.org/10.5281/zenodo.23255175).
Schema 3 carries Airtable `accession` as
`macrosamples.biosample_accession`, rendered as `BioSamples accession` in
portal JSON. The release contains all 510 publication-scope F A/B and H/M
child accessions and all 24 C `aI`/`aK` child accessions. It excludes the
300 F D/E rows, six C013–C015 macrosamples and nine linked sequencing rows.
The release also contains a checked archive of 90 cryosection PNGs.

The portal's ENA and BioSamples snapshots were refreshed against the new
catalogue, and the generated identifier map passed
`verify-release.py --identifiers public/macrosample-identifiers.json`, including
the reviewer examples `SAMEA120395596`, `SAMEA120503856`, `SAMEA120503869`,
and `ERS27204543`.

The [prepared MetaboLights sample sheet](metabolights-upload/s_MTBLS13488.txt)
has not been uploaded to the `MTBLS13488` editor. Check the public source
against the [manifest](metabolights-upload/manifest.json), upload the sheet,
and re-read all 346 rows when that separate study update is ready. F D/E rows
remain outside the portal until they have a real MetaboLights study accession.

The 296 accessioned F D/E rows are a separate future release. Once their
MetaboLights study entry exists, record its real accession in Airtable, verify
the study's sample links, and then include those 296 rows in the Website view
and a new catalogue release. The four unsubmitted F149/F150 D/E rows remain
outside that scope.

## Sources

- [Pinned catalogue release](https://zenodo.org/records/23201823)
- [BioSamples relationship semantics](https://www.ebi.ac.uk/biosamples/docs/guides/relationships)
- [Public MetaboLights study](https://www.ebi.ac.uk/metabolights/MTBLS13488)
- [G MetaboLights study](https://www.ebi.ac.uk/metabolights/MTBLS13315)
- [Portal ENA run-to-BioSample audit](../publication-audit-2026-09-24/portal-run-to-biosample-map.csv)
