import type { Locale } from './i18n';

/** The rate the PRD fixes for the whole site. Update in one place only. */
export const USD_RATE = 18100;

const idr = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** Rp 1.500.000 — always with the non-breaking-free "Rp" prefix. */
export function formatIDR(value: number): string {
  return `Rp ${idr.format(value)}`;
}

/** US$83, rounded. Used only as a secondary hint beside the IDR price. */
export function formatUSD(value: number): string {
  return `US$${usd.format(Math.round(value / USD_RATE))}`;
}

/** "Rp 1.500.000 (≈ US$83)". The approximation is stated, never implied. */
export function priceWithUSD(value: number): string {
  return `${formatIDR(value)} (≈ ${formatUSD(value)})`;
}

export function formatDate(date: Date | string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(`${date}T00:00:00Z`) : date;
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(`${date}T00:00:00Z`) : date;
  return d.toISOString().slice(0, 10);
}
