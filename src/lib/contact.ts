import type { Locale } from './i18n';

/**
 * Contact details come from the public env, not from copy, so the same string
 * is never maintained twice. Fallbacks keep local builds honest.
 */
const env = import.meta.env;

export const CONTACT = {
  email: (env.PUBLIC_CONTACT_EMAIL as string | undefined) ?? 'halo@mezomite.ai',
  whatsapp: (env.PUBLIC_WHATSAPP_NUMBER as string | undefined) ?? '6281234567890',
  whatsappDisplay: (env.PUBLIC_WHATSAPP_DISPLAY as string | undefined) ?? '+62 812-3456-7890',
};

export const SITE_ORIGIN = 'https://mezomite.ai';

export function mailtoLink(locale: Locale, subject?: string): string {
  const line =
    subject ?? (locale === 'id' ? 'Pertanyaan tentang audit proses' : 'Question about a process audit');
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(line)}`;
}

/**
 * F-018: a deep link with a prefilled message that carries the source page.
 * The page URL is included so the firm knows which screen started the chat.
 */
export function whatsappLink(locale: Locale, path: string): string {
  const intro =
    locale === 'id'
      ? 'Halo Mezomite.ai, saya ingin bertanya soal audit proses.'
      : 'Hello Mezomite.ai, I would like to ask about a process audit.';
  const pageLabel = locale === 'id' ? 'Halaman' : 'Page';
  const text = `${intro}\n${pageLabel}: ${SITE_ORIGIN}${path}`;
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}
