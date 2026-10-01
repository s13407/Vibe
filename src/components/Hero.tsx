import React from 'react';
import { ThemeVibe } from '../types';
import {
  ArrowRight,
  Search,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  MapPin,
  Database
} from 'lucide-react';

interface HeroProps {
  onStartQuiz: () => void;
  onStartDirect: () => void;
  onExploreUniversities: () => void;
  vibe: ThemeVibe;
}

export const Hero: React.FC<HeroProps> = ({
  onStartQuiz,
  onStartDirect,
  vibe
}) => {
  const isDark = vibe !== 'electric';

  const auraGradient =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'from-amber-600/35 via-yellow-500/25 to-orange-600/30'
      : vibe === 'sunset'
      ? 'from-rose-600/35 via-amber-500/25 to-purple-600/30'
      : vibe === 'tokyo'
      ? 'from-violet-600/35 via-fuchsia-500/25 to-indigo-600/30'
      : 'from-indigo-600/30 via-purple-600/20 to-pink-500/25';

  const headlineGradient =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'from-amber-200 via-yellow-300 to-amber-500'
      : vibe === 'sunset'
      ? 'from-rose-400 via-amber-300 to-purple-400'
      : vibe === 'tokyo'
      ? 'from-violet-400 via-fuchsia-300 to-pink-400'
      : 'from-indigo-600 via-purple-600 to-pink-500';

  const button1Gradient =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black'
      : vibe === 'sunset'
      ? 'from-rose-500 via-amber-500 to-purple-600 text-white'
      : vibe === 'tokyo'
      ? 'from-violet-500 via-fuchsia-500 to-pink-600 text-white'
      : 'from-indigo-600 via-purple-600 to-pink-500 text-white';

  const button2Gradient =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'from-yellow-400 via-amber-500 to-orange-500 text-slate-950 font-black'
      : vibe === 'sunset'
      ? 'from-amber-500 via-rose-500 to-purple-600 text-white'
      : vibe === 'tokyo'
      ? 'from-fuchsia-500 via-pink-500 to-violet-600 text-white'
      : 'from-cyan-500 via-teal-500 to-indigo-500 text-white';

  return (
    <div className="relative overflow-hidden pt-4 sm:pt-8 pb-12 sm:pb-16 lg:pt-14 lg:pb-24">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl opacity-60">
        <div
          className={`aspect-[1155/678] w-[75rem] bg-gradient-to-tr ${auraGradient}`}
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mood-Boosting Tag */}
        <div className="mb-4 flex items-center justify-center text-xs font-bold tracking-wide">
          <span
            className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 shadow-sm transition-all text-center text-[11px] sm:text-xs ${
              vibe === 'eclipse' || vibe === 'abyss'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                : vibe === 'sunset'
                ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                : vibe === 'tokyo'
                ? 'bg-violet-950/40 border-violet-500/30 text-violet-300'
                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse text-purple-400" />
            <span>CALIPS Archetype Model</span>
            <span className="opacity-40">·</span>
            <span>Gen-Z Career Navigator</span>
            <span className="opacity-40 hidden sm:inline">·</span>
            <span className="text-emerald-400 font-semibold hidden sm:inline">Supabase PostgreSQL Live</span>
          </span>
        </div>

        {/* Primary Headline with Rich Gradient */}
        <div className="text-center">
          <h1
            className={`font-display text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight [text-wrap:balance] break-words ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Decode your interest.{' '}
            <span
              className={`bg-gradient-to-r ${headlineGradient} bg-clip-text text-transparent`}
            >
              Discover your direction.
            </span>
          </h1>

          <p
            className={`mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg leading-relaxed [text-wrap:balance] ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Confused by endless career paths, conflicting majors, and university options? PathCode decodes your strengths across 6 core dimensions, pinpointing in-demand jobs, skills to build, and top university programs in your dream city.
          </p>

          {/* Exploratory Guidance Disclaimer */}
          <div
            className={`mx-auto mt-4 sm:mt-6 inline-flex max-w-xl items-center gap-2.5 rounded-2xl border px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs shadow-sm backdrop-blur-sm text-left ${
              isDark
                ? 'bg-white/5 border-white/10 text-slate-300'
                : 'bg-indigo-50/80 border-indigo-200/80 text-indigo-950'
            }`}
          >
            <ShieldCheck
              className={`h-4 w-4 shrink-0 ${
                vibe === 'eclipse' || vibe === 'abyss'
                  ? 'text-amber-400'
                  : vibe === 'sunset'
                  ? 'text-rose-400'
                  : vibe === 'tokyo'
                  ? 'text-fuchsia-400'
                  : 'text-indigo-600'
              }`}
            />
            <span className="text-[11px] sm:text-xs">
              <strong>Note for Students:</strong> PathCode is an exploratory career guidance tool to reveal possibilities, not a rigid prediction of your destiny.
            </span>
          </div>
        </div>

        {/* The Two Main Interactive Options */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Option 1: Discover My Career (60-Question CALIPS Assessment) */}
          <div
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 sm:p-8 shadow-xl transition-all duration-300 hover:scale-[1.01] ${
              vibe === 'eclipse' || vibe === 'abyss'
                ? 'bg-[#111018]/90 border-amber-500/25 hover:border-amber-400/50 hover:shadow-amber-500/15'
                : vibe === 'sunset'
                ? 'bg-[#131024]/90 border-rose-500/20 hover:border-rose-400/50 hover:shadow-rose-500/15'
                : vibe === 'tokyo'
                ? 'bg-[#110D20]/90 border-violet-500/25 hover:border-violet-400/50 hover:shadow-violet-500/15'
                : 'bg-white border-indigo-200 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/15'
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                    vibe === 'eclipse' || vibe === 'abyss'
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                      : vibe === 'sunset'
                      ? 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                      : vibe === 'tokyo'
                      ? 'bg-violet-500/20 border-violet-500/30 text-violet-300'
                      : 'bg-indigo-100 border-indigo-200 text-indigo-800'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Option 01 · Full Assessment
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  60 True/False · ~6 Mins
                </span>
              </div>

              <h2
                className={`font-display mt-5 text-2xl font-bold sm:text-3xl ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Discover My Career
              </h2>

              <p
                className={`mt-3 text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Answer 10 intuitive questions for each of the 6 CALIPS dimensions. Calculate your top 3-letter PathCode and unlock university programs tailored to your dream city or country!
              </p>

              {/* 6 Dimension Badges */}
              <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-semibold">
                <div
                  className={`flex items-center gap-2 rounded-xl p-2 sm:p-2.5 border transition-all ${
                    isDark
                      ? 'bg-sky-950/40 border-sky-500/30 text-sky-200'
                      : 'bg-sky-50 border-sky-200 text-sky-900'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-sky-500 text-white font-bold text-[11px]">
                    C
                  </span>
                  <span className="truncate">The Organizer</span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-xl p-2 sm:p-2.5 border transition-all ${
                    isDark
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-rose-500 text-white font-bold text-[11px]">
                    A
                  </span>
                  <span className="truncate">The Creator</span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-xl p-2 sm:p-2.5 border transition-all ${
                    isDark
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white font-bold text-[11px]">
                    L
                  </span>
                  <span className="truncate">The Leader</span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-xl p-2 sm:p-2.5 border transition-all ${
                    isDark
                      ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white font-bold text-[11px]">
                    I
                  </span>
                  <span className="truncate">The Analyst</span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-xl p-2 sm:p-2.5 border transition-all ${
                    isDark
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white font-bold text-[11px]">
                    P
                  </span>
                  <span className="truncate">The Doer</span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-xl p-2 sm:p-2.5 border transition-all ${
                    isDark
                      ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
                      : 'bg-purple-50 border-purple-200 text-purple-900'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-purple-500 text-white font-bold text-[11px]">
                    S
                  </span>
                  <span className="truncate">The Helper</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/10">
              <button
                onClick={onStartQuiz}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${button1Gradient} px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 active:scale-98 transition-all min-h-[48px]`}
              >
                <span>Start 60-Question CALIPS Assessment</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* Option 2: I Know My Interest (Fast-Track) */}
          <div
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 sm:p-8 shadow-xl transition-all duration-300 hover:scale-[1.01] ${
              vibe === 'eclipse' || vibe === 'abyss'
                ? 'bg-[#111018]/90 border-yellow-500/25 hover:border-yellow-400/50 hover:shadow-yellow-500/15'
                : vibe === 'sunset'
                ? 'bg-[#131024]/90 border-amber-500/20 hover:border-amber-400/50 hover:shadow-amber-500/15'
                : vibe === 'tokyo'
                ? 'bg-[#110D20]/90 border-fuchsia-500/25 hover:border-fuchsia-400/50 hover:shadow-fuchsia-500/15'
                : 'bg-white border-sky-200 hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/15'
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                    vibe === 'eclipse' || vibe === 'abyss'
                      ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
                      : vibe === 'sunset'
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                      : vibe === 'tokyo'
                      ? 'bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-300'
                      : 'bg-sky-100 border-sky-200 text-sky-800'
                  }`}
                >
                  <Search className="h-3.5 w-3.5" />
                  Option 02 · Fast-Track Match
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Direct Entry · Instant
                </span>
              </div>

              <h2
                className={`font-display mt-4 sm:mt-5 text-2xl font-bold sm:text-3xl ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                I Know My Interest
              </h2>

              <p
                className={`mt-2 sm:mt-3 text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Already have a passion like Coding, Robotics, Game Design, Business, Graphic Design, or Medicine? Skip the quiz! Enter your field and preferred study city to see matching majors and universities right away.
              </p>

              {/* Sample Quick-Tags */}
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 text-xs">
                {[
                  'Artificial Intelligence',
                  'Biomedical Engineering',
                  'Graphic Design',
                  'Fintech & Accounting',
                  'Psychology',
                  'Software Architecture'
                ].map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-xl border px-2.5 sm:px-3 py-1 sm:py-1.5 font-medium transition-all text-[11px] sm:text-xs ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/10">
              <button
                onClick={onStartDirect}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${button2Gradient} px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 active:scale-98 transition-all min-h-[48px]`}
              >
                <span>Direct Interest Match & City Finder</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                vibe === 'eclipse' || vibe === 'abyss'
                  ? 'bg-amber-500/20 text-amber-400'
                  : vibe === 'sunset'
                  ? 'bg-rose-500/20 text-rose-400'
                  : vibe === 'tokyo'
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Target Study Location
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Filter top universities in Karachi, Lahore, Islamabad, London, Toronto, Boston, and more based on your CALIPS archetype.
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-3">
              <Database className="h-5 w-5" />
            </div>
            <h3 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Supabase PostgreSQL Live
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Your assessments, profiles, and saved careers are backed directly by your Supabase database instance.
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                vibe === 'eclipse' || vibe === 'abyss'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : vibe === 'sunset'
                  ? 'bg-amber-500/20 text-amber-400'
                  : vibe === 'tokyo'
                  ? 'bg-fuchsia-500/20 text-fuchsia-400'
                  : 'bg-pink-100 text-pink-700'
              }`}
            >
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Actionable Pathways
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Get a breakdown of salary tiers, related degree majors, career clusters, and high-impact skills to build today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
