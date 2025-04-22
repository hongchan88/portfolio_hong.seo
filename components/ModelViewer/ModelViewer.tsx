'use client';
import { useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
// Import your existing components
import Avatar from '../Avatar';
import { Model } from '../EnvironmentModel';
import { useControls } from 'leva';
import * as THREE from 'three';
export default function ModelViewer({ currentStage, isPlaying }) {
  const [isScrollingScreen, setScrollingScreen] = useState(false);

  return (
    <>
      <div style={{ width: '100vw', height: '202vh' }}>
        {/* ✅ Background Image (behind the canvas) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${currentStage === 0 ? '50%' : '52%'}`,
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
            height: `${currentStage === 0 ? '50%' : '48%'}`,
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
                !isPlaying ? 'invisible opacity-0' : 'opacity-100'
              } transition-opacity duration-700`}
              shadows
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <CameraController />
              <group position={[3, 1, -3]} rotation={[0, 4.6, 0]}>
                <Model
                  url='/models/environment_combine_108.glb'
                  currentStage={currentStage}
                  isScrollingScreen={isScrollingScreen}
                  isPlaying={isPlaying}
                />
                <Avatar
                  currentStage={currentStage}
                  setScrollingScreen={setScrollingScreen}
                  isPlaying={isPlaying}
                />
              </group>
              {/* <Environment
              files='/textures/brown_photostudio_02_4k.exr'
              background={false}
              /> */}
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </>
  );
}

// ✅ Camera Controller (Leva for dynamic movement)
function CameraController() {
  const { camera } = useThree();

  // Destructure zoom (FOV) along with camera position
  const { cx, cy, cz, zoom } = useControls('Camera Position', {
    cx: { value: 10, step: 1 },
    cy: { value: 5, step: 1 },
    cz: { value: 14, step: 1 },
    zoom: { value: 70, min: 10, max: 100, step: 1 }, // Add zoom control here
  });

  useFrame(() => {
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);
    // console.log('Actual camera position:', camera.position);
    if (camera instanceof THREE.PerspectiveCamera) {
      // Update FOV if it changed
      if (camera.fov !== zoom) {
        camera.fov = zoom;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}

// ✅ Tilt the Entire 3D Scene When Moving Mouse Over It
// function TiltedScene({ children }) {
//   const sceneRef = useRef(null);
//   const { viewport } = useThree();

//   // Store target rotation (this updates instantly)
//   const targetRotation = useRef({ x: 0, y: 0 });

//   const handlePointerMove = (event) => {
//     if (!sceneRef.current) return;

//     // Convert mouse position to small range (-0.5 to 0.5)
//     const mouseX = (event.pointer.x / viewport.width) * 20; // Smaller movement range
//     const mouseY = (event.pointer.y / viewport.height) * 20;

//     // Set target rotation instead of changing instantly
//     targetRotation.current.x = mouseY * 0.5;
//     targetRotation.current.y = mouseX * 0.5;
//   };

//   useFrame(() => {
//     if (!sceneRef.current) return;

//     // Smoothly interpolate towards the target rotation
//     sceneRef.current.position.x = THREE.MathUtils.lerp(
//       sceneRef.current.position.x,
//       targetRotation.current.x,
//       0.02 // Lower value makes movement slower
//     );
//     sceneRef.current.position.y = THREE.MathUtils.lerp(
//       sceneRef.current.position.y,
//       targetRotation.current.y,
//       0.02
//     );
//   });

//   return (
//     <group ref={sceneRef} onPointerMove={handlePointerMove}>
//       {children}
//     </group>
//   );
// }
function LoadingIndicator() {
  return (
    <div className='fixed top-0 left-0 w-full h-full z-50 bg-red-500'>
      {/* <div className='w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-4'></div>
      <p>Loading model...</p> */}
    </div>
  );
}
