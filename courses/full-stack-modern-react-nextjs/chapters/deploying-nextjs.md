# Deploying a Next.js App

> Chapter 19 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Configure separate frontend, API, and storage hosts
- Verify a production artifact through its public domain
- Record smoke checks and a tested rollback target

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](advanced-nextjs-optimization.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

A production build checks an artifact; a deployment combines that artifact with routing, configuration, services, and operating procedures. The Next frontend requires API_URL and SITE_URL on its host. The API requires durable Mongo storage and a strong runtime JWT_SECRET. Browser-public values and server secrets belong to different scopes. Never solve a missing server variable by prefixing it NEXT_PUBLIC_.

Vercel can host the Next frontend. The long-lived Express/Socket.IO API needs an appropriate separate host, and Mongo needs an authenticated replica set or managed service. A localhost API_URL on Vercel points to the remote function itself, not your laptop. Build success can coexist with a runtime API outage because this course intentionally renders failure states.

A release includes a preflight, a smoke test, and a known rollback. Confirm the canonical origin, HTTPS, cookie flags, health response, one read and write, denied ownership, and useful failure messages. Keep a record of the deployment identifier and configuration names without their values. Rollback restores a previously tested deployment and compatible backend contract; it is not an uncontrolled rebuild of whatever main contains later.

## Step-by-step tutorial

1. Run the full project tests and builds from a clean install. Start the Next production server locally while the API is running and inspect the public homepage and a note detail.

2. Create your own frontend hosting project only when you are ready to operate it. Set its root to next-app if publishing that workspace separately, and include the appropriate dependency lock/workspace context. Keep Node version consistent with the project.

3. Configure a reachable HTTPS API_URL and a trusted SITE_URL. Inject secret values through the host's secret manager, not a committed file. Check next-app/.env.example for names and placeholders.

4. Deploy a preview first. Check initial HTML, metadata, missing notes, API outage behavior, login, write, and owner denial. Verify the Secure HttpOnly cookie on HTTPS.

5. Promote the tested deployment under an explicit release decision. Record its identifier, source commit, environment, and rollback target. Do not enable ads or analytics as an incidental deployment step.

6. After publication, repeat the smoke checks through the public domain. If critical behavior fails, restore the previous tested frontend deployment and investigate compatibility before trying again.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `next-app/.env.example`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test
npm run build
```

A local production start works. If you deployed your own instance, the public URL reaches its intended API and passes the same smoke checks. Keep unrun cloud steps marked pending. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Write a rollback note that another contributor can follow without knowing any secret. Include the target deployment, verification requests, an owner, and a condition for restoring service.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `next-app/.env.example`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

A hosted frontend cannot reach a laptop's loopback address. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

A local production start works. If you deployed your own instance, the public URL reaches its intended API and passes the same smoke checks. Keep unrun cloud steps marked pending. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

A hosted frontend cannot reach a laptop's loopback address. A successful preview build does not prove production variables exist. Copying local .env files into Git or deployment artifacts exposes credentials. A deployment URL alone does not establish that login or persistence works.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://nextjs.org/docs/app/getting-started/deploying) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 19. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
