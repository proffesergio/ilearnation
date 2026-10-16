# Getting started

Welcome to the original **0.3.0** public review edition. Build Field Notes through
all 20 chapters in the reference book's order, ending with project evidence and
a conclusion. The supplied PDF stays private.

## Your first ten minutes

1. Read the [course overview](README.md) and identify a skill you want to practise.
2. Check `node --version`: use Node.js 24. Confirm Git and your editor work.
3. Open [chapter 1](chapters/preparing-full-stack-development.md). Its exact clone/install commands
   lead to `projects/field-notes`.
4. Run the project's tests, start the API and SPA in separate terminals, and
   make one visible heading change.
5. Write one private sentence describing the browser/server boundary you observed.

## Check your starting knowledge

Can you recognize an HTML heading, a CSS rule, a JavaScript function, an object,
and an array? Can you navigate into a folder in a terminal? If a term is
unfamiliar, identify it in the small example before continuing. No degree,
public profile, or professional experience is required. If package installation
or the terminal is new, take longer than ten minutes; this is an estimate.

## Project setup and recovery

Follow [the complete Field Notes guide](projects/field-notes/README.md).
Install once from the project root with `npm ci`; each service is a workspace.
Use synthetic public observations and demo credentials. Default tests run without
a cloud account or a supplied secret. The development API generates an ephemeral
signing key; production requires explicit secret and durable-store configuration.
Docker/Mongo persistence is optional and documented separately.

Read failures from the first reported error. Check API health before debugging
a frontend request. Stop a process in its original terminal to free its port.
Reset only your own practice edits, never unrelated work or database volumes.

## Web previews and progress

Read and try chapters 1–3 without login. Preview input and results stay in the
current tab. Sign in and complete your private profile for remaining web lessons
and saved, version-scoped progress. Google sign-in is awaiting operator setup;
invitation entry is available. GitHub contains the full authored course.

A browser lab passes only its bounded scenario. Project evidence requires actual
commands, observable outcomes, negative cases, and a retrospective. The final
chapter supplies that review. No animation or precise location is required.
Return to [the overview](README.md) for the chapter route and
[references](references.md) for sources.
