/**
 * E-01: contact submission.
 *
 * Order matters: honeypot, rate limit, Turnstile, validation, write, email.
 * The row is written before the mail is sent, so a Resend outage loses an email
 * but not the lead. The reference is returned only after the row exists.
 */

import type { Env } from '../_shared/env';
import { clientIp, fail, json, readJson } from '../_shared/respond';
import { asLocale, message } from '../_shared/messages';
import { rateLimit } from '../_shared/rate';
import { verifyTurnstile } from '../_shared/turnstile';
import { escapeHtml, rows, sendMail } from '../_shared/mail';
import { COMPANY_SIZES } from '../../src/data/company-sizes';
import { nextReference } from '../_shared/booking';

type Body = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  employees?: unknown;
  company_size?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
  token?: unknown;
  turnstileToken?: unknown;
  locale?: unknown;
  source?: unknown;
  source_page?: unknown;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SIZES = new Set<string>(COMPANY_SIZES);

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson<Body>(request);
  if (!body) return fail('form', 'Expected a JSON body.', 400);

  const locale = asLocale(body.locale);
  const ip = clientIp(request);

  // A filled honeypot gets a plausible success and leaves no trace.
  if (text(body.website).length > 0) {
    return json({ ok: true, reference: `MZ-${new Date().getFullYear()}-0000` });
  }

  if (!(await rateLimit(env.DB, `contact:${ip}`, 10, 60))) {
    return fail('form', message(locale, 'rate'), 429);
  }

  const turnstile = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    body.turnstileToken ?? body.token,
    ip,
  );
  if (turnstile === 'unconfigured') {
    console.error('[contact] TURNSTILE_SECRET_KEY is not set');
    return fail('form', message(locale, 'config'), 503);
  }
  if (turnstile === 'rejected') return fail('form', message(locale, 'turnstile'), 403);

  const name = text(body.name);
  const email = text(body.email);
  const company = text(body.company);
  const size = text(body.company_size ?? body.employees);
  const messageText = text(body.message);
  const sourcePage = text(body.source_page ?? body.source) || '/';

  if (name.length < 2 || name.length > 120) return fail('name', message(locale, 'name'), 400);
  if (email.length < 6 || email.length > 200 || !EMAIL.test(email)) {
    return fail('email', message(locale, 'email'), 400);
  }
  if (company.length > 120) return fail('company', message(locale, 'company'), 400);
  if (size.length > 0 && !SIZES.has(size)) return fail('employees', message(locale, 'employees'), 400);
  if (messageText.length < 20 || messageText.length > 4000) {
    return fail('message', message(locale, 'message'), 400);
  }
  if (body.consent !== true) return fail('consent', message(locale, 'consent'), 400);

  let reference: string;
  try {
    reference = await nextReference(env.DB, 'submission');
    await env.DB.prepare(
      `INSERT INTO submissions
         (reference, name, email, company, company_size, message, source_page, locale, turnstile_passed, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'received')`,
    )
      .bind(
        reference,
        name,
        email,
        company || null,
        size || null,
        messageText,
        sourcePage.slice(0, 200),
        locale,
      )
      .run();
  } catch (error) {
    console.error('[contact] D1 insert failed', error instanceof Error ? error.message : 'unknown');
    return fail('form', message(locale, 'server'), 500);
  }

  const subject = `[Mezomite] ${locale === 'id' ? 'Pesan baru' : 'New enquiry'} — ${name}${
    company ? ` (${company})` : ''
  }`;
  const pairs: Array<[string, string]> = [
    ['Reference', reference],
    ['Name', name],
    ['Email', email],
    ['Company', company],
    ['Company size', size],
    ['Locale', locale],
    ['Source', sourcePage],
    ['Submitted', new Date().toISOString()],
    ['Message', messageText],
  ];

  const result = await sendMail(env.RESEND_API_KEY, env.MAIL_FROM, {
    to: env.MAIL_TO ?? 'halo@mezomite.ai',
    subject,
    replyTo: email,
    text: pairs.map(([label, value]) => `${label}: ${value}`).join('\n'),
    html: `<div style="font-family:system-ui,sans-serif;color:#0e1a21"><h1 style="font-size:20px">${
      locale === 'id' ? 'Pesan baru dari situs' : 'New enquiry from the site'
    }</h1><table>${rows(pairs)}</table><p style="color:#5b6b74;font-size:13px">${escapeHtml(
      reference,
    )}</p></div>`,
  });

  if (result === 'sent' || result === 'failed') {
    await env.DB.prepare('UPDATE submissions SET status = ? WHERE reference = ?')
      .bind(result === 'sent' ? 'emailed' : 'failed', reference)
      .run()
      .catch(() => undefined);
  }

  return json({
    ok: true,
    reference,
    message:
      locale === 'id' ? 'Pesan Anda sudah terkirim.' : 'Your message has been sent.',
  });
};
