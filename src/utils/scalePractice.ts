import { NoteName } from '../types/music';
export type ScaleKind = 'major' | 'natural-minor';
export const SCALE_NOTES: NoteName[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const SCALE_INTERVALS: Record<ScaleKind, number[]> = { major:[0,2,4,5,7,9,11,12], 'natural-minor':[0,2,3,5,7,8,10,12] };
export function getScaleNotes(root: NoteName, kind: ScaleKind): NoteName[] { const start=SCALE_NOTES.indexOf(root); return SCALE_INTERVALS[kind].map(n=>SCALE_NOTES[(start+n)%12]); }
export function isScaleAnswer(target: NoteName, answer: NoteName): boolean { return target===answer; }
