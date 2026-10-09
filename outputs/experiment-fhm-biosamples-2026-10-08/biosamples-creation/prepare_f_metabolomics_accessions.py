"""Join issued BioSamples accessions to the reviewed F D/E Airtable records."""

import csv
from pathlib import Path

from arch3d.biosample import RepairError, atomic_csv


ROOT = Path(__file__).resolve().parent.parent


def read_csv(path):
    with path.open(newline="") as source:
        return list(csv.DictReader(source))


def main():
    mapping = read_csv(ROOT / "f-metabolomics-parent-mapping.csv")
    issued = read_csv(ROOT / "biosamples-creation/f_de/updated_f-metabolomics-biosamples-create-from-source.csv")
    by_name = {row["name"]: row for row in issued}
    if (len(mapping) != 296 or len(issued) != 296 or len(by_name) != 296
            or {row["name"] for row in mapping} != set(by_name)):
        raise RepairError("F D/E Airtable and BioSamples ledgers do not match")
    rows = []
    for row in mapping:
        name = row["name"]
        accession = by_name[name]["accession"]
        if not accession.startswith("SAMEA") or not row["parent_sample"].startswith("SAMEA"):
            raise RepairError(f"Missing issued accession or parent for {name}")
        rows.append({
            "name": name,
            "child_biosample_accession": accession,
            "parent_biosample": row["parent_sample"],
            "portal_airtable_record_id": row["portal_airtable_record_id"],
            "submission_airtable_record_id": row["submission_airtable_record_id"],
        })
    if len({r["child_biosample_accession"] for r in rows}) != 296:
        raise RepairError("F D/E accessions are not unique")
    atomic_csv(ROOT / "f-metabolomics-airtable-accession-update.csv", list(rows[0]), rows)
    atomic_csv(ROOT / "f-metabolomics-portal-accessions-import.csv", ["ID", "accession"],
               [{"ID": r["name"], "accession": r["child_biosample_accession"]} for r in rows])
    atomic_csv(ROOT / "f-metabolomics-submission-accessions-import.csv", ["name", "accession"],
               [{"name": r["name"], "accession": r["child_biosample_accession"]} for r in rows])
    print("Prepared 296 F D/E source and portal accession updates")


if __name__ == "__main__":
    main()
