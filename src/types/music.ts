export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

export type EnharmonicName =
  | NoteName
  | 'Db'
  | 'Eb'
  | 'Gb'
  | 'Ab'
  | 'Bb'
  | 'E#'
  | 'B#';

export type ChordTypeId =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'sus2'
  | 'sus4'
  | 'dom7'
  | 'maj7'
  | 'min7';

export interface ChordTypeDefinition {
  id: ChordTypeId;
  nameEn: string;
  nameMy: string;
  symbol: string;
  semitoneFormula: number[]; // e.g. [0, 4, 7]
  stepIntervals: number[]; // consecutive semitones: e.g. [4, 3]
  formulaPatternEn: string; // e.g. "4 + 3 semitones"
  formulaPatternMy: string; // e.g. "၄ + ၃ ဆီမီးတုန်း (အကွာအဝေး)"
  descriptionEn: string;
  descriptionMy: string;
}

export interface ChordNoteInfo {
  pitchClass: number; // 0-11
  noteName: string; // Enharmonically correct name (e.g., F#, Bb)
  standardName: NoteName; // C, C#, etc. for keyboard key matching
  semitoneFromRoot: number; // e.g. 0, 4, 7
  role: 'root' | 'third' | 'fifth' | 'seventh' | 'second' | 'fourth';
  roleNameEn: string;
  roleNameMy: string;
}

export interface StepIntervalInfo {
  fromNote: string;
  toNote: string;
  semitones: number;
  chromaticPath: string[]; // intermediate notes, e.g. ['C', 'C#', 'D', 'D#', 'E']
}

export interface CalculatedChord {
  root: NoteName;
  chordType: ChordTypeDefinition;
  fullNameEn: string;
  fullNameMy: string;
  notes: ChordNoteInfo[];
  stepIntervals: StepIntervalInfo[];
  semitoneFormula: number[];
  allOctaveKeyPitches: number[]; // pitches across visible octaves
  explanationEn: string;
  explanationMy: string;
}

export type InstrumentType = 'piano' | 'guitar' | 'bass';

export type Language = 'my' | 'en';
export type DisplayMode = 'names' | 'semitones';

export interface GuitarStringTuning {
  stringNumber: number; // 1 to 6 (1 is high E, 6 is low E)
  openNote: NoteName;
  openPitchClass: number;
  openOctave: number;
}

export interface GuitarChordVoicing {
  root: NoteName;
  chordType: ChordTypeId;
  frets: number[]; // 6 elements: string 6 down to string 1. -1 means muted/unplayed (X), 0 means open (O), >=1 is fret
  fingers?: (number | null)[]; // 1: Index, 2: Middle, 3: Ring, 4: Pinky, null: none
  baseFret: number; // default 1, or higher for high-position barre chords
  barre?: { fret: number; fromString: number; toString: number };
}

export interface BassStringTuning {
  stringNumber: number; // 1 to 4 (1 is high G, 4 is low E)
  openNote: NoteName;
  openPitchClass: number;
  openOctave: number;
}

export interface BassArpeggioPattern {
  nameEn: string;
  nameMy: string;
  notes: {
    stringNum: number;
    fret: number;
    pitchClass: number;
    noteName: string;
    role: string;
  }[];
}
