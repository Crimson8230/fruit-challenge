# Player Interaction Contract: Progressive Difficulty

This is the visible contract for the existing one-page game. It adds no network interface.

## Ready and start

- Show short right-to-left input instructions, the playfield, Start, and four labeled choices: Apple, Banana, Grape, and Orange. Cherry is no longer a choice.
- Starting a new game shows score **0**, lives **3**, round **1**, progress **0/3**, and speed **100%**. The new three-fruit row begins moving at the existing base pace, and all fruit buttons are usable immediately.
- Numeric score, lives, round, progress, and current speed/difficulty appear together in the status area without an extra menu.

## Active round

- Show the complete current sequence in its physical left-to-right order with separate visible positions, including repeated fruit types. The player selects the **rightmost pending** fruit first.
- A correct selection resolves one position, adds **10 points**, updates progress using the current sequence length, and gives positive text feedback. A wrong selection leaves that position pending, deducts **one life**, and gives immediate text loss feedback.
- All positions move together at the speed shown for that round. They keep their spacing and do not accelerate before the next round. A pending position reaching the right boundary is missed once and costs one life; multiple passed pending positions resolve separately.
- Completing every position without a miss adds **25 bonus points once**. A wrong button press alone does not remove the bonus. When no pending positions remain and lives remain, the next round begins automatically with the existing score and lives.
- The visible speed changes only as a new round starts. The progression is 100% for rounds 1–2, 115% for 3–4, 130% for 5–6, 145% for 7–8, 160% for 9–10, 175% for 11–12, 190% for 13–14, and 200% from round 15 onward; fruit count follows [the specification](../spec.md#functional-requirements).

## Layout and input

- Rows of three through eight positions remain ordered, individually distinguishable, and consistently spaced at both 320-pixel and 1280-pixel viewports. While the full row is inside the playfield, no fruit overlaps its neighbor or is incorrectly clipped.
- Fruit buttons retain readable text labels and normal pointer and keyboard activation. Resolved row positions remain in place and cannot be selected or missed again.
- Progress and feedback use text as well as visual styling. The longer row does not cover the score, lives, round, speed, or controls.

## Game Over and Play Again

- The final life loss immediately stops movement and fruit input and shows Game Over with final score, round reached, and Play Again. No delayed event changes the result.
- Play Again starts at score **0**, lives **3**, round **1**, progress **0/3**, and speed **100%**, with a fresh row and no activity retained from the previous game.

## Reduced movement

- Show the full current row statically for at least three seconds while allowing input. The status still shows the round's speed percentage.
- At the interval's end, resolve each pending position once as missed, stopping at Game Over or moving to the next round with lives remaining.

## Requirement coverage

- Difficulty, generation, and movement: FR-001–FR-003, FR-008–FR-009
- Selection, scoring, misses, and transitions: FR-004–FR-007
- Layout, status, and controls: FR-010–FR-012, FR-016
- Game Over, restart, and reduced movement: FR-013–FR-015
