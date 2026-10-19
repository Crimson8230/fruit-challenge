export type SoundCue = 'correct' | 'incorrect' | 'round-complete' | 'missed' | 'game-over';

const cueDetails: Record<SoundCue, { frequency: number; duration: number; wave: OscillatorType }> = {
  correct: { frequency: 760, duration: 0.09, wave: 'sine' },
  incorrect: { frequency: 260, duration: 0.13, wave: 'triangle' },
  'round-complete': { frequency: 990, duration: 0.19, wave: 'sine' },
  missed: { frequency: 190, duration: 0.15, wave: 'triangle' },
  'game-over': { frequency: 135, duration: 0.24, wave: 'sine' },
};

type Voice = { oscillator: OscillatorNode; gain: GainNode };

function browserAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  return new AudioContext();
}

export class SoundController {
  private context: AudioContext | null = null;
  private voices = new Set<Voice>();
  private muted = false;

  constructor(private readonly createContext: () => AudioContext | null = browserAudioContext) {}

  get isMuted(): boolean { return this.muted; }

  unlockFromGesture(): void {
    if (this.muted) return;
    try {
      if (!this.context || this.context.state === 'closed') {
        this.context = this.createContext();
      }
      if (this.context?.state === 'suspended') {
        void this.context.resume().catch(() => undefined);
      }
    } catch {
      this.context = null;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) this.stopActive();
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
    this.stopActive();
    const context = this.context;
    this.context = null;
    if (context && context.state !== 'closed') {
      try { void context.close().catch(() => undefined); } catch { /* Audio is optional. */ }
    }
  }

  private release(voice: Voice | undefined): void {
    if (!voice || !this.voices.has(voice)) return;
    this.voices.delete(voice);
    voice.oscillator.onended = null;
    try { voice.oscillator.stop(); } catch { /* It may have stopped naturally. */ }
    voice.oscillator.disconnect();
    voice.gain.disconnect();
  }
}
