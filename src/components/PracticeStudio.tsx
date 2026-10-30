import React, { useMemo, useState } from 'react';
import { CheckCircle2, CircleHelp, Guitar, Music2, Piano, Play, Target, Trophy, Volume2 } from 'lucide-react';
import { InstrumentType, Language, NoteName } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { calculateChord } from '../utils/musicTheory';
import {
  FretboardPosition,
  getFretboardPositions,
  getProgression,
  getProgressionLabel,
  getRandomTarget,
  isCorrectNoteAnswer,
} from '../utils/practiceStudio';

interface PracticeStudioProps {
  instrument: InstrumentType;
  lang: Language;
}

type StudioMode = 'notes' | 'changes';

const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const copy = {
  en: {
    eyebrow: 'Interactive Practice Studio', title: 'Train your hands and ears',
    intro: 'Short, focused exercises that turn music theory into instrument skills.',
    notes: 'Find the note', changes: 'Chord changes', target: 'Find this note',
    hear: 'Hear target', correct: 'Correct — nice work!', wrong: 'Not quite. Try another position.',
    score: 'Correct', streak: 'Streak', round: 'Round', fret: 'Fret', string: 'String',
    pianoHint: 'Choose the matching key. Enharmonic spellings use the sharp name.',
    fretHint: 'Tap any fret with the target note. The same note appears in several places.',
    reset: 'New note', progression: 'Practice progression', pop: 'Pop (I–V–vi–IV)',
    classic: 'Classic (I–IV–V–I)', current: 'Current chord', playChord: 'Play chord',
    next: 'I played it · Next chord', completed: 'Progression complete!',
    repeat: 'Start again', roundDone: 'Round complete', chordHint: 'Play the chord on your instrument, then move to the next shape.',
    degree: 'Degree', noteCount: '12 notes', instrument: 'Instrument',
  },
  my: {
    eyebrow: 'လက်တွေ့လေ့ကျင့်ရေး Studio', title: 'လက်နဲ့နားကို လေ့ကျင့်ပါ',
    intro: 'Music Theory ကို တူရိယာတီးခတ်နိုင်တဲ့ ကျွမ်းကျင်မှုအဖြစ် ပြောင်းလဲပေးမယ့် လေ့ကျင့်ခန်းများ။',
    notes: 'Note ရှာဖွေခြင်း', changes: 'Chord ပြောင်းတီးခြင်း', target: 'ဒီ Note ကို ရှာပါ',
    hear: 'အသံနားထောင်ရန်', correct: 'မှန်ပါတယ်။ ကောင်းပါတယ်။', wrong: 'မမှန်သေးပါ။ အခြားနေရာကို ထပ်ရှာပါ။',
    score: 'အဖြေမှန်', streak: 'ဆက်တိုက်မှန်', round: 'အကြိမ်', fret: 'Fret', string: 'ကြိုး',
    pianoHint: 'တူညီတဲ့ Note အမည်ရှိ Key ကို ရွေးပါ။ Sharp အမည်ဖြင့် ဖော်ပြထားပါတယ်။',
    fretHint: 'Target Note ရှိတဲ့ Fret တစ်ခုခုကို နှိပ်ပါ။ Note တစ်ခုကို နေရာအမျိုးမျိုးမှာ တွေ့နိုင်ပါတယ်။',
    reset: 'Note အသစ်', progression: 'Chord Progression လေ့ကျင့်ရန်', pop: 'Pop (I–V–vi–IV)',
    classic: 'Classic (I–IV–V–I)', current: 'လက်ရှိ Chord', playChord: 'Chord အသံဖွင့်ရန်',
    next: 'တီးပြီးပါပြီ · နောက် Chord', completed: 'Progression ပြီးပါပြီ။',
    repeat: 'အစမှ ပြန်စမည်', roundDone: 'တစ်ပတ်ပြီးပါပြီ', chordHint: 'တူရိယာပေါ်မှာ Chord ကို တီးပြီးနောက် နောက်တစ်ခုသို့ ပြောင်းပါ။',
    degree: 'Degree', noteCount: 'Note ၁၂ မျိုး', instrument: 'တူရိယာ',
  },
} as const;

export const PracticeStudio: React.FC<PracticeStudioProps> = ({ instrument, lang }) => {
  const t = copy[lang];
  const [mode, setMode] = useState<StudioMode>('notes');
  const [target, setTarget] = useState<NoteName>(() => getRandomTarget(null));
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [progressionKind, setProgressionKind] = useState<'pop' | 'classic'>('pop');
  const [chordIndex, setChordIndex] = useState(0);
  const [rounds, setRounds] = useState(0);

  const fretPositions = useMemo(
    () => instrument === 'guitar' || instrument === 'bass' ? getFretboardPositions(instrument, 12) : [],
    [instrument],
  );
  const progression = getProgression(progressionKind);
  const currentChord = progression[chordIndex];
  const playNote = (pitchClass: number, octave: number) => {
    audioEngine.playNote(pitchClass, octave, 1.1, instrument);
  };

  const chooseNote = (note: NoteName, pitchClass: number, octave: number) => {
    if (feedback === 'correct') return;
    setAttempts((value) => value + 1);
    playNote(pitchClass, octave);
    if (isCorrectNoteAnswer(target, note)) {
      setCorrect((value) => value + 1);
      setStreak((value) => value + 1);
      setFeedback('correct');
    } else {
      setStreak(0);
      setFeedback('wrong');
    }
  };

  const nextTarget = () => {
    setTarget((previous) => getRandomTarget(previous));
    setFeedback(null);
  };

  const playCurrentChord = () => {
    const chord = calculateChord(currentChord.root, currentChord.quality);
    audioEngine.playChord(
      chord.notes.map((note) => ({ pitchClass: note.pitchClass, octave: instrument === 'bass' ? 2 : instrument === 'guitar' ? 3 : 4 })),
      1.6,
      instrument,
    );
  };

  const advanceChord = () => {
    if (chordIndex === progression.length - 1) {
      setRounds((value) => value + 1);
      setChordIndex(0);
    } else {
      setChordIndex((value) => value + 1);
    }
  };

  const resetChordRoutine = () => {
    setChordIndex(0);
  };

  const InstrumentIcon = instrument === 'guitar' ? Guitar : instrument === 'bass' ? Music2 : Piano;

  const renderFretboardCell = (position: FretboardPosition) => {
    const selected = feedback === 'correct' && position.noteName === target;
    return (
      <button
        key={position.stringIndex + '-' + position.fret}
        type="button"
        onClick={() => chooseNote(position.noteName, position.pitchClass, position.octave)}
        disabled={feedback === 'correct'}
        aria-label={`${t.string} ${position.stringNumber}, ${t.fret} ${position.fret}, ${position.noteName}`}
        className={`min-w-0 rounded-md border px-0.5 py-2 text-[10px] sm:text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${selected
          ? 'border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500'}`}
      >
        {position.noteName}
      </button>
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><Target className="h-5 w-5" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">{t.eyebrow}</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{t.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.intro}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <InstrumentIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{instrument.toUpperCase()}</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button type="button" onClick={() => setMode('notes')} aria-pressed={mode === 'notes'} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-colors ${mode === 'notes' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>{t.notes}</button>
          <button type="button" onClick={() => setMode('changes')} aria-pressed={mode === 'changes'} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-colors ${mode === 'changes' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>{t.changes}</button>
        </div>
      </div>

      {mode === 'notes' ? (
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-950/30"><p className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">{t.score}</p><p className="mt-1 text-2xl font-black tabular-nums text-indigo-900 dark:text-indigo-100">{correct}</p></div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{t.streak}</p><p className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{streak}</p></div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{t.round}</p><p className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{attempts}</p></div>
          </div>

          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-center dark:border-indigo-900 dark:bg-indigo-950/20">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{t.target}</p>
            <div className="mt-1 text-4xl font-black tracking-tight text-indigo-950 dark:text-white">{target}</div>
            <button type="button" onClick={() => playNote(NOTE_NAMES.indexOf(target), instrument === 'bass' ? 2 : 4)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300">
              <Volume2 className="h-4 w-4" />{t.hear}
            </button>
          </div>

          {instrument === 'piano' ? (
            <div className="mt-4">
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{t.pianoHint}</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {NOTE_NAMES.map((note, index) => (
                  <button key={note} type="button" disabled={feedback === 'correct'} onClick={() => chooseNote(note, index, 4)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-2 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500">{note}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{t.fretHint}</p>
              <div className="overflow-x-auto rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                <div className="min-w-[620px]">
                  <div className="mb-2 grid gap-1" style={{ gridTemplateColumns: `42px repeat(13, minmax(0, 1fr))` }}>
                    <span />
                    {Array.from({ length: 13 }, (_, fret) => <span key={fret} className="text-center text-[10px] font-semibold text-slate-400">{fret}</span>)}
                  </div>
                  {(instrument === 'guitar' ? [6, 5, 4, 3, 2, 1] : [4, 3, 2, 1]).map((stringNumber) => (
                    <div key={stringNumber} className="mb-1 grid items-center gap-1" style={{ gridTemplateColumns: `42px repeat(13, minmax(0, 1fr))` }}>
                      <span className="text-center text-[10px] font-bold text-slate-500">{stringNumber}</span>
                      {fretPositions.filter((position) => position.stringNumber === stringNumber).map(renderFretboardCell)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {feedback && (
            <div className={`mt-4 flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'}`}>
              <p className="flex items-center gap-2 text-sm font-semibold">{feedback === 'correct' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <CircleHelp className="h-4 w-4 shrink-0" />}{feedback === 'correct' ? t.correct : t.wrong}</p>
              <button type="button" onClick={nextTarget} className="rounded-lg bg-white/80 px-3 py-2 text-xs font-bold shadow-sm dark:bg-slate-900/70">{t.reset}</button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { setProgressionKind('pop'); resetChordRoutine(); }} aria-pressed={progressionKind === 'pop'} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${progressionKind === 'pop' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}>{t.pop}</button>
            <button type="button" onClick={() => { setProgressionKind('classic'); resetChordRoutine(); }} aria-pressed={progressionKind === 'classic'} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${progressionKind === 'classic' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}>{t.classic}</button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {progression.map((chord, index) => (
              <div key={chord.degree + index} className={`rounded-xl border p-3 text-center ${index === chordIndex ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/30' : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}>
                <p className="text-[10px] font-semibold text-slate-400">{chord.degree}</p>
                <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{getProgressionLabel(chord)}</p>
                {index < chordIndex && <CheckCircle2 className="mx-auto mt-1 h-4 w-4 text-emerald-500" />}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.current} · {currentChord.degree}</p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <div><h3 className="text-3xl font-black text-slate-900 dark:text-white">{getProgressionLabel(currentChord)}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.chordHint}</p></div>
              <button type="button" onClick={playCurrentChord} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white hover:bg-indigo-500"><Play className="h-4 w-4" />{t.playChord}</button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roundDone}: <strong className="text-slate-900 dark:text-white">{rounds}</strong></p>
            <button type="button" onClick={advanceChord} className="rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900">{chordIndex === progression.length - 1 ? t.repeat : t.next}</button>
          </div>
          {rounds > 0 && chordIndex === 0 && <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400"><Trophy className="h-4 w-4" />{t.completed}</p>}
        </div>
      )}
    </section>
  );
};
