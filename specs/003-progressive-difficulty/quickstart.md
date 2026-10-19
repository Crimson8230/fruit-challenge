# Quickstart and Validation: Progressive Difficulty

Use [the specification](spec.md), [data model](data-model.md), and [UI contract](contracts/ui.md) as the expected behavior. This guide is for implementation validation; it does not claim checks have already passed.

## Setup

From the repository root, with Node.js and npm installed:

```powershell
npm install
npm test
npm run build
npm run dev
```

Open the local address printed by the development server in a browser. The test and build commands must finish without errors before the browser walkthrough.

## Deterministic rules checks

1. Check the difficulty mapping at rounds **1, 2, 3, 5, 7, 9, 11, 13, 15, 16, and 25**. Expected fruit counts are **3, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8**; expected speeds are **100%, 100%, 115%, 130%, 145%, 160%, 175%, 190%, 200%, 200%, 200%**. Check that a skipped or missed round does not compound the percentage.
2. Generate rounds with controlled fruit draws. Assert each has the current length, only apple/banana/grape/orange, and can contain repeated fruit types. Confirm cherry is absent.
3. Select fruit positions from the rightmost pending position. Check one position and exactly 10 points per correct choice, including repeats; a wrong choice keeps that position pending, adds zero points, and costs one life.
4. Complete a three-fruit clean round for **55 points**, a four-fruit clean round for **65 points**, and a longer clean round for `10 × fruit count + 25`. A wrong press followed by all correct choices remains bonus-eligible; any miss removes the bonus.
5. Check one life per indexed miss, no duplicate charge, next-round number and carried score/lives, and final-life Game Over before any bonus or next-round transition. Check choices and miss events after Game Over do nothing.
6. Restart from a higher round. Check score **0**, lives **3**, round **1**, three new pending positions, and **100%** speed. Check stale prior-round events cannot affect the reset game.

## Browser walkthrough

1. Start a game. Confirm the displayed score, lives, round, progress **0/3**, and speed **100%**; fruit buttons work from the start of the row's entrance. Confirm the choices and instructions show Apple, Banana, Grape, Orange and right-to-left input.
2. Play a clean first round by choosing the displayed positions rightmost first. Confirm **+10** per choice, then **+25** once, and round **2** starting at **55 points** with three fruits and **100%** speed. Continue to round **3** and confirm four fruits at **115%**.
3. During a round, press a wrong choice, then the correct choice. Confirm one life lost, no score for the wrong press, unchanged expected position, and continued play. Check that a later clean completion still receives its 25-point bonus.
4. Let a partly answered row cross the right boundary. Confirm one loss per pending position, no double charge or five-second countdown, no bonus, and automatic next round if lives remain. Lose the last life and confirm movement/input stop, final score and round remain fixed, and Play Again resets the initial three-fruit 100% round.
5. For long rows, inspect rounds **5, 9, 11, 13, and 15** or use a controlled browser test setup at those round numbers. At **320px** and **1280px** viewport widths, check order, separate positions, consistent spacing, no overlaps or incorrect clipping while the full row is inside the playfield, and accessible controls. Check round and speed display update together.
6. Observe at least **20** moving rows across early and late difficulties. Compare the same row's travel over equal elapsed time under different display update rates if test tooling permits; measured travel should differ by no more than **5%**. Confirm all fruits within a row move together at a constant pace and that row width does not change the intended base speed.
7. Repeat keyboard activation and Game Over/restart. With reduced movement requested, confirm the entire current sequence stays readable for at least **three seconds**, input remains available, each remaining pending position is missed once after the interval, and the speed indicator still reflects the round.

## Inherited Feature 002 checks

The Feature 002 browser checks in [its quickstart](../002-scoring-lives-game-over/quickstart.md) were pending at planning time. Re-run the applicable moving-row, boundary, wrong-input, round, Game Over, restart, keyboard, narrow-viewport, and reduced-motion cases with Feature 003's deliberate fruit-set and input-order changes. Record observed results in the Feature 003 development log; do not infer visual or timing success from unit tests or a build.

## Player understanding

For SC-006, ask five players to identify the current difficulty and next fruit to select in an early and an eight-fruit round without explanation. Record the count; at least four must succeed. If participants are unavailable, report the criterion as pending.

## Development evidence

Record important prompts, successful and unsuccessful generated attempts, notable problems, corrections, test/build and browser outcomes, and lessons learned in a Feature 003 development log. Update the concise README gameplay and Vibe Coding summary after behavior is verified.
