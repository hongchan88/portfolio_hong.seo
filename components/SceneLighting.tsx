'use client';

import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

/** One reflection environment for both rooms, prepared before shader warmup. */
export default function SceneLighting() {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    RectAreaLightUniformsLib.init();
    const previous = scene.environment;
    const previousExposure = gl.toneMappingExposure;
    gl.toneMappingExposure = .72;
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const reflection = generator.fromScene(room, .04);
    generator.dispose();
    room.dispose();
    scene.environment = reflection.texture;
    return () => {
      scene.environment = previous;
      gl.toneMappingExposure = previousExposure;
      reflection.dispose();
    };
  }, [gl, scene]);

  return <hemisphereLight args={['#edf3ff', '#746a59', .32]} />;
}
