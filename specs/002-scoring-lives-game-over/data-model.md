# Data Model: Scoring, Lives, and Game Over

All state is client-side and transient. These are logical shapes for the existing game module, not a persistence schema.

## Fruit position

| Field | Type | Rule |
|-------|------|------|
| `index` | integer 0–3 | Fixed physical position from left to right |
| `fruit` | `apple \| banana \| cherry \| grape` | Repeats are allowed |
| `status` | `pending \| selected \| missed` | Can leave `pending` only once |

The next required choice is the rightmost pending position. Each selection or miss identifies a position, not just a fruit type. Resolved visual slots remain in place until the row is replaced.

## Round

| Field | Type | Rule |
|-------|------|------|
| `positions` | four fruit positions | Freshly generated at each round start |
| `missedCount` | integer 0–4 | Derived from positions or stored consistently |
| `feedback` | text/result category | Describes the most recent accepted event |

A round is complete when no position remains pending. A round is bonus-eligible only if all four positions are `selected` and none is `missed`. A wrong input does not change position state or bonus eligibility. The existing approaching/moving labels may remain presentation state in the page.

## Game

| Field | Type | Rule |
|-------|------|------|
| `status` | `ready \| playing \| game-over` | Game Over is terminal until Play Again |
| `score` | non-negative integer | Starts at 0; +10 per correct position; +25 once for eligible round |
| `lives` | integer 0–3 | Starts at 3; -1 per wrong choice or missed position; never negative |
| `roundNumber` | positive integer | Starts at 1; increments once only when a round finishes with lives remaining |
| `round` | current round | The only active row; replaced on automatic transition or restart |

No history, high score, or saved game is stored. At Game Over, `roundNumber` is the round reached and `score` is the final score.

## State transitions

| Event | Preconditions | Effect |
|-------|---------------|--------|
| Start / Play Again | Ready or Game Over | New game: score 0, lives 3, round 1, fresh positions, playing |
| Correct fruit input | Playing; button matches rightmost pending fruit | Mark that position selected; add 10; show positive feedback |
| Wrong fruit input | Playing; button differs from rightmost pending fruit | Deduct one life; leave positions and score unchanged; show loss feedback |
| Boundary miss | Playing; pending position has reached boundary | Mark that position missed; deduct one life; show loss feedback |
| Reduced-motion interval end | Playing after static view | Apply boundary-miss transition separately to each remaining pending position |
| No pending positions | Playing with lives above zero | Add 25 only for four selected/no misses; increment round; generate fresh positions |
| Final life lost | Playing, life deduction reaches zero | Set Game Over immediately; no round transition, bonus, or further mutation |
| Any fruit/motion event after Game Over | Game Over | No state change |

After any transition, process Game Over before completion. When several positions are beyond the boundary, resolve them one by one and stop on Game Over or a round change. Any old callback carries a round token and cannot act on the new round.

## Invariants

- Four positions exist in every active round; repeated fruit types remain distinct by index.
- A position is resolved at most once and cannot be both selected and missed.
- Score changes only for correct selections and the one eligible round bonus.
- Each wrong input and each missed position costs exactly one life, until zero.
- Lives never fall below zero; score never falls below zero.
- There is no five-second post-exit deadline in Feature 002.
