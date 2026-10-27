import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { track } from '../../lib/analytics';
import { mountTurnstile } from '../../lib/turnstile';
import { HOLIDAYS } from '../../data/schedule';

type Labels = {
  dayLabel: string;
  timeLabel: string;
  detailsLabel: string;
  selectionLabel: string;
  name: string;
  email: string;
  company: string;
  notes: string;
  notesPlaceholder: string;
  submit: string;
  submitting: string;
  loading: string;
  empty: string;
  holidayNote: string;
  timezoneNote: string;
  successTitle: string;
  successBody: string;
  successRef: string;
  successCancel: string;
  stepOne: string;
  stepTwo: string;
  stepThree: string;
  durationValue: string;
  durationLabel: string;
  timezoneLabel: string;
  turnstileNote: string;
};

type Errors = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  slotRequired: string;
  slotTaken: string;
  bookingFailed: string;
  network: string;
};

type Props = {
  locale: 'id' | 'en';
  labels: Labels;
  errors: Errors;
};

type Day = {
  iso: string;
  dayNum: number;
  weekday: string;
  month: string;
  long: string;
};

const SLOT_TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HOLIDAY_SET = new Set(Object.values(HOLIDAYS).flat());

function buildDays(count: number, locale: 'id' | 'en'): Day[] {
  const tag = locale === 'id' ? 'id-ID' : 'en-GB';
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const [year, month, day] = today.split('-').map(Number);
  const days: Day[] = [];

  for (let offset = 1; offset <= count * 3 && days.length < count; offset += 1) {
    const date = new Date(Date.UTC(year, month - 1, day + offset));
    const iso = date.toISOString().slice(0, 10);
    const dow = date.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    if (HOLIDAY_SET.has(iso)) continue;

    days.push({
      iso,
      dayNum: date.getUTCDate(),
      weekday: new Intl.DateTimeFormat(tag, { weekday: 'short', timeZone: 'UTC' }).format(date),
      month: new Intl.DateTimeFormat(tag, { month: 'short', timeZone: 'UTC' }).format(date),
      long: new Intl.DateTimeFormat(tag, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date),
    });
  }

  return days;
}

export default function BookingForm({ locale, labels, errors: copy }: Props) {
  const [days, setDays] = useState<Day[]>([]);
  const [day, setDay] = useState<Day | null>(null);
  const [time, setTime] = useState('');
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [availability, setAvailability] = useState<'loading' | 'ready' | 'error'>('loading');
  const [values, setValues] = useState({ name: '', email: '', company: '', notes: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [reference, setReference] = useState('');
  const [token, setToken] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;
    mountTurnstile(widgetRef.current, setToken);
  }, []);

  useEffect(() => {
    const list = buildDays(14, locale);
    setDays(list);
    setDay(list[0] ?? null);
  }, [locale]);

  useEffect(() => {
    if (days.length === 0) return;
    let cancelled = false;
    const from = days[0].iso;
    const to = days[days.length - 1].iso;

    const load = async () => {
      try {
        const response = await fetch(`/api/booking?from=${from}&to=${to}`);
        if (import.meta.env.DEV && response.status === 404) {
          // Pages Functions do not run under `astro dev`. One taken slot keeps
          // the unavailable state testable without pretending in production.
          if (!cancelled) {
            setTaken(new Set([`${days[1]?.iso ?? from}T11:00`]));
            setAvailability('ready');
          }
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const body = (await response.json()) as { taken?: string[] };
        if (!cancelled) {
          setTaken(new Set(body.taken ?? []));
          setAvailability('ready');
        }
      } catch {
        if (!cancelled) setAvailability('error');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const selectedKey = day ? `${day.iso}T${time}` : '';

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'pending') return;

    const next: Record<string, string | undefined> = {};
    if (!day || !time) next.slot = copy.slotRequired;
    if (values.name.trim().length < 2) next.name = copy.nameRequired;
    if (!values.email.trim()) next.email = copy.emailRequired;
    else if (!EMAIL.test(values.email.trim())) next.email = copy.emailInvalid;

    if (Object.keys(next).length > 0) {
      setFieldErrors(next);
      return;
    }

    setStatus('pending');
    setFormError('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slot: `${day?.iso}T${time}:00+07:00`,
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          notes: values.notes.trim(),
          timezone: 'Asia/Jakarta',
          locale,
          source_page: window.location.pathname,
          turnstileToken: token,
        }),
      });

      if (import.meta.env.DEV && response.status === 404) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReference(`BK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
        setStatus('success');
        track('booking_complete', { locale, mock: true });
        return;
      }

      if (response.status === 409) {
        setFormError(copy.slotTaken);
        setStatus('idle');
        setTaken((current) => new Set(current).add(selectedKey));
        setTime('');
        setToken('');
        window.turnstile?.reset();
        track('booking_conflict', { locale });
        return;
      }

      if (response.status === 400) {
        const body = (await response.json().catch(() => ({}))) as { fields?: Record<string, string> };
        setFieldErrors(body.fields ?? {});
        setFormError(body.fields ? '' : copy.bookingFailed);
        setStatus('idle');
        setToken('');
        window.turnstile?.reset();
        return;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const body = (await response.json()) as { reference?: string };
      setReference(body.reference ?? '');
      setStatus('success');
      track('booking_complete', { locale });
    } catch {
      setFormError(navigator.onLine ? copy.bookingFailed : copy.network);
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
        <h2>{labels.successTitle}</h2>
        <p>{labels.successBody}</p>
        <div className="form-success__ref">
          <span className="label">{labels.successRef}</span>
          <strong>{reference}</strong>
        </div>
        <div className="booking__summary" aria-label={labels.selectionLabel}>
          <span className="label">{labels.selectionLabel}</span>
          <div className="booking__summary-row">
            <span>{labels.dayLabel}</span>
            <span>{day?.long ?? '—'}</span>
          </div>
          <div className="booking__summary-row">
            <span>{labels.timeLabel}</span>
            <span className="mono">
              {time} {labels.timezoneLabel}
            </span>
          </div>
          <div className="booking__summary-row">
            <span>{labels.durationLabel}</span>
            <span>{labels.durationValue}</span>
          </div>
        </div>
        <p className="form__note">{labels.successCancel}</p>
      </div>
    );
  }

  const pending = status === 'pending';

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      <div className="booking__main">
        <div className="booking-steps" aria-hidden="true">
          <span data-active={!day}>{`01 ${labels.stepOne}`}</span>
          <span data-active={Boolean(day) && !time}>{`02 ${labels.stepTwo}`}</span>
          <span data-active={Boolean(time)}>{`03 ${labels.stepThree}`}</span>
        </div>

        <span className="booking__label" id="day-label">
          {labels.dayLabel}
        </span>
        <div className="booking__days" role="group" aria-labelledby="day-label">
          {days.length === 0
            ? Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="slot-skeleton" style={{ width: '5.25rem', flex: 'none' }} />
              ))
            : days.map((item) => (
                <button
                  key={item.iso}
                  type="button"
                  className="day"
                  aria-pressed={day?.iso === item.iso}
                  aria-label={item.long}
                  onClick={() => {
                    setDay(item);
                    setTime('');
                  }}
                  disabled={pending}
                >
                  <span className="day__dow">{item.weekday}</span>
                  <span className="day__num">{item.dayNum}</span>
                  <span className="day__month">{item.month}</span>
                </button>
              ))}
        </div>

        <span className="booking__label" style={{ marginTop: 'var(--space-6)' }} id="time-label">
          {labels.timeLabel} · {labels.timezoneLabel}
        </span>

        {availability === 'loading' ? (
          <div className="booking__slots" aria-busy="true" aria-live="polite">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="slot-skeleton" />
            ))}
          </div>
        ) : availability === 'error' ? (
          <p className="booking__empty">{copy.bookingFailed}</p>
        ) : (
          <div className="booking__slots" role="group" aria-labelledby="time-label">
            {SLOT_TIMES.map((slot) => {
              const key = `${day?.iso ?? ''}T${slot}`;
              const isTaken = taken.has(key);
              return (
                <button
                  key={slot}
                  type="button"
                  className="slot"
                  aria-pressed={time === slot}
                  onClick={() => {
                    setTime(slot);
                    setFieldErrors((current) => ({ ...current, slot: undefined }));
                  }}
                  disabled={isTaken || pending}
                  aria-label={`${slot} ${labels.timezoneLabel}`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}

        {availability === 'ready' && (
          <p className="booking__note">{labels.holidayNote}</p>
        )}

        <div className="booking__summary" aria-label={labels.selectionLabel}>
          <span className="label">{labels.selectionLabel}</span>
          <div className="booking__summary-row">
            <span>{labels.dayLabel}</span>
            <span>{day?.long ?? '—'}</span>
          </div>
          <div className="booking__summary-row">
            <span>{labels.timeLabel}</span>
            <span className="mono">{time ? `${time} ${labels.timezoneLabel}` : '—'}</span>
          </div>
          <div className="booking__summary-row">
            <span>{labels.durationLabel}</span>
            <span>{labels.durationValue}</span>
          </div>
        </div>

        <div className="booking__details">
          <h2>{labels.detailsLabel}</h2>

          {fieldErrors.slot && <p className="field__error">{fieldErrors.slot}</p>}
          {formError && (
            <div className="alert alert--danger" role="alert">
              {formError}
            </div>
          )}

          <div className="form__row">
            <div className="field">
              <label className="field__label" htmlFor="booking-name">
                {labels.name}
              </label>
              <input
                id="booking-name"
                className="field__control"
                autoComplete="name"
                value={values.name}
                onChange={(event) => {
                  setValues((current) => ({ ...current, name: event.target.value }));
                  setFieldErrors((current) => ({ ...current, name: undefined }));
                }}
                aria-invalid={fieldErrors.name ? 'true' : undefined}
                aria-describedby={fieldErrors.name ? 'booking-name-error' : undefined}
                disabled={pending}
              />
              {fieldErrors.name && (
                <p className="field__error" id="booking-name-error">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="booking-email">
                {labels.email}
              </label>
              <input
                id="booking-email"
                className="field__control"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => {
                  setValues((current) => ({ ...current, email: event.target.value }));
                  setFieldErrors((current) => ({ ...current, email: undefined }));
                }}
                aria-invalid={fieldErrors.email ? 'true' : undefined}
                aria-describedby={fieldErrors.email ? 'booking-email-error' : undefined}
                disabled={pending}
              />
              {fieldErrors.email && (
                <p className="field__error" id="booking-email-error">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="booking-company">
              {labels.company}
            </label>
            <input
              id="booking-company"
              className="field__control"
              autoComplete="organization"
              value={values.company}
              onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))}
              disabled={pending}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="booking-notes">
              {labels.notes}
            </label>
            <textarea
              id="booking-notes"
              className="field__control"
              rows={3}
              placeholder={labels.notesPlaceholder}
              value={values.notes}
              onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))}
              disabled={pending}
            />
          </div>

          <div className="form__turnstile" ref={widgetRef} aria-hidden="true" />
          <p className="form__note">{labels.turnstileNote}</p>

          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={pending} data-pending={pending}>
              {pending && <span className="spinner" aria-hidden="true" />}
              {pending ? labels.submitting : labels.submit}
            </button>
            <p className="form__note">{labels.timezoneNote}</p>
          </div>
        </div>
      </div>
    </form>
  );
}
