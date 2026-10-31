export type IntervalLevel = 'basic' | 'all';
export interface IntervalDefinition {
  semitones: number;
  shortName: string;
  nameEn: string;
  nameMy: string;
  descriptionEn: string;
  descriptionMy: string;
}
export interface IntervalPrompt {
  rootPitchClass: number;
  semitones: number;
}
export const INTERVALS: IntervalDefinition[] = [
  { semitones: 1, shortName: 'm2', nameEn: 'Minor 2nd', nameMy: 'မိုင်နာ 2nd', descriptionEn: 'One semitone apart', descriptionMy: 'ဆီမီးတုန်း ၁ ခု ကွာသည်' },
  { semitones: 2, shortName: 'M2', nameEn: 'Major 2nd', nameMy: 'မေဂျာ 2nd', descriptionEn: 'Two semitones apart', descriptionMy: 'ဆီမီးတုန်း ၂ ခု ကွာသည်' },
  { semitones: 3, shortName: 'm3', nameEn: 'Minor 3rd', nameMy: 'မိုင်နာ 3rd', descriptionEn: 'Three semitones apart', descriptionMy: 'ဆီမီးတုန်း ၃ ခု ကွာသည်' },
  { semitones: 4, shortName: 'M3', nameEn: 'Major 3rd', nameMy: 'မေဂျာ 3rd', descriptionEn: 'Four semitones apart', descriptionMy: 'ဆီမီးတုန်း ၄ ခု ကွာသည်' },
  { semitones: 5, shortName: 'P4', nameEn: 'Perfect 4th', nameMy: 'ပါဖက် 4th', descriptionEn: 'Five semitones apart', descriptionMy: 'ဆီမီးတုန်း ၅ ခု ကွာသည်' },
  { semitones: 6, shortName: 'TT', nameEn: 'Tritone', nameMy: 'ထရိုင်တုန်း', descriptionEn: 'Six semitones apart', descriptionMy: 'ဆီမီးတုန်း ၆ ခု ကွာသည်' },
  { semitones: 7, shortName: 'P5', nameEn: 'Perfect 5th', nameMy: 'ပါဖက် 5th', descriptionEn: 'Seven semitones apart', descriptionMy: 'ဆီမီးတုန်း ၇ ခု ကွာသည်' },
  { semitones: 8, shortName: 'm6', nameEn: 'Minor 6th', nameMy: 'မိုင်နာ 6th', descriptionEn: 'Eight semitones apart', descriptionMy: 'ဆီမီးတုန်း ၈ ခု ကွာသည်' },
  { semitones: 9, shortName: 'M6', nameEn: 'Major 6th', nameMy: 'မေဂျာ 6th', descriptionEn: 'Nine semitones apart', descriptionMy: 'ဆီမီးတုန်း ၉ ခု ကွာသည်' },
  { semitones: 10, shortName: 'm7', nameEn: 'Minor 7th', nameMy: 'မိုင်နာ 7th', descriptionEn: 'Ten semitones apart', descriptionMy: 'ဆီမီးတုန်း ၁၀ ခု ကွာသည်' },
  { semitones: 11, shortName: 'M7', nameEn: 'Major 7th', nameMy: 'မေဂျာ 7th', descriptionEn: 'Eleven semitones apart', descriptionMy: 'ဆီမီးတုန်း ၁၁ ခု ကွာသည်' },
  { semitones: 12, shortName: 'P8', nameEn: 'Octave', nameMy: 'အောက်တေ့ဗ်', descriptionEn: 'Twelve semitones apart', descriptionMy: 'ဆီမီးတုန်း ၁၂ ခု ကွာသည်' },
];
export const BASIC_INTERVALS = [2, 4, 5, 7];
export function getIntervalPool(level: IntervalLevel): IntervalDefinition[] {
  return INTERVALS.filter((interval) => level === 'all' || BASIC_INTERVALS.includes(interval.semitones));
}
export function getIntervalPrompt(level: IntervalLevel = 'basic', random: () => number = Math.random): IntervalPrompt {
  const pool = getIntervalPool(level);
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  return { rootPitchClass: Math.min(11, Math.max(0, Math.floor(random() * 12))), semitones: pool[index].semitones };
}
export function getIntervalChoices(target: number, level: IntervalLevel = 'basic', random: () => number = Math.random): number[] {
  const distractors = getIntervalPool(level).map((item) => item.semitones).filter((value) => value !== target);
  for (let i = distractors.length - 1; i > 0; i -= 1) {
    const j = Math.min(i, Math.floor(random() * (i + 1)));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }
  const choices = [target, ...distractors.slice(0, 3)];
  for (let i = choices.length - 1; i > 0; i -= 1) {
    const j = Math.min(i, Math.floor(random() * (i + 1)));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
export function isIntervalAnswer(target: number, answer: number): boolean {
  return target === answer;
}
export function getIntervalDefinition(semitones: number): IntervalDefinition | undefined {
  return INTERVALS.find((interval) => interval.semitones === semitones);
}
