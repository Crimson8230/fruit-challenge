# Feature Specification: Progressive Difficulty

**Feature Branch**: `003-progressive-difficulty`

**Created**: 2026-10-18

**Status**: Draft

**Input**: User request to add predictable round-based sequence length and movement speed progression to the existing fruit game while retaining scoring, lives, automatic rounds, Game Over, and restart.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play Rounds That Grow More Difficult (Priority: P1)

As a player, I want each new round to have a predictable sequence length and movement speed so that the challenge grows as I continue playing without changing midway through a round.

**Why this priority**: The round-by-round progression is the core value of this feature.

**Independent Test**: Start a game, complete enough rounds to reach each difficulty boundary, and verify the number of fruits, displayed speed, movement, scoring, lives, and restart values at each boundary.

**Acceptance Scenarios**:

1. **Given** a new game, **When** round 1 starts, **Then** it has three fruits moving at 100% of the existing base speed; round 2 has the same length and speed.
2. **Given** a player reaches rounds 3, 5, 7, or 9, **When** each new round starts, **Then** its sequence length and speed match the progression table in FR-001.
3. **Given** a player reaches round 11, 13, or 15, **When** each new round starts, **Then** it has eight fruits and moves at 175%, 190%, or 200% of base speed respectively.
4. **Given** a player reaches any round after 15, **When** that round starts, **Then** it still has eight fruits and moves at no more than 200% of base speed.
5. **Given** a round is active, **When** the row moves or a fruit is selected or missed, **Then** all fruits retain the speed chosen at round start and the sequence does not change length.
6. **Given** a displayed sequence that may repeat fruit types, **When** the player selects the rightmost remaining fruit correctly, **Then** that position scores 10 points and resolves; a wrong fruit costs one life and leaves the expected position pending.
7. **Given** a player completes a round without a missed fruit, **When** its last pending fruit is selected, **Then** the round earns the existing 25-point clean-round bonus once and the next round begins with score and lives retained.
8. **Given** a pending fruit is missed or the last life is lost, **When** the event is resolved, **Then** the existing one-life-per-position rule and immediate Game Over priority apply.
9. **Given** Game Over is visible after a higher round, **When** the player selects Play Again, **Then** round 1 starts with a new three-fruit sequence at 100% speed, score 0, three lives, and no activity from the former game.

### User Story 2 - Recognize and Read the Current Challenge (Priority: P2)

As a player, I want to see the current difficulty and distinguish every fruit even in longer rounds so that I know what to enter and understand why the pace changes.

**Why this priority**: The progression must remain legible and understandable as the row grows.

**Independent Test**: Inspect round 1 and a round with eight fruits at a narrow and a standard viewport; verify that the difficulty indicator matches the round, every fruit is distinct and readable, and the row moves together without overlapping or incorrect clipping.

**Acceptance Scenarios**:

1. **Given** a round begins, **When** the status area updates, **Then** it shows the current speed percentage or an equivalent unambiguous difficulty indicator beside the existing score and round information.
2. **Given** a sequence of three through eight fruits, **When** the row is fully within the playfield, **Then** every fruit is visually distinct, in the correct order, consistently spaced, and readable without overlapping its neighbors.
3. **Given** a narrower display, **When** a long sequence crosses the playfield, **Then** the layout adapts without clipping a fruit while it should be visible or hiding the controls needed to answer.
4. **Given** reduced movement is requested, **When** a round begins, **Then** the full sequence is readable during the existing static viewing interval and the displayed difficulty matches that round.

### Edge Cases

- Repeated fruit types occupy separate positions. Each correct selection or miss resolves one position only.
- A wrong choice does not remove the expected fruit or disqualify a clean-round bonus; only a missed position does.
- If several pending positions have passed the right boundary, each is resolved once, stopping immediately at Game Over or a new round.
- Crossing a difficulty boundary changes the following round only. The current row never accelerates or gains positions.
- The sequence generated for a new round may coincidentally match the previous round; it is still a fresh sequence with fresh pending positions.
- Difficulty is based on the displayed round number, including after missed-fruit rounds; it does not depend on how many fruits were selected or on accumulated speed.
- At and beyond round 15, the speed cap remains 200% and the sequence cap remains eight fruits.
- Restart cancels or ignores old movement and timing events so they cannot change the new round's score, lives, sequence, or difficulty.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST use this deterministic progression for every round:

  | Rounds | Fruits per sequence | Movement speed relative to the existing base |
  |--------|---------------------|----------------------------------------------|
  | 1–2 | 3 | 100% |
  | 3–4 | 4 | 115% |
  | 5–6 | 5 | 130% |
  | 7–8 | 6 | 145% |
  | 9–10 | 7 | 160% |
  | 11–12 | 8 | 175% |
  | 13–14 | 8 | 190% |
  | 15 onward | 8 | 200% |

- **FR-002**: The current round number alone MUST determine its sequence length and speed. Completing or missing a round MUST NOT compound a previously applied speed increase.
- **FR-003**: Every round MUST begin with a newly generated sequence of exactly the length specified by FR-001, using only apple, banana, grape, and orange. Fruit types MAY repeat.
- **FR-004**: The next required input MUST be the rightmost pending fruit position. A correct selection MUST resolve only that position and add exactly 10 points; an incorrect selection MUST cost exactly one life without changing the pending sequence or score.
- **FR-005**: A round in which every fruit is selected and none is missed MUST receive the existing 25-point completion bonus exactly once. Wrong selections alone MUST NOT remove bonus eligibility; any missed position MUST prevent the bonus.
- **FR-006**: Each pending fruit missed at the right boundary MUST cost one life and resolve once. Multiple already-passed pending positions MUST resolve separately until the round changes or Game Over occurs.
- **FR-007**: When all positions resolve and lives remain, the game MUST automatically start the next numbered round with accumulated score and remaining lives, whether the previous round was clean or contained misses.
- **FR-008**: All fruits in one row MUST move together at a constant speed for that round. The round's speed MUST apply from its start and MUST NOT change during the round or vary with display frame rate.
- **FR-009**: Movement speed MUST be relative to Feature 001's existing base movement speed and MUST never exceed 200% of that base.
- **FR-010**: Sequences of three through eight fruits MUST preserve their left-to-right order and consistent spacing. At supported narrow and standard display widths, fruits MUST remain individually distinguishable, without overlapping neighbors or incorrect clipping while the complete row is inside the playfield.
- **FR-011**: The current difficulty or speed percentage MUST be visible alongside the existing score and round status and MUST update when each new round starts.
- **FR-012**: The existing numeric lives indicator, immediate input feedback, and position progress MUST remain accurate for the current sequence length rather than assuming four positions.
- **FR-013**: Losing the final life MUST immediately stop movement, input, scoring, misses, and round transitions and show the existing Game Over result with final score, round reached, and Play Again.
- **FR-014**: Play Again MUST reset score to 0, lives to three, round to 1, and difficulty to three fruits at 100% speed; it MUST generate fresh positions and prevent former game activity from affecting the new game.
- **FR-015**: The existing reduced-movement mode MUST keep the full current sequence static and readable for at least three seconds, accept input during that interval, then resolve remaining positions under the existing one-life-per-miss and Game Over rules.
- **FR-016**: The game MUST retain the existing simple single-screen controls and visual style, with no additional menus or settings for difficulty.
- **FR-017**: Feature implementation and verification MUST record important prompts, successful and unsuccessful generated attempts, corrections, validation evidence, and lessons learned for the project's development summary.

### Key Entities

- **Difficulty for a round**: The round number, required sequence length, and speed percentage; it is determined anew from the round number and is not carried forward as accumulated speed.
- **Fruit position**: One ordered place in the current sequence, with a fruit type and pending, selected, or missed state; repeated types remain distinct positions.
- **Round**: Its number, fresh sequence, current difficulty, and whether any fruit was missed. It ends when no pending position remains or the game ends.
- **Game**: Score, remaining lives, current round, and playing or Game Over state. A restart begins a fresh game at initial difficulty.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In checked rounds 1, 2, 3, 5, 9, 11, 13, 15, and 25, all nine displayed sequence lengths and speed percentages match FR-001; no checked later round exceeds eight fruits or 200% speed.
- **SC-002**: Across 20 observed moving rows at different difficulty levels, all fruits in each row keep their order and spacing and travel together at the configured pace; changing the display update rate does not change elapsed-time travel by more than 5%.
- **SC-003**: At narrow and standard display widths, all eight fruits in a fully visible row remain individually distinguishable, with zero neighbor overlaps and zero incorrectly clipped fruits in 10 checked crossings.
- **SC-004**: In 20 checked correct selections, each adds exactly 10 points; in 10 clean rounds, each adds its 25-point bonus once; in 20 checked wrong choices or misses, each costs exactly one life without adding points, until Game Over.
- **SC-005**: In 10 checked restarts after a higher-difficulty Game Over, every new game begins at round 1 with three fruits, 100% speed, score 0, and three lives, with no old event changing the new game.
- **SC-006**: In a five-player check, at least four players can identify the current difficulty and the next fruit to select in both an early round and an eight-fruit round without an explanation.

## Assumptions

- The existing game's base speed is the 100% reference. A higher percentage increases travel speed by the stated proportion, so the same distance takes proportionally less time.
- The fruit set changes Feature 002's cherry to orange. The player selects the rightmost pending fruit first, retaining Feature 002's input direction after the player's correction on 2026-10-19. Scoring, life loss, boundary misses, round transitions, Game Over, and restart retain their established behavior.
- The 25-point bonus applies to a clean round regardless of its current sequence length; each selected fruit still earns 10 points.
- The supported narrow layout includes a 320-pixel-wide viewport; a standard layout includes a 1280-pixel-wide viewport. The complete row is judged for clipping only while it is inside the playfield.
- Reduced movement retains its existing three-second static interval. The speed percentage still describes the round's difficulty even when movement is suppressed.
- This feature adds no extra fruit types beyond the four named here, power-ups, sound, highscore persistence, game modes, backend service, or difficulty settings.
- Feature 002 browser validation and its five-player understanding check were pending when this specification was written. Planning and implementation should verify inherited behavior alongside Feature 003.
