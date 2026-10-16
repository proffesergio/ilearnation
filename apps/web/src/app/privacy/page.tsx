import { Header, Footer } from '@/components/brand';
export const metadata = {
  title: 'Privacy and cookie information',
  description: 'Last updated 16 October 2026. Public reading does not require a learner profile.',
  alternates: { canonical: '/privacy' },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" className="wrap trust-page">
        <p className="eyebrow">iLearnNation / privacy</p>
        <h1>Privacy and cookie information</h1>
        <p className="lead">
          Last updated 16 October 2026. Public reading does not require a learner profile.
        </p>
        <section>
          <h2>Accounts and saved learning</h2>
          <p>
            When you accept an invitation or use a configured identity provider, the platform stores
            the account identity, chosen profile information, sessions, and version-scoped
            lesson/checkpoint events. Raw browser exercise input is validated for feedback and is
            not retained as coursework. Saved progress is private to the account.
          </p>
        </section>
        <section>
          <h2>Service providers</h2>
          <p>
            Vercel hosts the web application and Neon stores account and progress data. Requests
            necessarily pass connection information to hosting infrastructure. GitHub links open a
            separate service. No live learner location map is enabled; displayed map activity is
            synthetic.
          </p>
        </section>
        <section>
          <h2>Essential storage</h2>
          <p>
            Authentication uses secure session cookies on HTTPS. Local preferences can remember
            whether the decorative sky is paused. These functions are separate from optional
            audience analytics and advertising. Public preview results remain in the current browser
            tab.
          </p>
        </section>
        <section>
          <h2>Optional analytics</h2>
          <p>
            Analytics is disabled until the operator configures a GA4 measurement ID. When enabled,
            Google tags load only after you accept analytics, with advertising consent denied.
            Public-page measurement excludes query strings, account identifiers, exercise input, and
            private account routes. Google still receives network and device information when
            permitted. Preferences expire after 180 days and can be withdrawn using Analytics
            preferences. Withdrawal stops future collection; it does not retroactively remove data
            already received by Google.
          </p>
        </section>
        <section>
          <h2>Advertising</h2>
          <p>
            No advertising tags or personalized ads are enabled in this release. Before serving ads,
            the operator must publish the relevant vendor and data-use disclosures, configure
            consent controls appropriate to the regions served, and complete Google’s publisher
            review. This page does not claim AdSense approval.
          </p>
        </section>
        <section>
          <h2>Your controls and deletion</h2>
          <p>
            Use the profile page to export data or request account deletion. Deletion removes
            profile and learning records and revokes sessions. Minimal deletion/revocation records
            remain to prevent deleted data from reappearing through sync. Provider logs and backups
            follow their configured retention. A fixed operator retention schedule and private
            contact channel remain pre-launch work.
          </p>
        </section>
        <section>
          <h2>Changes and contact</h2>
          <p>
            Material changes will be dated here. Use the contact page for public correction routes;
            never put private account information in a GitHub issue.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
