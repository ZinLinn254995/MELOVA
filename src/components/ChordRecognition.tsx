import React, { useState } from 'react';
import { CheckCircle2, Headphones, Play, RotateCcw, Trophy } from 'lucide-react';
import { ChordTypeId, InstrumentType, Language } from '../types/music';
import { audioEngine } from '../utils/audioEngine';
import { calculateChord } from '../utils/musicTheory';
import { getChordRecognitionChoices, getRandomChordPrompt, isChordQualityAnswer } from '../utils/chordRecognition';

interface ChordRecognitionProps { instrument: InstrumentType; lang: Language; }
const QUALITY_LABELS: Record<ChordTypeId, { en: string; my: string }> = {
  major:{en:'Major',my:'မေဂျာ'}, minor:{en:'Minor',my:'မိုင်နာ'},
  diminished:{en:'Diminished',my:'ဒစ်မီနစ်ရှ်'}, augmented:{en:'Augmented',my:'အောက်မန်တက်ဒ်'},
  sus2:{en:'Sus2',my:'ဆပ်စ်တူး'}, sus4:{en:'Sus4',my:'ဆပ်စ်ဖိုး'},
  dom7:{en:'Dominant 7',my:'ဒေါမီနန့် 7'}, maj7:{en:'Major 7',my:'မေဂျာ 7'}, min7:{en:'Minor 7',my:'မိုင်နာ 7'},
};
export const ChordRecognition: React.FC<ChordRecognitionProps> = ({instrument,lang}) => {
 const my=lang==='my'; const [prompt,setPrompt]=useState(()=>getRandomChordPrompt()); const [feedback,setFeedback]=useState<'correct'|'wrong'|null>(null); const [score,setScore]=useState(0); const [round,setRound]=useState(0); const [revealed,setRevealed]=useState(false);
 const chord=calculateChord(prompt.root,prompt.quality); const octave=instrument==='bass'?2:instrument==='guitar'?3:4;
 const play=()=>audioEngine.playChord(chord.notes.map(n=>({pitchClass:n.pitchClass,octave})),1.8,instrument);
 const next=()=>{setPrompt(getRandomChordPrompt());setFeedback(null);setRevealed(false);setRound(v=>v+1)};
 const reset=()=>{setPrompt(getRandomChordPrompt());setFeedback(null);setRevealed(false);setScore(0);setRound(0)};
 const label=(en:string,mm:string)=>my?mm:en;
 const choices=getChordRecognitionChoices();
 const answer=(quality:ChordTypeId)=>{if(feedback)return;if(isChordQualityAnswer(prompt.quality,quality)){setFeedback('correct');setScore(v=>v+1)}else setFeedback('wrong')};
 return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <header className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800"><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Phase 2 · Chord Recognition</p><div className="mt-1 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{label('Recognize the chord sound','Chord အသံကို ခွဲခြားလေ့ကျင့်ပါ')}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label('Listen to the chord and identify its quality.','Chord အသံကို နားထောင်ပြီး အမျိုးအစားကို ခွဲခြားပါ။')}</p></div><div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{label('Score','အမှတ်')} · {score}/{round+1}</div></div></header>
  <div className="space-y-4 p-4 sm:p-6"><div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800/70"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><Headphones size={22}/></div><p className="mt-2 text-xs font-semibold text-slate-500">{label('Listen carefully','သေချာနားထောင်ပါ')}</p><p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">?</p><button type="button" onClick={play} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-500"><Play size={15}/>{label('Play chord','Chord အသံဖွင့်ရန်')}</button><p className="mt-2 text-[11px] text-slate-500">{label('Instrument','တူရိယာ')}: {instrument}</p></div>
   <div className="grid grid-cols-2 gap-2">{choices.map(q=><button key={q} type="button" disabled={!!feedback} onClick={()=>answer(q)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 transition-colors hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{my?QUALITY_LABELS[q].my:QUALITY_LABELS[q].en}</button>)}</div>
   {feedback&&<div className={`rounded-xl p-4 ${feedback==='correct'?'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200':'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'}`}><p className="flex items-center gap-2 text-sm font-bold">{feedback==='correct'?<CheckCircle2 size={17}/>:null}{feedback==='correct'?label('Correct! Great listening.','မှန်ပါတယ်။ နားထောင်မှုကောင်းပါတယ်။'):label('Not quite. Listen again and try the next one.','မမှန်သေးပါ။ နောက်တစ်ခုကို ဆက်လေ့ကျင့်ပါ။')}</p><button type="button" onClick={()=>setRevealed(v=>!v)} className="mt-2 text-xs font-semibold underline">{label('Show answer','အဖြေပြရန်')}</button>{revealed&&<p className="mt-2 text-sm font-bold">{prompt.root} {my?QUALITY_LABELS[prompt.quality].my:QUALITY_LABELS[prompt.quality].en} · {chord.notes.map(n=>n.standardName).join(' – ')}</p>}<button type="button" onClick={next} className="mt-3 block rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 dark:bg-slate-900 dark:text-white">{label('Next chord','နောက် Chord')}</button></div>}
   <div className="flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs text-slate-500"><Trophy size={15}/>{label('Round','အကြိမ်')} {round+1}</p><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><RotateCcw size={14}/>{label('Reset','ပြန်စရန်')}</button></div>
  </div>
 </section>;
};
