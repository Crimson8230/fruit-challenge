# Development Log: Scoring, Lives, and Game Over

## Important prompts and decisions

- The Feature 002 request called for 10 points per correct fruit, a 25-point bonus for a
  complete sequence without misses, three lives, one lost life for each wrong choice or
  missed fruit, automatic rounds, Game Over, and a fresh Play Again reset while preserving
  Feature 001 movement, input, and visual design.
- The Spec-Kit specification, plan, and tasks split pure rules in `src/game.ts` from DOM,
  movement, and timers in `src/main.ts`. They replaced the old five-second post-exit
  countdown with immediate boundary misses and a three-second static viewing interval
  when reduced motion is requested.
- A `$speckit-converge` review on 2026-10-18 found that the Feature 002 development log was
  absent, the README described obsolete rules, browser validation was unrecorded, and the
  five-player understanding check was unrecorded. It appended tasks T013–T016.
- The subsequent `$speckit-implement` request prompted this documentation and validation
  pass.

## Generated work and checks that succeeded

- The existing rules model has four indexed positions with separate pending, selected,
  and missed states. The tests cover repeated fruits, right-to-left input, score and life
  changes, the one-time clean-round bonus, automatic rounds, Game Over, and restart.
- On 2026-10-18, `npm test` passed all 16 tests in `src/game.test.ts`.
- On 2026-10-18, `npm run build` passed TypeScript checking and produced the Vite build.
- Source review found a single linear row animation, boundary reconciliation before
  clicks and on animation frames, token-based cancellation of stale callbacks, and a
  three-second reduced-motion timer. These observations are code review evidence, not
  proof of behavior in a browser.

## Attempts that failed or remain unverified

- A cached Chromium executable was found locally, but invoking it for headless browser
  validation produced a Windows crashpad pipe error (`TransactNamedPipe: The pipe has
  been ended`). No browser interaction or visual timing result was obtained. The moving
  row, boundary timing, keyboard input, narrow viewport, and reduced-motion display in
  the Feature 002 quickstart remain pending browser checks.
- No five-player observation was available in this session. SC-006 is pending; no
  participant count or usability result is claimed.
- No specific failed Feature 002 code-generation attempt or manual gameplay correction
  was recorded in the available evidence. The obsolete README text was identified and
  corrected during this pass.

## Lessons learned

- Deterministic rule tests and a successful build establish the core state transitions
  and bundle health, but browser timing and keyboard behavior still require observation.
- Keeping each fruit position indexed makes repeated types and one-time miss resolution
  explicit in tests and in the boundary code.
- Documentation must be updated when gameplay rules change; the old Feature 001 README
  still described one-point scoring and a five-second countdown after Feature 002 was
  implemented.

## Feature 003 inherited-check follow-up (2026-10-19)

- The inherited browser scenarios were revisited before the Feature 003 rule change. The
  baseline `npm test` passed 16 tests and `npm run build` passed. A sandboxed Vite server
  failed with `spawn EPERM`; the outside-sandbox server started. Cached Chromium produced
  no page output with `--dump-dom`, and an isolated headless screenshot attempt hung
  without creating a screenshot. No pre-change browser behavior was observed. A later
  Chromium headless-shell pass on Feature 003 verified the inherited scoring, boundary,
  Game Over, restart, keyboard, and reduced-motion behavior with Feature 003's deliberate
  fruit-set and input-order changes; results are in the Feature 003 development log.
  Feature 002 tasks T009 and T015 retain their historical pre-change pending status.
