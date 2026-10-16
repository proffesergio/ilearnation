# Outcome backlog

## Current local feature phase (draft 0.2.0)

- [x] Author exactly 20 lessons with activities, preserving eight draft 0.1.0 IDs and snapshotting that version.
- [x] Add open Google entry when configured, single-use invitation links, profile gate, and private SQL progress.
- [x] Add guarded admin activity and immutable policy history with zero-point shadow replay.
- [x] Add full account download and deletion routes.
- [x] Add explicit durable SQLite and Neon adapters with manual local outbox sync.
- [x] Add three original reviewed-draft blog articles and search metadata infrastructure.
- [x] Complete current feature-phase verification: 70 native tests, 12 desktop/mobile browser checks, accessibility, build, types, lint, formatting, repository/credential checks, and production dependency audit.
- [x] Create the authorized Neon project/schema, save its credentials privately, and verify hosted data/sync plus the local browser account loop; delete synthetic accounts afterward.
- [ ] Create Google web OAuth credentials using docs/runbooks/google-oauth-setup.md, save them locally, and verify real Google sign-in.
- [ ] Define fixed event retention, operator access, private incident channel, backups, and abuse policy before public account launch.
- [ ] Human-review and release the twenty-lesson draft; do not claim a published course or measured outcomes.
- [x] Push the full feature phase and deploy the owner-authorized invitation/Neon application to https://ilearnation.vercel.app; verify production sign-in/progress/export/deletion.

Vercel project `ilearnation` now has six production variables, including private
Neon and a separate session secret. Deployment `dpl_4bspUWUJiG8UkGbWvANQP8NbwvAA`
is Ready; the old address redirects to the shorter domain. Google configuration
is intentionally deferred by the owner and does not block invitation sign-in.

Historical unchecked items below may describe work now completed in this local phase; use this section and the current handoff for status.

## Foundation

- [x] Inspect the actual workspace; preserve AGENTS.md and supplied PDFs.
- [x] Record model/configuration observations without exposing credentials.
- [x] Establish contribution, security, conduct, and reference handling guidance.
- [x] Create context memory and a local baseline check/CI definition.
- [ ] Owner selects code and curriculum licenses before distribution.
- [ ] Owner establishes private security/conduct reporting before participation.
- [x] Owner authorizes local app/course development (2026-10-16).

## Learner decisions — in order, one question at a time

- [x] Select the first learner cohort: mixed self-directed learners.
- [x] Define the first ten-minute accomplishment: read a course-repository getting-started guide.
- [x] Draft the local course overview and getting-started orientation.
- [x] Owner selects course target: `proffesergio/modern-fullstack-react-projects-building`.
- [x] Record course/platform boundaries and source of truth in ADR 0001.
- [x] Scope the first local homepage/catalog/player/admin draft slice.
- [x] Select calm studio with energetic community accents.
- [x] Select English first and phone/desktop support with a low-bandwidth path.
- [x] Set initial profile and progress visibility to private; no public leaderboard or real-location map.
- [ ] Identify essential interactions and explicitly deferred behavior.

## First learning loop — after plan approval

- [x] Expand the public README with a learning route, course index, original banners, and optional star/appreciation section.
- [x] Replace embedded course Git pointer with actual staged lesson files; independent course history preserved in ignored local storage by the owner.
- [x] Expand the actual course repository README with its own banner, roadmap, standalone setup, and appreciation section; clarify the parent catalog role.
- [ ] Review, restage updated READMEs/assets, and commit the parent course inclusion; publish reviewed changes to each intended repository separately.
- [x] Reproducible npm workspace, pinned Next/React/TypeScript dependencies, lockfile, and source record.
- [x] Schema 1 and eight original draft chapters with tested JavaScript checkpoints and citations.
- [x] Expand homepage/catalog into one playable React/Next.js course plus three explicitly labeled, non-playable course ideas.
- [x] Link the dedicated course repository from the shared website footer.
- [x] Review the first course PDF chapter list and map all 20 chapters to proposed original interactive activities; record owner-confirmed adaptation rights and source dates.
- [x] Add a responsive book-inspired lesson reading style: strong section hierarchy, serif body text, procedure/callout/table treatments, and accessible semantic content.
- [x] Author the 20-lesson draft and bounded interactive activities; human curriculum review and publication remain open.
- [x] Constrained text-only JSX editing/checking, deterministic feedback, hints, and reset; no arbitrary code execution.
- [x] Explicit device-only progress save/restore/clear controls; no learner account data.
- [x] Local admin draft editing/download, policy shadow replay, and flag proposals.
- [x] Allowlisted, bounded GitHub read adapter with immutable commit references.
- [ ] Create/populate the course remote after access and visibility/licensing decisions.
- [ ] Verify the website reads an actual reviewed GitHub commit end to end.
- [x] Prepare Vercel source exclusions and explicit course runtime file tracing.
- [x] Deploy baseline 563aedb to Vercel and verify core routes; the current feature phase is local only.
- [ ] Connect authorized Mapbox MCP; separately decide browser token and map-load scope.
- [ ] Human-review the course before any release or credential/completion claims.
- [x] Implement authenticated SQL admin roles, activity visibility, and versioned policy history; production configuration/review remains open.
- [x] Relevant lint/type/unit/content/accessibility/build, 73 native tests and 12 desktop/mobile E2E checks; deployed application CI passed.
- [x] Production dependency advisory audit: zero known vulnerabilities reported.

## Later gates

- [ ] Dependency/secret scanning and sandbox security review before sharing.
- [ ] Auth/privacy/export/deletion E2E coverage before collecting account data.
- [ ] Versioned Algorithm governance and replay/abuse tests before scoring.
- [ ] Integration contracts and exact-action approvals before external operations.
- [ ] Git/remote proposal and approval before repository creation or publication.

## Book-ordered release and astronomical theme — 2026-10-16

- [x] Author first course0.3.0, chapters1–20 in exact book order, and finishing conclusion.
- [x] Provide executable API/SPA/SSR/Next project, real browser flow, and CI.
- [x] Enable three free chapter previews and preserve private version-scoped progress.
- [x] Add astronomical cool theme with pause/reduced-motion, course SEO and policy pages.
- [x] Confirm rights for all4 books and inventory remaining chapter sequences.
- [ ] Complete the remaining3 original courses one at a time; do not expose planned lessons as playable.
- [ ] Owner supplies Google credentials, Search Console token and optional GA4 ID.
- [ ] Human editorial review, private operator contact, fixed retention policy and certified advertising CMP before AdSense application.
