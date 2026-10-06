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
BUILD_INFO = ROOT / "src" / "assets" / "data" / "catalogue-build.json"
SUPPORTED_VERSIONS = {"2", "3"}


def catalogue_structure(connection: sqlite3.Connection) -> dict[str, str]:
    return {
        name: statement
        for name, statement in connection.execute(
            "SELECT name, sql FROM sqlite_master "
            "WHERE type IN ('table', 'view', 'index') "
            "AND name NOT LIKE 'sqlite_%' AND sql IS NOT NULL"
        )
    }


def verify_structure(connection: sqlite3.Connection, schema: dict, sql: Path) -> None:
    expected = sqlite3.connect(":memory:")
    try:
        expected.executescript(sql.read_text())
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
                f"SQLite schema differs from {sql.name}: "
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
    local = os.getenv("CATALOG_FILE")
    catalogue = Path(local) if local else CATALOGUE
    if not local:
        with catalogue.open("rb") as source:
            digest = hashlib.file_digest(source, "sha256").hexdigest()
        if digest != pin["sha256"]:
            raise ValueError("Catalogue checksum does not match catalog.json")

    with sqlite3.connect(f"file:{catalogue}?mode=ro", uri=True) as connection:
        meta = dict(connection.execute("SELECT key, value FROM catalog_meta"))
        version = meta.get("schema_version")
        if version not in SUPPORTED_VERSIONS:
            raise ValueError(f"Unsupported catalogue schema version: {version}")
        if not local and (version != pin["schema_version"] or meta.get("data_version") != pin["data_version"]):
            raise ValueError("Catalogue versions do not match catalog.json")
        schema_file = ROOT / "public" / f"catalogue-v{version}.schema.json"
        sql_file = ROOT / "public" / f"catalogue-v{version}.sql"
        schema = json.loads(schema_file.read_text())
        if schema["properties"]["schema_version"]["const"] != version:
            raise ValueError("JSON Schema version does not match the catalogue")
        verify_structure(connection, schema, sql_file)
        verify_relationships(connection, schema)
        table_names = list(schema["properties"]["tables"]["properties"])
        tables = {}
        for table in table_names:
            cursor = connection.execute(f'SELECT * FROM "{table}"')
            columns = [column[0] for column in cursor.description]
            tables[table] = [dict(zip(columns, row)) for row in cursor]

    output = ROOT / "public" / f"catalogue-v{version}.json.gz"
    temporary = output.with_name(output.name + ".partial")
    output.parent.mkdir(parents=True, exist_ok=True)
    with temporary.open("wb") as destination:
        with gzip.GzipFile(filename="", mode="wb", fileobj=destination, mtime=0) as compressed:
            compressed.write(json.dumps({
                "data_version": meta["data_version"],
                "schema_version": meta["schema_version"],
                "tables": tables,
            }, ensure_ascii=False, allow_nan=False, separators=(",", ":")).encode("utf-8"))
    os.replace(temporary, output)
    build_info = {
        "data_version": meta["data_version"],
        "schema_version": version,
        "pinned": not bool(local),
        "version_doi": pin["version_doi"] if not local else None,
    }
    build_info_temp = BUILD_INFO.with_name(BUILD_INFO.name + ".partial")
    build_info_temp.write_text(json.dumps(build_info, indent=2) + "\n", encoding="utf-8")
    os.replace(build_info_temp, BUILD_INFO)
    for other_version in SUPPORTED_VERSIONS - {version}:
        (ROOT / "public" / f"catalogue-v{other_version}.json.gz").unlink(missing_ok=True)
    # Builder 0.1.0 still renders this retired export. Remove it before the
    # site build while the portal remains pinned to that public wheel.
    (ROOT / "public" / "experiment-hierarchy.json").unlink(missing_ok=True)
    print(f"Validated schema {version} and wrote {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
