---

description: "Dependency-ordered implementation tasks for Fruit Rush Feature 004"
---

# Tasks: Visual Polish, Animations, and Audio Feedback

**Input**: Design documents from specs/004-visual-polish-feedback/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md
**Tests**: Focused automated tests for transition and audio behavior, existing rules tests, build, and browser acceptance checks.
**Organization**: Tasks are grouped by user story. All work belongs on branch 004-visual-polish-feedback.

## Format

- [P] means parallelizable with other unblocked tasks because the files differ.
- [US1]–[US4] map to the four user stories in spec.md.
- Each task gives an exact file path.

## Phase 1: Setup

**Purpose**: Capture the existing playable baseline before editing the game.

- [X] T001 Create specs/004-visual-polish-feedback/development-log.md with the active branch, 35-test/build baseline, Features 001–003 invariants (including rightmost-first input and Feature 003 speeds), and sections for prompts, attempts, corrections, browser evidence, and lessons.

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Expose game transitions to visual and audio feedback without changing rules in src/game.ts.

- [X] T002 Write failing transition tests in src/presentation.test.ts for ordinary correct selection, indexed repeated-fruit selection, clean final-fruit completion, incorrect choice with life loss, boundary miss, Game Over precedence, and unchanged game returning no event.
- [X] T003 Implement pure before/after classification in src/presentation.ts to satisfy T002: emit a temporary kind and affected round/position/control where applicable, prioritize Game Over > clean round > wrong choice/life loss > missed-fruit life loss > ordinary correct, and never mutate Game.
- [X] T004 Route accepted chooseFruit and missFruit results through the classifier in src/main.ts while retaining immediate acceptGame, delegated input, pre-click boundary checks, movement speed, reduced-motion timer, and round-token cancellation; run npm test/build and record results in specs/004-visual-polish-feedback/development-log.md.

**Checkpoint**: The current game remains playable and each transition yields one presentation event.

---

## Phase 3: User Story 1 - Recognize and Play the Polished Game (P1) MVP

**Goal**: Present Fruit Rush with matching local art, a distinct playfield, readable status, and unchanged movement.

**Independent Test**: Start at 320px and 1280px; match four moving fruits to controls; inspect complete three-to-eight-fruit rows; play a rightmost-first round with established rules.

### Implementation

- [X] T005 [P] [US1] Draw a compact, distinct apple SVG with a consistent shared viewBox, visual weight, and no remote references in public/fruits/apple.svg.
- [X] T006 [P] [US1] Draw a compact, distinct banana SVG with the same viewBox and visual weight in public/fruits/banana.svg.
- [X] T007 [P] [US1] Draw a compact, distinct grape SVG with the same viewBox and visual weight in public/fruits/grape.svg.
- [X] T008 [P] [US1] Draw a compact, distinct orange SVG with the same viewBox and visual weight in public/fruits/orange.svg.
- [X] T009 [P] [US1] Set the browser page title to Fruit Rush in index.html.
- [X] T010 [US1] Replace emojis with one fruit-to-local-illustration/name mapping in src/main.ts for both row and buttons; retain accessible fruit names, right-to-left instructions, and Game-derived score/lives/round/progress/difficulty.
- [X] T011 [US1] Add coherent arcade color, type, spacing, status tiles, a distinct field, and fixed-aspect art sizing in src/style.css without changing row slot geometry or Feature 003 movement speed.
- [X] T012 [US1] Run the ready-screen, four-fruit, row-spacing, and rightmost-first checks in specs/004-visual-polish-feedback/quickstart.md at 320px and 1280px; record evidence/issues in specs/004-visual-polish-feedback/development-log.md.

**Checkpoint**: User Story 1 is a playable visual MVP.

---

## Phase 4: User Story 2 - Understand Each Action Immediately (P1)

**Goal**: Show immediate positive/negative, score/life, and clean-round effects without delaying or duplicating gameplay.

**Independent Test**: Make correct, wrong, missed, final-fruit, and rapid repeated inputs; verify distinct responses and exact score/life/position changes during disappearance.

### Tests

- [X] T013 [US2] Extend src/presentation.test.ts before UI changes for repeated fruit identities by index, clean bonus plus immediate next-round classification, consecutive misses, terminal wrong/miss priority, and rapid accepted transitions without duplicate events.

### Implementation

- [X] T014 [P] [US2] Define brief positive/negative button, selected-fruit disappearance, score-gain, life-loss, and clean-round styles in src/style.css; animate children/overlays, never row transform or slot width, and retain text cues.
- [X] T015 [US2] Consume classified events in src/main.ts for control, indexed fruit, score, life, and clean-round effects after immediate state acceptance; show a final-fruit echo/highlight independent of the replaced row.
- [X] T016 [US2] Add reduced-motion versions of decorative effects in src/style.css without changing the three-second static viewing interval.
- [X] T017 [US2] Cancel/replace stale effects in src/main.ts on rapid input, new rounds, Game Over, and restart; leave fruit controls enabled and keep one delegated listener.
- [X] T018 [US2] Execute 30 correct/wrong inputs and 20 rapid-input trials from specs/004-visual-polish-feedback/quickstart.md, including repeated fruits and final-fruit transitions; record timing and exact state outcomes in specs/004-visual-polish-feedback/development-log.md.

**Checkpoint**: Effects never gate rules; rapid input produces no duplicate processing.

---

## Phase 5: User Story 3 - Control Optional Sound (P2)

**Goal**: Provide five brief event cues and a visible mute control while keeping silent play fully functional.

**Independent Test**: Hear each permitted cue, mute during playback, verify subsequent silence, and repeat with blocked/unavailable audio without gameplay errors.

### Tests

- [X] T019 [US3] Write failing focused tests in src/audio.test.ts with a controllable audio capability for session-only mute, no queued cue while blocked, one prioritized cue per event, stopping voices on mute, and disposal on restart/page exit.

### Implementation

- [X] T020 [US3] Implement src/audio.ts with one lazy browser audio context and brief synthesized cues; muted is Boolean for the current page session only, availability is not created/ready/suspended or blocked/unavailable, active voices form a small bounded set, finished voices release resources, and failures never throw into gameplay.
- [X] T021 [P] [US3] Style the visible mute/unmute control for ready, playing, and Game Over states with distinct focus/pressed states in src/style.css.
- [X] T022 [US3] Add a labeled mute button with accessible pressed state in src/main.ts; initialize/resume audio only on user gesture, send at most one classified cue per transition, and never await playback before accepting input or changing rounds.
- [X] T023 [US3] Stop stale cues on mute, Game Over/restart, and page exit through src/main.ts and src/audio.ts; preserve mute choice across restart and visual messages when silent.
- [X] T024 [US3] Perform five-cue, 25-event muted, blocked-audio, rapid-event, and restart checks from specs/004-visual-polish-feedback/quickstart.md; record results/limits in specs/004-visual-polish-feedback/development-log.md.

**Checkpoint**: Audio cannot interrupt input or misstate an event.

---

## Phase 6: User Story 4 - Play on Mobile and Finish Clearly (P2)

**Goal**: Make ready, active, and Game Over screens comfortable on mobile and desktop with clear focus and restart behavior.

**Independent Test**: Play Start, Game Over, and Play Again at 320px and 1280px by touch/pointer and keyboard; check no horizontal scroll, final values, and fresh initial state.

### Implementation

- [X] T025 [US4] Refine ready and Game Over markup in src/main.ts with prominent Start/Play Again, final score and round reached, useful text, focus on restart, and unchanged game-state transitions.
- [X] T026 [US4] Make src/style.css responsive at 320px and 1280px for all screens: no horizontal page scrolling, readable status/difficulty, clear captions, distinguishable long rows, and four fruit buttons at least 44 by 44 pixels.
- [X] T027 [US4] Set normal-text contrast to at least 4.5:1, large-text/control-boundary contrast to at least 3:1, and visible keyboard focus in src/style.css without relying solely on color/motion.
- [X] T028 [US4] Ensure src/main.ts announces meaningful outcomes through status text, supports native button pointer/touch/Enter/Space activation, and clears stale presentation/audio on Play Again while retaining score 0, three lives, round 1, three fruits, and 100% speed.
- [X] T029 [US4] Complete narrow/standard, touch, keyboard, reduced-motion, contrast, and ten Game Over/restart checks in specs/004-visual-polish-feedback/quickstart.md; record measurements and results in specs/004-visual-polish-feedback/development-log.md.

**Checkpoint**: All screen states work at both supported widths.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T030 [P] Update README.md with Fruit Rush title, gameplay, mute, setup/run instructions, and a concise Vibe Coding summary based on specs/004-visual-polish-feedback/development-log.md.
- [X] T031 Run npm test and npm run build after all changes; document results in specs/004-visual-polish-feedback/development-log.md and fix any Features 001–003 regression in the affected src/game.ts, src/main.ts, or src/style.css file.
- [X] T032 Complete the full specs/004-visual-polish-feedback/quickstart.md sweep: 20 rows, 30 inputs, 20 rapid trials, five checks per cue, 25 muted events, all Feature 003 tiers, 320px/1280px layouts, and ten restarts; record evidence or explicitly pending checks in specs/004-visual-polish-feedback/development-log.md.
- [X] T033 Conduct the five-player understanding check from specs/004-visual-polish-feedback/quickstart.md and record the result in specs/004-visual-polish-feedback/development-log.md; if participants are unavailable, mark SC-007 pending rather than passed.
- [X] T034 Review specs/004-visual-polish-feedback/spec.md, specs/004-visual-polish-feedback/plan.md, and specs/004-visual-polish-feedback/development-log.md against the constitution and scope; document exceptions, confirm unchanged gameplay/speed and no runtime dependency, and leave the game playable.

## Dependencies & Execution Order

### Phase dependencies

- T001 precedes T002–T004; the foundation precedes all user stories.
- US1 and US2 are both P1. US2 can use the existing visuals after foundation, but its final integration check follows US1 to avoid src/main.ts and src/style.css conflicts.
- US3 audio files can develop after foundation, independently of artwork/effects; src/main.ts integration follows the visual event path.
- US4 follows US1–US3 because it finalizes shared markup and styles. Polish follows all story checkpoints.

### User story dependencies

- **US1**: Foundation only; suggested MVP.
- **US2**: Foundation for event classification; US1 needed for final combined visual check.
- **US3**: Foundation for event classification; integrates after US2.
- **US4**: Shared screen/layout pass after the earlier stories.

### Within each story

- T002 precedes T003; T013 and T019 precede their respective implementations, with initially failing tests.
- Only different-file, unblocked tasks marked [P] may run in parallel.
- Run each story's independent browser check before its checkpoint.

## Parallel Execution Examples

- **US1**: T005–T009 can run together after T004; each writes a different SVG or index.html. T010–T012 then follow.
- **US2**: T013 (src/presentation.test.ts) and T014 (src/style.css) can be prepared together after foundation; T015–T018 follow.
- **US3**: T019 (src/audio.test.ts) and T021 (src/style.css) can be prepared together after foundation; T020 and T022–T024 follow.
- **US4**: T025 (src/main.ts) and initial T026 layout (src/style.css) can be prepared together after US1–US3; reconcile T027–T029 before the checkpoint.

## Implementation Strategy

1. Complete setup and foundation while keeping the existing game playable.
2. Deliver and independently validate US1 as the visual MVP.
3. Add US2 effects and rapid-input protection, then US3 optional sound and mute.
4. Finish US4 responsive/accessibility and Game Over/restart presentation.
5. Run full regression/browser evidence, update documentation, and report any player observation still pending.

## Notes

- [P] does not permit parallel edits to src/main.ts or src/style.css.
- No task adds fruit types, scoring rules, difficulty tiers, power-ups, persistence, backend, multiplayer, or leaderboards.
- Keep src/game.ts and Feature 003's linear movement-speed calculation unchanged unless a regression requires a narrowly justified fix.
