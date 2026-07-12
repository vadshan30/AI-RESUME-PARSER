import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useResumeStore } from './useResumeStore';

export interface GapItem {
  skill: string;
  category: string;
  currentLevel: string;
  requiredLevel: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  learningResources: LearningResource[];
  estimatedTime: string;
  priority: number;
}

export interface StrongSkill {
  skill: string;
  category: string;
  proficiency: string;
  description: string;
  showcaseAdvice: string;
}

export interface LearningResource {
  type: 'Course' | 'Book' | 'Tutorial' | 'Project' | 'Certification';
  title: string;
  provider: string;
  url?: string;
  timeToComplete: string;
  cost: 'Free' | 'Paid' | 'Freemium';
  rating: number;
}

export interface LearningStep {
  title: string;
  description: string;
  duration: string;
}

export interface LearningPlan {
  roadmap: LearningStep[];
  totalEstimatedTime: string;
  weeklySchedule: string[];
}

export interface CareerImpact {
  salaryIncrease: string;
  timeToHire: string;
  marketDemand: string;
  progressionPath: string[];
}

export interface RadarData {
  subject: string;
  A: number; // Current
  B: number; // Required
  fullMark: number;
}

export interface SkillGapAnalysis {
  matchScore: number;
  gapScore: number;
  coverage: number;
  skillStrength: number;
  summary: string;
  criticalGaps: GapItem[];
  highPriorityGaps: GapItem[];
  mediumPriorityGaps: GapItem[];
  strongSkills: StrongSkill[];
  radarData: RadarData[];
  learningPlan: LearningPlan;
  careerImpact: CareerImpact;
}

export const popularRoles = [
  "Software Engineer", "Full Stack Developer", "Data Scientist", 
  "Product Manager", "DevOps Engineer", "Frontend Developer", 
  "Backend Developer", "Cloud Architect", "Machine Learning Engineer"
];

export const industries = ["Tech", "Finance", "Healthcare", "Education", "E-commerce"];
export const experienceLevels = ["Entry", "Junior", "Mid", "Senior", "Lead", "Executive"];

interface SkillGapStore {
  targetRole: string;
  experienceLevel: string;
  industry: string;
  
  gapAnalysisResults: SkillGapAnalysis | null;
  isLoading: boolean;
  error: string | null;

  setTargetRole: (role: string) => void;
  setExperienceLevel: (level: string) => void;
  setIndustry: (ind: string) => void;
  
  analyzeGaps: () => Promise<void>;
  clearResults: () => void;
}

const REQUIRED_KEYS: (keyof SkillGapAnalysis)[] = [
  'matchScore', 'gapScore', 'summary', 'criticalGaps',
  'highPriorityGaps', 'mediumPriorityGaps', 'strongSkills', 'radarData',
  'learningPlan', 'careerImpact'
];

function isValidSkillGapResponse(data: any): data is SkillGapAnalysis {
  if (!data || typeof data !== 'object' || data.error || Array.isArray(data)) return false;
  return REQUIRED_KEYS.every(key => key in data);
}

export const useSkillGapStore = create<SkillGapStore>()(
  persist(
    (set, get) => ({
      targetRole: '',
      experienceLevel: 'Mid',
      industry: 'Tech',
      
      gapAnalysisResults: null,
      isLoading: false,
      error: null,

      setTargetRole: (role) => set({ targetRole: role }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setIndustry: (ind) => set({ industry: ind }),
      clearResults: () => set({ gapAnalysisResults: null, targetRole: '' }),

      analyzeGaps: async () => {
        const { targetRole } = get();
        const resumeId = useResumeStore.getState().currentResumeId;
        
        if (!targetRole.trim()) {
          set({ error: "Please enter a target role." });
          return;
        }

        if (!resumeId) {
          set({ error: "Please upload and analyze a resume first." });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await api.post('/ai/skill-gap', {
            resume_id: resumeId,
            target_role: targetRole
          });

          if (isValidSkillGapResponse(response.data)) {
            set({ gapAnalysisResults: response.data, isLoading: false });
          } else {
            const missing = REQUIRED_KEYS.filter(k => !(k in (response.data || {})));
            set({ error: `Received incomplete analysis data. Missing: ${missing.join(', ')}. Please try again.`, isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message || "Failed to analyze skill gaps.", isLoading: false });
        }
      }
    }),
    {
      name: 'skill-gap-storage-v5',
      partialize: (state) => ({
        targetRole: state.targetRole,
        experienceLevel: state.experienceLevel,
        industry: state.industry,
        gapAnalysisResults: state.gapAnalysisResults,
      }),
    }
  )
);
