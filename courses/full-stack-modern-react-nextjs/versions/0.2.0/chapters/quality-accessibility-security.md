# 10. Quality: prove behavior and include people

Draft lesson · course version 0.2.0.

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

Complete [Rendering and meaningful discovery](rendering-and-seo.md), and review any earlier topic you need. Use synthetic data and keep project credentials outside the lesson.

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

**Online scenario: Test the learner journey.** A regression test must catch both a missing saved record and a rejected record that was accidentally written. Locate a textbox by its accessible role and name Note title. Permit HTTPS references but deny active and embedded data URLs. Locator choices: "css-index"/"role".

The lesson player now includes the **quality-accessibility-security** activity. Read its prompt, repair the failing starter, submit it, and inspect the behavioral checks. This activity uses a small JSON configuration to drive synthetic scenarios; it never executes your submitted code. Passing checks verifies only the bounded activity, not full framework competence. Reset restores the original failing starter; copy your work first if needed. Malformed or oversized input returns a repair message.

1. Add tests rejecting `data:` and plain HTTP links and accepting an HTTPS query
   string. Temporarily allow all protocols to verify the rejection tests catch it.
2. Review your notes form with Tab, Shift+Tab, Enter, and a visible focus indicator.
3. Submit an error, zoom to 200%, and use a narrow mobile viewport. Record each
   issue as a reproduction step, expected behavior, and actual behavior.
4. Inspect a slow-loading view. Keep essential text usable before decorative assets
   load; avoid using a long animation as the only loading explanation.
5. Prepare an E2E test in your own framework project using its pinned Playwright
   setup. Your notes page must implement the visible contract below. Run it against
   a local isolated test store and use a preauthenticated synthetic owner fixture
   if your application requires sign-in. The test should remain failing until the
   missing application behavior is implemented; do not weaken its assertions.

```ts
import { test, expect } from '@playwright/test';

test('save one note and reject a blank title', async ({ page }) => {
  await page.goto('/notes');
  const title = page.getByRole('textbox', { name: 'Note title', exact: true });
  await title.fill('Practice request races');
  await page.getByRole('button', { name: 'Save note', exact: true }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Practice request races' }))
    .toHaveCount(1);
  await title.fill(' ');
  await page.getByRole('button', { name: 'Save note', exact: true }).click();
  await expect(page.getByText('Enter a title of 1–120 characters.', { exact: true }))
    .toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(1);
});
```

The one-item assertion assumes a fresh empty notebook fixture. Reset that fixture
between tests. Prefer assertions that wait for the visible outcome over arbitrary
sleep calls. Inspect the report or trace when it fails, and distinguish a selector
or setup failure from an actual application regression. The online policy lab does
not run this browser test for you.

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
When the project exists, run the E2E case in its documented browser setup, inspect
the report, and temporarily break save behavior to verify the test fails. Keep
that browser evidence separate from the dependency-free checkpoint result.

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
- Playwright contributors, [Writing tests](https://playwright.dev/docs/writing-tests), official primary documentation, accessed 2026-10-16; link only.
