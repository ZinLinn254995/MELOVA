export type PitchRelation = 'same' | 'higher' | 'lower';
export interface RelativePitchPrompt {
  referencePitchClass: number;
  semitoneOffset: number;
}
export const PITCH_RELATIONS: PitchRelation[] = ['same', 'higher', 'lower'];
export function getRelativePitchPrompt(random: () => number = Math.random): RelativePitchPrompt {
  const relationIndex = Math.min(2, Math.floor(random() * 3));
  if (relationIndex === 0) return { referencePitchClass: Math.min(11, Math.floor(random() * 12)), semitoneOffset: 0 };
  const distance = 1 + Math.min(4, Math.floor(random() * 4));
  return {
    referencePitchClass: Math.min(11, Math.floor(random() * 12)),
    semitoneOffset: relationIndex === 1 ? distance : -distance,
  };
}
export function getPitchRelation(semitoneOffset: number): PitchRelation {
  if (semitoneOffset === 0) return 'same';
  return semitoneOffset > 0 ? 'higher' : 'lower';
}
export function isRelativePitchAnswer(prompt: RelativePitchPrompt, answer: PitchRelation): boolean {
  return getPitchRelation(prompt.semitoneOffset) === answer;
}
export function getRelativePitchTarget(prompt: RelativePitchPrompt): { pitchClass: number; octaveOffset: number } {
  const absolutePitch = prompt.referencePitchClass + prompt.semitoneOffset;
  return { pitchClass: ((absolutePitch % 12) + 12) % 12, octaveOffset: Math.floor(absolutePitch / 12) };
}
