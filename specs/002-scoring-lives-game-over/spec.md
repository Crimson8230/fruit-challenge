# Feature Specification: Scoring, Lives, and Game Over

**Feature Branch**: `002-scoring-lives-game-over`

**Created**: 2026-10-18

**Status**: Draft

**Input**: User description: "Implement Feature 002: Scoring, Lives, and Game Over for the existing fruit game. Give 10 points per correct fruit and 25 points for a completed sequence without missed fruits; start with three lives, lose one for wrong selections or missed fruits, continue across rounds, show Game Over at zero lives, and restart with fresh state. Preserve Feature 001 movement, input, and visual design."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a Scored Game Across Rounds (Priority: P1)

As a player, I want my correct choices to earn points and my mistakes to cost lives while new
fruit rounds begin automatically, so I can play a continuous game with a clear ending and a
fresh restart.

**Why this priority**: Scoring, lives, round progression, and Game Over together form the
smallest complete loop for this feature.

**Independent Test**: Start a game with a known sequence; score correct choices, make a wrong
choice, miss a fruit, finish or exhaust a round, reach zero lives, and restart. Check every
score, life, round, fruit, and terminal-state change on top of Feature 001's playable baseline.

**Acceptance Scenarios**:

1. **Given** the game is ready, **When** the player starts, **Then** the game shows score 0,
   three lives, round 1, and a new four-fruit sequence moving as in Feature 001.
2. **Given** a round is active, **When** the player chooses its next required fruit from right
   to left, **Then** the score rises by exactly 10 points, that fruit is no longer pending,
   and the choice receives immediate positive feedback.
3. **Given** a round is active and the player has at least two lives, **When** the player
   chooses a wrong fruit, **Then** the score does not change, exactly one life is lost, the
   same required fruit remains pending, and play continues with clear loss feedback.
4. **Given** the leftmost pending fruit reaches the right boundary, **When** it is resolved as
   missed, **Then** exactly one life is lost, that position is removed from pending fruits,
   and it cannot cost another life. If another pending position has already reached the
   boundary, it is resolved separately under the same rule.
5. **Given** all four fruits in a round were selected correctly and none was missed, **When**
   the last correct choice is accepted, **Then** the game adds a 25-point completion bonus once
   and automatically starts the next round with the accumulated score and lives intact.
6. **Given** one or more fruits were missed but at least one pending fruit remains and lives
   remain, **When** the player selects every remaining fruit correctly, **Then** the round
   ends without a completion bonus and the next round starts automatically.
7. **Given** a round has no pending fruits because they were all missed and at least one life
   remains, **When** the last miss is resolved, **Then** the round ends without a completion
   bonus and the next round starts automatically.
8. **Given** an unfinished row exits the playfield, **When** its pending positions are
   resolved at the right boundary, **Then** the former five-second post-exit countdown does
   not delay or duplicate the miss and life-loss results.
9. **Given** the player has one life, **When** a wrong choice or miss deducts it, **Then** Game
   Over appears immediately with the final score, the round reached, and a Play Again control;
   movement stops and later input or movement events cannot alter the result.
10. **Given** Game Over is visible, **When** the player chooses Play Again, **Then** a new game
   starts at score 0, three lives, and round 1 with a newly generated sequence and no fruit,
   timer, or other activity left from the previous game.
11. **Given** reduced movement is requested, **When** the static viewing interval ends and
    some fruit positions remain pending, **Then** the same one-life-per-position miss rule
    applies, with Game Over taking priority if the last life is lost.

### Edge Cases

- A fruit type may repeat. Each displayed position is a separate choice or miss, and only
  the next required position may score.
- An incorrect choice costs one life but does not consume the required fruit. A later correct
  choice can still earn its 10 points.
- A wrong choice does not count as a missed fruit. If all four fruits are eventually chosen
  and none was missed, the round still earns the 25-point completion bonus.
- A missed fruit is removed from the pending sequence as soon as its miss is resolved; the
  same fruit position cannot deduct another life later.
- If the leftmost pending fruit reaches the right boundary after other pending fruits have
  already crossed it, resolve each pending position separately, once, until none remain or
  Game Over stops the game. A position cannot be both selected and missed.
- When an event could consume the last life, Game Over takes precedence over any round
  completion or next-round transition. Lives stop at zero; further fruit events are ignored.
- A newly generated round can coincidentally contain the same fruit types and order as the
  prior round. It must still be a new round with fresh pending positions.
- A restart clears all prior pending fruits and score, life, and round feedback before play
  begins again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Starting a new game MUST set score to 0, lives to 3, and round number to 1,
  then present a newly generated four-fruit sequence.
- **FR-002**: The game MUST retain Feature 001's four fruit types, four-position sequence,
  repeated fruit types, group movement from left to right at constant speed, right-to-left
  selection order, fruit buttons usable from round start, and simple visual style, except
  where Feature 002 explicitly changes a result or timing rule.
- **FR-003**: Each correct selection of the next required fruit MUST add exactly 10 points,
  remove that position from the pending sequence, update the visible score immediately, and
  provide positive feedback.
- **FR-004**: Each incorrect fruit selection MUST add no points, deduct exactly one life,
  leave the pending sequence unchanged, and provide immediate visible loss feedback. If lives
  remain, the same round MUST continue.
- **FR-005**: The player MUST start with three lives and see a clear visual indicator, such
  as hearts, of the remaining lives throughout play. Lives MUST never be negative.
- **FR-006**: When a fruit position is missed, the game MUST deduct exactly one life, remove
  that position from the pending sequence, add no points, and give immediate loss feedback.
  A position already selected or missed MUST NOT be processed again.
- **FR-007**: When the leftmost pending fruit reaches the right boundary, the game MUST
  resolve that position as one missed fruit. If another pending position is already at or
  beyond the boundary, the game MUST resolve it separately under the same one-life rule.
  Processing MUST stop immediately if lives reach zero.
- **FR-008**: Boundary misses MUST be resolved immediately. For an unfinished round, this
  miss rule replaces Feature 001's five-second post-exit response window; that countdown MUST
  NOT postpone a miss or deduct a second life for the same fruit position.
- **FR-009**: Completing a round by correctly selecting all four fruit positions without
  missing any MUST award a 25-point bonus exactly once, in addition to the 40 points earned
  from those four correct selections. A round with any missed fruit MUST NOT receive the bonus.
- **FR-010**: When no pending fruits remain and the player has at least one life, the game
  MUST automatically begin a new round, increase the round number by one, and retain the
  current score and lives. This applies whether all fruits were selected, some were missed,
  or all were missed.
- **FR-011**: The current round number MUST be displayed during play, starting at 1. The
  score and lives MUST remain prominently visible and understandable as rounds change.
- **FR-012**: When lives reach zero, the game MUST immediately stop movement and input,
  prevent any further scoring, deductions, misses, or round transitions, and show Game Over
  with the final score, the round reached, and a Play Again control.
- **FR-013**: Play Again MUST start a completely new game with score 0, three lives, round 1,
  and a newly generated sequence. It MUST clear prior fruits and prevent any former timer,
  movement, or input event from changing the new game.
- **FR-014**: Score, life loss, round transitions, and Game Over MUST be communicated with
  clear text or equivalent visual feedback in addition to any color or heart icon.
- **FR-015**: When movement is reduced and the fruit row is shown statically, the game MUST
  keep the sequence readable for at least three seconds, then resolve any still-pending
  positions under the same one-life-per-miss rule rather than leave the round active forever.

### Key Entities

- **Fruit position**: One place in the four-fruit row, with a fruit type and a state of
  pending, correctly selected, or missed; repeated types occupy distinct positions.
- **Round**: The current row, its number, pending positions, and whether any position was
  missed; it ends when no pending positions remain or when the game reaches Game Over.
- **Game**: The running score, remaining lives, current round, and active or Game Over state;
  a restart creates fresh values and a new first round.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 20 checked correct selections, the score increases by exactly 10 points
  each time; in 20 checked wrong selections and 20 checked missed positions, the score does
  not increase and lives decrease by exactly one per event until Game Over.
- **SC-002**: In 10 checked complete rounds with no missed positions, the round adds exactly
  65 points in total. In 10 checked rounds with at least one missed position, no 25-point
  completion bonus is added.
- **SC-003**: In 20 checked round transitions with lives remaining, the next round starts
  automatically at the previous round number plus one with unchanged score and lives apart
  from points and life losses earned in that round.
- **SC-004**: In 10 checked ways of losing the last life, Game Over appears immediately, lives
  equal zero, and 10 subsequent fruit or movement events cause no change to score, lives,
  round number, or final result.
- **SC-005**: In 10 checked restarts from Game Over, score is 0, lives are 3, round is 1,
  and no fruit or event from the old game affects the new sequence.
- **SC-006**: In a five-player check, at least four players can identify their score,
  remaining lives, current round, and Game Over result without an explanation.

## Assumptions

- A game contains successive rounds of four fruits. The fruit set, movement speed, selection
  direction, input controls, and simple design established in Feature 001 are the starting
  point; longer sequences and increasing difficulty are outside this feature.
- "No fruits missed" determines completion-bonus eligibility. A wrong button press alone
  does not remove the bonus if the player later selects all four fruits correctly.
- A wrong input costs one life and leaves the next required fruit pending, allowing another
  attempt while the game remains active.
- The round number means the round currently being played or reached when Game Over occurs.
  A new game begins at round 1, and each automatic transition increments it once.
- Correctly selected or missed fruit positions leave the pending sequence. The visual row may
  retain a clear indication of resolved positions as long as they cannot score or cost lives
  again.
- Feature 002's boundary-miss rule supersedes Feature 001's five-second post-exit timer for
  unfinished rounds. Other Feature 001 movement and input behavior remains in place.
- In reduced movement, the end of the existing three-second static viewing interval stands
  in for reaching the right boundary; pending positions are resolved once each.
- No score or round history is stored after the page closes. Sounds, speed increases, longer
  sequences, high scores, extra modes, backend services, and accounts are outside scope.
- Development notes for this feature will record important prompts, successful and
  unsuccessful AI-generated solutions, manual corrections, and lessons learned for the Vibe
  Coding summary.
