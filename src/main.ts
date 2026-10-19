import './style.css';
import {
  FRUITS,
  chooseFruit,
  createReadyGame,
  getRoundDifficulty,
  missFruit,
  startGame,
  type Fruit,
  type Game,
} from './game';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Game mount element is missing');

const fruitDetails: Record<Fruit, { label: string; icon: string }> = {
  apple: { label: 'Apple', icon: '🍎' },
  banana: { label: 'Banana', icon: '🍌' },
  grape: { label: 'Grape', icon: '🍇' },
  orange: { label: 'Orange', icon: '🍊' },
};

let game: Game = createReadyGame();
let activeAnimation: Animation | null = null;
let frameId: number | null = null;
let staticTimer: number | null = null;
let roundToken = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

app.innerHTML = `
  <section class="game" aria-labelledby="game-title">
    <header class="game-header">
      <p class="eyebrow">Fruit memory game</p>
      <h1 id="game-title">Fruit Challenge</h1>
      <p class="instructions">Read the fruits from right to left. Choose them as soon as the round starts. Wrong choices and missed fruits cost a life.</p>
    </header>
    <div class="status-row" aria-live="polite">
      <p class="score"><span class="status-label">Score</span><strong id="score">0</strong></p>
      <p class="lives" id="lives-panel"><span class="status-label">Lives</span><strong id="lives">3</strong></p>
      <p><span class="status-label">Round</span><strong id="round-number">1</strong></p>
      <p><span class="status-label">Selected</span><strong id="progress">0/3</strong></p>
      <p><span class="status-label">Speed</span><strong id="speed">100%</strong></p>
    </div>
    <div class="playfield" aria-label="Fruit playfield">
      <div id="fruit-stage"></div>
      <div class="game-over" id="game-over" role="alertdialog" aria-labelledby="game-over-title" hidden>
        <h2 id="game-over-title">Game Over</h2>
        <p>Final score: <strong id="final-score">0</strong></p>
        <p>Rounds reached: <strong id="final-round">1</strong></p>
        <button class="action-button" data-action="restart">Play Again</button>
      </div>
      <p class="playfield-caption" id="caption"></p>
    </div>
    <p class="feedback" id="feedback" role="status" aria-live="polite"></p>
    <div class="fruit-controls" role="group" aria-label="Fruit choices">
      ${FRUITS.map((fruit) => {
        const { label, icon } = fruitDetails[fruit];
        return `<button class="fruit-button" data-fruit="${fruit}" disabled><span aria-hidden="true">${icon}</span><span>${label}</span></button>`;
      }).join('')}
    </div>
    <div class="action-row">
      <button class="action-button" id="start-button" data-action="start">Start</button>
    </div>
  </section>
`;

const scoreElement = app.querySelector<HTMLElement>('#score')!;
const livesElement = app.querySelector<HTMLElement>('#lives')!;
const livesPanel = app.querySelector<HTMLElement>('#lives-panel')!;
const roundElement = app.querySelector<HTMLElement>('#round-number')!;
const progressElement = app.querySelector<HTMLElement>('#progress')!;
const speedElement = app.querySelector<HTMLElement>('#speed')!;
const stageElement = app.querySelector<HTMLElement>('#fruit-stage')!;
const gameOverElement = app.querySelector<HTMLElement>('#game-over')!;
const finalScoreElement = app.querySelector<HTMLElement>('#final-score')!;
const finalRoundElement = app.querySelector<HTMLElement>('#final-round')!;
const captionElement = app.querySelector<HTMLElement>('#caption')!;
const feedbackElement = app.querySelector<HTMLElement>('#feedback')!;
const startButton = app.querySelector<HTMLButtonElement>('#start-button')!;
const actionRowElement = app.querySelector<HTMLElement>('.action-row')!;
const restartButton = app.querySelector<HTMLButtonElement>('[data-action="restart"]')!;
const fruitButtons = Array.from(app.querySelectorAll<HTMLButtonElement>('.fruit-button'));

function render(): void {
  const difficulty = getRoundDifficulty(game.roundNumber);
  scoreElement.textContent = String(game.score);
  livesElement.textContent = `${game.lives} ${'♥'.repeat(game.lives)}`.trim();
  roundElement.textContent = String(game.roundNumber);
  progressElement.textContent = `${game.round?.positions.filter((position) => position.status === 'selected').length ?? 0}/${difficulty.fruitCount}`;
  speedElement.textContent = `${difficulty.speedPercent}%`;
  livesPanel.classList.toggle('lost', game.feedback === 'incorrect' || game.feedback === 'missed');

  const messages = {
    correct: 'Correct! +10 points.',
    incorrect: 'Incorrect choice. -1 life.',
    missed: 'Missed fruit. -1 life.',
    'round-complete': 'Round complete! +25 bonus. Next round.',
    'round-missed': 'A missed fruit cost a life. No bonus; next round.',
  };
  feedbackElement.textContent = game.feedback ? messages[game.feedback] : '';
  feedbackElement.className = `feedback ${game.feedback ?? ''}`;

  captionElement.textContent = game.status === 'ready'
    ? 'Start, then choose from right to left immediately.'
    : game.status === 'playing'
      ? 'Choose from right to left before the fruits leave.'
      : '';
  startButton.hidden = game.status !== 'ready';
  actionRowElement.hidden = game.status !== 'ready';
  gameOverElement.hidden = game.status !== 'game-over';
  finalScoreElement.textContent = String(game.score);
  finalRoundElement.textContent = String(game.roundNumber);
  for (const button of fruitButtons) button.disabled = game.status !== 'playing';

  const slots = stageElement.querySelectorAll<HTMLElement>('.row-fruit');
  game.round?.positions.forEach((position) => {
    slots[position.index]?.classList.toggle('selected', position.status === 'selected');
    slots[position.index]?.classList.toggle('missed', position.status === 'missed');
  });
}

function stopMotion(): void {
  roundToken += 1;
  if (frameId !== null) {
    window.cancelAnimationFrame(frameId);
    frameId = null;
  }
  if (staticTimer !== null) {
    window.clearTimeout(staticTimer);
    staticTimer = null;
  }
  activeAnimation?.cancel();
  activeAnimation = null;
}

function acceptGame(next: Game): boolean {
  if (next === game) return true;
  const previousRoundNumber = game.roundNumber;
  game = next;
  if (game.status === 'game-over') {
    stopMotion();
    stageElement.innerHTML = '';
    render();
    restartButton.focus();
    return false;
  }
  if (game.roundNumber !== previousRoundNumber) {
    beginCurrentRound();
    return false;
  }
  render();
  return true;
}

function resolvePending(token: number, force = false): void {
  if (token !== roundToken || game.status !== 'playing' || !game.round) return;
  const row = stageElement.querySelector<HTMLElement>('.fruit-row');
  if (!row) return;
  const slots = Array.from(row.querySelectorAll<HTMLElement>('.row-fruit'));
  const boundary = stageElement.getBoundingClientRect().right;
  const pending = game.round.positions.filter((position) => position.status === 'pending');
  if (!pending.length || (!force && slots[pending[0].index].getBoundingClientRect().left < boundary)) return;

  for (const position of pending) {
    if (token !== roundToken || game.status !== 'playing') return;
    if (!force && slots[position.index].getBoundingClientRect().left < boundary) return;
    if (!acceptGame(missFruit(game, position.index))) return;
  }
}

async function moveRow(row: HTMLElement, token: number): Promise<void> {
  const rowWidth = row.getBoundingClientRect().width;
  const fieldWidth = stageElement.clientWidth;
  const speed = (0.45 * fieldWidth / 3500) * (getRoundDifficulty(game.roundNumber).speedPercent / 100);
  const entranceTime = rowWidth / speed;
  const duration = (fieldWidth + rowWidth) / speed;
  row.style.left = '0';
  row.style.translate = '0 -50%';
  row.style.transform = `translateX(-${rowWidth}px)`;

  const animation = row.animate(
    [{ transform: `translateX(-${rowWidth}px)` }, { transform: `translateX(${fieldWidth}px)` }],
    { duration, easing: 'linear', fill: 'forwards' },
  );
  activeAnimation = animation;

  function checkBoundary(): void {
    if (token !== roundToken || activeAnimation !== animation) return;
    if (Number(animation.currentTime ?? 0) >= entranceTime) {
      captionElement.textContent = 'Choose the fruits from right to left now.';
    }
    resolvePending(token);
    if (token === roundToken && activeAnimation === animation) {
      frameId = window.requestAnimationFrame(checkBoundary);
    }
  }
  frameId = window.requestAnimationFrame(checkBoundary);

  try {
    await animation.finished;
  } catch {
    return;
  }
  if (token !== roundToken) return;
  resolvePending(token, true);
}

function beginCurrentRound(): void {
  stopMotion();
  if (game.status !== 'playing' || !game.round) return;
  stageElement.innerHTML = `<div class="fruit-row" aria-label="Fruit sequence">${game.round.positions.map(({ fruit }) => {
    const { label, icon } = fruitDetails[fruit];
    return `<div class="row-fruit" aria-label="${label}"><span class="fruit-icon" aria-hidden="true">${icon}</span><span class="fruit-name">${label}</span></div>`;
  }).join('')}</div>`;
  render();
  const row = stageElement.querySelector<HTMLElement>('.fruit-row')!;
  const token = roundToken;
  if (reducedMotion.matches) {
    staticTimer = window.setTimeout(() => {
      staticTimer = null;
      if (token !== roundToken || game.status !== 'playing' || !game.round) return;
      for (const position of game.round.positions.filter((item) => item.status === 'pending')) {
        if (token !== roundToken || game.status !== 'playing') return;
        if (!acceptGame(missFruit(game, position.index))) return;
      }
    }, 3000);
  } else {
    void moveRow(row, token);
  }
}

app.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>('button');
  if (!button || button.disabled) return;

  if (button.dataset.action === 'start' && game.status === 'ready') {
    game = startGame();
    beginCurrentRound();
    return;
  }
  if (button.dataset.action === 'restart' && game.status === 'game-over') {
    game = startGame();
    beginCurrentRound();
    return;
  }

  const fruit = button.dataset.fruit as Fruit | undefined;
  if (fruit && FRUITS.includes(fruit) && game.status === 'playing') {
    const token = roundToken;
    if (activeAnimation) resolvePending(token);
    if (token !== roundToken || game.status !== 'playing') return;
    acceptGame(chooseFruit(game, fruit));
  }
});

render();
