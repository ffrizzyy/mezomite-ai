// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mezomite.ai',
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Astro writes a per-page <meta http-equiv="content-security-policy"> with
  // hashes for every inline script and style it emits. The island bootstrap is
  // inline and its content differs per page, so it cannot be hashed by hand in
  // public/_headers; enabling this is what lets a strict script-src coexist
  // with hydration. public/_headers keeps the directives that a meta tag
  // cannot express (frame-ancestors), plus the non-CSP security headers.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
        "frame-src https://challenges.cloudflare.com",
        'upgrade-insecure-requests',
      ],
      // Turnstile and the consent-gated analytics beacon are the only third
      // parties. 'unsafe-inline' stays out of script-src on purpose.
      scriptDirective: {
        resources: [
          "'self'",
          'https://challenges.cloudflare.com',
          'https://static.cloudflareinsights.com',
        ],
      },
      // Inline style attributes and Astro's inlined <style> tags need this;
      // style-src has never been the interesting half of a CSP here.
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },
  integrations: [
    react(),
    sitemap({
      // Utility and error pages are noindex; a sitemap should not list them.
      filter: (page) =>
        !page.endsWith('/404/') &&
        !page.includes('/404') &&
        !page.includes('/jadwalkan/batal') &&
        !page.includes('/en/book/cancel'),
      i18n: {
        defaultLocale: 'id',
        locales: { id: 'id-ID', en: 'en' },
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // No remote images in the MVP. Diagrams are inline SVG.
    domains: [],
  },
  vite: {
    build: {
      // Keep the island runtime small; Astro handles the rest.
      assetsInlineLimit: 2048,
    },
  },
});
