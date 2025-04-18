'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import Projects from '../components/Project/Projects';
import { Timeline } from '../components/Timeline/TimeLine';
import ProjectInfo from '../components/Project/ProjectInfo';
import { projectsData } from './data/data';

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
        if (currentStage === 1) {
          killObserver();
        }
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroAboutmeRef.current,
        start: '10 top',
        end: `+=${aboutImgRef.current.offsetHeight}`,
        scrub: true,
        pin: true,
        pinSpacing: true, // ⬅️ pushes next section down after unpin
        markers: true,

        onLeaveBack: () => {
          initObserver();
        },
      },
    });
    tl.to(aboutSectionRef.current, {
      opacity: 1,
      duration: 0.1, // 👈 fade in fast
    });
    tl.to(
      aboutSectionRef.current,
      {
        y: -aboutImgRef.current.offsetHeight,
        ease: 'none',
      },
      '<'
    );
    // gsap.fromTo(
    //   aboutSectionRef.current,
    //   { opacity: 0 },
    //   {
    //     y: -aboutImgRef.current.offsetHeight,

    //     opacity: 1,
    //     scrollTrigger: {
    //       trigger: heroAboutmeRef.current,
    //       start: '10 top',
    //       end: `+=${aboutImgRef.current.offsetHeight}`,
    //       scrub: true,
    //       pin: true,
    //       pinSpacing: true, // ⬅️ pushes next section down after unpin
    //       markers: true,

    //       onLeaveBack: () => {
    //         initObserver();
    //       },
    //     },
    //   }
    // );

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
      <section ref={heroAboutmeRef} className='relative h-[200vh]'>
        <Hero currentStage={currentStage} /> {/* your <Canvas /> */}
        <div
          ref={aboutSectionRef}
          className='absolute top-2/3 left-0 w-2/5 z-20 opacity-0'
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
        <Timeline data={projectData} />
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
  );
}
const projectData = projectsData.map((project) => ({
  title: project.timelineYear,
  content: (
    <div>
      <p className='mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200'>
        {project.description}
      </p>
      <div className='grid grid-cols-2 gap-4'>
        {project.imgUrl.map((project) => (
          <img
            key={project}
            src={project}
            alt='startup template'
            width={500}
            height={500}
            className='h-full w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-full lg:h-full'
          />
        ))}
      </div>
      <ProjectInfo
        stacks={project.stacks}
        live={project.live}
        git={project.git}
      />
    </div>
  ),
}));
