/**
 * Booking rules shared by the availability and booking endpoints.
 *
 * Asia/Jakarta is UTC+7 all year, so date arithmetic happens on the ISO date
 * parts and the offset is written into every stored slot. The same rules run in
 * the browser (`src/components/sections/BookingForm.tsx`) so what a visitor can
 * click matches what the server accepts.
 */

import holidayData from '../../src/data/holidays.json';

export const TIME_ZONE = 'Asia/Jakarta';
export const OFFSET = '+07:00';
export const WINDOW_WEEKDAYS = 14;
export const SLOT_TIMES = [
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

const HOLIDAYS = new Set(Object.values(holidayData as Record<string, string[]>).flat());

export function jakartaToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function weekday(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Weekdays in the window, starting tomorrow, with holidays removed. */
export function bookableDays(count = WINDOW_WEEKDAYS): string[] {
  const days: string[] = [];
  const today = jakartaToday();

  for (let offset = 1; offset <= count * 3 && days.length < count; offset += 1) {
    const iso = addDays(today, offset);
    const dow = weekday(iso);
    if (dow === 0 || dow === 6 || HOLIDAYS.has(iso)) continue;
    days.push(iso);
  }

  return days;
}

export function allSlotKeys(count = WINDOW_WEEKDAYS): Set<string> {
  const keys = new Set<string>();
  for (const day of bookableDays(count)) {
    for (const time of SLOT_TIMES) keys.add(`${day}T${time}`);
  }
  return keys;
}

export type Slot = { start: string; end: string; key: string };

function addMinutes(time: string, minutes: number): string {
  const [hour, minute] = time.split(':').map(Number);
  const total = hour * 60 + minute + minutes;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
}

/** Accepts 2026-11-04T09:00, with optional seconds and +07:00. */
export function parseSlot(value: unknown): Slot | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?(?:\+07:00)?$/.exec(
    value.trim(),
  );
  if (!match) return null;

  const [, date, hour, minute] = match;
  const time = `${hour}:${minute}`;
  if (!SLOT_TIMES.includes(time)) return null;
  if (!allSlotKeys().has(`${date}T${time}`)) return null;

  return {
    start: `${date}T${time}:00${OFFSET}`,
    end: `${date}T${addMinutes(time, 30)}:00${OFFSET}`,
    key: `${date}T${time}`,
  };
}

/** The visitor-facing label of a slot, in WIB. */
export function describeSlot(slot: Slot, locale: 'id' | 'en'): string {
  const date = new Date(slot.start);
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/** Sequential BK-YYYY-NNNN and MZ-YYYY-NNNN references. */
export async function nextReference(
  db: D1Database,
  counter: 'submission' | 'booking',
): Promise<string> {
  const row = await db
    .prepare(
      `INSERT INTO counters (name, value) VALUES (?1, 1)
       ON CONFLICT (name) DO UPDATE SET value = value + 1
       RETURNING value`,
    )
    .bind(counter)
    .first<{ value: number }>();

  const year = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
  }).format(new Date());
  const prefix = counter === 'submission' ? 'MZ' : 'BK';
  return `${prefix}-${year}-${String(row?.value ?? 1).padStart(4, '0')}`;
}

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return base64url(new Uint8Array(signature)).slice(0, 32);
}

/**
 * A cancellation token is scoped to one reference and slot, so a leaked link
 * cannot cancel anything else. Without CANCEL_SECRET no token is produced and
 * the confirmation email tells the visitor to reply instead.
 */
export async function cancellationToken(
  secret: string | undefined,
  reference: string,
  slotStart: string,
): Promise<string | null> {
  if (!secret) return null;
  return hmac(secret, `cancel:${reference}:${slotStart}`);
}

export async function verifyCancellationToken(
  secret: string | undefined,
  reference: string,
  slotStart: string,
  token: unknown,
): Promise<boolean> {
  if (!secret || typeof token !== 'string' || token.length === 0) return false;
  const expected = await hmac(secret, `cancel:${reference}:${slotStart}`);
  if (expected.length !== token.length) return false;

  // Constant-time comparison; a token compare is cheap to do properly.
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ token.charCodeAt(index);
  }
  return mismatch === 0;
}
