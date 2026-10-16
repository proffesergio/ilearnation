# Current release — 2026-10-17

Current goal: Finish the first book as a complete original course, provide guest previews and publishing/Google foundations, update the astronomical UI theme, and publish to the existing GitHub/Vercel targets.

Completed: Course0.3.0 has all20 book chapter titles in exact order and a finishing capstone conclusion. Field Notes supplies actual Express/Mongoose/Jest, React/TanStack/Apollo/Victory, SSR, Next and Socket.IO code, with optional transactional Mongo persistence. Earlier0.1/0.2 content is snapshotted. Three public chapters use a bounded preview API that writes no account events; remaining web chapters/progress retain account/profile authorization. Course overview and previews have canonical metadata/sitemap entries and per-course GitHub browsing. Public about/contact/privacy/terms/editorial pages and opt-in basic GA4 code are added; analytics/ads remain unconfigured. The owner-requested astronomical atlas theme adds an orbital mesh, cool ink/ice/copper colors, pause/resume and reduced-motion behavior.

Files changed: apps/web UI/routes, packages/course-runtime/access.*, packages/analytics, complete courses/full-stack-modern-react-nextjs tree, tests, CI, exporter, source metadata and publishing/context documentation.

Tests/checks run: 75 platform native tests pass, all12 desktop/mobile account/content/accessibility checks pass, plus2 dedicated astronomical-sky checks pass. Field Notes11 unit/integration tests pass and the actual SPA REST/GraphQL/realtime browser flow passes. Both actual browser flows pass, including Next actions and initial SSR HTML. Platform/project builds pass; types/lint/format and repository links/graph/heuristic credential checks pass. Production dependencies audit reports zero known advisories; the project development tree reports19 moderate advisories. Read-only production auth and nine Neon schema probes pass with Google absent. Local desktop/mobile screenshots were reviewed.

Known issues: Google OAuth credentials deferred manually, analytics ID absent, no ads/AdSense approval. Human editorial review, fixed event-retention/operator policy and a private operator contact are wider-launch tasks. No real operator admin bootstrapped, no automatic Vercel Git connection or protected CI deploy secrets configured. Mongo/Docker and learner cloud deployment are optional and not verified on this host. The3 other PDF courses are inventoried/planned, not authored.

Open decisions: Keep invitations limited while wider account policies are finalized. Owner provides Google credentials and optional Search Console/GA4 values.

External integrations/status: Existing Neon production configuration is preserved. GitHub platform main and dedicated course main publication, and Vercel same-project deployment, are explicitly authorized. The course release 0bc0cbe323a7fc64e15f58209b6634d4c3303ecd and platform application af63785a9405ed7512dbaf11309f66c09ee94943 are pushed. Vercel deployment dpl_Am7bgHjTCj1dsvkcPsRcaJM9THqZ is READY at https://ilearnation.vercel.app. Source PDFs/extracted text, env values and dependency/build folders are excluded.

Algorithm or schema version changes: Course0.3.0/schema1; no SQL or Algorithm policy change, zero applied points. Earlier progress stays attached to its original version; legacy URLs redirect without reinterpreting saved events.

Next smallest safe step: Continue the Python machine-learning course through all12 supplied chapters with current primary references and reproducible original projects. Owner manual Google/Search Console/GA4 setup can happen independently.

Approval required before: Existing explicit publication/configuration/deployment authorization persists; no repeat permission is needed for these actions. No authorization to enable ads, billing, or unrelated services is inferred.

Owner manual instructions: [course-publishing-and-google.md](../runbooks/course-publishing-and-google.md).
Next course inventories: [pdf-course-publication-plan.md](../product/pdf-course-publication-plan.md).

Previous verified production application: ea1b8b53bc1a4da1864992287fc16ede579b73e1; Vercel dpl_4bspUWUJiG8UkGbWvANQP8NbwvAA at https://ilearnation.vercel.app. Keep the existing project ID and domain configuration. Secrets remain in ignored mode0600 local recovery files and Vercel Secret storage; never print them.

## Verified publication result

- Platform application: af63785a9405ed7512dbaf11309f66c09ee94943. A documentation-only follow-up records this result; the deployed app code is unchanged.
- Dedicated first course: 0bc0cbe323a7fc64e15f58209b6634d4c3303ecd.
- Vercel: dpl_Am7bgHjTCj1dsvkcPsRcaJM9THqZ, https://ilearnation.vercel.app; build uploaded only472.6KB/187 files, excluding private books/env, tutorial dependencies and build output.
- Platform CI: https://github.com/proffesergio/ilearnation/actions/runs/38957171430 — success, including75 native tests,14 browser checks and the course-project job.
- Course CI: https://github.com/proffesergio/modern-fullstack-react-projects-building/actions/runs/38956894251 — success, including11 native/integration tests, builds and2 real browser flows.
- Live verification passed public policy/course pages, all3 guest checkpoints, later-chapter gate, theme/reduced motion, no unconfigured Google tags, secure invitation/profile/checkpoint/read, independent-session progress, learner-admin denial, export and deletion invalidating both sessions. Synthetic account deleted; minimal revocation/tombstone metadata remains. Private evidence file: .local-data/production-browser-check.json (not committed).
- No Google credentials, GA4 measurement ID, advertising tags, billable provider integrations, raw PDFs or extracted book text were published. Existing six Vercel variables and Neon remain intact.
