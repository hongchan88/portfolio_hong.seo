import gsap from 'gsap';
import { FC, useEffect, useLayoutEffect } from 'react';
import { useSettingStore } from '../../app/stores/settingStore';
import { useCameraStore } from '../../app/stores/cameraStore';
import { FaLinkedin } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';

interface indexProps {
  closeDrawer: () => void;
  rightDrawerRef: React.RefObject<HTMLDivElement>;
  leftText: React.RefObject<HTMLDivElement>;
  animatingRef: React.RefObject<Boolean>;
  aboutSectionRef: React.RefObject<HTMLDivElement>;
}

const RightDrawer: FC<indexProps> = ({
  closeDrawer,
  rightDrawerRef,
  leftText,
  animatingRef,
  aboutSectionRef,
}) => {
  const { setRightDrawerToggle, currentStage, amountOfScrollingInStage2 } =
    useSettingStore();
  const setCurrentStage = useSettingStore((s) => s.setCurrentStage);
  const rightDrawerToggle = useSettingStore((s) => s.rightDrawerToggle);

  const setCameraDefault = useCameraStore((s) => s.setDefault);
  const isMobile = useSettingStore((s) => s.isMobile);
  const setMobileDefault = useCameraStore((s) => s.setMobileDefault);
  useEffect(() => {
    if (!rightDrawerToggle) return;
    const trigger = document.activeElement as HTMLElement;
    const drawer = rightDrawerRef.current;
    if (drawer) drawer.scrollTop = 0;
    drawer
      ?.querySelector<HTMLButtonElement>('button')
      ?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
      }
      if (event.key !== 'Tab' || !drawer) return;
      const controls = Array.from(
        drawer.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [rightDrawerToggle]);
  const { contextSafe } = useGSAP({ scope: rightDrawerRef });
  const playBubbleCover = contextSafe(() => {
    const wrapper = document.getElementById('bubbleOverlayWrapper');
    const circle = document.getElementById('bubbleCircle');

    if (!wrapper || !circle) return;

    const tl = gsap.timeline();

    // Show wrapper
    tl.set(wrapper, { opacity: 1, pointerEvents: 'auto' });

    // Expand the circle to cover the whole screen
    tl.to(circle, {
      duration: 1.3,
      attr: {
        r: 180, // large enough to cover the screen from bottom-left
      },
      ease: 'power2.out',
    });

    // Optional pause or do something here (e.g. loading...)

    // Shrink the circle back
    tl.to(circle, {
      duration: 0.9,
      attr: {
        r: 0,
      },
      ease: 'power2.in',
      delay: 0.4,
    });

    // Hide wrapper again
    tl.set(wrapper, { opacity: 0, pointerEvents: 'none' });
  });

  // Restore original styles only when this owner unmounts.
  useGSAP(() => {
    gsap.set(rightDrawerRef.current, { right: '-100%' });
    gsap.set(leftText.current, { left: '5%' });
    gsap.set(aboutSectionRef.current, { left: 0 });
  });

  useLayoutEffect(
    () => {
      if (
        !rightDrawerToggle &&
        !(currentStage === 0 ? leftText.current : aboutSectionRef.current)
      )
        return;
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power1.inOut' },
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      if (currentStage === 0 && rightDrawerToggle) {
        tl.to(rightDrawerRef.current, { right: 0 }).to(
          leftText.current,
          { left: '-100%' },
          '<'
        );
      } else if (currentStage === 0) {
        tl.to(rightDrawerRef.current, { right: '-100%' }).to(
          leftText.current,
          { left: '5%' },
          '<'
        );
      }

      if (currentStage === 1 && rightDrawerToggle) {
        tl.to(rightDrawerRef.current, { right: 0 }).to(
          aboutSectionRef.current,
          { left: '-100%' },
          '<'
        );
      } else if (currentStage === 1) {
        tl.to(rightDrawerRef.current, { right: '-100%' }).to(
          aboutSectionRef.current,
          { left: '0' },
          '<'
        );
      }
      // One owner for drawer position and text, including interrupted closes.
      return () => { tl.kill(); };
    },
    [currentStage, rightDrawerToggle]
  );
  return (
    <div
      id='navigation-drawer'
      role='dialog'
      aria-label='Navigation'
      aria-modal={rightDrawerToggle ? true : undefined}
      aria-hidden={!rightDrawerToggle}
      inert={!rightDrawerToggle}
      style={{ right: '-100%' }}
      ref={rightDrawerRef}
      className={`fixed top-0 h-full overflow-y-auto overscroll-contain md:w-80 w-full bg-white z-40 ${'opacity-95'}`}
    >
      <div className='w-full min-h-full py-6 flex justify-center items-center'>
        <ul className='font-mono font-bold text-2xl flex flex-col gap-10'>
          <li>
            <button type='button' aria-label='Close menu' onClick={closeDrawer}>
              Close ×
            </button>
          </li>
          {currentStage === 0 ? (
            <li className='cursor-pointer '>
              <div className='flex items-center gap-5'>
                <div className='w-2 h-2 bg-red-500 rounded-full'></div>

                <p className='text-gray-500 '>Main</p>
              </div>
            </li>
          ) : (
            <li>
              <button
                type='button'
                onClick={contextSafe(() => {
                  playBubbleCover();
                  setRightDrawerToggle(false);
                  if (isMobile) {
                    setMobileDefault();
                  } else {
                    setCameraDefault();
                  }
                  setCurrentStage(0);
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                      y: 0,
                    },
                    ease: 'power2.out',
                  });
                })}
                className='cursor-pointer'
              >
                Main
              </button>
            </li>
          )}
          {currentStage === 1 ? (
            <li className='cursor-pointer '>
              <div className='flex items-center gap-5'>
                <div className='w-2 h-2 bg-red-500 rounded-full'></div>

                <p className='text-gray-500 '>About me</p>
              </div>
            </li>
          ) : (
            <li>
              <button
                type='button'
                onClick={contextSafe(() => {
                  playBubbleCover();
                  setRightDrawerToggle(false);
                  if (isMobile) {
                    setMobileDefault();
                  } else {
                    setCameraDefault();
                  }
                  setCurrentStage(1);
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                      y: 200,
                    },
                    ease: 'power2.out',
                  });
                })}
                className='cursor-pointer'
              >
                About me
              </button>
            </li>
          )}
          <li>
            <button
              type='button'
              onClick={contextSafe(() => {
                document.body.style.overflow = '';
                playBubbleCover();
                setRightDrawerToggle(false);
                if (isMobile) {
                  setMobileDefault();
                } else {
                  setCameraDefault();
                }
                setCurrentStage(1);
                const scrollAmount = window.innerHeight * 2; // 200vh
                gsap.to(window, {
                  duration: 1,
                  onComplete: () =>
                    document
                      .getElementById('projects-heading')
                      ?.focus({ preventScroll: true }),
                  scrollTo: {
                    y: `${
                      currentStage === 0
                        ? window.scrollY + scrollAmount + (isMobile ? 500 : 300)
                        : scrollAmount +
                          window.scrollY +
                          (isMobile ? 400 : 300) -
                          amountOfScrollingInStage2
                    }`,
                  },
                  ease: 'power2.out',
                });
              })}
              className='cursor-pointer'
            >
              Work
            </button>
          </li>
          <li>
            <Link href='/contact' onClick={() => setRightDrawerToggle(false)}>
              Contact
            </Link>
          </li>
          <li>
            <div className='flex gap-5 '>
              <span className=' cursor-pointer'>
                <Link
                  aria-label='Hong Seo on LinkedIn'
                  href='https://www.linkedin.com/in/hong-seo/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaLinkedin />
                </Link>
              </span>

              <span className=' cursor-pointer'>
                <Link
                  aria-label='Hong Seo on GitHub'
                  href='https://github.com/hongchan88'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaGithub />
                </Link>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightDrawer;
