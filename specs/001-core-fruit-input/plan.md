# Implementation Plan: Core Game and Fruit Input

**Branch**: `001-core-fruit-input` | **Date**: 2026-10-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-core-fruit-input/spec.md`

**Note**: This plan covers design through Phase 1. Implementation tasks are generated separately.

## Summary

Adapt the existing single-page fruit game so fruit buttons work as soon as a round starts,
including while the constant-speed row enters from the left. If the right-to-left sequence is
unfinished when the trailing fruit fully exits, show a non-blocking overlay counting down from
5 to 1 and allow five more seconds for the remaining selections. Complete the round immediately
on four correct choices, a wrong choice, or expiry, with clear feedback and replay. Keep round
rules in the tested TypeScript game module and movement, timing display, and DOM updates in the
page module. See [research.md](research.md) for timing and tooling decisions.

## Technical Context

**Language/Version**: TypeScript 5, HTML, CSS; Node 20 for local tooling

**Primary Dependencies**: Vite 6, TypeScript 5, Vitest 3 as development dependencies; no runtime dependencies

**Storage**: None; round state lives only in the page session

**Testing**: Vitest for right-to-left sequence validation, repeats, immediate input, deadline boundaries, timeout, score, and phase transitions; browser checks for full-row visibility, constant-speed crossing, overlay countdown, usable buttons during the countdown, replay, and visible feedback

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Browser-based single-page game

**Performance Goals**: The full row stays visible and moving for at least three seconds in an uninterrupted crossing; entrance, full-visibility travel, and exit share one horizontal speed; accepted input updates immediately; the post-exit response window lasts five elapsed seconds; a round can finish within two minutes

**Constraints**: Four fruits per round in one left-to-right moving row, entered rightmost first; input is active from round start; an unfinished round times out five seconds after the trailing fruit exits; the overlay cannot block fruit buttons; no backend, database, accounts, or optional game modes

**Scale/Scope**: One page, one round at a time, four fruit types, score from zero to four

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-research gate | Post-design check |
|-----------|-------------------|-------------------|
| I. Simplicity First | PASS: one page and no runtime dependencies | PASS: small page and game modules, no extra architecture |
| II. Playable Incremental Development | PASS: existing playable round is the starting point | PASS: immediate input, timeout rules, and overlay can be verified in small steps |
| III. Technology and Architecture | PASS: client-side TypeScript, HTML, CSS | PASS: rules separate from rendering; no backend or persistence |
| IV. Gameplay and User Experience | PASS: immediate input, right-to-left order, constant motion, and deadline are specified | PASS: UI contract covers active buttons, non-blocking countdown, feedback, and terminal states |
| V. Quality and Testing | PASS: essential rules are test targets | PASS: deadline boundary tests, timeout transitions, and crossing checks are identified |
| VI. AI-Assisted Development and Documentation | PASS: spec includes process evidence | PASS: workflow records prompts, outcomes, corrections, and README summary |
| VII. Scope Control | PASS: one round and replay only | PASS: no sounds, levels, accounts, or leaderboards |

No gate violations or unresolved clarifications remain.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-fruit-input/
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

### Source Code (repository root)

```text
index.html
package.json
tsconfig.json
src/
├── main.ts       # stable row DOM, movement, countdown scheduling, controls, and rendering
├── game.ts       # fruit sequence, scoring, and deadline transitions
├── game.test.ts  # sequence, immediate input, deadline, score, and transition tests
└── style.css     # playfield, fruit row, overlay, feedback, and responsive layout
README.md         # setup, play instructions, and Vibe Coding summary
```

**Structure Decision**: Keep the existing small client-side project and its single linear
crossing. Let the game module own right-to-left validation, scoring, the post-exit deadline,
and timeout transitions; let the page module own animation, clock scheduling, and the overlay
display. Make the existing `approaching` phase accept fruit choices, while `moving` still marks
full visibility and `passed` marks the five-second response window. At the visual exit, record
one deadline based on elapsed time. Before processing each choice, check that deadline so a
delayed timer cannot grant extra time. Use one cancellable countdown scheduler to refresh the
overlay and trigger expiry; cancel or ignore stale callbacks after any terminal result or
replay. In reduced motion, show the row statically for three seconds before entering the same
five-second window. First update pure rules and tests, then add the overlay and clock lifecycle,
then verify crossing and accessibility. Implementation updates existing source files in a later
phase; [tasks.md](tasks.md) must be regenerated separately for this amendment.
