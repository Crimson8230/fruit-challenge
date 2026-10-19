# Quickstart Validation: Feature 006

Use the [specification](spec.md) for requirements and the [UI contract](contracts/ui.md) for expected screen behavior. These are validation steps for the future implementation.

## Setup

From the repository root, use a current Node.js installation:

```text
npm ci
npm test
npm run build
npm run dev
```

Open the local address printed by Vite. The pre-plan baseline is 57 passing tests and a successful build.

## Named results and ranking

1. Clear the site's saved data and reload. Verify that the Start screen shows an empty Top 10 and the existing personal best display.
2. Start a game, play until Game Over, submit a blank name, and verify an inline error. Enter a valid name and save the score. Confirm one ranked entry appears immediately.
3. Activate **Save score** repeatedly. Confirm no duplicate. Use **Play Again**, finish another run, and confirm a second independent entry may be saved.
4. Submit at least twelve runs with distinct scores. Confirm only ten highest entries are shown, in descending order, on Start and Game Over after reload. Check equal-score entries retain their earlier order.
5. Skip name entry on a completed run and replay. Confirm no new named entry and no loss of the numeric personal best.
6. With an existing Feature 005 numeric best and no ranking snapshot, reload. Confirm a `Legacy record` entry and the same personal best. Reload again and confirm no duplicate legacy entry.
7. Deny or corrupt browser storage in developer tools. Confirm play, Game Over, entry submission, and replay still work in the current page without uncaught errors.

## Music and icon

1. On Start, verify an icon-only speaker button at the upper-right with no visible `Sound on/off` text. Check its accessible name and keyboard focus.
2. Start with sound enabled. Verify a quiet original retro loop begins after the gesture and gameplay cues remain distinguishable.
3. Mute while playing. Confirm music and cues stop immediately and the icon shows muted. Unmute; confirm one loop resumes. Repeat quickly without overlapping music.
4. Reach Game Over. Confirm music stops and the existing Game Over cue follows the mute state. Restart repeatedly and confirm one loop, no stale animation or timer, and normal input.
5. Block audio or use a browser without it. Confirm the complete game remains playable.

## Layout and regression

Check a desktop viewport and a 360px-wide mobile viewport. The icon must remain visible in the upper-right, and the ten-row ranking and name form must have no horizontal overflow. Complete several rounds and verify rightmost-first input, +10 per correct fruit, +25 clean-round bonus, exactly one life lost per mistake or miss, established speed tiers, Game Over, and replay. Confirm the existing four fruit graphics still have no visible fruit-name labels.
