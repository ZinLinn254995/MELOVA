import React, { useRef, useState } from 'react';
import {
  NoteName,
  CalculatedChord,
  Language,
  DisplayMode,
} from '../types/music';
import { CHROMATIC_NOTES } from '../utils/musicTheory';
import { audioEngine } from '../utils/audioEngine';
import { getT } from '../utils/i18n';
import { Volume2, VolumeX, Play, Music, Sparkles } from 'lucide-react';

interface PianoKeyboardProps {
  chord: CalculatedChord;
  octaveCount: 2 | 3;
  displayMode: DisplayMode;
  lang: Language;
  activeStepPitchClass: number | null; // For step-by-step semitone walker highlight
  activeStepOctave?: number;
  onKeyClick?: (noteName: NoteName, octave: number) => void;
}

interface KeyData {
  pitchClass: number;
  noteName: NoteName;
  octave: number;
  isBlack: boolean;
  whiteIndex: number; // Index among all white keys
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  chord,
  octaveCount,
  displayMode,
  lang,
  activeStepPitchClass,
  activeStepOctave,
  onKeyClick,
}) => {
  const t = getT(lang);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isArpeggiating, setIsArpeggiating] = useState(false);
  const [arpeggiatingIndex, setArpeggiatingIndex] = useState<number | null>(null);

  // Octave range: 2 octaves (Octave 3, 4) or 3 octaves (Octave 3, 4, 5)
  const startOctave = 3;
  const octaves = Array.from({ length: octaveCount }, (_, i) => startOctave + i);

  // Generate white keys and black keys
  const whiteKeys: KeyData[] = [];
  const blackKeys: (KeyData & { leftPercent: number })[] = [];

  const whiteNoteNames: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNoteOffsets: { note: NoteName; boundaryWhiteIndex: number }[] = [
    { note: 'C#', boundaryWhiteIndex: 1 },
    { note: 'D#', boundaryWhiteIndex: 2 },
    { note: 'F#', boundaryWhiteIndex: 4 },
    { note: 'G#', boundaryWhiteIndex: 5 },
    { note: 'A#', boundaryWhiteIndex: 6 },
  ];

  let currentWhiteCounter = 0;
  octaves.forEach((oct) => {
    const octStartWhite = currentWhiteCounter;

    whiteNoteNames.forEach((wNote) => {
      const pitchClass = CHROMATIC_NOTES.indexOf(wNote);
      whiteKeys.push({
        pitchClass,
        noteName: wNote,
        octave: oct,
        isBlack: false,
        whiteIndex: currentWhiteCounter,
      });
      currentWhiteCounter++;
    });

    blackNoteOffsets.forEach((b) => {
      const pitchClass = CHROMATIC_NOTES.indexOf(b.note);
      blackKeys.push({
        pitchClass,
        noteName: b.note,
        octave: oct,
        isBlack: true,
        whiteIndex: octStartWhite + b.boundaryWhiteIndex,
        leftPercent: 0, // calculated below relative to total white keys
      });
    });
  });

  // Add final resolving C on right edge
  const lastOctave = startOctave + octaveCount;
  whiteKeys.push({
    pitchClass: 0,
    noteName: 'C',
    octave: lastOctave,
    isBlack: false,
    whiteIndex: currentWhiteCounter,
  });
  const totalWhiteKeys = whiteKeys.length;

  // Key width configuration (each white key has a comfortable touch target of at least 48px)
  const whiteKeyWidthPx = 48;
  const keyboardWidthPx = totalWhiteKeys * whiteKeyWidthPx;
  const blackKeyWidthPx = 28;

  const handleKeyPress = (pitchClass: number, octave: number, noteName: NoteName) => {
    const keyId = `${noteName}-${octave}`;
    setPressedKey(keyId);
    audioEngine.playNote(pitchClass, octave, 1.2);
    if (onKeyClick) {
      onKeyClick(noteName, octave);
    }
    setTimeout(() => {
      setPressedKey(null);
    }, 250);
  };

  const handlePlayFullChord = () => {
    // Primary voicing in octave 4 (or octave 3 for high notes)
    const notesToPlay = chord.notes.map((n) => {
      // If note semitone makes it spill into next octave
      const baseOctave = 4;
      const rootPitchClass = chord.notes[0]?.pitchClass ?? 0;
      const pitchOffset = n.semitoneFromRoot;
      // Include the root pitch class so intervals crossing C advance the octave.
      const oct = baseOctave + Math.floor((rootPitchClass + pitchOffset) / 12);
      return { pitchClass: n.pitchClass, octave: oct };
    });
    audioEngine.playChord(notesToPlay);
  };

  const handlePlayArpeggio = () => {
    if (isArpeggiating) return;
    setIsArpeggiating(true);

    const notesToPlay = chord.notes.map((n) => {
      const baseOctave = 4;
      const rootPitchClass = chord.notes[0]?.pitchClass ?? 0;
      const pitchOffset = n.semitoneFromRoot;
      // Include the root pitch class so intervals crossing C advance the octave.
      const oct = baseOctave + Math.floor((rootPitchClass + pitchOffset) / 12);
      return { pitchClass: n.pitchClass, octave: oct };
    });

    audioEngine.playArpeggio(
      notesToPlay,
      350,
      'piano',
      (idx: number) => {
        setArpeggiatingIndex(idx);
      },
      () => {
        setIsArpeggiating(false);
        setArpeggiatingIndex(null);
      }
    );
  };

  const getChordToneInfo = (pitchClass: number) => {
    return chord.notes.find((n) => n.pitchClass === pitchClass);
  };

  const scrollToOctave = (targetOct: number) => {
    if (!scrollContainerRef.current) return;
    const indexInWhite = (targetOct - startOctave) * 7;
    const targetX = indexInWhite * whiteKeyWidthPx - 20;
    scrollContainerRef.current.scrollTo({ left: Math.max(0, targetX), behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-full bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-2xl p-3.5 sm:p-6 shadow-xl border border-slate-800 transition-colors overflow-hidden">
      {/* Top Header: Chord Name, Sound Controls, and Quick Audition */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              {lang === 'my' ? 'ရွေးချယ်ထားသော Chord' : 'Selected Chord'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">
              {chord.chordType.formulaPatternEn}
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

        {/* Playback Actions */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
          <button
            onClick={handlePlayFullChord}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-all shadow-md shadow-indigo-900/30 cursor-pointer"
            title={t.playChord}
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span className="truncate">{t.playChord}</span>
          </button>

          <button
            onClick={handlePlayArpeggio}
            disabled={isArpeggiating}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              isArpeggiating
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700'
            }`}
            title={t.playNotesSeparately}
          >
            <Music className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.playNotesSeparately}</span>
          </button>
        </div>
      </div>

      {/* Octave quick jump navigation bar */}
      <div className="flex items-center justify-between py-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-slate-300">{t.octaves}:</span>
          {octaves.map((oct) => (
            <button
              key={oct}
              onClick={() => scrollToOctave(oct)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Octave {oct}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline-block">
          {t.soundHint}
        </span>
      </div>

      {/* Horizontal Scrollable Piano Keyboard Container */}
      <div
        ref={scrollContainerRef}
        className="relative w-full max-w-full overflow-x-auto overscroll-x-contain pb-4 pt-2 select-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
      >
        <div
          className="relative mx-auto rounded-b-xl shadow-2xl bg-slate-950 p-2 sm:p-3 border-t-8 border-slate-950"
          style={{ width: `${keyboardWidthPx}px`, minWidth: `${keyboardWidthPx}px` }}
        >
          {/* Piano Keybed backplate */}
          <div className="relative h-48 sm:h-56 bg-slate-950 rounded-b-lg flex">
            {/* White Keys */}
            {whiteKeys.map((k) => {
              const chordInfo = getChordToneInfo(k.pitchClass);
              const isChordTone = !!chordInfo;
              const isRoot = chordInfo?.role === 'root';
              const keyId = `${k.noteName}-${k.octave}`;
              const isCurrentlyPressed = pressedKey === keyId;

              // Step-by-step counting active highlight
              const isStepActive =
                activeStepPitchClass !== null &&
                k.pitchClass === activeStepPitchClass &&
                (activeStepOctave === undefined || k.octave === activeStepOctave);

              // Arpeggio highlighting
              const isArpActive =
                isArpeggiating &&
                arpeggiatingIndex !== null &&
                chord.notes[arpeggiatingIndex]?.pitchClass === k.pitchClass &&
                k.octave === 4;

              let bgStyle = 'bg-gradient-to-b from-slate-100 to-white text-slate-800';
              if (isStepActive) {
                bgStyle =
                  'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 ring-4 ring-amber-300 ring-inset shadow-lg';
              } else if (isArpActive) {
                bgStyle =
                  'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white ring-4 ring-emerald-300 ring-inset';
              } else if (isRoot) {
                bgStyle =
                  'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20';
              } else if (isChordTone) {
                bgStyle =
                  'bg-gradient-to-b from-teal-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20';
              }

              return (
                <button
                  key={keyId}
                  onClick={() => handleKeyPress(k.pitchClass, k.octave, k.noteName)}
                  style={{ width: `${whiteKeyWidthPx}px` }}
                  className={`relative h-full shrink-0 border-r border-slate-300 dark:border-slate-400 rounded-b-md flex flex-col justify-end items-center pb-2.5 transition-transform duration-75 cursor-pointer ${bgStyle} ${
                    isCurrentlyPressed ? 'scale-y-[0.98] translate-y-0.5 shadow-inner' : 'hover:brightness-95'
                  }`}
                  aria-label={`${k.noteName}${k.octave}`}
                >
                  {/* Octave indicator for C keys */}
                  {k.noteName === 'C' && (
                    <span className="absolute top-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
                      C{k.octave}
                    </span>
                  )}

                  {/* Chord Tone badge or semitone indicator */}
                  {isChordTone && (
                    <div className="absolute bottom-9 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm bg-black/20 text-white">
                      {isRoot ? 'R' : chordInfo?.semitoneFromRoot}
                    </div>
                  )}

                  {/* Note Label */}
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    {displayMode === 'names'
                      ? chordInfo?.noteName || k.noteName
                      : `+${chordInfo ? chordInfo.semitoneFromRoot : k.pitchClass}`}
                  </span>
                </button>
              );
            })}

            {/* Black Keys overlaid with precise percentage placement */}
            {blackKeys.map((b) => {
              const chordInfo = getChordToneInfo(b.pitchClass);
              const isChordTone = !!chordInfo;
              const isRoot = chordInfo?.role === 'root';
              const keyId = `${b.noteName}-${b.octave}`;
              const isCurrentlyPressed = pressedKey === keyId;

              // Step-by-step counting highlight
              const isStepActive =
                activeStepPitchClass !== null &&
                b.pitchClass === activeStepPitchClass &&
                (activeStepOctave === undefined || b.octave === activeStepOctave);

              // Arpeggio highlighting
              const isArpActive =
                isArpeggiating &&
                arpeggiatingIndex !== null &&
                chord.notes[arpeggiatingIndex]?.pitchClass === b.pitchClass &&
                b.octave === 4;

              // Position: centered over boundary of whiteKeyIndex
              // Left coordinate = (whiteIndex * whiteKeyWidthPx) - (blackKeyWidthPx / 2)
              const leftPos = b.whiteIndex * whiteKeyWidthPx - blackKeyWidthPx / 2;

              let bgStyle = 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-200';
              if (isStepActive) {
                bgStyle =
                  'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 ring-2 ring-amber-200 shadow-lg';
              } else if (isArpActive) {
                bgStyle =
                  'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white ring-2 ring-emerald-200';
              } else if (isRoot) {
                bgStyle =
                  'bg-gradient-to-b from-blue-600 to-indigo-700 text-white ring-1 ring-blue-400 shadow-md shadow-blue-500/30';
              } else if (isChordTone) {
                bgStyle =
                  'bg-gradient-to-b from-teal-600 to-emerald-700 text-white ring-1 ring-teal-400 shadow-md shadow-emerald-500/30';
              }

              return (
                <button
                  key={keyId}
                  onClick={() => handleKeyPress(b.pitchClass, b.octave, b.noteName)}
                  style={{
                    position: 'absolute',
                    left: `${leftPos}px`,
                    width: `${blackKeyWidthPx}px`,
                    height: '62%',
                  }}
                  className={`z-10 rounded-b-md shadow-xl flex flex-col justify-end items-center pb-2 transition-transform duration-75 cursor-pointer ${bgStyle} ${
                    isCurrentlyPressed ? 'scale-y-[0.98] translate-y-0.5 shadow-inner' : 'hover:brightness-110'
                  }`}
                  aria-label={`${b.noteName}${b.octave}`}
                >
                  {/* Badge */}
                  {isChordTone && (
                    <div className="mb-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm bg-black/40 text-white">
                      {isRoot ? 'R' : chordInfo?.semitoneFromRoot}
                    </div>
                  )}

                  <span className="text-[10px] sm:text-xs font-bold leading-tight">
                    {displayMode === 'names'
                      ? chordInfo?.noteName || b.noteName
                      : `+${chordInfo ? chordInfo.semitoneFromRoot : b.pitchClass}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Legend */}
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
