import { expect, test } from '@playwright/test';
import gsap from 'gsap';
import * as THREE from 'three';
import { createMusicNoteAnimation } from '../components/MusicNoteAnimation/createMusicNoteAnimation';

test('MusicNoteAnimation remains bounded across cycles and removes owned tweens', () => {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
  );
  const camera = new THREE.PerspectiveCamera();
  const textures = [new THREE.Texture(), new THREE.Texture()];
  const cleanup = createMusicNoteAnimation(
    mesh,
    camera,
    textures,
    [4.24, 3.03, -2.26]
  );
  gsap.ticker.sleep();
  const children = () => gsap.globalTimeline.getChildren(true, true, true);
  const initialCount = children().length;
  const start = gsap.globalTimeline.time();
  try {
    for (let cycle = 1; cycle <= 30; cycle++)
      gsap.globalTimeline.time(start + cycle * 3);
    expect(children().length).toBeLessThanOrEqual(initialCount);
    expect(textures).toContain(mesh.material.map);
  } finally {
    cleanup();
  }
  expect(gsap.getTweensOf(mesh.position)).toHaveLength(0);
  expect(gsap.getTweensOf(mesh.material)).toHaveLength(0);
  mesh.geometry.dispose();
  mesh.material.dispose();
  textures.forEach((texture) => texture.dispose());
});
