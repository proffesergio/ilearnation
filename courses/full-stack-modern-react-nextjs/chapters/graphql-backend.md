# Building a Backend with a GraphQL API

## Objectives

- Define GraphQL fields and resolver context
- Execute named queries and authenticated mutations
- Explain workload bounds and authorization limits

## Prerequisites

Complete chapters 1–10. You should be able to start the API, create a synthetic account, and explain why the server derives `authorId` from a verified session. You need Node.js 24, the installed Field Notes workspace, and a terminal. GraphQL does not require a hosted service or an Apollo account.

## Effort

Allow 75–100 minutes: 20 for the model, 35 for requests and resolver inspection, and 20–45 for the exercise and negative checks.

## Concept

A REST endpoint typically chooses a response representation. A GraphQL operation chooses fields from a server-defined schema. Both still need storage, validation, authorization, and operational limits. GraphQL is a language and execution contract; it does not make a database public or choose access rules for you.

Our application exposes a `Note` with `id`, `title`, `body`, `slug`, `authorId`, and `createdAt`. `Query.notes` lists notes; `Query.note(id: ID!)` reads one; `Mutation.createNote(title: String!, body: String!)` creates one. An exclamation mark prohibits null at that position. It does not prohibit an empty string. The shared note service must still reject blank or oversized text.

Resolvers connect schema fields to application behavior. A resolver receives arguments and a request context. Authentication belongs in that context and the service boundary, rather than in a client-provided author argument. REST and GraphQL should call the same service so that an attacker cannot bypass a restriction by changing protocols.

A response can contain an `errors` array as well as `data`. Inspect both transport status and the GraphQL envelope. Treat a successful HTTP exchange as evidence that a response arrived, then inspect whether the requested operation succeeded. Named operations make traces easier to understand without recording sensitive variables.

## Step-by-step tutorial

1. From `projects/field-notes`, start the API in one terminal:

   ```sh
   npm run dev --workspace=@field-notes/api
   ```

   Leave it running. Check `http://127.0.0.1:4000/health` before debugging GraphQL.

2. Send this named query from a second terminal:

   ```sh
   curl -s http://127.0.0.1:4000/graphql \
     -H 'Content-Type: application/json' \
     --data '{"query":"query NotebookTitles { notes { id title } }"}'
   ```

   Expect a JSON object containing `data.notes`. Its entries contain the fields you selected. An empty array is valid before creating notes. Compare this with `GET /api/notes`: REST wraps the array in `notes`; GraphQL wraps operation results in `data`.

3. Request `unknownField` under `notes`. Expect an error rather than silently missing data. Restore `id title`, then add `body`. This demonstrates that the schema constrains the selection and the selection controls the result.

4. Read `api/src/app.mjs` and the note service it invokes. Locate the type declaration, root resolvers, context construction, and call that verifies a bearer token. Follow the create path until you find where `authorId` is assigned. Write those file/function names in your notebook.

5. In the browser SPA, sign up using a synthetic email and a unique practice password of at least 12 characters. Visit `/graphql` and create a note titled `Resolver boundary`. The original application uses variables:

   ```graphql
   mutation CreateNote($title: String!, $body: String!) {
     createNote(title: $title, body: $body) {
       id
       title
       body
     }
   }
   ```

   The variables object is ordinary JSON, such as `{"title":"Resolver boundary","body":"The server assigns authorship."}`. Keep query structure separate from user values. The UI forwards the in-memory bearer token through the authorization header; it does not persist it in browser storage.

6. Remove authorization from a mutation in a disposable terminal client. Expect a denied operation and no new record. Then send an empty title with an authenticated request. That must fail too, for a different reason. Read errors without copying session tokens into notes, screenshots, or commits.

A fragment names a reusable selection, for example `fragment Summary on Note { id title }`. Aliases rename response fields, allowing two differently parameterized reads in one operation. Introspection describes the schema; it does not grant authorization. Nested relations introduce potential N+1 database calls. This small schema avoids that relation rather than pretending a loader is unnecessary at scale.

## Runnable checkpoint

Run `npm test --workspace=@field-notes/api`, then repeat `NotebookTitles`. Open the SPA at `http://127.0.0.1:5173/graphql` with the API running. The browser activity in iLearnNation is a bounded contract simulation; this workspace runs an actual HTTP GraphQL endpoint and stores actual synthetic records.

## Exercise

Add createdAt to the named SPA notes query without introducing a fragment. This bounded teaching API deliberately rejects fragments. Keep mutations authenticated. Record valid-query, unknown-field, and unauthenticated-mutation outcomes.

## Hints

<details><summary>Hint 1: Find the query</summary>

The NOTES constant in web/src/main.jsx contains the selection. Add one existing scalar field.

</details>

<details><summary>Hint 2: Keep the workload bounded</summary>

The API accepts one operation and rejects fragment definitions. Record this implementation limit.

</details>

## Validation

The query returns selected fields and unauthorized creation does not increase the count. Run npm run build --workspace=@field-notes/web.
Reset: undo only your query edit or revert your own practice commit.

## Common mistakes

Using GraphQL strings as SQL-like templates mixes structure and data. Use variables. Making a mutation field public because its name is obscure creates an authorization bug. Returning internal database errors can expose details. Adding arbitrary nested relations without query limits creates workload amplification. A schema is a public contract, so changing a required field or removing a selection needs a compatibility plan.

## Accessibility

Keep GraphQL loading and failure text visible. A disabled submit control needs adjacent explanation; do not rely on the button color to communicate why writing is unavailable. Confirm errors can be read with keyboard focus remaining on the form.

## Reflection

Which constraints did GraphQL enforce before a resolver ran? Which constraints required the application service? Explain why moving `authorId` into mutation variables would weaken the design.

## References

- [GraphQL queries and variables](https://graphql.org/learn/queries/) — GraphQL Foundation, checked 2026-10-16.
- [GraphQL authorization](https://graphql.org/learn/authorization/) — GraphQL Foundation, current reference; follow the shared service boundary.
- Daniel Bugl, *Modern Full-Stack React Projects*, supplied reference, chapter 11. Topic sequence informs this original adaptation; book prose and project code are not redistributed.

- [Current primary documentation](https://graphql.org/learn/security/) — checked 2026-10-16.

Course version 0.3.0 · original public review edition.
