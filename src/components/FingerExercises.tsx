import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Pause, Play, RotateCcw, Timer, Trophy } from 'lucide-react';
import { InstrumentType, Language } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { getFingerExerciseSequence } from '../utils/fingerExercises';

interface FingerExercisesProps { instrument: InstrumentType; lang: Language; }

export const FingerExercises: React.FC<FingerExercisesProps> = ({ instrument, lang }) => {
  const my = lang === 'my';
  const sequence = useMemo(() => getFingerExerciseSequence(instrument), [instrument]);
  const [bpm, setBpm] = useState(80);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const interval = 60000 / bpm;
  const label = (en: string, mm: string) => my ? mm : en;

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const playStep = (index: number) => {
    if (index >= sequence.length) {
      setIsPlaying(false);
      setCurrentStep(0);
      stepRef.current = 0;
      setSessions((value) => value + 1);
      timerRef.current = null;
      return;
    }
    const note = sequence[index];
    stepRef.current = index;
    setCurrentStep(index);
    audioEngine.playNote(note.pitchClass, note.octave, Math.max(0.12, interval / 1000 * 0.82), instrument);
    timerRef.current = window.setTimeout(() => playStep(index + 1), interval);
  };

  const start = () => {
    if (isPlaying) return;
    audioEngine.stopPlayback();
    setIsPlaying(true);
    playStep(stepRef.current);
  };

  const pause = () => {
    stopTimer();
    audioEngine.stopPlayback();
    setIsPlaying(false);
  };

  const reset = () => {
    pause();
    stepRef.current = 0;
    setCurrentStep(0);
  };

  useEffect(() => () => {
    stopTimer();
    audioEngine.stopPlayback();
  }, []);

  useEffect(() => {
    if (isPlaying) pause();
    // Keep the selected tempo stable during a running exercise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  const title = instrument === 'piano'
    ? label('Five-finger pattern', 'လက်ငါးချောင်း လေ့ကျင့်ခန်း')
    : label('Chromatic 1–2–3–4', 'Chromatic ၁–၂–၃–၄ လေ့ကျင့်ခန်း');

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Phase 2 · Finger Exercises</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{label('Finger dexterity training', 'လက်ချောင်းကျွမ်းကျင်မှု လေ့ကျင့်ခန်း')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label('Follow the notes and finger numbers at a steady tempo.', 'Note နဲ့ လက်ချောင်းနံပါတ်တွေကို Tempo မှန်မှန်နဲ့ လိုက်လေ့ကျင့်ပါ။')}</p>
          </div>
          <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">{instrument.toUpperCase()}</span>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {instrument === 'piano'
                ? label('Play C–D–E–F–G, then return to C.', 'C–D–E–F–G ကိုတက်ပြီး C အထိ ပြန်ဆင်းပါ။')
                : label('Play frets 1–2–3–4 on each string, from the lowest string upward.', 'ကြိုးအနိမ့်ဆုံးမှစ၍ ကြိုးတစ်ချောင်းစီမှာ Fret ၁–၂–၃–၄ ကို တီးပါ။')}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{sessions} {label('sessions','ကြိမ်')}</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="finger-exercise-bpm" className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"><Timer className="h-4 w-4" />BPM</label>
            <span className="text-lg font-black tabular-nums text-amber-700 dark:text-amber-300">{bpm}</span>
          </div>
          <input id="finger-exercise-bpm" aria-label="Exercise tempo in beats per minute" type="range" min="40" max="160" step="5" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} className="mt-2 w-full accent-amber-600" />
          <div className="flex justify-between text-[10px] text-slate-400"><span>40 BPM</span><span>160 BPM</span></div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/20"><p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{label('Current step','လက်ရှိအဆင့်')}</p><p className="mt-1 text-2xl font-black tabular-nums text-amber-950 dark:text-amber-100">{isPlaying ? currentStep + 1 : currentStep === 0 ? '—' : currentStep + 1}<span className="ml-1 text-xs font-semibold text-amber-700 dark:text-amber-300">/ {sequence.length}</span></p></div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><p className="text-[10px] font-semibold text-slate-500">{label('Next note','နောက် Note')}</p><p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{sequence[currentStep]?.noteName ?? '—'}</p></div>
          <div className="col-span-2 rounded-xl bg-slate-100 p-3 dark:bg-slate-800 sm:col-span-1"><p className="text-[10px] font-semibold text-slate-500">{label('Finger','လက်ချောင်း')}</p><p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{sequence[currentStep]?.finger ?? '—'}</p></div>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8">
          {sequence.map((note, index) => (
            <div key={index} className={`rounded-lg border p-2 text-center transition-colors ${index === currentStep && isPlaying ? 'border-amber-500 bg-amber-100 text-amber-950 ring-2 ring-amber-300 dark:bg-amber-950/50 dark:text-amber-100' : index < currentStep || (currentStep === 0 && sessions > 0) ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
              <p className="text-sm font-black">{note.noteName}</p>
              <p className="mt-0.5 text-[10px] font-semibold opacity-70">{label('Finger','လက်')} {note.finger}</p>
              {note.stringNumber !== undefined && <p className="text-[9px] opacity-60">S{note.stringNumber} · F{note.fret}</p>}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isPlaying ? (
            <button type="button" onClick={start} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-500"><Play className="h-4 w-4" />{label(currentStep > 0 ? 'Resume exercise' : 'Start exercise', currentStep > 0 ? 'ဆက်လေ့ကျင့်ရန်' : 'စတင်လေ့ကျင့်ရန်')}</button>
          ) : (
            <button type="button" onClick={pause} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-900"><Pause className="h-4 w-4" />{label('Pause','ခဏရပ်ရန်')}</button>
          )}
          <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"><RotateCcw className="h-4 w-4" />{label('Reset','ပြန်စရန်')}</button>
        </div>

        {sessions > 0 && !isPlaying && currentStep === 0 && <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" />{label('Exercise completed! Keep your movements relaxed and even.', 'လေ့ကျင့်ခန်းပြီးပါပြီ။ လက်လှုပ်ရှားမှုကို ဖြေလျှော့ပြီး ညီညာစွာ ဆက်လေ့ကျင့်ပါ။')}</p>}
      </div>
    </section>
  );
};
