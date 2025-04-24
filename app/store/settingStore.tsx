// store/useSettingStore.ts
import { create } from 'zustand';

type SettingState = {
  rightDrawerToggle: boolean;
  isScrolling: boolean;
  setRightDrawerToggle: (value: boolean) => void;
  setIsScrolling: (value: boolean) => void;
  isTypingRunning: boolean;
  setIsTypingRunning: (value: boolean) => void;
};

export const useSettingStore = create<SettingState>((set) => ({
  rightDrawerToggle: false,
  isScrolling: false,
  setRightDrawerToggle: (value) => set({ rightDrawerToggle: value }),
  setIsScrolling: (value) => set({ isScrolling: value }),
  isTypingRunning: false,
  setIsTypingRunning: (value) => set({ isTypingRunning: value }),
}));
