import { expect, test } from '@playwright/test';
import gsap from 'gsap';
import * as THREE from 'three';
import { createBubbleAnimation } from '../components/Bubble/createBubbleAnimation';

test('Bubble removes both owned infinite tweens on cleanup', () => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshBasicMaterial()
  );
  const unrelated = gsap.to({ x: 0 }, { x: 1, duration: 10 });
  for (let mount = 0; mount < 5; mount++) {
    const cleanup = createBubbleAnimation(mesh);
    expect(gsap.getTweensOf(mesh.position)).toHaveLength(1);
    expect(gsap.getTweensOf(mesh.material)).toHaveLength(1);
    cleanup();
    expect(gsap.getTweensOf(mesh.position)).toHaveLength(0);
    expect(gsap.getTweensOf(mesh.material)).toHaveLength(0);
  }
  expect(unrelated.parent).not.toBeNull();
  unrelated.kill();
  mesh.geometry.dispose();
  mesh.material.dispose();
});
