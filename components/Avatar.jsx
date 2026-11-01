'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { useAnimations, useTexture } from '@react-three/drei';
import { FACE_TEXTURES, DRACO_DECODER_PATH, KTX2_TRANSCODER_PATH } from './sceneAssets';
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
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    dracoLoader.setDecoderConfig({ type: 'wasm' });

    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(KTX2_TRANSCODER_PATH);
    ktx2Loader.detectSupport(renderer); // 🚨 Must be called before load

    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
  });
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, groupRef);

  const [normalFace, waveFace, surpriseFace] = useTexture(FACE_TEXTURES);
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
  const faceMaterials = useMemo(
    () => ({
      normal: new THREE.MeshStandardMaterial({ map: normalFace, roughness: .9, envMapIntensity: .4 }),
      wave: new THREE.MeshStandardMaterial({ map: waveFace, roughness: .9, envMapIntensity: .4 }),
      surprise: new THREE.MeshStandardMaterial({ map: surpriseFace, roughness: .9, envMapIntensity: .4 }),
      wire: new THREE.MeshBasicMaterial({ color: '#ffaa00', wireframe: true }),
    }),
    [normalFace, waveFace, surpriseFace]
  );
  const lastFaceTypeRef = useRef('');
  useLayoutEffect(() => {
    const originals = originalMaterials.current;
    const sourceBody = bodyMesh.material;
    const shadedBody = new THREE.MeshStandardMaterial({
      map: sourceBody.map, color: sourceBody.color, roughness: .88, envMapIntensity: .4,
    });
    const shadowState = [bodyMesh.castShadow, bodyMesh.receiveShadow, faceMesh.castShadow, faceMesh.receiveShadow];
    bodyMesh.material = shadedBody;
    bodyMesh.castShadow = bodyMesh.receiveShadow = true;
    faceMesh.castShadow = faceMesh.receiveShadow = true;
    originals.set('body', shadedBody);
    originals.set('face', faceMesh.material);
    // Set the face before the first draw, including Strict Mode effect replay.
    faceMesh.material = faceMaterials.normal;
    lastFaceTypeRef.current = 'normal';
    return () => {
      bodyMesh.material = sourceBody;
      faceMesh.material = originals.get('face');
      [bodyMesh.castShadow, bodyMesh.receiveShadow, faceMesh.castShadow, faceMesh.receiveShadow] = shadowState;
      shadedBody.dispose();
      lastFaceTypeRef.current = '';
      Object.values(faceMaterials).forEach((material) => material.dispose());
    };
  }, [bodyMesh, faceMesh, faceMaterials]);

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
  }, [
    isScrolling,
    currentStage,
    audioToggleState,
    isTypingRunning,
    typingAudio,
    scrollAudio,
    clickingSound,
  ]);

  const typingFps = useMemo(() => {
    const typingClip = actions?.['typing3']?.getClip();
    return typingClip
      ? typingClip.tracks[0].times.length / typingClip.duration
      : 30;
  }, [actions]);

  /** ------------------------------------------------------------------
   * TYPING STATUS (for other UI parts)
   * ------------------------------------------------------------------ */

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
      setIsTypingRunning(false);
      bakedAction.reset().setLoop(THREE.LoopOnce, 1);
      bakedAction.clampWhenFinished = true;
      bakedAction.play();

      const onFinish = (event) => {
        if (event.action !== bakedAction) return;
        typingAction.syncWith(bakedAction);
        typingAction.reset().setLoop(THREE.LoopRepeat).play();
        setIsTypingRunning(true);
      };

      mixer.addEventListener('finished', onFinish);
      cleanupFns.push(() => mixer.removeEventListener('finished', onFinish));
    };

    const playNextSectionOnce = () => {
      bakedAction.stop();
      typingAction.stop();
      setIsTypingRunning(false);

      nextSectionAction.reset();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.timeScale = 1.5;
      nextSectionAction.play();

      const holdLast = (event) => {
        if (event.action === nextSectionAction) nextSectionAction.paused = true;
      };
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

      const holdStart = (event) => {
        if (event.action !== nextSectionAction) return;
        nextSectionAction.paused = true;
        typingAction.play();
        setIsTypingRunning(true);
      };
      mixer.addEventListener('finished', holdStart);
      cleanupFns.push(() => mixer.removeEventListener('finished', holdStart));
    };

    /* stage‑change logic --------------------------------------------- */
    if (prevStage === 1 && currentStage === 0) {
      playNextSectionReverse();
      faceMesh.material = faceMaterials.normal;
      faceMesh.material.needsUpdate = true;
    } else if (currentStage === 0 && isLoadingDone) {
      playInitialSequence();
    } else if (prevStage === 0 && currentStage === 1) {
      faceMesh.material = faceMaterials.surprise;
      faceMesh.material.needsUpdate = true;
      playNextSectionOnce();
    }

    setPrevStage(currentStage);
    return () => {
      cleanupFns.forEach((fn) => fn());
      setIsTypingRunning(false);
    };
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
  const updateFaceTexture = () => {
    const action = actions?.['baked_final'];
    if (!action || !action.isRunning()) return;

    const frame = Math.floor(action.time * 30);
    const useWave = frame >= 41 && frame <= 67;

    const newFaceType = useWave ? 'wave' : 'normal';
    if (lastFaceTypeRef.current === newFaceType) return;

    lastFaceTypeRef.current = newFaceType;

    faceMesh.material = useWave ? faceMaterials.wave : faceMaterials.normal;
    faceMesh.material.needsUpdate = true;
  };
  const lastIsScrolling = useRef(false);
  const lastUpdateRef = useRef(0);
  useFrame(({ clock }) => {
    if (currentStage !== 0) return;

    // Intro timing belongs to the clip, not the canvas's asset-loading clock.
    updateFaceTexture();
    const now = clock.getElapsedTime();
    if (now - lastUpdateRef.current > 1) {
      // Throttle typing/scrolling checks independently of face animation.
      lastUpdateRef.current = now;
      calculateScrolling();
    }
  });

  useEffect(() => {
    if (currentStage === 1) {
      let flickerTimer;
      const flicker = () => {
        bodyMesh.material = faceMaterials.wire;
        faceMesh.material = faceMaterials.wire;

        let count = 0;
        flickerTimer = setInterval(() => {
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
        clearTimeout(timer);
        clearInterval(flickerTimer);
        faceMesh.visible = true;
        bodyMesh.visible = true;
      };
    } else {
      function restoreOriginalMaterials() {
        if (bodyMesh && originalMaterials.current.has('body')) {
          bodyMesh.material = originalMaterials.current.get('body');
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
