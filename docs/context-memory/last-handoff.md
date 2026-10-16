# Current release — 2026-10-17

Current goal: Finish the first book as a complete original course, provide guest previews and publishing/Google foundations, update the astronomical UI theme, and publish to the existing GitHub/Vercel targets.

Completed: Course0.3.0 has all20 book chapter titles in exact order and a finishing capstone conclusion. Field Notes supplies actual Express/Mongoose/Jest, React/TanStack/Apollo/Victory, SSR, Next and Socket.IO code, with optional transactional Mongo persistence. Earlier0.1/0.2 content is snapshotted. Three public chapters use a bounded preview API that writes no account events; remaining web chapters/progress retain account/profile authorization. Course overview and previews have canonical metadata/sitemap entries and per-course GitHub browsing. Public about/contact/privacy/terms/editorial pages and opt-in basic GA4 code are added; analytics/ads remain unconfigured. The owner-requested astronomical atlas theme adds an orbital mesh, cool ink/ice/copper colors, pause/resume and reduced-motion behavior.

Files changed: apps/web UI/routes, packages/course-runtime/access.*, packages/analytics, complete courses/full-stack-modern-react-nextjs tree, tests, CI, exporter, source metadata and publishing/context documentation.

Tests/checks run: 75 platform native tests pass, all12 desktop/mobile account/content/accessibility checks pass, plus2 dedicated astronomical-sky checks pass. Field Notes11 unit/integration tests pass and the actual SPA REST/GraphQL/realtime browser flow passes. Next/SSR real-browser verification added; final result is recorded with publication below. Platform/project builds pass; types/lint/format and repository links/graph/heuristic credential checks pass. Production dependencies audit reports zero known advisories; the project development tree reports19 moderate advisories. Read-only production auth and nine Neon schema probes pass with Google absent. Local desktop/mobile screenshots were reviewed.

Known issues: Google OAuth credentials deferred manually, analytics ID absent, no ads/AdSense approval. Human editorial review, fixed event-retention/operator policy and a private operator contact are wider-launch tasks. No real operator admin bootstrapped, no automatic Vercel Git connection or protected CI deploy secrets configured. Mongo/Docker and learner cloud deployment are optional and not verified on this host. The3 other PDF courses are inventoried/planned, not authored.

Open decisions: Keep invitations limited while wider account policies are finalized. Owner provides Google credentials and optional Search Console/GA4 values.

External integrations/status: Existing Neon production configuration is preserved. GitHub platform main and dedicated course main publication, and Vercel same-project deployment, are explicitly authorized. Publication result is appended below when complete. Source PDFs/extracted text, env values and dependency/build folders are excluded.

Algorithm or schema version changes: Course0.3.0/schema1; no SQL or Algorithm policy change, zero applied points. Earlier progress stays attached to its original version; legacy URLs redirect without reinterpreting saved events.

Next smallest safe step: Complete final project browser check, copy reviewed course payload into the existing dedicated checkout, commit/push both repositories, deploy Vercel and verify the actual production domain. Then continue the other three complete courses sequentially using the inventoried book chapter order.

Approval required before: Existing explicit publication/configuration/deployment authorization persists; no repeat permission is needed for these actions. No authorization to enable ads, billing, or unrelated services is inferred.

Owner manual instructions: [course-publishing-and-google.md](../runbooks/course-publishing-and-google.md).
Next course inventories: [pdf-course-publication-plan.md](../product/pdf-course-publication-plan.md).

Previous verified production application: ea1b8b53bc1a4da1864992287fc16ede579b73e1; Vercel dpl_4bspUWUJiG8UkGbWvANQP8NbwvAA at https://ilearnation.vercel.app. Keep the existing project ID and domain configuration. Secrets remain in ignored mode0600 local recovery files and Vercel Secret storage; never print them.
