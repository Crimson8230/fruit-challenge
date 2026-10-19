import { describe, expect, it, vi } from 'vitest';
import { HighscoreTracker, HIGHSCORE_KEY, isNewRecord } from './highscore';

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
