import React, { useState } from 'react';
import {
  NoteName,
  ChordTypeId,
  Language,
  InstrumentType,
} from '../types/music';
import {
  SEVEN_NATURAL_MAJOR_CHORDS,
  CHROMATIC_NOTES,
  calculateChord,
  CHORD_DEFINITIONS,
} from '../utils/musicTheory';
import { getGuitarChordVoicing } from '../utils/fretboardTheory';
import { getT } from '../utils/i18n';
import { Table, Play, ArrowRight, Check } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface ChordReferenceTableProps {
  selectedInstrument: InstrumentType;
  currentRoot: NoteName;
  currentChordType: ChordTypeId;
  lang: Language;
  onSelectChord: (root: NoteName, chordType: ChordTypeId) => void;
}

export const ChordReferenceTable: React.FC<ChordReferenceTableProps> = ({
  selectedInstrument,
  currentRoot,
  currentChordType,
  lang,
  onSelectChord,
}) => {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<'natural' | 'all'>('natural');
  const [selectedFilterType, setSelectedFilterType] = useState<ChordTypeId>('major');

  const playInstrumentChord = (chordData: ReturnType<typeof calculateChord>) => {
    const baseOctave = selectedInstrument === 'bass' ? 2 : selectedInstrument === 'guitar' ? 3 : 4;
    audioEngine.playChord(
      chordData.notes.map((n) => ({
        pitchClass: n.pitchClass,
        octave: baseOctave + Math.floor(((chordData.notes[0]?.pitchClass ?? 0) + n.semitoneFromRoot) / 12),
      })),
      1.5,
      selectedInstrument
    );
  };

  const formatGuitarVoicing = (root: NoteName, type: ChordTypeId) => {
    const v = getGuitarChordVoicing(root, type);
    return v.frets.map((f) => (f === -1 ? 'X' : f.toString())).join(' ');
  };

  return (
    <div className="w-full max-w-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.referenceTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.referenceSubtitle}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('natural')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'natural'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.tabNaturalMajor}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.tabAllRoots}
          </button>
        </div>
      </div>

      {/* When All Roots tab is active, show chord type filter */}
      {activeTab === 'all' && (
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-none text-xs">
          {(['major', 'minor', 'dom7', 'maj7', 'min7', 'sus4', 'diminished'] as ChordTypeId[]).map(
            (typeId) => (
              <button
                key={typeId}
                onClick={() => setSelectedFilterType(typeId)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedFilterType === typeId
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lang === 'my'
                  ? CHORD_DEFINITIONS[typeId].nameMy
                  : CHORD_DEFINITIONS[typeId].nameEn}
              </button>
            )
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">{t.colChord}</th>
              <th className="py-3 px-3">{t.colNotes}</th>
              {selectedInstrument === 'guitar' && (
                <th className="py-3 px-3 font-mono">{t.colGuitarVoicing}</th>
              )}
              <th className="py-3 px-3 font-mono">{t.colFormula}</th>
              <th className="py-3 px-3 text-right">{t.colAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeTab === 'natural'
              ? SEVEN_NATURAL_MAJOR_CHORDS.map((row) => {
                  const isSelected =
                    currentRoot === row.root && currentChordType === 'major';
                  const chordData = calculateChord(row.root, 'major');

                  return (
                    <tr
                      key={row.root}
                      onClick={() => onSelectChord(row.root, 'major')}
                      className={`group transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {row.root} Major
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          {row.formula}
                        </span>
                      </td>
                      {selectedInstrument === 'guitar' && (
                        <td className="py-3 px-3 font-mono text-xs text-amber-700 dark:text-amber-400 font-semibold">
                          {formatGuitarVoicing(row.root, 'major')}
                        </td>
                      )}
                      <td className="py-3 px-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {row.semitones} {t.semitonesUnit}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectChord(row.root, 'major');
                            playInstrumentChord(chordData);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{t.selectChord}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              : CHROMATIC_NOTES.map((root) => {
                  const chordData = calculateChord(root, selectedFilterType);
                  const isSelected =
                    currentRoot === root && currentChordType === selectedFilterType;

                  return (
                    <tr
                      key={root}
                      onClick={() => onSelectChord(root, selectedFilterType)}
                      className={`group transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {root} {CHORD_DEFINITIONS[selectedFilterType as ChordTypeId]?.symbol || 'Maj'}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          {chordData.notes.map((n) => n.noteName).join(' – ')}
                        </span>
                      </td>
                      {selectedInstrument === 'guitar' && (
                        <td className="py-3 px-3 font-mono text-xs text-amber-700 dark:text-amber-400 font-semibold">
                          {formatGuitarVoicing(root, selectedFilterType)}
                        </td>
                      )}
                      <td className="py-3 px-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {chordData.chordType.stepIntervals.join(' + ')} {t.semitonesUnit}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectChord(root, selectedFilterType);
                            playInstrumentChord(chordData);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{t.selectChord}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
