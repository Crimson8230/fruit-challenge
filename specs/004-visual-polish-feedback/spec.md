# Feature Specification: Visual Polish, Animations, and Audio Feedback

**Feature Branch**: `004-visual-polish-feedback`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User request to transform the existing fruit game into Fruit Rush, a polished and responsive mini arcade game with consistent graphics, brief visual feedback, optional sound, improved start and Game Over screens, and unchanged Features 001–003 gameplay.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognize and Play the Polished Game (Priority: P1)

As a player, I want a clear, appealing game screen with recognizable fruit choices so that I can understand the challenge and play without learning new rules.

**Why this priority**: Readable fruit graphics, status, controls, and playfield support every other enhancement.

**Independent Test**: Open the game at desktop and narrow mobile widths, start a round, identify all four fruits in the moving sequence and controls, then complete a round while checking the established score, life, and difficulty rules.

**Acceptance Scenarios**:

1. **Given** the game is ready, **When** the page opens, **Then** it presents the title Fruit Rush, concise right-to-left instructions, a prominent Start control, and a distinct playfield in one coherent visual style.
2. **Given** any round, **When** apple, banana, grape, or orange appears, **Then** its illustration is visually consistent with the others, distinguishable, and matches its input control.
3. **Given** a moving sequence of three to eight fruits, **When** it crosses the playfield, **Then** the fruits remain correctly ordered, individually distinguishable, and moving at that round's existing Feature 003 speed.
4. **Given** the player selects the rightmost pending fruit, **When** the selection is correct, **Then** exactly that position resolves and the existing score and round rules apply; an incorrect choice or missed fruit retains the existing life rules.

---

### User Story 2 - Understand Each Action Immediately (Priority: P1)

As a player, I want quick, distinct feedback for correct choices, mistakes, score gains, life loss, and round completion so that the game's response is clear without slowing my next input.

**Why this priority**: The arcade feel depends on responsive feedback that never changes gameplay timing.

**Independent Test**: Make correct and incorrect choices in rapid succession, complete and miss rounds, and check the visible response and actual game values after each action.

**Acceptance Scenarios**:

1. **Given** an active round, **When** the player makes a correct choice, **Then** the chosen control shows positive feedback, the resolved fruit briefly reacts and disappears, and the score visibly acknowledges its increase.
2. **Given** an active round, **When** the player makes an incorrect choice, **Then** the chosen control shows distinct negative feedback, the expected fruit remains pending, and the life display briefly reacts.
3. **Given** a pending fruit leaves the playfield, **When** it is counted as missed, **Then** the life display reacts and the fruit resolves once under the existing rules.
4. **Given** the final pending fruit is selected in a clean round, **When** the round completes, **Then** the player sees a brief success highlight while the existing bonus and next-round transition occur as before.
5. **Given** feedback from a previous choice is still visible, **When** another choice is made, **Then** the new input is processed immediately and each input affects game state at most once.

---

### User Story 3 - Control Optional Sound (Priority: P2)

As a player, I want short sound cues and a visible mute control so that I can enjoy audio feedback when available and play comfortably in silence when I choose.

**Why this priority**: Sound adds enjoyment but cannot be necessary to understand or play the game.

**Independent Test**: Start a game, trigger each gameplay event with sound enabled, mute and trigger the events again, then repeat where sound is unavailable or blocked.

**Acceptance Scenarios**:

1. **Given** sound is allowed and unmuted, **When** a correct choice, incorrect choice, clean round completion, life loss, or Game Over occurs, **Then** the player hears an appropriate brief cue.
2. **Given** the mute control is visible, **When** the player mutes sound, **Then** its state is apparent and no subsequent gameplay cue is audible until unmuted.
3. **Given** sound is unavailable or blocked, **When** gameplay proceeds, **Then** controls, visual feedback, scoring, and transitions continue normally.

---

### User Story 4 - Play on Mobile and Finish Clearly (Priority: P2)

As a player on a narrow screen, I want readable status, reachable fruit controls, and a clear end screen so that I can play and restart without scrolling sideways or losing track of the result.

**Why this priority**: The redesign must remain usable on common phones and desktops.

**Independent Test**: Play through Start, gameplay, Game Over, and Play Again at 320-pixel and 1280-pixel widths using touch or pointer input, and repeat essential controls by keyboard.

**Acceptance Scenarios**:

1. **Given** a narrow or standard viewport, **When** the game is ready or active, **Then** score, lives, round, difficulty, playfield, mute control, and fruit choices remain visible or reachable without horizontal page scrolling.
2. **Given** a touch device, **When** the player taps a fruit control, **Then** the intended fruit is selected and the control gives a visible pressed response.
3. **Given** the final life is lost, **When** Game Over appears, **Then** movement and input stop, final score and round reached are clear, and Play Again is prominent.
4. **Given** Game Over, **When** the player chooses Play Again, **Then** round 1 begins with established initial values and no residual effect from the prior game.

### Edge Cases

- Repeated fruit types remain separate positions; an effect on one must not hide or resolve another.
- A correct choice that ends a round must show feedback even if the next round starts immediately; effects must not delay the transition.
- A wrong choice that costs the final life must show Game Over promptly; old feedback, movement, and sounds must not carry into the next game.
- Rapid choices during fruit disappearance, round transitions, or near a miss boundary must follow established event ordering without duplicate scoring or life loss.
- Muting must silence simultaneous events; unavailable or blocked sound must not produce errors or stall play.
- Focus, hover, selected, and pressed states must remain distinguishable where the input device supports them.
- At reduced-motion settings, decorative effects are suppressed or simplified while the existing static viewing interval and game rules remain intact.
- On a narrow display, a sequence may enter and leave the playfield as before; visible fruits remain distinguishable and controls cause no page overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST retain Features 001–003 gameplay: the four existing fruit types, movement and speed progression, rightmost-pending-fruit-first input, validation, scoring, lives, round progression, difficulty indicator, Game Over, and restart. Presentation effects MUST NOT change these rules or existing movement speeds.
- **FR-002**: The ready screen MUST display Fruit Rush, explain the right-to-left choice order and life consequences, and provide a prominent Start control.
- **FR-003**: The game MUST use a coherent, playful arcade visual style with consistent color, type, spacing, and controls; the playfield MUST be visually distinct from surrounding status and controls.
- **FR-004**: Score, lives, round, progress, and difficulty MUST remain readable during gameplay and reflect current game state after every relevant event.
- **FR-005**: Apple, banana, grape, and orange MUST each have a distinct, consistent illustration. The same illustration for a given fruit MUST appear in the moving sequence and its choice control, with a readable name available for identification.
- **FR-006**: Illustrations and spacing MUST support three through eight fruits without neighbor overlap while the complete row is inside the playfield at supported viewport widths.
- **FR-007**: Correct input MUST produce immediate positive control feedback and a brief effect on only the resolved fruit, followed by its disappearance; game state MUST update immediately without waiting for the effect.
- **FR-008**: Incorrect input MUST produce immediate negative control feedback distinct from correct feedback and MUST NOT remove or animate away the expected pending fruit.
- **FR-009**: Fruit controls MUST show discernible hover, pressed, and visible keyboard-focus states where applicable, and MUST support pointer, touch, and keyboard activation.
- **FR-010**: Score MUST briefly acknowledge each increase, lives MUST briefly acknowledge each loss, and clean round completion MUST receive a distinct brief success highlight. These effects MUST NOT change displayed values or delay gameplay.
- **FR-011**: Feedback and disappearance effects MUST be brief and non-blocking. Rapid inputs MUST remain responsive, with at most one game-state effect per input and no duplicate fruit resolution.
- **FR-012**: The game MUST offer brief, unobtrusive audio cues for correct selection, incorrect selection, clean round completion, life loss, and Game Over. Simultaneous events MUST be coordinated to avoid distracting overlap.
- **FR-013**: A visible, clearly labeled mute/unmute control MUST be available in ready, playing, and Game Over states. Muting MUST silence all gameplay cues immediately; unmuting MUST affect only future cues.
- **FR-014**: Audio MUST begin only when the browser permits it, MUST never block gameplay, and MUST fail gracefully when unavailable or disallowed. All information conveyed by sound MUST also be visible.
- **FR-015**: Game Over MUST clearly show final score and round reached, stop gameplay as before, and provide a prominent Play Again control. Restart MUST clear stale presentation effects and retain the established initial state.
- **FR-016**: At 320-pixel and 1280-pixel viewport widths, ready, playing, and Game Over layouts MUST avoid horizontal page scrolling, keep essential status and controls readable, and provide fruit controls with touch targets at least 44 by 44 pixels.
- **FR-017**: Normal text MUST have at least 4.5:1 contrast, large text and essential control boundaries at least 3:1 contrast, and interactive controls MUST have visible keyboard focus. The game MUST remain understandable and playable without hearing sound or relying solely on color or animation.
- **FR-018**: When reduced motion is requested, nonessential animations MUST be removed or simplified without changing gameplay rules, including the existing static sequence viewing interval.
- **FR-019**: Fruit graphics and sound MUST be bundled with the game and available during play without third-party media services.
- **FR-020**: Repeated rounds and restarts MUST remain responsive and MUST NOT leave stale visual effects or audible cues active.
- **FR-021**: Verification MUST confirm that existing Features 001–003 behavior and tests still pass; development documentation MUST record meaningful prompts, outcomes, corrections, and validation evidence for the project summary.

### Key Entities

- **Fruit identity**: Apple, banana, grape, or orange, with a consistent illustration and readable name across sequence and controls.
- **Visual feedback event**: A temporary response to a choice, resolved fruit, score gain, life loss, clean round, or Game Over; it does not own game state.
- **Audio preference**: The player's current muted or unmuted choice and whether the browser allows playback; it affects cues only.
- **Game snapshot**: Existing score, lives, round, difficulty, fruit positions, and ready/playing/Game Over status displayed by the presentation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 20 checked rounds spanning all four fruit types and sequence lengths from three to eight, 100% of sequence graphics match their corresponding controls; no fully visible row has overlapping fruit illustrations.
- **SC-002**: In 30 checked inputs, correct and incorrect choices show distinct feedback within 100 milliseconds of activation, and 100% of score, life, and pending-position values match the established rules.
- **SC-003**: In 20 rapid-input trials, including inputs while a fruit disappears and near round transitions, there are zero duplicate resolutions, scores, or life deductions and no delayed input caused by an effect.
- **SC-004**: With sound permitted, each of the five named gameplay event types produces a fitting cue in five checks; with mute enabled, 0 of 25 checked events produces audible gameplay sound. With sound unavailable, all checked rounds remain playable.
- **SC-005**: At 320-pixel and 1280-pixel widths, Start, gameplay, Game Over, and Play Again show no horizontal page scrolling; all four fruit controls meet the 44-by-44-pixel minimum touch target.
- **SC-006**: In 10 Game Over and restart checks, final score and round always match game state, and every restart begins at score 0, three lives, round 1, and Feature 003's initial difficulty, with no stale effect changing the new game.
- **SC-007**: In a five-player observation, at least four players can identify the next fruit, remaining lives, and whether their last choice was correct without sound or explanation at desktop and mobile widths.
- **SC-008**: All existing Features 001–003 automated tests pass, and a checked round at every Feature 003 difficulty tier retains its specified fruit count and movement speed.

## Assumptions

- Feature 004 begins from the merged Features 001–003 game. The rightmost pending fruit remains the next required input; correct selections, mistakes, misses, bonuses, difficulty tiers, Game Over, and restart retain established behavior.
- Round-completion feedback and sound refer to a clean round that earns the existing bonus. A round ending after a miss keeps its no-bonus behavior.
- The mute preference lasts for the current page session only; no settings persistence is introduced. Sound is attempted after player interaction only when permitted by the browser.
- The 320-pixel and 1280-pixel checks represent supported narrow and standard viewports. Intermediate and wider widths adapt without a separate game mode.
- Existing reduced-motion behavior is a three-second static sequence interval. This feature changes only decorative motion around it.
- No new fruit types, scoring rules, difficulty levels, power-ups, online leaderboards, backend, multiplayer, or highscore persistence are part of Feature 004.
