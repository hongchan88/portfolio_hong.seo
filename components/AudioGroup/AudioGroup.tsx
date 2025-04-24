// components/AudioGroup.tsx
import { useRef, useEffect } from 'react';
import { useAudioStore } from '../../app/store/audioStore';
export default function AudioGroup({
  refs,
}: {
  refs: {
    stage1BG: React.RefObject<HTMLAudioElement>;
    stage1Menu: React.RefObject<HTMLAudioElement>;
    stage2Start: React.RefObject<HTMLAudioElement>;
    stage2Bubble: React.RefObject<HTMLAudioElement>;
    stage2BGLab: React.RefObject<HTMLAudioElement>;
    stageTo1: React.RefObject<HTMLAudioElement>;
    clickAudio: React.RefObject<HTMLAudioElement>;
  };
}) {
  return (
    <>
      <audio ref={refs.stage1BG} loop autoPlay src='/sounds/lazy_sunday.mp3' />
      <audio ref={refs.stage1Menu} src='/sounds/woosh.mp3' />
      <audio ref={refs.stage2Start} src='/sounds/transition.mp3' />
      <audio ref={refs.stage2Bubble} src='/sounds/bubble.mp3' />
      <audio ref={refs.stage2BGLab} loop autoPlay src='/sounds/lab_bg.mp3' />
      <audio ref={refs.stageTo1} src='/sounds/splash.mp3' />
      <audio ref={refs.clickAudio} src='/sounds/click.mp3' />

      {/* <audio ref={typingAudio} src='/sounds/typing.mp3' />
      <audio ref={scrollAudio} src='/sounds/scroll.mp3' /> */}

      <audio
        ref={(el) => {
          if (el) useAudioStore.getState().setAudioRef(el, 'clickMenuAudio');
        }}
        src='/sounds/menu.wav'
      />
      <audio
        ref={(el) => {
          if (el) useAudioStore.getState().setAudioRef(el, 'typingAudio');
        }}
        src='/sounds/typing4.mp3'
      />
      <audio
        ref={(el) => {
          if (el) useAudioStore.getState().setAudioRef(el, 'scrollAudio');
        }}
        src='/sounds/scrolling2.mp3'
      />
    </>
  );
}
