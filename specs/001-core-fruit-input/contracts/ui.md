# Player Interaction Contract

This contract describes the visible controls and responses for the one-page game. It is an
interface for players, not a network API.

## Ready

- Show the playfield, a short instruction to select four fruits from right to left starting
  immediately, with five seconds to finish after the row leaves, and a **Start** control.
- Show progress and score as 0/4 and 0. Fruit buttons may be visible but cannot change state.
- Activating **Start** creates a new sequence, starts the row entering from the left, and
  enables all four fruit buttons immediately.

## Approaching

- Show all four fruits together in one ordered row moving as a group from left to right.
- Keep the row's horizontal speed the same as it will be while fully visible and exiting.
- Indicate that the player may choose fruits now. Evaluate every fruit press in right-to-left
  sequence order, even before any fruit is fully visible.

## Moving: Active Entry

- When the full row first becomes visible, update the phase label while keeping the four
  already-enabled input buttons labeled **Apple**, **Banana**, **Cherry**, and **Grape**.
  Each button has a matching recognizable fruit visual.
- Keep the full row visible and moving for at least three seconds. Continue moving the row
  toward and then past the right edge as one group at the same horizontal speed. Select the
  displayed sequence from rightmost to leftmost.
- Process each accepted button press immediately and in order, even while the row is moving.
  A correct press gives positive text and visual feedback and advances progress and score by
  one. A wrong press gives negative feedback and immediately ends the round.
- The fourth correct press ends the round in success, even if the row has not stopped moving.

## Passed: Five-Second Entry Window

- Once the trailing fruit fully exits the right edge and the round remains unfinished, show
  a popup overlay over the playfield with a visible **5 seconds** message. Change its number
  to **4**, **3**, **2**, then **1** at successive one-second intervals. The overlay is
  nonmodal; all four fruit buttons stay visible and usable while time remains.
- The row keeps the same horizontal speed through its exit, with no visible pause or jump at
  the boundary between fully visible movement and exit.
- Apply the same correct, wrong, and fourth-correct responses as during movement. A correct
  fourth press before expiry succeeds immediately; a wrong press fails immediately. Either
  result closes the overlay. Passage alone does not cause failure or change score.
- If the sequence is incomplete at the five-second deadline, close the overlay and show a
  time-expired failure. A press at or after the deadline cannot change the result.

## Terminal States

- **Success** shows the final score of 4/4 and a **Play again** control.
- **Try again** shows the score reached before a wrong press or the time-expiry failure and a
  **Play again** control. Time expiry also displays a clear time-expired explanation.
- Stop ongoing movement and countdown activity when any result occurs. Fruit buttons cannot
  change the result. An early result never displays the overlay.
- **Play again** clears old feedback and countdown, resets progress and score, and starts a
  new sequence with fruit buttons immediately available.

## Accessibility and Feedback

- Controls use text labels in addition to fruit visuals.
- Phase, progress, score, and correct or incorrect result are communicated by text as well as
  color or decoration. The countdown includes the number and unit of seconds in text.
- Controls remain usable through normal pointer and keyboard activation.
- When reduced motion is requested, show the full row statically and recognizably, with input
  enabled from round start. After three seconds of static display, begin the same five-second
  response window if the round is unfinished.

## Requirement Coverage

- Ready and phase labels: FR-001, FR-004, FR-012
- Sequence and group movement: FR-002, FR-003, FR-013
- Buttons and input handling: FR-005, FR-006, FR-007
- Correct, incorrect, terminal, and replay feedback: FR-008, FR-009, FR-010, FR-011
- Countdown, deadline, expiry, cleanup, and reduced motion: FR-014, FR-015, FR-016, FR-017
