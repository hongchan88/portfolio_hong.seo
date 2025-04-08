import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';

type ModelProps = {
  url: string;
};

export function Model({ url }: ModelProps) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene, animations, materials } = useGLTF(url);
  const { actions } = useAnimations(animations, modelRef);
  const { gl } = useThree();

  const fps = 30; // Frames per second
  const scrollSpeed = 0.1; // Scroll speed
  const materialName = 'Material.002'; // Example user material name

  // Pre-1100 frame ranges
  const scrollFrameRanges = [
    { start: 220, end: 241 },
    { start: 485, end: 558 },
    { start: 680, end: 705 },
    { start: 968, end: 1054 },
  ];

  // After 1100, repeat intervals every 600 frames
  const repeatedIntervals = [
    { start: 80, end: 105 },
    { start: 368, end: 454 },
  ];
  const repeatCycle = 494;

  // 1) On mount, load & apply baked shadow to plane named "plane"
  useEffect(() => {
    if (!scene) return;

    // Delay to ensure the scene is fully loaded
    const loader = new THREE.TextureLoader();
    // Replace with your actual baked shadow PNG path
    const shadowTexture = loader.load(
      '/models/wallShadow10_transBG.png',
      (texture) => {
        texture.flipY = false; // Fix upside-down issue
        texture.needsUpdate = true;
      }
    );
    const groundShadow = loader.load(
      '/models/floor_shadow_transparentBG.png',
      (texture) => {
        texture.flipY = false; // Fix upside-down issue
        texture.needsUpdate = true;
      }
    );

    setTimeout(() => {
      scene.traverse((child) => {
        // Replace 'plane' with the exact name in your GLB
        if (child.isMesh && child.name === 'wall') {
          console.log(`Applying baked shadow to: ${child.name}`);

          child.material = new THREE.MeshStandardMaterial({
            map: shadowTexture,
            transparent: true, // Enable transparency
            opacity: 0.5, // Fully visible texture
            depthWrite: false, // Prevents z-fighting issues
          });

          // Boost the shadow contrast and opacity
          // child.material.color.setRGB(0, 0, 0); // Darken the shadow
          // child.material.color.multiplyScalar(1); // Increase shadow intensity

          child.material.needsUpdate = true;
        }
        if (child.isMesh && child.name === 'ground') {
          console.log(`Applying baked shadow to: ${child.name}`);
          child.material = new THREE.MeshStandardMaterial({
            map: groundShadow,
            transparent: true, // Enable transparency
            opacity: 0.5, // Fully visible texture
            depthWrite: false, // Prevents z-fighting issues
          });

          // Boost the shadow contrast and opacity
          // child.material.color.setRGB(0, 0, 0); // Darken the shadow
          // child.material.color.multiplyScalar(1); // Increase shadow intensity

          child.material.needsUpdate = true;
        }
      });
    }, 1500);

    // Force a re-render if needed
    // gl.render(scene, (gl as any).camera);
  }, [scene, gl]);

  // 2) Existing frame-based logic for "Material.002"
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const currentFrame = Math.floor(time * fps);
    const material = materials[materialName];
    if (!material?.map) return;

    if (currentFrame <= 1094) {
      const shouldScroll = scrollFrameRanges.some(
        ({ start, end }) => currentFrame >= start && currentFrame <= end
      );
      if (shouldScroll) {
        material.map.offset.y += scrollSpeed / fps;
      }
    } else {
      const offset = (currentFrame - 1094) % repeatCycle;
      const shouldScroll = repeatedIntervals.some(
        ({ start, end }) => offset >= start && offset <= end
      );
      if (shouldScroll) {
        material.map.offset.y += scrollSpeed / fps;
      }
    }
    material.map.needsUpdate = true;
  });

  // 3) Existing delayed animations
  useEffect(() => {
    const environmentAction = actions['Action'];
    const chairAction = actions['Action.005'];
    const carpetAction = actions['Action.004'];
    const tableAction = actions['table'];

    const playAction = (action: THREE.AnimationAction | undefined) => {
      if (action) {
        action.reset().setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      } else {
        console.warn('Animation not found.');
      }
    };

    const firstPopAnimation = setTimeout(
      () => {
        playAction(environmentAction);
        playAction(chairAction);
        playAction(carpetAction);
      },
      (10 / fps) * 1000
    );

    const secondPopAnimation = setTimeout(
      () => {
        playAction(tableAction);
      },
      (15 / fps) * 1000
    );

    return () => {
      clearTimeout(firstPopAnimation);
      clearTimeout(secondPopAnimation);
    };
  }, [actions]);

  return <primitive ref={modelRef} object={scene} dispose={null} />;
}

export function CameraController() {
  const { camera } = useThree();
  const { cx, cy, cz } = useControls('Camera Transform', {
    cx: { value: 12, step: 1 },
    cy: { value: 7, step: 1 },
    cz: { value: -7, step: 1 },
  });

  useFrame(() => {
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
