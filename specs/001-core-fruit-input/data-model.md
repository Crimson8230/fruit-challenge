# Data Model: Core Game and Fruit Input

No data is stored beyond the current page session.

## Fruit

One of `apple`, `banana`, `cherry`, or `grape`. Each type has a recognizable visual label
and one matching input button. No other fruit is valid in this feature.

## Sequence

| Field | Meaning | Rule |
|-------|---------|------|
| Items | Ordered fruits to remember | Exactly four items |
| Display position | Placement in the moving row | Leftmost through rightmost |
| Selection position | Next position to enter | Rightmost through leftmost |

Each item is selected from the four fruit types. Repeats are valid and remain distinct
positions. The row moves left to right, but the player enters its positions in reverse order.
A new sequence is generated whenever a round starts or replays.

## Round

| Field | Meaning | Rule |
|-------|---------|------|
| Sequence | Fruits for this round | Exactly four ordered items |
| Phase | Current player-facing state | `ready`, `approaching`, `moving`, `passed`, `success`, or `failure` |
| Correct count | Number of accepted correct selections | 0-4; equals score and progress |
| Feedback | Most recent result | Empty, correct, incorrect, or time expired |
| Deadline | End of the post-exit response window | Empty until the entire row exits; then exit time plus five seconds |

The next required fruit is the sequence item at `3 - correct count` throughout the active
`approaching`, `moving`, and `passed` phases. `Approaching` means part of the row is still
outside the left edge, but input is already open. `Moving` begins when all four fruits are
fully visible and continues while the row travels across or exits the playfield. `Passed`
begins once the trailing fruit has fully left the right edge and lasts at most five seconds.
The visible remaining seconds are derived from the deadline and current elapsed time; they
are not a separately decremented score or counter.

## State Transitions

| Current phase | Event | Next phase | State change |
|---------------|-------|------------|--------------|
| Ready | Start | Approaching | Generate sequence; clear count, feedback, and deadline; enable input immediately |
| Approaching | Full row becomes visible | Moving | Update phase text; keep input open |
| Moving | Trailing fruit fully leaves playfield | Passed | Set deadline to exit time plus five seconds; show overlay at 5 |
| Approaching, moving, or passed before deadline | Correct selection, positions 1-3 | Same phase | Increment correct count; show correct feedback |
| Approaching, moving, or passed before deadline | Fourth correct selection | Success | Set score to four; show result; stop movement and countdown |
| Approaching, moving, or passed before deadline | Wrong selection | Failure | Keep score; show wrong feedback and result; stop movement and countdown |
| Passed | Deadline reached with sequence incomplete | Failure | Keep score; show time-expired result; close overlay |
| Success or failure | Replay | Approaching | Generate new sequence; clear count, feedback, and deadline; enable input immediately |

Fruit selections in `ready`, `success`, or `failure` make no state change. At or after the
deadline, an incomplete `passed` round expires before a fruit can be evaluated. Accepted
selections are processed in order received, including rapid repeated selections. Under reduced
motion, the row is static and fully visible; after three seconds, an unfinished round enters
`passed` and receives the same five-second deadline.

## Validation Rules

- Generated sequences contain exactly four valid fruits in their left-to-right display order;
  input validation consumes positions from rightmost to leftmost, including repeats.
- Input opens when a round starts, even if no fruit is fully visible yet. Input stays open
  during the five-second post-exit window and closes on success, failure, or expiry.
- Movement finishing starts the response window; it does not by itself cause failure.
- The deadline is based on elapsed time, not on the number of countdown callbacks. A choice
  received before the deadline can complete the round; a choice at or after it cannot.
- An uninterrupted crossing uses one horizontal speed through entrance, full visibility, and
  exit. Movement speed is presentation data, not part of the score or round rules.
- Score cannot fall below zero or exceed four, and a wrong selection does not raise it.
- Terminal phases do not accept fruit selections or stale movement or timer completion events.
- Replay discards the previous round's progress, feedback, and deadline.
