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

import { ENVIRONMENT_MODEL_GLB, AVATAR_MODEL_GLB } from '../sceneAssets';

export default function ModelViewer({}) {
  const currentStage = useSettingStore((s) => s.currentStage);
  const isLoadingDone = useSettingStore((s) => s.isLoadingDone);
  const isMobile = useSettingStore((s) => s.isMobile);
  const canvasRef = useRef(null);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const probe = document.createElement('canvas');
    try {
      const context = probe.getContext('webgl2');
      if (!context) {
        useSettingStore.getState().enterBasicMode('WebGL unavailable');
        return;
      }
      context.getExtension('WEBGL_lose_context')?.loseContext();
      setSupported(true);
    } catch {
      useSettingStore.getState().enterBasicMode('WebGL unavailable');
    }
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleLost = (e) => {
      e.preventDefault();
      console.warn('WebGL context lost');
      useSettingStore.getState().enterBasicMode('WebGL context lost');
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
  }, [supported]);

  if (!supported) return null;
  return (
    <>
      <div className='w-full h-full'>
        <div
          style={{
            position: 'absolute',
            top: `${isMobile ? '102vh' : '102vh'}`,
            left: 0,
            width: '100%',
            height: `${isMobile ? 'calc(102vh + 200px)' : '50%'}`,
            background:
              'linear-gradient(140deg, rgba(19, 43, 101, 1) 50%, rgba(24, 75, 146, 1) 78%, rgba(39, 93, 137, 1) 99%)',

            zIndex: 1,
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: `${isMobile ? '102vh' : '50%'}`,
            background: 'linear-gradient(to bottom, rgba(177,204,112,0.2) 50%)',
            zIndex: 1,
          }}
        >
          {' '}
        </div>
        {/* ✅ Canvas Container */}
        <div
          style={{
            width: '100%',
            height: `${isMobile ? 'calc(204vh + 200px)' : '204vh'}`,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10, // 👈 Higher than background image
          }}
        >
          <Suspense fallback={null}>
            <Canvas
              fallback={<p>3D rendering unavailable. Use the basic version.</p>}
              onTouchStart={(e) => e.preventDefault()}
              ref={canvasRef}
              className={`${
                !isLoadingDone ? 'invisible opacity-0' : 'opacity-100'
              } transition-opacity duration-700 `}
              shadows
              style={{
                width: '100%',
                height: '100%',
                touchAction: 'pan-y',
              }}
              // onPointerDown={handlePointerDown}
              // onPointerOver={handlePointerOver}
              // onPointerOut={handlePointerOut}
            >
              <Suspense fallback={null}>
              <TiltedScene>
                <CameraController />
                <MusicNoteAnimation />
                <group
                  position={isMobile ? [1, 4.8, -2] : [3, 1, -3]}
                  rotation={isMobile ? [0.2, 4.6, 0.07] : [0, 4.6, 0]}
                >
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
                {/* <CameraViewSaver /> */}
                {/* <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  enableRotate={false}
                  onChange={(e) => {
                    const cam = e.target.object;
                    console.log(cam, 'position');
                    // setCamPos([cam.position.x, cam.position.y, cam.position.z]);
                    // setZoom(cam.zoom);
                    // setCamRotatePos([
                    //   cam.rotation.x,
                    //   cam.rotation.y,
                    //   cam.rotation.z,
                    // ]);
                  }}
                /> */}
              </TiltedScene>
              <SceneReady />
              </Suspense>
            </Canvas>
          </Suspense>
        </div>
      </div>
    </>
  );
}


function SceneReady() {
  useEffect(() => {
    useSettingStore.getState().setSceneReady(true);
    return () => useSettingStore.getState().setSceneReady(false);
  }, []);
  return null;
}
