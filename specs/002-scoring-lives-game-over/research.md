# Research: Scoring, Lives, and Game Over

## Existing implementation and dependencies

**Decision**: Extend the current TypeScript SPA with its Vite, Vitest, and Web Animations API setup; add no dependency or service.

**Rationale**: The repository already separates rules in `src/game.ts` from DOM and motion in `src/main.ts`. Four fruit positions and an in-memory score need no storage or framework.

**Alternatives considered**: A state-management package or canvas rewrite would add complexity without solving a stated requirement.

## Indexed fruit resolution and input order

**Decision**: Keep four stable positions with `pending`, `selected`, or `missed` state. The next correct input is the rightmost pending position, even when a fruit type repeats. A wrong button press leaves those positions unchanged.

**Rationale**: `correctCount` alone cannot represent a missed position or distinguish repeated types. Stable indices also prevent one position from scoring or deducting a life twice.

**Alternatives considered**: Removing elements from the sequence or DOM would shift positions during movement and make boundary checks less reliable.

## Boundary timing

**Decision**: Keep the existing single linear row animation and fixed visual slots. Extend its animation-frame observer to compare the left edge of the leftmost pending slot with the playfield's right edge. Once it reaches that edge, resolve that position, then any other pending positions already at or beyond the edge, individually and in position order. Reconcile once before fruit-click validation and once on animation completion as a fallback when a frame is delayed.

**Rationale**: The leftmost pending fruit is the trailing unresolved fruit. Its right-edge crossing can coincide with multiple unresolved positions already outside the playfield. Position-state checks ensure one deduction per position and make Game Over an immediate stop condition. Using the existing animation preserves a constant speed and avoids a second movement clock. If reconciliation ends the round or starts a new one, the pending click is discarded instead of being applied to the new round.

**Alternatives considered**: Waiting five seconds after exit conflicts with Feature 002. Resolving only at `animation.finished` can be late if a delayed click runs after the physical boundary but before the completion callback. Per-fruit animations risk speed drift and visible spacing changes.

## Scoring, terminal priority, and round lifecycle

**Decision**: Pure game transitions own score and life changes. A correct choice adds 10; if it consumes the fourth position and none was missed, the same transition adds 25 once. Wrong choices and misses each deduct one life, with a floor of zero. Reaching zero immediately sets Game Over and suppresses a new round. Otherwise, the transition that consumes the final pending position creates the next round and increments its number once.

**Rationale**: One rules module gives button events and boundary events the same terminal priority. It prevents delayed callbacks from awarding a bonus or advancing the round after Game Over. Injecting random draws in tests makes new-round generation deterministic.

**Alternatives considered**: Letting the UI own points and transitions would duplicate rules across click and animation handlers. Delaying the next round until a result screen would violate automatic progression.

## Visual and asynchronous cleanup

**Decision**: Preserve all four row slots throughout a crossing and mark resolved positions visually without changing layout. On round transition, Game Over, or restart, cancel the current animation, animation-frame request, and reduced-motion timer, and invalidate stale callbacks using the existing round token pattern. Attach the page click listener only once.

**Rationale**: The existing row width remains fixed and no previous game can mutate fresh state. Feedback should use text alongside score, round, and life indicators. The five-second overlay, countdown timer, `passRow`, and expiry behavior are removed from this feature's active flow.

**Alternatives considered**: Keeping old timers hidden would leave a path for duplicate results. Rebuilding listeners per round would create unnecessary cleanup work.

## Reduced motion

**Decision**: Retain the three-second static viewing interval, then resolve each still-pending position once as missed, stopping at zero lives. Correct input remains active during the interval.

**Rationale**: A static row has no geometric boundary event. This is the explicit substitute defined in the feature specification and prevents an unfinished round from lasting forever.

**Alternatives considered**: Keeping Feature 001's extra five seconds would contradict immediate miss handling.

All technical decisions use the existing local code and the feature specification. No unresolved clarification remains.
