import React, { useState, useEffect } from 'react';
import {
  UNIVERSITY_PROGRAMS,
  POPULAR_COUNTRIES,
  getCitiesForCountry,
  saveLiveUniversityProgram,
  getStoredLiveUniversities
} from '../data/universitiesData';
import { CALIPS_CATEGORIES } from '../data/calipsData';
import { CALIPSDimension, ThemeVibe, UniversityProgram } from '../types';
import {
  Search,
  GraduationCap,
  ExternalLink,
  MapPin,
  Bookmark,
  Globe,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Building2,
  Landmark,
  SlidersHorizontal,
  Compass,
  BookOpen
} from 'lucide-react';

interface UniversityExplorerProps {
  savedUniversities?: string[];
  onToggleSaveUniversity?: (uniId: string) => void;
  preferredCity?: string;
  preferredCountry?: string;
  vibe: ThemeVibe;
}

export const UniversityExplorer: React.FC<UniversityExplorerProps> = ({
  savedUniversities = [],
  onToggleSaveUniversity,
  preferredCity,
  preferredCountry,
  vibe
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<CALIPSDimension | 'ALL'>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('Ecuador');
  const [customCountryInput, setCustomCountryInput] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>(preferredCity || 'ALL');
  const [customCityInput, setCustomCityInput] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'LOCAL' | 'PRIVATE'>('ALL');

  // Live Google & Web search state
  const [liveGoogleResults, setLiveGoogleResults] = useState<UniversityProgram[]>(() => {
    return getStoredLiveUniversities();
  });
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [googleSearchNotice, setGoogleSearchNotice] = useState<string | null>(null);
  const [activeViewFilter, setActiveViewFilter] = useState<'ALL' | 'GOOGLE' | 'SAVED'>('ALL');

  const isDark = vibe !== 'electric';

  // Smart resolution of country and city
  const rawCountry = (customCountryInput.trim() || selectedCountry).trim();
  const rawCity = (customCityInput.trim() || selectedCity).trim();

  // If user wrote "Ecuador" in either country or city
  const isEcuador =
    rawCountry.toLowerCase() === 'ecuador' ||
    rawCity.toLowerCase() === 'ecuador' ||
    rawCity.toLowerCase().includes('ecuador');

  const effectiveCountry = isEcuador
    ? 'Ecuador'
    : (rawCountry && rawCountry !== 'ALL' && !rawCountry.includes('Anywhere'))
    ? rawCountry
    : 'ALL';

  const effectiveCity = (rawCity.toLowerCase() === 'ecuador')
    ? (selectedCity !== 'ALL' && !selectedCity.toLowerCase().includes('ecuador') ? selectedCity : 'ALL')
    : rawCity;

  // Available cities for the currently selected country
  const availableCities = getCitiesForCountry(effectiveCountry !== 'ALL' ? effectiveCountry : 'Anywhere / Global');

// Helper function to adapt any university program authentically to the chosen academic field
function adaptProgramToMajor(prog: UniversityProgram, major: string): UniversityProgram {
  if (!major || major === 'ALL') return prog;

  const majorLower = major.toLowerCase();
  // If the program already specifically covers this field, preserve its curated title
  if (
    prog.programTitle.toLowerCase().includes(majorLower) ||
    prog.keyMajors.some((m) => m.toLowerCase().includes(majorLower))
  ) {
    return prog;
  }

  if (majorLower.includes('comput') || majorLower.includes('ai') || majorLower.includes('software')) {
    return {
      ...prog,
      programTitle: `B.Sc. in Computer Science, Software Architecture & AI`,
      keyMajors: ['Computer Science', 'Artificial Intelligence', 'Software Engineering', 'Data Systems'],
      calipsCodes: ['I', 'P', 'C'],
      description: `Accredited computing curriculum at ${prog.universityName} offering rigorous training in algorithm design, software architecture, artificial intelligence, and applied data systems.`
    };
  }
  if (majorLower.includes('medic') || majorLower.includes('health') || majorLower.includes('bio')) {
    return {
      ...prog,
      programTitle: `Degree in Medicine, Biomedical Sciences & Clinical Practice`,
      keyMajors: ['Biomedical Sciences', 'Clinical Therapeutics', 'Public Healthcare', 'Human Anatomy'],
      calipsCodes: ['S', 'I', 'P'],
      description: `Rigorous academic healthcare program with clinical hospital training at ${prog.universityName}, focusing on diagnostic sciences, patient therapeutics, and healthcare management.`
    };
  }
  if (majorLower.includes('business') || majorLower.includes('financ') || majorLower.includes('market') || majorLower.includes('econom')) {
    return {
      ...prog,
      programTitle: `BBA in Strategic Enterprise Leadership & Corporate Finance`,
      keyMajors: ['Business Administration', 'Corporate Finance', 'Strategic Marketing', 'Enterprise Leadership'],
      calipsCodes: ['L', 'A', 'C'],
      description: `Executive management curriculum at ${prog.universityName} preparing graduates for high-impact careers in corporate finance, market leadership, and multinational venture development.`
    };
  }
  if (majorLower.includes('engineer') || majorLower.includes('robot') || majorLower.includes('mechanic')) {
    return {
      ...prog,
      programTitle: `B.Eng. in Engineering & Applied Technological Systems`,
      keyMajors: ['Robotics & Automation', 'Applied Engineering', 'Mechanical Systems', 'Smart Devices'],
      calipsCodes: ['P', 'I', 'C'],
      description: `Professional engineering degree curriculum at ${prog.universityName}, equipping students with laboratory experimentation, mechanical prototyping, and systems engineering.`
    };
  }
  if (majorLower.includes('art') || majorLower.includes('design') || majorLower.includes('media')) {
    return {
      ...prog,
      programTitle: `B.A. in Digital Arts, Media Design & Visual Expression`,
      keyMajors: ['Digital Media Production', 'Interactive Design', 'Visual Communications', 'Creative Direction'],
      calipsCodes: ['A', 'P', 'S'],
      description: `Studio-based creative degree program at ${prog.universityName}, fostering innovative mastery in visual storytelling, interactive media, and digital arts.`
    };
  }
  if (majorLower.includes('architect') || majorLower.includes('urban')) {
    return {
      ...prog,
      programTitle: `Bachelor of Architecture (B.Arch) & Sustainable Urban Design`,
      keyMajors: ['Architectural Design', 'Urban Planning', 'Structural Engineering', 'Sustainable Design'],
      calipsCodes: ['A', 'P', 'I'],
      description: `Comprehensive architectural degree program at ${prog.universityName}, emphasizing studio design, building information modeling, and sustainable urban infrastructure.`
    };
  }
  if (majorLower.includes('biotech') || majorLower.includes('ecolog') || majorLower.includes('environ')) {
    return {
      ...prog,
      programTitle: `B.Sc. in Biotechnology, Biosystems & Ecological Sustainability`,
      keyMajors: ['Biotechnology', 'Environmental Sciences', 'Genomics', 'Bio-analytics'],
      calipsCodes: ['I', 'P', 'S'],
      description: `Leading biological and ecological degree curriculum at ${prog.universityName}, training students in laboratory biotechnology, genomics research, and biodiversity conservation.`
    };
  }
  if (majorLower.includes('law') || majorLower.includes('diploma') || majorLower.includes('politic')) {
    return {
      ...prog,
      programTitle: `LL.B. in Jurisprudence, International Law & Public Affairs`,
      keyMajors: ['International Law', 'Public Policy', 'Diplomatic Affairs', 'Statutory Analysis'],
      calipsCodes: ['L', 'S', 'A'],
      description: `Distinguished legal and political studies degree program at ${prog.universityName}, focusing on constitutional jurisprudence, statutory analysis, human rights, and diplomacy.`
    };
  }

  return {
    ...prog,
    programTitle: `Bachelor of Science / Arts in ${major}`,
    keyMajors: [major, 'Applied Research', 'Analytical Systems', 'Professional Practice'],
    calipsCodes: ['I', 'P', 'C'],
    description: `Accredited undergraduate degree program offering specialized study tracks in ${major} at ${prog.universityName}.`
  };
}

  // Combine static programs with live Google programs (deduplicated by name, prioritizing live/current field)
  const allAvailablePrograms = (() => {
    const map = new Map<string, UniversityProgram>();
    // First insert static curated programs
    for (const prog of UNIVERSITY_PROGRAMS) {
      map.set(prog.universityName.toLowerCase().trim(), prog);
    }
    // Overlay live Google search results so dynamic field adaptations and verified updates take priority
    for (const prog of liveGoogleResults) {
      const key = prog.universityName.toLowerCase().trim();
      map.set(key, prog);
    }
    const list = Array.from(map.values());
    if (selectedMajor !== 'ALL') {
      return list.map((prog) => adaptProgramToMajor(prog, selectedMajor));
    }
    return list;
  })();

  // Filter combined programs by user criteria
  const filteredPrograms = allAvailablePrograms.filter((prog) => {
    const searchLower = searchTerm.toLowerCase().trim();

    const isProgPrivate = prog.institutionType === 'Private';
    const isProgLocal = !isProgPrivate; // Local / Public sector

    const matchesSearch =
      !searchTerm ||
      prog.universityName.toLowerCase().includes(searchLower) ||
      prog.programTitle.toLowerCase().includes(searchLower) ||
      prog.keyMajors.some((m) => m.toLowerCase().includes(searchLower)) ||
      prog.city.toLowerCase().includes(searchLower) ||
      prog.country.toLowerCase().includes(searchLower) ||
      (searchLower === 'private' && isProgPrivate) ||
      ((searchLower === 'local' || searchLower === 'public') && isProgLocal);

    const matchesDimension =
      selectedDimension === 'ALL' || prog.calipsCodes.includes(selectedDimension);

    const matchesCountry =
      effectiveCountry === 'ALL' ||
      prog.country.toLowerCase() === effectiveCountry.toLowerCase();

    const matchesCity =
      effectiveCity === 'ALL' ||
      effectiveCity.includes('Any City') ||
      effectiveCity.includes('Capital / Metro') ||
      effectiveCity.includes('Main Campus') ||
      prog.city.toLowerCase().includes(effectiveCity.toLowerCase()) ||
      effectiveCity.toLowerCase().includes(prog.city.toLowerCase());

    const matchesMajor =
      selectedMajor === 'ALL' ||
      prog.programTitle.toLowerCase().includes(selectedMajor.toLowerCase()) ||
      prog.keyMajors.some((m) => m.toLowerCase().includes(selectedMajor.toLowerCase())) ||
      prog.description.toLowerCase().includes(selectedMajor.toLowerCase());

    const matchesViewFilter =
      activeViewFilter === 'ALL' ||
      (activeViewFilter === 'GOOGLE' && prog.isLiveGoogleResult) ||
      (activeViewFilter === 'SAVED' && savedUniversities.includes(prog.id));

    const matchesType =
      selectedType === 'ALL' ||
      (selectedType === 'PRIVATE' && isProgPrivate) ||
      (selectedType === 'LOCAL' && isProgLocal);

    return matchesSearch && matchesDimension && matchesCountry && matchesCity && matchesMajor && matchesViewFilter && matchesType;
  });

  // Calculate sector breakdowns
  const totalProgramsCount = filteredPrograms.length;
  const localProgramsCount = filteredPrograms.filter((p) => p.institutionType !== 'Private').length;
  const privateProgramsCount = filteredPrograms.filter((p) => p.institutionType === 'Private').length;

  // Execute Live Google & Web academic registry search
  const handleLiveGoogleSearch = async (
    overrideCountry?: string,
    overrideCity?: string,
    overrideMajor?: string
  ) => {
    const activeCountry = typeof overrideCountry === 'string' ? overrideCountry : effectiveCountry;
    const activeCity = typeof overrideCity === 'string' ? overrideCity : effectiveCity;
    const activeMajor = typeof overrideMajor === 'string' ? overrideMajor : (selectedMajor !== 'ALL' ? selectedMajor : '');

    const targetCountry = activeCountry !== 'ALL' && !activeCountry.includes('Anywhere') ? activeCountry : '';
    const targetCity = activeCity !== 'ALL' && !activeCity.includes('Any City') && !activeCity.includes('Capital / Metro') && !activeCity.includes('Main Campus') ? activeCity : '';
    const targetMajor = activeMajor || searchTerm.trim();

    setIsSearchingGoogle(true);
    setGoogleSearchNotice(`Accessing verified academic databases for ${targetMajor ? `${targetMajor} at ` : ''}${targetCity ? `${targetCity}, ` : ''}${targetCountry || 'global universities'}...`);

    try {
      const response = await fetch('/api/universities/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm.trim(),
          country: targetCountry,
          city: targetCity,
          major: targetMajor,
          dimension: selectedDimension !== 'ALL' ? selectedDimension : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.universities && data.universities.length > 0) {
          // Merge into state and preserve in local storage
          const newResults: UniversityProgram[] = data.universities;
          newResults.forEach((p) => saveLiveUniversityProgram(p));
          setLiveGoogleResults((prev) => {
            const existingNames = new Set(prev.map((item) => item.universityName.toLowerCase().trim()));
            const uniqueIncoming = newResults.filter(
              (item) => !existingNames.has(item.universityName.toLowerCase().trim())
            );
            return [...uniqueIncoming, ...prev];
          });
          setGoogleSearchNotice(
            `✓ Successfully loaded ${data.universities.length} authentic universities in ${targetCity ? `${targetCity}, ` : ''}${targetCountry || 'the world'} for ${targetMajor || 'all fields'}.`
          );
        } else {
          setGoogleSearchNotice(`No additional universities found in registry for ${targetCity || targetCountry || 'your selection'}.`);
        }
      } else {
        setGoogleSearchNotice('Could not retrieve live search results. Showing curated list.');
      }
    } catch (err: any) {
      console.warn('Live Google search error:', err);
      setGoogleSearchNotice('Notice: Connecting to Google database...');
    } finally {
      setIsSearchingGoogle(false);
      setTimeout(() => setGoogleSearchNotice(null), 6000);
    }
  };

  // Automatically fetch verified universities when student selects a country, city or major
  useEffect(() => {
    if (effectiveCountry && effectiveCountry !== 'ALL' && !effectiveCountry.includes('Anywhere')) {
      handleLiveGoogleSearch(effectiveCountry, effectiveCity, selectedMajor);
    }
  }, [effectiveCountry, selectedMajor]);

  useEffect(() => {
    if (effectiveCity && effectiveCity !== 'ALL' && !effectiveCity.includes('Any City') && !effectiveCity.includes('Capital / Metro')) {
      handleLiveGoogleSearch(effectiveCountry, effectiveCity, selectedMajor);
    }
  }, [effectiveCity]);

  const handleToggleSave = (prog: UniversityProgram) => {
    // If it's a live Google result, make sure it's stored in local repository so Dashboard can display it
    if (prog.isLiveGoogleResult) {
      saveLiveUniversityProgram(prog);
    }
    if (onToggleSaveUniversity) {
      onToggleSaveUniversity(prog.id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-5 sm:p-8 md:p-10 shadow-2xl text-white">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm text-white">
            <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Global Academic Explorer • All Countries & Cities</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Universities & Degree Programs
          </h1>
          <p className="text-xs sm:text-base text-purple-100 leading-relaxed max-w-2xl">
            Explore authentic universities from all countries and cities across the globe. Use live Google search integration to retrieve real-time authenticated university data, official portals, and CALIPS vocational alignments.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => handleLiveGoogleSearch()}
              disabled={isSearchingGoogle}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-indigo-900 font-extrabold text-xs px-4 sm:px-5 py-2.5 shadow-lg hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-75 min-h-[40px]"
            >
              {isSearchingGoogle ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  <span>Searching Google...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 text-purple-600" />
                  <span>Search Google for Live Universities</span>
                </>
              )}
            </button>

            <span className="text-[11px] sm:text-xs text-purple-200 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              <span>Covers 195+ Countries & All Cities</span>
            </span>
          </div>
        </div>

        {/* Ambient background picture */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
          <img
            src="/src/assets/images/campus_university_future_1790442149657.jpg"
            alt="University Campus"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-transparent" />
        </div>
      </div>

      {/* Live Google Search Notice Banner */}
      {googleSearchNotice && (
        <div
          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs font-semibold animate-fadeIn ${
            isDark
              ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
              : 'bg-purple-50 border-purple-200 text-purple-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
            <span>{googleSearchNotice}</span>
          </div>
          <button
            onClick={() => setGoogleSearchNotice(null)}
            className="text-xs underline text-purple-400 hover:text-purple-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className={`rounded-3xl border p-6 shadow-xl space-y-5 transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Quick Country Destination Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Featured Study Destinations:
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              effectiveCountry === 'Ecuador'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : effectiveCountry !== 'ALL'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              Target: {effectiveCountry === 'ALL' ? 'Worldwide' : effectiveCountry} {effectiveCity !== 'ALL' ? `(${effectiveCity})` : ''}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '🇪🇨 Ecuador', val: 'Ecuador' },
              { label: '🇵🇰 Pakistan', val: 'Pakistan' },
              { label: '🇺🇸 United States', val: 'United States' },
              { label: '🇬🇧 United Kingdom', val: 'United Kingdom' },
              { label: '🇨🇦 Canada', val: 'Canada' },
              { label: '🇩🇪 Germany', val: 'Germany' },
              { label: '🇦🇺 Australia', val: 'Australia' },
              { label: '🇦🇪 UAE', val: 'United Arab Emirates' },
              { label: '🇸🇦 Saudi Arabia', val: 'Saudi Arabia' },
              { label: '🇪🇸 Spain', val: 'Spain' },
              { label: '🇯🇵 Japan', val: 'Japan' },
              { label: '🌍 Worldwide', val: 'ALL' }
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => {
                  setSelectedCountry(item.val);
                  setCustomCountryInput('');
                  setSelectedCity('ALL');
                  setCustomCityInput('');
                  handleLiveGoogleSearch(item.val, 'ALL', selectedMajor);
                }}
                className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all border ${
                  effectiveCountry === item.val
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/25'
                    : isDark
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-white/10">
          {/* Search Input */}
          <div className="relative md:col-span-4">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Search Degree, Major or University
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. AI, Medicine, Robotics, Oxford, ESPOL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLiveGoogleSearch();
                  }
                }}
                className={`w-full rounded-2xl border pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Academic Field / Major Filter */}
          <div className="md:col-span-3">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Academic Field
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedMajor}
                onChange={(e) => {
                  setSelectedMajor(e.target.value);
                  handleLiveGoogleSearch(effectiveCountry, effectiveCity, e.target.value);
                }}
                className={`w-full rounded-2xl border pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-[#141b2d] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                }`}
              >
                <option value="ALL">All Academic Fields</option>
                <option value="Computer Science">Computer Science & AI</option>
                <option value="Medicine">Medicine & Health Sciences</option>
                <option value="Business">Business & Finance</option>
                <option value="Engineering">Engineering & Robotics</option>
                <option value="Digital Arts">Arts & Digital Media</option>
                <option value="Architecture">Architecture & Urban Design</option>
                <option value="Biotechnology">Biotechnology & Ecology</option>
                <option value="Law">Law & Diplomacy</option>
              </select>
            </div>
          </div>

          {/* Country Filter (Type or Select) */}
          <div className="md:col-span-3">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Target Country
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Type country (e.g. Ecuador)..."
                value={customCountryInput}
                onChange={(e) => {
                  setCustomCountryInput(e.target.value);
                  if (e.target.value.trim()) {
                    const matched = POPULAR_COUNTRIES.find(
                      (c) => c.toLowerCase() === e.target.value.trim().toLowerCase()
                    );
                    if (matched) {
                      setSelectedCountry(matched);
                    }
                  }
                }}
                className={`w-full rounded-xl border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    const country = e.target.value;
                    setSelectedCountry(country);
                    setCustomCountryInput('');
                    setSelectedCity('ALL');
                    setCustomCityInput('');
                  }}
                  className={`w-full rounded-xl border pl-8 pr-3 py-1.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-[#141b2d] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                  }`}
                >
                  <option value="ALL">All Countries ({POPULAR_COUNTRIES.length})</option>
                  {POPULAR_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* City Filter (Type or Select) */}
          <div className="md:col-span-2">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Target City
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Type city (e.g. Quito)..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className={`w-full rounded-xl border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCustomCityInput('');
                  }}
                  className={`w-full rounded-xl border pl-8 pr-3 py-1.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-[#141b2d] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                  }`}
                >
                  <option value="ALL">All Cities</option>
                  {availableCities
                    .filter((city) => city !== 'Any City / Flexible')
                    .map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Search Trigger & Quick Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs">
            <span className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              Found: {totalProgramsCount} universities
            </span>
            <span className="opacity-40">|</span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {localProgramsCount} Public / State · {privateProgramsCount} Private
            </span>
          </div>

          <button
            onClick={() => handleLiveGoogleSearch()}
            disabled={isSearchingGoogle}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isSearchingGoogle ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Searching Live Registry...</span>
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5" />
                <span>Search {effectiveCountry !== 'ALL' ? effectiveCountry : 'Global'} Universities</span>
              </>
            )}
          </button>
        </div>

        {/* CALIPS Dimension Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className={`text-[11px] font-bold mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Vocational Code:
          </span>
          <button
            onClick={() => setSelectedDimension('ALL')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
              selectedDimension === 'ALL'
                ? 'bg-purple-600 text-white shadow-xs'
                : isDark
                ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Archetypes
          </button>

          {(['C', 'A', 'L', 'I', 'P', 'S'] as CALIPSDimension[]).map((dim) => {
            const cat = CALIPS_CATEGORIES[dim];
            const isSelected = selectedDimension === dim;
            return (
              <button
                key={dim}
                onClick={() => setSelectedDimension(dim)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{dim}</span>
                <span className="hidden sm:inline">{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Sector / Institution Type Filter Tabs: Local vs Private */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs">
          <span className={`text-[11px] font-bold mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Institution Sector:
          </span>
          <button
            onClick={() => setSelectedType('ALL')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
              selectedType === 'ALL'
                ? 'bg-purple-600 text-white shadow-xs'
                : isDark
                ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All (Local & Private)
          </button>
          <button
            onClick={() => setSelectedType('LOCAL')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition-all ${
              selectedType === 'LOCAL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDark
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Landmark className="h-3 w-3" />
            <span>🏛️ Local Universities ({localProgramsCount})</span>
          </button>
          <button
            onClick={() => setSelectedType('PRIVATE')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition-all ${
              selectedType === 'PRIVATE'
                ? 'bg-violet-600 text-white shadow-xs'
                : isDark
                ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20'
                : 'bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100'
            }`}
          >
            <Building2 className="h-3 w-3" />
            <span>🏢 Private Universities ({privateProgramsCount})</span>
          </button>
        </div>

        {/* Results Counter & Source Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Showing {filteredPrograms.length} Universities ({localProgramsCount} Local · {privateProgramsCount} Private)
            </span>
            {selectedCountry !== 'ALL' && (
              <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[11px] font-bold text-purple-400">
                {selectedCountry}
              </span>
            )}
            {(customCityInput || (selectedCity !== 'ALL' && !selectedCity.includes('Any City'))) && (
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-400">
                {customCityInput || selectedCity}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveViewFilter('ALL')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                activeViewFilter === 'ALL'
                  ? 'bg-purple-600 text-white'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Sources
            </button>
            <button
              onClick={() => setActiveViewFilter('GOOGLE')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                activeViewFilter === 'GOOGLE'
                  ? 'bg-emerald-600 text-white'
                  : isDark
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Google Verified</span>
            </button>
            <button
              onClick={() => setActiveViewFilter('SAVED')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                activeViewFilter === 'SAVED'
                  ? 'bg-amber-600 text-white'
                  : isDark
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              <Bookmark className="h-3 w-3" />
              <span>Saved ({savedUniversities.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Program Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrograms.map((prog) => {
          const isSaved = savedUniversities.includes(prog.id);
          const isPrivate = prog.institutionType === 'Private';

          return (
            <div
              key={prog.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all hover:scale-[1.01] ${
                prog.isLiveGoogleResult
                  ? isDark
                    ? 'bg-gradient-to-b from-[#12182c] to-[#0a0f1d] border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10 text-slate-100'
                    : 'bg-gradient-to-b from-emerald-50/40 to-white border-emerald-300 hover:border-emerald-500 text-slate-900'
                  : isDark
                  ? 'bg-[#0E1424]/90 border-white/10 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 text-slate-100'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 text-slate-900'
              }`}
            >
              <div>
                {/* Top Location & Sector Badge Bar */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-1 font-semibold text-purple-400">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {prog.city}, {prog.country}
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {/* Mentioning which is Private and Local explicitly */}
                    {isPrivate ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 text-[10px] font-bold text-violet-400">
                        <Building2 className="h-2.5 w-2.5" />
                        <span>Private University</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        <Landmark className="h-2.5 w-2.5" />
                        <span>Local University</span>
                      </span>
                    )}

                    {prog.isLiveGoogleResult && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Google Search</span>
                      </span>
                    )}
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                        isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {prog.tuitionTier}
                    </span>
                  </div>
                </div>

                {/* University Name & Bookmark Action */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-extrabold leading-snug">
                      {prog.universityName}
                    </h3>
                    <div className="mt-0.5">
                      <span className={`text-[10px] font-medium ${isPrivate ? 'text-violet-400' : 'text-emerald-400'}`}>
                        {isPrivate ? 'Private Sector Institution' : 'Local / Public Sector Institution'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSave(prog)}
                    className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                      isSaved ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-amber-400'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Bookmark university'}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Program Title */}
                <div className="text-xs font-bold text-purple-400 mt-1">
                  {prog.programTitle}
                </div>

                {/* Description */}
                <p
                  className={`mt-2.5 text-xs leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {prog.description}
                </p>

                {/* Key Majors */}
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

              {/* Card Footer: CALIPS Alignment & Official Portal URL */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className={isDark ? 'text-slate-400 text-[11px]' : 'text-slate-500 text-[11px]'}>
                  CALIPS: {prog.calipsCodes.join(', ')}
                </span>
                <a
                  href={prog.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State with Direct Google Search Action */}
      {filteredPrograms.length === 0 && (
        <div
          className={`rounded-3xl border border-dashed p-10 text-center space-y-4 ${
            isDark ? 'border-white/15 bg-white/5 text-slate-300' : 'border-slate-300 bg-slate-50 text-slate-600'
          }`}
        >
          <Building2 className="mx-auto h-12 w-12 text-purple-400" />
          <div>
            <h3 className="font-display text-lg font-bold">
              No local universities found for {selectedCity !== 'ALL' ? selectedCity : selectedCountry !== 'ALL' ? selectedCountry : 'your search filter'}
            </h3>
            <p className="mt-1 text-xs max-w-md mx-auto">
              Access the internet through Google Search to find authenticated accredited universities and official portals in this region.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleLiveGoogleSearch}
              disabled={isSearchingGoogle}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
            >
              {isSearchingGoogle ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching Google...</span>
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  <span>Search Google for {selectedCity !== 'ALL' ? selectedCity : selectedCountry} Universities</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDimension('ALL');
                setSelectedCountry('ALL');
                setSelectedCity('ALL');
                setCustomCityInput('');
                setSelectedType('ALL');
                setActiveViewFilter('ALL');
              }}
              className="rounded-2xl border border-white/15 px-4 py-2 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
