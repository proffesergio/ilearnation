import { Header, Footer } from '@/components/brand';
export const metadata = {
  title: 'About iLearnNation',
  description: 'A practical learning studio for people building software skills.',
  alternates: { canonical: '/about' },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" className="wrap trust-page">
        <p className="eyebrow">iLearnNation / about</p>
        <h1>About iLearnNation</h1>
        <p className="lead">A practical learning studio for people building software skills.</p>
        <section>
          <h2>What we publish</h2>
          <p>
            iLearnNation develops original, project-based learning material for mixed self-directed
            learners. The first course follows the chapter sequence of Daniel Bugl’s Modern
            Full-Stack React Projects with the owner’s confirmed adaptation and publication rights.
            Its explanations, synthetic notebook project, and exercises are authored for this
            platform.
          </p>
        </section>
        <section>
          <h2>How learning works</h2>
          <p>
            Read a concept, run the supplied project, make a small change, verify the outcome, and
            reflect. The first three web chapters are available without an account. Accounts save
            private, version-scoped progress. The course repository contains the full authored
            material.
          </p>
        </section>
        <section>
          <h2>What completion means</h2>
          <p>
            A passed browser checkpoint records a bounded practice result. It does not establish
            professional competence, accreditation, employment, or earnings. The capstone asks for
            runnable code, tests, accessibility observations, and a retrospective.
          </p>
        </section>
        <section>
          <h2>Current editorial status</h2>
          <p>
            The React course is a public review edition covering all 20 chapters. Three additional
            book-based courses are planned; they are not presented as playable lessons. Corrections
            and practical reproduction reports help improve the curriculum.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
