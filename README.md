# Fruit Rush

Fruit Rush is a small, single-page arcade game. Watch a row of moving fruit illustrations and choose them from **right to left** before they reach the right boundary. The fruit buttons have no visible name hints; their accessible names remain available to screen readers.

## Technologies

TypeScript, HTML, CSS, Vite, Vitest, local SVG graphics, the Web Animations API, optional Web Audio, and browser `localStorage`. The game is entirely client-side and has no runtime package, account, backend, or online leaderboard.

## Install and run

Requires Node.js 20 or later and npm. From the repository root:

```text
npm ci
npm run dev
```

Open the local address printed by Vite. To check and build the production version:

```text
npm test
npm run build
```

The production files are written to `dist/`.

## Controls and rules

Select **Start Game**, then use the four illustrated fruit buttons with mouse, touch, or keyboard (Tab, Enter, or Space). Choose the **rightmost pending fruit** first, then continue toward the left. Buttons are active as soon as a round begins. Each correct choice adds 10 points. A wrong choice or a fruit missed at the right boundary costs one of your three lives. Completing every position without a miss adds a 25-point bonus and starts the next round automatically. At zero lives, **Game Over** shows your final score and round; **Play Again** starts at score 0, three lives, round 1.

Rounds 1–2 have three fruits at 100% speed. Every two rounds add one fruit and 15% speed until the row reaches eight fruits; speed caps at 200% from round 15. With reduced motion, the row remains still for three seconds before pending positions count as missed.

Your **personal best** rises whenever a run beats your prior best. The Start and Game Over screens display it, and Game Over marks a new record when that run beats its starting best. After Game Over, enter a name of up to 16 visible characters and choose **Save score** to submit the run to the local **Top 10 highscores** list. The list shows the ten best submitted scores in descending order, with older results first on a tie. You may choose **Play Again** without submitting. An older personal best without a name appears as **Legacy record**. Scores stay in this browser profile; if storage is unavailable, the current page keeps new results until it closes.

The speaker icon in the upper-right corner mutes or unmutes both the short gameplay cues and a quiet retro-style background loop. Music begins only after starting a game when the browser permits audio and stops at Game Over. All outcomes have visual feedback, so sound is optional.

## Project structure

- `src/game.ts`: fruit sequences, validation, scoring, lives, rounds, and difficulty.
- `src/main.ts` and `src/style.css`: screen, input, movement, layout, and effects.
- `src/highscore.ts`: browser-local personal best and named Top 10; `src/presentation.ts` and `src/audio.ts`: visual event classification, sound cues, and optional music.
- `public/fruits/`: the four local SVG illustrations.
- `specs/`: feature specifications, plans, tasks, and development logs.
- `docs/vibe-coding-experience.md`: evidence-based university project account; `docs/prompt-log.md`: preserved prompt wording and source notes.

## Vibe Coding experience

Spec-Kit structured the work from core play through final polish. The separate [Vibe Coding experience](docs/vibe-coding-experience.md) connects documented prompts, failed attempts, corrections, and lessons to the feature logs. The [prompt log](docs/prompt-log.md) collects preserved prompt text and identifies missing original wording. Personal experience that is not recorded in the repository remains marked as TODO rather than invented.
