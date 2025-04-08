import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function Avatar({ currentStage }) {
  const groupRef = useRef();
  const [prevStage, setPrevStage] = useState(null);

  const { scene, animations } = useGLTF('/models/avatar28.glb');
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

    const playNextSectionOnce = () => {
      console.log('Playing NextSection animation FORWARD.');
      bakedAction.stop();
      typingAction.stop();

      nextSectionAction.reset();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.timeScale = 1.5;
      nextSectionAction.play();

      const holdOnLastFrame = () => {
        console.log('NextSection finished. Holding final pose.');
        nextSectionAction.paused = true;
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
      };

      mixer.addEventListener('finished', holdAtStart);
      cleanup = () => mixer.removeEventListener('finished', holdAtStart);
    };

    // Detect transitions
    if (prevStage === 1 && currentStage === 0) {
      playNextSectionInReverse();
    } else if (currentStage === 0) {
      playInitialSequence();
    } else if (currentStage === 1 && prevStage == 0) {
      playNextSectionOnce();
    } else if (currentStage === 1 && prevStage == 2) {
    }

    // Store previous stage
    setPrevStage(currentStage);

    return () => cleanup();
  }, [actions, currentStage]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/avatar28.glb');
