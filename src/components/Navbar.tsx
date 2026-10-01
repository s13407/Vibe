import React from 'react';
import { StudentProfile, ThemeVibe } from '../types';
import {
  Compass,
  Sparkles,
  Database,
  LogOut,
  MapPin,
  Key
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'quiz' | 'direct' | 'universities' | 'careers' | 'dashboard';
  setActiveTab: (tab: 'home' | 'quiz' | 'direct' | 'universities' | 'careers' | 'dashboard') => void;
  currentUser: StudentProfile | null;
  onOpenAuth: () => void;
  onOpenSupabaseModal: () => void;
  onLogout: () => void;
  isSupabaseConnected: boolean;
  vibe: ThemeVibe;
  onSelectVibe: (vibe: ThemeVibe) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenSupabaseModal,
  onLogout,
  isSupabaseConnected,
  vibe,
  onSelectVibe
}) => {
  const isDark = vibe !== 'electric';

  const vibes: { id: ThemeVibe; name: string; emoji: string; tag: string }[] = [
    { id: 'eclipse', name: 'Solar Eclipse', emoji: '🌘', tag: 'Molten 24K Gold & Obsidian Velvet' },
    { id: 'sunset', name: 'Velvet Sunset', emoji: '🌅', tag: 'Coral, Amber & Orchid Dusk' },
    { id: 'tokyo', name: 'Tokyo Midnight', emoji: '🌆', tag: 'Electric Violet & Cyber Fuchsia' },
    { id: 'electric', name: 'Daylight Pop', emoji: '⚡', tag: 'Clean White & Jewel Tones' }
  ];

  // Dynamic branding accents
  const brandGradient =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'from-amber-300 via-yellow-200 to-amber-500'
      : vibe === 'sunset'
      ? 'from-rose-400 via-amber-300 to-purple-400'
      : vibe === 'tokyo'
      ? 'from-violet-400 via-fuchsia-300 to-pink-400'
      : 'from-indigo-600 via-purple-600 to-pink-500';

  const brandIconBg =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'from-amber-500 via-yellow-500 to-amber-600 text-slate-950'
      : vibe === 'sunset'
      ? 'from-rose-500 via-amber-500 to-purple-600 text-white'
      : vibe === 'tokyo'
      ? 'from-violet-500 via-fuchsia-500 to-pink-600 text-white'
      : 'from-indigo-500 via-purple-500 to-pink-500 text-white';

  const activeLinkClass =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'text-amber-300 font-extrabold'
      : vibe === 'sunset'
      ? 'text-rose-300 font-extrabold'
      : vibe === 'tokyo'
      ? 'text-fuchsia-300 font-extrabold'
      : 'text-indigo-600 font-extrabold';

  const activeLineBg =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'from-amber-400 to-yellow-300'
      : vibe === 'sunset'
      ? 'from-rose-500 via-amber-400 to-purple-500'
      : vibe === 'tokyo'
      ? 'from-violet-500 to-fuchsia-500'
      : 'from-indigo-500 to-pink-500';

  const headerBgClass =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'bg-[#090A10]/90 border-amber-500/15 shadow-[0_4px_30px_rgba(245,158,11,0.08)]'
      : vibe === 'sunset'
      ? 'bg-[#0D0B1A]/85 border-white/10 shadow-[0_4px_30px_rgba(244,63,94,0.08)]'
      : vibe === 'tokyo'
      ? 'bg-[#0B0817]/85 border-white/10 shadow-[0_4px_30px_rgba(168,85,247,0.08)]'
      : 'bg-white/90 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.08)]';

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all duration-300 ${headerBgClass}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr ${brandIconBg} shadow-lg transition-transform group-hover:scale-105`}
          >
            <Compass className="h-5 w-5" />
            <div
              className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${brandIconBg} opacity-30 blur-sm -z-10 group-hover:opacity-70 transition-opacity`}
            />
          </div>
          <div>
            <span
              className={`font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r ${brandGradient} bg-clip-text text-transparent`}
            >
              PathCode
            </span>
            <span
              className={`hidden sm:block text-[10px] font-bold tracking-widest uppercase -mt-1 ${
                vibe === 'eclipse' || vibe === 'abyss'
                  ? 'text-amber-400'
                  : vibe === 'sunset'
                  ? 'text-rose-400'
                  : vibe === 'tokyo'
                  ? 'text-fuchsia-400'
                  : 'text-indigo-500'
              }`}
            >
              Decode Your Direction
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden lg:flex items-center gap-6 text-xs font-bold ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors py-1 relative ${
              activeTab === 'home'
                ? activeLinkClass
                : isDark
                ? 'hover:text-white'
                : 'hover:text-indigo-600'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${activeLineBg} rounded-full`}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`transition-colors py-1 relative ${
              activeTab === 'quiz'
                ? activeLinkClass
                : isDark
                ? 'hover:text-white'
                : 'hover:text-indigo-600'
            }`}
          >
            CALIPS Assessment
            {activeTab === 'quiz' && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${activeLineBg} rounded-full`}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`transition-colors py-1 relative ${
              activeTab === 'direct'
                ? activeLinkClass
                : isDark
                ? 'hover:text-white'
                : 'hover:text-indigo-600'
            }`}
          >
            I Know My Interest
            {activeTab === 'direct' && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${activeLineBg} rounded-full`}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('universities')}
            className={`transition-colors py-1 relative ${
              activeTab === 'universities'
                ? activeLinkClass
                : isDark
                ? 'hover:text-white'
                : 'hover:text-indigo-600'
            }`}
          >
            Universities
            {activeTab === 'universities' && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${activeLineBg} rounded-full`}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('careers')}
            className={`transition-colors py-1 relative ${
              activeTab === 'careers'
                ? activeLinkClass
                : isDark
                ? 'hover:text-white'
                : 'hover:text-indigo-600'
            }`}
          >
            Career Library
            {activeTab === 'careers' && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${activeLineBg} rounded-full`}
              />
            )}
          </button>
          {currentUser && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors py-1 relative ${
                activeTab === 'dashboard'
                  ? activeLinkClass
                  : isDark
                  ? 'hover:text-white'
                  : 'hover:text-indigo-600'
              }`}
            >
              Dashboard
              {activeTab === 'dashboard' && (
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${activeLineBg} rounded-full`}
                />
              )}
            </button>
          )}
        </nav>

        {/* Right Side: Vibe Switcher + Supabase DB Badge + User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Aesthetic Vibe Selector - Compact on Mobile, Full on Tablet/Desktop */}
          <div
            className={`flex items-center p-0.5 sm:p-1 rounded-full border transition-all ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {/* Desktop / Tablet: All 4 vibes */}
            <div className="hidden sm:flex items-center">
              {vibes.map((item) => {
                const isSelected = vibe === item.id || (vibe === 'abyss' && item.id === 'eclipse');
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectVibe(item.id)}
                    title={item.tag}
                    className={`flex items-center gap-1.5 rounded-full px-2 sm:px-2.5 py-1 text-[11px] font-bold transition-all ${
                      isSelected
                        ? item.id === 'eclipse'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-xs'
                          : item.id === 'sunset'
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs'
                          : item.id === 'tokyo'
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-xs'
                          : 'bg-white text-indigo-700 shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="hidden xl:inline">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile-only compact vibe cycle button */}
            <div className="flex sm:hidden items-center">
              {(() => {
                const currentIdx = vibes.findIndex(
                  (v) => v.id === vibe || (vibe === 'abyss' && v.id === 'eclipse')
                );
                const nextVibe = vibes[(currentIdx + 1) % vibes.length];
                const activeVibe = vibes[currentIdx !== -1 ? currentIdx : 0];
                return (
                  <button
                    type="button"
                    onClick={() => onSelectVibe(nextVibe.id)}
                    title={`Theme: ${activeVibe.name}. Tap to cycle to ${nextVibe.name}`}
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold"
                  >
                    <span>{activeVibe.emoji}</span>
                    <span className="text-[10px] opacity-75 font-mono">Theme</span>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Supabase Live DB Pill */}
          <button
            onClick={onOpenSupabaseModal}
            title={
              isSupabaseConnected
                ? 'Connected to live Supabase Database (click to inspect tables)'
                : 'Supabase Database Config & Status'
            }
            className={`flex items-center gap-1.5 rounded-full border px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold transition-all shrink-0 ${
              isSupabaseConnected
                ? isDark
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-xs shadow-emerald-500/20'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : isDark
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25'
                : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Supabase</span>
            <span
              className={`h-2 w-2 rounded-full ${
                isSupabaseConnected
                  ? 'bg-emerald-400 ring-2 ring-emerald-400/40 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
          </button>

          {/* User Profile or Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-slate-100 hover:bg-white/10'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr ${brandIconBg} text-[10px] font-bold`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[55px] sm:max-w-[85px] truncate">{currentUser.name}</span>
                {currentUser.preferredCountry && (
                  <span
                    className={`hidden md:flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                      vibe === 'eclipse' || vibe === 'abyss'
                        ? 'bg-amber-500/20 text-amber-300'
                        : vibe === 'sunset'
                        ? 'bg-rose-500/20 text-rose-300'
                        : vibe === 'tokyo'
                        ? 'bg-fuchsia-500/20 text-fuchsia-300'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    <MapPin className="h-2.5 w-2.5" />
                    <span>{currentUser.preferredCountry.split(' ')[0]}</span>
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                title="Sign out"
                className={`rounded-full p-1.5 sm:p-2 transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r ${brandIconBg} px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all shrink-0`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Quick Bar with Smooth Horizontal Touch Scrolling */}
      <div
        className={`flex lg:hidden overflow-x-auto border-t px-2 sm:px-4 py-1.5 sm:py-2 text-xs font-bold gap-1.5 sm:gap-2.5 no-scrollbar scroll-smooth ${
          vibe === 'eclipse' || vibe === 'abyss'
            ? 'bg-[#090A10]/95 border-amber-500/15 text-slate-300'
            : vibe === 'sunset'
            ? 'bg-[#0D0B1A]/95 border-white/10 text-slate-300'
            : vibe === 'tokyo'
            ? 'bg-[#0B0817]/95 border-white/10 text-slate-300'
            : 'bg-white/95 border-slate-200 text-slate-600'
        }`}
      >
        <button
          onClick={() => setActiveTab('home')}
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all min-h-[36px] flex items-center gap-1 ${
            activeTab === 'home'
              ? isDark
                ? 'bg-white/15 text-white shadow-xs font-black'
                : 'bg-indigo-50 text-indigo-700 shadow-xs font-black'
              : 'hover:text-white'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all min-h-[36px] flex items-center gap-1 ${
            activeTab === 'quiz'
              ? isDark
                ? 'bg-white/15 text-white shadow-xs font-black'
                : 'bg-indigo-50 text-indigo-700 shadow-xs font-black'
              : 'hover:text-white'
          }`}
        >
          CALIPS Quiz
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all min-h-[36px] flex items-center gap-1 ${
            activeTab === 'direct'
              ? isDark
                ? 'bg-white/15 text-white shadow-xs font-black'
                : 'bg-indigo-50 text-indigo-700 shadow-xs font-black'
              : 'hover:text-white'
          }`}
        >
          Know Interest
        </button>
        <button
          onClick={() => setActiveTab('universities')}
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all min-h-[36px] flex items-center gap-1 ${
            activeTab === 'universities'
              ? isDark
                ? 'bg-white/15 text-white shadow-xs font-black'
                : 'bg-indigo-50 text-indigo-700 shadow-xs font-black'
              : 'hover:text-white'
          }`}
        >
          Universities
        </button>
        <button
          onClick={() => setActiveTab('careers')}
          className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all min-h-[36px] flex items-center gap-1 ${
            activeTab === 'careers'
              ? isDark
                ? 'bg-white/15 text-white shadow-xs font-black'
                : 'bg-indigo-50 text-indigo-700 shadow-xs font-black'
              : 'hover:text-white'
          }`}
        >
          Career Library
        </button>
        {currentUser && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all min-h-[36px] flex items-center gap-1 ${
              activeTab === 'dashboard'
                ? isDark
                  ? 'bg-white/15 text-white shadow-xs font-black'
                  : 'bg-indigo-50 text-indigo-700 shadow-xs font-black'
                : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>
        )}
      </div>
    </header>
  );
};
