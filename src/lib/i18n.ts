/**
 * Locale plumbing. Routing is path based: Indonesian at the root,
 * English under /en/. Both directions are declared here so a missing
 * translation is a type error rather than a 404.
 */

export const LOCALES = ['id', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'id';

export type Localized<T> = Record<Locale, T>;

export const ROUTES = {
  home: { id: '/', en: '/en/' },
  services: { id: '/layanan', en: '/en/services' },
  method: { id: '/metode-audit', en: '/en/audit-method' },
  pricing: { id: '/harga', en: '/en/pricing' },
  contact: { id: '/hubungi', en: '/en/contact' },
  booking: { id: '/jadwalkan', en: '/en/book' },
  bookingCancel: { id: '/jadwalkan/batal', en: '/en/book/cancel' },
  glossary: { id: '/glosarium', en: '/en/glossary' },
  privacy: { id: '/kebijakan-privasi', en: '/en/privacy-policy' },
  terms: { id: '/syarat-ketentuan', en: '/en/terms' },
  cookies: { id: '/kebijakan-cookie', en: '/en/cookie-policy' },
  cases: { id: '/studi-kasus', en: '/en/case-studies' },
} as const;

export type RouteKey = keyof typeof ROUTES;

/** The absolute path for a route key in a locale. */
export function route(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale];
}

/** The same page in the other language. Used by the language switch. */
export function routeInOtherLocale(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale === 'id' ? 'en' : 'id'];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** html lang attribute. Indonesian needs the region for screen readers. */
export function htmlLang(locale: Locale): string {
  return locale === 'id' ? 'id-ID' : 'en';
}

/** hreflang pairs for a route, plus x-default pointing at Indonesian. */
export function alternateLinks(key: RouteKey, site: URL | string) {
  const origin = new URL(site).origin;
  return [
    { hreflang: 'id-ID', href: origin + ROUTES[key].id },
    { hreflang: 'en', href: origin + ROUTES[key].en },
    { hreflang: 'x-default', href: origin + ROUTES[key].id },
  ];
}
