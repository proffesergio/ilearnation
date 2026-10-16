# SQL and authentication setup

The application is deployed at https://ilearnation.vercel.app with Neon and invitation sign-in. Google credentials will be supplied manually later. Commands below may mutate the selected local or remote database; inspect target configuration first. Use Node.js 24. `scripts/db.mjs` loads `apps/web/.env.local` and prints only status or bounded results.

Current workspace: the owner-authorized Neon project `fragrant-resonance-47092618`
(`ilearnnation`), branch `main` (`br-icy-fog-b34stxh7`), database `ilearnnation`,
is initialized in `aws-ap-southeast-1`. `apps/web/.env.local` now uses Neon and
contains its private connection string with mode 0600. Preserve that file. Hosted
account/sync checks and a local browser account loop passed using synthetic
accounts that were deleted afterward. Existing local learner data was not synced.

## Durable local SQLite

Copy `.env.example` to `apps/web/.env.local`, set `DATABASE_MODE=sqlite`, set `LOCAL_DATABASE_PATH` to an ignored persistent path, and set a unique `AUTH_SECRET` of at least 32 characters. Set `AUTH_URL=http://127.0.0.1:3000` for the local dev server. `AUTH_URL` must be an origin with `/` path and no query, fragment, or embedded credentials. Local HTTP is accepted on loopback; production URLs require HTTPS, except explicit local production-start tests using `ALLOW_INSECURE_LOCAL_AUTH=true`. Never use that flag on Vercel.

```sh
npm run db:status
npm run db:init
npm run dev
```

The SQLite file survives app restarts if its path is persistent. `db:init` initializes its schema. Without Google credentials, an operator can create a single-use invitation after initializing the store:

```sh
npm run db:invite -- --email learner@example.invalid --output .local-data/invitation.json
```

The command refuses to overwrite an existing output and writes the private JSON file with mode 0600. The link has a bearer token in its URL fragment; share it privately. A local operator can assign an administrative SQL role with `npm run db:bootstrap -- --email operator@example.invalid`; use only an operator-controlled email. Both `/admin` and `/admin/studio` check that SQL role on the server. The old `ADMIN_PREVIEW` flag grants no access.

## Google and hosted Neon

Google sign-up is open and needs no invitation once `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are configured. Register the correct callback URL with the selected Google OAuth project and set `AUTH_URL` to that installation's exact origin. Google credentials remain absent; follow [the manual Google setup guide](google-oauth-setup.md). Google Cloud CLI is not installed here.

Keep the selected target's connection string in server-side `DATABASE_URL`, not source or a browser variable, and use `DATABASE_MODE=neon`. Inspect the target with `npm run db:status` and `npm run neon:setup` before applying a schema. Schema initialization is explicit: `npm run neon:setup -- --apply` or `npm run db:init -- --apply`. The helper does not provision a Neon project. The earlier Neon authentication failure is resolved: authenticated CLI 2.33.0 created the project above and the schema initializer succeeded. Do not create a duplicate project when resuming.

Vercel production forbids SQLite even if `ALLOW_SQLITE_PRODUCTION=true`. A managed non-Vercel SQLite host also needs an absolute `LOCAL_DATABASE_PATH` and `ALLOW_SQLITE_PRODUCTION=true`. Missing Neon URL, invalid mode, unavailable storage, invalid `AUTH_URL`, or short/missing secret disables account operations; routes return a bounded unavailable response. No automatic store failover occurs.

## Controlled local → Neon sync

After the selected Neon target has a schema and is authorized, keep `DATABASE_MODE=sqlite`, set the exact intended `LOCAL_DATABASE_PATH`, and provide the target `DATABASE_URL` in the server-side env file. Check `npm run db:status`, backups, target identity, and source path; then run `npm run db:sync -- --limit 100`. Repeat only after inspecting pending count and conflicts. The outbox transfers canonical users, profiles, and events with receipts and revision checks; it does not transfer roles, invitations, credentials, or policy history. Review `sync_conflicts` with an operator before relying on remote progress. Do not switch users to Neon until the remote identity and data path are checked. The sync command is manual, and an unavailable remote leaves pending items in SQLite.

## Checks and open gates

If a sync adopts a different canonical user ID, existing local sessions for that
identity no longer authorize requests. The learner must sign in again. Plan the
operator-run migration and fresh invitations before changing stores.

Run unit/content tests, typecheck, lint, formatting, build, browser flows, repository and heuristic secret checks after changes. The root handoff records current results. Before public account launch, settle event retention and deletion operations beyond account deletion, private incident reporting, operator access, abuse limits, backup/restore, and live Google/Neon/Vercel checks.
