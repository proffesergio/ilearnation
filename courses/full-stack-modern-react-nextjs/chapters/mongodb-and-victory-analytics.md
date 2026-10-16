# Aggregating and Visualizing Statistics Using MongoDB and Victory

> Chapter 10 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Define count units and UTC date groups
- Trace a Mongo aggregation pipeline
- Render equivalent chart and table values

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](playwright-end-to-end-testing.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

Analytics begins with a question and a defined unit. Here the question is how many synthetic public notes exist and how many were created on each UTC day. Counts describe this dataset only; they do not establish learning, retention, business performance, or user worth. Deduplicated event delivery and record counts are different measurements.

The memory adapter groups notes by date. The Mongo adapter uses an aggregation pipeline to group and sort stored documents. Match, group, project, and sort stages each transform a collection. Stage order changes the result and resource cost. Timestamps must be interpreted in a stated timezone; a UTC day can differ from the reader's local date.

Victory turns the returned data into a React chart. The same values also appear in a semantic table with headers and a caption. A chart-only interface excludes readers who cannot see or interpret it. An empty dataset needs an empty state; a failed request needs an error state. A zero count and an unavailable count are not interchangeable.

## Step-by-step tutorial

1. Create two synthetic notes, then GET /api/stats. Identify totalNotes and the byDay array. Compare the total with GET /api/notes before applying list limits.

2. Read the memory stats implementation and the Mongo aggregation in api/src/store.mjs. Find grouping by UTC day and explicit ordering. Trace which fields survive the final response.

3. Open http://127.0.0.1:5173/insights. Compare the bar chart with the table. Every plotted day/count pair should have a corresponding table row.

4. Inspect VictoryChart, VictoryAxis, and VictoryBar in web/src/main.jsx. Change only the chart's visual formatting and confirm the underlying values remain unchanged.

5. Stop the API and reload insights. Verify an error appears, then restart and recover. Explain why a missing response cannot be displayed as zero notes.

6. Add a deterministic adapter test with two dates and a duplicate retry ID. Confirm a repeated operation does not create another note. If using Mongo, run the same data investigation there and record it separately.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `api/src/store.mjs`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test --workspace=@field-notes/api
npm run build --workspace=@field-notes/web
```

The aggregate equals the source record count for your fixture, days are ordered, and chart/table values match. An outage produces an error, not invented zeros. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add an empty-state sentence and a table footer total. Verify both with zero and several records. Explain the privacy changes required before aggregating real private learner activity.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `api/src/store.mjs`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Grouping by an unconverted local date produces inconsistent boundaries. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

The aggregate equals the source record count for your fixture, days are ordered, and chart/table values match. An outage produces an error, not invented zeros. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Grouping by an unconverted local date produces inconsistent boundaries. Counting duplicate deliveries inflates results. Putting real learner IDs into a public chart creates a privacy problem. Treating a public notebook chart as a production analytics service overstates this exercise.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 10. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
