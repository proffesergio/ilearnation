# Push only the first course

Use a standalone Git repository at
`courses/modern-fullstack-react-projects-building/`. The existing
`courses/full-stack-modern-react-nextjs/` remains the platform's bundled draft.
The new publication checkout is excluded from parent Git and Vercel uploads.
Do not initialize all of `courses/`, change the platform origin, or add this
checkout to the parent repository as an embedded Git repository.

These commands are for your network-enabled terminal. Start at
`/home/billsbro/Music/codex-projects/iLearNation`. Run the preparation **once**;
if the destination already exists, inspect it instead of copying over it.
No nested repository has been created by the agent.

## Prepare the independent checkout

```sh
rtk proxy mkdir courses/modern-fullstack-react-projects-building
rtk proxy cp -R courses/full-stack-modern-react-nextjs/README.md courses/full-stack-modern-react-nextjs/getting-started.md courses/full-stack-modern-react-nextjs/course.json courses/full-stack-modern-react-nextjs/references.md courses/full-stack-modern-react-nextjs/chapters courses/full-stack-modern-react-nextjs/assets courses/modern-fullstack-react-projects-building/
rtk proxy cp .gitignore courses/modern-fullstack-react-projects-building/.gitignore
rtk proxy git init -b main courses/modern-fullstack-react-projects-building
rtk proxy git -C courses/modern-fullstack-react-projects-building rev-parse --show-toplevel
```

The last command must end with `courses/modern-fullstack-react-projects-building`,
not the platform root. Stop if initialization fails or that check shows another
repository. Copying the parent ignore rules retains credential/PDF exclusions.

Stage only the named course files, review the staged content, then commit:

```sh
rtk proxy git -C courses/modern-fullstack-react-projects-building add -- .gitignore README.md getting-started.md course.json references.md chapters assets
rtk proxy git -C courses/modern-fullstack-react-projects-building diff --cached --stat
rtk proxy git -C courses/modern-fullstack-react-projects-building diff --cached
rtk proxy git -C courses/modern-fullstack-react-projects-building commit -m "feat(course): add initial React and Next.js lessons"
```

No license is selected by these commands. The first commit contains original draft
course material, not PDFs, platform credentials, or an independently verified release.
The root-level `course.json` and chapter paths match the website's existing reader.

## Add the course origin and push

Create the target repository in GitHub if it does not exist, choosing its visibility.
For the current website reader it must permit public unauthenticated reads; private
repository support requires further work. If creating a new empty remote, omit
GitHub-generated README/license files to avoid unrelated initial history.

Add the origin manually **inside this course repository**, or use the scoped form:

```sh
rtk proxy git -C courses/modern-fullstack-react-projects-building remote add origin https://github.com/proffesergio/modern-fullstack-react-projects-building.git
rtk proxy git -C courses/modern-fullstack-react-projects-building remote -v
rtk proxy git -C courses/modern-fullstack-react-projects-building ls-remote origin
```

Skip `remote add` if you already added the same origin. Verify the exact URL. If
`ls-remote` succeeds with **no refs**, push the initial commit:

```sh
rtk proxy git -C courses/modern-fullstack-react-projects-building push -u origin main
rtk proxy git -C courses/modern-fullstack-react-projects-building rev-parse HEAD
```

If the remote has refs or the check fails, stop and inspect/clone its existing
history before copying files into a reviewed branch. Do not force-push or overwrite
remote content. The platform origin remains `proffesergio/ilearnation`.

## Connect the website after a successful push

Record the resulting 40-character commit SHA. From the platform root:

```sh
rtk proxy npm run course:sync -- --ref <reviewed-40-character-SHA>
```

Set `COURSE_SOURCE=github` and `COURSE_GITHUB_REF=<SHA>` in
`apps/web/.env.local`; restart and verify the GitHub source label and lesson reads.
Those two settings are nonsecret. Never place GitHub write tokens in browser env
variables. Configure Vercel server environment separately when deploying.

After publication, author reviewed curriculum changes in the dedicated repository
and consume immutable SHAs. The bundled platform draft is not automatically kept
in sync; do not assume two-way copying or edit imported snapshots independently.
For the remaining deployment steps, use the [integration resume runbook](github-vercel-resume.md).
