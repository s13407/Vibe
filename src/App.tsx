import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { ResultsView } from './components/ResultsView';
import { DirectDecode } from './components/DirectDecode';
import { UniversityExplorer } from './components/UniversityExplorer';
import { CareerLibrary } from './components/CareerLibrary';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';
import { Footer } from './components/Footer';

import { StudentProfile, AssessmentResult, ThemeVibe } from './types';
import {
  getMockUser,
  saveMockUser,
  clearMockUser,
  getMockAssessments,
  saveMockAssessment,
  syncAssessmentToSupabase,
  syncProfileUpdate,
  fetchUserAssessments,
  getStoredSupabaseConfig,
  hasActiveSession as hasSupabaseSession,
  clearActiveSession as clearSupabaseSession
} from './lib/supabase';
import {
  auth,
  db,
  hasActiveSession as hasFirebaseSession,
  clearActiveSession as clearFirebaseSession,
  syncAssessmentToFirebase,
  fetchUserAssessmentsFromFirebase,
  syncProfileUpdateToFirebase,
  getCurrentUserProfile,
  signOutStudent
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Sparkles, Database, Check, Key, Lock, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'quiz' | 'direct' | 'universities' | 'careers' | 'dashboard'
  >('home');

  // Aesthetic Theme Vibe: default to 'eclipse' (Solar Eclipse) or student preference
  const [vibe, setVibe] = useState<ThemeVibe>(() => {
    const saved = localStorage.getItem('pathcode_theme_vibe');
    if (saved === 'abyss') return 'eclipse';
    if (saved === 'eclipse' || saved === 'sunset' || saved === 'tokyo' || saved === 'electric') {
      return saved as ThemeVibe;
    }
    return 'eclipse';
  });

  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentResult[]>([]);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(() => {
    return getStoredSupabaseConfig().isConfigured;
  });

  const handleSelectVibe = (newVibe: ThemeVibe) => {
    setVibe(newVibe);
    localStorage.setItem('pathcode_theme_vibe', newVibe);
  };

  // Initialize student profile & fetch assessments via Firebase Auth & Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const profile: StudentProfile = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Student',
              email: data.email || fbUser.email || '',
              age: data.age || 18,
              school: data.school || 'College / University',
              department: data.department || 'Computer Science & IT',
              preferredCountry: data.preferredCountry || 'Pakistan',
              preferredCity: data.preferredCity || 'Karachi',
              savedCareers: data.savedCareers || [],
              savedUniversities: data.savedUniversities || [],
              createdAt: data.createdAt || new Date().toISOString()
            };
            setCurrentUser(profile);
            const userAssessments = await fetchUserAssessmentsFromFirebase(fbUser.uid);
            setAssessmentsList(userAssessments);
            setIsAuthOpen(false);
            return;
          }
        } catch (e) {
          console.warn('Notice loading user from Firestore:', e);
        }
      }

      // Check cached session
      const cached = getCurrentUserProfile();
      if (cached && hasFirebaseSession()) {
        setCurrentUser(cached);
        try {
          const list = await fetchUserAssessmentsFromFirebase(cached.id);
          setAssessmentsList(list);
        } catch {
          // fallback
        }
        return;
      }

      // Fallback check for Supabase session if any
      if (hasSupabaseSession()) {
        const user = getMockUser();
        if (user) {
          setCurrentUser(user);
          try {
            const list = await fetchUserAssessments(user.id);
            setAssessmentsList(list);
          } catch {
            setAssessmentsList(getMockAssessments(user.id));
          }
          return;
        }
      }

      // No active session: prompt student to log in each time website opens
      setCurrentUser(null);
      setIsAuthOpen(true);
    });

    return () => unsubscribe();
  }, []);

  const handleAssessmentComplete = async (result: AssessmentResult) => {
    if (currentUser) {
      result.userId = currentUser.id;
      result.userName = currentUser.name;

      if (result.preferredCountry && !currentUser.preferredCountry) {
        currentUser.preferredCountry = result.preferredCountry;
        currentUser.preferredCity = result.preferredCity;
        await syncProfileUpdateToFirebase(currentUser);
        await syncProfileUpdate(currentUser);
      }
    }

    // Save to Firebase Cloud Firestore
    await syncAssessmentToFirebase(result);
    // Also sync to Supabase for multi-cloud persistence
    await syncAssessmentToSupabase(result);

    setCurrentResult(result);
    setAssessmentsList((prev) => [result, ...prev]);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCareer = async (career: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    const currentSaved = currentUser.savedCareers || [];
    let updated: string[];
    if (currentSaved.includes(career)) {
      updated = currentSaved.filter((c) => c !== career);
    } else {
      updated = [...currentSaved, career];
    }

    const updatedUser = { ...currentUser, savedCareers: updated };
    setCurrentUser(updatedUser);
    await syncProfileUpdateToFirebase(updatedUser);
    await syncProfileUpdate(updatedUser);
  };

  const handleSaveUniversity = async (uniId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    const currentSaved = currentUser.savedUniversities || [];
    let updated: string[];
    if (currentSaved.includes(uniId)) {
      updated = currentSaved.filter((u) => u !== uniId);
    } else {
      updated = [...currentSaved, uniId];
    }

    const updatedUser = { ...currentUser, savedUniversities: updated };
    setCurrentUser(updatedUser);
    await syncProfileUpdateToFirebase(updatedUser);
    await syncProfileUpdate(updatedUser);
  };

  const handleLoginSuccess = async (profile: StudentProfile) => {
    setCurrentUser(profile);
    setIsAuthOpen(false);
    try {
      const list = await fetchUserAssessmentsFromFirebase(profile.id);
      if (list && list.length > 0) {
        setAssessmentsList(list);
      } else {
        const supList = await fetchUserAssessments(profile.id);
        setAssessmentsList(supList);
      }
    } catch {
      setAssessmentsList(getMockAssessments(profile.id));
    }
  };

  const handleLogout = async () => {
    await signOutStudent();
    clearSupabaseSession();
    clearFirebaseSession();
    setCurrentUser(null);
    setAssessmentsList([]);
    setActiveTab('home');
    setIsAuthOpen(true);
  };

  const handleConfigUpdated = () => {
    const config = getStoredSupabaseConfig();
    setIsSupabaseConnected(config.isConfigured);
  };

  // Determine container classes according to active vibe
  const containerClasses =
    vibe === 'eclipse' || vibe === 'abyss'
      ? 'bg-[#090A10] text-slate-100 eclipse-mesh selection:bg-amber-500/30 selection:text-amber-200'
      : vibe === 'sunset'
      ? 'bg-[#0D0B1A] text-slate-100 sunset-mesh selection:bg-rose-500/30 selection:text-rose-200'
      : vibe === 'tokyo'
      ? 'bg-[#0B0817] text-slate-100 tokyo-mesh selection:bg-fuchsia-500/30 selection:text-fuchsia-200'
      : 'bg-[#F8FAFC] text-slate-900 electric-mesh selection:bg-indigo-500/20 selection:text-indigo-950';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${containerClasses}`}>
      {/* Top Bar Navigation with Vibe Selector and Supabase Status */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'dashboard' && !currentUser) {
            setIsAuthOpen(true);
            return;
          }
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        onLogout={handleLogout}
        isSupabaseConnected={isSupabaseConnected}
        vibe={vibe}
        onSelectVibe={handleSelectVibe}
      />

      {/* Session Login Notice if not logged in */}
      {!currentUser && (
        <div
          className={`border-b transition-all py-2.5 px-4 text-xs font-semibold ${
            vibe === 'eclipse' || vibe === 'abyss'
              ? 'bg-amber-500/10 border-amber-500/25 text-amber-200'
              : vibe === 'sunset'
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-200'
              : vibe === 'tokyo'
              ? 'bg-violet-500/10 border-violet-500/25 text-violet-200'
              : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}
        >
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                <strong>Student Login Required:</strong> Each time you open our website, you are supposed to log in with your unique password. (First time visiting? Sign up once to generate your password).
              </span>
            </div>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Log In with Password</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If user has an active assessment result on home tab, display it, else show Hero */}
        {activeTab === 'home' && (
          <>
            {currentResult ? (
              <div className="space-y-6 pt-6 animate-fadeIn">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentResult(null)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border transition-colors ${
                      vibe !== 'electric'
                        ? 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/15'
                        : 'bg-white border-slate-200 text-indigo-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>← Back to Overview</span>
                  </button>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      vibe !== 'electric'
                        ? 'bg-white/5 border-white/10 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Active CALIPS Result ({currentResult.pathCode})
                  </span>
                </div>
                <ResultsView
                  result={currentResult}
                  onRetake={() => {
                    setCurrentResult(null);
                    setActiveTab('quiz');
                  }}
                  savedCareers={currentUser?.savedCareers || []}
                  onToggleSaveCareer={handleSaveCareer}
                  savedUniversities={currentUser?.savedUniversities || []}
                  onToggleSaveUniversity={handleSaveUniversity}
                  vibe={vibe}
                />
              </div>
            ) : (
              <Hero
                onStartQuiz={() => setActiveTab('quiz')}
                onStartDirect={() => setActiveTab('direct')}
                onExploreUniversities={() => setActiveTab('universities')}
                vibe={vibe}
              />
            )}
          </>
        )}

        {/* 60-Question CALIPS Assessment */}
        {activeTab === 'quiz' && (
          <AssessmentQuiz
            onComplete={handleAssessmentComplete}
            onCancel={() => setActiveTab('home')}
            initialPreferredCountry={currentUser?.preferredCountry || 'Pakistan'}
            initialPreferredCity={currentUser?.preferredCity || 'Karachi'}
            vibe={vibe}
          />
        )}

        {/* Direct "I Know My Interest" Fast-Track */}
        {activeTab === 'direct' && (
          <DirectDecode
            savedCareers={currentUser?.savedCareers || []}
            onToggleSaveCareer={handleSaveCareer}
            savedUniversities={currentUser?.savedUniversities || []}
            onToggleSaveUniversity={handleSaveUniversity}
            vibe={vibe}
          />
        )}

        {/* University Explorer */}
        {activeTab === 'universities' && (
          <UniversityExplorer
            savedUniversities={currentUser?.savedUniversities || []}
            onToggleSaveUniversity={handleSaveUniversity}
            preferredCountry={currentUser?.preferredCountry}
            preferredCity={currentUser?.preferredCity}
            vibe={vibe}
          />
        )}

        {/* Career & Clusters Library */}
        {activeTab === 'careers' && (
          <CareerLibrary
            savedCareers={currentUser?.savedCareers || []}
            onToggleSaveCareer={handleSaveCareer}
            vibe={vibe}
          />
        )}

        {/* Student Dashboard */}
        {activeTab === 'dashboard' && currentUser && (
          <Dashboard
            currentUser={currentUser}
            assessments={assessmentsList}
            onSelectAssessment={(res) => {
              setCurrentResult(res);
              setActiveTab('home');
            }}
            onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
            onStartQuiz={() => setActiveTab('quiz')}
            onUpdateProfile={async (updated) => {
              setCurrentUser(updated);
              await syncProfileUpdate(updated);
            }}
            isSupabaseConnected={isSupabaseConnected}
            vibe={vibe}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        vibe={vibe}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        vibe={vibe}
      />

      {/* Supabase & RLS Setup Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        onConfigUpdated={handleConfigUpdated}
        vibe={vibe}
      />
    </div>
  );
}
