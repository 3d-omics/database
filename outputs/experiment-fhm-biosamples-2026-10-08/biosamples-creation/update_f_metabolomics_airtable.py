"""Write issued F D/E accessions to their two exact Airtable source records."""

import argparse
import csv
import json
from pathlib import Path

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from arch3d.biosample import RepairError, atomic_json


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "f-metabolomics-airtable-accession-update.csv"
JOURNAL = ROOT / "biosamples-creation/f_de/airtable-update-journal.json"
BASES = (
    ("portal", "https://api.airtable.com/v0/app9370SI6jEJttkB/tbl0X0ElXWistmHa4",
     "portal_airtable_record_id", "ID", "parent_biosample"),
    ("submission", "https://api.airtable.com/v0/appo0ok4ztwGLQp77/tbla3TWhxyOCEReft",
     "submission_airtable_record_id", "name", "parent_sample"),
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
        raise RepairError("F D/E Airtable batch did not resolve exactly the requested records")
    for row in rows:
        fields = found[row[id_key]]
        parent = ([row["parent_biosample"]] if parent_key == "parent_biosample"
                  else row["parent_biosample"])
        if (fields.get(name_key) != row["name"] or fields.get(parent_key) != parent
                or fields.get("accession", "") not in ("", row["child_biosample_accession"])):
            raise RepairError(f"F D/E Airtable row changed for {row['name']}")
    return found


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("base", choices=("portal", "submission", "all"))
    args = parser.parse_args()
    with SOURCE.open(newline="") as source:
        rows = list(csv.DictReader(source))
    if len(rows) != 296 or len({row["name"] for row in rows}) != 296:
        raise RepairError("Expected 296 F D/E accession rows")
    if len(json.loads((ROOT / "biosamples-creation/f_de/applied/apply-journal.json").read_text())["done"]) != 296:
        raise RepairError("F D/E BioSamples links are not all applied")
    if not (ROOT / "f-metabolomics-biosamples-final-audit.csv").exists():
        raise RepairError("F D/E public BioSamples audit is missing")
    line = next(value for value in Path("/Users/anttonalberdi/Github/database-build/.env").read_text().splitlines()
                if value.startswith("AIRTABLE_TOKEN="))
    token = line.partition("=")[2].strip().strip('"').strip("'")
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    session.mount("https://", HTTPAdapter(max_retries=Retry(total=5, backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504], allowed_methods=["GET"])))
    journal = json.loads(JOURNAL.read_text()) if JOURNAL.exists() else {"portal": [], "submission": []}
    for label, url, id_key, name_key, parent_key in BASES:
        if args.base != "all" and args.base != label:
            continue
        done = set(journal[label])
        if done - {row[id_key] for row in rows}:
            raise RepairError("F D/E Airtable journal has an unknown record")
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
                    raise RepairError(f"F D/E Airtable verification failed for {row['name']}")
                if row[id_key] not in done:
                    journal[label].append(row[id_key])
                    done.add(row[id_key])
            atomic_json(JOURNAL, journal)
            print(f"F D/E {label} Airtable {len(done)}/{len(rows)}", flush=True)
    print("F D/E Airtable update complete", flush=True)


if __name__ == "__main__":
    main()
