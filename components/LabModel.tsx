'use client';

import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DRACO_DECODER_PATH, LAB_MODEL_GLB } from './sceneAssets';
import Bubbles from './Bubble';
import { useSettingStore } from '../app/stores/settingStore';

type LabModelProps = { isMobile: boolean; introMatrix: THREE.Matrix4; children: ReactNode };

export default function LabModel({ isMobile, introMatrix, children }: LabModelProps) {
  const { gl, get } = useThree();
  const currentStage = useSettingStore(s => s.currentStage);
  const menuOpen = useSettingStore(s => s.rightDrawerToggle);
  const [waitingForCamera, setWaitingForCamera] = useState(false);
  const hideScenery = currentStage === 0 && (menuOpen || waitingForCamera);
  useLayoutEffect(() => {
    if (currentStage === 0 && menuOpen) setWaitingForCamera(true);
    if (currentStage !== 0) setWaitingForCamera(false);
  }, [currentStage, menuOpen]);
  useFrame(({ camera }) => {
    // Keep the lab out of the menu camera's view on the return trip too.
    // Its meshes, shaders and lights remain mounted/prepared throughout.
    if (!waitingForCamera || menuOpen || currentStage !== 0) return;
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 0;
    if (camera.position.distanceToSquared(DEFAULT_CAMERA_POSITION) < .0001 &&
        Math.abs(fov - (isMobile ? 90 : 70)) < .01) setWaitingForCamera(false);
  });
  const keyLight = useRef<THREE.SpotLight>(null);
  const lightRig = useRef<THREE.Group>(null);
  const { scene } = useLoader(GLTFLoader, LAB_MODEL_GLB, loader => {
    const draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_DECODER_PATH);
    loader.setDRACOLoader(draco);
  });

  const roomFrame = useMemo(() => {
    const background = scene.getObjectByName('lab_background');
    if (!background) throw new Error('Lab V02 is missing its background frame');
    const frame = new THREE.Matrix4();
    // Read asset-local transforms: matrixWorld includes our presentation group
    // after mount and must not be fed back into a breakpoint/resize update.
    let object: THREE.Object3D | null = background;
    while (object) {
      if (object.matrixAutoUpdate) object.updateMatrix();
      frame.premultiply(object.matrix);
      if (object === scene) break;
      object = object.parent;
    }
    return frame;
  }, [scene]);

  // The improved export retains the original asset coordinates. Use the
  // author's existing portfolio transform for both the room and avatar.
  const placement = introMatrix;

  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(-1, 1, 1);
    return target;
  }, []);

  useLayoutEffect(() => {
    const originalTransmissionResolution = gl.transmissionResolutionScale;
    // Preserve the exported glass; reduce only the refraction buffer size.
    gl.transmissionResolutionScale = .25;
    const originals = new Map<THREE.Mesh, { material: THREE.Material | THREE.Material[]; cast: boolean; receive: boolean; geometry: THREE.BufferGeometry }>();
    const materials = new Map<THREE.Material, THREE.Material>();
    const cutawayGeometries: THREE.BufferGeometry[] = [];
    const background = scene.getObjectByName('lab_background');
    scene.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      originals.set(object, { material: object.material, cast: object.castShadow, receive: object.receiveShadow, geometry: object.geometry });
      const prepare = (original: THREE.Material) => {
        if (materials.has(original)) return materials.get(original)!;
        const material = original.clone();
        if (material.name.includes('Ceiling interior')) material.visible = false;
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = .4;
          // Baked equipment stays recognizable, with reflected light replacing
          // the flat glow. Architecture keeps its normal/roughness textures.
          if (!material.name.startsWith('V02 ')) material.emissiveIntensity = .45;
          if (material.name.includes('Brushed stainless')) {
            material.color.set('#a6b5bf');
            material.roughness = .27;
            material.metalness = .85;
          }
          if (material.name.includes('Epoxy floor')) {
            material.color.set('#b2c1c7');
            material.roughness = .34;
          }
          if (material.name.includes('Satin wall')) material.color.set('#d2dde1');
          if (material.name.includes('Linear luminaire')) material.emissiveIntensity = 2.2;
          if (material instanceof THREE.MeshPhysicalMaterial && material.transmission > 0) {
            material.color.set(material.map ? '#ffffff' : '#79bac7');
            material.roughness = .12;
            material.metalness = 0;
            material.transmission = .62;
            material.ior = 1.45;
            material.clearcoat = .4;
            material.clearcoatRoughness = .12;
            material.emissiveIntensity = material.map ? .55 : .08;
            material.envMapIntensity = 1.1;
            if (material.map) material.transmission = .32;
          }
        }
        materials.set(original, material);
        return material;
      };
      const source = Array.isArray(object.material) ? object.material : [object.material];
      object.castShadow = !source.some(material => material.name.includes('Ceiling interior'));
      object.receiveShadow = true;
      // The author views the room from negative Z. Cut away that foreground
      // wall, preserving the original equipment pose and the complete floor.
      if (source.some(material => material.name.startsWith('V02 ') &&
          !/Epoxy floor|Slab edge|Inlaid safety|Ceiling interior/.test(material.name))) {
        const toRoom = new THREE.Matrix4();
        let node: THREE.Object3D | null = object;
        while (node && node !== background) {
          node.updateMatrix();
          toRoom.premultiply(node.matrix);
          node = node.parent;
        }
        const geometry = object.geometry;
        const positions = geometry.getAttribute('position');
        const index = geometry.getIndex();
        const count = index ? index.count : positions.count;
        const keep: number[] = [];
        const point = new THREE.Vector3();
        for (let i = 0; i < count; i += 3) {
          const ids = [0, 1, 2].map(offset => index ? index.getX(i + offset) : i + offset);
          if (!ids.every(id => point.fromBufferAttribute(positions, id).applyMatrix4(toRoom).z < -6.25)) keep.push(...ids);
        }
        if (keep.length !== count) {
          const cutaway = geometry.clone();
          cutaway.setIndex(keep);
          cutaway.computeBoundingBox();
          cutaway.computeBoundingSphere();
          object.geometry = cutaway;
          cutawayGeometries.push(cutaway);
        }
      }
      object.material = Array.isArray(object.material) ? object.material.map(prepare) : prepare(object.material);
    });
    return () => {
      originals.forEach((original, object) => {
        object.material = original.material;
        object.geometry = original.geometry;
        object.castShadow = original.cast;
        object.receiveShadow = original.receive;
      });
      materials.forEach(material => material.dispose());
      cutawayGeometries.forEach(geometry => geometry.dispose());
      gl.transmissionResolutionScale = originalTransmissionResolution;
    };
  }, [scene, gl]);

  useEffect(() => {
    let cancelled = false;
    // Retain the warmup material so its hologram program stays in the cache.
    let wire: THREE.MeshBasicMaterial | undefined;
    useSettingStore.getState().setSceneReady(false);
    // Defer past Strict Mode's setup/cleanup replay. This first shaded draw
    // happens behind the loading overlay, before page/menu animations begin.
    queueMicrotask(() => {
      if (cancelled || !lightRig.current) return;
      const warmup = get().scene;
      const lights = lightRig.current;
      const modelVisible = scene.visible;
      const lightsVisible = lights.visible;
      const avatarMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
      const previousTarget = gl.getRenderTarget();
      try {
        scene.visible = lights.visible = true;
        warmup.updateMatrixWorld(true);
        gl.setRenderTarget(null);
        gl.compile(warmup, get().camera);
        gl.render(warmup, get().camera);
        // The avatar's normal and hologram shaders also change lighting
        // variants in the lab. Prepare both before the first page transition.
        wire = new THREE.MeshBasicMaterial({ color: '#ffaa00', wireframe: true });
        for (const name of ['Object_3001', 'Object_3002']) {
          const mesh = warmup.getObjectByName(name);
          if (!(mesh instanceof THREE.Mesh)) continue;
          avatarMaterials.set(mesh, mesh.material);
          mesh.material = wire;
        }
        gl.compile(warmup, get().camera);
        gl.render(warmup, get().camera);
        useSettingStore.getState().setSceneReady(true);
      } catch {
        useSettingStore.getState().enterBasicMode('Lab rendering failed');
      } finally {
        gl.setRenderTarget(previousTarget);
        scene.visible = modelVisible;
        lights.visible = lightsVisible;
        avatarMaterials.forEach((material, mesh) => { mesh.material = material; });
      }
    });
    return () => {
      cancelled = true;
      wire?.dispose();
      useSettingStore.getState().setSceneReady(false);
    };
  }, [gl, scene, get]);

  useLayoutEffect(() => {
    if (keyLight.current) keyLight.current.shadow.needsUpdate = true;
  }, [placement, isMobile]);

  return (
    <group name='portfolio-lab-v02' matrix={placement} matrixAutoUpdate={false}>
      {/* Both rooms stay rendered in the shared, double-height canvas. */}
      <group name='lab-scenery' visible={!hideScenery}>
        <primitive object={scene} visible dispose={null} />
        {BUBBLE_POSITIONS.map((position, index) => <Bubbles key={index} position={position} />)}
      </group>
      <group>{children}</group>
      <group ref={lightRig} matrix={roomFrame} matrixAutoUpdate={false} visible>
        <primitive object={lightTarget} />
        <spotLight
          ref={keyLight}
          position={[6, 7.5, 2]} target={lightTarget} color='#e4f1ff' intensity={220}
          distance={22} angle={1} penumbra={.65} decay={2}
          castShadow shadow-autoUpdate={false}
          shadow-mapSize-width={isMobile ? 512 : 1024} shadow-mapSize-height={isMobile ? 512 : 1024}
          shadow-camera-near={.5} shadow-camera-far={22} shadow-bias={-.00015} shadow-normalBias={.025}
        />
        <rectAreaLight position={[-5, 5, 7]}
          color='#ffe9cf' intensity={1.8} width={5} height={4} />
        {([[-3, 3], [2, -1]] as const).map(([x, z]) => (
          <rectAreaLight key={`${x},${z}`} position={[x, 8.06, z]} rotation={[-Math.PI / 2, 0, 0]}
            color='#d9efff' intensity={5.5} width={1.1} height={4.43} />
        ))}
      </group>
    </group>
  );
}

const BUBBLE_POSITIONS = [
  [4.1687, -6.8497, -1.7472],
  [4.439, -7.0102, -.8573],
  [4.8597, -6.4299, -.6849],
  [3.8687, -6.0447, -.9829],
  [4.2313, -6.4428, -1.1091],
];

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(10, 5, 14);
