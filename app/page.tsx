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
import { useCameraStore } from './stores/cameraStore';
import { useSettingStore } from './stores/settingStore';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { useAudioStore } from './stores/audioStore';
import NavBar from '../components/NavBar';
import AudioGroup from '../components/AudioGroup/AudioGroup';
import RightDrawer from '../components/RightDrawer';
import { useCameraControls } from './hooks/useCameraControls';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ContainerTextFlip } from '../components/ContainerTextFlip';
import Projects from '../components/Projects';
export default function App() {
  gsap.registerPlugin(ScrollToPlugin);
  const observerRef = useRef<Observer | null>(null);

  const heroAboutmeRef = useRef<HTMLDivElement>(null);
  const rightDrawerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef(null);
  const aboutImgRef = useRef(null);
  const leftText = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  const { audioRefs, audioToggleState, playAudioForStage, pauseAuido } =
    useAudioStore();
  const clickAudio = audioRefs['clickAudio'];
  const stage1BG = audioRefs['stage1BG'];

  const stageTo1 = audioRefs['stageTo1'];
  const typingAudio = audioRefs['typingAudio'];
  const scrollAudio = audioRefs['scrollAudio'];

  const {
    currentStage,
    setCurrentStage,
    isLoadingDone,
    setIsLoadingDone,
    isTypingRunning,
    isScrolling,
    rightDrawerToggle,
    setRightDrawerToggle,
    setAmountOfScrollingInStage2,
  } = useSettingStore();

  // const [currentStage, setCurrentStage] = useState(0);
  const { active, progress } = useProgress();
  const [isNavBarHidden, setIsNavBarHideen] = useState(true);

  const audioToggleRef = useRef(audioToggleState);
  const rightDrawerToggleRef = useRef(rightDrawerToggle);
  const isNavBarHiddenRef = useRef(isNavBarHidden);

  const setCameraDefault = useCameraStore((s) => s.setDefault);
  // useCameraControls();

  useEffect(() => {
    audioToggleRef.current = audioToggleState;
    playAudioForStage();
  }, [audioToggleState]);
  useEffect(() => {
    rightDrawerToggleRef.current = rightDrawerToggle;
  }, [rightDrawerToggle]);

  useEffect(() => {
    isNavBarHiddenRef.current = isNavBarHidden;
  }, [isNavBarHidden]);
  useEffect(() => {
    if (isTypingRunning) {
      setIsNavBarHideen(false);
    }
  }, [isTypingRunning]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power1.inOut' },
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      if (currentStage === 0 && rightDrawerToggle) {
        tl.to(rightDrawerRef.current, { right: 0 }).to(
          leftText.current,
          { left: '-50%' },
          '<'
        );
      } else if (currentStage === 0) {
        tl.to(rightDrawerRef.current, { right: -320 }).to(
          leftText.current,
          { left: '5%' },
          '<'
        );
      }

      if (currentStage === 1 && rightDrawerToggle) {
        tl.to(rightDrawerRef.current, { right: 0 }).to(
          aboutSectionRef.current,
          { left: '-50%' },
          '<'
        );
      } else if (currentStage === 1) {
        tl.to(rightDrawerRef.current, { right: -320 }).to(
          aboutSectionRef.current,
          { left: '0' },
          '<'
        );
      }
    },
    {
      dependencies: [currentStage, rightDrawerToggle],
    }
  );

  useEffect(() => {
    if (!active && progress === 100) {
      const timeout = setTimeout(() => setIsLoadingDone(true), 1000); // wait 1s after loading
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);
  // For preventing repeated animations if user scrolls quickly

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
  useGSAP(
    () => {
      if (!isLoadingDone) return null;

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
          console.log(audioToggleRef.current, 'audio toggle');
          playAudioForStage();

          break;
        case 1:
          tl.to(container, { yPercent: -50 });
          playAudioForStage();

          // "Halfway" – 50% scrolled up

          break;
        case 2:
          // AboutMe fully visible (Hero at -100%)
          // tl.to(container, { yPercent: -100 });

          break;
      }
    },
    { dependencies: [currentStage, isLoadingDone] }
  );

  // // ----------------------------------
  // // 3) Initialize on mount
  // // ----------------------------------

  const closeDrawer = () => {
    if (audioToggleRef.current) {
      audioRefs?.['clickMenuAudio']?.play();
    }
    setCameraDefault();
    gsap.to(rightDrawerRef.current, {
      right: -320,
      delay: 0.1,
      ease: 'power1.in',
      onComplete: () => {
        animatingRef.current = false;
      },
    });
    setRightDrawerToggle(false);
    rightDrawerToggleRef.current = false;
  };

  const initObserver = () => {
    gsap.registerPlugin(Observer); // ✅ Only register Observer here
    observerRef.current?.kill(); // ✅ Clean previous observer

    observerRef.current = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 100,
      preventDefault: true,
      onClick: () => {
        if (rightDrawerToggleRef.current) {
          animatingRef.current = true;
          closeDrawer();
        }
      },
      onDown: () => {
        if (rightDrawerToggleRef.current || isNavBarHiddenRef.current) return;
        if (!animatingRef.current) {
          if (audioToggleRef.current) {
            stageTo1?.play();
          }
          goPrevStage();
        }
      },
      onUp: () => {
        if (rightDrawerToggleRef.current || isNavBarHiddenRef.current) return;
        if (!animatingRef.current) {
          goNextStage();
        }
      },
    });
  };

  // ✅ Handles Observer init and cleanup
  useGSAP(
    () => {
      if (!isLoadingDone) return;

      initObserver();

      return () => {
        observerRef.current?.kill(); // ✅ Important cleanup
      };
    },
    { dependencies: [isLoadingDone] }
  );

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
        onUpdate: (self) => {
          if (rightDrawerToggleRef.current) {
            console.log('hidden');
            closeDrawer();
          }
          const value = self.scroll();
          setAmountOfScrollingInStage2(value);
        },
        onLeave: () => {
          setIsNavBarHideen(true);
          pauseAuido('stage2BGLab');
          // audioRefs['stage2BGLab']?.pause();
        },
        onEnterBack: () => {
          setIsNavBarHideen(false);
          playAudioForStage();
        },

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

  // ----------------------------------
  // 4) Render
  // ----------------------------------
  useEffect(() => {
    if (!isLoadingDone) {
      document.body.style.overflow = 'hidden'; // 🚫 disable scroll
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = ''; // cleanup on unmount
    };
  }, [isLoadingDone]);

  useEffect(() => {
    if (!audioToggleRef.current) {
      stage1BG?.pause();
    } else {
    }
  }, [audioToggleRef.current]);

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
      audio?.pause();
      audio.currentTime = 0;
    });

    playList.forEach((audio) => {
      if (audio.paused) {
        audio.currentTime = 0;
        audio?.play().catch((e) => console.warn('Play blocked:', e));
      }
    });
  }
  useEffect(() => {
    if (!typingAudio || !scrollAudio || !clickAudio) return;

    if (audioToggleState && currentStage === 0 && isTypingRunning) {
      if (isScrolling) {
        toggleAudioFunc({
          playTargets: [scrollAudio, clickAudio],
          pauseTargets: [typingAudio],
        });
      } else {
        toggleAudioFunc({
          playTargets: typingAudio,
          pauseTargets: [scrollAudio],
        });
      }
    } else {
      typingAudio?.pause();
      scrollAudio?.pause();
    }
  }, [isScrolling, currentStage, audioToggleState]);
  return (
    <>
      {!isLoadingDone && <LoadingOverlay />}
      <AudioGroup />
      <main
        className={`${
          !isLoadingDone ? 'opacity-0 overflow-hidden h-screen relative' : ''
        }`}
      >
        {!isNavBarHidden ? (
          <div className='fixed bottom-0 z-50 flex justify-center items-center pointer-events-none animate-bounce '>
            <DotLottieReact
              // src='https://lottie.host/33d9972a-5ef1-46bc-af9c-94aa2c58392a/T31TJwnUh0.lottie'
              src={
                currentStage === 0
                  ? './lottieAnimation/scroll_animation_black.json'
                  : './lottieAnimation/scroll_animation_white.json'
              }
              loop
              autoplay
              style={{ width: '100px', height: 'auto', aspectRatio: '1' }}
            />
          </div>
        ) : null}
        {!isNavBarHidden ? (
          <NavBar closeDrawer={closeDrawer} currentStage={currentStage} />
        ) : null}
        <RightDrawer
          rightDrawerRef={rightDrawerRef}
          setCurrentStage={setCurrentStage}
        />

        <section
          ref={heroAboutmeRef}
          className='relative h-[204vh] overflow-hidden'
        >
          <Hero /> {/* your <Canvas /> */}
          <div
            ref={leftText}
            className='absolute  font-bold top-[30vh] left-[5%] w-full h-full z-10 pointer-events-none'
          >
            <div className='flex flex-col gap-5'>
              <p className='font-rubik font-bold text-5xl leading-relaxed'>
                Hey,
                <br /> My name is Hong.
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
        <Projects />
        {/* <Projects /> */}

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
