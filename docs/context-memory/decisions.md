# Decision log

## Deploy now with invitations and the shorter Vercel name

2026-10-16 · explicitly approved by the owner: push/deploy all current work,
configure Vercel production with Neon now, and add Google credentials manually
later. Renamed the existing project to `ilearnation` and selected
`https://ilearnation.vercel.app` as its canonical/auth origin. Six production
variables are configured through CLI; Neon and a separate generated production
session secret are stored as Vercel Secrets. Google remains optional and absent.
The preflight retains core auth/Neon/schema checks while permitting invitations.
This instruction supersedes earlier notes that Google credentials block this
deployment. Public launch policy work remains documented; no social features,
real-location display, or paid functionality is introduced.

## Recovery — authorized Neon creation and Google manual setup

2026-10-16 · owner authorized creating a Neon project through the existing CLI
and saving its credentials in the local environment. Created `ilearnnation`
(`fragrant-resonance-47092618`), `main` branch, `ilearnnation` database, in
`aws-ap-southeast-1` under the existing free organization, with 0.25 CU.
Initialized the schema and switched the ignored web environment to Neon. Hosted
data/sync and a local browser account flow passed; synthetic accounts were deleted.
Existing local learner records were not migrated and no admin role was created.

The owner then authorized attempting Google CLI setup or providing manual
instructions, and checking Vercel through its CLI. `gcloud` is not installed;
the manual web-client guide records exact callbacks and variables. Existing Vercel
deployment is Ready/HTTP 200 and production env is empty. No new application
deployment occurred. Evidence: docs/runbooks/google-oauth-setup.md,
docs/runbooks/sql-auth-setup.md, docs/context-memory/last-handoff.md.

## Beta privacy and manual deployment gate

2026-10-16 · approved privacy choice · owner: project owner.
Profiles and progress remain private. Admins may view lesson reads and checkpoint
outcomes for learner support. No raw submission or keystroke tracking is added.
The CI deployment path requires an explicit manual dispatch on main after checks;
production environment reviewers/secrets remain unconfigured and unverified.
The read-only preflight requires Google and all Neon account schema columns.
Evidence: docs/product/ux-decisions.md, .github/workflows/repository-checks.yml,
scripts/check-production.mjs.

## D-NEW — Local SQL/auth/course phase

2026-10-16 · approved for local implementation · owner: project owner.
Draft 0.2.0 has 20 lessons; retain the eight old IDs and snapshot 0.1.0. Use
Auth.js open Google sign-up when configured, or single-use hashed invitations;
profile setup gates lessons. Use Neon as the hosted SQL target and explicit
durable Node 24 SQLite locally, with operator-run one-way outbox sync. Admin
access uses SQL role checks and immutable policy history; replay applies zero
points. Initial profiles/progress are private. English comes first, with phone,
desktop, and low-bandwidth support. ADR 0002 is the architecture record; the
first deployed baseline remains 563aedb, and this phase is not deployed.
Evidence: docs/adr/0002-sql-auth-and-sync.md, docs/product/ux-decisions.md,
docs/context-memory/project-state.yaml.

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

Superseded by D-014: no additional publication checkout is needed.

2026-10-16 · proposed · owner: engineering.
In response to the owner asking how to initialize/push only the course, document
`courses/modern-fullstack-react-projects-building/` as an isolated publication
checkout. Exclude it from parent Git and Vercel; retain the current bundled draft
so platform builds/tests remain intact. No nested Git initialization or external
write was performed. After publication the dedicated remote remains authoritative
per ADR 0001; no automatic two-way synchronization. Verified the commands in an
isolated temporary fixture. Evidence: docs/runbooks/separate-course-repository.md.

## D-014 — Broader README and actual courses in both repositories

2026-10-16 · approved · owner: project owner.
The owner requests a broader creative README with appreciation/star sections and
actual course content in the platform repository too; reports both repositories
pushed to main. Current local main tracking refs agree with the parent 9bbab18
and course a21819c commits. Remote state/CI has not been queried successfully.
Use original static SVG banners, readable Markdown, direct chapter links, truthful
feature boundaries, and an optional star invitation without fabricated metrics.
The course directory is currently an embedded 160000 Git pointer. Preserve its
independent history in ignored local storage and track normal files in the parent,
following the tested guide. Parent Git index is read-only in this session, so the
actual conversion remains pending; no metadata was moved or deleted. Source-of-truth
and immutable GitHub reads remain per ADR 0001; no automatic two-way sync.
Evidence: README.md, courses/README.md, docs/runbooks/include-courses-in-platform.md.

## D-015 — The existing inner folder is the connected course

2026-10-16 · approved · owner: project owner.
The owner clarifies that `courses/full-stack-modern-react-nextjs/` is the connected
course directory; `courses/README.md` is not an independent repository. Keep the
latter as a catalog and broaden the actual inner course README as well as the
platform README. Standalone course README assets must live inside its own assets
directory and relative links must not depend on platform-only paths.
The owner has performed the previously blocked conversion: no nested .git remains,
its history is preserved in ignored local storage, and the parent index lists normal
files/eight chapters. The former inclusion blocker is resolved at staging; review,
restaging of current documentation edits, and commits remain. No automatic two-way
sync or remote update is implied. Evidence: courses/README.md,
courses/full-stack-modern-react-nextjs/README.md, docs/runbooks/include-courses-in-platform.md.

## D-016 — Multi-course catalog and first-course reference adaptation

2026-10-16 · approved · owner: project owner.
The owner confirms adaptation rights for the supplied Modern Full-Stack React
Projects PDF. Its table of contents has 20 chapters; all 20 are mapped to an
original interactive learning path in the research notes. Preserve a readable
book-inspired hierarchy (chapter headings, serif reading text, numbered steps,
tables, and labeled notes) in accessible responsive web lessons. Do not copy
source prose, code, screenshots, or page images. The other PDF files inform only
three clearly labeled non-playable catalog mock ideas until reviewed. The current
eight-chapter course remains an early draft; full 20-chapter conversion and
deployment practice are not complete. Evidence:
`docs/research/2026-10-16-course-roadmap-sources.md`,
`apps/web/src/components/course-catalog.tsx`, `refBooks/references.json`.

## D-017 — Crash recovery scope and course repository navigation

2026-10-16 · approved · owner: project owner.
The owner selected “Finish verification and repository link” for this recovery
pass. Link the existing owner-selected dedicated course repository from the shared
website footer; use the existing visual style and same-tab navigation. Update the
main navigation to “Explore courses” to match the catalog. The remaining 20-chapter
curriculum work stays open. No publication or deployment is part of this pass.
Evidence: `apps/web/src/components/brand.tsx`, `docs/context-memory/last-handoff.md`.
