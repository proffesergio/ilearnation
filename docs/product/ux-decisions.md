# UX decisions

Updated: 2026-10-16. Record explicit answers; do not infer approvals.

| Order | Decision | Status |
| --- | --- | --- |
| 1 | First learner cohort | Approved: mixed self-directed learners |
| 2 | First ten-minute accomplishment | Approved: read the course repository's getting-started guide |
| 3 | Required v1 pages | Local homepage/player/admin authorized; catalog retained as a reversible default |
| 4 | Studio / racing / clubhouse / blend | Approved: calm studio with energetic community accents |
| 5 | Languages, devices, RTL, bandwidth | Approved: English first; phone and desktop; low-bandwidth path. RTL and additional languages deferred. |
| 6 | Profile, review, activity, team, location visibility | Approved: private profiles/progress; admin support access to reads and checkpoint outcomes. No public leaderboard or real map. |
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

## Study-book-001 — An animated study book

2026-10-16 · approved product direction · implementation pending.
The owner adds **“An animated study book”** to the learning experience: readable,
book-like lessons with AI-assisted visual explanations that walk through each
concept step by step. This complements the calm studio and existing book-inspired
typography, chapter hierarchy, and exercise flow.

The intended learning sequence is:

1. Introduce one concept and show its current state with a concise explanation.
2. Explain visually through small, ordered animation steps.
3. Pause before a key consequence or reveal and ask **“What happens next?”**
4. Let the learner predict through a suitable choice or short answer, or select
   “Not sure — show me.”
5. Reveal the next animation step and explain why it happens, including useful
   feedback on the prediction and common misconceptions.
6. Let the learner replay or step back, then apply the idea in an exercise.

Treat the AI-assisted explanation experience as a planned feature. AI tools may
help generate explanations, storyboards, and visual variants; the provider and
whether generation happens during authoring or on demand remain implementation
choices. Anchor explanations and prediction answers in reviewed course content
and checked behavior. Keep concept steps, questions, feedback, and reveal points
in versioned lesson content rather than hard-coding them in presentation.

Provide next/back/replay/pause controls, keyboard access, equivalent text and static
steps, and reduced-motion behavior. Preserve readable text and a low-bandwidth
path. Predictions invite engagement without making a correct guess mandatory for
seeing the explanation. Animation supports essential understanding through an
accessible alternative; it must not be the only way to learn a concept.

Example experience: illustrate a React state update, pause before the next render,
ask what the interface will show, then reveal and explain the transition before
the learner edits the corresponding exercise.

## Course repository target — owner-selected

`proffesergio/modern-fullstack-react-projects-building` replaces the earlier slug
suggestion. Keep the platform origin `proffesergio/ilearnation` separate. The
source-of-truth transition and safe import contract are documented in ADR 0001.

## Access-001 — Account entry routes

2026-10-16 · approved by the owner during next-phase discovery.
The owner selected “Allow invitation links or open Google sign-up.” A Google user
does not need an invitation. Invitation links are an alternative route. After
authentication, learners complete a profile before entering the learning path.
Auth.js and SQL implementation exists locally. Neon is initialized and verified
through hosted data and local browser tests. Google credentials and the new
production application deployment remain pending.

## UX-005 — Language and device priority

2026-10-16 · approved by owner. English first, with usable phone and desktop
layouts and a low-bandwidth path. Further languages and RTL remain future work.

## UX-006 — Initial visibility and retention

2026-10-16 · approved by owner: “Private profiles and progress; admin support access.” Profiles and progress are private by default;
admins see lesson reads and checkpoint outcomes for support. There is no public leaderboard or
real-location map. Events are currently retained until account deletion. A fixed
retention period and operator access policy must be settled before public launch.

## Remaining product decisions

Public-launch scope, social/review visibility, additional languages/RTL, and
essential social interactions remain open. The account application is not deployed.
Neon data and local hosted-backed browser checks passed; live Google sign-in
remains unconfigured.
