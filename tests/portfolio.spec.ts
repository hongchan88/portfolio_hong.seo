import { expect, test, Page } from '@playwright/test';

async function basicContent(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'About me', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'CoSnap', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Contact', exact: true }).first()
  ).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(
    await page.locator('body').evaluate((el) => getComputedStyle(el).overflow)
  ).not.toBe('hidden');
  expect(
    await page
      .locator('#projects')
      .evaluate((el) => parseFloat(getComputedStyle(el).marginTop))
  ).toBeGreaterThanOrEqual(0);
}

for (const failure of ['model', 'webgl', 'slow'] as const) {
  test(`${failure}: biography and projects remain reachable`, async ({
    page,
  }) => {
    if (failure === 'model')
      await page.route('**/models/*.glb', (route) => route.abort());
    if (failure === 'slow')
      await page.route('**/models/*.glb', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 20_000));
        await route.abort();
      });
    if (failure === 'webgl')
      await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          type: string,
          ...args: any[]
        ) {
          if (type.includes('webgl')) return null;
          return getContext.call(this, type, ...args);
        } as typeof getContext;
      });
    await page.goto('/');
    if (failure === 'slow') {
      const skip = page.getByRole('button', {
        name: 'Skip animation / basic version',
      });
      await skip.focus();
      await page.keyboard.press('Enter');
      await expect(
        page.getByRole('heading', { name: 'Hong Seo' })
      ).toBeFocused();
    }
    await basicContent(page);
  });
}

test('reduced motion uses normal-flow content and contact navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await basicContent(page);
  await page
    .getByRole('link', { name: 'Contact', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole('link', { name: 'hongchan.seo@hotmail.com' })
  ).toHaveAttribute('href', 'mailto:hongchan.seo@hotmail.com');
  await expect(
    page.getByRole('link', { name: '0424 476 777' })
  ).toHaveAttribute('href', 'tel:+61424476777');
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await basicContent(page);
});

test('metadata and contact work without scene', async ({ page }) => {
  await page.goto('/contact');
  await expect(page).toHaveTitle(/Contact.*Hong Seo/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /.+/
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    /Hong Seo/
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://portfolio-hong-seo.vercel.app/contact'
  );
  await expect(
    page.getByRole('link', { name: 'Home', exact: true })
  ).toBeVisible();
});

test('normal scene: keyboard drawer, stages, resize without navigation, Work', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open menu' });
  await expect(menu).toBeVisible({ timeout: 60_000 });
  await expect(page.locator('canvas')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Unmute audio' })
  ).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => {
    (window as any).__documentIdentity = 'same';
  });
  await menu.focus();
  await page.keyboard.press('Enter');
  const drawer = page.getByRole('dialog', { name: 'Navigation' });
  await expect(drawer).toBeVisible();
  await expect(
    drawer.getByRole('button', { name: 'Close menu' })
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    drawer.getByRole('link', { name: 'Hong Seo on GitHub' })
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    drawer.getByRole('button', { name: 'Close menu' })
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.locator('#navigation-drawer')).toHaveAttribute('inert', '');
  for (const width of [767, 768, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => (window as any).__documentIdentity)).toBe(
      'same'
    );
    await expect(page.locator('main')).toHaveAttribute(
      'data-breakpoint',
      width < 768 ? 'mobile' : 'desktop'
    );
  }
  await menu.click();
  await drawer.getByRole('button', { name: 'About me', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
  await page.waitForTimeout(3200);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await drawer.getByRole('button', { name: 'Main', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-stage', '0');
  await page.waitForTimeout(3200);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await drawer.getByRole('button', { name: 'Work', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Some things I’ve worked on' })
  ).toBeInViewport({ timeout: 15_000 });
  await expect(
    page.getByRole('heading', { name: 'Some things I’ve worked on' })
  ).toBeFocused();
  expect(errors).toEqual([]);
});

test('mobile scene preserves intro and timeline years', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Open menu' })
    .click({ timeout: 60_000 });
  await page.getByRole('button', { name: 'Work', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Some things I’ve worked on' })
  ).toBeInViewport();
  await expect(
    page
      .locator('[data-project="CoSnap"] .md\\:hidden')
      .filter({ hasText: /^2025$/ })
  ).toBeVisible();
});

test('theme tokens and missing Segment artwork have readable fallback', async ({
  page,
}) => {
  await page.route('**/*segment.svg*', (route) => route.abort());
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Open menu' })
    .click({ timeout: 60_000 });
  await page.getByRole('button', { name: 'Work', exact: true }).click();
  const colors = await page.evaluate(() => {
    const probe = document.createElement('span');
    document.body.append(probe);
    probe.className = 'text-neutral-700';
    const neutral = getComputedStyle(probe).color;
    probe.className = 'text-primary-500';
    const primary = getComputedStyle(probe).color;
    probe.remove();
    return { neutral, primary };
  });
  expect(colors.neutral).toBe('rgb(64, 64, 64)');
  expect(colors.primary).not.toBe('rgb(0, 0, 0)');
  const segment = page
    .getByRole('paragraph')
    .filter({ hasText: /^Segment.io$/ });
  await segment.scrollIntoViewIfNeeded();
  await expect(segment).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
});

test('audio rejection is handled and scene exit clears avatar flicker timer', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(
        new DOMException('Playback blocked by test', 'NotAllowedError')
      );
    const set = window.setInterval;
    const clear = window.clearInterval;
    const owned = new Set<number>();
    (window as any).__flickerTimers = owned;
    window.setInterval = ((handler, delay, ...args) => {
      const id = set(handler, delay, ...args);
      if (delay === 80) owned.add(id);
      return id;
    }) as typeof set;
    window.clearInterval = (id) => {
      owned.delete(id);
      clear(id);
    };
  });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Unmute audio' })
    .click({ timeout: 60_000 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'About me', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__flickerTimers.size), {
      intervals: [50],
    })
    .toBe(1);
  await page
    .getByRole('button', { name: 'Skip animation / basic version' })
    .click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__flickerTimers.size), {
      timeout: 500,
      intervals: [20],
    })
    .toBe(0);
  expect(errors).toEqual([]);
  await expect(page.locator('audio')).toHaveCount(0);
});

test('normal to basic to animated, context loss and browser back recover without reload', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible({
    timeout: 60_000,
  });
  await page
    .getByRole('button', { name: 'Skip animation / basic version' })
    .click();
  await basicContent(page);
  await page.getByRole('button', { name: 'View animated version' }).click();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible({
    timeout: 60_000,
  });
  await page.evaluate(() => {
    (window as any).__documentIdentity = 'context-loss';
  });
  await page.locator('canvas').dispatchEvent('webglcontextlost');
  await basicContent(page);
  expect(await page.evaluate(() => (window as any).__documentIdentity)).toBe(
    'context-loss'
  );
  await page
    .getByRole('link', { name: 'Contact', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.goBack();
  await basicContent(page);
  expect(errors).toEqual([]);
});

test('pinned biography and stage-one resize retain scene choreography', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible({
    timeout: 60_000,
  });
  await expect(
    page.getByRole('heading', { name: 'Some things I’ve worked on' })
  ).not.toBeInViewport();
  await page.mouse.wheel(0, 250);
  await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(2000);
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await expect(
    page.locator('img[src="/aboutme/aboutMeFill.webp"]')
  ).toBeInViewport();
  for (const width of [767, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(700);
    await expect(page.locator('main')).toHaveAttribute('data-stage', '1');
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
  }
});

test('animated contact route releases scroll and home restarts introduction', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Hong Seo | Developer Portfolio');
  await page
    .getByRole('button', { name: 'Open menu' })
    .click({ timeout: 60_000 });
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  expect(
    await page.locator('body').evaluate((el) => getComputedStyle(el).overflow)
  ).not.toBe('hidden');
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible({
    timeout: 60_000,
  });
  await expect(page.locator('main')).toHaveAttribute('data-stage', '0');
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
