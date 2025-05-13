'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useAnimations, useTexture } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingStore } from '../app/stores/settingStore';
import { useAudioStore } from '@store/audioStore';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Avatar({ currentStage, isLoadingDone, url }) {
  const groupRef = useRef(null);
  const [prevStage, setPrevStage] = useState(null);
  const setIsScrolling = useSettingStore((s) => s.setIsScrolling);
  const isScrolling = useSettingStore((s) => s.isScrolling);
  const audioToggleState = useAudioStore((s) => s.audioToggleState);
  const audioRefs = useAudioStore((s) => s.audioRefs);
  const setIsTypingRunning = useSettingStore((s) => s.setIsTypingRunning);
  const isTypingRunning = useSettingStore((s) => s.isTypingRunning);
  const clickingSound = audioRefs['clickingSound'];
  const typingAudio = audioRefs['typingAudio'];
  const scrollAudio = audioRefs['scrollAudio'];

  /** ------------------------------------------------------------------
   * LOAD ASSETS
   * ------------------------------------------------------------------ */
  const { gl: renderer } = useThree();

  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    dracoLoader.setDecoderConfig({ type: 'wasm' });

    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/ktx2/');
    ktx2Loader.detectSupport(renderer); // 🚨 Must be called before load

    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
  });
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, groupRef);

  const [normalFace, waveFace, surpriseFace] = useTexture([
    '/face/normal8.webp',
    '/face/wave7.webp',
    '/face/surprise4.webp',
  ]);
  [normalFace, waveFace, surpriseFace].forEach((t) => {
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
  });

  // cache meshes once the scene is ready
  const { faceMesh, bodyMesh } = useMemo(() => {
    return {
      faceMesh: scene.getObjectByName('Object_3001'),
      bodyMesh: scene.getObjectByName('Object_3002'),
    };
  }, [scene]);

  // keep originals so we can restore them later
  const originalMaterials = useRef(new Map());

  /** ------------------------------------------------------------------
   * CONSTANTS
   * ------------------------------------------------------------------ */
  const FRAME_RANGES = useMemo(
    () => [
      [25, 70],
      [287, 372],
      [475, 485],
    ],
    []
  );
  function toggleAudioFunc({ playTargets, pauseTargets }) {
    const playList = Array.isArray(playTargets) ? playTargets : [playTargets];
    const pauseList = Array.isArray(pauseTargets)
      ? pauseTargets
      : [pauseTargets];

    pauseList.forEach((audio) => {
      audio?.pause();
      audio.currentTime = 0;
    });

    playList.forEach((audio) => {
      if (audio.paused) {
        audio.currentTime = 0;
        audio?.play().catch((e) => console.warn('Play blocked:', e));
      }
    });
  }
  useEffect(() => {
    if (!typingAudio || !scrollAudio || !clickingSound) return;

    if (audioToggleState && currentStage === 0 && isTypingRunning) {
      if (isScrolling) {
        toggleAudioFunc({
          playTargets: [scrollAudio, clickingSound],
          pauseTargets: [typingAudio],
        });
      } else {
        toggleAudioFunc({
          playTargets: typingAudio,
          pauseTargets: [scrollAudio],
        });
      }
    } else {
      typingAudio?.pause();
      scrollAudio?.pause();
    }
  }, [isScrolling, currentStage, audioToggleState]);

  const typingFps = useMemo(() => {
    const typingClip = actions?.['typing3']?.getClip();
    return typingClip
      ? typingClip.tracks[0].times.length / typingClip.duration
      : 30;
  }, [actions]);

  /** ------------------------------------------------------------------
   * TYPING STATUS (for other UI parts)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    setIsTypingRunning(actions?.['typing3']?.isRunning() ?? false);
  }, [actions?.['typing3']?.isRunning()]);

  /** ------------------------------------------------------------------
   * ANIMATION STATE MACHINE (baked → typing → nextSection etc.)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!actions || !groupRef.current) return;

    const bakedAction = actions['baked_final']; // falldown, wave animation
    const typingAction = actions['typing3'];
    const nextSectionAction = actions['avatarModel'];

    if (!bakedAction || !typingAction || !nextSectionAction) return;

    /* helpers --------------------------------------------------------- */
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

      const holdLast = () => (nextSectionAction.paused = true);
      mixer.addEventListener('finished', holdLast);
      cleanupFns.push(() => mixer.removeEventListener('finished', holdLast));
    };

    const playNextSectionReverse = () => {
      nextSectionAction.stop();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.time = nextSectionAction.getClip().duration;
      nextSectionAction.timeScale = -1;
      nextSectionAction.paused = false;
      nextSectionAction.play();

      const holdStart = () => {
        nextSectionAction.paused = true;
        typingAction.play();
      };
      mixer.addEventListener('finished', holdStart);
      cleanupFns.push(() => mixer.removeEventListener('finished', holdStart));
    };

    /* stage‑change logic --------------------------------------------- */
    if (prevStage === 1 && currentStage === 0) {
      playNextSectionReverse();
      faceMesh.material = new THREE.MeshBasicMaterial({ map: normalFace });
      faceMesh.material.needsUpdate = true;
    } else if (currentStage === 0 && isLoadingDone) {
      playInitialSequence();
      originalMaterials.current.set('body', bodyMesh.material.clone());
      originalMaterials.current.set('face', faceMesh.material.clone());
    } else if (prevStage === 0 && currentStage === 1) {
      faceMesh.material = new THREE.MeshBasicMaterial({ map: surpriseFace });
      faceMesh.material.needsUpdate = true;
      playNextSectionOnce();
    }

    setPrevStage(currentStage);
    return () => cleanupFns.forEach((fn) => fn());
  }, [currentStage, isLoadingDone]);

  /** ------------------------------------------------------------------
   * LIGHTWEIGHT PER‑FRAME CHECK (stage 0 only)
   * ------------------------------------------------------------------ */
  const calculateScrolling = () => {
    const typing = actions?.['typing3'];
    if (!typing || !typing.isRunning()) {
      if (lastIsScrolling.current !== false) {
        setIsScrolling(false);
        lastIsScrolling.current = false;
      }
      return;
    }

    const frame = Math.floor(typing.time * typingFps);
    const inRange = FRAME_RANGES.some(([s, e]) => frame >= s && frame <= e);

    if (lastIsScrolling.current !== inRange) {
      setIsScrolling(inRange);
      lastIsScrolling.current = inRange;
    }
  };
  const lastFaceTypeRef = useRef('');
  const updateFaceTexture = () => {
    const action = actions?.['baked_final'];
    if (!action || action.paused) return;

    const frame = Math.floor(action.time * 30);
    const useWave = frame >= 41 && frame <= 67;

    const newFaceType = useWave ? 'wave' : 'normal';
    if (lastFaceTypeRef.current === newFaceType) return;

    lastFaceTypeRef.current = newFaceType;

    const map = useWave ? waveFace : normalFace;
    faceMesh.material = new THREE.MeshBasicMaterial({ map });
    faceMesh.material.needsUpdate = true;
  };

  const lastIsScrolling = useRef(false);
  const lastUpdateRef = useRef(0);
  useFrame(({ clock }) => {
    if (currentStage !== 0 || !isLoadingDone) return;

    const now = clock.getElapsedTime();
    if (now < 5) {
      updateFaceTexture();
    } else if (now - lastUpdateRef.current > 1) {
      // every 0.5 frame it updates. to increase performance less laggy
      lastUpdateRef.current = now;
      calculateScrolling();
    }
  });

  useEffect(() => {
    if (currentStage === 1) {
      const flicker = () => {
        bodyMesh.material = new THREE.MeshBasicMaterial({
          color: '#ffaa00',
          wireframe: true,
        });
        faceMesh.material = new THREE.MeshBasicMaterial({
          color: '#ffaa00',
          wireframe: true,
        });

        let count = 0;
        const flickerTimer = setInterval(() => {
          const visible = count % 2 === 0;
          faceMesh.visible = visible;
          bodyMesh.visible = visible;
          count++;
          if (count > 8) {
            clearInterval(flickerTimer);
            faceMesh.visible = true;
            bodyMesh.visible = true;
          }
        }, 80);
      };

      const timer = setTimeout(flicker, 1000); // wait 1 sec, then flicker
      return () => {
        clearTimeout(timer); // cancel if unmounted or stage changes
      };
    } else {
      function restoreOriginalMaterials() {
        if (bodyMesh && originalMaterials.current.has('body')) {
          bodyMesh.material = originalMaterials.current.get('body').clone();
          bodyMesh.material.needsUpdate = true;
        }
      }
      restoreOriginalMaterials();
    }
  }, [currentStage]);
  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
