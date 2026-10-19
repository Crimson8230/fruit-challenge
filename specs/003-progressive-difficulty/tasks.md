# Tasks: Progressive Difficulty

**Input**: Design documents in `specs/003-progressive-difficulty/`: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [UI contract](contracts/ui.md), and [quickstart.md](quickstart.md).

**Tests**: The specification requires implementation and verification evidence (FR-017), and the constitution requires essential gameplay tests. Add Vitest rule coverage and record actual browser observations; do not claim unavailable checks passed.

**Organization**: Tasks are grouped by user story. The P1 phase delivers the playable difficulty progression; the P2 phase makes it legible and understandable.

## Phase 1: Setup

**Purpose**: Establish the existing game's behavior and an honest record of validation.

- [X] T001 Run `npm test` and `npm run build` from `package.json`, inspect the current four-fruit movement and scoring behavior in `src/game.ts`, `src/main.ts`, and `src/game.test.ts`, and record baseline results and important prompts in `specs/003-progressive-difficulty/development-log.md`.
- [X] T002 Perform the still-open applicable Feature 002 browser checks from `specs/002-scoring-lives-game-over/quickstart.md` (moving row, boundary, wrong input, round, Game Over, restart, keyboard, narrow viewport, and reduced motion); record observations or an explicit environment limitation in `specs/003-progressive-difficulty/development-log.md` and update the outstanding status in `specs/002-scoring-lives-game-over/development-log.md` without claiming unobserved success.

---

## Phase 2: Foundational

**Purpose**: Establish one pure source of difficulty before changing the live game.

- [X] T003 Add table-driven tests for rounds 1, 2, 3, 5, 7, 9, 11, 13, 15, 16, and 25, including a positive-integer round guard and caps of eight fruits and 200% speed, in `src/game.test.ts`.
- [X] T004 Implement a pure round-number difficulty calculation in `src/game.ts`: `roundNumber` is a positive integer; `fruitCount` is an integer 3–8 equal to `min(3 + floor((roundNumber - 1) / 2), 8)` and `speedPercent` is an integer 100–200 equal to `min(100 + 15 * floor((roundNumber - 1) / 2), 200)`; derive both anew from the round number rather than incrementing stored difficulty.

**Checkpoint**: Existing gameplay remains runnable, and every difficulty tier is independently verified.

---

## Phase 3: User Story 1 - Play Rounds That Grow More Difficult (Priority: P1) MVP

**Goal**: Play successive rounds of three through eight fruits at fixed, increasing row speed while retaining scoring, lives, misses, Game Over, and restart.

**Independent Test**: Start at round 1 and verify 3/100%; complete or miss rounds through each tier, checking exact lengths and speeds, leftmost-first selection, +10 per correct choice, +25 once for a clean round, one life per wrong choice or indexed miss, automatic transitions, immediate Game Over, and a fresh round-1 restart. Compare actual row travel at differing frame update rates.

### Tests for User Story 1

- [X] T005 [US1] Replace fixed-four, Cherry, and rightmost-first expectations in `src/game.test.ts` with failing deterministic tests for fresh 3–8-position rounds using only apple, banana, grape, and orange (repeats allowed); leftmost pending selection; exact +10 scoring; wrong input retaining the pending position and bonus eligibility; indexed misses charging once; +25 clean bonus once at varying lengths; carried score/lives; round-number-based difficulty after both clean and missed rounds; final-life terminal priority; and reset from a higher round to 3/100% with no old position state.

### Implementation for User Story 1

- [X] T006 [US1] Update `FRUITS`, `generateSequence`, round validation, start/restart, and completion in `src/game.ts` so each fresh round has exactly its derived `fruitCount` of apple/banana/grape/orange positions; repeats are valid, position indexes stay fixed, and score/lives carry into the next round while its difficulty is derived anew.
- [X] T007 [US1] Change `chooseFruit` in `src/game.ts` to resolve only the leftmost pending index, award 10 points for a match, and leave that index and score intact while deducting one life for a wrong choice; preserve one-time indexed misses, the 25-point no-miss bonus, and Game Over before any further bonus or transition.
- [X] T008 [US1] Update the single-screen instructions, fruit icon/label map, choices, and variable-length selected progress in `src/main.ts` to use Apple, Banana, Grape, Orange, left-to-right input, and `selectedCount / fruitCount`; keep numeric lives, immediate text feedback, and buttons available during row entrance.
- [X] T009 [US1] Rework `moveRow` in `src/main.ts` to measure actual rendered row width, use the old 55%-row reference speed `(0.45 * fieldWidth) / 3500` pixels per millisecond multiplied once by the current round's `speedPercent / 100`, and derive entrance and total linear-animation times from that fixed speed and actual row width; keep all slots mounted, reconcile leftmost pending boundary positions before clicks and at animation completion, and stop resolving on a new round or Game Over.
- [X] T010 [US1] Verify and adjust the `prefers-reduced-motion` timer, `stopMotion`, and round-token handling in `src/main.ts` so the full row stays static and accepts input for at least 3000 ms, pending indexes then miss once each, and stale animation, frame, or timer callbacks cannot alter a new round or restart.
- [X] T011 [US1] Run `npm test` and `npm run build` from `package.json`; use the Story 1 scenarios in `specs/003-progressive-difficulty/quickstart.md` to verify moving-row speed, boundary reconciliation, scoring, lives, transitions, terminal state, and restart in a browser, recording measured outcomes and any corrections in `specs/003-progressive-difficulty/development-log.md`.

**Checkpoint**: The progression is playable and independently testable through Game Over and restart.

---

## Phase 4: User Story 2 - Recognize and Read the Current Challenge (Priority: P2)

**Goal**: Show the active round's pace and keep all three through eight fruit positions readable at narrow and standard widths.

**Independent Test**: At rounds 1 and 15, inspect speed, score, round, progress, sequence order and spacing, and all four controls at 320px and 1280px; verify no neighbor overlap or incorrect clipping while the full row is inside the field. With reduced motion, confirm a readable full row for at least three seconds and the matching speed label.

### Implementation for User Story 2

- [X] T012 [P] [US2] Size `.fruit-row`, `.row-fruit`, `.fruit-icon`, and responsive status/controls rules in `src/style.css` for three through eight stable slots at 320px and 1280px, preserving distinct fruit icons, consistent gaps, readable labels or accessible names, and no neighbor overlap or clipping while the full row is inside the playfield.
- [X] T013 [P] [US2] Add a speed percentage to the existing score/lives/round/progress status in `src/main.ts`, deriving the display from the same round-number difficulty used for sequence and motion; update it only on a new round or restart, keep the single-screen controls, and show the entire static row during reduced motion.
- [X] T014 [US2] Run the layout, pointer, keyboard, speed-label, and reduced-motion browser walkthrough in `specs/003-progressive-difficulty/quickstart.md` at 320px and 1280px for short and eight-fruit rows; inspect ten fully visible crossings for overlap or clipping and record actual outcomes and corrections in `specs/003-progressive-difficulty/development-log.md`.

**Checkpoint**: Players can read the challenge and answer it at supported widths and with reduced movement.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Finish measurable verification and project documentation.

- [X] T015 Check the buildable SC-001–SC-005 samples in `specs/003-progressive-difficulty/quickstart.md`, including 20 moving rows across difficulty levels, elapsed-time travel at different display update rates within 5% where measurable, 20 correct inputs, 10 clean rounds, 20 wrong choices or misses, and 10 higher-round restarts; record actual counts, results, and any unavailable checks in `specs/003-progressive-difficulty/development-log.md`.
- [X] T016 Conduct the SC-006 five-player check for identifying current difficulty and the next fruit in an early and an eight-fruit round without explanation; record the success count and any resulting corrections in `specs/003-progressive-difficulty/development-log.md`, or mark the criterion pending if five participants are unavailable.
- [X] T017 Update `README.md` with concise installation, execution, three-to-eight-fruit left-to-right gameplay, speed tiers, scoring/lives/Game Over/restart, and a Vibe Coding summary grounded in the recorded prompts, successful and unsuccessful attempts, corrections, validation evidence, and lessons in `specs/003-progressive-difficulty/development-log.md`.
- [X] T018 Run final `npm test` and `npm run build` from `package.json`, review the finished game against the seven principles in `.specify/memory/constitution.md`, confirm it remains playable with no added backend, persistence, menus, or runtime dependencies, and record the final results and any exceptions in `specs/003-progressive-difficulty/development-log.md`.

---

## Dependencies & Execution Order

```text
Setup T001 → inherited browser gate T002 → difficulty tests T003 → pure mapping T004
                                                        ↓
US1 tests T005 → rules T006–T007 → page T008–T010 → story check T011
                                                        ↓
                           US2 styles T012 + status T013 → story check T014
                                                        ↓
                            sample checks T015 + player check T016 → README T017 → final gate T018
```

- **User Story 1 (P1)**: Depends on foundational mapping T004. Write T005 before the rule changes; T006 and T007 precede page integration. T009 follows T008 because both edit `src/main.ts`; T010 follows motion integration.
- **User Story 2 (P2)**: Depends on the playable variable-length row from US1. T012 and T013 may proceed in parallel because they edit different files; T014 follows both.
- **Polish**: T015 and T016 can proceed in parallel after the readable game exists. T017 follows the recorded outcomes. T018 is the final gate.

## Parallel Execution Examples

### User Story 1

Once T004 is complete, a reviewer can check the baseline and acceptance scenarios in `specs/003-progressive-difficulty/quickstart.md` while T005 is written in `src/game.test.ts`; implementation of `src/game.ts` follows the failing tests. The tasks that edit `src/main.ts` remain sequential to keep each playable increment reviewable.

### User Story 2

After T011, run T012 in `src/style.css` and T013 in `src/main.ts` concurrently; validate them together in T014. No task shares a file with another task marked `[P]` in the same phase.

## Implementation Strategy

1. Establish the baseline and inherited browser-check status, then add the pure difficulty mapping while the existing game remains playable.
2. Deliver **MVP: User Story 1** by implementing the variable sequence, leftmost-first rules, and constant physical row speed; verify it through Game Over and restart.
3. Add User Story 2's status and responsive geometry, then validate narrow, standard, keyboard, and reduced-motion play.
4. Record measured checks and participant availability honestly, update the README from the development log, and finish with tests, build, and constitution review.

## Phase 6: Input Order Correction

**Purpose**: Supersede the earlier leftmost-first tasks after the player's correction; fruit positions remain physically ordered left to right, while input is rightmost pending first.

- [X] T019 Change selection to the rightmost pending position in `src/game.ts`, update repeat and missed-position tests in `src/game.test.ts`, and restore right-to-left instructions in `src/main.ts` per the corrected FR-004.
- [X] T020 Align `specs/003-progressive-difficulty/spec.md`, `plan.md`, `data-model.md`, `research.md`, `contracts/ui.md`, `quickstart.md`, `checklists/requirements.md`, `development-log.md`, and `README.md` with the corrected input direction; record the failed tests, correction, and validation evidence.
