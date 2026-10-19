# Research: Named Highscores, Background Music, and Sound Icon

These choices use the existing Fruit Rush implementation and the Feature 006 requirements. The pre-plan baseline passed 57 Vitest tests and the production build on 2026-10-19.

## Versioned ranking and legacy best

**Decision**: Keep `fruit-rush.highscore.v1` as the continuously updated numeric personal best. Add a separate versioned ranking snapshot containing no more than ten entries and a monotonically increasing submission order. When the ranking snapshot is absent, seed it once from a valid positive v1 best as an unnamed `Legacy record`. Never re-import v1 when a valid ranking snapshot already exists.

**Rationale**: Feature 005's personal best rises during play, while a named ranking entry is submitted only after Game Over. Separate values preserve both behaviors. One-time migration keeps a previous best visible without inventing a player name. Re-importing on every reload could create unnamed duplicates from a new run whose name was skipped.

**Alternatives considered**: Replacing v1 with the ranking alone would lose the best from runs where name entry is skipped. Importing v1 on every load would create phantom entries. A server-backed leaderboard would expand scope and local setup.

## Entry validation, ranking order, and failure handling

**Decision**: Trim names, require 1–16 visible characters, and render them only as text. Validate saved entries and scores before use; sort by score descending and submission order ascending, then retain ten. Mark a Game Over run as submitted before performing persistence so repeated activation cannot create duplicates. Keep the resulting list in memory even when a storage write fails. If saved ranking data is corrupt, salvage valid entries where possible, otherwise fall back to the valid prior best or an empty list.

**Rationale**: A stable tie order is explainable to players and makes the tenth-place boundary deterministic. The one-submit flag belongs to the finished run rather than the score because different runs can legitimately have the same score. Storage errors must remain outside gameplay transitions.

**Alternatives considered**: Rejecting all data when one entry is bad would discard recoverable records. Persisting every run, including below-cutoff results, would violate the ten-result scope. Sorting tied scores by name would reorder earlier results unexpectedly.

## Original retro music

**Decision**: Extend `SoundController` with a quiet, original loop of simple short notes synthesized using its existing Web Audio context. Use a single bounded scheduler and tracked music voices, separate from the limited sound-effect voices. Start only after a user gesture and successful context resume; stop the scheduler and music voices on mute, Game Over, restart cleanup, or page hide. Unmuting during play resumes at most one loop.

**Rationale**: The existing controller already handles optional audio, effects, mute, and disposal. A small synthesized tune needs no audio asset, runtime library, MIDI parser, or external recording and avoids a gap at a file loop point. Music gain stays below cues so feedback remains clear.

**Alternatives considered**: A `.mid` file would require playback support or a parser and soundfont. A recorded loop adds an asset and potentially a noticeable seam. A timer per note risks accumulating overlapping work. Copying a recognizable game melody is outside the request for a similar style.

## Upper-right sound icon

**Decision**: Place a minimum 44 × 44 pixel icon-only button in the header's upper-right corner. Use a local inline speaker illustration with waves for enabled and a slash for muted, no visible `Sound on/off` text or title tooltip. Update its accessible name to `Mute sound` or `Unmute sound`, retain its pressed state, and keep the existing visible focus outline. Reserve enough header space at mobile width so it cannot overlap the title.

**Rationale**: The requested sound state remains recognizable without text; the accessible name tells keyboard and screen-reader users what activating the control will do. One existing button and delegated listener suffice.

**Alternatives considered**: Emoji rendering varies by platform. A CSS-only drawing is harder to maintain and recognize. Hiding the control in a menu would make mute slower to reach.

## Ranking layout

**Decision**: Place ranking panels outside the fixed-height playfield, showing one on the ready screen and one at Game Over. Keep the final score and name form adjacent to Game Over results. On narrow screens, allow vertical page growth while preventing horizontal overflow; the sound icon remains anchored at the top-right of the game header.

**Rationale**: Ten ranking rows cannot fit reliably inside the existing 12–14rem playfield overlay. Keeping them out of the movement area preserves fruit visibility and animation speed.

**Alternatives considered**: Scrolling inside the Game Over overlay hides results and complicates keyboard use. Expanding the playfield enough for all rows would distort active gameplay layout.
