"""Write the reviewed child accessions to the 3D'omics macrosample source rows."""

import csv
import json
from pathlib import Path

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from arch3d.biosample import RepairError, atomic_json


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "hm-airtable-accession-update.csv"
JOURNAL = ROOT / "biosamples-creation" / "airtable-update-journal.json"
API = "https://api.airtable.com/v0/app9370SI6jEJttkB/tbl0X0ElXWistmHa4"


def api(session, method, **kwargs):
    response = session.request(method, API, timeout=30, **kwargs)
    response.raise_for_status()
    return response.json()


def get_batch(session, rows):
    ids = [row["airtable_record_id"] for row in rows]
    formula = "OR(" + ",".join('RECORD_ID()="' + value + '"' for value in ids) + ")"
    result = api(session, "GET", params={"filterByFormula": formula, "pageSize": 100})
    found = {record["id"]: record["fields"] for record in result["records"]}
    if set(found) != set(ids) or "offset" in result:
        raise RepairError("Airtable batch did not resolve exactly the requested records")
    for row in rows:
        fields = found[row["airtable_record_id"]]
        if (fields.get("ID") != row["macrosample_id"]
                or fields.get("parent_biosample") != [row["specimen_biosample_accession"]]
                or fields.get("accession", "") not in ("", row["child_biosample_accession"])):
            raise RepairError(f"Airtable source row changed for {row['macrosample_id']}")
    return found


def main():
    with SOURCE.open(newline="") as inp:
        rows = list(csv.DictReader(inp))
    if len(rows) != 360 or len({r["airtable_record_id"] for r in rows}) != 360:
        raise RepairError("Expected 360 distinct Airtable macrosample records")
    if any(r["previous_airtable_accession"] for r in rows):
        raise RepairError("Expected all reviewed accession fields to be blank")
    for trial, count in (("h", 200), ("m", 160)):
        journal_path = ROOT / "biosamples-creation" / trial / "applied" / "apply-journal.json"
        journal = json.loads(journal_path.read_text())
        if len(journal["done"]) != count:
            raise RepairError(f"BioSamples {trial.upper()} links are not all applied")
    line = next(value for value in Path("/Users/anttonalberdi/Github/database-build/.env").read_text().splitlines()
                if value.startswith("AIRTABLE_TOKEN="))
    token = line.partition("=")[2].strip().strip('"').strip("'")
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    retry = Retry(total=5, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504],
                  allowed_methods=["GET", "PATCH"])
    session.mount("https://", HTTPAdapter(max_retries=retry))
    journal = json.loads(JOURNAL.read_text()) if JOURNAL.exists() else {"done": []}
    done = set(journal["done"])
    if done - {r["airtable_record_id"] for r in rows}:
        raise RepairError("Airtable journal contains an unknown record")
    for start in range(0, len(rows), 10):
        chunk = rows[start:start + 10]
        before = get_batch(session, chunk)
        updates = [{"id": row["airtable_record_id"],
                    "fields": {"accession": row["child_biosample_accession"]}}
                   for row in chunk if before[row["airtable_record_id"]].get("accession", "") == ""]
        if updates:
            api(session, "PATCH", json={"records": updates, "typecast": False})
        after = get_batch(session, chunk)
        for row in chunk:
            if after[row["airtable_record_id"]].get("accession") != row["child_biosample_accession"]:
                raise RepairError(f"Airtable accession verification failed for {row['macrosample_id']}")
            if row["airtable_record_id"] not in done:
                journal["done"].append(row["airtable_record_id"])
                done.add(row["airtable_record_id"])
        atomic_json(JOURNAL, journal)
        print(f"Airtable {len(done)}/{len(rows)}", flush=True)
    print("Airtable update complete", flush=True)


if __name__ == "__main__":
    main()
