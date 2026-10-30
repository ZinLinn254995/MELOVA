import { InstrumentType } from '../types/music';

class MultiInstrumentAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.75;
  private isMuted: boolean = false;
  private arpeggioTimer: number | null = null;
  private scheduledTimers = new Set<number>();
  private activeVoices = new Set<{
    oscillators: OscillatorNode[];
    gain: GainNode;
    filter: BiquadFilterNode;
    cleanupTimer: number;
  }>();

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getFrequency(pitchClass: number, octave: number = 4): number {
    // MIDI note number: C4 = 60 (pitchClass 0, octave 4)
    const midi = (octave + 1) * 12 + pitchClass;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Play a single note according to instrument timbre (Piano, Guitar, Bass)
  public playNote(
    pitchClass: number,
    octave: number = 4,
    durationSec: number = 1.2,
    instrument: InstrumentType = 'piano'
  ) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const freq = this.getFrequency(pitchClass, octave);

    const voiceGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    let oscs: OscillatorNode[] = [];

    if (instrument === 'piano') {
      // Warm acoustic grand piano
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 8, 8000), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 800), now + durationSec);

      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.linearRampToValueAtTime(0.8, now + 0.008);
      voiceGain.gain.exponentialRampToValueAtTime(0.4, now + 0.15);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      const harmonics = [
        { ratio: 1.0, gain: 0.7, type: 'triangle' as OscillatorType },
        { ratio: 2.0, gain: 0.25, type: 'sine' as OscillatorType },
        { ratio: 3.0, gain: 0.12, type: 'sine' as OscillatorType },
        { ratio: 4.0, gain: 0.05, type: 'triangle' as OscillatorType },
      ];

      harmonics.forEach((h) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = h.type;
        osc.frequency.setValueAtTime(freq * h.ratio, now);
        oscGain.gain.setValueAtTime(h.gain, now);
        osc.connect(oscGain);
        oscGain.connect(filter);
        oscs.push(osc);
        osc.start(now);
        osc.stop(now + durationSec + 0.05);
      });
    } else if (instrument === 'guitar') {
      // Acoustic plucked string with crisp attack and metallic shimmer
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 10, 10000), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 450), now + durationSec);

      voiceGain.gain.setValueAtTime(0.0001, now);
      // Sharp string pick attack
      voiceGain.gain.linearRampToValueAtTime(0.85, now + 0.005);
      voiceGain.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      // Harmonics favoring acoustic string pluck
      const harmonics = [
        { ratio: 1.0, gain: 0.65, type: 'triangle' as OscillatorType },
        { ratio: 2.0, gain: 0.35, type: 'sawtooth' as OscillatorType },
        { ratio: 3.0, gain: 0.18, type: 'sine' as OscillatorType },
        { ratio: 4.0, gain: 0.08, type: 'sine' as OscillatorType },
      ];

      harmonics.forEach((h) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = h.type;
        osc.frequency.setValueAtTime(freq * h.ratio, now);
        oscGain.gain.setValueAtTime(h.gain, now);
        osc.connect(oscGain);
        oscGain.connect(filter);
        oscs.push(osc);
        osc.start(now);
        osc.stop(now + durationSec + 0.05);
      });
    } else {
      // Bass Guitar: Heavy fundamental, punchy low-mid, warm sub-bass
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 6, 3200), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.2, 220), now + durationSec);

      voiceGain.gain.setValueAtTime(0.0001, now);
      // Thumb / pick thump attack
      voiceGain.gain.linearRampToValueAtTime(0.95, now + 0.012);
      voiceGain.gain.exponentialRampToValueAtTime(0.6, now + 0.12);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 1.3);

      const harmonics = [
        { ratio: 0.5, gain: 0.25, type: 'sine' as OscillatorType }, // Sub-octave body
        { ratio: 1.0, gain: 0.75, type: 'triangle' as OscillatorType }, // Primary fundamental
        { ratio: 2.0, gain: 0.35, type: 'sine' as OscillatorType }, // Punch
        { ratio: 3.0, gain: 0.15, type: 'sawtooth' as OscillatorType }, // String buzz
      ];

      harmonics.forEach((h) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = h.type;
        osc.frequency.setValueAtTime(freq * h.ratio, now);
        oscGain.gain.setValueAtTime(h.gain, now);
        osc.connect(oscGain);
        oscGain.connect(filter);
        oscs.push(osc);
        osc.start(now);
        osc.stop(now + durationSec * 1.3 + 0.05);
      });
    }

    filter.connect(voiceGain);
    voiceGain.connect(this.masterGain);

    const voice = {
      oscillators: oscs,
      gain: voiceGain,
      filter,
      cleanupTimer: 0,
    };
    voice.cleanupTimer = window.setTimeout(() => {
      this.activeVoices.delete(voice);
      try {
        oscs.forEach((o) => o.disconnect());
        voiceGain.disconnect();
        filter.disconnect();
      } catch {
        // Nodes may already be disconnected during stopPlayback.
      }
    }, (durationSec * (instrument === 'bass' ? 1.3 : 1) + 0.3) * 1000);
    this.activeVoices.add(voice);
  }

  // Play full chord simultaneously
  public playChord(
    notes: Array<{ pitchClass: number; octave?: number }>,
    durationSec: number = 1.8,
    instrument: InstrumentType = 'piano'
  ) {
    this.stopPlayback();
    this.initContext();
    notes.forEach((note) => {
      this.playNote(note.pitchClass, note.octave ?? 4, durationSec, instrument);
    });
  }

  // Strum guitar chord across strings with a natural human downward pick stroke
  public strumGuitar(
    stringsNotes: Array<{ pitchClass: number; octave: number } | null>,
    strokeDelayMs: number = 38,
    onFinished?: () => void
  ) {
    this.stopPlayback();
    this.initContext();

    const playedNotes = stringsNotes.filter((n): n is { pitchClass: number; octave: number } => n !== null);
    playedNotes.forEach((note, idx) => {
      const timer = window.setTimeout(() => {
        this.scheduledTimers.delete(timer);
        this.playNote(note.pitchClass, note.octave, 2.2, 'guitar');
      }, idx * strokeDelayMs);
      this.scheduledTimers.add(timer);
    });

    const completionDelay = playedNotes.length
      ? (playedNotes.length - 1) * strokeDelayMs + 2.2 * 1000
      : 0;
    const completionTimer = window.setTimeout(() => {
      this.scheduledTimers.delete(completionTimer);
      onFinished?.();
    }, completionDelay);
    this.scheduledTimers.add(completionTimer);
  }

  // Play arpeggio (notes one at a time) with callback for visual animation sync
  public playArpeggio(
    notes: Array<{ pitchClass: number; octave?: number }>,
    intervalMs: number = 320,
    instrument: InstrumentType = 'piano',
    onNotePlayed?: (index: number) => void,
    onFinished?: () => void
  ) {
    this.stopPlayback();
    this.initContext();

    let step = 0;
    const playStep = () => {
      if (step < notes.length) {
        const note = notes[step];
        this.playNote(note.pitchClass, note.octave ?? 4, 1.2, instrument);
        if (onNotePlayed) {
          onNotePlayed(step);
        }
        step++;
        if (step < notes.length) {
          this.arpeggioTimer = window.setTimeout(playStep, intervalMs);
        } else {
          this.arpeggioTimer = window.setTimeout(() => {
            this.arpeggioTimer = null;
            onFinished?.();
          }, 1.2 * 1000);
        }
      } else {
        this.arpeggioTimer = null;
        onFinished?.();
      }
    };

    playStep();
  }

  // Play a walking bass groove (Root -> 3rd -> 5th -> Octave)
  public playBassGroove(
    notes: Array<{ pitchClass: number; octave: number }>,
    tempoMs: number = 420,
    onNotePlayed?: (index: number) => void,
    onFinished?: () => void
  ) {
    this.stopPlayback();
    this.initContext();

    let step = 0;
    const playStep = () => {
      if (step < notes.length) {
        const note = notes[step];
        this.playNote(note.pitchClass, note.octave, 0.9, 'bass');
        if (onNotePlayed) {
          onNotePlayed(step);
        }
        step++;
        if (step < notes.length) {
          this.arpeggioTimer = window.setTimeout(playStep, tempoMs);
        } else {
          this.arpeggioTimer = window.setTimeout(() => {
            this.arpeggioTimer = null;
            onFinished?.();
          }, 0.9 * 1.3 * 1000);
        }
      } else {
        this.arpeggioTimer = null;
        onFinished?.();
      }
    };

    playStep();
  }

  public stopPlayback() {
    if (this.arpeggioTimer !== null) {
      clearTimeout(this.arpeggioTimer);
      this.arpeggioTimer = null;
    }

    this.scheduledTimers.forEach((timer) => window.clearTimeout(timer));
    this.scheduledTimers.clear();

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.activeVoices.forEach((voice) => {
      window.clearTimeout(voice.cleanupTimer);
      try {
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
        voice.gain.gain.linearRampToValueAtTime(0.0001, now + 0.015);
        voice.oscillators.forEach((osc) => {
          try {
            osc.stop(now + 0.02);
          } catch {
            // Oscillator may already have stopped.
          }
        });

        // Keep the nodes connected briefly so the 15ms fade can complete.
        window.setTimeout(() => {
          try {
            voice.oscillators.forEach((osc) => osc.disconnect());
            voice.gain.disconnect();
            voice.filter.disconnect();
          } catch {
            // Nodes may already be disconnected.
          }
        }, 25);
      } catch {
        // Ignore nodes already stopped or disconnected.
      }
    });
    this.activeVoices.clear();
  }
}

export const audioEngine = new MultiInstrumentAudioEngine();
