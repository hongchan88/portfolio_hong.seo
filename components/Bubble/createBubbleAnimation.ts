import gsap from 'gsap';
import * as THREE from 'three';

export function createBubbleAnimation(mesh: THREE.Mesh) {
  const delay = Math.random() * 2;
  const rise = gsap.to(mesh.position, {
    y: mesh.position.y + 1.9,
    duration: 2,
    repeat: -1,
    ease: 'power1.out',
    delay,
  });
  const fade = gsap.to(mesh.material, {
    opacity: 0,
    duration: 2,
    repeat: -1,
    ease: 'power1.out',
    delay,
  });
  return () => {
    rise.kill();
    fade.kill();
  };
}
