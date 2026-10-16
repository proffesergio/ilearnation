# Implementing a Backend Using Express, Mongoose ODM, and Jest

> Chapter 3 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Trace an Express request through validation and storage
- Define HTTP success and failure contracts
- Write Jest/Supertest cases for rejected writes

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](nodejs-and-mongodb.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

An HTTP contract specifies a method, path, input, success representation, and failure behavior. A route translates that contract into application work. The repository adapter handles records. Keeping them separate lets tests send actual HTTP requests through Express while using deterministic storage. This establishes more than a function returning the expected string, and less than a real Mongo deployment test.

Mongoose schemas describe stored document fields and validation. A unique index is a database constraint, not a substitute for catching duplicate errors. The application still validates untrusted values before calling storage. Unknown ownership fields are rejected: the verified actor, rather than a hidden form input, decides who authored a write. Authentication details arrive in chapter 6; use the provided test fixture today.

REST CRUD follows distinct outcomes. POST returns 201 only after a valid write. Reading a missing note returns 404. Invalid input returns 400 without a record. Another author's update or deletion returns 403. Driver failures become a generic unavailable response rather than leaking connection details. Express 5 forwards rejected asynchronous handlers to error middleware, but expected domain errors still need deliberate status mapping.

## Step-by-step tutorial

1. Run the API tests and read the test named health, public list, signup, login and normalized creation form a real HTTP loop. Identify its arrange, act, and assert stages.

2. In api/src/store.mjs locate noteInput. Compare blank, 120-character, and 121-character titles. Find the Mongoose note schema and explain which layer normalizes whitespace.

3. In api/src/app.mjs follow POST /api/notes from bearer verification through validation to storage and response. Draw that path before editing.

4. Add a Jest/Supertest case beside the existing tests: create a note with leading and trailing spaces, then GET its ID and verify the normalized title. Use the fixture's synthetic account rather than a hardcoded live token.

5. Add a failing request with a forged authorId. Assert its status is 400 and that GET /api/notes has no corresponding record. This checks a negative outcome, not merely an error message.

6. Trace PUT and DELETE owner checks. Run the existing two-account test. Then request a missing ID and confirm 404. Keep public reads and authenticated writes explicit in your notes.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `api/src/app.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test --workspace=@field-notes/api
npm run check --workspace=@field-notes/api
```

All HTTP tests pass, including the newly added boundary case. A rejected request changes neither the note count nor stored text. No passwordHash or database URI appears in responses. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Extend the list-query tests with a limit of zero and a nonnumeric limit. Decide the expected status first, then implement or confirm the existing validation. Add one valid search case as a control.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `api/src/app.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Testing only the happy path misses unauthorized writes. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

All HTTP tests pass, including the newly added boundary case. A rejected request changes neither the note count nor stored text. No passwordHash or database URI appears in responses. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Testing only the happy path misses unauthorized writes. Mocking Express itself removes the HTTP boundary you are trying to test. Catching every exception and returning 200 hides outages. An in-memory passing test cannot prove Mongo indexes or transactions behave correctly.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://expressjs.com/en/5x/api/) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 3. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
