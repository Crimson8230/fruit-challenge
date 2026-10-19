export type SoundCue = 'correct' | 'incorrect' | 'round-complete' | 'missed' | 'game-over';

const cueDetails: Record<SoundCue, { frequency: number; duration: number; wave: OscillatorType }> = {
  correct: { frequency: 760, duration: 0.09, wave: 'sine' },
  incorrect: { frequency: 260, duration: 0.13, wave: 'triangle' },
  'round-complete': { frequency: 990, duration: 0.19, wave: 'sine' },
  missed: { frequency: 190, duration: 0.15, wave: 'triangle' },
  'game-over': { frequency: 135, duration: 0.24, wave: 'sine' },
};

type Voice = { oscillator: OscillatorNode; gain: GainNode };

// An original 32-step arcade phrase, with rests to leave room for game cues.
const melody = [
  523.25, 659.25, 783.99, 659.25, 587.33, 0, 659.25, 783.99,
  880, 783.99, 659.25, 523.25, 587.33, 659.25, 0, 392,
  440, 523.25, 659.25, 523.25, 493.88, 0, 523.25, 659.25,
  783.99, 659.25, 587.33, 493.88, 523.25, 0, 392, 0,
] as const;
const noteStep = 0.22;

function browserAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  return new AudioContext();
}

export class SoundController {
  private context: AudioContext | null = null;
  private voices = new Set<Voice>();
  private musicVoices = new Set<Voice>();
  private muted = false;
  private musicRequested = false;
  private musicTimer: number | null = null;
  private musicGeneration = 0;
  private musicStep = 0;
  private nextNoteAt = 0;

  constructor(private readonly createContext: () => AudioContext | null = browserAudioContext) {}

  get isMuted(): boolean { return this.muted; }
  get isMusicPlaying(): boolean { return this.musicTimer !== null; }

  unlockFromGesture(): void {
    if (this.muted) return;
    try {
      if (!this.context || this.context.state === 'closed') {
        this.context = this.createContext();
      }
      if (this.context?.state === 'suspended') {
        const generation = this.musicGeneration;
        void this.context.resume().then(() => {
          if (generation === this.musicGeneration) this.ensureMusic();
        }).catch(() => undefined);
      }
    } catch {
      this.context = null;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.musicGeneration += 1;
      this.stopMusicPlayback();
      this.stopActive();
    } else {
      this.ensureMusic();
    }
  }

  startMusic(): void {
    this.musicRequested = true;
    this.ensureMusic();
  }

  stopMusic(): void {
    this.musicRequested = false;
    this.musicGeneration += 1;
    this.stopMusicPlayback();
  }

  play(cue: SoundCue): boolean {
    const context = this.context;
    if (this.muted || !context || context.state !== 'running') return false;
    const { frequency, duration, wave } = cueDetails[cue];
    if (!frequency) return false;

    try {
      if (this.voices.size >= 4) this.release(this.voices.values().next().value);
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const voice = { oscillator, gain };
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.055, context.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => this.release(voice);
      this.voices.add(voice);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration + 0.015);
      return true;
    } catch {
      this.stopActive();
      return false;
    }
  }

  stopActive(): void {
    for (const voice of [...this.voices]) this.release(voice);
  }

  dispose(): void {
    this.stopMusic();
    this.stopActive();
    const context = this.context;
    this.context = null;
    if (context && context.state !== 'closed') {
      try { void context.close().catch(() => undefined); } catch { /* Audio is optional. */ }
    }
  }

  private release(voice: Voice | undefined): void {
    if (!voice || (!this.voices.has(voice) && !this.musicVoices.has(voice))) return;
    this.voices.delete(voice);
    this.musicVoices.delete(voice);
    voice.oscillator.onended = null;
    try { voice.oscillator.stop(); } catch { /* It may have stopped naturally. */ }
    voice.oscillator.disconnect();
    voice.gain.disconnect();
  }

  private ensureMusic(): void {
    const context = this.context;
    if (!this.musicRequested || this.muted || this.musicTimer !== null
      || !context || context.state !== 'running') return;
    this.musicStep = 0;
    this.nextNoteAt = context.currentTime + 0.04;
    this.scheduleMusic();
    this.musicTimer = globalThis.setInterval(() => this.scheduleMusic(), 80);
  }

  private scheduleMusic(): void {
    const context = this.context;
    if (!context || context.state !== 'running' || this.muted || !this.musicRequested) return;
    let scheduled = 0;
    while (this.nextNoteAt < context.currentTime + 0.18 && scheduled < 4) {
      const frequency = melody[this.musicStep % melody.length];
      if (frequency > 0) this.playMusicNote(context, frequency, this.nextNoteAt);
      this.musicStep += 1;
      this.nextNoteAt += noteStep;
      scheduled += 1;
    }
  }

  private playMusicNote(context: AudioContext, frequency: number, at: number): void {
    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const voice = { oscillator, gain };
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.linearRampToValueAtTime(0.012, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => this.release(voice);
      this.musicVoices.add(voice);
      oscillator.start(at);
      oscillator.stop(at + 0.19);
    } catch {
      this.stopMusicPlayback();
    }
  }

  private stopMusicPlayback(): void {
    if (this.musicTimer !== null) globalThis.clearInterval(this.musicTimer);
    this.musicTimer = null;
    for (const voice of [...this.musicVoices]) this.release(voice);
  }
}
