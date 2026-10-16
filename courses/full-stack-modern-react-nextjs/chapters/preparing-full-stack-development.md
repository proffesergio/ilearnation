# Preparing for Full-Stack Development

> Chapter 1 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Distinguish browser, server, and storage responsibilities
- Install and run the four-workspace project
- Change a React heading and verify a production build

## Prerequisites

Recognize a basic HTML heading, a JavaScript function, and a folder path. If any are unfamiliar, use the setup guide and identify each in the source before changing it. [Previous step](../getting-started.md).

## Effort

Allow 60 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

A full-stack application crosses three boundaries: the browser describes an interface, a server enforces rules, and storage preserves records. A change is understood when you can predict which boundary it affects and observe the result. Field Notes is a public notebook of synthetic technical observations. It deliberately has a small domain so that networking, rendering, and authorization remain visible.

The repository contains a finished reference implementation. Work through it one small edit at a time rather than assuming that copying a working folder proves understanding. The SPA, SSR server, and Next.js app are alternative frontends to one API. Start only the SPA and API today; the other workspaces become relevant later. Node runs JavaScript outside the browser, while Vite transforms and serves browser modules. Neither tool is the database.

Formatting, linting, tests, and version control answer different questions. Formatting controls presentation; linting catches a class of suspicious patterns; tests compare behavior with expectations; Git records reviewable changes. A pre-commit hook can run selected checks, but it is bypassable and cannot replace CI. Keep early checks quick enough that you will run them.

## Step-by-step tutorial

```sh
git clone https://github.com/proffesergio/modern-fullstack-react-projects-building.git
cd modern-fullstack-react-projects-building/projects/field-notes
node --version
npm ci
```

1. Clone the dedicated course repository using the commands below. Open its projects/field-notes folder in an editor. Confirm that node --version reports v24 and npm --version works; install Node 24 before proceeding if it does not.

2. Run npm ci from projects/field-notes. It uses the reviewed package lock. Do not run npm install in each child workspace; one root install links all four.

3. Run npm test. Read one passing assertion in api/test/api.test.mjs and identify the request and the expected result. A failing assertion is information; fix the first reported problem before continuing.

4. Start npm run dev:api in one terminal and npm run dev:web in another. Check /health, then open http://127.0.0.1:5173. Keep the terminals visible so that a compilation error is not mistaken for a blank application.

5. In web/src/main.jsx, change the REST notebook heading to a sentence about what you are building. Save it, observe hot reload, and inspect the heading in browser accessibility tools. Do not rename functions or API fields yet.

6. Run npm run build --workspace=@field-notes/web. Commit only your heading edit after inspecting git diff. Optionally configure a formatter and a pre-commit hook for your own practice branch; the published project does not require a global hook.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `web/src/main.jsx`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test
npm run build --workspace=@field-notes/web
```

The page shows your changed heading, API health returns {"ok":true}, and the SPA production build succeeds. Identify the source file responsible for each result. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add one sentence explaining the notebook's synthetic public data beneath the heading. Keep a single h1 and verify the sentence at a narrow viewport. Write down what hot reload changed and what remained running.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `web/src/main.jsx`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Installing dependencies from the platform root instead of the project root targets the wrong workspace. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

The page shows your changed heading, API health returns {"ok":true}, and the SPA production build succeeds. Identify the source file responsible for each result. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Installing dependencies from the platform root instead of the project root targets the wrong workspace. A port in use means another process is already listening; stop that process in its terminal. A successful dev page does not establish that the production build works.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://vite.dev/guide/) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 1. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
