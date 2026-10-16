# 6. Quality: prove behavior and include people

Draft lesson · course version 0.1.0.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. It may finish while collapsed. The static diagram and text above contain the full meaning; no animation is needed.

</details>

## Objectives

- Write a behavior test that fails for a meaningful reason.
- Review a form using keyboard, labels, status text, and focus.
- Recognize a dangerous URL before presenting it as a link.

## Prerequisites

Complete [Data and forms](data-and-forms.md). Understand assertions and validation.
Use synthetic content; never paste real credentials into test output.

## Effort

40–60 minutes. Node.js 24 LTS for the checkpoint and a browser for manual app
review. Automated checks complement rather than replace testing with people.

## Concept

A useful test asserts an observable promise, such as invalid input causing no
write. A test that repeats the same implementation often repeats the same bug.
Test boundaries: empty values, unexpected types, unauthorized access, slow work,
and failures. Use stable fixtures so a change in time or network does not change
the result unexpectedly.

An accessible form has a visible label, a clear error, predictable focus, and native
controls. Placeholder text disappears while typing and cannot replace the label.
Check the entire keyboard path, including failure recovery. Do not encode results
through color alone. Zoom and narrow screens can reveal hidden controls.

Security includes how output is used. A URL may be syntactically valid yet have
an unsafe scheme. An allowlist is a policy, not a complete sanitizer. The small
function below permits HTTPS links only; it does not fetch them, guarantee their
content, or make HTML safe. Render user content as text rather than raw HTML.

## Runnable checkpoint

Save as `checkpoint.mjs` and run `node checkpoint.mjs`.

```js
import assert from 'node:assert/strict';
function safeLink(value) {
  if (typeof value !== 'string' || value.length > 2000) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}
assert.equal(safeLink('https://example.com/notes'), 'https://example.com/notes');
assert.equal(safeLink('javascript:alert(1)'), null);
assert.equal(safeLink('https://name:password@example.com'), null);
assert.equal(safeLink('not a URL'), null);
assert.equal(safeLink(null), null);
console.log('Checkpoint passed');
```

## Exercise

1. Add tests rejecting `data:` and plain HTTP links and accepting an HTTPS query
   string. Temporarily allow all protocols to verify the rejection tests catch it.
2. Review your notes form with Tab, Shift+Tab, Enter, and a visible focus indicator.
3. Submit an error, zoom to 200%, and use a narrow mobile viewport. Record each
   issue as a reproduction step, expected behavior, and actual behavior.
4. Inspect a slow-loading view. Keep essential text usable before decorative assets
   load; avoid using a long animation as the only loading explanation.

Reset: restore the checkpoint block and undo only your temporary allow-all change.
Keep the accessibility issue list as evidence for your next improvement.

## Hints

<details>
<summary>Hint 1: write the expected outcome</summary>

Use `assert.equal(safeLink('data:text/plain,hello'), null)`. Test the policy from
outside the function instead of checking an internal branch name.

</details>

<details>
<summary>Hint 2: label relationships</summary>

The label's `for` attribute must match the control's ID. In React, write `htmlFor`.
An error can have its own ID referenced by the input's `aria-describedby`.

</details>

## Validation

Run `node checkpoint.mjs`. Document your keyboard path and confirm every control
is reachable, visible, and usable. Confirm errors contain repair instructions and
status is announced in your screen reader where available. A checklist or a passing
URL test alone does not establish WCAG conformance or complete security.

## Common mistakes

- Removing tests when a regression is inconvenient.
- Treating a tooltip, placeholder, or color change as a sufficient form label.
- Using raw HTML insertion to display a note title.
- Equating an HTTPS URL with a trusted destination or a safe server fetch.

## Accessibility

Respect reduced-motion preferences for any app effects. Offer a static equivalent
for essential animated information and avoid changing focus without a clear reason.

## Reflection

Which failure case did you prove with automation, and which required a browser or
human review? What scope remains outside your evidence?

## References

- W3C Web Accessibility Initiative, [Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/), official reference, accessed 2026-10-16.
- Node.js contributors, [Test runner](https://nodejs.org/api/test.html), official reference, accessed 2026-10-16.
- See [source and rights records](../references.md).
