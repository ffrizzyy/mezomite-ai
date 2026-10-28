import { expect, test, type Page } from '@playwright/test';

/**
 * The marketing site is static, so these tests are about the promises the build
 * makes at the edges: one language per page, one h1, no sideways scroll, a dark
 * default that survives a toggle, and the three canvas islands mounting only
 * where they are an improvement rather than a cost.
 *
 * The islands are progressive enhancement, so every test that asserts the
 * canvas also asserts the server-rendered fallback it replaced.
 */

const ROUTES = [
  '/',
  '/layanan',
  '/metode-audit',
  '/harga',
  '/glosarium',
  '/studi-kasus',
  '/hubungi',
  '/jadwalkan',
  '/kebijakan-privasi',
  '/en/',
  '/en/services',
  '/en/audit-method',
  '/en/pricing',
  '/en/contact',
];

const consent = {
  v: 1,
  ts: new Date().toISOString(),
  necessary: true,
  analytics: false,
};

async function prime(page: Page, theme: 'dark' | 'light' = 'dark') {
  await page.addInitScript(
    ([value, chosen]) => {
      localStorage.setItem('mz-consent', JSON.stringify(value));
      localStorage.setItem('mz-theme', chosen);
      localStorage.removeItem('mz-lang');
    },
    [consent, theme] as const,
  );
}

const desktop = (name: string) => name === 'desktop';

test.describe('theme', () => {
  test('defaults to dark and survives a toggle round trip', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const meta = page.locator('meta[name="theme-color"]');
    await expect(meta).toHaveAttribute('content', '#0A0A0B');

    await page.locator('[data-theme-toggle]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(meta).toHaveAttribute('content', '#FFFFFF');

    await page.locator('[data-theme-toggle]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('remembers the visitor choice across a reload', async ({ page }) => {
    await prime(page, 'light');
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('layout', () => {
  for (const path of ROUTES) {
    test(`${path} has one h1 and no sideways scroll`, async ({ page }) => {
      await prime(page);
      await page.goto(path);

      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', path.startsWith('/en') ? 'en' : 'id-ID');

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const offenders = [...document.querySelectorAll('body *')]
          .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
          .map((el) => el.className || el.tagName);
        return { scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth, offenders };
      });

      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth + 1);
    });
  }
});

test.describe('hero process graph', () => {
  test('draws a canvas over the server-rendered diagram on a wide screen', async ({ page }) => {
    test.skip(!desktop(test.info().project.name), 'the graph is desktop-only by design');
    await prime(page);

    const three: string[] = [];
    page.on('request', (request) => {
      if (/three\.module\./.test(request.url())) three.push(request.url());
    });

    await page.goto('/');
    const graph = page.locator('.process-graph');
    await expect(graph).toHaveAttribute('data-canvas', 'ready');
    await expect(graph.locator('.process-graph__labels li')).toHaveCount(4);

    const box = await graph.locator('canvas').boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(100);
    expect(box?.height ?? 0).toBeGreaterThan(40);
    expect(three.length).toBeGreaterThan(0);

    // The four stage names stay real text, which is what a screen reader reads.
    await expect(graph.locator('.process-graph__label').first()).toHaveText('Audit');
  });

  test('ships no WebGL to a phone and keeps the SVG fallback', async ({ page }) => {
    test.skip(desktop(test.info().project.name), 'only meaningful on the mobile project');
    await prime(page);

    const scripts: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'script') scripts.push(request.url());
    });

    await page.goto('/');
    const graph = page.locator('.process-graph');
    await expect(graph).toHaveAttribute('data-canvas', 'pending');
    await expect(graph.locator('.process-graph__fallback')).toBeVisible();
    expect(scripts.some((url) => /three\.module\./.test(url))).toBe(false);
  });
});

test.describe('method order diagram', () => {
  test('replaces the list with a canvas that refuses an impossible order', async ({ page }) => {
    test.skip(!desktop(test.info().project.name), 'drag is a pointer-only enhancement');
    await prime(page);
    await page.goto('/metode-audit');

    const host = page.locator('.order-steps');
    await host.scrollIntoViewIfNeeded();
    await expect(host).toHaveAttribute('data-canvas', 'ready');
    await expect(host.locator('.order-steps__fallback')).toBeHidden();

    const status = host.locator('.order-steps__status');
    await expect(status).toHaveAttribute('data-tone', 'hint');

    // Fabric stacks two canvases; the upper one is the one that receives input
    // and shares the stage's box.
    const canvas = host.locator('.order-steps__stage .upper-canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('no canvas box');

    // Mirror the layout constants in OrderSteps.tsx to find the third chip.
    const padding = 24;
    const gap = 16;
    const count = 5;
    const chipWidth = Math.max((box.width - padding * 2 - gap * (count - 1)) / count, 72);
    const slot = (index: number) => padding + chipWidth / 2 + index * (chipWidth + gap);
    const y = box.y + box.height / 2;

    // Pick step 03 up and drop it one slot to the right: step 03 consumes 02's
    // output, so the order cannot run and the diagram must say so.
    await page.mouse.move(box.x + slot(2), y);
    await page.mouse.down();
    await page.mouse.move(box.x + slot(2) + 40, y, { steps: 8 });
    await page.mouse.move(box.x + slot(3), y, { steps: 8 });
    await page.mouse.up();

    await expect(status).toHaveAttribute('data-tone', 'invalid');
    await expect(status).toHaveText(/tidak bisa dijalankan/);

    // Dropping it back where it belongs is a valid order.
    await page.mouse.move(box.x + slot(2), y);
    await page.mouse.down();
    await page.mouse.move(box.x + slot(2) + 4, y, { steps: 4 });
    await page.mouse.up();

    await expect(status).toHaveAttribute('data-tone', 'valid');
  });

  test('keeps a real ordered list on a phone', async ({ page }) => {
    test.skip(desktop(test.info().project.name), 'only meaningful on the mobile project');
    await prime(page);
    await page.goto('/metode-audit');

    const host = page.locator('.order-steps');
    await host.scrollIntoViewIfNeeded();
    await expect(host).toHaveAttribute('data-canvas', 'pending');
    await expect(host.locator('.order-steps__fallback')).toBeVisible();
    await expect(host.locator('.order-steps__fallback li')).toHaveCount(5);

    // The drag hint would promise an interaction the phone does not get.
    await expect(host.locator('.order-steps__status')).toBeHidden();
  });
});

test.describe('page background rings', () => {
  test('paints a WebGL backdrop that stays behind the page', async ({ page }) => {
    await prime(page);
    await page.goto('/');

    const layer = page.locator('.page-rings');
    const canvas = layer.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    const box = await canvas.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.width ?? 0).toBeGreaterThan(300);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(viewport!.width - 2);

    // The layer is pinned, never interactive, and one step behind the content.
    const style = await layer.evaluate((element) => {
      const cs = getComputedStyle(element);
      return { position: cs.position, zIndex: cs.zIndex, pointerEvents: cs.pointerEvents };
    });
    expect(style.position).toBe('fixed');
    expect(style.zIndex).toBe('-1');
    expect(style.pointerEvents).toBe('none');

    // Nothing above it swallowed the content: the hero heading is on top and
    // holds the click, not the canvas.
    await expect(page.locator('.hero h1')).toBeVisible();
    await expect(page.locator('.hero').getByRole('link').first()).toBeVisible();
  });

  test('stays a backdrop on a phone', async ({ page }) => {
    test.skip(desktop(test.info().project.name), 'only meaningful on the mobile project');
    await prime(page);
    await page.goto('/');

    const layer = page.locator('.page-rings');
    await expect(layer.locator('canvas')).toBeVisible({ timeout: 10_000 });

    // A fixed layer that overflows would scroll the page sideways.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('motion', () => {
  test('reduced motion leaves every section readable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await prime(page);
    await page.goto('/');

    await expect(page.locator('.hero h1')).toBeVisible();
    await expect(page.locator('.hero h1')).not.toHaveCSS('opacity', '0');

    const graph = page.locator('.process-graph');
    if (desktop(test.info().project.name)) {
      await expect(graph).toHaveAttribute('data-canvas', 'ready');
    }

    // Content must be readable at first paint, not faded in on scroll.
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('main section')].filter((section) => {
        const style = getComputedStyle(section);
        return style.opacity === '0' || style.visibility === 'hidden';
      }).length,
    );
    expect(hidden).toBe(0);
  });
});

test.describe('console', () => {
  test('no runtime errors on the pages with islands', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await prime(page);
    for (const path of ['/', '/metode-audit', '/en/', '/en/audit-method']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
    }

    expect(errors).toEqual([]);
  });
});
