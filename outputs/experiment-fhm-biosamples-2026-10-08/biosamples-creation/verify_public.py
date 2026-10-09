"""Independently re-read F or H/M children and parent BioSamples."""

import argparse
import csv
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

from arch3d.biosample import RepairError, fetch, owned_edges, writable
from apply_links import normalized_structured


ROOT = Path(__file__).resolve().parent


def read(accession):
    return accession, fetch(requests.Session(), accession)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("trial", choices=("f", "f_de", "hm"), default="hm", nargs="?")
    args = parser.parse_args()
    trials = ("h", "m") if args.trial == "hm" else (args.trial,)
    plans = [json.loads((ROOT / trial / "plan" / "plan.json").read_text()) for trial in trials]
    entries = [entry for plan in plans for entry in plan["entries"]]
    dependencies = {acc: record for plan in plans for acc, record in plan["dependencies"].items()}
    expected_reverse = {
        acc: {rel["source"] for rel in record["sample"].get("relationships", [])
              if rel.get("source") != acc and rel.get("target") == acc and rel.get("type") == "derived from"}
        for acc, record in dependencies.items()
    }
    for entry in entries:
        acc = entry["accession"]
        parents = owned_edges(entry["after"]["sample"], acc)
        if len(parents) != 1:
            raise RepairError(f"Unexpected parent count for {acc}")
        expected_reverse[parents[0]].add(acc)
    accessions = [entry["accession"] for entry in entries] + list(dependencies)
    results = {}
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(read, accession): accession for accession in accessions}
        for future in as_completed(futures):
            accession, live = future.result()
            results[accession] = live
    for parent, expected_children in expected_reverse.items():
        actual = {rel["source"] for rel in results[parent]["sample"].get("relationships", [])
                  if rel.get("source") != parent and rel.get("target") == parent and rel.get("type") == "derived from"}
        if actual != expected_children:
            raise RepairError(f"Reverse links differ for parent {parent}: {actual ^ expected_children}")
    rows = []
    for entry in entries:
        acc = entry["accession"]
        sample = results[acc]
        if (writable(sample["sample"]) != entry["after"]["sample"]
                or normalized_structured(sample["structured"]) != normalized_structured(entry["after"]["structured"])):
            raise RepairError(f"Public child differs from reviewed plan: {acc}")
        rows.append({"experiment": entry["after"]["sample"]["name"][0],
                     "name": entry["after"]["sample"]["name"],
                     "child_biosample_accession": acc,
                     "parent_biosample_accession": owned_edges(sample["sample"], acc)[0],
                     "level": sample["sample"]["characteristics"]["level"][0]["text"],
                     "release": sample["sample"]["release"],
                     "taxId": sample["sample"]["taxId"],
                     "structured_metrics": ";".join(sorted(item["metric"]["value"] + "=" + item["value"]["value"]
                         for data in sample["structured"]["data"] for item in data["content"]))})
    filename = "f-metabolomics-biosamples-final-audit.csv" if args.trial == "f_de" else f"{args.trial}-biosamples-final-audit.csv"
    output = ROOT.parent / filename
    with output.open("w", newline="") as out:
        writer = csv.DictWriter(out, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Verified {len(rows)} public children and {len(dependencies)} parent reverse-link sets")


if __name__ == "__main__":
    main()
