import { useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useCameraStore } from '../../app/stores/cameraStore';
import { useThree } from '@react-three/fiber';
import { useSettingStore } from '../../app/stores/settingStore';

export default function CameraController() {
  const zoom = useCameraStore((s) => s.zoom);
  const camPos = useCameraStore((s) => s.camPos);
  const mobileZoom = useCameraStore((s) => s.mobileZoom);
  const isMobile = useSettingStore((s) => s.isMobile);
  const { camera } = useThree();

  camera.lookAt(0, 0, 0);
  useEffect(() => {
    if (!camera) return;
    // animate camera position

    const tl = gsap.timeline();
    tl.to(
      camera.position,

      {
        // x: -13,
        // y: -3,
        // z: -3,
        x: camPos[0],
        y: camPos[1],
        z: camPos[2],
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          // usine roration to align . but gsap to this point does not work
          // rotation to disable lookat
          // camera.rotation.set(
          //   Math.PI * 0.22,
          //   Math.PI * -0.38,
          //   Math.PI * 0.34
          // );
        },
      }
    );
  }, [camPos]);
  useEffect(() => {
    // animate zoom / FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      gsap.to(camera, {
        fov: isMobile ? mobileZoom : zoom,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [zoom, mobileZoom]); // ensure re-runs

  return null;
}
