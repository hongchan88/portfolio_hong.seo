import { useRefStore } from '@store/refsStore';
import { useSettingStore } from '@store/settingStore';
import NavBar from 'components/NavBar';
import RightDrawer from 'components/RightDrawer';
import { FC, RefObject, useEffect, useRef } from 'react';

interface HeroOverlaysProps {
  closeDrawer: () => void;
  animatingRef: RefObject<boolean>;
  leftText: RefObject<HTMLDivElement>;
}

const HeroOverlays: FC<HeroOverlaysProps> = ({
  closeDrawer,
  animatingRef,
  leftText,
}) => {
  const rightDrawerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef(null);
  const setRefs = useRefStore((s) => s.setRefs);
  const isNavBarHideen = useSettingStore((s) => s.isNavBarHideen);
  const currentStage = useSettingStore((s) => s.currentStage);
  useEffect(() => {
    setRefs({
      rightDrawerRef,
      aboutSectionRef,
    });
  }, [setRefs]);
  return (
    <div>
      {' '}
      {!isNavBarHideen ? (
        <div className='fixed bottom-3 left-5 z-50 flex justify-center items-center pointer-events-none animate-bounce '>
          <span
            className={` text-xs ${
              currentStage === 0 ? 'text-black' : ' text-white'
            }`}
          >
            [scroll to explore]
          </span>
        </div>
      ) : null}
      {!isNavBarHideen ? (
        <NavBar closeDrawer={closeDrawer} currentStage={currentStage} />
      ) : null}
      <RightDrawer
        rightDrawerRef={rightDrawerRef}
        leftText={leftText}
        animatingRef={animatingRef}
        aboutSectionRef={aboutSectionRef}
      />
    </div>
  );
};

export default HeroOverlays;
