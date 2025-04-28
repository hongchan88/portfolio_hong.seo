'use client';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
// Import your existing components
import Avatar from '../Avatar';
import { Model } from '../EnvironmentModel';
import TiltedScene from '../TiltScene/TiltedScene';
import CameraController from '../CameraController/CameraController';
import { useSettingStore } from '../../app/stores/settingStore';
import { MusicNoteAnimation } from '../MusicNoteAnimation';
export default function ModelViewer() {
  const currentStage = useSettingStore((s) => s.currentStage);
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);

  // const handlePointerDown = (e: any) => {
  //   // e.stopPropagation();
  //   if (e?.object?.userData?.clickable) {
  //     console.log('🎯 Speaker clicked!');
  //   }
  // };
  // const handlePointerOver = (e: any) => {
  //   if (e?.object?.userData?.clickable) {
  //     document.body.style.cursor = 'pointer';
  //   }
  // };
  // const handlePointerOut = (e: any) => {
  //   document.body.style.cursor = 'default';
  // };

  return (
    <>
      <div style={{ width: '100vw', height: '204vh' }}>
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
        ></div>

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
              className={`${
                !isLoadingDone ? 'invisible opacity-0' : 'opacity-100'
              } transition-opacity duration-700`}
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
                    url='/models/environment_final2.glb'
                    currentStage={currentStage}
                    isLoadingDone={isLoadingDone}
                  />
                  <Avatar
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
