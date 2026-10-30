import { Language } from '../types/music';

export const translations = {
  my: {
    appTitle: 'တူရိယာ Chord ရှာဖွေလေ့လာရန်',
    appSubtitle: 'Piano, Guitar & Bass Chord Notes & Semitone Distance Guide',
    badgeBeginner: 'တူရိယာ ၃ မျိုးသုံး Chord လမ်းညွှန်',
    rootNote: 'အခြေခံ အသံ (Root)',
    chordType: 'Chord အမျိုးအစား',
    octaves: 'ကီးဘုတ် အကျယ်',
    octaves2: '၂ အောက်တေ့ဗ် (2 Octaves)',
    octaves3: '၃ အောက်တေ့ဗ် (3 Octaves)',
    displayMode: 'ပြသမည့် ပုံစံ',
    showNoteNames: 'Note အမည် (C, E, G)',
    showSemitones: 'ဆီမီးတုန်း (+0, +4, +7)',
    language: 'ဘာသာစကား',
    
    // Instrument Switcher
    instrumentSelect: 'လေ့လာလိုသော တူရိယာ',
    instrumentPiano: 'စန္ဒရား (Piano)',
    instrumentGuitar: 'ဂစ်တာ (Guitar)',
    instrumentBass: 'ဘေ့စ် (Bass)',

    // Guitar Specific
    guitarViewMode: 'ဂစ်တာ ပြသမှု ပုံစံ',
    guitarChordChart: 'Chord လက်ကွက် (Chord Chart)',
    guitarFretboardMap: 'လည်တံတစ်ခုလုံး Note များ (Full Fretboard)',
    strumGuitar: 'Chord တီးခတ်မည် (Strum)',
    pluckGuitar: 'ကြိုးတစ်ချောင်းချင်း ဒေါက်မည် (Pluck)',
    guitarStringTuning: 'ဂစ်တာ ကြိုး ၆ ချောင်း (E A D G B E)',
    guitarBarreAtFret: 'လက်ကွက် အခြေပြု အကွက်',
    fretLabel: 'အကွက် (Fret)',
    mutedString: 'မတီးရ (X)',
    openString: 'ကြိုးလွတ် (O)',
    fingerLegend: 'လက်ချောင်းအညွှန်း (1=လက်ညှိုး, 2=လက်ခလယ်, 3=လက်သူကြွယ်, 4=လက်သန်း)',

    // Bass Specific
    bassViewMode: 'ဘေ့စ် ပြသမှု ပုံစံ',
    bassArpeggioBox: 'အာပယ်ဂျီယို လက်ကွက် (Arpeggio Box)',
    bassFretboardMap: 'ဘေ့စ်လည်တံပေါ်ရှိ Note အားလုံး',
    playBassGroove: 'ဘေ့စ် အာပယ်ဂျီယို တီးခတ်မည်',
    playBassChord: 'ဘေ့စ် Note စုံ တီးမည်',
    bassStringTuning: 'ဘေ့စ် ကြိုး ၄ ချောင်း (E A D G)',

    // Playback
    playChord: 'Chord အသံစုံတီးမည်',
    playNotesSeparately: 'တစ်လုံးချင်း ခွဲတီးမည်',
    volume: 'အသံအတိုးအကျယ်',
    mute: 'အသံပိတ်',
    unmute: 'အသံဖွင့်',
    soundHint: 'ကီး သို့မဟုတ် ကြိုးများကို နှိပ်၍ အသံနားဆင်နိုင်ပါသည်',

    // Keyboard & Fretboard Legend
    legendRoot: 'Root Note (အခြေခံ)',
    legendChordTone: 'Chord Note (ပါဝင်သော အသံများ)',
    legendCountingStep: 'ရေတွက်နေသော အဆင့် (Current Step)',
    scrollKeyboardHint: '👉 ဘယ်/ညာ ပွတ်ဆွဲ၍ ကြည့်ရှုနိုင်ပါသည်',

    // Semitone visualizer
    semitoneTitle: 'ဆီမီးတုန်း အကွာအဝေး တိုင်းတာချက် (Semitone Visualizer)',
    semitoneSubtitle: 'Chord တစ်ခုတွင် Note တစ်လုံးနှင့် တစ်လုံး မည်မျှ ကွာဝေးသည်ကို လေ့လာပါ (တူရိယာအားလုံးတွင် တူညီပါသည်)',
    semitoneDefinitionTitle: 'ဆီမီးတုန်း (Semitone / Half Step) ဆိုတာ ဘာလဲ?',
    semitoneDefinitionText: 'စန္ဒရားတွင် ကပ်လျက်ရှိသော ဘေးကီး (Key) တစ်ခုဆီသို့၊ ဂစ်တာ/ဘေ့စ်တွင် ကပ်လျက်ရှိသော Fret (အကွက်) တစ်ကွက် ရွှေ့ခြင်းကို ၁ ဆီမီးတုန်း (1 Semitone) ဟု ခေါ်ပါတယ်။ စတင်သည့်နေရာကို ၀ (Zero) အဖြစ်ထားပြီး ကပ်လျက်နေရာသို့ ရွှေ့သည့် အရေအတွက်ကို ၁၊ ၂၊ ၃ ဟု ရေတွက်ရပါမည်။',
    semitonesUnit: 'ဆီမီးတုန်း (Semitones)',
    stepByStepMode: 'တစ်ဆင့်ချင်း အကွာအဝေး ရေတွက်ကြည့်ရန်',
    startCounting: 'ရေတွက်မှု စတင်မည်',
    nextStep: 'နောက်တစ်ဆင့် (Next)',
    resetCounting: 'ပြန်စမည် (Reset)',
    autoPlayWalk: 'အသံနှင့် အလိုအလျောက် ရေတွက်မည်',
    stepProgress: 'အဆင့်',
    from: 'မှ',
    to: 'သို့',
    semitoneStepCount: 'ဆီမီးတုန်း အကွာအဝေး',
    startingAtZero: 'စမှတ်ကို ၀ ဟု မှတ်ယူပါ',

    // Beginner lesson panel
    lessonTitle: 'အခြေခံ လေ့လာရန် ရှင်းလင်းချက် (Lesson Guide)',
    formulaTitle: 'Chord ဖော်မြူလာ (Interval Formula)',
    chordNotesCount: 'ပါဝင်သော Note များ',
    beginnerTipTitle: 'တူရိယာ စသင်သူများအတွက် အရေးကြီးသော အချက်များ',
    tipEfBc: 'သတိပြုရန် - E နှင့် F အကြား၊ B နှင့် C အကြားတွင် အလယ်ကြားသံမရှိပါ (စန္ဒရားတွင် အမည်းကီးမရှိသလို၊ ဂစ်တာတွင်လည်း ၁ ကွက်သာ ကွာဝေးပါသည်)။',
    tipFormula: 'မေဂျာ (Major) Chord အားလုံးသည် ၄ + ၃ ဆီမီးတုန်း၊ မိုင်နာ (Minor) သည် ၃ + ၄ ဆီမီးတုန်း ဖော်မြူလာအတိုင်း စန္ဒရား၊ ဂစ်တာ၊ ဘေ့စ် အားလုံးတွင် အတူတူပင် ဖြစ်ပါသည်။',
    
    // Reference Table
    referenceTitle: 'အခြေခံ မေဂျာ Chord ၇ မျိုး ဇယား (Chord Reference)',
    referenceSubtitle: 'အသုံးအများဆုံး သဘာဝသံ (Natural Roots) Major Chords များကို ချက်ချင်း ရွေးချယ်နိုင်ပါသည်',
    tabNaturalMajor: 'အခြေခံ Major ၇ မျိုး',
    tabAllRoots: '၁၂ မျိုးစလုံး (All 12 Roots)',
    colChord: 'Chord',
    colNotes: 'ပါဝင်သော Note များ',
    colGuitarVoicing: 'ဂစ်တာ လက်ကွက်',
    colFormula: 'ဆီမီးတုန်း ပုံသေနည်း',
    colAction: 'ရွေးချယ်ရန်',
    selectChord: 'လေ့လာမည်',

    // Practice Mode
    practiceTitle: 'လေ့ကျင့်ခန်းနှင့် စမ်းသပ်မှု (Practice & Quiz)',
    practiceSubtitle: 'Piano, Guitar, Bass အတွက် Chord နှင့် Semitone များကို မိမိကိုယ်တိုင် သိရှိမှု စစ်ဆေးပါ',
    score: 'ရမှတ်',
    streak: 'ဆက်တိုက်မှန်',
    accuracy: 'တိကျမှု',
    question: 'မေးခွန်း',
    checkAnswer: 'အဖြေစစ်ဆေးမည်',
    nextQuestion: 'နောက်မေးခွန်း',
    correct: 'မှန်ကန်ပါသည်! အလွန်တော်ပါသည်။',
    incorrect: 'မှားယွင်းနေပါသည်။ စိတ်မလျှော့ဘဲ ပြန်လည်လေ့လာကြည့်ပါ။',
    explanation: 'ရှင်းလင်းချက်',
    restartQuiz: 'အသစ်ပြန်လည်စတင်မည်',

    // Nav
    navInstrument: 'တူရိယာ',
    navKeyboard: 'တူရိယာပြကွက်',
    navSemitones: 'ဆီမီးတုန်း',
    navLesson: 'ရှင်းလင်းချက်',
    navReference: 'Chord ဇယား',
    navPractice: 'လေ့ကျင့်ခန်း',
  },
  en: {
    appTitle: 'Chord Finder',
    appSubtitle: 'Interactive Piano, Guitar & Bass Chord & Semitone Guide',
    badgeBeginner: '3-in-1 Instrument Guide',
    rootNote: 'Root Note',
    chordType: 'Chord Type',
    octaves: 'Keyboard Octaves',
    octaves2: '2 Octaves',
    octaves3: '3 Octaves',
    displayMode: 'Display Mode',
    showNoteNames: 'Note Names (C, E, G)',
    showSemitones: 'Semitones (+0, +4, +7)',
    language: 'Language',

    // Instrument Switcher
    instrumentSelect: 'Select Instrument',
    instrumentPiano: 'Piano',
    instrumentGuitar: 'Guitar',
    instrumentBass: 'Bass',

    // Guitar Specific
    guitarViewMode: 'Guitar View',
    guitarChordChart: 'Chord Chart & Voicing',
    guitarFretboardMap: 'Full Fretboard Map',
    strumGuitar: 'Strum Chord',
    pluckGuitar: 'Pluck Strings',
    guitarStringTuning: '6 Strings (E A D G B E)',
    guitarBarreAtFret: 'Base Position',
    fretLabel: 'Fret',
    mutedString: 'Muted (X)',
    openString: 'Open (O)',
    fingerLegend: 'Fingers (1=Index, 2=Middle, 3=Ring, 4=Pinky)',

    // Bass Specific
    bassViewMode: 'Bass View',
    bassArpeggioBox: 'Arpeggio Box Pattern',
    bassFretboardMap: 'Full Fretboard Notes',
    playBassGroove: 'Play Bass Groove',
    playBassChord: 'Play Bass Notes',
    bassStringTuning: '4 Strings (E A D G)',

    // Playback
    playChord: 'Play Full Chord',
    playNotesSeparately: 'Play Arpeggio',
    volume: 'Volume',
    mute: 'Mute',
    unmute: 'Unmute',
    soundHint: 'Click piano keys or fretboard notes to hear authentic tones',

    // Keyboard & Fretboard Legend
    legendRoot: 'Root Note (Tonic)',
    legendChordTone: 'Chord Note',
    legendCountingStep: 'Current Step in Semitone Walk',
    scrollKeyboardHint: '👉 Drag or scroll sideways to view the full neck',

    // Semitone visualizer
    semitoneTitle: 'Semitone Distance Visualizer',
    semitoneSubtitle: 'Understand semitone distances between chord notes (Universal across Piano, Guitar & Bass)',
    semitoneDefinitionTitle: 'What is a Semitone (Half Step)?',
    semitoneDefinitionText: 'On piano, a semitone is the adjacent key. On guitar & bass, moving by exactly 1 fret is 1 semitone. Starting point is Step 0, and each move counts as +1 semitone.',
    semitonesUnit: 'semitones',
    stepByStepMode: 'Step-by-Step Semitone Walkthrough',
    startCounting: 'Start Step Walkthrough',
    nextStep: 'Next Step',
    resetCounting: 'Reset',
    autoPlayWalk: 'Auto Walk with Audio',
    stepProgress: 'Step',
    from: 'From',
    to: 'To',
    semitoneStepCount: 'Semitone Distance',
    startingAtZero: 'Starting note is Step 0',

    // Beginner lesson panel
    lessonTitle: 'Beginner Chord Breakdown',
    formulaTitle: 'Interval Formula',
    chordNotesCount: 'Notes in Chord',
    beginnerTipTitle: 'Essential Music Fundamentals for All 3 Instruments',
    tipEfBc: 'Key insight: Between E & F, and between B & C, there are NO sharps/flats (no black key on piano; exactly 1 fret apart on guitar & bass)!',
    tipFormula: 'Every Major triad uses 4 + 3 semitones; every Minor triad uses 3 + 4 semitones. This rule is 100% identical on Piano, Guitar, and Bass.',

    // Reference Table
    referenceTitle: 'Chord Reference Tables',
    referenceSubtitle: 'Quick lookup for natural root chords and chromatic variations',
    tabNaturalMajor: '7 Natural Major Chords',
    tabAllRoots: 'All 12 Roots',
    colChord: 'Chord',
    colNotes: 'Notes',
    colGuitarVoicing: 'Guitar Voicing',
    colFormula: 'Interval Formula',
    colAction: 'Action',
    selectChord: 'Explore',

    // Practice Mode
    practiceTitle: 'Practice & Self-Test',
    practiceSubtitle: 'Test your understanding of chord notes and semitones across Piano, Guitar & Bass',
    score: 'Score',
    streak: 'Streak',
    accuracy: 'Accuracy',
    question: 'Question',
    checkAnswer: 'Check Answer',
    nextQuestion: 'Next Question',
    correct: 'Correct! Excellent job.',
    incorrect: 'Not quite. Review the explanation below.',
    explanation: 'Explanation',
    restartQuiz: 'Reset Score',

    // Nav
    navInstrument: 'Instrument',
    navKeyboard: 'Instrument View',
    navSemitones: 'Semitones',
    navLesson: 'Lesson',
    navReference: 'Reference',
    navPractice: 'Practice',
  },
};

export function getT(lang: Language) {
  return translations[lang] || translations.my;
}
