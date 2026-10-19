import type { Fruit, Game } from './game';

export type TransitionSource =
  | { readonly kind: 'choice'; readonly fruit: Fruit }
  | { readonly kind: 'miss'; readonly index: number };

export type PresentationKind = 'correct' | 'round-complete' | 'incorrect' | 'missed' | 'game-over';
export type InputOutcome = 'correct' | 'incorrect' | 'missed';

export interface PresentationEvent {
  readonly kind: PresentationKind;
  readonly inputOutcome: InputOutcome;
  readonly positionIndex: number | null;
  readonly fruit: Fruit | null;
  readonly scoreGain: number;
  readonly livesLost: number;
  readonly roundNumber: number;
}

export function classifyTransition(
  before: Game,
  after: Game,
  source: TransitionSource,
): PresentationEvent | null {
  if (before === after || before.status !== 'playing' || !before.round) return null;

  const scoreGain = after.score - before.score;
  const livesLost = before.lives - after.lives;
  const positionIndex = source.kind === 'miss'
    ? source.index
    : [...before.round.positions].reverse().find((position) => position.status === 'pending')?.index ?? null;
  const inputOutcome: InputOutcome = source.kind === 'miss'
    ? 'missed'
    : scoreGain > 0 ? 'correct' : 'incorrect';

  let kind: PresentationKind;
  if (after.status === 'game-over') kind = 'game-over';
  else if (inputOutcome === 'correct' && after.feedback === 'round-complete') kind = 'round-complete';
  else if (inputOutcome === 'correct') kind = 'correct';
  else if (inputOutcome === 'incorrect') kind = 'incorrect';
  else kind = 'missed';

  return {
    kind,
    inputOutcome,
    positionIndex,
    fruit: source.kind === 'choice' ? source.fruit : before.round.positions[source.index]?.fruit ?? null,
    scoreGain,
    livesLost,
    roundNumber: before.roundNumber,
  };
}
