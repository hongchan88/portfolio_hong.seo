'use client';
import React from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSettingStore } from './stores/settingStore';
import AudioGroup from '../components/AudioGroup/AudioGroup';
import Projects from '../components/Projects';
import Hero from 'components/Hero';
export default function App() {
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);

  // useCameraControls();
  console.log('app rerender');

  return (
    <>
      {!isLoadingDone && <LoadingOverlay />}
      <AudioGroup />
      <main
        className={`${
          !isLoadingDone ? 'opacity-0 overflow-hidden h-screen relative' : ''
        }`}
      >
        <Hero />

        {/* Normal scrolling content (Projects) */}
        <Projects />
      </main>
    </>
  );
}
