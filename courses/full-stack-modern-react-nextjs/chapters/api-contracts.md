# 5. APIs: make a small HTTP contract

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Map method and path to a request contract.
- Reject invalid data before writes.
- Test successful and unsuccessful HTTP outcomes.

## Prerequisites

Complete [Node.js and document data](node-and-data.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 55 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

An API contract tells a caller what to send and what outcomes mean. For a small note endpoint, choose POST to create, require a JSON title, and distinguish creation, invalid input, and unsupported methods. Keep the HTTP adapter thin: it parses a bounded request, invokes the service, then serializes a safe result. Express can provide routing middleware, while Node also has built-in HTTP primitives. Neither removes the need for input validation.

Think in observable effects. An invalid title should return a helpful error and leave storage unchanged. A valid title should create exactly one record with normalized text. A caught repository error must not become a false success response. Test the service separately from networking so a failure is easy to locate.

The checkpoint is a pure HTTP-shaped service, not a running Express server. It uses synthetic input and no ports. In a real adapter, check content type, body size, authentication, authorization, and rate limits before invoking the write. Do not return raw database exceptions or credentials. Use a consistent public error shape and a request identifier that does not contain learner text.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const writes = [];
async function endpoint({ method, body }) {
  if (method !== 'POST') return { status: 405, error: 'Use POST.' };
  if (!body || typeof body.title !== 'string' ||
      !body.title.trim() || body.title.length > 120) {
    return { status: 400, error: 'Enter a title of 1–120 characters.' };
  }
  const note = { id: String(writes.length + 1), title: body.title.trim() };
  writes.push(note);
  return { status: 201, note };
}
assert.equal((await endpoint({ method: 'GET', body: {} })).status, 405);
assert.equal((await endpoint({ method: 'POST', body: { title: ' ' } })).status, 400);
assert.equal(writes.length, 0);
assert.deepEqual(await endpoint({ method: 'POST', body: { title: ' Learn ' } }),
  { status: 201, note: { id: '1', title: 'Learn' } });
assert.equal(writes.length, 1);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Implement an HTTP contract.** Repair a note-creation HTTP contract. POST creates one normalized title with status 201. Blank or over-120-character titles return 400 without writing; other methods cannot create. Requests test all of those behaviors.

1. Add cases for absent body, numeric title, 120 characters, and 121 characters. Assert the number of writes after each rejected request.
2. Extract storage into an injected async repository. Make a rejected write return a safe 503 response and verify it never returns a created record.
3. Write a request/response table for POST /api/notes and GET /api/notes. Include unsupported method, missing identity, invalid input, empty result, and storage outage. Identify which cases the checkpoint does not yet implement.
4. Repair the online contract lab. Then describe how an Express route or Next.js Route Handler could call the same service without duplicating validation.

The lesson player offers **APIs: make a small HTTP contract** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Write the failure test before changing the service. The important observation is no write, not merely an error string.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Validate before awaiting storage. Return creation only after that await succeeds.

</details>

## Validation

Run the complete matrix. Temporarily remove the blank-title check and confirm a test fails, then restore it. Keep service evidence distinct from HTTP integration evidence; no socket, reverse proxy, or real database is tested here.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Returning status 200 for every outcome and forcing callers to guess.
- Testing only the happy path or asserting only that a response exists.
- Catching errors after already telling the caller that creation succeeded.

## Accessibility

Map an invalid-title response to the labeled title field. Keep the entered text on failure and announce the save status once without moving focus unexpectedly. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Which assertions would catch a bug that returns an error but still writes? What must a real HTTP adapter validate before this service receives a body? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Node.js contributors, [HTTP](https://nodejs.org/api/http.html), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
