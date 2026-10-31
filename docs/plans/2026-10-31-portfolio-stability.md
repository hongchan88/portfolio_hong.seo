# Portfolio Stability Implementation Plan

> **REQUIRED SUB-SKILL:** Use the executing-plans skill to implement this plan task-by-task.

**Goal:** Address audited security, reliability, accessibility and discoverability defects without replacing the existing 3D introduction or scroll choreography. Keep all changes local; no push or deployment.

**Architecture:** Keep normal-mode loading → avatar introduction → stage transition → pinned biography → project timeline. Add an independent accessible static mode for loading errors, unavailable WebGL, reduced motion and explicit skip. Keep normal scene geometry and scroll offsets unless a reproducible regression requires a narrow correction. Move metadata to server layout and client state/providers to a separate component.

**Tech Stack:** Next.js App Router, React, R3F/Drei/Three, GSAP/Motion, Zustand, Tailwind, Yarn. Add focused automated browser checks using Playwright where feasible.

## Constraints and approach

- Source starts at `4d864b5` on local branch `improve/portfolio-stability`.
- Single writer in current checkout; no concurrent edits, commits, pushes, releases or deployment.
- Prefer targeted fixes over framework redesign. Do not migrate Tailwind major solely to fix missing color tokens.
- Preserve project ordering, existing factual descriptions, assets and camera presets. Do not invent metrics or change employment dates.
- Compare successful normal-mode behavior in desktop/mobile browser before and after changes. If baseline is broken, record it distinctly.
- All new behavior and bug fixes require a failing focused test or behavioral reproduction before implementation, then passing rerun. Configuration upgrades require peer/audit/build checks.
- Persistent evidence belongs in tests/docs; temporary logs/screenshots go outside checkout or ignored test output directories.

## Task 1: Security, dependencies, validation foundation

**Files:** `package.json`, `yarn.lock`, `eslint.config.mjs`, `.gitignore`, new browser-test config/tests, README.

1. Query registry/release/security information. Capture existing Next 15.2.4 audit and React 18 vs R3F 9/Drei 10 peer conflict. Choose supported patched Next version and aligned React/React DOM/types; prefer maintained Next 15 if it resolves current advisories, otherwise justify minimum supported major update. Do not blindly upgrade every dependency.
2. Add Playwright dev dependency and repeatable lint/typecheck/test commands. Use installed Chrome or provision test Chromium only as necessary. Do not run global installations.
3. Capture normal desktop/mobile intro, stage transition and drawer baseline; distinguish pre-existing exceptions.
4. Upgrade dependencies/lockfile; remove unused runtime dependencies only after import/config verification. Keep model generation tools dev-only if retained. Align peer dependencies and record remaining upstream advisories.
5. Run `yarn install --immutable`, `yarn typecheck`, `yarn lint`, `yarn build`, `yarn npm audit --all --recursive`. Security findings must be triaged, not hidden by disabling audit.

## Task 2: Safe 3D fallback without changing choreography

**Files:** `app/page.tsx`, `app/stores/settingStore.tsx`, `components/LoadingOverlay/index.tsx`, `components/ModelViewer/index.tsx`, new focused fallback/error-boundary component, tests.

1. Add failing browser tests: abort model request; unavailable WebGL; delayed model loading then keyboard skip. Essential biography/projects/contact must remain reachable without scene success.
2. Add explicit scene failure and user-selected basic mode. Error boundary catches scene loader/render errors; Canvas fallback handles unsupported WebGL. Loading progress is not sufficient evidence of success. Provide accessible skip on loading/intro. Avoid infinite reload on context loss.
3. In fallback/basic mode, unmount the scene and dependent GSAP observers, release body overflow, render semantic biography and normal-flow project list/footer. Do not apply animated negative margins in basic mode. No fake animation completion or forced camera timing.
4. Respect reduced motion through basic mode or an equivalent no-motion path; text flip/timeline animations must also stop in that path.
5. Verify normal mode still uses original intro timing, two-stage transitions, menus and scene layout. Test returning home and switching modes, focus and scroll restoration; no viewport-wide flash or locked scroll.

## Task 3: Responsive state and keyboard navigation

**Files:** `app/layout.jsx`, new client providers component, `components/Hero/index.tsx`, `components/NavBar/index.tsx`, `components/RightDrawer/index.tsx`, camera/setting stores as needed, tests.

1. Add failing test: resize desktop → mobile → desktop without document navigation, state loss or permanently wrong camera. Cover exactly 768px consistently with CSS `md` breakpoint.
2. Remove resize reload. Use breakpoint change subscription with cleanup, select correct stable camera preset and refresh GSAP measurements appropriately. Do not use mutable current camera zoom as default zoom. Rebuild only effects whose breakpoint-dependent geometry changes.
3. Add failing keyboard tests for opening/closing drawer, Escape, focus return and Work navigation.
4. Replace clickable div/li with native controls, accessible labels and expanded/controls state; closed drawer must be noninteractive/inert. Implement appropriate focus management and prevent focused descendants of hidden/aria-hidden content. Preserve click/touch behavior and bubble cover.
5. Add descriptive accessible names to social/project links, screenshot alternatives, correct heading hierarchy and visible focus styles.

## Task 4: Contact, metadata, semantic content and style fixes

**Files:** `app/layout.jsx`, client providers, `app/contact/page.jsx`, `components/Footer.jsx`, `components/Hero/index.tsx`, `components/Timeline/Timeline.tsx`, `components/Projects/index.tsx`, `components/Project/ProjectInfo.tsx`, `app/data/data.tsx`, `tailwind.config.js`, `public` as needed, tests.

1. Add failing tests for page title/description/OG, contact CTA, email/phone activation, returning home, missing color tokens and failed Segment icon.
2. Server layout exports metadata; move theme, resize, scroll and overlay browser responsibilities to client component. Add contact metadata and canonical/OG metadata with existing verified site identity. Do not invent a social image or canonical domain.
3. Make contact accessible from home/footer/drawer. Use mailto/tel; add home navigation to contact page.
4. Supply actual readable HTML biography/skills based on existing image text; preserve artwork/normal scene appearance. Use semantic content in basic mode and an accessible equivalent in animated mode without duplicate screen-reader output.
5. Define existing neutral/primary colors under Tailwind 2 configuration. Fix missing Segment icon with trustworthy local asset or text fallback. Do not substitute unrelated logos. Give mobile timeline year equivalent to desktop.
6. Preserve project ordering/descriptions. Document editorial suggestions requiring owner facts rather than inventing copy/results.

## Task 5: Animation lifecycle fixes

**Files:** `components/MusicNoteAnimation/index.tsx`, `components/Bubble/index.jsx`, `components/CameraController/CameraController.jsx`, `components/Avatar.jsx`, `components/EnvironmentModel.tsx`, `app/stores/audioStore.tsx`, tests.

1. Reproduce note tween accumulation with a focused GSAP lifecycle test/instrumentation; create one bounded timeline or one reusable horizontal tween instead of spawning infinite tweens recursively.
2. Add cleanup regression tests for timers/tweens where feasible; clear Bubble tweens, camera tweens and started avatar flicker intervals on owner cleanup. Kill only owned GSAP objects, not all global observers/tweens.
3. Publish typing-ready state explicitly from animation events/start-stop flow rather than sampling mutable mixer state via React dependencies. Handle audio play promise rejection safely while preserving mute default.
4. Address material ownership only when clear: reuse component-owned materials, never dispose shared loader cache assets blindly. Keep optional GPU optimizations deferred if unmeasured or risky.
5. Confirm repeated stage changes and extended running do not accumulate owned animations. Reduced-motion/basic mode should not mount active scene work.

## Task 6: Independent review and completion

1. Run clean production build, lint, typecheck and focused tests. Browser suite must test actual route behavior, not just source-string checks or all-mocked success.
2. Browser matrix: desktop/mobile normal scene; slow and failed asset loading; WebGL unavailable; reduced motion; keyboard drawer/skip; resize across breakpoint; direct contact and return home; navigation back; console errors. Capture screenshot artifacts outside repository if useful.
3. Fresh read-only reviewer checks choreography regressions, focus/scroll cleanup, failure recovery, tests and dependency decisions against this plan.
4. Single writer fixes concrete findings, reruns affected tests plus final build. Report any unverified visual detail and residual security advisory explicitly.
5. Leave changes uncommitted on local branch. Check `git diff --check`, `git status`; no push.
