// store/useSettingStore.ts
import { create } from 'zustand';

type SettingState = {
  rightDrawerToggle: boolean;
  isScrolling: boolean;
  setRightDrawerToggle: (value: boolean) => void;
  setIsScrolling: (value: boolean) => void;
  isTypingRunning: boolean;
  setIsTypingRunning: (value: boolean) => void;
  currentStage: number;
  setCurrentStage: (value: number | ((prev: number) => number)) => void;
};

export const useSettingStore = create<SettingState>((set, get) => ({
  currentStage: 0,
  rightDrawerToggle: false,
  isScrolling: false,
  setRightDrawerToggle: (value) => set({ rightDrawerToggle: value }),
  setIsScrolling: (value) => set({ isScrolling: value }),
  isTypingRunning: false,
  setIsTypingRunning: (value) => set({ isTypingRunning: value }),
  setCurrentStage: (updater) => {
    if (typeof updater === 'function') {
      const current = get().currentStage;
      const newValue = updater(current);
      set({ currentStage: newValue });
    } else {
      set({ currentStage: updater });
    }
  },
}));
