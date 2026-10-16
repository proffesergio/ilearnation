# Creating a Frontend to Consume and Send Events

> Chapter 14 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Manage socket effects and cleanup
- Merge live and history events by stable identity
- Explain disconnected, pending, and confirmed states

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](express-socketio-backend.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

A websocket connection carries events after the initial HTTP exchange. React effects own subscriptions whose lifetimes are independent of a render. Creating a socket during every render leaks connections and duplicate listeners. An effect should attach named handlers and return cleanup that removes those exact handlers and disconnects the socket.

Field Notes authenticates the connection with the current in-memory token. History and live messages can overlap during reconnect. mergeEvents reconciles them by eventId and sorts by sequence, so seeing the same committed event twice does not create two visible notes. A connected indicator means transport availability; it does not prove a particular write committed.

The supplied UI does not queue offline writes. It refuses them visibly. A timeout after send is ambiguous: storage may have committed even if the acknowledgement was lost. Synchronize history before deciding to create a new operation. A robust offline extension retains the same clientId for retries, bounds its queue, and shows pending, confirmed, and failed states separately. The browser configuration lab explores that extension; it does not imply the UI already implements it.

## Step-by-step tutorial

1. Start the API and SPA, sign in, and visit /live. Observe Connected. Read LiveNotes in web/src/main.jsx and identify setup, named handlers, and cleanup.

2. Create a live observation. Watch note:created and notes:history in the developer tools without recording token values. Compare their event IDs and sequence fields.

3. Navigate away and back several times, then submit once. Exactly one new item should appear. Inspect cleanup if it duplicates.

4. Open a second browser tab and sign in as the same synthetic account. Create a note in one tab and observe the other. A separate account must not receive the first account's scoped history.

5. Stop the API. Verify the UI explains disconnection and refuses a write without claiming it saved. Restart the server; remember that memory storage has reset. Reauthenticate if the new process rejects the old token.

6. Run the mergeEvents test. Extend it with history arriving after a live event and ensure the stable IDs deduplicate correctly.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `web/src/events.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test --workspace=@field-notes/web
npm run build --workspace=@field-notes/web
```

Reconnect and overlapping history do not duplicate visible events. Effect cleanup leaves one subscription per mounted realtime view. Offline submission produces an explanation. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Implement a small pending-operation state in your fork that retains one clientId until confirmation. Do not automatically create a new ID on a timeout. Add tests for duplicate acknowledgement and a full bounded queue before adding automatic offline replay.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `web/src/events.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Registering handlers without cleanup multiplies callbacks. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

Reconnect and overlapping history do not duplicate visible events. Effect cleanup leaves one subscription per mounted realtime view. Offline submission produces an explanation. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Registering handlers without cleanup multiplies callbacks. A new retry ID can create a second record. A timeout is not proof of failure. A transport reconnect does not restore a token invalidated by a restarted development process.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://socket.io/docs/v4/react) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 14. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
