# Data Model: Named Top Ten and Background Music

The existing `Game` and `Round` in `src/game.ts` remain the only sources for score, lives, round, fruit order, and active status. Feature 006 adds presentation and persistence state around a completed run.

## Completed run

| Field | Type | Rule |
|-------|------|------|
| `score` | nonnegative safe integer | Snapshot of `Game.score` at Game Over |
| `roundReached` | positive integer | Snapshot of `Game.roundNumber`; shown in final results, not used to rank |
| `submitted` | Boolean | Initially false at Game Over; true after one valid name submission, even if score falls below tenth place |

An invalid name does not set `submitted`. Starting or restarting creates a new run and resets this flag. A skipped name leaves it false and changes no ranking entry.

## Highscore entry

| Field | Type | Rule |
|-------|------|------|
| `name` | string or null | Player-provided trimmed 1–16 visible characters; null only for the imported legacy best |
| `score` | nonnegative safe integer | Completed run's final score, or valid legacy best |
| `order` | nonnegative safe integer | Unique increasing submission order for stable ties |

The displayed name for a null value is `Legacy record`. Player-provided names are inserted as text, not markup. A result ranks before another if its score is greater, or if scores tie and its order is smaller. A candidate tied with the current tenth entry therefore cannot displace an older entry.

## Ranking snapshot

| Field | Type | Rule |
|-------|------|------|
| `version` | fixed version | Identifies the ranking format |
| `entries` | array of Highscore entries | Validated, sorted, at most ten |
| `nextOrder` | positive safe integer | Larger than every retained entry's order |

The ranking uses a new browser-local storage key. On first load with no valid ranking snapshot, a valid positive `fruit-rush.highscore.v1` value seeds one legacy entry. Once a valid ranking snapshot exists, v1 is never imported again. A malformed snapshot is recovered from valid entries where possible or replaced by the legacy best/empty list. Storage denial leaves the in-memory snapshot usable until page close.

The existing numeric best continues to rise during play. It is displayed independently of whether the run is submitted, and is never reduced by ranking truncation. It can therefore be higher than the first named entry if a player skips name entry.

## Sound state

| Field | Type | Rule |
|-------|------|------|
| `muted` | Boolean | Shared by music and sound effects; retained for the current page as before |
| `musicActive` | Boolean | True only during an active game when sound is enabled and playback is available |
| `musicGeneration` | nonnegative integer | Invalidates stale scheduling or resume work after mute, Game Over, restart, or disposal |

At most one music scheduler is active. It schedules bounded short notes through the existing optional audio context. The icon reflects `muted`, not the browser's ability to play audio; denied playback never stops the game.

## State transitions

1. **Load**: Read numeric best and ranking. Migrate the old best once if needed. Show ready screen with empty or populated ranking and the top-right sound icon.
2. **Start / replay**: Start the existing game, clear the completed-run submission state, unlock audio from the gesture, and begin a single quiet music loop if permitted.
3. **Score change**: Preserve Feature 005's immediate numeric best update; ranking remains unchanged while playing.
4. **Game Over**: Stop movement and background music, retain any permitted terminal sound effect, snapshot final score and round, and show name form plus ranking.
5. **Valid name submit**: Mark run submitted, insert candidate, sort, trim to ten, attempt persistence, and update both ranking views. A non-qualifying submission reports that the top ten did not change.
6. **Mute / unmute**: Update icon and accessible name immediately; stop or resume one loop during active play. Keep gameplay independent of audio success.
7. **Page hide**: Stop scheduler and voices, close audio context, and leave saved ranking intact.

## Invariants

- No ranking action changes `Game` scoring, life loss, difficulty, fruit input, or movement.
- One completed run contributes at most one entry; separate runs with equal scores can each appear.
- The ranking never displays more than ten entries and is always descending by score with stable ties.
- Music has at most one active scheduler and is inaudible whenever the sound control is muted.
- Stored malformed names or scores never render as active page content or break gameplay.
