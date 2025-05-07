// store/refStore.ts
import { create } from 'zustand';

interface RefStore {
  leftText: React.RefObject<HTMLDivElement> | null;
  aboutSectionRef: React.RefObject<HTMLDivElement> | null;
  aboutImgRef: React.RefObject<HTMLDivElement> | null;
  animatingRef: React.RefObject<boolean> | null;
  rightDrawerRef: React.RefObject<HTMLDivElement> | null;
  setRefs: (refs: Partial<RefStore>) => void;
}

export const useRefStore = create<RefStore>((set) => ({
  leftText: null,
  aboutSectionRef: null,
  aboutImgRef: null,
  animatingRef: null,
  rightDrawerRef: null,
  setRefs: (refs) => set((state) => ({ ...state, ...refs })),
}));
