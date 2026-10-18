export const FRUITS = ['apple', 'banana', 'cherry', 'grape'] as const;

export type Fruit = (typeof FRUITS)[number];
export type Phase = 'ready' | 'approaching' | 'moving' | 'passed' | 'success' | 'failure';
export type Feedback = 'correct' | 'incorrect' | 'expired' | null;

export interface Round {
  sequence: readonly Fruit[];
  phase: Phase;
  correctCount: number;
  feedback: Feedback;
  deadlineAtMs: number | null;
}

export function createReadyRound(): Round {
  return {
    sequence: [],
    phase: 'ready',
    correctCount: 0,
    feedback: null,
    deadlineAtMs: null,
  };
}

export function generateSequence(random: () => number = Math.random): Fruit[] {
  return Array.from({ length: 4 }, () => {
    const draw = random();
    if (draw < 0 || draw >= 1 || !Number.isFinite(draw)) {
      throw new RangeError('Random draw must be between 0 and 1');
    }
    return FRUITS[Math.floor(draw * FRUITS.length)];
  });
}

export function startRound(
  random: () => number = Math.random,
  sequence: readonly Fruit[] = generateSequence(random),
): Round {
  if (sequence.length !== 4 || sequence.some((fruit) => !FRUITS.includes(fruit))) {
    throw new Error('A round needs exactly four valid fruits');
  }

  return {
    sequence: [...sequence],
    phase: 'approaching',
    correctCount: 0,
    feedback: null,
    deadlineAtMs: null,
  };
}

export function revealRow(round: Round): Round {
  return round.phase === 'approaching' ? { ...round, phase: 'moving' } : round;
}

export function passRow(round: Round, exitAtMs: number): Round {
  return round.phase === 'moving'
    ? { ...round, phase: 'passed', deadlineAtMs: exitAtMs + 5000 }
    : round;
}

export function expireRound(round: Round, nowMs: number): Round {
  if (round.phase !== 'passed' || round.deadlineAtMs === null || nowMs < round.deadlineAtMs) {
    return round;
  }
  return { ...round, phase: 'failure', feedback: 'expired' };
}

export function secondsRemaining(round: Round, nowMs: number): number {
  if (round.phase !== 'passed' || round.deadlineAtMs === null) return 0;
  return Math.max(0, Math.ceil((round.deadlineAtMs - nowMs) / 1000));
}

export function selectFruit(round: Round, fruit: Fruit, nowMs: number): Round {
  const current = expireRound(round, nowMs);
  if (current.phase !== 'approaching' && current.phase !== 'moving' && current.phase !== 'passed') {
    return current;
  }
  if (fruit !== current.sequence[current.sequence.length - 1 - current.correctCount]) {
    return { ...current, phase: 'failure', feedback: 'incorrect' };
  }

  const correctCount = current.correctCount + 1;
  return {
    ...current,
    correctCount,
    feedback: 'correct',
    phase: correctCount === current.sequence.length ? 'success' : current.phase,
  };
}

export function replayRound(
  round: Round,
  random: () => number = Math.random,
): Round {
  if (round.phase !== 'success' && round.phase !== 'failure') {
    return round;
  }
  return startRound(random);
}
