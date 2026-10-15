# Crash recovery: verification and repository link — 2026-10-16

Current goal: Finish verification and add the courses repository link, as selected
by the owner during recovery. Further curriculum authoring is outside this pass.

Completed: Shared website footer links to
`https://github.com/proffesergio/modern-fullstack-react-projects-building` with
visible text “Course repository on GitHub.” Main navigation now says “Explore
courses” to match the catalog. Existing eight-chapter draft and three catalog
concepts remain accurately labeled.

Files changed: `apps/web/src/components/brand.tsx`, `CHANGELOG.md`, `TODO.md`,
`docs/context-memory/graph.json`, `docs/context-memory/project-state.yaml`,
`docs/context-memory/decisions.md`, `docs/context-memory/last-handoff.md`.

Tests/checks run: 38 native tests, course validation, ESLint, Prettier, TypeScript,
and production build passed. Verified the built homepage HTML contains the exact
repository link inside its footer and the updated navigation text. All 10
desktop/mobile browser checks passed, including keyboard, reduced motion,
automated accessibility, and overflow checks. Offline repository/graph checks
and heuristic credential scan passed.

Known issues: Full 20-chapter course, authenticated CMS, and live integrations
remain unfinished. Existing deployment and remote status are historical; they
were not rechecked in this local recovery pass.

Open decisions: Existing language/device/privacy questions remain open.
External integrations/status: No external services modified or new connections.
Algorithm or schema version changes: None; draft course 0.1.0, schema 1.
Next smallest safe step: Review the local footer; plan the remaining original
course lessons against the saved 20-chapter coverage map in a separate task.
Approval required before: No additional approval for local work. Nothing pushed,
published, sent, or deployed during this pass.
Model routing: Inherited root; no worker delegation needed for this small slice.

---

## Previous handoff: multi-course catalog and first-course roadmap — 2026-10-16

Current goal: Make the homepage/catalog represent a broader learning library,
map the rights-confirmed first-course PDF into a complete interactive course plan,
and keep the learner-facing state truthful.

Completed: Added three catalog mock ideas from the other PDF filenames; each is
marked as an idea with zero lessons and no start link. Kept the React/Next.js
course as the only playable path. Read the first book's metadata and 20-chapter
table of contents and recorded an original lesson coverage map. The owner confirmed
adaptation rights. Updated the lesson reading surface with a book-inspired heading,
serif-body, table, and callout hierarchy. Added current React, Next.js, TypeScript,
MDN, and Packt source records with retrieval dates.

Files changed: `apps/web/src/app/page.tsx`, `apps/web/src/app/courses/page.tsx`,
`apps/web/src/app/globals.css`, `apps/web/src/components/course-catalog.tsx`,
`apps/web/src/lib/course-ideas.ts`, `courses/full-stack-modern-react-nextjs/references.md`,
`docs/research/2026-10-16-course-roadmap-sources.md`, `refBooks/references.json`,
`TODO.md`, `docs/context-memory/decisions.md`, `docs/context-memory/graph.json`,
`docs/context-memory/project-state.yaml`.

Validation run and results: Production build passed. Typecheck, ESLint, Prettier,
repository baseline, and course manifest validation passed. All 10 existing E2E
checks passed on desktop and mobile, including homepage accessibility and overflow.
The first PDF metadata and TOC were read locally; two representative pages were
visually inspected. A separate manual screenshot attempt was blocked by the local
Chrome process exiting with SIGTRAP; the E2E browser suite completed successfully.

Research/source updates: See the dated research note. The book is a 2024 reference;
the source PDF states Packt copyright and all rights reserved, while the owner
confirms adaptation rights. No book prose, source code, screenshots, or page images
were copied. Other PDF rights and contents remain unreviewed.

Algorithm/schema/integration changes: None. No external services or accounts used.

Known issues and risks: Existing eight chapters do not yet cover all 20 mapped book
chapters, deployment practice, or the planned complete capstone. Rights and license
terms still require correct attribution and release review. Catalog concepts are
plain mockups, not separate course records or runnable curriculum. The initial
parallel typecheck collided with Next build type generation; it passed when rerun
after the build completed.

Open decisions: None required for this UI slice. Existing language/device/privacy
decisions remain open as documented in `docs/product/ux-decisions.md`.

Next smallest safe step: Review the catalog and typography in the running app, then
author the next original, schema-validated lessons against the mapped curriculum
and current official docs, preserving the current course as draft 0.1.0.

Approval required before: No additional approval for local edits. The existing
separate repository publication/deployment permissions do not authorize new external
actions for this slice.

Model routing: Inherited root; no worker delegation used.
