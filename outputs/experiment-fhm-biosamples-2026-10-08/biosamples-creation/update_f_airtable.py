"""Write issued F accessions to portal and dedicated submission Airtable rows."""

import csv
import json
from pathlib import Path

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from arch3d.biosample import RepairError, atomic_json


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "f-airtable-accession-update.csv"
JOURNAL = ROOT / "biosamples-creation" / "f-airtable-update-journal.json"
BASES = (
    ("portal", "https://api.airtable.com/v0/app9370SI6jEJttkB/tbl0X0ElXWistmHa4",
     "portal_airtable_record_id", "ID", "parent_biosample"),
    ("submission", "https://api.airtable.com/v0/appo0ok4ztwGLQp77/tblIBdKW1GjFxBxb3",
     "submission_airtable_record_id", "name", "parent_samples"),
)


def api(session, method, url, **kwargs):
    response = session.request(method, url, timeout=30, **kwargs)
    response.raise_for_status()
    return response.json()


def get_batch(session, url, rows, id_key, name_key, parent_key):
    ids = [row[id_key] for row in rows]
    formula = "OR(" + ",".join('RECORD_ID()="' + value + '"' for value in ids) + ")"
    result = api(session, "GET", url, params={"filterByFormula": formula, "pageSize": 100})
    found = {record["id"]: record["fields"] for record in result["records"]}
    if set(found) != set(ids) or "offset" in result:
        raise RepairError("F Airtable batch did not resolve exactly the requested records")
    for row in rows:
        fields = found[row[id_key]]
        expected_parent = ([row["parent_biosample"]] if parent_key == "parent_biosample"
                           else row["parent_biosample"])
        if (fields.get(name_key) != row["name"] or fields.get(parent_key) != expected_parent
                or fields.get("accession", "") not in ("", row["child_biosample_accession"])):
            raise RepairError(f"F Airtable row changed for {row['name']}")
    return found


def main():
    with SOURCE.open(newline="") as inp:
        rows = list(csv.DictReader(inp))
    if len(rows) != 150 or len({row["name"] for row in rows}) != 150:
        raise RepairError("Expected 150 F accession rows")
    if len(json.loads((ROOT / "biosamples-creation/f/applied/apply-journal.json").read_text())["done"]) != 150:
        raise RepairError("F BioSamples links are not all applied")
    if not (ROOT / "f-biosamples-final-audit.csv").exists():
        raise RepairError("F public BioSamples audit is missing")
    line = next(value for value in Path("/Users/anttonalberdi/Github/database-build/.env").read_text().splitlines()
                if value.startswith("AIRTABLE_TOKEN="))
    token = line.partition("=")[2].strip().strip('"').strip("'")
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    session.mount("https://", HTTPAdapter(max_retries=Retry(total=5, backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504], allowed_methods=["GET", "PATCH"])))
    journal = json.loads(JOURNAL.read_text()) if JOURNAL.exists() else {"portal": [], "submission": []}
    for label, url, id_key, name_key, parent_key in BASES:
        done = set(journal[label])
        if done - {row[id_key] for row in rows}:
            raise RepairError("F Airtable journal has an unknown record")
        for start in range(0, len(rows), 10):
            chunk = rows[start:start + 10]
            before = get_batch(session, url, chunk, id_key, name_key, parent_key)
            updates = [{"id": row[id_key], "fields": {"accession": row["child_biosample_accession"]}}
                       for row in chunk if before[row[id_key]].get("accession", "") == ""]
            if updates:
                api(session, "PATCH", url, json={"records": updates, "typecast": False})
            after = get_batch(session, url, chunk, id_key, name_key, parent_key)
            for row in chunk:
                if after[row[id_key]].get("accession") != row["child_biosample_accession"]:
                    raise RepairError(f"F Airtable verification failed for {row['name']}")
                if row[id_key] not in done:
                    journal[label].append(row[id_key])
                    done.add(row[id_key])
            atomic_json(JOURNAL, journal)
            print(f"F {label} Airtable {len(done)}/{len(rows)}", flush=True)
    print("F Airtable update complete", flush=True)


if __name__ == "__main__":
    main()
