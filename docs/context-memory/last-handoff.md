# Latest production publication — 2026-10-16

Current goal: Push all latest application changes, configure Vercel production
with Neon now and Google manually later, and use `ilearnation.vercel.app`.

Completed: Application commit `ea1b8b53bc1a4da1864992287fc16ede579b73e1` is pushed
to `https://github.com/proffesergio/ilearnation` main. Vercel deployment
`dpl_4bspUWUJiG8UkGbWvANQP8NbwvAA` is Ready at
https://ilearnation.vercel.app. Renamed the same project ID
`prj_Bw9AMC32Cyo0hsaXzvA9eI1tLPrl` to `ilearnation`; team `n3rd-s-projects`,
root `apps/web`, Node 24. Registered the new production domain, and configured
the previous `i-lear-nation.vercel.app` domain to redirect to it with HTTP 308.

Production variables: `DATABASE_MODE`, `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`,
`SITE_URL`, and `COURSE_SOURCE`. Neon and a separate generated production session
secret are non-readable Vercel Secrets, sent through CLI stdin. Their ignored
local recovery copy is `.local-data/production-account.env`, mode 0600. No secret
values, local data, env files, or private reference PDFs were pushed/uploaded.
Google variables are intentionally absent per the owner's explicit instruction.

Files changed for deployment: `scripts/check-production.mjs`,
`tests/production-preflight.test.mjs`, `.github/workflows/repository-checks.yml`,
`apps/web/src/lib/articles.ts`, `.env.example`, and current setup/status docs.
All 122 files of the pre-crash feature phase were committed together. A subsequent
documentation-only handoff commit records this outcome; deployed app code is ea1b8b5.

Tests/checks run: 73 native tests, fresh production build/types, lint, formatting,
repository/graph/link checks and heuristic credential scan passed. Live production
configuration passed core auth/Neon and all nine schema probes with Google absent.
Application GitHub Actions baseline and web jobs passed, including reproducible
install, all native tests, content, types, lint, format, build, dependency audit
and all 12 desktop/mobile E2E checks:
https://github.com/proffesergio/ilearnation/actions/runs/38862069430.
The workflow deploy job was skipped; this release used the authorized Vercel CLI.

Production browser verification passed public routes and canonical sitemap,
disabled Google, invitation entry, secure HttpOnly session cookies, profile setup,
checkpoint/read, saved progress in a separate session, learner admin denial,
export, and deletion invalidating both sessions. Synthetic account was deleted;
retained synthetic tombstone/revocation metadata follows the documented policy.

Known issues: Google OAuth remains unconfigured by choice, and no real operator
admin role was bootstrapped. No Git auto-deploy connection was added. Protected
GitHub deployment credentials/review settings remain unverified; Vercel Secrets
cannot be pulled, so the manual CI preflight needs matching protected
`DATABASE_URL` and `AUTH_SECRET` in addition to its Vercel credentials. Do not
claim the deploy workflow ran. Public policy, licensing, and curriculum review
items remain in TODO; course is still draft 0.2.0, not a released credential.

Open decisions: The owner will provide Google credentials manually later.
Wider public account launch still needs retention/operator/incident decisions.
External integrations/status: Platform Git push, remote CI, renamed Vercel
production, and live Neon/invitation account flows are verified. The dedicated
course remote is unchanged by this platform publication; bundled course files
are included in the pushed platform commit. No existing local learner data migrated.
Algorithm or schema version changes: No new versions; course 0.2.0/schema 1,
SQL 001/003, local outbox 002, zero applied Algorithm points.
Next smallest safe step: Add both Google values using the manual runbook, register
`https://ilearnation.vercel.app/api/auth/callback/google`, redeploy the same project,
and verify a real Google login. Invitations work in the meantime.
Approval required before: Existing explicit publication/configuration/deployment
authorization persists. No repeated approval needed for these same actions.

---

# Previous: Crash recovery, Neon setup, and verified feature phase — 2026-10-16

Current goal: Resume the interrupted feature verification, configure the newly
authorized Neon project, provide Google OAuth setup if CLI creation is unavailable,
and inspect the existing Vercel deployment.

Completed: Fixed two actual mobile regressions: the admin table now contains its
hidden accessible labels, and scrolling Markdown code blocks support keyboard
focus with a visible outline. The full browser suite passes. Authenticated Neon
CLI 2.33.0 created `ilearnnation` / `fragrant-resonance-47092618` in
`aws-ap-southeast-1` under the existing free organization, with fixed 0.25 CU.
Branch `main` / `br-icy-fog-b34stxh7`, database `ilearnnation`, has the initialized
shared schema. The private connection is in ignored mode-0600
`apps/web/.env.local`, now using Neon. No credential values were printed.

Files changed in recovery: `apps/web/src/app/globals.css`,
`apps/web/src/components/markdown.tsx`, README, TODO, CHANGELOG, SECURITY,
SQL/auth/Google/Vercel runbooks, ADR 0002, integration/product status notes, and
the context graph/state/decisions/continuation prompt. The environment file and
private target metadata are ignored. All pre-crash feature work remains preserved.

Tests/checks run: 70 native tests passed, including real embedded PostgreSQL,
SQLite persistence, sync replay and account isolation. A fresh production build,
types, lint, formatting, course validation, repository/graph/link checks and the
heuristic credential scan passed. Production dependency audit reports zero known
vulnerabilities. All 12 desktop/mobile E2E checks passed on the final build,
including every one of the 20 actual checkpoints on both devices, separate-browser
progress recovery, admin policies, streamed export/deletion, keyboard, reduced
motion, automated accessibility and overflow. Both fixed mobile scenarios also
passed focused verification. SQL traces retain all three migrations.

Hosted verification: Actual Neon HTTP adapter checks passed schema reads,
single-use invitations, profile, versioned/idempotent progress, private export,
learner-role denial, synthetic SQLite-to-Neon sync/replay and deletion cascades.
A separate local production-start browser against Neon passed invitation entry,
profile gate, checkpoint/read, progress recovery in another browser context,
admin denial, export, and deletion invalidating both sessions. Synthetic accounts
were deleted afterward; retained synthetic revocation/tombstone/sync metadata
follows the documented retention behavior. Existing local learner records were
not migrated and no cloud admin role was created. Owned test servers stopped.

Known issues: Google Cloud CLI is not installed and Google OAuth credentials are
absent. The owner explicitly accepted manual instructions as fallback; see
`docs/runbooks/google-oauth-setup.md`. No Google project was created and no Google
login has been verified. Fixed retention, private incident reporting, operator
access, backups, abuse policy, licensing and human curriculum review remain
public-launch work. The animated study-book concept remains planned.

Open decisions: Existing public-account retention/operator/incident policies.
The owner may create the web OAuth client and save values directly in the ignored
environment file, then tell the agent it is configured without sending secrets.

External integrations/status: Vercel CLI inspected the existing production
deployment `dpl_BCmHRC3yz3PMUhgig2XBEkt39MVR` as Ready. CLI homepage smoke returned
HTTP 200 with the actual brand and course repository link. Production env listing
returned no variables. https://i-lear-nation.vercel.app remains baseline 563aedb;
the new application features have not been pushed or deployed. The only new
external writes were the explicitly authorized Neon project/schema and synthetic
verification records. No production Vercel variables or Google services changed.

Algorithm or schema version changes: None during recovery; course draft 0.2.0,
schema 1, shared SQL 001/003, local outbox 002, zero applied Algorithm points.

Next smallest safe step: Complete the manual Google web-client setup, preserve
the current Neon credentials, verify real Google sign-in, then configure the
existing Vercel production account variables and run `scripts/check-production.mjs`.
It currently refuses an account release without production/Google configuration.
Resolve public-launch policies before opening real learner accounts.

Approval required before: Existing owner authorization for platform push/deploy
and the new Neon creation persists; do not ask again for those same actions.
Do not create duplicate projects or change unrelated services. Missing Google
configuration is a dependency, not a request to repeat deployment permission.

Model routing: Root remained inherited. One gpt-6.1-sol worker with medium
reasoning performed account review and the isolated mobile fixes; root reconciled
the changes and verified the complete suite and live Neon behavior.

---

# Previous: Twenty-lesson SQL/account feature — 2026-10-16

Current goal: Complete the English-first, phone/desktop, low-bandwidth course and
private account learning loop with Neon and explicit local SQL sync.

Completed: Draft 0.2.0 has exactly 20 complete lesson loops, executable authored
Node checkpoints and bounded web activities; eight old IDs and the 0.1.0 snapshot
are preserved with their relative dependencies. Invitations use single-use hashed
bearer links; open Google entry is implemented but needs OAuth configuration.
Profiles gate all 20 lessons. SQL stores private progress, current roles, learner
activity, immutable Algorithm versions and audit history. Admin replay remains
shadow-only with zero applied points. Full paginated streamed export and account
deletion are implemented. Three public draft blog articles have canonical links,
structured data, sitemap and robots rules. Footer and player link the course repo.

Files changed: courses/full-stack-modern-react-nextjs, packages/course-runtime,
packages/auth/security.mjs, packages/data/learning-store.mjs and migrations,
apps/web auth/profile/dashboard/player/admin/blog pages and APIs, account/admin
components, scripts/db.mjs, scripts/neon-setup.mjs, scripts/check-production.mjs,
workflow/configuration/tests and corresponding README/security/architecture/docs.

Tests/checks run: All 70 native unit/integration/content checks passed, including
actual PGlite PostgreSQL compatibility, SQLite reopen, identity isolation,
interrupted/idempotent sync, deletion replay and React-compatible SQL records.
Typecheck, lint without warnings, production build, formatting, repository/graph
links and heuristic credential scan passed. All three SQL migration files appear
in auth and learning function traces. Desktop invitation/profile, all 20 actual
checkpoint submissions and separate-browser progress recovery passed. Full
browser suite is in progress; replace this sentence with its final result.

Known issues: No Neon cloud schema or Google OAuth configuration. A live Vercel
production env listing returned no variables. Neon CLI 2.33.0 project listing
reached OAuth but could not save credentials; cloud setup was cancelled. The
local outbox sync is manual and excludes credentials, invitations, roles and
policies; Neon failure never silently enables SQLite. JSON labs simulate bounded
behavior, rather than execute a general framework application. Events remain
until account deletion; minimal hashed deletion markers prevent resurrection
and email re-registration. Human curriculum review, fixed operational retention,
backups and private incident reporting remain public-launch work.

Open decisions: Operational retention for events/audit/deletion markers and public
launch readiness. Owner approved English, phone/desktop, low bandwidth, private
profiles/progress and admin support access to reads/checkpoint outcomes.

External integrations/status: Existing 563aedb baseline remains deployed at
https://i-lear-nation.vercel.app. New features are not deployed. Manual main-only
CI deployment now requires successful check jobs, production environment approval
settings and a read-only Google/Neon schema preflight. Remote workflow execution,
reviewer settings and secrets have not been verified. The preflight fails closed
locally without cloud configuration. No remote schema or Google project changed.

Algorithm or schema version changes: Course draft 0.2.0/schema 1; shared SQL 001
and 003 policy history, local-only outbox 002; validated immutable policy snapshots.

Next smallest safe step: Complete browser checks, record results, then use the
approved existing Neon target and Google OAuth project to configure production,
initialize the reviewed schema and run the manual CI deploy. See the saved
next-phase-prompt.md and SQL/auth runbook. Platform push/deployment authorization
persists from the owner; do not ask again for the same action. A new provider or
ambiguous database target still needs its exact selection. Never paste secrets.

---

# Previous: next-phase discovery after production deployment — 2026-10-16

Current goal: Propose the complete twenty-lesson course, account/profile access,
admin activity/Algorithm controls, and a focused public blog. The owner explicitly
asks for suggestions and questions before application code.

Completed: Platform commit 563aedb pushed to origin/main. Created Vercel project
i-lear-nation in n3rd-s-projects with root apps/web, then deployed production at
https://i-lear-nation.vercel.app. Remote build succeeded and deployment is READY.
Anonymous homepage returned 200 with the real platform title/content. Authenticated
Vercel curl checks returned 200 for catalog, foundations, course SVG, and valid
exercise POST; production /admin returned 404. The 109-file upload excluded local
environment files and all four private PDFs.

Approved account decision: Open Google sign-up OR invitation links. Google users
need no invitation. Users complete a profile before entering the learning path.

Files changed in discovery: docs/product/next-phase-proposal.md,
docs/context-memory/next-phase-prompt.md, ux-decisions.md, project-state.yaml,
graph.json, and this handoff. Application code has not changed for this new phase.
Earlier implementation checks remain 38 unit tests and 10 desktop/mobile E2E
checks, plus successful build, types, lint, formatting, and content checks.

Known issues: Twenty-lesson implementation, real accounts, profiles, database,
privileged admin, and activity persistence do not exist yet. Supabase Auth/Postgres
is proposed but not selected or connected. Existing admin remains a local draft
preview. Course README/assets are updated in the platform but their independent
course history still has local changes. Do not mistake the two Git histories.

Open decisions: Backend selection is the current single question. Language/device,
privacy/retention, invitation details, and isolated execution follow as needed.
External integrations/status: Production CLI deployment succeeded; Vercel Git
integration failed because the account lacks a GitHub login connection. Existing
GitHub workflow performs checks, with result unverified. Direct Git push worked;
the sandbox GitHub CLI auth error does not establish a revoked credential.
Algorithm or schema version changes: None; current course remains draft 0.1.0.
Next smallest safe step: Resolve the backend preference and next necessary product
question, then implement one authenticated, persisted learning loop before
expanding every lesson. Use next-phase-prompt.md for continuation.
Approval required before: Resolve the owner's requested discussion before coding.
Provider connection/OAuth setup requires the chosen project and exact settings.
No new deployment or publication has occurred during proposal preparation.

---

## Previous handoff: crash recovery and repository link — 2026-10-16

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
