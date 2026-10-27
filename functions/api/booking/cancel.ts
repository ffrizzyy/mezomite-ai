/**
 * Booking cancellation.
 *
 * The confirmation email carries a token scoped to one reference and slot, so
 * the reference alone is not enough to cancel someone else's call. A cancelled
 * slot is released because the unique index only covers `status = 'booked'`.
 */

import type { Env } from '../../_shared/env';
import { clientIp, fail, json, readJson } from '../../_shared/respond';
import { asLocale, message } from '../../_shared/messages';
import { rateLimit } from '../../_shared/rate';
import { escapeHtml, sendMail } from '../../_shared/mail';
import { describeSlot, verifyCancellationToken } from '../../_shared/booking';

type Body = {
  ref?: unknown;
  token?: unknown;
  locale?: unknown;
};

type BookingRow = {
  reference: string;
  slot_start: string;
  slot_end: string;
  timezone: string;
  name: string;
  email: string;
  status: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson<Body>(request);
  if (!body) return fail('form', 'Expected a JSON body.', 400);

  const locale = asLocale(body.locale);
  const ip = clientIp(request);

  if (!(await rateLimit(env.DB, `cancel:${ip}`, 10, 60))) {
    return fail('form', message(locale, 'rate'), 429);
  }

  const reference = typeof body.ref === 'string' ? body.ref.trim() : '';
  if (!/^BK-\d{4}-\d{4}$/.test(reference)) {
    return fail('ref', message(locale, 'notFound'), 404);
  }

  const booking = await env.DB.prepare(
    `SELECT reference, slot_start, slot_end, timezone, name, email, status
       FROM bookings WHERE reference = ?`,
  )
    .bind(reference)
    .first<BookingRow>();

  if (!booking) return fail('ref', message(locale, 'notFound'), 404);

  const valid = await verifyCancellationToken(
    env.CANCEL_SECRET,
    booking.reference,
    booking.slot_start,
    body.token,
  );
  if (!valid) return fail('token', message(locale, 'badToken'), 403);

  if (booking.status !== 'booked') {
    return fail('form', message(locale, 'cancelled'), 409);
  }

  const updated = await env.DB.prepare(
    `UPDATE bookings SET status = 'cancelled'
      WHERE reference = ? AND status = 'booked'
      RETURNING id`,
  )
    .bind(reference)
    .first<{ id: number }>();

  if (!updated) return fail('form', message(locale, 'cancelled'), 409);

  const slotLabel = describeSlot(
    { start: booking.slot_start, end: booking.slot_end, key: booking.slot_start.slice(0, 16) },
    locale,
  );

  const visitorText =
    locale === 'id'
      ? [
          `Halo ${booking.name},`,
          '',
          `Panggilan pada ${slotLabel} WIB sudah dibatalkan.`,
          `Nomor referensi: ${booking.reference}`,
          '',
          'Kalau ini bukan Anda, balas email ini secepatnya.',
          '',
          'Mezomite.ai',
        ].join('\n')
      : [
          `Hello ${booking.name},`,
          '',
          `The call on ${slotLabel} WIB has been cancelled.`,
          `Reference: ${booking.reference}`,
          '',
          'If this was not you, reply to this email as soon as possible.',
          '',
          'Mezomite.ai',
        ].join('\n');

  const visitorHtml = `<div style="font-family:system-ui,sans-serif;color:#0e1a21;line-height:1.6">
    <p>${locale === 'id' ? 'Halo' : 'Hello'} ${escapeHtml(booking.name)},</p>
    <p>${
      locale === 'id'
        ? 'Panggilan berikut sudah dibatalkan:'
        : 'The following call has been cancelled:'
    } <strong>${escapeHtml(slotLabel)} WIB</strong></p>
    <p>${locale === 'id' ? 'Nomor referensi' : 'Reference'}: <strong>${escapeHtml(
      booking.reference,
    )}</strong></p>
    <p style="color:#5b6b74">Mezomite.ai</p>
  </div>`;

  await Promise.all([
    sendMail(env.RESEND_API_KEY, env.MAIL_FROM, {
      to: booking.email,
      subject:
        locale === 'id'
          ? `Panggilan dibatalkan — ${booking.reference}`
          : `Call cancelled — ${booking.reference}`,
      text: visitorText,
      html: visitorHtml,
      replyTo: env.MAIL_TO,
    }),
    sendMail(env.RESEND_API_KEY, env.MAIL_FROM, {
      to: env.MAIL_TO ?? 'halo@mezomite.ai',
      subject: `[Mezomite] ${locale === 'id' ? 'Pembatalan' : 'Cancellation'} — ${booking.reference}`,
      text: [
        `Reference: ${booking.reference}`,
        `Slot: ${booking.slot_start} (${booking.timezone})`,
        `Name: ${booking.name}`,
        `Email: ${booking.email}`,
        'Status: cancelled',
      ].join('\n'),
      html: `<div style="font-family:system-ui,sans-serif;color:#0e1a21"><p>${
        locale === 'id' ? 'Panggilan dibatalkan' : 'Booking cancelled'
      }.</p><p>${escapeHtml(booking.reference)} — ${escapeHtml(booking.slot_start)}</p><p>${escapeHtml(
        booking.name,
      )} &lt;${escapeHtml(booking.email)}&gt;</p></div>`,
      replyTo: booking.email,
    }),
  ]);

  return json({
    ok: true,
    reference: booking.reference,
    slot: booking.slot_start,
    message:
      locale === 'id'
        ? 'Jadwal Anda sudah dibatalkan. Konfirmasi dikirim lewat email.'
        : 'Your booking is cancelled. A confirmation is on its way by email.',
  });
};
