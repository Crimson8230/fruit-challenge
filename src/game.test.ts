import { describe, expect, it } from 'vitest';
import {
  FRUITS,
  chooseFruit,
  createReadyGame,
  generateSequence,
  missFruit,
  startGame,
  type Fruit,
  type Game,
} from './game';

const sequence = ['apple', 'banana', 'cherry', 'grape'] as const;

function chooseAll(game: Game, fruits: readonly Fruit[] = [...sequence].reverse()): Game {
  return fruits.reduce((current, fruit) => chooseFruit(current, fruit, () => 0), game);
}

describe('fruit sequence', () => {
  it('generates four valid positions and allows repeated fruits', () => {
    const draws = [0, 0.25, 0.5, 0.75];
    let index = 0;
    expect(generateSequence(() => draws[index++])).toEqual(FRUITS);
    expect(generateSequence(() => 0)).toEqual(Array(4).fill('apple'));
    expect(() => generateSequence(() => 1)).toThrow(RangeError);

    const game = startGame(() => 0, ['apple', 'apple', 'banana', 'apple']);
    expect(game.round?.positions.map(({ index, fruit, status }) => ({ index, fruit, status })))
      .toEqual([
        { index: 0, fruit: 'apple', status: 'pending' },
        { index: 1, fruit: 'apple', status: 'pending' },
        { index: 2, fruit: 'banana', status: 'pending' },
        { index: 3, fruit: 'apple', status: 'pending' },
      ]);
  });

  it('rejects a sequence that does not contain exactly four valid fruits', () => {
    expect(() => startGame(() => 0, ['apple'])).toThrow();
    expect(() => startGame(() => 0, ['apple', 'banana', 'cherry', 'pear' as Fruit])).toThrow();
  });
});

describe('scoring and lives', () => {
  it('starts at zero points, three lives and round one, with input active immediately', () => {
    const ready = createReadyGame();
    expect(ready.status).toBe('ready');
    expect(chooseFruit(ready, 'grape')).toEqual(ready);
    const game = startGame(() => 0, sequence);
    expect(game.status).toBe('playing');
    expect([game.score, game.lives, game.roundNumber]).toEqual([0, 3, 1]);
    expect(chooseFruit(game, 'grape').score).toBe(10);
  });

  it('scores only the next rightmost pending position, including repeated types', () => {
    let game = startGame(() => 0, ['apple', 'banana', 'apple', 'apple']);
    game = chooseFruit(game, 'apple');
    expect(game.round?.positions[3].status).toBe('selected');
    expect(game.score).toBe(10);
    game = chooseFruit(game, 'apple');
    expect(game.round?.positions[2].status).toBe('selected');
    expect(game.score).toBe(20);
    game = chooseFruit(game, 'apple');
    expect(game.score).toBe(20);
    expect(game.lives).toBe(2);
    expect(game.round?.positions[1].status).toBe('pending');
  });

  it('deducts exactly one life for a wrong choice while keeping the required fruit', () => {
    const game = startGame(() => 0, sequence);
    const wrong = chooseFruit(game, 'apple');
    expect([wrong.score, wrong.lives, wrong.feedback]).toEqual([0, 2, 'incorrect']);
    expect(wrong.round?.positions.map((position) => position.status)).toEqual(Array(4).fill('pending'));
    expect(chooseFruit(wrong, 'grape').score).toBe(10);
  });

  it('deducts exactly one life per indexed miss and cannot charge a position twice', () => {
    const game = startGame(() => 0, sequence);
    const missed = missFruit(game, 0);
    expect([missed.score, missed.lives, missed.feedback]).toEqual([0, 2, 'missed']);
    expect(missed.round?.positions[0].status).toBe('missed');
    expect(missFruit(missed, 0)).toBe(missed);
    const selected = chooseFruit(missed, 'grape');
    expect(missFruit(selected, 3)).toBe(selected);
  });

  it('awards 40 selection points plus the 25-point clean-round bonus once', () => {
    let game = startGame(() => 0, sequence);
    for (const [index, fruit] of ([...sequence].reverse() as Fruit[]).entries()) {
      game = chooseFruit(game, fruit, () => 0);
      expect(game.score).toBe(index === 3 ? 65 : (index + 1) * 10);
    }
    expect([game.roundNumber, game.lives, game.feedback]).toEqual([2, 3, 'round-complete']);
    expect(game.round?.positions.every((position) => position.status === 'pending')).toBe(true);
    expect(game.round?.positions.map((position) => position.fruit)).toEqual(Array(4).fill('apple'));
    expect(missFruit(game, 99)).toBe(game);
    expect(game.score).toBe(65);
  });

  it('keeps the clean-round bonus after a wrong press if no fruit is missed', () => {
    const wrong = chooseFruit(startGame(() => 0, sequence), 'apple');
    const next = chooseAll(wrong);
    expect([next.score, next.lives, next.roundNumber]).toEqual([65, 2, 2]);
  });

  it('starts the next round without a bonus when a position was missed', () => {
    let game = missFruit(startGame(() => 0, sequence), 3);
    game = chooseAll(game, ['cherry', 'banana', 'apple']);
    expect([game.score, game.lives, game.roundNumber, game.feedback]).toEqual([30, 2, 2, 'round-missed']);
  });

  it('starts a new round when all remaining positions are missed and a life remains', () => {
    let game = chooseAll(startGame(() => 0, sequence), ['grape', 'cherry']);
    game = missFruit(game, 0);
    game = missFruit(game, 1, () => 0.75);
    expect([game.score, game.lives, game.roundNumber, game.feedback]).toEqual([20, 1, 2, 'round-missed']);
    expect(game.round?.positions.map((position) => position.fruit)).toEqual(Array(4).fill('grape'));
  });
});

describe('terminal state and restart', () => {
  it.each(['wrong choice', 'missed fruit'])('enters Game Over immediately after the final life: %s', (cause) => {
    let game = startGame(() => 0, sequence);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      game = cause === 'wrong choice' ? chooseFruit(game, 'apple') : missFruit(game, attempt);
    }
    expect([game.status, game.lives, game.roundNumber, game.score]).toEqual(['game-over', 0, 1, 0]);
    const final = game;
    for (let event = 0; event < 10; event += 1) {
      expect(chooseFruit(final, 'grape')).toBe(final);
      expect(missFruit(final, event % 4)).toBe(final);
    }
  });

  it('restarts with fresh values and no old position state', () => {
    const old = chooseFruit(startGame(() => 0, sequence), 'grape');
    const fresh = startGame(() => 0.75);
    expect([fresh.status, fresh.score, fresh.lives, fresh.roundNumber, fresh.feedback])
      .toEqual(['playing', 0, 3, 1, null]);
    expect(fresh.round?.positions.map((position) => position.fruit)).toEqual(Array(4).fill('grape'));
    expect(fresh.round?.positions.every((position) => position.status === 'pending')).toBe(true);
    expect(old.score).toBe(10);
  });
});

describe('acceptance samples', () => {
  it('checks 20 correct, wrong, and missed events without cross-game leakage', () => {
    for (let sample = 0; sample < 20; sample += 1) {
      const start = startGame(() => 0, sequence);
      const correct = chooseFruit(start, 'grape');
      expect(correct.score - start.score).toBe(10);
      const wrong = chooseFruit(start, 'apple');
      expect([wrong.score - start.score, start.lives - wrong.lives]).toEqual([0, 1]);
      const missed = missFruit(start, 0);
      expect([missed.score - start.score, start.lives - missed.lives]).toEqual([0, 1]);
    }
  });

  it('checks 10 clean rounds, 10 missed rounds, and 20 transitions', () => {
    for (let sample = 0; sample < 10; sample += 1) {
      const clean = chooseAll(startGame(() => 0, sequence));
      expect([clean.score, clean.lives, clean.roundNumber]).toEqual([65, 3, 2]);
      const missed = chooseAll(missFruit(startGame(() => 0, sequence), 3), ['cherry', 'banana', 'apple']);
      expect([missed.score, missed.lives, missed.roundNumber]).toEqual([30, 2, 2]);
    }
  });

  it('checks 10 final-life cases and 10 clean restarts', () => {
    for (let sample = 0; sample < 10; sample += 1) {
      let game = startGame(() => 0, sequence);
      game = chooseFruit(game, 'apple');
      game = chooseFruit(game, 'apple');
      game = chooseFruit(game, 'apple');
      expect([game.status, game.lives]).toEqual(['game-over', 0]);
      for (let later = 0; later < 10; later += 1) {
        expect(chooseFruit(game, 'grape')).toBe(game);
      }
      const fresh = startGame(() => sample % 2 ? 0.75 : 0);
      expect([fresh.score, fresh.lives, fresh.roundNumber]).toEqual([0, 3, 1]);
      expect(fresh.round?.positions.every((position) => position.status === 'pending')).toBe(true);
    }
  });
});
