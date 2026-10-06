"""Build a schema-2 SQLite catalogue from normalized JSON, without Airtable.

This accepts the export published by the portal or any independently curated
document that satisfies the same JSON Schema. The website renderer can then
consume the resulting SQLite file through CATALOG_FILE.
"""

from __future__ import annotations

import argparse
import gzip
import json
import math
import os
import sqlite3
from pathlib import Path

from catalogue_relations import verify_relationships


ROOT = Path(__file__).resolve().parents[2]
SCHEMA = ROOT / "public" / "catalogue-v2.schema.json"
SQL = ROOT / "public" / "catalogue-v2.sql"


def reject_nonstandard_number(value: str) -> None:
    raise ValueError(f"Invalid JSON numeric constant: {value}")


def check_record(record: object, fields: dict, table: str, index: int) -> tuple:
    if not isinstance(record, dict) or record.keys() != fields.keys():
        raise ValueError(f"{table}[{index}]: fields differ from the published schema")
    values = []
    for name, spec in fields.items():
        value = record[name]
        allowed = spec["type"] if isinstance(spec["type"], list) else [spec["type"]]
        valid = (
            (value is None and "null" in allowed)
            or (isinstance(value, str) and "string" in allowed)
            or (type(value) is int and ("integer" in allowed or "number" in allowed))
            or (type(value) is float and "number" in allowed)
        )
        if type(value) is float and not math.isfinite(value):
            valid = False
        if not valid:
            raise ValueError(f"{table}[{index}].{name}: expected {allowed}, got {value!r}")
        values.append(value)
    return tuple(values)


def import_catalogue(source: Path, output: Path) -> None:
    if output.exists():
        raise FileExistsError(f"Output exists: {output}")
    schema = json.loads(SCHEMA.read_text())
    opener = gzip.open if source.suffix == ".gz" else open
    with opener(source, "rt", encoding="utf-8") as handle:
        document = json.load(handle, parse_constant=reject_nonstandard_number)
    if not isinstance(document, dict) or document.keys() != {"data_version", "schema_version", "tables"}:
        raise ValueError("Expected data_version, schema_version and tables only")
    if not isinstance(document["data_version"], str) or not document["data_version"]:
        raise ValueError("data_version must be a nonempty string")
    if document["schema_version"] != schema["properties"]["schema_version"]["const"]:
        raise ValueError("Unsupported schema_version")
    table_schemas = schema["properties"]["tables"]["properties"]
    tables = document["tables"]
    if not isinstance(tables, dict) or tables.keys() != table_schemas.keys():
        raise ValueError("Table names differ from the published schema")

    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_name(output.name + ".partial")
    if temporary.exists():
        raise FileExistsError(f"Incomplete prior import exists: {temporary}")
    try:
        connection = sqlite3.connect(temporary)
        try:
            connection.executescript(SQL.read_text())
            for table, table_schema in table_schemas.items():
                rows = tables[table]
                if not isinstance(rows, list):
                    raise ValueError(f"{table}: expected an array")
                fields = table_schema["items"]["properties"]
                columns = list(fields)
                placeholders = ", ".join("?" for _ in columns)
                quoted = ", ".join(f'"{column}"' for column in columns)
                statement = f'INSERT INTO "{table}" ({quoted}) VALUES ({placeholders})'
                connection.executemany(
                    statement,
                    (check_record(row, fields, table, i) for i, row in enumerate(rows)),
                )
            meta = dict(connection.execute("SELECT key, value FROM catalog_meta"))
            if meta.get("schema_version") != document["schema_version"] or meta.get("data_version") != document["data_version"]:
                raise ValueError("catalog_meta version fields disagree with the export")
            verify_relationships(connection, schema)
            integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
            if integrity != "ok":
                raise ValueError(f"SQLite integrity check failed: {integrity}")
            connection.commit()
        finally:
            connection.close()
        os.replace(temporary, output)
    except Exception:
        temporary.unlink(missing_ok=True)
        raise


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Normalized .json or .json.gz file")
    parser.add_argument("--output", type=Path, required=True, help="New SQLite catalogue")
    args = parser.parse_args()
    import_catalogue(args.source, args.output)
    print(f"Imported {args.source} into {args.output}")


if __name__ == "__main__":
    main()
