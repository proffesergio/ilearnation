# iLearnNation

![iLearnNation — learn with purpose, build with confidence.](docs/assets/ilearnnation-banner.svg)

**Build something you can explain. Then make it better.** iLearnNation is a GitHub-first learning studio for mixed self-directed learners. Begin with the [getting-started guide](courses/full-stack-modern-react-nextjs/getting-started.md), browse the [course](courses/full-stack-modern-react-nextjs/README.md), or read the [contribution guide](CONTRIBUTING.md).

> The included React and Next.js course is **draft 0.2.0**, with 20 authored lessons and interactive activities. The eight original IDs remain, and draft 0.1.0 is preserved under `versions/0.1.0`. Human curriculum review and release remain pending. The [existing production site](https://i-lear-nation.vercel.app) was deployed from baseline commit `563aedb`; the new application work is **not deployed**. Neon is now initialized and verified through hosted data checks and the local website; Google OAuth remains unconfigured.

## Learn by doing

Read → Run → Change → Check → Reflect → Build. Each lesson offers objectives, prerequisites, a runnable authored JavaScript checkpoint, a bounded interactive activity, feedback, hints, reset, common mistakes, reflection, and references. The first web activity validates a small text-only JSX grammar. The other 19 use bounded JSON inputs and deterministic behavioral simulation. Learner submissions are never executed as arbitrary server-side code. Public activity metadata comes from `getActivity`; signed-in learners with completed profiles use the course player. The course [reference list](courses/full-stack-modern-react-nextjs/references.md) records sources and rights.

The website also has a public catalog, three original reviewed-draft blog articles, and SEO metadata, canonical links, structured data, a sitemap, and robots rules. These are discoverability tools, not a traffic claim. A synthetic region map and list illustrate the design without showing learner locations. The shared footer links to the [dedicated course repository](https://github.com/proffesergio/modern-fullstack-react-projects-building); local and remote course copies do not synchronize automatically.

## Local setup

Use Node.js 24 and npm. For a fresh checkout, run these from the repository root;
preserve an existing environment file and its configured Neon credentials:

```sh
npm ci
cp -n .env.example apps/web/.env.local
npm run db:status
npm run db:init
npm run dev
```

Edit `apps/web/.env.local` before using accounts: set a unique `AUTH_SECRET` of at least 32 characters and `AUTH_URL=http://127.0.0.1:3000`. `DATABASE_MODE=sqlite` uses durable Node 24 SQLite at an ignored local path. With no Google credentials, an operator can issue a single-use invitation to an ignored private file. Google sign-up is open when its OAuth credentials are configured; it needs no invitation. Both routes require profile setup before lessons and the dashboard. See the [SQL and auth runbook](docs/runbooks/sql-auth-setup.md) for exact commands, Neon setup, sync limits, and failure behavior. Keep secret values out of Git and chat.

The backend is Auth.js with server-side authorization and a SQL learning store. Neon is the intended production database; Vercel production requires it and fails closed without configuration. Local SQLite is an explicit durable mode, with an operator-run outbox sync to Neon. There is no automatic failover or browser offline mode. [ADR 0002](docs/adr/0002-sql-auth-and-sync.md) records the decision. Admin roles are assigned through an operator command, not profile fields. The protected admin studio shows actual learner activity and immutable policy history, with shadow replay and zero applied points. Learners can export their account data through `/api/account/download` and delete their accounts.

```sh
npm test
npm run course:validate
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
npm run check:repository
python3 scripts/check_secrets.py
```

Current feature verification passed 70 native tests and all 12 desktop/mobile browser checks, plus build, types, lint, formatting, and repository checks. Hosted Neon data and browser checks also passed with synthetic accounts that were deleted afterward. See the [handoff](docs/context-memory/last-handoff.md) for evidence, [Google setup](docs/runbooks/google-oauth-setup.md) for the remaining account configuration, and [security](SECURITY.md) and [TODO](TODO.md) for launch limits.

## A small star, a wider learning circle

![Thank you for making learning more welcoming. Every helpful contribution matters.](docs/assets/community-thanks.svg)

If a lesson helped you understand something, or this approach is something you
want to follow, **[give iLearnNation a star on GitHub](https://github.com/proffesergio/ilearnation)**
using the repository's **Star** button. It is a simple way to bookmark the project
and show appreciation. You can also share a useful chapter, report a confusing
step, or help improve it. Participation never depends on leaving a star.

**Thank you to every learner who asks a question, every reviewer who explains a
mistake kindly, and every contributor who makes the next step clearer.**

Original code and curriculum licenses have not been selected; no reuse license is granted here. Reference PDFs remain local and excluded from Git. Learning does not promise employment, income, credentials, or search traffic.
