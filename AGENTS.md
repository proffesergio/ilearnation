# AGENTS.md — iLearnNation

> **Purpose:** This document is the operating contract for AI coding agents, human contributors, and automation systems working on iLearnNation.
>
> **Product vision:** iLearnNation is a practical, globally accessible learning system where people learn software development by doing. Its GitHub-based courses, interactive exercises, communities, teams, progress systems, and transparent algorithms should help fresh CSE graduates and self-directed learners build confidence, employable skills, and economic opportunity.

## 1. Read this first

Before changing code, every agent must:

1. Read this file completely enough to understand the current phase, product boundaries, and safety rules.
2. Inspect the repository tree, package manifests, lockfiles, environment examples, CI workflows, and open issues.
3. Read the current `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, and any `/docs` architecture notes.
4. Locate the **context memory graph** and update it after meaningful architectural or product decisions.
5. Check for an existing `TODO.md`, `plan.md`, ADRs, and active worktrees before creating new files.
6. Ask only the next necessary product question when a decision would materially affect scope, privacy, cost, or UX. Do not block on low-risk details: choose a reversible default and record it.
7. Never publish, push, deploy, send messages, modify connected services, or spend money without explicit user approval for that action.

The repository is a product in its own right. Course content, examples, tests, diagrams, documentation, and website code must be treated as maintainable production assets rather than disposable prototypes.

## 2. Product principles

- **Learn by doing:** Every concept should lead to an observable action, exercise, experiment, quiz, code change, or reflection.
- **Confidence before complexity:** Introduce one new cognitive load at a time; explain failure states without shame.
- **Evidence over claims:** Progress is based on verifiable work, not vanity metrics alone.
- **Open by default, private by design:** Make public sharing optional and give users control over profiles, reviews, location precision, and activity visibility.
- **Global and inclusive:** Support different languages, time zones, bandwidth conditions, devices, abilities, and educational backgrounds.
- **Small loops, durable skills:** Prefer short feedback cycles, spaced repetition, retrieval practice, debugging, and shipping.
- **Transparent gamification:** Competition should motivate practice, never expose or exploit vulnerable learners.
- **Composable architecture:** Courses, exercises, communities, scoring rules, integrations, and UI modules must be replaceable without rewriting the platform.
- **Human accountability:** Algorithms can recommend, rank, and automate; people retain oversight over moderation, policy, access, and consequential decisions.

## 3. Scope and non-goals

### In scope

- A GitHub-first learning repository containing structured, runnable, interactive courses.
- A learning website that renders course content and interactive activities from versioned course manifests.
- User profiles, progress, reviews, teams, streaks, leaderboards, and a privacy-aware animated 3D learning map.
- An admin-controlled rules engine called the **iLearnNation Algorithm**.
- Extensible integrations such as GitHub, Skool/community platforms, n8n, email, analytics, and notifications.
- Continuous delivery with tests, review gates, observability, and rollback plans.

### Out of scope until explicitly approved

- Financial promises, employment guarantees, credential claims, or paid placement promises.
- Selling courses, subscriptions, ads, or collecting payments.
- Exact live locations of learners, facial recognition, sensitive demographic inference, or public exposure of minors.
- Autonomous moderation that permanently bans people without human review and appeal.
- Scraping or redistributing copyrighted books, courses, code, or personal data.
- Automatic pushes, releases, production migrations, public posts, or external messages.

## 4. Repository contract

Use a monorepo unless a documented decision record approves another structure:

```text
/
├── AGENTS.md
├── README.md
├── LICENSE
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── package.json
├── pnpm-workspace.yaml
├── apps/
│   ├── web/                 # learner-facing website
│   ├── admin/               # protected rules, moderation, and content console
│   └── docs/                # public contributor and platform documentation
├── packages/
│   ├── ui/                  # accessible design system
│   ├── course-schema/       # manifests, validators, migrations
│   ├── course-runtime/      # lesson/exercise execution model
│   ├── algorithm/           # versioned rules, scoring, recommendations
│   ├── auth/                # identity and authorization boundaries
│   ├── data/                # repositories, migrations, typed queries
│   ├── analytics/           # event contracts and privacy filters
│   ├── map/                 # geographic aggregation and 3D visualization
│   └── config/              # shared lint, TypeScript, test configuration
├── courses/
│   └── full-stack-modern-react-nextjs/
│       ├── course.yaml
│       ├── README.md
│       ├── chapters/
│       ├── exercises/
│       ├── projects/
│       ├── quizzes/
│       ├── solutions/       # gated or instructor-facing where appropriate
│       ├── assets/
│       └── references.md
├── refBooks/                # only user-provided, licensed, or public-domain references
├── services/
│   ├── api/
│   ├── worker/
│   └── realtime/
├── infra/
│   ├── docker/
│   ├── migrations/
│   ├── observability/
│   └── n8n/                 # exported workflows, secrets excluded
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── product/
│   ├── research/
│   ├── context-memory/
│   └── runbooks/
├── scripts/
└── .github/
    ├── workflows/
    ├── ISSUE_TEMPLATE/
    └── pull_request_template.md
```

If the actual project uses a different framework, preserve the responsibilities and boundaries even if folder names differ.

## 5. First milestone: repository and first course

The first release is a complete, well-tested course for **Full-Stack Modern React and Next.js Application Development**. It must be useful without requiring a learner to already be a professional developer.

### Required first-course experience

1. A learner can read a short concept explanation, run a starter project, make a change, see the result, and receive feedback.
2. Every chapter has learning objectives, prerequisites, estimated effort, a runnable checkpoint, an exercise, a test or validation step, common mistakes, and a reflection prompt.
3. A course manifest declares chapters, lessons, prerequisites, tags, difficulty, estimated time, learning outcomes, exercise types, accessibility notes, and completion rules.
4. Exercises are deterministic where possible and do not require secret API keys.
5. Learners can reset an exercise, inspect hints progressively, submit attempts, and understand why an answer is correct or incorrect.
6. The course includes a capstone that integrates React, Next.js, routing, data fetching, forms, validation, persistence, testing, accessibility, deployment concepts, and security basics.
7. Reference material is cited in `references.md` with title, author, URL, license/status, access date, and the chapters it supports.
8. A full PDF may be placed in `/refBooks` only when the user owns it, provides it, or its license explicitly permits redistribution. Otherwise store metadata and links, not a copied PDF.
9. Internet research updates facts and examples, but does not copy prose or code beyond compatible license limits. Record research notes and source dates.
10. Content changes are reviewed like code: schema validation, link checks, spelling/clarity review, accessibility review, and appropriate automated tests.

### Suggested chapter arc

1. How the learning system works; environment setup and web fundamentals.
2. Modern JavaScript and TypeScript foundations.
3. React mental models, components, state, events, and forms.
4. Next.js routing, layouts, server/client boundaries, and data fetching.
5. Persistence, APIs, validation, authentication concepts, and error handling.
6. Testing, accessibility, performance, and secure defaults.
7. Production workflows: Git, CI/CD, observability, deployment, and debugging.
8. Capstone: ship a useful full-stack product with a README, tests, and retrospective.

Adjust this outline only after documenting learner research, prerequisite evidence, or a product decision.

## 6. Course content model

Use a versioned, machine-readable manifest. Do not encode business rules in presentation components.

Example shape:

```yaml
id: full-stack-modern-react-nextjs
version: 0.1.0
status: draft
title: Full-Stack Modern React & Next.js Application Development
locale: en
level: beginner-to-intermediate
prerequisites:
  - basic-html-css
learning_outcomes:
  - Build and test a small full-stack web application.
chapters:
  - id: foundations
    title: Foundations
    lessons:
      - id: first-component
        type: interactive_lesson
        estimated_minutes: 35
        objectives: []
        exercise:
          type: code_edit
          starter: exercises/first-component
          validator: tests/first-component
        accessibility_notes: []
completion:
  required_chapters: []
  capstone: capstone
```

Schema evolution rules:

- Validate manifests in CI.
- Add migrations for breaking changes.
- Never silently reinterpret an old course version.
- Keep immutable published course versions; create a new version for material changes.
- Separate authoring metadata from learner-facing text when possible.
- Keep solutions and answer keys out of public learner bundles unless the course explicitly uses reveal-on-demand behavior.

## 7. Website and UX direction

The visual system should communicate **hopeful momentum, technical craft, and global belonging** rather than a generic education dashboard.

### Brand

- Working name: **iLearNation**.
- Brand idea: “I learn, I earn, I contribute to a learning nation.”
- Explore a wordmark where the **earn** idea is visibly highlighted without making an unrealistic income promise. Example directions: `iLEARNation` with a small earn-highlight treatment, or a mark that turns the `i` dot into a signal/route node.
- Use an ownable accent color plus a restrained dark foundation and warm progress colors. Do not finalize palette or typography until the user answers the UX questions below.
- The README may include an animated SVG treatment, but it must have a static fallback, accessible alt text, reduced-motion behavior, and no distracting flashing. Do not rely on animation to communicate essential information.

### UX discovery questions, one at a time

When starting UI work, ask these in order and record answers in `docs/product/ux-decisions.md`:

1. Who is the first learner cohort: fresh graduates, career switchers, school learners, or mixed?
2. What should a learner accomplish in the first 10 minutes?
3. Which pages are needed for v1: landing, course catalog, course player, dashboard, profile, team, leaderboard, map, reviews, admin, or other?
4. Should the experience feel more like a calm studio, a competitive racing league, a community clubhouse, or a blend?
5. Which languages, right-to-left support, devices, and low-bandwidth constraints matter first?
6. What visibility defaults should apply to profile, review, streak, team, and approximate location?
7. Which interactions are essential for the first release, and which can be mocked or deferred?

Ask one question per turn. Do not ask a broad questionnaire when a single decision will unblock work.

### Accessibility requirements

- Keyboard-complete navigation and visible focus states.
- WCAG 2.2 AA target for core flows.
- Respect `prefers-reduced-motion` and provide a pause/static mode for map and racing effects.
- Use semantic landmarks, accessible names, captions/transcripts where applicable, sufficient contrast, scalable text, and clear validation errors.
- Never use color as the only signal.
- Provide a list/table alternative for the 3D map, leaderboard, and animated progress views.
- Test mobile layouts, touch targets, slow connections, and screen readers for critical paths.

## 8. Animated 3D learning map

The map is a visualization of **aggregated, consented learning activity**, not a surveillance feature.

- Default to country or broad region; never expose exact home, school, workplace, or IP-derived location publicly.
- Require explicit opt-in for location display and allow immediate withdrawal.
- Aggregate and threshold counts to reduce re-identification risk.
- Use fake/demo data in development and documentation.
- Provide a text/list alternative and clear data freshness labels.
- Keep the rendering layer replaceable; the product must work if WebGL is unavailable.
- Avoid implying that map brightness equals learner worth.

## 9. Progress, teams, reviews, and leaderboard

### Profiles

Profiles should support a chosen display name, avatar, bio, skills, completed work, goals, timezone/locale, links, and privacy controls. Never require sensitive identity data for learning.

### Reviews

Reviews need moderation, edit/delete controls, abuse reporting, course-version association, and clear disclosure that reviews are user opinions. Do not incentivize only positive reviews.

### Teams

Teams should have roles, invite/leave controls, private-by-default spaces, shared goals, team progress, and anti-harassment reporting. Team competition must not reveal private learner data.

### Leaderboards

Use multiple healthy dimensions: consistency, helpfulness, completed work, improvement, and team collaboration. Avoid a single total score becoming a proxy for human value. Use seasonal or opt-in boards, tie handling, rate limits, and anti-cheat signals. Make ranking rules explainable.

## 10. The iLearnNation Algorithm

The **Algorithm** is a versioned policy and decision system behind the platform. It is not one opaque model. It should control recommendations, progress calculations, streaks, leaderboard scoring, moderation queues, feature flags, and automation eligibility through explicit, reviewable rules.

### Architecture

```text
Events -> validation/privacy filter -> event store
       -> feature computation -> Algorithm version
       -> decisions/explanations -> product surfaces + queues
       -> human review/feedback -> versioned updates
```

Keep these layers separate:

1. **Event contract:** what happened, who/what generated it, timestamp, course version, consent context.
2. **Feature layer:** derived signals such as completed exercise, attempt quality, recent practice, helpful review, or team contribution.
3. **Policy/rules layer:** deterministic thresholds, weights, caps, decay, eligibility, and guardrails.
4. **Recommendation layer:** optional ML/LLM suggestions that never bypass policy or permissions.
5. **Explanation layer:** learner-readable reason codes and admin audit details.
6. **Evaluation layer:** offline replay, fairness checks, abuse simulations, and outcome monitoring.
7. **Governance layer:** version approval, rollback, audit log, change author, effective dates, and review cadence.

### Rules requirements

- Store rules as versioned configuration or code with schemas, tests, owners, and changelogs.
- Make scoring functions deterministic and replayable for a fixed input snapshot.
- Never use protected or sensitive attributes for ranking or recommendations.
- Add caps and decay so early activity does not permanently dominate.
- Test for gaming, collusion, spam, bot activity, and harmful pressure.
- Provide `why` explanations and a correction/appeal path.
- Use shadow mode before enabling a materially changed rule.
- Separate experiments from production scoring.
- A human admin must be able to disable a rule safely.
- Never let an LLM directly assign irreversible sanctions, grant privileged access, or alter user data without validated tool boundaries and human review.

Example rule record:

```json
{
  "id": "consistency-v2",
  "version": 2,
  "status": "shadow",
  "effectiveFrom": "2026-01-01T00:00:00Z",
  "inputs": ["verified_activity", "rest_days", "course_version"],
  "formula": "capped_decay(verified_activity, 14d)",
  "guardrails": ["no_sensitive_attributes", "max_daily_points:100"],
  "explanationTemplate": "Points reflect verified practice, capped daily to reward steady learning.",
  "owner": "admin-team",
  "rollbackTo": "consistency-v1"
}
```

## 11. Data, security, and privacy

- Define data ownership, retention, deletion, export, and consent before implementing social features.
- Use least-privilege access, secure cookies, CSRF protection where relevant, input validation, output encoding, and dependency scanning.
- Never commit secrets, tokens, private book files, production dumps, or personal data.
- Use `.env.example` with placeholders and document secret injection.
- Treat uploaded files, markdown, SVG, links, code submissions, and user reviews as untrusted input.
- Sanitize SVG and HTML; prevent script injection and dangerous markdown links.
- Use server-side authorization for every protected action; UI hiding is not authorization.
- Log security-relevant events without logging passwords, tokens, or unnecessary personal data.
- Establish rate limits for auth, submissions, reviews, invites, and expensive jobs.
- Add account deletion and data export design before public launch.
- For learners who may be minors, obtain appropriate legal/privacy review and avoid public defaults that expose them.

## 12. MCP, integrations, and automation

Use the smallest approved toolset that solves the task. Before invoking a new external service:

1. Inspect current connector configuration.
2. Explain what the integration enables, what data it can access, and whether it is required.
3. Ask the user to approve enabling/connecting it when required.
4. Prefer read-only access for research and dry-run modes for automation.
5. Keep credentials in the connector/secret manager, never in code or prompts.
6. Record the integration contract and failure behavior in `docs/architecture/integrations.md`.

Possible capability categories:

- **GitHub:** repositories, issues, pull requests, Actions, releases, and version history. Do not push without approval.
- **Browser/research:** current documentation and course references. Cite sources and dates.
- **Web development platform:** managed preview, storage, deployment, and project configuration.
- **n8n:** asynchronous workflows such as course update proposals, notifications, digest generation, and moderation queues. Every workflow needs idempotency, retries, dead-letter handling, audit logs, and a manual disable switch.
- **Skool or community platforms:** sync only the minimum profile/course/community fields, document directionality, and handle conflicts and deletion requests.
- **Email/notifications:** templates, unsubscribe preferences, rate limits, and no unsolicited marketing.
- **Analytics:** privacy-preserving events, documented purpose, retention, and opt-out.

Do not install or invent an MCP server name. If a required capability is unavailable, tell the user what the connector would do and provide a concise installation/connection instruction or prompt rather than silently substituting an unsafe workaround.

## 13. Model routing and token discipline

Agents must choose the least expensive capable model and switch models deliberately. Do not claim a model exists; inspect the live model catalog or available configuration first.

Suggested routing:

- **Small/fast model:** file discovery, formatting, simple refactors, test triage, link checks, metadata extraction, and deterministic transformations.
- **General reasoning model:** normal implementation, code review, API design, debugging, and concise documentation.
- **Strong reasoning model:** architecture decisions, security/privacy review, algorithm governance, complex migrations, difficult bugs, and final synthesis.
- **Vision-capable model:** UI screenshots, diagrams, accessibility inspection, and visual regression review.
- **Embedding/search model:** source retrieval and semantic indexing only when justified.
- **LLM-generated content:** draft only; require schema validation, source citations, safety checks, and human review for published curriculum or policy.

Token-saving rules:

1. Read only relevant files and use targeted ranges for large files.
2. Summarize stable context into `docs/context-memory/` instead of repeating it in every prompt.
3. Give agents file paths, acceptance criteria, and constraints rather than the entire repository.
4. Use structured JSON output for extraction and evaluation.
5. Batch independent read-only operations; avoid parallel writes to the same files.
6. Cache research with source URL, retrieval date, and a short claim summary.
7. Ask a cheap model for classification or routing before using a stronger model for synthesis.
8. Stop and escalate when uncertainty affects privacy, money, legal status, production data, or product intent.
9. Never use an LLM where a deterministic parser, test, or script is more reliable.

## 14. Agile, TDD, and CI/CD

Work in small vertical slices:

1. Define the user outcome and acceptance criteria.
2. Write or update the failing test, schema, or content validation.
3. Implement the smallest coherent change.
4. Run focused checks, then the broader suite.
5. Update docs, context memory, and changelog.
6. Review the diff for security, accessibility, privacy, and accidental scope.
7. Produce a human-readable handoff; wait for approval before push, merge, release, or deploy.

Required checks should grow with the project:

- formatting and linting;
- type checking;
- unit and integration tests;
- course manifest/schema validation;
- content link and citation checks;
- accessibility checks for critical routes;
- dependency and secret scanning;
- migration/replay tests for Algorithm versions;
- end-to-end tests for sign-up, course start, exercise submit, progress, privacy, and deletion flows;
- build and preview smoke tests.

CI must use least privilege, pinned or controlled action versions, protected environments, reproducible installs, artifact retention rules, and clear failure messages. Production deploys require an explicit approval gate.

## 15. Definition of done

A change is done only when:

- The intended user behavior is implemented and documented.
- Tests and diagnostics pass, or known failures are recorded with owners.
- Accessibility and responsive behavior are considered.
- Privacy/security implications are reviewed.
- Course sources and licenses are recorded where content changed.
- Algorithm changes include versioning, replay tests, explanations, and rollback.
- Observability and failure behavior are present for new integrations.
- The context memory graph and relevant ADR are updated.
- No secrets or private data are included.
- The user has received a summary, changed-file list, validation evidence, and explicit next step.
- Nothing has been pushed, published, scheduled, sent, or deployed without approval.

## 16. Handoff protocol for another agent

Every handoff must include:

```text
Current goal:
Completed:
Files changed:
Tests/checks run:
Known issues:
Open decisions:
External integrations/status:
Algorithm or schema version changes:
Next smallest safe step:
Approval required before:
```

Update `docs/context-memory/project-state.yaml` (or the repository's chosen equivalent) with stable facts, decisions, relationships, and open questions. Keep entries dated and link them to files/commits when available.

## 17. Initial implementation order

Unless the user changes the priority, use this sequence:

1. Repository skeleton, licensing, contribution rules, security baseline, and context memory.
2. Course schema and validator.
3. First chapter of the React/Next.js course with a real interactive exercise.
4. Course runtime and progress persistence.
5. Learner dashboard and profile privacy controls.
6. Course catalog and course player.
7. Team and review flows with moderation foundations.
8. Leaderboard with explainable Algorithm v1.
9. Aggregated map with opt-in and non-map fallback.
10. Admin console for content and Algorithm versions.
11. Integration adapters and n8n workflow proposals.
12. Hardening, observability, accessibility, load testing, and launch review.

Do not build every social feature before proving that one learner can complete one excellent course loop.
