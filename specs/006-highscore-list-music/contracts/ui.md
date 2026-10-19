# Player-Facing UI Contract: Feature 006

This is the browser UI contract for [Feature 006](../spec.md). There is no network API. The [data model](../data-model.md) defines ranking and sound state.

## Sound control on every screen

- A speaker icon button appears in the game's upper-right header corner on ready, playing, and Game Over screens. Waves indicate sound enabled; a slash indicates muted. The button shows no visible `Sound on/off` label and no fruit-name tooltip.
- It is at least 44 × 44 pixels, supports pointer, touch, Enter, and Space, and has a visible focus outline. Its accessible action name is `Mute sound` when enabled and `Unmute sound` when muted; its pressed state reflects muted status.
- The same setting controls background music and all existing sound effects. Muting silences both immediately. When unmuted during active play, only one loop resumes; on ready or Game Over no background loop plays.

## Ready screen

- Existing title, instructions, personal best, and **Start Game** remain. A section labeled **Top 10 highscores** lists rank, name, and score, best first. With no entries it says that no scores have been saved yet.
- A migrated numeric best is listed as **Legacy record**, without implying that a player provided a name.
- Starting the game does not erase the list or personal best. During play the ranking is hidden so the fruit sequence remains the focus.

## Active play

- Existing fruit graphics, rightmost-first selection, status values, animations, cues, and difficulty are unchanged.
- Quiet retro music starts after the Start or replay interaction when browser playback is permitted. Gameplay cues remain audible above the music. Input is never blocked while audio unlocks or schedules.
- The sound icon remains reachable and visible at the top-right, including on a 360px viewport.

## Game Over and submission

- Movement, fruit input, and music stop. Final score, personal best, round reached, new-record indication, and **Play Again** remain.
- A labeled name field and **Save score** action are shown for the completed run. A trimmed 1–16-character name is accepted. Blank or overlong names receive a clear inline error; the player can retry. Names display as plain text.
- A valid submission is accepted once. If it enters the top ten, both ranking views update immediately. If it does not, a message explains that the ranking is unchanged. Repeated submission cannot duplicate the result.
- **Play Again** remains available without a name. Replay clears the form and submission message while preserving the ranking, personal best, and mute choice.
- The Game Over ranking lists at most ten entries, ordered as on ready. It sits outside the fixed-height playfield and may extend the page vertically. Keyboard focus moves to the name field when Game Over appears; the replay button remains in the normal focus order.

## Failure, accessibility, and responsive behavior

- If storage is denied or corrupt, gameplay continues. Valid in-memory ranking and personal best remain visible for the current page. A reload may lose page-only results when saving was denied.
- If audio is denied or missing, every screen, sound icon, input, and restart remains usable; no sound is required to understand outcomes.
- On desktop and at a 360px mobile width, ranking columns, name form, sound icon, and fruit buttons remain readable without horizontal page scrolling. Visible fruit labels remain absent; fruit ARIA names remain.
