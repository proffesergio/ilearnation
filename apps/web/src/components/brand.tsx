import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="iLearnNation home">
      <svg viewBox="0 0 32 32" width="31" height="31" aria-hidden="true">
        <path
          d="M7 23V10l9 3 9-3v13l-9 3-9-3M16 13v13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <ellipse
          cx="16"
          cy="15"
          rx="15"
          ry="6"
          transform="rotate(-30 16 15)"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
        />
        <circle cx="28" cy="7" r="2" fill="var(--accent)" />
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
      <nav className="footer-links" aria-label="About and policies">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/editorial-policy">Editorial policy</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
      <a
        className="text-link"
        href="https://github.com/proffesergio/modern-fullstack-react-projects-building"
      >
        Course repository on GitHub <Arrow diagonal />
      </a>
    </footer>
  );
}
