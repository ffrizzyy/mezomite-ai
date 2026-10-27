import { bookableDays } from './booking';

/**
 * Availability for the booking window. `from` and `to` are ISO dates supplied
 * by the form so a partially loaded month does not need a second round trip.
 */
export async function takenSlots(
  db: D1Database,
  from?: string | null,
  to?: string | null,
): Promise<{ from: string; to: string; taken: string[] }> {
  const days = bookableDays();
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const start = from && iso.test(from) ? from : days[0];
  const end = to && iso.test(to) ? to : days[days.length - 1];

  const result = await db
    .prepare(
      `SELECT substr(slot_start, 1, 16) AS key
         FROM bookings
        WHERE status = 'booked'
          AND substr(slot_start, 1, 10) BETWEEN ? AND ?`,
    )
    .bind(start, end)
    .all<{ key: string }>();

  return { from: start, to: end, taken: result.results.map((row) => row.key) };
}
