import React, { useState, useEffect } from 'react';
import {
  DEPARTMENTS,
  POPULAR_INTEREST_TAGS,
  CALIPS_CATEGORIES,
  getPathCodeTitle
} from '../data/calipsData';
import {
  UNIVERSITY_PROGRAMS,
  getAllUniversityPrograms,
  filterUniversitiesByLocation,
  POPULAR_COUNTRIES,
  getCitiesForCountry
} from '../data/universitiesData';
import {
  CALIPSDimension,
  DirectInterestMatch,
  UniversityProgram,
  ThemeVibe
} from '../types';
import {
  Search,
  Sparkles,
  ArrowRight,
  Briefcase,
  BookOpen,
  Layers,
  Wrench,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  MapPin,
  Globe,
  Loader2
} from 'lucide-react';

interface DirectDecodeProps {
  onSaveResult?: (match: DirectInterestMatch) => void;
  savedCareers?: string[];
  onToggleSaveCareer?: (career: string) => void;
  savedUniversities?: string[];
  onToggleSaveUniversity?: (uniId: string) => void;
  vibe: ThemeVibe;
}

export const DirectDecode: React.FC<DirectDecodeProps> = ({
  onSaveResult,
  savedCareers = [],
  onToggleSaveCareer,
  savedUniversities = [],
  onToggleSaveUniversity,
  vibe
}) => {
  const [interest, setInterest] = useState('');
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [field, setField] = useState('');
  const [preferredCountry, setPreferredCountry] = useState<string>('Ecuador');
  const [customCountry, setCustomCountry] = useState('');
  const [preferredCity, setPreferredCity] = useState<string>('Any City / Flexible');
  const [customCity, setCustomCity] = useState('');
  const [matchResult, setMatchResult] = useState<DirectInterestMatch | null>(null);
  const [liveUniversities, setLiveUniversities] = useState<UniversityProgram[]>([]);
  const [isLoadingUnis, setIsLoadingUnis] = useState<boolean>(false);

  const isDark = vibe !== 'electric';

  // Smart resolution of country and city
  const rawCountry = (customCountry.trim() || preferredCountry).trim();
  const rawCity = (customCity.trim() || preferredCity).trim();

  // If user wrote "Ecuador" in either country or city input
  const isEcuador =
    rawCountry.toLowerCase() === 'ecuador' ||
    rawCity.toLowerCase() === 'ecuador' ||
    rawCity.toLowerCase().includes('ecuador');

  const effectiveCountry = isEcuador
    ? 'Ecuador'
    : (rawCountry && rawCountry !== 'Anywhere / Global')
    ? rawCountry
    : 'Anywhere / Global';

  const effectiveCity = (rawCity.toLowerCase() === 'ecuador')
    ? (preferredCity !== 'Any City / Flexible' && !preferredCity.toLowerCase().includes('ecuador') ? preferredCity : '')
    : rawCity;

  const handleDecode = (e: React.FormEvent) => {
    e.preventDefault();

    const textCorpus = `${interest} ${department} ${field}`.toLowerCase();

    let scores: Record<CALIPSDimension, number> = {
      C: 0,
      A: 0,
      L: 0,
      I: 0,
      P: 0,
      S: 0
    };

    if (
      textCorpus.includes('organ') ||
      textCorpus.includes('data') ||
      textCorpus.includes('account') ||
      textCorpus.includes('finance') ||
      textCorpus.includes('system') ||
      textCorpus.includes('compliance')
    ) {
      scores.C += 3;
    }
    if (
      textCorpus.includes('art') ||
      textCorpus.includes('design') ||
      textCorpus.includes('game') ||
      textCorpus.includes('creative') ||
      textCorpus.includes('media') ||
      textCorpus.includes('music') ||
      textCorpus.includes('content') ||
      textCorpus.includes('ux')
    ) {
      scores.A += 3;
    }
    if (
      textCorpus.includes('lead') ||
      textCorpus.includes('business') ||
      textCorpus.includes('startup') ||
      textCorpus.includes('market') ||
      textCorpus.includes('product') ||
      textCorpus.includes('found') ||
      textCorpus.includes('entrepreneur')
    ) {
      scores.L += 3;
    }
    if (
      textCorpus.includes('comput') ||
      textCorpus.includes('science') ||
      textCorpus.includes('ai') ||
      textCorpus.includes('analyst') ||
      textCorpus.includes('research') ||
      textCorpus.includes('investigat') ||
      textCorpus.includes('biotech') ||
      textCorpus.includes('math')
    ) {
      scores.I += 3;
    }
    if (
      textCorpus.includes('build') ||
      textCorpus.includes('machin') ||
      textCorpus.includes('engine') ||
      textCorpus.includes('tool') ||
      textCorpus.includes('robot') ||
      textCorpus.includes('practic') ||
      textCorpus.includes('hardware') ||
      textCorpus.includes('solar')
    ) {
      scores.P += 3;
    }
    if (
      textCorpus.includes('help') ||
      textCorpus.includes('teach') ||
      textCorpus.includes('social') ||
      textCorpus.includes('health') ||
      textCorpus.includes('nurs') ||
      textCorpus.includes('people') ||
      textCorpus.includes('counsel') ||
      textCorpus.includes('mental')
    ) {
      scores.S += 3;
    }

    if (department.includes('Computer Science')) {
      scores.I += 2;
      scores.P += 1;
    } else if (department.includes('Business')) {
      scores.L += 2;
      scores.C += 1;
    } else if (department.includes('Art')) {
      scores.A += 3;
      scores.P += 1;
    } else if (department.includes('Health')) {
      scores.S += 2;
      scores.I += 1;
    } else if (department.includes('Engineering')) {
      scores.P += 2;
      scores.I += 2;
    } else if (department.includes('Social')) {
      scores.S += 3;
      scores.L += 1;
    }

    const sortedDimensions = (Object.keys(scores) as CALIPSDimension[]).sort(
      (a, b) => scores[b] - scores[a]
    );

    const primary = sortedDimensions[0];
    const secondary = sortedDimensions[1];
    const tertiary = sortedDimensions[2];
    const computedCode = `${primary}${secondary}${tertiary}`;

    const catInfoPrimary = CALIPS_CATEGORIES[primary];
    const catInfoSecondary = CALIPS_CATEGORIES[secondary];

    const recommendedCareers = Array.from(
      new Set([
        ...catInfoPrimary.inDemandCareers.slice(0, 4),
        ...catInfoSecondary.inDemandCareers.slice(0, 3)
      ])
    );

    const recommendedMajors = Array.from(
      new Set([
        ...catInfoPrimary.relatedMajors.slice(0, 4),
        ...catInfoSecondary.relatedMajors.slice(0, 3)
      ])
    );

    const clusters = Array.from(
      new Set([
        ...catInfoPrimary.careerClusters.slice(0, 3),
        ...catInfoSecondary.careerClusters.slice(0, 2)
      ])
    );

    const skillsToBuild = Array.from(
      new Set([
        ...catInfoPrimary.skillsToBuild.slice(0, 4),
        ...catInfoSecondary.skillsToBuild.slice(0, 3)
      ])
    );

    const result: DirectInterestMatch = {
      interest: interest || 'General Interest',
      department,
      field: field || 'Undecided Field',
      computedPathCode: computedCode,
      primaryCategory: primary,
      secondaryCategory: secondary,
      recommendedCareers,
      recommendedMajors,
      skillsToBuild,
      clusters
    };

    setMatchResult(result);
    if (onSaveResult) {
      onSaveResult(result);
    }
  };

  const finalCity = effectiveCity;

  // Live university fetching tailored to student's exact country, city, and interest field
  useEffect(() => {
    if (!matchResult) return;

    let isCancelled = false;
    const fetchDirectUnis = async () => {
      setIsLoadingUnis(true);
      try {
        const res = await fetch('/api/universities/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            country: effectiveCountry !== 'Anywhere / Global' ? effectiveCountry : undefined,
            city: finalCity && finalCity !== 'Any City / Flexible' && !finalCity.includes('Capital / Metro') ? finalCity : undefined,
            major: matchResult.field || matchResult.interest,
            dimension: matchResult.primaryCategory
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.universities && data.universities.length > 0) {
            setLiveUniversities(data.universities);
          }
        }
      } catch (err) {
        console.warn('DirectDecode live search notice:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingUnis(false);
        }
      }
    };

    fetchDirectUnis();
    return () => {
      isCancelled = true;
    };
  }, [matchResult, effectiveCountry, finalCity]);

  // Compute matching universities strictly adhering to student's target country & city
  const allAvailablePrograms = getAllUniversityPrograms();
  const staticMatching = matchResult
    ? allAvailablePrograms.filter((p) =>
        p.calipsCodes.includes(matchResult.primaryCategory)
      )
    : [];

  const staticLocationMatches = filterUniversitiesByLocation(
    staticMatching,
    effectiveCountry,
    finalCity
  );

  // Combine static repository and live search results (preventing duplicates)
  const combinedUniversities = (() => {
    const map = new Map<string, UniversityProgram>();
    // Prioritize live-fetched universities which are dynamically tailored to the major and country
    liveUniversities.forEach((u) => map.set(u.universityName.toLowerCase().trim(), u));
    staticLocationMatches.forEach((u) => {
      const key = u.universityName.toLowerCase().trim();
      if (!map.has(key)) map.set(key, u);
    });
    return Array.from(map.values());
  })();

  // Enforce strict country boundaries: if student selected or wrote Ecuador, ONLY show Ecuador universities!
  const displayedUniversities = (() => {
    if (effectiveCountry && effectiveCountry !== 'Anywhere / Global') {
      const inCountry = combinedUniversities.filter(
        (u) => u.country.toLowerCase() === effectiveCountry.toLowerCase()
      );
      if (inCountry.length > 0) {
        if (finalCity && finalCity !== 'Any City / Flexible' && !finalCity.includes('Capital / Metro')) {
          const inCity = inCountry.filter(
            (u) =>
              u.city.toLowerCase().includes(finalCity.toLowerCase()) ||
              finalCity.toLowerCase().includes(u.city.toLowerCase())
          );
          if (inCity.length > 0) {
            const cityIds = new Set(inCity.map((c) => c.id));
            return [...inCity, ...inCountry.filter((u) => !cityIds.has(u.id))];
          }
        }
        return inCountry;
      }
      return []; // Strictly never fall back to another country when Ecuador is requested!
    }

    if (combinedUniversities.length > 0) return combinedUniversities;
    return staticMatching;
  })();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Exploratory Guidance Notice */}
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-xs shadow-sm transition-all ${
          isDark
            ? 'bg-white/5 border-white/10 text-slate-300'
            : 'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-purple-400" />
        <p>
          <strong>Fast-Track Guidance:</strong> Ideal for students with clear subject passions who want instant matching to degrees, careers, and universities in their target city.
        </p>
      </div>

      {/* Main Input Form */}
      <div
        className={`rounded-3xl border p-5 sm:p-8 md:p-10 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 sm:pb-5">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/25 shrink-0">
            <Search className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-400">
              Option 02 · Fast-Track Matching
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold tracking-tight">
              I Know My Interest
            </h2>
          </div>
        </div>

        <form onSubmit={handleDecode} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              1. What topics or passions excite you most?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Artificial Intelligence, Game Art, Fintech, Neuroscience, Robotics..."
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
              }`}
            />

            {/* Popular quick tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {POPULAR_INTEREST_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setInterest(tag)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-medium border transition-all ${
                    interest === tag
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-xs'
                      : isDark
                      ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                2. Academic Stream / Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  isDark
                    ? 'bg-[#141b2d] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                }`}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                3. Intended Degree / Program (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. BS Software Engineering, BBA Marketing, Pre-Med..."
                value={field}
                onChange={(e) => setField(e.target.value)}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Preferred Study Destination (Country & City) */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>4. Where are you looking for universities?</span>
              </div>
              <span className={`self-start sm:self-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                effectiveCountry === 'Ecuador'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-cyan-50 text-cyan-800 border-cyan-200'
              }`}>
                Active: {effectiveCountry} {effectiveCity && effectiveCity !== 'Any City / Flexible' ? `(${effectiveCity})` : ''}
              </span>
            </div>

            {/* Quick Country Destination Chips */}
            <div>
              <span className={`block text-[11px] font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Quick Select Destination:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Ecuador',
                  'Pakistan',
                  'United States',
                  'United Kingdom',
                  'Canada',
                  'Germany',
                  'Australia',
                  'United Arab Emirates',
                  'Saudi Arabia',
                  'Japan',
                  'Spain',
                  'Anywhere / Global'
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setPreferredCountry(c);
                      setCustomCountry('');
                      const cities = getCitiesForCountry(c);
                      setPreferredCity(cities[0] || 'Any City / Flexible');
                      setCustomCity('');
                    }}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all border ${
                      effectiveCountry === c
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c === 'Ecuador' ? '🇪🇨 Ecuador' : c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Target Country (Type or Select)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Type country name (e.g. Ecuador, Germany)..."
                    value={customCountry}
                    onChange={(e) => {
                      setCustomCountry(e.target.value);
                      if (e.target.value.trim()) {
                        const matched = POPULAR_COUNTRIES.find(
                          (c) => c.toLowerCase() === e.target.value.trim().toLowerCase()
                        );
                        if (matched) {
                          setPreferredCountry(matched);
                        }
                      }
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <select
                    value={preferredCountry}
                    onChange={(e) => {
                      setPreferredCountry(e.target.value);
                      setCustomCountry('');
                      const cities = getCitiesForCountry(e.target.value);
                      setPreferredCity(cities[0] || 'Any City / Flexible');
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDark
                        ? 'bg-[#141b2d] border-white/10 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    {POPULAR_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Target City (Type or Select)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Type city (e.g. Quito, Guayaquil, Cuenca)..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <select
                    value={preferredCity}
                    onChange={(e) => {
                      setPreferredCity(e.target.value);
                      setCustomCity('');
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDark
                        ? 'bg-[#141b2d] border-white/10 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    {getCitiesForCountry(effectiveCountry).map((city: string) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 px-4 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:opacity-95 active:scale-98 transition-all min-h-[48px]"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Decode Interest & Find Programs</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </form>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Decoded PathCode Card */}
          <div
            className={`rounded-3xl border p-5 sm:p-8 shadow-xl transition-all ${
              isDark
                ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Computed PathCode Triad
                </span>
                <div className="font-display text-4xl sm:text-5xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mt-1">
                  {matchResult.computedPathCode}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold border ${
                    isDark
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                  }`}
                >
                  Primary: {CALIPS_CATEGORIES[matchResult.primaryCategory].title} (
                  {CALIPS_CATEGORIES[matchResult.primaryCategory].archetype})
                </span>
              </div>
            </div>

            <p
              className={`mt-4 text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Based on your passion in <strong>{matchResult.department}</strong>, your focus anchors predominantly in{' '}
              <strong className="text-cyan-400">
                {CALIPS_CATEGORIES[matchResult.primaryCategory].title}
              </strong>{' '}
              with secondary synergy in{' '}
              <strong className="text-purple-400">
                {CALIPS_CATEGORIES[matchResult.secondaryCategory].title}
              </strong>.
            </p>
          </div>

          {/* 4 Pillars Grid (Careers, Majors, Clusters, Skills) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. In-Demand Careers */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                <Briefcase className="h-4 w-4" />
                <span>In-Demand Careers for this Profile</span>
              </div>
              <ul className="space-y-2 text-sm">
                {matchResult.recommendedCareers.map((c) => {
                  const isSaved = savedCareers.includes(c);
                  return (
                    <li
                      key={c}
                      className={`flex items-center justify-between rounded-xl p-2.5 border transition-all ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="font-semibold">{c}</span>
                      {onToggleSaveCareer && (
                        <button
                          onClick={() => onToggleSaveCareer(c)}
                          className={`p-1 rounded-md transition-colors ${
                            isSaved ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                          }`}
                          title={isSaved ? 'Saved' : 'Save career to profile'}
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 2. Recommended Degree Majors */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400 mb-3">
                <BookOpen className="h-4 w-4" />
                <span>Related Majors & Academic Degrees</span>
              </div>
              <ul className="space-y-2 text-sm">
                {matchResult.recommendedMajors.map((m) => (
                  <li
                    key={m}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-pink-400 font-bold">▸</span>
                    <span className="font-medium">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Career Clusters */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                <Layers className="h-4 w-4" />
                <span>Career Clusters</span>
              </div>
              <ul className="space-y-2 text-sm">
                {matchResult.clusters.map((cl) => (
                  <li
                    key={cl}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-amber-400 font-bold">✦</span>
                    <span className="font-medium">{cl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Skills to Build Now */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                <Wrench className="h-4 w-4" />
                <span>High-Impact Skills to Build</span>
              </div>
              <ul className="space-y-2 text-sm">
                {matchResult.skillsToBuild.map((sk) => (
                  <li
                    key={sk}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{sk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Location-Tailored Recommended Universities */}
          <div
            className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-all ${
              isDark
                ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  <GraduationCap className="h-4 w-4" />
                  <span>Matching Higher-Ed Institutions</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold mt-1">
                  University Degree Programs{' '}
                  <span className="text-cyan-400">
                    {finalCity && finalCity !== 'Any City / Flexible'
                      ? `in ${finalCity}, ${effectiveCountry}`
                      : effectiveCountry !== 'Anywhere / Global'
                      ? `in ${effectiveCountry}`
                      : 'Worldwide'}
                  </span>
                </h3>
              </div>
            </div>

            {isLoadingUnis && (
              <div className="flex items-center justify-center gap-3 py-12 text-xs font-semibold text-cyan-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  Querying global academic registries for accredited universities in{' '}
                  {effectiveCountry !== 'Anywhere / Global' ? effectiveCountry : 'target region'}...
                </span>
              </div>
            )}

            {!isLoadingUnis && displayedUniversities.length === 0 && (
              <div
                className={`mt-6 rounded-2xl border p-8 text-center space-y-3 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <GraduationCap className="h-8 w-8 mx-auto text-cyan-400 opacity-60" />
                <h4 className="font-display font-bold text-base">
                  No universities currently found in{' '}
                  {finalCity && finalCity !== 'Any City / Flexible' ? `${finalCity}, ` : ''}
                  {effectiveCountry !== 'Anywhere / Global' ? effectiveCountry : 'this region'} matching this specific field
                </h4>
                <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  We respect your target destination and do not substitute other regions. You can explore all universities in {effectiveCountry} in the Universities tab.
                </p>
              </div>
            )}

            {!isLoadingUnis && displayedUniversities.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedUniversities.slice(0, 8).map((prog) => {
                  const isSaved = savedUniversities.includes(prog.id);
                  return (
                    <div
                      key={prog.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all hover:scale-[1.01] ${
                        isDark
                          ? 'bg-white/[0.03] border-white/10 hover:border-cyan-500/40'
                          : 'bg-slate-50 border-slate-200 hover:border-cyan-300 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="flex items-center gap-1 font-semibold text-cyan-400">
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
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : 'bg-cyan-50 text-cyan-700'
                              }`}
                            >
                              {prog.tuitionTier}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-base font-bold">
                            {prog.universityName}
                          </h4>
                          {onToggleSaveUniversity && (
                            <button
                              onClick={() => onToggleSaveUniversity(prog.id)}
                              className={`p-1 rounded transition-colors ${
                                isSaved ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                              }`}
                              title={isSaved ? 'Saved' : 'Bookmark university'}
                            >
                              <Bookmark className="h-4 w-4 fill-current" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-purple-400 mt-0.5">
                          {prog.programTitle}
                        </div>
                        <p
                          className={`mt-2 text-xs leading-relaxed ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {prog.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className={isDark ? 'text-slate-400 text-[11px]' : 'text-slate-500 text-[11px]'}>
                          Dimensions: {prog.calipsCodes.join(', ')}
                        </span>
                        <a
                          href={prog.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300"
                        >
                          <span>Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
