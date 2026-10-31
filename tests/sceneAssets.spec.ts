import { expect, test } from '@playwright/test';
import { useProgress } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AVATAR_MODEL_GLB, ENVIRONMENT_MODEL_GLB, prepareSceneRetry } from '../components/sceneAssets';

test('scene codec retry clears only two associated GLTF keys and preserves unrelated errors and texture caches', () => {
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
      ]);
      expect(useProgress.getState().errors).toEqual(unrelated);
    }
  } finally {
    useLoader.clear = originalClear;
    useProgress.setState({ errors: originalErrors });
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
