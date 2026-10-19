# Vibe Coding Experience: Fruit Rush

This document is a foundation for the university assignment. It reports only events recorded in the repository. `TODO (developer input)` marks personal experience or unrecorded details that the developer must supply.

## Project objective

Build a small, fully client-side fruit sequence game that remains playable as rules, difficulty, presentation, personal records, and optional music are added. The project also examines how AI-assisted development and Spec-Kit artifacts affected the workflow. See the [constitution](../.specify/memory/constitution.md) and [Feature 006 specification](../specs/006-highscore-list-music/spec.md).

## AI tools and Spec-Kit

The repository's [Spec-Kit configuration](../.specify/init-options.json) selects `codex` as its AI integration. Feature directories 001–006 contain specifications, plans, tasks, and implementation logs. Spec-Kit was used to turn requests into a specification, implementation plan, ordered tasks, and subsequent checks. The [Feature 006 log](../specs/006-highscore-list-music/development-log.md) records the latest implementation checks.

**TODO (developer input):** Confirm the exact AI products, models, editor tools, and time spent that you personally used outside the repository record.

## Implemented feature sequence

1. **Feature 001 — core fruit input:** established a moving sequence and input flow; later requests corrected the row to move together, keep constant speed, accept right-to-left choices, and enable input promptly. [Log](../specs/001-core-fruit-input/development-log.md)
2. **Feature 002 — scoring, lives, Game Over:** added +10 per correct fruit, a +25 clean-round bonus, three lives, boundary misses, automatic rounds, and replay. [Log](../specs/002-scoring-lives-game-over/development-log.md)
3. **Feature 003 — progressive difficulty:** introduced round-based fruit counts and speed tiers. A player report corrected a left-to-right input regression back to rightmost pending first. [Log](../specs/003-progressive-difficulty/development-log.md)
4. **Feature 004 — visual and audio polish:** replaced emojis with four local SVGs and added brief visual cues, optional synthesized sound, mute, responsive layout, and improved Start/Game Over presentation. [Log](../specs/004-visual-polish-feedback/development-log.md)
5. **Feature 005 — finalization:** removes visible fruit-name hints, adds a browser-local highscore, finalizes screen information, and performs a full regression/documentation pass. [Specification](../specs/005-highscores-finalization/spec.md) · [Implementation log](../specs/005-highscores-finalization/development-log.md)
6. **Feature 006 — named records and retro music:** adds a browser-local Top 10, Game Over name entry, a quiet original loop, and an icon-only sound toggle. [Specification](../specs/006-highscore-list-music/spec.md) · [Implementation log](../specs/006-highscore-list-music/development-log.md)

## Development workflow

The feature artifacts followed a requirements → plan → tasks → implementation path. Pure rules live in `src/game.ts`, while `src/main.ts` handles DOM input and movement. Feature 004 added separate presentation and audio modules; Features 005–006 keep records outside the rules module. The logs record automated tests, builds, browser attempts, and corrections at individual feature stages. [Feature 003 log](../specs/003-progressive-difficulty/development-log.md) · [Feature 004 log](../specs/004-visual-polish-feedback/development-log.md) · [Feature 006 plan](../specs/006-highscore-list-music/plan.md)

**TODO (developer input):** Describe how you personally reviewed AI output, decided when to accept suggestions, and divided work between manual and AI-assisted steps.

## Important recorded prompts

The separate [prompt log](prompt-log.md) lists individual requests and distinguishes quoted Spec-Kit input, conversation excerpts, and unavailable original text.

- Feature 001's log records the initial request for a playable moving-fruit game and three correction requests: a single moving row, right-to-left entry at constant speed, and prompt input with a countdown in that historical version. [Feature 001 prompts](../specs/001-core-fruit-input/development-log.md)
- Feature 002's log records the request for scoring, lives, boundary misses, automatic rounds, Game Over, and replay. [Feature 002 prompts](../specs/002-scoring-lives-game-over/development-log.md)
- Feature 003's log records the difficulty-tier request and the later player correction of input direction. [Feature 003 prompts](../specs/003-progressive-difficulty/development-log.md)
- Feature 004's log records the visual/audio/responsive polish request. [Feature 004 prompts](../specs/004-visual-polish-feedback/development-log.md)
- Feature 005's specification records the final highscore, label-free graphics, documentation, and regression scope. [Feature 005 specification](../specs/005-highscores-finalization/spec.md)
- Feature 006's original request and later upper-right sound-icon amendment are quoted in the [prompt log](prompt-log.md); the [specification](../specs/006-highscore-list-music/spec.md) records their requirements.

These bullets summarize the prompts; use the prompt log for preserved wording and its source limitations.

**TODO (developer input):** Add any other important exact prompts only if you have their original text.

## Problems and unsuccessful attempts

- The Feature 001 log records permission errors when creating the branch, Vitest runs that failed before rule modules existed, and browser processes that could not launch in the managed environment. [Feature 001 log](../specs/001-core-fruit-input/development-log.md)
- The Feature 002 log records an obsolete README and failed headless-browser startup; it does not claim an unrecorded failed code-generation attempt. [Feature 002 log](../specs/002-scoring-lives-game-over/development-log.md)
- Feature 003 initially changed input to the leftmost pending fruit. The later user report exposed that regression; tests and implementation were corrected to rightmost first. Early mobile screenshots also showed buttons too low. [Feature 003 log](../specs/003-progressive-difficulty/development-log.md)
- Feature 004's first build found that the target JavaScript level did not support `Array.findLast`; a reverse/find expression replaced it. A Game Over fade briefly obscured the result and was replaced by a small scale effect. [Feature 004 log](../specs/004-visual-polish-feedback/development-log.md)
- Feature 005's focused tests initially failed because `src/highscore.ts` did not yet exist. Vitest and Chromium process spawning required execution outside the managed sandbox after `spawn EPERM` errors. [Feature 005 log](../specs/005-highscores-finalization/development-log.md)
- Feature 006's new ranking and audio tests first failed for missing APIs, as expected in the test-first workflow. Sandbox launches again blocked Vitest and the first Vite browser run with `spawn EPERM`; execution outside the sandbox allowed verification. [Feature 006 log](../specs/006-highscore-list-music/development-log.md)

## Successful solutions and manual corrections

Pure game-state tests covered repeated fruits, scoring, life loss, and round transitions before presentation work. Indexed fruit positions made rightmost-first input and one-time misses explicit. One linear row animation replaced staged motion; round tokens prevent old callbacks from affecting replay. These outcomes and the related manual corrections are documented in the [Feature 001 log](../specs/001-core-fruit-input/development-log.md) and [Feature 003 log](../specs/003-progressive-difficulty/development-log.md).

Feature 004 derived presentation events from accepted before/after game states, enabling immediate feedback for a final correct choice or terminal mistake. The screen review corrected the obscuring Game Over fade. [Feature 004 log](../specs/004-visual-polish-feedback/development-log.md)

Feature 005 uses one validated numeric best score outside `Game` and keeps the best in memory when browser storage fails. Browser checks and final verification are recorded in the [Feature 005 log](../specs/005-highscores-finalization/development-log.md).

Feature 006 keeps the numeric best independent of name submission, ranks named results with stable tie order, and imports an older unnamed best once. It extends the existing audio controller rather than adding a library. The [Feature 006 log](../specs/006-highscore-list-music/development-log.md) records tests and browser observations.

**TODO (developer input):** Add corrections you personally made that are not recorded in these logs, with evidence or a clear first-person account.

## Lessons learned

- Isolating rules from rendering made scoring and rightmost-first regressions testable. [Feature 001 log](../specs/001-core-fruit-input/development-log.md) · [Feature 003 log](../specs/003-progressive-difficulty/development-log.md)
- Passing rule tests and a build did not prove browser timing or layout; later headless-browser checks found a narrow-screen layout issue. [Feature 002 log](../specs/002-scoring-lives-game-over/development-log.md) · [Feature 003 log](../specs/003-progressive-difficulty/development-log.md)
- Immediate visual review matters: Feature 004's Game Over fade passed value checks but made the result briefly hard to read. [Feature 004 log](../specs/004-visual-polish-feedback/development-log.md)
- Optional browser capabilities need fallbacks. Audio and storage failures should not prevent the game from accepting an input. [Feature 004 log](../specs/004-visual-polish-feedback/development-log.md) · [Feature 005 log](../specs/005-highscores-finalization/development-log.md)
- Feature 006 showed why a numeric personal best and a named ranking need separate state: skipping a name must not erase the best, and re-importing the numeric score on every load would create unnamed duplicates. [Feature 006 research](../specs/006-highscore-list-music/research.md) · [Feature 006 log](../specs/006-highscore-list-music/development-log.md)

**TODO (developer input):** Add your own reflection on what AI assistance improved, what it made harder, and what you would change in a future project. Do not present pending five-player observation or subjective sound listening as completed evidence.
