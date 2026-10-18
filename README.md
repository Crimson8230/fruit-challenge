# Fruit Challenge

A small browser game: read four fruits moving together and choose them in order.

## Install and run

Requires Node.js 20 and npm.

```text
npm install
npm run dev
```

Open the local address printed by the development server.

## How to play

Select **Start**. The four fruits move together from left to right at a steady speed. Use the
Apple, Banana, Cherry, and Grape buttons to enter them from right to left. The buttons work
immediately, even while the row enters. If the sequence is unfinished when the row leaves,
an overlay counts down five seconds to finish. Each correct choice adds one point. A wrong
choice or expired time ends the round; four correct choices win. Select **Play again** for a
new sequence.

## Checks

```text
npm test
npm run build
```

## Vibe Coding experience

Spec-Kit defined and revised the first playable version. The initial AI-generated game showed
fruits one at a time, which did not match the intended group movement or input timing. Later
corrections reversed the input order, replaced three motion speeds with one linear crossing,
enabled input from round start, and added a five-second countdown after exit. Fifteen focused
rule tests and the production build pass. Browser and five-person checks are still pending.
Prompts, attempts, corrections, and lessons are recorded in the
[development log](specs/001-core-fruit-input/development-log.md).
