# Hong Seo portfolio

Next.js, React Three Fiber/Drei, Three.js, GSAP, Motion and Tailwind CSS.

Live site: https://portfolio-hong-seo.vercel.app/

## Local development

Use Node 22+ and Yarn 4.1.0 (package manager pinned in `package.json`). Validation used Node 26.10.0.

```sh
yarn install --immutable
yarn dev # http://localhost:8000
yarn lint
yarn typecheck
yarn build
```

Normal mode retains the animated introduction, two stages, pinned biography and project timeline. **Skip animation / basic version** opens independent, normal-flow content. Reduced motion, unavailable WebGL and scene/asset failures also use basic mode. Audio starts muted.

Edit owner-approved About copy in `components/Biography.tsx`. The animated version overlays only the text column of `public/aboutme/aboutMeFill.webp`, preserving the original flag, LEVEL UP, heart, frame and profile/skills artwork. The basic version uses the same copy in normal document flow. The overlay positions are tied to the original 1024×2200 artwork; check wrapping at desktop and mobile sizes when changing text length.

## Laboratory model

The second stage loads `public/models/lab-v02.glb` (1.4 MB), exported from `portfolio_lab_realistic_v02.blend`. It includes the equipment, panel walls, epoxy floor, ventilation, door and cutaway ceiling. The original `envModel.glb` remains the source of the intro room; its older laboratory is hidden.

`components/LabModel.tsx` uses the original portfolio camera and the same desktop/mobile position, rotation and scale as the original environment and avatar. The new GLB retains the original asset coordinates. No overview camera, view offset or automatic fitting is applied. Both rooms and their lighting stay rendered in the shared canvas from the initial load, with no stage-triggered reveal delay. Rendering is prepared behind the loading overlay. The original Blender sources and V01 files are preserved.

The web presentation applies physical materials at runtime: warm wood and fabric in the studio, cooler metal/glass in the laboratory, and shaded avatar materials that retain the animated face textures and hologram. `SceneLighting.tsx` creates one shared reflection environment without an HDR download; each room has local key/fill lights. `surfaceTextures.ts` supplies two small procedural surface textures. These changes do not overwrite the GLB or Blender sources. Runtime materials, textures and reflection targets are disposed and originals restored on unmount.

The studio picture, shelf and large plant use the original baked lighting instead of receiving a second lighting pass. Their `studio-baked-2k.webp` atlas (326 KB) is recovered from the packed 2048px texture in `final_envOnly_model_removeWallLab.blend`, replacing the GLB's 512px atlas for these props. Exposure and studio lighting are reduced. In the first-page menu, only lab scenery/bubbles are hidden; the avatar and lighting remain. The lab stays mounted and preloaded, and reappears after the camera returns to its normal view.

## Tests

```sh
yarn test
```

Playwright uses installed Chrome, software WebGL and a separate loopback server on port 18000. It writes to ignored `test-results/`; `NEXT_TEST_BUILD=1` isolates Next output in `.next-test/`, leaving normal development output alone. Do not reuse an unrelated server on that test port.

For animation timing checks on macOS, `PLAYWRIGHT_GPU=metal yarn test tests/avatar-face.spec.ts tests/lab-model.spec.ts` uses the hardware GPU. Software rendering of the physical materials can skip the short greeting-expression window; the geometry/preload tests also run with software WebGL.

If Chrome is unavailable, install project-local browser binaries with `yarn playwright install chromium` and run `PLAYWRIGHT_CHANNEL=chromium yarn test`.

Production browser check (stop only a test server you own before starting):

```sh
NEXT_TEST_BUILD=1 yarn build
PLAYWRIGHT_SERVER_COMMAND='NEXT_TEST_BUILD=1 yarn next start -H 127.0.0.1 -p 18000' yarn test
```

Tests exercise real model loading, desktop/mobile stages, pinning, keyboard/focus, 767/768px resize, navigation, reduced motion, missing assets/WebGL, rejected audio, and real GSAP/Three lifecycle behavior. External assets still require network access; failure tests deliberately abort only specified assets.

## Dependency/security checks

```sh
yarn npm audit --all --recursive
yarn npm audit --environment production --all --recursive
```

Audit is **not clean**. See [stability validation](docs/portfolio-stability-validation.md) for version choices, remaining upstream issues and red/green evidence. `gltfjsx` is a development-only model-generation tool; do not feed it untrusted files while its upstream Sharp dependency remains vulnerable.

No deployment, commit or push is part of these commands.
