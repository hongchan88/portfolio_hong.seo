'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from '../components/Hero';
import { Timeline } from '../components/Timeline/Timeline';
import LoadingOverlay from '../components/LoadingComponent';
import { useProgress } from '@react-three/drei';
import { useCameraStore } from './store/cameraStore';
import { useSettingStore } from './store/settingStore';
import { useControls } from 'leva';
export default function App() {
  const observerRef = useRef<Observer | null>(null);

  const heroAboutmeRef = useRef<HTMLDivElement>(null);
  const rightDrawerRef = useRef<HTMLDivElement>(null);

  // We'll track our "stage" in state:
  // 0 = Hero visible, 1 = half, 2 = AboutMe fully up
  const [currentStage, setCurrentStage] = useState(0);

  const [readyToPlay, setreadyToPlay] = useState(false);
  const { active, progress } = useProgress();
  const updateCameraPostion = useCameraStore((s) => s.setCamPos);
  const updateZoom = useCameraStore((s) => s.setZoom);
  const setCameraDefault = useCameraStore((s) => s.setDefault);
  const rightDrawerToggle = useSettingStore((s) => s.rightDrawerToggle);
  const setRightDrawerToggle = useSettingStore((s) => s.setRightDrawerToggle);
  const { cx, cy, cz, zoom } = useControls('Camera Position', {
    cx: { value: 10, step: 1 },
    cy: { value: 5, step: 1 },
    cz: { value: 14, step: 1 },
    zoom: { value: 70, min: 10, max: 100, step: 1 }, // Add zoom control here
  });
  useEffect(() => {
    updateCameraPostion([cx, cy, cz]);
    updateZoom(zoom);
  }, [cx, cy, cz, zoom]);
  useEffect(() => {
    if (!active && progress === 100) {
      const timeout = setTimeout(() => setreadyToPlay(true), 1000); // wait 1s after loading
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);
  // For preventing repeated animations if user scrolls quickly
  const animatingRef = useRef(false);

  // ----------------------------------
  // 1) OBSERVER LOGIC
  // ----------------------------------

  // Kill the Observer if we don’t want snapping
  function killObserver() {
    Observer.getAll().forEach((obs) => obs.kill());
    animatingRef.current = false;
  }

  // Forward stage (Hero -> AboutMe)
  function goNextStage() {
    // ✅ Set animating lock
    setCurrentStage((prev) => {
      return prev + 1;
    });
  }

  // Backward stage (AboutMe -> Hero)
  function goPrevStage() {
    setCurrentStage((prev) => {
      // Can't go lower than 0
      if (prev <= 0) return 0;
      return prev - 1;
    });
  }

  // ----------------------------------
  // 2) Animate WHEN currentStage changes
  // ----------------------------------
  useGSAP(() => {
    if (!readyToPlay) return null;

    const container = heroAboutmeRef.current;
    if (!container) return;

    animatingRef.current = true;

    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'power1.inOut' },
      onComplete: () => {
        animatingRef.current = false;
        if (currentStage === 1) {
          killObserver();
        }
      },
    });

    switch (currentStage) {
      case 0:
        // Hero fully visible
        if (rightDrawerToggle) {
          tl.to(rightDrawerRef.current, {
            right: 0,
            delay: 0.3,
            ease: 'power1.in',
          });
        }
        tl.to(container, { yPercent: 0 });
        break;
      case 1:
        // "Halfway" – 50% scrolled up
        tl.to(container, { yPercent: -50 });

        break;
      case 2:
        // AboutMe fully visible (Hero at -100%)
        // tl.to(container, { yPercent: -100 });

        break;
    }
  }, [currentStage, readyToPlay, rightDrawerToggle]);

  // // ----------------------------------
  // // 3) Initialize on mount
  // // ----------------------------------

  const closeDrawer = () => {
    setCameraDefault();
    gsap.to(rightDrawerRef.current, {
      right: -320,
      delay: 0.1,
      ease: 'power1.in',
    });
    setRightDrawerToggle(false);
  };

  const initObserver = () => {
    gsap.registerPlugin(Observer); // ✅ Only register Observer here
    observerRef.current?.kill(); // ✅ Clean previous observer

    observerRef.current = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onDown: () => {
        if (rightDrawerToggle) {
          closeDrawer();
        } else if (!animatingRef.current) {
          goPrevStage();
        }
      },
      onUp: () => {
        if (rightDrawerToggle) {
          closeDrawer();
        } else if (!animatingRef.current) {
          goNextStage();
        }
      },
    });
  };

  // ✅ Handles Observer init and cleanup
  useGSAP(() => {
    if (!readyToPlay) return;

    initObserver();

    return () => {
      observerRef.current?.kill(); // ✅ Important cleanup
    };
  }, [readyToPlay, rightDrawerToggle]);

  // ✅ Handles ScrollTrigger animation
  useGSAP(() => {
    if (
      !aboutSectionRef.current ||
      !heroAboutmeRef.current ||
      !aboutImgRef.current
    )
      return;

    gsap.registerPlugin(ScrollTrigger); // ✅ Only registered where it's needed

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroAboutmeRef.current,
        start: '10 top',
        end: `+=${aboutImgRef.current.offsetHeight}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        markers: process.env.NODE_ENV === 'development', // ✅ Debug only
        onLeaveBack: () => {
          initObserver(); // ✅ Re-init observer when scrolling back up
        },
      },
    });

    tl.to(aboutSectionRef.current, {
      opacity: 1,
      duration: 0.1,
    });
    tl.to(
      aboutSectionRef.current,
      {
        y: -aboutImgRef.current.offsetHeight,
        ease: 'none',
      },
      '<'
    );
  });
  const aboutSectionRef = useRef(null);
  const aboutImgRef = useRef(null);

  // ----------------------------------
  // 4) Render
  // ----------------------------------
  useEffect(() => {
    if (!readyToPlay) {
      document.body.style.overflow = 'hidden'; // 🚫 disable scroll
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = ''; // cleanup on unmount
    };
  }, [readyToPlay]);
  return (
    <>
      {!readyToPlay && <LoadingOverlay />}

      <main
        className={`${
          !readyToPlay ? 'opacity-0 overflow-hidden h-screen relative' : ''
        }`}
      >
        {/* Stage 0 => Hero visible */}
        <div className='fixed top-0 w-full  z-10 '>
          <div className='flex w-full justify-between p-10'>
            <div className='w-12 h-12'>
              <img src='./loading/loading2.png' />
            </div>
            <div className='flex'>
              <div>sound</div>
              <div
                className=' cursor-pointer'
                onClick={() => {
                  // updateCameraPostion([23, 5, 4]);
                  updateCameraPostion([-28, 6, 7]);
                  updateZoom(24);
                  setRightDrawerToggle(true);
                }}
              >
                menu
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => setCameraDefault()}
          ref={rightDrawerRef}
          className='absolute top-0 -right-80 h-full w-80 bg-white z-10'
        >
          test
        </div>
        <section ref={heroAboutmeRef} className='relative h-[200vh]'>
          <Hero currentStage={currentStage} readyToPlay={readyToPlay} />{' '}
          {/* your <Canvas /> */}
          <div
            ref={aboutSectionRef}
            className='absolute top-2/3 left-0 w-2/5 z-20 opacity-0 pointer-events-none'
          >
            <img
              ref={aboutImgRef}
              src='/aboutme/aboutme3.png'
              alt='About Me'
              className='w-auto h-auto'
            />
          </div>
        </section>

        {/* Normal scrolling content (Projects) */}
        <section
          className='projects-section'
          style={{
            height: '100%',
            marginTop: '-100vh',
            background: 'linear-gradient(to bottom, rgba(177,204,112,0.2) 50%)',
          }}
        >
          {/* <Projects /> */}
          <Timeline />
        </section>
        {/* <section
        style={{
          height: '100%',
          marginTop: '-100vh',
        }}
      >
        <AboutMe />
      </section> */}
      </main>
    </>
  );
}
