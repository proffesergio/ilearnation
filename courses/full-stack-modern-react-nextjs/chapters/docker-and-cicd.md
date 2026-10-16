# Deploying the Application with Docker and CI/CD

> Chapter 5 of 20 · course version 0.3.0 · original public review edition.

## Objectives

- Distinguish images, containers, volumes, registries, and hosts
- Build a credential-free API image
- Design checks and approval before deployment

## Prerequisites

Complete the preceding chapter and its validation first. Keep Node.js 24, an editor, and the installed Field Notes workspace available. Know which terminal runs which service; use only synthetic public observations. [Previous step](react-and-tanstack-query.md).

## Effort

Allow 90 minutes for reading and a first successful run, plus time for the exercise. Pause after each observable result; advanced extensions can take longer.

## Concept

An image is a built artifact; a container is a running instance; a volume holds data beyond that instance. The Dockerfile copies manifests before source so dependency layers can be reused. The lockfile controls dependency resolution. A .dockerignore keeps local credentials, dependency folders, and build output out of the context. Secrets belong in runtime configuration, not image layers or public frontend variables.

CI answers whether a candidate passes checks in a reproducible environment. CD delivers a reviewed artifact to a specific environment. These are separate permissions. A registry stores images; Cloud Run or another container host executes them. A persistent Mongo service is a separate dependency, and Socket.IO needs a host and scaling design that actually support long-lived connections. A successful container build does not establish those operating conditions.

The provided Dockerfile packages the API. The SPA and Next app have their own production builds. This release does not claim to have provisioned a learner's Atlas database, Cloud Run account, registry, or billing. Work locally first, and prepare a deployment plan with an owner, costs, environment names, health checks, and rollback artifact.

## Step-by-step tutorial

1. Run npm test and npm run build in the project root. Resolve failures before packaging. Read Dockerfile and .dockerignore; find the non-root runtime user and check that no .env is copied.

2. If Docker is installed, run docker build -t field-notes-api:local . from projects/field-notes. Record the image ID and compare it with a source Git commit. Stop here if Docker is unavailable and mark the container step unverified.

3. Use Compose for the local Mongo replica set as described in the README. Inject JWT_SECRET through your terminal or secret manager when running the API image. Never write a real value into Dockerfile, Compose, screenshots, or committed commands.

4. Create a practice GitHub Actions workflow in your own fork: checkout, setup Node 24 with npm cache, npm ci, npm test, npm run build. Set working-directory to projects/field-notes when the repo contains the full course. Use read-only contents permissions.

5. Add a separately protected deploy job that consumes the tested artifact and requires environment approval. A practice workflow can stop after producing an artifact; do not add cloud credentials merely to make a badge green.

6. Compare a static frontend host, a container host, and Vercel's Next hosting. In a release note, specify which service handles API sockets, which handles the web frontend, and which owns Mongo persistence. Define the previous image or deployment to restore if /health fails.

Inspect the complete original implementation: [project source](https://github.com/proffesergio/modern-fullstack-react-projects-building/tree/main/projects/field-notes). Focus file: `Dockerfile`. Commands below run from `projects/field-notes`.

## Runnable checkpoint

```sh
npm test
npm run build
```

The local builds pass. If Docker was available, the image builds without credentials in its context. Your workflow runs checks before any deployment and records the commit/artifact relationship. The web activity below is a bounded configuration model, separate from this real project. It never executes arbitrary learner code.

## Exercise

Add a health-check verification to a deployment plan: bounded retries, expected JSON, failure action, and rollback target. Test the same probe locally against a stopped API and a healthy API.

For the browser lab, read its prompt, predict the failed checks, change one configuration at a time, and rerun. Its result records practice for this chapter, not completion of the project evidence.

## Hints

<details><summary>Hint 1: Trace one boundary</summary>

Start with `Dockerfile`. Follow one input through a function or component, then identify the observable output before making your edit. Compare the existing test with that path.

</details>

<details><summary>Hint 2: Check a failure before adding complexity</summary>

Using localhost inside a container points to that container. Use the smallest failing request or UI action, read its status and message, and compare it with the validation above. Keep a working checkpoint so you can distinguish a new regression from an unavailable service.

</details>

## Validation

The local builds pass. If Docker was available, the image builds without credentials in its context. Your workflow runs checks before any deployment and records the commit/artifact relationship. Record the command, expected result, observed result, and the relevant source commit. A command you did not run belongs under pending work.

Reset: inspect `git diff` and undo only your practice edit in the editor or revert your own small commit. Do not reset unrelated work or delete database volumes. In memory mode, restarting the API clears synthetic records and invalidates its development signing key.

## Common mistakes

Using localhost inside a container points to that container. Copying .env into an image preserves secrets even if a later layer deletes it. Deploying different code from what CI tested breaks provenance. Do not assume request-based serverless hosting supports a persistent Socket.IO server.

## Accessibility

Use visible labels and semantic headings for the interface you change. Verify it with keyboard navigation at a narrow viewport. Keep pending, success, and failure information in text; do not communicate the outcome only through color, animation, or a chart. Leave focus in an understandable place after submission.

## Reflection

Explain the boundary this chapter introduced. Which observation proves the success case, and which proves a rejected or unavailable operation? Name one limitation of your evidence and the smallest next check that would reduce it.

## References

- [Current primary documentation](https://docs.docker.com/build/building/best-practices/) — checked 2026-10-16; linked for further reading.
- Daniel Bugl, *Modern Full-Stack React Projects*, chapter 5. Owner-confirmed adaptation rights; original explanations and project code are authored here. The supplied PDF, page images, and extracted text are not published.
