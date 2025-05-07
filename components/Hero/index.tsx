'use client';
import { FC, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useSettingStore } from '@store/settingStore';
import { useAudioStore } from '@store/audioStore';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import NavBar from '../NavBar';
import RightDrawer from '../RightDrawer';
import { useCameraStore } from '@store/cameraStore';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('../../components/ModelViewer'), {
  ssr: false,
});
interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
  gsap.registerPlugin(ScrollToPlugin);
  const observerRef = useRef<Observer | null>(null);
  const heroAboutmeRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef(null);
  const aboutImgRef = useRef(null);
  const heroContentRef = useRef<HTMLDivElement>(null); // NEW

  const animatingRef = useRef(false);
  const rightDrawerRef = useRef<HTMLDivElement>(null);
  const leftText = useRef<HTMLDivElement>(null);
  const currentStage = useSettingStore((s) => s.currentStage);
  const rightDrawerToggle = useSettingStore((s) => s.rightDrawerToggle);
  const setCurrentStage = useSettingStore((s) => s.setCurrentStage);
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);
  const isNavBarHideen = useSettingStore((s) => s.isNavBarHideen);
  const setIsNavBarHideen = useSettingStore((s) => s.setIsNavBarHideen);
  const setAmountOfScrollingInStage2 = useSettingStore(
    (s) => s.setAmountOfScrollingInStage2
  );
  const isTypingRunning = useSettingStore((s) => s.isTypingRunning);
  const audioRefs = useAudioStore((s) => s.audioRefs);
  const isMobile = useSettingStore((s) => s.isMobile);

  const setRightDrawerToggle = useSettingStore((s) => s.setRightDrawerToggle);
  const pauseAudio = useAudioStore((s) => s.pauseAuido);
  const playAudioForStage = useAudioStore((s) => s.playAudioForStage);
  const isNavBarHiddenRef = useRef(isNavBarHideen);
  const audioToggleState = useAudioStore((s) => s.audioToggleState);

  const audioToggleRef = useRef(audioToggleState);
  const setCameraDefault = useCameraStore((s) => s.setDefault);
  const savedScrollValue = useRef(0);
  const prevRightDrawerToggle = useRef(false);
  const isObserverReady = useRef(false);

  const prevStageRef = useRef(currentStage); // new!
  const rightDrawerToggleRef = useRef(rightDrawerToggle);

  useEffect(() => {
    if (prevStageRef.current === 1 && currentStage === 0) {
      // ✅ Here you can handle special logic
    }

    prevStageRef.current = currentStage; // Always update after check
  }, [currentStage]);
  useEffect(() => {
    audioToggleRef.current = audioToggleState;
    playAudioForStage();
  }, [audioToggleState]);
  useEffect(() => {
    rightDrawerToggleRef.current = rightDrawerToggle;
  }, [rightDrawerToggle]);

  const closeDrawer = () => {
    if (audioToggleRef.current) {
      audioRefs?.['clickMenuAudio']?.play();
    }
    setCameraDefault();
    gsap.to(rightDrawerRef.current, {
      right: -320,
      delay: 0.1,
      ease: 'power1.in',
      onStart: () => {
        setRightDrawerToggle(false);
        rightDrawerToggleRef.current = false;
      },
      onComplete: () => {
        animatingRef.current = false;
      },
    });
  };
  useEffect(() => {
    if (isTypingRunning) {
      setIsNavBarHideen(false);
    }
  }, [isTypingRunning]);

  useEffect(() => {
    isNavBarHiddenRef.current = isNavBarHideen;
  }, [isNavBarHideen]);
  useEffect(() => {
    if (!prevRightDrawerToggle.current && rightDrawerToggle) {
      const st = ScrollTrigger.getById('my-scroll-trigger');
      if (st) {
        const value = st.scroll();
        console.log('ScrollTrigger scroll value:', value);
        savedScrollValue.current = value;
        setAmountOfScrollingInStage2(value); // ✅ optional
      }
      console.log(
        '✅ Saved scroll value at drawer open:',
        savedScrollValue.current
      );
    }
    prevRightDrawerToggle.current = rightDrawerToggle;
  }, [rightDrawerToggle]);

  // Kill the Observer if we don’t want snapping
  function killObserver() {
    Observer.getAll().forEach((obs) => obs.kill());
    animatingRef.current = false;
  }

  // Forward stage (Hero -> AboutMe)
  function goNextStage() {
    // ✅ Set animating lock
    setCurrentStage((prev) => {
      if (prev > 0) return 1;
      return prev + 1;
    });
  }

  // Backward stage (AboutMe -> Hero)
  function goPrevStage() {
    setCurrentStage((prev) => {
      // Can't go lower than 0
      console.log(prev, 'prev in go prev stage');
      if (prev <= 0) return 0;
      return prev - 1;
    });
  }

  const initObserver = () => {
    gsap.registerPlugin(Observer); // ✅ Only register Observer here
    observerRef.current?.kill(); // ✅ Clean previous observer

    observerRef.current = Observer.create({
      type: 'wheel,touch',
      wheelSpeed: -1,
      tolerance: 10,
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
          goPrevStage();
        }
      },
      onUp: () => {
        console.log(currentStage, 'current stage onup');
        if (rightDrawerToggleRef.current || isNavBarHiddenRef.current) return;

        if (!animatingRef.current) {
          goNextStage();
        }
      },
    });
    isObserverReady.current = true; // ✅ MOVE IT HERE
  };
  useGSAP(
    () => {
      if (!isLoadingDone) return;

      const ctx = gsap.context(() => {
        initObserver();
      }, heroAboutmeRef); // or any root-level container if preferred

      return () => {
        observerRef.current?.kill(); // custom cleanup
        ctx.revert(); // just in case any GSAP effects appear later
      };
    },
    {
      dependencies: [isLoadingDone],
      scope: heroAboutmeRef, // ✅ same scope for future-proofing
    }
  );

  useGSAP(
    () => {
      if (!heroAboutmeRef.current) return;
      let ctx: gsap.Context; // Declare ctx here
      console.log(isObserverReady.current, 'observer ready');
      function waitForObserver() {
        if (!isObserverReady.current) {
          setTimeout(waitForObserver, 20); // Retry until ready
          return;
        }
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              id: 'my-scroll-trigger',
              trigger: heroAboutmeRef.current,
              start: '5 top',
              end: `+=${aboutImgRef.current.offsetHeight}`,
              scrub: 1.5,
              pin: true,
              // pinSpacing: true,
              markers: process.env.NODE_ENV === 'development',
              onUpdate: () => {
                if (rightDrawerToggleRef.current) {
                  closeDrawer();
                }
              },
              onEnter: () => {
                console.log('on enter');
              },
              onLeave: () => {
                console.log('on leave');
                setIsNavBarHideen(true);
                pauseAudio('stage2BGLab');
              },
              onEnterBack: () => {
                console.log('on Enter Back');
                setIsNavBarHideen(false);
                playAudioForStage();
              },
              onLeaveBack: () => {
                console.log('on leave Back');
                initObserver();
                goPrevStage();
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
        }, heroAboutmeRef);
      }

      waitForObserver();

      return () => {
        ctx?.revert(); // Only revert if ctx is defined
      };
    },
    {
      scope: heroAboutmeRef,
      dependencies: [aboutImgRef, heroAboutmeRef],
    }
  );

  useGSAP(
    () => {
      if (!isLoadingDone) return;

      const ctx = gsap.context(() => {
        const container = heroContentRef.current;
        const height = container?.getBoundingClientRect().height ?? 0;
        if (!container || height === 0) return;

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
            document.body.style.overflow = 'hidden';
            tl.to(container, { y: 0 });
            playAudioForStage(prevStageRef.current);
            break;
          case 1:
            document.body.style.overflow = '';
            tl.to(container, { y: isMobile ? '-102vh' : -height / 2 });
            playAudioForStage();
            break;
        }
      }, heroAboutmeRef); // Scoped to section

      return () => ctx.revert();
    },
    {
      dependencies: [currentStage, isLoadingDone, heroContentRef],
      scope: heroAboutmeRef,
    }
  );

  return (
    <>
      {!isNavBarHideen ? (
        <div className='fixed bottom-3 left-5 z-50 flex justify-center items-center pointer-events-none animate-bounce '>
          <span
            className={` text-xs ${
              currentStage === 0 ? 'text-black' : ' text-white'
            }`}
          >
            [scroll to explore]
          </span>
        </div>
      ) : null}

      {!isNavBarHideen ? (
        <NavBar closeDrawer={closeDrawer} currentStage={currentStage} />
      ) : null}
      <RightDrawer
        rightDrawerRef={rightDrawerRef}
        leftText={leftText}
        setCurrentStage={setCurrentStage}
        animatingRef={animatingRef}
        aboutSectionRef={aboutSectionRef}
      />
      <section
        ref={heroAboutmeRef}
        style={{
          height: isMobile ? 'calc(204vh + 400px)' : '204vh',
        }}
        className={`relative overflow-hidden pointer-events-none`}
      >
        {/* 👇 NEW wrapper div for animation */}
        <div ref={heroContentRef} className=' w-full h-full'>
          <ModelViewer
            leftTextRef={leftText}
            aboutImgRef={aboutImgRef}
            aboutSectionRef={aboutSectionRef}
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
