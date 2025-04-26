import { FC, useRef } from 'react';
import { useAudioStore } from '../../app/stores/audioStore';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';
import { useSettingStore } from '../../app/stores/settingStore';
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useCameraStore } from '../../app/stores/cameraStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface indexProps {
  closeDrawer: () => void;
  currentStage: number;
}

const NavBar: FC<indexProps> = ({ closeDrawer, currentStage }) => {
  const { toggleAudio, audioToggleState, audioRefs, playAudioForStage } =
    useAudioStore();
  const rightDrawerToggle = useSettingStore((s) => s.rightDrawerToggle);
  const setRightDrawerToggle = useSettingStore((s) => s.setRightDrawerToggle);
  const setFirstMenuCamera = useCameraStore((s) => s.setFirstMenuCameraPos);
  const setSecondMenuCamera = useCameraStore((s) => s.setSecondMenuCameraPos);
  const navMainRef = useRef(null);
  useGSAP(
    () => {
      gsap.fromTo(
        navMainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power1.out' }
      );
    },
    { scope: navMainRef }
  );
  return (
    <div ref={navMainRef} className='fixed top-0 w-full z-30 '>
      <div className='flex w-full justify-between p-10'>
        <div className='w-12 h-12'>
          <img src='./loading/loading2.png' />
        </div>
        <div className='flex gap-5  '>
          <div
            className=' cursor-pointer'
            title='Music from #Uppbeat (free for Creators!):
https://uppbeat.io/t/hybridas/lazy-sunday
License code: 6IRKHLAO88BY9C1L'
            onClick={() => {
              toggleAudio();
            }}
          >
            <div
              className={`w-10 h-10 ${
                audioToggleState ? 'bg-yellow-500' : 'bg-gray-500'
              } rounded-lg flex justify-center items-center transition-transform duration-300 hover:scale-110`}
            >
              {audioToggleState ? (
                <HiOutlineSpeakerWave className='text-white text-4xl' />
              ) : (
                <HiOutlineSpeakerXMark className='text-white text-4xl' />
              )}
            </div>
          </div>
          <div
            className=' cursor-pointer transition-transform duration-300 hover:scale-110'
            onClick={() => {
              if (rightDrawerToggle) {
                closeDrawer();
              } else {
                setRightDrawerToggle(true);
                if (currentStage === 0) {
                  setFirstMenuCamera();
                } else {
                  setSecondMenuCamera();
                }
              }
              if (audioToggleState) {
                audioRefs['clickMenuAudio'].play();
              }
            }}
          >
            <div className='w-10 h-10 bg-yellow-500 rounded-lg flex justify-center items-center'>
              {!rightDrawerToggle ? (
                <IoMenu className='text-white text-4xl' />
              ) : (
                <RxCross2 className='text-white text-4xl' />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
