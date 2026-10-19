import { describe, expect, it } from 'vitest';
import {
  FRUITS, chooseFruit, createReadyGame, generateSequence, getRoundDifficulty,
  missFruit, startGame, type Fruit, type Game,
} from './game';

const firstRound = ['apple', 'banana', 'grape'] as const;

function chooseAll(game: Game): Game {
  const pending = game.round?.positions.filter((position) => position.status === 'pending') ?? [];
  return pending.reverse().reduce((current, position) => chooseFruit(current, position.fruit, () => 0), game);
}

function reachRound(target: number): Game {
  let game = startGame(() => 0, firstRound);
  for (let round = 1; round < target; round += 1) {
    game = chooseAll(game);
    expect(game.roundNumber).toBe(round + 1);
  }
  return game;
}

describe('round difficulty', () => {
  it.each([
    [1, 3, 100], [2, 3, 100], [3, 4, 115], [5, 5, 130],
    [7, 6, 145], [9, 7, 160], [11, 8, 175], [13, 8, 190],
    [15, 8, 200], [16, 8, 200], [25, 8, 200],
  ])('maps round %i to %i fruits at %i%%', (round, fruitCount, speedPercent) => {
    expect(getRoundDifficulty(round)).toEqual({ fruitCount, speedPercent });
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid round %s', (round) => {
    expect(() => getRoundDifficulty(round)).toThrow(RangeError);
  });
});

describe('sequence and positions', () => {
  it('generates the current count with only the four requested fruits and allows repeats', () => {
    const draws = [0, 0.25, 0.5, 0.75];
    let index = 0;
    expect(generateSequence(() => draws[index++], 4)).toEqual(FRUITS);
    expect(generateSequence(() => 0, 8)).toEqual(Array(8).fill('apple'));
    expect(FRUITS).toEqual(['apple', 'banana', 'grape', 'orange']);
    expect(() => generateSequence(() => 1, 3)).toThrow(RangeError);
  });

  it('validates first-round length and fruit names', () => {
    expect(() => startGame(() => 0, ['apple'])).toThrow();
    expect(() => startGame(() => 0, ['apple', 'banana', 'cherry' as Fruit])).toThrow();
    expect(startGame(() => 0, ['apple', 'apple', 'banana']).round?.positions).toEqual([
      { index: 0, fruit: 'apple', status: 'pending' },
      { index: 1, fruit: 'apple', status: 'pending' },
      { index: 2, fruit: 'banana', status: 'pending' },
    ]);
  });

  it.each([1, 2, 3, 5, 9, 11, 13, 15, 25])('starts round %i with a fresh sequence of its tier length', (round) => {
    const game = reachRound(round);
    expect(game.round?.positions).toHaveLength(getRoundDifficulty(round).fruitCount);
    expect(game.round?.positions.every((position) => position.status === 'pending')).toBe(true);
    expect(game.round?.positions.map((position) => position.index))
      .toEqual(Array.from({ length: getRoundDifficulty(round).fruitCount }, (_, index) => index));
  });
});

describe('selection, scoring, and misses', () => {
  it('takes the rightmost pending position, including repeated fruits', () => {
    let game = startGame(() => 0, ['apple', 'banana', 'banana']);
    const wrongFirst = chooseFruit(game, 'apple');
    expect([wrongFirst.score, wrongFirst.lives]).toEqual([0, 2]);
    expect(wrongFirst.round?.positions.map((position) => position.status)).toEqual(['pending', 'pending', 'pending']);
    game = chooseFruit(game, 'banana');
    expect(game.round?.positions.map((position) => position.status)).toEqual(['pending', 'pending', 'selected']);
    expect(game.score).toBe(10);
    game = chooseFruit(game, 'banana');
    expect(game.round?.positions.map((position) => position.status)).toEqual(['pending', 'selected', 'selected']);
    expect(game.score).toBe(20);
    const wrong = chooseFruit(game, 'banana');
    expect([wrong.score, wrong.lives]).toEqual([20, 2]);
    expect(wrong.round?.positions[0].status).toBe('pending');
  });

  it('keeps bonus eligibility after a wrong choice but removes it after a miss', () => {
    const wrong = chooseFruit(startGame(() => 0, firstRound), 'orange');
    expect([wrong.score, wrong.lives, wrong.feedback]).toEqual([0, 2, 'incorrect']);
    expect(chooseAll(wrong).score).toBe(55);

    const missed = missFruit(startGame(() => 0, firstRound), 1);
    const next = chooseAll(missed);
    expect([next.score, next.lives, next.roundNumber, next.feedback]).toEqual([20, 2, 2, 'round-missed']);
  });

  it('awards 10 per selected position and a clean bonus once at different lengths', () => {
    for (const target of [1, 3, 11]) {
      const game = reachRound(target);
      const before = game.score;
      const next = chooseAll(game);
      expect(next.score - before).toBe(10 * getRoundDifficulty(target).fruitCount + 25);
      expect(next.roundNumber).toBe(target + 1);
      expect(next.lives).toBe(3);
    }
  });

  it('charges one life per indexed miss, skips resolved slots, and never double-charges', () => {
    let game = startGame(() => 0, firstRound);
    game = missFruit(game, 0);
    expect([game.score, game.lives, game.round?.positions[0].status]).toEqual([0, 2, 'missed']);
    expect(missFruit(game, 0)).toBe(game);
    game = chooseFruit(game, 'grape');
    expect(game.round?.positions[2].status).toBe('selected');
    expect(missFruit(game, 2)).toBe(game);
    game = missFruit(game, 1);
    expect([game.roundNumber, game.score, game.lives]).toEqual([2, 10, 1]);
  });

  it('uses the round number after missed rounds rather than compounding speed', () => {
    let game = startGame(() => 0, firstRound);
    game = missFruit(game, 0);
    game = chooseAll(game);
    expect([game.roundNumber, getRoundDifficulty(game.roundNumber)]).toEqual([2, { fruitCount: 3, speedPercent: 100 }]);
    game = chooseAll(game);
    expect([game.roundNumber, getRoundDifficulty(game.roundNumber)]).toEqual([3, { fruitCount: 4, speedPercent: 115 }]);
  });
});

describe('terminal state and restart', () => {
  it.each(['wrong choice', 'missed fruit'])('stops immediately on the last life from a %s', (cause) => {
    let game = startGame(() => 0, firstRound);
    for (let index = 0; index < 3; index += 1) {
      game = cause === 'wrong choice' ? chooseFruit(game, 'orange') : missFruit(game, index);
    }
    expect([game.status, game.lives, game.roundNumber, game.score]).toEqual(['game-over', 0, 1, 0]);
    expect(chooseFruit(game, 'apple')).toBe(game);
    expect(missFruit(game, 2)).toBe(game);
  });

  it('restarts from a higher round with three fresh positions and no old state', () => {
    const old = reachRound(11);
    const fresh = startGame(() => 0.75);
    expect(createReadyGame().status).toBe('ready');
    expect([fresh.score, fresh.lives, fresh.roundNumber, getRoundDifficulty(fresh.roundNumber)])
      .toEqual([0, 3, 1, { fruitCount: 3, speedPercent: 100 }]);
    expect(fresh.round?.positions.map((position) => position.fruit)).toEqual(['orange', 'orange', 'orange']);
    expect(old.round?.positions).toHaveLength(8);
  });
});
