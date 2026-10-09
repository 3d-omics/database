#!/usr/bin/env python3
"""Stage the pinned Zenodo cryosection images for the static site build."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sqlite3
import tempfile
import urllib.request
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def digest(path: Path) -> str:
    with path.open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


def fetch_archive(url: str, expected_sha256: str, cache: Path) -> Path:
    if not re.fullmatch(r"[0-9a-f]{64}", expected_sha256):
        raise ValueError("cryosection_images.sha256 must be a SHA-256 hex digest")
    cache.parent.mkdir(parents=True, exist_ok=True)
    if cache.is_file() and digest(cache) == expected_sha256:
        return cache
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "3domics-database/image-fetch (+https://github.com/3d-omics/database)"},
    )
    partial = cache.with_suffix(cache.suffix + ".partial")
    try:
        with urllib.request.urlopen(request, timeout=120) as source, partial.open("wb") as target:
            shutil.copyfileobj(source, target)
        if digest(partial) != expected_sha256:
            raise ValueError("Zenodo cryosection image archive SHA-256 mismatch")
        partial.replace(cache)
    finally:
        partial.unlink(missing_ok=True)
    return cache


def catalogue_ids(path: Path) -> tuple[set[str], set[str]]:
    with sqlite3.connect(f"file:{path}?mode=ro", uri=True) as connection:
        all_ids = {row[0] for row in connection.execute("SELECT cryosection_id FROM cryosections")}
        shown_ids = {
            row[0] for row in connection.execute("SELECT cryosection_id FROM cryosections_with_image")
        }
    return all_ids, shown_ids


def image_bytes(payload: bytes, suffix: str) -> bool:
    return (
        (suffix in {".jpg", ".jpeg"} and payload.startswith(b"\xff\xd8"))
        or (suffix == ".png" and payload.startswith(b"\x89PNG\r\n\x1a\n"))
        or (suffix == ".webp" and payload[:4] == b"RIFF" and payload[8:12] == b"WEBP")
    )


def stage_archive(archive_path: Path, version: str, expected_ids: set[str], destination: Path) -> dict[str, str]:
    manifest: dict[str, str] = {}
    with zipfile.ZipFile(archive_path) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)) or "manifest.json" not in names:
            raise ValueError("Image archive has duplicate entries or no manifest")
        record = json.loads(archive.read("manifest.json"))
        if record.get("data_version") != version:
            raise ValueError("Image archive data version differs from catalog.json")
        images = record.get("images")
        if not isinstance(images, dict) or set(images) != expected_ids:
            raise ValueError("Image archive IDs differ from catalogue cryosections")
        expected_names = {"manifest.json"}
        for cryosection_id, entry in sorted(images.items()):
            if not re.fullmatch(r"[A-Za-z0-9_-]+", cryosection_id):
                raise ValueError(f"Unsafe cryosection ID: {cryosection_id!r}")
            name = entry.get("file") if isinstance(entry, dict) else None
            if not isinstance(name, str):
                raise ValueError(f"Missing archive filename for {cryosection_id}")
            suffix = Path(name).suffix.lower()
            if suffix not in EXTENSIONS or name != f"images/{cryosection_id}{suffix}":
                raise ValueError(f"Unexpected archive filename for {cryosection_id}: {name}")
            expected_names.add(name)
            info = archive.getinfo(name)
            if info.file_size > 50_000_000:
                raise ValueError(f"Image exceeds 50 MB: {name}")
            payload = archive.read(name)
            if (len(payload) != entry.get("size_bytes")
                    or hashlib.sha256(payload).hexdigest() != entry.get("sha256")
                    or not image_bytes(payload, suffix)):
                raise ValueError(f"Image checksum, size, or format mismatch: {name}")
            filename = Path(name).name
            (destination / filename).write_bytes(payload)
            manifest[cryosection_id] = filename
        if set(names) != expected_names:
            raise ValueError("Image archive contains unexpected files")
    return manifest


def stage_legacy(source: Path, destination: Path) -> dict[str, str]:
    files = sorted(source.glob("*.jpg"))
    if not files:
        raise ValueError(f"No legacy cryosection JPGs found in {source}")
    for path in files:
        shutil.copyfile(path, destination / path.name)
    return {path.stem: path.name for path in files}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--catalog-json", type=Path, default=ROOT / "catalog.json")
    parser.add_argument("--catalogue", type=Path, default=ROOT / ".catalog/3domics.sqlite")
    parser.add_argument("--archive-file", type=Path, help="Local archive for offline verification")
    parser.add_argument("--output", type=Path, default=ROOT / "public/cryosection-images")
    parser.add_argument("--manifest-output", type=Path, default=ROOT / "src/assets/data/cryosection-image-manifest.json")
    parser.add_argument("--legacy-dir", type=Path, default=ROOT / "src/assets/images/cryosection_images")
    args = parser.parse_args()
    pin = json.loads(args.catalog_json.read_text())
    image_pin = pin.get("cryosection_images")
    expected_ids, shown_ids = catalogue_ids(args.catalogue)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=args.output.parent) as temp:
        staged = Path(temp) / "images"
        staged.mkdir()
        if image_pin is None:
            mapping = stage_legacy(args.legacy_dir, staged)
            missing = shown_ids - mapping.keys()
            if missing:
                print(f"Legacy image set misses {len(missing)} image-enabled sections: {', '.join(sorted(missing))}")
        else:
            if not isinstance(image_pin, dict) or not image_pin.get("url") or not image_pin.get("sha256"):
                raise ValueError("cryosection_images needs a Zenodo URL and SHA-256")
            catalogue_record = re.search(r"/api/records/(\d+)/files/", pin.get("source", ""))
            image_record = re.search(r"/api/records/(\d+)/files/", image_pin["url"])
            if not catalogue_record or not image_record:
                raise ValueError("Catalogue and image archive need version-specific Zenodo file URLs")
            if image_record.group(1) != catalogue_record.group(1):
                raise ValueError("Image archive and catalogue must use the same Zenodo record version")
            archive = args.archive_file or fetch_archive(
                image_pin["url"], image_pin["sha256"],
                ROOT / ".catalog/cryosection-images.zip",
            )
            if digest(archive) != image_pin["sha256"]:
                raise ValueError("Cryosection image archive SHA-256 mismatch")
            mapping = stage_archive(archive, pin["data_version"], expected_ids, staged)
        if args.output.exists():
            shutil.rmtree(args.output)
        shutil.move(str(staged), args.output)
    args.manifest_output.parent.mkdir(parents=True, exist_ok=True)
    args.manifest_output.write_text(json.dumps(mapping, indent=2, sort_keys=True) + "\n")
    print(f"Staged {len(mapping)} cryosection images in {args.output}")


if __name__ == "__main__":
    main()
