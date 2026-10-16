# ADR 0002: Auth.js, SQL storage, and explicit local sync

Date: 2026-10-16. Status: accepted; Neon and the invitation application are deployed and production-browser verified. Google OAuth configuration remains optional and pending, as authorized by the owner.

## Decision

Use Auth.js for open Google OAuth sign-up and optional single-use invitation links. Both create a server-side identity; profile completion gates the lesson player and dashboard. The SQL store owns profiles, version-scoped learning events, roles, invitations, and immutable Algorithm policy history. Admin endpoints look up the current SQL role. Profile edits cannot grant roles.

Use Neon Postgres through its serverless driver as the intended hosted store. Use Node 24 built-in SQLite on an explicit persistent local path for development and supported managed non-Vercel hosts. Vercel production requires Neon and fails closed without its configuration. Authentication also fails closed without a valid origin and secret. Do not silently switch a failed hosted database to SQLite.

The local outbox supports operator-run SQLite → Neon sync for users, profiles, and events. Neon supplies canonical user IDs and revisions, which the local store adopts. Receipts make replay idempotent; conflicts are recorded for operator review. Roles, invitations, credentials, and Algorithm policies stay out of the sync payload. This is a one-way controlled migration aid, not automatic failover or a browser offline feature.

## Consequences

Local SQLite files and invitation output require filesystem protection and backup choices. Neon schema initialization and Google OAuth configuration are operator actions. A valid SQLite session is not automatically a portable Neon login credential; the identity provider still needs correct configuration. Remote sync needs the intended source path and approved target checked before running. Export and account deletion are implemented; a timed event-retention policy, operator access policy, incident channel, and live-service validation remain launch gates.

Evidence: `packages/data/learning-store.mjs`, `packages/auth/security.mjs`, `apps/web/src/lib/auth.ts`, `scripts/db.mjs`, `scripts/neon-setup.mjs`, and the [runbook](../runbooks/sql-auth-setup.md).

Recovery outcome on 2026-10-16: the owner explicitly authorized creating a Neon
project using the authenticated CLI. Project `fragrant-resonance-47092618`, branch
`main`, database `ilearnnation`, in `aws-ap-southeast-1` now has the shared schema.
The ignored local web environment uses Neon. Hosted data, explicit synthetic
SQLite sync, and browser invitation/profile/progress/export/deletion checks passed.
Existing local learner records were not migrated. Google setup uses the
[manual runbook](../runbooks/google-oauth-setup.md); no Google project was created.
