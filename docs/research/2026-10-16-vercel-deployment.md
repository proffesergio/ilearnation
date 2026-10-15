# Vercel deployment references

Retrieved: 2026-10-16. Publisher/author: Vercel. Status: official public documentation;
operational summaries only, no redistribution license assumed.

| Source | Supported fact |
| --- | --- |
| [Using Monorepos](https://vercel.com/docs/monorepos) | Run the CLI from the repository root; configure the project's app root separately. |
| [Exclude Files from Deployments](https://vercel.com/docs/deployments/vercel-ignore) | `.vercelignore` controls source upload exclusions; a project-root file takes precedence. |
| [vercel deploy](https://vercel.com/docs/cli/deploy) | CLI supports production deployment and inspection; a deployment result must be verified. |

Local evidence: installed CLI 59.19.1 help documents `--dry`, `--prod`,
`--non-interactive`, and server environment flags. Installed Next.js 16.4.1
`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md`
explains monorepo tracing roots and explicit runtime-file includes relative to the app.

Recommendation: keep the existing npm workspace, select `apps/web` as the Vercel
project root, include sibling runtime/course source, exclude private files, and
disable admin preview for production. This configuration has a passing local build
and verified file traces; hosted behavior is unverified because shell DNS fails.
See the [resume runbook](../runbooks/github-vercel-resume.md).
