import { describe, expect, it, vi } from 'vitest';
import { HighscoreBoard, HighscoreTracker, HIGHSCORE_KEY, HIGHSCORES_KEY, isNewRecord, validatePlayerName } from './highscore';

function store(initial: string | null = null) {
  let value = initial;
  const storage = {
    getItem: vi.fn(() => value),
    setItem: vi.fn((_key: string, next: string) => { value = next; }),
  } as unknown as Storage;
  return { storage, current: () => value };
}

describe('local highscore', () => {
  it('starts at zero, updates immediately and only upward, and reloads from saved data', () => {
    const fake = store();
    const tracker = new HighscoreTracker(() => fake.storage);
    expect(tracker.best).toBe(0);
    expect(tracker.record(10)).toBe(true);
    expect(fake.storage.setItem).toHaveBeenCalledWith(HIGHSCORE_KEY, '10');
    expect(tracker.record(10)).toBe(false);
    expect(tracker.record(5)).toBe(false);
    expect(fake.storage.setItem).toHaveBeenCalledTimes(1);
    expect(new HighscoreTracker(() => fake.storage).best).toBe(10);
    expect(tracker.record(55)).toBe(true);
    expect(fake.current()).toBe('55');
  });

  it.each(['', '-1', '1.5', 'abc', '01', ' 10', '1e2', '9007199254740992'])(
    'treats invalid saved text %j as zero',
    (raw) => expect(new HighscoreTracker(() => store(raw).storage).best).toBe(0),
  );

  it('accepts canonical zero and a safe positive whole number', () => {
    expect(new HighscoreTracker(() => store('0').storage).best).toBe(0);
    expect(new HighscoreTracker(() => store('125').storage).best).toBe(125);
  });

  it('keeps a page-session best if access, read, or write fails', () => {
    const denied = new HighscoreTracker(() => { throw new Error('denied'); });
    expect(denied.best).toBe(0);
    expect(denied.record(10)).toBe(true);
    expect(denied.best).toBe(10);

    const unreadable = new HighscoreTracker(() => ({
      getItem: () => { throw new Error('read denied'); },
      setItem: () => { throw new Error('write denied'); },
    } as unknown as Storage));
    expect(unreadable.best).toBe(0);
    expect(unreadable.record(55)).toBe(true);
    expect(unreadable.best).toBe(55);
  });

  it('tracks a new record against the run starting best, including later ties', () => {
    const tracker = new HighscoreTracker(() => store('55').storage);
    const startingBest = tracker.best;
    expect(isNewRecord(55, startingBest)).toBe(false);
    tracker.record(65);
    tracker.record(100);
    expect(isNewRecord(100, startingBest)).toBe(true);
    expect(isNewRecord(100, tracker.best)).toBe(false);
    expect(isNewRecord(45, tracker.best)).toBe(false);
  });
});

describe('named result submission', () => {
  it('trims names and rejects blank or overlong input while treating markup as text', () => {
    expect(validatePlayerName('  Ada  ')).toEqual({ name: 'Ada' });
    expect(validatePlayerName('   ')).toEqual({ error: 'Enter a name.' });
    expect(validatePlayerName('\u200b\u200d\u2060')).toEqual({ error: 'Enter a name.' });
    expect(validatePlayerName('\u0000\u0007')).toEqual({ error: 'Enter a name.' });
    expect(validatePlayerName('\u0301\ufe0f')).toEqual({ error: 'Enter a name.' });
    expect(validatePlayerName('abcdefghijklmnopq')).toEqual({ error: 'Use 16 characters or fewer.' });
    expect(validatePlayerName('👩‍🚀'.repeat(16))).toEqual({ name: '👩‍🚀'.repeat(16) });
    expect(validatePlayerName('👩‍🚀'.repeat(17))).toEqual({ error: 'Use 16 characters or fewer.' });
    expect(validatePlayerName('<b>Ada</b>')).toEqual({ name: '<b>Ada</b>' });
  });

  it('adds a completed score to the in-memory board', () => {
    const board = new HighscoreBoard(() => null, 0);
    expect(board.submit('  Ada  ', 45)).toEqual({ status: 'ranked', name: 'Ada', score: 45 });
    expect(board.entries).toEqual([{ name: 'Ada', score: 45, order: 0 }]);
    expect(board.submit('   ', 55)).toEqual({ status: 'invalid-name', message: 'Enter a name.' });
    expect(board.entries).toHaveLength(1);
  });
});

function rankingStore(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const storage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { values.set(key, value); }),
  } as unknown as Storage;
  return { storage, values };
}

describe('local top-ten ranking', () => {
  it('keeps only the ten best of twelve results in descending order across reloads', () => {
    const fake = rankingStore();
    const board = new HighscoreBoard(() => fake.storage, 0);
    for (let score = 10; score <= 120; score += 10) {
      expect(board.submit(`Player ${score}`, score).status).toBe('ranked');
    }
    expect(board.entries.map((entry) => entry.score)).toEqual([120, 110, 100, 90, 80, 70, 60, 50, 40, 30]);
    expect(new HighscoreBoard(() => fake.storage, 0).entries).toEqual(board.entries);
    expect(JSON.parse(fake.values.get(HIGHSCORES_KEY)!).entries).toHaveLength(10);
    expect(board.submit('Too low', 20).status).toBe('not-ranked');
  });

  it('keeps older equal scores ahead, including at the tenth-place cutoff', () => {
    const board = new HighscoreBoard(() => null, 0);
    for (let index = 0; index < 10; index += 1) board.submit(`Old ${index}`, 50);
    expect(board.submit('New tie', 50).status).toBe('not-ranked');
    expect(board.entries.map((entry) => entry.name)).toEqual(Array.from({ length: 10 }, (_, index) => `Old ${index}`));
  });

  it('migrates an earlier numeric best once as an unnamed legacy entry', () => {
    const fake = rankingStore({ [HIGHSCORE_KEY]: '85' });
    const first = new HighscoreBoard(() => fake.storage, 85);
    expect(first.entries).toEqual([{ name: null, score: 85, order: 0 }]);
    expect(new HighscoreBoard(() => fake.storage, 120).entries).toEqual(first.entries);
    expect(JSON.parse(fake.values.get(HIGHSCORES_KEY)!).entries).toHaveLength(1);
  });

  it('salvages valid entries from a damaged snapshot and repairs its order counter', () => {
    const fake = rankingStore({
      [HIGHSCORES_KEY]: JSON.stringify({ version: 2, nextOrder: -4, entries: [
        { name: 'Ada', score: 90, order: 4 },
        { name: '<img>', score: 40, order: 5 },
        { name: '', score: 100, order: 6 },
        { name: 'bad', score: -1, order: 7 },
      ] }),
    });
    const board = new HighscoreBoard(() => fake.storage, 10);
    expect(board.entries.map((entry) => entry.name)).toEqual(['Ada', '<img>']);
    expect(board.submit('Bob', 80).status).toBe('ranked');
    expect(board.entries.find((entry) => entry.name === 'Bob')?.order).toBe(6);
  });

  it('keeps a safe counter and stable ties at the maximum saved order', () => {
    const fake = rankingStore({
      [HIGHSCORES_KEY]: JSON.stringify({ version: 2, nextOrder: Number.MAX_SAFE_INTEGER, entries: [
        { name: 'First', score: 50, order: Number.MAX_SAFE_INTEGER - 2 },
        { name: 'Second', score: 50, order: Number.MAX_SAFE_INTEGER - 1 },
      ] }),
    });
    const board = new HighscoreBoard(() => fake.storage, 0);
    expect(board.submit('Third', 50).status).toBe('ranked');
    expect(board.entries.map(({ name }) => name)).toEqual(['First', 'Second', 'Third']);
    const saved = JSON.parse(fake.values.get(HIGHSCORES_KEY)!);
    expect(Number.isSafeInteger(saved.nextOrder)).toBe(true);
    expect(saved.nextOrder).toBeGreaterThan(Math.max(...saved.entries.map(({ order }: { order: number }) => order)));
    expect(new HighscoreBoard(() => fake.storage, 0).entries).toEqual(board.entries);
    expect(board.submit('Fourth', 50).status).toBe('ranked');
    expect(board.entries.map(({ name }) => name)).toEqual(['First', 'Second', 'Third', 'Fourth']);
  });

  it('falls back to the prior best on corrupt JSON and keeps page-memory changes when storage fails', () => {
    const fake = rankingStore({ [HIGHSCORES_KEY]: '{broken' });
    const board = new HighscoreBoard(() => fake.storage, 70);
    expect(board.entries).toEqual([{ name: null, score: 70, order: 0 }]);
    const denied = new HighscoreBoard(() => { throw new Error('denied'); }, 0);
    expect(denied.submit('Ada', 90).status).toBe('ranked');
    expect(denied.entries[0].score).toBe(90);
    expect(denied.submit('Ada', Number.MAX_SAFE_INTEGER + 1).status).toBe('invalid-score');
  });
});
