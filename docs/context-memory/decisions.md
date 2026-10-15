# Decision log

Use stable IDs, dates, status, rationale, and evidence. Record owner decisions
explicitly; do not treat silence as approval. Add an ADR for consequential choices.

## D-001 — Preserve the inspected workspace

2026-10-16 · current · owner: engineering.
The initial workspace contains AGENTS.md, the continuity prompt, and four PDFs.
No Git metadata, application, package manifests, tests, CI, README, TODO, or memory
existed. Preserve the supplied files; establish a documentation baseline only.
Evidence: README.md, CHANGELOG.md, graph.json.

## D-002 — Keep reference files local

2026-10-16 · current · owner: engineering.
File presence does not establish redistribution rights. Ignore PDFs; inventory
filenames without extracting text or inventing authors, licenses, or URLs. Owner
verification is required before reuse. Evidence: refBooks/references.json
(repository-relative).

## D-003 — Defer application and UX choices

Local implementation approval is superseded by D-008; unresolved launch decisions remain open.

2026-10-16 · proposed · owner: project owner.
Prove one course loop before social features. The monorepo boundaries come from
AGENTS.md; framework versions, package manager, execution isolation, persistence,
pages, visual design, privacy, and licenses are not selected. Plan approval is
required before application implementation. Evidence: plan.md, TODO.md, UX record.

## D-004 — Use deterministic local checks for bootstrap

2026-10-16 · current · owner: engineering.
Use standard-library Python for documentation/graph/reference checks; no package
downloads or network calls. The CI file is inert locally, with read-only permissions
and no deployment. Application checks are deferred, not claimed as passing.
Evidence: scripts/check_repository.py, .github/workflows/repository-checks.yml.

## D-005 — Observe tools without changing accounts or model

2026-10-16 · current · owner: engineering.
Read only whitelisted model/configuration fields and exposed tool metadata. The
configured gpt-6.1-sol appears in the local cached catalog; no account-level model
availability or current price was queried. The inherited root cannot be switched
through the available delegation controls. No workers were needed for this small,
dependent bootstrap. No integrations were invoked. Evidence: project-state.yaml,
../architecture/integrations.md. No OpenAI product or framework research was needed.

## D-006 — First cohort: mixed self-directed learners

2026-10-16 · approved · owner: project owner.
The owner explicitly selected mixed self-directed learners. State prerequisites
and offer a way to check prior knowledge; do not assume a CSE degree. No inference
about age, locale, privacy, or the first ten-minute outcome follows from this answer.
Evidence: docs/product/ux-decisions.md, graph.json.

## D-007 — GitHub-first course orientation

Historical naming/repository observations below are superseded by D-008. The approved orientation outcome remains current.

2026-10-16 · approved · owner: project owner.
The first ten minutes begin with reading a getting-started Markdown file in a
GitHub repository named after the course (or a shorter suggested name). This
replaces the proposed first-ten-minute coding outcome; runnable learning remains
a subsequent requirement. Evidence: docs/product/ux-decisions.md, plan.md.

Engineering defaults: use `getting-started.md` and draft it within the existing
course boundary. Suggest `modern-fullstack-react` as the remote slug, retaining
the full React/Next.js title in its README. The slug is proposed, not approved.
No Git repository, owner, remote, or visibility has been selected or created.
Record a topology/source-of-truth ADR before remote setup; keep the platform
monorepo contract intact. Evidence: courses/full-stack-modern-react-nextjs/README.md.


## D-008 — Start the local app and dedicated course payload

2026-10-16 · approved · owner: project owner.
The owner instructed app/course development, selected
`proffesergio/modern-fullstack-react-projects-building`, requested GitHub lesson
reads and a CMS-style admin, and authorized Mapbox MCP use. Preserve the existing
platform origin `proffesergio/ilearnation`; its branch is master with no commits.
Working GitHub access, remote visibility, licenses, and Mapbox tools remain unresolved.
Evidence: plan.md, docs/adr/0001-course-source-and-admin-boundaries.md.

## D-009 — Calm studio with energetic community accents

2026-10-16 · approved · owner: project owner.
Use a quiet reading surface, warm accent, route motif, and restrained optional
motion. English/system fonts/responsive layouts are provisional local defaults,
not a finalized localization/device support policy. No competition is introduced.
Evidence: docs/product/ux-decisions.md, apps/web/src/app/globals.css.

## D-010 — Bounded first exercise and explicit device progress

2026-10-16 · current · owner: engineering.
The first JSX checkpoint parses only Welcome() returning a text-only h1, with no
JavaScript execution, imports, expressions, attributes, or network access from
submissions. Run sends code to the same-origin validator without storing/logging
source. Progress stores only explicit version-scoped metadata on the device with
save/restore/clear. Reading and browser state are not verified skill credentials.
Evidence: packages/course-runtime/index.mjs, tests/runtime.test.mjs, tests/e2e/learning.spec.ts.

## D-011 — Admin preview and Algorithm shadow boundary

2026-10-16 · current · owner: engineering.
Admin drafts stay in the tab and download as review proposals. Production preview
defaults to unavailable; no private data, publishing, privilege changes, or live
activation exists. Policy v1 has an off switch, explicit replay clock, bounded
non-sensitive event contract, deduplication, daily cap, canonical UTC-day decay,
owner, effective date, changelog, rollback metadata, and zero applied points.
Production governance/auth/audit and broader fairness/abuse evaluation remain gates.
Evidence: packages/algorithm/index.mjs, tests/algorithm.test.mjs, ADR 0001.

## D-012 — Finish GitHub and deploy through Vercel CLI

2026-10-16 · approved · owner: project owner.
The owner reports completing local GitHub authentication, requests only the GitHub
completion step plus durable handoff, and explicitly authorizes Vercel CLI
deployment. Further feature development waits for credentials/connections supplied
locally. This supersedes the earlier lack of deployment approval for this site;
do not ask for the same action again. No billing, security, domain, unrelated
service, or platform-origin change is authorized. Both API host DNS lookups fail
in the agent shell; account access is unverified, not established invalid.
No remote upload/commit or deployment URL was confirmed. Evidence:
docs/runbooks/github-vercel-resume.md, docs/architecture/integrations.md.

## D-013 — Manual course-only checkout beneath courses

2026-10-16 · proposed · owner: engineering.
In response to the owner asking how to initialize/push only the course, document
`courses/modern-fullstack-react-projects-building/` as an isolated publication
checkout. Exclude it from parent Git and Vercel; retain the current bundled draft
so platform builds/tests remain intact. No nested Git initialization or external
write was performed. After publication the dedicated remote remains authoritative
per ADR 0001; no automatic two-way synchronization. Verified the commands in an
isolated temporary fixture. Evidence: docs/runbooks/separate-course-repository.md.
