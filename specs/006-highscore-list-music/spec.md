# Feature Specification: Named Highscore List and Retro Background Music

**Feature Branch**: `006-highscore-list-music`
**Created**: 2026-10-19
**Status**: Draft
**Input**: User request (original German): "am ende kann man beim highscore seinen namen eingeben und es wird eine liste aller highscores angeigt 10 ergebnisse vom besten absteigend. weiters gibts es eine midisound hintergrundmusik ähnlich alten snes spielen"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter a name after Game Over (Priority: P1)

At the end of a run, the player can enter a name and save that run's score. The result is immediately reflected in the highscore list when it belongs among the ten best local results.

**Why this priority**: A named result gives the player a personal record and makes the requested list meaningful.

**Independent Test**: Finish a run, enter a name, submit it, and confirm that the name and final score appear in the visible ranking without starting another game.

**Acceptance Scenarios**:

1. **Given** a run reaches Game Over, **When** the player enters a valid name and submits it, **Then** that run is considered once for the ranking, the display updates immediately, and replay remains available.
2. **Given** a run reaches Game Over, **When** the player chooses to play again without submitting a name, **Then** the new run starts normally and the previous ranking remains unchanged.
3. **Given** a player submits a name, **When** they press the submit control repeatedly, **Then** that run creates no duplicate ranking entries.

---

### User Story 2 - See the ten best local results (Priority: P1)

The player sees a ranked list of up to ten named results, ordered from highest score to lowest score. The list survives reloads and later games in the same browser profile.

**Why this priority**: The list is the requested reward and comparison view.

**Independent Test**: Record more than ten runs with different scores, reload the page, and verify that only the ten highest local results remain in descending order.

**Acceptance Scenarios**:

1. **Given** saved results exist, **When** the player opens the Start or Game Over screen, **Then** up to ten entries appear with rank, name, and score in descending score order.
2. **Given** the ranking already has ten entries, **When** a lower-scoring run is submitted, **Then** the visible ten do not change.
3. **Given** a submitted run enters the top ten, **When** the page is reloaded, **Then** its name, score, and rank are restored.
4. **Given** the prior single-number highscore exists, **When** this feature is first used, **Then** the previous best remains visible and is not lost because the player has no name for it.

---

### User Story 3 - Hear optional retro background music (Priority: P2)

During a run, a short instrumental loop with a playful MIDI-style, 16-bit console feel plays quietly behind the existing gameplay sounds. The player can mute it using the visible sound control.

**Why this priority**: Music adds the requested arcade atmosphere while remaining optional for play.

**Independent Test**: Start a game, hear the loop begin after the start interaction, mute and unmute it, reach Game Over, and confirm the music stops until the next run.

**Acceptance Scenarios**:

1. **Given** sound is enabled and the browser permits playback after Start Game, **When** a run begins, **Then** the background loop starts without delaying fruit movement or input.
2. **Given** music is playing, **When** the player mutes sound, **Then** music and existing gameplay sound effects become inaudible immediately; unmuting during play restores music.
3. **Given** a run reaches Game Over, **When** the end screen appears, **Then** the gameplay music stops, while the end sound remains governed by the sound setting.
4. **Given** audio is unavailable or playback is denied, **When** the player starts or restarts, **Then** the game continues normally and remains usable without sound.

### Edge Cases

- Names containing only whitespace are rejected with a clear message. Leading and trailing spaces are removed; a name is limited to 16 visible characters.
- Names containing markup-like characters are displayed as plain text, never interpreted as page content.
- Equal scores retain the order in which their results were saved; submitting the same score in another run does not overwrite an earlier player.
- If browser storage is unavailable or corrupt, the game remains playable, uses the best valid data available for the current page, and starts a clean ranking when necessary.
- The prior single-number highscore has no associated player name; it is retained as a clearly identified legacy result until ten higher results replace it.
- A result below the tenth-place score is not retained in the top-ten list, but the player may still submit their name and receives clear feedback that the ranking did not change.
- Rapid restart, repeated submit, mute toggles, and page navigation must not create duplicate ranking entries or overlapping music loops.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: At Game Over, the system MUST offer a labeled name field and a submit action for the completed run, with keyboard and touch access.
- **FR-002**: The system MUST accept a trimmed name of 1–16 visible characters, reject blank or longer names with a clear message, and display accepted names safely as text.
- **FR-003**: The system MUST allow the player to restart without entering a name and MUST accept at most one ranking submission per completed run.
- **FR-004**: The system MUST store each accepted result with its name, final score, and submission order, then show at most ten results ranked by descending score; equal scores MUST retain earlier submission order.
- **FR-005**: The top-ten list MUST be visible on the Start and Game Over screens and MUST update immediately after a qualifying submission. Empty rankings MUST have a clear empty state.
- **FR-006**: The ranking MUST persist across reloads and browser restarts in the same browser profile, without accounts or an online service.
- **FR-007**: The existing personal-best value MUST remain available. Existing single-value highscore data MUST migrate without losing the previous best, using a clearly marked unnamed legacy entry if needed.
- **FR-008**: Unavailable or malformed saved ranking data MUST NOT prevent gameplay, Game Over, restart, or display of valid results.
- **FR-009**: The game MUST provide an original, unobtrusive instrumental background loop with a retro MIDI-style console sound during active play.
- **FR-010**: The existing sound control MUST mute and unmute both music and gameplay sound effects. Playback MUST respect browser permission and MUST not delay gameplay.
- **FR-011**: Background music MUST stop at Game Over and MUST restart as one loop for a new run when sound is enabled; repeated restarts MUST NOT overlap loops.
- **FR-012**: Existing fruit order, movement, scoring, lives, difficulty, graphics, sound effects, Game Over, and restart behavior MUST remain unchanged except where the new ranking and music need screen space or sound control integration.
- **FR-013**: The ranking, name form, and sound control MUST remain readable and usable on desktop and narrow mobile screens, with visible focus and meaningful text for screen readers.

### Key Entities

- **Completed run**: The finished game session with its final score, round reached, and whether its ranking result has already been submitted.
- **Highscore entry**: A saved player name, final score, and submission order; the legacy entry may have no player-provided name.
- **Top-ten ranking**: The ordered collection of the ten highest locally saved entries.
- **Sound preference**: The current enabled or muted state shared by gameplay effects and background music.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a manual test, a player can enter and submit a name within 30 seconds of Game Over, and a qualifying result appears in the ranking immediately.
- **SC-002**: After 12 submitted runs with distinct scores, exactly the 10 highest results appear in descending order on both screens, including after a reload.
- **SC-003**: Submitting a completed run repeatedly or restarting rapidly creates zero duplicate entries and zero simultaneous background loops.
- **SC-004**: With sound enabled and playback permitted, music starts within 2 seconds of selecting Start Game, and muting makes music and sound effects inaudible within 1 second.
- **SC-005**: A player can complete a run, submit a name, inspect the ranking, and restart on both a desktop viewport and a 360-pixel-wide mobile viewport without horizontal page scrolling.
- **SC-006**: Existing gameplay regression checks pass, including rightmost-first input, scoring, life loss, difficulty, and replay.

## Assumptions

- "All highscores" means all qualifying results saved in the current browser profile, because the existing game is entirely client-side and has no shared account or server. A global leaderboard is outside this feature.
- The existing single-number personal best remains meaningful even if the player skips name entry. An older best with no recorded name appears as an explicitly labeled legacy result.
- Name entry is offered after every completed run, including a run that cannot enter the current top ten; non-qualifying results are not retained in the ranking.
- "MIDI sound" describes the desired retro musical character. No specific existing game melody or copyrighted recording is requested.
- The existing sound control is the single control for background music and gameplay sound effects; playback begins only after an allowed player interaction.
