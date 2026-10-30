import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Circle, GraduationCap, Guitar, Music2, Piano, RotateCcw, Target } from 'lucide-react';
import { Language, InstrumentType } from '../types/music';
import {
  LEARNING_LEVELS,
  LearningInstrument,
  LearningLevel,
  LearningLesson,
  getCourse,
  getLessonsForLevel,
  getNextLesson,
} from '../utils/curriculum';

interface LearningPathProps {
  selectedInstrument: InstrumentType;
  onInstrumentChange: (instrument: InstrumentType) => void;
  lang: Language;
}

type ProgressMap = Record<string, string[]>;

const STORAGE_KEY = 'melova-learning-progress-v1';

const readProgress = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [],
      ]),
    );
  } catch {
    return {};
  }
};

const instrumentNames = {
  guitar: { en: 'Guitar', my: 'Guitar' },
  bass: { en: 'Bass', my: 'Bass' },
  piano: { en: 'Piano', my: 'Piano' },
} as const;

const levelNames: Record<LearningLevel, { en: string; my: string }> = {
  beginner: { en: 'Beginner', my: 'အခြေခံ' },
  intermediate: { en: 'Intermediate', my: 'အလယ်အလတ်' },
  advanced: { en: 'Advanced', my: 'အဆင့်မြင့်' },
};

export const LearningPath: React.FC<LearningPathProps> = ({
  selectedInstrument,
  onInstrumentChange,
  lang,
}) => {
  const isMy = lang === 'my';
  const instrument = selectedInstrument as LearningInstrument;
  const course = useMemo(() => getCourse(instrument), [instrument]);
  const [level, setLevel] = useState<LearningLevel>('beginner');
  const [activeLessonId, setActiveLessonId] = useState<string>(course.lessons[0].id);
  const [progress, setProgress] = useState<ProgressMap>(readProgress);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Progress remains available for the current session when storage is unavailable.
    }
  }, [progress]);

  useEffect(() => {
    setLevel('beginner');
    setActiveLessonId(course.lessons[0].id);
    setSelectedAnswer(null);
    setAnswerChecked(false);
  }, [course]);

  const completedIds = progress[instrument] ?? [];
  const lessons = getLessonsForLevel(course, level);
  const activeLesson = course.lessons.find((item) => item.id === activeLessonId) ?? lessons[0];
  const completedCount = course.lessons.filter((item) => completedIds.includes(item.id)).length;
  const progressPercent = Math.round((completedCount / course.lessons.length) * 100);
  const nextLesson = getNextLesson(course, completedIds);

  const selectLesson = (item: LearningLesson) => {
    setActiveLessonId(item.id);
    setSelectedAnswer(null);
    setAnswerChecked(false);
  };

  const completeLesson = () => {
    if (!activeLesson || completedIds.includes(activeLesson.id)) return;
    setProgress((current) => ({
      ...current,
      [instrument]: [...(current[instrument] ?? []), activeLesson.id],
    }));
    const next = course.lessons[course.lessons.findIndex((item) => item.id === activeLesson.id) + 1];
    if (next) {
      setLevel(next.level);
      selectLesson(next);
    }
  };

  const resetProgress = () => {
    setProgress((current) => ({ ...current, [instrument]: [] }));
    setLevel('beginner');
    setActiveLessonId(course.lessons[0].id);
    setSelectedAnswer(null);
    setAnswerChecked(false);
  };

  const Icon = instrument === 'guitar' ? Guitar : instrument === 'bass' ? Music2 : Piano;

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {isMy ? 'စနစ်တကျ သင်ယူမှုလမ်းကြောင်း' : 'Structured Learning Path'}
              </div>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                {isMy ? 'သင်ခန်းစာများ' : 'Learning Courses'}
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {isMy
                  ? 'အခြေခံမှ အဆင့်မြင့်အထိ သင်ခန်းစာ၊ လက်တွေ့လေ့ကျင့်မှုနှင့် Quiz များကို အဆင့်လိုက် လေ့လာပါ။'
                  : 'Build real musical understanding through guided lessons, hands-on practice, and quick knowledge checks.'}
              </p>
            </div>
          </div>
          <div className="flex min-w-36 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/70">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">{isMy ? 'သင်တန်းတိုးတက်မှု' : 'Course progress'}</span>
                <span className="tabular-nums text-slate-900 dark:text-white">{progressPercent}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: progressPercent + '%' }} />
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {completedCount}/{course.lessons.length} {isMy ? 'ပြီးစီး' : 'lessons complete'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {(['guitar', 'bass', 'piano'] as LearningInstrument[]).map((item) => {
            const selected = instrument === item;
            const ItemIcon = item === 'guitar' ? Guitar : item === 'bass' ? Music2 : Piano;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onInstrumentChange(item as InstrumentType)}
                aria-pressed={selected}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${selected
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600'}`}
              >
                <ItemIcon className="h-4 w-4" />
                {instrumentNames[item][isMy ? 'my' : 'en']}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {isMy ? course.descriptionMy : course.descriptionEn}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.5fr)]">
        <aside className="border-b border-slate-100 p-4 dark:border-slate-800 lg:border-b-0 lg:border-r sm:p-5 dark:lg:border-r-slate-800">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{isMy ? 'အဆင့်ရွေးချယ်ရန်' : 'Choose your level'}</h3>
            <span className="text-[11px] text-slate-400">{course.lessons.length} {isMy ? 'သင်ခန်းစာ' : 'lessons'}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {LEARNING_LEVELS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setLevel(item);
                  const first = getLessonsForLevel(course, item)[0];
                  if (first) selectLesson(first);
                }}
                aria-pressed={level === item}
                className={`rounded-lg px-1 py-2 text-[11px] font-semibold transition-colors ${level === item
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
              >
                {levelNames[item][isMy ? 'my' : 'en']}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {lessons.map((item, index) => {
              const isActive = activeLesson?.id === item.id;
              const isComplete = completedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectLesson(item)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${isActive
                    ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-800 dark:bg-indigo-950/30'
                    : 'border-transparent bg-slate-50 hover:border-slate-200 dark:bg-slate-800/50 dark:hover:border-slate-700'}`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isComplete
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      : isActive
                        ? <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        : <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      {isMy ? 'သင်ခန်းစာ' : 'Lesson'} {index + 1}
                    </span>
                    <span className={`mt-0.5 block text-sm font-semibold leading-snug ${isActive ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-200'}`}>
                      {isMy ? item.titleMy : item.titleEn}
                    </span>
                    <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                      {isMy ? item.topicMy : item.topicEn}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">{isMy ? 'တိုးတက်မှုကို ဒီဖုန်းတွင် သိမ်းထားမည်' : 'Progress saved on this device'}</span>
            <button type="button" onClick={resetProgress} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400">
              <RotateCcw className="h-3 w-3" />{isMy ? 'ပြန်စ' : 'Reset'}
            </button>
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-6">
          {activeLesson && (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {levelNames[activeLesson.level][isMy ? 'my' : 'en']}
                </span>
                <span className="text-xs text-slate-400">{isMy ? activeLesson.topicMy : activeLesson.topicEn}</span>
                {completedIds.includes(activeLesson.id) && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />{isMy ? 'ပြီးစီးပြီး' : 'Completed'}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-xl font-extrabold leading-tight text-slate-900 dark:text-white">
                {isMy ? activeLesson.titleMy : activeLesson.titleEn}
              </h3>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="h-4 w-4" />{isMy ? 'သင်ခန်းစာ ရှင်းလင်းချက်' : 'Lesson explanation'}
                </div>
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                  {isMy ? activeLesson.explanationMy : activeLesson.explanationEn}
                </p>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                  <Target className="h-4 w-4 text-emerald-600" />{isMy ? 'လက်တွေ့ လေ့ကျင့်ရန်' : 'Guided practice'}
                </div>
                <ol className="space-y-2">
                  {(isMy ? activeLesson.practiceMy : activeLesson.practiceEn).map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />{isMy ? 'နားလည်မှု စစ်ဆေးရန်' : 'Quick knowledge check'}
                </div>
                <p className="mb-3 text-sm font-semibold leading-relaxed text-slate-900 dark:text-white">
                  {isMy ? activeLesson.questionMy : activeLesson.questionEn}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeLesson.options.map((option, index) => {
                    const correct = index === activeLesson.correctIndex;
                    const chosen = selectedAnswer === index;
                    const stateClass = answerChecked && correct
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                      : answerChecked && chosen
                        ? 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200'
                        : chosen
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600';
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => { setSelectedAnswer(index); setAnswerChecked(false); }}
                        disabled={answerChecked}
                        aria-pressed={chosen}
                        className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:cursor-default ${stateClass}`}
                      >
                        <span className="mr-2 text-xs opacity-60">{String.fromCharCode(65 + index)}.</span>{option}
                      </button>
                    );
                  })}
                </div>
                {answerChecked && (
                  <p className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${selectedAnswer === activeLesson.correctIndex
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
                    : 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'}`}>
                    <strong>{selectedAnswer === activeLesson.correctIndex ? (isMy ? 'မှန်ကန်ပါတယ်။ ' : 'Correct. ') : (isMy ? 'ပြန်လေ့လာပါ။ ' : 'Not quite. ')}</strong>
                    {isMy ? activeLesson.answerMy : activeLesson.answerEn}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswerChecked(true)}
                    disabled={selectedAnswer === null || answerChecked}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    {isMy ? 'အဖြေစစ်ဆေးမည်' : 'Check answer'}
                  </button>
                  <button
                    type="button"
                    onClick={completeLesson}
                    disabled={!completedIds.includes(activeLesson.id) && !answerChecked}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {completedIds.includes(activeLesson.id) ? (isMy ? 'ပြီးစီးပြီး' : 'Lesson completed') : (isMy ? 'သင်ခန်းစာ ပြီးစီးကြောင်း မှတ်သားမည်' : 'Mark lesson complete')}
                  </button>
                </div>
                {!answerChecked && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    {isMy ? 'Quiz အဖြေစစ်ပြီးမှ သင်ခန်းစာပြီးစီးကြောင်း မှတ်သားနိုင်သည်။' : 'Check your answer before marking this lesson complete.'}
                  </p>
                )}
              </div>
              {completedCount === course.lessons.length && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                  {isMy ? 'ဂုဏ်ယူပါတယ်။ ဒီသင်တန်းရှိ သင်ခန်းစာအားလုံး ပြီးစီးပါပြီ။' : 'Congratulations! You have completed this instrument course.'}
                </div>
              )}
              {nextLesson && (
                <p className="mt-4 text-xs text-slate-400">
                  {isMy ? 'နောက်ထပ် သင်ခန်းစာ' : 'Up next'}: {isMy ? nextLesson.titleMy : nextLesson.titleEn}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
