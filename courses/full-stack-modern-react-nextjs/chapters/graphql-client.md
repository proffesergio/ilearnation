# 13. GraphQL: client state and mutations

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Choose stable normalized cache keys.
- Reconcile a confirmed mutation without duplication.
- Keep errors and rollback visible.

## Prerequisites

Complete [GraphQL: a bounded server contract](graphql-api.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 60 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

A GraphQL client may store normalized records rather than independent copies of each query result. Stable identity lets one confirmed update refresh the places that refer to that record. A type name plus stable ID is a common identity pattern; an editable title is a poor key because changing the title can accidentally create a second record.

Optimistic UI shows an expected result before the server confirms it. It must remain visibly pending and reversible. On success, reconcile by identity rather than appending the response blindly. On failure, remove or undo the failed optimistic change while preserving unrelated confirmed data. An error is a normal state the learner must be able to understand and recover from.

Apollo Client provides mutation and cache tools, but cache updates still need to match application behavior. A network success does not automatically mean every related list is fresh. The checkpoint is a small local cache model. It does not instantiate Apollo, execute a GraphQL document, or perform network requests. Use it to reason about identity and rollback before adding a client library to your own project.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const cache = new Map();
const key = (note) => `${note.__typename}:${note.id}`;
const put = (note) => cache.set(key(note), { ...note });
put({ __typename: 'Note', id: '1', title: 'Before', pending: false });
put({ __typename: 'Note', id: '1', title: 'After', pending: false });
put({ __typename: 'Note', id: '1', title: 'After', pending: false });
assert.equal(cache.size, 1);
assert.equal(cache.get('Note:1').title, 'After');
put({ __typename: 'Note', id: 'temp-2', title: 'Draft', pending: true });
assert.equal(cache.size, 2);
function failOptimistic(id) { cache.delete(`Note:${id}`); return 'Saving failed. Retry.'; }
assert.equal(failOptimistic('temp-2'), 'Saving failed. Retry.');
assert.equal(cache.size, 1);
assert.equal(cache.get('Note:1').title, 'After');
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Reconcile a mutation.** An edited Note is confirmed twice; the cache must keep one updated record using type plus stable ID identity. A later optimistic creation fails: remove only that pending item and show an error. Choices: mutationPolicy "append"/"upsert", errorPolicy "hide"/"show".

1. Add a second confirmed note and prove rollback leaves it untouched. Test that a title change retains stable identity.
2. Model successful creation with a temporary ID: remove the temporary entry and merge the confirmed server ID. Assert there is exactly one final note.
3. Draw idle, pending, confirmed, and failed mutation states. Define when a retry is safe and whether the server needs an idempotency key to prevent duplicate creation.
4. Repair the online client lab. For an optional Apollo implementation, connect one query and mutation, write explicit cache update or invalidation behavior, and test a rejected mutation with a fake response.

The lesson player offers **GraphQL: client state and mutations** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Use a Map keyed by both type and ID to make duplicate confirmations converge.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Rollback should target the failed optimistic record, not clear the entire cache.

</details>

## Validation

Replay the same confirmation twice, change a title, and fail one optimistic mutation. Check the final record count and titles. Document which list invalidations a real client would need; this fixture proves only its local normalization model.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Appending every server confirmation and displaying duplicates.
- Keying records by a title or array index.
- Making pending text look permanently saved, then hiding the failure.

## Accessibility

Label pending and failed states in text, not just color. Keep a retry button reachable by keyboard and avoid duplicating live announcements when an identical confirmation arrives again. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Why does stable identity make repeated confirmations easier? How would you undo one optimistic update without losing another change that succeeded meanwhile? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Apollo GraphQL team, [Mutations in Apollo Client](https://www.apollographql.com/docs/react/data/mutations), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
