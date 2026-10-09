# Experiment C BioSamples repair and catalogue scope

Prepared 2026-10-08 against the public BioSamples API and the portal's pinned
catalogue `2026.10.07`. The C001–C012 BioSamples correction was submitted and
verified on 2026-10-08. The C013–C015 exclusion and the 24 child accession
links were included in the [2026.10.09 catalogue](https://doi.org/10.5281/zenodo.23255175).

## C001–C012

The catalogue assigns `SAMEA120503842`–`SAMEA120503853` to specimens
`C001`–`C012`. Before repair, public BioSamples named these records `C001aK`–
`C012aK`, labeled them `macrosample`, and gave each a self-referential `derived
from` link. The [Arch3d plan](plan.json), generated from
[proposal.csv](proposal.csv), changed only those three fields per record. All
other base fields and all structured data were preserved. See the
[full before/after diff](audit.md).

The 24 distinct public `aI` and `aK` child records were checked directly. Each
has the expected name and an outgoing `derived from` link to its corresponding
proposed specimen accession. Their accessions are listed in
[child-evidence.csv](child-evidence.csv). In particular, the `aK` names remain
on those child records after the proposed parent correction.

The plan was refreshed against EBI immediately before applying and was
byte-for-byte identical to the reviewed plan. Its SHA-256 is
`d5577434ec2764d8d5252fbdb22ad896351e25bfc62729ff070b43e8aa7954de`.
Arch3d applied all 12 updates, saved the original responses in
[backups](applied/backups), and recorded completion in its
[journal](applied/apply-journal.json). An independent public API check confirmed
that every accession now has its intended `C001`–`C012` name,
`level=specimen`, and no self-link. The specimen accessions displayed by the
portal did not change.

The existing structured data on these 12 records includes both animal details
and sample details such as caecal origin and a 5 mL tube. The `sample` block is
duplicated on the corresponding `aK` child in all 12 cases. The original
Experiment C submission sheet was not available locally, so the plan deliberately
preserved all structured data. The duplicated blocks and the metabolomics link
on each corrected specimen should be reconciled against that sheet.

On 2026-10-09, the 24 verified `aI` and `aK` child accessions were written to
the matching portal Airtable macrosample `accession` fields. The
[source readback ledger](airtable-child-accessions.csv) records each name,
Airtable record ID, assigned BioSamples accession, and previous blank value.
All 24 public children were checked for their exact name and `derived from`
link before the update, and all 24 Airtable rows were checked after it.

## C013–C015

The trial curator confirmed that `C013`–`C015` were excluded. Do not create
specimen BioSamples or add parent links for them. The pinned catalogue still
contains six macrosamples, `C013aF/H` through `C015aF/H`, and nine sequencing
library rows assigned to these IDs. Their Airtable record IDs are in
[excluded-records.csv](excluded-records.csv). None of their IDs occur in the
released cryosection, microsample, or MAG count tables.

The trial curator authorized excluding these 15 source rows. The builder
mapping applies the exclusion explicitly in release `2026.10.09`. Its six
macrosamples and nine sequencing rows are absent from the new catalogue and
the generated search index and normalized export. The public ENA runs remain
archived; this scope decision did not change those run records.

## Sources

- [Portal publication audit](../publication-audit-2026-09-24/publication-audit.md)
- [BioSamples submission API](https://www.ebi.ac.uk/biosamples/docs/references/api/submit)
- [BioSamples relationships](https://www.ebi.ac.uk/biosamples/docs/guides/relationships)
