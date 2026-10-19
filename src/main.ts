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
import { classifyTransition, type PresentationEvent, type TransitionSource } from './presentation';
import { SoundController } from './audio';
import { HighscoreBoard, HighscoreTracker, isNewRecord } from './highscore';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Game mount element is missing');

const fruitDetails: Record<Fruit, { label: string; image: string }> = {
  apple: { label: 'Apple', image: '/fruits/apple.svg' },
  banana: { label: 'Banana', image: '/fruits/banana.svg' },
  grape: { label: 'Grape', image: '/fruits/grape.svg' },
  orange: { label: 'Orange', image: '/fruits/orange.svg' },
};

let game: Game = createReadyGame();
let activeAnimation: Animation | null = null;
let frameId: number | null = null;
let staticTimer: number | null = null;
let roundToken = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sound = new SoundController();
const highscores = new HighscoreTracker();
const board = new HighscoreBoard(undefined, highscores.best);
highscores.record(board.entries[0]?.score ?? 0);
let startingBest = highscores.best;
let runSubmitted = false;
let submissionMessage = '';

app.innerHTML = `
  <section class="game" aria-labelledby="game-title">
    <header class="game-header">
      <p class="eyebrow">Fruit memory game</p>
      <button class="sound-button" id="sound-button" data-action="sound" type="button" aria-label="Mute sound" aria-pressed="false">
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path class="speaker-shape" d="M8 18h8l10-8v28l-10-8H8z" />
          <path class="sound-waves" d="M31 17c4 3 4 11 0 14m5-19c7 6 7 18 0 24" />
          <path class="sound-slash" d="M8 8l32 32" />
        </svg>
      </button>
      <h1 id="game-title">Fruit Rush</h1>
      <p class="instructions">Choose the moving fruits from right to left, in order, before they reach the right boundary. Wrong choices and missed fruits cost a life.</p>
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
      <div class="ready-panel" id="ready-panel">
        <strong>Ready to rush?</strong>
        <span>Pick the rightmost fruit first before the row reaches the right edge.</span>
        <span class="ready-highscore">Highscore <strong id="ready-highscore">0</strong></span>
      </div>
      <div class="game-over" id="game-over" role="alertdialog" aria-labelledby="game-over-title" hidden>
        <h2 id="game-over-title">Game Over</h2>
        <p class="final-stat">Final score <strong id="final-score">0</strong></p>
        <p class="final-stat">Highscore <strong id="final-highscore">0</strong></p>
        <p class="final-stat">Rounds reached <strong id="final-round">1</strong></p>
        <p class="new-record" id="new-record" hidden>New highscore!</p>
        <form class="name-form" id="name-form">
          <label for="player-name">Your name</label>
          <div class="name-form-row">
            <input id="player-name" name="player-name" type="text" autocomplete="off" aria-describedby="name-message">
            <button class="action-button" id="save-score" type="submit">Save score</button>
          </div>
          <p id="name-message" class="name-message" role="status" aria-live="polite"></p>
        </form>
        <button class="action-button" data-action="restart">Play Again</button>
      </div>
      <p class="playfield-caption" id="caption"></p>
    </div>
    <p class="feedback" id="feedback" role="status" aria-live="polite"></p>
    <div class="action-row">
      <button class="action-button" id="start-button" data-action="start">Start Game</button>
    </div>
    <section class="ranking-panel" id="ready-ranking" aria-labelledby="ready-ranking-title">
      <h2 id="ready-ranking-title">Top 10 highscores</h2>
      <ol class="ranking-list" id="ready-ranking-list"></ol>
    </section>
    <section class="ranking-panel" id="over-ranking" aria-labelledby="over-ranking-title" hidden>
      <h2 id="over-ranking-title">Top 10 highscores</h2>
      <ol class="ranking-list" id="over-ranking-list"></ol>
    </section>
    <div class="fruit-controls" role="group" aria-label="Fruit choices">
      ${FRUITS.map((fruit) => {
        const { label, image } = fruitDetails[fruit];
        return `<button class="fruit-button" data-fruit="${fruit}" aria-label="${label}" disabled><img src="${image}" alt="" aria-hidden="true"></button>`;
      }).join('')}
    </div>
  </section>
`;

const scoreElement = app.querySelector<HTMLElement>('#score')!;
const gameElement = app.querySelector<HTMLElement>('.game')!;
const scorePanel = app.querySelector<HTMLElement>('.score')!;
const livesElement = app.querySelector<HTMLElement>('#lives')!;
const livesPanel = app.querySelector<HTMLElement>('#lives-panel')!;
const roundElement = app.querySelector<HTMLElement>('#round-number')!;
const progressElement = app.querySelector<HTMLElement>('#progress')!;
const speedElement = app.querySelector<HTMLElement>('#speed')!;
const stageElement = app.querySelector<HTMLElement>('#fruit-stage')!;
const playfieldElement = app.querySelector<HTMLElement>('.playfield')!;
const readyPanel = app.querySelector<HTMLElement>('#ready-panel')!;
const gameOverElement = app.querySelector<HTMLElement>('#game-over')!;
const finalScoreElement = app.querySelector<HTMLElement>('#final-score')!;
const readyHighscoreElement = app.querySelector<HTMLElement>('#ready-highscore')!;
const finalHighscoreElement = app.querySelector<HTMLElement>('#final-highscore')!;
const finalRoundElement = app.querySelector<HTMLElement>('#final-round')!;
const newRecordElement = app.querySelector<HTMLElement>('#new-record')!;
const captionElement = app.querySelector<HTMLElement>('#caption')!;
const feedbackElement = app.querySelector<HTMLElement>('#feedback')!;
const startButton = app.querySelector<HTMLButtonElement>('#start-button')!;
const soundButton = app.querySelector<HTMLButtonElement>('#sound-button')!;
const actionRowElement = app.querySelector<HTMLElement>('.action-row')!;
const restartButton = app.querySelector<HTMLButtonElement>('[data-action="restart"]')!;
const nameForm = app.querySelector<HTMLFormElement>('#name-form')!;
const nameInput = app.querySelector<HTMLInputElement>('#player-name')!;
const nameMessage = app.querySelector<HTMLElement>('#name-message')!;
const saveScoreButton = app.querySelector<HTMLButtonElement>('#save-score')!;
const readyRanking = app.querySelector<HTMLElement>('#ready-ranking')!;
const overRanking = app.querySelector<HTMLElement>('#over-ranking')!;
const rankingLists = [
  app.querySelector<HTMLOListElement>('#ready-ranking-list')!,
  app.querySelector<HTMLOListElement>('#over-ranking-list')!,
];
const fruitButtons = Array.from(app.querySelectorAll<HTMLButtonElement>('.fruit-button'));
const effectTimers = new Map<HTMLElement, number>();
let temporaryOverlay: HTMLElement | null = null;
let overlayTimer: number | null = null;

function renderSoundState(): void {
  soundButton.setAttribute('aria-label', sound.isMuted ? 'Unmute sound' : 'Mute sound');
  soundButton.setAttribute('aria-pressed', String(sound.isMuted));
}

function renderRankings(): void {
  const entries = board.entries;
  for (const list of rankingLists) {
    list.replaceChildren();
    if (entries.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'ranking-empty';
      empty.textContent = 'No scores saved yet.';
      list.append(empty);
      continue;
    }
    entries.forEach((entry, index) => {
      const row = document.createElement('li');
      row.className = 'ranking-row';
      const rank = document.createElement('span');
      rank.className = 'ranking-rank';
      rank.textContent = `${index + 1}.`;
      const name = document.createElement('span');
      name.className = 'ranking-name';
      name.textContent = entry.name ?? 'Legacy record';
      const score = document.createElement('strong');
      score.className = 'ranking-score';
      score.textContent = String(entry.score);
      row.append(rank, name, score);
      list.append(row);
    });
  }
}

function flash(element: HTMLElement, effect: string, duration: number): void {
  const previousTimer = effectTimers.get(element);
  if (previousTimer !== undefined) window.clearTimeout(previousTimer);
  element.classList.remove('effect-correct', 'effect-incorrect', 'effect-score', 'effect-life', 'effect-over');
  void element.offsetWidth;
  element.classList.add(effect);
  const timer = window.setTimeout(() => {
    element.classList.remove(effect);
    effectTimers.delete(element);
  }, duration);
  effectTimers.set(element, timer);
}

function clearVisualEffects(): void {
  for (const [element, timer] of effectTimers) {
    window.clearTimeout(timer);
    element.classList.remove('effect-correct', 'effect-incorrect', 'effect-score', 'effect-life', 'effect-over');
  }
  effectTimers.clear();
  if (overlayTimer !== null) window.clearTimeout(overlayTimer);
  overlayTimer = null;
  temporaryOverlay?.remove();
  temporaryOverlay = null;
}

function showTemporaryOverlay(element: HTMLElement, duration: number): void {
  if (overlayTimer !== null) window.clearTimeout(overlayTimer);
  temporaryOverlay?.remove();
  temporaryOverlay = element;
  playfieldElement.append(element);
  overlayTimer = window.setTimeout(() => {
    element.remove();
    if (temporaryOverlay === element) temporaryOverlay = null;
    overlayTimer = null;
  }, duration);
}

function presentTransition(event: PresentationEvent, echo: { image: string; x: number; y: number } | null): void {
  feedbackElement.dataset.event = event.kind;
  if (event.inputOutcome !== 'missed' && event.fruit) {
    const button = fruitButtons.find((item) => item.dataset.fruit === event.fruit);
    if (button) flash(button, event.inputOutcome === 'correct' ? 'effect-correct' : 'effect-incorrect', 280);
  }
  if (event.scoreGain > 0) flash(scorePanel, 'effect-score', 320);
  if (event.livesLost > 0) flash(livesPanel, 'effect-life', 300);

  if (event.inputOutcome === 'correct' && event.kind === 'correct' && event.positionIndex !== null) {
    stageElement.querySelectorAll<HTMLElement>('.row-fruit')[event.positionIndex]?.classList.add('vanishing');
  }
  if (event.kind === 'round-complete') {
    const overlay = document.createElement('div');
    overlay.className = 'round-result';
    overlay.setAttribute('aria-hidden', 'true');
    const label = document.createElement('div');
    label.className = 'round-celebration';
    label.textContent = 'Round complete! +25';
    overlay.append(label);
    if (echo && !reducedMotion.matches) {
      const image = document.createElement('img');
      image.className = 'fruit-echo';
      image.src = echo.image;
      image.alt = '';
      image.style.left = `${echo.x}px`;
      image.style.top = `${echo.y}px`;
      overlay.append(image);
    }
    showTemporaryOverlay(overlay, 600);
  }
  if (event.kind === 'game-over') flash(gameOverElement, 'effect-over', 320);
  sound.play(event.kind);
}

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

  captionElement.textContent = game.status === 'playing'
      ? 'Choose from right to left before the fruits leave.'
      : '';
  startButton.hidden = game.status !== 'ready';
  actionRowElement.hidden = game.status !== 'ready';
  readyPanel.hidden = game.status !== 'ready';
  gameElement.classList.toggle('game-over-state', game.status === 'game-over');
  gameOverElement.hidden = game.status !== 'game-over';
  readyRanking.hidden = game.status !== 'ready';
  overRanking.hidden = game.status !== 'game-over';
  readyHighscoreElement.textContent = String(highscores.best);
  finalScoreElement.textContent = String(game.score);
  finalHighscoreElement.textContent = String(highscores.best);
  finalRoundElement.textContent = String(game.roundNumber);
  newRecordElement.hidden = game.status !== 'game-over' || !isNewRecord(game.score, startingBest);
  nameInput.disabled = game.status !== 'game-over' || runSubmitted;
  saveScoreButton.disabled = game.status !== 'game-over' || runSubmitted;
  nameMessage.textContent = submissionMessage;
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
  highscores.record(game.score);
  if (game.status === 'game-over') {
    stopMotion();
    clearVisualEffects();
    sound.stopMusic();
    sound.stopActive();
    stageElement.innerHTML = '';
    render();
    nameInput.focus();
    return false;
  }
  if (game.roundNumber !== previousRoundNumber) {
    beginCurrentRound();
    return false;
  }
  render();
  return true;
}

function acceptTransition(next: Game, source: TransitionSource): boolean {
  const event = classifyTransition(game, next, source);
  let echo: { image: string; x: number; y: number } | null = null;
  if (event?.kind === 'round-complete' && event.positionIndex !== null) {
    const slot = stageElement.querySelectorAll<HTMLElement>('.row-fruit')[event.positionIndex];
    const image = slot?.querySelector<HTMLImageElement>('img');
    if (image) {
      const imageRect = image.getBoundingClientRect();
      const fieldRect = playfieldElement.getBoundingClientRect();
      echo = {
        image: image.src,
        x: Math.max(8, Math.min(imageRect.left - fieldRect.left, fieldRect.width - 64)),
        y: Math.max(8, Math.min(imageRect.top - fieldRect.top, fieldRect.height - 64)),
      };
    }
  }
  const continues = acceptGame(next);
  if (event) presentTransition(event, echo);
  return continues;
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
    if (!acceptTransition(missFruit(game, position.index), { kind: 'miss', index: position.index })) return;
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
    const { label, image } = fruitDetails[fruit];
    return `<div class="row-fruit" role="img" aria-label="${label}"><img class="fruit-icon" src="${image}" alt="" aria-hidden="true"></div>`;
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
        if (!acceptTransition(missFruit(game, position.index), { kind: 'miss', index: position.index })) return;
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
    clearVisualEffects();
    sound.unlockFromGesture();
    startingBest = highscores.best;
    runSubmitted = false;
    submissionMessage = '';
    nameInput.value = '';
    game = startGame();
    sound.startMusic();
    beginCurrentRound();
    return;
  }
  if (button.dataset.action === 'restart' && game.status === 'game-over') {
    clearVisualEffects();
    sound.stopMusic();
    sound.stopActive();
    sound.unlockFromGesture();
    startingBest = highscores.best;
    runSubmitted = false;
    submissionMessage = '';
    nameInput.value = '';
    game = startGame();
    sound.startMusic();
    beginCurrentRound();
    return;
  }

  if (button.dataset.action === 'sound') {
    sound.setMuted(!sound.isMuted);
    if (!sound.isMuted) sound.unlockFromGesture();
    renderSoundState();
    return;
  }

  const fruit = button.dataset.fruit as Fruit | undefined;
  if (fruit && FRUITS.includes(fruit) && game.status === 'playing') {
    sound.unlockFromGesture();
    const token = roundToken;
    if (activeAnimation) resolvePending(token);
    if (token !== roundToken || game.status !== 'playing') return;
    acceptTransition(chooseFruit(game, fruit), { kind: 'choice', fruit });
  }
});

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (game.status !== 'game-over' || runSubmitted) return;
  const result = board.submit(nameInput.value, game.score);
  if (result.status === 'invalid-name' || result.status === 'invalid-score') {
    submissionMessage = result.message;
    render();
    nameInput.focus();
    return;
  }
  runSubmitted = true;
  submissionMessage = result.status === 'ranked'
    ? `${result.name} — ${result.score} points saved.`
    : 'Score saved, but it did not enter the top ten.';
  renderRankings();
  render();
  restartButton.focus();
});

render();
renderRankings();
renderSoundState();
window.addEventListener('pagehide', () => sound.dispose());
