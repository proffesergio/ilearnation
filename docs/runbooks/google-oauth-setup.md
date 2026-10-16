# Connect Google sign-in

Checked on 2026-10-16. Google Cloud CLI (`gcloud`) is not installed in this
workspace. Use the Google Console flow below to create the web OAuth client.
No Google project or credentials have been created by the agent.

## Create the Google app

1. Open [Google Auth Platform](https://console.cloud.google.com/auth/overview).
   Use the project picker to create a project named **iLearnNation**, or select
   an existing project you own.
2. Complete **Branding** with the app name **iLearnNation** and your actual
   support/developer email. Select **External** in **Audience** to allow Google
   accounts outside a single Workspace organization. Keep the app in testing
   during setup and add your test account if the Console requires it.
3. In **Data Access**, use only `openid`, `email`, and `profile`. These match
   `apps/web/src/lib/auth.ts`; the app does not need Gmail, Drive, or Calendar access.
4. Open **Clients → Create client**, select **Web application**, and name it
   **iLearnNation web**. Register these exact redirect URIs:

   ```text
   http://127.0.0.1:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   https://ilearnation.vercel.app/api/auth/callback/google
   ```

   The Next.js Auth.js callback path is `/api/auth/callback/google`. Redirect
   URLs must match the origin used to open the app. If you also fill in
   **Authorized JavaScript origins**, use the corresponding three origins
   without the callback path. Do not add changing deployment preview URLs.
5. Create the client and copy its client ID and secret directly into
   `apps/web/.env.local`. Keep the existing Neon URL and auth secret:

   ```dotenv
   AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=your-client-secret
   AUTH_URL=http://127.0.0.1:3000
   ```

   Save the secret when the Console first displays it. Keep credential values
   out of chat and Git. The environment file is ignored and has mode 0600.
6. Restart `npm run dev`, open `http://127.0.0.1:3000/signin`, and select
   **Continue with Google**. A new learner should reach profile setup, then the
   dashboard after saving a display name. Google entry does not need an invitation.

If Google requires verified branding domains or public policy links, use a
domain you control and real published policy pages. Do not enter `vercel.app`
as though you owned the hosting provider's parent domain. Public account launch
still needs the retention, incident-contact, and operator decisions in SECURITY.md.

## Add Google to the invitation deployment later

The owner authorized publishing with Neon and invitations while Google credentials
remain pending. The same Vercel project was renamed to
`n3rd-s-projects/ilearnation`, with canonical origin
<https://ilearnation.vercel.app>. The CLI configured these production variables:

Deployment `dpl_4bspUWUJiG8UkGbWvANQP8NbwvAA` is Ready, with application commit
`ea1b8b5`. Production browser verification passed invitations, profile, checkpoint
progress across sessions, export, and deletion with a synthetic account. Google
remains disabled until you add both credentials and redeploy.

| Variable | Production value |
| --- | --- |
| `DATABASE_MODE` | `neon` |
| `DATABASE_URL` | The private connection string already saved locally |
| `AUTH_URL` | `https://ilearnation.vercel.app` |
| `AUTH_SECRET` | A unique production secret with at least 32 characters |
| `SITE_URL` | `https://ilearnation.vercel.app` |
| `COURSE_SOURCE` | `local` (the reviewed bundled course) |

`DATABASE_URL` and `AUTH_SECRET` are Vercel Secret values. Google variables are
intentionally absent. Once you create the web client above, add both Google values
through the Vercel environment UI or CLI prompts:

```sh
vercel env add AUTH_GOOGLE_ID production --scope n3rd-s-projects
vercel env add AUTH_GOOGLE_SECRET production --sensitive --scope n3rd-s-projects
```

Supply values directly to prompts, then redeploy the same project. Vercel applies
changed environment values to new deployments. Google becomes available without
another code change; invitations continue to work.

Keep local-only insecure-auth and SQLite-production overrides unset on Vercel.
The Neon target is project `fragrant-resonance-47092618`, branch `main`
(`br-icy-fog-b34stxh7`), database `ilearnnation`, in `aws-ap-southeast-1`.
The account schema is initialized. Synthetic hosted invitation/profile/progress,
export, sync, and deletion checks passed; Google sign-in still needs its own test.

The production preflight now permits invitation-only accounts and still requires
Neon, a suitable secret, an HTTPS origin, and every account schema probe. A
successful guard confirms configuration/schema reads, not a completed Google login.

Vercel Secret values cannot be retrieved with `vercel pull`. The current operator
checkout keeps the matching production configuration in ignored mode-0600
`.local-data/production-account.env` for secure preflight/recovery. Keep it private.
The manual GitHub deployment job additionally needs matching protected production
environment secrets named `DATABASE_URL` and `AUTH_SECRET` for its read-only
preflight, alongside the documented Vercel credentials. These GitHub secrets have
not been configured by the agent. The CLI deployment does not depend on that job.

## Primary sources

Retrieved 2026-10-16:

- [Google: OAuth web-server credentials and redirect matching](https://developers.google.com/identity/protocols/oauth2/web-server).
- [Google: client, branding, and sign-in scopes](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).
- [Auth.js: Google callback and environment variables](https://authjs.dev/getting-started/providers/google).
- [Google Cloud: the deprecated IAP OAuth CLI is not a generic OAuth client API](https://docs.cloud.google.com/sdk/gcloud/reference/iap/oauth-clients).
