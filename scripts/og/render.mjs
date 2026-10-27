// Renders scripts/og/og.html to public/og.png at 1200x630.
//
//   node scripts/og/render.mjs
//
// A tiny static server stands in for a build so the card can use the real
// Fraunces, Public Sans, and IBM Plex Mono files from node_modules. Chrome is
// driven over the DevTools protocol, which means no extra dependency.
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
const OUT = join(ROOT, 'public', 'og.png');
const PORT = 4399;
const DEBUG_PORT = 9336;
const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : 'google-chrome');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${PORT}`);
  const path = normalize(join(ROOT, decodeURIComponent(url.pathname)));
  if (!path.startsWith(ROOT) || !existsSync(path) || statSync(path).isDirectory()) {
    response.writeHead(404).end('not found');
    return;
  }
  response.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(response);
});

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function waitFor(url, attempts = 40) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch {
      /* not up yet */
    }
    await sleep(200);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function connect(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  let id = 0;

  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      id += 1;
      pending.set(id, { res, rej });
      socket.send(JSON.stringify({ id, method, params }));
    });

  const ready = new Promise((res, rej) => {
    socket.addEventListener('open', res, { once: true });
    socket.addEventListener('error', rej, { once: true });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { res, rej } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rej(new Error(message.error.message));
    else res(message.result);
  });

  return { ready, send, close: () => socket.close() };
}

await new Promise((done) => server.listen(PORT, done));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${join(ROOT, '.wrangler', 'og-chrome')}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

try {
  const version = await waitFor(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
  const target = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: 'PUT' }).then(
    (response) => response.json(),
  );
  const client = connect(target.webSocketDebuggerUrl);
  await client.ready;
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 630,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: `http://localhost:${PORT}/scripts/og/og.html` });
  await client.send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  await sleep(300);

  const size = await client.send('Runtime.evaluate', {
    expression: `({ fonts: document.fonts.status, height: document.documentElement.scrollHeight })`,
    returnByValue: true,
  });
  if (size.result.value.height !== 630) {
    throw new Error(`Card is ${size.result.value.height}px tall, expected 630px`);
  }

  const shot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
  });

  writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
  console.log(`wrote ${OUT} (fonts: ${size.result.value.fonts}, ${version.Browser})`);
  client.close();
} finally {
  chrome.kill();
  server.close();
}
