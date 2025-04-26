'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingStore } from '../app/stores/settingStore';

export default function Avatar({ currentStage, isLoadingDone }) {
  const groupRef = useRef();
  const [prevStage, setPrevStage] = useState(null);
  const isPlayingNextSection = useRef(false);
  const hasFlickered = useRef(false);
  const blinkStartTime = useRef(null);
  const setIsScrolling = useSettingStore((s) => s.setIsScrolling);
  const setIsTypingRunning = useSettingStore((s) => s.setIsTypingRunning);
  // Load GLTF
  const { scene, animations } = useGLTF('/models/avatar_52.glb');
  const { actions } = useAnimations(animations, groupRef);
  // Load face textures only once
  const [normalFace, waveFace, surpriseFace] = useTexture([
    '/face/normal8.png',
    '/face/wave7.png',
    '/face/surprise4.png',
  ]);
  normalFace.flipY = false;
  waveFace.flipY = false;
  surpriseFace.flipY = false;
  normalFace.colorSpace = THREE.SRGBColorSpace;
  waveFace.colorSpace = THREE.SRGBColorSpace;
  surpriseFace.colorSpace = THREE.SRGBColorSpace;

  const faceMesh = scene.getObjectByName('Object_3001');
  const bodyMesh = scene.getObjectByName('Object_3002');
  const originalMaterials = useRef(new Map());
  useEffect(() => {
    setIsTypingRunning(actions['typing3'].isRunning());
  }, [actions['typing3']?.isRunning()]);
  useEffect(() => {
    if (!actions || !groupRef.current) return;
    const bakedAction = actions['baked_final'];
    const typingAction = actions['typing3'];
    const nextSectionAction = actions['avatarModel'];

    if (!bakedAction || !typingAction || !nextSectionAction) return;
    const mixer = bakedAction.getMixer();
    const cleanupFns = [];

    const playInitialSequence = () => {
      bakedAction.reset().setLoop(THREE.LoopOnce, 1);
      bakedAction.clampWhenFinished = true;
      bakedAction.play();

      const onFinish = () => {
        typingAction.syncWith(bakedAction);
        typingAction.reset().setLoop(THREE.LoopRepeat).play();
      };

      mixer.addEventListener('finished', onFinish);
      cleanupFns.push(() => mixer.removeEventListener('finished', onFinish));
    };

    const playNextSectionOnce = () => {
      bakedAction.stop();
      typingAction.stop();

      nextSectionAction.reset();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.timeScale = 1.5;
      nextSectionAction.play();

      isPlayingNextSection.current = true;

      const holdLast = () => {
        nextSectionAction.paused = true;
        isPlayingNextSection.current = false;
      };

      mixer.addEventListener('finished', holdLast);
      cleanupFns.push(() => mixer.removeEventListener('finished', holdLast));
    };

    const playNextSectionInReverse = () => {
      nextSectionAction.stop();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.time = nextSectionAction.getClip().duration;
      nextSectionAction.timeScale = -1;
      nextSectionAction.paused = false;
      nextSectionAction.play();

      const holdStart = () => {
        nextSectionAction.paused = true;
        isPlayingNextSection.current = false;
        typingAction.play();
      };

      mixer.addEventListener('finished', holdStart);
      cleanupFns.push(() => mixer.removeEventListener('finished', holdStart));
    };

    // Stage transitions
    if (prevStage === 1 && currentStage === 0) {
      playNextSectionInReverse();
    } else if (currentStage === 0 && isLoadingDone === true) {
      playInitialSequence();
      originalMaterials.current.set('body', bodyMesh.material.clone());
      originalMaterials.current.set('face', faceMesh.material.clone());
    } else if (currentStage === 1 && prevStage === 0) {
      faceMesh.material = new THREE.MeshBasicMaterial({ map: surpriseFace });
      faceMesh.material.needsUpdate = true;
      playNextSectionOnce();
    }

    setPrevStage(currentStage);

    return () => cleanupFns.forEach((fn) => fn());
  }, [currentStage, isLoadingDone]);

  const calculateFrameToTriggerScrolling = () => {
    const typingAction = actions?.['typing3'];
    if (typingAction && typingAction.isRunning()) {
      const time = typingAction.time;
      const fps =
        typingAction.getClip().tracks[0]?.times?.length /
          typingAction.getClip().duration || 30;
      const currentFrame = Math.floor(time * fps);
      const isInRange =
        (currentFrame >= 25 && currentFrame <= 70) ||
        (currentFrame >= 287 && currentFrame <= 372) ||
        (currentFrame >= 475 && currentFrame <= 485);
      setIsScrolling(isInRange);
    } else {
      setIsScrolling(false);
    }
  };

  const changeFacePng = () => {
    const action = actions?.['baked_final'];
    if (!action || !faceMesh) return;
    const frame = Math.floor(action.time * 30);
    const useWave = frame >= 41 && frame <= 67;
    if (useWave) {
      waveFace.colorSpace = THREE.SRGBColorSpace;
      faceMesh.material = new THREE.MeshBasicMaterial({
        map: waveFace,
      });
    } else {
      normalFace.colorSpace = THREE.SRGBColorSpace;
      faceMesh.material = new THREE.MeshBasicMaterial({
        map: normalFace,
        // transparent: true,
        // toneMapped: false,
      });
    }
    faceMesh.material.needsUpdate = true;
  };

  useFrame(({ clock }) => {
    const nextSectionAction = actions['avatarModel'];

    if (currentStage === 0 && isLoadingDone === true) {
      calculateFrameToTriggerScrolling();
      changeFacePng();
      hasFlickered.current = false;
    }

    if (currentStage === 1 && !nextSectionAction.isRunning()) {
      const time = clock.getElapsedTime();
      if (!blinkStartTime.current) blinkStartTime.current = time;
      const elapsed = time - blinkStartTime.current;
      const blinkCycle = 4.0;
      const blinkDuration = 0.3;
      const cycleTime = elapsed % blinkCycle;
      const flickerToShow = cycleTime < blinkDuration;

      if (!flickerToShow) {
        scene.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: '#ffaa00',
              wireframe: true,
            });
            child.material.needsUpdate = true;
          }
        });
      } else if (!hasFlickered.current) {
        hasFlickered.current = true;
        if (bodyMesh && originalMaterials.current.has('body')) {
          bodyMesh.material = originalMaterials.current.get('body').clone();
          bodyMesh.material.needsUpdate = true;
        }
        surpriseFace.colorSpace = THREE.SRGBColorSpace;
        faceMesh.material = new THREE.MeshBasicMaterial({ map: surpriseFace });
        faceMesh.material.needsUpdate = true;

        let flickerCount = 0;
        const maxFlickers = 6;
        const interval = setInterval(() => {
          const isOn = flickerCount % 2 === 0;
          faceMesh.visible = isOn;
          bodyMesh.visible = isOn;
          flickerCount++;
          if (flickerCount >= maxFlickers) {
            clearInterval(interval);
            faceMesh.visible = true;
            bodyMesh.visible = true;
          }
        }, 80);
      }
    } else {
      if (bodyMesh && originalMaterials.current.has('body')) {
        bodyMesh.material = originalMaterials.current.get('body').clone();
        bodyMesh.material.needsUpdate = true;
      }
      blinkStartTime.current = null;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
