# Implementation Plan: Highscores, Finalization, and Label-Free Fruit Graphics

**Branch**: `005-highscores-finalization` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-highscores-finalization/spec.md`

## Summary

Finish the existing Fruit Rush game without changing its rules. Remove visible fruit-name text from the moving row and choice buttons while keeping the four Feature 004 illustrations and reliable accessible names. Add one browser-local personal best, update it as soon as score rises, and compare each run with its starting best for the Game Over record badge. Complete Start and Game Over information, verify the full loop and older features, and write an evidence-based README and Vibe Coding experience document.

## Technical Context

**Language/Version**: TypeScript 5.9, HTML, CSS; Node.js 20 for local tooling

**Primary Dependencies**: Existing Vite 6 and Vitest 3 development dependencies; no added runtime or development dependency

**Storage**: One versioned browser `localStorage` entry for a nonnegative whole-number best score, with an in-memory fallback when access fails

**Testing**: Existing 45 Vitest tests; focused highscore storage and run-record tests; production build; actual-browser checks at 320px and 1280px for storage, full gameplay, accessibility, audio mute, rapid input, and restart

**Target Platform**: Modern desktop and mobile browsers; playable when browser storage or audio is unavailable

**Project Type**: Client-side single-page browser game

**Performance Goals**: Keep immediate input response and Feature 003 linear movement speed; tiny synchronous score storage operation must not delay state acceptance or animation

**Constraints**: Keep four existing fruits, rightmost pending input, +10 correct choice, +25 clean-round bonus, three initial lives, existing difficulty tiers and reduced-motion interval; no backend, database, leaderboard, account, or new rules; only Feature 005 branch edits

**Scale/Scope**: One game screen, one numeric highscore per browser profile, one run-level record indication, four local fruit SVGs, README plus one new university experience document

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Pre-research gate | Post-design check |
|-----------|-------------------|-------------------|
| I. Simplicity First | PASS: one numeric record and removal of two text spans fit the existing small game | PASS: one focused highscore module, no new framework or service |
| II. Playable Incremental Development | PASS: Feature 004 baseline is playable; 45 tests and build pass on 2026-10-19 | PASS: storage, label removal, screen copy, and docs can be verified in separate increments |
| III. Technology and Architecture | PASS: `src/game.ts` already separates rules from UI and audio | PASS: highscore stays outside `Game`; existing browser-only layout remains |
| IV. Gameplay and User Experience | PASS: specification keeps rightmost-first input and requires accessible graphic-only fruits | PASS: [UI contract](contracts/ui.md) preserves clear feedback, focus, and responsive controls |
| V. Quality and Testing | PASS: 35 rules, 7 presentation, and 3 audio tests pass; build passes | PASS: [quickstart](quickstart.md) covers storage failures, old rules, boundary misses, and restart |
| VI. AI-Assisted Development and Documentation | PASS: specification requires verifiable prompts and developer TODOs | PASS: README remains concise; separate document cites existing logs and marks unknown experience |
| VII. Scope Control | PASS: a single local personal best is expressly requested | PASS: no score history, online leaderboard, account, backend, or new gameplay mode |

No principle violation or unresolved clarification remains. The baseline commands were `npm test` (45/45 pass) and `npm run build` (pass) on `005-highscores-finalization`. Development documentation will record any implementation findings and tests as work proceeds.

## Project Structure

### Documentation (this feature)

```text
specs/005-highscores-finalization/
  spec.md
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/
    ui.md
  checklists/
    requirements.md
  tasks.md                  # Created by $speckit-tasks
  development-log.md        # Created during implementation
docs/
  vibe-coding-experience.md
```

### Source Code (repository root)

```text
index.html
src/
  game.ts                   # Existing pure rules; no planned changes
  game.test.ts              # Existing rules tests
  presentation.ts           # Existing transition classifier
  presentation.test.ts
  audio.ts                  # Existing optional sound
  audio.test.ts
  highscore.ts              # Browser-local score adapter and in-memory best
  highscore.test.ts         # Invalid/unavailable storage and record semantics
  main.ts                   # UI rendering, Start/Game Over, record integration
  style.css                 # Graphic-only controls and record presentation
public/
  fruits/                   # Four existing SVGs, unchanged
README.md
docs/
  vibe-coding-experience.md
```

**Structure Decision**: Keep the current one-page layout and `src/game.ts` as the sole source of gameplay state. Add a small score tracker outside the rules module; route accepted score changes from `src/main.ts` to it before rendering results. Keep one delegated click listener and the existing movement token/timer cleanup. Remove fruit-name elements from both UI templates, leave the shared SVG mapping and row geometry intact, and use explicit accessible names on graphical controls and fruit positions. Add highscore to the ready panel and final result overlay so mobile status tiles do not grow.

## Phase 0: Research

[research.md](research.md) records the decisions for safe numeric storage, immediate highscore updates, run-level record semantics, graphic-only accessible fruits, lifecycle preservation, and evidence-based documentation. No `NEEDS CLARIFICATION` item remains.

## Phase 1: Design and Contracts

[data-model.md](data-model.md) defines the highscore, run baseline, validation, and transitions without changing `Game`. [contracts/ui.md](contracts/ui.md) defines ready, active, Game Over, accessibility, and fallback behavior. [quickstart.md](quickstart.md) gives runnable end-to-end checks. No network API or backend contract is needed.
