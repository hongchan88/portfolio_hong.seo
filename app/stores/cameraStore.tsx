// store/useCameraStore.js
import { create } from 'zustand';
type useCameraType = {
  camPos: number[];
  zoom: number;
  camRotatePos: number[];
  mobileCamPos: number[];
  mobileZoom: number;
  mobileCameraTarget: number[];
  cameraTarget: number[];
  setCamPos: (pos: number[]) => void;
  setZoom: (z: number) => void;
  setDefault: () => void;
  setFirstMenuCameraPos: () => void;
  setSecondMenuCameraPos: () => void;
  setCamRotatePos: (pos: number[]) => void;
};
export const useCameraStore = create<useCameraType>((set, get) => ({
  camPos: [10, 5, 14],
  cameraTarget: [0, 0, 0],
  mobileCamPos: [6.906740204411565, 6.4844114698193, 16.775365042190266],
  mobileCameraTarget: [
    -0.2978507511193125, -0.35666763170937515, -0.8854790401519885,
  ],
  mobileZoom: 80,
  zoom: 70,
  camRotatePos: [0, 0, 0],
  setCamPos: (pos) => set({ camPos: pos }),
  setZoom: (z) => set({ zoom: z }),
  setCamRotatePos: (pos) => set({ camRotatePos: pos }),
  setDefault: () => set({ zoom: 70, camPos: [10, 5, 14] }),
  setFirstMenuCameraPos: () => {
    get().setCamPos([-28, 6, 7]);
    get().setZoom(24);
  },
  setSecondMenuCameraPos: () => {
    get().setCamPos([-13, -3, -3]);
    get().setZoom(91);
    // camera.rotation.set(Math.PI * 0.22, Math.PI * -0.38, Math.PI * 0.34);
    // get().setCamRotatePos([
    //   Math.PI * 0.22,
    //   Math.PI * 0.22,
    //   Math.PI * -0.38,
    //   0.34,
    // ]);
  },
}));
