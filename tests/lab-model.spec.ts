import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 900 }, { width: 390, height: 844 }]) {
  test(`improved lab preserves the original portfolio view at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() => {
      const renderers = new Map();
      const observed = new WeakSet();
      const renderersObserved = new WeakSet();
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true, renderers,
        inject(renderer: any) { const id = renderers.size + 1; renderers.set(id, renderer); return id; },
        onCommitFiberUnmount() {},
        onCommitFiberRoot(_id: number, root: any) {
          const visit = (fiber: any) => {
            if (!fiber) return;
            const state = fiber.stateNode?.root?.getState?.();
            if (state?.scene && state.camera) {
              (window as any).__labScene = state;
              if (!renderersObserved.has(state.gl)) {
                renderersObserved.add(state.gl);
                const render = state.gl.render;
                state.gl.render = function (scene: any, camera: any) {
                  scene.getObjectByName('portfolio-lab-v02')?.getObjectByName('lab_scene')?.traverse((mesh: any) => {
                    if (!mesh.isMesh || observed.has(mesh)) return;
                    observed.add(mesh);
                    const afterRender = mesh.onAfterRender;
                    mesh.onAfterRender = function (...args: any[]) {
                      if (document.querySelector('main')?.getAttribute('data-stage') === '0' &&
                          getComputedStyle(state.gl.domElement).visibility === 'visible') {
                        (window as any).__labDrawnBeforeScroll = true;
                      }
                      afterRender.apply(this, args);
                    };
                  });
                  return render.call(this, scene, camera);
                };
              }
            }
            visit(fiber.child); visit(fiber.sibling);
          };
          visit(root.current);
        },
      };
    });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible({ timeout: 60_000 });
    // Prove the second room has already drawn before the user scrolls.
    await expect.poll(() => page.evaluate(() => (window as any).__labDrawnBeforeScroll),
      { timeout: 30_000 }).toBe(true);
    const labId = await page.evaluate(() => (window as any).__labScene.scene.getObjectByName('lab-scenery').uuid);
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await expect.poll(() => page.evaluate(() => {
      const scene = (window as any).__labScene.scene;
      const scenery = scene.getObjectByName('lab-scenery');
      let avatarVisible = true;
      for (let node = scene.getObjectByName('Object_3002'); node; node = node.parent) avatarVisible &&= node.visible;
      return { labVisible: scenery.visible, avatarVisible };
    })).toEqual({ labVisible: false, avatarVisible: true });
    await expect.poll(() => page.evaluate(() => (window as any).__labScene.camera.position.x),
      { timeout: 10_000 }).toBeCloseTo(viewport.width < 768 ? -39 : -28, 1);
    await page.keyboard.press('Escape');
    // Closing the drawer must not reveal the room during the return flight.
    expect(await page.evaluate(() => (window as any).__labScene.scene.getObjectByName('lab-scenery').visible)).toBe(false);
    await expect.poll(() => page.evaluate(() => {
      const state = (window as any).__labScene;
      const scenery = state.scene.getObjectByName('lab-scenery');
      return { visible: scenery.visible, id: scenery.uuid,
        cameraX: Math.round(state.camera.position.x) };
    }), { timeout: 10_000 }).toEqual({ visible: true, id: labId, cameraX: 10 });
    // Scrolling is locked until the intro choreography finishes. Exercise
    // real wheel input while waiting for that lock, including software GPUs.
    await expect.poll(async () => {
      if (await page.locator('main').getAttribute('data-stage') === '0') await page.mouse.wheel(0, 250);
      return page.locator('main').getAttribute('data-stage');
    }, { timeout: 30_000, intervals: [1000] }).toBe('1');
    await expect.poll(() => page.evaluate(() => {
      const state = (window as any).__labScene;
      if (!state) return null;
      const lab = state.scene.getObjectByName('portfolio-lab-v02');
      const improved = lab?.getObjectByName('lab_scene');
      const original = state.scene.getObjectByName('lab_scene');
      if (!improved || !original || original === improved) return null;
      original.updateWorldMatrix(true, true);
      improved.updateWorldMatrix(true, true);
      const error = Math.max(...original.matrixWorld.elements.map((n: number, i: number) => Math.abs(n - improved.matrixWorld.elements[i])));
      let visible = true;
      for (let node = improved; node; node = node.parent) visible = visible && node.visible;
      return { visible, originalHidden: !original.visible, sameTransform: error < 1e-5,
        camera: state.camera.position.toArray().map((n: number) => Math.round(n)),
        fov: Math.round(state.camera.fov), viewOffset: Boolean(state.camera.view?.enabled) };
    }), { timeout: 30_000 }).toEqual({ visible: true, originalHidden: true, sameTransform: true,
      camera: [10, 5, 14], fov: viewport.width < 768 ? 90 : 70, viewOffset: false });
    await page.screenshot({ path: `output/portfolio-lab-integration/original-angle-${viewport.width}.png` });
  });
}
