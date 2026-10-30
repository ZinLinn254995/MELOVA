import {
  NoteName,
  ChordTypeId,
  ChordTypeDefinition,
  ChordNoteInfo,
  StepIntervalInfo,
  CalculatedChord,
} from '../types/music';

// 12 chromatic pitches (Equal-tempered 12-TET)
export const CHROMATIC_NOTES: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

// Display alias for flat-friendly root notes
export const ROOT_NOTES: { note: NoteName; labelEn: string; labelMy: string }[] = [
  { note: 'C', labelEn: 'C', labelMy: 'C' },
  { note: 'C#', labelEn: 'C# / D♭', labelMy: 'C# / D♭' },
  { note: 'D', labelEn: 'D', labelMy: 'D' },
  { note: 'D#', labelEn: 'D# / E♭', labelMy: 'D# / E♭' },
  { note: 'E', labelEn: 'E', labelMy: 'E' },
  { note: 'F', labelEn: 'F', labelMy: 'F' },
  { note: 'F#', labelEn: 'F# / G♭', labelMy: 'F# / G♭' },
  { note: 'G', labelEn: 'G', labelMy: 'G' },
  { note: 'G#', labelEn: 'G# / A♭', labelMy: 'G# / A♭' },
  { note: 'A', labelEn: 'A', labelMy: 'A' },
  { note: 'A#', labelEn: 'A# / B♭', labelMy: 'A# / B♭' },
  { note: 'B', labelEn: 'B', labelMy: 'B' },
];

export const CHORD_DEFINITIONS: Record<ChordTypeId, ChordTypeDefinition> = {
  major: {
    id: 'major',
    nameEn: 'Major Triad',
    nameMy: 'မေဂျာ (Major)',
    symbol: '',
    semitoneFormula: [0, 4, 7],
    stepIntervals: [4, 3],
    formulaPatternEn: '4 + 3 semitones',
    formulaPatternMy: '၄ + ၃ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Bright, cheerful, and stable sound.',
    descriptionMy: 'ကြည်လင်၊ ရွှင်လန်းပြီး တည်ငြိမ်တဲ့ အသံထွက်ရှိပါတယ်။',
  },
  minor: {
    id: 'minor',
    nameEn: 'Minor Triad',
    nameMy: 'မိုင်နာ (Minor)',
    symbol: 'm',
    semitoneFormula: [0, 3, 7],
    stepIntervals: [3, 4],
    formulaPatternEn: '3 + 4 semitones',
    formulaPatternMy: '၃ + ၄ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Mellow, emotional, or melancholic sound.',
    descriptionMy: 'နူးညံ့ငြိမ်သက်ပြီး စိတ်ခံစားမှု သို့မဟုတ် အနည်းငယ် ဝမ်းနည်းဖွယ် အသံထွက်ရှိပါတယ်။',
  },
  diminished: {
    id: 'diminished',
    nameEn: 'Diminished Triad',
    nameMy: 'ဒစ်မီနစ်ရှ် (Diminished)',
    symbol: 'dim',
    semitoneFormula: [0, 3, 6],
    stepIntervals: [3, 3],
    formulaPatternEn: '3 + 3 semitones',
    formulaPatternMy: '၃ + ၃ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Tense, unstable sound that wants to resolve.',
    descriptionMy: 'တင်းမာမှုရှိပြီး အခြားတည်ငြိမ်သော chord သို့ ကူးပြောင်းချင်သည့် အသံဖြစ်ပါတယ်။',
  },
  augmented: {
    id: 'augmented',
    nameEn: 'Augmented Triad',
    nameMy: 'အောက်မန်တက်ဒ် (Augmented)',
    symbol: 'aug',
    semitoneFormula: [0, 4, 8],
    stepIntervals: [4, 4],
    formulaPatternEn: '4 + 4 semitones',
    formulaPatternMy: '၄ + ၄ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Dreamy, mysterious, and suspended sensation.',
    descriptionMy: 'ဆန်းကြယ်ပြီး အာကာသထဲ လွင့်မြောနေသကဲ့သို့ ထူးခြားသည့် အသံဖြစ်ပါတယ်။',
  },
  sus2: {
    id: 'sus2',
    nameEn: 'Suspended 2',
    nameMy: 'ဆပ်စ်တူး (Sus2)',
    symbol: 'sus2',
    semitoneFormula: [0, 2, 7],
    stepIntervals: [2, 5],
    formulaPatternEn: '2 + 5 semitones',
    formulaPatternMy: '၂ + ၅ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Open and floating; replaces the 3rd with the 2nd.',
    descriptionMy: 'မေဂျာ/မိုင်နာ သတ်မှတ်သည့် တတိယအဆင့်အစား ဒုတိယအဆင့် (2nd) ကို အစားထိုးထားပါတယ်။',
  },
  sus4: {
    id: 'sus4',
    nameEn: 'Suspended 4',
    nameMy: 'ဆပ်စ်ဖိုး (Sus4)',
    symbol: 'sus4',
    semitoneFormula: [0, 5, 7],
    stepIntervals: [5, 2],
    formulaPatternEn: '5 + 2 semitones',
    formulaPatternMy: '၅ + ၂ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Anticipatory sound; replaces the 3rd with the 4th.',
    descriptionMy: 'မျှော်လင့်တောင့်တဖွယ် အသံဖြစ်ပြီး 4th note က 3rd သို့ ပြန်ပြေလျော့ချင်ပါတယ်။',
  },
  dom7: {
    id: 'dom7',
    nameEn: 'Dominant 7th',
    nameMy: 'ဒေါမီနန့် ဆဲဗင်း (7th)',
    symbol: '7',
    semitoneFormula: [0, 4, 7, 10],
    stepIntervals: [4, 3, 3],
    formulaPatternEn: '4 + 3 + 3 semitones',
    formulaPatternMy: '၄ + ၃ + ၃ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Bluesy, rich, and strong pull to the tonic.',
    descriptionMy: 'ဘလူးစ် (Blues) နှင့် ဂျက်ဇ် (Jazz) သီချင်းများတွင် အလွန်အသုံးများသည့် ၄ သံတွဲ chord ဖြစ်ပါတယ်။',
  },
  maj7: {
    id: 'maj7',
    nameEn: 'Major 7th',
    nameMy: 'မေဂျာ ဆဲဗင်း (Maj7)',
    symbol: 'maj7',
    semitoneFormula: [0, 4, 7, 11],
    stepIntervals: [4, 3, 4],
    formulaPatternEn: '4 + 3 + 4 semitones',
    formulaPatternMy: '၄ + ၃ + ၄ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Smooth, lush, warm, and sophisticated jazz sound.',
    descriptionMy: 'ငြိမ့်ညောင်းနူးညံ့ပြီး ဇိမ်ခံကာ ခေတ်မီဆန်းပြားသော jazz/pop အသံထွက်ဖြစ်ပါတယ်။',
  },
  min7: {
    id: 'min7',
    nameEn: 'Minor 7th',
    nameMy: 'မိုင်နာ ဆဲဗင်း (m7)',
    symbol: 'm7',
    semitoneFormula: [0, 3, 7, 10],
    stepIntervals: [3, 4, 3],
    formulaPatternEn: '3 + 4 + 3 semitones',
    formulaPatternMy: '၃ + ၄ + ၃ ဆီမီးတုန်း (အကွာအဝေး)',
    descriptionEn: 'Deep, emotional, modern ballad and neo-soul staple.',
    descriptionMy: 'နက်ရှိုင်းအေးဆေးပြီး R&B၊ Neo-Soul နှင့် ဘဲလက်ဒ်သီချင်းများတွင် မရှိမဖြစ် chord ဖြစ်ပါတယ်။',
  },
};

// Standard music theory enharmonic spelling lookup table
// Maps root note + chord type -> friendly accurate note names
export const ENHARMONIC_SPELLINGS: Record<string, string[]> = {
  // Major chords
  'C_major': ['C', 'E', 'G'],
  'C#_major': ['C#', 'E#', 'G#'],
  'D_major': ['D', 'F#', 'A'],
  'D#_major': ['Eb', 'G', 'Bb'],
  'E_major': ['E', 'G#', 'B'],
  'F_major': ['F', 'A', 'C'],
  'F#_major': ['F#', 'A#', 'C#'],
  'G_major': ['G', 'B', 'D'],
  'G#_major': ['Ab', 'C', 'Eb'],
  'A_major': ['A', 'C#', 'E'],
  'A#_major': ['Bb', 'D', 'F'],
  'B_major': ['B', 'D#', 'F#'],

  // Minor chords
  'C_minor': ['C', 'Eb', 'G'],
  'C#_minor': ['C#', 'E', 'G#'],
  'D_minor': ['D', 'F', 'A'],
  'D#_minor': ['Eb', 'Gb', 'Bb'],
  'E_minor': ['E', 'G', 'B'],
  'F_minor': ['F', 'Ab', 'C'],
  'F#_minor': ['F#', 'A', 'C#'],
  'G_minor': ['G', 'Bb', 'D'],
  'G#_minor': ['G#', 'B', 'D#'],
  'A_minor': ['A', 'C', 'E'],
  'A#_minor': ['Bb', 'Db', 'F'],
  'B_minor': ['B', 'D', 'F#'],

  // Diminished chords
  'C_diminished': ['C', 'Eb', 'Gb'],
  'C#_diminished': ['C#', 'E', 'G'],
  'D_diminished': ['D', 'F', 'Ab'],
  'D#_diminished': ['Eb', 'Gb', 'A'],
  'E_diminished': ['E', 'G', 'Bb'],
  'F_diminished': ['F', 'Ab', 'B'],
  'F#_diminished': ['F#', 'A', 'C'],
  'G_diminished': ['G', 'Bb', 'Db'],
  'G#_diminished': ['G#', 'B', 'D'],
  'A_diminished': ['A', 'C', 'Eb'],
  'A#_diminished': ['Bb', 'Db', 'E'],
  'B_diminished': ['B', 'D', 'F'],

  // Augmented chords
  'C_augmented': ['C', 'E', 'G#'],
  'C#_augmented': ['C#', 'F', 'A'],
  'D_augmented': ['D', 'F#', 'A#'],
  'D#_augmented': ['Eb', 'G', 'B'],
  'E_augmented': ['E', 'G#', 'C'],
  'F_augmented': ['F', 'A', 'C#'],
  'F#_augmented': ['F#', 'A#', 'D'],
  'G_augmented': ['G', 'B', 'D#'],
  'G#_augmented': ['Ab', 'C', 'E'],
  'A_augmented': ['A', 'C#', 'F'],
  'A#_augmented': ['Bb', 'D', 'F#'],
  'B_augmented': ['B', 'D#', 'G'],

  // Sus2 chords
  'C_sus2': ['C', 'D', 'G'],
  'C#_sus2': ['C#', 'D#', 'G#'],
  'D_sus2': ['D', 'E', 'A'],
  'D#_sus2': ['Eb', 'F', 'Bb'],
  'E_sus2': ['E', 'F#', 'B'],
  'F_sus2': ['F', 'G', 'C'],
  'F#_sus2': ['F#', 'G#', 'C#'],
  'G_sus2': ['G', 'A', 'D'],
  'G#_sus2': ['Ab', 'Bb', 'Eb'],
  'A_sus2': ['A', 'B', 'E'],
  'A#_sus2': ['Bb', 'C', 'F'],
  'B_sus2': ['B', 'C#', 'F#'],

  // Sus4 chords
  'C_sus4': ['C', 'F', 'G'],
  'C#_sus4': ['C#', 'F#', 'G#'],
  'D_sus4': ['D', 'G', 'A'],
  'D#_sus4': ['Eb', 'Ab', 'Bb'],
  'E_sus4': ['E', 'A', 'B'],
  'F_sus4': ['F', 'Bb', 'C'],
  'F#_sus4': ['F#', 'B', 'C#'],
  'G_sus4': ['G', 'C', 'D'],
  'G#_sus4': ['Ab', 'Db', 'Eb'],
  'A_sus4': ['A', 'D', 'E'],
  'A#_sus4': ['Bb', 'Eb', 'F'],
  'B_sus4': ['B', 'E', 'F#'],

  // Dominant 7 chords
  'C_dom7': ['C', 'E', 'G', 'Bb'],
  'C#_dom7': ['C#', 'F', 'G#', 'B'],
  'D_dom7': ['D', 'F#', 'A', 'C'],
  'D#_dom7': ['Eb', 'G', 'Bb', 'Db'],
  'E_dom7': ['E', 'G#', 'B', 'D'],
  'F_dom7': ['F', 'A', 'C', 'Eb'],
  'F#_dom7': ['F#', 'A#', 'C#', 'E'],
  'G_dom7': ['G', 'B', 'D', 'F'],
  'G#_dom7': ['Ab', 'C', 'Eb', 'Gb'],
  'A_dom7': ['A', 'C#', 'E', 'G'],
  'A#_dom7': ['Bb', 'D', 'F', 'Ab'],
  'B_dom7': ['B', 'D#', 'F#', 'A'],

  // Major 7 chords
  'C_maj7': ['C', 'E', 'G', 'B'],
  'C#_maj7': ['C#', 'E#', 'G#', 'B#'],
  'D_maj7': ['D', 'F#', 'A', 'C#'],
  'D#_maj7': ['Eb', 'G', 'Bb', 'D'],
  'E_maj7': ['E', 'G#', 'B', 'D#'],
  'F_maj7': ['F', 'A', 'C', 'E'],
  'F#_maj7': ['F#', 'A#', 'C#', 'E#'],
  'G_maj7': ['G', 'B', 'D', 'F#'],
  'G#_maj7': ['Ab', 'C', 'Eb', 'G'],
  'A_maj7': ['A', 'C#', 'E', 'G#'],
  'A#_maj7': ['Bb', 'D', 'F', 'A'],
  'B_maj7': ['B', 'D#', 'F#', 'A#'],

  // Minor 7 chords
  'C_min7': ['C', 'Eb', 'G', 'Bb'],
  'C#_min7': ['C#', 'E', 'G#', 'B'],
  'D_min7': ['D', 'F', 'A', 'C'],
  'D#_min7': ['Eb', 'Gb', 'Bb', 'Db'],
  'E_min7': ['E', 'G', 'B', 'D'],
  'F_min7': ['F', 'Ab', 'C', 'Eb'],
  'F#_min7': ['F#', 'A', 'C#', 'E'],
  'G_min7': ['G', 'Bb', 'D', 'F'],
  'G#_min7': ['G#', 'B', 'D#', 'F#'],
  'A_min7': ['A', 'C', 'E', 'G'],
  'A#_min7': ['Bb', 'Db', 'F', 'Ab'],
  'B_min7': ['B', 'D', 'F#', 'A'],
};

// Convert note to standard chromatic pitch (0-11)
export function getPitchClass(note: string): number {
  const clean = note.trim();
  switch (clean) {
    case 'C':
    case 'B#':
      return 0;
    case 'C#':
    case 'Db':
      return 1;
    case 'D':
      return 2;
    case 'D#':
    case 'Eb':
      return 3;
    case 'E':
      return 4;
    case 'F':
    case 'E#':
      return 5;
    case 'F#':
    case 'Gb':
      return 6;
    case 'G':
      return 7;
    case 'G#':
    case 'Ab':
      return 8;
    case 'A':
      return 9;
    case 'A#':
    case 'Bb':
      return 10;
    case 'B':
      return 11;
    default:
      return 0;
  }
}

// Convert pitch class (0-11) back to standard keyboard NoteName
export function pitchClassToNoteName(pitch: number): NoteName {
  const norm = ((pitch % 12) + 12) % 12;
  return CHROMATIC_NOTES[norm];
}

// Burmese role name mapping
function getRoleInfo(
  index: number,
  chordTypeId: ChordTypeId
): {
  role: ChordNoteInfo['role'];
  roleNameEn: string;
  roleNameMy: string;
} {
  if (index === 0) {
    return { role: 'root', roleNameEn: 'Root Note', roleNameMy: 'အခြေခံ အသံ (Root)' };
  }
  if (index === 1) {
    if (chordTypeId === 'sus2') {
      return { role: 'second', roleNameEn: 'Major 2nd', roleNameMy: 'ဒုတိယအသံ (2nd)' };
    }
    if (chordTypeId === 'sus4') {
      return { role: 'fourth', roleNameEn: 'Perfect 4th', roleNameMy: 'စတုတ္ထအသံ (4th)' };
    }
    return { role: 'third', roleNameEn: '3rd Tone', roleNameMy: 'တတိယအသံ (3rd)' };
  }
  if (index === 2) {
    return { role: 'fifth', roleNameEn: '5th Tone', roleNameMy: 'ပဉ္စမအသံ (5th)' };
  }
  return { role: 'seventh', roleNameEn: '7th Tone', roleNameMy: 'သတ္တမအသံ (7th)' };
}

// Burmese number converter for display
export function toBurmeseNumber(num: number | string): string {
  const burmeseDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  return num
    .toString()
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? burmeseDigits[parsed] : char;
    })
    .join('');
}

// Calculate chromatic path between two notes (semitone step by step)
export function getChromaticPath(startPitch: number, semitones: number): string[] {
  const path: string[] = [];
  for (let i = 0; i <= semitones; i++) {
    const pitch = (startPitch + i) % 12;
    path.push(pitchClassToNoteName(pitch));
  }
  return path;
}

// Master calculation function: Single source of truth for the entire app
export function calculateChord(root: NoteName, chordTypeId: ChordTypeId): CalculatedChord {
  const chordType = CHORD_DEFINITIONS[chordTypeId];
  const rootPitch = getPitchClass(root);

  // Look up enharmonic names or compute standard
  const lookupKey = `${root}_${chordTypeId}`;
  const customNames = ENHARMONIC_SPELLINGS[lookupKey];

  const notes: ChordNoteInfo[] = chordType.semitoneFormula.map((semitone, index) => {
    const pitchClass = (rootPitch + semitone) % 12;
    const standardName = pitchClassToNoteName(pitchClass);
    const noteName = customNames && customNames[index] ? customNames[index] : standardName;
    const roleInfo = getRoleInfo(index, chordTypeId);

    return {
      pitchClass,
      noteName,
      standardName,
      semitoneFromRoot: semitone,
      ...roleInfo,
    };
  });

  // Calculate consecutive step intervals
  const stepIntervals: StepIntervalInfo[] = [];
  for (let i = 0; i < notes.length - 1; i++) {
    const current = notes[i];
    const next = notes[i + 1];
    const semitones = next.semitoneFromRoot - current.semitoneFromRoot;
    const chromaticPath = getChromaticPath(current.pitchClass, semitones);

    stepIntervals.push({
      fromNote: current.noteName,
      toNote: next.noteName,
      semitones,
      chromaticPath,
    });
  }

  const rootDisplayName = ROOT_NOTES.find((r) => r.note === root)?.labelEn || root;
  const fullNameEn = `${root} ${chordType.nameEn}`;
  const fullNameMy = `${root} ${chordType.nameMy}`;

  // Generate Burmese explanation matching the prompt format exactly:
  // “E Major မှာ Note ၃ လုံး ပါတယ်။ E ကို စမှတ်ထားပါ။ E ကနေ ၄ ဆင့်သွားရင် G# ရောက်မယ်။ G# ကနေ ၃ ဆင့်သွားရင် B ရောက်မယ်။ ဒါကြောင့် E Major = E – G# – B ဖြစ်တယ်။”
  const noteCountBurmese = toBurmeseNumber(notes.length);
  const noteListBurmese = notes.map((n) => n.noteName).join(' – ');
  const rootNoteName = notes[0].noteName;

  let stepsExplanationMy = `${fullNameMy} မှာ Note ${noteCountBurmese} လုံး ပါတယ်။ ${rootNoteName} ကို စမှတ် (Step 0) အဖြစ် စထားပါ။ `;
  stepIntervals.forEach((step) => {
    const stBurmese = toBurmeseNumber(step.semitones);
    stepsExplanationMy += `${step.fromNote} ကနေ ${stBurmese} ဆင့် (Semitones) သွားရင် ${step.toNote} ရောက်မယ်။ `;
  });
  stepsExplanationMy += `ဒါကြောင့် ${fullNameMy} = ${noteListBurmese} ဖြစ်ပါတယ်။`;

  // English explanation
  let stepsExplanationEn = `${fullNameEn} consists of ${notes.length} notes. Start at root note ${rootNoteName} (Step 0). `;
  stepIntervals.forEach((step) => {
    stepsExplanationEn += `Count up ${step.semitones} semitones from ${step.fromNote} to land on ${step.toNote}. `;
  });
  const noteListEn = notes.map((n) => n.noteName).join(' – ');
  stepsExplanationEn += `Therefore, ${fullNameEn} = ${noteListEn}.`;

  // All octave key pitch classes
  const allOctaveKeyPitches = notes.map((n) => n.pitchClass);

  return {
    root,
    chordType,
    fullNameEn,
    fullNameMy,
    notes,
    stepIntervals,
    semitoneFormula: chordType.semitoneFormula,
    allOctaveKeyPitches,
    explanationEn: stepsExplanationEn,
    explanationMy: stepsExplanationMy,
  };
}

// 7 Natural Root Major Chords (as explicitly requested for Reference Table)
export const SEVEN_NATURAL_MAJOR_CHORDS: {
  root: NoteName;
  formula: string;
  notes: string;
  semitones: string;
}[] = [
  { root: 'C', formula: 'C – E – G', notes: 'C, E, G', semitones: '4 + 3' },
  { root: 'D', formula: 'D – F# – A', notes: 'D, F#, A', semitones: '4 + 3' },
  { root: 'E', formula: 'E – G# – B', notes: 'E, G#, B', semitones: '4 + 3' },
  { root: 'F', formula: 'F – A – C', notes: 'F, A, C', semitones: '4 + 3' },
  { root: 'G', formula: 'G – B – D', notes: 'G, B, D', semitones: '4 + 3' },
  { root: 'A', formula: 'A – C# – E', notes: 'A, C#, E', semitones: '4 + 3' },
  { root: 'B', formula: 'B – D# – F#', notes: 'B, D#, F#', semitones: '4 + 3' },
];
