import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

export default function CameraController({
  cameraPos = [10, 5, 14],
  zoom = 70,
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!camera) return;

    // animate camera position
    gsap.to(camera.position, {
      x: cameraPos[0],
      y: cameraPos[1],
      z: cameraPos[2],
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
      },
    });

    // animate zoom / FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      gsap.to(camera, {
        fov: zoom,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [cameraPos.toString(), zoom]); // ensure re-runs

  return null;
}
