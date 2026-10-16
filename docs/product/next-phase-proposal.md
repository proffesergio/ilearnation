# Next phase proposal: a complete learning path

Date: 2026-10-16. Status: historical proposal, superseded for implementation by
[ADR 0002](../adr/0002-sql-auth-and-sync.md) and the current handoff. The owner
subsequently authorized local implementation. The new features are not deployed.

## Confirmed request

- Complete a genuine 20-lesson course, available after sign-in and profile setup.
- Allow open Google sign-up, with invitation links as an alternative entry route.
  The owner explicitly selected this access model; Google users need no invitation.
- Add admin visibility into learning activity and controls for the Algorithm.
- Propose a focused technology niche and a public blog for useful search content.
- Keep a continuation prompt and ask the next necessary question before coding.

## Recommended product and stack

Keep the flagship niche as practical full-stack TypeScript with React and Next.js
for mixed self-directed learners. Retain the approved calm-studio visual direction.
Use the existing 20-chapter coverage map as the curriculum specification, with the
current eight-chapter material supporting prerequisites and original explanations.
Do not silently replace that scope with an unrelated syllabus.

Retain Next.js and Vercel. The implemented choice is Auth.js plus a SQL store with
Neon as the intended hosted Postgres provider and explicit durable Node 24 SQLite
for local work. This supersedes the Supabase proposal. Recovery update:
the owner-authorized Neon project/schema is initialized and verified through
hosted data and local browser checks. Google OAuth credentials remain absent;
follow [manual setup](../runbooks/google-oauth-setup.md) and keep secrets out of chat.

Account flow: invitation link OR Google sign-in -> authenticated session -> minimal
profile -> course player. Returning users resume their saved course version. An
invitation may expire or be revoked; Google remains an independently open route.
Require server authorization on protected reads and actions, including admin APIs.
The current public admin draft preview must not become a production admin console
by merely switching its environment flag on.

## What makes twenty lessons complete

Create a new draft course version for the expanded pathway; preserve the current
version's content and progress semantics. Each lesson needs objectives,
prerequisites, effort, an original explanation, a real interactive activity,
deterministic feedback, progressive hints, reset, common mistakes, accessibility
notes, reflection, and dated references. Completion must distinguish reading from
passing a checkpoint. Reconcile changed lesson IDs and progress explicitly.

The reference map covers these twenty areas:

1. Environment setup and a first verified change.
2. Node.js, data boundaries, and MongoDB concepts.
3. An API with validation, persistence boundaries, and service tests.
4. React data fetching with loading, success, and failure states.
5. Docker, reproducible CI, deployment, and rollback.
6. Identity, sessions, and authorization.
7. Server rendering and a measured performance comparison.
8. Routes, metadata, and discoverability.
9. An end-to-end user journey with Playwright.
10. Minimal event aggregation and interpretable charts.
11. GraphQL query and mutation contracts.
12. Client queries, mutations, and visible data states.
13. Authenticated real-time server events.
14. Reconnect, pending, and error behavior in the client.
15. Event persistence, replay, and retention.
16. Current Next.js App Router fundamentals.
17. React Server Components and client boundaries.
18. Caching, invalidation, assets, and optimization.
19. Next.js deployment configuration and production verification.
20. Capstone integration, tests, accessibility, security, and retrospective.

The source map and approved original eight-chapter arc remain authoritative until
any content reorganization is explicitly recorded. A manifest row or a text match
is not a finished interactive lesson. Use actual behavior checks and clearly label
local-only validation. General learner code must never run directly in the app
server: establish an isolated execution design before offering arbitrary code
execution. Use bounded exercise models where they meet a lesson's objective.

## Profiles, events, and admin

Recommend private profiles by default, requiring only a display name, with an
optional learning goal and locale/timezone. Determine retention, deletion, export, age
scope, and admin access before collecting real learner data. Never make location
sharing a prerequisite.

Track purposeful events such as lesson opened, checkpoint attempted/passed, and
lesson completed. Derive the learner identity from the server session and validate
course version and event IDs. Do not log keystrokes or raw submissions as activity.
Admin views should show last active time, progress, repeated failure points, and
aggregate completion, with access scoped to legitimate platform administration.

Extend the existing deterministic Algorithm package with validated events, reason
codes, versioned rules, replay, caps, audit history, rollback, and a disable switch.
Test new rules in shadow mode before changing live scoring. Admin roles must be
server-managed; profile editing must never grant administration privileges.

## Blog and search strategy

Keep the blog, course overview, and selected previews publicly indexable. Keep
account data and full signed-in activities private. Recommend one coherent topic
cluster with original, tested tutorials: server/client boundaries, runtime input
validation, accessible forms, authentication debugging, testing, and deployment.
Each article should solve one concrete problem and link to the relevant lesson.

Add titles, descriptions, canonical URLs, an XML sitemap, social previews, accurate
article metadata, author/review dates, and deliberate internal links. Track whether
search visitors start and complete useful learning activities. Do not promise
traffic outcomes or mass-publish unreviewed generated articles.

## Delivery and acceptance

1. Verify the implemented backend and recorded English-first, phone/desktop,
   low-bandwidth and private-profile decisions.
2. Implement and verify sign-in, profile setup, authorization, and one persisted
   lesson loop before repeating that behavior across twenty lessons.
3. Author and validate all twenty activities and their starter/checkpoint assets.
4. Connect authorized event collection, admin views, and Algorithm shadow controls.
5. Add the blog and search infrastructure, then verify the full production journey.

Acceptance: a Google user or invited learner signs in, completes a profile, sees
all published lessons, passes a checkpoint, reloads on another device and resumes;
another learner cannot read their private data; an authorized admin sees permitted
activity and auditable rule explanations. Validate every lesson's actual activity.
Include meaningful account, invitation, authorization, content, accessibility,
progress, and replay checks. Produce an honest production handoff with open gates.

## Sources

Retrieved 2026-10-16; official documentation, linked for reference:

- Historical Supabase sources informed the earlier proposal; they are not the
  implemented provider. See ADR 0002 and the SQL/auth runbook for current contracts.
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication):
  authentication, session management, and server authorization boundaries.
- [Next.js production guidance](https://nextjs.org/docs/app/guides/production-checklist):
  metadata, sitemaps, performance, and production validation.

See also the [existing course source map](../research/2026-10-16-course-roadmap-sources.md).
