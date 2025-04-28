import gsap from 'gsap';
import { FC } from 'react';
import { useSettingStore } from '../../app/stores/settingStore';
import { useCameraStore } from '../../app/stores/cameraStore';
import { FaLinkedin } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';

interface indexProps {
  rightDrawerRef: React.RefObject<HTMLDivElement>;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
}

const RightDrawer: FC<indexProps> = ({ rightDrawerRef, setCurrentStage }) => {
  const { setRightDrawerToggle, currentStage, amountOfScrollingInStage2 } =
    useSettingStore();
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
  return (
    <div
      ref={rightDrawerRef}
      className='fixed top-0 -right-80 h-full w-80 bg-white z-10'
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
