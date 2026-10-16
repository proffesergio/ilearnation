# Integrating a Frontend Using React and TanStack Query

> Chapter 4 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Separate form state from server state
- Use query identity and mutation invalidation
- Add labeled search and sort controls

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](express-mongoose-and-jest.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

React renders a description from props and state. Events request transitions; they do not directly modify the previous render. Server state introduces another lifetime: a remote record may change independently of local input. TanStack Query owns fetching, cached responses, pending/error states, and invalidation. A form draft remains local until storage confirms a successful write.

The original SPA intentionally keeps notes public and tokens in memory. Its ['notes'] key therefore identifies a public collection. If you extend it to private collections, include the verified owner in query identity and clear the cache on account changes. A bearer token is not a suitable cache key. A mutation must await the write and then invalidate the affected query; clearing the form before a failed request would discard useful work.

Filtering and sorting are part of query identity. A search result cannot reuse a cache entry for a different search simply because both render the same component. Retry policies also need context: a transient read failure may be retried, while an unauthorized write needs an account action. Loading, empty, success, and failure should all produce understandable text.

## Step-by-step tutorial

1. Start the API and SPA using the chapter 1 commands. Open web/src/main.jsx and find QueryClientProvider, RestNotes, NoteList, and NoteForm. Draw their containment and data flow.

2. Observe the empty state before creating notes. Use the synthetic sign-up form, then save two different titles. Inspect the network request and the subsequent invalidated GET.

3. Stop the API and attempt another save. The draft should remain visible and an error should appear. Restart the API and explain why memory mode has lost prior records.

4. Add a labeled search control. Put its value in both the query key ['notes', search, sort] and the request URL, encoding query values. Start with no debounce so the behavior is visible.

5. Add a sort select with newest and oldest options, and forward it to the server. Keep search and sort controlled React values. Verify changing sort changes both the network URL and result order.

6. Run the production build, then inspect the invalidation after creation. If you changed the base query key, invalidate the notes prefix so all related list queries can refresh.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `web/src/main.jsx`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm run build --workspace=@field-notes/web
npm test --workspace=@field-notes/web
```

A successful save appears in the list, a failed save retains its draft, and each search/sort combination has an appropriate query key. Check the network panel rather than relying on a visual impression. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a clear-search button that restores the empty search value without reloading the document. Verify keyboard focus and that the server receives the restored query. Document how a stale response is handled by the query library.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `web/src/main.jsx`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Mutating an array from query data can corrupt shared cached state. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

A successful save appears in the list, a failed save retains its draft, and each search/sort combination has an appropriate query key. Check the network panel rather than relying on a visual impression. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Mutating an array from query data can corrupt shared cached state. Treating every error as an empty list hides outages. Omitting search from the key can display stale results. Persisting the demo token in localStorage increases exposure and changes the course's stated security model.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://tanstack.com/query/latest/docs/framework/react/guides/queries) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 4. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
