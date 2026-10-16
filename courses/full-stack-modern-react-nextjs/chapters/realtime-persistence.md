# 16. Realtime: durable replay and retention

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Persist before acknowledging an event.
- Replay after a stable sequence cursor.
- Apply owner and retention limits to reads.

## Prerequisites

Complete [Realtime: reconnect and reconcile](realtime-client.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 60 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

Durable realtime behavior combines a write contract with a replay contract. Assign each committed event a stable sequence or cursor. A reconnecting client asks for events after its last confirmed cursor. Replaying an inclusive cursor can repeat the last event; a client should still deduplicate because delivery can repeat for other reasons.

A client event ID makes retries idempotent only if storage enforces its uniqueness at the correct scope. Two different owners may legitimately generate the same local client ID. In a real database, use an appropriate unique constraint and transaction; a check-then-insert sequence in application memory can race. Persist before acknowledging, and define how ordering works across multiple writers.

Retention changes what can be replayed. Apply the same owner and retention policies to history reads as to live delivery. A client whose cursor predates retained history needs an explicit resynchronization response rather than an invented complete history. The checkpoint is a deterministic in-memory event log. It demonstrates filters and identity but cannot establish actual disk durability or concurrent database safety.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const events = [];
function append(ownerId, clientId, ageDays) {
  const prior = events.find((event) => event.ownerId === ownerId && event.clientId === clientId);
  if (prior) return prior;
  const event = { ownerId, clientId, ageDays, sequence: events.length + 1 };
  events.push(event); return event;
}
append('a', 'm1', 2); append('a', 'm1', 2); append('b', 'm1', 2);
append('a', 'm2', 2); append('a', 'old', 31); append('a', 'm3', 1);
assert.equal(events.length, 5);
function replay(ownerId, after) {
  return events.filter((event) => event.ownerId === ownerId &&
    event.sequence > after && event.ageDays <= 30)
    .toSorted((a, b) => a.sequence - b.sequence);
}
assert.deepEqual(replay('a', 2).map((event) => event.sequence), [3, 5]);
assert.deepEqual(replay('b', 0).map((event) => event.sequence), [2]);
assert.deepEqual(replay('unknown', 0), []);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Replay a durable event log.** A retry must write once per owner/client-ID pair, without conflating different owners. Replay this owner's retained events strictly after cursor 2, using a 30-day retention window and chronological sequence order. order choices: "descending"/"ascending".

1. Add boundary tests for age 30 and age 31, and for a cursor equal to the last retained sequence.
2. Define a page size and stable next cursor. Test that replaying two pages neither skips nor repeats a committed event under your chosen snapshot semantics.
3. Write a database design with an owner/client-ID unique constraint, transaction boundary, ordered sequence, and deletion job. Explain why the in-memory find-then-push implementation is insufficient under concurrent writers.
4. Repair the online persistence lab. Add a text response for a cursor older than retained history and describe a full resynchronization path without exposing another owner's records.

The lesson player offers **Realtime: durable replay and retention** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

The uniqueness key has two parts: owner and client event ID.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Apply ownership, strict greater-than cursor, and retention before sorting and limiting.

</details>

## Validation

Run duplicate, cross-owner, cursor, and retention cases. Inspect replay output and assert sequences are ascending. If you later use a real database, add concurrent retry and restart tests before using the word durable for that implementation.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Using a globally unique client ID when clients only guarantee per-owner uniqueness.
- Promising exactly-once delivery because a socket usually works.
- Keeping expired records in a replay cache after a deletion or consent change.

## Accessibility

Offer a Load earlier messages button with a clear result count and retention notice. Keep reading position stable when history is inserted, and provide a list alternative to animated live updates. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

What can the server promise if the requested cursor is older than retention? Which guarantees require a database constraint rather than an application-level check? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Socket.IO contributors, [Delivery guarantees](https://socket.io/docs/v4/delivery-guarantees/), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
