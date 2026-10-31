/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  NoteName,
  ChordTypeId,
  Language,
  DisplayMode,
  InstrumentType,
} from './types/music';
import { calculateChord } from './utils/musicTheory';
import { audioEngine } from './utils/audioEngine';
import { getT } from './utils/i18n';
import { Header } from './components/Header';
import { ChordSelectorPanel } from './components/ChordSelectorPanel';
import { PianoKeyboard } from './components/PianoKeyboard';
import { GuitarFretboard } from './components/GuitarFretboard';
import { BassFretboard } from './components/BassFretboard';
import { SemitoneVisualizer } from './components/SemitoneVisualizer';
import { BeginnerLessonPanel } from './components/BeginnerLessonPanel';
import { LearningPath } from './components/LearningPath';
import { PracticeStudio } from './components/PracticeStudio';
import { ScalePractice } from './components/ScalePractice';
import { ChordRecognition } from './components/ChordRecognition';
import { NoteRecognition } from './components/NoteRecognition';
import { IntervalRecognition } from './components/IntervalRecognition';
import { MelodyRecognition } from './components/MelodyRecognition';
import { RelativePitch } from './components/RelativePitch';
import { FingerExercises } from './components/FingerExercises';
import { CustomPracticeRoutines } from './components/CustomPracticeRoutines';
import { ChordReferenceTable } from './components/ChordReferenceTable';
import { PracticeMode } from './components/PracticeMode';
import { Sparkles, Music, BookOpen, Layers } from 'lucide-react';

export default function App() {
  // User preferences persisted in localStorage
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('piano_chord_lang');
      return saved === 'en' ? 'en' : 'my'; // Default to Burmese as requested
    } catch {
      return 'my';
    }
  });

  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>(() => {
    try {
      const saved = localStorage.getItem('chord_instrument');
      if (saved === 'guitar' || saved === 'bass' || saved === 'piano') return saved;
      return 'piano';
    } catch {
      return 'piano';
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('piano_chord_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true; // Default dark is elegant for piano keyboards
    }
  });

  // Music state: Defaults: Root = C, ChordType = Major
  const [selectedRoot, setSelectedRoot] = useState<NoteName>('C');
  const [selectedChordType, setSelectedChordType] = useState<ChordTypeId>('major');
  const [octaveCount, setOctaveCount] = useState<2 | 3>(2);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('names');

  // Audio volume state
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active step pointer from Semitone Visualizer
  const [activeStepPitchClass, setActiveStepPitchClass] = useState<number | null>(null);
  const [activeStepOctave, setActiveStepOctave] = useState<number | undefined>(undefined);

  const t = getT(lang);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('piano_chord_theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // safe
    }
  }, [isDarkMode]);

  // Sync language preference
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('piano_chord_lang', newLang);
    } catch {
      // safe
    }
  };

  const handleInstrumentChange = (newInst: InstrumentType) => {
    setSelectedInstrument(newInst);
    try {
      localStorage.setItem('chord_instrument', newInst);
    } catch {
      // safe
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  // Master calculated chord: single source of truth
  const calculatedChord = useMemo(() => {
    return calculateChord(selectedRoot, selectedChordType);
  }, [selectedRoot, selectedChordType]);

  const handleSelectChordFromReference = (root: NoteName, chordType: ChordTypeId) => {
    setSelectedRoot(root);
    setSelectedChordType(chordType);
    // Smooth scroll to keyboard
    const el = document.getElementById('keyboard-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Navigation Bar */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Dashboard */}
      <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
        {/* Hero Banner / Introductory Guide Banner */}
        <section className="text-center md:text-left md:flex md:items-end md:justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              <span>{t.badgeBeginner}</span>
              <span aria-hidden="true">·</span>
              <span>Piano · Guitar · Bass</span>
              <span aria-hidden="true">·</span>
              <span>Semitones</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
              {t.appTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              {lang === 'my'
                ? 'Piano၊ Guitar နှင့် Bass တူရိယာများပေါ်တွင် Note များကို လေ့လာပြီး Chord များကို နားလည်ကာ သီချင်းတီးခတ်နိုင်ရန် ရိုးရှင်းစွာ လေ့ကျင့်ပါ။'
                : 'Learn notes, understand chord patterns, and play music across Piano, Guitar, and Bass with clear interactive guides.'}
            </p>
          </div>

          {/* Quick Active Chord Pill */}
          <div className="hidden lg:flex flex-col items-end shrink-0">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'my' ? 'လက်ရှိ ရွေးချယ်မှု' : 'Current Voicing'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {calculatedChord.root}
              </span>
              <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                {lang === 'my'
                  ? calculatedChord.chordType.nameMy
                  : calculatedChord.chordType.nameEn}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              [ {calculatedChord.notes.map((n) => n.noteName).join(' – ')} ]
            </span>
          </div>
        </section>

        {/* 1. Instrument Switcher & Chord & Root Selectors */}
        <section aria-label="Chord controls">
          <ChordSelectorPanel
            selectedInstrument={selectedInstrument}
            selectedRoot={selectedRoot}
            selectedChordType={selectedChordType}
            octaveCount={octaveCount}
            displayMode={displayMode}
            lang={lang}
            onInstrumentChange={handleInstrumentChange}
            onRootChange={setSelectedRoot}
            onChordTypeChange={setSelectedChordType}
            onOctaveCountChange={setOctaveCount}
            onDisplayModeChange={setDisplayMode}
          />
        </section>

        {/* 2. Interactive Instrument View (Piano / Guitar / Bass) */}
        <section id="keyboard-section" aria-label="Interactive instrument view">
          {selectedInstrument === 'piano' && (
            <PianoKeyboard
              chord={calculatedChord}
              octaveCount={octaveCount}
              displayMode={displayMode}
              lang={lang}
              activeStepPitchClass={activeStepPitchClass}
              activeStepOctave={activeStepOctave}
            />
          )}

          {selectedInstrument === 'guitar' && (
            <GuitarFretboard
              chord={calculatedChord}
              displayMode={displayMode}
              lang={lang}
              activeStepPitchClass={activeStepPitchClass}
            />
          )}

          {selectedInstrument === 'bass' && (
            <BassFretboard
              chord={calculatedChord}
              displayMode={displayMode}
              lang={lang}
              activeStepPitchClass={activeStepPitchClass}
            />
          )}
        </section>

        {/* 3. Semitone Distance Visualizer (Shared across all 3 instruments) */}
        <section id="semitones-section" aria-label="Semitone visualizer">
          <SemitoneVisualizer
            selectedInstrument={selectedInstrument}
            chord={calculatedChord}
            lang={lang}
            onStepChange={(pitch, oct) => {
              setActiveStepPitchClass(pitch);
              setActiveStepOctave(oct);
            }}
          />
        </section>

        {/* 4. Beginner Learning Mode (Burmese & English Dynamic Lessons) */}
        <section id="lesson-section" aria-label="Chord explanation">
          <BeginnerLessonPanel chord={calculatedChord} lang={lang} />
        </section>

        {/* 5. Structured learning paths for all three instruments */}
        <section id="learning-path-section" aria-label="Structured learning paths">
          <LearningPath
            selectedInstrument={selectedInstrument}
            onInstrumentChange={handleInstrumentChange}
            lang={lang}
          />
        </section>

        {/* 6. Interactive Practice Studio: note finding and chord changes */}
        <section id="interactive-practice-section" aria-label="Interactive practice studio">
          <PracticeStudio instrument={selectedInstrument} lang={lang} />
        </section>

        {/* 7. Major and natural minor scale practice */}
        <section id="scale-practice-section" aria-label="Scale practice">
          <ScalePractice instrument={selectedInstrument} lang={lang} />
        </section>

        {/* Phase 3.1 Ear training: single-note recognition */}
        <section id="ear-training-section" aria-label="Ear training note recognition">
          <NoteRecognition instrument={selectedInstrument} lang={lang} />
        </section>

        {/* Phase 3.2 Ear training: interval recognition */}
        <section id="interval-training-section" aria-label="Interval recognition practice">
          <IntervalRecognition instrument={selectedInstrument} lang={lang} />
        </section>

        {/* Phase 3.3 Ear training: melody recognition */}
        <section id="melody-training-section" aria-label="Melody recognition practice">
          <MelodyRecognition instrument={selectedInstrument} lang={lang} />
        </section>

        {/* Phase 3.4 Ear training: relative pitch */}
        <section id="relative-pitch-training-section" aria-label="Relative pitch training">
          <RelativePitch instrument={selectedInstrument} lang={lang} />
        </section>

        {/* 8. Chord sound recognition practice */}
        <section id="chord-recognition-section" aria-label="Chord recognition practice">
          <ChordRecognition instrument={selectedInstrument} lang={lang} />
        </section>

        {/* 9. Instrument-specific finger dexterity exercises */}
        <section id="finger-exercises-section" aria-label="Finger exercises">
          <FingerExercises instrument={selectedInstrument} lang={lang} />
        </section>

        {/* 10. Custom routines combining existing practice activities */}
        <section id="custom-routines-section" aria-label="Custom practice routines">
          <CustomPracticeRoutines instrument={selectedInstrument} lang={lang} />
        </section>

        {/* 11. Chord Reference Tables (7 Natural Majors + All 12 Roots) */}
        <section id="reference-section" aria-label="Chord reference tables">
          <ChordReferenceTable
            selectedInstrument={selectedInstrument}
            currentRoot={selectedRoot}
            currentChordType={selectedChordType}
            lang={lang}
            onSelectChord={handleSelectChordFromReference}
          />
        </section>

        {/* 12. Practice & Self-Test Mode */}
        <section id="practice-section" aria-label="Practice and self-test mode">
          <PracticeMode
            selectedInstrument={selectedInstrument}
            lang={lang}
            onExploreChord={(root, type) => {
              setSelectedRoot(root);
              setSelectedChordType(type);
              const el = document.getElementById('keyboard-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
              MELOVA
            </span>
            <span>·</span>
            <span>
              {lang === 'my'
                ? 'Piano, Guitar & Bass တူရိယာ ၃ မျိုးသုံး Chord လေ့လာရေး'
                : 'Piano, Guitar & Bass Chord & Semitone Guide'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#keyboard-section"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t.navKeyboard}
            </a>
            <a
              href="#semitones-section"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t.navSemitones}
            </a>
            <a
              href="#practice-section"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t.navPractice}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

