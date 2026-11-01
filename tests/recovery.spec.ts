import { expect, test, Page, Locator, Route } from '@playwright/test';

// Inspect real R3F camera through React's test-only DevTools hook, not store targets.
async function observeCamera(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const renderers = new Map();
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      supportsFiber: true,
      renderers,
      inject: (renderer: any) => {
        const id = renderers.size + 1;
        renderers.set(id, renderer);
        return id;
      },
      onCommitFiberUnmount() {},
      onCommitFiberRoot(_id: number, root: any) {
        const visit = (fiber: any) => {
          if (!fiber) return;
          const store = fiber.stateNode?.root;
          if (store?.getState) (window as any).__sceneCamera = store.getState().camera;
          visit(fiber.child);
          visit(fiber.sibling);
        };
        visit(root.current);
      },
    };
  });
  return errors;
}

async function cameraDefault(page: Page, fov: number) {
  await expect.poll(() => page.evaluate(() => {
    const camera = (window as any).__sceneCamera;
    return camera && { fov: Math.round(camera.fov), position: camera.position.toArray().map(Math.round) };
  }), { timeout: 10_000 }).toEqual({ fov, position: [10, 5, 14] });
}

async function ready(page: Page) {
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible({ timeout: 60_000 });
}

const hero = (page: Page) => page.locator('section.relative.overflow-hidden > div').first();
const intro = (page: Page) => page.getByRole('heading', { name: /My name is Hong/ }).locator('../..');
const biography = (page: Page) => page.locator('[data-about-content]').locator('..');
async function position(locator: Locator, property: 'left' | 'right' | 'y') {
  return locator.evaluate((el, prop) => prop === 'y'
    ? new DOMMatrix(getComputedStyle(el).transform).m42
    : parseFloat(getComputedStyle(el)[prop]), property);
}

for (const [asset, pattern] of [
  ['models', '**/models/*.glb'],
  ['avatar', '**/models/avataModel.glb'],
  ['lab', '**/models/lab-v02.glb'],
  ['studio atlas', '**/models/studio-baked-2k.webp'],
  ['face texture group', '**/face/normal8.webp'],
  ['music texture', '**/music/music_3.webp'],
]) {
 test(`failed ${asset} retries after network restoration without reloading`, async ({ page }) => {
  const environmentRequests: string[] = [];
  page.on('request', request => {
    if (request.url().endsWith('/models/envModel.glb')) environmentRequests.push(request.url());
  });
  await page.route(pattern, route => route.abort());
  await page.goto('/');
  await expect(page.locator('main')).toHaveAttribute('data-mode', 'basic');
  await page.evaluate(() => { (window as any).__identity = 'retry'; });
  await page.unroute(pattern);
  const assets: string[] = [];
  page.on('response', response => { if (response.ok()) assets.push(response.url()); });
  await page.getByRole('button', { name: 'View animated version' }).click();
  await ready(page);
  expect(assets.some(url => url.includes(asset === 'face texture group' ? '/face/normal8.webp' : asset === 'music texture' ? '/music/music_3.webp' : asset === 'studio atlas' ? '/models/studio-baked-2k.webp' : '.glb'))).toBe(true);
  if (asset === 'avatar' || asset === 'lab' || asset === 'face texture group' || asset === 'studio atlas') {
    // Successful environment loader cache survives retry of another asset.
    expect(environmentRequests).toHaveLength(1);
  }
  expect(await page.evaluate(() => (window as any).__identity)).toBe('retry');
  await expect(page.locator('canvas')).toBeVisible();
 });
}

for (const url of [
  'https://www.gstatic.com/draco/v1/decoders/draco_decoder.wasm',
  'https://www.gstatic.com/draco/v1/decoders/draco_wasm_wrapper.js',
  '/ktx2/basis_transcoder.wasm',
  '/ktx2/basis_transcoder.js',
]) {
  test(`scene decoder retry recovers ${url.split('/').pop()}`, async ({ page }) => {
    const pattern = url.startsWith('/') ? `**${url}` : url;
    let aborted = 0;
    await page.route(pattern, route => { aborted++; return route.abort(); });
    await page.goto('/');
    await expect(page.locator('main')).toHaveAttribute('data-mode', 'basic');
    expect(aborted).toBeGreaterThan(0);
    await page.evaluate(() => { (window as any).__identity = 'decoder-retry'; });
    await page.unroute(pattern);
    const restored = page.waitForResponse(response => response.url().endsWith(url) && response.ok());
    await page.getByRole('button', { name: 'View animated version' }).click();
    await Promise.all([ready(page), restored]);
    await expect(page.locator('canvas')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__identity)).toBe('decoder-retry');
  });
}

test('wheel choreography reaches projects and reverses continuously to intro', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await ready(page);
  await page.mouse.wheel(0, 250);
  await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
  await page.waitForTimeout(1300);
  const stageOne = await position(hero(page), 'y');
  expect(stageOne).toBeLessThan(-800);
  for (const width of [767, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(200);
    expect(await position(hero(page), 'y')).toBeLessThan(-800);
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
  }
  const projects = page.getByRole('heading', { name: 'Some things I’ve worked on' });
  for (let i = 0; i < 8 && !(await projects.isVisible() && await projects.evaluate(el => el.getBoundingClientRect().top < innerHeight)); i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(400);
  }
  await expect(projects).toBeInViewport();
  await page.mouse.wheel(0, -10000);
  await expect(page.locator('main')).toHaveAttribute('data-stage', '0');
  await page.waitForTimeout(200);
  const reversing = await position(hero(page), 'y');
  expect(reversing).toBeGreaterThan(stageOne);
  expect(reversing).toBeLessThan(-100);
  await expect.poll(() => position(hero(page), 'y')).toBe(0);
  await page.mouse.wheel(0, 250);
  await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
});

for (const stage of [0, 1]) {
  test(`drawer stage ${stage} close and rapid reversal preserve intermediate positions`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await ready(page);
    if (stage === 1) {
      await page.mouse.wheel(0, 250);
      await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
      await page.waitForTimeout(1500);
    }
    const target = stage === 0 ? intro(page) : biography(page);
    const closed = await position(target, 'left');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(1200);
    const opened = await position(target, 'left');
    expect(opened).toBeLessThan(-1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    const closing = await position(target, 'left');
    expect(closing).toBeGreaterThan(opened);
    expect(closing).toBeLessThan(closed - 100);
    const drawerClosing = await position(page.locator('#navigation-drawer'), 'right');
    expect(drawerClosing).toBeLessThan(0);
    expect(drawerClosing).toBeGreaterThan(-1300);
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(350);
    const partial = await position(target, 'left');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const reversed = await position(target, 'left');
    expect(reversed).toBeGreaterThan(partial);
    expect(reversed).toBeLessThan(closed - 20);
    await expect.poll(() => position(target, 'left')).toBeCloseTo(closed, 0);
  });
}

for (const [start, end, fov] of [[1440, 767, 90], [767, 768, 70]]) {
  test(`Escape after open drawer breakpoint ${start} to ${end} restores rendered camera`, async ({ page }) => {
    const errors = await observeCamera(page);
    await page.setViewportSize({ width: start, height: 900 });
    await page.goto('/');
    await ready(page);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(2200);
    await page.setViewportSize({ width: end, height: 900 });
    await page.waitForTimeout(2200);
    await page.keyboard.press('Escape');
    await cameraDefault(page, fov);
    expect(errors).toEqual([]);
  });
}

test('voluntary retry and contact home restore rendered camera', async ({ page }) => {
  const errors = await observeCamera(page);
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(2200);
  await page.getByRole('button', { name: 'Skip animation / basic version' }).click();
  await page.getByRole('button', { name: 'View animated version' }).click();
  await ready(page);
  await cameraDefault(page, 70);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(2200);
  await page.getByRole('dialog').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await ready(page);
  await cameraDefault(page, 70);
  expect(errors).toEqual([]);
});

test('mobile synthetic touch advances introduction', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:18000');
  await ready(page);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 650 }] });
  for (const y of [600, 500, 400, 300]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
    await page.waitForTimeout(50);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
  await context.close();
});

for (const width of [1440, 390]) {
  for (const duringTransition of [false, true]) {
    test(`height-only resize retargets ${width} stage translation ${duringTransition ? 'mid-transition' : 'settled'}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await ready(page);
      await page.mouse.wheel(0, 250);
      await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
      if (duringTransition) {
        await expect.poll(() => position(hero(page), 'y'), { intervals: [16] }).toBeLessThan(-20);
        const intermediate = await position(hero(page), 'y');
        expect(intermediate).toBeGreaterThan(-918);
      } else {
        await expect.poll(() => position(hero(page), 'y')).toBeCloseTo(-918, 0);
      }
      await page.setViewportSize({ width, height: 600 });
      expect(await position(hero(page), 'y')).toBeLessThan(-10);
      await expect.poll(() => position(hero(page), 'y')).toBeCloseTo(-612, 0);
      await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
      await expect(page.locator('.pin-spacer')).toHaveCount(1);
      // Unmount must disconnect resize ownership; remount starts at stage zero.
      await page.getByRole('button', { name: 'Skip animation / basic version' }).click();
      await page.setViewportSize({ width, height: 700 });
      await expect(page.locator('.pin-spacer')).toHaveCount(0);
      await page.getByRole('button', { name: 'View animated version' }).click();
      await ready(page);
      await expect(page.locator('main')).toHaveAttribute('data-stage', '0');
      await expect.poll(() => position(hero(page), 'y')).toBe(0);
    });
  }
}

for (const [width, height, stage] of [[800, 300, 0], [568, 320, 1]]) {
  test(`short drawer ${width}x${height} scrolls controls without changing stage ${stage}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await ready(page);
    if (stage === 1) {
      await page.mouse.wheel(0, 250);
      await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
      await expect.poll(() => position(hero(page), 'y')).toBeCloseTo(-height * 1.02, 0);
    }
    const open = page.getByRole('button', { name: 'Open menu' });
    await open.click();
    const drawer = page.getByRole('dialog');
    await expect.poll(() => position(drawer, 'right')).toBe(0);
    const close = drawer.getByRole('button', { name: 'Close menu' });
    const last = drawer.getByRole('link', { name: 'Hong Seo on GitHub' });
    await expect(close).toBeFocused();
    await expect(close).toBeInViewport();
    expect((await close.boundingBox())!.y).toBeGreaterThanOrEqual(0);
    const scrollY = await page.evaluate(() => window.scrollY);
    // Wheel over a descendant, not drawer padding (Observer ignore is exact-target).
    await close.hover();
    await page.mouse.wheel(0, 500);
    await expect.poll(() => drawer.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    await expect(last).toBeInViewport();
    await expect(page.locator('main')).toHaveAttribute('data-stage', String(stage));
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await page.keyboard.press('Shift+Tab');
    await expect(last).toBeFocused();
    await expect(last).toBeInViewport();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await expect(close).toBeInViewport();
    await page.keyboard.press('Shift+Tab');
    await expect(last).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(open).toBeFocused();
    await open.click();
    await expect.poll(() => position(drawer, 'right')).toBe(0);
    await expect(close).toBeFocused();
    await expect(close).toBeInViewport();
    expect(await drawer.evaluate(el => el.scrollTop)).toBe(0);
    await expect(page.locator('main')).toHaveAttribute('data-stage', String(stage));
    await close.click();
    await expect(open).toBeFocused();
  });
}

test('short mobile drawer allows touch scrolling over descendants', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 568, height: 320 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:18000');
    await ready(page);
    await page.getByRole('button', { name: 'Open menu' }).click();
    const drawer = page.getByRole('dialog');
    await expect.poll(() => position(drawer, 'right')).toBe(0);
    const work = await drawer.getByRole('button', { name: 'Work', exact: true }).boundingBox();
    const x = work!.x + work!.width / 2;
    const y = work!.y + work!.height / 2;
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (const delta of [30, 60, 100, 150]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - delta }] });
      await page.waitForTimeout(50);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => drawer.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    await expect(drawer.getByRole('link', { name: 'Hong Seo on GitHub' })).toBeInViewport();
    await expect(page.locator('main')).toHaveAttribute('data-stage', '0');
  } finally {
    await context.close();
  }
});

async function failFaceWithPendingWave(page: Page) {
  let heldWave: Route | undefined;
  let waveRequests = 0;
  await page.route('**/face/normal8.webp', route => route.abort());
  await page.route('**/face/wave7.webp', route => {
    if (++waveRequests === 1) {
      heldWave = route;
      return;
    }
    return route.continue();
  });
  await page.goto('/');
  await expect(page.locator('main')).toHaveAttribute('data-mode', 'basic');
  await expect.poll(() => Boolean(heldWave)).toBe(true);
  await page.unroute('**/face/normal8.webp');
  return { settle: () => heldWave!.abort(), waveRequests: () => waveRequests };
}

test('one retry waits for abandoned wave request then automatically enters animated scene', async ({ page }) => {
  const pending = await failFaceWithPendingWave(page);
  await page.evaluate(() => {
    const modes = (window as any).__retryModes = ['basic'];
    new MutationObserver(() => {
      const main = document.querySelector('main');
      const mode = main?.hasAttribute('data-stage') ? 'animated' : main?.getAttribute('data-mode');
      if (mode && modes.at(-1) !== mode) modes.push(mode);
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-mode', 'data-stage'] });
  });
  const retry = page.getByRole('button', { name: 'View animated version' });
  await retry.click();
  await expect(page.locator('main')).toHaveAttribute('data-mode', 'basic');
  await expect(retry).toBeDisabled();
  await expect(page.getByRole('status').filter({ hasText: 'Waiting for previous scene requests to finish' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Some things I’ve worked on' })).toBeVisible();
  expect(pending.waveRequests()).toBe(1);
  await pending.settle();
  await ready(page);
  await expect(page.locator('canvas')).toBeVisible();
  expect(pending.waveRequests()).toBe(2);
  expect(await page.evaluate(() => (window as any).__retryModes)).toEqual(['basic', 'animated']);
});

for (const cancel of ['reduced motion', 'unmount']) {
  test(`queued scene retry cancels on ${cancel}`, async ({ page }) => {
    const pending = await failFaceWithPendingWave(page);
    await page.getByRole('button', { name: 'View animated version' }).click();
    await expect(page.getByRole('button', { name: 'View animated version' })).toBeDisabled();
    if (cancel === 'reduced motion') {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(page.getByRole('button', { name: 'View animated version' })).toHaveCount(0);
    } else {
      await page.getByRole('navigation', { name: 'Portfolio' }).getByRole('link', { name: 'Contact' }).click();
      await expect(page).toHaveURL(/\/contact$/);
    }
    const settled = page.waitForEvent('requestfailed', request => request.url().endsWith('/face/wave7.webp'));
    await pending.settle();
    await settled;
    if (cancel === 'reduced motion') {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    } else {
      await page.getByRole('link', { name: 'Home', exact: true }).click();
    }
    await expect(page.locator('main')).toHaveAttribute('data-mode', 'basic');
    await expect(page.getByRole('button', { name: 'View animated version' })).toBeEnabled();
    await expect(page.getByText('Waiting for previous scene requests to finish')).toHaveCount(0);
    expect(pending.waveRequests()).toBe(1);
    await page.getByRole('button', { name: 'View animated version' }).click();
    await ready(page);
  });
}
