# Contributing

Read [AGENTS.md](AGENTS.md) and [plan.md](plan.md) first. Application implementation
starts after plan approval and the necessary learner decisions. Work locally;
publishing, remote writes, and integration changes require explicit approval.

## A small change

1. State the learner outcome and observable acceptance criteria in TODO.md.
2. Add a failing test, fixture, schema check, or content validation.
3. Implement the smallest change; separate content, validation, runtime, and UI.
4. Run focused checks, then the relevant broader suite. Currently available:
   `npm test`, `npm run course:validate`, `npm run typecheck`, `npm run lint`,
   `npm run build`, `npm run test:e2e`, and `python3 scripts/check_repository.py`.
5. Update CHANGELOG.md and context memory with evidence and unresolved risks.

Use UTF-8, LF line endings, descriptive kebab-case filenames, and relative links
in documentation. TypeScript/JavaScript and YAML use two spaces, Python four.
Prettier formats app/packages/tests; ESLint uses Next.js and TypeScript rules.
Write native Node behavior tests in `tests/*.test.mjs`; Playwright flows belong
in `tests/e2e/*.spec.ts`. Test acceptance criteria and hostile/failure inputs;
no numeric coverage threshold is set yet. Course fixtures execute trusted authored
examples only; never run learner submissions through the content-test harness.

## Review and history

The owner initialized `master` and origin `proffesergio/ilearnation`; there are no
commits yet and no established commit convention. A reversible proposal is `docs: record learner prerequisites`
or `feat: validate lesson manifests`; agree it before the first commit.

Future pull requests should describe the learner outcome, linked task, acceptance
criteria, checks and results, and privacy/accessibility implications. Include UI
screenshots only with synthetic data and accessible descriptions. Published course
versions are immutable; propose a new version for material changes.

Never add secrets, private data, PDF contents, unlicensed material, or real learner
records. Use progressive hints and deterministic feedback without shaming learners.
