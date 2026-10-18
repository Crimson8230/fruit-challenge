import { describe, expect, it } from 'vitest';
import {
  FRUITS,
  createReadyRound,
  expireRound,
  generateSequence,
  passRow,
  replayRound,
  revealRow,
  secondsRemaining,
  selectFruit,
  startRound,
} from './game';

describe('sequence generation', () => {
  it('creates exactly four valid fruits in sampled order', () => {
    const draws = [0, 0.25, 0.5, 0.75];
    let index = 0;
    expect(generateSequence(() => draws[index++])).toEqual(FRUITS);
  });

  it('allows repeated fruit types', () => {
    expect(generateSequence(() => 0)).toEqual(Array(4).fill('apple'));
  });
});

describe('round state', () => {
  const sequence = ['apple', 'banana', 'cherry', 'grape'] as const;

  it('ignores ready input but accepts and scores input as soon as a round starts', () => {
    const ready = createReadyRound();
    expect(ready.phase).toBe('ready');
    expect(selectFruit(ready, 'grape', 0)).toEqual(ready);

    const approaching = startRound(() => 0, sequence);
    expect(approaching.phase).toBe('approaching');
    expect(approaching.sequence).toEqual(sequence);
    expect(approaching.deadlineAtMs).toBeNull();
    const selected = selectFruit(approaching, 'grape', 1);
    expect(selected.correctCount).toBe(1);
    expect(selected.feedback).toBe('correct');
    expect(selected.phase).toBe('approaching');
    expect(passRow(approaching, 100)).toEqual(approaching);
  });

  it('fails immediately on a wrong choice before the row is fully visible', () => {
    const failed = selectFruit(startRound(() => 0, sequence), 'apple', 1);
    expect(failed.phase).toBe('failure');
    expect(failed.correctCount).toBe(0);
    expect(failed.feedback).toBe('incorrect');
    expect(failed.deadlineAtMs).toBeNull();
    expect(revealRow(failed)).toEqual(failed);
  });

  it('keeps input active at full visibility and starts the deadline only after full exit', () => {
    const approaching = startRound(() => 0, sequence);
    const moving = revealRow(approaching);
    expect(moving.phase).toBe('moving');
    expect(moving.deadlineAtMs).toBeNull();
    expect(revealRow(moving)).toEqual(moving);
    expect(selectFruit(moving, 'grape', 50).correctCount).toBe(1);

    const passed = passRow(moving, 100);
    expect(passed.phase).toBe('passed');
    expect(passed.deadlineAtMs).toBe(5100);
    expect(passRow(passed, 200)).toEqual(passed);
    expect(selectFruit(passed, 'grape', 101).correctCount).toBe(1);
  });

  it('rejects leftmost-first input in approaching, moving, and passed phases', () => {
    const approaching = startRound(() => 0, sequence);
    const moving = revealRow(approaching);
    for (const round of [approaching, moving, passRow(moving, 100)]) {
      const failed = selectFruit(round, 'apple', 101);
      expect(failed.phase).toBe('failure');
      expect(failed.correctCount).toBe(0);
      expect(failed.feedback).toBe('incorrect');
    }
  });

  it('scores four ordered choices and succeeds before the row exits', () => {
    let round = startRound(() => 0, sequence);
    [...sequence].reverse().forEach((fruit, index) => {
      round = selectFruit(round, fruit, index);
      expect(round.correctCount).toBe(index + 1);
      expect(round.feedback).toBe('correct');
      expect(round.phase).toBe(index === 3 ? 'success' : 'approaching');
    });
    expect(round.deadlineAtMs).toBeNull();
    expect(selectFruit(round, 'apple', 5)).toEqual(round);
    expect(passRow(round, 100)).toEqual(round);
  });

  it('accepts the fourth correct choice just before expiry', () => {
    let round = revealRow(startRound(() => 0, sequence));
    for (const fruit of ['grape', 'cherry', 'banana'] as const) {
      round = selectFruit(round, fruit, 500);
    }
    round = passRow(round, 1000);
    expect(round.deadlineAtMs).toBe(6000);
    round = selectFruit(round, 'apple', 5999);
    expect(round.phase).toBe('success');
    expect(round.correctCount).toBe(4);
    expect(expireRound(round, 6000)).toEqual(round);
  });

  it('expires before evaluating a choice at the exact deadline', () => {
    let round = passRow(revealRow(startRound(() => 0, sequence)), 100);
    round = selectFruit(round, 'grape', 5100);
    expect(round.phase).toBe('failure');
    expect(round.feedback).toBe('expired');
    expect(round.correctCount).toBe(0);
    expect(selectFruit(round, 'grape', 5101)).toEqual(round);
  });

  it('shows five through one at the correct elapsed-second boundaries', () => {
    const passed = passRow(revealRow(startRound(() => 0, sequence)), 100);
    expect(secondsRemaining(passed, 100)).toBe(5);
    expect(secondsRemaining(passed, 1099)).toBe(5);
    expect(secondsRemaining(passed, 1100)).toBe(4);
    expect(secondsRemaining(passed, 2100)).toBe(3);
    expect(secondsRemaining(passed, 3100)).toBe(2);
    expect(secondsRemaining(passed, 4100)).toBe(1);
    expect(secondsRemaining(passed, 5099)).toBe(1);
    expect(secondsRemaining(passed, 5100)).toBe(0);
  });

  it('retains partial score when an incomplete countdown expires', () => {
    let round = selectFruit(startRound(() => 0, sequence), 'grape', 1);
    round = passRow(revealRow(round), 100);
    expect(expireRound(round, 5099)).toEqual(round);
    const expired = expireRound(round, 5100);
    expect(expired.phase).toBe('failure');
    expect(expired.correctCount).toBe(1);
    expect(expired.feedback).toBe('expired');
    expect(expireRound(expired, 5200)).toEqual(expired);
  });

  it('fails on the first wrong selection during the countdown without adding score', () => {
    let round = selectFruit(startRound(() => 0, sequence), 'grape', 1);
    round = passRow(revealRow(round), 100);
    round = selectFruit(round, 'apple', 101);
    expect(round.phase).toBe('failure');
    expect(round.correctCount).toBe(1);
    expect(round.feedback).toBe('incorrect');
    expect(selectFruit(round, 'cherry', 102)).toEqual(round);
  });

  it('counts rapid repeated fruits as separate right-to-left positions', () => {
    let round = startRound(() => 0, ['apple', 'banana', 'apple', 'apple']);
    round = selectFruit(round, 'apple', 1);
    round = selectFruit(round, 'apple', 1);
    expect(round.correctCount).toBe(2);
    expect(selectFruit(round, 'apple', 1).phase).toBe('failure');
  });

  it('replay creates a new round with no old deadline or feedback', () => {
    const expired = expireRound(passRow(revealRow(startRound(() => 0, sequence)), 100), 5100);
    const replayed = replayRound(expired, () => 0.75);
    expect(replayed.phase).toBe('approaching');
    expect(replayed.sequence).toEqual(Array(4).fill('grape'));
    expect(replayed.correctCount).toBe(0);
    expect(replayed.feedback).toBeNull();
    expect(replayed.deadlineAtMs).toBeNull();
    expect(expireRound(replayed, 99999)).toEqual(replayed);
    expect(replayRound(replayed, () => 0)).toEqual(replayed);
  });

  it('keeps score and outcome correct across 20 rounds with replay', () => {
    let round = createReadyRound();
    for (let game = 0; game < 20; game += 1) {
      const fruit = FRUITS[game % FRUITS.length];
      const wrong = FRUITS[(game + 1) % FRUITS.length];
      const random = () => (game % FRUITS.length) / FRUITS.length;
      round = game === 0 ? startRound(random) : replayRound(round, random);
      expect(round.sequence).toEqual(Array(4).fill(fruit));
      round = selectFruit(round, fruit, 1);
      round = passRow(revealRow(round), 100);
      round = selectFruit(round, fruit, 101);
      if (game % 2 === 0) {
        round = selectFruit(round, fruit, 102);
        round = selectFruit(round, fruit, 103);
        expect(round.phase).toBe('success');
        expect(round.correctCount).toBe(4);
      } else {
        round = selectFruit(round, wrong, 102);
        expect(round.phase).toBe('failure');
        expect(round.correctCount).toBe(2);
      }
    }
  });
});
