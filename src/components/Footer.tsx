import React from 'react';
import { Compass, ShieldCheck, Database } from 'lucide-react';
import { ThemeVibe } from '../types';

interface FooterProps {
  onNavigate: (tab: 'home' | 'quiz' | 'direct' | 'universities' | 'careers' | 'dashboard') => void;
  onOpenSupabase: () => void;
  vibe: ThemeVibe;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupabase, vibe }) => {
  const isDark = vibe !== 'electric';

  return (
    <footer
      className={`border-t py-12 mt-12 transition-all ${
        isDark
          ? 'bg-[#060911] border-white/10 text-slate-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md">
                <Compass className="h-4 w-4" />
              </div>
              <span
                className={`font-display text-xl font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                PathCode
              </span>
            </div>
            <p
              className={`text-xs max-w-md leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              "Decode your interest. Discover your direction." Designed for Gen-Z students navigating careers, majors, and universities across Pakistan and worldwide.
            </p>
          </div>

          <div
            className={`flex flex-wrap gap-5 text-xs font-bold ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-purple-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="hover:text-purple-400 transition-colors"
            >
              CALIPS 60-Q Assessment
            </button>
            <button
              onClick={() => onNavigate('direct')}
              className="hover:text-purple-400 transition-colors"
            >
              I Know My Interest
            </button>
            <button
              onClick={() => onNavigate('universities')}
              className="hover:text-purple-400 transition-colors"
            >
              Universities
            </button>
            <button
              onClick={() => onNavigate('careers')}
              className="hover:text-purple-400 transition-colors"
            >
              Taxonomy Library
            </button>
            <button
              onClick={onOpenSupabase}
              className="hover:text-purple-400 transition-colors flex items-center gap-1 text-emerald-400 font-bold"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Supabase Database & RLS</span>
            </button>
          </div>
        </div>

        {/* Disclaimer box */}
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 text-xs ${
            isDark
              ? 'bg-white/5 border-white/10 text-slate-300'
              : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
          }`}
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-purple-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Educational Disclaimer:</strong> PathCode is structured strictly as an exploratory guidance framework adapted from the Holland/CALIPS vocational interest taxonomy. It is designed to spark discovery and highlight potential paths, not to act as a definitive prediction or guarantee of any student's future.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium pt-4 border-t border-white/10">
          <span>&copy; {new Date().getFullYear()} PathCode. All rights reserved.</span>
          <span className="font-semibold text-purple-400/80">
            C — Conventional · A — Artistic · L — Leadership · I — Investigative · P — Practical · S — Social
          </span>
        </div>
      </div>
    </footer>
  );
};
