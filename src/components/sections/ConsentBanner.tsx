import { useEffect, useRef, useState } from 'react';
import {
  CONSENT_EVENT,
  OPEN_CONSENT_EVENT,
  loadAnalytics,
  readConsent,
  writeConsent,
  type Consent,
} from '../../lib/analytics';

type Labels = {
  title: string;
  body: string;
  acceptAll: string;
  rejectOptional: string;
  customise: string;
  save: string;
  necessaryTitle: string;
  necessaryBody: string;
  analyticsTitle: string;
  analyticsBody: string;
  policyLink: string;
  saved: string;
  error: string;
  preferencesTitle: string;
  close: string;
};

type Props = {
  locale: 'id' | 'en';
  labels: Labels;
  policyHref: string;
};

/**
 * Consent banner. Nothing optional is loaded before a choice: default is deny.
 * Accept and reject are the same shape, the same size, and sit in the same row,
 * so neither is the "easy" answer (F-009).
 */
export default function ConsentBanner({ locale, labels, policyHref }: Props) {
  const [open, setOpen] = useState(false);
  const [existing, setExisting] = useState<Consent | null>(null);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const record = readConsent();
    setExisting(record);
    setAnalytics(record?.analytics ?? false);
    loadAnalytics();

    if (!record) setOpen(true);

    const onOpen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setCustom(false);
      setStatus('idle');
      setOpen(true);
    };

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<Consent>).detail;
      setExisting(detail);
      setAnalytics(detail.analytics);
      loadAnalytics();
    };

    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    window.addEventListener(CONSENT_EVENT, onConsent as EventListener);
    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
      window.removeEventListener(CONSENT_EVENT, onConsent as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && existing) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, existing]);

  const decide = (allowAnalytics: boolean) => {
    try {
      const record = writeConsent(allowAnalytics);
      setExisting(record);
      setStatus('saved');
      loadAnalytics();
      setOpen(false);
    } catch {
      setStatus('error');
    }
  };

  if (!open) return null;

  return (
    <div className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-title" ref={panelRef}>
      <div className="consent__inner container">
        <div className="consent__copy">
          <p className="label label--ticked">{locale === 'id' ? 'Cookie' : 'Cookies'}</p>
          <h2 id="consent-title" className="consent__heading">
            {existing ? labels.preferencesTitle : labels.title}
          </h2>
          <p className="consent__body" id="consent-body">
            {labels.body}{' '}
            <a className="link-inline" href={policyHref} onClick={() => setOpen(false)}>
              {labels.policyLink}
            </a>
          </p>
          {status === 'error' && (
            <p className="field__error" role="alert">
              {labels.error}
            </p>
          )}
        </div>

        {!custom ? (
          <div className="consent__actions">
            <button type="button" className="btn btn--secondary consent__choice" onClick={() => decide(false)}>
              {labels.rejectOptional}
            </button>
            <button type="button" className="btn btn--primary consent__choice" onClick={() => decide(true)}>
              {labels.acceptAll}
            </button>
            <button type="button" className="consent__customise" onClick={() => setCustom(true)}>
              {labels.customise}
            </button>
          </div>
        ) : (
          <div className="consent__panel">
            <div className="consent__row">
              <div>
                <p className="consent__row-title">{labels.necessaryTitle}</p>
                <p className="consent__row-body">{labels.necessaryBody}</p>
              </div>
              <input type="checkbox" checked disabled aria-label={labels.necessaryTitle} />
            </div>
            <div className="consent__row">
              <div>
                <p className="consent__row-title">{labels.analyticsTitle}</p>
                <p className="consent__row-body">{labels.analyticsBody}</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                aria-label={labels.analyticsTitle}
              />
            </div>
            <div className="consent__panel-actions">
              <button type="button" className="btn btn--primary btn--sm" onClick={() => decide(analytics)}>
                {labels.save}
              </button>
              <button
                type="button"
                className="consent__customise"
                onClick={() => {
                  if (existing) setOpen(false);
                  else setCustom(false);
                }}
              >
                {existing ? labels.close : labels.customise}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
