import gsap from 'gsap';
import { FC } from 'react';
import { useSettingStore } from '../../app/stores/settingStore';
import { useCameraStore } from '../../app/stores/cameraStore';

interface indexProps {
  rightDrawerRef: React.RefObject<HTMLDivElement>;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
}

const RightDrawer: FC<indexProps> = ({ rightDrawerRef, setCurrentStage }) => {
  const setRightDrawerToggle = useSettingStore((s) => s.setRightDrawerToggle);
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
                  y: window.scrollY + scrollAmount + 200,
                },
                ease: 'power2.out',
              });
            }}
            className='cursor-pointer'
          >
            Work
          </li>
          <li className='cursor-pointer'>Contact me</li>
        </ul>
      </div>
    </div>
  );
};

export default RightDrawer;
