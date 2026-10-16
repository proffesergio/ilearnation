# Integration inventory and contracts

Updated: 2026-10-16. Source: whitelisted local configuration, exposed tool metadata,
GitHub CLI status, plugin discovery, and primary documentation. Tool exposure is
not proof of account access. Public documentation reads, plugin discovery, dependency installation, and a
production dependency-advisory metadata request were performed. The earlier
authorized platform push and Vercel production deployment succeeded. During crash
recovery the owner authorized a new Neon project/schema and synthetic hosted
checks; the synthetic accounts were deleted. No real learner data was migrated.

| Capability | Observed status | Data scope | Current use |
| --- | --- | --- | --- |
| GitHub | Platform main push of 563aedb verified using existing Git credentials; API auth remains unverified | Platform repository and selected public course repository | Existing checks workflow; live pinned import unverified |
| Vercel | CLI production deployment READY; project i-lear-nation, team n3rd-s-projects, root apps/web | Reviewed source/course files; private PDFs and env files excluded | https://i-lear-nation.vercel.app; core route smoke passed |
| Auth.js and Google OAuth | Implemented locally; Google credentials absent | Identity and session for private profile/progress | Open Google entry when configured; no live OAuth verification |
| Neon Postgres | Authorized project fragrant-resonance-47092618/main/ilearnnation created in aws-ap-southeast-1; schema/data/sync/local browser verified | Synthetic account/progress/export/deletion checks; private connection only in ignored env | Local website now uses Neon; production Vercel account configuration remains pending |
| Node 24 SQLite | Durable explicit local adapter implemented | Local account and learning data | Manual outbox sync to Neon; not Vercel storage |
| Mapbox | Owner authorized MCP use; no Mapbox tools exposed or configured locally | Depending on MCP scopes: styles, tokens, map feedback; runtime map loads are separate | Synthetic local globe/list only |
| Public web research | Read-only search/retrieval available | Official public documentation URLs and search terms | Dated source records; no private content |
| Sites | Tools available; local-only skill workflow used | Hosting/source/storage if invoked | No Site registered, saved, or deployed |
| next-devtools | Named in local MCP config, not callable here | Development diagnostics | Not invoked |
| Canva | Tools exposed | Connected design assets if invoked | Not invoked |
| n8n / Skool / email / analytics | No integration configured for the project | Would require explicit contracts and minimal scopes | Deferred |

## GitHub read contract

Target: `proffesergio/modern-fullstack-react-projects-building`. Preserve platform
origin `proffesergio/ilearnation`. Before creating a remote, verify existence,
owner, visibility, access, and rights. The owner requested course creation and
population, but working access and final visibility are unresolved.

The website accepts only HTTPS raw reads from the selected repository, a reviewed
40-character commit SHA, and allowlisted Markdown/manifest paths. Reject redirects,
invalid UTF-8, files over 128 KiB, invalid schemas, and unexpected course IDs. Reads
have an 8-second timeout, bounded concurrency, and no automatic retries. Failure
shows an error; do not silently substitute local content while labeling it GitHub.
No browser write token, remote Markdown execution, or arbitrary URL import exists.

Manual sync stages a complete snapshot and SHA-256 source lock under ignored
`.local-data/imports/<SHA>`. Existing imports are not overwritten; partial failures
remain unpublished pending files. Nothing mutates the authored course or GitHub.
Commit identity provides read idempotency. There is no scheduled workflow or queue;
therefore no background retries/dead-letter service. Do not propagate local draft
edits or deletions remotely. Review the snapshot/version before changing the web
source; rollback by choosing a previous reviewed commit and restarting the app.
The dedicated remote becomes authoritative after its reviewed first publication.

Access: enable the trusted GitHub integration for the required repository, or run
`gh auth login -h github.com` locally. Do not paste a token into chat. Recheck access
outside restricted networking before concluding an existing credential needs rotation.

## Mapbox connection contract — not yet active

The owner authorized MCP use; the session still needs the actual tools exposed.
The official hosted DevKit endpoint is `https://mcp-devkit.mapbox.com/mcp`; connect
through MCP settings and complete OAuth, then refresh the session. This is a
connection instruction, not a configuration action performed by the agent.
Source: [official Mapbox DevKit documentation](https://docs.mapbox.com/location-ai/mcp-servers/devkit-mcp-server/).

Prefer least-privilege reads. Authorization does not approve token creation,
style writes, account/security changes, exact location access, or purchases.
MCP access does not supply a browser token. Initializing live Mapbox GL JS maps
can incur map-load usage; agree runtime token restrictions and cost scope first.
No Mapbox request, location collection, map-load spend, or account mutation has
been performed. A future renderer must remain opt-in, aggregate/threshold broad
regions, show freshness, respect reduced motion, and preserve a WebGL-free list.

## Future write integrations

Before implementation, document direction, trusted authorization, data minimization,
idempotency, retry limits/deduplication, failure/dead-letter handling, redacted audit,
owner/disable switch, retention, deletion propagation, and conflict resolution.
SQL admin activity and policy-history writes are implemented locally; production
configuration is pending. No moderation, notification, automation, or applied
scoring writes exist.

## Current Vercel deployment outcome

Production is READY at https://i-lear-nation.vercel.app. The actual homepage is
publicly reachable. Authenticated route checks passed for course/catalog/assets
and exercise submission; /admin returned 404. Git integration linking returned
400 because a GitHub login connection is missing from the Vercel account.
Automatic deployments are not configured. Do not claim GitHub Actions deploys the
site; the existing workflow performs checks. No GitHub secret was configured.

Recovery recheck: Vercel CLI confirms deployment
`dpl_BCmHRC3yz3PMUhgig2XBEkt39MVR` remains Ready, the homepage returns HTTP 200
with the actual brand/course link, and production has no environment variables.
Google Cloud CLI is absent. The owner accepted a manual Google OAuth setup
fallback; [its runbook](../runbooks/google-oauth-setup.md) records the primary
sources, exact callbacks, and remaining Vercel variables. No Google project,
production environment write, or new application deployment occurred in recovery.

The CLI created ignored local link/environment files and generated its own
deployment-protection bypass for route checks. Do not print or publish those
credentials. Anonymous homepage verification used no bypass credential.

## Earlier deployment blockers and continuing constraints

The owner's latest instruction explicitly authorizes website deployment by CLI.
GitHub course completion is also already requested; do not ask again merely because
this is a new session. The shell cannot resolve API hosts. `gh api` fails to connect;
`vercel whoami` fails to fetch. The deployment attempt reaches team lookup and
exits with `EAI_AGAIN` on Vercel CLI's Sentry host. No URL or successful upload is
confirmed. Authentication files exist, but their values were not read or printed.
Do not conclude that credentials are invalid or switch to temporary hosting.

Once access works, verify the intended account/team/project before linking. Upload
only reviewed source; `.vercelignore` excludes environment files, PDFs, references,
local imports/exports, and artifacts. `.vercel/` is ignored by Git. The app's build
traces explicitly include authored course runtime files; no private reference is
required. Production admin preview stays disabled. No Mapbox, CMS, identity,
analytics, billing, domain, or security changes are included in this authorization.

Use a manual deploy with no automatic retry/schedule. Capture its actual URL and
smoke-test it; a failed build/deploy must not be recorded as successful. Preserve
existing deployments and avoid destructive project changes. A future rollback
must select a known deployment and reviewed course SHA through the owner's release
process; no new rollback operation was requested here. Env files remain local;
server configuration on Vercel is separate. See
[the resume runbook](../runbooks/github-vercel-resume.md) for commands and sources.
