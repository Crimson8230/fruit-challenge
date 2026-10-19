# Data Model: Visual Polish, Animations, and Audio Feedback

Feature 004 adds presentation state only. The existing `Game`, `Round`, `FruitPosition`, `Fruit`, and `RoundDifficulty` types in `src/game.ts` remain authoritative. No score, life, sequence, movement, or difficulty field changes are planned.

## Existing game snapshot

| Field | Meaning | Presentation use |
|-------|---------|------------------|
| `status` | `ready`, `playing`, or `game-over` | Select ready, active, or final-result screen |
| `score` | Accumulated points | Score tile and final score |
| `lives` | Remaining lives | Life tile and loss effect |
| `roundNumber` | Current or last reached round | Round tile, final round, and difficulty lookup |
| `round.positions` | Indexed fruit identities with pending/selected/missed status | Moving row, rightmost pending target, and removal effect |
| `feedback` | Existing short result code | Visible message; secondary hint for event classification |

The four `Fruit` values are apple, banana, grape, and orange. Each maps to one local illustration, one visible name, and one accessible name. The same mapping is used for the moving row and input controls. Position index, not fruit identity, identifies a resolved item, so repeated fruits remain separate.

## Presentation event

A transient event is computed synchronously from the previous and next game snapshots for each accepted choice or boundary miss:

| Event | Detection | Visual result | Audio cue |
|-------|-----------|---------------|-----------|
| Ordinary correct choice | One position changes pending to selected, score rises by 10, same round continues | Chosen control positive; that indexed fruit reacts and disappears; score reacts | Correct |
| Clean round completion | Correct choice resolves final pending position, next round starts, clean bonus applies | Positive control/score plus success highlight; final fruit echo survives row replacement | Round complete |
| Incorrect choice | Lives fall by one after choice, pending target unchanged, game continues | Chosen control negative; life reacts; expected fruit stays | Incorrect/life loss |
| Missed fruit | Indexed position resolves as missed, lives fall by one, game continues | Life reacts; resolved slot is distinct from selected slot | Life loss |
| Game Over | Next status is `game-over` | Final score/round screen, stopped motion, clear prior temporary effects | Game Over |

This table specifies one prioritized cue per transition, so a clean final choice does not play a second correct tone and a terminal mistake does not layer error/life/Game Over tones. The wrong-choice cue must convey both error and life loss. A miss that also ends a non-clean round remains a life-loss event. If multiple boundary misses are reconciled in one frame, each underlying life change is handled once until a round transition or Game Over.

The event is presentation output, not an input to game rules. An unchanged `Game` produces no presentation event. Input handling uses the existing rules first and immediately accepts the resulting game before decorative work; no animation or audio promise gates acceptance.

## Temporary visual state

| Field or key | Allowed value | Lifetime |
|--------------|---------------|----------|
| Feedback kind | Correct, incorrect, life loss, clean round, Game Over | One short effect; replaced or cleared on next applicable event |
| Affected fruit | Round token and position index | Only for the selected/missed position from the previous round |
| Affected control | Fruit identity and activation instance | One short button effect; renewed on rapid activation |
| Effect generation | Increasing token or equivalent cancellation handle | Invalidates stale completion callbacks on round change/restart |

Temporary effects must not change row width or the number/order of slots. A final-fruit echo or success effect may live in an independent overlay after the old row is replaced; it must not accept input or cover controls. Reduced motion suppresses decorative motion and keeps static state cues/text.

## Audio preference and controller

| Field | Allowed value | Rule |
|-------|---------------|------|
| Muted | Boolean, current page session only | Visible toggle and accessible pressed state; mute silences active and future cues |
| Audio availability | Not created, ready, suspended/blocked, or unavailable | Gameplay never waits for a state change; no missed cue is queued |
| Active voices | Small bounded set | Stop/disconnect on completion or mute; clear stale voices on restart and page exit |

Audio state never enters `Game`. A user gesture may initialize or resume audio. A failed or unavailable audio operation leaves the visual event and game transition intact.

## Lifecycle invariants

1. `src/game.ts` remains the only authority for score, lives, position status, round, difficulty, and terminal state.
2. A resolved position is identified by round token plus index, even if another position has the same fruit identity.
3. Movement uses the existing round speed and linear row animation; decorative effects do not alter the moving row's transform, size, or timing.
4. Rapid input remains enabled. Repeated effects may replace each other, but each accepted input has exactly the rule effect returned by `chooseFruit` or `missFruit`.
5. Game Over and restart invalidate old movement, timers, visual effects, and pending audio so no previous-game activity affects the new game.
6. Muting affects every gameplay cue, including concurrent transitions, without affecting visual information or rules.
