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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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

  const setRightDrawerToggle = useSettingStore((s) => s.setRightDrawerToggle);
  const pauseAudio = useAudioStore((s) => s.pauseAuido);
  const playAudioForStage = useAudioStore((s) => s.playAudioForStage);
  const isNavBarHiddenRef = useRef(isNavBarHideen);
  const audioToggleState = useAudioStore((s) => s.audioToggleState);

  const audioToggleRef = useRef(audioToggleState);
  const setCameraDefault = useCameraStore((s) => s.setDefault);
  const savedScrollValue = useRef(0);
  const prevRightDrawerToggle = useRef(false);

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
  useGSAP(
    () => {
      if (
        !aboutSectionRef.current ||
        !heroAboutmeRef.current ||
        !aboutImgRef.current
      )
        return;

      gsap.registerPlugin(ScrollTrigger); // ✅ Only registered where it's needed
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'my-scroll-trigger',
            trigger: heroAboutmeRef.current,
            start: '10 top',
            end: `+=${aboutImgRef.current.offsetHeight}`,
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            markers: process.env.NODE_ENV === 'development', // ✅ Debug only
            onEnter: () => {},
            onUpdate: () => {
              if (rightDrawerToggleRef.current) {
                closeDrawer();
              }
            },
            onLeave: () => {
              setIsNavBarHideen(true);
              pauseAudio('stage2BGLab');
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
      return () => ctx.revert();
    },
    { scope: heroAboutmeRef }
  );
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
          playAudioForStage(prevStageRef.current);

          break;
        case 1:
          tl.to(container, { yPercent: -50 });
          playAudioForStage();

          // "Halfway" – 50% scrolled up

          break;
      }
    },
    { dependencies: [currentStage, isLoadingDone] }
  );
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
  return (
    <>
      {!isNavBarHideen ? (
        <div className='fixed bottom-0 z-50 flex justify-center items-center pointer-events-none animate-bounce '>
          <DotLottieReact
            // src='https://lottie.host/33d9972a-5ef1-46bc-af9c-94aa2c58392a/T31TJwnUh0.lottie'
            src={
              currentStage === 0
                ? '/lottieAnimation/scroll_animation_black.json'
                : '/lottieAnimation/scroll_animation_white.json'
            }
            loop
            autoplay
            style={{ width: '100px', height: 'auto', aspectRatio: '1' }}
          />
        </div>
      ) : null}
      {!isNavBarHideen ? (
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
        <div className='relative w-full'>
          <div className='flex flex-row justify-center items-start overflow-hidden'>
            <ModelViewer />
          </div>
        </div>
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
            src='/aboutme/aboutme.png'
            alt='About Me'
            className='w-auto h-auto'
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
