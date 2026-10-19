# Phase 0 Research: Visual Polish, Animations, and Audio Feedback

The current game already separates pure rules in `src/game.ts` from DOM, movement, and controls in `src/main.ts`. Baseline on 2026-10-19: all 35 tests and `npm run build` pass. There are no unresolved technical clarifications.

## Fruit graphics

**Decision**: Draw four compact, local SVG illustrations for apple, banana, grape, and orange, with a shared fruit-to-asset/name mapping used by both the moving row and choice controls. Use consistent view boxes and visual weight, distinct silhouettes and colors, and retain readable text and accessible names.

**Rationale**: The current emoji icons vary by browser and operating system. Local SVGs are crisp at the small mobile size, require no runtime media service, and add no package.

**Alternatives considered**: Keep emoji (inconsistent appearance); raster images (more assets and scaling concerns); canvas drawing (more code for four static fruits); remote media (violates the spec).

## Movement and decorative effects

**Decision**: Keep the existing linear row animation, speed calculation, boundary checks, and three-second reduced-motion interval. Apply brief transform/opacity effects only to a resolved fruit and separate button/status/overlay elements. Keep each fruit's layout slot in place during the effect. Derive effects from the previous and next game snapshots at the point of state transition, not solely from `Game.feedback`; final correct input becomes `round-complete` in the returned state. For a final fruit whose row is replaced immediately, show a short independent visual echo or success overlay. Cancel or replace effects on rapid input and clear them on restart.

**Rationale**: Awaiting a removal animation would delay scoring and round changes. Changing the row's transform or removing a slot from layout would alter movement geometry. State comparison can identify a selected position even when the round changes.

**Alternatives considered**: Delay game transition until animation ends (violates responsiveness); remove DOM nodes immediately (changes row width and movement); animate the moving row itself (conflicts with movement); per-round event listeners (leak risk).

## Input and audio event mapping

**Decision**: Keep native buttons and the existing delegated input handler, with pointer, touch, Enter, and Space activation. Compute a presentation event from the before/after `Game` snapshots for each accepted choice or boundary miss. Use a single short sound for a simultaneous event with priority Game Over > clean round completion > wrong choice with life loss > missed-fruit life loss > ordinary correct choice. A wrong-choice sound conveys both error and life loss; an automatic miss uses the life-loss sound. Matching visible text and effects remain available without audio.

**Rationale**: The pure rules already decide score, life, round, and terminal state synchronously. A single event classification avoids losing final-choice feedback and prevents overlapping sounds from one action.

**Alternatives considered**: Use `Game.feedback` alone (does not reveal every underlying event); play every triggered cue together (noisy); introduce input locks (breaks rapid input).

## Audio engine and mute

**Decision**: Use one lazily created Web Audio context with short synthesized tones, a session-only mute state, and a visibly labeled toggle available in all screens. Create or resume audio only in response to a player gesture. Never await audio in gameplay. Skip a cue if playback is blocked or unavailable; do not queue it for later. Bound active voices and stop them on mute, Game Over/restart as appropriate, and page exit; release finished nodes.

**Rationale**: Synthesized cues are small, locally available, and avoid another package or media download. One context and explicit cleanup avoid resource buildup during long sessions.

**Alternatives considered**: Local sound files (acceptable but add asset/decoding management); one context per cue (resource limits and leaks); HTML audio elements (less predictable control over rapid cues).

## Responsive layout, accessibility, and validation

**Decision**: Use the existing single-screen structure, with a responsive status grid, a visually distinct playfield, fixed-aspect fruit illustration boxes, and fruit controls at least 44 by 44 pixels. Check complete three-to-eight-fruit rows at 320px and 1280px; reserve space for the caption and avoid page overflow. Provide named controls, visible keyboard focus, color-independent feedback, and suppress decorative motion under reduced-motion preference while retaining gameplay's existing static viewing interval. Verify in a real browser as well as with the existing rules tests and build.

**Rationale**: The current mobile layout already uses compact row slots and two-column controls, but new art and decoration can create overlap or overflow. Unit tests cannot establish visual size, sound policy, or timing.

**Alternatives considered**: A UI framework (unnecessary for one page); separate mobile game rules (would violate consistent behavior); relying on tests/build alone (cannot validate layout or audio).

## Constitution and scope

All choices use the current client-side TypeScript/CSS project, no backend or persistence, no new runtime dependency, and no changes to `src/game.ts` rules. Feature 004 explicitly requests sound and animation, satisfying the constitution's optional-enhancement condition. The existing 35 tests and build pass before design; implementation must repeat those checks, perform browser validation, and record development evidence.
