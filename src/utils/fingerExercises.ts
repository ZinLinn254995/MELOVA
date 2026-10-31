import { InstrumentType, NoteName } from '../types/music';
import { getFretboardPositions } from './practiceStudio';

export interface FingerExerciseNote {
  noteName: NoteName;
  pitchClass: number;
  octave: number;
  finger: number;
  stringNumber?: number;
  fret?: number;
}

export function getFingerExerciseSequence(instrument: InstrumentType): FingerExerciseNote[] {
  if (instrument === 'piano') {
    const notes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C'];
    return notes.map((noteName, index) => ({
      noteName,
      pitchClass: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(noteName),
      octave: 4,
      finger: index < 5 ? index + 1 : 10 - index,
    }));
  }

  const positions = getFretboardPositions(instrument, 4);
  const stringNumbers = instrument === 'guitar' ? [6, 5, 4, 3, 2, 1] : [4, 3, 2, 1];
  return stringNumbers.flatMap((stringNumber) =>
    positions
      .filter((position) => position.stringNumber === stringNumber && position.fret >= 1 && position.fret <= 4)
      .map((position) => ({
        noteName: position.noteName,
        pitchClass: position.pitchClass,
        octave: position.octave,
        finger: position.fret,
        stringNumber: position.stringNumber,
        fret: position.fret,
      })),
  );
}
