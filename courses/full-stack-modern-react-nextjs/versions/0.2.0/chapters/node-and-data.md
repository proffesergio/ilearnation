# 4. Node.js and document data

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Distinguish asynchronous I/O from synchronous computation.
- Filter and project a synthetic document collection.
- Describe durable storage boundaries.

## Prerequisites

Complete [React: describe the next interface](react-components.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 55 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

Node.js runs JavaScript outside the browser. A server can wait for I/O, such as a database response, while other requests continue. That does not make an expensive synchronous loop harmless: JavaScript work still occupies its execution thread. Keep this distinction when deciding whether an endpoint needs a background job.

A document database stores records with fields and nested values. Start a data model from the questions your app must answer. For the notebook, “show my latest two titles” needs an owner filter, a stable ordering, a limit, and a projection. Filtering after limiting can produce an incomplete page; projecting every stored field can expose private data. MongoDB supports document modeling, but this exercise deliberately uses an array so no database account is needed.

The model below makes ownership visible. Its actor is a trusted test fixture; a real server obtains identity from its verified session. An array survives only until this process ends. A real MongoDB collection or SQL table needs an adapter, credentials stored on the server, access controls, backups, deletion rules, and tests. The platform's Neon/PostgreSQL implementation is a separate storage choice; learning document modeling does not require switching the platform database.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const documents = [
  { id: 'n1', ownerId: 'a', title: 'First', created: 1, secret: 'local' },
  { id: 'n2', ownerId: 'b', title: 'Other', created: 4, secret: 'local' },
  { id: 'n3', ownerId: 'a', title: 'Latest', created: 3, secret: 'local' },
  { id: 'n4', ownerId: 'a', title: 'Middle', created: 2, secret: 'local' },
];
async function listTitles(actor, limit = 2) {
  if (!actor) return [];
  return documents.filter((note) => note.ownerId === actor.id)
    .toSorted((a, b) => b.created - a.created || a.id.localeCompare(b.id))
    .slice(0, limit).map(({ id, title }) => ({ id, title }));
}
assert.deepEqual(await listTitles({ id: 'a' }), [
  { id: 'n3', title: 'Latest' }, { id: 'n4', title: 'Middle' },
]);
assert.deepEqual(await listTitles(null), []);
assert.equal(documents[0].id, 'n1');
assert.equal(Object.hasOwn((await listTitles({ id: 'a' }))[0], 'secret'), false);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Scope a document repository.** Query a synthetic notebook collection for the current owner: return only the two latest records, with their IDs and titles. The stored actor field is ownerId. Choose sort "oldest" or "newest" and a projection that cannot reveal the secret field.

1. Run the checkpoint, then add a second document with the same creation time. Specify and test a deterministic ID tie-breaker.
2. Reject a limit outside 1–20 before reading; add tests for zero, a fraction, and a string. A limit is still untrusted input.
3. Sketch a repository interface with list, create, and delete. Mark the owner predicate in each method. Translate the list operation into a MongoDB filter/sort/projection on paper, or into a parameterized SQL query; do not open a cloud account.
4. In the online lab, repair the document query policy. Explain why ownership must be applied before pagination.

The lesson player offers **Node.js and document data** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Apply the owner filter before sorting or limiting. Copy or use toSorted so the source array stays unchanged.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Return new objects containing only id and title; projection is part of the privacy boundary.

</details>

## Validation

Run every assertion and your invalid-limit tests. Verify the result has exactly two safe fields and never includes owner b. Restart the process and explain why this fixture is not durable. If you implement a real adapter later, run the same contract tests against it before claiming equivalent behavior.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Sorting the shared source array in place and surprising another request.
- Reading all records and filtering ownership only in the browser.
- Calling a local array a database or presenting a successful query as proof of backup/recovery.

## Accessibility

Present the latest notes as a semantic list with descriptive titles. State empty and loading results in text; do not imply an empty list is an authentication error. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Which predicate prevents another learner's record from appearing? What changes when this process restarts? Which tests could stay unchanged if you replaced MongoDB with SQL? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Node.js contributors, [The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), official primary documentation, accessed 2026-10-16; link only.
- MongoDB documentation team, [Data Modeling in MongoDB](https://www.mongodb.com/docs/manual/data-modeling/), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
