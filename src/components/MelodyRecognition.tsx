import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Headphones, Play, RotateCcw, Trophy, Volume2 } from 'lucide-react';
import { InstrumentType, Language } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { getMelodyChoices, getMelodyNoteName, getMelodyPrompt, isMelodyAnswer, MelodyLevel } from '../utils/melodyRecognition';

interface MelodyRecognitionProps { instrument: InstrumentType; lang: Language; }

export const MelodyRecognition: React.FC<MelodyRecognitionProps> = ({ instrument, lang }) => {
  const my = lang === 'my';
  const [level, setLevel] = useState<MelodyLevel>(3);
  const [prompt, setPrompt] = useState(() => getMelodyPrompt());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const timers = useRef<number[]>([]);
  const choices = useMemo(() => getMelodyChoices(prompt.notes), [prompt]);
  const octave = instrument === 'bass' ? 2 : instrument === 'guitar' ? 3 : 4;
  const label = (en: string, mm: string) => my ? mm : en;

  const stopSequence = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    audioEngine.stopPlayback();
  };

  const playMelody = () => {
    stopSequence();
    prompt.notes.forEach((pitch, index) => {
      const timer = window.setTimeout(() => {
        audioEngine.playNote(pitch, octave, 0.42, instrument);
      }, index * 560);
      timers.current.push(timer);
    });
  };

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    audioEngine.stopPlayback();
  }, []);

  const answer = (choiceId: string, notes: number[]) => {
    if (feedback) return;
    stopSequence();
    const correct = isMelodyAnswer(prompt.notes, notes);
    setSelectedAnswer(choiceId);
    setFeedback(correct ? 'correct' : 'wrong');
    setAttempts((value) => value + 1);
    if (correct) {
      setScore((value) => value + 1);
      setStreak((value) => {
        const next = value + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else setStreak(0);
  };

  const next = () => {
    stopSequence();
    setPrompt(getMelodyPrompt(level));
    setFeedback(null);
    setSelectedAnswer(null);
  };
  const reset = () => {
    stopSequence();
    setPrompt(getMelodyPrompt(level));
    setFeedback(null);
    setSelectedAnswer(null);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setBestStreak(0);
  };
  const changeLevel = (nextLevel: MelodyLevel) => {
    stopSequence();
    setLevel(nextLevel);
    setPrompt(getMelodyPrompt(nextLevel));
    setFeedback(null);
    setSelectedAnswer(null);
  };

  return (
    <section id="melody-recognition-section" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Phase 3 · Ear Training</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{label('Melody Recognition', 'တေးသွားမှတ်မိခြင်း')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label('Listen to a short melody and choose the matching note sequence.', 'တေးသွားတိုလေးကို နားထောင်ပြီး ကိုက်ညီတဲ့ Note အစဉ်ကို ရွေးပါ။')}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">{label('Score', 'အမှတ်')} · {score}/{attempts}</div>
        </div>
      </header>
      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-500">{label('Melody length', 'တေးသွားအရှည်')}</p>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {([3, 4, 5] as const).map((length) => (
              <button key={length} type="button" onClick={() => changeLevel(length)} className={`rounded-lg px-3 py-2 text-xs font-bold ${level === length ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}>{length} {label('notes', 'လုံး')}</button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800/70">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"><Headphones size={22}/></div>
          <p className="mt-2 text-xs font-semibold text-slate-500">{label('Which sequence matches the melody?', 'ဘယ် Note အစဉ်က ဖွင့်ပြတဲ့ တေးသွားနဲ့ ကိုက်ညီသလဲ။')}</p>
          <p className="mt-1 text-3xl font-black tracking-[0.35em] text-slate-900 dark:text-white">{feedback ? prompt.notes.map(getMelodyNoteName).join(' · ') : '•••'}</p>
          <button type="button" onClick={playMelody} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-indigo-500"><Play size={15}/>{label('Play melody', 'တေးသွားဖွင့်ရန်')}</button>
          <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-slate-500"><Volume2 size={12}/>{label('Instrument', 'တူရိယာ')}: {instrument}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {choices.map((choice, index) => {
            const correct = feedback !== null && isMelodyAnswer(prompt.notes, choice.notes);
            const wrong = selectedAnswer === choice.id && feedback === 'wrong';
            return <button key={choice.id} type="button" disabled={!!feedback} onClick={() => answer(choice.id, choice.notes)} className={`rounded-xl border p-4 text-left transition-colors disabled:cursor-default ${correct ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : wrong ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
              <span className="mr-2 text-[10px] font-bold text-slate-400">{String.fromCharCode(65 + index)}</span>
              <span className="font-mono text-base font-extrabold tracking-wider">{choice.notes.map(getMelodyNoteName).join(' – ')}</span>
            </button>;
          })}
        </div>
        {feedback && <div className={`rounded-xl p-4 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'}`}>
          <p className="flex items-center gap-2 text-sm font-bold">{feedback === 'correct' ? <CheckCircle2 size={17}/> : null}{feedback === 'correct' ? label('Correct! You recognized the melody.', 'မှန်ပါတယ်။ တေးသွားကို မှတ်မိပါပြီ။') : label('Not quite. Listen again and compare the sequence.', 'မမှန်သေးပါ။ အသံပြန်နားထောင်ပြီး Note အစဉ်ကို နှိုင်းယှဉ်ပါ။')}</p>
          <p className="mt-1 text-xs">{label('Answer:', 'အဖြေမှန်:')} {prompt.notes.map(getMelodyNoteName).join(' – ')}</p>
          <button type="button" onClick={next} className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-800 dark:bg-slate-900 dark:text-white">{label('Next melody', 'နောက်တေးသွား')}</button>
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
