import { Header, Footer } from '@/components/brand';
export const metadata = {
  title: 'Learning terms',
  description: 'Use the platform to practise, investigate, and build at your own pace.',
  alternates: { canonical: '/terms' },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" className="wrap trust-page">
        <p className="eyebrow">iLearnNation / terms</p>
        <h1>Learning terms</h1>
        <p className="lead">
          Use the platform to practise, investigate, and build at your own pace.
        </p>
        <section>
          <h2>Educational scope</h2>
          <p>
            Material is provided for learning and public review. Commands and dependencies can
            change; inspect examples before running them. Use synthetic credentials and data in
            course projects. Keep secrets and personal data out of submissions, repositories, and
            screenshots.
          </p>
        </section>
        <section>
          <h2>Respect and access</h2>
          <p>
            Respect other learners, source authors, and repository contribution rules. Do not
            attempt to access another account, overload the service, or submit executable attacks.
            You control whether to share your work publicly.
          </p>
        </section>
        <section>
          <h2>Content and source rights</h2>
          <p>
            References are attributed in each course. The supplied books are not redistributed.
            Owner-confirmed adaptation rights do not make those books public domain or grant
            learners rights to upload them. Consult each repository’s license and third-party
            licenses before redistributing authored code or material.
          </p>
        </section>
        <section>
          <h2>Progress and availability</h2>
          <p>
            Progress describes the current course version and its bounded checks. It is not a
            professional certification, job guarantee, or earnings promise. Services can be
            unavailable, and course versions can change; earlier draft snapshots preserve their
            content without silently transferring progress to new chapters.
          </p>
        </section>
        <section>
          <h2>Feedback and accounts</h2>
          <p>
            Use the contact routes for corrections. Account export and deletion controls are
            available from the profile. Advertising and paid products are not active in this
            release.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
