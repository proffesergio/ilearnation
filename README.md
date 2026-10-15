# iLearnNation

Learn software development through focused explanations, runnable code, useful
feedback, and projects. The first planned course is **Full-Stack Modern React and
Next.js Application Development**. The local Next.js app now includes a homepage,
catalog, course player, constrained JSX checkpoint, opt-in device progress, and an
admin draft workbench. The eight-chapter course is draft 0.1.0, not published.

## Start here

- Learner onboarding draft: [course getting-started guide](courses/full-stack-modern-react-nextjs/getting-started.md).
- Read [AGENTS.md](AGENTS.md), the project contract.
- Review [plan.md](plan.md) and [TODO.md](TODO.md) before implementation.
- Resume from [project state](docs/context-memory/project-state.yaml),
  [decisions](docs/context-memory/decisions.md), and the
  [memory graph](docs/context-memory/graph.json).
- Follow [contribution rules](CONTRIBUTING.md), [security guidance](SECURITY.md),
  and the [code of conduct](CODE_OF_CONDUCT.md).

## Local checks

Use Node.js 22+ and npm for the application; Python 3.12+ checks the documentation:

```sh
npm ci
npm run dev
npm test
npm run course:validate
npm run typecheck
npm run lint
npm run build
npm run test:e2e
python3 scripts/check_repository.py
```

Open `http://127.0.0.1:3000`; `/admin` is a local development draft preview. Production
admin defaults to unavailable. Dependencies are pinned with an npm lockfile.
See [local development and GitHub import instructions](docs/runbooks/local-development.md).

## Planned boundaries

`apps/web` renders lessons; `packages/course-schema` validates manifests;
`packages/course-runtime` checks constrained exercises and progress;
`packages/algorithm` replays shadow policies; `packages/data` provides the read-only
GitHub adapter; `courses/` holds original draft chapters and optional finite diagrams.
See [ADR 0001](docs/adr/0001-course-source-and-admin-boundaries.md).

The platform origin is `proffesergio/ilearnation`. The owner-selected course target
is `proffesergio/modern-fullstack-react-projects-building`. Remote creation/import
is not yet verified: this session cannot resolve GitHub's API host, so reported
local authentication cannot be verified. Export a local course payload
with `npm run course:export`; remote reads require a reviewed full commit SHA.

The owner has authorized Vercel CLI deployment; CLI network access and project
linking remain blocked. Follow the [GitHub/Vercel resume runbook](docs/runbooks/github-vercel-resume.md).

Admin controls edit tab-local drafts, download review bundles, and replay synthetic
events. They do not publish or change live policies. The map is a labeled synthetic
globe/list preview; Mapbox MCP tools are not exposed. No accounts, geolocation,
analytics, production learner storage, or social platform has been introduced.

## Licensing and references

The owner has not selected licenses for original code or curriculum. No project
license has been granted by this bootstrap. Resolve that decision before sharing
or publishing. Existing PDFs remain local, with redistribution rights unverified;
see [reference handling](refBooks/README.md). Do not copy them into lessons or
release artifacts. Course content must be original or appropriately licensed and
cited. Learning outcomes do not imply income, employment, or credentials.
