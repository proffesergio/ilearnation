'use client';
import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { isPublicAnalyticsPath } from '../../../../packages/analytics/policy.mjs';
type Choice = 'accepted' | 'rejected' | null;
const key = 'ilearnnation-analytics-choice-v1';
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener('analytics-choice', listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener('analytics-choice', listener);
  };
}
function snapshot() {
  try {
    const raw = localStorage.getItem(key) || '';
    const stored = JSON.parse(raw || 'null');
    return stored &&
      Number.isFinite(stored.at) &&
      Date.now() >= stored.at &&
      Date.now() - stored.at < 180 * 86400000
      ? raw
      : '';
  } catch {
    return '';
  }
}
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
export function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const storedChoice = useSyncExternalStore(subscribe, snapshot, () => null);
  const [fallbackChoice, setChoice] = useState<Choice>(null);
  let choice: Choice = fallbackChoice;
  try {
    const stored = JSON.parse(storedChoice || 'null');
    if (stored && ['accepted', 'rejected'].includes(stored.choice)) choice = stored.choice;
  } catch {}
  const ready = storedChoice !== null;
  const [open, setOpen] = useState(false);
  const configured = /^G-[A-Z0-9]{6,20}$/.test(measurementId);
  const publicPath = isPublicAnalyticsPath(pathname);
  useEffect(() => {
    if (!configured || !ready) return;
    const enabled = choice === 'accepted' && publicPath;
    const flags = window as unknown as Record<string, unknown>;
    flags[`ga-disable-${measurementId}`] = !enabled;
    if (!enabled) return;
    window.dataLayer = window.dataLayer || [];
    function tag(...args: unknown[]) {
      void args;
      // Google's gtag command queue consumes an Arguments object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    }
    tag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    tag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    tag('js', new Date());
    const location = window.location.origin + pathname;
    tag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location,
      page_referrer: '',
      page_title: 'iLearnNation learning library',
    });
    tag('event', 'page_view', {
      page_location: location,
      page_referrer: '',
      page_title: 'iLearnNation learning library',
    });
    let script = document.querySelector<HTMLScriptElement>('#optional-google-analytics');
    if (!script) {
      script = document.createElement('script');
      script.id = 'optional-google-analytics';
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.append(script);
    }
    return () => {
      flags[`ga-disable-${measurementId}`] = true;
    };
  }, [choice, pathname, configured, measurementId, publicPath, ready]);
  function save(next: Choice) {
    setChoice(next);
    setOpen(false);
    try {
      localStorage.setItem(key, JSON.stringify({ choice: next, at: Date.now() }));
      window.dispatchEvent(new Event('analytics-choice'));
    } catch {}
    if (next === 'rejected') {
      const flags = window as unknown as Record<string, unknown>;
      flags[`ga-disable-${measurementId}`] = true;
      for (const part of document.cookie.split(';')) {
        const name = part.trim().split('=')[0];
        if (name === '_ga' || name.startsWith('_ga_')) {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
          const host = location.hostname;
          document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${host}; SameSite=Lax`;
        }
      }
      if (document.getElementById('optional-google-analytics')) window.location.reload();
    }
  }
  if (!configured || !ready) return null;
  return (
    <>
      {(open || !choice) && (
        <section className="consent-panel" aria-label="Analytics preferences">
          <h2>Optional analytics</h2>
          <p>
            With your permission, Google Analytics measures visits to public learning pages. Google
            receives device and connection data. We exclude account pages, query strings, learner
            identities, and exercise input. You can change your choice at any time.{' '}
            <Link href="/privacy">Privacy details</Link>.
          </p>
          <div className="consent-actions">
            <button className="button secondary" onClick={() => save('rejected')}>
              Reject analytics
            </button>
            <button className="button secondary" onClick={() => save('accepted')}>
              Accept analytics
            </button>
          </div>
        </section>
      )}
      <button className="privacy-control" onClick={() => setOpen(!open)}>
        Analytics preferences
      </button>
    </>
  );
}
