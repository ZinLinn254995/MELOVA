import {
  NoteName,
  ChordTypeId,
  GuitarStringTuning,
  GuitarChordVoicing,
  BassStringTuning,
  BassArpeggioPattern,
  CalculatedChord,
} from '../types/music';
import { CHROMATIC_NOTES, getPitchClass, pitchClassToNoteName } from './musicTheory';

// 6-String Guitar Standard Tuning (String 6 to 1)
// String 6: E2 (MIDI 40)
// String 5: A2 (MIDI 45)
// String 4: D3 (MIDI 50)
// String 3: G3 (MIDI 55)
// String 2: B3 (MIDI 59)
// String 1: E4 (MIDI 64)
export const GUITAR_TUNING: GuitarStringTuning[] = [
  { stringNumber: 6, openNote: 'E', openPitchClass: 4, openOctave: 2 },
  { stringNumber: 5, openNote: 'A', openPitchClass: 9, openOctave: 2 },
  { stringNumber: 4, openNote: 'D', openPitchClass: 2, openOctave: 3 },
  { stringNumber: 3, openNote: 'G', openPitchClass: 7, openOctave: 3 },
  { stringNumber: 2, openNote: 'B', openPitchClass: 11, openOctave: 3 },
  { stringNumber: 1, openNote: 'E', openPitchClass: 4, openOctave: 4 },
];

// 4-String Bass Standard Tuning (String 4 to 1)
// String 4: E1 (MIDI 28)
// String 3: A1 (MIDI 33)
// String 2: D2 (MIDI 38)
// String 1: G2 (MIDI 43)
export const BASS_TUNING: BassStringTuning[] = [
  { stringNumber: 4, openNote: 'E', openPitchClass: 4, openOctave: 1 },
  { stringNumber: 3, openNote: 'A', openPitchClass: 9, openOctave: 1 },
  { stringNumber: 2, openNote: 'D', openPitchClass: 2, openOctave: 2 },
  { stringNumber: 1, openNote: 'G', openPitchClass: 7, openOctave: 2 },
];

// Fretboard markers (single dots on 3, 5, 7, 9, 15; double dot on 12)
export const FRET_MARKERS = [3, 5, 7, 9, 12, 15];

// Calculate note information for any guitar fret
export function getGuitarFretNote(
  stringIndex: number, // 0 = String 6 (Low E), 5 = String 1 (High E)
  fret: number
): { pitchClass: number; noteName: NoteName; octave: number } {
  const tuning = GUITAR_TUNING[stringIndex];
  const totalSemitones = tuning.openPitchClass + fret;
  const pitchClass = totalSemitones % 12;
  const noteName = pitchClassToNoteName(pitchClass);
  const octave = tuning.openOctave + Math.floor(totalSemitones / 12);
  return { pitchClass, noteName, octave };
}

// Calculate note information for any bass fret
export function getBassFretNote(
  stringIndex: number, // 0 = String 4 (Low E), 3 = String 1 (High G)
  fret: number
): { pitchClass: number; noteName: NoteName; octave: number } {
  const tuning = BASS_TUNING[stringIndex];
  const totalSemitones = tuning.openPitchClass + fret;
  const pitchClass = totalSemitones % 12;
  const noteName = pitchClassToNoteName(pitchClass);
  const octave = tuning.openOctave + Math.floor(totalSemitones / 12);
  return { pitchClass, noteName, octave };
}

// Curated beginner-friendly open & common guitar chord shapes
// Strings are ordered [String 6, String 5, String 4, String 3, String 2, String 1]
// -1 = unplayed/muted (X), 0 = open (O), >=1 = fret number
const OPEN_GUITAR_VOICINGS: Record<string, { frets: number[]; fingers: (number | null)[]; baseFret: number }> = {
  // C Chords
  'C_major': { frets: [-1, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null], baseFret: 1 },
  'C_minor': { frets: [-1, 3, 5, 5, 4, 3], fingers: [null, 1, 3, 4, 2, 1], baseFret: 3 },
  'C_dom7': { frets: [-1, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null], baseFret: 1 },
  'C_maj7': { frets: [-1, 3, 2, 0, 0, 0], fingers: [null, 3, 2, null, null, null], baseFret: 1 },
  'C_min7': { frets: [-1, 3, 5, 3, 4, 3], fingers: [null, 1, 3, 1, 2, 1], baseFret: 3 },
  'C_sus2': { frets: [-1, 3, 0, 0, 1, 0], fingers: [null, 3, null, null, 1, null], baseFret: 1 },
  'C_sus4': { frets: [-1, 3, 3, 0, 1, 0], fingers: [null, 3, 4, null, 1, null], baseFret: 1 },
  'C_diminished': { frets: [-1, 3, 4, 2, 4, -1], fingers: [null, 2, 3, 1, 4, null], baseFret: 1 },
  'C_augmented': { frets: [-1, 3, 2, 1, 1, 0], fingers: [null, 3, 2, 1, 1, null], baseFret: 1 },

  // D Chords
  'D_major': { frets: [-1, -1, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2], baseFret: 1 },
  'D_minor': { frets: [-1, -1, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1], baseFret: 1 },
  'D_dom7': { frets: [-1, -1, 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3], baseFret: 1 },
  'D_maj7': { frets: [-1, -1, 0, 2, 2, 2], fingers: [null, null, null, 1, 1, 1], baseFret: 1 },
  'D_min7': { frets: [-1, -1, 0, 2, 1, 1], fingers: [null, null, null, 2, 1, 1], baseFret: 1 },
  'D_sus2': { frets: [-1, -1, 0, 2, 3, 0], fingers: [null, null, null, 1, 2, null], baseFret: 1 },
  'D_sus4': { frets: [-1, -1, 0, 2, 3, 3], fingers: [null, null, null, 1, 2, 3], baseFret: 1 },
  'D_diminished': { frets: [-1, -1, 0, 1, 3, 1], fingers: [null, null, null, 1, 3, 2], baseFret: 1 },
  'D_augmented': { frets: [-1, -1, 0, 3, 3, 2], fingers: [null, null, null, 2, 3, 1], baseFret: 1 },

  // E Chords
  'E_major': { frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null], baseFret: 1 },
  'E_minor': { frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null], baseFret: 1 },
  'E_dom7': { frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null], baseFret: 1 },
  'E_maj7': { frets: [0, 2, 1, 1, 0, 0], fingers: [null, 3, 1, 2, null, null], baseFret: 1 },
  'E_min7': { frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null], baseFret: 1 },
  'E_sus2': { frets: [0, 2, 4, 4, 0, 0], fingers: [null, 1, 3, 4, null, null], baseFret: 1 },
  'E_sus4': { frets: [0, 2, 2, 2, 0, 0], fingers: [null, 2, 3, 4, null, null], baseFret: 1 },
  'E_diminished': { frets: [0, 1, 2, 0, -1, -1], fingers: [null, 1, 2, null, null, null], baseFret: 1 },
  'E_augmented': { frets: [0, 3, 2, 1, 1, 0], fingers: [null, 4, 3, 1, 2, null], baseFret: 1 },

  // F Chords
  'F_major': { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
  'F_minor': { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
  'F_dom7': { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], baseFret: 1 },
  'F_maj7': { frets: [-1, -1, 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null], baseFret: 1 },
  'F_min7': { frets: [1, 3, 1, 1, 1, 1], fingers: [1, 3, 1, 1, 1, 1], baseFret: 1 },
  'F_sus2': { frets: [-1, -1, 3, 0, 1, 1], fingers: [null, null, 3, null, 1, 1], baseFret: 1 },
  'F_sus4': { frets: [1, 3, 3, 3, 1, 1], fingers: [1, 2, 3, 4, 1, 1], baseFret: 1 },
  'F_diminished': { frets: [-1, -1, 3, 4, 3, 4], fingers: [null, null, 1, 3, 2, 4], baseFret: 1 },
  'F_augmented': { frets: [-1, -1, 3, 2, 2, 1], fingers: [null, null, 4, 2, 3, 1], baseFret: 1 },

  // G Chords
  'G_major': { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3], baseFret: 1 },
  'G_minor': { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 3 },
  'G_dom7': { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, null, null, null, 1], baseFret: 1 },
  'G_maj7': { frets: [3, 2, 0, 0, 0, 2], fingers: [2, 1, null, null, null, 3], baseFret: 1 },
  'G_min7': { frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], baseFret: 3 },
  'G_sus2': { frets: [3, 0, 0, 0, 3, 3], fingers: [1, null, null, null, 2, 3], baseFret: 1 },
  'G_sus4': { frets: [3, 2, 0, 0, 1, 3], fingers: [3, 2, null, null, 1, 4], baseFret: 1 },
  'G_diminished': { frets: [3, 4, 5, 3, -1, -1], fingers: [1, 2, 3, 1, null, null], baseFret: 3 },
  'G_augmented': { frets: [3, 2, 1, 0, 0, 3], fingers: [3, 2, 1, null, null, 4], baseFret: 1 },

  // A Chords
  'A_major': { frets: [-1, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null], baseFret: 1 },
  'A_minor': { frets: [-1, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null], baseFret: 1 },
  'A_dom7': { frets: [-1, 0, 2, 0, 2, 0], fingers: [null, null, 1, null, 2, null], baseFret: 1 },
  'A_maj7': { frets: [-1, 0, 2, 1, 2, 0], fingers: [null, null, 2, 1, 3, null], baseFret: 1 },
  'A_min7': { frets: [-1, 0, 2, 0, 1, 0], fingers: [null, null, 2, null, 1, null], baseFret: 1 },
  'A_sus2': { frets: [-1, 0, 2, 2, 0, 0], fingers: [null, null, 1, 2, null, null], baseFret: 1 },
  'A_sus4': { frets: [-1, 0, 2, 2, 3, 0], fingers: [null, null, 1, 2, 3, null], baseFret: 1 },
  'A_diminished': { frets: [-1, 0, 1, 2, 1, -1], fingers: [null, null, 1, 3, 2, null], baseFret: 1 },
  'A_augmented': { frets: [-1, 0, 3, 2, 2, 1], fingers: [null, null, 4, 2, 3, 1], baseFret: 1 },

  // B Chords
  'B_major': { frets: [-1, 2, 4, 4, 4, 2], fingers: [null, 1, 2, 3, 4, 1], baseFret: 2 },
  'B_minor': { frets: [-1, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 4, 2, 1], baseFret: 2 },
  'B_dom7': { frets: [-1, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, null, 4], baseFret: 1 },
  'B_maj7': { frets: [-1, 2, 4, 3, 4, 2], fingers: [null, 1, 3, 2, 4, 1], baseFret: 2 },
  'B_min7': { frets: [-1, 2, 0, 2, 0, 2], fingers: [null, 2, null, 3, null, 4], baseFret: 1 },
  'B_sus2': { frets: [-1, 2, 4, 4, 2, 2], fingers: [null, 1, 3, 4, 1, 1], baseFret: 2 },
  'B_sus4': { frets: [-1, 2, 4, 4, 5, 2], fingers: [null, 1, 2, 3, 4, 1], baseFret: 2 },
  'B_diminished': { frets: [-1, 2, 3, 4, 3, -1], fingers: [null, 1, 2, 4, 3, null], baseFret: 2 },
  'B_augmented': { frets: [-1, 2, 1, 0, 0, 3], fingers: [null, 2, 1, null, null, 3], baseFret: 1 },
};

// Movable Barre Chord Templates (E-shape root on 6th string, and A-shape root on 5th string)
// Used dynamically for sharp/flat roots (C#, D#, F#, G#, A#) or any missing chord
export function getGuitarChordVoicing(root: NoteName, chordType: ChordTypeId): GuitarChordVoicing {
  const key = `${root}_${chordType}`;
  if (OPEN_GUITAR_VOICINGS[key]) {
    const v = OPEN_GUITAR_VOICINGS[key];
    return {
      root,
      chordType,
      frets: v.frets,
      fingers: v.fingers,
      baseFret: v.baseFret,
    };
  }

  // Calculate dynamic barre chord:
  // Root pitch
  const rootPitch = getPitchClass(root);

  // Find fret of root note on String 6 (E string, open pitch 4)
  const fretOnString6 = (rootPitch - 4 + 12) % 12;
  // Find fret of root note on String 5 (A string, open pitch 9)
  const fretOnString5 = (rootPitch - 9 + 12) % 12;

  // Prefer String 5 if fret is <= 5, otherwise String 6
  if (fretOnString5 <= 6 && fretOnString5 > 0) {
    // A-shape barre chord at fretOnString5
    const f = fretOnString5;
    if (chordType === 'major') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 2, f + 2, f + 2, f],
        fingers: [null, 1, 2, 3, 4, 1],
        baseFret: f,
      };
    }
    if (chordType === 'minor') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 2, f + 2, f + 1, f],
        fingers: [null, 1, 3, 4, 2, 1],
        baseFret: f,
      };
    }
    if (chordType === 'dom7') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 2, f, f + 2, f],
        fingers: [null, 1, 3, 1, 4, 1],
        baseFret: f,
      };
    }
    if (chordType === 'maj7') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 2, f + 1, f + 2, f],
        fingers: [null, 1, 3, 2, 4, 1],
        baseFret: f,
      };
    }
    if (chordType === 'min7') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 2, f, f + 1, f],
        fingers: [null, 1, 3, 1, 2, 1],
        baseFret: f,
      };
    }
    if (chordType === 'sus2') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 2, f + 2, f, f],
        fingers: [null, 1, 3, 4, 1, 1],
        baseFret: f,
      };
    }
    if (chordType === 'sus4') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 2, f + 2, f + 3, f],
        fingers: [null, 1, 2, 3, 4, 1],
        baseFret: f,
      };
    }
    if (chordType === 'diminished') {
      return {
        root,
        chordType,
        frets: [-1, f, f + 1, f + 2, f + 1, -1],
        fingers: [null, 1, 2, 4, 3, null],
        baseFret: f,
      };
    }
    if (chordType === 'augmented' && f >= 3) {
      // A-string-root augmented triad: root, major 3rd, augmented 5th, octave.
      // This compact shape stays on positive frets when the A-string root is >= 3.
      return {
        root,
        chordType,
        frets: [-1, f, f - 1, f - 2, f - 2, -1],
        fingers: [null, 3, 2, 1, 1, null],
        baseFret: f - 2,
      };
    }
  }

  // E-shape barre chord at fretOnString6
  const f = fretOnString6 === 0 ? 12 : fretOnString6;

  if (chordType === 'augmented') {
    // Low-E-root augmented triad: root, major 3rd, augmented 5th.
    // Use this fallback when the A-shape would require negative frets.
    return {
      root,
      chordType,
      frets: [f, f - 1, f - 2, -1, -1, -1],
      fingers: [3, 2, 1, null, null, null],
      baseFret: Math.max(1, f - 2),
    };
  }
  if (chordType === 'major') {
    return {
      root,
      chordType,
      frets: [f, f + 2, f + 2, f + 1, f, f],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: f,
    };
  }
  if (chordType === 'minor') {
    return {
      root,
      chordType,
      frets: [f, f + 2, f + 2, f, f, f],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: f,
    };
  }
  if (chordType === 'dom7') {
    return {
      root,
      chordType,
      frets: [f, f + 2, f, f + 1, f, f],
      fingers: [1, 3, 1, 2, 1, 1],
      baseFret: f,
    };
  }
  if (chordType === 'maj7') {
    return {
      root,
      chordType,
      frets: [f, -1, f + 1, f + 1, f - 1, -1],
      fingers: [2, null, 3, 4, 1, null],
      baseFret: Math.max(1, f - 1),
    };
  }
  if (chordType === 'min7') {
    return {
      root,
      chordType,
      frets: [f, f + 2, f, f, f, f],
      fingers: [1, 3, 1, 1, 1, 1],
      baseFret: f,
    };
  }
  if (chordType === 'sus2') {
    return {
      root,
      chordType,
      frets: [f, f + 2, f + 4, f + 4, f, f],
      fingers: [1, 2, 4, 4, 1, 1],
      baseFret: f,
    };
  }
  if (chordType === 'diminished') {
    return {
      root,
      chordType,
      frets: [f, f + 1, f + 2, f, -1, -1],
      fingers: [1, 2, 3, 1, null, null],
      baseFret: f,
    };
  }
  if (chordType === 'sus4') {
    return {
      root,
      chordType,
      frets: [f, f + 2, f + 2, f + 2, f, f],
      fingers: [1, 2, 3, 4, 1, 1],
      baseFret: f,
    };
  }
  return {
    root,
    chordType,
    frets: [f, f + 2, f + 2, f, f, f],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: f,
  };
}

// Bass Arpeggio Groove Patterns
// Bassists practice arpeggio box patterns (Root -> 3rd/2nd/4th -> 5th -> Octave)
export function getBassArpeggioPattern(chord: CalculatedChord): BassArpeggioPattern {
  const rootPitch = getPitchClass(chord.root);

  // Find root on String 4 (Low E) between frets 1 and 12
  let rootString = 4;
  let rootFret = (rootPitch - 4 + 12) % 12;
  if (rootFret === 0) rootFret = 12; // place at fret 12 or fret 0

  // If root fret is too high (> 7), place on String 3 (A string)
  if (rootFret > 7) {
    rootString = 3;
    rootFret = (rootPitch - 9 + 12) % 12;
  }

  // Calculate notes in arpeggio box pattern
  const patternNotes = chord.notes.map((note) => {
    const semitonesFromRoot = note.semitoneFromRoot;
    let sNum = rootString;
    let fNum = rootFret + semitonesFromRoot;

    // Shift to next higher string if fret goes beyond +4
    if (semitonesFromRoot >= 5 && rootString > 1) {
      sNum = rootString - 1;
      // String intervals in bass: 4th (5 semitones between adjacent strings)
      fNum = rootFret + semitonesFromRoot - 5;
    }

    return {
      stringNum: sNum,
      fret: fNum,
      pitchClass: note.pitchClass,
      noteName: note.noteName,
      role: note.roleNameEn,
    };
  });

  return {
    nameEn: `${chord.fullNameEn} Bass Arpeggio Box`,
    nameMy: `${chord.fullNameMy} ဘေ့စ် အာပယ်ဂျီယို ပုံစံ`,
    notes: patternNotes,
  };
}
