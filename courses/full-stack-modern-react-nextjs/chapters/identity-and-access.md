# 8. Identity, sessions, and access

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Separate authentication from authorization.
- Check ownership and expiry at the server boundary.
- Describe session and token exposure risks.

## Prerequisites

Complete [Data, validation, persistence, and identity](data-and-forms.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 60 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

Authentication establishes an identity. Authorization checks whether that identity may act on a particular resource. A signed-in learner is not allowed to read every learner's notebook. Start every protected request with trusted session verification, then apply an owner predicate at the data boundary. Check again for reads, updates, exports, and deletes; hiding a button provides no server protection.

A token that merely decodes is not necessarily valid. A production JWT verifier must enforce the configured signature algorithm, trusted issuer, intended audience, expiry, and key handling. A session library can reduce this work, but its database and cookie configuration still need review. This course does not teach writing cryptography or treating the model below as a production verifier.

A cookie containing session material should use appropriate HttpOnly, Secure, and SameSite settings, expiry, and rotation. HttpOnly prevents JavaScript access; it does not solve every injection or CSRF risk. Establish a CSRF strategy for cookie-authenticated writes. In this checkpoint an already-verified synthetic session is passed to the authorization function. There are no passwords, real tokens, or external identity requests.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const note = { id: 'n', ownerId: 'a', title: 'Private' };
function mayRead(verifiedSession, record, now) {
  return Boolean(verifiedSession && verifiedSession.expiresAt > now &&
    verifiedSession.userId === record.ownerId);
}
const now = 100;
assert.equal(mayRead({ userId: 'a', expiresAt: 200 }, note, now), true);
assert.equal(mayRead({ userId: 'b', expiresAt: 200 }, note, now), false);
assert.equal(mayRead({ userId: 'a', expiresAt: 100 }, note, now), false);
assert.equal(mayRead(null, note, now), false);
function read(session, body) {
  // body.userId is intentionally ignored: the body is not trusted identity.
  return mayRead(session, note, now) ? { title: note.title } : null;
}
assert.equal(read(null, { userId: 'a' }), null);
assert.deepEqual(read({ userId: 'a', expiresAt: 200 }, { userId: 'b' }),
  { title: 'Private' });
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Authorize each request.** Allow a valid owner session to read its note, while denying body-forged identity, expired sessions, and another owner. Session material must be inaccessible to page JavaScript. Choices: identitySource "body"/"session", cookieMode "javascript"/"httpOnly".

1. Add tests for a missing record and a malformed verified-session object. Fail closed without exposing a record title or throwing an internal exception.
2. Define an authorization matrix for owner, different user, anonymous visitor, and expired session across read, update, export, and delete. Use only synthetic identities.
3. Sketch the request pipeline: cookie → verified session → validated input → owner-scoped repository → safe response. Mark where CSRF checks and rate limits belong.
4. Repair the online access policy. Explain why its trusted session is a fixture, then list the production responsibilities a maintained authentication library would handle.

The lesson player offers **Identity, sessions, and access** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Pass trusted identity separately from untrusted request values.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Check the boundary case expiresAt equals now; expired means expired at that instant too.

</details>

## Validation

Run the full access matrix. Try a forged body user ID, a different record owner, and an expired session. Confirm all fail without private output. Review cookie and CSRF choices against current official guidance before integrating a real provider.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Trusting a browser-supplied owner ID.
- Decoding a JWT without verification or using a secret in a public environment variable.
- Treating noindex, client route guards, or disabled controls as authorization.

## Accessibility

Explain expired-session recovery clearly and preserve a local unsaved draft where appropriate. A sign-in screen needs labeled inputs and errors that describe the next action without revealing whether an account exists. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Where does trusted identity enter your code? Which operation could still leak data if you protected writes but forgot reads or exports? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Vercel Next.js team, [Authentication](https://nextjs.org/docs/app/guides/authentication), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
