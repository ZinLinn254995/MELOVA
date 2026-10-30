import React from 'react';
import { Language } from '../types/music';
import { getT } from '../utils/i18n';
import { Sun, Moon, Piano, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
}) => {
  const t = getT(lang);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base sm:text-lg tracking-tight whitespace-nowrap shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <span className="text-sm sm:text-base">🎵</span>
          </div>
          <span>Chord Finder</span>
        </a>

        {/* Zone 2: Navigation links on wide desktop (xl: >= 1280px) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#keyboard-section"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navKeyboard}
          </a>
          <a
            href="#semitones-section"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navSemitones}
          </a>
          <a
            href="#lesson-section"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navLesson}
          </a>
          <a
            href="#reference-section"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navReference}
          </a>
          <a
            href="#practice-section"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navPractice}
          </a>
        </nav>

        {/* Zone 3: Action cluster (Volume, Language & Theme) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Audio volume control: Compact icon on mobile, slider on tablet/desktop */}
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={onToggleMute}
              className="p-0.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title={isMuted ? t.unmute : t.mute}
              aria-label={isMuted ? t.unmute : t.mute}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="hidden md:block w-14 sm:w-16 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              title={`${t.volume}: ${Math.round(volume * 100)}%`}
            />
          </div>

          {/* Language Selector Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('my')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md transition-colors cursor-pointer ${
                lang === 'my'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              မြန်မာ
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md transition-colors cursor-pointer ${
                lang === 'en'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
