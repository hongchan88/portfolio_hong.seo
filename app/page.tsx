'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from '../components/Hero';
import { Timeline } from '../components/Timeline/Timeline';
import LoadingOverlay from '../components/LoadingOverlay';
import { useProgress } from '@react-three/drei';
import { useCameraStore } from './store/cameraStore';
import { useSettingStore } from './store/settingStore';
import { useControls } from 'leva';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { useAudioStore } from './store/audioStore';
import NavBar from '../components/NavBar';
import AudioGroup from '../components/AudioGroup/AudioGroup';
import RightDrawer from '../components/RightDrawer';
import { useCameraControls } from './hooks/useCameraControls';
export default function App() {
  gsap.registerPlugin(ScrollToPlugin);
  const observerRef = useRef<Observer | null>(null);

  const heroAboutmeRef = useRef<HTMLDivElement>(null);
  const rightDrawerRef = useRef<HTMLDivElement>(null);
  const leftText = useRef<HTMLDivElement>(null);
  const stage1BG = useRef<HTMLAudioElement>(null);
  const stage1Menu = useRef<HTMLAudioElement>(null);
  const stage2Start = useRef<HTMLAudioElement>(null);
  const stage2Bubble = useRef<HTMLAudioElement>(null);
  const stage2BGLab = useRef<HTMLAudioElement>(null);
  const stageTo1 = useRef<HTMLAudioElement>(null);
  const clickAudio = useRef<HTMLAudioElement>(null);
  const { currentStage, setCurrentStage } = useSettingStore();
  // const [currentStage, setCurrentStage] = useState(0);
  const [readyToPlay, setreadyToPlay] = useState(false);
  const { active, progress } = useProgress();
  const audioToggle = useAudioStore((s) => s.audioToggleState);
  const scrollAudio = useAudioStore((s) => s.scrollAudio);
  const typingAudio = useAudioStore((s) => s.typingAudio);
  const clickMenu = useAudioStore((s) => s.clickMenuAudio);
  const isTypingRunning = useSettingStore((s) => s.isTypingRunning);
  const isScrolling = useSettingStore((s) => s.isScrolling);
  const audioToggleRef = useRef(audioToggle);

  const setCameraDefault = useCameraStore((s) => s.setDefault);
  const rightDrawerToggle = useSettingStore((s) => s.rightDrawerToggle);
  const setRightDrawerToggle = useSettingStore((s) => s.setRightDrawerToggle);
  useCameraControls();
  useEffect(() => {
    audioToggleRef.current = audioToggle;
  }, [audioToggle]);
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'power1.inOut' },
      onComplete: () => {
        animatingRef.current = false;
        if (currentStage === 1) {
          killObserver();
        }
      },
    });
    if (rightDrawerToggle) {
      tl.to(rightDrawerRef.current, {
        right: 0,
        ease: 'power1.in',
      }).to(
        leftText.current,
        {
          left: '-50%',
          ease: 'power1.in',
        },
        '<'
      );
    } else {
      tl.to(rightDrawerRef.current, {
        right: -320,
        ease: 'power1.in',
      }).to(leftText.current, { left: '5%' }, '<');
    }
  }, [rightDrawerToggle]);

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

        tl.to(container, { yPercent: 0 });
        stage2BGLab.current.pause();
        stage2Bubble.current.pause();
        if (audioToggle) {
          stage1BG.current.play();
        }
        break;
      case 1:
        tl.to(container, { yPercent: -50 });
        stage1BG.current.pause();
        if (audioToggle) {
          stage2Start.current.play();
          stage2BGLab.current.play();
          stage2Bubble.current.play();
        }

        // "Halfway" – 50% scrolled up

        break;
      case 2:
        // AboutMe fully visible (Hero at -100%)
        // tl.to(container, { yPercent: -100 });

        break;
    }
  }, [currentStage, readyToPlay, rightDrawerToggle, audioToggle]);

  // // ----------------------------------
  // // 3) Initialize on mount
  // // ----------------------------------

  const closeDrawer = () => {
    if (audioToggleRef.current) {
      clickMenu.play();
    }
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
          if (audioToggleRef.current) {
            stageTo1.current.play();
          }
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

  useEffect(() => {
    if (!audioToggle) {
      stage1BG.current.pause();
    } else {
    }
  }, [audioToggle]);
  function toggleAudioFunc({
    playTargets,
    pauseTargets,
  }: {
    playTargets: HTMLAudioElement[] | HTMLAudioElement;
    pauseTargets: HTMLAudioElement[] | HTMLAudioElement;
  }) {
    const playList = Array.isArray(playTargets) ? playTargets : [playTargets];
    const pauseList = Array.isArray(pauseTargets)
      ? pauseTargets
      : [pauseTargets];

    pauseList.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    playList.forEach((audio) => {
      if (audio.paused) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.warn('Play blocked:', e));
      }
    });
  }
  useEffect(() => {
    if (!typingAudio || !scrollAudio || !clickAudio) return;

    if (audioToggle && currentStage === 0 && isTypingRunning) {
      if (isScrolling) {
        toggleAudioFunc({
          playTargets: [scrollAudio, clickAudio.current],
          pauseTargets: [typingAudio],
        });
      } else {
        toggleAudioFunc({
          playTargets: typingAudio,
          pauseTargets: [scrollAudio],
        });
      }
    } else {
      typingAudio.pause();
      scrollAudio.pause();
    }
  }, [isScrolling, audioToggle, currentStage]);
  return (
    <>
      {!readyToPlay && <LoadingOverlay />}
      <AudioGroup
        refs={{
          stage1BG,
          stage1Menu,
          stage2Start,
          stage2Bubble,
          stage2BGLab,
          stageTo1,
          clickAudio,
        }}
      />
      <main
        className={`${
          !readyToPlay ? 'opacity-0 overflow-hidden h-screen relative' : ''
        }`}
      >
        <NavBar closeDrawer={closeDrawer} currentStage={currentStage} />
        <RightDrawer
          rightDrawerRef={rightDrawerRef}
          setCurrentStage={setCurrentStage}
        />

        <section
          ref={heroAboutmeRef}
          className='relative h-[200vh] overflow-hidden'
        >
          <Hero currentStage={currentStage} readyToPlay={readyToPlay} />{' '}
          {/* your <Canvas /> */}
          <div
            ref={leftText}
            className='absolute  font-bold top-[30vh] left-[5%] w-full h-full z-10 pointer-events-none'
          >
            <div className='flex flex-col gap-5'>
              <p className='font-rubik font-bold text-5xl leading-relaxed'>
                Hey,
                <br /> My name is Hong.
              </p>
              <p className='font-mono  text-gray-600 text-xl '>
                I love building things with software
              </p>
            </div>
          </div>
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
