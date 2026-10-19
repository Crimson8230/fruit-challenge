---

description: "Dependency-ordered implementation tasks for final Fruit Rush Feature 005"
---

# Tasks: Highscores, Finalization, and Label-Free Fruit Graphics

**Input**: Design documents from `specs/005-highscores-finalization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md
**Tests**: Existing automated suite, focused highscore tests, production build, and browser checks required by FR-015.
**Organization**: One phase per user story; all changes and the final commit belong on `005-highscores-finalization`.

## Format: `[ID] [P?] [Story] Description`

- **[P]** means work on different files with no incomplete dependency.
- **[US1]–[US4]** map to the four stories in spec.md.
- Every task names its file path; each story ends with an independent check.

## Phase 1: Setup

**Purpose**: Establish the Feature 004 baseline and evidence record before editing gameplay files.

- [X] T001 Verify the active branch is `005-highscores-finalization`, run baseline `npm test` and `npm run build`, and create `specs/005-highscores-finalization/development-log.md` with results, Features 001–004 invariants, and sections for prompts, attempts, corrections, browser checks, and lessons.

---

## Phase 2: Foundational

**Purpose**: Fix the exact source of truth and verification boundaries shared by all stories.

- [X] T002 Record in `specs/005-highscores-finalization/development-log.md` the current `src/game.ts` score/life/difficulty rules, `src/main.ts` delegated input and movement cleanup, four existing `public/fruits/*.svg` assets, and the available Feature 001–004 logs; note that `Game` and movement speed must remain unchanged.

**Checkpoint**: Baseline and scope are recorded; each user story can be checked against them.

---

## Phase 3: User Story 1 - Play by Recognizing Fruit Graphics (Priority: P1) MVP

**Goal**: Use only the existing fruit illustrations visibly while retaining accessible names and all established behavior.

**Independent Test**: At 320px and 1280px, inspect moving fruits and all four controls through ready, active, Game Over, and restart; verify no visible fruit-name labels/tooltips, accessible names, graphic matching, keyboard/touch use, and correct rightmost-first selection.

### Implementation

- [X] T003 [US1] Remove fruit-name text nodes from both moving-row and choice-button templates in `src/main.ts`; keep the shared SVG mapping and `data-fruit`, add explicit accessible fruit names to native buttons and an image role plus accessible name to each moving fruit, and add no fruit-name `title` or tooltip.
- [X] T004 [P] [US1] Remove obsolete `.fruit-name` rules and center the existing illustrations within unchanged row slot widths, gaps, icon sizes, and touch-target dimensions in `src/style.css`; retain hover, pressed, focus, removal, and reduced-motion effects.
- [X] T005 [US1] Execute the graphic-only and accessibility scenarios in `specs/005-highscores-finalization/quickstart.md` at 320px and 1280px; record visible-text, tooltip, accessible-name, repeated-fruit, keyboard/touch, and row-geometry evidence in `specs/005-highscores-finalization/development-log.md`.

**Checkpoint**: Story 1 is a playable label-free visual MVP.

---

## Phase 4: User Story 2 - Keep and Celebrate a Personal Best (Priority: P1)

**Goal**: Persist one safe personal best, update it immediately on score gains, and identify a new record for the current run.

**Independent Test**: Start without saved data, score and reload before Game Over, finish a record run, replay below or tied with the record, and repeat with invalid or inaccessible storage.

### Tests

- [X] T006 [US2] Write initially failing tests in `src/highscore.test.ts` for an initial 0, a valid saved best, immediate max-only updates, lower score/tie, multiple increases against one run baseline, reload semantics, and failed storage access/read/write; include empty, negative, fractional, nonnumeric, noncanonical, and oversized saved values.

### Implementation

- [X] T007 [US2] Implement a small browser-local tracker in `src/highscore.ts` with one versioned key and in-memory fallback: `best` is a **nonnegative safe integer**, persisted text accepts **0 or a positive integer without signs, leading zeros, spaces, fractions, exponent notation, or overflow**, and storage property access plus reads/writes are caught without throwing into gameplay; satisfy `src/highscore.test.ts`.
- [X] T008 [US2] Integrate `src/highscore.ts` into `src/main.ts`: capture `startingBest` on Start/Play Again, raise and persist best whenever an accepted `Game.score` exceeds it before rendering, show the current best in ready and Game Over, and show a run-level new-record indication only when final score is strictly greater than `startingBest`; keep `src/game.ts` unchanged.
- [X] T009 [P] [US2] Style the ready highscore, Game Over highscore, and distinct new-record indication in `src/style.css` with readable contrast and reduced-motion-safe presentation, without adding a sixth always-visible mobile status tile.
- [X] T010 [US2] Run the highscore scenarios in `specs/005-highscores-finalization/quickstart.md`, including reload before Game Over, at least six bad-storage conditions, tie/lower runs, and repeated increases; record exact outcomes and unavailable checks in `specs/005-highscores-finalization/development-log.md`.

**Checkpoint**: The personal best is persistent when permitted and independent of the active run.

---

## Phase 5: User Story 3 - Understand the Final Start and End Screens (Priority: P2)

**Goal**: Make the complete Start-to-Game-Over-to-replay loop clear and stable.

**Independent Test**: Read Start instructions, play to Game Over, check final and record values, then repeat Play Again by pointer, touch, and keyboard without stale effects or duplicate processing.

### Implementation

- [X] T011 [US3] Refine ready and Game Over markup/copy in `src/main.ts`: explain right-to-left selection before the right boundary, show the current highscore on Start and final score/highscore/round on Game Over, keep Start Game/Play Again prominent, retain focus transfer, and clear run-level record indication on replay while preserving best and mute.
- [X] T012 [US3] Adjust ready and Game Over layout in `src/style.css` for 320px and 1280px so instructions, highscore, final values, record indication, mute, and action buttons remain readable without horizontal scrolling or covered controls.
- [X] T013 [US3] Perform 10 Game Over/Play Again cycles using `specs/005-highscores-finalization/quickstart.md`; record 0 score, three lives, round 1, three fruits, 100% speed, preserved best, stopped prior motion/audio/timers, and single input handling in `specs/005-highscores-finalization/development-log.md`.

**Checkpoint**: The full loop is clear and restart leaves one fresh active game.

---

## Phase 6: User Story 4 - Review and Reproduce the Completed Project (Priority: P2)

**Goal**: Provide complete setup guidance and an honest, evidence-based Vibe Coding account.

**Independent Test**: A reviewer can follow README to install, run, test, and build, then trace experience-document facts to existing feature artifacts or marked developer TODOs.

### Implementation

- [X] T014 [P] [US4] Update `README.md` with project overview, technologies, installation, local development, build/check commands, graphic-only controls, rightmost-first scoring/life/difficulty rules, highscore behavior, project structure, and a concise Vibe Coding summary.
- [X] T015 [P] [US4] Create `docs/vibe-coding-experience.md` with objective, AI tools, Spec-Kit workflow, Features 001–005, important prompts, failed and successful attempts, corrections, lessons, and evidence links to `specs/001-core-fruit-input/development-log.md` through `specs/005-highscores-finalization/development-log.md`; mark unknown personal experiences and unrecorded prompts as explicit TODOs.
- [X] T016 [US4] Audit every factual prompt, problem, generated-solution, and manual-correction claim in `docs/vibe-coding-experience.md` against the cited feature logs and remove or mark unsupported claims as TODO; keep the `README.md` summary consistent.
- [X] T017 [US4] Follow `README.md` commands and structure links as a new reviewer, then record reproducibility and documentation findings in `specs/005-highscores-finalization/development-log.md`.

**Checkpoint**: A reviewer can reproduce the game and distinguish recorded facts from developer input still needed.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T018 Run all `npm test` and `npm run build` checks after implementation, fix any verified regression in the affected `src/highscore.ts`, `src/main.ts`, `src/style.css`, `src/game.ts`, or tests without changing an established rule, and record results in `specs/005-highscores-finalization/development-log.md`.
- [X] T019 Complete the remaining `specs/005-highscores-finalization/quickstart.md` browser sweep, reusing T005/T010/T013 evidence where valid: Start, multiple rounds, correct/wrong/missed inputs, clean bonus, each Feature 003 tier, Game Over, 10 restarts, highscore reload, bad storage, 320px/1280px, mute, rapid clicks, reduced motion, and zero visible fruit-name labels; record measured evidence or explicitly pending checks in `specs/005-highscores-finalization/development-log.md`.
- [X] T020 Review `src/game.ts`, `src/presentation.ts`, `src/audio.ts`, `src/main.ts`, `src/style.css`, `README.md`, and `docs/vibe-coding-experience.md` against `specs/005-highscores-finalization/spec.md` and the constitution; document unchanged mechanics, absence of new dependencies/services, and any exceptions in `specs/005-highscores-finalization/development-log.md`.
- [X] T021 Verify branch `005-highscores-finalization`, review and commit all Feature 005 source, documentation, and `specs/005-highscores-finalization/` artifacts on that branch, and record the final verification summary in `specs/005-highscores-finalization/development-log.md` before the commit.

## Dependencies & Execution Order

### Phase dependencies

- Setup T001 precedes foundational T002. No story begins before baseline and invariants are recorded.
- US1 and US2 are both P1. Their core files differ except `src/main.ts`, so finish one `src/main.ts` integration before starting the other.
- US3 uses the highscore state from US2 and the graphic-only controls from US1; complete both P1 stories first.
- US4 documentation can draft after baseline, but its final evidence audit follows implemented stories.
- Polish and the final commit follow all four story checkpoints.

### Within each story

- In US1, T003 and T004 can prepare independently; T005 validates their combination.
- In US2, T006 must fail before T007, T007 precedes T008, and T009 may prepare on its separate CSS file after the visual style is known; T010 validates integration.
- In US3, T011 and T012 integrate the existing screens; T013 validates repeated replay.
- In US4, T014 and T015 use different files and can draft in parallel; T016 reconciles them before T017.

## Parallel Execution Examples

- **US1**: T003 (`src/main.ts`) and T004 (`src/style.css`) touch different files.
- **US2**: After T006, T007 (`src/highscore.ts`) and T009 (`src/style.css`) touch different files; T008 follows tracker implementation.
- **US4**: T014 (`README.md`) and T015 (`docs/vibe-coding-experience.md`) can draft together.

## Implementation Strategy

1. Capture a clean branch/baseline and complete US1 as a playable graphic-only MVP.
2. Add highscore tests and storage logic, then integrate record display and verify US2 independently.
3. Finalize the two screens and restart lifecycle in US3.
4. Write and evidence-check README and the university experience document in US4.
5. Run all regression/browser checks, review scope, and commit only on the Feature 005 branch.

## Notes

- Keep `src/game.ts`, movement speed, scoring, lives, fruit types, and difficulty unchanged unless a confirmed regression requires a narrow fix.
- A failed or unavailable storage API must never stop gameplay; no backend, account, online leaderboard, or score history is in scope.
- [P] is valid only for different files with no unfinished prerequisite. Do not parallel-edit `src/main.ts` or `src/style.css`.
