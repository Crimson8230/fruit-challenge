---
description: "Implementation tasks for immediate fruit input and the five-second post-exit countdown"
---

# Tasks: Core Game and Fruit Input

**Input**: Design documents from `specs/001-core-fruit-input/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/ui.md](contracts/ui.md), and
[quickstart.md](quickstart.md)

**Tests**: The constitution requires focused tests for sequence generation, input validation,
scoring, and state transitions. This amendment adds immediate input and a five-second deadline
to the existing playable game. Previously completed work is recorded in
[development-log.md](development-log.md); the checklist below covers the current amendment and
the still-open acceptance checks.

**Organization**: US1 is the only P1 story and delivers the complete revised round.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can proceed in parallel with another marked task after shared prerequisites.
- **[US1]**: Maps to User Story 1 in [spec.md](spec.md).
- Every checklist item names the file or files it checks or changes.

## Path Conventions

- Application files live at the repository root and in `src/`.
- Feature documentation lives in `specs/001-core-fruit-input/`.

## Phase 1: Setup (Existing Project)

**Purpose**: Keep the same feature branch and the existing browser project.

- [X] T001 Verify the active branch is `001-core-fruit-input` and the existing Vite, TypeScript, and Vitest scripts in `package.json`, browser configuration in `tsconfig.json`, and mount point in `index.html` remain usable; add no dependency for this amendment.

**Checkpoint**: The current project is ready for a small gameplay change.

---

## Phase 2: Foundational (Current Baseline)

**Purpose**: Establish a reproducible baseline before changing round behavior.

- [X] T002 Run `npm test` and `npm run build` using `package.json`; inspect `src/game.ts` and `src/main.ts` to confirm the current `approaching` input guard, full-visibility button unlock, and absence of a post-exit deadline, then record any baseline failure in `specs/001-core-fruit-input/development-log.md`.

**Checkpoint**: The existing playable state and the amendment's starting behavior are known.

---

## Phase 3: User Story 1 - Enter Immediately and Finish During Countdown (Priority: P1) MVP

**Goal**: The player can enter the four-fruit row from right to left from round start, while
the row moves at a constant speed, and has five seconds after its full exit to finish through
a visible, non-blocking countdown overlay.

**Independent Test**: Start a known four-fruit round, make a correct and a wrong choice before
full visibility, then let an unfinished row exit. Verify the overlay shows 5, 4, 3, 2, 1 while
buttons remain active; finish one round before expiry and let another expire. Confirm score,
result, replay, and the existing constant-speed crossing per [quickstart.md](quickstart.md).

### Tests for User Story 1

- [X] T003 [P] [US1] Update `src/game.test.ts` first and confirm the changed cases fail against current `src/game.ts`: accept correct and wrong right-to-left choices in `approaching`; preserve four valid fruits, repeated positions, score 0-4, and terminal input guards; test `passRow` at a known exit time, success just before its five-second deadline, rejection at the exact deadline, timeout with partial score and distinct feedback, early success or wrong input without a deadline, and replay resetting deadline and feedback.

### Implementation for User Story 1

- [X] T004 [US1] Update `src/game.ts` so `selectFruit` accepts `approaching`, `moving`, and unexpired `passed` rounds; make `passRow` record a deadline from an injected exit time and add a pure expiry transition that checks an injected current time before any passed-phase choice. Preserve the `src/game.ts` entity constraints from `specs/001-core-fruit-input/data-model.md`: Sequence Items are "Exactly four items" with display position "Leftmost through rightmost" and selection position "Rightmost through leftmost"; Round Correct count is "0-4; equals score and progress"; Deadline is "Empty until the entire row exits; then exit time plus five seconds"; Feedback is "Empty, correct, incorrect, or time expired"; Phase remains `ready`, `approaching`, `moving`, `passed`, `success`, or `failure`. Keep terminal guards and replay reset, then run `npm test` from `package.json`.
- [X] T005 [US1] Update `src/main.ts` instructions, phase and caption text, and button enablement so all four labeled fruit buttons work from the instant a round starts, including during `approaching`, while ready and terminal input stays disabled; pass the current elapsed-time reading to the revised `src/game.ts` selection rule and verify immediate score and feedback with `npm run build` from `package.json` as a playable checkpoint.
- [X] T006 [P] [US1] Add compact `countdown-overlay` styling in `src/style.css` for a popup over the playfield that clearly shows a number and seconds label, remains legible on desktop and narrow screens, and cannot cover or intercept the fruit controls; keep the existing constant-speed row styling and readable focus states.
- [X] T007 [US1] Update `src/main.ts` so the existing single linear row animation calls `passRow` only when the trailing fruit fully exits the right edge; store one deadline from `performance.now()`, show the nonmodal overlay at 5, derive 4, 3, 2, and 1 from remaining time rather than decrementing a counter, keep buttons usable before expiry, and trigger the pure `src/game.ts` timeout transition at five elapsed seconds with retained score, a clear time-expired message, and replay. Check the deadline again before processing every fruit click so a delayed timer cannot accept input at or after expiry.
- [X] T008 [US1] In `src/main.ts`, stop and hide the countdown immediately on fourth-correct success or wrong-input failure, prevent any overlay after a result before exit, and cancel or reject old timer and animation callbacks on replay using the existing round token. Under `prefers-reduced-motion`, show the complete static row for three seconds and then begin the same five-second window if the round is unfinished; keep input active from round start and preserve keyboard focus behavior.
- [ ] T009 [US1] Run `npm test` and `npm run build` from `package.json`, then locally serve the page with `npm run dev` and perform one correct early-input round, one successful countdown round, one wrong-input round, and one timeout round against `specs/001-core-fruit-input/quickstart.md`; fix any gameplay or integration failure in `src/game.ts`, `src/main.ts`, or `src/style.css` before the wider acceptance checks, and record an environment blocker in `specs/001-core-fruit-input/development-log.md` if local serving is unavailable.

**Checkpoint**: US1 is a playable revised MVP with rule tests, a passing build, immediate input,
and a five-second response window; broader observation follows in the final phase.

**Current validation limit**: T009 remains open. The 15 rule tests and production build pass,
and the built page and script return HTTP 200 from local preview. In this managed environment,
Vite's development transform fails with `spawn EPERM`, and headless Chromium fails with
"Access is denied", so interactive rounds have not been observed. Details are in
[development-log.md](development-log.md).

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Complete the process record and verify the player-facing success criteria.

- [X] T010 Update `specs/001-core-fruit-input/development-log.md` with the immediate-input and five-second-overlay prompt, the superseded full-visibility unlock and unlimited post-exit input, successful and unsuccessful AI-generated attempts, notable problems, manual corrections, and lessons learned; distinguish automated evidence from unobserved browser behavior.
- [X] T011 Update `README.md` with concise instructions stating buttons work at round start and an unfinished round has five seconds after exit; retain installation, execution, `npm test`, `npm run build`, and a Vibe Coding summary consistent with `specs/001-core-fruit-input/development-log.md`.
- [ ] T012 Perform the desktop and narrow-screen browser scenarios in `specs/001-core-fruit-input/quickstart.md`: 20 observed rounds for score and outcome, 20 uninterrupted crossings with four equal-path timing segments within 10% of each crossing's mean and at least three seconds of full visibility, 20 unfinished crossings with a 5-to-1 overlay and five-second expiry, immediate input, keyboard and reduced-motion behavior, replay, and a complete round under two minutes. Record measurements and any fixes in `specs/001-core-fruit-input/development-log.md`, then reconcile `README.md`.
- [ ] T013 Arrange the five-person comprehension check in `specs/001-core-fruit-input/quickstart.md` and record in `specs/001-core-fruit-input/development-log.md` whether at least four players identify right-to-left order, start entering immediately, understand the countdown, and recognize success or failure without explanation; reconcile `README.md`.

**Checkpoint**: The feature meets its outcome criteria and its Vibe Coding record matches the
observed work. T012 requires a browser and T013 requires five people; keep them open until
results are observed.

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup T001 precedes baseline T002.
- US1 starts after T002. T003 and T006 can proceed independently. T004 follows T003; T005
  follows T004; T007 follows T005 and T006; T008 follows T007; T009 follows T003-T008.
- Polish T010 follows implementation T008 and records the T009 results or blocker; T011 follows
  T010; T012 follows T011; T013 follows T012 and requires five participants.

### User Story Dependencies

- US1 is the only story and does not depend on another feature. T004-T005 leave a playable
  checkpoint before the countdown is added.
- The existing linear crossing stays in `src/main.ts`; pure round and deadline rules stay in
  `src/game.ts`. Browser observation verifies their integration.

### Parallel Opportunities

- T003 (`src/game.test.ts`) and T006 (`src/style.css`) touch different files and can proceed
  concurrently after T002.
- T004 (`src/game.ts`) and T006 (`src/style.css`) can also proceed concurrently once T003
  has established the failing rule cases.
- T005, T007, and T008 all edit `src/main.ts` and must run in order.

## Parallel Example: User Story 1

```text
After T002:
  T003: Write immediate-input and deadline tests in src/game.test.ts
  T006: Style the non-blocking overlay in src/style.css

After T003:
  T004: Implement round and deadline transitions in src/game.ts
  T006: Continue independent overlay styling in src/style.css
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Verify the existing branch, scripts, and baseline with T001-T002.
2. Write failing rule tests, implement immediate input and deadline rules, and enable buttons
   from round start with T003-T005; keep the game playable.
3. Add the overlay, deadline scheduler, and reduced-motion timing with T006-T008.
4. Run automated and focused local checks in T009 before broad browser and player validation.

### Incremental Delivery

- Keep the existing four-fruit sequence, right-to-left validation, constant-speed movement,
  score, results, and replay while changing input timing.
- Use a fixed deadline to keep five elapsed seconds accurate even if countdown callbacks run
  late; test choices on both sides of the boundary.
- Verify early success, wrong input, timeout, and replay separately before the 20-round checks.
- Record evidence and corrections as work proceeds; keep unrelated features out of scope.
