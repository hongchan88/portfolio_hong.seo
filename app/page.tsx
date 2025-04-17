'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import Projects from '../components/Project/Projects';

export default function App() {
  const observerRef = useRef<Observer | null>(null);

  const heroAboutmeRef = useRef<HTMLDivElement>(null);

  // We'll track our "stage" in state:
  // 0 = Hero visible, 1 = half, 2 = AboutMe fully up
  const [currentStage, setCurrentStage] = useState(0);

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
    const container = heroAboutmeRef.current;
    if (!container) return;

    animatingRef.current = true;

    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'power1.inOut' },
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    switch (currentStage) {
      case 0:
        // Hero fully visible
        tl.to(container, { yPercent: 0 });
        break;
      case 1:
        // "Halfway" – 50% scrolled up
        tl.to(container, { yPercent: -50 });
        animatingRef.current = false;
        killObserver();
        break;
      case 2:
        // AboutMe fully visible (Hero at -100%)
        // tl.to(container, { yPercent: -100 });

        break;
    }
  }, [currentStage]);

  // // ----------------------------------
  // // 3) Initialize on mount
  // // ----------------------------------
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, Observer);
    function initObserver() {
      gsap.registerPlugin(Observer);
      // Kill any existing observer
      observerRef.current?.kill();

      observerRef.current = Observer.create({
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        tolerance: 10,
        preventDefault: true,
        onDown: () => !animatingRef.current && goPrevStage(),
        onUp: () => !animatingRef.current && goNextStage(),
      });
    }
    // Start the Observer for Hero + AboutMe
    initObserver();

    // Example ScrollTrigger for Projects
    if (
      !aboutSectionRef.current ||
      !heroAboutmeRef.current ||
      !aboutImgRef.current
    )
      return;

    const scrollLength = aboutImgRef.current.offsetHeight - window.innerHeight;
    console.log(window.innerHeight, 'window.innerHeight');
    console.log(
      aboutImgRef.current.offsetHeight,
      'aboutImgRef.current.offsetHeight'
    );
    gsap.to(aboutSectionRef.current, {
      y: -400,
      ease: 'none',
      scrollTrigger: {
        trigger: heroAboutmeRef.current,
        start: '5 top',
        end: `+=${2000}`,
        scrub: true,
        pin: true,
        pinSpacing: true, // ⬅️ pushes next section down after unpin
        markers: true,
        onLeaveBack: () => {
          initObserver();
        },
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
  const aboutSectionRef = useRef(null);
  const aboutImgRef = useRef(null);

  // ----------------------------------
  // 4) Render
  // ----------------------------------
  return (
    <main>
      {/* Stage 0 => Hero visible */}
      <section className='relative h-[200vh]'>
        <div ref={heroAboutmeRef} className='sticky top-0 h-[200vh]'>
          <Hero currentStage={currentStage} /> {/* your <Canvas /> */}
          <div
            ref={aboutSectionRef}
            className='absolute top-2/3 left-0 w-[500px] z-20'
          >
            <img
              ref={aboutImgRef}
              src='/aboutme/aboutme.png'
              alt='About Me'
              className='w-auto h-auto'
            />
          </div>
        </div>
      </section>

      <section style={{ height: '100%' }}>
        <AboutMe />
      </section>

      {/* Normal scrolling content (Projects) */}
      <section className='projects-section' style={{ height: '100%' }}>
        <Projects />
      </section>
    </main>
  );
}
