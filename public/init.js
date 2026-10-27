/**
 * Pre-paint bootstrap: theme, JS flag, and a returning visitor's language.
 * Loaded synchronously from the head so the page never flashes the wrong
 * theme. Kept as a file rather than an inline script so the Content-Security
 * Policy can stay free of 'unsafe-inline' for scripts.
 */
(function () {
  var root = document.documentElement;
  root.dataset.js = 'true';

  try {
    var stored = localStorage.getItem('mz-theme');
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.dataset.theme = stored === 'dark' || stored === 'light' ? stored : system;
  } catch (error) {
    root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

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
