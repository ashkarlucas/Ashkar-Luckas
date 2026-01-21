
export type AnalysisType = 'RED_FLAGS' | 'WINGMAN' | 'BIO' | 'COMMUNITY';
export type Language = 'fr' | 'mg';

export interface RedFlag {
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  flags: RedFlag[];
  sincerityScore?: number;
  cliches?: string[];
  suggestions?: string[];
}

export interface WingmanResponse {
  funny: string;
  mysterious: string;
  direct: string;
}

export interface UserProfile {
  isPremium: boolean;
  analysesRemaining: number;
}

export interface CommunityPost {
  id: string;
  image: string;
  title: string;
  score: number;
  likes: number;
  comments: number;
}
