'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
// Import your existing components
import Avatar from '../Avatar';
import { Model } from '../EnvironmentModel';
import TiltedScene from '../TiltScene/TiltedScene';
import CameraController from '../CameraController/CameraController';
import { useSettingStore } from '../../app/stores/settingStore';
import { MusicNoteAnimation } from '../MusicNoteAnimation';

const ENVIRONMENT_MODEL_GLB = '/models/environmentModel.glb';
const AVATAR_MODEL_GLB = '/models/avartarModel.glb';

export default function ModelViewer({
  leftTextRef,
  aboutSectionRef,
  aboutImgRef,
}) {
  const currentStage = useSettingStore((s) => s.currentStage);
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleLost = (e) => {
      e.preventDefault();
      console.warn('WebGL context lost');
      window.location.reload(); // refreshes the page
    };
    const handleRestore = () => {
      console.log('WebGL context restored');
    };

    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestore);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestore);
    };
  }, []);

  return (
    <>
      <div className='w-full h-full'>
        {' '}
        <div
          ref={aboutSectionRef}
          className='absolute top-2/3 left-0 w-full z-20 opacity-0 pointer-events-none'
        >
          <img
            ref={aboutImgRef}
            src='/aboutme/aboutmeFill.png'
            alt='About Me'
            className='md:w-2/5 w-full h-auto'
          />
        </div>
        {/* ✅ Background Image (behind the canvas) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${currentStage === 0 ? '50%' : '50%'}`,
            background:
              'linear-gradient(140deg, rgba(19, 43, 101, 1) 50%, rgba(24, 75, 146, 1) 78%, rgba(39, 93, 137, 1) 99%)',

            zIndex: 1,
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            top: 0,
            width: '100%',
            height: `${currentStage === 0 ? '50%' : '50%'}`,
            background: 'linear-gradient(to bottom, rgba(177,204,112,0.2) 50%)',
            zIndex: 1,
          }}
        >
          {' '}
          <div
            ref={leftTextRef}
            className='absolute font-bold top-[30vh] left-[5%] w-full h-full z-10 pointer-events-none'
          >
            <div className='flex flex-col gap-5'>
              <p className='font-rubik font-bold md:text-5xl text-2xl leading-relaxed'>
                Hey,
                <br /> My name is Hong.
              </p>
            </div>
          </div>
        </div>
        {/* ✅ Canvas Container */}
        <div
          style={{
            width: '100%',
            height: '100%',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10, // 👈 Higher than background image
          }}
        >
          <Suspense fallback={null}>
            <Canvas
              onTouchStart={(e) => e.preventDefault()}
              ref={canvasRef}
              className={`${
                !isLoadingDone ? 'invisible opacity-0' : 'opacity-100'
              } transition-opacity duration-700 `}
              shadows
              style={{
                width: '100%',
                height: '100%',
              }}
              // onPointerDown={handlePointerDown}
              // onPointerOver={handlePointerOver}
              // onPointerOut={handlePointerOut}
            >
              <TiltedScene>
                <MusicNoteAnimation />
                <CameraController />
                <group position={[3, 1, -3]} rotation={[0, 4.6, 0]}>
                  <Model
                    url={ENVIRONMENT_MODEL_GLB}
                    currentStage={currentStage}
                    isLoadingDone={isLoadingDone}
                  />
                  <Avatar
                    url={AVATAR_MODEL_GLB}
                    currentStage={currentStage}
                    isLoadingDone={isLoadingDone}
                  />
                </group>
                {/* <Environment
              files='/textures/brown_photostudio_02_4k.exr'
              background={false}
              /> */}
                {/* <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                onChange={(e) => {
                const cam = e.target.object;
                setCamPos([cam.position.x, cam.position.y, cam.position.z]);
                setZoom(cam.zoom);
                setCamRotatePos([
                  cam.rotation.x,
                  cam.rotation.y,
                  cam.rotation.z,
                ]);
                }}
              /> */}
              </TiltedScene>
            </Canvas>
          </Suspense>
        </div>
      </div>
    </>
  );
}

// ✅ Tilt the Entire 3D Scene When Moving Mouse Over It
