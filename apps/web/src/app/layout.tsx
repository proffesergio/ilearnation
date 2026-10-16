import type { Metadata } from 'next';
import { siteURL } from '@/lib/articles';
import { CosmicBackground } from '@/components/cosmic-background';
import { AnalyticsConsent } from '@/components/analytics-consent';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  title: { default: 'iLearnNation — Your next chapter starts here', template: '%s · iLearnNation' },
  description:
    'A practical learning studio. Read a focused lesson, change real code, understand feedback, and build at your pace.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CosmicBackground />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
        <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </body>
    </html>
  );
}
