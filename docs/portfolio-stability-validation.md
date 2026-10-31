# Portfolio stability validation — 2026-10-31

## Scope and progress

Base `4d864b5`, branch `improve/portfolio-stability`. Local working diff only; no commits, push, deployment, global settings changes or worktrees.

- Task 1 complete: registry/audit evidence, aligned runtime, test foundation, baseline captures.
- Task 2 complete: accessible skip/basic mode, reduced motion, asset/render/WebGL failure recovery.
- Task 3 complete: breakpoint subscription, stable camera defaults, GSAP remeasurement, keyboard drawer/focus.
- Task 4 complete: server metadata/client provider separation, contact links, equivalent biography HTML, tokens/icons/names/year/headings.
- Task 5 complete: bounded notes, owned tween/timer cleanup, explicit typing readiness, handled audio promises.
- Task 6 complete: same-protocol recovery corrected verified review findings; fresh production suite passes 31 tests. Final independent reviewer returned OK with no remaining must-fix in the correction scope.

Normal choreography retained: loading → avatar intro → stage 0/1 transition → pinned image biography → original project order and negative-margin layout. Basic mode does not reuse that negative-margin layout or mount scene, audio, observers, text flip or animated timeline. Camera positions/FOV presets remain unchanged. Default audio remains muted. Existing biography's “3+ years” and project dates/descriptions preserved, not updated or embellished.

## Registry and security decisions

Registry queried before runtime edits:

```sh
npm view next dist-tags --json
npm view next@15 version --json
npm view next@15.5.28 peerDependencies --json
npm view next@15.5.28 dependencies --json
npm view react dist-tags --json
npm view react@19.1 version --json
npm view @react-three/fiber@9.1.0 peerDependencies --json
npm view @react-three/drei@10.0.5 peerDependencies --json
npm view @types/react@19.1 version --json
npm view @types/react-dom@19.1 version --json
npm view leva@0.10.1 peerDependencies --json
```

Registry tagged Next **15.5.28** as `backport` (latest major was 16). Audit listed Next vulnerabilities through 15.5.27, including RSC, image optimization and Server Actions vulnerabilities. Selected patched Next 15 backport, not a speculative major migration. React/DOM **19.1.10** backport satisfies retained Fiber 9/Drei 10; React types 19.1.17/DOM types 19.1.11 match. Existing React18/Fiber9 peer conflict was confirmed by Yarn, but isolated baseline browser did render successfully: no claimed baseline React exception.

Import/config search proved unused direct packages: `@react-three/postprocessing`, `@tabler/icons-react`, `@use-gesture/react`, `react-rough-notation`, `three-stdlib`. Removed only direct entries; transitive requirements remain. `gltfjsx` retained dev-only. Leva 0.10.1 fixes React19 peer support; existing camera-debug hook retained. Text flip now imports direct `motion/react`, not transitive `framer-motion`.

Used `yarn up -R` only for audit-affected packages within existing dependency descriptors, not blanket major upgrades or forced resolutions:

```sh
yarn up -R @babel/runtime @eslint/plugin-kit @humanfs/node @isaacs/brace-expansion ajv brace-expansion browserslist colord eslint fflate flatted form-data glob ip-address js-yaml lodash micromatch minimatch nanoid picomatch postcss postcss-selector-parser source-map-js tar tmp ws yaml leva
```

Before: **129 audit entries**, including critical Next/form-data/tar issues, plus React peer mismatch. After: **11 entries**, no Next/React advisory or peer conflict:

| Scope | Remaining findings | Assessment |
| --- | --- | --- |
| Production dependency tree | 4 PostCSS advisories: `GHSA-qx2v-qp2m-jg93`, `GHSA-6g55-p6wh-862q`, `GHSA-fxqj-rqcc-2cmp`, `GHSA-r28c-9q8g-f849` | Next15.5.28 pins PostCSS8.4.31. Build-time CSS processing of trusted repository input here; no user CSS upload/parser endpoint. Upstream fix still needed. Direct build PostCSS is patched8.5.32; no forced Next override. |
| Dev model tooling | 3 Sharp advisories: `GHSA-f88m-g3jw-g9cj`, `GHSA-rgj7-g3m4-5g8c`, `GHSA-wq5f-xc86-pv6w` | gltfjsx6.5.3 (registry latest) pins Sharp0.33.5. Dev-only, not deployed image optimizer dependency. Avoid untrusted model/image input. Next's Sharp dependency is patched. |
| Dev tooling | ESLint9.39.5, glob7.2.3, inflight1.0.6, whatwg-encoding3.1.1 deprecations | ESLint9 support warning; Tailwind2/PurgeCSS glob/inflight; gltfjsx/jsdom whatwg-encoding. Larger tooling migrations deferred; no Tailwind major migration solely for colors. |

Audit exits nonzero intentionally; findings are not suppressed. Production tree has 4 findings, not a clean-security claim. No evidence that runtime handles adversarial CSS input; keep build inputs trusted.

## Behavioral red → green evidence

All behavior tests use actual routes or real GSAP/Three objects; none assert source substrings.

| Test | Before | After |
| --- | --- | --- |
| Aborted model / unavailable WebGL | No essential fallback biography | Basic biography/projects/contact, no canvas, unlocked body |
| Slow model + keyboard skip | Skip button missing | Enter skips and focuses Hong Seo heading |
| Reduced motion + contact | Animated scene, non-links for contact values | Static content; mailto/tel/home round trip |
| Metadata | Missing page title/description/OG/canonical | Server metadata on home/contact; verified existing domain |
| Keyboard drawer + resize | Native menu button absent; resize reload in source and baseline | Native controls, inert closed drawer, Escape/focus restore/trap; same document at767/768/1200; stage0→1→0 and Work |
| Mobile year | Timeline year absent from mobile markup | Visible mobile year equivalent |
| Colors / Segment | Computed neutral color black, missing remote icon | Correct neutral palette/primary token, readable Segment text fallback |
| MusicNoteAnimation | 4 GSAP children grew to34 over30 simulated cycles | Bounded timeline, no owned position/material tweens after cleanup |
| Bubble | Owned infinite tween survived cleanup | Five mount/cleanup cycles leave no owned tweens; unrelated tween survives |
| Avatar flicker / audio | Live80ms interval after skip; unhandled play calls | Interval cleared on owner cleanup; rejected play promises handled, audio elements unmounted |
| Stage-one resize / pin | Choreography baseline captured | One pin spacer, biography in viewport, stage1 preserved across767/768/1440 |
| Mode switch/context loss/back | No alternate mode or safe context recovery | Animated→basic→animated; context loss enters basic without reload; navigation/back recover |

Test development corrections were not hidden: initial R3F Canvas `fallback` component had side effects even with supported WebGL (fallback children mount inside canvas). Replaced with WebGL2 capability probe and static Canvas fallback, retaining error boundary. One browser-back test initially raced pending client navigation; now waits for `/contact` before Back. Avatar cleanup check polls up to500ms for async R3F unmount instead of assuming synchronous cleanup. All corrected cases rerun. Final visual review also reproduced a menu-camera preset surviving Contact → Home (`red-camera-return-home.png`); animated-mode entry now restores both stable camera defaults (`green-camera-return-home.png`).

## Validation commands and environment

Node26.10.0, Yarn4.1.0, installed Google Chrome, software WebGL. Port8000 belonged to an existing stale-assets dev process (JS/CSS404); left untouched. Owned server uses127.0.0.1:18000 and ignored `.next-test/`. Only owned process IDs stopped.

```sh
yarn install --immutable
yarn lint
yarn typecheck
NEXT_TEST_BUILD=1 yarn build
NEXT_TEST_BUILD=1 yarn next start -H 127.0.0.1 -p 18000
yarn test
yarn npm audit --all --recursive --json
yarn npm audit --environment production --all --recursive --json
git diff --check
git diff --cached --name-only
```

Original production suite: **15 tests passed**. First recovery suite: **26 tests passed**. Final decoder-corrected production suite: **31 tests passed** (15 original + 11 recovery + 4 codec browser cases + 1 exact-key preservation test). Fresh immutable install, typecheck, isolated production build and diff check passed; exit codes recorded rather than inferred from empty logs. Lint: 0 errors, 4 existing unused-variable warnings in unmounted camera-debug hook (baseline6). Build retains existing Tailwind2 JIT preview / missing Next ESLint plugin warnings. Independent review confirmed correction source and recorded validation; it did not independently rerun the browser suite. Parent additionally reran lint, typecheck and isolated production build successfully.

## Same-protocol recovery review corrections

Verified all reported behavior defects against dependency implementations and failing production browser tests before corrections. No rewrite, geometry/preset changes, project content/order changes, dependency updates, staging, commits or push.

- **Failed-asset retry:** exact Fiber loader/input cache entries cleared when their scene URLs failed (codec-dependent GLTF invalidation added below). Shared URL constants keep array texture cache keys identical to loading keys. Matching accumulated Drei errors removed before animated remount. Successful environment cache preserved when avatar or face texture fails; no global cache clear or GPU disposal.
- **Reverse stage choreography:** kill outgoing owned timeline without reverting current transform on stage/breakpoint changes. Original transform restored only on owner unmount. Existing one-second destinations/easing unchanged.
- **Drawer closing choreography:** same ownership rule for text/biography and drawer position. Removed competing Hero drawer-position tween; RightDrawer owns opening/closing timeline. Intermediate closing positions and rapid reversal tested for both stages.
- **Escape after resize:** closing restores both existing desktop/mobile defaults; focus-management listener need not rebind after breakpoint change. Browser test inspects actual rendered R3F camera via test-only DevTools hook, not just Zustand targets.
- **Test server identity:** `reuseExistingServer: false`. Owned dummy HTTP server on18000 reproduced clear runner rejection; dummy remained alive until its owning shell stopped it. No unrelated processes touched.

Fresh red run against preserved production build: **6 failed, 2 passed**. Failures: failed-model retry; reverse translation already0 after200ms; stage0/stage1 closing text already at final position; Escape retained mobile FOV30 or desktop FOV24 after breakpoint crossing. Voluntary retry/contact-home camera and synthetic mobile touch already passed. First corrected focused run: **8 passed**. Expanded first recovery suite: **26 passed**, including extra isolated avatar, grouped face-texture and music-texture retries with network restored.

Coverage now includes actual mouse wheel stage0→stage1→projects→back→stage1, reverse intermediate transform, stage-one767/768/1440 resize continuity and one pin spacer, drawer close/rapid reversal, both directions of open-drawer breakpoint crossing, failed model/texture retry without document reload, preservation of successful shared model cache, voluntary basic→animated and Contact→Home rendered camera defaults. Mobile touch uses Chrome CDP touchStart/touchMove/touchEnd in a touch-enabled mobile-emulated context; verifies introduction advances to stage1, **not real-device behavior or full mobile touch round trip**.

Recovery evidence directory: `/tmp/portfolio-stability-recovery/` (outside repository):

- `red.log`: six reproduced regressions before edits.
- `green-1.log`: initial eight-case corrected run.
- `full-production-final.log`: first recovery26-case production suite.
- `immutable-final.log`, `lint-final.log`, `typecheck-final.log`, `build-final.log`, `final-exits.log`: fresh command results and explicit exit codes.
- `busy-port.log`: expected runner error `http://127.0.0.1:18000 is already used`; fixture ownership/continued liveness checked.
- `audit-final.json`, `audit-production-final.json`: fresh audits still report11 total entries /4 production PostCSS findings; both intentionally exit1. Existing triage above remains applicable. No clean-security claim.

Recovery tests run through Playwright-owned production server (`PLAYWRIGHT_SERVER_COMMAND='NEXT_TEST_BUILD=1 yarn next start -H 127.0.0.1 -p 18000' yarn test`); no server reuse. Existing8000 process left untouched. Prior screenshots below remain historical settled-placement evidence, not fresh recovery screenshots. New transform/camera assertions supply behavioral evidence; no claim of pixel-perfect comparison, Safari/Firefox coverage, real-device touch or sustained GPU/memory profiling.

## Final decoder retry correction

Final reviewer identified persistent Draco errors omitted from initial retry clearing. Fresh browser reproduction also confirmed the same KTX2 seam: both actual GLBs declare `KHR_draco_mesh_compression` and `KHR_texture_basisu`. Four real browser tests aborted each codec request, reached basic mode, restored network and attempted animated retry. **All four failed before correction**. Exact-key preservation test also failed before correction.

Correction stays bounded to explicit scene-owned library URLs: Draco `draco_decoder.wasm`, `draco_wasm_wrapper.js`, fallback `draco_decoder.js`, and KTX2 `basis_transcoder.wasm`/`.js`. Shared path constants match actual loader configuration. On one of these failures, clear only the two known codec-dependent GLTF cache keys and matching errors; independent TextureLoader caches, other model keys and unrelated errors remain untouched. GLTFLoader may swallow KTX2 texture errors and resolve an incomplete scene, so a model URL error alone is insufficient. Intentionally reloading an otherwise-successful sibling GLB is an approved recovery tradeoff; both models depend on both codecs. No global cache reset, disposal or per-load ownership framework.

Focused corrected run: **5 passed** (four browser cases + one exact-key test covering all five library URLs, including absolute/relative KTX2 spellings). Browser cases require successful codec response and visible animated scene after unblocking, without document reload. Draco JS-only fallback URL is covered by exact-key test, not browser execution; supported browser uses WASM wrapper. Full final production suite: **31 passed in4.1min**. Existing direct avatar/face failure cases still prove successful environment cache preservation when no shared codec failed.

Latest evidence: `/tmp/portfolio-stability-decoder/`:

- `red.log`: four codec browser failures before correction.
- `red-keys.log`: failed exact-key test before correction.
- `focused.log`: five focused passes after correction.
- `full-production-final.log`:31 passing tests against fresh isolated production build.
- `immutable-final.log`, `lint-final.log`, `typecheck-final.log`, `build-final.log`, `final-exits.log`: successful fresh commands with explicit exit codes. Lint retains four existing warnings; build retains existing Tailwind2 JIT/Next ESLint-plugin warnings.
- `diff-check-final.log`, `git-status-final.log`: final whitespace/staging checks. No staged files, commits, push or deploys. Playwright-owned server stopped; port18000 free. Existing8000 process untouched.

No dependency changes or fresh audit during this last bounded slice; prior fresh audit evidence/triage above remains applicable. Final independent reviewer run `66e46f17-b859-4a8a-8d92-a2f9f3a39dde` returned **OK**, confirming the decoder-retry P1 resolved with no new must-fix in that correction scope.

Parent final build reports homepage First Load JS **460 kB**, versus original **351 kB**. This slice prioritizes reliability and accessibility, not a bundle-size improvement; defer code splitting of retry/basic-mode imports to a measured follow-up. No Lighthouse/Core Web Vitals or performance-score improvement claim. All changes remain local and uncommitted on `improve/portfolio-stability`; no push.

## Follow-up: black avatar face at intro start

User reported the face appearing black before its expression appeared. Reproduced in the development build: the first visible renderer frame used the original `MeshStandardMaterial`, not the face texture material. StrictMode effect cleanup restored the original material, but the remembered `normal` face state prevented the repeated mount effect from applying it again.

Bounded correction in `components/Avatar.jsx`: bind normal face material in layout-effect setup before drawing, reset the expression reference on setup/cleanup, and retain original-material restoration plus owned-material disposal. Removed redundant passive initial-face update. Also reproduced a separate timing defect with a six-second model delay: the canvas's five-second cutoff suppressed the wave expression. Face updates now follow the running intro clip, retaining inclusive frames41–67; typing/scrolling checks retain their independent one-second throttle. Camera presets, clip speeds, stage transitions and wireframe timing unchanged.

Added `tests/avatar-face.spec.ts`: real renderer-frame observations for first scene draw, visible intro frames, wave occurrence/normal return, six-second asset delay and basic→animated remount. First scene draw must have normal material; visible frames must always have a valid face expression. A software-GPU stall can advance the clip into the wave window before the first visible draw, so that frame need not always be the normal expression. Test-only DevTools hook includes a renderer registry for development Fast Refresh; no production instrumentation.

Fresh results:

- Focused development/StrictMode suite: **3 passed**.
- Isolated production build and complete production suite: **34 passed** (previous31 + new3).
- Lint/typecheck passed; four existing lint warnings remain.
- Read-only reviewer `fe642f5c-7a66-457e-b11d-5c53bfc27499`: no issues in the implementation delta; browser execution remained parent-owned. Review preceded final test-fixture refinement for software-GPU frame skips.
- Initial-frame production screenshots inspected: face texture visible during the falling intro and delayed-load case. No pixel-perfect, exact clip-boundary, real-device or cross-browser claim.

Evidence: `/tmp/portfolio-avatar-face/`: `red-initial.log`, `initial-fix.log` (isolated slow-load wave failure), `green-dev-final.log`, `build-final.log`, `full-production-final.log`, `review.md`, and captured images. An intermediate full-suite invocation used an unrecognized environment flag and therefore ran development mode, not production; it failed/timed out and is retained as `interrupted-dev-suite.log`. This is not passing full-development-suite evidence. Correct production invocation explicitly used `PLAYWRIGHT_SERVER_COMMAND='NEXT_TEST_BUILD=1 yarn next start -H 127.0.0.1 -p 18000'`. Only owned test processes were stopped; existing port8000 untouched. All changes remain unstaged/uncommitted; no push.

## Visual evidence and limitations

Temporary logs/screenshots: `/tmp/portfolio-stability/` (outside checkout). Failed test traces/screenshots: ignored `test-results/` (subsequent runs replace them). Red logs retained outside checkout: `red-2-4.log`, `red-3.log`, `red-mobile-year.log`, `red-4-colors.log`, `red-5-notes.log`, `red-5-bubble.log`, `red-5-audio-timer.log`. Security snapshots: `audit-before.json`, `audit-final.json`, `audit-production-final.json`. Commands/results: `build-final.log`, `full-production.log`, `immutable-final.log`, `lint-final.log`, `typecheck-final.log`.

- `baseline-owned-{desktop,mobile}.png`: original React18/Next15.2.4 intro, isolated dev output (debug markers visible).
- `baseline-{drawer,stage1,projects}-{desktop,mobile}.png`: after dependency alignment but before behavior changes, production output.
- `after-{intro,drawer,stage1,projects}-{desktop,mobile}.png`: final production scene captures; original camera/scene/artwork placement retained. Added skip and drawer close/contact controls expected.
- Desktop1440×900 and mobile390×844 screenshots inspected; intro geometry and mobile stage1 biography match baseline positions. No claim of pixel equality for animated frames/random bubbles.
- Final production console captures: no JavaScript errors or app warnings; desktop screenshot readback emitted Chrome software-GPU ReadPixels stall warnings, mobile capture clean.
- Chrome software renderer only: Safari/Firefox, real-device touch, GPU performance and long-duration memory profiling not performed. Node lifecycle test covers30 note cycles; no speculative cached-model GPU disposal. Dispose only explicitly component-created materials, restore shared scene references.
- External Draco/CDN icons/fonts still depend on network; scene failures now expose full content, other stack icons have readable on-error text. No invented social image.

## Editorial follow-up requiring owner facts

Owner may verify “2022-current” employment dates, project status and the artwork's “3+ years” statement; supply substantiated outcomes/metrics if desired. No reorder, rewritten achievements, fabricated metrics or date updates in this diff.

## Five review corrections — fresh development and production gates

Bounded follow-up to `/tmp/portfolio-change-review/review-summary.md`, preserving the prior dirty checkout at `4d864b5d28c9860ef17d4d89efee9a1af12bc4c5`:

- Camera test DevTools hook now registers each renderer with a unique ID in a Map. Actual rendered camera assertions remain; all three camera cases also reject startup/page errors. Initial default-development reproduction timed out without a menu; trace showed Fast Refresh `Cannot read properties of undefined (reading 'forEach')`.
- Real Zustand `resetScene` regression first observed retained `isScrolling: true`; reset now clears it alongside typing state. No audio-default or avatar-frame changes.
- Hero observes container dimensions and retargets only its owned one-second `power1.inOut` translation, killing without reverting intermediate position. Stage-entry audio/overflow/Observer setup stays separate from resize. Desktop uses half measured container; mobile subtracts the existing200px extra height before halving, preserving CSS−102vh even where `innerHeight` differs from CSS viewport units. Resize observer disconnects and tween dies on cleanup.
- Drawer uses top-safe padded minimum-height centering, vertical overflow and overscroll containment, above navbar hit targets. Descendant-aware Observer `ignoreCheck` lets wheel/touch scroll inside it. Reopen resets scrollTop before focusing Close. Escape, trap, return focus and both-stage reversal remain covered.
- Retry stays in usable basic mode while Drei loading is active, with disabled retry button and truthful pending status. After abandoned requests settle, existing exact-key preparation and scene reset run once. Reduced motion and unmount cancel queued entry. No cache framework rewrite, global invalidation or shared-resource disposal.

Red→green logs under `/tmp/portfolio-review-fixes/` (each command has matching `.exit`):

| Defect | Failing evidence | Focused corrected evidence |
| --- | --- | --- |
| DevTools fixture | `01-camera-red.log`:1 failed | `01-camera-green.log`:3 passed |
| Scrolling reset | `02-store-red.log`:1 failed, expected false/received true | `02-store-green.log`:1 passed |
| Height resize | `03-resize-red.log`:2 failed, expected−612/received−918 (settled and mid-transition) | `03-resize-green.log`:10 passed, including desktop/mobile resize, remount cleanup, stage/pin/reversal/camera |
| Short drawer | `04-drawer-red.log`:3 failed, clipped Close and zero touch scroll | `04-drawer-green-2.log`:5 passed,800×300/568×320 wheel, keyboard, touch and reversals |
| Pending retry | `05-retry-red.log`:1 failed, prematurely animated while old wave held | `05-retry-green.log`:12 passed, single-click queued recovery/cancellation plus model/texture/codec/cache recovery |

First drawer correction exposed navbar interception of Close (`04-drawer-green.log`:2 failed/3 passed). Raised modal above navbar; retained actual hover/click assertions rather than forcing clicks or weakening hit-testing. No retries enabled. New tests add11 cases, total45. Existing avatar face assertions and inclusive frame41–67 wave remain unchanged.

Fresh complete gates (not historical34-production/3-development evidence):

```sh
yarn playwright test --reporter=list
# 45 passed in8.4min; 06-full-development.log, exit0
yarn lint
# 0 errors,4 existing camera-debug warnings; 07-lint.log, exit0
yarn typecheck
# passed; 07-typecheck.log, exit0
NEXT_TELEMETRY_DISABLED=1 NEXT_TEST_BUILD=1 yarn build
# passed; 08-build.log, exit0
PLAYWRIGHT_SERVER_COMMAND='NEXT_TEST_BUILD=1 yarn next start -H 127.0.0.1 -p 18000' yarn playwright test --reporter=list
# 45 passed in6.6min; 09-full-production.log, exit0
```

Full-suite timeout1800s; test retries remain zero. Both suites use isolated `.next-test`, loopback18000 and `reuseExistingServer:false`. Owned servers stopped;18000 free. Port8000 untouched. `git diff --check` passes, staging empty, HEAD unchanged. Before snapshots/status/diff and `task-only.diff` outside checkout distinguish this delta from earlier approved work. Independent spec review (`605f85c9-179f-4780-bde3-ab8af847751d`) and quality review (`82f2ff7e-cbd8-4fbb-b3b2-d8a5c61a1c88`) both passed with no must-fix findings. Reviewers inspected source and retained execution evidence; they did not independently rerun browsers.

Parent additionally reran lint/typecheck successfully and separate production browser probes: height-only resize reached−612px, short drawer scrolled and reopened with Close at y24px, one queued retry recovered after old failure, and reduced-motion change canceled pending retry. Evidence: `parent-lint.log`, `parent-typecheck.log`, `parent-probe.log` under the same directory. Initial parent probe had an ambiguous global Close-menu locator (navbar and drawer both match); corrected scope to the drawer, then all probes passed. This was probe setup, not an application correction. No source changes after reviewed implementation; this paragraph records final acceptance.

Limits: Chrome software WebGL and CDP-emulated touch only; no Safari/Firefox, real-device address-bar/touch validation, sustained performance/memory or fresh security audit. Existing four lint warnings, Tailwind2 JIT preview and missing Next ESLint plugin warnings remain. Pending retry intentionally waits if a request never settles; full basic content stays usable. Prior security triage remains applicable; no clean-security/performance claim.
