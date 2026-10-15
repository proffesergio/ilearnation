"""Offline checks for the documentation baseline; not an application/security suite."""

import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent.parent
REQUIRED = [
    "AGENTS.md", "README.md", "CONTRIBUTING.md", "SECURITY.md",
    "CODE_OF_CONDUCT.md", "CHANGELOG.md", "plan.md", "TODO.md", ".gitignore",
    "docs/context-memory/project-state.yaml", "docs/context-memory/decisions.md",
    "docs/context-memory/graph.json", "docs/product/ux-decisions.md",
    "docs/architecture/integrations.md", "refBooks/references.json",
    ".github/workflows/repository-checks.yml",
]
STATES = {"current", "proposed", "deprecated", "blocked", "approved", "needs-user-decision"}


def check():
    errors = []
    for name in REQUIRED:
        if not (ROOT / name).is_file():
            errors.append(f"Missing required file: {name}")

    for path in ROOT.rglob("*.md"):
        if any(part.startswith(".") or part == "node_modules" for part in path.relative_to(ROOT).parts):
            continue
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
            parsed = urlsplit(target)
            if not parsed.scheme and parsed.path:
                if not (path.parent / unquote(parsed.path)).exists():
                    errors.append(f"Broken local link in {path.relative_to(ROOT)}: {target}")

    try:
        graph = json.loads((ROOT / "docs/context-memory/graph.json").read_text())
        assert graph["schema_version"] == 1, "Unsupported graph schema"
        entities = graph["entities"]
        ids = {entity["id"] for entity in entities}
        assert len(ids) == len(entities), "Duplicate entity IDs"
        for record in entities + graph["open_questions"]:
            assert record["state"] in STATES, "Unknown entity/question state"
            assert record["evidence"], "Missing evidence"
            for evidence in record["evidence"]:
                assert (ROOT / evidence).is_file(), f"Missing evidence file: {evidence}"
        for edge in graph["relationships"]:
            assert edge["from"] in ids and edge["to"] in ids, "Dangling graph relationship"
            assert edge["type"] in graph["supported_relationship_types"], "Unknown relationship"
        assert len(graph["open_questions"]) <= 1, "Ask only one active product question"
        for question in graph["open_questions"]:
            assert all(question[key] for key in ("question", "why", "options", "owner")), "Incomplete question"
            assert question["recommended_default"] in question["options"], "Invalid default"
    except (OSError, ValueError, KeyError, TypeError, AssertionError) as error:
        errors.append(f"Memory graph invalid: {error}")

    try:
        inventory = json.loads((ROOT / "refBooks/references.json").read_text())
        assert inventory["schema_version"] == 1, "Unsupported reference schema"
        ids = set()
        for reference in inventory["references"]:
            assert reference["id"] not in ids, "Duplicate reference ID"
            ids.add(reference["id"])
            assert Path(reference["filename"]).name == reference["filename"], "Invalid filename"
            for key in ("title", "author", "url", "license_status", "accessed_on", "supported_chapters", "use_status"):
                assert key in reference, f"Missing reference field: {key}"
            if reference["license_status"] == "unverified":
                assert reference["use_status"] == "not-used", "Unverified reference marked used"
                assert not reference["supported_chapters"], "Unverified reference supports a chapter"
        assert "*.pdf" in (ROOT / ".gitignore").read_text().splitlines(), "PDF exclusion missing"
    except (OSError, ValueError, KeyError, TypeError, AssertionError) as error:
        errors.append(f"Reference inventory invalid: {error}")

    for error in errors:
        print(f"FAIL: {error}")
    if not errors:
        print("PASS: required files, local Markdown links, memory graph, reference metadata, PDF exclusion")
    print("Scope: offline baseline only; no framework, YAML-schema, external-link, security, or accessibility validation.")
    return bool(errors)


if __name__ == "__main__":
    raise SystemExit(check())
