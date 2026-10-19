# Player-Facing UI Contract: Fruit Rush

This contract describes the existing single-screen browser game's visible behavior after Feature 004. [The specification](../spec.md) controls scope; [the data model](../data-model.md) defines the presentation-event mapping. There is no network interface.

## Ready state

- The browser page and game header identify the game as **Fruit Rush**.
- Brief instructions say to read and choose the fruits from **right to left**, and explain that a wrong choice or missed fruit costs a life.
- Start is prominent and can be activated by pointer, touch, Enter, or Space. Fruit choices are unavailable until play starts.
- A visible mute/unmute control is present; its text and accessible state communicate the current choice. Muting or unmuting does not start a game.

## Playing state

- The distinct playfield displays one moving row of three to eight fruit positions. It keeps the established left-to-right visual order while the next required choice is the **rightmost pending** position.
- Apple, Banana, Grape, and Orange each have a named, distinct local illustration; each choice control repeats that fruit's illustration and visible name.
- The row retains Feature 003 speed by round. Positions maintain spacing and order while crossing the field. A resolved fruit may fade/scale but does not remove its layout slot until the row ends.
- Score, lives, round, selected progress, and difficulty remain visible and synchronize to the current game state after every event.
- Fruit controls have discernible default, hover, pressed, and keyboard-focus appearance. They remain active during brief feedback. Each touch target is at least 44 by 44 pixels.
- A correct choice immediately resolves one rightmost pending position and earns 10 points. Its control and score react positively; that exact fruit briefly reacts and disappears. A clean round also awards the existing 25-point bonus and briefly highlights success without delaying the next round.
- A wrong choice immediately costs one life, leaves the expected position pending, and gives negative control and life feedback. A boundary miss resolves that position once, costs one life, and gives life feedback. Text conveys the result without relying on color or sound.
- Appropriate short audio cues accompany correct selection, wrong selection, clean completion, life loss, and Game Over only when permitted and unmuted. One prioritized cue represents simultaneous outcomes, as mapped in [the data model](../data-model.md). Audio never delays any state change.
- The mute toggle remains visible and operable. Turning it on silences an active cue and all subsequent cues until unmuted. If playback is blocked or unavailable, gameplay and visual feedback continue normally.

## Game Over and restart

- On the final lost life, movement and fruit choices stop immediately. The Game Over panel shows final score, round reached, and a prominent Play Again control; focus moves to the restart control.
- The mute control remains available and communicates its state. A Game Over cue plays only if permitted and unmuted.
- Play Again starts round 1 with score 0, three lives, three fruits at 100% speed, and a fresh sequence. Old row movement, effects, or sounds do not alter the new game.

## Responsive and accessible behavior

- At 320px and 1280px viewport widths, ready, playing, and Game Over screens have no horizontal page scrolling. Long rows are checked while fully inside the field; all visible fruits remain distinguishable and controls remain reachable.
- Normal text has at least 4.5:1 contrast; large text and essential control boundaries at least 3:1. Visible focus, fruit names, status text, and outcome messages make the game usable without sound, color recognition, or decorative motion.
- Native button behavior supports mouse, touch, and keyboard activation. A status announcement communicates feedback without announcing every decorative frame.
- Under reduced-motion preference, nonessential feedback animations are removed or simplified. The existing three-second static sequence interval and all score/life/round rules remain unchanged.

## Non-blocking guarantees

- Visual/audio effects are triggered after a rules transition is decided; no effect can delay selection, miss resolution, round transition, Game Over, or restart.
- Each input or missed position is processed at most once. Repeated fruit identities remain separate indexed positions.
- Repeated rounds and restarts do not accumulate active effects, listeners, or sounds.
