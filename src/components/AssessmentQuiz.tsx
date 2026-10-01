import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CALIPS_QUESTIONS,
  CALIPS_CATEGORIES,
  calculateScores,
  rankCategories,
  getPathCodeTitle
} from '../data/calipsData';
import { POPULAR_COUNTRIES, getCitiesForCountry } from '../data/universitiesData';
import {
  CALIPSDimension,
  AssessmentResult,
  ThemeVibe
} from '../types';
import {
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Compass,
  MapPin,
  GraduationCap
} from 'lucide-react';

interface AssessmentQuizProps {
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
  initialPreferredCountry?: string;
  initialPreferredCity?: string;
  vibe: ThemeVibe;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  onComplete,
  onCancel,
  initialPreferredCountry = 'Pakistan',
  initialPreferredCity = 'Karachi',
  vibe
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [showLocationStep, setShowLocationStep] = useState(false);
  const [preferredCountry, setPreferredCountry] = useState(initialPreferredCountry);
  const [preferredCity, setPreferredCity] = useState(initialPreferredCity);
  const [customCity, setCustomCity] = useState('');

  const currentQuestion = CALIPS_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / CALIPS_QUESTIONS.length) * 100);

  const isDark = vibe !== 'electric';

  // Keyboard navigation for quick answers (T = True, F = False)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showLocationStep) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 't' || e.key === 'T' || e.key === '1') {
        handleAnswer(true);
      } else if (e.key === 'f' || e.key === 'F' || e.key === '2') {
        handleAnswer(false);
      } else if (e.key === 'ArrowRight' && currentIndex < CALIPS_QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showLocationStep]);

  const handleAnswer = (value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    if (currentIndex < CALIPS_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleTriggerLocationStep = () => {
    if (answeredCount < 30) {
      alert(
        `You have answered ${answeredCount} of 60 questions. Please answer at least 30 questions to get an accurate PathCode!`
      );
      return;
    }
    setShowLocationStep(true);
  };

  const handleFinishWithLocation = () => {
    const scores = calculateScores(answers);
    const ranked = rankCategories(scores);
    const top3 = ranked.slice(0, 3).join('');
    const primaryTitle = getPathCodeTitle(top3);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const finalCity = customCity.trim() || preferredCity;

    const result: AssessmentResult = {
      id: 'res-' + Date.now(),
      createdAt: new Date().toISOString(),
      scores,
      rankedCategories: ranked,
      pathCode: top3,
      primaryArchetype: primaryTitle,
      answers,
      preferredCountry,
      preferredCity: finalCity
    };

    onComplete(result);
  };

  // Quick Demo Auto-Fill (useful for testing or exploration)
  const handleQuickDemoFill = (bias: CALIPSDimension = 'I') => {
    const demoAnswers: Record<number, boolean> = {};
    CALIPS_QUESTIONS.forEach((q) => {
      if (q.category === bias) {
        demoAnswers[q.id] = Math.random() > 0.15;
      } else if (q.category === 'A' || q.category === 'L') {
        demoAnswers[q.id] = Math.random() > 0.35;
      } else {
        demoAnswers[q.id] = Math.random() > 0.55;
      }
    });
    setAnswers(demoAnswers);
  };

  const currentCatInfo = CALIPS_CATEGORIES[currentQuestion.category];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header Card */}
      <div
        className={`rounded-3xl border p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CALIPS 60-Question Assessment</span>
              <span className="opacity-40">·</span>
              <span className="font-mono opacity-70">True / False</span>
            </div>
            <h2 className="font-display mt-1 text-2xl font-extrabold tracking-tight">
              Discover Your 3-Letter PathCode
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleQuickDemoFill('I')}
              title="Quickly fill with sample responses for immediate exploration"
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                isDark
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              Demo Auto-Fill
            </button>
            <button
              onClick={onCancel}
              className={`rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isDark
                  ? 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Progress Bar & Numerical Tally */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2 font-mono">
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Question{' '}
              <strong className="font-bold text-sm tabular-nums text-purple-400">
                {currentIndex + 1}
              </strong>{' '}
              of 60
            </span>
            <span
              className={`font-semibold px-2.5 py-0.5 rounded-md border ${
                isDark
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {answeredCount} / 60 Answered ({progressPercent}%)
            </span>
          </div>
          <div
            className={`h-3 w-full overflow-hidden rounded-full p-0.5 ${
              isDark ? 'bg-white/10' : 'bg-slate-150'
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 transition-all duration-300 shadow-md shadow-purple-500/30"
              style={{ width: `${(answeredCount / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Jumpers / Segmented Progress Indicators */}
        <div className="mt-4 sm:mt-5 flex overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 py-1 scroll-smooth">
          {(['C', 'A', 'L', 'I', 'P', 'S'] as CALIPSDimension[]).map((cat) => {
            const catInfo = CALIPS_CATEGORIES[cat];
            const catQuestions = CALIPS_QUESTIONS.filter((q) => q.category === cat);
            const answeredInCat = catQuestions.filter((q) => answers[q.id] !== undefined).length;
            const isCurrent = currentQuestion.category === cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  setShowLocationStep(false);
                  const firstIdx = CALIPS_QUESTIONS.findIndex((q) => q.category === cat);
                  if (firstIdx !== -1) setCurrentIndex(firstIdx);
                }}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all min-h-[36px] ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/30'
                    : isDark
                    ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className="hidden sm:inline">{catInfo.archetype}</span>
                <span className="font-mono text-[10px] opacity-75">
                  ({answeredInCat}/10)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Question Card OR Study Location Preference Step */}
      {!showLocationStep ? (
        <div
          className={`mt-4 sm:mt-6 rounded-3xl border p-5 sm:p-8 md:p-10 shadow-2xl transition-all ${
            isDark
              ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Dimension Header Banner */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl font-display text-lg sm:text-xl font-bold text-white shadow-lg shrink-0"
                style={{ backgroundColor: currentCatInfo.accentColor }}
              >
                {currentQuestion.category}
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-purple-400">
                  Dimension {currentQuestion.category} · {currentCatInfo.title}
                </div>
                <div className="text-sm sm:text-base font-bold">
                  {currentCatInfo.archetype}
                </div>
              </div>
            </div>

            <div
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border hidden sm:block ${
                isDark
                  ? 'bg-white/5 border-white/10 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {currentCatInfo.tagline}
            </div>
          </div>

          {/* Question Statement */}
          <div className="py-6 sm:py-12 text-center">
            <span
              className={`font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                isDark
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              Question #{currentQuestion.id}
            </span>
            <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug [text-wrap:balance] break-words">
              "{currentQuestion.text}"
            </h3>
            <p
              className={`mt-3 sm:mt-4 text-xs font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Pick what resonates. Shortcuts: Press{' '}
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/15 font-mono text-[11px]">
                T
              </kbd>{' '}
              for True,{' '}
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/15 font-mono text-[11px]">
                F
              </kbd>{' '}
              for False.
            </p>
          </div>

          {/* True / False Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* True Button */}
            <button
              onClick={() => handleAnswer(true)}
              className={`group relative flex items-center justify-between rounded-2xl border-2 p-4 sm:p-5 text-left transition-all duration-200 min-h-[60px] active:scale-98 ${
                answers[currentQuestion.id] === true
                  ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/20'
                  : isDark
                  ? 'border-white/10 bg-white/5 hover:border-emerald-400 hover:bg-emerald-500/10'
                  : 'border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-colors shrink-0 ${
                    answers[currentQuestion.id] === true
                      ? 'bg-emerald-500 text-white'
                      : isDark
                      ? 'bg-white/10 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-base sm:text-lg font-extrabold">
                    True
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Yes, this sounds like me
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs opacity-60 font-semibold">[T]</span>
            </button>

            {/* False Button */}
            <button
              onClick={() => handleAnswer(false)}
              className={`group relative flex items-center justify-between rounded-2xl border-2 p-4 sm:p-5 text-left transition-all duration-200 min-h-[60px] active:scale-98 ${
                answers[currentQuestion.id] === false
                  ? 'border-rose-400 bg-rose-500/15 shadow-lg shadow-rose-500/20'
                  : isDark
                  ? 'border-white/10 bg-white/5 hover:border-rose-400 hover:bg-rose-500/10'
                  : 'border-slate-200 bg-slate-50 hover:border-rose-400 hover:bg-rose-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-colors shrink-0 ${
                    answers[currentQuestion.id] === false
                      ? 'bg-rose-500 text-white'
                      : isDark
                      ? 'bg-white/10 text-rose-300'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <X className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-base sm:text-lg font-extrabold">
                    False
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    No, not really my style
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs opacity-60 font-semibold">[F]</span>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10 pt-4 sm:pt-6">
            <div className="flex items-center justify-between sm:justify-start gap-4 order-2 sm:order-1">
              <button
                onClick={() => {
                  if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
                }}
                disabled={currentIndex === 0}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors py-2 px-3 rounded-xl border border-white/10 ${
                  currentIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                    ? 'text-slate-300 hover:text-white bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  if (currentIndex < CALIPS_QUESTIONS.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                  }
                }}
                disabled={currentIndex === CALIPS_QUESTIONS.length - 1}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors py-2 px-3 rounded-xl border border-white/10 ${
                  currentIndex === CALIPS_QUESTIONS.length - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                    ? 'text-slate-300 hover:text-white bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="order-1 sm:order-2 w-full sm:w-auto text-center sm:text-right">
              {answeredCount >= 30 ? (
                <button
                  onClick={handleTriggerLocationStep}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all active:scale-95 min-h-[44px]"
                >
                  <span>Continue to Target Destination</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <span
                  className={`text-[11px] sm:text-xs block py-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Answer at least 30 questions to proceed ({answeredCount}/60)
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Target Study Destination Step */
        <div
          className={`mt-4 sm:mt-6 rounded-3xl border p-5 sm:p-8 md:p-10 shadow-2xl animate-fadeIn transition-all ${
            isDark
              ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Step 2 · Study Destination Filter
              </span>
              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                Where are you looking for universities?
              </h3>
            </div>
          </div>

          <p
            className={`mt-4 text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Tell us in which <strong>city or country</strong> you want to study. PathCode will prioritize universities and campuses located right where you want to be!
          </p>

          <div className="mt-8 space-y-6">
            {/* Preferred Country */}
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                1. Target Country
              </label>
              <select
                value={preferredCountry}
                onChange={(e) => {
                  setPreferredCountry(e.target.value);
                  const cities = getCitiesForCountry(e.target.value);
                  setPreferredCity(cities[0] || 'Any City');
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-[#141b2d] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                }`}
              >
                {POPULAR_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred City Selection */}
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                2. Target City / Campus
              </label>

              {/* Popular City Quick-Select Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {getCitiesForCountry(preferredCountry).map((city: string) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setPreferredCity(city);
                      setCustomCity('');
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      preferredCity === city && !customCity
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                        : isDark
                        ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Custom City Input */}
              <div className="relative mt-2">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Or type custom city (e.g. Karachi, Peshawar, Manchester, Boston, Dubai)..."
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className={`w-full rounded-2xl border pl-10 pr-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <button
              onClick={() => setShowLocationStep(false)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Assessment</span>
            </button>

            <button
              onClick={handleFinishWithLocation}
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:opacity-95 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Decode My PathCode & University Matches</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
