# Feature 004 Development Log

## Baseline and constraints

- Date: 2026-10-19. Active branch: `004-visual-polish-feedback`.
- Before implementation, `npm test` passed all 35 existing tests and `npm run build` passed.
- Preserve Features 001–003: apple, banana, grape, orange; rightmost pending fruit first; +10 per correct choice; +25 per clean round; wrong choice or missed fruit costs one life; round-based sequence lengths and speeds; immediate Game Over and fresh restart.
- Keep game rules in `src/game.ts`; visual and audio effects are observers of state transitions.

## Prompts and implementation attempts

- User requested Feature 004 visual polish, animations, sound, responsiveness, accessibility, and preservation of existing gameplay. Spec-Kit specification, plan, and tasks were produced before code changes.
- Phase 2: Added pure transition classification with tests before implementation. The first targeted test run failed because the module was not yet present, as expected. The first build found that ES2022 does not include Array.findLast; replacing it with reverse/find resolved the compile error. Transition handling now classifies choices and misses before accepting game state, with no game-rule changes.
- Phase 3: Replaced platform emoji with four local SVGs and applied a coherent arcade style without changing the row movement formula. A local headless-browser check required running outside the sandbox because process spawning was blocked. The checked rightmost fruit selection scored exactly 10 points at both viewport widths.
- Phase 4: Added non-blocking button, fruit, score, life, and clean-round effects. The final fruit uses an independent visual echo because the next round replaces its row immediately. Tests cover repeated indexed fruit identities, consecutive misses, and terminal precedence. Effects are replaced on rapid input and cleared on restart/Game Over.
- Phase 5: Added a lazy single-context synthesized sound controller and visible session-only mute toggle. The first audio test exposed that the fake blocked context resumed immediately; adjusting the fake to remain suspended allowed the blocked-policy behavior to be tested correctly. In an instrumented browser, correct, incorrect, clean-round, missed-life, and Game Over events produced distinct frequencies (760, 260, 990, 190, and 135 Hz). Twenty-five muted selections generated zero tones; unmuting affected only the next selection. Removing browser audio entirely left input working and produced no page error.
- Phase 6: Added a ready panel, moved the prominent Start Game control above fruit choices, refined the final result panel, and checked keyboard, touch, responsive widths, ten restarts, and reduced motion. A first screenshot caught a Game Over fade that made the result hard to read during its first frame; replacing the fade with a slight scale effect kept it immediately readable.

## Validation evidence

| Check | Result | Notes |
|-------|--------|-------|
| Pre-implementation `npm test` | PASS | 35 existing tests |
| Pre-implementation `npm run build` | PASS | TypeScript and Vite build |
| Foundation `npm test` | PASS | 40 tests, including five presentation-event tests |
| Foundation `npm run build` | PASS | TypeScript and Vite build |
| US1 `npm run build` | PASS | TypeScript and Vite build with four SVGs |
| US1 browser 320px | PASS | No page overflow; four fruit images; rightmost input +10; button minimum 135 × 69px; synthetic 3–8-slot row widths 86–233px within 272px stage, no overlap |
| US1 browser 1280px | PASS | No page overflow; four fruit images; rightmost input +10; button minimum 183 × 84px; synthetic 3–8-slot row widths 204–564px within 756px stage, no overlap |
| US2 transition tests | PASS | Seven focused presentation tests |
| US2 rapid input 320px | PASS | One wrong input cost one life and no points; 20 immediate correct inputs resolved in order with exact +10/+35 gains, no duplicate, maximum synchronous feedback time 2.2ms |
| US2 rapid input 1280px | PASS | Same state results and immediate classes; maximum synchronous feedback time 1.7ms |
| US3 audio unit tests | PASS | Three focused tests for lazy creation, cue distinction, mute, blocked sound, and cleanup |
| US3 instrumented browser cues | PASS | All five cue classes observed; Game Over showed final state and visible mute button; restart reset score/lives/round |
| US3 muted events | PASS | 0 tones after 25 selections; 1 tone after unmute and next selection |
| US3 unavailable audio | PASS | Next correct selection scored 10; no page error |
| US4 ready/Game Over at 320px and 1280px | PASS | Title, mute, final score/round, prominent Start/Play Again, no horizontal scroll; Game Over screenshot reviewed after visibility correction |
| US4 keyboard/touch | PASS | Enter started game, Space chose rightmost fruit for +10, touch start/fruit tap scored +10; restart focus moved to Play Again |
| US4 restart | PASS | Ten repeats at each viewport reset score 0, three lives, round 1, three fruits, 100% speed |
| US4 reduced motion | PASS | Zero row animations; lives remained 3 at 2.8s and resolved to Game Over after the three-second interval |
| US4 contrast spot-check | PASS | Action button white on #bd2b4f: 5.80:1; caption 5.20:1; status labels 7.70:1; error text 7.40:1 |
| Final browser difficulty sweep | PASS | 20 consecutive rounds, 130 correct inputs, all tier fruit counts and speeds, zero slot overlap or row overflow; 20/20 rows moved right between frames; configured movement-rate error 0%; score 1800 and three lives at round 21 |
| Final browser audio sweep | PASS | Five separate runs each produced all five expected cue frequencies; 25 muted selections produced zero tones; unavailable audio caused no page error |
| Final `npm test` | PASS | 45 tests: 35 existing rules, seven presentation, three audio |
| Final `npm run build` | PASS | TypeScript check and Vite production build after final visual adjustment |

## Browser observations and pending checks

Actual listening quality is pending because the headless browser is muted; cue durations are 0.09–0.24 seconds with a low gain peak of 0.055, and event routing was checked with an instrumented browser. SC-007's five-player understanding check is pending because five participants were unavailable. The observed browser behavior does not substitute for those subjective checks.

## Lessons learned

- Derive effects from before/after game state, because the final correct choice is reported as a completed round and the last wrong choice as Game Over.
- Keep row geometry and speed untouched; decorative effects belong to individual fruits, controls, and independent overlays.
- Review screenshots at the moment a state appears. A fade that passed value checks initially obscured Game Over and was replaced with an immediately visible effect.
- Browser policy and process restrictions require graceful audio fallback and explicit separation between instrumented cue verification and actual listening.

## Constitution and scope review

The game remains a small client-side TypeScript application. Rules in src/game.ts and the Feature 003 movement-speed formula were not changed. Four local SVGs and a small audio module add no runtime package, backend, persistence, new fruit, scoring rule, difficulty tier, multiplayer mode, power-up, or leaderboard. Prompts, failed and successful attempts, corrections, checks, and pending human observations are documented above. No constitution exception is required.
