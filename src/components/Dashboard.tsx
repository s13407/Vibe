import React, { useState } from 'react';
import { StudentProfile, AssessmentResult, ThemeVibe } from '../types';
import {
  UNIVERSITY_PROGRAMS,
  POPULAR_COUNTRIES,
  getCitiesForCountry,
  getAllUniversityPrograms
} from '../data/universitiesData';
import { SUPABASE_RLS_SQL, getStoredSupabaseConfig } from '../lib/supabase';
import {
  User,
  Building,
  Mail,
  Calendar,
  Layers,
  Clock,
  Bookmark,
  Database,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ExternalLink,
  MapPin,
  Edit2,
  Activity,
  Server
} from 'lucide-react';

interface DashboardProps {
  currentUser: StudentProfile;
  assessments: AssessmentResult[];
  onSelectAssessment: (result: AssessmentResult) => void;
  onOpenSupabaseModal: () => void;
  onStartQuiz: () => void;
  onUpdateProfile?: (updated: StudentProfile) => void;
  isSupabaseConnected: boolean;
  vibe: ThemeVibe;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  assessments,
  onSelectAssessment,
  onOpenSupabaseModal,
  onStartQuiz,
  onUpdateProfile,
  isSupabaseConnected,
  vibe
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'supabase'>('history');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newCountry, setNewCountry] = useState(currentUser.preferredCountry || 'Pakistan');
  const [newCity, setNewCity] = useState(currentUser.preferredCity || 'Karachi');

  const isDark = vibe !== 'electric';
  const { supabaseUrl } = getStoredSupabaseConfig();

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_RLS_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveLocation = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...currentUser,
        preferredCountry: newCountry,
        preferredCity: newCity
      });
    }
    setIsEditingLocation(false);
  };

  const savedUnis = getAllUniversityPrograms().filter((p) =>
    currentUser.savedUniversities?.includes(p.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Student Profile Card */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 text-2xl font-bold font-display">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-0.5 text-xs font-bold">
                  Student Profile
                </span>
              </div>

              <div
                className={`mt-2 flex flex-wrap items-center gap-2.5 text-xs font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{currentUser.email}</span>
                </span>
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  <span>{currentUser.school}</span>
                </span>
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{currentUser.age} yrs</span>
                </span>
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  <span>{currentUser.department}</span>
                </span>

                {/* Target Study Location Tag */}
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-semibold border ${
                    isDark
                      ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 text-purple-400" />
                  <span>
                    Target Location: {currentUser.preferredCity || 'Karachi'},{' '}
                    {currentUser.preferredCountry || 'Pakistan'}
                  </span>
                  <button
                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                    className="ml-1 text-purple-400 hover:text-purple-300"
                    title="Change preferred study location"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSupabaseModal}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all ${
                isSupabaseConnected
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                  : isDark
                  ? 'border-white/15 bg-white/5 text-purple-300 hover:bg-white/10'
                  : 'border-slate-200 bg-slate-50 text-indigo-700 hover:bg-slate-100'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>
                {isSupabaseConnected ? 'Supabase Sync: Active' : 'Configure Supabase DB'}
              </span>
            </button>

            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-95 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Take New Assessment</span>
            </button>
          </div>
        </div>

        {/* Location Edit Drawer */}
        {isEditingLocation && (
          <div
            className={`mt-5 rounded-2xl border p-4 animate-fadeIn ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
              Update Preferred University Destination
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-[11px] font-medium mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Country:
                </label>
                <select
                  value={newCountry}
                  onChange={(e) => {
                    setNewCountry(e.target.value);
                    const cities = getCitiesForCountry(e.target.value);
                    setNewCity(cities[0] || 'Any City');
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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

              <div>
                <label
                  className={`block text-[11px] font-medium mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  City:
                </label>
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-[#141b2d] border-white/10 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {getCitiesForCountry(newCountry).map((city: string) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditingLocation(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="rounded-xl bg-purple-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-700"
              >
                Save Destination
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div
        className={`flex rounded-2xl p-1.5 border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
            activeTab === 'history'
              ? isDark
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-indigo-700 shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Assessment History ({assessments.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
            activeTab === 'saved'
              ? isDark
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-indigo-700 shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Saved Careers & Unis ({currentUser.savedCareers?.length || 0} /{' '}
          {savedUnis.length})
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'supabase'
              ? isDark
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-indigo-700 shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>Supabase Database & RLS</span>
        </button>
      </div>

      {/* Tab 1: Assessment History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {assessments.length === 0 ? (
            <div
              className={`rounded-3xl border border-dashed p-12 text-center ${
                isDark ? 'border-white/15 text-slate-400' : 'border-slate-300 text-slate-500'
              }`}
            >
              <Clock className="mx-auto h-12 w-12 text-purple-400 mb-3" />
              <h3 className="font-display text-lg font-bold">
                No CALIPS Assessments Completed Yet
              </h3>
              <p className="mt-1 text-xs max-w-sm mx-auto">
                Take the 60-question True/False assessment to discover your 3-letter PathCode and synchronize with your database.
              </p>
              <button
                onClick={onStartQuiz}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-purple-500/25"
              >
                <span>Start CALIPS Assessment Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onSelectAssessment(item)}
                  className={`group cursor-pointer rounded-2xl border p-5 transition-all hover:scale-[1.01] ${
                    isDark
                      ? 'bg-[#0E1424]/90 border-white/10 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-black tracking-widest text-purple-400">
                      {item.pathCode}
                    </span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-extrabold mt-2">
                    {item.primaryArchetype}
                  </h3>

                  {(item.preferredCity || item.preferredCountry) && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-purple-400 font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        Target:{' '}
                        {item.preferredCity
                          ? `${item.preferredCity}, ${item.preferredCountry}`
                          : item.preferredCountry}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-white/10">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      Ranked: {item.rankedCategories.join(' > ')}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                      <span>View Full Report</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Careers & Universities */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Saved Careers */}
          <div
            className={`rounded-3xl border p-6 ${
              isDark ? 'bg-[#0E1424]/90 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-display text-lg font-bold mb-4">
              <Bookmark className="h-5 w-5 text-purple-400" />
              <span>Saved Career Paths ({currentUser.savedCareers?.length || 0})</span>
            </div>

            {(!currentUser.savedCareers || currentUser.savedCareers.length === 0) ? (
              <p
                className={`text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                No careers bookmarked yet. Explore the CALIPS results or Career Library to bookmark roles.
              </p>
            ) : (
              <ul className="space-y-2">
                {currentUser.savedCareers.map((c) => (
                  <li
                    key={c}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-purple-400 font-bold text-[11px]">Saved</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Saved Universities */}
          <div
            className={`rounded-3xl border p-6 ${
              isDark ? 'bg-[#0E1424]/90 border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-display text-lg font-bold mb-4">
              <Bookmark className="h-5 w-5 text-cyan-400" />
              <span>Saved University Programs ({savedUnis.length})</span>
            </div>

            {savedUnis.length === 0 ? (
              <p
                className={`text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                No university programs bookmarked yet. Use the University Explorer to bookmark top schools.
              </p>
            ) : (
              <ul className="space-y-3">
                {savedUnis.map((u) => (
                  <li
                    key={u.id}
                    className={`p-3.5 rounded-xl border text-xs ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{u.universityName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            u.institutionType === 'Private'
                              ? 'bg-violet-500/15 border-violet-500/30 text-violet-400'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {u.institutionType === 'Private' ? 'Private' : 'Local'}
                        </span>
                      </div>
                      <span className="text-cyan-400 font-mono">{u.city}, {u.country}</span>
                    </div>
                    <div className="text-purple-400 font-semibold mt-1">
                      {u.programTitle}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Supabase Database & RLS Monitor */}
      {activeTab === 'supabase' && (
        <div
          className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${
            isDark ? 'bg-[#0E1424]/90 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold tracking-tight">
                  Supabase Database Management
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Live synchronization status, PostgreSQL tables, and Row Level Security.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSupabaseModal}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              <Server className="h-3.5 w-3.5" />
              <span>Configure Connection</span>
            </button>
          </div>

          {/* Database stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className={`rounded-2xl border p-4 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Connection Status
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-sm text-emerald-400">
                  {isSupabaseConnected ? 'Live Supabase Cloud' : 'Supabase Client Ready'}
                </span>
              </div>
              {supabaseUrl && (
                <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                  {supabaseUrl}
                </div>
              )}
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Synced Assessments
              </span>
              <div className="mt-1 font-display text-2xl font-black text-purple-400">
                {assessments.length} Records
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Table: <code>public.assessments</code>
              </div>
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Student UID
              </span>
              <div className="mt-1 font-mono text-xs font-bold text-cyan-400 truncate">
                {currentUser.id}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Table: <code>public.profiles</code>
              </div>
            </div>
          </div>

          {/* SQL Editor Copy Box */}
          <div
            className={`rounded-2xl border p-5 ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-slate-900 text-slate-100 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Supabase SQL Editor Setup (Schema & RLS)
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-48 p-2">
              {SUPABASE_RLS_SQL}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
