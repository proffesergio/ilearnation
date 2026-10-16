# 15. Realtime: reconnect and reconcile

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Represent connected, pending, offline, and failed states.
- Apply bounded backpressure.
- Reconcile duplicate message delivery.

## Prerequisites

Complete [Realtime: authenticated server events](realtime-server.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 55 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

A live client needs more states than connected and disconnected. A learner can type while offline, queue a message, wait for confirmation, receive a failure, and reconnect. Make these states visible without claiming a queued message is saved. Bound the queue so a long outage cannot consume unbounded memory or replay a surprise burst of work.

Give each outbound event a stable client ID. Reusing that ID on retry lets the server recognize an already committed event. Creating a new ID for every retry defeats idempotency. Deduplicate inbound confirmations or replayed events by stable identity so reconnect does not duplicate the visible conversation.

Socket.IO can buffer events while disconnected; applications still need to choose whether to queue, reject, or drop particular event types. A temporary typing indicator and a durable learning note have different delivery needs. The checkpoint models three pending messages and repeated confirmation. It does not test a browser connection, socket recovery, or server persistence. Those need separate integration tests and a documented delivery contract.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const queue = [];
function enqueue(id, text) {
  if (queue.length >= 3) return { ok: false, error: 'Queue full. Reconnect before sending.' };
  queue.push({ id, text, status: 'pending' }); return { ok: true };
}
for (let n = 1; n <= 3; n++) assert.equal(enqueue(`m${n}`, `Note ${n}`).ok, true);
assert.equal(enqueue('m4', 'Fourth').ok, false);
const outgoing = queue.map((message) => ({ ...message }));
assert.deepEqual(outgoing.map((m) => m.id), ['m1', 'm2', 'm3']);
const visible = new Map();
function confirm(message) {
  visible.set(message.id, { ...message, status: 'saved' });
  const index = queue.findIndex((pending) => pending.id === message.id);
  if (index >= 0) queue.splice(index, 1);
}
for (const message of [...outgoing, ...outgoing]) confirm(message);
assert.equal(visible.size, 3);
assert.equal(queue.length, 0);
assert.equal(visible.get('m1').status, 'saved');
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Reconnect without duplicate messages.** Five sends occur offline. Queue the first three and report full capacity for the others. Reconnect retries must preserve identity so repeated confirmations yield exactly three visible messages. Choices: offline "drop"/"queue", retry "new-id"/"same-id".

1. Add a connection-state variable and prevent sending while offline. Keep queued messages pending until explicit confirmation.
2. Model one failed acknowledgement and retry it with the same ID. Verify a later duplicate confirmation still produces one visible message.
3. Add an owner-switch operation that clears or securely partitions the queue. An offline message from account a must not be sent as account b.
4. Repair the online reconnect lab. In a framework extension, use fake transport events to exercise offline, reconnect, full queue, pending, saved, and failed states before adding a real socket.

The lesson player offers **Realtime: reconnect and reconcile** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Keep retry identity separate from the number of attempts.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Use a keyed collection for confirmed messages and remove a pending item only after its confirmation.

</details>

## Validation

Send five messages offline and confirm only three are queued with explicit full-queue feedback for the others. Deliver confirmations twice and check visible count, pending count, and IDs. Verify the owner-switch case separately.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Giving every retry a new event ID.
- Silently dropping a message while showing success.
- Leaving another account's pending private messages in a shared browser queue.

## Accessibility

Use text such as Offline, Pending, Saved, and Failed alongside icons. Avoid rapid connection-status announcements, preserve composition focus, and let the learner retry using a normal button. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Which events should be queued and which may be safely dropped? What should happen when a learner changes accounts before reconnecting? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Socket.IO contributors, [Offline behavior](https://socket.io/docs/v4/client-offline-behavior/), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
