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

Normal mode retains the animated introduction, two stages, pinned biography and project timeline. **Skip animation / basic version** opens independent, normal-flow content. Reduced motion, unavailable WebGL and scene/asset failures also use basic mode. Audio starts muted. Biography HTML mirrors `public/aboutme/aboutMeFill.webp`; update both when editing owner-approved facts.

## Tests

```sh
yarn test
```

Playwright uses installed Chrome, software WebGL and a separate loopback server on port 18000. It writes to ignored `test-results/`; `NEXT_TEST_BUILD=1` isolates Next output in `.next-test/`, leaving normal development output alone. Do not reuse an unrelated server on that test port.

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
