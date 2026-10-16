# 2. JavaScript data and TypeScript contracts

Draft lesson · course version 0.1.0.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. It may finish while collapsed. The static diagram and text above contain the full meaning; no animation is needed.

</details>

## Objectives

- Transform an array without changing the original records.
- Distinguish static types from runtime validation.
- Test missing, invalid, and successful inputs.

## Prerequisites

Complete [Foundations](foundations.md). Recognize objects, arrays, functions, and
`true`/`false`. A JavaScript object groups named values; an array preserves an order.

## Effort

35–50 minutes. Node.js 24 LTS, terminal, and editor; no packages or secrets.
The TypeScript illustration requires a TypeScript-enabled project to typecheck.

## Concept

A learning notebook might contain records with an ID, title, and completion flag.
Keeping the original records unchanged makes later changes easier to explain.
`filter` chooses records; `map` transforms them. A function that returns a value
from its arguments without modifying outside state is straightforward to test.

TypeScript can describe what code expects, but incoming JSON can violate that
description. Static checking catches mistakes while developing. Runtime checks
decide whether actual values meet your application's rules. You need both when
accepting untrusted data. A type assertion does not clean or validate input.

```ts
type Note = { id: string; title: string; done: boolean };
function titles(notes: Note[]): string[] {
  return notes.filter((note) => !note.done).map((note) => note.title);
}
```

## Runnable checkpoint

Save as `checkpoint.mjs` and run `node checkpoint.mjs`.

```js
import assert from 'node:assert/strict';
function openTitles(notes) {
  if (!Array.isArray(notes)) throw new TypeError('Expected a list');
  for (const note of notes) {
    if (!note || typeof note.title !== 'string' || typeof note.done !== 'boolean') {
      throw new TypeError('Each note needs a title and boolean done');
    }
  }
  return notes.filter((note) => !note.done).map((note) => note.title);
}
const notes = [{ title: 'Read a lesson', done: false }, { title: 'Rest', done: true }];
const before = structuredClone(notes);
assert.deepEqual(openTitles(notes), ['Read a lesson']);
assert.deepEqual(openTitles([]), []);
assert.throws(() => openTitles([{ title: 'Try', done: 'false' }]), TypeError);
assert.deepEqual(notes, before);
console.log('Checkpoint passed');
```

## Exercise

1. Add a second unfinished note and update the expected list in order.
2. Before implementing, add an assertion that a blank title is rejected.
3. Add a runtime check using `trim()` so spaces alone are invalid; keep displayed
   titles unchanged. Describe why the string `'false'` must not mean a boolean.
4. In your TypeScript project, change `done` to a string and read the diagnostic.
   Restore the type, then explain what still needs runtime validation.

Reset: copy the original checkpoint block into your practice file.

## Hints

<details>
<summary>Hint 1: inspect each record</summary>

Extend the existing invalid-record condition rather than filtering invalid records away.
Silently dropping input would hide a useful error.

</details>

<details>
<summary>Hint 2: validate before transforming</summary>

Check `typeof note.title` before calling `note.title.trim()`. A missing title has
no string methods. Empty trimmed text has length zero.

</details>

## Validation

Run `node checkpoint.mjs`; all assertions must pass. First confirm the new blank
title assertion fails before adding the check. Preserve the original-data assertion
and the invalid-boolean case. Your TypeScript compiler should separately accept
the corrected type example; Node's JavaScript check does not prove type safety.

## Common mistakes

- Using `notes.sort()` while claiming not to mutate: it changes the array.
- Treating every nonempty string as true: `'false'` is still a nonempty string.
- Using `as Note` on remote JSON: it changes checking assumptions, not the data.

## Accessibility

Use meaningful record titles and understandable error text. Do not report invalid
records only through a red icon; provide words and preserve the user's work.

## Reflection

Where should a TypeScript diagnostic appear, and where should a runtime input
error appear? Which assertion proves that your transformation preserved its input?

## References

- Microsoft TypeScript team, [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), official reference, accessed 2026-10-16.
- See [source and rights records](../references.md).
