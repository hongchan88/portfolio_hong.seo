// store/useCameraStore.js
import { create } from 'zustand';
import { useSettingStore } from './settingStore';
type useCameraType = {
  camPos: number[];
  zoom: number;
  camRotatePos: number[];
  mobileZoom: number;

  cameraTarget: number[];
  setCamPos: (pos: number[]) => void;
  setZoom: (z: number) => void;
  setMobileZoom: (z: number) => void;
  setDefault: () => void;
  setFirstMenuCameraPos: () => void;
  setSecondMenuCameraPos: () => void;
  setCamRotatePos: (pos: number[]) => void;
  setMobileDefault: () => void;
};
const ZOOM_DEFAULT = 70;
const ZOOM_MOBILE_DEFAULT = 90;
export const useCameraStore = create<useCameraType>((set, get) => ({
  camPos: [10, 5, 14],
  cameraTarget: [0, 0, 0],

  mobileZoom: ZOOM_MOBILE_DEFAULT,
  zoom: ZOOM_DEFAULT,
  camRotatePos: [0, 0, 0],
  setCamPos: (pos) => set({ camPos: pos }),
  setZoom: (z) => set({ zoom: z }),
  setMobileZoom: (z) => set({ mobileZoom: z }),
  setCamRotatePos: (pos) => set({ camRotatePos: pos }),
  setDefault: () => set({ zoom: ZOOM_DEFAULT, camPos: [10, 5, 14] }),
  setMobileDefault: () =>
    set({ mobileZoom: ZOOM_MOBILE_DEFAULT, camPos: [10, 5, 14] }),
  setFirstMenuCameraPos: () => {
    const isMobile = useSettingStore.getState().isMobile;
    if (isMobile) {
      get().setCamPos([-39, 16, 19]);
      get().setMobileZoom(30);
    } else {
      get().setCamPos([-28, 6, 7]);
      get().setZoom(24);
    }
  },
  setSecondMenuCameraPos: () => {
    get().setCamPos([-13, -3, -3]);
    get().setZoom(91);
  },
}));
