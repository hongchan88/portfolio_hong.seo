import { create } from 'zustand';

type AudioStore = {
  typingAudio: HTMLAudioElement | null;
  clickMenuAudio: HTMLAudioElement | null;
  setAudioRef: (el: HTMLAudioElement, name: keyof AudioStore) => void;
  playAudio: (name: keyof AudioStore) => void;
  pauseAuido: (name: keyof AudioStore) => void;
  audioToggleState: boolean;
  toggleAudio: () => void;
  scrollAudio: HTMLAudioElement | null;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  audioToggleState: false,
  toggleAudio: () =>
    set((state) => ({ audioToggleState: !state.audioToggleState })),
  scrollAudio: null,
  typingAudio: null,
  clickMenuAudio: null,
  setAudioRef: (el, name) => set({ [name]: el }),
  playAudio: (name: string) => {
    const audio = get()[name];
    if (audio instanceof HTMLAudioElement) {
      audio.play().catch((e) => console.warn('Play blocked:', e));
    }
  },
  pauseAuido: (name) => {
    const audio = get()[name];
    if (audio instanceof HTMLAudioElement) {
      audio.pause();
    }
  },
}));
