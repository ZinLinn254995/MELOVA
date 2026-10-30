import React, { useState, useRef } from 'react';
import {
  CalculatedChord,
  Language,
  DisplayMode,
} from '../types/music';
import {
  FRET_MARKERS,
  getGuitarFretNote,
  getGuitarChordVoicing,
} from '../utils/fretboardTheory';
import { audioEngine } from '../utils/audioEngine';
import { getT } from '../utils/i18n';
import { Play, Music, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';

interface GuitarFretboardProps {
  chord: CalculatedChord;
  displayMode: DisplayMode;
  lang: Language;
  activeStepPitchClass: number | null;
}

// Standard guitar tablature / bar chord string ordering:
// String 1 (High e) at the top down to String 6 (Low E) at the bottom
const GUITAR_STRINGS_DISPLAY = [
  { stringNumber: 1, stringIndex: 5, openNote: 'e', openOctave: 4 },
  { stringNumber: 2, stringIndex: 4, openNote: 'B', openOctave: 3 },
  { stringNumber: 3, stringIndex: 3, openNote: 'G', openOctave: 3 },
  { stringNumber: 4, stringIndex: 2, openNote: 'D', openOctave: 3 },
  { stringNumber: 5, stringIndex: 1, openNote: 'A', openOctave: 2 },
  { stringNumber: 6, stringIndex: 0, openNote: 'E', openOctave: 2 },
];

export const GuitarFretboard: React.FC<GuitarFretboardProps> = ({
  chord,
  displayMode,
  lang,
  activeStepPitchClass,
}) => {
  const t = getT(lang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'full'>('chart');
  const [pluckedNote, setPluckedNote] = useState<string | null>(null);
  const [isStrumming, setIsStrumming] = useState(false);

  const totalFrets = 15;
  const frets = Array.from({ length: totalFrets + 1 }, (_, i) => i); // 0 (nut) to 15

  // Get current chord voicing for guitar
  const voicing = getGuitarChordVoicing(chord.root, chord.chordType.id);

  // Strum guitar chord down across the 6 strings
  const handleStrum = () => {
    if (isStrumming) return;
    setIsStrumming(true);

    const stringNotes = voicing.frets.map((fret, strIdx) => {
      if (fret === -1) return null; // unplayed
      return getGuitarFretNote(strIdx, fret);
    });

    audioEngine.strumGuitar(stringNotes, 42, () => {
      setIsStrumming(false);
    });
  };

  // Pluck strings individually
  const handlePluckArpeggio = () => {
    const stringNotes: { pitchClass: number; octave: number }[] = [];
    voicing.frets.forEach((fret, strIdx) => {
      if (fret !== -1) {
        const note = getGuitarFretNote(strIdx, fret);
        stringNotes.push({ pitchClass: note.pitchClass, octave: note.octave });
      }
    });

    audioEngine.playArpeggio(stringNotes, 320, 'guitar');
  };

  const handlePlayFretNote = (stringIndex: number, fret: number) => {
    const noteInfo = getGuitarFretNote(stringIndex, fret);
    const key = `${stringIndex}-${fret}`;
    setPluckedNote(key);
    audioEngine.playNote(noteInfo.pitchClass, noteInfo.octave, 1.8, 'guitar');
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
              {lang === 'my' ? 'ဂစ်တာ လက်ကွက်' : 'Guitar Chord'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">
              Tab Order (1:e · 2:B · 3:G · 4:D · 5:A · 6:E)
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
          {/* Chart vs Full Fretboard View Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-800 rounded-lg text-xs font-semibold shrink-0">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                viewMode === 'chart'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.guitarChordChart}
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
                viewMode === 'full'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.guitarFretboardMap}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <button
              onClick={handleStrum}
              disabled={isStrumming}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white transition-all shadow-md cursor-pointer ${
                isStrumming
                  ? 'bg-amber-600 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-900/30'
              }`}
              title={t.strumGuitar}
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">{t.strumGuitar}</span>
            </button>

            <button
              onClick={handlePluckArpeggio}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              title={t.pluckGuitar}
            >
              <Music className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.pluckGuitar}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header instruction */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-300 font-medium">{t.guitarStringTuning}</span>
          {voicing.baseFret > 1 && (
            <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/50 font-mono text-[11px]">
              {t.guitarBarreAtFret}: Fret {voicing.baseFret}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400">
          {t.scrollKeyboardHint}
        </span>
      </div>

      {/* Interactive Guitar Fretboard Diagram */}
      <div
        ref={scrollRef}
        className="relative w-full max-w-full overflow-x-auto pb-4 pt-2 select-none overscroll-x-contain scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
      >
        <div
          className="relative min-w-[760px] bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/80 rounded-xl p-4 sm:p-5 border-2 border-stone-800 shadow-2xl"
        >
          {/* Fretboard Nut / String status header (O: open, X: unplayed) */}
          <div className="grid gap-0 mb-2" style={{ gridTemplateColumns: `60px repeat(${frets.length}, minmax(0, 1fr))` }}>
            {/* String label column header */}
            <div className="text-[10px] font-bold text-slate-400 text-center flex items-center justify-center font-mono">
              1st → 6th
            </div>
            {/* Fret numbers (0 to 15) */}
            {frets.map((fret) => (
              <div
                key={fret}
                className="text-center text-[11px] font-mono font-bold text-slate-400"
              >
                {fret === 0 ? 'Nut (0)' : fret}
              </div>
            ))}
          </div>

          {/* 6 Guitar Strings (Tab order: 1st string at top to 6th string at bottom) */}
          <div className="space-y-3 relative">
            {GUITAR_STRINGS_DISPLAY.map((stringItem, displayIdx) => {
              const strIdx = stringItem.stringIndex; // 5 (1st string) down to 0 (6th string)
              const chordVoicingFret = voicing.frets[strIdx];
              const isStringMuted = chordVoicingFret === -1;
              const isStringOpen = chordVoicingFret === 0;

              // String physical gauge thickness:
              // String 1 (top) is the thinnest (~1.6px)
              // String 6 (bottom) is the thickest wound string (~4.6px)
              const stringHeightPx = 1.6 + (stringItem.stringNumber - 1) * 0.6;

              return (
                <div
                  key={stringItem.stringNumber}
                  className="relative grid items-center h-10 group"
                  style={{ gridTemplateColumns: `60px repeat(${frets.length}, minmax(0, 1fr))` }}
                >
                  {/* String Tuning Indicator on Headstock */}
                  <div className="flex items-center justify-between pr-2 border-r-4 border-amber-200/40">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono font-bold flex items-center justify-center text-slate-300">
                      {stringItem.stringNumber}
                    </span>
                    <span className="font-bold text-xs text-amber-300 font-mono">
                      {stringItem.openNote}
                    </span>
                    {/* Voicing indicator icon: O or X */}
                    {viewMode === 'chart' && (
                      <span
                        className={`text-[10px] font-mono font-extrabold px-1 rounded ${
                          isStringMuted
                            ? 'text-rose-400 bg-rose-950/60'
                            : isStringOpen
                            ? 'text-emerald-400 bg-emerald-950/60'
                            : 'text-slate-400'
                        }`}
                      >
                        {isStringMuted ? 'X' : isStringOpen ? 'O' : ''}
                      </span>
                    )}
                  </div>

                  {/* Metal String line spanning horizontally */}
                  <div
                    className="absolute left-[60px] right-0 bg-gradient-to-b from-stone-400 via-stone-300 to-stone-500 shadow-sm pointer-events-none"
                    style={{ height: `${stringHeightPx}px`, top: 'calc(50% - 1px)' }}
                  />

                  {/* Frets for this string */}
                  {frets.map((fret) => {
                    const noteInfo = getGuitarFretNote(strIdx, fret);
                    const chordTone = chord.notes.find(
                      (n) => n.pitchClass === noteInfo.pitchClass
                    );
                    const isRoot = chordTone?.role === 'root';
                    const isChordTone = !!chordTone;

                    // In Chart Mode, check if this fret is specifically pressed in the voicing
                    const isVoicingFret =
                      viewMode === 'chart' && chordVoicingFret === fret;
                    const fingerNum =
                      isVoicingFret && voicing.fingers ? voicing.fingers[strIdx] : null;

                    // Walkthrough step active
                    const isStepActive =
                      activeStepPitchClass !== null &&
                      noteInfo.pitchClass === activeStepPitchClass;

                    const keyId = `${strIdx}-${fret}`;
                    const isPlucked = pluckedNote === keyId;

                    // Should we display a note badge?
                    const showBadge =
                      viewMode === 'full' ? isChordTone : isVoicingFret;

                    return (
                      <div
                        key={fret}
                        onClick={() => handlePlayFretNote(strIdx, fret)}
                        className={`relative h-10 flex items-center justify-center border-r border-stone-600/60 cursor-pointer transition-transform ${
                          fret === 0 ? 'bg-amber-950/40 border-r-4 border-amber-300/40' : ''
                        } ${isPlucked ? 'scale-110' : 'hover:bg-white/5'}`}
                        title={`${stringItem.stringNumber}th String (${stringItem.openNote}), Fret ${fret}: ${noteInfo.noteName}${noteInfo.octave}`}
                      >
                        {/* Fret Marker Dots on wood neck (placed in the middle of neck: strings 3 and 4) */}
                        {displayIdx === 2 && FRET_MARKERS.includes(fret) && (
                          <div
                            className={`absolute pointer-events-none w-2 h-2 rounded-full ${
                              fret === 12
                                ? 'bg-amber-200/40 shadow-sm'
                                : 'bg-stone-400/30'
                            }`}
                          />
                        )}
                        {displayIdx === 3 && fret === 12 && (
                          <div className="absolute pointer-events-none w-2 h-2 rounded-full bg-amber-200/40 shadow-sm" />
                        )}

                        {/* Interactive Note Circle */}
                        {showBadge && (
                          <div
                            className={`z-10 w-7 h-7 rounded-full flex flex-col items-center justify-center font-bold text-[11px] shadow-lg transition-transform ${
                              isStepActive
                                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300 ring-inset scale-110'
                                : isRoot
                                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                                : 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                            }`}
                          >
                            <span>
                              {displayMode === 'names'
                                ? chordTone?.noteName || noteInfo.noteName
                                : `+${chordTone?.semitoneFromRoot ?? ''}`}
                            </span>
                            {/* Finger number badge in chart mode */}
                            {viewMode === 'chart' && fingerNum && (
                              <span className="text-[8px] font-mono leading-none opacity-90">
                                #{fingerNum}
                              </span>
                            )}
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

      {/* Visual Legend for Guitar */}
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
          {viewMode === 'chart' && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  O
                </span>
                <span className="font-medium text-slate-300">{t.openString}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                  X
                </span>
                <span className="font-medium text-slate-300">{t.mutedString}</span>
              </div>
            </>
          )}
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          {viewMode === 'chart' ? t.fingerLegend : t.scrollKeyboardHint}
        </span>
      </div>
    </div>
  );
};
