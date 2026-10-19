# Feature 005 Development Log

## Baseline and constraints

- Date: 2026-10-19. Active branch: `005-highscores-finalization`, created from Feature 004.
- Before Feature 005 implementation, `npm test` passed 45 tests (35 game, 7 presentation, 3 audio); `npm run build` passed.
- `src/game.ts` is the sole authority for score, lives, rounds, and difficulty. The four fruits are apple, banana, grape, and orange. Correct input selects the rightmost pending position for +10; a clean round adds +25; wrong and missed inputs each cost one life; three lives start a game. Feature 003 increases fruit count every two rounds from three to eight and speed from 100% to a 200% cap.
- `src/main.ts` owns the one delegated button click listener, linear row movement, boundary checks, and round-token cancellation of animation/timers. `src/presentation.ts` and `src/audio.ts` observe accepted transitions. Feature 005 must leave the `src/game.ts` rules and row speed calculation unchanged.
- Existing assets are `public/fruits/apple.svg`, `banana.svg`, `grape.svg`, and `orange.svg`. Feature logs for 001–004 under `specs/` provide the documented history for the university experience report.

## Prompts and attempts

- The user requested final Feature 005 with graphic-only fruit controls, local highscore, finalized screens, full regression review, and evidence-based documentation. Spec-Kit specification, plan, and tasks were prepared before implementation.
- The highscore tests were written before `src/highscore.ts` existed. Their first successful Vitest launch failed on the missing module, as expected. The module then passed all 12 focused tests.
- The sandbox blocked Vitest workers, Vite's file-resolution helper, and Chromium startup with `spawn EPERM`. The same local checks ran successfully outside the sandbox. No failed sandbox run is counted as feature evidence.
- The first 320×720 screenshot showed the Start button partly below the viewport after adding highscore information. Reducing ready/active playfield height while keeping the larger Game Over field moved the full button into view. The next screenshot showed a duplicate caption behind the ready panel; clearing that caption in ready state removed the overlap.

## Checks and corrections

| Check | Result | Evidence |
|-------|--------|----------|
| Baseline `npm test` | PASS | 45 existing tests |
| Baseline `npm run build` | PASS | TypeScript and Vite build |
| Highscore TDD | PASS | Initially failed for missing module; then 12 focused tests passed |
| Intermediate `npm run build` | PASS | TypeScript and Vite build after UI/highscore integration |
| Browser 320px and 1280px | PASS | No horizontal scroll; fruit buttons at least 68px and 84px tall; row/buttons have matching SVGs, accessible names, and no visible fruit-name text or title tooltip |
| Browser highscore | PASS | +10 immediately saved; reload before Game Over restored 10; clean first round produced 55; new record badge appeared; lower and tied 55-point runs showed no badge |
| Browser invalid storage | PASS | Six invalid values fell back to 0; denied localStorage did not block +10 or in-memory best |
| Browser input and restart | PASS | Repeated Apple positions scored in rightmost order; touch and keyboard worked; sound toggle muted; 10 Game Over/Play Again cycles at each width reset 0 score, three lives, round 1, three fruits, 100% speed while preserving best |
| Browser movement and tiers | PASS | Row moved right between frames; 16 rounds at each width matched all Feature 003 fruit counts and speeds; no neighbor SVG overlap or row wider than field |
| Browser boundary and reduced motion | PASS | Finishing the row animation caused exactly three misses and Game Over; reduced motion used no row animation and ended after the three-second static interval |
| Mobile screenshot correction | PASS | At 320×720, Start button rectangle ends at y=691.125, within the 720px viewport; ready caption no longer duplicates panel instruction |
| README installation | PASS | `npm ci --offline` installed 52 packages after an initial sandbox `spawn EPERM`; no lockfile change |
| Documentation links | PASS | Local links in `README.md` and `docs/vibe-coding-experience.md` resolve to existing paths |
| Final `npm test` | PASS | 57 tests: 35 game, 7 presentation, 3 audio, 12 highscore |
| Final `npm run build` | PASS | TypeScript check and Vite production build after mobile caption correction |

## Browser evidence and pending checks

The checks above used local headless Chromium controlled through Playwright. Browser audio is muted in headless mode; actual listening quality and the historical five-player understanding observation remain pending human checks. Feature 005 did not alter `src/audio.ts`; its unit tests verify mute and unavailable-audio handling.

The browser checks covered reload within one browser profile. A separate physical browser-close/reopen observation was not performed; `localStorage` is the persistence mechanism and the reload test plus focused storage tests verify the implemented path. The README setup commands were checked with offline npm installation, development server startup, the full test suite, and production build.

## Lessons learned

- Capture a run's starting best before score increases; comparing Game Over score to the already-updated current best would hide a genuine record.
- Removing fruit-name nodes rather than only hiding them prevents names from reappearing at another viewport width while ARIA names remain.
- Recheck a short mobile viewport after adding even one line of status information: the first layout still had no horizontal overflow but pushed Start partly below the fold.
- A screenshot can reveal overlapping text that state/value assertions miss.

## Constitution and scope review

The application remains a small, client-side TypeScript game. `src/game.ts`, `src/presentation.ts`, `src/audio.ts`, the movement speed formula, four SVG assets, scoring, lives, and difficulty tiers were not changed for Feature 005. The only new source module stores one numeric highscore in browser `localStorage`; the dependency manifest adds no package. There is no backend, account, online leaderboard, extra fruit, score history, or new gameplay rule. README and the university experience document are in English and distinguish log-supported facts from developer TODOs. No constitution exception is required.

## Final verification summary

On `005-highscores-finalization`, all 21 planned tasks were implemented or verified. The final automated result is 57 passing tests and a passing production build. Browser checks covered the graphic-only interface, persistent highscore after reload, storage fallback, score/life/bonus rules, difficulty tiers, mobile and desktop layout, mute, reduced motion, and repeated replay. The only pending observations are subjective sound listening, the historical five-player comprehension exercise, and a physical browser-close/reopen check; none is represented as a completed result.
