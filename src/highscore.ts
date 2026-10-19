export const HIGHSCORE_KEY = 'fruit-rush.highscore.v1';
export const HIGHSCORES_KEY = 'fruit-rush.highscores.v2';

export type HighscoreEntry = {
  name: string | null;
  score: number;
  order: number;
};

type RankingSnapshot = { version: 2; entries: HighscoreEntry[]; nextOrder: number };

function isSafeWhole(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function rankEntries(entries: readonly HighscoreEntry[]): HighscoreEntry[] {
  return [...entries].sort((a, b) => b.score - a.score || a.order - b.order).slice(0, 10);
}

export function validatePlayerName(input: string): { name: string } | { error: string } {
  const name = input.trim();
  if (!name) return { error: 'Enter a name.' };
  const length = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(name)).length
    : Array.from(name).length;
  if (length > 16) return { error: 'Use 16 characters or fewer.' };
  return { name };
}

export type SubmissionResult =
  | { status: 'ranked' | 'not-ranked'; name: string; score: number }
  | { status: 'invalid-name' | 'invalid-score'; message: string };

function parseRanking(raw: string | null): RankingSnapshot | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const snapshot = value as Record<string, unknown>;
    if (snapshot.version !== 2 || !Array.isArray(snapshot.entries)) return null;
    const entries: HighscoreEntry[] = [];
    const seenOrders = new Set<number>();
    let legacySeen = false;
    for (const candidate of snapshot.entries) {
      if (!candidate || typeof candidate !== 'object') continue;
      const row = candidate as Record<string, unknown>;
      const nameValidation = typeof row.name === 'string' ? validatePlayerName(row.name) : null;
      const validName = row.name === null || (nameValidation !== null
        && 'name' in nameValidation && nameValidation.name === row.name);
      if (!validName || !isSafeWhole(row.score) || !isSafeWhole(row.order)
        || seenOrders.has(row.order) || (row.name === null && legacySeen)) continue;
      if (row.name === null) legacySeen = true;
      seenOrders.add(row.order);
      entries.push({ name: row.name as string | null, score: row.score, order: row.order });
    }
    if (snapshot.entries.length > 0 && entries.length === 0) return null;
    const ranked = rankEntries(entries);
    const minimumNext = Math.max(-1, ...entries.map((entry) => entry.order)) + 1;
    if (!Number.isSafeInteger(minimumNext)) return null;
    const nextOrder = isSafeWhole(snapshot.nextOrder) && snapshot.nextOrder >= minimumNext
      ? snapshot.nextOrder : minimumNext;
    return { version: 2, entries: ranked, nextOrder };
  } catch {
    return null;
  }
}

export class HighscoreBoard {
  private list: HighscoreEntry[] = [];
  private nextOrder = 0;

  constructor(
    private readonly getStorage: () => Storage | null = browserStorage,
    private readonly legacyBest = 0,
  ) {
    let snapshot: RankingSnapshot | null = null;
    try {
      snapshot = parseRanking(this.getStorage()?.getItem(HIGHSCORES_KEY) ?? null);
    } catch {
      // Storage access is optional; use the current page's memory.
    }
    if (snapshot) {
      this.list = snapshot.entries;
      this.nextOrder = snapshot.nextOrder;
    } else if (isSafeWhole(legacyBest) && legacyBest > 0) {
      this.list = [{ name: null, score: legacyBest, order: 0 }];
      this.nextOrder = 1;
      this.persist();
    }
  }

  get entries(): HighscoreEntry[] {
    return this.list.map((entry) => ({ ...entry }));
  }

  submit(rawName: string, score: number): SubmissionResult {
    const validation = validatePlayerName(rawName);
    if ('error' in validation) return { status: 'invalid-name', message: validation.error };
    if (!Number.isSafeInteger(score) || score < 0) {
      return { status: 'invalid-score', message: 'Score is invalid.' };
    }
    const entry: HighscoreEntry = { name: validation.name, score, order: this.nextOrder };
    const ranked = rankEntries([...this.list, entry]);
    if (!ranked.includes(entry)) {
      return { status: 'not-ranked', name: validation.name, score };
    }
    this.list = ranked;
    this.nextOrder += 1;
    this.persist();
    return { status: 'ranked', name: validation.name, score };
  }

  private persist(): void {
    const snapshot: RankingSnapshot = { version: 2, entries: this.list, nextOrder: this.nextOrder };
    try {
      this.getStorage()?.setItem(HIGHSCORES_KEY, JSON.stringify(snapshot));
    } catch {
      // In-memory ranking remains available for this page.
    }
  }
}

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
