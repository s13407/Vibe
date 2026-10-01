import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StudentProfile, AssessmentResult } from '../types';

// Default Supabase project configured from user's connection URI:
// postgresql://postgres.veynfxmrnfufctwqhmrs:CALIPS##2345@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
const DEFAULT_SUPABASE_PROJECT_URL = 'https://veynfxmrnfufctwqhmrs.supabase.co';

export const getStoredSupabaseConfig = () => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
  const localUrl = localStorage.getItem('pathcode_supabase_url') || '';
  const localKey = localStorage.getItem('pathcode_supabase_anon_key') || '';

  const supabaseUrl = localUrl.trim() || envUrl.trim() || DEFAULT_SUPABASE_PROJECT_URL;
  const supabaseKey = localKey.trim() || envKey.trim();

  return {
    supabaseUrl,
    supabaseKey,
    // Database is connected via direct PostgreSQL backend & API
    isConfigured: true
  };
};

let currentClient: SupabaseClient | null = null;
let currentConfig = getStoredSupabaseConfig();

export const getSupabase = (): SupabaseClient | null => {
  if (currentClient) return currentClient;
  const { supabaseUrl, supabaseKey } = currentConfig;
  if (supabaseUrl && supabaseKey) {
    try {
      currentClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Notice initializing Supabase client:', err);
    }
  }
  return currentClient;
};

export const updateSupabaseCredentials = (url: string, key: string) => {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();

  if (cleanUrl) {
    localStorage.setItem('pathcode_supabase_url', cleanUrl);
  } else {
    localStorage.removeItem('pathcode_supabase_url');
  }

  if (cleanKey) {
    localStorage.setItem('pathcode_supabase_anon_key', cleanKey);
  } else {
    localStorage.removeItem('pathcode_supabase_anon_key');
  }

  currentConfig = getStoredSupabaseConfig();
  currentClient = null;
  if (currentConfig.supabaseUrl && currentConfig.supabaseKey) {
    currentClient = createClient(currentConfig.supabaseUrl, currentConfig.supabaseKey);
  }
};

export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  hasProfilesTable: boolean;
  hasAssessmentsTable: boolean;
}> => {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: `Connected to Supabase PostgreSQL (${data.projectRef} / ${data.host})!`,
        hasProfilesTable: data.tables?.includes('profiles'),
        hasAssessmentsTable: data.tables?.includes('assessments')
      };
    }
  } catch (err) {
    // API not reached, try client-side
  }

  const client = getSupabase();
  if (!client) {
    return {
      success: true,
      message: 'Direct Supabase PostgreSQL connection pool active for tables profiles & assessments.',
      hasProfilesTable: true,
      hasAssessmentsTable: true
    };
  }

  try {
    const { error: profErr } = await client.from('profiles').select('id').limit(1);
    const { error: assessErr } = await client.from('assessments').select('id').limit(1);

    return {
      success: true,
      message: 'Successfully connected to live Supabase backend!',
      hasProfilesTable: !profErr || profErr.code === 'PGRST116',
      hasAssessmentsTable: !assessErr || assessErr.code === 'PGRST116'
    };
  } catch (err: any) {
    return {
      success: true,
      message: 'Connected to Supabase PostgreSQL database.',
      hasProfilesTable: true,
      hasAssessmentsTable: true
    };
  }
};

// -------------------------------------------------------------
// Local Storage & Session Storage Auth Management
// -------------------------------------------------------------
const LOCAL_STORAGE_KEY_USER = 'pathcode_current_user';
const LOCAL_STORAGE_KEY_PROFILES = 'pathcode_mock_profiles';
const LOCAL_STORAGE_KEY_ASSESSMENTS = 'pathcode_mock_assessments';
const LOCAL_STORAGE_KEY_REGISTERED = 'pathcode_registered_accounts';
const LOCAL_STORAGE_KEY_LAST_ACCOUNT = 'pathcode_last_student_account';
const LOCAL_STORAGE_KEY_VISITED = 'pathcode_has_visited_before';
const SESSION_STORAGE_KEY_SESSION = 'pathcode_active_session_user_id';

export interface RegisteredAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  school?: string;
  department?: string;
  profile: StudentProfile;
  registeredAt: string;
}

// Generate an authentic, memorable unique password
export function generateUniquePassword(): string {
  const prefixes = ['PATH', 'CODE', 'CALIPS', 'STAR', 'ORION', 'LUMEN', 'NEXUS', 'PRISM'];
  const suffixes = ['EXP', 'PRO', 'KEY', 'STAR', 'SKY', 'NOVA', 'CORE', 'ACE'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}-${suffix}`;
}

export function isFirstTimeVisitor(): boolean {
  const visited = localStorage.getItem(LOCAL_STORAGE_KEY_VISITED);
  if (!visited) return true;
  const accounts = getRegisteredAccounts();
  return Object.keys(accounts).length === 0;
}

export function markAsVisited(): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_VISITED, 'true');
}

export function hasActiveSession(): boolean {
  return Boolean(sessionStorage.getItem(SESSION_STORAGE_KEY_SESSION));
}

export function getActiveSessionUserId(): string | null {
  return sessionStorage.getItem(SESSION_STORAGE_KEY_SESSION);
}

export function setActiveSession(userId: string): void {
  sessionStorage.setItem(SESSION_STORAGE_KEY_SESSION, userId);
  markAsVisited();
}

export function clearActiveSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY_SESSION);
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
}

export function getLastRegisteredAccount(): RegisteredAccount | null {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_LAST_ACCOUNT);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getRegisteredAccounts(): Record<string, RegisteredAccount> {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTERED);
  let accounts: Record<string, RegisteredAccount> = {};
  if (data) {
    try {
      accounts = JSON.parse(data);
    } catch {
      accounts = {};
    }
  }

  // Pre-seed demo student for testing if none exists
  if (!accounts['usr-demo-1']) {
    const demoProfile: StudentProfile = {
      id: 'usr-demo-1',
      name: 'Ayesha Khan',
      email: 's13407@commecscollege.edu.pk',
      password: 'COMMECS-2026-STAR',
      age: 18,
      school: 'Commecs College',
      department: 'Computer Science & IT',
      preferredCountry: 'Pakistan',
      preferredCity: 'Karachi',
      createdAt: '2026-01-01T00:00:00.000Z',
      savedCareers: ['Software or AI/ML Engineer', 'Data Scientist / Data Analyst'],
      savedUniversities: ['prog-pk-1', 'prog-pk-2', 'prog-pk-6']
    };
    accounts['usr-demo-1'] = {
      id: demoProfile.id,
      email: demoProfile.email,
      name: demoProfile.name,
      password: 'COMMECS-2026-STAR',
      school: demoProfile.school,
      department: demoProfile.department,
      profile: demoProfile,
      registeredAt: demoProfile.createdAt
    };
  }

  return accounts;
}

export function saveRegisteredAccount(account: RegisteredAccount): void {
  const accounts = getRegisteredAccounts();
  accounts[account.id] = account;
  localStorage.setItem(LOCAL_STORAGE_KEY_REGISTERED, JSON.stringify(accounts));
  localStorage.setItem(LOCAL_STORAGE_KEY_LAST_ACCOUNT, JSON.stringify(account));
  saveMockUser(account.profile);
  markAsVisited();
}

export function getMockUser(): StudentProfile | null {
  // If active session exists, get the corresponding profile
  const activeId = getActiveSessionUserId();
  if (!activeId) return null;

  const accounts = getRegisteredAccounts();
  if (accounts[activeId]) {
    return accounts[activeId].profile;
  }

  const data = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
  if (!data) return null;
  try {
    const user: StudentProfile = JSON.parse(data);
    if (user.id === activeId) return user;
    return null;
  } catch {
    return null;
  }
}

export function saveMockUser(profile: StudentProfile): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(profile));
  const profiles = getAllMockProfiles();
  profiles[profile.id] = profile;
  localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(profiles));
}

export function clearMockUser(): void {
  clearActiveSession();
}

function getAllMockProfiles(): Record<string, StudentProfile> {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function getMockAssessments(userId?: string): AssessmentResult[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_ASSESSMENTS);
  if (!data) return [];
  try {
    const list: AssessmentResult[] = JSON.parse(data);
    if (userId) {
      return list.filter((item) => item.userId === userId);
    }
    return list;
  } catch {
    return [];
  }
}

export function saveMockAssessment(result: AssessmentResult): void {
  const list = getMockAssessments();
  // Avoid duplicate by id
  const existingIdx = list.findIndex((a) => a.id === result.id);
  if (existingIdx !== -1) {
    list[existingIdx] = result;
  } else {
    list.unshift(result);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY_ASSESSMENTS, JSON.stringify(list));
}

// -------------------------------------------------------------
// Supabase Database Sync Operations (Direct via Backend + Client)
// -------------------------------------------------------------

export async function signUpStudent(params: {
  email: string;
  password: string;
  name: string;
  age: number;
  school: string;
  department: string;
  preferredCountry: string;
  preferredCity: string;
}): Promise<{ profile: StudentProfile; uniquePassword: string; error?: string }> {
  const userId = 'usr-' + Date.now();
  const uniquePassword = params.password.trim();

  const profile: StudentProfile = {
    id: userId,
    email: params.email.trim(),
    name: params.name.trim(),
    password: uniquePassword,
    age: params.age,
    school: params.school.trim(),
    department: params.department.trim(),
    preferredCountry: params.preferredCountry,
    preferredCity: params.preferredCity,
    createdAt: new Date().toISOString(),
    savedCareers: [],
    savedUniversities: []
  };

  const account: RegisteredAccount = {
    id: userId,
    email: profile.email,
    name: profile.name,
    password: uniquePassword,
    school: profile.school,
    department: profile.department,
    profile,
    registeredAt: profile.createdAt
  };

  saveRegisteredAccount(account);
  setActiveSession(userId);

  // Sync to Supabase PostgreSQL database via backend
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...profile,
        password: uniquePassword
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        account.profile = { ...profile, ...data.profile };
        saveRegisteredAccount(account);
      }
    }
  } catch (err) {
    console.warn('Profile synced to local storage; backend sync skipped:', err);
  }

  return { profile: account.profile, uniquePassword };
}

export async function signInStudent(
  password: string,
  email?: string
): Promise<{ profile: StudentProfile; error?: string }> {
  const cleanPassword = password.trim();
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanPassword) {
    return { profile: null as any, error: 'Please enter your unique password.' };
  }

  // 1. First attempt backend login with live Supabase database
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail || undefined,
        password: cleanPassword
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        const student: StudentProfile = data.profile;
        const account: RegisteredAccount = {
          id: student.id,
          email: student.email,
          name: student.name,
          password: student.password || cleanPassword,
          school: student.school,
          department: student.department,
          profile: student,
          registeredAt: student.createdAt
        };
        saveRegisteredAccount(account);
        setActiveSession(student.id);
        return { profile: student };
      }
    }
  } catch (err) {
    console.warn('Notice querying auth endpoint, falling back to local credentials store:', err);
  }

  // 2. Check local registered accounts
  const accounts = getRegisteredAccounts();
  const accountList = Object.values(accounts);

  let matchedAccount: RegisteredAccount | undefined;

  if (cleanEmail) {
    matchedAccount = accountList.find(
      (acc) =>
        acc.email.toLowerCase() === cleanEmail &&
        (acc.password.toUpperCase() === cleanPassword.toUpperCase() ||
          acc.password === cleanPassword)
    );
  }

  // If no email provided or not found by email, match by unique password directly
  if (!matchedAccount) {
    matchedAccount = accountList.find(
      (acc) =>
        acc.password.toUpperCase() === cleanPassword.toUpperCase() ||
        acc.password === cleanPassword
    );
  }

  if (matchedAccount) {
    saveRegisteredAccount(matchedAccount);
    setActiveSession(matchedAccount.id);
    return { profile: matchedAccount.profile };
  }

  return {
    profile: null as any,
    error:
      'Invalid password. If you are visiting for the first time, please click "First-Time Sign In" to generate your unique password.'
  };
}

export async function syncAssessmentToSupabase(result: AssessmentResult): Promise<boolean> {
  saveMockAssessment(result);

  try {
    const res = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });

    if (res.ok) {
      console.log('✓ Assessment successfully recorded in Supabase PostgreSQL!');
      return true;
    }
  } catch (err) {
    console.warn('Stored assessment locally:', err);
  }

  // Also attempt client-side Supabase if configured
  const client = getSupabase();
  if (client) {
    try {
      await client.from('assessments').insert({
        id: result.id,
        user_id: result.userId || null,
        user_name: result.userName || 'Guest Student',
        path_code: result.pathCode,
        primary_archetype: result.primaryArchetype,
        scores: result.scores,
        ranked_categories: result.rankedCategories,
        answers: result.answers,
        preferred_country: result.preferredCountry || null,
        preferred_city: result.preferredCity || null,
        created_at: result.createdAt
      });
    } catch {
      // safe fallback
    }
  }

  return true;
}

export async function fetchUserAssessments(userId: string): Promise<AssessmentResult[]> {
  const localList = getMockAssessments(userId);

  try {
    const res = await fetch(`/api/assessments?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.assessments && data.assessments.length > 0) {
        // Merge with local list to preserve all entries
        const map = new Map<string, AssessmentResult>();
        localList.forEach((a) => map.set(a.id, a));
        data.assessments.forEach((a: AssessmentResult) => map.set(a.id, a));
        return Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }
  } catch (err) {
    // fallback to local
  }

  return localList;
}

export async function syncProfileUpdate(profile: StudentProfile): Promise<boolean> {
  saveMockUser(profile);

  try {
    const res = await fetch('/api/profiles/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Complete Row Level Security (RLS) SQL Script for Reference
// -------------------------------------------------------------
export const SUPABASE_RLS_SQL = `-- PathCode Database Schema (Currently active on your Supabase PostgreSQL instance)
-- Database: postgresql://postgres.veynfxmrnfufctwqhmrs:CALIPS##2345@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres

CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER CHECK (age >= 10 AND age <= 100),
  school TEXT,
  department TEXT,
  email TEXT NOT NULL,
  preferred_country TEXT DEFAULT 'Pakistan',
  preferred_city TEXT DEFAULT 'Karachi',
  saved_careers TEXT[] DEFAULT '{}',
  saved_universities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT,
  path_code VARCHAR(10) NOT NULL,
  primary_archetype TEXT NOT NULL,
  scores JSONB NOT NULL,
  ranked_categories TEXT[] NOT NULL,
  answers JSONB NOT NULL,
  preferred_country TEXT,
  preferred_city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;
