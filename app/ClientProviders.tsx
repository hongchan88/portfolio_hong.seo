'use client';
import { ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettingStore } from './stores/settingStore';
import { useCameraStore } from './stores/cameraStore';

const ScrollRestoration = dynamic(() => import('./utils/ScrollRestoration'), {
  ssr: false,
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Tailwind md starts at 768px; mobile is strictly below that boundary.
    const breakpoint = window.matchMedia('(min-width: 768px)');
    let frame = 0;
    const sync = () => {
      const settings = useSettingStore.getState();
      settings.setIsMobile(!breakpoint.matches);
      const camera = useCameraStore.getState();
      camera.setDefault();
      camera.setMobileDefault();
      if (settings.rightDrawerToggle) {
        if (settings.currentStage === 0) camera.setFirstMenuCameraPos();
        else camera.setSecondMenuCameraPos();
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    sync();
    breakpoint.addEventListener('change', sync);
    return () => {
      breakpoint.removeEventListener('change', sync);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <>
      <div
        id='bubbleOverlayWrapper'
        aria-hidden='true'
        className='fixed inset-0 z-[9999] pointer-events-none opacity-0'
      >
        <svg
          id='bubbleOverlay'
          className='w-full h-full'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
        >
          <circle id='bubbleCircle' cx='0' cy='100' r='0' fill='#b1cc70' />
        </svg>
      </div>
      <ThemeProvider defaultTheme='light' attribute='class'>
        <ScrollRestoration />
        <div className='main-contents'>{children}</div>
      </ThemeProvider>
    </>
  );
}
