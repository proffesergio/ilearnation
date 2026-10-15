import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main-content" className="wrap error-page">
      <p className="eyebrow">Route not found</p>
      <h1>Let’s find your next chapter.</h1>
      <p>
        This page is unavailable. The admin draft workspace is available only in development unless
        explicitly enabled.
      </p>
      <Link className="button" href="/courses">
        Explore the course
      </Link>
    </main>
  );
}
