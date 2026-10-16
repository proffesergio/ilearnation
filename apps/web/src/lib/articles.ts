export const siteURL = process.env.SITE_URL || 'https://ilearnation.vercel.app';
export const articles = [
  {
    slug: 'server-components-or-client-components',
    title: 'Where should this React component run?',
    description:
      'Choose a server or client boundary by following the data and the interaction, then verify your choice.',
    date: '2026-10-16',
    lesson: 'nextjs-routing',
    minutes: 5,
    body: `## Start with the behavior

Imagine a learning notebook. Its page reads a list of saved notes. One small control lets a learner expand a note. Reading the notes and responding to a click are different responsibilities; placing them in separate components makes the boundary easier to explain.

In the App Router, a page is a Server Component by default. Keep a database read on the server, near its authorization check. Pass the minimum serializable data needed by a small interactive component. A button that holds local state or handles a browser event belongs in a Client Component, declared with the 'use client' directive.

## Make one small experiment

Create a server-rendered page with a heading and a nested counter. Put the directive only in the counter file. Give the counter a number as its initial value; clicking the button changes the visible count. The heading and server data read do not need to become interactive to support that button.

Next, deliberately pass a database connection object as a prop. Notice the serialization failure. Replace it with the exact data the counter needs. This is a useful error: it identifies an object crossing a boundary that it cannot cross.

## Check what crossed the boundary

- Does the client receive only data needed for its interface?
- Are secret keys and database clients confined to server code?
- Is every protected read authorized on the server?
- Can the initial page still show useful content before the counter becomes interactive?

A server-rendered page does not automatically make a database read authorized. A hidden button does not protect a server action. Treat each protected operation as its own access boundary.

## Debug with a smaller tree

When a hook is rejected in a Server Component, isolate the stateful part rather than adding the client directive to the largest page. If a client bundle includes too much code, inspect the imports under the boundary. Imported children can be pulled into that client graph even when only a small part of the interface handles clicks.

Explain the result in one sentence: the page loads permitted data on the server; the counter manages a browser interaction. If you can explain both halves, you have a boundary you can maintain.

## Source and practice

Original example; reviewed against [Next.js server and client component guidance](https://nextjs.org/docs/app/getting-started/server-and-client-components) on 16 October 2026. Practice the boundary in the course's routing lesson.`,
  },
  {
    slug: 'typescript-needs-runtime-validation',
    title: 'Why your TypeScript type does not validate a request',
    description:
      'Turn an unknown JSON body into a small validated domain value, with explicit errors and useful tests.',
    date: '2026-10-16',
    lesson: 'data-and-forms',
    minutes: 4,
    body: `## A type describes a promise

A request body can arrive from a browser, a script, or a broken client. Calling a value a Note in TypeScript does not make an incoming object satisfy the Note contract. Type assertions help the checker reason about your program; they do not inspect a network body for you.

For a notebook API, begin with an unknown value. Accept an object with a title string, trim it, enforce a small length limit, and reject unsupported fields. Only then create the domain value your application expects. This gives your service one clear boundary between untrusted input and validated data.

## Test the cases you hope never arrive

Try a valid title first. Then send null, an array, a number, an empty title, a very long title, and an object with a role field. The last case matters: accepting extra fields and spreading a request into a database update can let an unrelated input change an unrelated property.

A useful error tells a learner what to fix: “Use a title between 1 and 120 characters.” The server still chooses the record owner from the authenticated session. A userId supplied by the browser is not permission to write another learner's notes.

## Validation has several layers

Input shape validation answers whether a request has an acceptable form. Authorization answers whether this person may perform the operation. A database constraint protects an invariant even if another code path makes a mistake. None of these replaces the others.

Keep the layers small enough to test independently. A title validator should not send mail or query an unrelated account. A repository write should use parameterized SQL, rather than joining a title into a query string. A route should bound the body before parsing it.

## An exercise worth keeping

Write down five invalid inputs before implementing the validator. Run them as tests. Change one validation rule, such as the maximum length, and check that the boundary cases still describe the behavior you intend.

Then remove a type assertion from a request handler and replace it with an explicit check. That small change makes the trust decision visible to the next reader.

## Sources and practice

Original explanation; [the TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html) and [MDN's client-side form validation guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation), reviewed 16 October 2026. Practice the same boundary in the data-and-forms activity.`,
  },
  {
    slug: 'accessible-forms-feedback-loop',
    title: 'Build a form someone can finish with a keyboard',
    description:
      'Test labels, focus, validation feedback, and retry behavior as part of the ordinary form development loop.',
    date: '2026-10-16',
    lesson: 'quality-accessibility-security',
    minutes: 4,
    body: `## Begin with the task

A learner needs to name a notebook and save it. Start with a visible label, a text input, and a submit button. Associate the label with the input's id. Placeholder text may offer an example, but it disappears as someone types and does not replace the label.

Use a real form so Enter can submit it. Use real buttons with deliberate types, and keep the browser's ordinary textarea and input keyboard behavior. A learner pressing Tab expects to move to the next control, not become trapped in an editor.

## Walk through the failure

Submit an empty title. The error should identify the field and explain a correction in plain language. Associate field guidance with aria-describedby where appropriate. Preserve what the learner already typed, and put a concise submission result in a polite live region so it can be announced without taking over the page.

Now disconnect the service and submit a valid title. A disabled button alone does not explain what happened. Show a retry message, restore the control, and keep the input. Success and failure should both leave the next step understandable.

## Run a small manual check

1. Put the pointer aside and tab through the form.
2. Confirm that focus remains visible on every control.
3. Activate the submit button with the keyboard.
4. Read each error without depending on its color.
5. Increase text size and repeat on a narrow viewport.

Automated accessibility checks can catch some missing labels and contrast problems. They cannot establish whether your error makes sense or whether the complete task is comfortable. Combine the tools with an actual keyboard walkthrough and, for critical flows, a screen-reader review.

## Save the behavior in a test

Select inputs by their labels and buttons by their accessible names. Exercise both an invalid submission and a corrected one. These selectors describe the task and are less coupled to the arrangement of containers on the page.

The reward is practical: a form that can explain a mistake and keep a learner moving. Accessibility belongs in that feedback loop from the first version.

## Sources and practice

Original walkthrough; [W3C WAI form labels](https://www.w3.org/WAI/tutorials/forms/labels/) and [user notification guidance](https://www.w3.org/WAI/tutorials/forms/notifications/), reviewed 16 October 2026. Practice keyboard behavior in the quality and accessibility lesson.`,
  },
] as const;

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
