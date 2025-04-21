import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Avatar({ currentStage, setScrollingScreen }) {
  const groupRef = useRef();
  const [prevStage, setPrevStage] = useState(null);
  const isPlayingNextSection = useRef(false);
  const wireframeApplied = useRef(false);
  const hasFlickered = useRef(false);

  const { scene, animations } = useGLTF('/models/avatar_52.glb');
  const { actions } = useAnimations(animations, groupRef);
  const originalMaterials = useRef(new Map());

  const blinkStartTime = useRef(null);
  const loader = new THREE.TextureLoader();
  const faceMesh = scene.getObjectByName('Object_3001');
  const bodyMesh = scene.getObjectByName('Object_3002');

  useEffect(() => {
    if (!actions || !groupRef.current) return;

    const bakedAction = actions['baked_final'];
    const typingAction = actions['typing3'];
    const nextSectionAction = actions['avatarModel'];

    if (!bakedAction || !typingAction || !nextSectionAction) return;

    const mixer = bakedAction.getMixer(); // All actions share the same mixer
    const cleanupFns = [];

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
      cleanupFns.push(() =>
        mixer.removeEventListener('finished', handleFinish)
      );
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
      cleanupFns.push(() =>
        mixer.removeEventListener('finished', holdOnLastFrame)
      );
    };

    const playNextSectionInReverse = () => {
      console.log('Playing NextSection animation BACKWARD.');

      nextSectionAction.stop();
      nextSectionAction.setLoop(THREE.LoopOnce, 1);
      nextSectionAction.clampWhenFinished = true;
      nextSectionAction.time = nextSectionAction.getClip().duration;
      nextSectionAction.timeScale = -1;
      nextSectionAction.paused = false;
      nextSectionAction.play();

      const holdAtStart = () => {
        console.log('Reverse animation finished. Holding at start.');
        nextSectionAction.paused = true;
        isPlayingNextSection.current = false;
        wireframeApplied.current = false;
        typingAction.play();
      };

      mixer.addEventListener('finished', holdAtStart);
      cleanupFns.push(() => mixer.removeEventListener('finished', holdAtStart));
    };

    // Detect transitions
    if (prevStage === 1 && currentStage === 0) {
      playNextSectionInReverse();
    } else if (currentStage === 0) {
      playInitialSequence();
      originalMaterials.current.set('body', bodyMesh.material.clone());
      originalMaterials.current.set('face', faceMesh.material.clone());
    } else if (currentStage === 1 && prevStage === 0) {
      loader.load('/face/surprise4.png', (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;

        faceMesh.material = new THREE.MeshBasicMaterial({
          map: tex,
        });

        faceMesh.material.needsUpdate = true;
      });
      playNextSectionOnce();
    }

    setPrevStage(currentStage);

    return () => {
      cleanupFns.forEach((fn) => fn()); // Remove all listeners
    };
  }, [currentStage]);

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
  const changeFacePng = () => {
    const action = actions?.['baked_final'];

    if (!action || !faceMesh) return;

    const frame = Math.floor(action.time * 30); // assuming 30 FPS

    if (frame >= 41 && frame <= 67) {
      loader.load('/face/wave7.png', (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace; // <‑‑ key line
        // tex.encoding = THREE.sRGBEncoding;

        faceMesh.material = new THREE.MeshBasicMaterial({
          map: tex,
          // transparent: true,
          // toneMapped: false,
        });

        faceMesh.material.needsUpdate = true;
      });
    } else {
      loader.load('/face/normal8.png', (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace; // <‑‑ key line
        // tex.encoding = THREE.sRGBEncoding;

        faceMesh.material = new THREE.MeshBasicMaterial({
          map: tex,
          // transparent: true,
          // toneMapped: false,
        });

        faceMesh.material.needsUpdate = true;
      });
    }
  };
  // 🌀 Monitor animation progress every frame
  useFrame(({ clock }) => {
    const nextSectionAction = actions['avatarModel'];
    if (currentStage === 0) {
      calculateFrameToTriggerScrolling();
      changeFacePng();
      hasFlickered.current = false; // Reset flicker state
    }

    if (currentStage === 1 && !nextSectionAction.isRunning()) {
      const time = clock.getElapsedTime();

      if (!blinkStartTime.current) {
        blinkStartTime.current = time;
      }

      const elapsed = time - blinkStartTime.current;

      const blinkCycle = 4.0; // total cycle duration (e.g., every 2s)
      const blinkDuration = 0.3; // how long the wireframe stays visible in each cycle

      const cycleTime = elapsed % blinkCycle;
      const flickerToShow = cycleTime < blinkDuration;

      // Only update if the blink state changes
      if (!flickerToShow) {
        scene.traverse((child) => {
          if (child.isMesh) {
            // if (
            //   !originalMaterials.current.has(child.uuid) &&
            //   child.name === 'Object_3002'
            // ) {
            //   // Save original material (clone for safety)
            //   originalMaterials.current.set(child.uuid, child.material.clone());
            // }
            // Replace with wireframe material
            child.material = new THREE.MeshBasicMaterial({
              color: '#ffaa00',
              wireframe: true,
            });
            child.material.needsUpdate = true;
          }
        });
      } else if (
        currentStage === 1 &&
        !nextSectionAction.isRunning() &&
        !hasFlickered.current
      ) {
        hasFlickered.current = true;

        // Reset body material
        if (bodyMesh && originalMaterials.current.has('body')) {
          bodyMesh.material = originalMaterials.current.get('body').clone();
          bodyMesh.material.needsUpdate = true;
        }

        // Load texture and apply
        loader.load('/face/surprise4.png', (tex) => {
          tex.flipY = false;
          tex.colorSpace = THREE.SRGBColorSpace;
          faceMesh.material = new THREE.MeshBasicMaterial({
            map: tex,
          });
          faceMesh.material.needsUpdate = true;
        });

        // Flicker effect (glitch)
        let flickerCount = 0;
        const maxFlickers = 6;
        const flickerInterval = setInterval(() => {
          if (!faceMesh || !bodyMesh) return;

          const isOn = flickerCount % 2 === 0;
          faceMesh.visible = isOn;
          bodyMesh.visible = isOn;
          flickerCount++;

          if (flickerCount >= maxFlickers) {
            clearInterval(flickerInterval);
            faceMesh.visible = true;
            bodyMesh.visible = true;
          }
        }, 80);
      }
    } else {
      const mesh = scene.getObjectByName('Object_3002');
      if (mesh && originalMaterials.current.has('body')) {
        mesh.material = originalMaterials.current.get('body').clone(); // or reuse if safe
        mesh.material.needsUpdate = true;
      }

      blinkStartTime.current = null; // Reset when not in stage 1
    }
  });

  return (
    <group ref={groupRef}>
      {/* {currentStage === 1 ? <Bubble position={100} /> : null} */}
      <primitive object={scene} />
    </group>
  );
}
