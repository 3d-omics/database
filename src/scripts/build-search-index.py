"""Build the static, on-demand portal search index from the pinned render."""

import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "src/assets/data"
OUTPUT = ROOT / "public/search-index.json"


def records(name: str) -> list[dict]:
    return json.loads((DATA / "airtable" / f"{name}.json").read_text())


def value(field: object) -> str:
    if isinstance(field, list):
        return " ".join(value(item) for item in field)
    return str(field) if field is not None else ""


def add(entries: list[dict], category: str, title: str, url: str,
        subtitle: str = "", keywords: str = "") -> None:
    if title:
        entries.append({
            "category": category,
            "title": title,
            "url": url,
            "subtitle": subtitle,
            "keywords": keywords,
        })


def path(prefix: str, identifier: str) -> str:
    return f"/{prefix}/{quote(identifier, safe='')}"


def build() -> list[dict]:
    entries: list[dict] = []
    trials = records("animaltrialexperiment")
    trial_names = {row["fields"]["ID"]: row["fields"]["Name"] for row in trials}

    pages = [
        ("Animal Trials", "/animal-trials", "Experiments"),
        ("Animal Specimens", "/animal-specimens", "Individuals"),
        ("Macrosamples", "/macrosamples", "Intestinal samples"),
        ("Cryosections", "/cryosections", "Intestinal cross-sections"),
        ("Microsamples", "/microsamples", "Laser-microdissected samples"),
        ("MAG Catalogues", "/mag-catalogues", "Metagenome-assembled genomes"),
        ("Metagenomics", "/macrosample-compositions", "Community composition"),
        ("Metabolomics", "/metabolomics", "Metabolite analyses"),
        ("Data model", "/database-schema", "Catalogue schema and download"),
        ("MAG Catalogue methods", "/methods/mag-catalogue", "Methods"),
        ("Macro Metagenomics methods", "/methods/macro-metagenomics", "Methods"),
        ("Micro Metagenomics methods", "/methods/micro-metagenomics", "Methods"),
        ("Metabolomics methods", "/methods/metabolomics", "Methods"),
    ]
    for title, url, subtitle in pages:
        add(entries, "Page", title, url, subtitle)

    for row in trials:
        fields = row["fields"]
        add(entries, "Animal trial", fields["Name"], path("animal-trials", fields["Name"]),
            f"Trial {fields['ID']} · {value(fields.get('Type'))}",
            " ".join(value(fields.get(name)) for name in
                     ("ID", "Bioproject accession", "Trial description")))

    for row in records("animalspecimen"):
        fields = row["fields"]
        identifier = fields["ID"]
        add(entries, "Animal specimen", identifier, path("animal-specimens", identifier),
            f"Trial {value(fields.get('Experiment_flat'))} · {value(fields.get('species_common'))}",
            " ".join(value(fields.get(name)) for name in
                     ("Biosample accession", "Treatment_flat", "TreatmentName", "Sex")))

    for row in records("intestinalsectionsample"):
        fields = row["fields"]
        identifier = fields["ID"]
        add(entries, "Macrosample", identifier, path("macrosamples", identifier),
            f"Trial {identifier[:1]} · {value(fields.get('Sample type'))}",
            " ".join(value(fields.get(name)) for name in
                     ("Individual", "Description", "Data type", "ENA accession")))

    for row in records("cryosection"):
        fields = row["fields"]
        identifier = fields["ID"]
        add(entries, "Cryosection", identifier, path("cryosections", identifier),
            f"Macrosample {value(fields.get('Macrosample'))}",
            value(fields.get("Slide_flat")))

    for row in records("microsample"):
        fields = row["fields"]
        identifier = fields["Code"]
        add(entries, "Microsample", identifier, path("microsamples", identifier),
            f"Cryosection {value(fields.get('Cryosection_flat'))}",
            " ".join(value(fields.get(name)) for name in
                     ("ENA accession", "LMBatch_flat", "CollectionMethod")))

    for file in sorted((DATA / "genome_metadata_json").glob("experiment_*_metadata.json")):
        trial_id = file.stem.split("_")[1]
        trial_name = trial_names.get(trial_id)
        if not trial_name:
            raise ValueError(f"No trial for genome metadata: {file.name}")
        metadata = json.loads(file.read_text())
        for index, genome in enumerate(metadata["genome"]):
            taxonomy = [value(metadata.get(name, [""] * len(metadata["genome"]))[index])
                        .split("__", 1)[-1] for name in
                        ("domain", "phylum", "class", "order", "family", "genus", "species")]
            add(entries, "MAG", genome,
                f"{path('mag-catalogues', trial_name)}/{quote(genome, safe='')}",
                f"Trial {trial_id} · {taxonomy[-1] or taxonomy[-2]}",
                " ".join(taxonomy))

    return entries


if __name__ == "__main__":
    version = json.loads((ROOT / "catalog.json").read_text())["data_version"]
    entries = build()
    temporary = OUTPUT.with_suffix(".json.tmp")
    temporary.write_text(json.dumps({"dataVersion": version, "entries": entries},
                                    ensure_ascii=False, separators=(",", ":")))
    temporary.replace(OUTPUT)
    print(f"Built {OUTPUT.relative_to(ROOT)} with {len(entries):,} entries")
