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
