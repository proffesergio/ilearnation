# First learning loop plan

Latest outcome, 2026-10-16: the owner explicitly authorized pushing/deploying the
completed feature phase with Neon and invitation sign-in now, adding Google
credentials manually later. Application `ea1b8b5` is pushed and live at
https://ilearnation.vercel.app, with verified production account behavior.
The historical slices and approval notes below describe how the work was scoped;
use the current handoff and project state for release status.

Status: **local implementation authorized on 2026-10-16** by the owner's instruction
to start app and course development. Owner: project owner. External access and
public release remain separate gates; this is not deployment approval.

## Outcome

One learner can read a focused lesson, run and edit starter code, receive clear
feedback, reset or reveal hints, and save progress with an understood privacy model.
No social platform, map, billing, or external automation is needed to prove this.

## Approved entry experience — GitHub course orientation

Mixed self-directed learners start by reading `getting-started.md` in a
course-named GitHub repository. The local guide is drafted under
`courses/full-stack-modern-react-nextjs/`; it is not a runnable chapter or release.
Acceptance: the course README links directly to the guide, the guide introduces
the course and learning route, and incomplete setup/exercises are stated clearly.

Selected course target: `proffesergio/modern-fullstack-react-projects-building`;
retain the full React/Next.js course title in its README. Preserve the platform
origin `proffesergio/ilearnation`. ADR 0001 defines the source-of-truth transition
and immutable GitHub read boundary; no implicit two-way synchronization.
GitHub owner, visibility, licensing, remote creation, and publication need separate
decisions and exact-action approval. Reading comes before the first runnable loop.

## Slice 0 — Local foundation

Authorized by the boot sequence: inventory existing work; preserve source files;
create contributor/security/reference guidance, context memory, and baseline CI.
Acceptance: documentation check passes, reference rights are explicit, and proposed
decisions are distinguishable from approved ones. Licensing remains owner-pending.

## Slice 1 — Schema and first chapter

Authorized locally: choose a reproducible toolchain;
research current primary sources; add a failing manifest validation fixture; define
the smallest versioned course schema and author one original draft chapter.
Acceptance: invalid manifests fail clearly; the chapter supplies objectives,
prerequisites, effort, explanation, starter, exercise, progressive hints, validation,
common mistakes, accessibility notes, reflection, and fully recorded references.

## Slice 2 — One real exercise

Choose execution isolation before running learner code. Add failing behavior tests,
then implement edit/run/feedback/reset/hints with resource limits and failure states.
Acceptance: a real code change affects the result; validation explains failures;
hostile submissions cannot access application privileges. No secret keys required.

## Slice 3 — Accessible player and progress

After the page/device/privacy decisions: implement the smallest lesson surface and
approved persistence model. Acceptance: keyboard and mobile completion, reduced
motion, clear save/failure/reset behavior, and tested progress/deletion paths for
the chosen storage model. Automated accessibility checks support manual review.

## Current local scope and acceptance

Homepage, catalog, chapter player, and CMS-style local draft preview. Approved
visual direction: calm studio with energetic community accents. English and a
responsive layout are provisional implementation defaults, not finalized locale
or device support commitments. Progress is explicitly saved on-device, not shared.
The first exercise parses a bounded text-only JSX grammar without executing code.
The Algorithm lab replays synthetic events in shadow mode with its kill switch on.
The homepage map uses synthetic broad regions and a text list, with no Mapbox calls.
Acceptance: chapter navigation, safe hints/Markdown, edit/feedback/reset, local
save/restore/clear, draft validation, deterministic replay, keyboard/mobile checks,
and an exportable course payload. Remote fetch success must be verified after the
repository is populated; an adapter alone is not a completed live integration.

## Approval and release boundaries

Ask learner questions one at a time; record answers before dependent work. Wider
privacy defaults, languages/devices, reporting contact, and licenses remain open.
The owner requested course repository creation/population and authorized Mapbox MCP
use. Access is not yet available; resolve repository existence/visibility and rights
before consequential remote writes. Website push, public publication, deployment,
new account connections, billable map loads, and unrelated external data changes
remain unapproved by that earlier instruction. All completed implementation is locally reviewable.

## Authorized integration completion — 2026-10-16

The owner reports local GitHub login and now explicitly requests completion of
the dedicated course repository and Vercel CLI deployment. This supersedes the
earlier deployment gate for this website. Scope is integration completion and
durable handoff only; resume feature development after the owner supplies required
credentials/connections. Acceptance: verified course remote commit, website reads
that SHA, successful deployment URL and smoke checks, or precise external blockers.
The current shell cannot resolve either API host; do not interpret that as proof
of invalid credentials. See docs/runbooks/github-vercel-resume.md.
