# Quickstart and Validation: Final Fruit Rush

Use [the specification](spec.md), [data model](data-model.md), and [UI contract](contracts/ui.md) for expected results. This is a validation guide for implementation; the pre-feature baseline is 45 passing tests and a passing build on 2026-10-19.

## Setup

From the repository root with Node.js 20 and npm:

```powershell
npm install
npm test
npm run build
npm run dev
```

Open the printed local address. Use normal and 320px/1280px browser viewport modes. Repeat tests and build after implementation.

## Graphic-only fruit identification

1. On ready, active, Game Over, and restarted screens, inspect the moving row and all four choice controls. No fruit-name text or fruit-name tooltip should be visible. The four existing SVGs must match between row and buttons and remain distinct by shape.
2. Inspect accessible names for every fruit button and moving fruit, including a repeated-fruit row. Use Tab and Enter/Space to choose; check visible focus. Tap each button on a touch device or touch emulation.
3. At 320px and 1280px, check no horizontal scrolling, no neighboring fruit overlap while the full row is inside the field, and each choice target at least 44 by 44 pixels. Repeat with reduced motion.

## Highscore and record indication

1. In a fresh browser profile or after clearing only this app's saved score, open the game. The ready highscore must be 0. Start, make one correct rightmost choice, and check +10 score; reload before Game Over. The ready highscore must now be 10.
2. Complete a clean first round: three correct choices yield 55 points, including the 25-point bonus. Reach Game Over; final score, highscore, round reached, and **New highscore!** must agree with the game. Play Again must reset active values while retaining 55 or any greater record.
3. Score below the saved best and reach Game Over. The best stays unchanged and no new-record badge appears. Repeat for a tie. In a run that beats the starting best several times, the badge remains one run-level indication and the saved value is the greatest score.
4. Reload and return in the same browser profile; verify the best survives. Repeat at least 10 runs or interrupted runs, including 10 Game Over/Play Again cycles. Each replay must start with score 0, three lives, round 1, three fruits, and 100% speed.
5. Exercise at least six bad-storage conditions: absent value, empty value, negative value, fractional value, nonnumeric value, oversized value, plus blocked read/write if the browser can simulate it. Each condition must produce a valid nonnegative highscore and playable game. If saving is blocked, the best must remain available until the page closes.

## Existing gameplay and feedback regression

1. Choose rightmost pending fruits, including repeated identities. Check exactly +10 for each correct choice, negative feedback and exactly one lost life for a wrong choice, and one lost life per fruit that crosses the right boundary. A wrong choice must leave the expected position pending.
2. Check clean-round +25 bonus and no bonus after a missed position. Check Feature 003 tiers at rounds 1, 3, 5, 7, 9, 11, 13, and 15: fruit counts 3, 4, 5, 6, 7, 8, 8, 8 and speeds 100%, 115%, 130%, 145%, 160%, 175%, 190%, 200%. Movement must remain smooth and linear.
3. With sound on and then muted, trigger correct, wrong, clean-round, missed-life, and Game Over events. Muted gameplay must remain understandable. Try rapid consecutive clicks during fruit disappearance, a final choice, and near a miss boundary; check no duplicate score, life loss, sound, or event handling.
4. Reach Game Over by wrong choices and by misses. Movement/input must stop, final values must agree with the current game, and repeated Play Again must not accumulate animation loops, timers, or old effects.

## Documentation and evidence

1. Follow the final README as a new reviewer: install, run, test, and build. Confirm it explains controls, gameplay rules, technologies, and project structure.
2. Review `docs/vibe-coding-experience.md` against the feature logs under `specs/001-*` through `specs/004-*` and the Feature 005 development log. Mark unrecorded prompts or personal reflections as TODO rather than facts.
3. Record actual commands, browser observations, failures, corrections, and any checks that could not be performed. Confirm the final commit is on `005-highscores-finalization`.
