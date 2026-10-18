# Quickstart and Validation: Scoring, Lives, and Game Over

This guide is for validating the feature after implementation. The planned behavior is defined in [spec.md](spec.md), [data-model.md](data-model.md), and [contracts/ui.md](contracts/ui.md).

## Setup

Use a current Node.js installation. From the repository root:

```powershell
npm install
npm test
npm run build
npm run dev
```

Open the local URL printed by Vite. The first three commands should finish without errors; the last starts the playable page.

## Rules checks

Use deterministic Vitest cases for the pure game module:

1. Generate four valid fruits, including repeated types; require selection from right to left.
2. Check a correct choice adds exactly 10 points and resolves one position. Check a wrong choice adds zero, costs exactly one life, and leaves the expected fruit pending.
3. Check an indexed miss adds zero, costs exactly one life, and cannot be processed twice, including repeated fruit types.
4. Check four correct selections add 65 points total, with the 25-point bonus applied once. A later correction after a wrong press remains bonus-eligible if no fruit was missed.
5. Check any missed position prevents the bonus. When the last pending position resolves with lives above zero, check the next round begins once with the same score/lives and round number plus one.
6. Check the final life loss sets zero lives and Game Over immediately. Subsequent choice, miss, and transition events leave the result unchanged.
7. Check Play Again resets score, lives, round, positions, and feedback to fresh-game values. Use deterministic random draws in these tests.

For the specification's sampling targets, repeat the applicable checks across 20 correct, 20 wrong, and 20 miss events; 10 clean and 10 missed round completions; 20 round transitions; 10 final-life cases with 10 later ignored events each; and 10 restarts. These can be compact parameterized cases rather than a large suite.

## Browser checks

1. Start a game. Confirm score **0**, lives **3**, round **1**, and immediate input availability while the row enters.
2. Confirm the row moves together at constant speed and full-row visibility lasts at least three seconds. Enter the displayed fruits rightmost first. Confirm +10 each, then +25, and automatic round 2 at **65** points.
3. In a new game, press a wrong button once. Confirm exactly one lost life, text feedback, no score gain, and the same expected fruit remains. Continue with correct input.
4. Let unfinished fruits leave the right edge. Confirm one life is lost per pending position, no double charge or five-second popup, and Game Over stops processing at zero. Check a partially completed row can continue into the next round with remaining lives and without a bonus.
5. On Game Over, confirm final score and round reached. Try fruit input, then Play Again. Confirm reset values, fresh row, and no old event changes the new game.
6. Repeat with keyboard activation, a narrow viewport, and `prefers-reduced-motion: reduce`. The static row stays readable for three seconds before pending positions are missed.

For SC-006, ask five players to identify score, remaining lives, current round, and Game Over result without explanation; at least four should succeed.

## Development evidence

During implementation, record the important prompts, generated attempts that worked or failed, manual fixes, and lessons in a short feature development log. Keep the README concise and update its gameplay and Vibe Coding summary after the game works.
