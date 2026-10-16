# Field Notes · original course project

An original synthetic public technical notebook for chapters 1–20 of the course.
The API, React SPA, plain React SSR server, and Next.js application are separate
workspaces so you can inspect the same data through different rendering models.
This is teaching code for local practice, not the iLearnNation account backend.

## Start here

Install Node.js 24 and Git. From this directory, run `npm ci`. Then run
`npm test` and `npm run build`. Tests use an in-memory adapter with synthetic
accounts; no cloud database or paid account is needed. Read the API README for
the explicit differences between public notes and authenticated writes.

In terminal one run `npm run dev:api`, in terminal two `npm run dev:web`.
Visit http://127.0.0.1:5173. API health is http://127.0.0.1:4000/health.
Sign up with a synthetic email and a unique practice password (12+ characters).
Write a note. Refreshing clears the SPA's in-memory token; sign in again.
Notes are public technical examples, so never enter personal or confidential text.
Stopping the default API clears records. This is an intentional memory adapter,
not persistence.

## Checkpoints by chapter

| Chapters | Workspace and observable result |
| --- | --- |
| 1 | Install, run both services, change the first heading in web/src/main.jsx |
| 2–3 | api/src/store.mjs and app.mjs; pass real Jest/Supertest HTTP contract tests |
| 4 | web/src/main.jsx; TanStack loading, create, invalidation and errors |
| 5 | Dockerfile + compose.yaml; build locally and run a replica set before persistence |
| 6 | api/src/auth.mjs; verify scrypt password checks and constrained JWT verification |
| 7–8 | ssr; inspect initial HTML, then compare hydrated behavior and metadata |
| 9 | smoke.spec.mjs; run real Chromium interaction after building the SPA |
| 10 | API /api/stats; web /insights renders chart plus equivalent table |
| 11–12 | API /graphql + web /graphql; named queries and authenticated mutation |
| 13–15 | api/src/realtime.mjs, web /live; acknowledgements, deduplication, replay |
| 16–18 | next-app; App Router, Server Components, actions, search and no-store boundaries |
| 19–20 | Build/start Next, inspect metadata, run release checks and complete capstone evidence |

## Plain React server rendering

After `npm run build --workspace=@field-notes/ssr`, leave the API running
and run `npm run dev:ssr`. Visit http://127.0.0.1:5174. Use
`curl -s http://127.0.0.1:5174` to see actual note titles in initial HTML.
The SSR adapter deliberately uses React renderToString for a small baseline;
streaming and TanStack dehydration are discussed extensions, not implemented claims.

## Next.js

Copy next-app/.env.example to next-app/.env.local (keep it private).
Run `npm run dev:next` while the API is running. Visit
http://127.0.0.1:3001. A Next server action keeps the bearer token in an
HttpOnly cookie; browser JavaScript never receives it. Production requires HTTPS.
`npm run build --workspace=@field-notes/next-app`, followed by
`npm start --workspace=@field-notes/next-app`, tests the production server locally.
Use different terminals and stop the dev server first to free port 3001.

## Optional real MongoDB persistence

Docker and Compose are optional. Run `docker compose up -d mongo`, then initialize
the local replica set once:

```sh
docker compose exec mongo mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
```

Wait for PRIMARY: `docker compose exec mongo mongosh --quiet --eval 'db.hello().isWritablePrimary'`.
Run the API with `STORE_MODE=mongo MONGO_URL='mongodb://127.0.0.1:27017/fieldnotes?replicaSet=rs0&directConnection=true' npm run dev:api`.
The transactions in event persistence require a replica set. Stop/restart the API,
then confirm the note remains. In-memory tests do not establish that MongoDB
transactions work on your host. The local container has no authentication and is
bound to loopback; a public deployment needs an authenticated managed replica set,
TLS, backups, access controls, retention and operational monitoring.

For an API container use `docker build -t field-notes-api .`. Inject a unique
JWT_SECRET of 32+ random characters at runtime, never as a Docker build argument.
Set API_HOST=0.0.0.0, WEB_ORIGIN, STORE_MODE=mongo, and MONGO_URL for your own
network. The Compose file starts only the local learning database.

## Evidence and recovery

Run tests before each feature change; inspect a failing assertion before editing.
Commit your own small changes so you can revert only that commit. Close a port's
existing process before changing ports. A 503 on SSR means the API is unavailable.
A 401 after reload means sign in again. A rejected write must leave the draft visible.
Run `npm audit --omit=dev` and review current advisories before public hosting.
No deployment credentials, book files, screenshots of source pages or real user
records belong in a course repository.

## Capstone conclusion

Demonstrate one note through REST, GraphQL, realtime and Next.js, then show
an invalid title and a second account's forbidden update. Include test output,
keyboard/mobile checks, initial-HTML inspection, persistence restart evidence if
using Mongo, a deployment/rollback plan, and a short retrospective. A passing
browser configuration lab is only one part of that evidence.

References and versions are recorded in ../../references.md and api/research.md.
The project is original educational code; check the repository's LICENSE before
redistribution. Owner-confirmed book adaptation rights do not grant readers a
license to redistribute the supplied books.
