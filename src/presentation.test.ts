import { describe, expect, it } from 'vitest';
import { chooseFruit, missFruit, startGame } from './game';
import { classifyTransition } from './presentation';

describe('presentation events from game transitions', () => {
  it('identifies only the rightmost selected position, including repeated fruit types', () => {
    const first = startGame(() => 0, ['apple', 'banana', 'banana']);
    const second = chooseFruit(first, 'banana');
    expect(classifyTransition(first, second, { kind: 'choice', fruit: 'banana' })).toMatchObject({
      kind: 'correct', inputOutcome: 'correct', positionIndex: 2, scoreGain: 10, livesLost: 0,
    });
    const third = chooseFruit(second, 'banana');
    expect(classifyTransition(second, third, { kind: 'choice', fruit: 'banana' })?.positionIndex).toBe(1);
  });

  it('keeps the final correct selection visible as a clean-round event', () => {
    let game = startGame(() => 0, ['apple', 'banana', 'grape']);
    game = chooseFruit(game, 'grape');
    game = chooseFruit(game, 'banana');
    const next = chooseFruit(game, 'apple', () => 0);
    expect(classifyTransition(game, next, { kind: 'choice', fruit: 'apple' })).toMatchObject({
      kind: 'round-complete', inputOutcome: 'correct', positionIndex: 0, scoreGain: 35,
    });
  });

  it('reports a wrong choice and leaves the pending position unresolved', () => {
    const before = startGame(() => 0, ['apple', 'banana', 'grape']);
    const after = chooseFruit(before, 'orange');
    expect(classifyTransition(before, after, { kind: 'choice', fruit: 'orange' })).toMatchObject({
      kind: 'incorrect', inputOutcome: 'incorrect', scoreGain: 0, livesLost: 1,
    });
  });

  it('reports a missed indexed position and gives terminal state priority', () => {
    const before = startGame(() => 0, ['apple', 'banana', 'grape']);
    const after = missFruit(before, 1);
    expect(classifyTransition(before, after, { kind: 'miss', index: 1 })).toMatchObject({
      kind: 'missed', inputOutcome: 'missed', positionIndex: 1, livesLost: 1,
    });
    const oneLife = chooseFruit(chooseFruit(before, 'orange'), 'orange');
    const over = chooseFruit(oneLife, 'orange');
    expect(classifyTransition(oneLife, over, { kind: 'choice', fruit: 'orange' })).toMatchObject({
      kind: 'game-over', inputOutcome: 'incorrect', livesLost: 1,
    });
  });

  it('does not emit an event for an unchanged game', () => {
    const ready = startGame(() => 0, ['apple', 'banana', 'grape']);
    expect(classifyTransition(ready, ready, { kind: 'choice', fruit: 'grape' })).toBeNull();
  });

  it('classifies consecutive misses once each and gives the final miss Game Over priority', () => {
    const first = startGame(() => 0, ['apple', 'banana', 'grape']);
    const second = missFruit(first, 0);
    const third = missFruit(second, 1);
    const over = missFruit(third, 2);
    expect(classifyTransition(first, second, { kind: 'miss', index: 0 })?.positionIndex).toBe(0);
    expect(classifyTransition(second, third, { kind: 'miss', index: 1 })?.positionIndex).toBe(1);
    expect(classifyTransition(third, over, { kind: 'miss', index: 2 })).toMatchObject({
      kind: 'game-over', inputOutcome: 'missed', positionIndex: 2, livesLost: 1,
    });
    expect(classifyTransition(over, missFruit(over, 2), { kind: 'miss', index: 2 })).toBeNull();
  });

  it('reports one result per rapid accepted transition without conflating repeated identities', () => {
    const first = startGame(() => 0, ['apple', 'apple', 'apple']);
    const second = chooseFruit(first, 'apple');
    const third = chooseFruit(second, 'apple');
    const fourth = chooseFruit(third, 'apple', () => 0);
    const events = [
      classifyTransition(first, second, { kind: 'choice', fruit: 'apple' }),
      classifyTransition(second, third, { kind: 'choice', fruit: 'apple' }),
      classifyTransition(third, fourth, { kind: 'choice', fruit: 'apple' }),
    ];
    expect(events.map((event) => event?.positionIndex)).toEqual([2, 1, 0]);
    expect(events.map((event) => event?.scoreGain)).toEqual([10, 10, 35]);
  });
});
