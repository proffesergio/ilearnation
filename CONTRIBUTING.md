# Contributing

Read [AGENTS.md](AGENTS.md), [plan.md](plan.md), and the [current project state](docs/context-memory/project-state.yaml). Local implementation is authorized; publication, service changes, pushes, and deployment need the owner's explicit approval. Check the working tree and active worktrees before editing.

For a small change, state the learner outcome, add a meaningful test or content validation where needed, implement the change, and run focused then relevant broader checks. Available commands are `npm test`, `npm run course:validate`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, `npm run test:e2e`, `npm run check:repository`, and `python3 scripts/check_secrets.py`. The browser suite runs after a build. Update CHANGELOG and context memory with evidence and open risks.

The current course is draft 0.2.0 with 20 lessons; draft 0.1.0 is snapshotted under `versions/0.1.0`. Preserve existing IDs and version-scoped progress. Author original explanations and deterministic exercises, cite reference material, and keep answer keys and private books out of learner bundles. Learner submissions must never run through trusted authored checkpoint tooling.

Use UTF-8, LF, descriptive kebab-case paths, and relative documentation links. Prettier formats app/packages/tests; ESLint covers the web app. Native Node tests belong in `tests/*.test.mjs` and Playwright flows in `tests/e2e/*.spec.ts`. Include privacy, authorization, responsive, keyboard, and reduced-motion evidence where relevant. Use synthetic records in screenshots and fixtures. Do not commit secrets, personal data, or reference PDFs.
