'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
// Import your existing components
import Avatar from '../Avatar';
import { Model } from '../EnvironmentModel';

export default function ModelViewer({ currentStage }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ width: '100vw', height: '200vh' }}>
      {/* ✅ First 100vh Section (Light Green) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          // backgroundColor: 'rgba(177,204,112,0.2)', // Light green
          background:
            'linear-gradient(to bottom, rgba(177,204,112,0.2) 50%, blue 50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <Canvas
          shadows
          // camera={{ position: [9, 5, 8], fov: 50 }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <CameraController />
          <Suspense fallback={null}>
            {/* <TiltedScene> */}
            <group position={[3, 2, 0]} rotation={[0, 4.6, 0]}>
              <Model url='/models/environment_58.glb' />
              <Avatar currentStage={currentStage} />
            </group>
            {/* </TiltedScene> */}
          </Suspense>

          <Environment
            files='/textures/brown_photostudio_02_4k.exr'
            background={false}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>
      {/* ✅ Second 100vh Section (Blue)
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: 'blue',
        }}
      ></div> */}
    </div>
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
    zoom: { value: 55, min: 10, max: 100, step: 1 }, // Add zoom control here
  });

  useFrame(() => {
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);
    // console.log('Actual camera position:', camera.position);

    // Update FOV if it changed
    if (camera.fov !== zoom) {
      camera.fov = zoom;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

// ✅ Tilt the Entire 3D Scene When Moving Mouse Over It
function TiltedScene({ children }) {
  const sceneRef = useRef(null);
  const { viewport } = useThree();

  // Store target rotation (this updates instantly)
  const targetRotation = useRef({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    if (!sceneRef.current) return;

    // Convert mouse position to small range (-0.5 to 0.5)
    const mouseX = (event.pointer.x / viewport.width) * 20; // Smaller movement range
    const mouseY = (event.pointer.y / viewport.height) * 20;

    // Set target rotation instead of changing instantly
    targetRotation.current.x = mouseY * 0.5;
    targetRotation.current.y = mouseX * 0.5;
  };

  useFrame(() => {
    if (!sceneRef.current) return;

    // Smoothly interpolate towards the target rotation
    sceneRef.current.position.x = THREE.MathUtils.lerp(
      sceneRef.current.position.x,
      targetRotation.current.x,
      0.02 // Lower value makes movement slower
    );
    sceneRef.current.position.y = THREE.MathUtils.lerp(
      sceneRef.current.position.y,
      targetRotation.current.y,
      0.02
    );
  });

  return (
    <group ref={sceneRef} onPointerMove={handlePointerMove}>
      {children}
    </group>
  );
}
