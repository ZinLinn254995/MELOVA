import React, { useState, useEffect, useRef } from 'react';
import {
  CalculatedChord,
  Language,
  StepIntervalInfo,
  InstrumentType,
} from '../types/music';
import { getT } from '../utils/i18n';
import { getPitchClass, toBurmeseNumber } from '../utils/musicTheory';
import { audioEngine } from '../utils/audioEngine';
import {
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface SemitoneVisualizerProps {
  selectedInstrument?: InstrumentType;
  chord: CalculatedChord;
  lang: Language;
  onStepChange: (pitchClass: number | null, octave?: number) => void;
}

export const SemitoneVisualizer: React.FC<SemitoneVisualizerProps> = ({
  selectedInstrument = 'piano',
  chord,
  lang,
  onStepChange,
}) => {
  const t = getT(lang);

  // Step-by-step walker state
  // intervalIndex: which interval gap we are walking (e.g. 0 is C->E, 1 is E->G)
  // stepInInterval: 0 to stepIntervals[intervalIndex].semitones
  const [isCountingMode, setIsCountingMode] = useState(false);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [currentStepInInterval, setCurrentStepInInterval] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayTimerRef = useRef<number | null>(null);

  // Total flat sequence of steps across all chord intervals
  // e.g. for C -> E -> G:
  // [ { intervalIdx: 0, stepIdx: 0, note: 'C', pitch: 0, label: '0/4 (Start)' },
  //   { intervalIdx: 0, stepIdx: 1, note: 'C#', pitch: 1, label: '1/4' }, ... ]
  const intervals = chord.stepIntervals;
  const currentInterval: StepIntervalInfo | undefined = intervals[currentIntervalIndex];

  // Reset when chord changes
  useEffect(() => {
    stopAutoPlay();
    setIsCountingMode(false);
    setCurrentIntervalIndex(0);
    setCurrentStepInInterval(0);
    onStepChange(null);
  }, [chord.root, chord.chordType.id]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopAutoPlay();
    };
  }, []);

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current !== null) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    setIsAutoPlaying(false);
  };

  const playStepSound = (noteName: string, stepNum: number) => {
    const pitch = getPitchClass(noteName);
    const rootPitch = chord.notes[0]?.pitchClass ?? getPitchClass(chord.root);
    const semitonesFromRoot = (pitch - rootPitch + 12) % 12;
    const baseOctave = selectedInstrument === 'bass' ? 2 : selectedInstrument === 'guitar' ? 3 : 4;
    const octave = baseOctave + Math.floor((rootPitch + semitonesFromRoot) / 12);
    audioEngine.playNote(pitch, octave, 0.7, selectedInstrument);
    onStepChange(pitch, octave);
  };

  const handleStartCounting = () => {
    setIsCountingMode(true);
    setCurrentIntervalIndex(0);
    setCurrentStepInInterval(0);
    const startNote = intervals[0]?.chromaticPath[0] || chord.root;
    playStepSound(startNote, 0);
  };

  const handleResetCounting = () => {
    stopAutoPlay();
    setCurrentIntervalIndex(0);
    setCurrentStepInInterval(0);
    const startNote = intervals[0]?.chromaticPath[0] || chord.root;
    playStepSound(startNote, 0);
  };

  const handleNextStep = () => {
    if (!currentInterval) return;

    if (currentStepInInterval < currentInterval.semitones) {
      const nextStep = currentStepInInterval + 1;
      setCurrentStepInInterval(nextStep);
      const nextNote = currentInterval.chromaticPath[nextStep];
      playStepSound(nextNote, nextStep);
    } else {
      // Move to next interval if exists
      if (currentIntervalIndex < intervals.length - 1) {
        const nextIntIdx = currentIntervalIndex + 1;
        setCurrentIntervalIndex(nextIntIdx);
        setCurrentStepInInterval(0);
        const startNote = intervals[nextIntIdx].chromaticPath[0];
        playStepSound(startNote, 0);
      } else {
        // Finished all intervals
        stopAutoPlay();
      }
    }
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      if (!isCountingMode) {
        setIsCountingMode(true);
      }
      setIsAutoPlaying(true);
      autoPlayTimerRef.current = window.setInterval(() => {
        handleNextStep();
      }, 700);
    }
  };

  const isAtEnd =
    currentIntervalIndex === intervals.length - 1 &&
    currentStepInInterval === (currentInterval?.semitones || 0);

  return (
    <div className="w-full max-w-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      {/* Title & Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.semitoneTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.semitoneSubtitle}
          </p>
        </div>

        {/* Step-by-step mode toggle */}
        <button
          onClick={() => {
            if (!isCountingMode) {
              handleStartCounting();
            } else {
              stopAutoPlay();
              setIsCountingMode(false);
              onStepChange(null);
            }
          }}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            isCountingMode
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          {isCountingMode ? t.resetCounting : t.stepByStepMode}
        </button>
      </div>

      {/* Primary Semitone Interval Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 my-5">
        {intervals.map((step, idx) => {
          const isCurrentActiveInterval = isCountingMode && currentIntervalIndex === idx;
          return (
            <div
              key={`${step.fromNote}-${step.toNote}-${idx}`}
              className={`relative rounded-xl p-4 border transition-all ${
                isCurrentActiveInterval
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Header: Note Pair */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {step.fromNote}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {step.toNote}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                    {lang === 'my' ? toBurmeseNumber(step.semitones) : step.semitones}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                    {t.semitonesUnit}
                  </div>
                </div>
              </div>

              {/* Step dots visualization */}
              <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono mb-1.5">
                  <span>{step.fromNote} (0)</span>
                  <span>
                    {step.toNote} (+{step.semitones})
                  </span>
                </div>

                {/* Stepping Track */}
                <div className="flex items-center gap-1 w-full">
                  {step.chromaticPath.map((note, pathIdx) => {
                    const isStepZero = pathIdx === 0;
                    const isStepEnd = pathIdx === step.semitones;
                    const isCurrentWalkStep =
                      isCurrentActiveInterval && currentStepInInterval === pathIdx;

                    let dotColor = 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300';
                    if (isCurrentWalkStep) {
                      dotColor = 'bg-amber-500 text-white font-bold ring-2 ring-amber-300 animate-bounce';
                    } else if (isStepZero) {
                      dotColor = 'bg-blue-600 text-white font-bold';
                    } else if (isStepEnd) {
                      dotColor = 'bg-emerald-600 text-white font-bold';
                    } else if (isCurrentActiveInterval && pathIdx < currentStepInInterval) {
                      dotColor = 'bg-emerald-300 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100';
                    }

                    return (
                      <div
                        key={pathIdx}
                        className="flex-1 flex flex-col items-center group relative cursor-pointer"
                        onClick={() => {
                          setIsCountingMode(true);
                          setCurrentIntervalIndex(idx);
                          setCurrentStepInInterval(pathIdx);
                          playStepSound(note, pathIdx);
                        }}
                      >
                        <div
                          className={`w-full h-6 rounded flex items-center justify-center text-[10px] transition-all ${dotColor}`}
                          title={`${note}: ${pathIdx} semitones`}
                        >
                          {note}
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                          {pathIdx}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step-by-Step Interactive Walkthrough Controller */}
      {isCountingMode && currentInterval && (
        <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {lang === 'my' ? 'အဆင့်ဆင့် ရေတွက်ခြင်း လမ်းညွှန်' : 'Active Walkthrough'}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  {currentInterval.fromNote} → {currentInterval.toNote}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                {lang === 'my'
                  ? `${currentInterval.chromaticPath[currentStepInInterval]} သို့ ရောက်ရှိသည် (ဆီမီးတုန်း ${toBurmeseNumber(
                      currentStepInInterval
                    )} / ${toBurmeseNumber(currentInterval.semitones)})`
                  : `Currently at: ${currentInterval.chromaticPath[currentStepInInterval]} (${currentStepInInterval}/${currentInterval.semitones} semitones)`}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentStepInInterval === 0
                  ? t.startingAtZero
                  : lang === 'my'
                  ? `စမှတ် ${currentInterval.fromNote} (Step 0) မှ ${toBurmeseNumber(
                      currentStepInInterval
                    )} ကီး ရွှေ့ထားပါသည်`
                  : `Moved ${currentStepInInterval} key(s) forward from starting key ${currentInterval.fromNote}`}
              </p>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleAutoPlay}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white transition-all cursor-pointer"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pause' : t.autoPlayWalk}</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={isAtEnd}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-all cursor-pointer ${
                  isAtEnd
                    ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                    : 'bg-amber-600 hover:bg-amber-500 active:scale-95 shadow-sm'
                }`}
              >
                <span>{t.nextStep}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetCounting}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title={t.resetCounting}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Explanatory Callout Box */}
      <div className="rounded-xl p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-bold text-blue-900 dark:text-blue-300 block mb-0.5">
            {t.semitoneDefinitionTitle}
          </span>
          <p>{t.semitoneDefinitionText}</p>
        </div>
      </div>
    </div>
  );
};
