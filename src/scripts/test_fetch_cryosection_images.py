"""Offline checks for the versioned Zenodo image staging step."""

from __future__ import annotations

import hashlib
import json
import sqlite3
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path


SCRIPT = Path(__file__).with_name("fetch-cryosection-images.py")
PNG = b"\x89PNG\r\n\x1a\n" + b"image fixture"


class ImageFetchTests(unittest.TestCase):
    def test_pinned_archive_is_checked_against_catalogue_and_staged(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            catalogue = root / "catalogue.sqlite"
            with sqlite3.connect(catalogue) as connection:
                connection.execute("CREATE TABLE cryosections (cryosection_id TEXT, has_image INTEGER)")
                connection.execute("INSERT INTO cryosections VALUES ('G001aI101A', 1)")
                connection.execute(
                    "CREATE VIEW cryosections_with_image AS "
                    "SELECT * FROM cryosections WHERE has_image = 1"
                )
            image = "images/G001aI101A.png"
            archive = root / "images.zip"
            record = {
                "data_version": "2026.10.10",
                "images": {"G001aI101A": {
                    "file": image, "sha256": hashlib.sha256(PNG).hexdigest(),
                    "size_bytes": len(PNG),
                }},
            }
            with zipfile.ZipFile(archive, "w") as output:
                output.writestr("manifest.json", json.dumps(record))
                output.writestr(image, PNG)
            pin = root / "catalog.json"
            pin.write_text(json.dumps({
                "data_version": "2026.10.10",
                "source": "https://zenodo.org/api/records/123/files/3domics-2026.10.10.sqlite/content",
                "cryosection_images": {
                    "url": "https://zenodo.org/api/records/123/files/3domics-2026.10.10-cryosection-images.zip/content",
                    "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
                },
            }))
            command = [
                sys.executable, str(SCRIPT), "--catalog-json", str(pin),
                "--catalogue", str(catalogue), "--archive-file", str(archive),
                "--output", str(root / "site-images"),
                "--manifest-output", str(root / "image-map.json"),
            ]
            result = subprocess.run(command, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual((root / "site-images/G001aI101A.png").read_bytes(), PNG)
            self.assertEqual(json.loads((root / "image-map.json").read_text()),
                             {"G001aI101A": "G001aI101A.png"})

            record["images"] = {}
            with zipfile.ZipFile(archive, "w") as output:
                output.writestr("manifest.json", json.dumps(record))
            pin_data = json.loads(pin.read_text())
            pin_data["cryosection_images"]["sha256"] = hashlib.sha256(archive.read_bytes()).hexdigest()
            pin.write_text(json.dumps(pin_data))
            failed = subprocess.run(command, text=True, capture_output=True)
            self.assertNotEqual(failed.returncode, 0)
            self.assertIn("differ from catalogue cryosections", failed.stderr)


if __name__ == "__main__":
    unittest.main()
