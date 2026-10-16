# 17. Next.js: routes and execution boundaries

Draft lesson · course version 0.2.0.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. It may finish while collapsed. The static diagram and text above contain the full meaning; no animation is needed.

</details>

## Objectives

- Map an App Router folder to a URL and a shared layout.
- Choose a server or client boundary for a concrete requirement.
- Represent loading, missing-data, and failure states explicitly.

## Prerequisites

Complete [Realtime: durable replay and retention](realtime-persistence.md), and review any earlier topic you need. Use synthetic data and keep project credentials outside the lesson.

## Effort

40–60 minutes. The checkpoint needs Node.js 24 LTS only. Route rendering requires
an existing Next.js App Router project. Follow its locked installation instructions;
read the [official setup guide](https://nextjs.org/docs/app/getting-started/installation)
if no project exists. A full framework installation is separate from this checkpoint.

## Concept

App Router uses folders for route segments. `app/notes/page.tsx` supplies `/notes`;
`app/layout.tsx` wraps its routes. Components are server components by default
in App Router. A component needing browser events, state, or browser APIs needs
a client boundary. The `'use client'` directive marks an entry point; it does not
make that component a secure place for secrets.

Fetch protected data on the server and pass only safe, serializable values to
interactive children. A loading message tells someone work continues; an empty
result tells them the request finished with no records. They are different states.

```text
/notes request → server page reads data → safe props → interactive client child
                                      → empty / ready / recoverable error
```

In a Next.js project, create `app/notes/page.tsx`:

```tsx
export default async function NotesPage() {
  const notes = await Promise.resolve([{ id: 'one', title: 'Learn a boundary' }]);
  return <main><h1>Notes</h1><ul>{notes.map((note) =>
    <li key={note.id}>{note.title}</li>)}</ul></main>;
}
```

This is local fixture data, not a remote fetch or authentication example. A sibling
`loading.tsx` can provide a short text fallback during real suspended work.

## Runnable checkpoint

Save as `checkpoint.mjs` and run `node checkpoint.mjs`. This models a data boundary;
it deliberately does not imitate the Next.js router.

```js
import assert from 'node:assert/strict';
async function loadNotes(repository) {
  try {
    const notes = await repository.list();
    return { status: notes.length ? 'ready' : 'empty', notes };
  } catch {
    return { status: 'error', notes: [], message: 'Notes could not be loaded. Try again.' };
  }
}
assert.equal((await loadNotes({ list: async () => [] })).status, 'empty');
assert.equal((await loadNotes({ list: async () => [{ id: 'one' }] })).status, 'ready');
assert.equal((await loadNotes({ list: async () => { throw new Error('internal detail'); } })).status, 'error');
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Place the component boundary.** Keep database access out of the browser and place stateful click handling in the interactive component. Serialize the note ID and title without its database URL. An absent note needs a not-found response. Component choices: "server"/"client"; missingRoute: "empty-success"/"not-found".

The lesson player now includes the **nextjs-routing** activity. Read its prompt, repair the failing starter, submit it, and inspect the behavioral checks. This activity uses a small JSON configuration to drive synthetic scenarios; it never executes your submitted code. Passing checks verifies only the bounded activity, not full framework competence. Reset restores the original failing starter; copy your work first if needed. Malformed or oversized input returns a repair message.

1. Add a test asserting that internal exception text never appears in the returned error.
2. In your project, add a navigation link to `/notes` and visit it directly as well.
3. Replace fixture data with a repository function returning an empty array. Render
   a readable empty state with a next action, then simulate a thrown error.
4. Add the counter from chapter 3 as a client child. Keep the page on the server.
   Write down which values cross the boundary and why each is safe.

Reset: restore the original checkpoint and remove only the route files you added
for this exercise. Do not delete a pre-existing app directory.

## Hints

<details>
<summary>Hint 1: choose a boundary by need</summary>

Reading a database does not require a client component. Handling an input's
`onChange` requires an interactive client component.

</details>

<details>
<summary>Hint 2: inspect the public error</summary>

Serialize the returned error object and assert it does not include `internal detail`.
Preserve useful user-facing text without exposing implementation details.

</details>

## Validation

Run the Node checkpoint. In the app, visit `/notes` through navigation and a fresh
URL load. Confirm ready and empty messages, test the simulated failure, and check
the browser bundle/props contain no secrets. Restore a successful repository. A
Node assertion does not prove routing or framework hydration; check both paths.

## Common mistakes

- Adding `'use client'` to every page to silence an error rather than locating the event.
- Passing a database connection or credential as a component prop.
- Presenting an empty collection as an endless loading spinner.

## Accessibility

Keep route titles meaningful. Use native links for navigation and readable loading
text. Test keyboard navigation and focus after changing routes in your actual app.

## Reflection

Which part of your notes page needs browser JavaScript? If the repository fails,
what can the learner do next, and what information should remain private?

## References

- Vercel Next.js team, [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), official reference, accessed 2026-10-16.
- Vercel Next.js team, [Installation](https://nextjs.org/docs/app/getting-started/installation), official reference, accessed 2026-10-16.
- See [source and rights records](../references.md).
