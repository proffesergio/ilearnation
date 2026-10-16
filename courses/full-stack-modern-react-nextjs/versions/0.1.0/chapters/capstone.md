# 8. Capstone: a private learning notebook

Draft lesson · course version 0.1.0. This is a project brief with a tested planning
checkpoint, not a claim that completing the checkpoint creates a full-stack app.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. It may finish while collapsed. The static diagram and text above contain the full meaning; no animation is needed.

</details>

## Objectives

- Combine routes, React interactions, server validation, and persistence in a small app.
- Present test evidence, accessibility review, and honest limitations.
- Plan deployment and describe a useful next iteration without publishing by default.

## Prerequisites

Complete chapters 1–7 and retain your checkpoint experiments. You need an existing
Next.js App Router practice project and a reviewed local persistence adapter for
the full project. The planning checkpoint itself requires only Node.js 24 LTS.

## Effort

Four to eight focused sessions of 45–60 minutes, adjusted to your experience. Work
locally with synthetic notes. No paid service, secret API, account, or public post
is required. Ask a trusted reviewer to assess the draft if possible.

## Concept

Choose a useful, bounded outcome: a person records a learning note, finds it later,
edits it, and deletes it. Each route, field, and status should serve that loop.
A thin vertical slice reaches from a control to validated storage and back to
visible feedback. Build that before dashboards or social competition.

```text
list notes → open note → edit labeled form → server checks → repository
     ↑                                      ↓
     └────────── visible saved result ←──────┘
```

Define storage behavior before implementing. A local JSON file adapter can support
a single-process demo if writes are serialized and errors are handled. It is not a
production multi-user database. If using a different local database, document its
locked setup and reset commands. Use a replaceable repository interface and test
it with an isolated temporary store. Never share a server-writable file publicly.

## Runnable checkpoint

Save as `checkpoint.mjs` and run `node checkpoint.mjs`. The evidence list is a local
planning tool; passing it does not verify that those artifacts are truthful.

```js
import assert from 'node:assert/strict';
const required = ['routes', 'forms', 'validation', 'persistence', 'tests', 'accessibility', 'security', 'release-plan', 'readme', 'retrospective'];
function missingEvidence(artifacts) {
  return required.filter((name) => typeof artifacts[name] !== 'string' || !artifacts[name].trim());
}
assert.deepEqual(missingEvidence({}), required);
const evidence = Object.fromEntries(required.map((name) => [name, `local-evidence/${name}.md`]));
assert.deepEqual(missingEvidence(evidence), []);
assert.deepEqual(missingEvidence({ ...evidence, tests: ' ' }), ['tests']);
console.log('Checkpoint passed');
```

## Exercise

1. Write three acceptance scenarios before implementation: save a valid note and
   see it after restart; reject a blank title without writing; delete a note and
   confirm it cannot be retrieved. Use no personal or sensitive data.
2. Create `/notes` and `/notes/[id]`, a shared layout, and visible navigation.
   Fetch through the server repository; handle loading, empty, not-found, and error states.
3. Build labeled create/edit forms with a small client component where interaction
   requires it. Validate again at the server boundary. Add owner checks to every
   protected action if identity exists; otherwise label the app a single-user local demo.
4. Implement local persistence with test isolation and a deliberate reset action.
   Verify restart behavior; do not substitute component state for a stored record.
5. Test validation, repository read/write/delete, and one full browser learning loop.
   Review keyboard use, contrast, mobile layout, motion, and recoverable errors.
6. Write a README with setup, exact checks, data location, deletion, known limits,
   and deployment concepts. Include rollback and secret-injection plans without
   actually deploying. Write a retrospective with one mistake and one next experiment.

Reset: restore the planning checkpoint. For the application, use only your adapter's
documented local test-store reset after confirming the store path. Preserve the
project source and never run a reset against live or shared data.

## Hints

<details>
<summary>Hint 1: keep the first slice small</summary>

Start with one fixed demo owner and one valid note. Test the server write and
repository read before adding edit, delete, or an attractive dashboard.

</details>

<details>
<summary>Hint 2: collect real evidence</summary>

An evidence entry should point to a test result, reproducible review, or real file.
Write “not implemented” for gaps. Do not fill the list with fictional passing results.

</details>

## Validation

Run the planning checkpoint, your app's test suite, and its production build.
Complete all three acceptance scenarios in a fresh local session, including a
process restart. Reproduce a storage failure and recover without losing a draft.
Have another person follow the README where feasible. Record exact commands and
results. A missing feature keeps the project in draft; no automated score grants
mastery, a credential, employment, or income.

## Common mistakes

- Building accounts, teams, or rankings before one complete note workflow.
- Marking evidence complete because a filename exists.
- Treating a single-user file store as production-ready multi-user persistence.
- Publishing real notes or a deployment URL without reviewing privacy and approval.

## Accessibility

The full loop must work with a keyboard and at mobile widths. Preserve text
alternatives, label errors, keep focus predictable after delete, and test status
announcements. Record unresolved barriers so reviewers can reproduce them.

## Reflection

Which behavior can you demonstrate, which is supported only by a design note,
and which remains unbuilt? What is the smallest next experiment that would help
a real learner complete their work?

## References

- Vercel Next.js team, [Forms with Server Actions](https://nextjs.org/docs/app/guides/forms), official reference, accessed 2026-10-16.
- W3C Web Accessibility Initiative, [Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/), official reference, accessed 2026-10-16.
- See [source and rights records](../references.md).
