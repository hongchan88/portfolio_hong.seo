import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function MusicNoteAnimation() {
  const textures = [
    useLoader(TextureLoader, '/music/music_1.png'),
    useLoader(TextureLoader, '/music/music_2.png'),
    useLoader(TextureLoader, '/music/music_3.png'),
    useLoader(TextureLoader, '/music/music_4.png'),
    useLoader(TextureLoader, '/music/music_5.png'),
  ];

  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const startPosition: [number, number, number] = [4.24, 3.03, -2.26];

  useGSAP(
    () => {
      if (!meshRef.current) return;
      const mesh = meshRef.current;
      const material = mesh.material as THREE.MeshBasicMaterial;

      let textureIndex = 0;

      const animate = () => {
        if (!mesh) return;

        // 현재 texture 적용
        material.map = textures[textureIndex];
        material.needsUpdate = true;

        // 시작 위치 리셋
        mesh.position.set(startPosition[0], startPosition[1], startPosition[2]);
        material.opacity = 1;

        const tl = gsap.timeline({
          onComplete: () => {
            // 다음 texture로 넘어가기
            textureIndex = (textureIndex + 1) % textures.length;
            animate(); // 다시 애니메이션 시작
          },
        });

        // y축 올라가기
        tl.to(mesh.position, {
          y: startPosition[1] + 2,
          duration: 2,
          ease: 'power1.out',
          onUpdate: () => {
            mesh.lookAt(camera.position);
          },
        });

        // x축 좌우 흔들기
        gsap.to(mesh.position, {
          x: startPosition[0] + (Math.random() * 1.2 - 0.3),
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // opacity 줄이기
        tl.to(material, {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.out',
        });
      };

      animate(); // 처음 애니메이션 시작
    },
    { scope: meshRef }
  );

  return (
    <mesh ref={meshRef} position={[4.24, 3.03, -2.26]}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial transparent />
    </mesh>
  );
}
