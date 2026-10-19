# Data Model: Local Highscore and Final Screens

Feature 005 adds record and presentation state. The existing `Game`, `Round`, `FruitPosition`, and difficulty types in `src/game.ts` remain authoritative for gameplay and are not extended.

## Highscore

| Field | Type | Rule |
|-------|------|------|
| `best` | nonnegative safe integer | Greatest accepted `Game.score` observed in this browser profile or current page; initial 0 if no valid saved value |
| storage key | fixed versioned string | One value, for example `fruit-rush.highscore.v1`; no account, history, or leaderboard |
| persisted value | canonical decimal string | Accept `0` or a positive integer without signs, leading zeros, spaces, fractions, exponent notation, or overflow |
| availability | working or unavailable | Storage access/read/write may fail; failures do not change gameplay and the in-memory `best` remains available |

The in-memory best changes only to `max(best, acceptedGame.score)`. A lower score or restart cannot reduce it. Persistence is attempted immediately after an increase. A failed write does not roll back the in-memory value.

## Run record state

| Field | Type | Rule |
|-------|------|------|
| `startingBest` | nonnegative safe integer | Copy of current best when Start or Play Again begins a run |
| `newRecord` | derived Boolean | On Game Over, `Game.score > startingBest`; a tie is false |

The run baseline belongs to presentation, not `Game`. It is refreshed on each new run. The highscore may rise several times during a run while `newRecord` remains one run-level result.

## Existing Game snapshot

| Field | Relationship to Feature 005 |
|-------|-----------------------------|
| `score` | Only input used to raise the highscore; established +10 and +25 rules remain |
| `roundNumber` | Final round reached remains the Game Over value |
| `status` | Selects ready, playing, or Game Over display; fruit choices disabled on Game Over |
| `round.positions` | Indexed order and rightmost pending selection remain unchanged |
| `lives`, `feedback` | Continue to drive existing status and visual/audio effects |

## Fruit presentation

| Field | Rule |
|-------|------|
| fruit identity | Existing apple, banana, grape, or orange value |
| illustration | Existing local SVG path, shared by moving fruit and choice button |
| accessible name | Fruit name exposed through explicit accessible metadata |
| visible name | None on moving fruits, buttons, or tooltips |

The removal of text does not change position indices, slot width, row movement, or input validation. Repeated fruit identities stay distinct indexed positions.

## State transitions

1. **Page load**: Read and validate stored score if possible; initialize `best` to valid saved value or 0. Create the existing ready `Game`.
2. **Start / Play Again**: Copy `best` to `startingBest`; create a fresh existing game. Leave `best` untouched.
3. **Accepted score increase**: Accept the new `Game` immediately, raise `best` if `Game.score > best`, attempt persistence, and render current state. No score increase means no write.
4. **Game Over**: Stop existing movement and inputs; render final score, `best`, round reached, and `newRecord` derived from final score versus `startingBest`.
5. **Reload**: A new page begins ready and restores the persisted best if valid. An unavailable store means only the current page's in-memory best survives.

## Invariants

- `Game` remains the sole source of score, lives, fruit order, difficulty, and terminal state.
- Highscore failures never delay, throw into, or roll back gameplay.
- A Game Over badge reflects beating the run's starting best, not merely equality with the already-updated current best.
- Existing movement, transition feedback, sound, timers, and delegated input handling remain independent of record storage.
