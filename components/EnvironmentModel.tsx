'use client';
import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import gsap from 'gsap/all';
import Bubbles from './Bubble';

type ModelProps = {
  url: string;
  currentStage: number;
  isScrollingScreen: boolean;
};

export function Model({ url, currentStage, isScrollingScreen }: ModelProps) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene, materials } = useGLTF(url);

  // 1) On mount, load & apply baked shadow to plane named "plane"
  useEffect(() => {
    if (!scene) return;

    // Delay to ensure the scene is fully loaded
    const loader = new THREE.TextureLoader();
    // Replace with your actual baked shadow PNG path
    const shadowTexture = loader.load(
      '/models/wallShadow_transparent6.png',
      (texture) => {
        texture.flipY = false; // Fix upside-down issue
        texture.needsUpdate = true;
      }
    );
    const groundShadow = loader.load(
      '/models/groundShadow_transparent3.png',
      (texture) => {
        texture.flipY = false; // Fix upside-down issue
        texture.needsUpdate = true;
      }
    );
    const labWallGround = loader.load(
      '/models/labwallGround_transparent.png'
      // (texture) => {
      //   // texture.flipY = false; // Fix upside-down issue
      //   // texture.needsUpdate = true;
      // }
    );

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.isMesh && child.name === 'wall') {
          console.log(`Applying baked shadow to: ${child.name}`);

          child.material = new THREE.MeshStandardMaterial({
            map: shadowTexture,
            transparent: true, // Enable transparency
            opacity: 0.1, // Fully visible texture
            depthWrite: false, // Prevents z-fighting issues
          });

          // Boost the shadow contrast and opacity
          // child.material.color.setRGB(0, 0, 0); // Darken the shadow
          // child.material.color.multiplyScalar(1); // Increase shadow intensity

          child.material.needsUpdate = true;
        }
        if (child.isMesh && child.name === 'ground') {
          console.log(`Applying baked shadow to: ${child.name}`);
          child.material = new THREE.MeshStandardMaterial({
            map: groundShadow,
            transparent: true, // Enable transparency
            opacity: 0.1, // Fully visible texture
            depthWrite: false, // Prevents z-fighting issues
          });

          // Boost the shadow contrast and opacity
          // child.material.color.setRGB(0, 0, 0); // Darken the shadow
          // child.material.color.multiplyScalar(1); // Increase shadow intensity

          child.material.needsUpdate = true;
        }
        if (child.isMesh && child.name === 'lab_ground_wall') {
          console.log(`Applying baked shadow to: ${child.name}`);
          child.material = new THREE.MeshStandardMaterial({
            map: labWallGround,
            transparent: true, // Enable transparency
            opacity: 0.2, // Fully visible texture
            depthWrite: false, // Prevents z-fighting issues
          });

          // Boost the shadow contrast and opacity
          // child.material.color.setRGB(0, 0, 0); // Darken the shadow
          // child.material.color.multiplyScalar(1); // Increase shadow intensity

          child.material.needsUpdate = true;
        }
      }
    });

    // Force a re-render if needed
    // gl.render(scene, (gl as any).camera);
  }, [scene]);
  const scrollTl = useRef(null);

  useEffect(() => {
    const material = materials['Material.002'];
    if (material instanceof THREE.MeshStandardMaterial) {
      // material.emissive = new THREE.Color(0xffffff);
      // material.emissiveIntensity = 1;
      if (!material.emissiveMap.offset) return;

      if (!scrollTl.current) {
        // 👇 create timeline once
        scrollTl.current = gsap.timeline({ repeat: -1, paused: true });

        scrollTl.current.to(material.emissiveMap.offset, {
          y: '-=1', // scroll direction/speed
          duration: 10,
          ease: 'none',
        });
      }

      // 👇 control playback without restarting
      if (isScrollingScreen) {
        scrollTl.current.resume();
      } else {
        scrollTl.current.pause();
      }

      return () => {
        // optional cleanup
        // scrollTl.current?.kill();
      };
    }
  }, [isScrollingScreen, materials]);

  console.log(isScrollingScreen, 'isScrollingScreen');

  //   if (currentFrame <= 1094) {
  //     const shouldScroll = scrollFrameRanges.some(
  //       ({ start, end }) => currentFrame >= start && currentFrame <= end
  //     );
  //     if (shouldScroll) {
  //       material.map.offset.y += scrollSpeed / fps;
  //     }
  //   } else {
  //     const offset = (currentFrame - 1094) % repeatCycle;
  //     const shouldScroll = repeatedIntervals.some(
  //       ({ start, end }) => offset >= start && offset <= end
  //     );
  //     if (shouldScroll) {
  //       material.map.offset.y += scrollSpeed / fps;
  //     }
  //   }
  //   material.map.needsUpdate = true;
  // });

  // 3) Existing delayed animations
  // useEffect(() => {
  //   const environmentAction = actions['Action'];
  //   const chairAction = actions['Action.005'];
  //   const carpetAction = actions['Action.004'];
  //   const tableAction = actions['table'];
  //   const tableAction2 = actions['tableScale'];

  //   if (currentStage === 0) {
  //     const chairGroup = scene.getObjectByName('room_obj'); // Now this will work!
  //     console.log(chairGroup, 'chairGroup');
  //     gsap.to(chairGroup.scale, {
  //       x: 1,
  //       y: 1,
  //       z: 1,
  //       duration: 1,
  //       ease: 'elastic.out(1, 0.3)',
  //     });
  //     // const playAction = (action: THREE.AnimationAction | undefined) => {
  //     //   if (action) {
  //     //     action.reset().setLoop(THREE.LoopOnce, 1);
  //     //     action.clampWhenFinished = true;
  //     //     action.play();
  //     //   } else {
  //     //     console.warn('Animation not found.');
  //     //   }
  //     // };

  //     // const firstPopAnimation = setTimeout(
  //     //   () => {
  //     //     playAction(environmentAction);
  //     //     playAction(chairAction);
  //     //     playAction(carpetAction);
  //     //   },
  //     //   (10 / fps) * 1000
  //     // );

  //     // const secondPopAnimation = setTimeout(
  //     //   () => {
  //     //     playAction(tableAction);
  //     //     playAction(tableAction2);
  //     //   },
  //     //   (15 / fps) * 1000
  //     // );
  //     // return () => {
  //     //   clearTimeout(firstPopAnimation);
  //     //   clearTimeout(secondPopAnimation);
  //     // };
  //   } else if (currentStage === 1) {
  //     const chairGroup = scene.getObjectByName('room_obj'); // Now this will work!

  //     gsap.to(chairGroup.scale, {
  //       x: 0,
  //       y: 0,
  //       z: 0,
  //       duration: 1,
  //       ease: 'elastic.out(1, 0.3)',
  //     });
  //   }
  // }, [currentStage, actions]);
  useEffect(() => {
    const roomObjGrop = scene.getObjectByName('room_obj');
    const wallObjGroup = scene.getObjectByName('wall_obj');
    const wallShadow = scene.getObjectByName('wall');
    if (!roomObjGrop || !wallObjGroup || !wallShadow) {
      console.warn('Groups not found');
      return;
    }
    if (
      wallShadow instanceof THREE.Mesh &&
      wallObjGroup instanceof THREE.Object3D &&
      roomObjGrop instanceof THREE.Object3D
    ) {
      gsap.killTweensOf([
        roomObjGrop.scale,
        wallObjGroup.scale,
        wallShadow.material,
      ]);

      if (currentStage === 0) {
        wallShadow.material.transparent = true;

        // Animate opacity to 0 with GSAP
        gsap.to(wallShadow.material, {
          opacity: 0.1,
          duration: 1,
          delay: 1.5,
          ease: 'power1.inOut',
          overwrite: 'auto',
        });
        gsap.to(roomObjGrop.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          ease: 'back.out(1.7)',
          overwrite: 'auto',
        });

        gsap.to(wallObjGroup.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          delay: 0.2,
          ease: 'back.out(1.7)',
          overwrite: 'auto',
        });
      } else if (currentStage > 0) {
        gsap.to(wallShadow.material, {
          opacity: 0,
          duration: 2,
          delay: 0.2,
          ease: 'power1.inOut',
          overwrite: 'auto',
        });
        gsap.to(roomObjGrop.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: 'back.in(1.7)',
          overwrite: 'auto',
        });
        gsap.to(wallObjGroup.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          delay: 0.2,
          ease: 'back.in(1.7)',
          overwrite: 'auto',
        });
      }
    }
  }, [currentStage]);

  return (
    <>
      <primitive ref={modelRef} object={scene} dispose={null} />
      <>
        {bubblePositions.map((bubble, index) => (
          <Bubbles
            key={index}
            position={[bubble.position.x, bubble.position.y, bubble.position.z]}
          />
        ))}
      </>
    </>
  );
}

export function CameraController() {
  const { camera } = useThree();
  const { cx, cy, cz } = useControls('Camera Transform', {
    cx: { value: 12, step: 1 },
    cy: { value: 7, step: 1 },
    cz: { value: -7, step: 1 },
  });

  useFrame(() => {
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

const bubblePositions = [
  {
    position: {
      x: 4.168744956725958,
      y: -6.849726303885316,
      z: -1.747246591705774,
    },
  },
  {
    position: {
      x: 4.438973195914258,
      y: -7.010245075865521,
      z: -0.8572527277518798,
    },
  },
  {
    position: {
      x: 4.859730145419918,
      y: -6.4298724530674765,
      z: -0.6849134884143633,
    },
  },
  {
    position: {
      x: 3.8687272046964516,
      y: -6.044663900720722,
      z: -0.9829454119623455,
    },
  },
  {
    position: {
      x: 4.231327699347807,
      y: -6.442769149945077,
      z: -1.1091074404467833,
    },
  },
];
