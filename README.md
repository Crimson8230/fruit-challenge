# Fruit Challenge

A small browser game: read four fruits moving together and choose them from right to left.

## Install and run

Requires Node.js 20 and npm.

```text
npm install
npm run dev
```

Open the local address printed by the development server.

## How to play

Select **Start** to begin round 1 with 0 points and three lives. The four fruits move together
from left to right at a steady speed. Use the Apple, Banana, Cherry, and Grape buttons to
choose them from right to left. The buttons work immediately, even while the row enters.
Each correct choice adds 10 points. A wrong choice or a fruit missed at the right boundary
costs one life. Finish all four positions without missing a fruit for a 25-point bonus.
Rounds start automatically while lives remain, keeping your score and lives. At zero lives,
**Game Over** shows your final score and round; select **Play Again** for a fresh game.
With reduced motion enabled, the row stays still for three seconds before pending fruits
are counted as missed.

## Checks

```text
npm test
npm run build
```

## Vibe Coding experience

Spec-Kit guided the initial playable version and the scoring, lives, and Game Over update.
Feature 002 kept the pure game rules separate from browser movement and replaced the old
post-exit countdown with per-fruit boundary misses. All 16 rule tests and the production
build pass. Browser interaction and the five-player understanding check are still pending.
The [Feature 002 development log](specs/002-scoring-lives-game-over/development-log.md)
records the prompts, observed results, remaining checks, corrections, and lessons.
