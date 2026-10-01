import React, { useState } from 'react';
import {
  getStoredSupabaseConfig,
  updateSupabaseCredentials,
  testSupabaseConnection,
  SUPABASE_RLS_SQL
} from '../lib/supabase';
import { ThemeVibe } from '../types';
import {
  X,
  Database,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy,
  Activity,
  Server,
  Zap,
  ExternalLink
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
  vibe: ThemeVibe;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
  vibe
}) => {
  const current = getStoredSupabaseConfig();
  const [url, setUrl] = useState(current.supabaseUrl);
  const [anonKey, setAnonKey] = useState(current.supabaseKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    hasProfilesTable: boolean;
    hasAssessmentsTable: boolean;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const isDark = vibe !== 'electric';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseCredentials(url, anonKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onConfigUpdated();
      onClose();
    }, 1000);
  };

  const handleTestConnection = async () => {
    // Temporary update for test
    updateSupabaseCredentials(url, anonKey);
    setTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection();
    setTesting(false);
    setTestResult(res);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_RLS_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0E1424] border-white/15 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute right-5 top-5 rounded-full p-2 transition-colors ${
            isDark
              ? 'text-slate-400 hover:bg-white/10 hover:text-white'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
                Supabase Database & Authentication
              </h2>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                PostgreSQL + RLS
              </span>
            </div>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Direct live connection to your Supabase project for student auth, profiles, and assessment records.
            </p>
          </div>
        </div>

        {/* Live Status Card */}
        <div
          className={`mt-6 rounded-2xl border p-4 sm:p-5 transition-all ${
            current.isConfigured
              ? isDark
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : isDark
              ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
              : 'bg-purple-50 border-purple-200 text-purple-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full animate-pulse ${
                  current.isConfigured ? 'bg-emerald-400' : 'bg-purple-400'
                }`}
              />
              <span className="font-bold text-sm">
                {current.isConfigured
                  ? 'Connected to Live Supabase Project'
                  : 'Ready to Connect Your Supabase Project'}
              </span>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={testing || !url}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                testing
                  ? 'opacity-60 cursor-not-allowed'
                  : 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed opacity-90">
            {current.isConfigured
              ? `PathCode is synchronizing directly with your Supabase backend (${url.replace(
                  'https://',
                  ''
                )}). Student registrations, logins, and CALIPS assessment results are saved in real-time.`
              : 'Paste your Supabase Project URL and Anon Public Key below. You will also find the complete SQL script to create the profiles & assessments tables with Row Level Security (RLS).'}
          </p>

          {/* Test results banner */}
          {testResult && (
            <div
              className={`mt-3 rounded-xl p-3 text-xs border ${
                testResult.success
                  ? 'bg-emerald-900/40 border-emerald-400 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.success ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                )}
                <span>{testResult.message}</span>
              </div>
              {testResult.success && (
                <div className="mt-2 flex gap-4 text-[11px]">
                  <span>
                    Table <code>profiles</code>:{' '}
                    <strong>
                      {testResult.hasProfilesTable ? 'Ready' : 'Pending SQL Run'}
                    </strong>
                  </span>
                  <span>
                    Table <code>assessments</code>:{' '}
                    <strong>
                      {testResult.hasAssessmentsTable
                        ? 'Ready'
                        : 'Pending SQL Run'}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className={`block text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Supabase Project URL
              </label>
              <span className="text-[11px] text-slate-400">
                e.g. https://your-ref-id.supabase.co
              </span>
            </div>
            <input
              type="url"
              placeholder="https://your-project-id.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-2.5 text-xs font-mono transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className={`block text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Supabase Anon Public API Key
              </label>
              <span className="text-[11px] text-slate-400">anon public key</span>
            </div>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-2.5 text-xs font-mono transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
              }`}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopySql}
              className={`flex items-center justify-center gap-1.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all ${
                isDark
                  ? 'border-white/15 bg-white/5 text-purple-300 hover:bg-white/10'
                  : 'border-slate-200 bg-slate-50 text-indigo-700 hover:bg-slate-100'
              }`}
            >
              <Copy className="h-4 w-4" />
              <span>{copiedSql ? 'SQL Schema Copied to Clipboard!' : 'Copy Supabase SQL & RLS Schema'}</span>
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Credentials Saved!</span>
                </>
              ) : (
                <>
                  <Server className="h-4 w-4" />
                  <span>Save Supabase Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Database Architecture & RLS Explainer */}
        <div
          className={`mt-6 border-t pt-5 text-xs space-y-3 ${
            isDark ? 'border-white/10 text-slate-300' : 'border-slate-150 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Supabase Database Schema & Row Level Security:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div
              className={`rounded-xl border p-3 ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-bold text-purple-400 mb-1">
                1. <code>public.profiles</code> Table
              </div>
              <p>
                Stores student records: Name, Email, Age, School/College, Department, Preferred Study Country & City, and Saved Careers.
                Protected by RLS (<code className="font-mono text-emerald-400">auth.uid() = id</code>).
              </p>
            </div>
            <div
              className={`rounded-xl border p-3 ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-bold text-cyan-400 mb-1">
                2. <code>public.assessments</code> Table
              </div>
              <p>
                Stores full 60-question CALIPS results: 3-letter PathCode, 6 dimension scores, ranked categories, target location.
                Strict user isolation with RLS policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
