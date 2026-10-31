import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { MUSIC_TEXTURES } from '../sceneAssets';
import { useRef } from 'react';
import * as THREE from 'three';
import { createMusicNoteAnimation } from './createMusicNoteAnimation';
import { useGSAP } from '@gsap/react';
import { useSettingStore } from '@store/settingStore';

export function MusicNoteAnimation() {
  const isMobile = useSettingStore((s) => s.isMobile);
  const textures = [
    useLoader(TextureLoader, MUSIC_TEXTURES[0]),
    useLoader(TextureLoader, MUSIC_TEXTURES[1]),
    useLoader(TextureLoader, MUSIC_TEXTURES[2]),
    useLoader(TextureLoader, MUSIC_TEXTURES[3]),
    useLoader(TextureLoader, MUSIC_TEXTURES[4]),
  ];

  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const startPosition: [number, number, number] = isMobile
    ? [2.24, 6.93, -1.26]
    : [4.24, 3.03, -2.26];

  useGSAP(
    () => {
      if (!meshRef.current) return;
      const mesh = meshRef.current;

      return createMusicNoteAnimation(mesh, camera, textures, startPosition);
    },
    { scope: meshRef, dependencies: [isMobile], revertOnUpdate: true }
  );

  return (
    <mesh ref={meshRef} position={[4.24, 3.03, -2.26]}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial transparent />
    </mesh>
  );
}
