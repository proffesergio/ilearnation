import { Header, Footer } from '@/components/brand';
export const metadata = {
  title: 'Editorial and sources policy',
  description: 'Original explanations, reproducible examples, and clearly stated limits.',
  alternates: { canonical: '/editorial-policy' },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" className="wrap trust-page">
        <p className="eyebrow">iLearnNation / editorial policy</p>
        <h1>Editorial and sources policy</h1>
        <p className="lead">
          Original explanations, reproducible examples, and clearly stated limits.
        </p>
        <section>
          <h2>Source handling</h2>
          <p>
            The first course maps all 20 chapters of the supplied React book in their published
            order. Adaptation and publication rights for all four supplied books were confirmed by
            the owner on 16 October 2026. Raw PDFs, extracted text, and source page images remain
            private. Course prose and project examples are authored separately.
          </p>
        </section>
        <section>
          <h2>Current references</h2>
          <p>
            Framework and platform claims are checked against primary documentation, with source
            URLs and access dates in the course references. The checked dependency lockfile defines
            runnable project versions. We update material when APIs or guidance change and preserve
            earlier course snapshots.
          </p>
        </section>
        <section>
          <h2>Review process</h2>
          <p>
            AI-assisted drafts receive schema checks, code review, runnable project tests, builds,
            and browser checks before release. The current course remains a public review edition,
            and human editorial review is ongoing. Automated passing checks do not establish that
            every explanation or learning outcome has been independently reviewed.
          </p>
        </section>
        <section>
          <h2>Corrections</h2>
          <p>
            Report a specific chapter, version, and reproducible issue through the contact page.
            Corrections should explain their evidence and preserve meaningful version history. We do
            not invent learner reviews, traffic figures, accreditations, or performance claims.
          </p>
        </section>
        <section>
          <h2>Planned courses</h2>
          <p>
            A book appearing in the catalog does not mean its lessons are available. Planned courses
            become playable only after their actual chapters, projects, references, and checks are
            present.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
