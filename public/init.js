/**
 * Pre-paint bootstrap: theme, JS flag, and a returning visitor's language.
 * Loaded synchronously from the head so the page never flashes the wrong
 * theme. Kept as a file rather than an inline script so the Content-Security
 * Policy can stay free of 'unsafe-inline' for scripts.
 */
(function () {
  var root = document.documentElement;
  root.dataset.js = 'true';

  // Dark is the house default. A visitor's explicit choice wins; the system
  // preference is not consulted, because the brand surface is dark and a
  // light-mode OS should not silently change the site's first impression.
  var theme = 'dark';
  try {
    var stored = localStorage.getItem('mz-theme');
    if (stored === 'light' || stored === 'dark') theme = stored;
  } catch (error) {
    /* Storage blocked: fall through to the default. */
  }
  root.dataset.theme = theme;

  // Keep the browser chrome in step with the page. This file is loaded after
  // the meta tag it edits, so the write lands before the first paint.
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0B' : '#FFFFFF');

  // A previous language choice persists. Crawlers have no storage, so indexing
  // is unaffected; only a returning reader is redirected.
  try {
    var lang = localStorage.getItem('mz-lang');
    var path = window.location.pathname;
    if (lang === 'en' && path === '/') window.location.replace('/en/');
    if (lang === 'id' && path === '/en/') window.location.replace('/');
  } catch (error) {
    /* Storage blocked, no redirect. */
  }
})();
