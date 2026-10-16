# 14. Realtime: authenticated server events

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Authorize every room event.
- Validate and bound message payloads.
- Acknowledge only successful durable writes.

## Prerequisites

Complete [GraphQL: client state and mutations](graphql-client.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 55 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

A realtime server receives events over a connection that may last longer than one HTTP request. Authenticate the connection, but also authorize each room and event. A user who belongs to one team cannot name another team's room and gain access. Recheck expiring membership or sessions according to your documented policy.

Validate message types and size before work. Derive actor identity from the verified connection context rather than trusting an actorId inside the payload. Separate validation, persistence, and delivery. A success acknowledgement should correspond to a committed write if the product promises a saved message. If storage fails, report a safe failure and leave the client able to retry with a stable ID.

Socket.IO preserves ordering for delivered events, while delivery guarantees require explicit application design. Do not assume a connected transport makes every message durable or exactly once. The checkpoint uses a fake repository and member list to expose ordering. It creates no socket server. A production integration additionally needs origin policy, rate limits, resource bounds, safe logs, and a deployment environment that supports the transport.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const log = [];
async function send(session, room, text, repository) {
  if (!session || !session.rooms.includes(room)) return { ok: false };
  if (typeof text !== 'string' || !text.trim() || text.length > 280) return { ok: false };
  try {
    await repository.save({ actor: session.id, room, text: text.trim() });
    log.push('ack'); return { ok: true };
  } catch { return { ok: false, error: 'Message not saved. Retry.' }; }
}
const repository = { save: async () => { log.push('persist'); } };
assert.equal((await send(null, 'team-a', 'Hello', repository)).ok, false);
const member = { id: 'a', rooms: ['team-a'] };
assert.equal((await send(member, 'team-b', 'Hello', repository)).ok, false);
assert.equal((await send(member, 'team-a', 'x'.repeat(281), repository)).ok, false);
assert.equal(log.length, 0);
assert.equal((await send(member, 'team-a', 'Hello', repository)).ok, true);
assert.deepEqual(log, ['persist', 'ack']);
const failing = { save: async () => { throw new Error('synthetic outage'); } };
assert.equal((await send(member, 'team-a', 'Again', failing)).ok, false);
assert.equal(log.length, 2);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Validate a live event.** Accept a room message of at most 280 characters only for a verified member. Payload identity is untrusted. A successful acknowledgement must mean storage committed; failure cannot be acknowledged as saved. Choices: actorSource "payload"/"session", roomPolicy "any"/"member", acknowledge "before-persist"/"after-persist".

1. Record the saved message and assert actor identity came from the session. Add a blank-message case and a 280-character boundary case.
2. Extend the fake session with expiry and test an expired member. Describe when a real connection must reauthenticate or disconnect.
3. Add a stable client event ID to the contract. Define acknowledgement success, failure, and timeout states; a timeout alone does not prove storage failed.
4. Repair the online realtime-server lab. Write a sequence diagram in your notes for validate → authorize → persist → acknowledge → broadcast, marking where a retry might occur.

The lesson player offers **Realtime: authenticated server events** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Membership belongs to trusted connection context; a room name in the payload is only a request.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Append acknowledgement to the trace only after awaited persistence succeeds.

</details>

## Validation

Assert no storage call for rejected input and no success acknowledgement after storage rejection. Check the trace order. State explicitly that no real Socket.IO connection or durable database was exercised by this checkpoint.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Authorizing only at connection time and trusting arbitrary room names later.
- Acknowledging before a write completes.
- Logging full message bodies or credentials while debugging a rejected event.

## Accessibility

Give message failures a persistent readable status and a retry action. Do not remove the draft on a rejected event or announce an acknowledgement as received when it was only queued. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

What does an acknowledgement promise in your design? If the network drops after persistence but before acknowledgement, how can the client retry safely? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Socket.IO contributors, [Delivery guarantees](https://socket.io/docs/v4/delivery-guarantees/), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
