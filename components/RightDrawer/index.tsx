import gsap from 'gsap';
import { FC } from 'react';
import { useSettingStore } from '../../app/stores/settingStore';
import { useCameraStore } from '../../app/stores/cameraStore';
import { FaLinkedin } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';

interface indexProps {
  rightDrawerRef: React.RefObject<HTMLDivElement>;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
  leftText: React.RefObject<HTMLDivElement>;
  animatingRef: React.RefObject<Boolean>;
  aboutSectionRef: React.RefObject<HTMLDivElement>;
}

const RightDrawer: FC<indexProps> = ({
  rightDrawerRef,
  setCurrentStage,
  leftText,
  animatingRef,
  aboutSectionRef,
}) => {
  const { setRightDrawerToggle, currentStage, amountOfScrollingInStage2 } =
    useSettingStore();
  const rightDrawerToggle = useSettingStore((s) => s.rightDrawerToggle);

  const setCameraDefault = useCameraStore((s) => s.setDefault);

  const playBubbleCover = () => {
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
  };

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
    },
    {
      dependencies: [currentStage, rightDrawerToggle],
    }
  );
  return (
    <div
      ref={rightDrawerRef}
      className={`fixed top-0 h-full md:w-80 w-full bg-white z-10 ${'opacity-95'}`}
    >
      <div className='w-full h-full flex justify-center items-center'>
        <ul className='font-mono font-bold text-2xl flex flex-col gap-10'>
          {currentStage === 0 ? (
            <li className='cursor-pointer '>
              <div className='flex items-center gap-5'>
                <div className='w-2 h-2 bg-red-500 rounded-full'></div>

                <p className='text-gray-500 '>Main</p>
              </div>
            </li>
          ) : (
            <li
              onClick={() => {
                playBubbleCover();
                setRightDrawerToggle(false);
                setCameraDefault();
                setCurrentStage(0);
                gsap.to(window, {
                  duration: 1,
                  scrollTo: {
                    y: 0,
                  },
                  ease: 'power2.out',
                });
              }}
              className='cursor-pointer'
            >
              Main
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
            <li
              onClick={() => {
                playBubbleCover();
                setRightDrawerToggle(false);
                setCameraDefault();
                setCurrentStage(1);
                gsap.to(window, {
                  duration: 1,
                  scrollTo: {
                    y: window.scrollY + 200,
                  },
                  ease: 'power2.out',
                });
              }}
              className='cursor-pointer'
            >
              About me
            </li>
          )}
          <li
            onClick={() => {
              document.body.style.overflow = '';
              playBubbleCover();
              setRightDrawerToggle(false);
              setCameraDefault();
              setCurrentStage(1);
              const scrollAmount = window.innerHeight * 2; // 200vh
              gsap.to(window, {
                duration: 1,
                scrollTo: {
                  y: `${
                    currentStage === 0
                      ? window.scrollY + scrollAmount + 300
                      : scrollAmount +
                        window.scrollY +
                        300 -
                        amountOfScrollingInStage2
                  }`,
                },
                ease: 'power2.out',
              });
            }}
            className='cursor-pointer'
          >
            Work
          </li>
          {/* <li className='cursor-pointer'>Contact me</li> */}
          <li>
            <div className='flex gap-5 '>
              <span className=' cursor-pointer'>
                <Link
                  href='https://www.linkedin.com/in/hong-seo/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaLinkedin />
                </Link>
              </span>

              <span className=' cursor-pointer'>
                <Link
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
