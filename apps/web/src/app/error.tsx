'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="wrap error-page">
      <p className="eyebrow">A checkpoint, not a dead end</p>
      <h1>We couldn’t load this lesson.</h1>
      <p>
        The course source may be unavailable or its manifest may need review. Your saved browser
        progress has not been removed.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <Link className="text-link" href="/">
        Return home
      </Link>
    </main>
  );
}
