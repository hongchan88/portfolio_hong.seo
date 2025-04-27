import { create } from 'zustand';
import { useSettingStore } from './settingStore';
type AudioKey =
  | 'stage1BG'
  | 'stage2Start'
  | 'stage2Bubble'
  | 'stage2BGLab'
  | 'splash'
  | 'clickingSound'
  | 'clickMenuAudio'
  | 'typingAudio'
  | 'scrollAudio';
type AudioStore = {
  typingAudio: HTMLAudioElement | null;
  clickMenuAudio: HTMLAudioElement | null;
  // setAudioRef: (el: HTMLAudioElement, name: keyof AudioStore) => void;
  playAudio: (name: keyof AudioStore) => void;
  pauseAuido: (name: AudioKey) => void;
  audioToggleState: boolean;
  toggleAudio: () => void;
  scrollAudio: HTMLAudioElement | null;
  audioRefs: Partial<Record<AudioKey, HTMLAudioElement>>;
  setAudioRef: (key: AudioKey, el: HTMLAudioElement) => void;
  playAudioForStage: (prevStage?: number) => void;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  audioToggleState: false,
  scrollAudio: null,
  typingAudio: null,
  clickMenuAudio: null,
  audioRefs: {},
  toggleAudio: () =>
    set((state) => ({ audioToggleState: !state.audioToggleState })),
  // setAudioRef: (el, name) => set({ [name]: el }),
  playAudio: (name: string) => {
    const audio = get().audioRefs[name];
    if (audio instanceof HTMLAudioElement) {
      audio.play().catch((e) => console.warn('Play blocked:', e));
    }
  },
  pauseAuido: (name) => {
    const audio = get().audioRefs[name];
    if (audio instanceof HTMLAudioElement) {
      audio.pause();
      audio.currentTime = 0; // optional: reset position
    }
  },
  playAudioForStage: (prevStage) => {
    const { audioRefs, audioToggleState } = get();
    const stage = useSettingStore.getState().currentStage;
    // 1. Pause all currently playing audio
    Object.entries(audioRefs).forEach(([key, audio]) => {
      if (key === 'clickMenuAudio' || key === 'splash') return; // ⬅️ skip this one

      audio?.pause();
      audio.currentTime = 0;
    });
    // 2. If false  don't play anything
    if (!audioToggleState) return;

    // 3. Play specific audio for the given stage
    switch (stage) {
      case 0:
        audioRefs['stage1BG']?.play();
        if (prevStage === 1) {
          audioRefs['splash']?.play();
        }
        break;
      case 1:
        audioRefs['stage2Start']?.play();
        audioRefs['stage2BGLab']?.play();
        audioRefs['stage2Bubble']?.play();
        break;
      case 2:
        break;
      // add more cases as needed
      default:
        break;
    }
  },
  setAudioRef: (key, el) =>
    set((state) => ({
      audioRefs: { ...state.audioRefs, [key]: el },
    })),
}));
