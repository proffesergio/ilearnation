import { Header, Footer } from '@/components/brand';
export const metadata = {
  title: 'Contact and corrections',
  description: 'Help us improve a lesson or report a platform issue.',
  alternates: { canonical: '/contact' },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" className="wrap trust-page">
        <p className="eyebrow">iLearnNation / contact</p>
        <h1>Contact and corrections</h1>
        <p className="lead">Help us improve a lesson or report a platform issue.</p>
        <section>
          <h2>Public course feedback</h2>
          <p>
            Use the course repository’s GitHub Issues page for reproducible course errors, broken
            links, or suggested improvements. Include the chapter, course version, expected result,
            and observed result. Remove credentials and personal information from logs.
          </p>
        </section>
        <section>
          <h2>Platform feedback</h2>
          <p>
            Use the platform repository’s GitHub Issues page for public interface or navigation
            issues. GitHub is a separate service with its own terms and privacy practices.
          </p>
        </section>
        <section>
          <h2>Private information</h2>
          <p>
            Do not post passwords, invitation links, database credentials, account exports, or
            sensitive personal information in public issues. Use the private vulnerability reporting
            options described in the platform repository’s SECURITY.md where available. The operator
            will publish a dedicated private contact channel before a broader advertising launch.
          </p>
        </section>
        <section>
          <h2>Account controls</h2>
          <p>
            Signed-in learners can export their learning data and delete their account from the
            profile page. Google sign-in configuration is pending; invitation access is currently
            available.
          </p>
        </section>
        <p>
          <a
            className="text-link"
            href="https://github.com/proffesergio/modern-fullstack-react-projects-building/issues"
          >
            Course issues on GitHub
          </a>
        </p>
        <p>
          <a className="text-link" href="https://github.com/proffesergio/ilearnation/issues">
            Platform issues on GitHub
          </a>
        </p>
        <p>
          <a
            className="text-link"
            href="https://github.com/proffesergio/ilearnation/blob/main/SECURITY.md"
          >
            Security reporting guidance
          </a>
        </p>
      </main>
      <Footer />
    </>
  );
}
