import './style.css';
import {
  FRUITS,
  createReadyRound,
  expireRound,
  passRow,
  replayRound,
  revealRow,
  secondsRemaining,
  selectFruit,
  startRound,
  type Fruit,
  type Phase,
} from './game';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Game mount element is missing');

const fruitDetails: Record<Fruit, { label: string; icon: string }> = {
  apple: { label: 'Apple', icon: '🍎' },
  banana: { label: 'Banana', icon: '🍌' },
  cherry: { label: 'Cherry', icon: '🍒' },
  grape: { label: 'Grape', icon: '🍇' },
};

const phaseLabels: Record<Phase, string> = {
  ready: 'Ready',
  approaching: 'Your turn: entering',
  moving: 'Your turn: moving',
  passed: 'Finish now',
  success: 'Success',
  failure: 'Try again',
};

let round = createReadyRound();
let activeAnimation: Animation | null = null;
let countdownTimer: number | null = null;
let staticTimer: number | null = null;
let roundToken = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

app.innerHTML = `
  <section class="game" aria-labelledby="game-title">
    <header class="game-header">
      <p class="eyebrow">Fruit memory game</p>
      <h1 id="game-title">Fruit Challenge</h1>
      <p class="instructions">Read the four fruits from right to left. Choose them as soon as the round starts. After the row leaves, you have five seconds to finish.</p>
    </header>
    <div class="status-row" aria-live="polite">
      <p><span class="status-label">Phase</span><strong id="phase"></strong></p>
      <p><span class="status-label">Progress</span><strong id="progress"></strong></p>
      <p><span class="status-label">Score</span><strong id="score"></strong></p>
    </div>
    <div class="playfield" aria-label="Fruit playfield">
      <div id="fruit-stage"></div>
      <div class="countdown-overlay" id="countdown" role="status" aria-live="polite" hidden>
        <strong class="countdown-number" id="countdown-number">5</strong>
        <span>seconds left</span>
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
    <div class="action-row" id="action-row"></div>
  </section>
`;

const phaseElement = app.querySelector<HTMLElement>('#phase')!;
const progressElement = app.querySelector<HTMLElement>('#progress')!;
const scoreElement = app.querySelector<HTMLElement>('#score')!;
const stageElement = app.querySelector<HTMLElement>('#fruit-stage')!;
const countdownElement = app.querySelector<HTMLElement>('#countdown')!;
const countdownNumberElement = app.querySelector<HTMLElement>('#countdown-number')!;
const captionElement = app.querySelector<HTMLElement>('#caption')!;
const feedbackElement = app.querySelector<HTMLElement>('#feedback')!;
const actionElement = app.querySelector<HTMLElement>('#action-row')!;
const fruitButtons = Array.from(app.querySelectorAll<HTMLButtonElement>('.fruit-button'));

function updateView(): void {
  phaseElement.textContent = reducedMotion.matches && round.phase === 'moving'
    ? 'Your turn'
    : phaseLabels[round.phase];
  progressElement.textContent = `${round.correctCount}/4`;
  scoreElement.textContent = String(round.correctCount);
  feedbackElement.textContent =
    round.feedback === 'correct' ? 'Correct choice!' :
    round.feedback === 'incorrect' ? 'Incorrect choice.' :
    round.feedback === 'expired' ? 'Time is up.' : '';
  feedbackElement.className = `feedback ${round.feedback ?? ''}`;

  const seconds = secondsRemaining(round, performance.now());
  countdownElement.hidden = seconds === 0;
  if (!countdownElement.hidden) {
    countdownNumberElement.textContent = String(seconds);
  }

  for (const button of fruitButtons) {
    button.disabled = round.phase !== 'approaching' && round.phase !== 'moving' && round.phase !== 'passed';
  }

  if (round.phase === 'ready') {
    captionElement.textContent = 'Start, then choose from right to left immediately.';
    actionElement.innerHTML = '<button class="action-button" data-action="start">Start</button>';
  } else if (round.phase === 'approaching') {
    captionElement.textContent = 'Choose from right to left as the fruits enter.';
    actionElement.innerHTML = '';
  } else if (round.phase === 'moving') {
    captionElement.textContent = 'Choose the fruits from right to left now.';
  } else if (round.phase === 'passed') {
    captionElement.textContent = 'Finish the sequence before the countdown ends.';
  } else {
    captionElement.textContent = round.phase === 'success'
      ? 'Success! You remembered them all.'
      : round.feedback === 'expired'
        ? 'Time is up! Try again.'
        : 'Try again! The order was different.';
    actionElement.innerHTML = '<button class="action-button" data-action="replay">Play again</button>';
  }
}

function stopMotion(): void {
  roundToken += 1;
  if (countdownTimer !== null) {
    window.clearTimeout(countdownTimer);
    countdownTimer = null;
  }
  if (staticTimer !== null) {
    window.clearTimeout(staticTimer);
    staticTimer = null;
  }
  if (activeAnimation) {
    const row = stageElement.querySelector<HTMLElement>('.fruit-row');
    const position = row ? getComputedStyle(row).transform : '';
    activeAnimation.cancel();
    if (row && position) row.style.transform = position;
  }
  activeAnimation = null;
}

function refreshCountdown(token: number): void {
  if (token !== roundToken || round.phase !== 'passed' || round.deadlineAtMs === null) return;

  const now = performance.now();
  round = expireRound(round, now);
  if (round.phase === 'failure') {
    stopMotion();
    updateView();
    actionElement.querySelector<HTMLButtonElement>('button')?.focus();
    return;
  }

  updateView();
  const remainingMs = round.deadlineAtMs! - now;
  const nextStepMs = remainingMs - (Math.ceil(remainingMs / 1000) - 1) * 1000;
  countdownTimer = window.setTimeout(() => {
    countdownTimer = null;
    refreshCountdown(token);
  }, Math.max(1, nextStepMs));
}

async function moveRow(row: HTMLElement, token: number): Promise<void> {
  const rowWidth = row.getBoundingClientRect().width;
  const fieldWidth = stageElement.clientWidth;
  const visibleTravel = fieldWidth - rowWidth;
  const speed = visibleTravel / 3500;
  const entranceTime = rowWidth / speed;
  const duration = (fieldWidth + rowWidth) / speed;
  row.style.left = '0';
  row.style.transform = `translateX(-${rowWidth}px)`;

  const animation = row.animate(
    [{ transform: `translateX(-${rowWidth}px)` }, { transform: `translateX(${fieldWidth}px)` }],
    { duration, easing: 'linear', fill: 'forwards' },
  );
  activeAnimation = animation;

  function checkVisibility(): void {
    if (token !== roundToken || activeAnimation !== animation) return;
    if (Number(animation.currentTime ?? 0) >= entranceTime) {
      round = revealRow(round);
      updateView();
    } else {
      window.requestAnimationFrame(checkVisibility);
    }
  }
  window.requestAnimationFrame(checkVisibility);

  try {
    await animation.finished;
  } catch {
    return;
  }
  if (token !== roundToken) return;
  row.style.transform = `translateX(${fieldWidth}px)`;
  animation.cancel();
  activeAnimation = null;
  round = revealRow(round);
  round = passRow(round, performance.now());
  refreshCountdown(token);
}

function beginRound(replay: boolean): void {
  stopMotion();
  round = replay ? replayRound(round) : startRound();
  stageElement.innerHTML = `<div class="fruit-row" aria-label="Fruit sequence">${round.sequence.map((fruit) => {
    const { label, icon } = fruitDetails[fruit];
    return `<div class="row-fruit" aria-label="${label}"><span class="fruit-icon" aria-hidden="true">${icon}</span><span class="fruit-name">${label}</span></div>`;
  }).join('')}</div>`;
  updateView();
  const row = stageElement.querySelector<HTMLElement>('.fruit-row')!;
  if (reducedMotion.matches) {
    round = revealRow(round);
    updateView();
    const token = roundToken;
    staticTimer = window.setTimeout(() => {
      staticTimer = null;
      if (token !== roundToken || round.phase !== 'moving') return;
      round = passRow(round, performance.now());
      refreshCountdown(token);
    }, 3000);
  } else {
    void moveRow(row, roundToken);
  }
}

app.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>('button');
  if (!button || button.disabled) return;

  if (button.dataset.action === 'start' && round.phase === 'ready') {
    beginRound(false);
    return;
  }
  if (button.dataset.action === 'replay' && (round.phase === 'success' || round.phase === 'failure')) {
    beginRound(true);
    return;
  }
  const fruit = button.dataset.fruit as Fruit | undefined;
  if (fruit && FRUITS.includes(fruit)) {
    round = selectFruit(round, fruit, performance.now());
    if (round.phase === 'success' || round.phase === 'failure') stopMotion();
    updateView();
    if (round.phase === 'success' || round.phase === 'failure') {
      actionElement.querySelector<HTMLButtonElement>('button')?.focus();
    }
  }
});

updateView();
