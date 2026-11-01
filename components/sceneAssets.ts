import { useProgress } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const ENVIRONMENT_MODEL_GLB = '/models/envModel.glb';
export const AVATAR_MODEL_GLB = '/models/avataModel.glb';
export const LAB_MODEL_GLB = '/models/lab-v02.glb';
export const STUDIO_BAKED_TEXTURE = '/models/studio-baked-2k.webp';
export const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/v1/decoders/';
export const KTX2_TRANSCODER_PATH = '/ktx2/';
const SCENE_CODEC_URLS = [
  `${DRACO_DECODER_PATH}draco_decoder.wasm`,
  `${DRACO_DECODER_PATH}draco_wasm_wrapper.js`,
  `${DRACO_DECODER_PATH}draco_decoder.js`,
  `${KTX2_TRANSCODER_PATH}basis_transcoder.wasm`,
  `${KTX2_TRANSCODER_PATH}basis_transcoder.js`,
];
export const SHADOW_TEXTURES = [
  '/models/wallShadow_transparent.webp',
  '/models/groundShadow_transparent.webp',
];
export const FACE_TEXTURES = [
  '/face/normal8.webp',
  '/face/wave7.webp',
  '/face/surprise4.webp',
];
export const MUSIC_TEXTURES = [1, 2, 3, 4, 5].map(n => `/music/music_${n}.webp`);

export function prepareSceneRetry() {
  const errors = useProgress.getState().errors;
  const failed = (url: string) => errors.some(error =>
    new URL(error, window.location.href).href === new URL(url, window.location.href).href
  );
  const failedCodecs = SCENE_CODEC_URLS.filter(failed);
  const cleared = new Set<string>(failedCodecs);
  // The intro GLBs use Draco and KTX2; Lab V02 uses Draco and embedded WebP.
  // Clear only models that depend on the failed decoder or failed themselves.
  for (const url of [ENVIRONMENT_MODEL_GLB, AVATAR_MODEL_GLB, LAB_MODEL_GLB]) {
    const codecFailed = failedCodecs.some(codec => url !== LAB_MODEL_GLB || codec.startsWith(DRACO_DECODER_PATH));
    if (!failed(url) && !codecFailed) continue;
    useLoader.clear(GLTFLoader, url);
    cleared.add(url);
  }
  // Fiber keys array loads as one entry, not one entry per texture.
  for (const input of [SHADOW_TEXTURES, FACE_TEXTURES, STUDIO_BAKED_TEXTURE, ...MUSIC_TEXTURES]) {
    const urls = Array.isArray(input) ? input : [input];
    if (!urls.some(failed)) continue;
    useLoader.clear(TextureLoader, input);
    urls.forEach(url => cleared.add(url));
  }
  // Keep independent cache entries and unrelated loading errors intact.
  useProgress.setState({ errors: errors.filter(error => ![...cleared].some(url =>
    new URL(error, window.location.href).href === new URL(url, window.location.href).href
  )) });
}
