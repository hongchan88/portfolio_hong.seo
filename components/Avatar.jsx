import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function Avatar() {
  const groupRef = useRef();

  // Load the model and animations
  const { scene, animations } = useGLTF('/models/baked_avatar16.glb');
  const { actions } = useAnimations(animations, groupRef);
  console.log(actions, 'avatar action');
  useEffect(() => {
    const bakedAction = actions['baked_final'];
    const typingAction = actions['typing3'];

    if (bakedAction && typingAction) {
      const mixer = bakedAction.getMixer();

      // 1) Play baked_final once and hold final pose
      bakedAction.reset().setLoop(THREE.LoopOnce, 1);
      bakedAction.clampWhenFinished = true;
      bakedAction.play();

      // 2) When baked_final finishes, start typing3 immediately
      const handleFinish = () => {
        console.log('baked_final finished, starting typing3 immediately.');

        // Align typing3’s starting pose with baked_final
        typingAction.syncWith(bakedAction);

        typingAction.reset().setLoop(THREE.LoopRepeat).play();
      };

      mixer.addEventListener('finished', handleFinish);

      // Cleanup the event listener when the component unmounts
      return () => mixer.removeEventListener('finished', handleFinish);
    }
  }, [actions, animations]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload('/models/baked_avatar16.glb');
