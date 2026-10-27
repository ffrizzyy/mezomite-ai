/**
 * Transactional email through Resend.
 *
 * The function never throws on a mail failure: the row is already in D1 and the
 * visitor keeps a reference. A failed send is recorded on the row and logged, so
 * the weekly review can resend from the dashboard.
 */

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type MailResult = 'sent' | 'failed' | 'disabled';

export async function sendMail(
  apiKey: string | undefined,
  from: string | undefined,
  mail: Mail,
): Promise<MailResult> {
  if (!apiKey || !from) {
    console.warn('[mail] RESEND_API_KEY or MAIL_FROM is missing; email skipped');
    return 'disabled';
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      console.error('[mail] Resend rejected the message', response.status);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error('[mail] Resend request failed', error instanceof Error ? error.message : 'unknown');
    return 'failed';
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** A plain table keeps the notification readable in every mail client. */
export function rows(pairs: Array<[string, string]>): string {
  return pairs
    .filter(([, value]) => value.trim().length > 0)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5b6b74;white-space:nowrap;vertical-align:top">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;color:#0e1a21">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
}
