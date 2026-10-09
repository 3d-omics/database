"""Reconcile live F D/E Airtable rows and write a reviewable creation payload."""

import csv
import re
from pathlib import Path

import requests

from arch3d.biosample import RepairError, atomic_csv


ROOT = Path(__file__).resolve().parent.parent
SUBMISSION = "https://api.airtable.com/v0/appo0ok4ztwGLQp77/tbla3TWhxyOCEReft"
PORTAL = "https://api.airtable.com/v0/app9370SI6jEJttkB/tbl0X0ElXWistmHa4"
EXCLUDED = {"F149eD", "F149eE", "F150eD", "F150eE"}


def fetch_all(session, url, formula):
    rows, offset = [], None
    while True:
        params = {"filterByFormula": formula, "pageSize": 100}
        if offset:
            params["offset"] = offset
        response = session.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        rows.extend(data["records"])
        offset = data.get("offset")
        if not offset:
            return rows


def main():
    line = next(value for value in Path("/Users/anttonalberdi/Github/database-build/.env").read_text().splitlines()
                if value.startswith("AIRTABLE_TOKEN="))
    token = line.partition("=")[2].strip().strip('"').strip("'")
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})
    source = fetch_all(session, SUBMISSION, 'REGEX_MATCH({name}, "^F[0-9]{3}")')
    portal = fetch_all(session, PORTAL, 'REGEX_MATCH({ID}, "^F[0-9]{3}[a-z][DE]$")')
    by_source = {record["fields"]["name"]: record for record in source}
    by_portal = {record["fields"]["ID"]: record for record in portal}
    if (len(source) != 300 or len(portal) != 300 or len(by_source) != 300
            or set(by_source) != set(by_portal)
            or any(not re.fullmatch(r"F\d{3}[a-z][DE]", name) for name in by_source)):
        raise RepairError("F D/E source and portal names are not a one-to-one 300-row match")
    source_rows, creation_rows, mapping_rows, excluded = [], [], [], []
    for name in sorted(by_source):
        src = by_source[name]
        sf = src["fields"]
        prt = by_portal[name]
        pf = prt["fields"]
        parent = sf.get("parent_sample", "")
        mapped_parent = (pf.get("parent_biosample") or [""])[0]
        for source_field, portal_field in (
            ("data@sample@origin@value", "Sample type"),
            ("data@sample@type@value", "Description"),
            ("data@sample@container@value", "Container"),
            ("data@sample@preservative@value", "Preservative"),
            ("data@sample@storage@value", "storage"),
        ):
            if sf.get(source_field, "") != pf.get(portal_field, ""):
                raise RepairError(f"F {name}: {source_field} differs from portal {portal_field}")
        if (mapped_parent != parent or sf.get("release") != "2025-06-01T00:00:00.000Z"
                or sf.get("characteristics@level") != "macrosample"
                or sf.get("webinSubmissionAccountId") != "Webin-69627"
                or pf.get("accession") or sf.get("Metabolights accession") or pf.get("Metabolights accession")):
            raise RepairError(f"F {name}: identity, release, or accession differs from expected source")
        row = {
            "submission_airtable_record_id": src["id"],
            "portal_airtable_record_id": prt["id"],
            "created_time": src["createdTime"],
            "name": name,
            "release": sf["release"],
            "webinSubmissionAccountId": sf["webinSubmissionAccountId"],
            "taxId": sf.get("taxId", ""),
            "organism": sf.get("characteristics@organism", ""),
            "species": sf.get("characteristics@species", ""),
            "level": sf["characteristics@level"],
            "parent_sample": parent,
            "origin": sf.get("data@sample@origin@value", ""),
            "type": sf.get("data@sample@type@value", ""),
            "container": sf.get("data@sample@container@value", ""),
            "preservative": sf.get("data@sample@preservative@value", ""),
            "storage": sf.get("data@sample@storage@value", ""),
            "metabolights_accession": sf.get("Metabolights accession", ""),
        }
        source_rows.append(row)
        if name in EXCLUDED:
            if parent or row["taxId"] or row["organism"] or row["species"]:
                raise RepairError(f"Excluded F149/F150 row gained specimen metadata: {name}")
            excluded.append(name)
            continue
        if (not parent or row["taxId"] != "9031" or row["organism"] != "Gallus gallus"
                or row["species"] != "chicken" or row["storage"] != "-70 ºC"):
            raise RepairError(f"F {name}: required parent, taxonomy, or storage missing")
        creation_rows.append({
            "name": name,
            "release": row["release"],
            "webinSubmissionAccountId": row["webinSubmissionAccountId"],
            "taxId": row["taxId"],
            "characteristics@level": row["level"],
            "characteristics@organism": row["organism"],
            "characteristics@species": row["species"],
            "accession": "",
        })
        mapping_rows.append(row)
    if len(creation_rows) != 296 or len(excluded) != 4 or len({r["parent_sample"] for r in mapping_rows}) != 148:
        raise RepairError("F D/E submission scope is not 296 children under 148 specimens")
    atomic_csv(ROOT / "f-metabolomics-submission-source-after-storage.csv", list(source_rows[0]), source_rows)
    atomic_csv(ROOT / "f-metabolomics-biosamples-create-from-source.csv", list(creation_rows[0]), creation_rows)
    atomic_csv(ROOT / "f-metabolomics-parent-mapping.csv", list(mapping_rows[0]), mapping_rows)
    print("Reconciled 296 F D/E children under 148 specimens; excluded F149/F150")


if __name__ == "__main__":
    main()
