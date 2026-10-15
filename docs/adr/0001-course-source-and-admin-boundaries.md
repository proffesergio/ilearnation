# ADR 0001 — Course source, imports, and the local admin boundary

Date: 2026-10-16. Status: accepted for local implementation following the owner's
instruction to start development. Public release and production identity are pending.

## Context

The owner initialized the platform repository with origin
`https://github.com/proffesergio/ilearnation.git` and selected
`proffesergio/modern-fullstack-react-projects-building` for the first course.
Learners begin with the course repository's getting-started guide. The website
must fetch those lessons and support a CMS-style admin for future rule updates.

## Decision

- Preserve the platform monorepo and its origin. Never repoint it to the course.
- Until GitHub access is restored, author the course locally under
  `courses/full-stack-modern-react-nextjs`. Export an isolated repository payload
  using `npm run course:export`; it excludes private references and platform data.
- After an approved first publication, the dedicated course repository becomes the
  curriculum source of truth. Further changes should be reviewed there, then
  imported by immutable commit SHA. Do not independently edit a consumed snapshot.
- Use schema 1 and draft course 0.1.0. Validate every manifest; do not execute MDX,
  uploaded code, arbitrary HTML, scripts, remote images, or fetched examples.
- The read adapter permits only the selected GitHub repository, allowed file paths,
  a full commit SHA, bounded UTF-8 files, timeouts, and no redirects. Local and
  GitHub sources are explicit; source failure shows an error rather than silently
  claiming local content came from GitHub. No write token is exposed to the browser.
- A manual sync stages a snapshot and SHA-256 source lock under ignored local
  storage; it does not overwrite authored content. The web adapter can read the
  same pinned commit directly when explicitly configured. No automatic scheduling.
- Ship an admin **local draft preview**, with curriculum editing/validation/download,
  policy replay, feature-flag proposals, and integration status. It holds no private
  learner data and performs no privileged remote mutation. Production returns 404
  unless `ADMIN_PREVIEW=true` explicitly enables this same public-data preview.
- Keep shared policy logic in `packages/algorithm`, with shadow mode, bounded
  inputs, caps/decay, owner/effective date/changelog/rollback, and an off switch.
  The preview applies zero live points. Production policy activation is unimplemented.
- Device progress is explicit opt-in with restore/clear controls. No account,
  geolocation, analytics, social sharing, or learner database is introduced.
- Mapbox MCP authorization is recorded but tools are not exposed. Until verified,
  use a labeled synthetic map/list preview with no Mapbox requests or map-load cost.

## Consequences

2026-10-16 clarification: the owner wants the full course files in this platform
repository as well as the dedicated course repository. Keep reviewed bundled
content as normal files, not an embedded Git pointer. Preserve the existing course
history outside the working directory in ignored local storage when converting;
see docs/runbooks/include-courses-in-platform.md. The dedicated remote remains the
reviewed curriculum source; copying a reviewed revision into the platform is
explicit, and neither repository automatically updates the other. Conversion is
now staged by the owner: the parent index lists actual files and the independent
history is preserved in `.local-data/course-git/full-stack-modern-react-nextjs.git`.
The parent inclusion and latest documentation still need review/restaging/commit.

This proves local learning and editorial flows without granting administration
privileges to visitors. Before production administration, implement and test trusted
identity, server authorization, CSRF/session controls, durable audit/persistence,
review and version-promotion gates, retention/deletion, and rollback. GitHub writes,
Mapbox runtime traffic, public visibility, licensing, and deployment remain separate
decisions. GitHub Markdown supports disclosure hints and static diagrams; optional
finite GIFs supplement them. Rich code interaction belongs in the website player.
