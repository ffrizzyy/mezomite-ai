/**
 * E-02 and E-03: slot availability and booking creation.
 *
 * The same file answers GET /api/booking (used by the form) and POST
 * /api/booking. /api/booking/slots delegates to the same availability helper
 * for the documented path.
 */

import type { Env } from '../_shared/env';
import { clientIp, fail, json, readJson } from '../_shared/respond';
import { asLocale, message } from '../_shared/messages';
import { rateLimit } from '../_shared/rate';
import { verifyTurnstile } from '../_shared/turnstile';
import { escapeHtml, rows, sendMail } from '../_shared/mail';
import { takenSlots } from '../_shared/availability';
import {
  TIME_ZONE,
  allSlotKeys,
  cancellationToken,
  describeSlot,
  nextReference,
  parseSlot,
} from '../_shared/booking';

type Body = {
  slot?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  package?: unknown;
  notes?: unknown;
  timezone?: unknown;
  locale?: unknown;
  source_page?: unknown;
  turnstileToken?: unknown;
  token?: unknown;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function validTimeZone(value: string): boolean {
  if (!value) return true;
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const ip = clientIp(request);
  if (!(await rateLimit(env.DB, `slots:${ip}`, 30, 60))) {
    return fail('form', message('id', 'rate'), 429);
  }

  try {
    const url = new URL(request.url);
    const availability = await takenSlots(
      env.DB,
      url.searchParams.get('from'),
      url.searchParams.get('to'),
    );
    const taken = new Set(availability.taken);
    const slots = [...allSlotKeys()].filter((key) => !taken.has(key));

    return json({
      ok: true,
      timezone: TIME_ZONE,
      from: availability.from,
      to: availability.to,
      taken: availability.taken,
      slots,
    });
  } catch (error) {
    console.error('[booking] availability failed', error instanceof Error ? error.message : 'unknown');
    return fail('form', message('id', 'server'), 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson<Body>(request);
  if (!body) return fail('form', 'Expected a JSON body.', 400);

  const locale = asLocale(body.locale);
  const ip = clientIp(request);

  if (!(await rateLimit(env.DB, `booking:${ip}`, 10, 60))) {
    return fail('form', message(locale, 'rate'), 429);
  }

  const turnstile = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    body.turnstileToken ?? body.token,
    ip,
  );
  if (turnstile === 'unconfigured') {
    console.error('[booking] TURNSTILE_SECRET_KEY is not set');
    return fail('form', message(locale, 'config'), 503);
  }
  if (turnstile === 'rejected') return fail('form', message(locale, 'turnstile'), 403);

  const slot = parseSlot(body.slot);
  if (!slot) return fail('slot', message(locale, 'slotInvalid'), 400);

  const name = text(body.name);
  const email = text(body.email);
  const company = text(body.company);
  const notes = text(body.notes);
  const pkg = text(body.package);
  const timezone = text(body.timezone) || TIME_ZONE;
  const sourcePage = text(body.source_page) || '/';

  if (name.length < 2 || name.length > 120) return fail('name', message(locale, 'name'), 400);
  if (email.length < 6 || email.length > 200 || !EMAIL.test(email)) {
    return fail('email', message(locale, 'email'), 400);
  }
  if (company.length > 120) return fail('company', message(locale, 'company'), 400);
  if (notes.length > 1000) return fail('notes', message(locale, 'message'), 400);
  if (!validTimeZone(timezone)) return fail('form', message(locale, 'slotInvalid'), 400);

  const reference = await nextReference(env.DB, 'booking');

  try {
    const inserted = await env.DB.prepare(
      `INSERT INTO bookings
         (reference, slot_start, slot_end, timezone, name, email, company, package, notes, source_page, status)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'booked'
        WHERE NOT EXISTS (
          SELECT 1 FROM bookings WHERE slot_start = ? AND status = 'booked'
        )
       RETURNING id`,
    )
      .bind(
        reference,
        slot.start,
        slot.end,
        timezone,
        name,
        email,
        company || null,
        pkg || null,
        notes || null,
        sourcePage.slice(0, 200),
        slot.start,
      )
      .first<{ id: number }>();

    if (!inserted) return fail('slot', message(locale, 'slotTaken'), 409);
  } catch (error) {
    // The partial unique index is the last line of defence for a race.
    const detail = error instanceof Error ? error.message : '';
    if (detail.includes('UNIQUE')) return fail('slot', message(locale, 'slotTaken'), 409);
    console.error('[booking] D1 insert failed', detail || 'unknown');
    return fail('form', message(locale, 'server'), 500);
  }

  const slotLabel = describeSlot(slot, locale);
  const token = await cancellationToken(env.CANCEL_SECRET, reference, slot.start);
  const origin = env.SITE_ORIGIN ?? 'https://mezomite.ai';
  const cancelPath = locale === 'id' ? '/jadwalkan/batal' : '/en/book/cancel';
  const cancellationUrl = token
    ? `${origin}${cancelPath}?ref=${encodeURIComponent(reference)}&t=${token}`
    : null;

  const visitorSubject =
    locale === 'id'
      ? `Panggilan Anda terjadwal — ${reference}`
      : `Your call is booked — ${reference}`;

  const visitorText =
    locale === 'id'
      ? [
          `Halo ${name},`,
          '',
          `Panggilan 30 menit Anda sudah terjadwal pada ${slotLabel} WIB.`,
          `Nomor referensi: ${reference}`,
          '',
          'Kami akan mengirim pengingat satu hari sebelumnya.',
          cancellationUrl
            ? `Perlu waktu lain? Batalkan lewat tautan ini: ${cancellationUrl}`
            : 'Perlu waktu lain? Balas email ini dan kami akan menjadwalkan ulang.',
          '',
          'Sampai jumpa.',
          'Mezomite.ai',
        ].join('\n')
      : [
          `Hello ${name},`,
          '',
          `Your 30 minute call is booked for ${slotLabel} WIB.`,
          `Reference: ${reference}`,
          '',
          'We will send a reminder one day before the call.',
          cancellationUrl
            ? `Need another time? Cancel here: ${cancellationUrl}`
            : 'Need another time? Reply to this email and we will reschedule.',
          '',
          'See you then.',
          'Mezomite.ai',
        ].join('\n');

  const visitorHtml = `<div style="font-family:system-ui,sans-serif;color:#0e1a21;line-height:1.6">
    <p>${locale === 'id' ? 'Halo' : 'Hello'} ${escapeHtml(name)},</p>
    <p>${
      locale === 'id'
        ? 'Panggilan 30 menit Anda sudah terjadwal pada'
        : 'Your 30 minute call is booked for'
    } <strong>${escapeHtml(slotLabel)} WIB</strong>.</p>
    <p>${locale === 'id' ? 'Nomor referensi' : 'Reference'}: <strong>${escapeHtml(reference)}</strong></p>
    <p>${
      locale === 'id'
        ? 'Kami akan mengirim pengingat satu hari sebelumnya.'
        : 'We will send a reminder one day before the call.'
    }</p>
    ${
      cancellationUrl
        ? `<p><a href="${escapeHtml(cancellationUrl)}">${
            locale === 'id' ? 'Batalkan atau pilih waktu lain' : 'Cancel or pick another time'
          }</a></p>`
        : `<p>${
            locale === 'id'
              ? 'Perlu waktu lain? Balas email ini.'
              : 'Need another time? Reply to this email.'
          }</p>`
    }
    <p style="color:#5b6b74">Mezomite.ai</p>
  </div>`;

  const notifyText = [
    `Reference: ${reference}`,
    `Slot: ${slot.start} (${timezone})`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '-'}`,
    `Package: ${pkg || '-'}`,
    `Locale: ${locale}`,
    `Source: ${sourcePage}`,
    `Notes: ${notes || '-'}`,
  ].join('\n');

  const notifyHtml = `<div style="font-family:system-ui,sans-serif;color:#0e1a21"><h1 style="font-size:20px">${
    locale === 'id' ? 'Panggilan baru' : 'New call booking'
  }</h1><table>${rows([
    ['Reference', reference],
    ['Slot', `${slot.start} (${timezone})`],
    [locale === 'id' ? 'Waktu WIB' : 'Time in WIB', slotLabel],
    ['Name', name],
    ['Email', email],
    ['Company', company],
    ['Package', pkg],
    ['Notes', notes],
    ['Locale', locale],
    ['Source', sourcePage],
  ])}</table></div>`;

  const [visitorResult, notifyResult] = await Promise.all([
    sendMail(env.RESEND_API_KEY, env.MAIL_FROM, {
      to: email,
      subject: visitorSubject,
      text: visitorText,
      html: visitorHtml,
      replyTo: env.MAIL_TO,
    }),
    sendMail(env.RESEND_API_KEY, env.MAIL_FROM, {
      to: env.MAIL_TO ?? 'halo@mezomite.ai',
      subject: `[Mezomite] ${locale === 'id' ? 'Panggilan baru' : 'New booking'} — ${reference}`,
      text: notifyText,
      html: notifyHtml,
      replyTo: email,
    }),
  ]);

  if (visitorResult === 'failed' || notifyResult === 'failed') {
    console.error('[booking] one or more confirmation emails failed', reference);
  }

  return json({
    ok: true,
    reference,
    slot: slot.start,
    cancellationUrl,
    message:
      locale === 'id'
        ? 'Jadwal Anda sudah tersimpan. Undangan dikirim lewat email.'
        : 'Your booking is saved. The invitation is on its way by email.',
  });
};
