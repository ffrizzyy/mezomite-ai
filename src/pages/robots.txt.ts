import type { APIRoute } from 'astro';

/**
 * Production allows crawling. A preview deployment (any branch other than
 * main) disallows everything, so a half-finished page never ranks.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://mezomite.ai')).origin;
  const branch = process.env.CF_PAGES_BRANCH;
  const production = !branch || branch === 'main';

  const body = production
    ? [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/',
        '',
        `Sitemap: ${origin}/sitemap-index.xml`,
        '',
      ].join('\n')
    : ['User-agent: *', 'Disallow: /', ''].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
