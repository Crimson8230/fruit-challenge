# Fruit Challenge

A small browser game: read a moving fruit sequence and choose its fruits from right to left.

## Install and run

Requires Node.js 20 and npm.

```text
npm install
npm run dev
```

Open the local address printed by the development server.

## How to play

Select **Start** to begin round 1 with 0 points and three lives. The fruits move together
from left to right at a steady speed for each round. Use the Apple, Banana, Grape, and Orange
buttons to choose the rightmost remaining fruit first. The buttons work immediately, even while the row enters.
Each correct choice adds 10 points. A wrong choice or a fruit missed at the right boundary
costs one life. Finish every position without missing a fruit for a 25-point bonus.
Rounds start automatically while lives remain, keeping your score and lives. At zero lives,
**Game Over** shows your final score and round; select **Play Again** for a fresh game.
With reduced motion enabled, the row stays still for three seconds before pending fruits
are counted as missed.

Each pair of rounds adds one fruit and 15% speed: rounds 1–2 have three fruits at 100%,
rounds 3–4 have four at 115%, and so on. From round 11, rows have eight fruits; speed
reaches its 200% cap at round 15. The current speed appears beside score, lives, and round.

## Checks

```text
npm test
npm run build
```

## Vibe Coding experience

Spec-Kit guided the initial game, the scoring and lives update, and progressive difficulty.
The latest change keeps pure game rules separate from browser movement and derives difficulty
from the displayed round number. A player report caught an incorrect left-to-right input change;
the rightmost-first rule and instructions were restored. All 35 rule tests and the production
build pass. Headless-browser checks covered difficulty tiers, row travel, narrow and standard
layouts, input, reduced motion, and restart. The five-player understanding check remains pending.
The [Feature 003 development log](specs/003-progressive-difficulty/development-log.md)
records the prompts, failed and successful attempts, corrections, checks, and remaining work.
