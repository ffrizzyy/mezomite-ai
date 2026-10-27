/**
 * Consent and measurement.
 *
 * Default is deny. Nothing outside the strictly necessary category is loaded
 * until a choice is saved. The record keeps a version and a timestamp so a
 * change of policy can be detected later (F-009).
 */

export const CONSENT_VERSION = 1;
export const CONSENT_KEY = 'mz-consent';
export const CONSENT_EVENT = 'mz:consent';
export const OPEN_CONSENT_EVENT = 'mz:open-consent';

export type Consent = {
  v: number;
  ts: string;
  necessary: true;
  analytics: boolean;
};

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.ts !== 'string') return null;
    return {
      v: typeof parsed.v === 'number' ? parsed.v : 0,
      ts: parsed.ts,
      necessary: true,
      analytics: parsed.analytics,
    };
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): Consent {
  const record: Consent = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    necessary: true,
    analytics,
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Storage blocked (private mode, hardened browser). The choice still
    // applies for this page view because the banner closes and no script loads.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: record }));
  return record;
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

export function openConsentPreferences(): void {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

let loaded = false;

/**
 * Loads Cloudflare Web Analytics, and only this. It is cookieless, so the
 * script is a measurement aid rather than a tracker. Without a token in the
 * environment nothing is injected at all.
 */
export function loadAnalytics(): void {
  if (loaded || typeof document === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  const token = import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN as string | undefined;
  if (!token) {
    if (import.meta.env.DEV) {
      console.info('[analytics] consent granted, no PUBLIC_CF_ANALYTICS_TOKEN set');
    }
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.defer = true;
  script.dataset.cfBeacon = JSON.stringify({ token });
  document.head.appendChild(script);
  loaded = true;
}

/**
 * Named events. Cloudflare Web Analytics has no custom-event API, so this
 * records locally and emits a DOM event a future provider can subscribe to.
 * The switch trigger in the PRD (funnels or attribution) is the point where
 * this function gets a real destination.
 */
export function track(name: string, props: Record<string, string | number | boolean> = {}): void {
  if (!hasAnalyticsConsent()) return;
  const detail = { name, props, ts: Date.now() };
  window.dispatchEvent(new CustomEvent('mz:track', { detail }));
  if (import.meta.env.DEV) console.debug('[track]', name, props);
}
