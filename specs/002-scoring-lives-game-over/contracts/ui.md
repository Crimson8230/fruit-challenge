# Player Interaction Contract

This is the visible interface for the one-page game. There is no network API.

## Ready and start

- Show the playfield, four labeled fruit buttons, a **Start** button, and short right-to-left instructions.
- Activating **Start** begins round 1 with score **0** and **3 lives**. The four-fruit row enters from the left at Feature 001's constant speed. All fruit buttons become usable immediately.
- Show score, lives, current round, and position progress in readable text. Hearts may supplement the numeric life count.

## Playing

- The four fruit positions move together toward the right. The player enters fruit types from the rightmost pending position toward the left, including before the row is fully visible. Repeated types require separate presses.
- Each correct press immediately shows positive feedback, marks one position resolved, and adds **10** to the visible score.
- Each wrong press immediately shows life-loss feedback, deducts **one** life, adds no points, and leaves the required position pending. If lives remain, buttons stay active.
- When the leftmost pending position reaches the right edge, it becomes missed and costs **one** life. Any other pending position already beyond the edge is resolved separately. Each missed position can be charged only once. The former five-second popup does not appear.
- A round with four selected positions and no misses adds **25 bonus points** once, for **65 total** from that round. Wrong presses alone do not remove bonus eligibility.
- When no positions remain pending and lives remain, the next round starts automatically. Score and lives carry forward; the displayed round number increases by one. A round with a miss gets no completion bonus.
- Status changes use text as well as color or heart icons, and do not make the controls less responsive.

## Game Over

- Losing the final life immediately stops the row and disables fruit input. No delayed event may alter score, lives, round number, or the final result.
- A visible **Game Over** screen or overlay shows **final score**, **round reached**, and **Play Again**.
- Activating **Play Again** clears previous fruits and feedback, starts a fresh four-fruit round at score **0**, **3 lives**, and round **1**, and leaves no old timer or animation active.

## Accessibility and reduced motion

- Fruit and action buttons retain text labels and normal pointer/keyboard activation.
- Score, lives, round, feedback, and Game Over result are understandable without relying on color alone.
- With reduced motion requested, show the full row statically for at least three seconds. Buttons remain active. At the interval's end, resolve each still-pending position as missed under the same one-life rule, stopping at Game Over or starting a new round when appropriate.

## Requirement coverage

- Start, score, and controls: FR-001–FR-004, FR-011
- Life and boundary handling: FR-005–FR-008, FR-015
- Bonus and next round: FR-009–FR-010
- Game Over, restart, and feedback: FR-012–FR-014
