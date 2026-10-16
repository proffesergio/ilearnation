# 18. Caching, invalidation, and performance

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Choose cache identity and shared-cache policy.
- Reproduce and fix a stale read.
- Measure a budget without inventing performance claims.

## Prerequisites

Complete [Next.js: routes and execution boundaries](nextjs-routing.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 60 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

Caching trades repeated work for a freshness problem. First name the data, the audience, and the validity period. A cache key must include every input that can change the result. For owner-scoped notes, an ID without the owner context can collide. Shared HTTP caching is inappropriate for private personalized responses unless a carefully reviewed policy makes the boundary explicit.

After a confirmed write, update or invalidate affected cache entries. Test the read → write → read sequence; a successful write followed by an old title is a user-visible failure. Next.js has several caching mechanisms whose behavior depends on the APIs and configuration in use. Follow the current documentation and the project's pinned version rather than assuming every fetch is cached or uncached.

Performance work also needs measurement. Choose a modest budget for optional assets and record actual transfer sizes in a real browser. A dependency-free model can enforce a numerical budget, but it does not measure network timing, main-thread work, or Core Web Vitals. Keep the learning flow functional without optional animation or heavyweight assets, especially on phones and low-bandwidth connections.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const database = new Map([['a:1', 'Before'], ['b:1', 'Other owner']]);
const cache = new Map();
const key = (ownerId, noteId) => `${ownerId}:${noteId}`;
function read(ownerId, noteId) {
  const id = key(ownerId, noteId);
  if (!cache.has(id)) cache.set(id, database.get(id));
  return cache.get(id);
}
function write(ownerId, noteId, title) {
  const id = key(ownerId, noteId); database.set(id, title); cache.delete(id);
}
assert.equal(read('a', '1'), 'Before');
assert.equal(read('b', '1'), 'Other owner');
write('a', '1', 'After');
assert.equal(read('a', '1'), 'After');
assert.equal(read('b', '1'), 'Other owner');
const fitsOptionalBudget = (kilobytes) => Number.isFinite(kilobytes) && kilobytes >= 0 && kilobytes <= 150;
assert.equal(fitsOptionalBudget(80), true);
assert.equal(fitsOptionalBudget(180), false);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Invalidate a scoped cache.** Two owners may have the same note ID. Isolate their private cache entries, prevent shared HTTP caching, and make a confirmed write visible on the next read. Enforce the exercise's 150 KB optional-asset budget. Key placeholders: "ownerId", "noteId"; privatePolicy: "public"/"no-store".

1. Add tests for deleting a note and invalidating its cache entry. Make missing records distinguishable from unavailable storage.
2. Introduce two list caches and identify which one a note write affects. Test the smallest sufficient invalidation instead of clearing every user's cache.
3. For a local page, record initial transferred bytes and the largest optional asset using browser tools. Compare with the lab's 150 KB optional asset budget, clearly labeling this as a course exercise policy rather than a universal target.
4. Repair the online caching lab. In a Next.js extension, document which server data is cached, which private responses use no-store, and how a successful write makes the next read fresh. Use APIs supported by your pinned version.

The lesson player offers **Caching, invalidation, and performance** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

A cache key describes the full request identity, including the owner.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Invalidate only after a committed write; invalidating a failed write does not make it successful.

</details>

## Validation

Run two-owner read/write/read and delete cases. Check that the other owner's cache remains correct. Measure real bytes separately from the synthetic budget check; do not report simulated values as achieved page performance.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Caching private data under only a record ID.
- Invalidating a detail view while leaving the containing list stale.
- Calling a model's budget check a measured network improvement.

## Accessibility

Keep essential content available while optional assets load. Reserve layout space for images and avoid moving focused controls when cached or fresh data arrives. Respect reduced motion in any project animation. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Which user-visible read would reveal stale data after a write? What evidence distinguishes a smaller asset from an actually faster experience on a slow phone? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Vercel Next.js team, [Caching](https://nextjs.org/docs/app/getting-started/caching), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
