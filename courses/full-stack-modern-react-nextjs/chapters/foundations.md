# 1. Foundations: make one observable change

Draft lesson · course version 0.2.0. Start from [the entry guide](../getting-started.md).

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. It may finish while collapsed. The static diagram and text above contain the full meaning; no animation is needed.

</details>

## Objectives

- Describe the browser, server, and file as different places where work happens.
- Run a JavaScript file and change an observable result.
- Connect a heading to a reusable React component in the course player.

## Prerequisites

Recognize an HTML heading, a JavaScript string, and a folder. If these are new,
write `<h1>Hello</h1>` in a text file named `hello.html` and open it in a browser.
Change Hello, refresh, and explain what changed. No account is needed.

## Effort

25–40 minutes, with breaks. Install a supported Node.js 24 LTS environment using
the [official Node site](https://nodejs.org/en/download); check `node --version`.
Use a text editor and a terminal in a private practice folder. Node 24.14.0 was
used for local course checks; no package installation is needed for checkpoints.

## Concept

A browser turns HTML into a document people can read and operate. CSS changes
presentation; JavaScript can update behavior. A server receives requests and
returns responses. A local file is a useful first checkpoint because you control
the input and can inspect the output before adding a network.

```text
edit file → run program → inspect result → change one thing → run again
```

React describes interface pieces as components. JSX is a syntax used inside a
React toolchain; a plain Node JavaScript file cannot directly render JSX. Our
first Node checkpoint practices the input/output loop. The website's
`first-component` exercise separately practices a small heading component with
controlled feedback; it does not run arbitrary code.

## Runnable checkpoint

Save this entire block as `checkpoint.mjs`, then run `node checkpoint.mjs`.

```js
import assert from 'node:assert/strict';
const learner = 'Sam';
function greeting(name) {
  return `Hello, ${name}!`;
}
assert.equal(greeting(learner), 'Hello, Sam!');
assert.equal(greeting('Ari'), 'Hello, Ari!');
console.log(greeting(learner));
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Your first component.** Change Welcome so its text-only h1 contains a sentence of at least 12 characters including “building”.

The lesson player now includes the **first-component** activity. Read its prompt, repair the failing starter, submit it, and inspect the behavioral checks. This first activity uses a bounded text-only JSX grammar. Passing checks verifies only the bounded activity, not full framework competence. Reset restores the original failing starter; copy your work first if needed. Malformed or oversized input returns a repair message.

1. Run the unchanged checkpoint. Record the exact greeting.
2. Change `learner` to a chosen nickname and update only the first expected
   greeting. Keep the Ari assertion: the function must still accept other names.
3. In the website course player, open the first component exercise. Change the
   heading as instructed, submit, inspect feedback, then use Reset once.
4. In a Next.js App Router practice project, a component such as the following
   belongs in `app/page.tsx`. This JSX example requires the project's React/Next
   compiler; it is not another Node checkpoint.

```tsx
export default function Page() {
  return <main><h1>My learning notebook</h1><p>One change at a time.</p></main>;
}
```

Reset: replace `checkpoint.mjs` with the original block above. Save your experiment
under another filename first if you want to keep it. Use the player Reset button
only when you want to replace that exercise's current source.

## Hints

<details>
<summary>Hint 1: find the input</summary>

`learner` holds the string passed to `greeting`. Change it before editing the function.

</details>

<details>
<summary>Hint 2: read a mismatch</summary>

An assertion error shows actual and expected strings. Spaces and punctuation count.
Keep expected text honest; do not remove assertions to make the check appear green.

</details>

## Validation

`node checkpoint.mjs` must print the chosen greeting and `Checkpoint passed`,
and exit successfully. Temporarily return a fixed name to verify that the Ari
assertion catches the mistake, then repair it. In the browser, confirm one main
heading and a changed visible result; running the Node file alone proves no React behavior.

## Common mistakes

- Running from a different folder: use your terminal's directory listing to find the file.
- Saving as `checkpoint.mjs.txt`: show filename extensions in your editor.
- Pasting JSX into Node: JSX needs the declared framework environment.
- Treating a failed check as failure of ability: it identifies a specific mismatch.

## Accessibility

Use a real `h1` for the page title, readable text, and keyboard-operable controls.
No animation, image, color, public profile, or precise location is required.

## Reflection

Which file did you edit, which program read it, and what evidence showed the change?
Explain why testing a second name tells you more than checking one greeting.

## References

- Node.js contributors, [Test runner](https://nodejs.org/api/test.html), official reference, accessed 2026-10-16.
- React team, [Your First Component](https://react.dev/learn/your-first-component), official reference, accessed 2026-10-16.
- See [source and rights records](../references.md). Examples here are original drafts.
