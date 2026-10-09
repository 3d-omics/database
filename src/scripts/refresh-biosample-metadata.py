#!/usr/bin/env python3
"""Snapshot the INSDC sample IDs attached to catalogue material BioSamples."""

from __future__ import annotations

import argparse
import json
import os
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[2]
SNAPSHOT = ROOT / "public/biosample-metadata.json"
RECORDS = ROOT / "src/assets/data/airtable/intestinalsectionsample.json"


def source_accessions() -> tuple[dict[str, str], str]:
    records = json.loads(RECORDS.read_text())
    pin = json.loads((ROOT / "catalog.json").read_text())
    expected = {}
    for row in records:
        fields = row["fields"]
        accession = fields.get("BioSamples accession")
        if not accession:
            continue
        identifier = fields["ID"]
        if accession in expected and expected[accession] != identifier:
            raise ValueError(f"Material BioSample {accession} is assigned to multiple macrosamples")
        expected[accession] = identifier
    return expected, pin["sha256"]


def fetch(accession: str) -> dict:
    url = f"https://www.ebi.ac.uk/biosamples/samples/{accession}.json"
    request = Request(url, headers={"User-Agent": "3domics-data-portal/biosample-metadata"})
    for attempt in range(4):
        try:
            with urlopen(request, timeout=40) as response:
                sample = json.load(response)
            if sample.get("accession") != accession:
                raise ValueError(f"BioSamples response did not match {accession}")
            sra = [value.get("text") for value in sample.get("characteristics", {}).get("SRA accession", [])]
            return {"name": sample.get("name"), "insdc_sample_accessions": sorted({value for value in sra if value})}
        except (HTTPError, URLError, TimeoutError):
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Could not read {accession}")


def check(expected: dict[str, str], digest: str) -> None:
    if not SNAPSHOT.exists():
        raise SystemExit("BioSamples snapshot is missing. Run npm run refresh-biosample-metadata.")
    snapshot = json.loads(SNAPSHOT.read_text())
    samples = snapshot.get("samples", {})
    if snapshot.get("catalog_sha256") != digest or set(samples) != set(expected):
        raise SystemExit("BioSamples snapshot is out of sync with catalog.json. Run npm run refresh-biosample-metadata.")
    for accession, sample in samples.items():
        if sample.get("name") != expected[accession]:
            raise SystemExit(f"Material BioSample {accession} does not name {expected[accession]}")
        if not isinstance(sample.get("insdc_sample_accessions"), list):
            raise SystemExit(f"Invalid BioSamples snapshot entry: {accession}")
    print(f"BioSamples snapshot matches catalogue: {len(samples)} material samples")


def refresh(expected: dict[str, str], digest: str) -> None:
    samples = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fetch, accession): accession for accession in expected}
        for future in as_completed(futures):
            accession = futures[future]
            sample = future.result()
            if sample["name"] != expected[accession]:
                raise ValueError(f"Material BioSample {accession} does not name {expected[accession]}")
            samples[accession] = sample
    snapshot = {
        "catalog_sha256": digest,
        "retrieved_at": datetime.now(timezone.utc).date().isoformat(),
        "source": "https://www.ebi.ac.uk/biosamples/samples/",
        "samples": {accession: samples[accession] for accession in sorted(samples)},
    }
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=SNAPSHOT.parent, delete=False) as handle:
        json.dump(snapshot, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary = Path(handle.name)
    os.replace(temporary, SNAPSHOT)
    check(expected, digest)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    ids, sha256 = source_accessions()
    if args.check:
        check(ids, sha256)
    else:
        refresh(ids, sha256)
