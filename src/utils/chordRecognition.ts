import { ChordTypeId, NoteName } from '../types/music';
import { CHROMATIC_NOTES } from './musicTheory';

export const RECOGNITION_QUALITIES: ChordTypeId[] = ['major', 'minor', 'diminished', 'augmented'];
export function getChordRecognitionChoices(): ChordTypeId[] {
  return [...RECOGNITION_QUALITIES];
}
export function isChordQualityAnswer(target: ChordTypeId, answer: ChordTypeId): boolean {
  return target === answer;
}
export function getRandomChordPrompt(random: () => number = Math.random): { root: NoteName; quality: ChordTypeId } {
  const rootIndex = Math.floor(random() * CHROMATIC_NOTES.length);
  const qualityIndex = Math.floor(random() * RECOGNITION_QUALITIES.length);
  return {
    root: CHROMATIC_NOTES[rootIndex] ?? 'C',
    quality: RECOGNITION_QUALITIES[qualityIndex] ?? 'major',
  };
}
