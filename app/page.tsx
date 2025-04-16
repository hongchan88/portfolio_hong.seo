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

  // Container with Hero + AboutMe
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
    setCurrentStage((prev) => {
      // If we're at stage 2, kill observer for normal scrolling
      if (prev >= 2) {
        killObserver();
        return 2;
      }
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
        break;
      case 2:
        // AboutMe fully visible (Hero at -100%)
        tl.to(container, { yPercent: -100 });
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
        tolerance: 200,
        preventDefault: true,
        onDown: () => !animatingRef.current && goPrevStage(),
        onUp: () => !animatingRef.current && goNextStage(),
      });
    }
    // Start the Observer for Hero + AboutMe
    initObserver();

    // Example ScrollTrigger for Projects
    gsap.from('.projects-section', {
      scrollTrigger: {
        trigger: heroAboutmeRef.current,
        start: 'top top',
        id: 'projects',
        markers: {
          indent: 300,
        },
        // 4) onLeaveBack: if we scroll back UP from Projects -> AboutMe
        //    we re-init the Observer & set stage=2 so AboutMe is fully in view.
        onLeaveBack: () => {
          console.log('We scrolled back up from Projects into About Me!');
          setCurrentStage(2); // ensure container is at -100% (AboutMe fully shown)
          initObserver(); // re-enable snapping so user can go from AboutMe -> Hero
        },
      },
    });
  }, []);

  // ----------------------------------
  // 4) Render
  // ----------------------------------
  return (
    <main>
      {/* Stage 0 => Hero visible */}
      <section ref={heroAboutmeRef} style={{ height: '100%' }}>
        <Hero currentStage={currentStage} />
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
