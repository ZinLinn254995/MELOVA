import React from 'react';
import { CalculatedChord, Language } from '../types/music';
import { getT } from '../utils/i18n';
import { toBurmeseNumber } from '../utils/musicTheory';
import { BookOpen, Sparkles, Check, HelpCircle, Layers } from 'lucide-react';

interface BeginnerLessonPanelProps {
  chord: CalculatedChord;
  lang: Language;
  onSelectChordFormula?: (chordTypeId: string) => void;
}

export const BeginnerLessonPanel: React.FC<BeginnerLessonPanelProps> = ({
  chord,
  lang,
}) => {
  const t = getT(lang);

  const isMajor = chord.chordType.id === 'major';
  const isMinor = chord.chordType.id === 'minor';

  return (
    <div className="w-full max-w-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      {/* Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.lessonTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'my'
              ? 'အစပြုသူများ နားလည်လွယ်စေရန် ရှင်းလင်းချက်'
              : 'Plain-language explanation of this chord'}
          </p>
        </div>
      </div>

      {/* Primary Lesson Paragraph: Exact prompt specification */}
      <div className="my-5 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
        <div className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {lang === 'my' ? 'Chord ဖွဲ့စည်းပုံ ရှင်းလင်းချက်' : 'Chord Construction Lesson'}
          </span>
        </div>

        <blockquote className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
          "{lang === 'my' ? chord.explanationMy : chord.explanationEn}"
        </blockquote>

        {/* Note Breakdown Pills */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.chordNotesCount}:
          </span>
          {chord.notes.map((n, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold ${
                n.role === 'root'
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <span>{n.noteName}</span>
              <span className="text-[10px] font-normal opacity-80">
                ({lang === 'my' ? n.roleNameMy : n.roleNameEn})
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Formula & Rule Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Current Formula Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            {t.formulaTitle}
          </div>
          <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {chord.chordType.id.toUpperCase()} = {chord.chordType.stepIntervals.join(' + ')}{' '}
            <span className="text-xs font-normal text-slate-500">{t.semitonesUnit}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            {lang === 'my' ? chord.chordType.descriptionMy : chord.chordType.descriptionEn}
          </p>
        </div>

        {/* Golden Rule of Chords Card */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            {lang === 'my' ? 'မှတ်သားရန် အခြေခံ စည်းမျဉ်း' : 'Core Triad Formulas'}
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {lang === 'my' ? 'မေဂျာ (Major) ဖော်မြူလာ:' : 'Major Triad:'}
              </span>
              <span className="font-mono font-bold text-amber-900 dark:text-amber-300">
                4 + 3 {t.semitonesUnit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {lang === 'my' ? 'မိုင်နာ (Minor) ဖော်မြူလာ:' : 'Minor Triad:'}
              </span>
              <span className="font-mono font-bold text-amber-900 dark:text-amber-300">
                3 + 4 {t.semitonesUnit}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-400/90 mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
            {t.tipFormula}
          </p>
        </div>
      </div>

      {/* Piano Keyboard Physical Insights (E-F & B-C Note) */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
            {t.beginnerTipTitle}
          </span>
          <p>{t.tipEfBc}</p>
        </div>
      </div>
    </div>
  );
};
