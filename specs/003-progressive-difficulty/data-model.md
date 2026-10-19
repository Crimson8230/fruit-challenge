# Data Model: Progressive Difficulty

All state remains in memory. The table below describes rules and relationships, not storage.

## Difficulty for a round

| Field | Type | Rule |
|-------|------|------|
| `roundNumber` | positive integer | Source of difficulty; starts at 1 and increments once per completed round with lives remaining |
| `fruitCount` | integer 3–8 | `min(3 + floor((roundNumber - 1) / 2), 8)` |
| `speedPercent` | integer 100–200 | `min(100 + 15 * floor((roundNumber - 1) / 2), 200)` |

Difficulty is derived afresh from `roundNumber`, not incremented as stored mutable speed. The current row uses one fixed snapshot of the derived percentage when its animation begins. Rounds 1/2, 3/4, 5/6, 7/8, 9/10, 11/12, 13/14, and 15+ map respectively to 3/100%, 4/115%, 5/130%, 6/145%, 7/160%, 8/175%, 8/190%, and 8/200%.

## Fruit position

| Field | Type | Rule |
|-------|------|------|
| `index` | integer 0 through `fruitCount - 1` | Fixed left-to-right physical position in the current row |
| `fruit` | apple, banana, grape, or orange | Repeats allowed |
| `status` | `pending \| selected \| missed` | Starts pending; may resolve exactly once |

The next required choice is the **rightmost pending** position. A selected or missed slot retains its index and visual place until the row is replaced. A position cannot score or deduct a life twice.

## Round

| Field | Type | Rule |
|-------|------|------|
| `positions` | ordered fruit positions | Length equals the current round's `fruitCount`; generated fresh at start |
| `missedCount` | derived integer 0 through `fruitCount` | Number of positions with `missed` status |
| `selectedCount` | derived integer 0 through `fruitCount` | Number of positions with `selected` status |

The round is complete when no position is pending. It earns the 25-point bonus only when all its positions were selected and none was missed. A wrong button press does not change positions or bonus eligibility. The current row is replaced when the next round begins.

## Game

| Field | Type | Rule |
|-------|------|------|
| `status` | `ready \| playing \| game-over` | Game Over remains terminal until Play Again |
| `score` | non-negative integer | +10 per correct position; +25 once per clean round |
| `lives` | integer 0–3 | Starts at 3; -1 for a wrong input or pending position missed; stops at 0 |
| `roundNumber` | positive integer | Determines current difficulty; remains the round reached at Game Over |
| `round` | current round or absent while ready | Only one active row |
| `feedback` | latest accepted result or empty | Used for text and visual feedback |

Progress is `selectedCount / fruitCount`, not a fixed denominator. Score, lives, and round number carry into the next round; no history or high score is stored.

## State transitions

| Event | Preconditions | Effect |
|-------|---------------|--------|
| Start / Play Again | Ready or Game Over | Set score 0, lives 3, round 1; derive 3/100%; generate three fresh pending positions |
| Correct input | Playing; matches rightmost pending fruit | Mark that position selected; add 10; give positive feedback |
| Wrong input | Playing; differs from rightmost pending fruit | Leave positions and score unchanged; deduct one life; give loss feedback |
| Boundary miss | Playing; a pending position has reached the right boundary | Mark that indexed position missed; deduct one life; give loss feedback |
| Reduced-motion interval end | Playing after at least three seconds of static viewing | Apply one miss transition per still-pending position, stopping on Game Over or a round change |
| No pending positions | Playing with lives above zero | Add 25 once if all selected; increment round; derive next difficulty and generate a new sequence; carry score/lives |
| Final life lost | Playing; deduction reaches zero | Stop at Game Over before any next-round transition |
| Later input/motion event | Game Over or obsolete round token | No state change |

## Invariants

- Active round position count equals the difficulty count for its round number.
- Speed percentage is fixed during a row crossing, recomputed only for a new round, and never exceeds 200%.
- All row slots retain order and spacing as their status changes.
- Boundary reconciliation and input both identify positions by index, including repeated fruit types.
- A completed or terminal round cannot receive a second bonus, extra life deduction, or stale callback.
