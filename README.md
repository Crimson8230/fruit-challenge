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

Your **highscore** rises whenever a run beats your prior best. The Start and Game Over screens display it, and Game Over marks a new record when that run beats its starting best. The score is saved in this browser profile; if browser storage is unavailable, the current page keeps its best score until it closes. **Sound on/off** controls short optional cues. All outcomes also have visual feedback, so sound is not required.

## Project structure

- `src/game.ts`: fruit sequences, validation, scoring, lives, rounds, and difficulty.
- `src/main.ts` and `src/style.css`: screen, input, movement, layout, and effects.
- `src/highscore.ts`: browser-local personal best; `src/presentation.ts` and `src/audio.ts`: visual event classification and optional sound.
- `public/fruits/`: the four local SVG illustrations.
- `specs/`: feature specifications, plans, tasks, and development logs.
- `docs/vibe-coding-experience.md`: evidence-based university project account; `docs/prompt-log.md`: preserved prompt wording and source notes.
