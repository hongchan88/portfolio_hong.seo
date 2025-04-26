// store/useSettingStore.ts
import { create } from 'zustand';

type SettingState = {
  rightDrawerToggle: boolean;
  isScrolling: boolean;
  isLoadingDone: boolean;
  currentStage: number;
  isTypingRunning: boolean;
  setRightDrawerToggle: (value: boolean) => void;
  setIsScrolling: (value: boolean) => void;
  setIsTypingRunning: (value: boolean) => void;
  setCurrentStage: (value: number | ((prev: number) => number)) => void;
  setIsLoadingDone: (boolean: boolean) => void;
};

export const useSettingStore = create<SettingState>((set, get) => ({
  currentStage: 0,
  rightDrawerToggle: false,
  isScrolling: false,
  isLoadingDone: false,
  isTypingRunning: false,
  setIsLoadingDone: (boolean) => set({ isLoadingDone: boolean }),
  setRightDrawerToggle: (value) => set({ rightDrawerToggle: value }),
  setIsScrolling: (value) => set({ isScrolling: value }),
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
