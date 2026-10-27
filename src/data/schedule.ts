import type { Localized } from '../lib/i18n';
import rawHolidays from './holidays.json';

/** Indonesian public holidays for the booking window. Verify against the
 *  official SKB three-cabinet decision before each calendar year; the list is
 *  intentionally conservative and only removes days, never adds them.
 *  Shared with the booking Functions through holidays.json. */
export const HOLIDAYS: Record<string, string[]> = rawHolidays;

export const BOOKING_WINDOWS = {
  id: {
    days: 14,
    slotMinutes: 30,
    label: 'Senin–Jumat, 09.00–16.00 WIB',
    timezone: 'Asia/Jakarta',
    timezoneLabel: 'WIB (GMT+7)',
    note: 'Jadwal ditampilkan dalam WIB. Tulis zona waktu Anda di catatan kalau berbeda.',
  },
  en: {
    days: 14,
    slotMinutes: 30,
    label: 'Monday–Friday, 09:00–16:00 WIB',
    timezone: 'Asia/Jakarta',
    timezoneLabel: 'WIB (GMT+7)',
    note: 'Times are shown in WIB. Add your timezone in the notes if it differs.',
  },
} satisfies Localized<{
  days: number;
  slotMinutes: number;
  label: string;
  timezone: string;
  timezoneLabel: string;
  note: string;
}>;
