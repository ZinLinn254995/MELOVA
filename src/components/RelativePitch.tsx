import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Headphones, Play, RotateCcw, Trophy, Volume2 } from 'lucide-react';
import { InstrumentType, Language } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { getRelativePitchPrompt, getRelativePitchTarget, isRelativePitchAnswer, PitchRelation } from '../utils/relativePitch';

interface RelativePitchProps { instrument: InstrumentType; lang: Language; }
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const RELATIONS: PitchRelation[] = ['same', 'higher', 'lower'];

export const RelativePitch: React.FC<RelativePitchProps> = ({ instrument, lang }) => {
  const my = lang === 'my';
  const [prompt, setPrompt] = useState(() => getRelativePitchPrompt());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<PitchRelation | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const timerRef = useRef<number | null>(null);
  const octave = instrument === 'bass' ? 2 : instrument === 'guitar' ? 3 : 4;
  const label = (en: string, mm: string) => my ? mm : en;
  const names: Record<PitchRelation, [string, string]> = {
    same: ['Same pitch', 'အသံတူသည်'],
    higher: ['Higher', 'အသံပိုမြင့်သည်'],
    lower: ['Lower', 'အသံပိုနိမ့်သည်'],
  };
  const stop = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    audioEngine.stopPlayback();
  };
  const play = () => {
    stop();
    const target = getRelativePitchTarget(prompt);
    audioEngine.playNote(prompt.referencePitchClass, octave, 0.65, instrument);
    timerRef.current = window.setTimeout(() => {
      audioEngine.playNote(target.pitchClass, octave + target.octaveOffset, 0.85, instrument);
      timerRef.current = null;
    }, 850);
  };
  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    audioEngine.stopPlayback();
  }, []);
  const answer = (value: PitchRelation) => {
    if (feedback) return;
    stop();
    const correct = isRelativePitchAnswer(prompt, value);
    setSelectedAnswer(value);
    setFeedback(correct ? 'correct' : 'wrong');
    setAttempts((current) => current + 1);
    if (correct) {
      setScore((current) => current + 1);
      setStreak((current) => {
        const next = current + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else setStreak(0);
  };
  const next = () => {
    stop();
    setPrompt(getRelativePitchPrompt());
    setFeedback(null);
    setSelectedAnswer(null);
  };
  const reset = () => {
    stop();
    setPrompt(getRelativePitchPrompt());
    setFeedback(null);
    setSelectedAnswer(null);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setBestStreak(0);
  };
  const correctRelation = RELATIONS.find((relation) => isRelativePitchAnswer(prompt, relation))!;
  return (
    <section id="relative-pitch-section" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Phase 3 · Ear Training</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{label('Relative Pitch Training', 'အသံအနိမ့်အမြင့် နှိုင်းယှဉ်ခြင်း')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label('Listen to the reference note, then decide whether the second note is the same, higher or lower.', 'ပထမအသံကို နားထောင်ပြီး ဒုတိယအသံက တူသလား၊ ပိုမြင့်သလား၊ ပိုနိမ့်သလား ရွေးချယ်ပါ။')}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">{label('Score', 'အမှတ်')} · {score}/{attempts}</div>
        </div>
      </header>
      <div className="space-y-4 p-4 sm:p-6">
        <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800/70">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"><Headphones size={22}/></div>
          <p className="mt-2 text-xs font-semibold text-slate-500">{label('Is the second note the same, higher or lower?', 'ဒုတိယအသံက ပထမအသံနဲ့ ဘယ်လိုကွာသလဲ။')}</p>
          <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{feedback ? NOTE_NAMES[prompt.referencePitchClass] + ' → ' + NOTE_NAMES[getRelativePitchTarget(prompt).pitchClass] : '? → ?'}</p>
          <button type="button" onClick={play} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white hover:bg-indigo-500"><Play size={15}/>{label('Play two notes', 'အသံနှစ်သံ ဖွင့်ရန်')}</button>
          <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-slate-500"><Volume2 size={12}/>{label('Reference first ·', 'ပထမအသံကို အရင်ဖွင့်သည် ·')} {instrument}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {RELATIONS.map((relation) => {
            const correct = feedback !== null && relation === correctRelation;
            const wrong = selectedAnswer === relation && feedback === 'wrong';
            return <button key={relation} type="button" disabled={!!feedback} onClick={() => answer(relation)} className={`rounded-xl border p-4 text-center font-bold transition-colors disabled:cursor-default ${correct ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : wrong ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
              {label(names[relation][0], names[relation][1])}
            </button>;
          })}
        </div>
        {feedback && <div className={`rounded-xl p-4 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'}`}>
          <p className="flex items-center gap-2 text-sm font-bold">{feedback === 'correct' ? <CheckCircle2 size={17}/> : null}{feedback === 'correct' ? label('Correct! You heard the direction.', 'မှန်ပါတယ်။ အသံအနိမ့်အမြင့်ကို ခွဲခြားနိုင်ပါပြီ။') : label('Not quite. Listen again and compare.', 'မမှန်သေးပါ။ အသံနှစ်သံကို ပြန်နားထောင်ပြီး နှိုင်းယှဉ်ပါ။')}</p>
          <p className="mt-1 text-xs">{label('Correct answer:', 'အဖြေမှန်:')} {label(names[correctRelation][0], names[correctRelation][1])} · {label('Reference', 'ပထမအသံ')} {NOTE_NAMES[prompt.referencePitchClass]} / {label('Target', 'ဒုတိယအသံ')} {NOTE_NAMES[getRelativePitchTarget(prompt).pitchClass]}</p>
          <button type="button" onClick={next} className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-800 dark:bg-slate-900 dark:text-white">{label('Next exercise', 'နောက်တစ်ခု')}</button>
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
