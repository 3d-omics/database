"""Fill the H/M study crosswalks from issued BioSamples accessions."""

import csv
from pathlib import Path

from arch3d.biosample import RepairError, atomic_csv


ROOT = Path(__file__).resolve().parent.parent


def read(path):
    with path.open(newline="") as inp:
        reader = csv.DictReader(inp)
        return reader.fieldnames, list(reader)


def main():
    _, ledger = read(ROOT / "biosamples-creation" / "updated_hm-biosamples-create-from-source.csv")
    _, source = read(ROOT / "hm-metabolomics-submission-source.csv")
    _, airtable = read(ROOT / "hm-airtable-accession-update.csv")
    by_name = {row["name"]: row["accession"] for row in ledger}
    source_by_name = {row["name"]: row for row in source}
    airtable_by_name = {row["macrosample_id"]: row for row in airtable}
    if any(len(table) != 360 for table in (ledger, source, airtable, by_name, source_by_name, airtable_by_name)):
        raise RepairError("H/M source and accession ledgers are not one-to-one")
    if any(by_name[name] != row["child_biosample_accession"] for name, row in airtable_by_name.items()):
        raise RepairError("Airtable patch differs from issued BioSamples accessions")

    path = ROOT / "hm-metabolomics-draft.csv"
    columns, rows = read(path)
    if len(rows) != 360 or {row["macrosample_id"] for row in rows} != set(by_name):
        raise RepairError("Metabolomics crosswalk is incomplete")
    for row in rows:
        name = row["macrosample_id"]
        row["proposed_child_biosample_accession"] = by_name[name]
        row["release"] = source_by_name[name]["release"]
        row["review_status"] = ("BioSample linked; MetaboLights accession update pending"
                                if row["metabolights_sample_name"] else
                                "BioSample linked; no public MetaboLights sample row")
    atomic_csv(path, columns, rows)

    path = ROOT / "hm-metabolights-accession-update-draft.csv"
    columns, rows = read(path)
    if len(rows) != 346 or any(row["catalogue_macrosample_id"] not in by_name for row in rows):
        raise RepairError("MetaboLights crosswalk is incomplete")
    for row in rows:
        row["proposed_child_biosample_accession"] = by_name[row["catalogue_macrosample_id"]]
    atomic_csv(path, columns, rows)
    print("Filled 360 BioSamples crosswalk rows and 346 MetaboLights correction rows")


if __name__ == "__main__":
    main()
