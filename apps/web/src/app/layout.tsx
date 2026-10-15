import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'iLearnNation — Your next chapter starts here', template: '%s · iLearnNation' },
  description:
    'A practical learning studio. Read a focused lesson, change real code, understand feedback, and build at your pace.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
