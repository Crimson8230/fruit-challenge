<!--
Sync Impact Report (temporary review material; remove before committing)
- Version change: unratified scaffold -> 1.0.0
- Modified principles: none; the scaffold contained no adopted principles.
- Added principles: I. Simplicity First; II. Playable Incremental Development;
  III. Technology and Architecture; IV. Gameplay and User Experience;
  V. Quality and Testing; VI. AI-Assisted Development and Documentation;
  VII. Scope Control.
- Added sections: Project Constraints; Development Workflow.
- Removed sections: none.
- Follow-up TODOs: none.
-->
# Fruit Challenge Constitution

## Core Principles

### I. Simplicity First

The application MUST remain small, understandable, and maintainable. Implementations MUST favor
simple solutions and MUST avoid unnecessary abstractions, design patterns, and dependencies.
Features MUST be tied to an explicit requirement. This keeps the game easy to review, change,
and debug.

### II. Playable Incremental Development

The application MUST remain runnable and playable throughout development. Core gameplay MUST be
implemented before visual enhancements or optional features. Changes MUST be small enough to
verify independently and review without a large, coupled change set. This exposes gameplay
problems early and limits debugging effort.

### III. Technology and Architecture

The game MUST be a browser-based single-page application. It SHOULD use TypeScript, HTML, CSS,
and lightweight tooling. Game logic MUST be separate from rendering and user interaction. The
application MUST use client-side logic without a backend or database unless an explicit
requirement calls for one. Graphics and animations SHOULD remain lightweight so gameplay stays
responsive in a small browser game.

### IV. Gameplay and User Experience

Core gameplay MUST present a moving sequence of fruits for the player to recognize and enter in
the correct order. Controls MUST be intuitive and responsive. Correct and incorrect inputs MUST
receive clear visual feedback. Start, progress, success, and failure states MUST be understandable
to the player. Gameplay responsiveness MUST take priority over decorative effects.

### V. Quality and Testing

Essential gameplay logic MUST have tests covering sequence generation, input validation, scoring,
and game-state transitions. Tests MUST remain lightweight and proportional to the game's size.
The application MUST start locally with minimal setup. Gameplay-breaking bugs MUST be fixed
before new features are added. These checks protect the playable core as the game evolves.

### VI. AI-Assisted Development and Documentation

Spec-Kit MUST define requirements and guide implementation. Development documentation MUST
record important prompts, successful and unsuccessful AI-generated solutions, notable problems,
manual corrections, and lessons learned. The README MUST stay concise and include installation,
execution, gameplay instructions, and a summary of the Vibe Coding experience. Source code,
comments, commits, and documentation MUST be written in English. This makes both the game and
the development process reviewable.

### VII. Scope Control

Work MUST focus on a polished minimum viable game. Authentication, accounts, multiplayer, cloud
infrastructure, and unrelated functionality MUST NOT be added. Sounds, advanced animations,
additional game modes, and leaderboards MAY be considered only as explicitly requested optional
enhancements after the core game is complete. Existing functionality MUST be completed and
polished before scope expands.

## Project Constraints

The primary goal is a playable fruit-sequence game and an evaluation of its development process.
Feature specifications MUST state the gameplay behavior and any process evidence to capture.
Choices that add runtime services, persistence, or substantial tooling MUST cite the explicit
requirement that needs them and explain their effect on local setup and responsiveness.

## Development Workflow

Use Spec-Kit artifacts to move from requirements to a plan, small tasks, and implementation.
Each increment MUST leave the game playable and MUST verify the affected gameplay behavior.
Before adding an optional enhancement, review the current game for incomplete core behavior or
gameplay-breaking bugs. Record the prompts, outcomes, corrections, and lessons from AI-assisted
work as development proceeds, then summarize that experience in the README.

## Governance

This constitution governs project specifications, plans, tasks, implementation, and review.
Amendments MUST be documented in this file with a rationale and a Sync Impact Report, reviewed
for effects on existing work, and approved before adoption. Changes that conflict with existing
artifacts MUST identify the affected artifacts and the needed migration or revision.

Versions MUST follow semantic versioning: MAJOR for incompatible principle or governance
changes, MINOR for new principles or materially expanded guidance, and PATCH for clarifications
that do not change obligations. The initial ratification is version 1.0.0. Every feature review
MUST check the work against these principles, explain any exception, and verify that the game
remains playable with the essential tests passing.

**Version**: 1.0.0 | **Ratified**: 2026-10-18 | **Last Amended**: 2026-10-18
