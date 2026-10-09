"""Prepare F parent links and structured details from the accession ledger."""

import csv
import json
from pathlib import Path

from arch3d.biosample import RepairError, atomic_csv, atomic_json


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / "f-biosamples-submission-source.csv"
LEDGER = ROOT / "f" / "updated_f-biosamples-create-from-source.csv"


def read(path):
    with path.open(newline="") as inp:
        return list(csv.DictReader(inp))


def metric(name, value):
    return {"metric": {"value": name, "iri": None},
            "value": {"value": value, "iri": None}}


def main():
    source = {row["name"]: row for row in read(SOURCE)}
    ledger = read(LEDGER)
    if len(source) != len(ledger) or len(ledger) != 150 or any(not row["accession"] for row in ledger):
        raise RepairError("Expected 150 assigned F accessions")
    if {row["name"] for row in ledger} != set(source):
        raise RepairError("F creation ledger differs from submission source")
    rows, structured = [], {}
    for row in ledger:
        name, acc = row["name"], row["accession"]
        src = source[name]
        if (row["release"] != src["release"] or row["webinSubmissionAccountId"] != src["webinSubmissionAccountId"]
                or row["taxId"] != src["taxId"] or row["characteristics@level"] != src["level"]
                or row["characteristics@organism"] != src["organism"]):
            raise RepairError(f"F creation metadata differs for {name}")
        rows.append({"accession": acc, "name": name, "level": src["level"],
                     "parent_sample": src["parent_sample"]})
        content = [metric("intestinal section", src["intestinal_section"]),
                   metric("type", src["type"]),
                   metric("preservative", src["preservative"]),
                   metric("container", src["container"])]
        structured[acc] = {"accession": acc,
                           "data": [{"domain": None, "webinSubmissionAccountId": "Webin-69627",
                                     "type": "sample", "schema": None, "content": content}]}
    out = ROOT / "f"
    atomic_csv(out / "relationships.csv", ["accession", "name", "level", "parent_sample"], rows)
    atomic_json(out / "structured-data.json", structured)
    print("Prepared 150 F relationships and structured sample details")


if __name__ == "__main__":
    main()
