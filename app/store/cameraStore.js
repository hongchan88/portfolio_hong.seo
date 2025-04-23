// store/useCameraStore.js
import { create } from 'zustand';

export const useCameraStore = create((set) => ({
  camPos: [10, 5, 14],
  zoom: 70,
  setCamPos: (pos) => set({ camPos: pos }),
  setZoom: (z) => set({ zoom: z }),
  setDefault: () => set({ zoom: 70, camPos: [10, 5, 14] }),
}));
