export type MelodyLevel = 3 | 4 | 5;
export interface MelodyPrompt { notes: number[]; }
export interface MelodyChoice { id: string; notes: number[]; }

const SCALE = [0, 2, 4, 5, 7, 9, 11];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getMelodyPrompt(level: MelodyLevel = 3, random: () => number = Math.random): MelodyPrompt {
  const notes = Array.from({ length: level }, () => SCALE[Math.min(SCALE.length - 1, Math.floor(random() * SCALE.length))]);
  return { notes };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.min(i, Math.floor(random() * (i + 1)));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sequenceKey(notes: number[]): string { return notes.join(','); }

export function getMelodyChoices(target: number[], random: () => number = Math.random): MelodyChoice[] {
  const sequences = new Map<string, number[]>();
  sequences.set(sequenceKey(target), [...target]);
  let attempts = 0;
  while (sequences.size < 4 && attempts < 100) {
    attempts += 1;
    const candidate = target.map((note, index) => {
      const shift = Math.floor(random() * 5) - 2;
      return SCALE[(Math.max(0, SCALE.indexOf(note)) + shift + SCALE.length) % SCALE.length];
    });
    if (sequenceKey(candidate) !== sequenceKey(target)) sequences.set(sequenceKey(candidate), candidate);
  }
  // Deterministic fallbacks guarantee four distinct choices even with a constant random source.
  let offset = 1;
  while (sequences.size < 4) {
    const candidate = target.map((note, index) => SCALE[(Math.max(0, SCALE.indexOf(note)) + offset + index) % SCALE.length]);
    sequences.set(sequenceKey(candidate), candidate);
    offset += 1;
  }
  return shuffle([...sequences.values()], random).map((notes, index) => ({ id: String(index), notes }));
}

export function isMelodyAnswer(target: number[], answer: number[]): boolean {
  return target.length === answer.length && target.every((note, index) => note === answer[index]);
}

export function getMelodyNoteName(pitchClass: number): string {
  return NOTE_NAMES[((pitchClass % 12) + 12) % 12];
}
