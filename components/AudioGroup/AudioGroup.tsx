import { useAudioStore } from '@store/audioStore';

export default function AudioElements() {
  const setAudioRef = useAudioStore((s) => s.setAudioRef);
  const getAudioRefs = useAudioStore.getState().audioRefs;

  return (
    <>
      <audio
        ref={(el) => {
          if (el && getAudioRefs['stage1BG'] !== el)
            setAudioRef('stage1BG', el);
        }}
        src='/sounds/lazy_sunday.mp3'
        loop
        autoPlay
        preload='none'
      />
      {/* <audio
        ref={(el) => {
          if (el && getAudioRefs['stage1Menu'] !== el)
            setAudioRef('stage1Menu', el);
        }}
        src='/sounds/woosh.mp3'
      /> */}
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['stage2Start'] !== el)
            setAudioRef('stage2Start', el);
        }}
        src='/sounds/transition.mp3'
      />
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['stage2Bubble'] !== el)
            setAudioRef('stage2Bubble', el);
        }}
        src='/sounds/bubble.mp3'
      />
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['stage2BGLab'] !== el)
            setAudioRef('stage2BGLab', el);
        }}
        src='/sounds/lab_bg.mp3'
        loop
        autoPlay
      />
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['splash'] !== el) setAudioRef('splash', el);
        }}
        src='/sounds/splash.mp3'
      />
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['clickingSound'] !== el)
            setAudioRef('clickingSound', el);
        }}
        src='/sounds/click.mp3'
      />
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['clickMenuAudio'] !== el)
            setAudioRef('clickMenuAudio', el);
        }}
        src='/sounds/menu.wav'
      />
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['typingAudio'] !== el)
            setAudioRef('typingAudio', el);
        }}
        src='/sounds/typing4.mp3'
      />
      <audio
        preload='none'
        ref={(el) => {
          if (el && getAudioRefs['scrollAudio'] !== el)
            setAudioRef('scrollAudio', el);
        }}
        src='/sounds/scrolling2.mp3'
      />
    </>
  );
}
