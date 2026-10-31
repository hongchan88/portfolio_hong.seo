import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { projectsData } from '../app/data/data';
import { useSettingStore } from '../app/stores/settingStore';
import Biography from './Biography';
import Footer from './Footer';
import { prepareSceneRetry } from './sceneAssets';

export default function BasicPortfolio({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const sceneError = useSettingStore((s) => s.sceneError);
  const resetScene = useSettingStore((s) => s.resetScene);
  const active = useProgress((s) => s.active);
  const [retryPending, setRetryPending] = useState(false);
  const retryRequested = useRef(false);
  useEffect(() => () => { retryRequested.current = false; }, []);
  useEffect(() => {
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      retryRequested.current = false;
      setRetryPending(false);
      return;
    }
    // Cache invalidation cannot cancel abandoned requests. Wait until their
    // errors have landed before clearing exact keys and mounting one new scene.
    if (!retryPending || !retryRequested.current || active || useProgress.getState().active) return;
    retryRequested.current = false;
    setRetryPending(false);
    window.scrollTo(0, 0);
    prepareSceneRetry();
    resetScene();
  }, [active, reducedMotion, retryPending, resetScene]);
  useEffect(() => {
    window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, []);
  return (
    <>
      <main
        className='max-w-6xl mx-auto px-6 py-10 space-y-12'
        data-mode='basic'
      >
        <header className='space-y-6'>
          <h1 ref={heading} tabIndex={-1} className='text-5xl font-bold'>
            Hong Seo
          </h1>
          {sceneError && (
            <p role='status'>
              The 3D scene is unavailable. You can explore the full portfolio
              below.
            </p>
          )}
          <nav
            aria-label='Portfolio'
            className='flex flex-wrap gap-6 underline'
          >
            <a href='#biography-heading'>About me</a>
            <a href='#projects'>Work</a>
            <Link href='/contact'>Contact</Link>
          </nav>
          {!reducedMotion && (
            <button
              className='border rounded px-4 py-2'
              disabled={retryPending}
              onClick={() => {
                if (retryRequested.current || reducedMotion) return;
                retryRequested.current = true;
                setRetryPending(true);
              }}
            >
              View animated version
            </button>
          )}
          {retryPending && (
            <p role='status'>Waiting for previous scene requests to finish before retrying.</p>
          )}
        </header>
        <Biography />
        <section
          id='projects'
          aria-labelledby='projects-heading'
          className='space-y-12'
        >
          <h2 id='projects-heading' className='text-3xl font-bold'>
            Some things I’ve worked on
          </h2>
          {projectsData.map((project) => (
            <article
              key={project.title}
              data-project={project.title.trim()}
              className='space-y-4 border-t pt-8'
            >
              <h3 className='text-2xl font-bold'>{project.title}</h3>
              <p>{project.timelineYear}</p>
              {project.description}
              <p>
                <strong>Tech Stack Used: </strong>
                {project.stacks.join(', ')}
              </p>
              <div className='flex gap-6 underline'>
                {project.live && (
                  <a
                    href={project.live}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Visit {project.title}
                  </a>
                )}
                {project.git && (
                  <a
                    href={project.git}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {project.title} source on GitHub
                  </a>
                )}
                {project.leetcode && (
                  <a
                    href={project.leetcode}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Hong Seo on LeetCode
                  </a>
                )}
              </div>
              <div className='grid md:grid-cols-2 gap-4'>
                {project.imgUrl.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    loading='lazy'
                    alt={`${project.title.trim()} screenshot ${index + 1}`}
                    width={500}
                    height={500}
                    className='w-full h-auto rounded-lg'
                  />
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
