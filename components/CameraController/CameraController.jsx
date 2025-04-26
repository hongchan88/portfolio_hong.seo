import { useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useCameraStore } from '../../app/stores/cameraStore';
import { useThree } from '@react-three/fiber';
import { useSettingStore } from '../../app/stores/settingStore';

export default function CameraController() {
  const { camPos, zoom, camRotatePos } = useCameraStore();
  const { currentStage, rightDrawerToggle } = useSettingStore();
  const { camera } = useThree();
  // useEffect(() => {
  //   camera.rotation.set(
  //     Math.PI * camRotatePos[0], //Math.PI *
  //     Math.PI * camRotatePos[1],
  //     Math.PI * camRotatePos[2]
  //   ); // or just:
  //   // camera.rotation.set(0, Math.PI * 0.1, 0);
  // }, [camRotatePos]);

  camera.lookAt(0, 0, 0);
  useEffect(() => {
    if (!camera) return;
    // animate camera position

    console.log('currentstate and right');
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

    // gsap.to(camera.position, {
    //   x: camPos[0],
    //   y: camPos[1],
    //   z: camPos[2],
    //   duration: 2,
    //   ease: 'power2.out',
    //   onComplete: () => {
    //     // console.log(rightDrawerToggle, 'right toggle ');
    //     if (currentStage === 1 && rightDrawerToggle) {
    //       // camera.lookAt(-9, -4, 5);
    //       camera.rotation.set(Math.PI * 0.22, Math.PI * -0.38, Math.PI * 0.34);
    //       // camera.fov = 90; // default is 1
    //       // camera.updateProjectionMatrix();
    //     } else {
    //       camera.lookAt(0, 0, 0);
    //     }
    //   },
    // });
  }, [camPos, camRotatePos, rightDrawerToggle, currentStage]);
  useEffect(() => {
    // animate zoom / FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      gsap.to(camera, {
        fov: zoom,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [zoom]); // ensure re-runs

  return null;
}
