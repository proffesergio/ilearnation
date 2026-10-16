# 12. GraphQL: a bounded server contract

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Describe fields, variables, queries, and mutations.
- Limit resolver output and work.
- Apply authorization independently of query shape.

## Prerequisites

Complete [Learning insights without surveillance](learning-insights.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 60 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

GraphQL lets a client name fields it needs through a typed schema. A query reads data; a mutation describes a write. Variables carry operation inputs separately from the document. These contracts can reduce ambiguity, but a schema is not authorization and does not make every operation cheap.

A resolver joins the GraphQL field to application behavior. It should receive a trusted actor, use owner-scoped data access, and return only schema-approved fields. Never spread an entire database record into a response just because a query asked for it. Validate input and enforce cost boundaries, such as documented depth and pagination limits, before expensive work. Depth alone cannot bound every query's total cost.

The checkpoint uses a small request object instead of parsing GraphQL syntax. It demonstrates selection, bounded work, and authorization while remaining dependency-free. It is not a GraphQL engine and does not validate a full schema. In a real project, use a maintained GraphQL implementation with schema validation, resolver tests, and an explicit error policy. Compare the complexity with the small HTTP API before choosing a second interface.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const record = { id: 'n', ownerId: 'a', title: 'Practice', secret: 'local' };
function resolveNote(actor, { fields, depth }) {
  if (!actor || actor.id !== record.ownerId) return { error: 'Not available.' };
  if (!Number.isInteger(depth) || depth < 1 || depth > 2) return { error: 'Query too deep.' };
  const allowed = ['id', 'title'];
  if (!Array.isArray(fields) || fields.some((f) => !allowed.includes(f))) {
    return { error: 'Unknown field.' };
  }
  return { data: Object.fromEntries(fields.map((f) => [f, record[f]])) };
}
assert.deepEqual(resolveNote({ id: 'a' }, { fields: ['title'], depth: 1 }),
  { data: { title: 'Practice' } });
assert.equal(resolveNote({ id: 'b' }, { fields: ['title'], depth: 1 }).data, undefined);
assert.equal(resolveNote({ id: 'a' }, { fields: ['secret'], depth: 1 }).error, 'Unknown field.');
assert.equal(resolveNote({ id: 'a' }, { fields: ['id'], depth: 3 }).error, 'Query too deep.');
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Resolve a small query safely.** Resolve a current-owner notes query exposing its ID and title, while denying the secret field, forged ownership, and nesting deeper than two levels. Choices: ownerSource "argument"/"session", unknownField "ignore"/"reject". This is a query-contract simulation, not a GraphQL parser.

1. Add duplicate-field and empty-selection cases and choose a documented policy. Bound the number of selected fields before mapping them.
2. Write a tiny schema on paper: a Note with id and title, one owner-scoped note query, and one createNote mutation with a title input. Keep owner identity out of mutation arguments.
3. Define failure tests for blank mutation input, an anonymous resolver, excessive depth, and a request for a private storage field. Name the layer that rejects each case.
4. Repair the online GraphQL API lab. If you build the optional real server, pin its dependency versions in your project and use an actual GraphQL parser; do not extend this model into a homemade parser.

The lesson player offers **GraphQL: a bounded server contract** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Choose fields from an explicit allowlist; do not use an object spread of storage records.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

The actor is provided by the verified request context, not the GraphQL variables.

</details>

## Validation

Run field-selection, authorization, and depth assertions. Inspect the returned object for accidental owner or secret fields. Keep the modeled request evidence separate from real schema execution; passing this lab does not prove a server resists all expensive queries.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Assuming strongly typed query inputs authorize access.
- Letting a client select internal storage fields.
- Using depth alone as a universal query-cost defense.

## Accessibility

Translate resolver failures into plain text near the affected action. Preserve a form draft when a mutation fails, and do not announce raw GraphQL stack traces to the learner. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

Which responsibility belongs to the schema, which to the resolver, and which to the repository? Would your notebook benefit enough from GraphQL to justify another interface? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- GraphQL Foundation, [Queries](https://graphql.org/learn/queries/), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
