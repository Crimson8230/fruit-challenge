# Quickstart Validation: Core Game and Fruit Input

This guide validates the implemented game and its player-facing behavior.

## Prerequisites

- Node.js 20 and npm
- A modern browser

## Start and Check

From the repository root, after implementation:

```text
npm install
npm test
npm run build
npm run dev
```

Open the local address printed by the development server. `npm test` must cover sequence
generation, right-to-left validation (including repeated fruits), immediate input during
approach, correct and wrong selections, scoring, the exact five-second deadline, time-expiry
failure, terminal input guards, replay, and phase transitions. `npm run build` must type-check
and build successfully.

## Manual Round Checks

1. On the ready screen, confirm that right-to-left instructions, the post-exit five-second
   deadline, **Start**, progress 0/4, and score 0 are clear. Fruit buttons cannot affect the
   ready state.
2. Start a round. Confirm that four fruits form one left-to-right row, enter together from
   the left, and move together toward the right. Fruit buttons must be enabled immediately.
   Press a button before the full row is visible; the game must evaluate it at once as a
   correct or wrong selection rather than ignore it.
3. In a round allowed to finish crossing, time the fully visible moving interval: it must
   last at least three seconds. Check that entrance, fully visible travel, and exit have one
   steady horizontal speed, without a visible pause or jump at either boundary.
4. Enter the observed sequence from rightmost fruit to leftmost while the row is moving. Each
   correct press must show immediate positive feedback and advance progress and score by one;
   movement must not restart on a press.
5. Complete a round before the row exits. Confirm the fourth correct press immediately shows
   **Success**, score 4/4, and **Play again**. Further fruit presses must leave the result unchanged.
6. Replay and choose a wrong fruit while the row moves. Confirm immediate negative feedback,
   **Try again**, unchanged score, and **Play again**. Ongoing movement must stop.
7. Replay and leave the sequence unfinished until the trailing fruit fully clears the right
   edge. Confirm an overlay appears over the playfield at **5 seconds**, displays 4, 3, 2, 1
   at one-second intervals, and leaves all fruit buttons visible and usable. Complete the
   remaining selections before expiry and confirm immediate success and overlay removal.
8. Replay and wait through the full countdown without finishing. Confirm failure at five
   elapsed seconds, a clear time-expired message, the earned score, and **Play again**. Press
   a fruit afterward; the result must not change. Try a wrong fruit during a later countdown;
   failure must occur immediately.
9. Replay once more. Confirm previous feedback and countdown clear, score and progress reset,
   and buttons work immediately for the new sequence. Try rapid repeated presses and a
   sequence with repeated fruit types; verify each repeated position is accepted in order.
10. Use keyboard activation and check that phase, countdown, and outcome are understandable
    without relying on color. With reduced motion enabled, the full row must remain readable,
    input must work from the start, and an unfinished round must enter the five-second window
    after three seconds of static display.

The player-facing behavior is detailed in [contracts/ui.md](contracts/ui.md); round fields and
transitions are in [data-model.md](data-model.md).

## Outcome Checks

- Time a complete round: it must finish within two minutes without external instructions.
- Observe 20 rounds covering right-to-left entry from round start, entry after exit, correct
  input, wrong input, time expiry, repeats, and replay. Outcome and score must match the
  selections every time.
- In each observed round allowed to finish crossing with normal motion, confirm that all four
  fruits move together, remain fully visible while moving for at least three seconds, and
  accept input from round start, including before the row becomes fully visible.
- For 20 uninterrupted crossings, compare the time for each of four equal portions of the
  row's total horizontal path. Each portion must take a time within 10% of the mean for that
  crossing, covering entrance, full visibility, and exit.
- For 20 unfinished crossings, check that the overlay starts when the trailing fruit exits,
  counts 5 through 1, accepts correct input until expiry, and fails incomplete rounds five
  seconds after exit.
- Ask five new players to identify the right-to-left input order, start entering immediately,
  understand the countdown, and recognize the result without explanation. At least four must
  succeed.

Record important prompts, generated solutions that worked or failed, manual corrections, and
lessons learned during implementation for the README's Vibe Coding summary.
