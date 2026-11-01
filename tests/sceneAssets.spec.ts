import { expect, test } from '@playwright/test';
import { useProgress } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import { AVATAR_MODEL_GLB, ENVIRONMENT_MODEL_GLB, LAB_MODEL_GLB, STUDIO_BAKED_TEXTURE, prepareSceneRetry } from '../components/sceneAssets';

test('scene codec retry clears dependent GLTF keys and preserves unrelated errors and texture caches', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalClear = useLoader.clear;
  const originalErrors = useProgress.getState().errors;
  const cleared: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { location: { href: 'http://127.0.0.1:18000/' } },
  });
  useLoader.clear = (loader, input) => { cleared.push([loader, input]); };
  try {
    for (const decoder of [
      'https://www.gstatic.com/draco/v1/decoders/draco_decoder.wasm',
      'https://www.gstatic.com/draco/v1/decoders/draco_wasm_wrapper.js',
      'https://www.gstatic.com/draco/v1/decoders/draco_decoder.js',
      'http://127.0.0.1:18000/ktx2/basis_transcoder.wasm',
      '/ktx2/basis_transcoder.js',
    ]) {
      const unrelated = ['/other/model.glb', '/other/texture.webp', 'https://other.example/draco_decoder.wasm'];
      useProgress.setState({ errors: [decoder, ENVIRONMENT_MODEL_GLB, ...unrelated] });
      cleared.length = 0;
      prepareSceneRetry();
      expect(cleared).toEqual([
        [GLTFLoader, ENVIRONMENT_MODEL_GLB],
        [GLTFLoader, AVATAR_MODEL_GLB],
        ...(decoder.includes('/draco/') ? [[GLTFLoader, LAB_MODEL_GLB]] : []),
      ]);
      expect(useProgress.getState().errors).toEqual(unrelated);
    }
    cleared.length = 0;
    useProgress.setState({ errors: [LAB_MODEL_GLB] });
    prepareSceneRetry();
    expect(cleared).toEqual([[GLTFLoader, LAB_MODEL_GLB]]);
    expect(useProgress.getState().errors).toEqual([]);
    cleared.length = 0;
    useProgress.setState({ errors: [STUDIO_BAKED_TEXTURE] });
    prepareSceneRetry();
    expect(cleared).toEqual([[TextureLoader, STUDIO_BAKED_TEXTURE]]);
    expect(useProgress.getState().errors).toEqual([]);
  } finally {
    useLoader.clear = originalClear;
    useProgress.setState({ errors: originalErrors });
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
