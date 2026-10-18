# Feature Specification: Core Game and Fruit Input

**Feature Branch**: `001-core-fruit-input`

**Created**: 2026-10-18

**Status**: Draft

**Input**: Original feature: "001 – Core Game & Fruit Input. Playfield, moving fruits, and input buttons. The player must select the displayed fruits in the correct order. First fully playable version." Amendments: "The fruits move together from left to right across the playfield, and the player can press the sequence buttons while they move." "Keep the same feature branch; select the fruits from right to left, and keep their speed constant as they cross the playfield." "Keep the same feature branch; fruit buttons are clickable from the start of a round, and after the last fruit leaves the playfield, the player has five seconds to finish the sequence, shown by an overlay popup counting down from five."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a fruit sequence round (Priority: P1)

As a player, I want to select a moving row of fruits from right to left as soon as a round
starts, with a visible five-second chance to finish after the row exits, so I know when I can
respond and how much time remains.

**Why this priority**: A complete round is the smallest independently playable version of the game.

**Independent Test**: Start a round, select a fruit before the entire row is visible, let the
row cross at a steady speed, and finish the right-to-left sequence during the five-second
overlay countdown; also verify a wrong input and an unfinished countdown end in failure.

**Acceptance Scenarios**:

1. **Given** the game is ready, **When** the player starts a round, **Then** four fruits appear
   together as one left-to-right row and travel together from the left side to the right side
   of the playfield.
2. **Given** a round has just started and the row is not yet fully visible, **When** the player
   selects the rightmost fruit using its button, **Then** the input is accepted immediately,
   progress and score increase by one, and correct-input feedback appears.
3. **Given** the row is moving, **When** the player selects the next fruit in right-to-left
   order, **Then** the game evaluates that selection without waiting for the row to stop or leave.
4. **Given** the player has selected all four fruits correctly, **When** the fourth selection is
   accepted, **Then** the game shows a success state, the final score, and an option to play again.
5. **Given** the player selects a wrong fruit, **When** that selection is checked, **Then** the
   game shows incorrect-input feedback, a failure state, the score reached, and an option to play
   again; further selections do not change that result.
6. **Given** a completed round, **When** the player chooses to play again, **Then** a new round
   starts with progress and score reset to zero.
7. **Given** the round is unfinished, **When** the trailing fruit fully clears the right edge
   of the playfield, **Then** a popup overlay immediately shows five seconds remaining, counts
   down once per second, and leaves the fruit buttons visible and usable.
8. **Given** the overlay is counting down, **When** the player enters the remaining correct
   fruits before the five seconds expire, **Then** the round succeeds immediately and the
   countdown disappears.
9. **Given** the overlay is counting down and the sequence remains incomplete, **When** five
   seconds have elapsed since the row exited, **Then** the round fails for time expiry, shows
   the final score and replay control, and ignores further fruit selections.
10. **Given** the player completes the sequence or enters a wrong fruit before the row exits,
    **When** the result appears, **Then** no countdown is shown for that round.
11. **Given** the row continues across the playfield without an early round result, **When** it
   enters, passes through, and exits, **Then** it moves at the same horizontal speed without a
   visible pause, jump, acceleration, or slowdown.

### Edge Cases

- A fruit may appear more than once in a sequence; each occurrence must be entered in order.
- Buttons pressed before a round starts or after it ends must not change score or state;
  presses from the first moment of a round are evaluated, even before any fruit is fully visible.
- Rapid repeated presses must be evaluated as separate selections in order; the game must not
  silently skip or double-count an accepted selection.
- If a player starts a new round after success or failure, feedback from the prior round must
  clear before the next sequence appears.
- If the player completes or fails the round while the row is still moving, the result must
  appear immediately; continued movement must not change the final score or outcome.
- The rightmost fruit is selected first even though the row itself travels from left to right;
  repeated fruit types still count as separate positions.
- The row keeps a steady speed as it enters, crosses, and exits on different playfield widths;
  an early success or failure still stops movement immediately.
- The countdown begins only after the trailing fruit has fully exited, never when the first
  fruit exits. The player has the full five seconds to finish any remaining selections.
- A wrong selection during the countdown ends the round immediately. At the five-second
  deadline, an unfinished sequence fails and any subsequent selection is ignored.
- Completing the sequence before the row exits skips the overlay entirely. Replay clears the
  prior countdown and restores immediate input for the new round.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST show a ready state with a clear start control and brief instructions.
- **FR-002**: Starting a round MUST produce an ordered sequence of four fruits selected from
  apple, banana, cherry, and grape; repeated fruit types MUST be allowed.
- **FR-003**: The playfield MUST present all four sequence fruits together in one row, ordered
  from left to right, and move the row as a group from the left side across the playfield to
  the right side. In rounds allowed to finish crossing, the entire row MUST be fully visible
  together and recognizable for at least three seconds during its movement.
- **FR-004**: The game MUST clearly indicate that the player can begin entering the sequence
  immediately when a round starts, including while the row is entering and still moving.
- **FR-005**: The game MUST provide one clearly labeled input button for each available fruit.
- **FR-006**: Fruit input MUST become available as soon as the round starts, including before
  the full row is visible, and MUST remain available throughout movement and the post-exit
  five-second window. Input before the round starts or after it ends MUST be ignored.
- **FR-007**: The game MUST interpret the displayed sequence from rightmost fruit to leftmost
  fruit, compare each selection with the next required fruit, and process accepted selections
  in the order received without waiting for movement to finish.
- **FR-008**: Each correct selection MUST show correct-input feedback and increase both visible
  progress and score by one.
- **FR-009**: The first incorrect selection MUST show incorrect-input feedback and immediately
  end the round in failure without increasing score or progress.
- **FR-010**: Selecting the fourth correct fruit MUST end the round in success.
- **FR-011**: Success and failure states MUST show the final score and a replay control. Replay
  MUST start a new sequence with score and progress reset to zero.
- **FR-012**: The game MUST show the current phase and progress so players can distinguish
  ready, active entry during movement, timed entry after the row has left, success, and failure.
- **FR-013**: During a round that has not ended early, the fruit row MUST maintain one constant
  horizontal speed from its entrance at the left edge through its exit at the right edge,
  without pausing or changing speed when it becomes fully visible or begins to leave.
- **FR-014**: If the round is still active when the trailing fruit fully clears the right edge
  of the playfield, a five-second response window MUST begin at that moment. A popup overlay
  MUST immediately display 5, then display 4, 3, 2, and 1 at successive one-second intervals;
  it MUST leave the fruit buttons visible and usable throughout the window.
- **FR-015**: If the fourth correct selection is not received before the five-second window
  ends, the round MUST end in failure due to time expiry, retain the score already earned, show
  a clear time-expired result and replay control, and ignore fruit input from the deadline on.
- **FR-016**: The countdown MUST stop and disappear as soon as the round succeeds or fails. It
  MUST never appear if the round ends before the row exits, and replay MUST start a fresh round
  without retaining the previous countdown or feedback.
- **FR-017**: When movement is reduced or disabled for accessibility, the complete row MUST
  remain visible for at least three seconds before the same five-second response window begins;
  fruit input MUST still be available from the start of the round.

### Key Entities

- **Fruit**: One of the four recognizable fruit types available for display and selection.
- **Sequence**: An ordered row of four fruits, entered from right to left; fruit types may repeat.
- **Round**: The current sequence, whether the row is moving or has passed, the remaining
  response time after exit, the next required selection, score, and outcome.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A player can start and complete one round, including seeing its outcome, in under
  two minutes without external instructions.
- **SC-002**: In 20 observed rounds covering correct input, wrong input, repeated fruits, time
  expiry, and replay, the displayed outcome and score match the player's selections in every
  round.
- **SC-003**: In every observed round allowed to finish crossing, all four fruits travel
  together from left to right, remain fully visible together for at least three seconds, and
  accept fruit input from the start of the round, including before the group is fully visible.
- **SC-004**: In a five-person usability check, at least four players can identify the
  right-to-left input order, start entering immediately, understand the five-second countdown,
  and tell whether they succeeded or failed without explanation.
- **SC-005**: In 20 observed crossings that are allowed to finish, each of four equal portions
  of the row's total horizontal path takes a time within 10% of that crossing's average
  quarter-path time, covering entrance, fully visible travel, and exit.
- **SC-006**: In 20 observed unfinished crossings, the overlay begins when the trailing fruit
  clears the playfield, shows 5 through 1 in one-second steps, and an incomplete round ends in
  time-expiry failure five seconds after exit; correct selections made before expiry remain
  accepted in every round.

## Assumptions

- A round consists of one four-fruit sequence. Multiple levels or increasing difficulty are
  outside this first playable version.
- Four familiar fruit types provide enough choice for the initial game; a type may repeat.
- The sequence is entered from the row's rightmost fruit to its leftmost fruit. The fruit row
  enters from the left and exits on the right.
- Constant speed applies within each uninterrupted crossing. The speed may differ between
  playfield sizes so the whole row remains fully visible and moving for at least three seconds.
  Success or failure can stop the crossing immediately.
- Input is available from the start of a round, including while the row is entering. The
  five-second deadline begins only when the trailing fruit fully leaves the playfield; any
  selections already made count toward completing the sequence within that window.
- The countdown shows 5 immediately after exit and decrements at each elapsed second. At the
  five-second deadline, an incomplete round fails rather than showing 0 as a playable second.
- If reduced movement prevents the row from crossing the playfield, a three-second static
  display replaces the crossing before the five-second deadline starts.
- Score is the number of correct selections in the current round, from zero to four. A wrong
  selection ends the round immediately; there are no lives or retries within the same round.
- Replay starts a new round. Progress and score do not persist after the page is closed.
- Sounds, advanced animation, leaderboards, accounts, and multiplayer are outside this feature.
- Development records for this feature will capture important prompts, successful and
  unsuccessful AI-generated solutions, problems, manual corrections, and lessons learned for the
  project's Vibe Coding summary.
