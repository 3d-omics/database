"""Build the static, on-demand portal search index from the pinned render."""

import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "src/assets/data"
OUTPUT = ROOT / "public/search-index.json"
PUBLIC_IDENTIFIERS = ROOT / "public/macrosample-identifiers.json"
PUBLIC_MICROSAMPLE_IDENTIFIERS = ROOT / "public/microsample-identifiers.json"


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


def macrosample_identifiers(macrosamples: list[dict]) -> dict[str, dict[str, list[str]]]:
    """Map catalogue runs and material BioSamples to their sample IDs."""
    snapshot = json.loads((ROOT / "public/ena-run-metadata.json").read_text())
    runs = snapshot["runs"]
    material_samples = json.loads((ROOT / "public/biosample-metadata.json").read_text())["samples"]
    result = {}
    for row in macrosamples:
        fields = row["fields"]
        linked = [runs[run] for run in fields.get("ENA accession", []) if run in runs]
        biosamples = sorted({item["sample_accession"] for item in linked if item.get("sample_accession")})
        material = fields.get("BioSamples accession")
        material_insdc = material_samples.get(material, {}).get("insdc_sample_accessions", [])
        sequencing_insdc = sorted({item["secondary_sample_accession"] for item in linked if item.get("secondary_sample_accession")})
        insdc = sorted(set(sequencing_insdc) | set(material_insdc))
        if biosamples or insdc:
            result[fields["ID"]] = {
                "biosamples": biosamples,
                "insdc": insdc,
                "material_insdc": material_insdc,
                "sequencing_insdc": sequencing_insdc,
            }
    return result


def microsample_identifiers(microsamples: list[dict]) -> dict[str, dict[str, list[str]]]:
    runs = json.loads((ROOT / "public/ena-run-metadata.json").read_text())["runs"]
    result = {}
    for row in microsamples:
        fields = row["fields"]
        linked = [runs[run] for run in fields.get("ENA accession", []) if run in runs]
        biosamples = sorted({item["sample_accession"] for item in linked if item.get("sample_accession")})
        insdc = sorted({item["secondary_sample_accession"] for item in linked if item.get("secondary_sample_accession")})
        if biosamples or insdc:
            result[fields["Code"]] = {"biosamples": biosamples, "insdc": insdc}
    return result


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

    macrosamples = records("intestinalsectionsample")
    sequencing_ids = macrosample_identifiers(macrosamples)
    for row in macrosamples:
        fields = row["fields"]
        identifier = fields["ID"]
        add(entries, "Macrosample", identifier, path("macrosamples", identifier),
            f"Trial {identifier[:1]} · {value(fields.get('Sample type'))}",
            " ".join(value(fields.get(name)) for name in
                     ("Individual", "Description", "Data type", "ENA accession",
                      "BioSamples accession")) + " " + " ".join(
                          value(sequencing_ids.get(identifier, {}).get(key, []))
                          for key in ("biosamples", "insdc")
                      ))

    for row in records("cryosection"):
        fields = row["fields"]
        identifier = fields["ID"]
        add(entries, "Cryosection", identifier, path("cryosections", identifier),
            f"Macrosample {value(fields.get('Macrosample'))}",
            value(fields.get("Slide_flat")))

    microsamples = records("microsample")
    microsample_ids = microsample_identifiers(microsamples)
    for row in microsamples:
        fields = row["fields"]
        identifier = fields["Code"]
        add(entries, "Microsample", identifier, path("microsamples", identifier),
            f"Cryosection {value(fields.get('Cryosection_flat'))}",
            " ".join(value(fields.get(name)) for name in
                     ("ENA accession", "LMBatch_flat", "CollectionMethod")) + " " +
            value(microsample_ids.get(identifier, {}).get("biosamples", [])) + " " +
            value(microsample_ids.get(identifier, {}).get("insdc", [])))

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
    pin = json.loads((ROOT / "catalog.json").read_text())
    version = pin["data_version"]
    entries = build()
    macrosamples = records("intestinalsectionsample")
    sequencing_ids = macrosample_identifiers(macrosamples)
    ena_snapshot = json.loads((ROOT / "public/ena-run-metadata.json").read_text())
    biosample_snapshot = json.loads((ROOT / "public/biosample-metadata.json").read_text())
    public_identifiers = {
        "data_version": version,
        "catalog_sha256": pin["sha256"],
        "ena_retrieved_at": ena_snapshot["retrieved_at"],
        "biosamples_retrieved_at": biosample_snapshot["retrieved_at"],
        "macrosamples": {
            row["fields"]["ID"]: {
                "material_biosample_accession": row["fields"].get("BioSamples accession"),
                "sequencing_biosample_accessions": sequencing_ids.get(row["fields"]["ID"], {}).get("biosamples", []),
                "material_insdc_sample_accessions": sequencing_ids.get(row["fields"]["ID"], {}).get("material_insdc", []),
                "sequencing_insdc_sample_accessions": sequencing_ids.get(row["fields"]["ID"], {}).get("sequencing_insdc", []),
            }
            for row in macrosamples
        },
    }
    identifiers_temporary = PUBLIC_IDENTIFIERS.with_suffix(".json.tmp")
    identifiers_temporary.write_text(json.dumps(public_identifiers, ensure_ascii=False, separators=(",", ":")))
    identifiers_temporary.replace(PUBLIC_IDENTIFIERS)
    microsamples = records("microsample")
    microsample_ids = microsample_identifiers(microsamples)
    public_microsample_identifiers = {
        "data_version": version,
        "catalog_sha256": pin["sha256"],
        "ena_retrieved_at": ena_snapshot["retrieved_at"],
        "microsamples": {
            row["fields"]["Code"]: {
                "sequencing_biosample_accessions": microsample_ids.get(row["fields"]["Code"], {}).get("biosamples", []),
                "sequencing_insdc_sample_accessions": microsample_ids.get(row["fields"]["Code"], {}).get("insdc", []),
            }
            for row in microsamples
        },
    }
    public_microsample_temporary = PUBLIC_MICROSAMPLE_IDENTIFIERS.with_suffix(".json.tmp")
    public_microsample_temporary.write_text(json.dumps(public_microsample_identifiers, ensure_ascii=False, separators=(",", ":")))
    public_microsample_temporary.replace(PUBLIC_MICROSAMPLE_IDENTIFIERS)
    temporary = OUTPUT.with_suffix(".json.tmp")
    temporary.write_text(json.dumps({"dataVersion": version, "entries": entries},
                                    ensure_ascii=False, separators=(",", ":")))
    temporary.replace(OUTPUT)
    print(f"Built {OUTPUT.relative_to(ROOT)} with {len(entries):,} entries")
