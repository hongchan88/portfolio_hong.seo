import { expect, test, Page } from '@playwright/test';

async function observeFaceFrames(page: Page) {
  await page.addInitScript(() => {
    const instrumented = new WeakSet<object>();
    (window as any).__faceFrames = [];
    (window as any).__firstSceneFace = null;
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
          const state = fiber.stateNode?.root?.getState?.();
          const renderer = state?.gl;
          if (renderer && !instrumented.has(renderer)) {
            instrumented.add(renderer);
            const render = renderer.render;
            renderer.render = function (scene: any, camera: any) {
              const face = scene.getObjectByName('Object_3001');
              if (face && !(window as any).__firstSceneFace) {
                (window as any).__firstSceneFace = {
                  type: face.material.type,
                  url: face.material.map?.image?.currentSrc || face.material.map?.image?.src || '',
                };
              }
              const canvas = renderer.domElement;
              const main = document.querySelector('main[data-stage="0"]');
              if (face && main && !main.hasAttribute('inert') &&
                  getComputedStyle(canvas).visibility === 'visible' &&
                  Number(getComputedStyle(canvas).opacity) > 0) {
                const material = face.material;
                const frames = (window as any).__faceFrames;
                if (frames.length < 1200) frames.push({
                  type: material.type,
                  url: material.map?.image?.currentSrc || material.map?.image?.src || '',
                  visible: face.visible,
                  time: performance.now(),
                });
              }
              return render.call(this, scene, camera);
            };
          }
          visit(fiber.child);
          visit(fiber.sibling);
        };
        visit(root.current);
      },
    };
  });
}

async function expectIntroFaces(page: Page) {
  await expect.poll(() => page.evaluate(() => (window as any).__faceFrames.length), {
    // Software WebGL also prepares the lab shaders behind the loading overlay.
    timeout: 60_000,
  }).toBeGreaterThan(0);
  const initial = await page.evaluate(() => (window as any).__firstSceneFace);
  expect(initial.type).toBe('MeshStandardMaterial');
  expect(initial.url).toContain('/face/normal8.webp');
  const first = await page.evaluate(() => (window as any).__faceFrames[0]);
  expect(first.type).toBe('MeshStandardMaterial');
  // A stalled software-GPU frame may advance the clip into its wave window
  // before the first visible draw; either expression must already be textured.
  expect(first.url).toMatch(/\/face\/(normal8|wave7)\.webp/);
  expect(first.visible).toBe(true);
  await test.info().attach('initial-face', {
    body: await page.screenshot({ path: test.info().outputPath('initial-face.png') }),
    contentType: 'image/png',
  });
  await expect.poll(() => page.evaluate(() => (window as any).__faceFrames.some(
    (frame: any) => frame.url.includes('/face/wave7.webp')
  )), { timeout: 15_000 }).toBe(true);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  // Menu visibility and the greeting clip finish independently. Wait for
  // the expression to return rather than sampling the waving frame itself.
  await expect.poll(() => page.evaluate(() => (window as any).__faceFrames.at(-1)?.url),
    { timeout: 15_000 }).toContain('/face/normal8.webp');
  const frames = await page.evaluate(() => (window as any).__faceFrames);
  expect(frames.every((frame: any) => frame.type === 'MeshStandardMaterial' &&
    /\/face\/(normal8|wave7)\.webp/.test(frame.url) && frame.visible)).toBe(true);
  expect(frames.at(-1).url).toContain('/face/normal8.webp');
  await test.info().attach('face-frames', {
    body: JSON.stringify(frames, null, 2),
    contentType: 'application/json',
  });
}

test('avatar has normal face from first visible intro frame and waves at clip time', async ({ page }) => {
  await observeFaceFrames(page);
  await page.goto('/');
  await expectIntroFaces(page);
});

test('avatar face animation survives loading longer than five seconds', async ({ page }) => {
  await observeFaceFrames(page);
  await page.route('**/models/envModel.glb', async route => {
    await new Promise(resolve => setTimeout(resolve, 6_000));
    await route.continue();
  });
  await page.goto('/');
  await expectIntroFaces(page);
});

test('avatar face is initialized again after basic-mode remount', async ({ page }) => {
  await observeFaceFrames(page);
  await page.goto('/');
  await expectIntroFaces(page);
  await page.getByRole('button', { name: 'Skip animation / basic version' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-mode', 'basic');
  await page.evaluate(() => {
    (window as any).__faceFrames = [];
    (window as any).__firstSceneFace = null;
  });
  await page.getByRole('button', { name: 'View animated version' }).click();
  await expectIntroFaces(page);
});
