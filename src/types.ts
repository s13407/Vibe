export type CALIPSDimension = 'C' | 'A' | 'L' | 'I' | 'P' | 'S';

export type ThemeVibe = 'sunset' | 'eclipse' | 'tokyo' | 'electric' | 'abyss';

export interface CategoryInfo {
  code: CALIPSDimension;
  title: string;
  archetype: string;
  tagline: string;
  description: string;
  accentColor: string;
  inDemandCareers: string[];
  relatedMajors: string[];
  careerClusters: string[];
  skillsToBuild: string[];
}

export interface Question {
  id: number;
  category: CALIPSDimension;
  text: string;
}

export interface CALIPSScores {
  C: number;
  A: number;
  L: number;
  I: number;
  P: number;
  S: number;
}

export interface AssessmentResult {
  id: string;
  userId?: string;
  userName?: string;
  createdAt: string;
  scores: CALIPSScores;
  rankedCategories: CALIPSDimension[];
  pathCode: string; // e.g., "IAC"
  primaryArchetype: string;
  answers: Record<number, boolean>;
  preferredCountry?: string;
  preferredCity?: string;
}

export interface StudentProfile {
  id: string;
  email: string;
  name: string;
  password?: string;
  age: number | string;
  school: string;
  department: string;
  preferredCountry?: string;
  preferredCity?: string;
  createdAt: string;
  savedCareers?: string[];
  savedUniversities?: string[];
}

export interface UniversityProgram {
  id: string;
  universityName: string;
  country: string;
  city: string;
  programTitle: string;
  degreeLevel: 'Bachelor' | 'Master' | 'Diploma' | 'Associate';
  calipsCodes: CALIPSDimension[];
  matchScore?: number;
  tuitionTier: '$' | '$$' | '$$$' | '$$$$';
  description: string;
  keyMajors: string[];
  websiteUrl: string;
  institutionType?: 'Local' | 'Private';
  isLiveGoogleResult?: boolean;
  sourceAttribution?: string;
}

export interface DirectInterestMatch {
  interest: string;
  department: string;
  field: string;
  computedPathCode: string;
  primaryCategory: CALIPSDimension;
  secondaryCategory: CALIPSDimension;
  recommendedCareers: string[];
  recommendedMajors: string[];
  skillsToBuild: string[];
  clusters: string[];
}
