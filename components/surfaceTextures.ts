import { DataTexture, LinearFilter, RepeatWrapping, RGBAFormat } from 'three';

/** Small, deterministic surface detail; no extra download or render pass. */
export function createSurfaceTexture(kind: 'wood' | 'fabric') {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  let seed = 173;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 4294967296;
      const grain = Math.sin(x * .7 + Math.sin(y * Math.PI * 2 / size) * 1.8);
      const value = kind === 'wood'
        ? Math.round(206 + grain * 18 + noise * 15)
        : Math.round(180 + (x % 2 === y % 2 ? 24 : 0) + noise * 30);
      const offset = (y * size + x) * 4;
      data[offset] = data[offset + 1] = data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.magFilter = texture.minFilter = LinearFilter;
  texture.repeat.set(kind === 'wood' ? 2 : 12, kind === 'wood' ? 2 : 12);
  texture.needsUpdate = true;
  return texture;
}
