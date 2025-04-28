'use client';
import React, { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSettingStore } from './stores/settingStore';
import AudioGroup from '../components/AudioGroup/AudioGroup';
import Projects from '../components/Projects';
import Hero from 'components/Hero';
import Image from 'next/image';
import Footer from 'components/Footer';
export default function App() {
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className='fixed inset-0 h-full w-full bg-greenYellowGradient z-[9999] flex flex-col items-center justify-center text-white pointer-events-none'>
        <div className='relative w-56 h-56 mb-4 overflow-hidden x'>
          {/* Base image (desaturated/gray) */}
          <Image
            width={224}
            height={224}
            src='/loading/loading2.webp' // Replace with your PNG
            alt='avatar'
            className='absolute top-0 left-0 w-full h-full object-cover opacity-20'
            priority
          />
          ;
        </div>
      </div>
    );
  }
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
        <Footer />
      </main>
    </>
  );
}
