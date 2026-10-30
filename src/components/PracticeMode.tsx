import React, { useState, useEffect } from 'react';
import {
  NoteName,
  ChordTypeId,
  Language,
  InstrumentType,
} from '../types/music';
import {
  CHROMATIC_NOTES,
  CHORD_DEFINITIONS,
  calculateChord,
  toBurmeseNumber,
} from '../utils/musicTheory';
import { getT } from '../utils/i18n';
import { audioEngine } from '../utils/audioEngine';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

interface Question {
  id: string;
  questionMy: string;
  questionEn: string;
  options: string[];
  correctIndex: number;
  explanationMy: string;
  explanationEn: string;
  chordToPlay?: { root: NoteName; chordType: ChordTypeId };
}

interface PracticeModeProps {
  selectedInstrument?: InstrumentType;
  lang: Language;
  onExploreChord?: (root: NoteName, chordType: ChordTypeId) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  selectedInstrument = 'piano',
  lang,
  onExploreChord,
}) => {
  const t = getT(lang);

  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Generate a random dynamic question from the music theory engine
  const generateNewQuestion = (): Question => {
    const questionTypes = [
      'notes_in_chord',
      'semitones_between_notes',
      'chord_from_notes',
      'interval_formula',
    ];
    const chosenType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    const randomRoot = CHROMATIC_NOTES[Math.floor(Math.random() * CHROMATIC_NOTES.length)];
    const chordTypeIds: ChordTypeId[] = ['major', 'minor', 'dom7', 'maj7', 'min7', 'sus4', 'diminished'];
    const chosenChordType = chordTypeIds[Math.floor(Math.random() * chordTypeIds.length)];
    const chord = calculateChord(randomRoot, chosenChordType);

    if (chosenType === 'notes_in_chord') {
      const correctNotesStr = chord.notes.map((n) => n.noteName).join(' – ');

      // Generate 3 believable distractors
      const distractors = new Set<string>();
      while (distractors.size < 3) {
        const otherType = chordTypeIds[Math.floor(Math.random() * chordTypeIds.length)];
        const otherRoot = CHROMATIC_NOTES[Math.floor(Math.random() * CHROMATIC_NOTES.length)];
        const otherChord = calculateChord(otherRoot, otherType);
        const otherNotesStr = otherChord.notes.map((n) => n.noteName).join(' – ');
        if (otherNotesStr !== correctNotesStr) {
          distractors.add(otherNotesStr);
        }
      }

      const options = [correctNotesStr, ...Array.from(distractors)];
      // Shuffle options
      const shuffled = options
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      const correctIndex = shuffled.indexOf(correctNotesStr);

      return {
        id: Math.random().toString(),
        questionMy: `${chord.fullNameMy} တွင် မည်သည့် Note များ ပါဝင်သနည်း?`,
        questionEn: `Which notes belong to ${chord.fullNameEn}?`,
        options: shuffled,
        correctIndex,
        explanationMy: `${chord.fullNameMy} ၏ Note များမှာ ${correctNotesStr} ဖြစ်ပါသည်။ ဖော်မြူလာမှာ ${chord.chordType.stepIntervals.join(' + ')} ဆီမီးတုန်း ဖြစ်သည်။`,
        explanationEn: `${chord.fullNameEn} consists of ${correctNotesStr}. Interval pattern: ${chord.chordType.stepIntervals.join(' + ')} semitones.`,
        chordToPlay: { root: randomRoot, chordType: chosenChordType },
      };
    } else if (chosenType === 'semitones_between_notes') {
      // Pick an interval in the chord
      const interval = chord.stepIntervals[0];
      const correctDistance = interval.semitones;
      const correctStr = `${correctDistance} ${t.semitonesUnit}`;

      const options = [
        `${correctDistance} ${t.semitonesUnit}`,
        `${correctDistance + 1} ${t.semitonesUnit}`,
        `${Math.max(1, correctDistance - 1)} ${t.semitonesUnit}`,
        `${correctDistance + 2} ${t.semitonesUnit}`,
      ];
      const uniqueOptions = Array.from(new Set(options));
      const shuffled = uniqueOptions
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      const correctIndex = shuffled.indexOf(correctStr);

      return {
        id: Math.random().toString(),
        questionMy: `${chord.fullNameMy} တွင် ${interval.fromNote} နှင့် ${interval.toNote} အကြား မည်မျှ ဆီမီးတုန်း (Semitones) ကွာဝေးသနည်း?`,
        questionEn: `In ${chord.fullNameEn}, how many semitones are between ${interval.fromNote} and ${interval.toNote}?`,
        options: shuffled,
        correctIndex,
        explanationMy: `${interval.fromNote} မှ စတင်၍ ${toBurmeseNumber(correctDistance)} ကီး ရွှေ့ပါက ${interval.toNote} သို့ ရောက်ရှိပါသည်။ (လမ်းကြောင်း: ${interval.chromaticPath.join(' → ')})`,
        explanationEn: `Starting at ${interval.fromNote} (Step 0) and moving ${correctDistance} semitones lands on ${interval.toNote}. Path: ${interval.chromaticPath.join(' → ')}.`,
        chordToPlay: { root: randomRoot, chordType: chosenChordType },
      };
    } else if (chosenType === 'chord_from_notes') {
      const correctChordName = `${chord.root} ${chord.chordType.nameEn}`;
      const correctChordNameMy = `${chord.root} ${chord.chordType.nameMy}`;
      const notesList = chord.notes.map((n) => n.noteName).join(', ');

      const distractors = new Set<string>();
      while (distractors.size < 3) {
        const otherRoot = CHROMATIC_NOTES[Math.floor(Math.random() * CHROMATIC_NOTES.length)];
        const otherType = chordTypeIds[Math.floor(Math.random() * chordTypeIds.length)];
        const name = `${otherRoot} ${CHORD_DEFINITIONS[otherType].nameEn}`;
        if (name !== correctChordName) {
          distractors.add(name);
        }
      }

      const options = [correctChordName, ...Array.from(distractors)];
      const shuffled = options
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      const correctIndex = shuffled.indexOf(correctChordName);

      return {
        id: Math.random().toString(),
        questionMy: `Note များဖြစ်သော [ ${notesList} ] သည် မည်သည့် Chord ဖြစ်သနည်း?`,
        questionEn: `Which chord is formed by the notes: [ ${notesList} ]?`,
        options: shuffled,
        correctIndex,
        explanationMy: `Note များဖြစ်သော ${notesList} သည် ${correctChordNameMy} ဖြစ်ပါသည်။ အခြေခံ Root Note မှာ ${chord.root} ဖြစ်သည်။`,
        explanationEn: `The notes ${notesList} form ${correctChordName} with root ${chord.root}.`,
        chordToPlay: { root: randomRoot, chordType: chosenChordType },
      };
    } else {
      // interval_formula
      const correctFormula = `${chord.chordType.stepIntervals.join(' + ')} ${t.semitonesUnit}`;
      const wrongFormulas = ['4 + 3', '3 + 4', '3 + 3', '4 + 4', '2 + 5', '5 + 2']
        .map((f) => `${f} ${t.semitonesUnit}`)
        .filter((f) => f !== correctFormula)
        .slice(0, 3);

      const options = [correctFormula, ...wrongFormulas];
      const shuffled = options
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      const correctIndex = shuffled.indexOf(correctFormula);

      return {
        id: Math.random().toString(),
        questionMy: `${chord.chordType.nameMy} ၏ အဆင့်ဆင့် ဆီမီးတုန်း ဖော်မြူလာမှာ အဘယ်နည်း?`,
        questionEn: `What is the step interval formula for a ${chord.chordType.nameEn}?`,
        options: shuffled,
        correctIndex,
        explanationMy: `${chord.chordType.nameMy} သည် ${correctFormula} ဖြစ်ပါသည်။`,
        explanationEn: `${chord.chordType.nameEn} uses consecutive semitones of ${correctFormula}.`,
        chordToPlay: { root: randomRoot, chordType: chosenChordType },
      };
    }
  };

  useEffect(() => {
    setCurrentQuestion(generateNewQuestion());
  }, []);

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !currentQuestion || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setTotalAnswered((prev) => prev + 1);

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      // Play cheerful chord sound
      if (currentQuestion.chordToPlay) {
        const c = calculateChord(
          currentQuestion.chordToPlay.root,
          currentQuestion.chordToPlay.chordType
        );
        const oct = selectedInstrument === 'bass' ? 2 : selectedInstrument === 'guitar' ? 3 : 4;
        audioEngine.playChord(
          c.notes.map((n) => ({ pitchClass: n.pitchClass, octave: oct })),
          1.4,
          selectedInstrument
        );
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentQuestion(generateNewQuestion());
  };

  const handleReset = () => {
    setScore(0);
    setTotalAnswered(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentQuestion(generateNewQuestion());
  };

  const accuracyPct =
    totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      {/* Header and Live Scoreboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.practiceTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.practiceSubtitle}
          </p>
        </div>

        {/* Live Score Metrics (using anti-slop clean typography and tabular-nums) */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div>
            <span className="text-slate-400 mr-1.5">{t.score}:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {score} / {totalAnswered}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-400 mr-1">{t.streak}:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {streak}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <div>
            <span className="text-slate-400 mr-1.5">{t.accuracy}:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {accuracyPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="my-5 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
          {t.question}
        </div>
        <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {lang === 'my' ? currentQuestion.questionMy : currentQuestion.questionEn}
        </div>
      </div>

      {/* Selectable Options */}
      <div className="space-y-2.5 my-4">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = currentQuestion.correctIndex === idx;

          let btnClass =
            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700';

          if (isAnswerSubmitted) {
            if (isCorrect) {
              btnClass =
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/20';
            } else if (isSelected) {
              btnClass =
                'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
            } else {
              btnClass = 'opacity-60 border-slate-200 dark:border-slate-800';
            }
          } else if (isSelected) {
            btnClass =
              'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswerSubmitted}
              className={`w-full text-left p-3.5 rounded-xl border font-medium text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-mono">{option}</span>
              </div>

              {isAnswerSubmitted && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {isAnswerSubmitted && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation */}
      {isAnswerSubmitted && (
        <div
          className={`p-4 rounded-xl border my-4 transition-all ${
            selectedOption === currentQuestion.correctIndex
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            {selectedOption === currentQuestion.correctIndex ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.correct}</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>{t.incorrect}</span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
            <span className="font-semibold text-slate-900 dark:text-white">
              {t.explanation}:{' '}
            </span>
            {lang === 'my'
              ? currentQuestion.explanationMy
              : currentQuestion.explanationEn}
          </p>

          {/* Quick link to explore this chord in main piano */}
          {currentQuestion.chordToPlay && onExploreChord && (
            <button
              onClick={() =>
                onExploreChord(
                  currentQuestion.chordToPlay!.root,
                  currentQuestion.chordToPlay!.chordType
                )
              }
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <span>{lang === 'my' ? 'ဤ Chord ကို ကီးဘုတ်တွင် သွားရောက်လေ့လာမည်' : 'View this chord on the keyboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.restartQuiz}</span>
        </button>

        {!isAnswerSubmitted ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white transition-all cursor-pointer ${
              selectedOption !== null
                ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/20'
                : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            {t.checkAnswer}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>{t.nextQuestion}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
