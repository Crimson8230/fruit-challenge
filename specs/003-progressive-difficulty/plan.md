# Implementation Plan: Progressive Difficulty

**Branch**: `003-progressive-difficulty` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-progressive-difficulty/spec.md`

## Summary

Extend the existing in-memory fruit game with a pure round-number difficulty calculation: three to eight fruits, speed increasing by 15 percentage points every two rounds, capped at 200%. Generate a fresh sequence at each round, change the fruit set to apple/banana/grape/orange, and retain rightmost-pending selection, scoring, misses, lives, automatic transitions, Game Over, and restart. Keep game rules in `src/game.ts`; adapt the one-row animation, status, and controls in `src/main.ts`; and make three- to eight-fruit rows readable in `src/style.css`. [research.md](research.md) records the geometry and speed decisions.

## Technical Context

**Language/Version**: TypeScript 5.9, HTML, CSS; Node.js for local tooling

**Primary Dependencies**: Existing Vite 6 and Vitest 3 development dependencies; no new runtime package

**Storage**: None; game and difficulty state are session-only

**Testing**: Vitest for difficulty tiers, generation, order, scoring, miss resolution, round transitions, terminal state, and restart; actual-browser checks for row speed/geometry, input, Game Over, keyboard, and reduced motion

**Target Platform**: Modern desktop and mobile browsers with Web Animations API support; supported checks include 320-pixel and 1280-pixel viewports

**Project Type**: Client-side single-page browser game

**Performance Goals**: Preserve the prior 100% physical row speed as the reference; apply a fixed 100–200% multiplier once per round; keep each row linear, smooth, and unaffected by frame rate; maintain readable distinct slots for up to eight fruits

**Constraints**: Three to eight positions by round tier; only apple, banana, grape, orange; rightmost-pending input; +10 per selected position and +25 clean-round bonus; three lives; one life per wrong input or missed pending position; immediate Game Over; no backend, persistence, sounds, modes, or difficulty settings

**Scale/Scope**: One screen, one active row of at most eight fruit positions, unlimited successive in-memory rounds

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-research gate | Post-design check |
|-----------|-------------------|-------------------|
| I. Simplicity First | PASS: round mapping fits the existing rules module | PASS: no extra service, state layer, or runtime dependency |
| II. Playable Incremental Development | PASS: the current game runs with the Feature 002 rules | PASS: pure tiers/tests, variable rounds, then row/UI can be verified in small increments |
| III. Technology and Architecture | PASS: current client-only TypeScript SPA separates rules and page code | PASS: difficulty calculation and transitions stay in `src/game.ts`; DOM and animation stay in `src/main.ts` |
| IV. Gameplay and User Experience | PASS: the spec preserves immediate input, feedback, and terminal behavior while explicitly changing fruit set and input order | PASS: [UI contract](contracts/ui.md) covers readability, current speed, and reduced movement |
| V. Quality and Testing | PASS: existing Vitest suite and build provide a baseline | PASS: [quickstart](quickstart.md) adds tier, regression, frame-rate, layout, and browser checks |
| VI. AI-Assisted Development and Documentation | PASS: FR-017 requires process evidence | PASS: implementation should record prompts, failed/successful attempts, corrections, checks, and update README |
| VII. Scope Control | CONDITIONAL: Feature 002 browser validation tasks T009/T015 remain open | CONDITIONAL: the implementation sequence must resolve or clearly document inherited browser-check limitations before claiming polished Feature 003 behavior; no optional expansion is designed |

The conditional gate is a verification obligation, not approval to claim prior checks passed. Planning introduces no new application behavior. Before implementation is declared complete, run the inherited Feature 002 browser scenarios alongside Feature 003 checks; if the environment prevents them, leave their status explicit. No other gate violation or unresolved technical clarification remains.

## Project Structure

### Documentation (this feature)

```text
specs/003-progressive-difficulty/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui.md
└── checklists/
    └── requirements.md
```

`tasks.md` is produced by the later `$speckit-tasks` phase. A Feature 003 development log is created during implementation.

### Source Code (repository root)

```text
index.html
package.json
src/
├── game.ts       # pure round difficulty, sequence generation, selection and miss transitions
├── game.test.ts  # tier, cap, repeat, scoring, terminal, and restart tests
├── main.ts       # HUD, controls, row animation, boundary checks, and cleanup
└── style.css     # readable 3–8 position row and responsive status
README.md         # gameplay instructions and development summary
```

**Structure Decision**: Keep the existing project layout. First add a pure round-to-difficulty mapping and table-driven tests for every tier boundary and cap. Make sequence length and round validation derive from that mapping, switch the four fruit controls to the requested set, and retain rightmost-pending input. Keep all positions mounted in the row and update progress against its actual length. Size the row and slots for up to eight positions, measuring its real width before one linear animation. Anchor base pixels-per-millisecond to the previous 55%-wide row rather than recalculating it from the new row width; multiply once by the current round's speed percentage and use actual row width for entrance and exit timing. Preserve frame-based boundary observation, pre-click reconciliation, reduced-motion timer, and round-token cancellation. Verify narrow and standard viewports and inherited Feature 002 behavior before considering the feature complete.

## Phase 0: Research

[research.md](research.md) resolves the difficulty formula, variable sequence and input order, base-speed reference, row geometry, status, reduced motion, and inherited validation gate. No `NEEDS CLARIFICATION` item remains.

## Phase 1: Design and Contracts

[data-model.md](data-model.md) defines round difficulty, fruit positions, round/game state, and invariants. [contracts/ui.md](contracts/ui.md) defines the player-visible interface. [quickstart.md](quickstart.md) supplies deterministic and browser validation scenarios, including the inherited checks. No network API or persistence contract is needed.
