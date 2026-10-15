# Local development and source handoff

Use Node.js 22 or later and npm. Dependencies are pinned in package-lock.json.
The first implementation was checked on Node 24.14.0. From the repository root:

```sh
npm ci
npm run dev
npm test
npm run course:validate
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
python3 scripts/check_repository.py
```

The local site is `http://127.0.0.1:3000`. The admin draft preview is `/admin` in
development. It edits tab-local drafts and downloads proposals; it is not a
production CMS authorization system. Production admin defaults to unavailable.
Run `npm run build` before browser checks. E2E starts its own production server on
port 3130 with only the public-data admin preview enabled; it stops that server
afterward. Override `ILEARNNATION_E2E_PORT` if an interrupted test left a listener;
do not terminate an unrelated process to free a port. The browser configuration uses installed Chrome where available; set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to override. CI uses Playwright Chromium.
Framework CLI telemetry is disabled by the checked-in launcher.

`python3 scripts/check_secrets.py` checks common credential signatures without
printing matches. It is a heuristic, not a full audit. CI also runs a production
dependency advisory check. The final production advisory check completed successfully with zero reported
vulnerabilities on 2026-10-16; this is not a security guarantee. ESLint was updated to the supported 10.12.0 line after registry access succeeded;
its Next.js lint rules are checked locally.

## Course repository preparation

```sh
npm run course:export
```

Review `.course-export/modern-fullstack-react-projects-building/0.1.0/` before
creating/pushing the selected remote. The exporter refuses to overwrite an existing
payload. License selection, human curriculum review, remote existence/visibility,
and GitHub access must be resolved. Do not include refBooks or platform secrets.
No Git mutation is part of the exporter. Do not replace the platform's origin.

## Read lessons from GitHub

Once the course payload exists in the selected repository, obtain a reviewed full
commit SHA. Stage an independently checksummed review snapshot:

```sh
npm run course:sync -- --ref <40-character-commit-SHA>
```

To make the website fetch that exact version, set in `apps/web/.env.local`:

```text
COURSE_SOURCE=github
COURSE_GITHUB_REF=<40-character-commit-SHA>
```

Restart the local app. Source labels must show `GitHub` and the short SHA. Remote
errors are surfaced; revert `COURSE_SOURCE=local` and restart to return to the
working draft. Only public unauthenticated reads are currently implemented. Private
repository reads require a separately approved least-privilege server credential
design. Never add browser GitHub write tokens or change a published version in place.

## Connection blockers

The owner subsequently reports local GitHub login. The retry cannot resolve
GitHub or Vercel API hosts, so token validity remains unverified. Do not request
another login or rotate credentials solely on this result. Follow the
[GitHub/Vercel resume runbook](github-vercel-resume.md) in a network-enabled session.

Mapbox was authorized but no tool was exposed in this session. Connect the official
hosted DevKit endpoint `https://mcp-devkit.mapbox.com/mcp` through MCP settings and
complete OAuth, then refresh tool availability. See the official source record in
docs/research. This is an instruction, not an action performed by this project.
MCP authorization does not configure a browser token or approve billable map loads.

## Current limits

The first JSX exercise intentionally accepts only a text heading; it never evaluates
JavaScript. The API has a process-local anonymous request cap, not a distributed
production abuse-control service. Progress is device-local, self-reported, and not
a verified credential. No account signup, profile, learner deletion service, live
policy activation, moderation, remote publishing, or analytics has been built.
