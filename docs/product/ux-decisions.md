# UX decisions

Updated: 2026-10-16. Record explicit answers; do not infer approvals.

| Order | Decision | Status |
| --- | --- | --- |
| 1 | First learner cohort | Approved: mixed self-directed learners |
| 2 | First ten-minute accomplishment | Approved: read the course repository's getting-started guide |
| 3 | Required v1 pages | Local homepage/player/admin authorized; catalog retained as a reversible default |
| 4 | Studio / racing / clubhouse / blend | Approved: calm studio with energetic community accents |
| 5 | Languages, devices, RTL, bandwidth | Unasked |
| 6 | Profile, review, activity, team, location visibility | Unasked |
| 7 | Essential versus deferred interactions | Unasked |

## UX-001 — First cohort

Owner: project owner. State: approved.
Question: Who should the first course serve first?
Answer on 2026-10-16: **Mixed self-directed learners**.
Implication: make prerequisites explicit and prior knowledge checkable; do not
assume a CSE degree. Pacing and the entry lesson remain open. This does not settle
age eligibility, language support, device requirements, or privacy defaults.

## UX-002 — First ten minutes

Owner: project owner. State: approved.
Question: What should a learner accomplish in the first 10 minutes?
Answer on 2026-10-16: start by reading a getting-started Markdown file in a
course-named GitHub repository. A shorter, clearer repository name may be proposed.
The first ten minutes do not require running code; the later learning loop does.

Original proposal (superseded by the owner-selected repository below):
Reversible filename default: `getting-started.md` (the requested “getting started.md”
normalized to kebab-case). Suggested repository slug: `modern-fullstack-react`;
the full React/Next.js course title stays in the README. The slug is proposed,
not owner-approved or checked for availability. GitHub owner, visibility, remote,
and publishing approval remain unset. Course/platform repository synchronization
and source-of-truth boundaries need an ADR before remote setup.

Local draft: [getting-started guide](../../courses/full-stack-modern-react-nextjs/getting-started.md).

## UX-003 — Website page scope

Owner: project owner. State: approved for the initial local slice.
The owner requested app development, GitHub lesson ingestion, a CMS-style admin,
and a homepage map showcase. Implement homepage, course player, and admin draft
workspace; retain the catalog as a reversible navigation default. This does not
finalize the public-launch page set or authorize social/account data collection.

## UX-004 — Experience direction

Owner: project owner. State: approved.
Answer on 2026-10-16: **Calm studio with energetic community accents**.
Use a quiet reading surface, clear chapter navigation, warm progress accents, and
optional restrained motion. No competition or public identity requirement is added.

## Course repository target — owner-selected

`proffesergio/modern-fullstack-react-projects-building` replaces the earlier slug
suggestion. Keep the platform origin `proffesergio/ilearnation` separate. The
source-of-truth transition and safe import contract are documented in ADR 0001.

## Still unanswered

Language/device/bandwidth priorities, wider privacy defaults, public-launch scope,
and essential social interactions remain open. The local prototype uses English,
responsive layouts, system fonts, no accounts or analytics, explicit device-only
progress saves, and synthetic map data. These do not settle future launch policy.
