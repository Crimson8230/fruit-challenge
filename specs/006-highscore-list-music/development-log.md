# Feature 006 Development Log

## Baseline — 2026-10-19

- Active branch: `006-highscore-list-music`; working tree was clean before implementation.
- `npm test`: 57 tests passed across four files.
- `npm run build`: TypeScript check and Vite production build passed.
- The built-in specification checklist had 16 checked items and no unchecked items. No extension hooks were configured.
- Existing `.gitignore` already covers Node dependencies, build output, logs, environment files, and common editor files; no ignore change was needed.

## Implementation observations

- The highscore submission tests were written before the API existed and first failed for the missing `HighscoreBoard` and `validatePlayerName` exports. After implementation, 14 focused highscore tests passed.
- The ranking persistence tests were added next and initially failed for missing reload/migration behavior. After the versioned snapshot implementation, all 19 focused highscore tests passed.
- The music lifecycle tests were written before `startMusic` existed and initially failed for that missing method. After implementation, all five focused audio tests passed.
- Several focused Vitest launches failed inside the managed sandbox because child workers could not spawn (`spawn EPERM`). The same tests ran successfully outside the sandbox. The sandbox errors were not counted as product failures.

## Browser checks

Local headless Chromium was used with the Vite development server. The initial server instance was sandboxed and Vite's Windows file-resolution helper failed with `spawn EPERM`; restarting the server outside the sandbox resolved that environment problem.

| Scenario | Observed result |
|----------|-----------------|
| Game Over name flow at 360px | Blank name rejected; `Ada` saved once; repeated submission created no duplicate; replay reset score/lives/round; the next completed run was skipped without adding an entry |
| Local top ten at 360px and 1280px | Twelve seeded scores displayed as ten entries, highest first; no horizontal app overflow; four fruit buttons remained graphic-only |
| Prior Feature 005 best | A saved 85-point numeric best appeared as one `Legacy record` entry and remained 85 in the ready-screen best display |
| Storage unavailable | Denied `localStorage` still allowed Game Over and an in-memory named result |
| Sound icon | Icon-only button appeared in the upper-right at 44 × 44 pixels, its accessible label/pressed state changed on mute/unmute, and browser focus produced a visible 3px outline |
| Game rules at 360px and 1280px | Two fast clean rounds produced scores 55 and 110; round 3 showed four fruits at 115%; wrong input lost one life without score gain; correct rightmost input gained 10; remaining misses reached Game Over; replay reset state |
| Reload persistence | A name submitted after Game Over was restored on the ready screen after a real page reload in the same headless browser session |
| Desktop name flow | The same validation, single submission, skip, replay, icon, and overflow checks passed at 1280px |

Browser audio could not be judged by listening in headless mode. One synthetic Start click also produced Chromium's autoplay warning, while gameplay proceeded. The audio unit tests cover scheduler, mute, suspended context, unavailable audio, and cleanup. Subjective sound quality remains for the developer to assess in an audible browser session.

## Final verification — 2026-10-19

- `npm test`: 66 tests passed (35 game, 7 presentation, 19 highscore, 5 audio).
- `npm run build`: TypeScript check and Vite production build passed.
- `git diff --check`: no whitespace errors.
- Temporary local browser-check pages and screenshots were removed after validation; the development server was stopped.
- Source review confirmed `src/game.ts`, the four fruit SVGs, and the established movement-speed formula were not changed. No dependency was added.
- The Feature 006 specification's functional requirements were checked against the implemented UI, storage, and audio lifecycle. The built-in requirements-quality checklist remained read-only and fully checked (16/16). No extension hooks were configured.
- The local ranking is intentionally confined to one browser profile. An audible human review of the original loop remains pending; the headless tests establish scheduling, mute, cleanup, and fallback behavior but cannot establish subjective sound quality.

## Convergence corrections — 2026-10-19

- Name validation now rejects inputs containing no visible letters, numbers, punctuation, or symbols. Focused tests cover zero-width, control-only, and combining-mark-only names; the existing emoji grapheme tests still pass.
- When a qualifying result would exhaust the safe integer order counter, retained entries are renumbered in their original submission order before the new result is saved. A regression test verifies stable equal-score ordering, a safe persisted `nextOrder`, reload, and a later submission.
- Both new regression tests failed before the fixes and passed afterward. The final focused highscore run passed 20 tests; the full suite passed 67 tests, and `npm run build` passed.
