/**
 * E-02 canonical path: GET /api/booking/slots?timezone=Asia/Jakarta
 *
 * The booking island reads /api/booking (same handler, fewer redirects), but
 * the documented path exists so the API matches the PRD table.
 */

import type { Env } from '../../_shared/env';
import { clientIp, fail, json } from '../../_shared/respond';
import { message } from '../../_shared/messages';
import { rateLimit } from '../../_shared/rate';
import { takenSlots } from '../../_shared/availability';
import { TIME_ZONE, allSlotKeys } from '../../_shared/booking';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const ip = clientIp(request);
  if (!(await rateLimit(env.DB, `slots:${ip}`, 30, 60))) {
    return fail('form', message('id', 'rate'), 429);
  }

  const url = new URL(request.url);
  const timezone = url.searchParams.get('timezone') ?? TIME_ZONE;

  try {
    new Intl.DateTimeFormat('en', { timeZone: timezone }).format();
  } catch {
    return fail('timezone', 'Unknown timezone. Use an IANA name such as Asia/Jakarta.', 400);
  }

  try {
    const availability = await takenSlots(
      env.DB,
      url.searchParams.get('from'),
      url.searchParams.get('to'),
    );
    const taken = new Set(availability.taken);

    return json({
      ok: true,
      timezone,
      from: availability.from,
      to: availability.to,
      taken: availability.taken,
      slots: [...allSlotKeys()].filter((key) => !taken.has(key)),
    });
  } catch (error) {
    console.error('[slots] query failed', error instanceof Error ? error.message : 'unknown');
    return fail('form', message('id', 'server'), 500);
  }
};
