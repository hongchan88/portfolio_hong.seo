'use client';
import { FC, useEffect, useLayoutEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useSettingStore } from '@store/settingStore';
import { useAudioStore } from '@store/audioStore';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useCameraStore } from '@store/cameraStore';
import dynamic from 'next/dynamic';
import { useRefStore } from '@store/refsStore';
import HeroOverlays from 'components/HeroOverlays';
import Biography from 'components/Biography';

const ModelViewer = dynamic(() => import('../../components/ModelViewer'), {
  ssr: false,
});
interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
  gsap.registerPlugin(ScrollToPlugin);
  const observerRef = useRef<Observer | null>(null);
  const heroAboutmeRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null); // NEW

  const animatingRef = useRef(false);
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
  const isMobile = useSettingStore((s) => s.isMobile);

  const setRightDrawerToggle = useSettingStore((s) => s.setRightDrawerToggle);
  const pauseAudio = useAudioStore((s) => s.pauseAuido);
  const playAudioForStage = useAudioStore((s) => s.playAudioForStage);
  const isNavBarHiddenRef = useRef(isNavBarHideen);
  const audioToggleState = useAudioStore((s) => s.audioToggleState);

  const audioToggleRef = useRef(audioToggleState);
  const setCameraDefault = useCameraStore((s) => s.setDefault);
  const setMobileDefault = useCameraStore((s) => s.setMobileDefault);
  const savedScrollValue = useRef(0);
  const prevRightDrawerToggle = useRef(false);
  const isObserverReady = useRef(false);

  const aboutContentRef = useRef<HTMLDivElement>(null);
  const leftText = useRef<HTMLDivElement>(null);
  const prevStageRef = useRef(currentStage); // new!
  const rightDrawerToggleRef = useRef(rightDrawerToggle);
  const aboutSectionRef = useRefStore((s) => s.aboutSectionRef);

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

  const { contextSafe } = useGSAP({ scope: heroAboutmeRef });
  const closeDrawer = contextSafe(() => {
    if (audioToggleRef.current) {
      useAudioStore.getState().playAudio('clickMenuAudio');
    }
    // Escape may retain this handler across a breakpoint change.
    setMobileDefault();
    setCameraDefault();
    setRightDrawerToggle(false);
    rightDrawerToggleRef.current = false;
  });
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
    observerRef.current?.kill();
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
      ignoreCheck: (event) => event.target instanceof Element &&
        Boolean(event.target.closest('#navigation-drawer')),
      onClick: () => {
        if (rightDrawerToggleRef.current) {
          animatingRef.current = true;
          closeDrawer();
        }
      },
      // onDown: () => {
      //   if (rightDrawerToggleRef.current || isNavBarHiddenRef.current) return;
      //   if (!animatingRef.current) {
      //     goPrevStage();
      //   }
      // },
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
        if (currentStage === 0) initObserver();
      }, heroAboutmeRef); // or any root-level container if preferred

      return () => {
        observerRef.current?.kill(); // custom cleanup
        ctx.revert(); // just in case any GSAP effects appear later
      };
    },
    {
      dependencies: [isLoadingDone, isMobile],
      revertOnUpdate: true,
      scope: heroAboutmeRef, // ✅ same scope for future-proofing
    }
  );

  useGSAP(
    () => {
      if (!heroAboutmeRef.current || !isLoadingDone || !aboutContentRef.current)
        return;
      let ctx: gsap.Context; // Declare ctx here
      console.log(isObserverReady.current, 'observer ready');
      function waitForObserver() {
        if (!isObserverReady.current) {
          return;
        }
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({
          ignoreMobileResize: true,
        });
        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              id: 'my-scroll-trigger',
              trigger: heroAboutmeRef.current,
              start: '5 top',
              end: () => `+=${aboutContentRef.current.offsetHeight}`,
              invalidateOnRefresh: true,
              scrub: 1.5,
              pin: true,
              pinSpacing: true,

              markers: false,
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
              y: () => -aboutContentRef.current.offsetHeight,
              ease: 'none',
            },
            '<'
          );
        }, heroAboutmeRef);
      }

      waitForObserver();

      return () => {
        ctx?.revert();
      };
    },
    {
      scope: heroAboutmeRef,
      dependencies: [isLoadingDone, isMobile],
      revertOnUpdate: true,
    }
  );

  // Capture original transform once; dependency changes must not revert it.
  useGSAP(() => {
    gsap.set(heroContentRef.current, { y: 0 });
  }, { scope: heroAboutmeRef });

  useLayoutEffect(() => {
    if (!isLoadingDone) return;
    if (currentStage === 0) {
      document.body.style.overflow = 'hidden';
      playAudioForStage(prevStageRef.current);
      initObserver();
    } else {
      document.body.style.overflow = '';
      playAudioForStage();
    }
  }, [currentStage, isLoadingDone]);

  useLayoutEffect(() => {
    const container = heroContentRef.current;
    if (!isLoadingDone || !container) return;

    let tween: gsap.core.Tween | undefined;
    let previousTarget: number | undefined;
    const retarget = () => {
      const height = container.getBoundingClientRect().height;
      if (!height) return;
      // Mobile container is calc(204vh + 200px); preserve CSS -102vh,
      // including browsers where innerHeight differs from the CSS vh viewport.
      const target = currentStage === 0 ? 0 : -(height - (isMobile ? 200 : 0)) / 2;
      if (target === previousTarget) return;
      previousTarget = target;
      // Kill only: resizing/reversing must retain the intermediate transform.
      tween?.kill();
      animatingRef.current = true;
      tween = gsap.to(container, {
        y: target,
        duration: 1,
        ease: 'power1.inOut',
        onComplete: () => {
          animatingRef.current = false;
          if (currentStage === 1) killObserver();
        },
      });
    };
    retarget();
    const resizeObserver = new ResizeObserver(retarget);
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
      tween?.kill();
    };
  }, [currentStage, isLoadingDone, isMobile]);

  return (
    <>
      <HeroOverlays
        closeDrawer={closeDrawer}
        animatingRef={animatingRef}
        leftText={leftText}
      />
      <section
        ref={heroAboutmeRef}
        className={`relative overflow-hidden pointer-events-none`}
      >
        <div ref={heroContentRef} className=' w-full h-full'>
          <ModelViewer />
          <div
            ref={aboutSectionRef}
            className='absolute top-2/3 left-0 w-full z-20 opacity-0 pointer-events-none'
          >
            <div ref={aboutContentRef} data-about-content className='relative md:w-2/5 w-full'
              style={{ containerType: 'inline-size' }}>
              <img src='/aboutme/aboutMeFill.webp' alt='' aria-hidden='true'
                width={1024} height={2200} className='block w-full h-auto' />
              <Biography artwork />
            </div>
          </div>
          <div
            ref={leftText}
            className='absolute top-[30vh] left-[5%] w-full h-full z-10 pointer-events-none'
          >
            <div className='flex flex-col gap-5'>
              <h1 className='font-rubik font-bold md:text-5xl md:leading-normal text-2xl leading-relaxed'>
                Hey,
                <br /> My name is Hong.
              </h1>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
