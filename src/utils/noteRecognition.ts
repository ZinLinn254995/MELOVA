import { NoteName } from '../types/music';

export type NoteRecognitionLevel = 'beginner' | 'chromatic';
export interface NoteRecognitionPrompt {
  note: NoteName;
  octave: number;
}
export const NOTE_RECOGNITION_NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const BEGINNER_NOTE_SET: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export function getNotePool(level: NoteRecognitionLevel): NoteName[] {
  return level === 'beginner' ? [...BEGINNER_NOTE_SET] : [...NOTE_RECOGNITION_NOTES];
}

export function getNoteRecognitionPrompt(
  level: NoteRecognitionLevel = 'beginner',
  previous: NoteName | null = null,
  random: () => number = Math.random,
): NoteRecognitionPrompt {
  const pool = getNotePool(level);
  const candidates = previous && pool.length > 1 ? pool.filter((note) => note !== previous) : pool;
  const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length));
  return { note: candidates[index] ?? 'C', octave: 4 };
}

export function getNoteRecognitionChoices(
  target: NoteName,
  level: NoteRecognitionLevel = 'beginner',
  random: () => number = Math.random,
): NoteName[] {
  const pool = getNotePool(level);
  const distractors = pool.filter((note) => note !== target);
  for (let i = distractors.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }
  const choices = [target, ...distractors.slice(0, 3)];
  for (let i = choices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}

export function isNoteRecognitionAnswer(target: NoteName, answer: NoteName): boolean {
  return target === answer;
}
