# Field Notes API — draft 0.3.0

This teaching API stores **public synthetic technical notes**. Its user accounts
are separate from iLearnNation accounts. Never enter real passwords, emails,
private learner records or production connection strings in examples.

From the `projects/field-notes` directory, after the workspace install:

```sh
export JWT_SECRET="$(node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))")"
npm run dev --workspace=@field-notes/api
```

The explicit in-memory mode resets when the process stops. The server refuses
memory mode with `NODE_ENV=production` and refuses a missing/short JWT secret.
Keep the generated value in the current terminal; do not commit it. The default
loopback API is http://127.0.0.1:4000. The Vite development server proxies `/api`
and `/graphql`; the permitted Socket.IO development origin is 127.0.0.1:5173.

Run `npm test --workspace=@field-notes/api` for Jest/Supertest tests. They create
fresh memory stores and require no MongoDB or external credentials. `npm run
check --workspace=@field-notes/api` checks JavaScript syntax.

## Contract

Public reads: `GET /health`, `/api/notes`, `/api/notes/:idOrSlug`, `/api/stats`.
The list accepts `search` (up to100 characters), `sort=oldest|newest`, and
`limit=1..100`; it deliberately does not promise a complete archive export.
Signup/login accept `{email,password}`; passwords require at least12 characters
and at most128 UTF-8 bytes. The response is `{token,user:{id,email}}`.
`POST /api/notes` accepts `{title,body}` and returns201 `{note}`. `PUT` and
`DELETE /api/notes/:id` require the author. Use `Authorization: Bearer TOKEN`.
Unknown ownership fields are rejected, never trusted. Tokens expire after15
minutes and constrain issuer/audience/HS256. Logout removes the browser's token;
it does not revoke an already-issued token. No refresh flow is included.

`POST /graphql` accepts `{query,variables,operationName}`. Query fields are
`notes` and `note(id:ID!)`; `createNote(title:String!,body:String!)` returns a
Note and requires authentication. One operation, depth6 and60 fields are allowed;
fragments are deliberately excluded from this small teaching API. Validation
errors are400; resolver failures use GraphQL's `errors` envelope.

Socket.IO connects with `auth:{token}`. `note:create` accepts a required stable
`clientId`, title and body, then emits `note:created` and acknowledges
`{ok:true,event}` only after commit. A failure acknowledges `{ok:false,error}`.
`notes:sync` accepts `{after:0}` or the last sequence and emits `notes:history`
`{events,hasMore,nextCursor}`. Fetch the next page while hasMore is true.
Replies are owner-scoped. Each event includes eventId, sequence, note and clientId.
Retry the same owner/clientId with identical content; changed content is409.

## Optional local MongoDB

Use an isolated container named `field-notes-mongo`. A single-node replica set
is necessary because note creation and its replay event commit in a transaction.
This loopback-only development database has no production authentication setup:

```sh
docker run --detach --name field-notes-mongo --publish 127.0.0.1:27017:27017 mongo:8 --replSet rs0 --bind_ip_all
docker exec field-notes-mongo mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"127.0.0.1:27017"}]})'
docker exec field-notes-mongo mongosh --quiet --eval 'db.hello().isWritablePrimary'
```

Wait for true, stop the memory API, then use the same JWT_SECRET terminal:

```sh
export STORE_MODE=mongo
export MONGO_URL='mongodb://127.0.0.1:27017/field_notes_course?replicaSet=rs0'
npm run dev --workspace=@field-notes/api
```

The host process uses the advertised loopback address. A containerized API needs
a replica-set hostname resolvable inside its own network; do not reuse this URI
unchanged across network boundaries. Create a disposable demo account and note,
stop/start only the API, and confirm the note remains. This is a real Mongo test,
separate from the memory contract tests. To pause, `docker stop field-notes-mongo`;
to resume, `docker start field-notes-mongo`. Only remove that named disposable
container when intentionally resetting its data. Never target a shared database.

## Limits to understand

The API has bounded requests, fields and local rate counters, but no distributed
abuse system, account recovery, verification email, refresh-token revocation,
deployment approval mechanism or operational backup policy. Public notes and their
daily totals are not learner analytics. Event history retains creation snapshots
even when a note is updated/deleted; it is a teaching replay log, not an account
deletion implementation. Add retention, tombstones and a reviewed privacy design
before adapting it to private or real user information. Plain strings render as
text in clients; never insert note bodies using raw HTML.
