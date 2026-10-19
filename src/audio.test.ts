import { describe, expect, it, vi } from 'vitest';
import { SoundController } from './audio';

function fakeAudio(state: AudioContextState = 'running', resumeSucceeds = true) {
  const voices: Array<{ frequency: number; stopped: boolean; disconnected: boolean }> = [];
  const context = {
    state,
    currentTime: 0,
    resume: vi.fn(async () => { if (resumeSucceeds) context.state = 'running' as AudioContextState; }),
    close: vi.fn(async () => { context.state = 'closed' as AudioContextState; }),
    createOscillator() {
      const voice = { frequency: 0, stopped: false, disconnected: false };
      voices.push(voice);
      return {
        type: 'sine',
        frequency: { setValueAtTime(value: number) { voice.frequency = value; } },
        connect() {},
        disconnect() { voice.disconnected = true; },
        start() {},
        stop() { voice.stopped = true; },
        onended: null,
      };
    },
    createGain() {
      return {
        gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
        disconnect() {},
      };
    },
  };
  return { context: context as unknown as AudioContext, raw: context, voices, resume: context.resume, close: context.close };
}

describe('sound controller', () => {
  it('creates audio only on gesture and emits one distinct voice per cue', () => {
    const fake = fakeAudio();
    const factory = vi.fn(() => fake.context);
    const sound = new SoundController(factory);
    expect(factory).not.toHaveBeenCalled();
    sound.unlockFromGesture();
    for (const cue of ['correct', 'incorrect', 'round-complete', 'missed', 'game-over'] as const) {
      expect(sound.play(cue)).toBe(true);
    }
    expect(factory).toHaveBeenCalledTimes(1);
    expect(new Set(fake.voices.map((voice) => voice.frequency)).size).toBe(5);
  });

  it('mutes the current session immediately and never queues blocked sounds', () => {
    const fake = fakeAudio('suspended', false);
    const sound = new SoundController(() => fake.context);
    expect(sound.play('correct')).toBe(false);
    sound.unlockFromGesture();
    expect(sound.play('correct')).toBe(false);
    expect(fake.voices).toHaveLength(0);
    fake.raw.state = 'running' as AudioContextState;
    expect(sound.play('correct')).toBe(true);
    sound.setMuted(true);
    expect(sound.isMuted).toBe(true);
    expect(fake.voices[0].stopped).toBe(true);
    expect(sound.play('incorrect')).toBe(false);
    sound.setMuted(false);
    expect(sound.play('incorrect')).toBe(true);
    expect(fake.voices).toHaveLength(2);
  });

  it('fails silently without audio and cleans up active voices on reset/disposal', () => {
    const missing = new SoundController(() => null);
    missing.unlockFromGesture();
    expect(missing.play('correct')).toBe(false);

    const fake = fakeAudio();
    const sound = new SoundController(() => fake.context);
    sound.unlockFromGesture();
    sound.play('correct');
    sound.stopActive();
    expect(fake.voices[0].stopped).toBe(true);
    expect(fake.voices[0].disconnected).toBe(true);
    sound.play('game-over');
    sound.dispose();
    expect(fake.voices[1].stopped).toBe(true);
    expect(fake.close).toHaveBeenCalledTimes(1);
  });

  it('runs at most one music loop and silences it immediately on mute or Game Over', () => {
    vi.useFakeTimers();
    try {
      const fake = fakeAudio();
      const sound = new SoundController(() => fake.context);
      sound.unlockFromGesture();
      sound.startMusic();
      sound.startMusic();
      expect(sound.isMusicPlaying).toBe(true);
      expect(vi.getTimerCount()).toBe(1);
      expect(fake.voices.length).toBeGreaterThan(0);
      sound.setMuted(true);
      expect(sound.isMusicPlaying).toBe(false);
      expect(vi.getTimerCount()).toBe(0);
      expect(fake.voices.every((voice) => voice.stopped)).toBe(true);
      expect(sound.play('correct')).toBe(false);
      sound.setMuted(false);
      expect(sound.isMusicPlaying).toBe(true);
      expect(vi.getTimerCount()).toBe(1);
      sound.stopMusic();
      expect(sound.isMusicPlaying).toBe(false);
      expect(vi.getTimerCount()).toBe(0);
      expect(sound.play('game-over')).toBe(true);
      sound.dispose();
    } finally {
      vi.useRealTimers();
    }
  });

  it('waits for a permitted audio context and stays silent when audio is unavailable', async () => {
    vi.useFakeTimers();
    try {
      const suspended = fakeAudio('suspended');
      const sound = new SoundController(() => suspended.context);
      sound.unlockFromGesture();
      sound.startMusic();
      await Promise.resolve();
      expect(sound.isMusicPlaying).toBe(true);
      sound.dispose();
      expect(vi.getTimerCount()).toBe(0);
      const missing = new SoundController(() => null);
      missing.unlockFromGesture();
      missing.startMusic();
      expect(missing.isMusicPlaying).toBe(false);
      missing.dispose();
    } finally {
      vi.useRealTimers();
    }
  });
});
