# Implementation Plan: Visual Polish, Animations, and Audio Feedback

**Branch**: `004-visual-polish-feedback` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-visual-polish-feedback/spec.md`

## Summary

Polish the existing Fruit Rush single-page game without changing its rules. Replace emoji with four local, matching fruit illustrations; redesign the ready, status, playfield, controls, and Game Over presentation; add brief, independent visual effects and optional synthesized audio. Keep `src/game.ts` as the source of truth and preserve the Feature 003 movement calculation, rightmost-first input, scoring, lives, difficulty, and restart. Derive presentation events from before/after game snapshots so final-choice and Game Over transitions receive the correct feedback without delaying gameplay.

## Technical Context

**Language/Version**: TypeScript 5.9, HTML, CSS; Node.js for local tooling

**Primary Dependencies**: Existing Vite 6 and Vitest 3 development dependencies; browser animation and audio capabilities; no new runtime package

**Storage**: None; game and mute state are held only in the current page session

**Testing**: Existing Vitest rules regression suite; targeted presentation/event and audio-mute tests where meaningful; production build; actual-browser desktop/mobile, keyboard, touch, reduced-motion, audio, and rapid-input checks

**Target Platform**: Modern desktop and mobile browsers with current DOM/CSS and movement-animation support; graceful silent operation if browser audio is unavailable

**Project Type**: Client-side single-page browser game

**Performance Goals**: Visible input response within 100 ms; maintain current row movement speed and smoothness; short effects that never block input; no stale audio or animation after repeated rounds/restarts

**Constraints**: Four existing fruits only; rightmost pending fruit first; +10 per correct fruit, +25 per clean round, three initial lives; fixed Feature 003 speed tiers and three-second reduced-motion interval; 320px and 1280px layouts; at least 44px touch targets; no runtime third-party media, backend, persistence, or new gameplay rules

**Scale/Scope**: One screen, one moving row of three to eight fruits, five short audio cue classes, one mute toggle, unlimited in-memory rounds

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Pre-research gate | Post-design check |
|-----------|-------------------|-------------------|
| I. Simplicity First | PASS: the existing one-page game needs only four assets and a small presentation/audio layer | PASS: no framework, service, persistence, or runtime dependency is added |
| II. Playable Incremental Development | PASS: 35 existing tests and the production build pass on 2026-10-19; current core gameplay is present | PASS: artwork/layout, feedback, sound, and validation can be delivered as separately playable increments |
| III. Technology and Architecture | PASS: `src/game.ts` already separates pure rules from `src/main.ts` rendering | PASS: rules and speed formula remain unchanged; SVG/CSS/presentation/audio stay client-side |
| IV. Gameplay and User Experience | PASS: the spec preserves rightmost-first input, score/life rules, and immediate transitions | PASS: [UI contract](contracts/ui.md) defines all screens, feedback, accessibility, and rapid-input behavior |
| V. Quality and Testing | PASS: baseline rules tests and build pass; browser verification is needed for visuals/audio | PASS: [quickstart](quickstart.md) includes regression, viewport, motion, event, mute, Game Over, and restart checks |
| VI. AI-Assisted Development and Documentation | PASS: FR-021 requests process evidence | PASS: implementation will record prompts, outcomes, corrections, and validation, then update README |
| VII. Scope Control | PASS: sound and animation are explicitly requested after the core features | PASS: no new fruit, rule, mode, service, multiplayer, or highscore persistence is designed |

No gate violation or unresolved clarification remains. The pre-research baseline check was `npm test` (35/35 pass) and `npm run build` (pass) on branch `004-visual-polish-feedback`. The post-design gate confirms that visual and audio effects are observers of gameplay transitions, not new rules.

## Project Structure

### Documentation (this feature)

```text
specs/004-visual-polish-feedback/
  spec.md
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/
    ui.md
  checklists/
    requirements.md
```

`tasks.md` belongs to the later `$speckit-tasks` phase. A Feature 004 development log will be created during implementation.

### Source Code (repository root)

```text
index.html                    # Browser title and page shell
src/
  game.ts                     # Existing pure rules; no intended rule changes
  game.test.ts                # Existing 35-test rules regression suite
  presentation.ts             # Classify before/after game snapshots into display/audio events
  presentation.test.ts        # Transition classification tests for final choice and Game Over
  main.ts                     # UI rendering, input, row movement, and event routing
  style.css                   # Responsive arcade styling and decorative effects
  audio.ts                    # Small optional sound controller
  audio.test.ts               # Mute/event/lifecycle tests if audio logic warrants them
public/
  fruits/
    apple.svg
    banana.svg
    grape.svg
    orange.svg
README.md                     # Play instructions and development summary
```

**Structure Decision**: Keep the current project layout and pure rules module. Store the four local illustrations under `public/fruits/` and use one fruit mapping for sequence and buttons. Implement decorative effects around, not inside, the linear row movement. Classify previous and next game snapshots in a small pure `presentation.ts` helper, then route the resulting event through `src/main.ts` to CSS effects and the optional audio controller. Keep the existing delegated button listener and token-based movement cancellation. A separate small `audio.ts` keeps browser audio failures and cleanup out of rule logic; it may be tested independently without adding a framework.

## Phase 0: Research

[research.md](research.md) records decisions on local fruit artwork, non-blocking effects, event classification, single-context sound, responsive layout, reduced motion, and browser validation. No `NEEDS CLARIFICATION` item remains.

## Phase 1: Design and Contracts

[data-model.md](data-model.md) defines presentation-only state, cue mapping, and lifecycle invariants. [contracts/ui.md](contracts/ui.md) records the player-visible screen and interaction contract. [quickstart.md](quickstart.md) describes runnable checks and expected results. No network API, backend, or persistence contract is needed.
