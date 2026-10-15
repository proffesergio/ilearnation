# Fresh terminal retry and manual course publication — 2026-10-16

Current goal: Retry GitHub/Vercel in a fresh terminal and explain how the owner
can push only the course from an independent repository under courses/.

Completed: Opened fresh login shells with pseudo-terminals. GitHub API access
still fails to connect; both API hosts fail DNS resolution. Vercel CLI 64.2.0
identity lookup exits with DNS errors, including its Sentry host. The owner reports
working authentication in their terminal; no credential reset is indicated.
Documented an isolated publication checkout without creating it or mutating Git.

Files changed: .gitignore, .vercelignore, CHANGELOG.md,
docs/runbooks/separate-course-repository.md, docs/runbooks/github-vercel-resume.md,
docs/architecture/integrations.md, and context-memory state/graph/decisions/handoff.
The authored bundled course and original AGENTS.md are preserved.

Validation run and results: Temporary Git fixture verifies initialization, correct
repository root, course-only staging, and secret/PDF exclusions. Parent Git ignores
the proposed publication checkout. Deployment matcher excludes the checkout while
retaining bundled lessons. Documentation/graph checks pass. Prior implementation
checks remain 38 native tests, 10 browser tests, build/types/lint/format passing;
those application suites were not repeated for this documentation-only change.

Research/source updates: None; commands checked against the installed Git CLI.

Algorithm/schema/integration changes: No Algorithm/schema/runtime changes. Nested
checkout is proposed and documented, not created. Existing GitHub source adapter
still requires a public reviewed immutable SHA. No remote write or deployment.

Known issues and risks: Agent shell network isolation persists across a new login
shell; the owner's terminal can differ. Platform master has no commits. A remote
with existing history must be inspected before push; never force-push. The course
publication copy is separate from the bundled platform draft, with no automatic sync.

Open decisions: Remote visibility/reuse license and Vercel project/team if needed.

Next smallest safe step: Owner follows the manual publication guide in their
network-enabled terminal, adds the course origin, inspects remote refs, and pushes
only if empty; record the SHA, validate/import it, then finish authorized deployment
using the GitHub/Vercel resume runbook. Keep broader development deferred.

Approval required before: Unrelated account/security/billing/domain changes or live
Mapbox costs. Course publication and Vercel deployment are already authorized.
No new authorization question is pending.

Model routing: Inherited root model; no worker needed for this short sequential retry.
