# 11. Learning insights without surveillance

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Define a minimal event contract.
- Count distinct consented learners.
- Label chart limits and data freshness.

## Prerequisites

Complete [Quality: prove behavior and include people](quality-accessibility-security.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 55 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

A chart is a transformation of events, not direct evidence of a person's ability. Define a minimal event contract before collecting anything: event ID, course version, coarse day, action, and consent context may be enough for a practice count. Do not collect exact location, sensitive traits, or submitted note text to draw a daily activity chart.

Delivery may repeat an event, so deduplicate by a stable event ID before aggregating. Count distinct learners separately from events: ten retries from one learner are not ten learners. For a public aggregate, apply consent withdrawal and suppress groups below a documented threshold. A threshold reduces small-group exposure but is not a complete mathematical anonymity guarantee.

MongoDB aggregation pipelines separate stages such as filtering and grouping; the JavaScript checkpoint makes those stages inspectable without a database. The three-person threshold is a synthetic lab policy, not a production privacy recommendation. Explain the chart's unit, sample, date range, freshness, and missing-data limitations. Never convert “was active” into “is skilled” or a score of personal worth.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const events = [
  { id: '1', learner: 'a', day: 'Mon', consent: true },
  { id: '1', learner: 'a', day: 'Mon', consent: true },
  { id: '2', learner: 'b', day: 'Mon', consent: true },
  { id: '3', learner: 'c', day: 'Mon', consent: true },
  { id: '4', learner: 'd', day: 'Mon', consent: false },
  { id: '5', learner: 'a', day: 'Tue', consent: true },
];
function aggregate(input) {
  const seen = new Set(); const groups = new Map();
  for (const event of input) {
    if (!event.consent || seen.has(event.id)) continue;
    seen.add(event.id);
    const group = groups.get(event.day) ?? { events: 0, learners: new Set() };
    group.events++; group.learners.add(event.learner); groups.set(event.day, group);
  }
  return [...groups].filter(([, group]) => group.learners.size >= 3)
    .map(([day, group]) => ({ day, events: group.events }));
}
assert.deepEqual(aggregate(events), [{ day: 'Mon', events: 3 }]);
assert.deepEqual(aggregate([]), []);
assert.deepEqual(aggregate(events.filter((e) => e.learner !== 'c')), []);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Aggregate consented practice.** Publish daily event totals only for groups of at least three distinct consented learners. Duplicate delivery must count once and withdrawn consent must be excluded. The fixture has a valid Monday group and an under-threshold Tuesday group. groupBy choices: "learner"/"day".

1. Add a malformed-event validator and reject missing IDs before aggregation. Test that no private input fields appear in output.
2. Model consent withdrawal by excluding learner c and recomputing the aggregate. Verify Monday disappears rather than retaining a cached public count.
3. Create a text table of the permitted aggregates with a unit, freshness timestamp, and explanation of suppressed groups. Write two honest interpretations and two claims the data cannot support.
4. Repair the online insights lab. Sketch equivalent filter, deduplicate, and group stages for a database pipeline, keeping authorization and retention outside the public chart component.

The lesson player offers **Learning insights without surveillance** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Track event IDs separately from the set of learners in each group.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Withdrawal can move a group below the threshold, so deletion may require recomputation or invalidation.

</details>

## Validation

Run duplicate, empty, withdrawn-consent, and under-threshold tests. Verify output contains no learner IDs. Review the text table with its chart hidden. This model does not establish a live analytics integration or legal/privacy approval for collection.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Counting retries as additional practice.
- Showing a tiny group because its event total is high.
- Equating activity with employability, effort, or learner worth.

## Accessibility

Supply a table alternative and a text explanation of the unit and missing data. Use labels or patterns alongside color, and avoid motion as the only way to reveal values. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

How can one withdrawal change an aggregate without revealing who withdrew? Which event fields could you remove and still answer the chart's question? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- MongoDB documentation team, [Aggregation Operations](https://www.mongodb.com/docs/manual/aggregation/), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
