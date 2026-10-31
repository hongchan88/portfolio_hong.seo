# Review Corrections Implementation Plan

> **REQUIRED SUB-SKILL:** Use the executing-plans skill to implement this plan task-by-task.

**Goal:** Correct all five reproduced review findings without changing the established 3D choreography or publishing Git changes.

**Architecture:** Keep existing scene, store and GSAP ownership. Retarget only stage translation when dimensions change; queue retries until old Three loading requests settle; make drawer content independently scrollable. Fix development test instrumentation and reset transient scrolling state.

**Tech Stack:** Next15, React19, React Three Fiber/Drei/Three, Zustand, GSAP, Playwright.

---

## Authority and baseline

Current branch `improve/portfolio-stability`, HEAD `4d864b5`; substantial existing unstaged/untracked changes are intentional. Preserve them. No staging, commits, push, merge, deployment, reset or clean. One writer in current checkout; no worktree allocation from dirty baseline. Existing port8000 remains untouched. Tests own loopback18000 and `.next-test` using `NEXT_TEST_BUILD=1`; `reuseExistingServer:false` stays enabled.

Review/evidence: `/tmp/portfolio-change-review/review-summary.md`, `probe.log`, `state-probe.log`, `default-command.log`. Prior avatar correction already passed focused dev3 / full production34. Preserve first-frame material fix and original wave frames41–67.

## Task 1: Development DevTools fixture

Files: `tests/recovery.spec.ts`, optionally shared `tests/helpers/` used by `tests/avatar-face.spec.ts`.

1. Reproduce existing camera test with default development server:
   `yarn playwright test tests/recovery.spec.ts --grep 'Escape after open drawer breakpoint 1440' --reporter=list`.
2. Confirm failure comes from missing `hook.renderers` in Fast Refresh, not camera behavior (existing evidence records exact TypeError).
3. Provide renderer Map and unique injected IDs, like working avatar-face hook. A shared helper is optional; avoid initialization-order races between multiple addInitScript calls. No production debug instrumentation.
4. Rerun focused default camera tests, asserting no startup page errors. Keep actual rendered-camera assertions.

## Task 2: Reset scrolling state

Files: `app/stores/settingStore.tsx`; new or existing store regression spec.

1. Test real Zustand store: setIsScrolling(true), enterBasicMode(), resetScene(); expect mode animated, typing false and scrolling false. Observe failure before change.
2. Add `isScrolling: false` to resetScene. Do not alter audio default or typing-frame ranges.
3. Rerun unit test; include realistic remount/state coverage if feasible without production test hooks.

## Task 3: Height-only resize

Files: `components/Hero/index.tsx`; recovery/browser regression tests.

1. Test stage1 at1440x900, then1440x600. Container1836→1224 requires translation−918→−612; current implementation keeps−918. Add resize during an active transition too.
2. Observe container dimensions (ResizeObserver or equivalent) and retarget only owned stage tween from its current transform. Preserve initial one-second transition/easing, original desktop/mobile geometry, kill-only dependency cleanup and unmount restoration.
3. Do not replay stage-entry audio, mutate stage or reset scroll simply because height changes. Avoid ResizeObserver feedback loops and stale callbacks after unmount. Keep mobile's existing−102vh target, not half the extra-height mobile container.
4. Rerun new height tests plus existing stage/wheel/reversal/breakpoint/pin cases.

## Task 4: Short-viewport drawer

Files: `components/RightDrawer/index.tsx`, scene Observer config in `components/Hero/index.tsx`; browser tests.

1. Test800x300 and/or568x320 drawer. Current Close lies above viewport, social links below and wheel cannot scroll.
2. Give drawer vertical scrolling with safe top alignment when contents overflow; retain centered layout when space permits. Let wheel/touch within drawer bypass scene Observer interception. Preserve Escape/focus trap/return focus, no stage changes from drawer scrolling. Ensure reopening does not focus an offscreen Close button due retained scrollTop.
3. Test first/last controls via wheel and keyboard, and mobile touch if supported. Retain tests for intermediate close positions, rapid reversal and both stages.

## Task 5: Pending-load retry race

Files: `components/BasicPortfolio.tsx`, existing `components/sceneAssets.ts` if necessary; retry regression tests.

1. Abort normal face immediately; hold wave request from same attempt. Reach basic mode; restore normal network and click retry before old wave finishes. Old code reenters animated immediately and late old failure knocks it back into basic. Existing reproduction in `/tmp/portfolio-change-review/state-probe.cjs`.
2. Minimal approved approach: queue retry in basic mode while Three loading progress remains active. After old requests settle, clear exact failed cache keys/errors via existing prepareSceneRetry and then resetScene once. Do not start new scene while old requests can still append errors. Keep basic content usable while waiting; show truthful pending status and prevent duplicate requests. Cancel/guard queued entry if reduced-motion preference activates or component unmounts.
3. Preserve targeted invalidation and independent successful caches; no global cache reset/GPU disposal or decoder framework rewrite.
4. Regression requires single click before stale failure, then automatic successful animated entry after old failure settles; no second fallback/new user click. Cover settled retry and existing model/face/music/codec cases. If dependency lifecycle invalidates this approach, ask supervisor before broader redesign.

## Validation and review

- Save this task's starting file snapshots/diff and all red/green logs outside checkout under `/tmp/portfolio-review-fixes/`; reviewers need task-only changes distinct from old large diff.
- Run focused red→green tests per defect, then full default development suite.
- Run `yarn lint`, `yarn typecheck`, `NEXT_TELEMETRY_DISABLED=1 NEXT_TEST_BUILD=1 yarn build`.
- Run full production suite with correct command:
  `PLAYWRIGHT_SERVER_COMMAND='NEXT_TEST_BUILD=1 yarn next start -H 127.0.0.1 -p 18000' yarn playwright test --reporter=list`.
- Allow sufficient command timeout (>10min for full development suite), capture exit codes and logs. Do not suppress failures, delete assertions or add retries to manufacture passing results. Diagnose animation assertions that assume elapsed wall time equals rendered frames.
- Check `git diff --check`, empty staged diff, unchanged HEAD, and stopped owned18000 server.
- Independent spec review, then quality review of this task-only delta. Address must-fix findings before final acceptance; final parent verifies evidence.
- Update `docs/portfolio-stability-validation.md` with results and limits. Known lint/security warnings remain unless specifically changed; no fresh clean-security/performance/cross-browser claim.
