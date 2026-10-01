import React, { useState } from 'react';
import { AssessmentResult, CALIPSDimension, ThemeVibe } from '../types';
import { CALIPS_CATEGORIES } from '../data/calipsData';
import {
  UNIVERSITY_PROGRAMS,
  filterUniversitiesByLocation,
  POPULAR_COUNTRIES,
  getCitiesForCountry
} from '../data/universitiesData';
import {
  Printer,
  RotateCcw,
  Sparkles,
  ExternalLink,
  BookOpen,
  Briefcase,
  Layers,
  Wrench,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  ShieldCheck,
  Share2,
  MapPin,
  Globe,
  Database,
  SlidersHorizontal
} from 'lucide-react';

interface ResultsViewProps {
  result: AssessmentResult;
  onRetake: () => void;
  onSaveToProfile?: () => void;
  savedCareers?: string[];
  onToggleSaveCareer?: (career: string) => void;
  savedUniversities?: string[];
  onToggleSaveUniversity?: (uniId: string) => void;
  vibe: ThemeVibe;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRetake,
  savedCareers = [],
  onToggleSaveCareer,
  savedUniversities = [],
  onToggleSaveUniversity,
  vibe
}) => {
  const [selectedDimension, setSelectedDimension] = useState<CALIPSDimension>(
    result.rankedCategories[0]
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const [filterCountry, setFilterCountry] = useState<string>(
    result.preferredCountry || 'Anywhere / Global'
  );
  const [filterCity, setFilterCity] = useState<string>(
    result.preferredCity || 'Any City / Flexible'
  );
  const [showAllUniversities, setShowAllUniversities] = useState(false);

  const isDark = vibe !== 'electric';

  const top3Codes = result.pathCode.split('') as CALIPSDimension[];
  const primaryCat = CALIPS_CATEGORIES[top3Codes[0]];
  const secondaryCat = CALIPS_CATEGORIES[top3Codes[1]];
  const tertiaryCat = CALIPS_CATEGORIES[top3Codes[2]];

  const dimensionMatchedUnis = UNIVERSITY_PROGRAMS.filter((prog) =>
    prog.calipsCodes.some((code) => top3Codes.includes(code))
  );

  const locationFilteredUnis = showAllUniversities
    ? dimensionMatchedUnis
    : filterUniversitiesByLocation(dimensionMatchedUnis, filterCountry, filterCity);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 print:py-0 print:px-0">
      {/* Educational Notice Banner */}
      <div
        className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 text-xs shadow-sm transition-all ${
          isDark
            ? 'bg-white/5 border-white/10 text-slate-300'
            : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-purple-400" />
          <p>
            <strong>Exploratory Guidance Notice:</strong> PathCode is designed as an interactive self-discovery navigator to spark curiosity and map possibilities—not a rigid or definitive prediction of your destiny.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400">
          <Database className="h-3.5 w-3.5" />
          <span>Synced with Supabase</span>
        </div>
      </div>

      {/* Hero Badge & Decoded PathCode Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <span className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-purple-300 border border-purple-500/30">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Assessment Completed · Decoded PathCode</span>
              </span>
              <span className="opacity-40">·</span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                60 Dimensions Evaluated
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-3xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight">
                {result.primaryArchetype}
              </h2>
              <p
                className={`text-base sm:text-lg leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Your top archetype reflects a dynamic combination of{' '}
                <strong className="text-purple-400">{primaryCat?.title}</strong>,{' '}
                <strong className="text-pink-400">{secondaryCat?.title}</strong>, and{' '}
                <strong className="text-cyan-400">{tertiaryCat?.title}</strong>.
              </p>
            </div>

            {/* Target Study Location Highlight */}
            {(result.preferredCity || result.preferredCountry) && (
              <div
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold border ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                }`}
              >
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>
                  Target Study Destination:{' '}
                  <strong>
                    {result.preferredCity
                      ? `${result.preferredCity}, ${result.preferredCountry}`
                      : result.preferredCountry}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Glowing 3-Letter Code Display */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-60 blur-xl group-hover:opacity-100 transition-opacity" />
              <div
                className={`relative flex flex-col items-center justify-center rounded-3xl border px-8 py-7 shadow-2xl ${
                  isDark
                    ? 'bg-[#12192D] border-white/15'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400 mb-1">
                  Your PathCode
                </span>
                <span className="font-display text-5xl sm:text-6xl font-black tracking-widest bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  {result.pathCode}
                </span>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Triad: {top3Codes.join(' · ')}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handlePrint}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print PDF</span>
              </button>
              <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
              <button
                onClick={onRetake}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Category Dimension Scores Grid */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h3 className="font-display text-xl font-extrabold tracking-tight">
              All 6 CALIPS Dimension Scores
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Ranked from highest resonance to lowest. Click any dimension to inspect details.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400">
            Top 3 form your PathCode: <strong>{result.pathCode}</strong>
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.rankedCategories.map((dim, idx) => {
            const cat = CALIPS_CATEGORIES[dim];
            const score = result.scores[dim];
            const isTop3 = idx < 3;
            const isSelected = selectedDimension === dim;

            return (
              <button
                key={dim}
                onClick={() => setSelectedDimension(dim)}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-500/15 shadow-md shadow-purple-500/20 scale-[1.01]'
                    : isDark
                    ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs text-white"
                        style={{ backgroundColor: cat.accentColor }}
                      >
                        {dim}
                      </span>
                      <span className="font-bold text-sm">{cat.archetype}</span>
                    </div>
                    {isTop3 && (
                      <span className="rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 border border-purple-500/30">
                        Rank #{idx + 1}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs mt-2 line-clamp-2 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {cat.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      Score
                    </span>
                    <span className="font-mono font-bold text-purple-400">
                      {score} / 10
                    </span>
                  </div>
                  <div
                    className={`h-2 w-full rounded-full overflow-hidden ${
                      isDark ? 'bg-white/10' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Dimension Deep Dive */}
        {selectedDimension && (
          <div
            className={`mt-6 rounded-2xl border p-6 transition-all ${
              isDark
                ? 'bg-white/[0.03] border-white/10'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm text-white"
                style={{
                  backgroundColor: CALIPS_CATEGORIES[selectedDimension].accentColor
                }}
              >
                {selectedDimension}
              </span>
              <div>
                <h4 className="font-display font-extrabold text-base">
                  {CALIPS_CATEGORIES[selectedDimension].title} ·{' '}
                  {CALIPS_CATEGORIES[selectedDimension].archetype}
                </h4>
                <p className="text-xs text-purple-400">
                  {CALIPS_CATEGORIES[selectedDimension].tagline}
                </p>
              </div>
            </div>

            <p
              className={`text-xs leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {CALIPS_CATEGORIES[selectedDimension].description}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Key Careers:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CALIPS_CATEGORIES[selectedDimension].inDemandCareers.map((c) => (
                    <span
                      key={c}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Skills to Build:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CALIPS_CATEGORIES[selectedDimension].skillsToBuild.map((s) => (
                    <span
                      key={s}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Matching University Programs in Target City/Country */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <h3 className="font-display text-xl font-extrabold tracking-tight">
                Recommended Universities in{' '}
                <span className="text-purple-400">
                  {showAllUniversities
                    ? 'All Global Locations'
                    : filterCity && filterCity !== 'Any City / Flexible'
                    ? `${filterCity}, ${filterCountry}`
                    : filterCountry !== 'Anywhere / Global'
                    ? filterCountry
                    : 'Target Destination'}
                </span>
              </h3>
            </div>
            <p
              className={`text-xs mt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Curated for your top triad ({top3Codes.join(' · ')}) and personalized location preferences.
            </p>
          </div>

          <button
            onClick={() => setShowAllUniversities(!showAllUniversities)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
              showAllUniversities
                ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                : isDark
                ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{showAllUniversities ? 'Showing All Global' : 'Show All Global Universities'}</span>
          </button>
        </div>

        {/* Change Target Location Filter */}
        <div
          className={`mt-4 flex flex-wrap items-center gap-3 p-3 rounded-2xl border text-xs ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="font-bold flex items-center gap-1 text-purple-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>Filter By Location:</span>
          </span>

          <select
            value={filterCountry}
            onChange={(e) => {
              setFilterCountry(e.target.value);
              setShowAllUniversities(false);
            }}
            className={`rounded-xl border px-3 py-1.5 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 ${
              isDark
                ? 'bg-[#141b2d] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {POPULAR_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterCity}
            onChange={(e) => {
              setFilterCity(e.target.value);
              setShowAllUniversities(false);
            }}
            className={`rounded-xl border px-3 py-1.5 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 ${
              isDark
                ? 'bg-[#141b2d] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {getCitiesForCountry(filterCountry).map((city: string) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* University Program Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {locationFilteredUnis.map((prog) => {
            const isSaved = savedUniversities.includes(prog.id);
            return (
              <div
                key={prog.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all hover:scale-[1.01] ${
                  isDark
                    ? 'bg-white/[0.03] border-white/10 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="flex items-center gap-1 font-semibold text-purple-400">
                      <MapPin className="h-3 w-3" />
                      <span>{prog.city}, {prog.country}</span>
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          prog.institutionType === 'Private'
                            ? 'bg-violet-500/15 border-violet-500/30 text-violet-400'
                            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {prog.institutionType === 'Private' ? 'Private' : 'Local'}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          isDark
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {prog.tuitionTier}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display text-base font-extrabold">
                      {prog.universityName}
                    </h4>
                    {onToggleSaveUniversity && (
                      <button
                        onClick={() => onToggleSaveUniversity(prog.id)}
                        className={`p-1 rounded-md transition-colors ${
                          isSaved ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                        }`}
                        title={isSaved ? 'Saved' : 'Bookmark university'}
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                      </button>
                    )}
                  </div>

                  <div className="text-xs font-bold text-purple-400 mt-1">
                    {prog.programTitle}
                  </div>

                  <p
                    className={`mt-2.5 text-xs leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {prog.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
                    {prog.keyMajors.map((m) => (
                      <span
                        key={m}
                        className={`rounded-md px-2 py-0.5 font-medium border ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-slate-300'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-slate-400 text-[11px]' : 'text-slate-500 text-[11px]'}>
                    CALIPS: {prog.calipsCodes.join(', ')}
                  </span>
                  <a
                    href={prog.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-bold text-purple-400 hover:text-purple-300"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {locationFilteredUnis.length === 0 && (
          <div
            className={`mt-6 rounded-2xl border border-dashed p-8 text-center ${
              isDark
                ? 'border-white/15 bg-white/5 text-slate-400'
                : 'border-slate-300 bg-slate-50 text-slate-500'
            }`}
          >
            <MapPin className="mx-auto h-8 w-8 text-purple-400 mb-2" />
            <p className="text-sm font-semibold">
              No specific universities matched "{filterCity}" in "{filterCountry}" for this triad.
            </p>
            <p className="text-xs mt-1">
              Click below to view all world-class institutions matching your {result.pathCode} profile.
            </p>
            <button
              onClick={() => setShowAllUniversities(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Show All Worldwide Matches ({dimensionMatchedUnis.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
