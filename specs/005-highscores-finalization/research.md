# Research: Highscores, Finalization, and Label-Free Fruit Graphics

The existing code, Feature 004 design, and Feature 005 specification resolve the technical choices below. No external service or new dependency is needed.

## Browser-local highscore

**Decision**: Keep a small highscore adapter in `src/highscore.ts`, separate from `src/game.ts`. Store one decimal, nonnegative safe integer under a versioned `localStorage` key such as `fruit-rush.highscore.v1`. Read once on page load. Validate the raw value before parsing; missing, empty, negative, fractional, nonnumeric, noncanonical, or excessively large data yields 0. Catch both storage property access and read/write failures. Keep the best value in memory after any failure.

**Rationale**: The user requires local persistence and graceful failure, while the constitution requires pure gameplay rules and a small client-side app. A single value has no need for a database or schema migration. Strict parsing avoids accepting unintended values such as empty text as zero through numeric coercion or `Infinity` as a score.

**Alternatives considered**: A JSON score history or leaderboard adds unrequested state. Saving only at Game Over loses a record if the page reloads mid-run. Direct storage calls inside `Game` couple browser capability to rules and tests.

## Score and run-record timing

**Decision**: On each accepted game transition, compare the new `Game.score` with the in-memory best; persist only if it rises. At Start and Play Again, capture the current best as that run's baseline. Show a Game Over record badge iff final score is strictly greater than the captured baseline. Reset the run baseline on restart; never reset the best. Update the tracker before final result rendering.

**Rationale**: A clean final choice can add 35 points at once and immediately start another round; the accepted snapshot is the reliable score source. Comparing against the run's starting best avoids losing the badge when the stored best has already been updated during play. A tie is not a new record.

**Alternatives considered**: Comparing final score to the *current* best would hide every genuine new record after successful persistence. Updating best only on Game Over would violate mid-run persistence. Adding a new field to `Game` would change established mechanics for presentation-only state.

## Graphic-only fruit controls and moving row

**Decision**: Remove fruit-name text nodes from both `src/main.ts` templates and remove their obsolete CSS. Keep the shared four-SVG mapping, `data-fruit`, row slot width, gap, icon size, movement animation, and effects. Put an explicit `aria-label` on each native fruit button; give each moving fruit a suitable image role and accessible fruit name. Keep inner decorative `img` elements silent and add no `title` attributes or tooltips.

**Rationale**: The current templates display text on buttons and on wide-screen row positions. Removing the nodes fulfills the visual challenge directly while preserving shape-based identification and assistive names. Unchanged slot geometry preserves Feature 003's movement and Feature 004's animations.

**Alternatives considered**: CSS-only hiding leaves text that can reappear under styles or be mistaken for a visible label. Replacing the SVGs or reducing row width risks distinguishability and movement behavior. A bare labelled generic `div` may not expose its name consistently to assistive technology; an explicit image role is clearer.

## Start, Game Over, and lifecycle

**Decision**: Place the ready highscore beside the ready instructions and the final highscore plus conditional new-record badge inside the existing Game Over overlay. Preserve the existing Start/Play Again buttons, delegated click handler, focus handoff, `stopMotion`, visual cleanup, and sound cleanup. Keep record state independent of gameplay reset.

**Rationale**: Both screens already have the necessary locations and transitions. The mobile status row stays compact, and a restart cannot accidentally erase the personal best.

**Alternatives considered**: An always-visible sixth status tile consumes narrow-screen space without being required. Rebuilding the entire UI would increase regression risk.

## Verification and development evidence

**Decision**: Add focused tests for score parsing, storage exceptions, score increases, ties, and run baseline. Re-run all existing tests/build and use an actual browser to inspect graphic-only labels, highscore reload, Game Over/restart, 320px/1280px layout, keyboard/touch, mute, reduced motion, rapid input, and boundary misses. Update README and write `docs/vibe-coding-experience.md` from the four feature development logs and available artifacts. Mark personal recollections and unrecorded prompts as TODO.

**Rationale**: Storage and run semantics are meaningful to test in isolation; layout, visible labels, and browser persistence need browser observation. The university document must avoid invented experience.

**Alternatives considered**: Unit tests alone cannot verify visible text or touch layout. Filling subjective reflections from plausible assumptions would violate the user's evidence requirement.
