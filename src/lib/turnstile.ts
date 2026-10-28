/**
 * Turnstile widget loader shared by both forms.
 *
 * The script is loaded once per page and rendered explicitly so a form can
 * place the widget where it belongs instead of using the automatic badge.
 * Without PUBLIC_TURNSTILE_SITE_KEY nothing is loaded, which keeps local
 * builds and previews free of a third-party request.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * Turnstile site keys are public: they ship in the HTML of every protected form
 * and identify the widget, not the account. Keeping a default here means a
 * build from a clean clone still renders the widget; the secret half is what
 * lives in the dashboard, and the endpoint fails closed without it.
 */
const DEFAULT_SITE_KEY = '0x4AAAAAAFpJTqRa5G5vcBtw';

export function mountTurnstile(element: HTMLElement, onToken: (token: string) => void): void {
  const siteKey =
    (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) || DEFAULT_SITE_KEY;
  if (!siteKey) return;

  const render = () => {
    if (!window.turnstile) return;
    window.turnstile.render(element, {
      sitekey: siteKey,
      theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
      callback: (value: string) => onToken(value),
      'expired-callback': () => onToken(''),
      'error-callback': () => onToken(''),
    });
  };

  const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
  if (existing) {
    if (window.turnstile) render();
    else existing.addEventListener('load', render, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  script.dataset.turnstile = 'true';
  script.addEventListener('load', render, { once: true });
  document.head.appendChild(script);
}
