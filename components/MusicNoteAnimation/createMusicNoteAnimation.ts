import gsap from 'gsap';
import * as THREE from 'three';

export function createMusicNoteAnimation(
  mesh: THREE.Mesh,
  camera: THREE.Camera,
  textures: THREE.Texture[],
  startPosition: [number, number, number]
) {
  const material = mesh.material as THREE.MeshBasicMaterial;
  let textureIndex = 0;
  const updateTexture = () => {
    material.map = textures[textureIndex];
    material.needsUpdate = true;
    textureIndex = (textureIndex + 1) % textures.length;
  };
  updateTexture();
  mesh.position.set(...startPosition);
  // One repeating timeline owns every tween. No work is spawned on completion.
  const timeline = gsap.timeline({
    repeat: -1,
    repeatRefresh: true,
    onRepeat: updateTexture,
  });
  timeline.fromTo(
    mesh.position,
    { y: startPosition[1] },
    {
      y: startPosition[1] + 2,
      duration: 2,
      ease: 'power1.out',
      onUpdate: () => mesh.lookAt(camera.position),
    },
    0
  );
  timeline.fromTo(
    mesh.position,
    { x: startPosition[0] },
    {
      x: () => startPosition[0] + Math.random() * 1.2 - 0.3,
      duration: 1,
      repeat: 1,
      yoyo: true,
      ease: 'sine.inOut',
    },
    0
  );
  timeline.fromTo(
    material,
    { opacity: 1 },
    { opacity: 0, duration: 0.5, ease: 'power1.out' },
    2
  );
  return () => {
    timeline.kill();
  };
}
