# Implementation Plan: Named Highscore List and Retro Background Music

**Branch**: `006-highscore-list-music` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-highscore-list-music/spec.md`, including the later request for an icon-only sound control in the upper-right corner.

## Summary

Add a browser-local top-ten ranking with name entry after Game Over, retaining the existing numeric best and migrating its prior value once as an unnamed legacy record. Use the existing Web Audio controller for a quiet original retro loop and the same mute setting as sound effects. Replace the visible sound text with an accessible icon button in the header's upper-right corner. Keep game rules and movement untouched.

## Technical Context

**Language/Version**: TypeScript 5.9, HTML, CSS; existing Node.js tooling

**Primary Dependencies**: Existing Vite 6 and Vitest 3; no new dependency

**Storage**: Existing `fruit-rush.highscore.v1` numeric best plus one versioned browser `localStorage` ranking snapshot; in-memory fallback on storage failure

**Testing**: Existing 57 Vitest tests and production build pass before changes; add focused ranking and audio lifecycle tests, then check desktop and 360px mobile UI, keyboard input, mute, reload, and replay

**Target Platform**: Modern desktop and mobile browsers, with a silent fallback when Web Audio is unavailable or playback is blocked

**Project Type**: Client-side single-page browser game

**Performance Goals**: No added delay to fruit input or movement; at most ten stored/displayed ranking entries; one bounded music scheduler and a small number of short voices

**Constraints**: No backend, account, online leaderboard, external audio service, added gameplay rule, or new fruit type. Existing rightmost-first input, score/life rules, speed tiers, effects, and reduced-motion behavior remain.

**Scale/Scope**: One name form, two ranking views (ready and Game Over), one upper-right sound icon, one short instrumental loop, and a small storage model

## Constitution Check

*GATE: Checked before research and again after design.*

| Principle | Before research | After design |
|-----------|-----------------|--------------|
| I. Simplicity First | PASS: the requested additions fit existing modules | PASS: one ranking store, one audio scheduler, and no framework or service |
| II. Playable Incremental Development | PASS: baseline 57/57 tests and build pass | PASS: ranking, music, and icon can be implemented and checked separately |
| III. Technology and Architecture | PASS: `src/game.ts` separates rules from UI | PASS: ranking stays outside `Game`; audio remains in `SoundController` |
| IV. Gameplay and User Experience | PASS: spec preserves the play loop and requests clear sound state | PASS: [UI contract](contracts/ui.md) covers name validation, ranking, icon state, focus, and narrow screens |
| V. Quality and Testing | PASS: existing unit suite and build pass | PASS: [quickstart](quickstart.md) includes migration, 12 runs, mute, restart, and gameplay regression |
| VI. AI-Assisted Development and Documentation | PASS: original Feature 006 and icon amendment are in `docs/prompt-log.md` | PASS: research records decisions and rejected alternatives; implementation findings can be logged later |
| VII. Scope Control | PASS: local ranking and music are now explicitly requested | PASS: no shared leaderboard, copyrighted tune, account, backend, or gameplay expansion |

No constitution violation or unresolved clarification remains. `npm test` passed 57 tests and `npm run build` passed on the active branch before planning.

## Project Structure

### Documentation (this feature)

```text
specs/006-highscore-list-music/
  spec.md
  checklists/requirements.md
  plan.md
  research.md
  data-model.md
  contracts/ui.md
  quickstart.md
  tasks.md                 # Created in the next Spec-Kit phase
```

### Source Code (repository root)

```text
src/
  game.ts                  # Existing rules; no planned changes
  highscore.ts             # Existing numeric best; ranking storage can live here or beside it
  highscore.test.ts        # Ranking, migration, validation, persistence, fallback
  audio.ts                 # Existing cues plus original background loop lifecycle
  audio.test.ts            # Mute, resume, stop, restart, failure cases
  main.ts                  # Name form, ranking views, icon control, run-level submit guard
  style.css                # Responsive ranking/form and upper-right sound icon
docs/prompt-log.md         # Exact request and icon amendment already recorded
```

**Structure Decision**: Preserve the existing small one-page structure. `src/game.ts` continues to own gameplay state, while `src/highscore.ts` owns saved records and `src/audio.ts` owns all sound. `src/main.ts` coordinates run completion and user interaction through its existing delegated listener. The top-ten list sits outside the fixed-height playfield so ten rows and the name form can grow vertically on mobile without obscuring fruit movement or results.

## Phase 0: Research

[research.md](research.md) resolves storage migration and ordering, one-submit semantics, music scheduling and autoplay, the icon button's accessible state, and the placement of ten ranking rows. No `NEEDS CLARIFICATION` item remains.

## Phase 1: Design and Contracts

[data-model.md](data-model.md) defines entries, saved snapshot, legacy migration, completed-run submission state, and music state. [contracts/ui.md](contracts/ui.md) defines the visible Start, Game Over, ranking, sound control, and fallback behavior. [quickstart.md](quickstart.md) gives end-to-end validation scenarios. There is no network interface or API contract.
