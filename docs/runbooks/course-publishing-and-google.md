# Course publication and owner setup

Updated 2026-10-16. The owner authorized GitHub publication, Vercel deployment,
Neon production configuration, and adaptation/publication of all four supplied
books. Google OAuth credentials will be supplied manually. Private PDFs and
extracted text must never enter a Git or Vercel upload.

## Current release

The first course is original edition 0.3.0, with all 20 book chapter titles in
order, a finishing conclusion, and the runnable Field Notes API/SPA/SSR/Next
project. The web gives guests chapters 1–3 and their deterministic checks without
saving account events. Remaining web chapters require account/profile; the
dedicated GitHub repo exposes the entire authored course. Earlier0.1/0.2 drafts
remain snapshots and progress is not silently migrated.

Platform: https://ilearnation.vercel.app
Course repo: https://github.com/proffesergio/modern-fullstack-react-projects-building

The three additional courses are planned, not complete. Rights confirmation,
source metadata, and next chapter inventories are recorded in
[the PDF plan](../product/pdf-course-publication-plan.md).
No new empty course tile should become a playable course.

## Publish a reviewed course repository

The existing first-course repository is reused; do not replace the platform
origin or force-push independent course history.

1. Run platform schema/content checks and the course project's tests/build/browser
   checks. Review source attribution, dependency licenses and secret exclusions.
2. Run `npm run course:export` from the platform root. The export is versioned
   under ignored .course-export and refuses to overwrite a previous export.
   It excludes dependencies/build output/private env/book files.
3. Clone the dedicated repository into a separate temporary checkout. Copy the
   reviewed export into it while preserving .git and existing licensing.
   Review deletions and the complete diff, then commit and push normally.
4. Update both platform and course with reviewed commits; they do not synchronize
   automatically. A normal platform clone must contain actual chapter files.
5. Run `vercel --prod --yes --scope n3rd-s-projects` from the linked platform
   checkout after checks. The project root is apps/web. Its current name is
   ilearnation. Verify the alias and live public/authenticated flows.

When a later course has its complete authored payload, create its repository:

```sh
gh repo create proffesergio/python-machine-learning-systems --private --description "Original Python machine learning course under review"
gh repo create proffesergio/executive-guide-ai --private --description "Original AI adoption course under review"
gh repo create proffesergio/ai-artificial-life-games --private --description "Original game AI and artificial life course under review"
```

Start private for editorial review. Publish only reviewed course files; use a
normal initial Git commit and push, then make visibility public when the course
is ready. Add its exact repo URL and preview IDs to the publication registry,
its manifest and filesystem tracing to the loader, and its public URLs to the
sitemap. Current remote import only allowlists the first repository, so add
explicit per-course repository allowlists before enabling remote loading for
another course. Never use an arbitrary URL from a request as a course source.

## Google sign-in: manual owner action

Follow [the OAuth runbook](google-oauth-setup.md). Create/select the Cloud project,
configure its consent screen and a Web application OAuth client. The production
authorized JavaScript origin is https://ilearnation.vercel.app and callback is
https://ilearnation.vercel.app/api/auth/callback/google. Add development redirect
URIs only for the exact local origin you actually use. Finish the provider's
testing/publishing requirements for the intended audience.

Use CLI prompts so values stay out of shell history and chat:

```sh
vercel env add AUTH_GOOGLE_ID production --sensitive --scope n3rd-s-projects
vercel env add AUTH_GOOGLE_SECRET production --sensitive --scope n3rd-s-projects
vercel --prod --yes --scope n3rd-s-projects
```

Use replace/update if a key already exists. Retest a new Google account,
completed-profile access, sign-out, export, deletion, and denied admin access.
Google sign-in must remain disabled until both values are present. Neon and the
separate production AUTH_SECRET are already configured; do not replace them as
part of OAuth setup.

## Search Console and discovery

Create a Search Console property for the actual production URL. A custom domain
allows DNS verification. For the Vercel subdomain use the applicable URL-prefix
verification method, such as the HTML meta token. Set GOOGLE_SITE_VERIFICATION
through Vercel CLI, redeploy, verify ownership, then submit /sitemap.xml.
Use URL Inspection on the course overview and one preview. Check canonical and
not-found behavior. Keep dashboard/profile/admin/API/auth routes out of indexing.

The site uses English and useful global material. US/UK/worldwide visitors share
the same canonical content; do not add fabricated regional reviews, locations,
keyword-stuffed copies, or hreflang for untranslated pages. Course schema
describes the actual course. Google's course-list rich-result requirements can
require multiple courses; this release does not claim eligibility or invent
additional authored courses. Discovery features cannot guarantee traffic.

## Optional GA4: owner property setup first

No analytics ID is configured in production and no Google tag loads by default.
Create the GA4 property and Web stream for the real origin. Before enabling it:

- Turn off enhanced measurement, especially automatic history/page/form/outbound
  events. This integration sends only its explicit public-page page_view.
- Keep Google signals, advertising personalization, User-ID, Ads links and
  enhanced conversions disabled. Do not send emails, learner IDs, raw input,
  invitation/session tokens or personal data in event parameters or URLs.
- Select retention appropriate to the published policy (start with the shortest
  operationally useful setting), configure internal traffic filters and review
  Google data-sharing settings.
- Set NEXT_PUBLIC_GA_MEASUREMENT_ID through `vercel env add`, then redeploy.
  It is a public ID, not an account secret. Never add a placeholder live value.

Verify in a clean browser, with the network panel or Tag Assistant:

1. Before consent and after rejection: no gtag/collect requests.
2. After acceptance: only public allowlisted pages are measured. Page URLs omit
   queries/hashes; titles and referrers do not contain personal data.
3. Account/admin/auth pages and gated course chapters are excluded.
4. Withdrawal disables collection, removes available GA cookies, and reloads
   to unload an already loaded tag. Confirm no subsequent request.
5. Consent choices expire after180 days; essential authentication stays usable.

The implementation follows basic consent mode: tags are blocked before opt-in.
It is not a Google-certified advertising CMP. Enabled GA property behavior still
needs actual Tag Assistant/DebugView verification after the owner supplies an ID.

## AdSense and advertising: future release

Google Ads buys advertising; AdSense is the publisher application. Neither is
enabled here. There is no guaranteed approval threshold based on a course count.
Before applying, finish substantial original courses, manual editorial review,
clear navigation and public policy pages, a real private operator contact
channel, fixed retention/operator policies, and any required legal/privacy review.

Review the current Google publisher policies and consent requirements. Serving
ads in the EEA, UK and Switzerland requires Google's applicable certified CMP
and IAB TCF integration. The custom analytics preferences panel does not meet
that advertising certification. Add the actual publisher's ads.txt record only
after Google provides it; do not invent an ID or publish a placeholder ad tag.
Keep ads distinguishable from lesson navigation and avoid placements that cause
accidental clicks. Recheck policy at application time.

Primary guidance checked 2026-10-16:
- [Basic consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [Avoid Analytics PII](https://support.google.com/analytics/answer/6366371?hl=en)
- [AdSense consent/CMP requirements](https://support.google.com/adsense/answer/13554020?hl=en)
- [AdSense eligibility](https://support.google.com/adsense/answer/9724/eligibility-requirements-for-adsense?hl=en-uk)
- [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Course-list structured data](https://developers.google.com/search/docs/appearance/structured-data/course)
