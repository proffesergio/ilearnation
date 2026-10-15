"""Small offline signature check; supplement with maintained scanning before release."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PATTERN = re.compile(
    r"gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}"
    r"|sk-[A-Za-z0-9_-]{40,}|AKIA[A-Z0-9]{16}"
    r"|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"
)
EXTENSIONS = {".ts", ".tsx", ".mjs", ".json", ".md", ".yml", ".yaml", ".py", ".svg"}
SKIP = {"node_modules", ".git", ".next", ".course-export", "test-results", "artifacts"}
failures = []
for path in ROOT.rglob("*"):
    relative = path.relative_to(ROOT)
    if any(part in SKIP for part in relative.parts) or not path.is_file():
        continue
    if path.suffix in EXTENSIONS and path.stat().st_size <= 2_000_000:
        if PATTERN.search(path.read_text(encoding="utf-8")):
            failures.append(str(relative))
for filename in failures:
    print(f"FAIL: possible credential signature in {filename} (value withheld)")
if not failures:
    print("PASS: no known credential signatures in bounded source/documentation files")
print("Scope: heuristic signatures only; not a complete secret or personal-data audit.")
raise SystemExit(bool(failures))
