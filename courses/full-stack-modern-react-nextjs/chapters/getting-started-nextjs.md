# Getting Started with Next.js

> Chapter 16 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Use App Router pages, layouts, and dynamic params
- Handle loading, errors, and missing records
- Build and start the Next application

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](mongodb-event-persistence.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

Next.js combines routing, rendering, data access, and build tooling around React. In App Router, a layout wraps nested pages and persists across navigation. A page owns a route's primary content. Folder names define path segments, and [id] receives a dynamic value. Loading, error, and not-found files describe specific states rather than serving as generic success pages.

The course's Next workspace is a second frontend to the same API, so you can compare architecture without changing domains. The homepage fetches public notes on the server. A detail page handles a missing record explicitly. A Route Handler exposes a small JSON boundary. Metadata, robots, and sitemap functions describe public content for crawlers.

The installed Next 16 version uses asynchronous request APIs. Await params, searchParams, and cookies where the code needs them. A tutorial from an older framework version may show different signatures or caching defaults. The provided lockfile and original examples define this course version; check official migration notes before changing the dependency version.

## Step-by-step tutorial

1. Copy next-app/.env.example to next-app/.env.local and leave the API running. Run npm run dev:next, then open http://127.0.0.1:3001.

2. Read app/layout.jsx and app/page.jsx. Identify the shared shell, the homepage fetch, and the server-rendered note list. Compare the initial response with the SPA.

3. Open a note-detail link and inspect app/notes/[id]/page.jsx. Find the awaited params and missing-note branch. Change the ID to a nonexistent value and observe the real not-found page.

4. Visit /api/notes on the Next server. Trace its Route Handler to the backend API. Compare this boundary with directly exposing a database connection to the browser.

5. Inspect loading.jsx and error.jsx. Stop the API and observe the homepage recovery text. Restore the API and reload.

6. Build the workspace, stop the dev process, and start its production server. Compare route behavior in both modes before considering deployment.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `next-app/app/layout.jsx`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm run build --workspace=@field-notes/next-app
npm test --workspace=@field-notes/next-app
```

Homepage and detail routes render real synthetic notes, a nonexistent ID receives not-found behavior, and the production build succeeds. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a short public /about page in your practice branch and link it from the layout. Give it a distinct title. Verify the shared shell remains present when navigating between pages.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `next-app/app/layout.jsx`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Importing browser hooks into a server page without a client boundary fails. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

Homepage and detail routes render real synthetic notes, a nonexistent ID receives not-found behavior, and the production build succeeds. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Importing browser hooks into a server page without a client boundary fails. Treating params as a synchronous object ignores the installed API. A missing record should not be an empty successful article. Do not expose MONGO_URL through a public frontend environment variable.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 16. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
