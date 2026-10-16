# 19. Git, CI, deployment concepts, and recovery

Draft lesson · course version 0.2.0.

![Learning route: read, run, edit, check, then reflect.](../assets/learning-route.svg)

Read → run → edit → check → reflect, at your own pace.

<details>
<summary>Optional route animation (decorative)</summary>

![A dot travels once along the learning route.](../assets/learning-route.gif)

This optional decoration plays once for 2.4 seconds. GitHub cannot apply your operating system’s reduced-motion preference to this GIF. It may finish while collapsed. The static diagram and text above contain the full meaning; no animation is needed.

</details>

## Objectives

- Review a local change before recording or sharing it.
- Explain reproducible CI checks and least privilege.
- Plan a release, observe failure, and identify a rollback path.

## Prerequisites

Complete [Caching, invalidation, and performance](caching-performance.md), and review any earlier topic you need. Use synthetic data and keep project credentials outside the lesson.

## Effort

35–55 minutes. Node.js 24 LTS for the checkpoint. A local Git installation and a
separate scratch repository for practice. No GitHub account, hosting, or payment.

## Concept

Git records snapshots. A working tree contains current files; staging chooses what
belongs in a commit. Reviewing a diff before staging helps catch accidental secrets
or unrelated edits. An ignored file already tracked by Git stays tracked: ignore
rules are not a secret scanner. Do not put keys or personal data in coursework.

Continuous integration runs declared checks on a clean environment. A locked
dependency installation, explicit runtime version, and clear test commands reduce
surprises. Give a workflow only the permissions it needs, control action versions,
and review changes to workflows as executable code. A green check proves only
what the check exercised.

Deployment moves a build to an environment. Separate build verification, migration
review, production approval, health observation, and rollback. A new binary may be
reversible while a destructive data migration is not. Before shipping, decide how
to detect a failure and who can disable or roll back the change. Never assume a
successful local build proves a live service is configured correctly.

A Docker image can package an application with its runtime and build output.
Choose and record a trusted base image, use reproducible locked dependency
installation, and separate build dependencies from the runtime where appropriate.
Keep credentials, local environment files, and private course records out of the
build context and image layers. Pin the image you release to an immutable digest
so rollback identifies an artifact rather than a moving tag. A container does not
provide a database backup or authorization policy for the application inside it.

Choose a deployment mode that supports the features you built. A static export
cannot provide a private server endpoint by itself; a Node.js or container runtime
can host server behavior but still needs correctly injected secrets, a reachable
database, and operational monitoring. Record which responsibilities belong to the
host and which remain yours. This lesson plans and rehearses those boundaries
locally; a deployment needs its own explicit approval and evidence.

## Runnable checkpoint

Save as `checkpoint.mjs` and run `node checkpoint.mjs`. This is a release-readiness
model, not a script that deploys anything.

```js
import assert from 'node:assert/strict';
function releaseDecision(checks) {
  const required = ['tests', 'build', 'review', 'rollback', 'approval'];
  const missing = required.filter((key) => checks[key] !== true);
  return { ready: missing.length === 0, missing };
}
assert.deepEqual(releaseDecision({}).missing, ['tests', 'build', 'review', 'rollback', 'approval']);
const candidate = { tests: true, build: true, review: true, rollback: true, approval: false };
assert.equal(releaseDecision(candidate).ready, false);
assert.deepEqual(releaseDecision(candidate).missing, ['approval']);
assert.equal(releaseDecision({ ...candidate, approval: true }).ready, true);
console.log('Checkpoint passed');
```

## Exercise

**Online scenario: Gate a release.** A release needs lint, type checking, tests, and a production build; any failed check blocks it. Green checks still need explicit approval. Keep secrets out of public bundles and recover a failed health check using the previously tested artifact. Choices: approval "automatic"/"required", secretScope "public"/"server", rollback "rebuild-latest"/"previous-artifact".

The lesson player now includes the **production-workflows** activity. Read its prompt, repair the failing starter, submit it, and inspect the behavioral checks. This activity uses a small JSON configuration to drive synthetic scenarios; it never executes your submitted code. Passing checks verifies only the bounded activity, not full framework competence. Reset restores the original failing starter; copy your work first if needed. Malformed or oversized input returns a repair message.

1. Add a test proving the string `'true'` does not satisfy a required check.
2. In a new empty scratch folder, use `git init`, write a harmless README, inspect
   `git status` and `git diff`, then stage that file explicitly and review `git diff --cached`.
   A local commit is optional in your own scratch folder; do not push anything.
3. Draft a CI plan in your notebook: clean install, tests, content validation, build,
   minimum permissions, and artifact retention. Describe one failure for each gate.
4. Write a release rehearsal: version, checks, explicit approval, health signal,
   rollback trigger, and rollback owner. Keep it a local proposal.
5. Write a packaging plan listing the runtime/base-image digest, lockfile, build
   command, start command, nonsecret environment names, health path, and excluded
   files. Trace a deliberate missing-variable failure and explain how the service
   should fail closed. If Docker is already available, an optional local build may
   use your project's reviewed Dockerfile and synthetic configuration; no registry
   push or cloud provisioning is needed. Never bake secrets into build arguments
   or image layers.

Reset: restore the checkpoint block. For Git practice, keep or remove only your own
scratch folder after reviewing its contents; never reset the shared project history.

## Hints

<details>
<summary>Hint 1: exact values matter</summary>

Use `{ ...candidate, approval: 'true' }` in an assertion expecting `ready: false`.
A human approval record would need identity and scope too; this toy boolean is not one.

</details>

<details>
<summary>Hint 2: narrow the rehearsal</summary>

Use a failed page health check as a fictional rollback trigger. State which known
good build would return and what data compatibility you would verify first.

</details>

## Validation

Run `node checkpoint.mjs`. Confirm your scratch diff contains exactly the intended
README change. Have a reviewer identify a failing gate in the written rehearsal
and explain the response. No Actions run or deployment is necessary or implied;
do not label a proposed workflow as tested remotely.

## Common mistakes

- Using `git add .` without reviewing all files, including generated output.
- Treating a CI token as a normal course setting or printing it for debugging.
- Calling a release safe without knowing how to detect and recover from failure.
- Running destructive reset commands in a repository you do not own.

## Accessibility

Release notes should explain visible changes and known barriers in plain language.
Recheck keyboard and error recovery paths after production-oriented changes.

## Reflection

What evidence belongs in a release request? Which failure could be repaired by a
rollback, and which might require a data repair plan?

## References

- GitHub documentation contributors, [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions), official reference, accessed 2026-10-16.
- See [source and rights records](../references.md).
- Vercel Next.js team, [Deploying](https://nextjs.org/docs/app/getting-started/deploying), official primary documentation, accessed 2026-10-16; link only.
- Docker documentation team, [Building best practices](https://docs.docker.com/build/building/best-practices/), official primary documentation, accessed 2026-10-16; link only.
