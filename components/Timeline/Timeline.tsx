'use client';
import { useScroll, useTransform, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import ProjectInfo from '../Project/ProjectInfo';
import { projectsData } from '../../app/data/data';
import { SiLeetcode } from 'react-icons/si';
import Image from 'next/image';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  git?: string;
  live?: string;
  timelineYear?: string;
  leetcode?: string;
}
const projectData = projectsData.map((project) => ({
  timelineYear: project.timelineYear,
  title: project.title,
  git: project.git,
  leetcode: project.leetcode,
  live: project.live,
  content: (
    <div>
      <div className='mb-8 text-lg font-normal text-neutral-800 md:text-lg dark:text-neutral-200'>
        {project.description}
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {project.imgUrl.map((project) => (
          <Image
            loading='lazy'
            key={project}
            src={project}
            alt='project_image'
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

export const Timeline = () => {
  const data: TimelineEntry[] = projectData;
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  // useEffect(() => {
  //   if (ref.current) {
  //     const rect = ref.current.getBoundingClientRect();
  //     setHeight(rect.height);
  //   }
  // }, [ref]);
  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        console.log('Observed size:', entry.contentRect.height);
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(ref.current); // 👈 This tells it which element to watch

    return () => observer.disconnect(); // cleanup
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className='w-full h-full bg-white dark:bg-neutral-950 font-sans md:px-10'
      ref={containerRef}
    >
      <div ref={ref} className='relative max-w-7xl mx-auto pb-20'>
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex md:flex-row flex-col justify-start pt-10 md:pt-5  md:gap-10 md:border-0 gap-12`}
          >
            <div className='sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full'>
              <div className='hidden md:flex h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black items-center justify-center'>
                <div className='h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2' />
              </div>
              <div className='hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 '>
                <div className='flex flex-col gap-3'>
                  <h3>{item.title}</h3>
                  <p className='text-lg '>{item.timelineYear}</p>
                  <div className='flex gap-5 items-center'>
                    {item?.git && (
                      <a
                        href={item.git}
                        target={'_blank'}
                        className='dark:bg-yellow-50 rounded-lg'
                      >
                        <img
                          className='h-auto w-10 object-cover '
                          src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
                        />
                      </a>
                    )}
                    {item?.live && (
                      <a
                        href={item.live}
                        target={'_blank'}
                        className='dark:bg-yellow-50 rounded-lg'
                      >
                        <img
                          className='h-auto w-10 '
                          src='https://img.icons8.com/pastel-glyph/64/000000/external-link--v1.png'
                        />
                      </a>
                    )}
                    {item?.leetcode && (
                      <a
                        href={item.leetcode}
                        target={'_blank'}
                        className='dark:bg-yellow-50 rounded-lg'
                        title='leetcode'
                      >
                        <SiLeetcode />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='relative px-10 pr-4 md:pl-4 w-full '>
              <div className='md:hidden flex items-center gap-5 mb-5'>
                <h3 className='block text-2xl text-left font-bold text-neutral-500 dark:text-neutral-500'>
                  {item.title}
                </h3>
                <div className='flex gap-5 items-center'>
                  {item?.git && (
                    <a
                      href={item.git}
                      target={'_blank'}
                      className='dark:bg-yellow-50 rounded-lg'
                    >
                      <img
                        className='h-auto w-10 object-cover '
                        src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
                      />
                    </a>
                  )}
                  {item?.live && (
                    <a
                      href={item.live}
                      target={'_blank'}
                      className='dark:bg-yellow-50 rounded-lg'
                    >
                      <img
                        className='h-auto w-10 '
                        src='https://img.icons8.com/pastel-glyph/64/000000/external-link--v1.png'
                      />
                    </a>
                  )}
                  {item?.leetcode && (
                    <a
                      href={item.leetcode}
                      target={'_blank'}
                      className='dark:bg-yellow-50 rounded-lg'
                      title='leetcode'
                    >
                      <SiLeetcode className='w-10 h-auto' />
                    </a>
                  )}
                </div>
              </div>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + 'px',
          }}
          className='hidden md:block absolute md:left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] '
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className='absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full'
          />
        </div>
      </div>
    </div>
  );
};
