---

description: "Implementation tasks for Feature 006: named top-ten highscores, retro music, and icon-only sound control"
---

# Tasks: Named Highscore List and Retro Background Music

**Input**: Design documents from `specs/006-highscore-list-music/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: The specification explicitly requires gameplay regression checks and measurable ranking/audio outcomes. Add focused tests for stateful ranking and music lifecycle, then run the existing suite and browser scenarios.

**Organization**: Tasks are grouped by user story. US1 delivers a usable single-run name submission; US2 extends it to the persistent top ten; US3 adds music and the icon control without changing game rules.

## Format: `[ID] [P?] [Story] Description`

- **[P]** means the task can run in parallel with other eligible tasks because it touches different files and has no incomplete prerequisite.
- **[US1]**, **[US2]**, and **[US3]** correspond to the user stories in [spec.md](spec.md).
- All paths are relative to the repository root.

## Phase 1: Setup

**Purpose**: Verify the existing playable baseline and capture evidence before edits.

- [ ] T001 Verify branch `006-highscore-list-music`, run `npm test` and `npm run build`, and record the baseline in `specs/006-highscore-list-music/development-log.md`.

---

## Phase 2: Foundational

**Purpose**: Establish the minimal shared ranking representation used by US1 and US2, leaving existing gameplay rules unchanged.

- [ ] T002 Define a highscore entry and ordering helper in `src/highscore.ts` with the `data-model.md` constraints: `name` is "Player-provided trimmed 1–16 visible characters; null only for the imported legacy best", `score` is "Completed run's final score, or valid legacy best" and a nonnegative safe integer, and `order` is "Unique increasing submission order for stable ties" and a nonnegative safe integer; rank by score descending then order ascending and keep at most ten.

**Checkpoint**: Ranking values and deterministic ordering are available; `src/game.ts` remains untouched.

---

## Phase 3: User Story 1 - Enter a name after Game Over (Priority: P1) 🎯 MVP

**Goal**: One completed run can be submitted once with a valid name; replay works with or without submission.

**Independent Test**: Reach Game Over, reject a blank name, submit one valid name, observe it immediately, press Save repeatedly without a duplicate, and replay without entering a name.

### Tests for User Story 1

- [ ] T003 [US1] Add focused tests in `src/highscore.test.ts` for trimming, rejecting blank or overlong names, accepting 1–16 visible characters, safe text values, and one in-memory candidate insertion for a completed score.

### Implementation for User Story 1

- [ ] T004 [US1] Implement name validation and one in-memory result submission in `src/highscore.ts`, preserving the existing `HighscoreTracker.best` behavior and returning whether the candidate entered the current top ten.
- [ ] T005 [US1] Add a labeled Game Over name field, inline validation/result message that shows the submitted name and score, Save score action, and per-run submitted flag in `src/main.ts`; accept at most one valid submission, reset the flag only on Start/Play Again, and allow replay without submission.
- [ ] T006 [US1] Style the Game Over name form and status message in `src/style.css` for keyboard focus, touch targets, and narrow screens without altering playfield motion.
- [ ] T007 [US1] Exercise the US1 independent test in `specs/006-highscore-list-music/development-log.md`, including rapid repeated Save, invalid name retry, and replay without submission.

**Checkpoint**: A named result can be submitted once after Game Over; gameplay and personal-best logic still pass existing tests.

---

## Phase 4: User Story 2 - See the ten best local results (Priority: P1)

**Goal**: Show a stable, browser-local top ten on Start and Game Over, retaining earlier Feature 005 best data.

**Independent Test**: Submit 12 distinct scores, verify exactly ten descending entries on both screens and after reload, check stable ties, and preserve a pre-existing single-number best as `Legacy record`.

### Tests for User Story 2

- [ ] T008 [US2] Extend `src/highscore.test.ts` with 12-run sorting/truncation, equal-score earlier-order priority, tenth-place rejection, v1 legacy migration exactly once, persistence/reload, malformed-snapshot salvage, and storage-denied in-memory fallback cases.

### Implementation for User Story 2

- [ ] T009 [US2] Add one versioned local ranking snapshot in `src/highscore.ts` with `version`, validated `entries` (at most ten), and `nextOrder` greater than every retained order; migrate a valid positive `fruit-rush.highscore.v1` once when no valid snapshot exists, never re-import it on later loads, and keep numeric best independent of skipped name entry.
- [ ] T010 [US2] Render separate Start and Game Over Top 10 sections in `src/main.ts`, with rank/name/score, empty state, `Legacy record` for null names, immediate refresh after submission, and names inserted only as text; keep ranking outside the fixed-height playfield and hidden during active play.
- [ ] T011 [US2] Style the ranking sections in `src/style.css` for ten readable rows, stable score alignment, no horizontal overflow at 360px, and unchanged fruit-control sizes.
- [ ] T012 [US2] Run the US2 independent test and storage-failure cases from `specs/006-highscore-list-music/quickstart.md`; record observed results in `specs/006-highscore-list-music/development-log.md`.

**Checkpoint**: The top ten survives reload in the same browser profile, while the existing personal best remains correct even when name entry is skipped.

---

## Phase 5: User Story 3 - Hear retro music and use an icon-only sound control (Priority: P2)

**Goal**: Play one quiet original MIDI-style loop during active play and control both music and effects with a recognizable upper-right icon.

**Independent Test**: Start, mute, unmute, reach Game Over, and restart repeatedly; music follows play state without overlapping, effects follow mute, and the icon works by keyboard, touch, and pointer at desktop and 360px widths.

### Tests for User Story 3

- [ ] T013 [P] [US3] Extend `src/audio.test.ts` with permitted/suspended/unavailable audio, start-after-gesture, rapid mute/unmute and restart, Game Over stop, disposal, and at-most-one active music scheduler/voice set cases.

### Implementation for User Story 3

- [ ] T014 [US3] Extend `SoundController` in `src/audio.ts` with a quiet original short-note retro loop using the existing audio context, one bounded scheduler, tracked music voices, and generation-safe start/stop; mute must silence music and effects immediately, and Game Over/restart/pagehide must clear music resources.
- [ ] T015 [US3] Wire music start/stop and mute/unmute to existing Start, Game Over, Play Again, and pagehide transitions in `src/main.ts`, without delaying game input or suppressing the terminal sound cue.
- [ ] T016 [US3] Replace the visible `Sound on/off` button text in `src/main.ts` with an inline speaker-on/speaker-off icon, update `aria-label` between `Mute sound` and `Unmute sound`, retain `aria-pressed`, and avoid a visible tooltip.
- [ ] T017 [P] [US3] Position and style the icon button in the header's upper-right corner in `src/style.css` with a minimum 44 × 44 pixel target, reserved title space at 360px, and the existing visible focus state.
- [ ] T018 [US3] Exercise the US3 independent test and denied-audio fallback from `specs/006-highscore-list-music/quickstart.md`; record audible/visual observations and browser limitations in `specs/006-highscore-list-music/development-log.md`.

**Checkpoint**: Music and effects obey one icon control, and fruit gameplay remains responsive in silent and audible modes.

---

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Verify all stories together and update player/development documentation.

- [ ] T019 Run all automated tests and the production build, fix confirmed regressions, and record final commands/results in `specs/006-highscore-list-music/development-log.md`.
- [ ] T020 Check `specs/006-highscore-list-music/quickstart.md` at desktop and 360px mobile widths for rightmost-first input, +10 choices, +25 clean rounds, one life per mistake/miss, difficulty tiers, Game Over, reload, name submission, ranking, music, icon focus, mute, and rapid replay; record actual results in `specs/006-highscore-list-music/development-log.md`.
- [ ] T021 Update `README.md` with named local Top 10 and icon/music controls, and update `docs/vibe-coding-experience.md` with only verifiable Feature 006 outcomes plus developer TODOs for personal impressions.
- [ ] T022 Review `specs/006-highscore-list-music/spec.md` and `specs/006-highscore-list-music/checklists/requirements.md` against implemented behavior, then record remaining limitations or completion evidence in `specs/006-highscore-list-music/development-log.md`.

---

## Dependencies and Execution Order

### Phase dependencies

1. **Setup** T001 precedes edits so the baseline is known.
2. **Foundational** T002 precedes US1 and US2 because both use ranking values and ordering.
3. **US1** T003–T007 creates submission; **US2** T008–T012 extends it to persistence and two ranking views. US2 integration depends on the US1 submission path, although its storage tests can be prepared independently after T002.
4. **US3** T013–T018 depends only on the existing sound controller and common UI. It can proceed after T002 in a separate workstream, with `src/main.ts` integration sequenced to avoid conflicts with US1/US2.
5. **Polish** T019–T022 follows the stories.

### Within each story

- Write the focused tests before the behavior they cover, confirm they fail for the missing behavior, then implement and rerun them.
- Complete the model/storage behavior before wiring its UI. Validate each story at its checkpoint before moving on.
- T013 and T017 are parallelizable within US3 because audio tests and icon styling touch different files and do not rely on each other. T021 follows actual validation so documentation reports verified outcomes.

## Parallel Examples

### User Story 1

After T002, implement T003 in `src/highscore.test.ts` and independently prepare the form styling in T006 (`src/style.css`) once the form structure from the UI contract is agreed; integrate through T004–T005 before T007. T006 is left unmarked because its final selectors depend on T005.

### User Story 2

After US1, T008 in `src/highscore.test.ts` can be drafted while the ranking layout for T011 is designed. Finish T009 and T010 before T012; T011 is left unmarked because it uses T010's actual structure.

### User Story 3

Run T013 (`src/audio.test.ts`) and T017 (`src/style.css`) in parallel after the US2 UI is stable. Then finish T014 audio behavior, T015–T016 UI wiring, and T018 validation. Keep same-file `src/main.ts` changes sequential.

## Implementation Strategy

### MVP first

Complete T001–T007 and demonstrate one named score saved at Game Over without duplicate submission or broken replay. This is the smallest independently useful slice.

### Incremental delivery

Extend the MVP with T008–T012 to make the top ten persistent and visible on both screens. Then add T013–T018 for music and the icon-only control. Finish with T019–T022 to verify the complete existing gameplay loop and document actual outcomes. Each phase should leave Fruit Rush playable.

## Notes

- `src/game.ts` should not change unless a confirmed regression requires it.
- No backend, account, global leaderboard, external melody, MIDI parser, new fruit, or new scoring rule belongs to Feature 006.
- Source, tests, comments, commits, and documentation remain in English; the original German requests remain quoted in `docs/prompt-log.md`.
