# Research: Progressive Difficulty

## Deterministic difficulty

**Decision**: Derive difficulty from the positive round number each time a round starts. Let the tier be `floor((roundNumber - 1) / 2)`; fruit count is `min(3 + tier, 8)`, and speed percentage is `min(100 + 15 * tier, 200)`. Use the same calculation for display, row generation, and motion.

**Rationale**: This produces the exact bands in [spec.md](spec.md), including 175% at round 11, 190% at round 13, and the 200% cap from round 15. It prevents accumulated floating-point speed drift and reset leakage.

**Alternatives considered**: Incrementing a mutable speed or fruit count after each round would require additional restart and terminal-state cleanup and could drift from the round shown.

## Variable sequence and input order

**Decision**: Make sequence generation and round validation use the calculated fruit count. Preserve indexed pending/selected/missed positions and choose the rightmost pending position, as restored by the player's 2026-10-19 correction. Replace cherry with orange in the four-item fruit set and update the corresponding control and text. Award 10 points per selected position and 25 once for any clean round, independent of length.

**Rationale**: Indexed positions already handle repeated fruit types and one-time misses. The feature explicitly changes the four-fruit fixed length, fruit set, and input direction while retaining Feature 002's scoring and life rules.

**Alternatives considered**: Maintaining a separate array of unanswered fruit types would lose physical position identity and make duplicate misses or selections harder to guard against.

## Constant physical speed with variable row width

**Decision**: Keep the existing single linear Web Animations row translation. Anchor the 100% speed to the previous four-fruit geometry: with a 55%-wide row, the current code uses `(fieldWidth - rowWidth) / 3500`, equivalent to `0.45 * fieldWidth / 3500` pixels per millisecond. Multiply that reference speed by the new round's percentage, fixed at round start. Derive entrance and total crossing times using the actual measured width of the current row.

**Rationale**: The current code recalculates base speed from actual row width. Enlarging the row for eight fruits without anchoring the reference would accidentally slow its baseline, and a nearly full-width row could make calculated speed approach zero. A single linear animation keeps all fruits at one speed and distance traveled independent of animation-frame callback frequency. Animation-frame checks observe boundary state; they do not drive movement.

**Alternatives considered**: Multiplying the current `(fieldWidth - rowWidth) / 3500` expression by the tier would couple speed to layout. Per-fruit animations or frame-count movement would risk spacing drift and frame-rate dependence.

## Longer-row geometry and boundary resolution

**Decision**: Size the row and its slots for three through eight distinct positions, with a measurable gap and icon size that fit the 320-pixel supported viewport. Keep resolved slots in place. Measure the actual rendered row before animating, so entrance and exit positions reflect its width. Preserve the existing left-edge-of-leftmost-pending boundary check, pre-click reconciliation, completion fallback, and round token invalidation.

**Rationale**: At 320 pixels, eight slots squeezed into the existing 55%-wide row would each be narrower than the current minimum emoji size. Stable slot geometry keeps visual order and boundary checks aligned as positions resolve. The row's actual width must be included in travel duration while its physical speed stays anchored to the base reference.

**Alternatives considered**: Keeping a fixed 55% width would overlap icons; removing resolved slots would shift remaining fruit positions; resolving misses only when the full animation ends would delay per-position life loss.

## Status, reduced motion, and validation

**Decision**: Add one speed percentage to the existing status area and compute progress denominator from the current round length. Retain immediate fruit-button availability, numeric lives and text feedback, the three-second reduced-motion interval, and Game Over's cancellation of movement and input. Extend existing deterministic rule tests and run browser checks at narrow and standard widths, including keyboard and reduced motion.

**Rationale**: These are the smallest changes to satisfy the difficulty display while preserving the playable single-screen experience. Reduced motion substitutes a static viewing interval for geometric boundary passage, so the speed percentage is informative but does not shorten that interval.

**Alternatives considered**: A separate difficulty menu or control is outside scope. Shortening the reduced-motion interval by the speed multiplier would undermine its readability requirement.

## Existing-feature verification gate

**Decision**: Treat the still-open Feature 002 browser-validation tasks T009 and T015 as a prerequisite to claiming the inherited behavior fully verified. Feature 003 planning may proceed, but implementation validation must include those scenarios and record any remaining external check as pending.

**Rationale**: Constitution VII requires existing behavior to be completed and polished before scope expands. The current repository has passing rule tests and a production build, while the prior Feature 002 development log records blocked browser checks. Planning does not claim those checks passed.

**Alternatives considered**: Treating passing rule tests and a build as proof of browser timing would overstate evidence.

No technical clarification remains for the design.
