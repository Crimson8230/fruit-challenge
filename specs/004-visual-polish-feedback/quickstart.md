# Quickstart and Validation: Visual Polish, Animations, and Audio Feedback

Use [the specification](spec.md), [data model](data-model.md), and [UI contract](contracts/ui.md) as the expected behavior. This is a guide for checking the later implementation; only the pre-implementation baseline noted below has been run.

## Setup

From the repository root, with Node.js and npm installed:

```powershell
npm install
npm test
npm run build
npm run dev
```

Open the local address printed by the development server in a desktop and a mobile browser, or use a browser's 320px and 1280px viewport modes. Existing baseline on 2026-10-19, before Feature 004 code: **35 tests passed; build passed**. Repeat both commands after implementation.

## Ready screen and fruit art

1. Confirm the page and header say **Fruit Rush**, Start is prominent, right-to-left instructions are clear, and the mute control is visible. Check focus on Start and mute by Tab, then activate them with Enter/Space.
2. Start a round. Compare Apple, Banana, Grape, and Orange illustrations in the moving row and choice controls over enough rounds to see all four. Each pair must match and the four types must be distinguishable without depending only on color. Check visible names and accessible names.
3. Check rows with three through eight positions, including repeated fruit types. While a complete row is inside the playfield, verify zero fruit overlaps and consistent order/spacing. At least 20 observed rows should satisfy this, including narrow and standard widths.

## Rules and input feedback

1. Choose each displayed fruit from the **rightmost pending** position. For each ordinary correct choice, expect immediate positive button feedback, a brief effect on that exact position, disappearance without slot shift, and exactly +10 points. The score display reacts to the increase.
2. Choose a wrong fruit. Expect immediate negative feedback distinct from correct feedback, the expected position still pending, score unchanged, and exactly one lost life with brief life feedback.
3. Complete a clean three-fruit first round. Expect **55 points** total (three selections at +10 and one +25 clean bonus), a brief success highlight, and round 2 beginning automatically with three fruits at 100% speed. A wrong choice followed by all correct choices remains bonus-eligible; a missed position removes bonus eligibility.
4. Let a pending fruit pass the right edge. Expect one life loss for that position, one life effect, and no duplicate resolution. Check multiple pending misses until the next round or Game Over.
5. Make 30 correct/wrong inputs and check visible feedback starts within 100 ms and every state value follows the existing rules. Make 20 rapid-input trials, including repeated fruit identities, input while a fruit is disappearing, final-fruit choices, and clicks near a miss boundary. Confirm zero duplicate points/life losses, no disabled controls during effects, and no delayed transition.
6. Check rounds at each Feature 003 difficulty tier (1, 3, 5, 7, 9, 11, 13, 15). Fruit counts must be **3, 4, 5, 6, 7, 8, 8, 8** and speeds **100%, 115%, 130%, 145%, 160%, 175%, 190%, 200%**. Check movement timing against the pre-feature behavior; decoration must not change speed.

## Audio and mute

1. With sound permitted, trigger an ordinary correct choice, wrong choice, clean round completion, boundary life loss, and Game Over. Each event type has a fitting brief cue; repeat five times per type. Simultaneous outcomes use one coordinated cue rather than a noisy stack.
2. Mute during a cue. The cue stops, the visible control changes state, and none of 25 subsequent checked gameplay events makes audible sound. Unmute; only future events play. Confirm the control is available in ready, playing, and Game Over states.
3. Repeat where browser audio is blocked or unavailable. No error or delay may affect input, movement, feedback text, score, lives, Game Over, or restart. A previously blocked cue must not play later.

## Layout, accessibility, motion, and restart

1. At **320px** and **1280px** widths, inspect ready, active, and Game Over states. Confirm no horizontal page scrolling, readable score/lives/round/difficulty, all controls reachable, and every fruit button at least **44 by 44 pixels**. Inspect long rows while fully visible; captions must not cover fruits or controls.
2. Check normal text at **4.5:1** contrast and large text/essential control boundaries at **3:1**. Use keyboard-only navigation and activation. Confirm visible focus and text outcome messages; mute the game and verify a player can still tell what happened.
3. Enable reduced motion in the browser. Decorative effects should be removed or simplified. The existing full-sequence static viewing interval remains at least three seconds; input and miss rules still work.
4. Lose the final life. Confirm immediate movement/input stop, final score and round reached, prominent Play Again, and focus on it. Repeat Game Over/restart 10 times. Each restart begins at score **0**, **3 lives**, round **1**, **3 fruits**, **100%** speed, with no stale effect or sound changing the new game.
5. Ask five players to identify the next fruit, remaining lives, and last-choice correctness without sound or explanation at both desktop and mobile widths. Record the count; at least four should succeed. If participants are unavailable, record this criterion as pending rather than passed.

## Development evidence

Record meaningful prompts, successful and unsuccessful generated attempts, corrections, test/build results, browser observations, and lessons learned in a Feature 004 development log. Update the concise README with the final gameplay instructions and Vibe Coding summary. Report any browser or player-observation checks that could not be completed.
