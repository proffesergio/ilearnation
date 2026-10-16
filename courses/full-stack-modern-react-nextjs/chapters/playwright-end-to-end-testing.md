# Implementing End-to-End Tests Using Playwright

> Chapter 9 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Write role-based browser interactions
- Isolate synthetic test accounts and datasets
- Assert a rejected record remains absent

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](search-engine-optimization.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

A unit test isolates a small rule. An HTTP integration test exercises a boundary. An end-to-end browser test follows an observable learner or user journey across the interface and services. These layers complement each other. A browser test that merely sees a heading does not prove persistence, and a mocked network cannot prove the real API connection.

The course smoke test starts the actual API and Vite server, signs up a synthetic account, saves a note, visits GraphQL, and checks realtime delivery. It uses roles and labels so that interaction follows the accessible interface. Fixed sleeps are unreliable: wait for a visible result or an expected response instead. Browser contexts isolate cookies and storage, but the API dataset also needs a clear lifetime.

A failure report should show the failed assertion, relevant UI state, and bounded traces without exposing credentials. Keep synthetic accounts and data in tests. Do not point destructive fixture cleanup at a production service. A reproducible local failure is usually more useful than repeatedly increasing timeouts.

## Step-by-step tutorial

1. Read playwright.config.mjs and smoke.spec.mjs in the project root. Identify the two managed servers, their ports, and how test data becomes isolated.

2. Install the declared Playwright dependency with npm ci, then use npx playwright install chromium if your machine has no compatible browser. This downloads a browser; it does not require a cloud account.

3. Run npm run build once from the project root, then npm run test:e2e. Read the signup and save locators, then locate each corresponding label in web/src/main.jsx.

4. Change an expected note title in your local test so that it fails deliberately. Read the assertion output, restore the expectation, and rerun that test. Do not commit an intentionally broken test.

5. Add an invalid-title scenario: submit whitespace and assert both visible feedback and the absence of a newly created list item. Browser required validation alone does not reject whitespace.

6. Repeat the journey at a narrow viewport and use only the keyboard for authentication and note creation. Record focus issues separately from functional failures.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `smoke.spec.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm run test:e2e
```

The browser saves a note, reads it through GraphQL, and confirms a realtime event. The invalid write remains absent. No browser console error is dismissed without investigation. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Introduce a reusable fixture for a synthetic authenticated user in your fork. Keep setup and teardown explicit and demonstrate that a second isolated context does not inherit the first token.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `smoke.spec.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Selecting the second div ties tests to layout rather than behavior. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

The browser saves a note, reads it through GraphQL, and confirms a realtime event. The invalid write remains absent. No browser console error is dismissed without investigation. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Selecting the second div ties tests to layout rather than behavior. Catching and ignoring every page error hides broken code. Sleeping longer does not repair a wrong URL. Passing one Chromium flow is not a full accessibility or cross-browser certification.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://playwright.dev/docs/test-fixtures) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 9. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
