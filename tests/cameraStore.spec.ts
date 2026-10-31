import { expect, test } from '@playwright/test';
import { useCameraStore } from '../app/stores/cameraStore';
import { useSettingStore } from '../app/stores/settingStore';

test('camera presets restore fixed desktop/mobile defaults after menu zooms', () => {
  for (const mobile of [false, true, false]) {
    useSettingStore.getState().setIsMobile(mobile);
    const camera = useCameraStore.getState();
    camera.setDefault();
    camera.setMobileDefault();
    camera.setFirstMenuCameraPos();
    expect(useCameraStore.getState().camPos).toEqual(
      mobile ? [-39, 16, 19] : [-28, 6, 7]
    );
    expect(
      mobile
        ? useCameraStore.getState().mobileZoom
        : useCameraStore.getState().zoom
    ).toBe(mobile ? 30 : 24);
    camera.setDefault();
    camera.setMobileDefault();
    expect(useCameraStore.getState().camPos).toEqual([10, 5, 14]);
    expect(useCameraStore.getState().zoom).toBe(70);
    expect(useCameraStore.getState().mobileZoom).toBe(90);
    camera.setSecondMenuCameraPos();
    expect(useCameraStore.getState().camPos).toEqual([-13, -3, -3]);
    expect(useCameraStore.getState().zoom).toBe(91);
  }
});
