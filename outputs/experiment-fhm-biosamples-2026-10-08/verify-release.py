#!/usr/bin/env python3
"""Check a new catalogue and portal identifier export against repair ledgers."""

from __future__ import annotations

import argparse
import csv
import json
import sqlite3
from pathlib import Path


HERE = Path(__file__).resolve().parent
PUBLIC_LEDGERS = (
    ("f-airtable-accession-update.csv", "name", "child_biosample_accession", "portal_airtable_record_id"),
    ("hm-airtable-accession-update.csv", "macrosample_id", "child_biosample_accession", "airtable_record_id"),
)
REVIEWER_MATERIAL = {"C002aI": "SAMEA120503856", "C008aK": "SAMEA120503869"}


def ledger_names(filename: str) -> set[str]:
    with (HERE / filename).open(newline="") as handle:
        names = [row["name"] for row in csv.DictReader(handle)]
    if len(names) != len(set(names)):
        raise ValueError(f"Duplicate macrosample name in {filename}")
    return set(names)


def excluded_rows() -> set[str]:
    source = ledger_names("f-metabolomics-submission-source-2026-10-09.csv")
    deferred = ledger_names("f-metabolomics-airtable-accession-update.csv")
    unsubmitted = ledger_names("f-metabolomics-excluded-draft.csv")
    if len(source) != 300 or len(deferred) != 296 or len(unsubmitted) != 4:
        raise ValueError("Expected 300 F D/E rows: 296 deferred and four unsubmitted")
    if source != deferred | unsubmitted or deferred & unsubmitted:
        raise ValueError("F D/E source rows differ from the deferred and unsubmitted ledgers")
    return source


def expected_rows() -> dict[str, tuple[str, str]]:
    expected = {}
    for filename, name_column, accession_column, record_column in PUBLIC_LEDGERS:
        with (HERE / filename).open(newline="") as handle:
            for row in csv.DictReader(handle):
                name = row[name_column]
                if name in expected:
                    raise ValueError(f"Duplicate ledger macrosample: {name}")
                expected[name] = (row[accession_column], row[record_column])
    if len(expected) != 510:
        raise ValueError(f"Expected 510 publication-scope F/H/M rows, found {len(expected)}")
    return expected


def check_catalogue(path: Path) -> list[str]:
    errors = []
    expected = expected_rows()
    with sqlite3.connect(f"file:{path}?mode=ro", uri=True) as connection:
        columns = {row[1] for row in connection.execute('PRAGMA table_info("macrosamples")')}
        if "biosample_accession" not in columns:
            return ["Catalogue has no macrosamples.biosample_accession column"]
        actual = {
            name: (accession, record_id)
            for name, accession, record_id in connection.execute(
                'SELECT macrosample_id, biosample_accession, airtable_record_id FROM macrosamples'
            )
        }
    for name, target in expected.items():
        if actual.get(name) != target:
            errors.append(f"{name}: expected accession and source record {target}, got {actual.get(name)}")
    for name, accession in REVIEWER_MATERIAL.items():
        if actual.get(name, (None,))[0] != accession:
            errors.append(f"{name}: expected {accession}, got {actual.get(name)}")
    for name in sorted(excluded_rows() & actual.keys()):
        errors.append(f"Deferred or excluded F D/E row present: {name}")
    return errors


def check_identifiers(path: Path) -> list[str]:
    data = json.loads(path.read_text())["macrosamples"]
    expected = {
        "C001aH": ("sequencing_biosample_accessions", "SAMEA120395596"),
        "C002aI": ("material_biosample_accession", "SAMEA120503856"),
        "C008aK": ("material_biosample_accession", "SAMEA120503869"),
    }
    errors = []
    for name, (field, accession) in expected.items():
        value = data.get(name, {}).get(field)
        matches = accession in value if isinstance(value, list) else value == accession
        if not matches:
            errors.append(f"{name}: expected {field}={accession}, got {value}")
    for name, accession in (("C001aH", "ERS27096282"), ("C002aI", "ERS27204543"), ("C008aK", "ERS27204556")):
        row = data.get(name, {})
        if accession not in row.get("material_insdc_sample_accessions", []) + row.get("sequencing_insdc_sample_accessions", []):
            errors.append(f"{name}: missing INSDC sample {accession}")
    return errors


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("catalogue", type=Path)
    parser.add_argument("--identifiers", type=Path)
    args = parser.parse_args()
    problems = check_catalogue(args.catalogue)
    if args.identifiers:
        problems.extend(check_identifiers(args.identifiers))
    if problems:
        for problem in problems[:20]:
            print(problem)
        raise SystemExit(f"FAILED: {len(problems)} accession or inclusion checks")
    print("Verified 510 F A/B and H/M accessions, C reviewer examples, and all 300 F D/E exclusions")
