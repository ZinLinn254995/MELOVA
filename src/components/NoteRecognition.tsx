import React, { useMemo, useState } from 'react';
import { CheckCircle2, Headphones, Play, RotateCcw, Trophy, Volume2 } from 'lucide-react';
import { InstrumentType, Language, NoteName } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import {
  getNoteRecognitionChoices,
  getNoteRecognitionPrompt,
  isNoteRecognitionAnswer,
  NoteRecognitionLevel,
} from '../utils/noteRecognition';

interface NoteRecognitionProps { instrument: InstrumentType; lang: Language; }

export const NoteRecognition: React.FC<NoteRecognitionProps> = ({ instrument, lang }) => {
  const my = lang === 'my';
  const [level, setLevel] = useState<NoteRecognitionLevel>('beginner');
  const [prompt, setPrompt] = useState(() => getNoteRecognitionPrompt());
  const [previous, setPrevious] = useState<NoteName | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<NoteName | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const choices = useMemo(() => getNoteRecognitionChoices(prompt.note, level), [prompt.note, level]);
  const octave = instrument === 'bass' ? 2 : instrument === 'guitar' ? 3 : 4;
  const playNote = () => audioEngine.playNote(
    ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'].indexOf(prompt.note),
    octave,
    1.25,
    instrument,
  );
  const label = (en: string, mm: string) => my ? mm : en;

  const answer = (note: NoteName) => {
    if (feedback) return;
    const correct = isNoteRecognitionAnswer(prompt.note, note);
    setSelectedAnswer(note);
    setFeedback(correct ? 'correct' : 'wrong');
    setAttempts((value) => value + 1);
    if (correct) {
      setScore((value) => value + 1);
      setStreak((value) => {
        const next = value + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setPrevious(prompt.note);
    setPrompt(getNoteRecognitionPrompt(level, prompt.note));
    setFeedback(null);
    setSelectedAnswer(null);
  };
  const reset = () => {
    setPrompt(getNoteRecognitionPrompt(level));
    setPrevious(null);
    setFeedback(null);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAttempts(0);
  };
  const changeLevel = (nextLevel: NoteRecognitionLevel) => {
    setLevel(nextLevel);
    setPrompt(getNoteRecognitionPrompt(nextLevel));
    setPrevious(null);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  return (
    <section id="note-recognition-section" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Phase 3 · Ear Training</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{label('Note Recognition', 'အသံဖြင့် Note ခွဲခြားခြင်း')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label('Listen to one note and identify its name.', 'Note အသံတစ်သံကို နားထောင်ပြီး အမည်ကို ရွေးချယ်ပါ။')}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">{label('Score', 'အမှတ်')} · {score}/{attempts}</div>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-500">{label('Difficulty', 'အဆင့်')}</p>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button type="button" onClick={() => changeLevel('beginner')} className={`rounded-lg px-3 py-2 text-xs font-bold ${level === 'beginner' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}>{label('Beginner · 7 notes', 'အခြေခံ · Note ၇ လုံး')}</button>
            <button type="button" onClick={() => changeLevel('chromatic')} className={`rounded-lg px-3 py-2 text-xs font-bold ${level === 'chromatic' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}>{label('All 12 notes', 'Note ၁၂ လုံး')}</button>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800/70">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"><Headphones size={22}/></div>
          <p className="mt-2 text-xs font-semibold text-slate-500">{label('Which note did you hear?', 'ဘယ် Note အသံကို ကြားလိုက်ရသလဲ။')}</p>
          <p className="mt-1 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{feedback ? prompt.note : '?'}</p>
          <button type="button" onClick={playNote} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-indigo-500"><Play size={15}/>{label('Play note', 'အသံပြန်ဖွင့်ရန်')}</button>
          <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-slate-500"><Volume2 size={12}/>{label('Instrument', 'တူရိယာ')}: {instrument}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {choices.map((note) => {
            const isCorrect = feedback !== null && note === prompt.note;
            const isWrongPick = selectedAnswer === note && feedback === 'wrong';
            return <button key={note} type="button" disabled={!!feedback} onClick={() => answer(note)} className={`rounded-xl border p-4 text-lg font-extrabold transition-colors disabled:cursor-default ${isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : isWrongPick ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>{note}</button>;
          })}
        </div>

        {feedback && <div className={`rounded-xl p-4 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'}`}>
          <p className="flex items-center gap-2 text-sm font-bold">{feedback === 'correct' ? <CheckCircle2 size={17}/> : null}{feedback === 'correct' ? label('Correct! Great listening.', 'မှန်ပါတယ်။ နားထောင်မှုကောင်းပါတယ်။') : label(`Not quite. The correct note is ${prompt.note}.`, `မမှန်သေးပါ။ အဖြေမှန်က ${prompt.note} ဖြစ်ပါတယ်။`)}</p>
          <button type="button" onClick={next} className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-800 dark:bg-slate-900 dark:text-white">{label('Next note', 'နောက် Note')}</button>
        </div>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Trophy size={14}/>{label('Streak', 'ဆက်တိုက်မှန်')} {streak}</span>
            <span>{label('Best', 'အကောင်းဆုံး')} {bestStreak}</span>
            <span>{label('Accuracy', 'မှန်ကန်မှု')} {attempts ? Math.round((score / attempts) * 100) : 0}%</span>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><RotateCcw size={14}/>{label('Reset', 'ပြန်စရန်')}</button>
        </div>
      </div>
    </section>
  );
};
