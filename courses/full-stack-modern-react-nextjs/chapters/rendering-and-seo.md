# 9. Rendering and meaningful discovery

Original draft lesson · course version 0.2.0 · English first.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. The static diagram and text contain the full meaning; no animation is needed.

</details>

## Objectives

- Inspect initial HTML separately from hydrated UI.
- Choose public metadata and canonical origin.
- Keep private pages protected and out of indexing.

## Prerequisites

Complete [Identity, sessions, and access](identity-and-access.md). Review arrays, functions, and assertions from the foundations lessons. Work with synthetic records only; no personal data or secret API keys are required.

## Effort

About 50 minutes for reading, the checkpoint, the scenario lab, and reflection. Allow additional time for the optional framework extension. Use Node.js 22 or later for the dependency-free checkpoint. The online lab uses a small text configuration and needs no runtime download.

## Concept

Rendering determines when useful HTML becomes available and which environment computes it. A server-rendered public course page can contain its title and outline before JavaScript runs. A client interaction such as a draft editor still needs browser state. Compare view-source or a raw HTML response with the hydrated page: seeing content after scripts run is not proof that it was in the initial document.

Metadata gives public pages a meaningful title and description. A canonical URL identifies the intended public address when multiple URLs represent the same content. Construct it from a trusted configured origin rather than echoing a request Host value. Metadata can improve clarity and discoverability, but no title guarantees search ranking.

Private notebooks have different goals. Apply authorization before loading their contents and keep private pages out of indexing. A robots directive is a discovery instruction, not access control. Do not include private titles in public metadata, sitemaps, caches, or social images. The checkpoint models document contents and metadata only; it does not run SSR, a crawler, or a search-engine ranking experiment.

## Runnable checkpoint

Save the following trusted authored example as `checkpoint.mjs` in your practice folder and run `node checkpoint.mjs`. Read every assertion before editing. This is a small executable model; framework and production claims require their own evidence.

```js
import assert from 'node:assert/strict';
const origin = 'https://learn.example';
function page({ privatePage, authorized, title }) {
  if (privatePage && !authorized) return { status: 401, html: '', robots: 'noindex' };
  return { status: 200, html: `<h1>${title}</h1>`,
    title: privatePage ? 'Private notebook' : title,
    robots: privatePage ? 'noindex' : 'index',
    canonical: privatePage ? null : new URL('/courses', origin).href };
}
const publicPage = page({ privatePage: false, authorized: false, title: 'Learning notebook' });
assert.equal(publicPage.html, '<h1>Learning notebook</h1>');
assert.equal(publicPage.canonical, 'https://learn.example/courses');
const denied = page({ privatePage: true, authorized: false, title: 'Secret' });
assert.equal(denied.status, 401);
assert.equal(denied.html, '');
assert.equal(denied.robots, 'noindex');
assert.equal(page({ privatePage: true, authorized: true, title: 'Secret' }).title,
  'Private notebook');
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Choose a rendering policy.** The public initial document must already contain the heading Learning notebook. Private routes must stay out of indexing, and the canonical URL must use the fixed trusted origin https://learn.example despite a hostile request host. Choices: publicRendering "client"/"server", privateRobots "index"/"noindex".

1. This trusted fixture puts a fixed title into HTML. If a title could be user input, escape it with your framework's text rendering; never reuse this string interpolation as an untrusted HTML renderer.
2. Add a public description and tests for an absent title. Keep private metadata generic even for an authorized owner.
3. In a local framework page, compare initial HTML with the hydrated DOM. Disable scripts once and record what a reader can still understand. Check one public route title and canonical URL.
4. Repair the online rendering lab. Explain the difference between a private route's authorization check and its noindex metadata. Do not publish a page to complete this lesson.

The lesson player offers **Rendering and meaningful discovery** as a bounded configuration scenario. Read its prompt, edit the JSON, submit it, and inspect each behavioral check. Submissions are parsed as data, never executed as JavaScript. A passing lab verifies its synthetic cases; it does not replace building and testing the project extension.

Reset: use Reset in the player to restore its failing starter. For the offline checkpoint, restore the code block above; rerunning starts with fresh in-memory fixtures. Save a copy of your work first if you want to compare attempts.

## Hints

<details>
<summary>Hint 1: trace one case</summary>

Inspect the response before hydration; a screenshot alone does not reveal where rendering happened.

</details>

<details>
<summary>Hint 2: inspect the boundary</summary>

Use the configured HTTPS origin for canonical URLs, even if the incoming request carries an unexpected host.

</details>

## Validation

Run the assertions, inspect a synthetic unauthorized response, and verify no private title appears in its HTML or metadata. Record the local HTML observation separately from the simulation. Search indexing is external behavior and is not verified here.

If the online lab reports malformed JSON, check double quotes, commas, and braces. Keep the starter's field names and value types. If a behavioral check fails, compare one synthetic case with its stated outcome, change one option, and submit again. Input over 8 KB and deeply nested or reserved object keys are rejected. Keep your attempt and feedback until you can explain the result.

## Common mistakes

- Using noindex as a privacy boundary.
- Putting a sensitive title in an Open Graph image or page title.
- Assuming SSR means every component is noninteractive or guarantees a fast page.

## Accessibility

Use a descriptive document title and one clear page heading. Preserve a logical heading hierarchy in both initial HTML and the enhanced interface; essential reading must not depend on a loading animation. All essential instructions and feedback are text. The lab is usable with a keyboard on phone or desktop and does not require optional images, animation, or an external service.

## Reflection

What can a learner read before scripts arrive? Could a public preview, cache, or social card reveal something the route itself correctly protects? Record one failed case, the repair, and the evidence that convinced you. Keep these notes private unless you choose to share them.

## References

- Vercel Next.js team, [Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), official primary documentation, accessed 2026-10-16; link only.
- See [source and rights records](../references.md). All lesson prose, fixtures, and code are original project work.
