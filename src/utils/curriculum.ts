export type LearningInstrument = 'guitar' | 'bass' | 'piano';
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearningLesson {
  id: string;
  level: LearningLevel;
  titleEn: string;
  titleMy: string;
  topicEn: string;
  topicMy: string;
  explanationEn: string;
  explanationMy: string;
  practiceEn: string[];
  practiceMy: string[];
  questionEn: string;
  questionMy: string;
  options: string[];
  correctIndex: number;
  answerEn: string;
  answerMy: string;
}

export interface LearningCourse {
  instrument: LearningInstrument;
  titleEn: string;
  titleMy: string;
  descriptionEn: string;
  descriptionMy: string;
  lessons: LearningLesson[];
}

const lesson = (
  instrument: LearningInstrument,
  level: LearningLevel,
  id: string,
  titleEn: string,
  titleMy: string,
  topicEn: string,
  topicMy: string,
  explanationEn: string,
  explanationMy: string,
  practiceEn: string[],
  practiceMy: string[],
  questionEn: string,
  questionMy: string,
  options: string[],
  correctIndex: number,
  answerEn: string,
  answerMy: string,
): LearningLesson => ({
  id: `${instrument}-${id}`,
  level,
  titleEn,
  titleMy,
  topicEn,
  topicMy,
  explanationEn,
  explanationMy,
  practiceEn,
  practiceMy,
  questionEn,
  questionMy,
  options,
  correctIndex,
  answerEn,
  answerMy,
});

const sharedLessons = (instrument: LearningInstrument): LearningLesson[] => {
  const name = instrument === 'guitar' ? 'guitar' : instrument === 'bass' ? 'bass' : 'piano';
  const action = instrument === 'guitar'
    ? 'Play the open strings, then find C, D, and E on the low E and A strings.'
    : instrument === 'bass'
      ? 'Play each open string, then find C, D, and E on the E and A strings.'
      : 'Find groups of two and three black keys, then play every white key from C to C.';
  const actionMy = instrument === 'guitar'
    ? 'Open String များကို တီးပြီး Low E နှင့် A String ပေါ်တွင် C, D, E Note များကို ရှာပါ။'
    : instrument === 'bass'
      ? 'Open String တစ်ကြိုးချင်း တီးပြီး E နှင့် A String ပေါ်တွင် C, D, E Note များကို ရှာပါ။'
      : 'အမည်းရောင် Key ၂ ခု၊ ၃ ခု အုပ်စုများကို ရှာပြီး C မှ C အထိ အဖြူရောင် Key များကို တီးပါ။';

  return [
    lesson(instrument, 'beginner', 'notes', 'Meet the notes', 'Note များကို သိကျွမ်းခြင်း', 'Music alphabet', 'ဂီတအက္ခရာ',
      'Music uses 12 pitch classes that repeat in higher and lower octaves. The note names are A, A♯/B♭, B, C and so on. After B, the pattern returns to C. On your ' + name + ', the same note name can appear in more than one position or octave.',
      'ဂီတတွင် အသံအမြင့်အနိမ့် (Octave) အလိုက် ထပ်ခါတလဲလဲ ဖြစ်ပေါ်နေသော Note ၁၂ မျိုး ရှိသည်။ A မှ B အထိ သွားပြီးနောက် C သို့ ပြန်ရောက်သည်။ ' + name + ' ပေါ်တွင် Note တစ်ခုတည်းကို နေရာနှင့် Octave မတူဘဲ တွေ့နိုင်သည်။',
      [action, 'Say the note names out loud while you play slowly.'], [actionMy, 'ဖြည်းဖြည်းတီးရင်း Note အမည်များကို အသံထွက်ပြောပါ။'],
      'How many different pitch classes are in the musical alphabet?', 'ဂီတတွင် မတူညီသော Pitch Class ဘယ်နှစ်မျိုးရှိသလဲ?',
      ['7', '12', '24', '8'], 1, 'There are 12 pitch classes before the notes repeat in another octave.', 'Octave တစ်ခုအတွင်း မတူညီသော Pitch Class ၁၂ မျိုး ရှိသည်။'),
    lesson(instrument, 'beginner', 'pulse', 'Feel the steady beat', 'စည်းချက်မှန်ကို ခံစားခြင်း', 'Beat and rhythm', 'Beat နှင့် Rhythm',
      'A beat is the steady pulse you can tap your foot to. Rhythm is the pattern of long, short, and silent sounds placed on those beats. Start with four even beats and keep the pulse steady while playing one note.',
      'Beat ဆိုသည်မှာ ခြေထောက်ဖြင့် လိုက်နင်းနိုင်သော ပုံမှန်ခုန်နှုန်းဖြစ်သည်။ Rhythm ဆိုသည်မှာ Beat များပေါ်တွင် အသံရှည်၊ အသံတိုနှင့် အသံမထွက်သည့် အချိန်များကို စီစဉ်ထားသော ပုံစံဖြစ်သည်။',
      ['Count “1, 2, 3, 4” evenly and tap once on every number.', 'Play one comfortable note on each beat without speeding up.'],
      ['“၁၊ ၂၊ ၃၊ ၄” ဟု ညီညီညာညာ ရေတွက်ပြီး နံပါတ်တိုင်းတွင် တစ်ချက်စီ လက်ခုပ်တီးပါ။', 'Beat တစ်ချက်စီတွင် Note တစ်လုံးစီ တီးပြီး အမြန်နှုန်း မပြောင်းပါစေနှင့်။'],
      'In 4/4 time, how many quarter-note beats are in one bar?', '4/4 Time တစ် Bar တွင် Quarter-note Beat ဘယ်နှစ်ချက်ရှိသလဲ?',
      ['2', '3', '4', '8'], 2, 'The top number 4 means four beats per bar in 4/4.', 'အပေါ်က ၄ ဆိုသည်မှာ 4/4 Time တစ် Bar တွင် Beat ၄ ချက်ရှိသည်ဟု ဆိုလိုသည်။'),
    lesson(instrument, 'beginner', 'chords', 'Build your first triad', 'ပထမဆုံး Triad Chord တည်ဆောက်ခြင်း', 'Chord basics', 'Chord အခြေခံ',
      'A triad is a chord made from three different note names: root, third, and fifth. A major triad uses a major third plus a minor third (4 + 3 semitones). A minor triad reverses the distances (3 + 4).',
      'Triad ဆိုသည်မှာ Root, Third, Fifth ဟူသော Note သုံးလုံးဖြင့် ဖွဲ့စည်းထားသည့် Chord ဖြစ်သည်။ Major Triad တွင် 4 + 3 Semitones၊ Minor Triad တွင် 3 + 4 Semitones ကို အသုံးပြုသည်။',
      ['Choose C as the root and locate C, E, and G.', 'Play the three notes together, then play them one at a time.'],
      ['Root ကို C ရွေးပြီး C, E, G Note များကို ရှာပါ။', 'Note သုံးလုံးကို တစ်ပြိုင်နက်တီးပြီးနောက် တစ်လုံးချင်းစီ တီးပါ။'],
      'Which notes make a C major triad?', 'C Major Triad ကို မည်သည့် Note များဖြင့် ဖွဲ့စည်းထားသလဲ?',
      ['C – D – G', 'C – E – G', 'C – E♭ – G', 'C – F – A'], 1, 'C, E, and G form a C major triad.', 'C, E, G တို့သည် C Major Triad ဖြစ်သည်။'),
    lesson(instrument, 'intermediate', 'scale', 'Understand the major scale', 'Major Scale ကို နားလည်ခြင်း', 'Scale formula', 'Scale Formula',
      'A major scale contains seven different notes arranged by the whole-step / half-step pattern W–W–H–W–W–W–H. For C major this gives C, D, E, F, G, A, B. The pattern, not the starting letter alone, defines the scale.',
      'Major Scale တွင် Note ခုနစ်လုံး ပါဝင်ပြီး Whole-step / Half-step ပုံစံ W–W–H–W–W–W–H ကို လိုက်နာသည်။ C Major တွင် C, D, E, F, G, A, B ဖြစ်သည်။ Scale ကို သတ်မှတ်ပေးသည်မှာ စတင်သည့် Note တစ်ခုတည်းမဟုတ်ဘဲ အကွာအဝေးပုံစံ ဖြစ်သည်။',
      ['Play C major slowly ascending and descending.', 'Name each scale degree from 1 to 7 as you play.'],
      ['C Major Scale ကို အတက်၊ အဆင်း ဖြည်းဖြည်းတီးပါ။', 'တီးနေစဉ် Scale Degree ကို ၁ မှ ၇ အထိ ရေတွက်ပါ။'],
      'Which interval pattern builds a major scale?', 'Major Scale ကို မည်သည့် Interval Pattern ဖြင့် တည်ဆောက်သလဲ?',
      ['W–H–W–W–H–W–W', 'W–W–H–W–W–W–H', 'H–W–W–H–W–W–W', 'W–W–W–H–W–W–H'], 1,
      'The major scale pattern is W–W–H–W–W–W–H.', 'Major Scale Pattern သည် W–W–H–W–W–W–H ဖြစ်သည်။'),
    lesson(instrument, 'intermediate', 'chord-quality', 'Hear major and minor', 'Major နှင့် Minor ကို ခွဲခြားခြင်း', 'Chord quality', 'Chord အမျိုးအစား',
      'Major and minor triads both contain a root, third, and fifth. Their third is different: a major chord has a major third (4 semitones), while a minor chord has a minor third (3 semitones). That one-semitone change creates a different quality.',
      'Major နှင့် Minor Triad နှစ်မျိုးစလုံးတွင် Root, Third, Fifth ပါဝင်သည်။ ကွာခြားချက်မှာ Third ဖြစ်သည်။ Major တွင် Semitone ၄ ခု၊ Minor တွင် Semitone ၃ ခု ဖြစ်သည်။ Semitone တစ်ခု ကွာခြားခြင်းကြောင့် အသံအရသာ ပြောင်းလဲသွားသည်။',
      ['Play C major, then lower E to E♭ to make C minor.', 'Listen for the change; repeat with another root.'],
      ['C Major ကို တီးပြီး E ကို E♭ သို့ လျှော့ကာ C Minor ပြောင်းပါ။', 'အသံကွာခြားချက်ကို နားထောင်ပြီး အခြား Root ဖြင့် ထပ်လေ့ကျင့်ပါ။'],
      'What changes when a major triad becomes minor?', 'Major Triad မှ Minor Triad သို့ ပြောင်းရာတွင် ဘာပြောင်းသလဲ?',
      ['The root moves', 'The fifth disappears', 'The third lowers by one semitone', 'Every note moves up'], 2,
      'The third is lowered by one semitone; the root and fifth stay the same.', 'Third ကို Semitone တစ်ခု လျှော့ပြီး Root နှင့် Fifth ကို မပြောင်းပါ။'),
    lesson(instrument, 'intermediate', 'chord-progressions', 'Connect chords in a key', 'Key တစ်ခုအတွင်း Chord များ ချိတ်ဆက်ခြင်း', 'Diatonic harmony', 'Diatonic Harmony',
      'Chords can be built on each degree of a major scale. In a major key the common triad qualities are I major, ii minor, iii minor, IV major, V major, vi minor, and vii diminished. Roman numerals show each chord’s role in the key.',
      'Major Scale Degree တစ်ခုချင်းစီပေါ်တွင် Chord တည်ဆောက်နိုင်သည်။ Major Key တွင် I Major, ii Minor, iii Minor, IV Major, V Major, vi Minor, vii Diminished ဟူသော ပုံစံများ ဖြစ်ပေါ်သည်။ Roman Numeral များက Key အတွင်း Chord ၏ အခန်းကဏ္ဍကို ပြသည်။',
      ['In C major, play C–F–G–C (I–IV–V–I).', 'Keep a steady four-beat count for each chord.'],
      ['C Major တွင် C–F–G–C (I–IV–V–I) ကို တီးပါ။', 'Chord တစ်ခုစီကို Beat လေးချက်စီ ညီညီညာညာ တီးပါ။'],
      'In a major key, what quality is the V chord?', 'Major Key တစ်ခုတွင် V Chord သည် မည်သည့်အမျိုးအစား ဖြစ်သလဲ?',
      ['Major', 'Minor', 'Diminished', 'Augmented'], 0, 'The V chord is major in the standard major-key triad pattern.', 'ပုံမှန် Major-key Triad ပုံစံတွင် V Chord သည် Major ဖြစ်သည်။'),
    lesson(instrument, 'advanced', 'intervals', 'Use intervals as musical distance', 'Interval များကို ဂီတအကွာအဝေးအဖြစ် အသုံးပြုခြင်း', 'Intervals and tension', 'Interval နှင့် Tension',
      'An interval measures the distance between two notes. A perfect fifth spans seven semitones; an octave spans twelve. Intervals help you identify melodies, build chords, and understand why notes feel stable or tense.',
      'Interval ဆိုသည်မှာ Note နှစ်ခုကြားရှိ အကွာအဝေးကို တိုင်းတာခြင်းဖြစ်သည်။ Perfect Fifth သည် Semitone ၇ ခု၊ Octave သည် ၁၂ ခု ဖြစ်သည်။ Interval များသည် Melody ခွဲခြားခြင်း၊ Chord တည်ဆောက်ခြင်းနှင့် အသံတည်ငြိမ်မှု၊ တင်းမာမှုကို နားလည်ခြင်းတို့တွင် အထောက်အကူပြုသည်။',
      ['Play C and G together, then C and the next C octave.', 'Sing each interval before playing it.'],
      ['C နှင့် G ကို တွဲတီးပြီးနောက် C နှင့် အပေါ် Octave ရှိ C ကို တီးပါ။', 'မတီးမီ Interval တစ်ခုစီကို အသံဖြင့် ဟစ်ဆိုကြည့်ပါ။'],
      'How many semitones are in a perfect fifth?', 'Perfect Fifth တွင် Semitone ဘယ်နှစ်ခု ပါဝင်သလဲ?',
      ['5', '7', '8', '12'], 1, 'A perfect fifth spans seven semitones.', 'Perfect Fifth သည် Semitone ၇ ခု အကွာအဝေးရှိသည်။'),
    lesson(instrument, 'advanced', 'functional-harmony', 'Understand harmonic function', 'Harmonic Function ကို နားလည်ခြင်း', 'Tonic, predominant, dominant', 'Tonic, Predominant, Dominant',
      'In tonal music, tonic (I) feels like home, predominant chords such as ii and IV prepare movement, and dominant (V or vii°) creates tension that often resolves to tonic. Hearing these roles helps you understand and create progressions.',
      'Tonal Music တွင် Tonic (I) သည် အိမ်ပြန်ရောက်သကဲ့သို့ တည်ငြိမ်မှုကို ပေးသည်။ ii နှင့် IV ကဲ့သို့ Predominant Chord များသည် နောက်တစ်ဆင့်သို့ ပြင်ဆင်ပေးပြီး Dominant (V သို့မဟုတ် vii°) သည် Tonic သို့ ပြန်ဖြေရှင်းလိုသော Tension ကို ဖန်တီးသည်။',
      ['Play C–F–G–C and pause briefly on G before resolving to C.', 'Describe which chord feels settled and which feels tense.'],
      ['C–F–G–C ကို တီးပြီး G တွင် ခဏရပ်ကာ C သို့ ပြန်ဖြေရှင်းပါ။', 'မည်သည့် Chord က တည်ငြိမ်ပြီး မည်သည့် Chord က Tension ဖြစ်စေသလဲ ဖော်ပြပါ။'],
      'Which chord most commonly creates dominant tension in C major?', 'C Major တွင် Dominant Tension ကို အများဆုံး ဖန်တီးသည့် Chord သည် ဘယ်ဟာလဲ?',
      ['F major', 'A minor', 'G major', 'C major'], 2, 'G major is the V chord and creates dominant pull toward C.', 'G Major သည် V Chord ဖြစ်ပြီး C သို့ ပြန်သွားလိုသော Dominant Pull ကို ဖန်တီးသည်။'),
    lesson(instrument, 'advanced', 'time-feel', 'Shape rhythm with subdivisions', 'Subdivision ဖြင့် Rhythm ကို ပုံဖော်ခြင်း', 'Subdivision and meter', 'Subdivision နှင့် Meter',
      'A beat can be divided into equal subdivisions. In 4/4, eighth notes divide each quarter-note beat into two; sixteenth notes divide it into four. Accurate subdivisions let you play syncopation and complex grooves without losing the pulse.',
      'Beat တစ်ချက်ကို အပိုင်းငယ်များအဖြစ် ညီတူညီမျှ ခွဲနိုင်သည်။ 4/4 တွင် Eighth Note သည် Quarter Note Beat တစ်ချက်ကို နှစ်ပိုင်း၊ Sixteenth Note သည် လေးပိုင်း ခွဲပေးသည်။ Subdivision မှန်ကန်ခြင်းသည် Beat မပျောက်ဘဲ Syncopation နှင့် ရှုပ်ထွေးသော Groove များ တီးနိုင်စေသည်။',
      ['Set a slow tempo and count “1 & 2 & 3 & 4 &”.', 'Play only on the numbers, then add the “&” counts.'],
      ['Tempo နှေးနှေးထားပြီး “၁ နှင့် ၂ နှင့် ၃ နှင့် ၄ နှင့်” ဟု ရေတွက်ပါ။', 'နံပါတ်များတွင်သာ တီးပြီးနောက် “နှင့်” နေရာများကို ထည့်တီးပါ။'],
      'How many eighth-note subdivisions fit in one quarter-note beat?', 'Quarter-note Beat တစ်ချက်တွင် Eighth-note Subdivision ဘယ်နှစ်ခု ဝင်သလဲ?',
      ['1', '2', '3', '4'], 1, 'Two eighth notes fit into one quarter-note beat.', 'Quarter-note Beat တစ်ချက်တွင် Eighth Note နှစ်ခု ဝင်သည်။'),
  ];
};

export const LEARNING_COURSES: LearningCourse[] = (['guitar', 'bass', 'piano'] as const).map((instrument) => ({
  instrument,
  titleEn: instrument === 'guitar' ? 'Guitar Foundations' : instrument === 'bass' ? 'Bass Foundations' : 'Piano Foundations',
  titleMy: instrument === 'guitar' ? 'Guitar အခြေခံမှ အဆင့်မြင့်အထိ' : instrument === 'bass' ? 'Bass အခြေခံမှ အဆင့်မြင့်အထိ' : 'Piano အခြေခံမှ အဆင့်မြင့်အထိ',
  descriptionEn: instrument === 'guitar'
    ? 'Learn the fretboard, chords, scales, and rhythm on guitar.'
    : instrument === 'bass'
      ? 'Learn bass notes, harmonic roots, scales, and groove.'
      : 'Learn the keyboard, harmony, scales, and rhythmic control.',
  descriptionMy: instrument === 'guitar'
    ? 'Guitar Fretboard, Chord, Scale နှင့် Rhythm များကို အဆင့်လိုက် လေ့လာပါ။'
    : instrument === 'bass'
      ? 'Bass Note, Chord Root, Scale နှင့် Groove များကို အဆင့်လိုက် လေ့လာပါ။'
      : 'Piano Keyboard, Harmony, Scale နှင့် Rhythm များကို အဆင့်လိုက် လေ့လာပါ။',
  lessons: sharedLessons(instrument),
}));

export const LEARNING_LEVELS: LearningLevel[] = ['beginner', 'intermediate', 'advanced'];

export const getCourse = (instrument: LearningInstrument): LearningCourse =>
  LEARNING_COURSES.find((course) => course.instrument === instrument) ?? LEARNING_COURSES[0];

export const getLessonsForLevel = (course: LearningCourse, level: LearningLevel): LearningLesson[] =>
  course.lessons.filter((item) => item.level === level);

export const getNextLesson = (course: LearningCourse, completedIds: string[]): LearningLesson | undefined =>
  course.lessons.find((item) => !completedIds.includes(item.id));
