# Fruit Rush prompt log

This document collects the individual development prompts that can be recovered from the repository and the available conversation. It is intended to accompany the [Vibe Coding experience](vibe-coding-experience.md) for the university submission.

## How to read this log

Spec-Kit stores specifications, plans, tasks, and development logs. It does not automatically provide a complete, verbatim chat transcript in this repository. The `Input` fields for Features 001 and 002 contain quoted text; these are reproduced exactly as **text preserved in Spec-Kit**, but the repository alone cannot prove that every word matches the original chat message. The `Input` fields for Features 003–005 are summaries. Messages explicitly marked **conversation text** below are quoted from the conversation available during preparation of this document. A short excerpt is not presented as a complete prompt.

## Feature 001 — core fruit input

The following four separate requests are quoted in the [Feature 001 specification](../specs/001-core-fruit-input/spec.md) `Input` field (text preserved in Spec-Kit):

1. Initial request:

   > 001 – Core Game & Fruit Input. Playfield, moving fruits, and input buttons. The player must select the displayed fruits in the correct order. First fully playable version.

2. Movement correction:

   > The fruits move together from left to right across the playfield, and the player can press the sequence buttons while they move.

3. Input order and speed correction:

   > Keep the same feature branch; select the fruits from right to left, and keep their speed constant as they cross the playfield.

4. Input timing and historical countdown request:

   > Keep the same feature branch; fruit buttons are clickable from the start of a round, and after the last fruit leaves the playfield, the player has five seconds to finish the sequence, shown by an overlay popup counting down from five.

The final game's behavior is described in the [README](../README.md); this section records requests made during development, including the historical countdown request.

## Feature 002 — scoring, lives, and Game Over

The [Feature 002 specification](../specs/002-scoring-lives-game-over/spec.md) preserves this quoted request (text preserved in Spec-Kit):

> Implement Feature 002: Scoring, Lives, and Game Over for the existing fruit game. Give 10 points per correct fruit and 25 points for a completed sequence without missed fruits; start with three lives, lose one for wrong selections or missed fruits, continue across rounds, show Game Over at zero lives, and restart with fresh state. Preserve Feature 001 movement, input, and visual design.

## Feature 003 — progressive difficulty and correction

The initial difficulty request is only [summarized in the specification](../specs/003-progressive-difficulty/spec.md); its exact wording is not preserved in the repository. The following later messages are **conversation text**, with their original spelling:

1. Input order regression report:

   > da hat sich ein bug eingschlichen die klickreihenfolge ist wieder von links nach rechts..

2. Branch correction:

   > ich brauch das auch auf dem branch 003 und nicht auf 002

The [Feature 003 development log](../specs/003-progressive-difficulty/development-log.md) records the implementation and correction.

## Feature 004 — visual polish, animations, and audio

The opening line of the feature request is **conversation text** (opening excerpt, not the full prompt):

> $speckit-specify Implement Feature 004: Visual Polish, Animations, and Audio Feedback for the existing Fruit Rush browser game.

The longer request specified visual design, consistent local fruit graphics, non-blocking animations and button feedback, score and life feedback, optional audio, Start and Game Over presentation, mobile layout, accessibility, performance, and regression testing. That scope is recorded in the [Feature 004 specification](../specs/004-visual-polish-feedback/spec.md). The complete original wording of the detailed request is not stored in the repository.

## Feature 005 — highscore and finalization

The opening lines of the feature request are **conversation text** (opening excerpt, not the full prompt):

> $speckit-specify Implement Feature 005: Highscores, Finalization, and Label-Free Fruit Graphics for the existing Fruit Rush browser game.
>
> This is the final planned feature of the Fruit Rush university Vibe Coding project.

The longer request covered the dedicated branch, graphical fruit buttons without visible names, browser-local highscore, finalized Start and Game Over screens, complete gameplay regression, documentation, and a final commit. The [Feature 005 specification](../specs/005-highscores-finalization/spec.md) records these requirements, but its `Input` field is a summary rather than the full original prompt.

## Spec-Kit workflow commands

The conversation also records these literal command prompts, used across the feature workflow: `$speckit-specify`, `$speckit-plan`, `$speckit-tasks`, `$speckit-implement`, and `$speckit-converge`. The last command was used for follow-up consistency checks. Their generated artifacts are under [`specs/`](../specs/).

## TODO (developer input)

- Add the full original Feature 003, 004, and 005 prompts from your own chat export if the assignment requires a complete verbatim transcript. Do not reconstruct missing wording from the specifications.
- Add any other prompts you consider important only when you can check their exact wording against the original conversation.
