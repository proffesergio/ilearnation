# Improving the Load Time Using Server-Side Rendering

> Chapter 7 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Inspect content in initial HTML
- Trace safe data serialization and hydration
- Compare rendering behavior and measure its limits

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](jwt-authentication.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

A client-rendered page can initially contain only a shell. A server-rendered response can contain meaningful headings and note text before browser JavaScript runs. Hydration then attaches React behavior to matching markup. These are observable properties, not labels that guarantee speed. Network latency, server work, payload size, and client execution all affect the result.

The ssr workspace fetches the public notes on the server, renders the same App used by the client, and embeds a bounded data snapshot in an inert JSON script. Serialization escapes characters that could end a script element. The browser reads that snapshot and calls hydrateRoot. If server and client produce different initial content, React must recover from a mismatch and the intended interaction may break.

This project uses renderToString as a small baseline. React streaming and request-isolated TanStack prefetch/dehydration are further techniques. They introduce scheduling and cache-lifetime concerns and are not secretly implemented by calling a different frontend route. Do not share a request-specific query client across users on a server.

## Step-by-step tutorial

1. Create one public synthetic note using the SPA. Leave the API running. Build the SSR client with the command below and start npm run dev:ssr in another terminal.

2. Request http://127.0.0.1:5174 with curl. Find the note title in the initial response before opening a browser. Compare that response with the SPA's initial HTML.

3. Read ssr/src/server.mjs, App.mjs, client.mjs, and serialization.mjs. Trace data from API fetch to rendered HTML, inert JSON, and hydrateRoot.

4. Disable browser JavaScript and reload the SSR page. The note content should remain readable; enable JavaScript and test the small interaction. Distinguish content availability from hydration.

5. Stop the API and request the SSR page again. Expect 503 with an actionable explanation. Restart it and confirm recovery. The page must not report an empty successful notebook during an outage.

6. Measure a few reloads with the same network throttling settings. Record initial HTML availability and hydration separately, then explain the limits of a small local sample. Do not publish an invented performance improvement.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `ssr/src/server.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm run build --workspace=@field-notes/ssr
npm test --workspace=@field-notes/ssr
```

The initial document includes a note title, hydration has no console mismatch, and the script-breakout serialization test passes. API failure returns 503. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a short static description to App.mjs and verify it appears identically before and after hydration. Then describe the additional router/data integration needed to server-render a note-detail route.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `ssr/src/server.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Reading window during server rendering fails because it is a browser API. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

The initial document includes a note title, hydration has no console mismatch, and the script-breakout serialization test passes. API failure returns 503. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Reading window during server rendering fails because it is a browser API. Rendering a timestamp twice can cause a mismatch. Raw JSON is unsafe inside a script element without escaping. An SSR page can still be slow and must be measured.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://react.dev/reference/react-dom/client/hydrateRoot) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 7. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
