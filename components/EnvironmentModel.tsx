'use client';
import * as THREE from 'three';
import React, { useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { SHADOW_TEXTURES, STUDIO_BAKED_TEXTURE, DRACO_DECODER_PATH, KTX2_TRANSCODER_PATH } from './sceneAssets';
import gsap from 'gsap';
import { useSettingStore } from '../app/stores/settingStore';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader, useThree } from '@react-three/fiber';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { createSurfaceTexture } from './surfaceTextures';
type ModelProps = {
  url: string;
  currentStage: number;
  isLoadingDone: boolean;
};

export function Model({ url, currentStage, isLoadingDone }: ModelProps) {
  const modelRef = useRef<THREE.Group>(null);
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
  const { scene, materials } = gltf;
  const isScrolling = useSettingStore((s) => s.isScrolling);
  const [wallShadowTex, groundShadowTex] = useTexture(SHADOW_TEXTURES);
  const bakedAtlas = useTexture(STUDIO_BAKED_TEXTURE);
  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(2.5, 1.2, 0);
    return target;
  }, []);

  useLayoutEffect(() => {
    bakedAtlas.flipY = false;
    bakedAtlas.colorSpace = THREE.SRGBColorSpace;
    bakedAtlas.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    bakedAtlas.needsUpdate = true;
    const wood = createSurfaceTexture('wood');
    const fabric = createSurfaceTexture('fabric');
    const originals = new Map<THREE.Mesh, { material: THREE.Material | THREE.Material[]; cast: boolean; receive: boolean }>();
    const owned = new Map<THREE.Material, THREE.Material>();
    const prepare = (original: THREE.Material) => {
      if (owned.has(original)) return owned.get(original)!;
      if (BAKED_PROP_MATERIALS.has(original.name)) {
        // This atlas already contains light and shadows. Relighting it as
        // albedo doubles the shading and washes out the small UV islands.
        const material = new THREE.MeshBasicMaterial({
          name: original.name, map: bakedAtlas, side: original.side,
        });
        owned.set(original, material);
        return material;
      }
      const material = original.clone();
      if (material instanceof THREE.MeshStandardMaterial) {
        // The source uses black albedo + emission for almost every prop.
        // Reuse its colors/textures as albedo so the surfaces receive light.
        if (material.name !== 'Material.002') {
          if (material.emissive.getHex() !== 0) material.color.copy(material.emissive);
          if (material.emissiveMap) material.map = material.emissiveMap;
          material.emissive.set(0);
          material.emissiveMap = null;
          const finish = STUDIO_FINISHES[material.name];
          if (finish) {
            material.color.set(finish.color);
            material.roughness = finish.roughness;
            material.metalness = finish.metalness ?? 0;
          } else {
            material.roughness = .72;
            material.metalness = 0;
          }
          if (['Material.010', 'Material.177'].includes(material.name)) {
            material.map = wood;
            material.bumpMap = wood;
            material.bumpScale = .012;
          }
          if (['Material.019', 'Material.143', 'Material.144', 'Material.145', 'Material.146'].includes(material.name)) {
            material.bumpMap = fabric;
            material.bumpScale = .009;
          }
        } else {
          // Keep the monitor's scrolling emissive texture linked to GSAP.
          material.emissiveIntensity = .8;
          material.roughness = .24;
        }
        material.envMapIntensity = .28;
      }
      owned.set(original, material);
      return material;
    };
    for (const name of ['room_obj', 'wall_obj']) {
      scene.getObjectByName(name)?.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        originals.set(object, { material: object.material, cast: object.castShadow, receive: object.receiveShadow });
        object.material = Array.isArray(object.material) ? object.material.map(prepare) : prepare(object.material);
        object.castShadow = object.receiveShadow = true;
      });
    }
    return () => {
      originals.forEach((original, mesh) => {
        mesh.material = original.material;
        mesh.castShadow = original.cast;
        mesh.receiveShadow = original.receive;
      });
      owned.forEach(material => material.dispose());
      wood.dispose();
      fabric.dispose();
    };
  }, [scene, bakedAtlas, renderer]);
  useEffect(() => {
    const oldLab = scene.getObjectByName('lab_scene');
    if (!oldLab) return;
    const visible = oldLab.visible;
    oldLab.visible = false;
    return () => { oldLab.visible = visible; };
  }, [scene]);
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
    wallShadowTex.needsUpdate = true;
    groundShadowTex.needsUpdate = true;

    const originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
    const owned: THREE.Material[] = [];
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (child.name === 'wall' || child.name === 'ground')
        originals.set(child, child.material);
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

      // if (child.name === 'lab_ground_wall') {
      //   child.material = new THREE.MeshStandardMaterial({
      //     map: labWallGroundTex,
      //     transparent: true,
      //     opacity: 0.2,
      //     depthWrite: false,
      //   });
      // }

      if (originals.has(child)) owned.push(child.material as THREE.Material);
      child.material.needsUpdate = true;
    });
    return () => {
      originals.forEach((material, mesh) => {
        mesh.material = material;
      });
      owned.forEach((material) => material.dispose());
    };
  }, [scene, wallShadowTex, groundShadowTex]);

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
      scrollTl.current = null;
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

    if (!isLoadingDone) return;
    const context = gsap.context(() => {
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
    });
    return () => context.revert();
  }, [currentStage, isLoadingDone]);

  return <>
    <primitive ref={modelRef} object={scene} dispose={null} />
    <primitive object={lightTarget} />
    <spotLight position={[6, 9, -4]} target={lightTarget} color='#fff0da'
      intensity={65} distance={16} angle={.8} penumbra={.85} decay={2}
      castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}
      shadow-bias={-.0002} shadow-normalBias={.025} shadow-camera-near={.5} shadow-camera-far={16} />
    <rectAreaLight position={[3, 5, 5]} rotation={[-Math.PI / 4, 0, 0]}
      color='#dae9ff' intensity={.8} width={5} height={4} />
  </>;
}

const STUDIO_FINISHES: Record<string, { color: string; roughness: number; metalness?: number }> = {
  'Material.010': { color: '#65452f', roughness: .42 },
  'Material.177': { color: '#765239', roughness: .38 },
  'Material.019': { color: '#7c9276', roughness: .78 },
  'Material.033': { color: '#777c79', roughness: .45, metalness: .25 },
  'Material.034': { color: '#507b8b', roughness: .75 },
  'Material.032': { color: '#c1b16b', roughness: .85 },
  'Material.030': { color: '#78895a', roughness: .8 },
  'Material.029': { color: '#c38d50', roughness: .75 },
  'Material.028': { color: '#45515a', roughness: .3, metalness: .65 },
  'Material.009': { color: '#30393c', roughness: .55 },
  'Material.007': { color: '#768084', roughness: .32, metalness: .55 },
  'Material.173': { color: '#9fa6a6', roughness: .32, metalness: .6 },
  'Material.174': { color: '#414a4b', roughness: .4, metalness: .3 },
  'Material.146': { color: '#a2aa8d', roughness: .97 },
  'Material.145': { color: '#a2aa8d', roughness: .97 },
  'Material.144': { color: '#d2bc87', roughness: .97 },
  'Material.143': { color: '#d2bc87', roughness: .97 },
};

const BAKED_PROP_MATERIALS = new Set(['Material.147', 'Material.148', 'Material.005']);
