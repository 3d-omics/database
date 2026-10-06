"""Validate the pinned SQLite contract and publish a normalized JSON export.

The SQL and JSON Schema in public/ are committed contracts. The catalogue is
instance data; this script refuses to export it if its structure has drifted.
"""

from __future__ import annotations

import gzip
import hashlib
import json
import os
import sqlite3
from pathlib import Path

from catalogue_relations import verify_relationships


ROOT = Path(__file__).resolve().parents[2]
CATALOGUE = ROOT / ".catalog" / "3domics.sqlite"
SCHEMA = ROOT / "public" / "catalogue-v2.schema.json"
SQL = ROOT / "public" / "catalogue-v2.sql"
OUTPUT = ROOT / "public" / "catalogue-v2.json.gz"


def catalogue_structure(connection: sqlite3.Connection) -> dict[str, str]:
    return {
        name: statement
        for name, statement in connection.execute(
            "SELECT name, sql FROM sqlite_master "
            "WHERE type IN ('table', 'view', 'index') "
            "AND name NOT LIKE 'sqlite_%' AND sql IS NOT NULL"
        )
    }


def verify_structure(connection: sqlite3.Connection, schema: dict) -> None:
    expected = sqlite3.connect(":memory:")
    try:
        expected.executescript(SQL.read_text())
        actual_structure = catalogue_structure(connection)
        expected_structure = catalogue_structure(expected)
        if actual_structure != expected_structure:
            missing = sorted(expected_structure.keys() - actual_structure.keys())
            extra = sorted(actual_structure.keys() - expected_structure.keys())
            changed = sorted(
                name for name in actual_structure.keys() & expected_structure.keys()
                if actual_structure[name] != expected_structure[name]
            )
            raise ValueError(
                f"SQLite schema differs from {SQL.name}: "
                f"missing={missing}, extra={extra}, changed={changed}"
            )
    finally:
        expected.close()

    table_schemas = schema["properties"]["tables"]["properties"]
    actual_tables = {
        row[0] for row in connection.execute(
            "SELECT name FROM sqlite_master WHERE type='table' "
            "AND name NOT LIKE 'sqlite_%'"
        )
    }
    if actual_tables != table_schemas.keys():
        raise ValueError("JSON Schema table names do not match the catalogue")
    for table, table_schema in table_schemas.items():
        fields = table_schema["items"]["properties"]
        columns = list(connection.execute(f'PRAGMA table_info("{table}")'))
        actual = {name: kind for _, name, kind, *_ in columns}
        declared = {name: spec["x-sqlite-type"] for name, spec in fields.items()}
        if actual != declared:
            raise ValueError(f"JSON Schema columns or types differ for {table}")


def main() -> None:
    pin = json.loads((ROOT / "catalog.json").read_text())
    schema = json.loads(SCHEMA.read_text())
    if pin["schema_version"] != "2" or schema["properties"]["schema_version"]["const"] != "2":
        raise ValueError("The pinned release and export schema must both be version 2")
    if not os.getenv("CATALOG_FILE"):
        with CATALOGUE.open("rb") as source:
            digest = hashlib.file_digest(source, "sha256").hexdigest()
        if digest != pin["sha256"]:
            raise ValueError("Catalogue checksum does not match catalog.json")

    with sqlite3.connect(f"file:{CATALOGUE}?mode=ro", uri=True) as connection:
        verify_structure(connection, schema)
        verify_relationships(connection, schema)
        meta = dict(connection.execute("SELECT key, value FROM catalog_meta"))
        if meta["schema_version"] != "2":
            raise ValueError("Catalogue metadata is not schema version 2")
        if not os.getenv("CATALOG_FILE") and meta["data_version"] != pin["data_version"]:
            raise ValueError("Catalogue data version does not match catalog.json")
        table_names = list(schema["properties"]["tables"]["properties"])
        tables = {}
        for table in table_names:
            cursor = connection.execute(f'SELECT * FROM "{table}"')
            columns = [column[0] for column in cursor.description]
            tables[table] = [dict(zip(columns, row)) for row in cursor]

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("wb") as destination:
        with gzip.GzipFile(filename="", mode="wb", fileobj=destination, mtime=0) as compressed:
            compressed.write(json.dumps({
                "data_version": meta["data_version"],
                "schema_version": meta["schema_version"],
                "tables": tables,
            }, ensure_ascii=False, allow_nan=False, separators=(",", ":")).encode("utf-8"))
    print(f"Validated schema 2 and wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
