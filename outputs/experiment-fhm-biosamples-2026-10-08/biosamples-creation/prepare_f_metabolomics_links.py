"""Prepare F D/E relationships and structured details from issued accessions."""

import csv
from pathlib import Path

from arch3d.biosample import RepairError, atomic_csv, atomic_json


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / "f-metabolomics-parent-mapping.csv"
LEDGER = ROOT / "f_de" / "updated_f-metabolomics-biosamples-create-from-source.csv"


def read(path):
    with path.open(newline="") as inp:
        return list(csv.DictReader(inp))


def metric(name, value):
    return {"metric": {"value": name, "iri": None},
            "value": {"value": value, "iri": None}}


def main():
    source = {row["name"]: row for row in read(SOURCE)}
    ledger = read(LEDGER)
    if (len(source) != len(ledger) or len(ledger) != 296
            or any(not row["accession"] for row in ledger)
            or {row["name"] for row in ledger} != set(source)):
        raise RepairError("Expected 296 assigned F D/E child accessions")
    relationships, structured = [], {}
    for row in ledger:
        name, accession = row["name"], row["accession"]
        src = source[name]
        if (row["release"] != src["release"] or row["taxId"] != src["taxId"]
                or row["webinSubmissionAccountId"] != src["webinSubmissionAccountId"]
                or row["characteristics@organism"] != src["organism"]
                or row["characteristics@species"] != src["species"]
                or row["characteristics@level"] != src["level"]):
            raise RepairError(f"F D/E creation metadata differs for {name}")
        relationships.append({"accession": accession, "name": name,
                              "level": src["level"], "parent_sample": src["parent_sample"]})
        content = [metric(key, src[key]) for key in ("container", "origin", "type", "preservative", "storage")]
        structured[accession] = {
            "accession": accession,
            "data": [{"domain": None, "webinSubmissionAccountId": "Webin-69627",
                      "type": "sample", "schema": None, "content": content}],
        }
    output = ROOT / "f_de"
    atomic_csv(output / "relationships.csv", ["accession", "name", "level", "parent_sample"], relationships)
    atomic_json(output / "structured-data.json", structured)
    print("Prepared 296 F D/E relationships and structured detail responses")


if __name__ == "__main__":
    main()
