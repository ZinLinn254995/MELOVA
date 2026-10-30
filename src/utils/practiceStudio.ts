import { InstrumentType, NoteName } from '../types/music';
import { BASS_TUNING, GUITAR_TUNING, getBassFretNote, getGuitarFretNote } from './fretboardTheory';
import { CHROMATIC_NOTES } from './musicTheory';

export interface FretboardPosition {
  stringIndex: number;
  stringNumber: number;
  fret: number;
  noteName: NoteName;
  pitchClass: number;
  octave: number;
}

export interface PracticeChord {
  root: NoteName;
  quality: 'major' | 'minor';
  degree: string;
}

export const POP_PROGRESSION: PracticeChord[] = [
  { root: 'C', quality: 'major', degree: 'I' },
  { root: 'G', quality: 'major', degree: 'V' },
  { root: 'A', quality: 'minor', degree: 'vi' },
  { root: 'F', quality: 'major', degree: 'IV' },
];

export const CLASSIC_PROGRESSION: PracticeChord[] = [
  { root: 'C', quality: 'major', degree: 'I' },
  { root: 'F', quality: 'major', degree: 'IV' },
  { root: 'G', quality: 'major', degree: 'V' },
  { root: 'C', quality: 'major', degree: 'I' },
];

export function getFretboardPositions(instrument: 'guitar' | 'bass', fretCount = 12): FretboardPosition[] {
  const tuning = instrument === 'guitar' ? GUITAR_TUNING : BASS_TUNING;
  return tuning.flatMap((string, stringIndex) =>
    Array.from({ length: fretCount + 1 }, (_, fret) => {
      const note = instrument === 'guitar'
        ? getGuitarFretNote(stringIndex, fret)
        : getBassFretNote(stringIndex, fret);
      return {
        stringIndex,
        stringNumber: string.stringNumber,
        fret,
        noteName: note.noteName,
        pitchClass: note.pitchClass,
        octave: note.octave,
      };
    }),
  );
}

export function isCorrectNoteAnswer(target: NoteName, answer: NoteName): boolean {
  return target === answer;
}

export function getRandomTarget(previous: NoteName | null, random = Math.random): NoteName {
  const choices = CHROMATIC_NOTES.filter((note) => note !== previous);
  return choices[Math.floor(random() * choices.length)] ?? 'C';
}

export function getProgression(kind: 'pop' | 'classic'): PracticeChord[] {
  return kind === 'classic' ? CLASSIC_PROGRESSION : POP_PROGRESSION;
}

export function getProgressionLabel(chord: PracticeChord): string {
  return chord.root + (chord.quality === 'minor' ? 'm' : '');
}
