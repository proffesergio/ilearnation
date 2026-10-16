# 6. Asynchronous data and request races

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Represent loading, empty, success, and error states.
- Reject stale request results.
- Partition cache entries by owner.

## Prerequisites

Complete [APIs: make a small HTTP contract](api-contracts.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 50 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

A component may request data more than once: a learner changes a filter, retries a failure, or switches accounts. Requests can finish in a different order from the order they started. If an older result replaces a newer one, the screen lies about the current choice. Associate a request with its identity and accept a result only if it still belongs to the active request.

Server state has different responsibilities from a form draft. A server-state library such as TanStack Query uses query keys to identify cached data and exposes query states. Include all inputs that change the returned data. For private notes that includes the owner context; clearing or replacing caches on account changes is also necessary. A good query key does not replace server authorization.

Represent loading, success with rows, success with no rows, and failure explicitly. A background refresh failure can keep the last successful rows visible while showing that freshness is uncertain. Bound retries so an outage does not create an endless request loop. The checkpoint models result acceptance, not a network client or a full query library.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
let latest = 0;
let state = { status: 'idle', rows: [], error: null };
function begin() { latest += 1; state = { ...state, status: 'loading' }; return latest; }
function resolve(id, rows) {
  if (id !== latest) return;
  state = { status: rows.length ? 'success' : 'empty', rows, error: null };
}
function reject(id) {
  if (id !== latest) return;
  state = { ...state, status: 'error', error: 'Refresh failed. Try again.' };
}
const oldRequest = begin();
const newRequest = begin();
resolve(newRequest, ['Current']);
resolve(oldRequest, ['Stale']);
assert.deepEqual(state.rows, ['Current']);
const refresh = begin(); reject(refresh);
assert.equal(state.status, 'error');
assert.deepEqual(state.rows, ['Current']);
resolve(begin(), []);
assert.equal(state.status, 'empty');
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Handle a request race.** A newer notes request resolves before an older one. Preserve the current result, keep the last good rows if refresh fails, partition query keys by owner, and retry at most once. Choices: staleResponse "replace"/"ignore", failure "clear"/"preserve"; the owner placeholder in queryKey is "ownerId".

1. Add an assertion that an old request failure does not replace the current successful state.
2. Introduce an owner context and clear visible private rows when the owner changes. Verify a response started under owner a cannot populate owner b's view.
3. Draw four text UI states for a note list. Give the error state a retry action and mark previously loaded rows as possibly stale. Do not clear an unsaved form draft when a list refresh fails.
4. In the online lab, choose a scoped query key, ignore late results, preserve good data, and limit retry count. In a framework project, implement one query and test delayed and failed responses using fake network responses.

The lesson player offers **Asynchronous data and request races** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Store the current request number and compare it before either resolving or rejecting.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Cache identity and authorization solve different problems; a server still checks who can read the requested records.

</details>

## Validation

Run assertions with both response orders. Check empty success separately from failure. Simulate an owner switch and confirm no stale private title flashes into the new account. A passing synchronous model does not establish real abort behavior or browser cache isolation.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Assuming the last request started always finishes last.
- Using one cache key for all owners.
- Retrying forever or removing useful prior data without explaining a refresh failure.

## Accessibility

Expose a concise loading status and a keyboard-operable retry button. Keep the list usable while refreshing, and avoid announcing every internal request transition. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Why can canceling a request be useful without being sufficient to prevent stale UI? Which pieces of a query key reflect actual server inputs? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- TanStack Query contributors, [Queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
