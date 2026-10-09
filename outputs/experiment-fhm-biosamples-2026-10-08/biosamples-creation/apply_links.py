"""Apply reviewed F/H/M BioSamples plans, allowing expected reverse links.

Run with PYTHONPATH pointing at the local arch3d source. Credentials are read
from the user's private Webin password file and are never written here.
"""

import argparse
import copy
import json
from hashlib import sha256
from pathlib import Path

import requests

from arch3d.biosample import (
    SAMPLES,
    STRUCTURED,
    RepairError,
    atomic_json,
    fetch,
    incoming_relationships,
    owned_edges,
    structured_content,
    validate_graph,
    writable,
)
from arch3d.utils import get_token


def assert_parent_unchanged(session, accession, original):
    """BioSamples adds reverse links to parents as children are updated."""
    live = fetch(session, accession)
    live_sample = writable(live["sample"])
    original_sample = writable(original["sample"])
    # A reverse link makes the API return relationships: []; the original
    # parent had no relationships key at all. These mean the same owned edges.
    if not live_sample.get("relationships"):
        live_sample.pop("relationships", None)
    if not original_sample.get("relationships"):
        original_sample.pop("relationships", None)
    if (live_sample != original_sample
            or normalized_structured(live["structured"]) != normalized_structured(original["structured"])):
        raise RepairError(f"Parent {accession} changed beyond incoming links")


def normalized_structured(response):
    """The API reorders content metrics when it stores structured data."""
    data = structured_content(response)
    if data is None:
        return None
    result = copy.deepcopy(data)
    for item in result:
        item["content"] = sorted(item.get("content", []), key=lambda value: json.dumps(value, sort_keys=True))
    return sorted(result, key=lambda value: json.dumps(value, sort_keys=True))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("trial", choices=("f", "f_de", "h", "m"))
    parser.add_argument("plan_sha256")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent / args.trial
    plan_path = root / "plan" / "plan.json"
    data = plan_path.read_bytes()
    if sha256(data).hexdigest() != args.plan_sha256:
        raise RepairError("Reviewed plan hash mismatch")
    plan = json.loads(data)
    if plan.get("format") != "arch3d-biosample-repair-v1":
        raise RepairError("Unexpected plan format")
    entries = plan["entries"]
    dependencies = plan["dependencies"]
    proposals = {entry["accession"]: {"parents": owned_edges(entry["after"]["sample"], entry["accession"])}
                 for entry in entries}
    graph = {entry["accession"]: entry["before"] for entry in entries}
    graph.update(dependencies)
    validate_graph(graph, proposals)
    if any(set(entry["changes"]) != {"relationships"} or not entry["structured_change"] for entry in entries):
        raise RepairError("Plan has a change other than relationships and structured details")
    if any(len(proposals[entry["accession"]]["parents"]) != 1 for entry in entries):
        raise RepairError("Every child must have exactly one parent")

    session = requests.Session()
    for accession, original in dependencies.items():
        assert_parent_unchanged(session, accession, original)
    output = root / "applied"
    journal_path = output / "apply-journal.json"
    journal = json.loads(journal_path.read_text()) if journal_path.exists() else {"plan_sha256": args.plan_sha256, "done": []}
    if journal["plan_sha256"] != args.plan_sha256:
        raise RepairError("Journal belongs to a different plan")
    done = set(journal["done"])
    if done - {entry["accession"] for entry in entries}:
        raise RepairError("Journal has unknown accessions")

    token = None
    for entry in entries:
        accession = entry["accession"]
        parent = proposals[accession]["parents"][0]
        assert_parent_unchanged(session, parent, dependencies[parent])
        live = fetch(session, accession)
        before = entry["before"]
        after = entry["after"]
        live_sample = writable(live["sample"])
        before_sample = writable(before["sample"])
        after_sample = after["sample"]
        live_struct = normalized_structured(live["structured"])
        before_struct = normalized_structured(before["structured"])
        after_struct = normalized_structured(after["structured"])
        if live_sample not in (before_sample, after_sample) or live_struct not in (before_struct, after_struct):
            raise RepairError(f"Unexpected child state for {accession}")
        if incoming_relationships(live["sample"], accession) != incoming_relationships(before["sample"], accession):
            raise RepairError(f"Unexpected incoming relationship for {accession}")
        if accession in done and (live_sample != after_sample or live_struct != after_struct):
            raise RepairError(f"Journalled child {accession} drifted")
        if live_sample == before_sample and live_struct == before_struct:
            atomic_json(output / "backups" / f"{accession}.json", live)
        if live_sample != after_sample or live_struct != after_struct:
            if token is None:
                password = (Path.home() / ".config/arch3d/webin-password").read_text().strip()
                token = get_token("Webin-69627", password, session=session)
            headers = {"Authorization": f"Bearer {token}", "Accept": "application/json", "Content-Type": "application/json"}
            if live_sample != after_sample:
                response = session.put(f"{SAMPLES}/{accession}", headers=headers, json=after_sample, timeout=30)
                response.raise_for_status()
                live = fetch(session, accession)
                if writable(live["sample"]) != after_sample:
                    raise RepairError(f"Sample PUT verification failed for {accession}")
            if normalized_structured(live["structured"]) != after_struct:
                assert_parent_unchanged(session, parent, dependencies[parent])
                response = session.put(f"{STRUCTURED}/{accession}", headers=headers, json=after["structured"], timeout=30)
                response.raise_for_status()
                live = fetch(session, accession)
                if (writable(live["sample"]) != after_sample
                        or normalized_structured(live["structured"]) != after_struct):
                    raise RepairError(f"Structured PUT verification failed for {accession}")
        if accession not in done:
            journal["done"].append(accession)
            atomic_json(journal_path, journal)
            done.add(accession)
            print(f"{args.trial.upper()} {len(done)}/{len(entries)} {accession}", flush=True)
    print(f"{args.trial.upper()} complete: {len(done)} linked and structured", flush=True)


if __name__ == "__main__":
    main()
