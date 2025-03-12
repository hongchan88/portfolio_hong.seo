'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
// Import your existing components
import Avatar from '../Avatar';
import { Model } from '../EnvironmentModel';

export default function ModelViewer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Leva controls for Avatar
  // const { x, y, z, rx, ry, rz } = useControls('Avatar Transform', {
  //   x: { value: -2, step: 1 },
  //   y: { value: -7, step: 1 },
  //   z: { value: 2, step: 1 },
  //   rx: { value: 11, step: 1 },
  //   ry: { value: 0, step: 1 },
  //   rz: { value: 61, step: 1 },
  // });

  if (!isClient) return null;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [9, 5, 8], fov: 50 }}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(177,204,112,0.2)',
        }}
      >
        {/* ✅ Leva-driven camera */}
        <CameraController />

        <Suspense fallback={null}>
          {/* ✅ Group that tilts when mouse moves over the 3D scene */}
          <TiltedScene>
            <group position={[3, 0, 0]} rotation={[0, 4.6, 0]}>
              <Model url='/models/environment_49.glb' />
              <Avatar
              // position={[x, y, z]}
              // rotation={[rx, ry, rz]}
              // scale={[9, 9, 9]}
              />
            </group>
          </TiltedScene>
        </Suspense>

        {/* ✅ Environment HDRI */}
        <Environment
          files='/textures/brown_photostudio_02_4k.exr'
          background={false}
        />

        {/* ✅ OrbitControls (Can be adjusted if needed) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

// ✅ Camera Controller (Leva for dynamic movement)
function CameraController() {
  const { camera } = useThree();
  const { cx, cy, cz } = useControls('Camera Position', {
    cx: { value: 9, step: 1 },
    cy: { value: 5, step: 1 },
    cz: { value: 8, step: 1 },
  });

  useFrame(() => {
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);
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
