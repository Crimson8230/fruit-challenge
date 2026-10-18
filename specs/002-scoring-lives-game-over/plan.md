# Implementation Plan: Scoring, Lives, and Game Over

**Branch**: `002-scoring-lives-game-over` | **Date**: 2026-10-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-scoring-lives-game-over/spec.md`

## Summary

Extend the existing four-fruit browser game into a continuous scored game. Each correct right-to-left choice earns 10 points; a complete round without missed fruit earns 25 more. Wrong choices and boundary misses each cost one of three lives. Remaining lives and score persist through automatically started rounds; zero lives stops play and shows Game Over with a fresh-start control. Replace Feature 001's post-exit countdown with immediate boundary misses while retaining the constant-speed fruit row, immediate buttons, and visual style. Keep rules in `src/game.ts` and DOM, movement, and timers in `src/main.ts`. See [research.md](research.md) for boundary and lifecycle decisions.

## Technical Context

**Language/Version**: TypeScript 5.9, HTML, CSS; Node.js for local tooling

**Primary Dependencies**: Existing Vite 6 and Vitest 3 development dependencies; no runtime dependencies

**Storage**: None; score, lives, and round state exist only in memory during the page session

**Testing**: Vitest for sequence generation, indexed input and miss resolution, scoring, bonus eligibility, life bounds, transitions, Game Over, and restart; browser checks for moving-row boundary timing, visible status, keyboard input, reduced motion, and stale-callback cleanup

**Target Platform**: Modern desktop and mobile browsers with Web Animations API support

**Project Type**: Client-side single-page browser game

**Performance Goals**: Preserve Feature 001's constant horizontal speed and at least three seconds of full-row visibility; process button feedback immediately; stop movement and input as soon as the final life is lost

**Constraints**: Four positions per round from the existing four fruit types; right-to-left selection; fruit buttons active at round start; one life per wrong input or pending position missed; lives bounded at zero; no post-exit response window; no backend, persistence, speed increases, longer sequences, or additional modes

**Scale/Scope**: One screen, one active four-fruit round at a time, repeated rounds within one in-memory game

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-research gate | Post-design check |
|-----------|-------------------|-------------------|
| I. Simplicity First | PASS: extend the two existing source modules and small UI | PASS: no new runtime package, service, or architectural layer |
| II. Playable Incremental Development | PASS: Feature 001 is the playable baseline | PASS: rules/tests, boundary integration, then status/Game Over UI are independently verifiable |
| III. Technology and Architecture | PASS: existing TypeScript/HTML/CSS SPA | PASS: pure game rules remain separate from movement, events, and rendering |
| IV. Gameplay and User Experience | PASS: right-to-left input and constant motion are preserved | PASS: [UI contract](contracts/ui.md) covers immediate feedback, status, rounds, and terminal behavior |
| V. Quality and Testing | PASS: essential rule and transition tests are required | PASS: [quickstart](quickstart.md) covers deterministic tests and actual browser timing |
| VI. AI-Assisted Development and Documentation | PASS: spec records process evidence requirement | PASS: implementation will update development notes and concise README summary |
| VII. Scope Control | PASS: requirements exclude later-stage features | PASS: design adds no persistence, sound, levels, modes, or infrastructure |

No gate violations or unresolved clarifications remain. Post-design check completed after the Phase 1 artifacts below.

## Project Structure

### Documentation (this feature)

```text
specs/002-scoring-lives-game-over/
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

`tasks.md` is produced by the later `$speckit-tasks` phase.

### Source Code (repository root)

```text
index.html
package.json
src/
├── game.ts       # sequence generation and pure game-state transitions
├── game.test.ts  # scoring, misses, rounds, terminal state, restart
├── main.ts       # DOM, controls, row animation, boundary checks, cleanup
└── style.css     # existing layout plus score/lives/round and Game Over feedback
README.md         # setup, play instructions, Vibe Coding summary
```

**Structure Decision**: Keep the current project layout. Represent each fruit position's resolution explicitly so repeated fruit types and misses remain distinguishable. Pure transitions award points or deduct one life, cap lives at zero, award the bonus once, and create the next round only when lives remain. The page keeps four fixed visual slots in the moving row so their positions and row speed do not shift as choices resolve. Extend the existing animation-frame observation to reconcile the leftmost pending slot at the right boundary, recheck before processing a click, and handle animation completion as a fallback. In reduced motion, reconcile pending slots when the existing three-second static interval ends. Cancel/invalidate old animation and timeout callbacks on a round change or restart; remove the former five-second countdown behavior. Build in small steps: update pure rules and tests, connect boundary and round lifecycle, add visible status and Game Over, then run browser validation and document results.
