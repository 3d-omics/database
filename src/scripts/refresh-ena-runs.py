#!/usr/bin/env python3
"""Snapshot public ENA run metadata for the pinned sample catalogue.

Run after generating catalogue data. The site reads the committed snapshot at
runtime, so rebuilding an old commit never depends on ENA being available or
on ENA metadata remaining unchanged.
"""

import argparse
import json
import os
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[2]
SNAPSHOT = ROOT / "public/ena-run-metadata.json"
ENDPOINT = "https://www.ebi.ac.uk/ena/portal/api/filereport"
FIELDS = (
    "run_accession",
    "study_accession",
    "study_title",
    "sample_accession",
    "sample_description",
    "host_body_site",
    "collection_date",
    "experiment_accession",
    "library_strategy",
    "library_source",
    "library_layout",
    "instrument_model",
    "read_count",
    "base_count",
    "first_public",
    "fastq_ftp",
)
INTEGER_FIELDS = {"read_count", "base_count"}


def catalogue_accessions():
    macrosamples = json.loads(
        (ROOT / "src/assets/data/airtable/intestinalsectionsample.json").read_text()
    )
    microsamples = json.loads(
        (ROOT / "src/assets/data/airtable/microsample.json").read_text()
    )
    trials = json.loads(
        (ROOT / "src/assets/data/airtable/animaltrialexperiment.json").read_text()
    )
    catalogue = json.loads((ROOT / "catalog.json").read_text())
    accessions = {
        accession
        for record in macrosamples + microsamples
        for accession in record["fields"].get("ENA accession", [])
        if accession
    }
    projects = {
        record["fields"]["Bioproject accession"]
        for record in trials
        if record["fields"].get("Bioproject accession")
    }
    return accessions, projects, catalogue["sha256"]


def report(accession):
    query = urlencode({
        "accession": accession,
        "result": "read_run",
        "fields": ",".join(FIELDS),
        "format": "json",
    })
    request = Request(
        f"{ENDPOINT}?{query}",
        headers={"User-Agent": "3domics-data-portal/ena-metadata (+https://github.com/3d-omics/database)"},
    )
    for attempt in range(3):
        try:
            with urlopen(request, timeout=60) as response:
                data = json.load(response)
            if not isinstance(data, list):
                raise ValueError(f"Unexpected ENA report for {accession}")
            return data
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)


def normalize(record):
    metadata = {}
    for field in FIELDS:
        value = record.get(field)
        if value is None or value == "":
            continue
        if field in INTEGER_FIELDS:
            value = int(value)
        elif field == "fastq_ftp":
            value = [
                f"https://{path}"
                for path in value.split(";")
                if path.startswith("ftp.sra.ebi.ac.uk/")
            ]
            field = "fastq_urls"
        metadata[field] = value
    return metadata


def check(snapshot_path, accessions, catalogue_sha256):
    if not snapshot_path.exists():
        raise SystemExit(
            "ENA snapshot is missing. Run python3 src/scripts/refresh-ena-runs.py after generate-data."
        )
    snapshot = json.loads(snapshot_path.read_text())
    runs = snapshot.get("runs", {})
    missing = accessions - runs.keys()
    extra = runs.keys() - accessions
    if snapshot.get("catalog_sha256") != catalogue_sha256 or missing or extra:
        raise SystemExit(
            f"ENA snapshot is out of sync with catalog.json: "
            f"{len(missing)} missing runs, {len(extra)} extra runs. "
            "Run python3 src/scripts/refresh-ena-runs.py after generate-data."
        )
    invalid = [
        accession for accession, run in runs.items()
        if not isinstance(run, dict) or run.get("run_accession") != accession
    ]
    if invalid:
        raise SystemExit(f"ENA snapshot has {len(invalid)} records with mismatched run accessions")
    print(f"ENA snapshot matches catalogue: {len(runs)} runs")


def refresh(snapshot_path, accessions, projects, catalogue_sha256):
    matching = {}
    for project in sorted(projects):
        rows = report(project)
        matching.update({
            row["run_accession"]: row
            for row in rows
            if row.get("run_accession") in accessions
        })
        print(f"{project}: {len(rows)} ENA runs; {len(matching)} catalogue runs found so far", flush=True)

    missing = sorted(accessions - matching.keys())
    if missing:
        print(f"Looking up {len(missing)} runs directly", flush=True)
        with ThreadPoolExecutor(max_workers=6) as pool:
            futures = {pool.submit(report, accession): accession for accession in missing}
            for future in as_completed(futures):
                accession = futures[future]
                rows = future.result()
                matching.update({
                    row["run_accession"]: row
                    for row in rows
                    if row.get("run_accession") == accession
                })

    missing = accessions - matching.keys()
    if missing:
        raise SystemExit(f"ENA has no public report for {len(missing)} runs: {', '.join(sorted(missing)[:10])}")

    snapshot = {
        "catalog_sha256": catalogue_sha256,
        "retrieved_at": datetime.now(timezone.utc).date().isoformat(),
        "source": ENDPOINT,
        "runs": {accession: normalize(matching[accession]) for accession in sorted(accessions)},
    }
    snapshot_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=snapshot_path.parent, delete=False) as handle:
        json.dump(snapshot, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary = Path(handle.name)
    os.replace(temporary, snapshot_path)
    check(snapshot_path, accessions, catalogue_sha256)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate the committed snapshot without network access")
    args = parser.parse_args()
    accessions, projects, catalogue_sha256 = catalogue_accessions()
    if args.check:
        check(SNAPSHOT, accessions, catalogue_sha256)
    else:
        refresh(SNAPSHOT, accessions, projects, catalogue_sha256)


if __name__ == "__main__":
    main()
