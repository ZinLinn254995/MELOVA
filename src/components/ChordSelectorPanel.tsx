import {
  NoteName,
  ChordTypeId,
  Language,
  DisplayMode,
  InstrumentType,
} from '../types/music';
import {
  ROOT_NOTES,
  CHORD_DEFINITIONS,
  calculateChord,
} from '../utils/musicTheory';
import { getT } from '../utils/i18n';
import { Layers, Sliders, Hash, Type, Music } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface ChordSelectorPanelProps {
  selectedInstrument: InstrumentType;
  selectedRoot: NoteName;
  selectedChordType: ChordTypeId;
  octaveCount: 2 | 3;
  displayMode: DisplayMode;
  lang: Language;
  onInstrumentChange: (inst: InstrumentType) => void;
  onRootChange: (root: NoteName) => void;
  onChordTypeChange: (type: ChordTypeId) => void;
  onOctaveCountChange: (count: 2 | 3) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

const CHORD_TYPE_LIST: ChordTypeId[] = [
  'major',
  'minor',
  'diminished',
  'augmented',
  'sus2',
  'sus4',
  'dom7',
  'maj7',
  'min7',
];

export const ChordSelectorPanel: React.FC<ChordSelectorPanelProps> = ({
  selectedInstrument,
  selectedRoot,
  selectedChordType,
  octaveCount,
  displayMode,
  lang,
  onInstrumentChange,
  onRootChange,
  onChordTypeChange,
  onOctaveCountChange,
  onDisplayModeChange,
}) => {
  const t = getT(lang);

  const handleInstrumentSelect = (inst: InstrumentType) => {
    onInstrumentChange(inst);
    // Preview sound with chosen instrument
    const chord = calculateChord(selectedRoot, selectedChordType);
    if (inst === 'piano') {
      audioEngine.playChord(chord.notes.map((n) => ({ pitchClass: n.pitchClass, octave: 4 })), 0.8, 'piano');
    } else if (inst === 'guitar') {
      audioEngine.playChord(chord.notes.map((n) => ({ pitchClass: n.pitchClass, octave: 3 })), 0.9, 'guitar');
    } else {
      audioEngine.playChord(chord.notes.map((n) => ({ pitchClass: n.pitchClass, octave: 2 })), 1.0, 'bass');
    }
  };

  const handleRootClick = (root: NoteName) => {
    onRootChange(root);
    // Play root preview tone
    const chord = calculateChord(root, selectedChordType);
    const oct = selectedInstrument === 'bass' ? 2 : selectedInstrument === 'guitar' ? 3 : 4;
    audioEngine.playNote(chord.notes[0].pitchClass, oct, 0.6, selectedInstrument);
  };

  const handleTypeClick = (typeId: ChordTypeId) => {
    onChordTypeChange(typeId);
    // Quick chord audition
    const chord = calculateChord(selectedRoot, typeId);
    const oct = selectedInstrument === 'bass' ? 2 : selectedInstrument === 'guitar' ? 3 : 4;
    audioEngine.playChord(
      chord.notes.map((n) => ({ pitchClass: n.pitchClass, octave: oct })),
      0.8,
      selectedInstrument
    );
  };

  return (
    <div className="w-full max-w-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      {/* 0. Primary Instrument Selector Switcher (Piano · Guitar · Bass) */}
      <div className="mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>{t.instrumentSelect}</span>
          </label>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            {selectedInstrument === 'piano'
              ? t.instrumentPiano
              : selectedInstrument === 'guitar'
              ? t.instrumentGuitar
              : t.instrumentBass}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          <button
            onClick={() => handleInstrumentSelect('piano')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer font-bold text-xs sm:text-sm min-w-0 ${
              selectedInstrument === 'piano'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/30'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-base sm:text-xl shrink-0">🎹</span>
            <span className="truncate">{t.instrumentPiano}</span>
          </button>

          <button
            onClick={() => handleInstrumentSelect('guitar')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer font-bold text-xs sm:text-sm min-w-0 ${
              selectedInstrument === 'guitar'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/30'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-base sm:text-xl shrink-0">🎸</span>
            <span className="truncate">{t.instrumentGuitar}</span>
          </button>

          <button
            onClick={() => handleInstrumentSelect('bass')}
            className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer font-bold text-xs sm:text-sm min-w-0 ${
              selectedInstrument === 'bass'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/30'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-base sm:text-xl shrink-0">🔊</span>
            <span className="truncate">{t.instrumentBass}</span>
          </button>
        </div>
      </div>

      {/* 1. Root Note Selector */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.rootNote}
          </label>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
            {selectedRoot}
          </span>
        </div>

        {/* 12 chromatic buttons grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5 sm:gap-2">
          {ROOT_NOTES.map(({ note, labelEn, labelMy }) => {
            const isSelected = selectedRoot === note;
            const isBlackKey = note.includes('#');

            return (
              <button
                key={note}
                onClick={() => handleRootClick(note)}
                className={`py-2 px-1 text-center font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.02]'
                    : isBlackKey
                    ? 'bg-slate-800 dark:bg-slate-950 text-slate-100 hover:bg-slate-700 dark:hover:bg-slate-800 border border-slate-700/60'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
                aria-pressed={isSelected}
              >
                <div>{note}</div>
                {isBlackKey && (
                  <div className="text-[10px] opacity-70 font-normal leading-tight">
                    {note === 'C#'
                      ? 'D♭'
                      : note === 'D#'
                      ? 'E♭'
                      : note === 'F#'
                      ? 'G♭'
                      : note === 'G#'
                      ? 'A♭'
                      : 'B♭'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chord Type Selector */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.chordType}
          </label>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            {lang === 'my'
              ? CHORD_DEFINITIONS[selectedChordType].nameMy
              : CHORD_DEFINITIONS[selectedChordType].nameEn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CHORD_TYPE_LIST.map((typeId) => {
            const def = CHORD_DEFINITIONS[typeId];
            const isSelected = selectedChordType === typeId;

            return (
              <button
                key={typeId}
                onClick={() => handleTypeClick(typeId)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-400/30'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm">
                    {lang === 'my' ? def.nameMy : def.nameEn}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {def.symbol || 'Maj'}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-mono mt-1 ${
                    isSelected ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {def.formulaPatternEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Auxiliary View Controls: Instrument-specific options & Key Display Mode */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Octave Selector (Piano) or String Info (Guitar/Bass) */}
        {selectedInstrument === 'piano' ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.octaves}:
            </span>
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
              <button
                onClick={() => onOctaveCountChange(2)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  octaveCount === 2
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.octaves2}
              </button>
              <button
                onClick={() => onOctaveCountChange(3)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  octaveCount === 3
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.octaves3}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {selectedInstrument === 'guitar' ? '🎸 6-String Guitar' : '🔊 4-String Bass'}:
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {selectedInstrument === 'guitar' ? 'E-A-D-G-B-E' : 'E-A-D-G'}
            </span>
          </div>
        )}

        {/* Note Names vs Semitones Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.displayMode}:
          </span>
          <div className="grid grid-cols-2 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => onDisplayModeChange('names')}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${
                displayMode === 'names'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.showNoteNames}</span>
            </button>
            <button
              onClick={() => onDisplayModeChange('semitones')}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${
                displayMode === 'semitones'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Hash className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.showSemitones}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
