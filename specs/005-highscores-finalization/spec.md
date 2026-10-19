# Feature Specification: Highscores, Finalization, and Label-Free Fruit Graphics

**Feature Branch**: `005-highscores-finalization`

**Created**: 2026-10-19

**Status**: Draft

**Input**: Final planned Fruit Rush feature: remove visible fruit-name labels, add a persistent local highscore, finalize Start and Game Over, verify the complete gameplay loop, and document the university Vibe Coding project without inventing history.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play by Recognizing Fruit Graphics (Priority: P1)

As a player, I want moving fruits and choice buttons to show illustrations without name hints so the game tests recognition while remaining accessible to assistive technology.

**Why this priority**: Removing visible labels is the main change to the established gameplay presentation.

**Independent Test**: Start a round at desktop and mobile widths, inspect all four fruit types and controls, play repeated fruits, and check accessible names without visible labels or tooltips.

**Acceptance Scenarios**:

1. **Given** a ready or active game, **When** fruit controls and moving fruits appear, **Then** each fruit uses its existing illustration without a visible fruit-name label or fruit-name tooltip.
2. **Given** a player uses assistive technology, **When** a fruit control or moving fruit is inspected, **Then** an accessible fruit name is available without visible text.
3. **Given** repeated fruit types, **When** the rightmost pending fruit is chosen, **Then** exactly that position resolves under the existing input, animation, and score rules.
4. **Given** a narrow or wide screen, **When** all controls and a row are shown, **Then** the four illustrations remain distinguishable and controls remain easy to activate.

---

### User Story 2 - Keep and Celebrate a Personal Best (Priority: P1)

As a player, I want my best score to survive new games and browser restarts so I can see my progress without an account or leaderboard.

**Why this priority**: A persistent personal best is the main new result in the final version.

**Independent Test**: Begin with no saved score, earn points, reach Game Over, replay, reload, and revisit in the same browser profile; repeat with an existing higher record and invalid or unavailable storage.

**Acceptance Scenarios**:

1. **Given** no valid saved record, **When** the page opens, **Then** the Start screen shows a highscore of 0 and normal play is available.
2. **Given** an existing record, **When** a run's score exceeds it, **Then** the highscore updates and remains available after reload or browser restart in the same profile.
3. **Given** a run ends, **When** Game Over appears, **Then** final score, highscore, and round reached are shown; a distinct indication appears only if that run exceeded its starting record.
4. **Given** Play Again, **When** a new run begins, **Then** gameplay resets while the highscore remains unchanged.
5. **Given** invalid saved data or inaccessible storage, **When** the game loads or scores change, **Then** gameplay and results remain usable.

---

### User Story 3 - Understand the Final Start and End Screens (Priority: P2)

As a player, I want clear instructions before playing and a clear result afterward so I can start, finish, and replay without guessing the controls.

**Why this priority**: The complete loop must be understandable in the established visual style.

**Independent Test**: Read the Start screen, play to Game Over, and activate Play Again repeatedly with pointer, touch, and keyboard.

**Acceptance Scenarios**:

1. **Given** the ready game, **When** the page opens, **Then** Fruit Rush, a short explanation, current highscore, prominent Start Game button, and concise controls explain ordered selection before fruits reach the right boundary.
2. **Given** the final life is lost, **When** Game Over appears, **Then** movement and fruit input stop; final score, highscore, round, and Play Again are visible.
3. **Given** Game Over, **When** Play Again is activated repeatedly, **Then** every run starts fresh without duplicate handlers, movement, timers, sounds, or leftover effects.

---

### User Story 4 - Review and Reproduce the Completed Project (Priority: P2)

As a student or reviewer, I want reliable setup instructions and an evidence-based account of AI-assisted development so I can run the game and evaluate how it was built.

**Why this priority**: The university assignment requires a runnable project and an honest development account.

**Independent Test**: Follow the README from a clean setup, run checks, and compare the experience document's factual claims with repository evidence and marked developer TODOs.

**Acceptance Scenarios**:

1. **Given** a new reviewer, **When** they read the README, **Then** they find purpose, technologies, installation, local run and build steps, controls, rules, and project structure.
2. **Given** the separate Vibe Coding experience document, **When** it is reviewed, **Then** objectives, tools, Spec-Kit use, features, workflow, prompts, problems, generated solutions, manual corrections, and lessons are supported by evidence or explicit TODOs.
3. **Given** the final application, **When** automated checks and a gameplay review run, **Then** Features 001–004 still work and highscore remains independent of active game state.

### Edge Cases

- A run ties the prior record: show the record without a new-record indication.
- A run passes the prior record more than once: keep the greatest score and one run-level new-record state.
- Saved data is empty, negative, fractional, nonnumeric, too large, or malformed: use a safe default.
- Storage access or writes fail: continue play and retain the current page's best score.
- The page reloads before Game Over: retain a new record when storage works.
- The final life is lost near the row boundary: resolve it once, stop motion, and show correct results.
- Rapid input during removal or a round transition must not duplicate score, life loss, sounds, or handlers.
- Removing visible names must preserve accessible names, keyboard use, focus, and graphic distinction.
- Restart after a new record preserves the record but clears the new run's record indication.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST preserve Features 001–004: four fruit types, rightmost-pending-first input, movement and speed tiers, scoring, lives, round progression, difficulty, Game Over, restart, visual feedback, optional audio, mute, responsiveness, and accessibility.
- **FR-002**: Moving fruits and fruit controls MUST use only existing illustrations for visual identification; fruit-name labels and fruit-name tooltips MUST NOT appear in the gameplay interface.
- **FR-003**: Every moving fruit and choice control MUST retain an accessible fruit name; all four controls MUST remain visually distinguishable and keyboard, pointer, and touch operable.
- **FR-004**: The greatest score MUST persist locally in the browser across page loads and browser sessions in the same profile, without accounts, backend, or online leaderboard.
- **FR-005**: Highscore MUST show 0 when no valid record exists, rise whenever active score exceeds it, and never fall when another game starts or ends.
- **FR-006**: Invalid saved scores and failed or unavailable browser storage MUST NOT crash or block play; a best score earned during the current page session MUST remain usable.
- **FR-007**: The Start screen MUST show Fruit Rush, a short explanation, current highscore, prominent Start Game, and concise right-to-left instructions mentioning the right boundary.
- **FR-008**: Game Over MUST show final score, highscore, round reached, and prominent Play Again, plus a distinct new-record indication only if the run exceeds its starting highscore.
- **FR-009**: Restart MUST reset active gameplay and run-level presentation while preserving highscore, with no old animation, timer, sound, or duplicate input listener active.
- **FR-010**: Choices, boundary misses, clean bonuses, difficulty, audio and visual cues, and Game Over MUST retain their established rules and timing; highscore updates MUST NOT alter them.
- **FR-011**: Mobile and desktop play, muted sound, reduced motion, rapid input, and repeated restart MUST remain usable without visible fruit-name hints returning.
- **FR-012**: README MUST explain purpose, gameplay, technologies, installation, local development, build, controls, rules, project structure, and a concise Vibe Coding summary.
- **FR-013**: A separate `docs/vibe-coding-experience.md` MUST cover objective, AI tools, Spec-Kit workflow, features, workflow, important prompts, problems, successful and unsuccessful generated solutions, manual corrections, and lessons.
- **FR-014**: Documentation MUST distinguish evidence-backed facts from developer experience requiring input, use explicit TODOs for unknown personal details, and MUST NOT invent prompts or events.
- **FR-015**: Existing automated tests MUST pass; final verification MUST cover the complete gameplay loop, highscore persistence and failures, label-free graphics, desktop/mobile, mute, and rapid input.
- **FR-016**: All Feature 005 implementation and documentation changes MUST be committed on the dedicated branch; code, comments, and documentation MUST be in English.

### Key Entities

- **Highscore**: The greatest valid nonnegative whole-number score achieved in one browser profile, with a current-page fallback if persistence is unavailable.
- **Run record state**: The highscore when a run starts and whether that run exceeds it, used for the Game Over indication.
- **Game state**: Existing score, lives, round, fruit positions, difficulty, and status; sole authority for gameplay.
- **Fruit presentation**: Each existing illustration paired with an accessible name and control, without a visible fruit-name label.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Across ready, active, Game Over, and restarted screens at 320-pixel and 1280-pixel widths, zero fruit-name labels or tooltips are visible; all four illustrations still match their controls.
- **SC-002**: In at least 10 complete or interrupted runs, displayed highscore equals the greatest score earned, including after a lower-scoring restart and reload in the same browser profile.
- **SC-003**: With at least six invalid or inaccessible saved-score conditions, each game remains playable and shows a valid nonnegative highscore.
- **SC-004**: In 10 Game Over and Play Again cycles, final values match game state, new-record indication appears exactly when earned, and restart restores established initial values without duplicate effects.
- **SC-005**: At 320-pixel and 1280-pixel widths, Start, play, Game Over, and replay remain usable without horizontal scrolling; fruit controls remain large enough for touch.
- **SC-006**: All existing automated tests pass; final review covers each difficulty tier, correct and wrong selections, boundary misses, clean bonuses, rapid input, mute, and reduced motion without regression.
- **SC-007**: A reviewer can install, run, test, and build using only the README; every factual claim in the experience document has available project evidence or a marked developer TODO.

## Assumptions

- Feature 005 begins from Feature 004 because that branch is not assumed to have been merged into `main`.
- The personal best is one score per browser profile; there are no accounts, named players, synchronization, or score history.
- Browser `localStorage` is the required persistence mechanism. If it is restricted, the current page retains an in-memory best score instead.
- A new record means strictly greater than the highscore captured when the run began; a tie does not qualify.
- A new maximum is saved when achieved, rather than waiting for Game Over.
- Fruit names may remain in accessibility metadata and project documentation, but no player-visible fruit labels or hints remain in the interface.
- Existing project logs and repository artifacts support the experience document; unrecorded personal reflections and prompts need explicit developer TODOs.
