'use client';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSettingStore } from './stores/settingStore';
import { useCameraStore } from './stores/cameraStore';
import AudioGroup from '../components/AudioGroup/AudioGroup';
import Projects from '../components/Projects';
import Hero from 'components/Hero';
import Footer from 'components/Footer';
import HydrationLoading from 'components/HydrationLoading';
import BasicPortfolio from 'components/BasicPortfolio';
import SceneBoundary from 'components/SceneBoundary';

export default function App() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { mode, isLoadingDone, currentStage, isMobile, enterBasicMode } =
    useSettingStore();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReducedMotion(media.matches);
      if (media.matches) enterBasicMode();
    };
    // Scene is fresh on every route mount; basic choice survives client navigation.
    if (useSettingStore.getState().mode === 'animated')
      useSettingStore.getState().resetScene();
    sync();
    setIsHydrated(true);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [enterBasicMode]);
  useEffect(() => {
    if (mode === 'animated') {
      // Route returns and basic-mode exits must not reuse a drawer camera preset.
      useCameraStore.getState().setDefault();
      useCameraStore.getState().setMobileDefault();
    }
    document.body.style.overflow = mode === 'animated' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mode]);

  if (!isHydrated) return <HydrationLoading />;
  if (mode === 'basic') return <BasicPortfolio reducedMotion={reducedMotion} />;
  return (
    <>
      <button
        className='fixed bottom-4 right-4 z-[10000] bg-white text-gray-900 border border-gray-500 rounded px-3 py-2 text-sm'
        onClick={() => enterBasicMode()}
      >
        Skip animation / basic version
      </button>
      {!isLoadingDone && <LoadingOverlay />}
      <AudioGroup />
      <main
        data-stage={currentStage}
        data-breakpoint={isMobile ? 'mobile' : 'desktop'}
        className={
          !isLoadingDone ? 'opacity-0 overflow-hidden h-screen relative' : ''
        }
        inert={!isLoadingDone}
      >
        <SceneBoundary>
          <Hero />
        </SceneBoundary>
        {isLoadingDone && (
          <>
            <Projects />
            <Footer />
          </>
        )}
      </main>
    </>
  );
}
