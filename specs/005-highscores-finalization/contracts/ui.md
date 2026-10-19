# Player-Facing UI Contract: Final Fruit Rush

This contract describes visible and accessible behavior. [The specification](../spec.md) controls scope and [the data model](../data-model.md) defines record state. No network interface is added.

## Ready screen

- The title is **Fruit Rush**. Short text explains that the player selects the moving fruits from right to left before they reach the right boundary, and that wrong choices or misses cost a life.
- The current highscore is displayed; it is 0 if no valid saved record exists.
- **Start Game** is prominent and usable by pointer, touch, Enter, and Space. The existing sound toggle is available. Fruit choices are unavailable before play.
- Four choice controls show only the existing fruit illustrations. No fruit-name text or fruit-name tooltip is visible; each control has its own accessible fruit name.

## Active play

- The moving row contains three to eight illustrations in the existing order and at the established speed. Every fruit position has an accessible name, but no visible fruit-name text.
- The same illustration identifies a fruit in the row and on its control. Existing fixed slot geometry, removal effects, and rightmost-pending validation remain.
- Score, lives, round, selected progress, and speed show the current `Game` values. Correct choices earn 10; clean rounds add 25; wrong choices and missed positions each cost one life.
- Positive/negative visual cues, brief audio cues when allowed, mute, keyboard focus, touch targets, and reduced-motion behavior remain as in Feature 004.
- When a score first passes the personal best, the stored highscore rises immediately. Gameplay continues without waiting for storage.

## Game Over and replay

- The final lost life stops movement and fruit choices immediately. The overlay shows final score, highest score, round reached, and a prominent **Play Again** button.
- A visible and accessible **New highscore!** indication appears only if final score exceeds the best score captured at the start of that run. A tie does not qualify.
- Focus moves to Play Again. Restart resets score to 0, lives to 3, round to 1, three fruits at 100% speed, and clears stale effects; the highscore and mute choice remain.
- No old listener, timer, row animation, or sound can alter the next run.

## Storage fallback and responsive behavior

- Missing, invalid, or inaccessible saved data is treated as no valid record. A failure to save does not interrupt Start, choices, Game Over, or replay; the current page keeps the highest score it has seen.
- At 320px and 1280px viewport widths, ready, active, Game Over, and replay show no horizontal page scrolling. All four fruit controls remain at least 44 by 44 pixels and the distinct SVGs remain identifiable.
- Screen-reader names, status text, visible focus, and visual outcome messages continue to support play without sound or visible fruit-name labels.
