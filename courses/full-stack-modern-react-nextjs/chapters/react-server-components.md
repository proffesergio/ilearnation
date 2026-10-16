# Introducing React Server Components

> Chapter 17 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Separate server data work from client interaction
- Send only serializable public props
- Validate actions and forward credentials server-side

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](getting-started-nextjs.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

A Server Component executes in the server environment and can fetch data without shipping its implementation to the browser. A Client Component provides event handlers and browser state. The use client directive creates a module boundary whose imported dependency graph must be appropriate for the browser. Server rendering and Server Components are related concepts with different responsibilities.

The original Next homepage reads public notes through a server-only API helper, then passes serializable note data to SearchNotes. The client receives public fields needed for filtering, not an API secret or database connection. Browser inspection is a useful check: hiding a field in CSS does not remove it from a serialized payload.

Server Actions process mutations through an explicit server boundary. The action validates untrusted FormData, reads an HttpOnly cookie, forwards the bearer token to the API, and revalidates affected paths after success. The API still verifies expiry and ownership. Cookie presence and an action identifier do not establish authorization. A failed action must not be described as a successful saved note.

## Step-by-step tutorial

1. Read next-app/lib/api.js and find the server-only import and explicit no-store fetch. Trace the homepage call to the public API.

2. Read app/search-notes.jsx and identify its use client boundary, local state, and serializable notes prop. Search by title and observe that filtering does not request the database from the browser.

3. Use the synthetic login form. Inspect cookie flags in browser storage, but do not copy the cookie value. Find where authenticate sets HttpOnly and production Secure flags.

4. Follow createNote in app/actions.js. Identify validation, cookie read, API request, error handling, revalidatePath, and redirect. Predict the outcome for a blank title and test it.

5. Inspect deleteNote and the backend owner check. Use the API integration test to prove another actor cannot delete a note even with a valid action request.

6. Build the Next app and inspect the browser network payload for public note fields. Confirm no JWT_SECRET, MONGO_URL, or password hash is serialized.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `next-app/app/actions.js`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test --workspace=@field-notes/next-app
npm run build --workspace=@field-notes/next-app
```

Search remains interactive, authenticated writes succeed, invalid writes fail, and server-only credentials are absent from browser payloads. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a labeled local counter beside the search field inside a small Client Component. Keep the page's data fetch on the server. Explain which code is added to the browser bundle and why.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `next-app/app/actions.js`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Marking an entire tree use client can pull unsuitable imports toward the browser. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

Search remains interactive, authenticated writes succeed, invalid writes fail, and server-only credentials are absent from browser payloads. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Marking an entire tree use client can pull unsuitable imports toward the browser. A server action is still a callable endpoint. A hidden ID input cannot prove record ownership. Serializing a token as a prop defeats HttpOnly storage.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 17. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
