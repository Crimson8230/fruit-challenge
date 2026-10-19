export const HIGHSCORE_KEY = 'fruit-rush.highscore.v1';

function browserStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function parseBest(raw: string | null): number {
  if (raw === null || !/^(0|[1-9][0-9]*)$/.test(raw)) return 0;
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : 0;
}

export function isNewRecord(score: number, startingBest: number): boolean {
  return score > startingBest;
}

export class HighscoreTracker {
  private value = 0;

  constructor(private readonly getStorage: () => Storage | null = browserStorage) {
    try {
      this.value = parseBest(this.getStorage()?.getItem(HIGHSCORE_KEY) ?? null);
    } catch {
      this.value = 0;
    }
  }

  get best(): number {
    return this.value;
  }

  record(score: number): boolean {
    if (!Number.isSafeInteger(score) || score < 0 || score <= this.value) return false;
    this.value = score;
    try {
      this.getStorage()?.setItem(HIGHSCORE_KEY, String(score));
    } catch {
      // The current page still retains the new best.
    }
    return true;
  }
}
