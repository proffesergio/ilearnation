import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="iLearnNation home">
      <svg viewBox="0 0 32 32" width="31" height="31" aria-hidden="true">
        <path
          d="M7 25V12l9-6 9 6v13M7 17h18M16 6v19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="17" r="4" fill="var(--accent)" stroke="var(--paper)" strokeWidth="2" />
      </svg>
      <span>
        iL<span className="earn">earn</span>Nation<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} />
    </svg>
  );
}
export function Header() {
  return (
    <header className="site-header wrap">
      <Brand />
      <nav aria-label="Main navigation">
        <Link href="/courses">Explore courses</Link>
        <Link href="/blog" className="hide-small">
          Field notes
        </Link>
        <Link href="/signin" className="quiet-link">
          Sign in
        </Link>
      </nav>
      <Link href="/dashboard" className="button small">
        My learning <Arrow />
      </Link>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer wrap">
      <Brand />
      <p>Learn. Build. Share when you’re ready.</p>
      <a
        className="text-link"
        href="https://github.com/proffesergio/modern-fullstack-react-projects-building"
      >
        Course repository on GitHub <Arrow diagonal />
      </a>
    </footer>
  );
}
