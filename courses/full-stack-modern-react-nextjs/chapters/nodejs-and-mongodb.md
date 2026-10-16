# Getting to Know Node.js and MongoDB

> Chapter 2 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Compare Node and browser capabilities
- Explain asynchronous I/O and document query order
- Test memory lifetimes and optional Mongo persistence

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](preparing-full-stack-development.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

Browser JavaScript has a document and browser storage; Node has files, processes, sockets, and server APIs. The shared language does not make their capabilities interchangeable. An asynchronous read lets the event loop handle other work while the operating system performs I/O. CPU-heavy synchronous work still blocks that loop. Awaiting a promise does not create a second JavaScript thread.

A document groups related fields. A note has an ID, title, body, author ID, slug, and creation time. Design fields around actual reads and writes. A query combines filtering, ordering, projection, and limits; applying a limit before the correct filter can hide valid results. Indexes help selected access patterns but add write and storage costs. They do not grant authorization.

The default adapter keeps maps in memory so that learners can run immediately. MongoDB provides a separate durable implementation. Containers package a process and its filesystem dependencies, while a volume retains database files independently of a disposable container. A replica set also enables the transactions used by the event log in chapter 15. This local setup is bound to loopback and is unsuitable for an exposed database.

## Step-by-step tutorial

1. Read api/src/server.mjs. Mark where the HTTP server starts and where the adapter is selected. Follow createMemoryStore into api/src/store.mjs; find listNotes and its search/sort/limit order.

2. With the API running, request /health and /api/notes using curl. Compare status, headers, and JSON. Change the query to /api/notes?sort=oldest&limit=1; note that an empty list is a valid result.

3. Create a short Node script named inspect-runtime.mjs with console.log(typeof document, typeof process). Run node inspect-runtime.mjs. The outputs undefined and object demonstrate the runtime boundary without a framework.

4. If you have Docker, run docker compose up -d mongo and initialize rs0 using the exact one-time command in the project README. Wait until db.hello().isWritablePrimary is true. If Docker is unavailable, continue with the memory adapter and mark persistence as untested.

5. Open mongosh through docker compose exec mongo mongosh. Use db.getName(), show dbs, and db.notes.find().limit(3) in the intended fieldnotes database. An empty collection before writes is expected; database selection matters.

6. Restart the API with STORE_MODE=mongo and the README's local MONGO_URL. Write a synthetic note using the SPA, stop and restart only the API, then verify the record remains. Record this result separately from memory-adapter tests.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `api/src/store.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test --workspace=@field-notes/api
```

Default tests pass without Docker. If you chose Mongo, a restart preserves the note; record your actual database command and observed result without credentials. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a projection in a local investigation script that returns only id and title. Compare its output with the full public note representation and explain why password hashes must never be part of either response.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `api/src/store.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

A container's health check can pass before a replica set elects a primary. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

Default tests pass without Docker. If you chose Mongo, a restart preserves the note; record your actual database command and observed result without credentials. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

A container's health check can pass before a replica set elects a primary. A host URI and an in-container URI name different networks. Deleting a volume removes data; restarting a process does not. Never use a public bind address as a shortcut for local connection problems.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://nodejs.org/docs/latest-v24.x/api/fs.html) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 2. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
