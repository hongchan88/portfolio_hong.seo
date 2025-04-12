import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Avatar({ currentStage, setScrollingScreen }) {
  const groupRef = useRef();
  const [prevStage, setPrevStage] = useState(null);
  const isPlayingNextSection = useRef(false);
  const wireframeApplied = useRef(false);

  const { scene, animations } = useGLTF('/models/avatar_36.glb');
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (!actions || !groupRef.current) return;

    const bakedAction = actions['baked_final'];
    const typingAction = actions['typing3'];
    const nextSectionAction = actions['avatarModel'];

    if (!bakedAction || !typingAction || !nextSectionAction) return;

    const mixer = nextSectionAction.getMixer();
    let cleanup = () => {};

    const playInitialSequence = () => {
      bakedAction.reset().setLoop(THREE.LoopOnce, 1);
      bakedAction.clampWhenFinished = true;
      bakedAction.play();

      const handleFinish = () => {
        console.log('baked_final finished, starting typing3.');
        typingAction.syncWith(bakedAction);
        typingAction.reset().setLoop(THREE.LoopRepeat).play();
      };

      mixer.addEventListener('finished', handleFinish);
      cleanup = () => mixer.removeEventListener('finished', handleFinish);
    };

    const applyWireframe = () => {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = true;
          child.material.color.set('#ffffff'); // Optional: make lines white
        }
      });
    };

    const playNextSectionOnce = () => {
      console.log('Playing NextSection animation FORWARD.');
      bakedAction.stop();
      typingAction.stop();

      nextSectionAction.reset();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.timeScale = 1.5;
      nextSectionAction.play();

      isPlayingNextSection.current = true;
      wireframeApplied.current = false;

      const holdOnLastFrame = () => {
        console.log('NextSection finished. Holding final pose.');
        nextSectionAction.paused = true;
        isPlayingNextSection.current = false;
      };

      mixer.addEventListener('finished', holdOnLastFrame);
      cleanup = () => mixer.removeEventListener('finished', holdOnLastFrame);
    };

    const playNextSectionInReverse = () => {
      console.log('Playing NextSection animation BACKWARD.');
      nextSectionAction.stop();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.time = nextSectionAction.getClip().duration; // Start at end
      nextSectionAction.timeScale = -1;
      nextSectionAction.paused = false;
      nextSectionAction.play();

      const holdAtStart = () => {
        console.log('Reverse animation finished. Holding at start.');
        nextSectionAction.paused = true;
        isPlayingNextSection.current = false;
        wireframeApplied.current = false; // Reset for next time
        typingAction.play();
      };

      mixer.addEventListener('finished', holdAtStart);
      cleanup = () => mixer.removeEventListener('finished', holdAtStart);
    };

    // Detect transitions
    if (prevStage === 1 && currentStage === 0) {
      playNextSectionInReverse();
    } else if (currentStage === 0) {
      playInitialSequence();
    } else if (currentStage === 1 && prevStage === 0) {
      playNextSectionOnce();
    }

    setPrevStage(currentStage);
    return () => cleanup();
  }, [actions, currentStage, scene]);
  const calculateFrameToTriggerScrolling = () => {
    const typingAction = actions?.['typing3'];

    if (typingAction && typingAction.isRunning()) {
      const time = typingAction.time;
      const fps =
        typingAction.getClip().tracks[0]?.times?.length /
          typingAction.getClip().duration || 30;

      const currentFrame = Math.floor(time * fps);

      const isInScrollingRange =
        (currentFrame >= 25 && currentFrame <= 70) ||
        (currentFrame >= 287 && currentFrame <= 372) ||
        (currentFrame >= 475 && currentFrame <= 485);

      setScrollingScreen(isInScrollingRange); // 👈 toggle here
    } else {
      setScrollingScreen(false); // ensure it's false if animation stops
    }
  };
  // 🌀 Monitor animation progress every frame
  useFrame(() => {
    const nextSectionAction = actions?.['avatarModel'];
    calculateFrameToTriggerScrolling();
    if (
      isPlayingNextSection.current &&
      !wireframeApplied.current &&
      nextSectionAction
    ) {
      const timeRemaining =
        nextSectionAction.getClip().duration - nextSectionAction.time;
      const threshold = 0.1; // seconds before end to trigger wireframe

      if (timeRemaining < threshold) {
        console.log('Applying wireframe near end of animation.');
        // wireframeApplied.current = true;
        scene.traverse((child) => {
          if (child.isMesh && child.material) {
            // child.material.wireframe = true;
          }
        });
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
