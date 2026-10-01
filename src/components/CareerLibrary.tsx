import React, { useState } from 'react';
import { CALIPS_CATEGORIES } from '../data/calipsData';
import { CALIPSDimension, ThemeVibe } from '../types';
import {
  Briefcase,
  BookOpen,
  Layers,
  Wrench,
  Sparkles,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

interface CareerLibraryProps {
  savedCareers?: string[];
  onToggleSaveCareer?: (career: string) => void;
  vibe: ThemeVibe;
}

export const CareerLibrary: React.FC<CareerLibraryProps> = ({
  savedCareers = [],
  onToggleSaveCareer,
  vibe
}) => {
  const [activeTab, setActiveTab] = useState<CALIPSDimension>('C');

  const category = CALIPS_CATEGORIES[activeTab];
  const isDark = vibe !== 'electric';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
          <span className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-purple-300 border border-purple-500/30">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>CALIPS Taxonomy · Reference Matrix</span>
          </span>
        </div>
        <h1
          className={`font-display mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Career Clusters & Taxonomy Library
        </h1>
        <p
          className={`mt-2 text-sm max-w-2xl leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Explore all six foundational dimensions of the CALIPS framework. Unpack current job market demand, degree pathways, foundational skills, and industrial clusters.
        </p>
      </div>

      {/* Dimension Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {(['C', 'A', 'L', 'I', 'P', 'S'] as CALIPSDimension[]).map((dim) => {
          const cat = CALIPS_CATEGORIES[dim];
          const isSelected = activeTab === dim;
          return (
            <button
              key={dim}
              onClick={() => setActiveTab(dim)}
              className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/20 scale-[1.02]'
                  : isDark
                  ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm text-white"
                  style={{ backgroundColor: cat.accentColor }}
                >
                  {dim}
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    isSelected ? 'text-purple-300' : 'text-slate-400'
                  }`}
                >
                  {cat.code}
                </span>
              </div>
              <span
                className={`font-display mt-2 text-sm font-extrabold truncate w-full ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {cat.archetype}
              </span>
              <span className="text-[11px] text-purple-400 font-medium truncate w-full">
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Showcase */}
      <div
        className={`rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0E1424]/90 border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
              style={{ backgroundColor: category.accentColor }}
            >
              {category.code}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Dimension {category.code} Archetype
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
                {category.title} · {category.archetype}
              </h2>
              <p className="text-xs text-purple-400 font-medium mt-0.5">
                "{category.tagline}"
              </p>
            </div>
          </div>
        </div>

        <p
          className={`mt-6 text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {category.description}
        </p>

        {/* 4 Pillars Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. In Demand Careers */}
          <div
            className={`rounded-2xl border p-5 ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
              <Briefcase className="h-4 w-4" />
              <span>In-Demand Career Roles</span>
            </div>
            <ul className="space-y-2 text-sm">
              {category.inDemandCareers.map((c) => {
                const isSaved = savedCareers.includes(c);
                return (
                  <li
                    key={c}
                    className={`flex items-center justify-between rounded-xl p-3 border text-xs font-semibold ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{c}</span>
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

          {/* 2. Degree Majors */}
          <div
            className={`rounded-2xl border p-5 ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400 mb-3">
              <BookOpen className="h-4 w-4" />
              <span>Related Academic Majors</span>
            </div>
            <ul className="space-y-2 text-sm">
              {category.relatedMajors.map((m) => (
                <li
                  key={m}
                  className={`flex items-start gap-2 p-3 rounded-xl border text-xs font-medium ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-pink-400 font-bold">▸</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Career Clusters */}
          <div
            className={`rounded-2xl border p-5 ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              <Layers className="h-4 w-4" />
              <span>Industrial Clusters</span>
            </div>
            <ul className="space-y-2 text-sm">
              {category.careerClusters.map((cl) => (
                <li
                  key={cl}
                  className={`flex items-start gap-2 p-3 rounded-xl border text-xs font-medium ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-amber-400 font-bold">✦</span>
                  <span>{cl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Skills to Build */}
          <div
            className={`rounded-2xl border p-5 ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
              <Wrench className="h-4 w-4" />
              <span>High-Impact Skills to Build</span>
            </div>
            <ul className="space-y-2 text-sm">
              {category.skillsToBuild.map((sk) => (
                <li
                  key={sk}
                  className={`flex items-start gap-2 p-3 rounded-xl border text-xs font-medium ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
