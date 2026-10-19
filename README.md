# Fruit Rush

A small browser game: read a moving fruit sequence and choose its fruits from right to left.

## Install and run

Requires Node.js 20 and npm.

```text
npm install
npm run dev
```

Open the local address printed by the development server.

## How to play

Select **Start Game** to begin round 1 with 0 points and three lives. The fruits move together
from left to right at a steady speed for each round. Use the Apple, Banana, Grape, and Orange
buttons to choose the rightmost remaining fruit first. The buttons work immediately, even while the row enters.
Each correct choice adds 10 points. A wrong choice or a fruit missed at the right boundary
costs one life. Finish every position without missing a fruit for a 25-point bonus.
Rounds start automatically while lives remain, keeping your score and lives. At zero lives,
**Game Over** shows your final score and round; select **Play Again** for a fresh game.
The fruit illustrations and short visual cues distinguish correct choices, mistakes, score gains,
lost lives, and clean rounds. Short sound cues accompany these events when the browser permits
audio. The **Sound on/off** button mutes or unmutes all gameplay sounds; the game is fully playable
without audio.
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

Spec-Kit guided the four increments from core play through visual and audio polish. Pure game
rules remain separate from browser presentation; the player's rightmost-first correction is
retained. The visual pass replaced platform emoji with local SVGs, and the audio pass uses short
optional cues. Browser checks covered desktop and mobile widths, rapid input, mute, reduced motion,
Game Over, and restart. A Game Over fade found during screenshot review was corrected so the result
is immediately readable. The five-player understanding check and subjective sound listening check
remain pending. The [Feature 004 development log](specs/004-visual-polish-feedback/development-log.md)
records prompts, attempts, corrections, results, and remaining checks.
