# Diving Deeper into Full-Stack Development

> Chapter 20 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Demonstrate the complete notebook lifecycle
- Collect negative, accessibility, and release evidence
- Write a retrospective and choose one next improvement

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](deploying-nextjs.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

You have followed one domain through files, HTTP, document storage, React state, server caches, authentication, server rendering, search metadata, browser tests, aggregation, GraphQL, event delivery, and Next.js boundaries. The useful skill is tracing a change across these layers and checking its consequences. A toolkit name or a passing configuration lab is weaker evidence than a working, explained failure case.

The capstone is a technical notebook that supports trustworthy public observations and authenticated writes. It is deliberately not a private diary. Public read behavior must be explicit to users, while modification remains author-scoped. A future private notebook would require query authorization, owner-scoped caches, private metadata, and retention/export/deletion design throughout every protocol. Document that scope rather than changing one visibility label.

Deeper study can follow several paths: TypeScript contracts plus runtime validation, relational and document modeling, domain boundaries, GraphQL batching, streaming rendering, distributed event processing, secure session lifecycle, accessibility, or production observability. Choose one based on a measured weakness in your project. More infrastructure is useful when it answers a demonstrated problem, not merely because it appears in another tutorial.

## Step-by-step tutorial

1. Create a fresh practice branch and run npm ci, npm test, npm run build, and npm run test:e2e. Record the commit and the meaningful assertions; do not copy credentials into evidence.

2. Demonstrate a synthetic note created through REST, read through GraphQL, confirmed through realtime history, and rendered by Next. Explain how these protocols share the same storage contract.

3. Show three negative cases: an invalid title creates no note, another actor cannot modify the note, and an API outage produces an honest error. Include expected and observed outcomes.

4. If you used real Mongo, restart the API and prove persistence. If not, state the memory-adapter lifetime clearly. Explain idempotency and replay using an observed duplicate operation or the adapter test.

5. Complete a keyboard-only narrow-screen pass and compare the chart's table values. Inspect initial HTML, canonical metadata, robots, and sitemap. Record issues and the smallest follow-up fixes.

6. Prepare a README with setup, architecture, test commands, public-data warning, configuration names, operating limits, deployment/rollback procedure, and a retrospective. Ask a peer to follow setup without private instructions.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `README.md`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test
npm run build
npm run test:e2e
```

Every capstone behavior has evidence and a stated scope. Passing course checkpoints alone is insufficient: include project execution, failure checks, accessibility observations, and an honest deployment/persistence status. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Choose one improvement, write an acceptance criterion, make a failing test or reproducible observation, implement the change, and show the improvement. Keep it small enough that you can explain its cross-layer consequences.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `README.md`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Adding features before checking the first user loop creates complexity without evidence. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

Every capstone behavior has evidence and a stated scope. Passing course checkpoints alone is insufficient: include project execution, failure checks, accessibility observations, and an honest deployment/persistence status. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Adding features before checking the first user loop creates complexity without evidence. Claiming production readiness from a local green build hides operating gaps. A copied screenshot is not a reproducible test. A retrospective should describe uncertainty as well as success.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://react.dev/learn/thinking-in-react) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 20. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.

## Conclusion

You can now trace a full-stack feature from an accessible input to validated server work, storage, rendering, tests, and release evidence. Keep the project small enough to explain, continue one measured improvement at a time, and use your retrospective to choose what to learn next. Your completed evidence is more useful than a list of tools.
