"""Validate the cross-row relationships declared by the export contract."""

from __future__ import annotations

import re
import sqlite3


def verify_relationships(connection: sqlite3.Connection, schema: dict) -> None:
    for relation in schema.get("x-relations", []):
        if not relation["enforced"]:
            continue
        names = [
            relation["from_table"], relation["from_column"],
            relation["to_table"], relation["to_column"],
        ]
        if not all(re.fullmatch(r"[a-z_]+", name) for name in names):
            raise ValueError(f"Invalid relation identifier in JSON Schema: {names}")
        child_table, child_column, parent_table, parent_column = names
        missing = connection.execute(
            f'SELECT child."{child_column}" FROM "{child_table}" child '
            f'LEFT JOIN "{parent_table}" parent '
            f'ON child."{child_column}" = parent."{parent_column}" '
            f'WHERE child."{child_column}" IS NOT NULL '
            f'AND parent."{parent_column}" IS NULL LIMIT 1'
        ).fetchone()
        if missing:
            raise ValueError(
                f"Unresolved relationship {child_table}.{child_column} -> "
                f"{parent_table}.{parent_column}: {missing[0]!r}"
            )
