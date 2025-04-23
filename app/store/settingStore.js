// store/useCameraStore.js
import { create } from 'zustand';

export const useSettingStore = create((set) => ({
  rightDrawerToggle: false,
  setRightDrawerToggle: (toggle) => set({ rightDrawerToggle: toggle }),
}));
