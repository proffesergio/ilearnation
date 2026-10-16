# Adding Persistence to Socket.IO Using MongoDB

> Chapter 15 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Persist note and event in a Mongo transaction
- Scope idempotency by author and client ID
- Replay author-scoped history using bounded cursors

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](realtime-react-frontend.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

Realtime delivery and durable storage have different guarantees. A client can disconnect between commit and acknowledgement. To survive that case, store a stable operation identity with the note and its event. The uniqueness boundary is authorId plus clientId: one person's retry must not collide with another person's operation.

The Mongo adapter writes a note and event inside a transaction on a replica set. It allocates an increasing sequence for replay and acknowledges only after commit. A duplicate retry with identical content returns the prior result; changed content under the same operation ID is a conflict. This is application-level idempotency, not a claim that the transport provides exactly-once delivery.

History is scoped to the verified author and pages forward after a cursor. A numeric sequence is an ordering device, not proof of authorization. Bounded pages prevent a reconnect from demanding an unlimited response. Gaps in global sequence values are acceptable when a user's history excludes other authors. Retention, deleted records, and long-disconnected clients require explicit production policies beyond this teaching log.

## Step-by-step tutorial

1. Read createMongoStore in api/src/store.mjs. Locate the unique operation index, transaction boundary, sequence allocation, and note/event write. Compare with the in-memory contract.

2. Run the adapter tests. Identify the duplicate retry, changed-content conflict, and 103-event pagination cases. Explain why a cursor must keep advancing across a full page.

3. If Docker is available, initialize rs0 using the README and start the API in mongo mode. Confirm it is PRIMARY before creating a live note.

4. Send a note from /live, restart the API without deleting the Mongo volume, sign in again, and confirm the history returns it. This establishes a persistence observation on your host, unlike the default unit tests.

5. Use the test fixture or a small local client to submit the same author/clientId twice. Expect one note and the same committed event. Change its content and expect a conflict.

6. Inspect history for a second account and confirm no first-account event is returned. Record a proposed retention and resynchronization policy before considering a public service.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `api/src/store.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test --workspace=@field-notes/api
```

Memory-adapter contract tests pass. If Mongo is available, a service restart preserves the note and duplicate retries do not add records. Mark optional steps honestly when unrun. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a test where two authors use the same clientId. Both operations should exist, while each author sees only their own replay. Then describe how a deleted note should appear during a future reconnect.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `api/src/store.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

A standalone Mongo instance cannot run these transactions. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

Memory-adapter contract tests pass. If Mongo is available, a service restart preserves the note and duplicate retries do not add records. Mark optional steps honestly when unrun. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

A standalone Mongo instance cannot run these transactions. Emitting before commit can announce nonexistent records. A global clientId unique index can conflate different people. Deleting Docker volumes to fix a connection error destroys the evidence you are trying to inspect.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://www.mongodb.com/docs/manual/core/transactions/) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 15. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
