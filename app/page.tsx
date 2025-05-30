'use client';
import React, { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSettingStore } from './stores/settingStore';
import AudioGroup from '../components/AudioGroup/AudioGroup';
import Projects from '../components/Projects';
import Hero from 'components/Hero';
import Footer from 'components/Footer';
import HydrationLoading from 'components/HydrationLoading';
export default function App() {
  const [isHydrated, setIsHydrated] = useState(false);
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  // useCameraControls();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);
  return (
    <>
      {!isHydrated && <HydrationLoading />}

      {isHydrated && !isLoadingDone && <LoadingOverlay />}
      <AudioGroup />
      <main
        className={`${
          !isLoadingDone ? 'opacity-0 overflow-hidden h-screen relative' : ''
        }`}
      >
        <Hero />

        {isLoadingDone ? (
          <>
            <Projects />

            <Footer />
          </>
        ) : null}
      </main>
    </>
  );
}
