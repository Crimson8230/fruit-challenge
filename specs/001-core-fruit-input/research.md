# Research: Core Game and Fruit Input

## Decision 1: Small browser application

**Decision**: Use one browser page with TypeScript, HTML, and CSS. Render fruit and controls with
ordinary page elements and a small browser animation. No application framework, canvas library,
backend, database, or runtime service is needed.

**Rationale**: The feature is one playfield and one round flow. Page elements provide accessible
buttons and visible status without adding a rendering system.

**Alternatives considered**: A component framework or canvas scene would add setup and
interaction code without serving a stated requirement.

## Decision 2: Development and test tooling

**Decision**: Use Vite 6 for local development and production bundling, TypeScript for source and
type checking, and Vitest 3 for small unit tests. Keep them as development dependencies only.
Run a separate TypeScript check because Vite transpiles TypeScript without type checking it.

**Rationale**: The available Node 20 environment is supported by
[Vite 6](https://v6.vite.dev/guide/) and
[Vitest 3](https://v3.vitest.dev/guide/). Vite supports a vanilla TypeScript page and a quick
local server. Vitest can exercise pure game rules, including repeated fruits and terminal states.
Vite's [TypeScript guidance](https://v6.vite.dev/guide/features) calls for a separate type check.

**Alternatives considered**: The [Node test runner](https://nodejs.org/download/release/v20.19.0/docs/api/test.html)
could avoid Vitest, but Node 20 needs an additional compilation step to run TypeScript tests.
The [current Vitest guide](https://vitest.dev/guide/) requires a newer Node release than the
available environment, so the compatible major version is chosen.

## Decision 3: Deterministic game rules

**Decision**: Keep sequence generation, selection checks, scoring, deadline checks, and phase
transitions in a small game module with no page dependencies. Pass a random-number function
into sequence generation and a clock reading into deadline-sensitive transitions so tests can
request known sequences and times. The page code handles movement, timer scheduling, buttons,
and status text.

**Rationale**: This follows the constitution's separation of logic from rendering and makes the
essential rules testable without a browser.

**Alternatives considered**: Putting all rules in button callbacks is shorter initially but makes
transition and scoring tests depend on page setup. A full state-management library is unnecessary.

## Decision 4: Group movement and interaction timing

**Decision**: Keep all four fruits in one persistent row, displayed left to right but validated
rightmost first. Retain the existing linear [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
crossing from x = -R to x = W, where R is the rendered row width and W is the playfield width.
The fully visible travel distance is W - R. One speed v = (W - R) / 3,500 ms gives 3.5 seconds
of fully visible motion at the same speed as entrance and exit. Keep the visibility milestone
for phase text, but enable buttons at round start rather than waiting for it. Use the
[`finished` promise](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished)
to mark the trailing fruit's full exit and begin the response deadline. Select and score
immediately while the row enters, crosses, or exits.

**Rationale**: One linear crossing has no joins that could change speed or create a visible
pause. The 3.5-second fully visible interval leaves margin above the three-second minimum.
Keeping the row mounted during feedback updates prevents movement from restarting. The game
module owns phase changes; the page module reports visibility and passage milestones to it.
The player can now act during the entrance without slowing or changing the motion.

**Alternatives considered**: The earlier three-stage movement used different speeds and
promise-based joins that could pause. A separate timer for input unlock is unnecessary because
input now starts with the round. A full per-frame rendering loop remains unnecessary when the
browser animates the row.

## Decision 5: Responsive row width

**Decision**: Target a row around 55% of the playfield width while keeping four fruit visuals
recognizable. On narrow screens, shorten or hide only the row's text names if needed; retain
visible fruit labels on the input buttons and accessible names for the row. Measure W and R
after layout for each new round before computing speed.

**Rationale**: With the current 80%-wide row, 3.5 seconds of full visibility at one speed
implies about 31.5 seconds for the full crossing. A 55%-wide row reduces that to about
12 seconds, with entrance around 4.3 seconds. Responsive layout can therefore preserve
recognition and input timing without an unnecessarily long wait.

**Alternatives considered**: Keep the 80%-wide row and accept a very slow entrance and exit,
or shorten the fully visible interval below the requirement. Neither serves the playable MVP.

## Decision 6: Animation interruption and reduced motion

**Decision**: On early success, failure, or replay, cancel the current
[animation](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel) and countdown
scheduler, and ignore stale completion callbacks from the previous round. Under
[`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion),
show the entire row statically, allow input from round start, and begin the five-second window
after three seconds of static display if the round remains active.

**Rationale**: A finished callback from an old animation or timer must not change a new round
or terminal outcome. A static, readable row preserves the sequence task for players who request
less motion while giving them a defined start for the same response window.

**Alternatives considered**: Letting old callbacks run risks stale state changes. Hiding the
fruits when motion is reduced would prevent the player from reading the sequence.

## Decision 7: Five-second deadline and popup overlay

**Decision**: On full exit, store one absolute deadline 5,000 milliseconds after a monotonic
clock reading. The pure game rules accept input in `approaching`, `moving`, and `passed`, check
the deadline before validating any input in `passed`, and move an incomplete `passed` round to
failure with distinct time-expired feedback when the deadline is reached. The page schedules
countdown refreshes, derives the visible integer as the ceiling of remaining milliseconds
divided by 1,000, and shows 5, 4, 3, 2, 1 in a nonmodal overlay over the playfield. Keep the
fruit buttons outside the overlay and usable until expiry. End or clear the timer on any
terminal result or replay, using the existing round token to reject stale callbacks.

**Rationale**: An absolute deadline preserves the full five seconds and prevents timer drift.
Checking it on each click prevents late timer callbacks from accepting input after expiry.
The overlay communicates urgency without covering the controls. A distinct timeout result
explains failure and preserves the score earned before expiry.

**Alternatives considered**: Decrementing a mutable counter once per second can drift when a
browser delays callbacks. A modal popup would block the required fruit buttons. Pausing the
row to show the countdown would change its constant-speed crossing.

## Resolved Unknowns

There are no unresolved technical questions. The specification defines sequence length,
right-to-left entry, immediate input, constant-speed group motion, the five-second post-exit
deadline, scoring, failure, and replay.
