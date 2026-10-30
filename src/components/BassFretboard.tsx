import React, { useState, useRef } from 'react';
import {
  CalculatedChord,
  Language,
  DisplayMode,
} from '../types/music';
import {
  BASS_TUNING,
  FRET_MARKERS,
  getBassFretNote,
  getBassArpeggioPattern,
} from '../utils/fretboardTheory';
import { audioEngine } from '../utils/audioEngine';
import { getT } from '../utils/i18n';
import { Play, Music, Radio, Disc } from 'lucide-react';

interface BassFretboardProps {
  chord: CalculatedChord;
  displayMode: DisplayMode;
  lang: Language;
  activeStepPitchClass: number | null;
}

export const BassFretboard: React.FC<BassFretboardProps> = ({
  chord,
  displayMode,
  lang,
  activeStepPitchClass,
}) => {
  const t = getT(lang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'pattern' | 'full'>('pattern');
  const [pluckedNote, setPluckedNote] = useState<string | null>(null);
  const [isGrooving, setIsGrooving] = useState(false);
  const [activeGrooveIndex, setActiveGrooveIndex] = useState<number | null>(null);

  const totalFrets = 15;
  const frets = Array.from({ length: totalFrets + 1 }, (_, i) => i);

  // Get bass arpeggio box pattern for this chord
  const pattern = getBassArpeggioPattern(chord);

  // Play walking bass groove pattern
  const handlePlayGroove = () => {
    if (isGrooving) return;
    setIsGrooving(true);

    const grooveNotes = pattern.notes.map((n) => {
      // Find octave
      const tuning = BASS_TUNING[4 - n.stringNum];
      const oct = tuning.openOctave + Math.floor((tuning.openPitchClass + n.fret) / 12);
      return { pitchClass: n.pitchClass, octave: oct };
    });

    audioEngine.playBassGroove(
      grooveNotes,
      380,
      (idx) => {
        setActiveGrooveIndex(idx);
      },
      () => {
        setIsGrooving(false);
        setActiveGrooveIndex(null);
      }
    );
  };

  const handlePlayChordNotes = () => {
    const notesToPlay = chord.notes.map((n) => ({
      pitchClass: n.pitchClass,
      octave: 2,
    }));
    audioEngine.playChord(notesToPlay, 1.8, 'bass');
  };

  const handlePlayFretNote = (stringIndex: number, fret: number) => {
    const noteInfo = getBassFretNote(stringIndex, fret);
    const key = `${stringIndex}-${fret}`;
    setPluckedNote(key);
    audioEngine.playNote(noteInfo.pitchClass, noteInfo.octave, 1.6, 'bass');
    setTimeout(() => {
      setPluckedNote(null);
    }, 300);
  };

  return (
    <div className="w-full max-w-full bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-2xl p-3.5 sm:p-6 shadow-xl border border-slate-800 transition-colors overflow-hidden">
      {/* Top Header: Chord Info & Playback Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              {lang === 'my' ? 'ဘေ့စ်ဂစ်တာ' : 'Bass Guitar'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">
              4-String Standard (EADG)
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
              {lang === 'my' ? chord.fullNameMy : chord.fullNameEn}
            </h2>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs sm:text-sm md:text-base font-semibold">
              <span>( {chord.notes.map((n) => n.noteName).join(' – ')} )</span>
            </div>
          </div>
        </div>

        {/* View Toggle & Playback Buttons */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
          {/* Pattern vs Full Fretboard View Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-800 rounded-lg text-xs font-semibold shrink-0">
            <button
              onClick={() => setViewMode('pattern')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                viewMode === 'pattern'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.bassArpeggioBox}
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                viewMode === 'full'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.bassFretboardMap}
            </button>
          </div>

          <button
            onClick={handlePlayGroove}
            disabled={isGrooving}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white transition-all shadow-md cursor-pointer ${
              isGrooving
                ? 'bg-amber-600 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-900/30'
            }`}
            title={t.playBassGroove}
          >
            <Disc className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.playBassGroove}</span>
          </button>

          <button
            onClick={handlePlayChordNotes}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            title={t.playBassChord}
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span className="truncate">{t.playBassChord}</span>
          </button>
        </div>
      </div>

      {/* Sub-header instruction */}
      <div className="flex items-center justify-between py-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-medium">{t.bassStringTuning}</span>
          {viewMode === 'pattern' && (
            <span className="text-[11px] text-amber-300 font-mono">
              {lang === 'my' ? pattern.nameMy : pattern.nameEn}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline-block">
          {t.soundHint}
        </span>
      </div>

      {/* Interactive 4-String Bass Fretboard */}
      <div
        ref={scrollRef}
        className="relative w-full max-w-full overflow-x-auto touch-pan-x overscroll-x-contain pb-4 pt-2 select-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
      >
        <div
          className="relative min-w-[760px] bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-xl p-4 sm:p-5 border-2 border-stone-800 shadow-2xl"
        >
          {/* Fret Numbers Header */}
          <div className="grid gap-0 mb-2" style={{ gridTemplateColumns: `60px repeat(${frets.length}, minmax(0, 1fr))` }}>
            <div className="text-[11px] font-bold text-slate-400 text-center flex items-center justify-center">
              Strings
            </div>
            {frets.map((fret) => (
              <div
                key={fret}
                className="text-center text-[11px] font-mono font-bold text-slate-400"
              >
                {fret === 0 ? 'Nut (0)' : fret}
              </div>
            ))}
          </div>

          {/* 4 Bass Strings: top to bottom = String 1 (High G) to String 4 (Low E) */}
          <div className="space-y-4 relative py-1">
            {[...BASS_TUNING].reverse().map((tuning, visualIndex) => {
              // Keep note calculations tied to the canonical tuning index (String 4 to String 1).
              const tuningIndex = BASS_TUNING.indexOf(tuning);
              // The high G string is thinnest at the top; low E is thickest at the bottom.
              const stringHeightPx = 3.6 + visualIndex * 0.8;

              return (
                <div
                  key={tuning.stringNumber}
                  className="relative grid items-center h-12 group" style={{ gridTemplateColumns: `60px repeat(${frets.length}, minmax(0, 1fr))` }}
                >
                  {/* String Tuning Indicator on Headstock */}
                  <div className="flex items-center justify-between pr-2 border-r-4 border-amber-200/40">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-[11px] font-mono font-bold flex items-center justify-center text-slate-300">
                      {tuning.stringNumber}
                    </span>
                    <span className="font-bold text-sm text-amber-300 font-mono">
                      {tuning.openNote}
                    </span>
                  </div>

                  {/* Thick Bass String line spanning horizontally */}
                  <div
                    className="absolute left-[60px] right-0 bg-gradient-to-b from-stone-300 via-stone-100 to-stone-400 shadow-md pointer-events-none"
                    style={{ height: `${stringHeightPx}px`, top: 'calc(50% - 1px)' }}
                  />

                  {/* Frets for this bass string */}
                  {frets.map((fret) => {
                    const noteInfo = getBassFretNote(tuningIndex, fret);
                    const chordTone = chord.notes.find(
                      (n) => n.pitchClass === noteInfo.pitchClass
                    );
                    const isRoot = chordTone?.role === 'root';
                    const isChordTone = !!chordTone;

                    // In Pattern mode, check if this note is in the selected arpeggio box
                    const patternMatch = pattern.notes.find(
                      (pn) => pn.stringNum === tuning.stringNumber && pn.fret === fret
                    );
                    const isPatternNote = !!patternMatch;

                    // Groove animation active
                    const isGrooveActive =
                      isGrooving &&
                      activeGrooveIndex !== null &&
                      pattern.notes[activeGrooveIndex]?.stringNum === tuning.stringNumber &&
                      pattern.notes[activeGrooveIndex]?.fret === fret;

                    // Walkthrough step active
                    const isStepActive =
                      activeStepPitchClass !== null &&
                      noteInfo.pitchClass === activeStepPitchClass;

                    const keyId = `${strIdx}-${fret}`;
                    const isPlucked = pluckedNote === keyId;

                    const showBadge =
                      viewMode === 'full' ? isChordTone : isPatternNote;

                    return (
                      <div
                        key={fret}
                        onClick={() => handlePlayFretNote(strIdx, fret)}
                        className={`relative h-12 flex items-center justify-center border-r border-stone-600/60 cursor-pointer transition-transform ${
                          fret === 0 ? 'bg-amber-950/40 border-r-4 border-amber-300/40' : ''
                        } ${isPlucked ? 'scale-110' : 'hover:bg-white/5'}`}
                        title={`${tuning.stringNumber}th String, Fret ${fret}: ${noteInfo.noteName}${noteInfo.octave}`}
                      >
                        {/* Fret Markers on wood neck */}
                        {strIdx === 1 && FRET_MARKERS.includes(fret) && (
                          <div
                            className={`absolute pointer-events-none w-2.5 h-2.5 rounded-full ${
                              fret === 12
                                ? 'bg-amber-200/50 shadow-sm'
                                : 'bg-stone-400/30'
                            }`}
                          />
                        )}
                        {strIdx === 2 && fret === 12 && (
                          <div className="absolute pointer-events-none w-2.5 h-2.5 rounded-full bg-amber-200/50 shadow-sm" />
                        )}

                        {/* Interactive Note Badge */}
                        {showBadge && (
                          <div
                            className={`z-10 w-8 h-8 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-lg transition-transform ${
                              isGrooveActive
                                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-200 scale-125 animate-pulse'
                                : isStepActive
                                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300 ring-inset scale-110'
                                : isRoot
                                ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-blue-500/30'
                                : 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-emerald-500/30'
                            }`}
                          >
                            <span>
                              {displayMode === 'names'
                                ? chordTone?.noteName || noteInfo.noteName
                                : `+${chordTone?.semitoneFromRoot ?? ''}`}
                            </span>
                            <span className="text-[7px] font-mono leading-none opacity-80">
                              {isRoot ? 'ROOT' : chordTone?.roleNameEn?.split(' ')[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Legend for Bass */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs border-t border-slate-800 text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-400"></span>
            <span className="font-medium text-slate-200">{t.legendRoot}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-400"></span>
            <span className="font-medium text-slate-200">{t.legendChordTone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-300"></span>
            <span className="font-medium text-slate-200">{t.legendCountingStep}</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          {t.scrollKeyboardHint}
        </span>
      </div>
    </div>
  );
};
