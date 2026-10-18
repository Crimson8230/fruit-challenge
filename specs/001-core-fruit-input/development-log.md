# Development Log: Core Game and Fruit Input

## Important prompts

- Constitution prompt: establish a small, playable browser fruit game and document prompts,
  problems, corrections, and lessons learned from AI-assisted development.
- Specification prompt: "001 – Core Game & Fruit Input" with a playfield, moving fruits, input
  buttons, correct-order selection, and a first fully playable version.
- Implementation prompt: execute the Spec-Kit tasks and use a feature branch for feature 001.
- Correction prompt: keep feature 001 on the same branch; move all fruits together from left to
  right and allow sequence input while the fruits cross the playfield.
- Second correction prompt: stay on feature branch 001, select the fruits from right to left,
  and keep their horizontal speed constant throughout the crossing.
- Third correction prompt: stay on feature branch 001, enable fruit buttons immediately when a
  round begins, then give the player five seconds after the trailing fruit exits to finish;
  show those seconds as a popup overlay counting down from five.

## Revised implementation baseline

- On 2026-10-18, the existing project passed `npm test` (9 tests) and `npm run build` before
  the revised implementation. The old page still showed one fruit at a time and opened input
  only after all four presentations ended, so it did not meet the corrected gameplay request.
- Before the right-to-left and constant-speed amendment, `npm test` passed 10 tests and
  `npm run build` succeeded. The game still checked the leftmost fruit first, and its row
  crossed the playfield in three stages lasting 1,400, 3,500, and 1,200 ms, giving different
  speeds across the crossing.
- Before the immediate-input and countdown amendment, `npm test` passed 11 tests and
  `npm run build` succeeded. `approaching` input was ignored, buttons unlocked only after the
  full row appeared, and input remained open indefinitely after the row exited.

## Generated work that succeeded

- Spec-Kit artifacts defined one four-fruit round, its states, score, input guards, and replay.
- A small TypeScript rule module separates sequence and round logic from the page. Nine focused
  rule tests pass, covering generation, repeats, input, score, and transitions. One test runs
  20 simulated rounds with success, failure, and replay.
- The page build succeeds with `npm run build`. The first local dependency audit warning was
  checked with `npm audit --json`; the follow-up report listed zero vulnerabilities.
- The built page and JavaScript asset both returned HTTP 200 from Vite's production preview.
- The revised rules now use `approaching`, `moving`, and `passed` phases. Ten focused tests pass,
  including input during movement, input after passage, repeated fruits, scoring, and replay.
- The revised page renders one persistent four-fruit row and uses three Web Animations API
  stages. Input opens after the entrance stage, remains open after exit, and does not wait for
  animation completion before checking a selection. The production build passes; its page and
  JavaScript asset returned HTTP 200 from local preview after the revision.
- The second correction uses the same displayed left-to-right row while validating fruit
  selections from the rightmost position. Eleven focused rule tests pass, including a distinct
  four-fruit sequence and wrong leftmost-first input in moving and passed phases.
- One linear browser animation now covers entrance, full visibility, and exit at a common
  calculated speed. The width calculation gives 3.5 seconds of fully visible travel; a
  progress check opens input when the complete row appears. The final `npm run build` passed,
  and the production page and JavaScript asset both returned HTTP 200 from local preview.
- The third correction keeps the constant-speed row and changes the pure round rules to accept
  input in `approaching`. Passage records one deadline five seconds after exit; choices at or
  after it cause a time-expired failure with the earned score retained. Fifteen focused tests
  pass, including exact deadline boundaries, countdown numbers 5 through 1, early input,
  repeats, scoring, and replay. The TypeScript check and production build pass.
- The page now renders a nonmodal countdown over the playfield, keeps fruit buttons available
  during the response window, and clears timers on results and replay. For reduced motion, an
  unfinished static row enters the same five-second window after three seconds. The built page
  and JavaScript asset returned HTTP 200 from local production preview.

## Attempts that failed or remain unverified

- This managed session could not create `001-core-fruit-input`: Git could not write
  `.git/refs/heads/001-core-fruit-input.lock` (permission denied). The user created and switched
  to that branch locally. No commit was made on `main`.
- The rule tests initially failed because `src/game.ts` did not exist yet. This confirmed the
  test task preceded the implementation; the tests passed after the module was added.
- The Vite development server returned `spawn EPERM` while resolving TypeScript in this
  managed environment. The production build and preview succeed, but a browser walkthrough
  remains unverified here.
- The 20-round browser observation and five-person comprehension check are pending. Automated
  rule simulation covers 20 rounds, but visible timing and player understanding still need a
  browser and participants.
- The revised Vite development server again hit `spawn EPERM` in this managed session. No
  browser executable or browser automation package was available locally, so the actual
  three-second visual interval, keyboard flow, and reduced-motion display are still unobserved.
- The second correction's right-to-left rule was written as tests first; six tests failed
  against the old leftmost-first rule and all eleven passed after the rule changed. The
  constant-speed crossing has not yet been observed in a browser here; the 20-crossing timing
  and five-person comprehension checks remain pending.
- A cached Chromium executable and Playwright package were found in another local test
  environment, but Playwright could not start its driver (`WinError 5: Access is denied`).
  Launching Chromium directly also failed with an access-denied platform-channel error.
  A temporary browser-check script was removed after the attempt; no visual result was inferred.
- For the third correction, the new rule tests failed against the old game module as expected
  (12 of 14 tests failed), then passed after implementation. A local Vite development server
  started and served the HTML page, but loading `src/main.ts` produced `spawn EPERM` inside
  Vite's path resolution. The production preview served both the page and built script.
- Headless Chromium again failed to start here with `platform_channel.cc:108` and "Access is
  denied." No interactive browser result was inferred. The 20-round, 20-crossing, 20-countdown,
  and five-person comprehension checks remain unobserved.

## Manual corrections

- The page initially replaced its buttons after each answer without restoring keyboard focus.
  The input handler now focuses the matching replacement button while entry continues, so
  keyboard users can make consecutive selections.
- The fruit-button container gained an explicit group role to match its accessible label.
- The original page rebuilt the entire game markup after every press. The revised page keeps
  the fruit row and input buttons mounted while updating score, feedback, and phase, so an
  accepted selection cannot restart the row animation or replace the focused button.
- Animation completion is tied to a round token; ending or replaying a round cancels active
  movement and prevents callbacks from changing the next round or a terminal result.
- The old entrance, middle, and exit stages had different durations and speeds. The row now
  uses one linear animation; shrinking its width to about 55% keeps an uninterrupted crossing
  near 12 seconds while allowing more than three seconds with the full row visible.
- The first countdown draft lacked a direct check of the displayed second boundaries. A small
  pure remaining-seconds helper and test now establish the exact 5, 4, 3, 2, 1, 0 boundaries;
  the page uses it for the overlay text.
- Countdown and reduced-motion callbacks use the existing round token and are canceled when
  the round ends, preventing a prior round from changing a replayed round.

## Lessons learned

- Keeping rules independent of the page makes repeats, guards, and terminal scoring easy to
  verify before visual work.
- A successful build and passing rule tests do not prove browser timing or usability. The
  quickstart scenarios remain the acceptance guide for those checks.
- Git metadata permissions can block branch creation even when source files are writable;
  feature branch creation should be checked before implementation begins.
- For movement-driven input, animation milestones are a clearer source of truth than a timer
  that independently guesses when the whole row is visible.
- A single linear crossing avoids speed changes at stage joins. Its duration can be computed
  from the measured row and playfield widths while preserving the full-visibility window.
- An absolute deadline is safer than decrementing a counter: a delayed timer cannot grant
  extra time because every fruit choice checks the deadline first.
- A passing build and HTTP response confirm the bundled files exist but cannot establish that
  the overlay is visible, unobstructed, or usable in a real browser. Those checks remain open.
