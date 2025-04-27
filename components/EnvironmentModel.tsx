'use client';
import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import Bubbles from './Bubble';
import { useSettingStore } from '../app/stores/settingStore';

type ModelProps = {
  url: string;
  currentStage: number;
  isLoadingDone: boolean;
};

export function Model({ url, currentStage, isLoadingDone }: ModelProps) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene, materials } = useGLTF(url);
  const isScrolling = useSettingStore((s) => s.isScrolling);
  // ✅ Load textures once using useTexture
  const [wallShadowTex, groundShadowTex, labWallGroundTex] = useTexture([
    '/models/wallShadow_transparent6.png',
    '/models/groundShadow_transparent3.png',
    '/models/labwallGround_transparent.png',
  ]);
  // useEffect(() => {
  //   const empty = scene.getObjectByName('speakerPosition'); // your Empty's name
  //   if (empty) {
  //     const worldPos = new THREE.Vector3();
  //     empty.getWorldPosition(worldPos);
  //     console.log('position', empty.position);
  //     console.log('speakerPosition World Position:', worldPos);
  //     // 여기서 World Position 정확히 나옴
  //   } else {
  //     console.log('speakerPosition not found');
  //   }
  // }, [scene]);

  useEffect(() => {
    if (!scene) return;

    wallShadowTex.flipY = false;
    groundShadowTex.flipY = false;
    labWallGroundTex.flipY = false;
    wallShadowTex.needsUpdate = true;
    groundShadowTex.needsUpdate = true;
    labWallGroundTex.needsUpdate = true;

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (child.name === 'wall') {
        child.material = new THREE.MeshStandardMaterial({
          map: wallShadowTex,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        });
      }

      if (child.name === 'ground') {
        child.material = new THREE.MeshStandardMaterial({
          map: groundShadowTex,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        });
      }

      if (child.name === 'lab_ground_wall') {
        child.material = new THREE.MeshStandardMaterial({
          map: labWallGroundTex,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        });
      }

      child.material.needsUpdate = true;
    });
  }, [scene]);

  const scrollTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const material = materials['Material.002'] as THREE.MeshStandardMaterial;
    if (!material?.emissiveMap?.offset) return;

    if (!scrollTl.current) {
      scrollTl.current = gsap.timeline({ repeat: -1, paused: true });
      scrollTl.current.to(material.emissiveMap.offset, {
        y: '-=1',
        duration: 10,
        ease: 'none',
      });
    }

    isScrolling ? scrollTl.current.resume() : scrollTl.current.pause();

    return () => {
      // Optional cleanup
      scrollTl.current?.kill();
    };
  }, [isScrolling, materials]);

  useEffect(() => {
    const roomObj = scene.getObjectByName('room_obj');
    const wallObj = scene.getObjectByName('wall_obj');
    const wallShadow = scene.getObjectByName('wall') as THREE.Mesh;
    const groundShadow = scene.getObjectByName('ground') as THREE.Mesh;

    if (!roomObj || !wallObj || !wallShadow?.material) {
      console.warn('Missing objects for GSAP transition');
      return;
    }

    gsap.killTweensOf([roomObj.scale, wallObj.scale, wallShadow.material]);
    if (!isLoadingDone) return;
    if (currentStage === 0) {
      if (Array.isArray(wallShadow.material)) {
        wallShadow.material.forEach((mat) => (mat.transparent = true));
      } else {
        wallShadow.material.transparent = true;
      }

      gsap.fromTo(
        wallShadow.material,
        { opacity: 0 },
        {
          opacity: 0.1,
          duration: 1,
          delay: 1.2,
          ease: 'power1.inOut',
        }
      );
      gsap.fromTo(
        groundShadow.material,
        { opacity: 0 },
        {
          opacity: 0.1,
          duration: 1,
          delay: 1.2,
          ease: 'power1.inOut',
        }
      );

      gsap.fromTo(
        roomObj.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
        }
      );

      gsap.fromTo(
        wallObj.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.2,
          delay: 0.2,
          ease: 'back.out(1.7)',
        }
      );
    } else if (currentStage === 1) {
      gsap.to(groundShadow.material, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.inOut',
      });
      gsap.to(wallShadow.material, {
        opacity: 0,
        duration: 2,
        delay: 0.2,
        ease: 'power1.inOut',
      });

      gsap.to(roomObj.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'back.in(1.7)',
      });

      gsap.to(wallObj.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        delay: 0.2,
        ease: 'back.in(1.7)',
      });
    }
  }, [currentStage, isLoadingDone]);

  return (
    <>
      <primitive ref={modelRef} object={scene} dispose={null} />
      {bubblePositions.map((bubble, index) => (
        <Bubbles
          key={index}
          position={[bubble.position.x, bubble.position.y, bubble.position.z]}
        />
      ))}
    </>
  );
}

const bubblePositions = [
  { position: { x: 4.1687, y: -6.8497, z: -1.7472 } },
  { position: { x: 4.439, y: -7.0102, z: -0.8573 } },
  { position: { x: 4.8597, y: -6.4299, z: -0.6849 } },
  { position: { x: 3.8687, y: -6.0447, z: -0.9829 } },
  { position: { x: 4.2313, y: -6.4428, z: -1.1091 } },
];
