# Making Sure Customers Find You with Search Engine Optimization

> Chapter 8 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Design meaningful slugs and trusted canonical URLs
- Inspect title, social, robots, and sitemap metadata
- Separate public discovery from authorization

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](server-side-rendering.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

Search engines need useful public content and links they can follow. Rendering a title in initial HTML makes it available without requiring an interactive session. A human-readable slug describes a resource; a canonical URL declares its preferred public address. It should come from a trusted configured origin rather than an untrusted incoming Host header. Changing a slug also requires preserving old links through redirects.

A robots file communicates crawl preferences. It does not authenticate a request or prevent a determined visitor from fetching a URL. Private routes require server authorization and normally noindex metadata; they should not appear in a public sitemap. A sitemap lists actual canonical public pages rather than every route pattern in the application.

Social preview metadata and structured data describe the visible content. They must not invent ratings, instructors, accreditation, or availability. English content can serve the US, UK, and worldwide without duplicate country pages. Publish locale-specific pages only when they contain real local value. Helpful original tutorials, maintained links, and understandable navigation matter more than stuffing geographic keywords.

## Step-by-step tutorial

1. Inspect the SSR head with curl. Find title and description, then compare them with the visible h1. Add a useful title rather than a list of keywords.

2. Read the note slug creation in api/src/store.mjs. Create two notes with the same title and verify their identifiers remain distinct. Explain why a slug is a location convenience rather than an authorization boundary.

3. Inspect next-app/app/notes/[id]/page.jsx, layout.jsx, sitemap.js, and robots.js as a preview of chapter 16. The Next workspace supplies the real per-note canonical and social metadata implementation.

4. Choose an origin for a local metadata test. Confirm the resulting canonical has one scheme, hostname, and path with no session query parameters. Do not derive production canonical URLs from arbitrary request headers.

5. Compare this platform's public course overview and first three chapters with its gated account pages. Check that the sitemap includes the previews and excludes dashboard/profile routes.

6. Write a five-page publishing checklist for your own notebook: public homepage, one note, missing note, sign-in, and private account route. For each specify status, title, canonical, robots, and authorization behavior.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `next-app/app/sitemap.js`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm run build --workspace=@field-notes/next-app
```

The course public previews have descriptive initial HTML and canonical URLs. Your checklist distinguishes discovery preferences from access control and contains no fabricated review markup. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add an Open Graph description to a public note-detail page using its validated public content. Test a missing note and confirm it receives a real not-found response rather than a successful empty page.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `next-app/app/sitemap.js`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

robots.txt is not a security control. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

The course public previews have descriptive initial HTML and canonical URLs. Your checklist distinguishes discovery preferences from access control and contains no fabricated review markup. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

robots.txt is not a security control. A canonical to an unrelated origin can confuse discovery. A sitemap with private or nonexistent pages gives poor signals. No metadata setting guarantees indexing, a ranking position, US/UK traffic, or AdSense approval.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 8. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
