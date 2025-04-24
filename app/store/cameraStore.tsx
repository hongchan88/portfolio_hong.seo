// store/useCameraStore.js
import { create } from 'zustand';
type useCameraType = {
  camPos: number[];
  zoom: number;
  setCamPos: (pos: number[]) => void;
  setZoom: (z: number) => void;
  setDefault: () => void;
  setFirstMenuCameraPos: () => void;
  setSecondMenuCameraPos: () => void;
};
export const useCameraStore = create<useCameraType>((set, get) => ({
  camPos: [10, 5, 14],
  zoom: 70,
  setCamPos: (pos) => set({ camPos: pos }),
  setZoom: (z) => set({ zoom: z }),
  setDefault: () => set({ zoom: 70, camPos: [10, 5, 14] }),
  setFirstMenuCameraPos: () => {
    get().setCamPos([-28, 6, 7]);
    get().setZoom(24);
  },
  setSecondMenuCameraPos: () => {
    get().setCamPos([-10, -2, 3]);
    get().setZoom(94);
  },
}));
