# Adding Authentication with JWT

> Chapter 6 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Explain hashing, signed claims, authentication, and authorization
- Verify JWT algorithm, issuer, audience, and expiry
- Prove another actor cannot modify a note

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](docker-and-cicd.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

Authentication establishes an actor; authorization decides what that actor may do. A JWT consists of a protected header, claims, and a signature. Decoding its payload is not verification. The API constrains the accepted algorithm, issuer, audience, required claims, and expiry, then confirms that the subject still names an account. The author of a note comes from this verified actor.

Passwords are not encrypted for later recovery. The original project uses asynchronous scrypt with a random salt and timing-safe comparison. Request bounds and a teaching rate limit reduce accidental overload, but a public service also needs a shared abuse-control strategy, account recovery, and operational monitoring. Neither a token nor an email should be logged to explain a routine failed request.

The SPA keeps its bearer token in memory. Reloading clears it, so the learner signs in again. That is an intentional tradeoff in a small teaching app. The Next app later uses an HttpOnly cookie and server-side forwarding. Local logout removes the current client token but does not invalidate every previously issued JWT; expiry is fifteen minutes. A revocation design is an explicit further exercise.

## Step-by-step tutorial

1. Start the API and SPA. Sign up with a synthetic address and a unique password of at least 12 characters. Save a note and inspect only header names, not token values, in your notes.

2. Read api/src/auth.mjs. Find salt generation, scrypt derivation, signing, and jwtVerify. Write down the issuer, audience, algorithm, and expiry duration. Do not change cryptographic parameters casually.

3. Reload the SPA and observe that the token is cleared. Log in again and verify a successful authenticated POST. Compare this with a POST without Authorization: it must be rejected.

4. Create a second synthetic account in an isolated browser session. Attempt an update of the first account's note using a terminal client or the existing automated test. Expect 403 and unchanged content.

5. Run the JWT expiry/issuer/audience test and inspect how each forged or invalid token is signed. This demonstrates that a plausible-looking token is insufficient.

6. Trace logout, query cache clearing, and Socket.IO disconnection. Identify which credentials remain valid server-side until expiry. Write a short revocation proposal rather than claiming logout already revokes all tokens.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `api/src/auth.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test --workspace=@field-notes/api
```

Valid login permits a write; missing, expired, wrong-issuer, and wrong-audience tokens fail. A second account cannot update or delete the first account's note. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a test for a modified token signature. Confirm it receives 401 and no record is created. Then document how a server-held session or token revocation list would change logout behavior.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `api/src/auth.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Trusting a body authorId bypasses ownership. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

Valid login permits a write; missing, expired, wrong-issuer, and wrong-audience tokens fail. A second account cannot update or delete the first account's note. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Trusting a body authorId bypasses ownership. A JWT signature does not encrypt its payload. A long-lived token in browser storage changes the exposure model. A Secure cookie cannot be used over arbitrary plain HTTP deployments.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://nodejs.org/docs/latest-v24.x/api/crypto.html) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 6. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
