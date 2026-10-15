# Resume GitHub publication and Vercel deployment

Updated: 2026-10-16. Scope: finish the dedicated course repository, verify pinned
GitHub lesson reads, deploy the existing website, and hand off. Further feature
development is deferred until the owner supplies the required connections.

## Authorization and current blocker

The owner reports completing `gh auth login` and explicitly requests course
publication and Vercel CLI deployment. Do not ask for those approvals again.
Preserve platform origin `https://github.com/proffesergio/ilearnation.git`.
The course target is `proffesergio/modern-fullstack-react-projects-building`.

This agent's shell cannot resolve `api.github.com` or `api.vercel.com` (temporary
DNS failure). GitHub API reads fail to connect; Vercel `whoami` fails to fetch.
The earlier `gh auth status` invalid-token message is inconclusive under this
network restriction. Do not log out, rotate tokens, or repeat login unnecessarily.
No callable GitHub/Vercel connector is exposed. Resume in a network-enabled CLI
session; public web research access does not grant authenticated CLI access.

## Verify access and course state first

The owner reports pushing both repositories to `main` and now requests courses
inside the platform too. The local course has an independent Git history and the
parent tracks its directory as a 160000 pointer. Follow the
[preserve-history inclusion guide](include-courses-in-platform.md) to track actual
course files. Do not create another publication checkout or repeat initial upload
instructions against existing history. Remote contents still require verification.

From the platform repository root, use read-only checks:

```sh
rtk proxy gh api user --jq .login
rtk proxy gh api repos/proffesergio/modern-fullstack-react-projects-building --jq '{name: .full_name, private: .private, default_branch: .default_branch, size: .size}'
rtk proxy vercel whoami
```

Inspect existing content/history before writing. The course-only payload already
exists at `.course-export/modern-fullstack-react-projects-building/0.1.0/`;
do not rerun the exporter over it or upload the platform/refBooks by mistake.
Its `PUBLICATION-STATUS.md` describes a local export; update it truthfully before
publication. If the remote is absent, ask only its unresolved visibility decision.
No license has been selected: do not invent a reuse license. Existing content
requires a reviewed branch/change rather than an overwrite or force push.

After the approved upload, record its immutable 40-character commit SHA and run:

```sh
rtk proxy npm run course:sync -- --ref <reviewed-40-character-SHA>
```

Set `COURSE_SOURCE=github` and `COURSE_GITHUB_REF=<SHA>` in
`apps/web/.env.local` for local verification and in Vercel's server environment for
deployment. Confirm the player source label and chapter/assets. Current GitHub
reads are public and unauthenticated; private repository support is not implemented.
Do not label local content as remotely verified or silently fall back on failure.

## Link and deploy the monorepo

The fresh login-shell retry observes Vercel CLI 64.2.0 (the earlier attempt used
59.19.1). GitHub API reads and DNS still fail in the new pseudo-terminal; Vercel
identity lookup also fails on DNS. No local Vercel project link exists. Run the CLI
from the **repository root**, retaining sibling `packages`, `courses`, and scripts:

```sh
rtk proxy vercel link
```

Select the intended existing account/team and project. Configure its Root Directory
as `apps/web`, framework Next.js, Node.js 24, workspace build command `npm run build`,
and access to source files outside the root directory. Preserve the root lockfile
and npm workspace install. Do not change billing, security, domains, or GitHub
integration settings. If project/team selection is ambiguous, ask one question.

The root `.vercelignore` excludes credentials, PDFs, references, local exports,
dependencies, and test artifacts. Next.js tracing explicitly includes the required
course JSON, Markdown, SVG, and GIF files. Before upload, inspect CLI file selection:

```sh
rtk proxy vercel deploy --dry --json
rtk proxy npm run build
rtk proxy vercel deploy --prod --non-interactive --env ADMIN_PREVIEW=false --build-env ADMIN_PREVIEW=false
```

Ensure the selected file list contains required course/runtime files and no private
files. Do not use `--temporary` as an account-free substitute. Record the actual
deployment URL/status; smoke-test homepage, catalog, chapter, asset, exercise API,
and production `/admin` returning 404. A local build is not a verified deployment.
If GitHub publication remains blocked, defer GitHub-backed deployment rather than
claiming the source integration is complete.

## Credentials and continuation

`apps/web/.env.local` is absent at this handoff. When the owner provides it locally,
inspect variable **names/presence only**, never print values. Both Git and deployment
exclusions cover environment files. Local env files do not automatically configure
Vercel; use the approved server-side project environment/secret mechanism. Never
upload the owner's entire env file as source or expose tokens through NEXT_PUBLIC.

Keep Mapbox, identity/storage, CMS publishing, automation, and live Algorithm work
deferred. Update project-state.yaml, graph.json, and last-handoff.md after each
verified external outcome, recording SHA/URL without credentials.

Sources, retrieved 2026-10-16: [Vercel monorepos](https://vercel.com/docs/monorepos),
[deployment exclusions](https://vercel.com/docs/deployments/vercel-ignore), and
[CLI deploy](https://vercel.com/docs/cli/deploy). Official Vercel documentation;
paraphrased operational references, no documentation redistribution license assumed.
Installed Next.js `output.md` confirms monorepo tracing includes are relative to
the app directory. Recommendations above remain unverified on Vercel until deployed.
