export const FRUITS = ['apple', 'banana', 'cherry', 'grape'] as const;

export type Fruit = (typeof FRUITS)[number];
export type PositionStatus = 'pending' | 'selected' | 'missed';
export type GameStatus = 'ready' | 'playing' | 'game-over';
export type GameFeedback = 'correct' | 'incorrect' | 'missed' | 'round-complete' | 'round-missed' | null;

export interface FruitPosition {
  readonly index: number;
  readonly fruit: Fruit;
  readonly status: PositionStatus;
}

export interface Round {
  readonly positions: readonly FruitPosition[];
}

export interface Game {
  readonly status: GameStatus;
  readonly score: number;
  readonly lives: number;
  readonly roundNumber: number;
  readonly round: Round | null;
  readonly feedback: GameFeedback;
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

function createGameRound(sequence: readonly Fruit[]): Round {
  if (sequence.length !== 4 || sequence.some((fruit) => !FRUITS.includes(fruit))) {
    throw new Error('A round needs exactly four valid fruits');
  }
  return {
    positions: sequence.map((fruit, index) => ({ index, fruit, status: 'pending' })),
  };
}

export function createReadyGame(): Game {
  return {
    status: 'ready',
    score: 0,
    lives: 3,
    roundNumber: 1,
    round: null,
    feedback: null,
  };
}

export function startGame(
  random: () => number = Math.random,
  sequence: readonly Fruit[] = generateSequence(random),
): Game {
  return {
    status: 'playing',
    score: 0,
    lives: 3,
    roundNumber: 1,
    round: createGameRound(sequence),
    feedback: null,
  };
}

function finishRound(game: Game, random: () => number): Game {
  if (!game.round || game.round.positions.some((position) => position.status === 'pending')) {
    return game;
  }
  const clean = game.round.positions.every((position) => position.status === 'selected');
  return {
    ...game,
    score: game.score + (clean ? 25 : 0),
    roundNumber: game.roundNumber + 1,
    round: createGameRound(generateSequence(random)),
    feedback: clean ? 'round-complete' : 'round-missed',
  };
}

function loseLife(game: Game, feedback: 'incorrect' | 'missed'): Game {
  const lives = Math.max(0, game.lives - 1);
  return {
    ...game,
    lives,
    status: lives === 0 ? 'game-over' : 'playing',
    feedback,
  };
}

export function chooseFruit(
  game: Game,
  fruit: Fruit,
  random: () => number = Math.random,
): Game {
  if (game.status !== 'playing' || !game.round) return game;

  let index = game.round.positions.length - 1;
  while (index >= 0 && game.round.positions[index].status !== 'pending') index -= 1;
  if (index < 0) return game;
  if (game.round.positions[index].fruit !== fruit) return loseLife(game, 'incorrect');

  const positions = game.round.positions.map((position) =>
    position.index === index ? { ...position, status: 'selected' as const } : position,
  );
  return finishRound({
    ...game,
    round: { positions },
    score: game.score + 10,
    feedback: 'correct',
  }, random);
}

export function missFruit(
  game: Game,
  index: number,
  random: () => number = Math.random,
): Game {
  if (game.status !== 'playing' || !game.round) return game;
  if (!Number.isInteger(index) || index < 0 || index >= game.round.positions.length) return game;
  if (game.round.positions[index].status !== 'pending') return game;

  const positions = game.round.positions.map((position) =>
    position.index === index ? { ...position, status: 'missed' as const } : position,
  );
  const afterMiss = loseLife({ ...game, round: { positions } }, 'missed');
  return afterMiss.status === 'game-over' ? afterMiss : finishRound(afterMiss, random);
}
