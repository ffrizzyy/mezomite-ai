import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { track } from '../../lib/analytics';
import { mountTurnstile } from '../../lib/turnstile';

type Errors = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageShort: string;
  consentRequired: string;
  submitFailed: string;
  rateLimited: string;
  network: string;
  summary: string;
};

type Labels = {
  formTitle: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  company: string;
  companyPlaceholder: string;
  employees: string;
  employeesPlaceholder: string;
  employeeOptions: { value: string; label: string }[];
  message: string;
  messagePlaceholder: string;
  consent: string;
  consentLink: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  successRef: string;
  successNext: string;
  successPricing: string;
  successBook: string;
  privacyNote: string;
  turnstileNote: string;
  required: string;
  optional: string;
};

type Props = {
  locale: 'id' | 'en';
  labels: Labels;
  errors: Errors;
  privacyHref: string;
  pricingHref: string;
  bookingHref: string;
};

type Values = {
  name: string;
  email: string;
  company: string;
  employees: string;
  message: string;
  consent: boolean;
  website: string;
};

const EMPTY: Values = {
  name: '',
  email: '',
  company: '',
  employees: '',
  message: '',
  consent: false,
  website: '',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContactForm({
  locale,
  labels,
  errors: copy,
  privacyHref,
  pricingHref,
  bookingHref,
}: Props) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [reference, setReference] = useState('');
  const [token, setToken] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;
    mountTurnstile(widgetRef.current, setToken);
  }, []);

  const setField = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): Partial<Record<keyof Values, string>> => {
    const next: Partial<Record<keyof Values, string>> = {};
    if (values.name.trim().length < 2) next.name = copy.nameRequired;
    if (!values.email.trim()) next.email = copy.emailRequired;
    else if (!EMAIL.test(values.email.trim())) next.email = copy.emailInvalid;
    if (values.message.trim().length < 20) next.message = copy.messageShort;
    if (!values.consent) next.consent = copy.consentRequired;
    return next;
  };

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'pending') return;

    const next = validate();
    if (Object.keys(next).length > 0) {
      setFieldErrors(next);
      setFormError('');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('pending');
    setFormError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          employees: values.employees,
          message: values.message.trim(),
          consent: values.consent,
          website: values.website,
          token,
          locale,
          source: window.location.pathname,
        }),
      });

      // Local `astro dev` does not run Pages Functions. The mock keeps the
      // success state testable and is compiled out of the production bundle.
      if (import.meta.env.DEV && response.status === 404) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mock = `MZ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        setReference(mock);
        setStatus('success');
        track('lead_submit', { source: window.location.pathname, locale, mock: true });
        return;
      }

      if (response.status === 429) {
        setFormError(copy.rateLimited);
        setStatus('idle');
        return;
      }

      if (response.status === 400) {
        const body = (await response.json().catch(() => ({}))) as {
          fields?: Partial<Record<keyof Values, string>>;
        };
        setFieldErrors(body.fields ?? {});
        setFormError(body.fields ? '' : copy.submitFailed);
        setStatus('idle');
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const body = (await response.json()) as { reference?: string };
      setReference(body.reference ?? '');
      setStatus('success');
      track('lead_submit', { source: window.location.pathname, locale });
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFormError(navigator.onLine ? copy.submitFailed : copy.network);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <svg className="form-success__mark check-draw" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="27" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <path
            d="M16 29.5 24.5 38 41 20.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 ref={successRef} tabIndex={-1}>
          {labels.successTitle}
        </h2>
        <p>{labels.successBody}</p>
        {reference && (
          <div className="form-success__ref">
            <span className="label">{labels.successRef}</span>
            <strong>{reference}</strong>
          </div>
        )}
        <p className="form__note">{labels.successNext}</p>
        <div className="form-success__actions">
          <a className="btn btn--secondary" href={pricingHref}>
            {labels.successPricing}
          </a>
          <a className="btn btn--primary" href={bookingHref}>
            {labels.successBook}
          </a>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(fieldErrors).filter(([, message]) => Boolean(message));
  const pending = status === 'pending';

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="visually-hidden">
        {labels.formTitle}
      </h2>

      {errorList.length > 0 && (
        <div
          className="form__summary"
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="form-summary-title"
        >
          <p id="form-summary-title">{copy.summary}</p>
          <ul>
            {errorList.map(([key, message]) => (
              <li key={key}>
                <a href={`#field-${key}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {formError && (
        <div className="alert alert--danger" role="alert">
          {formError}
        </div>
      )}

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor="field-name">
            {labels.name} <span className="field__optional">({labels.required})</span>
          </label>
          <input
            id="field-name"
            name="name"
            className="field__control"
            autoComplete="name"
            placeholder={labels.namePlaceholder}
            value={values.name}
            onChange={(event) => setField('name', event.target.value)}
            aria-invalid={fieldErrors.name ? 'true' : undefined}
            aria-describedby={fieldErrors.name ? 'error-name' : undefined}
            disabled={pending}
          />
          {fieldErrors.name && (
            <p className="field__error" id="error-name">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="field-email">
            {labels.email} <span className="field__optional">({labels.required})</span>
          </label>
          <input
            id="field-email"
            name="email"
            type="email"
            inputMode="email"
            className="field__control"
            autoComplete="email"
            placeholder={labels.emailPlaceholder}
            value={values.email}
            onChange={(event) => setField('email', event.target.value)}
            aria-invalid={fieldErrors.email ? 'true' : undefined}
            aria-describedby={fieldErrors.email ? 'error-email' : undefined}
            disabled={pending}
          />
          {fieldErrors.email && (
            <p className="field__error" id="error-email">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor="field-company">
            {labels.company} <span className="field__optional">({labels.optional})</span>
          </label>
          <input
            id="field-company"
            name="company"
            className="field__control"
            autoComplete="organization"
            placeholder={labels.companyPlaceholder}
            value={values.company}
            onChange={(event) => setField('company', event.target.value)}
            disabled={pending}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="field-employees">
            {labels.employees} <span className="field__optional">({labels.optional})</span>
          </label>
          <span className="select-wrap">
            <select
              id="field-employees"
              name="employees"
              className="field__control"
              value={values.employees}
              onChange={(event) => setField('employees', event.target.value)}
              disabled={pending}
            >
              <option value="">{labels.employeesPlaceholder}</option>
              {labels.employeeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="field-message">
          {labels.message} <span className="field__optional">({labels.required})</span>
        </label>
        <textarea
          id="field-message"
          name="message"
          className="field__control"
          rows={5}
          placeholder={labels.messagePlaceholder}
          value={values.message}
          onChange={(event) => setField('message', event.target.value)}
          aria-invalid={fieldErrors.message ? 'true' : undefined}
          aria-describedby={fieldErrors.message ? 'error-message' : undefined}
          disabled={pending}
        />
        {fieldErrors.message && (
          <p className="field__error" id="error-message">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <div className="form__honeypot" aria-hidden="true">
        <label htmlFor="field-website">Website</label>
        <input
          id="field-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => setField('website', event.target.value)}
        />
      </div>

      <label className="check" htmlFor="field-consent">
        <input
          id="field-consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(event) => setField('consent', event.target.checked)}
          aria-invalid={fieldErrors.consent ? 'true' : undefined}
          aria-describedby={fieldErrors.consent ? 'error-consent' : undefined}
          disabled={pending}
        />
        <span>
          {labels.consent}{' '}
          <a href={privacyHref} target="_blank" rel="noopener noreferrer">
            {labels.consentLink}
          </a>
          .
        </span>
      </label>
      {fieldErrors.consent && (
        <p className="field__error" id="error-consent">
          {fieldErrors.consent}
        </p>
      )}

      <div className="form__turnstile" ref={widgetRef} aria-hidden="true" />
      <p className="form__note">{labels.turnstileNote}</p>

      <div className="form__actions">
        <button className="btn btn--primary" type="submit" disabled={pending} data-pending={pending}>
          {pending && <span className="spinner" aria-hidden="true" />}
          {pending ? labels.submitting : labels.submit}
        </button>
        <p className="form__note">{labels.privacyNote}</p>
      </div>
    </form>
  );
}
