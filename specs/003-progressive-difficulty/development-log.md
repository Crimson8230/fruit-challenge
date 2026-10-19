# Development Log: Progressive Difficulty

## Important prompts and decisions

- The Feature 003 request and Spec-Kit artifacts called for round-number tiers from 3/100% at rounds 1–2 through 8/200% from round 15, with no mid-round speed changes.
- The initial Feature 003 specification changed the fruit set to Apple, Banana, Grape, and Orange and incorrectly changed input to leftmost pending first. The player corrected this on 2026-10-19: rightmost-pending input is retained from Feature 002. The earlier scoring, life, automatic round, Game Over, and restart rules remain.
- The generated tasks placed pure difficulty and game transitions in `src/game.ts`, one-row movement and status in `src/main.ts`, and layout in `src/style.css`.

## Successful generated work and validation

- Before editing, `npm test` passed the existing 16 rule tests and `npm run build` passed on 2026-10-19.
- The first new difficulty tests failed because `getRoundDifficulty` did not exist. After the pure tier mapping was added, all 32 then-current tests passed.
- The initial sequence and transition tests failed on the old fixed-four and Cherry rules. The first implementation also changed input to the leftmost pending index; that direction was later reported as a bug and corrected.
- The row now measures its rendered width for entrance and exit timing, while physical speed uses the prior 55%-row reference `(0.45 * fieldWidth) / 3500` pixels per millisecond and one multiplier fixed at round start.
- After the rule and page changes, `npm test` passed 35 tests and `npm run build` passed TypeScript checking and Vite bundling on 2026-10-19.
- Source review found no added runtime dependency, backend, persistence, difficulty menu, or unrelated mode; the page remains a single-screen browser game with pure rules separate from DOM motion. Constitution I–VII have no known code exception.
- After the mobile correction and browser pass, the final `npm test` again passed all 35 tests and `npm run build` passed TypeScript and Vite on 2026-10-19.

## Browser and player checks

- The inherited Feature 002 browser scenarios were previously unverified. A sandboxed Vite start failed with `spawn EPERM`; an approved outside-sandbox Vite start succeeded. The full Chromium executable returned no `--dump-dom` output, and its isolated screenshot process hung. The cached Chromium headless-shell executable then worked. These failed attempts did not count as validation; the subsequent headless-shell observations below did.
- A Playwright-controlled headless-shell pass checked rounds 1, 2, 3, 5, 7, 9, 11, 13, 15, and 25: all ten row lengths and speed labels matched the table. It completed 24 clean rounds and checked the cumulative score and `0/current-length` progress at each new round; 162 correct selections and 31 wrong choices were exercised. The inherited +10/+25 scoring, one-life wrong input, boundary misses, immediate Game Over, keyboard activation, and Play Again behaviors were observed under Feature 003's fruit set and input order. Ten Game Over restarts from round 5 returned to score 0, three lives, round 1, three positions, and 100% speed.
- Twenty browser rows had their linear travel measured against the configured speed; the largest controlled-animation-time error was below 0.001%. Comparing elapsed-animation-time speed with normal and approximately half-rate animation-frame callbacks differed by below 0.001%, within SC-002's 5% bound. The check used a headless Chromium browser and controlled animation time; physical display hardware was not measured.
- Ten eight-fruit row crossings at 320px and ten at 1280px were inspected with the row fully inside the playfield. No neighbor overlap or clipping was measured. At round 11, measured row widths were 214.3px inside a 250px field at 320px and 564px inside a 594px field at 1280px. Full-page screenshots were visually inspected: fruit icons remained distinct and all four choice buttons remained visible at a 320×720 viewport after the mobile layout correction.
- With reduced movement, the row had no animation. A selection was accepted during the static interval; score and lives remained unchanged through 2.5 seconds, and remaining positions were missed after 3.1 seconds. A round-11 eight-fruit static row fit inside the 320px field and displayed 175% speed. These observations cover the applicable inherited Feature 002 reduced-motion, input, and terminal paths after the Feature 003 rule changes.
- SC-006 requires five players to identify current difficulty and the next fruit in early and eight-fruit rounds. No participant observations were available in this session, so the count remains pending.

## Corrections and lessons

- A pure round-number mapping avoids accumulated speed drift and makes the tier boundaries directly testable.
- Keeping resolved slots mounted preserves physical position identity for repeats and one-time misses while the row crosses the playfield.
- The first 320px eight-fruit screenshot showed the answer buttons too low on a short viewport. Hiding unused Start-button space during play and compacting the mobile layout brought all four buttons into the 320×720 viewport; the geometry and browser checks were rerun after that correction.
- A successful rules suite and production build cannot establish browser motion, geometry, or player understanding; browser checks and the remaining player check are recorded separately.
- A later player report identified left-to-right input as wrong. Tests were changed to require the rightmost pending position, including repeated fruits and a skipped position; 14 tests then failed against the leftmost-first code. The game rule and all visible instructions were corrected to right-to-left, and all 35 tests plus the production build passed again. A 320px reduced-motion headless-browser check then verified the rightmost fruit scored first, a wrong choice cost one life without selecting it, and the next choice resolved the following position; the sampled sequence was Orange, Apple, Orange.
