# Tasks: Scoring, Lives, and Game Over

**Input**: Design documents from `specs/002-scoring-lives-game-over/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: Required by FR-001â€“FR-015 and the constitution. Keep deterministic Vitest coverage in the existing test file; use browser checks for motion and interaction.

**Organization**: The specification has one P1 user story. Its phase delivers the complete playable scored loop.

## Phase 1: Setup

**Purpose**: Confirm the Feature 001 baseline before editing it.

- [X] T001 Run `npm test` and `npm run build` from `package.json`; inspect `src/game.ts`, `src/main.ts`, and `src/game.test.ts` for the existing row animation, right-to-left input, countdown, and cleanup paths so the baseline is known before replacement.

---

## Phase 2: Foundational

**Purpose**: Add the shared state shape without interrupting the current runnable page.

- [X] T002 Define `Game`, `Round`, and indexed fruit-position types in `src/game.ts` alongside the existing exports: `index` is "Fixed physical position from left to right" (0â€“3), `fruit` allows repeats, and `status` is `pending | selected | missed` and "Can leave `pending` only once"; the round has four positions "Freshly generated at each round start", with `missedCount` "Derived from positions or stored consistently" and feedback that "Describes the most recent accepted event"; game status is `ready | playing | game-over` and "Game Over is terminal until Play Again". Preserve the current page imports until the story integration is ready.

**Checkpoint**: The existing page still starts and the shared state has explicit position identity.

---

## Phase 3: User Story 1 - Play a Scored Game Across Rounds (Priority: P1) MVP

**Goal**: Award correct choices, deduct lives for wrong choices and misses, continue across rounds, stop at Game Over, and restart cleanly while preserving Feature 001 movement and controls.

**Independent Test**: Start a known four-fruit round at 0 points, 3 lives, and round 1; check +10 per correct position, -1 life per wrong choice or indexed miss, +25 only for all four selected with no misses, automatic next round with carried values, immediate Game Over at zero, ignored later events, and a clean Play Again reset. Confirm the same behavior in the browser while the row moves and in reduced motion.

### Tests for User Story 1

- [X] T003 [US1] Replace obsolete five-second countdown and immediate-failure assertions in `src/game.test.ts` with failing deterministic tests for four-position generation including repeats, right-to-left input, 10 points per correct press, wrong press retaining the expected position and costing one life, one life per indexed miss with no duplicate charge, a 25-point bonus exactly once only for four selected/no misses, automatic round increment with carried score/lives, zero-life Game Over priority and ignored later events, and Play Again reset; include compact parameterized samples matching SC-001â€“SC-005.

### Implementation for User Story 1

- [X] T004 [P] [US1] Add restrained styles in `src/style.css` for readable score, numeric lives with optional hearts, round number, selected/missed position feedback, and a Game Over overlay using the existing palette and responsive layout; keep the four row slots at fixed widths so motion geometry cannot shift.
- [X] T005 [US1] Implement pure start/restart, select, indexed-miss, completion, and terminal transitions in `src/game.ts` to pass T003: score "Starts at 0; +10 per correct position; +25 once for eligible round"; lives "Starts at 3; -1 per wrong choice or missed position; never negative"; `roundNumber` "Starts at 1; increments once only when a round finishes with lives remaining"; `round` is "The only active row; replaced on automatic transition or restart". Inject random draws for tests, award the bonus atomically, and process Game Over before any next-round transition.
- [X] T006 [US1] Wire the new game state into `src/main.ts`: retain one Start/Play Again and fruit-button click handler, keep buttons active from round start, render score/lives/round/progress and immediate text feedback, rebuild the fixed four-slot row only for a fresh round, show final score and round reached at Game Over, cancel old motion on transition/restart, remove the former five-second overlay/timer path, and resolve remaining pending positions at animation completion as an initial playable boundary fallback.
- [X] T007 [US1] Refine `src/main.ts` boundary handling to compare the left edge of the leftmost pending fruit slot with the playfield's right edge on animation frames, then resolve every pending slot already across it separately and once; reconcile before a fruit click and on animation completion, discard that click if reconciliation changed rounds or ended the game, and stop immediately at zero lives. Preserve the single linear row speed and invalidate/cancel stale animation frames and callbacks with the round token.
- [X] T008 [US1] Update the `prefers-reduced-motion` path in `src/main.ts` to keep the static row readable for at least three seconds with active input, then resolve each pending position once under the same life rules, stop at Game Over or start the next round when lives remain, and cancel the old static timer on transition or restart.
- [ ] T009 [US1] Run `npm test` and `npm run build` using `package.json`, then validate the moving-row, repeated-fruit, boundary, wrong-input, clean/missed-round, Game Over, restart, keyboard, narrow-viewport, and reduced-motion scenarios in `specs/002-scoring-lives-game-over/quickstart.md`; record observed outcomes and any fixes in `specs/002-scoring-lives-game-over/development-log.md`.

**Checkpoint**: The complete Feature 002 loop is playable; automated rules and browser behavior meet the story's independent test.

---

## Phase 4: Polish and Cross-Cutting Concerns

**Purpose**: Capture process evidence and finish the user-facing instructions.

- [X] T010 Record the important Feature 002 prompts, successful and unsuccessful AI-generated attempts, notable problems, manual corrections, test evidence, and lessons learned in `specs/002-scoring-lives-game-over/development-log.md` without inventing outcomes.
- [X] T011 Update `README.md` with concise installation, launch, right-to-left play, scoring/lives/Game Over/Play Again instructions, and a Vibe Coding summary grounded in `specs/002-scoring-lives-game-over/development-log.md`.
- [X] T012 Perform the SC-006 five-player check for understanding score, remaining lives, round, and Game Over without explanation; record the count and any resulting corrections in `specs/002-scoring-lives-game-over/development-log.md`, and report the criterion as pending if five participants are unavailable.

---

## Dependencies and Execution Order

```text
Setup T001
   â†“
Foundation T002
   â”œâ”€â†’ US1 tests T003 â†’ rules T005 â†’ page loop T006 â†’ boundary T007 â†’ reduced motion T008 â†’ validation T009
   â””â”€â†’ US1 styles T004 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                                                     â†“
                                                                    log T010 â†’ README T011 â†’ player check T012
```

- **User Story 1 (P1)**: Starts after T002 and has no dependency on another story. T003 and T004 may proceed in parallel because they touch different files and neither uses the other's output. T005 follows the failing tests; T006 follows the rules; T007 and T008 refine one page module in order. T009 needs the full story, including T004.
- **Polish**: T010 follows actual implementation and validation; T011 uses its evidence; T012 follows the playable UI. Do not claim SC-006 passed without five observed players.

## Parallel Example: User Story 1

After T002, the following work can proceed independently:

```text
T003: Write deterministic gameplay tests in src/game.test.ts.
T004: Style the HUD, resolved positions, and Game Over in src/style.css.
```

No other code tasks are marked parallel because they share `src/game.ts` or `src/main.ts`, or require preceding behavior.

## Implementation Strategy

1. Keep the Feature 001 page runnable while introducing the new state shape and failing tests.
2. Implement pure rules, then connect the page for a basic complete loop at row exit.
3. Add exact boundary timing and reduced-motion behavior, verifying each change before proceeding.
4. Run the full quickstart checks, fix gameplay-breaking issues, then finish process notes and README.

**MVP scope**: User Story 1. It is the only story and contains the full scored game loop; no later-stage features are included.





## Phase 5: Convergence

- [X] T013 CRITICAL: Create the Feature 002 development log and record important prompts, successful and unsuccessful AI-generated attempts, notable problems, manual corrections, test evidence, and lessons learned without inventing outcomes per Constitution VI and T010 (missing)
- [X] T014 CRITICAL: Update README.md installation, launch, gameplay, scoring, lives, round, Game Over, and Play Again instructions and its Vibe Coding summary to match Feature 002 and the recorded development evidence per Constitution VI and T011 (contradicts)
- [ ] T015 Run npm test and npm run build, validate moving-row timing, repeated fruits, boundary misses, wrong input, clean and missed rounds, Game Over, restart, keyboard input, narrow viewport, and reduced motion against quickstart.md, then record observed outcomes and fixes in the Feature 002 development log per T009 (partial)
- [X] T016 Conduct the five-player score, lives, round, and Game Over understanding check and record the count and corrections in the Feature 002 development log; if participants are unavailable, record the criterion as pending per T012 (missing)
