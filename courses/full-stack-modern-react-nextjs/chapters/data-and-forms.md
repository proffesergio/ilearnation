# 7. Data, validation, persistence, and identity

Draft lesson · course version 0.2.0.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. It may finish while collapsed. The static diagram and text above contain the full meaning; no animation is needed.

</details>

## Objectives

- Validate untrusted form values before writing a record.
- Separate authentication from authorization.
- Explain what survives a refresh, a process restart, and an account change.

## Prerequisites

Complete [Asynchronous data and request races](async-data.md), and review any earlier topic you need. Use synthetic data and keep project credentials outside the lesson.

## Effort

45–65 minutes. Node.js 24 LTS for the checkpoint, no secrets or database service.
The application extension requires your existing Next.js project and a repository
adapter you control. No live authentication provider is required or implemented here.

## Concept

A form submits values across a trust boundary. A browser check improves feedback;
server validation protects the write. A hidden owner field is still user input.
Authentication establishes an identity; authorization decides whether that identity
may perform this action on this record. Recheck authorization for every protected
write and read. Do not infer permission from a disabled button.

Put storage behind a repository interface, such as `save(note)` and `list(owner)`.
An in-memory repository is useful for deterministic tests but loses data on process
restart. Browser storage belongs to the browser profile; it is not account storage
and may be unavailable or cleared. Real persistence needs an explicit retention,
export, deletion, and access policy before collecting learner data.

A Next.js Server Action can receive FormData from a form, but remains a server
entry point requiring input checks and authorization. Return understandable field
errors; do not return database exception strings or secret connection details.

## Runnable checkpoint

Save as `checkpoint.mjs` and run `node checkpoint.mjs`. The supplied actor models
an already-verified identity; never trust an actor sent by a browser in a real app.

```js
import assert from 'node:assert/strict';
async function saveNote(actor, input, repository) {
  if (!actor) return { ok: false, error: 'Sign in before saving.' };
  if (!input || typeof input.title !== 'string' || !input.title.trim() || input.title.length > 120) {
    return { ok: false, error: 'Enter a title of 1–120 characters.' };
  }
  const note = { ownerId: actor.id, title: input.title.trim() };
  await repository.save(note);
  return { ok: true, note };
}
const saved = [];
const repository = { save: async (note) => { saved.push(note); } };
assert.equal((await saveNote(null, { title: 'A' }, repository)).ok, false);
assert.equal((await saveNote({ id: 'demo' }, { title: ' ' }, repository)).ok, false);
assert.equal(saved.length, 0);
const result = await saveNote({ id: 'demo' }, { title: ' Learn ', ownerId: 'another' }, repository);
assert.deepEqual(result.note, { ownerId: 'demo', title: 'Learn' });
assert.equal(saved.length, 1);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Validate before saving.** Save a trimmed title of 1–120 characters for the verified actor. Forged input ownership must not be trusted. Blank/oversized input never writes, and a failed write keeps the draft. Choices: ownerSource "input"/"session", onFailure "clear"/"preserve".

The lesson player now includes the **data-and-forms** activity. Read its prompt, repair the failing starter, submit it, and inspect the behavioral checks. This activity uses a small JSON configuration to drive synthetic scenarios; it never executes your submitted code. Passing checks verifies only the bounded activity, not full framework competence. Reset restores the original failing starter; copy your work first if needed. Malformed or oversized input returns a repair message.

1. Add tests for an absent input object, a numeric title, and 121 characters.
2. Make repository failure return `{ ok: false, error: 'Saving failed. Try again.' }`.
   Test a rejecting repository before adding handling. Preserve the draft after failure.
3. In your app, create a labeled note form and a server action using the same
   validation rules. Use a fixed demo identity only in a clearly labeled local demo;
   it provides no real authorization. Develop real-account boundaries in the next
   identity lesson before connecting an actual account provider.
4. Design an owner-scoped read and delete interface. Write down the permission
   check and what happens when the owner requests export or deletion.

Reset: restore the original checkpoint; restarting it clears its in-memory fixture.
Do not run any production deletion or database migration for this exercise.

## Hints

<details>
<summary>Hint 1: verify no write happened</summary>

After each rejected request, check the length of `saved`. A helpful error should
not coexist with an accidental write.

</details>

<details>
<summary>Hint 2: contain storage failure</summary>

Wrap only the awaited repository call in appropriate error handling. Keep the
public message stable and log no submitted title or credentials.

</details>

## Validation

Run all Node assertions, including a rejected repository. In the app submit valid,
blank, and overly long titles. Verify the error is visible, the field is preserved
on failure, and the success message matches a recorded write. Restart your demo
and explicitly report whether records survive; memory storage is not durable.

## Common mistakes

- Accepting an owner ID from a hidden input as authorization.
- Relying on TypeScript or client validation to validate a server request.
- Claiming persistence because a component still shows a value before refresh.
- Clearing the form before a write succeeds, losing the learner's draft.

## Accessibility

Associate errors with their input using `aria-describedby`. State the problem and
repair in text. Preserve keyboard focus and provide an understandable save status.

## Reflection

Who supplies trusted identity? Which layer decides ownership? What evidence would
you need before describing your storage as durable and private?

## References

- Vercel Next.js team, [Forms with Server Actions](https://nextjs.org/docs/app/guides/forms), official reference, accessed 2026-10-16.
- See [source and rights records](../references.md).
