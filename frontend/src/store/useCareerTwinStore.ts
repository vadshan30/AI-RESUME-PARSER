import { create } from 'zustand';
import api from '../services/api';
import { useResumeStore } from './useResumeStore';

export interface CareerTwinData {
  profile: {
    name: string;
    currentRole: string;
    experienceLevel: 'Entry' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
    domain: string[];
    summary: string;
    uniqueValue: string;
    avatar: string;
  };
  careerHealth: {
    overall: number;
    skillDiversity: number;
    careerProgression: number;
    industryAlignment: number;
    futureReadiness: number;
    lastUpdated: Date;
  };
  careerPaths: {
    id: string;
    title: string;
    roles: {
      title: string;
      timeline: string;
      skills: string[];
      salaryRange: string;
      probability: number;
    }[];
    timeToReach: number;
    requiredSkills: string[];
  }[];
  skillGaps: {
    missing: {
      skill: string;
      urgency: 'High' | 'Medium' | 'Low';
      actionPlan: string;
      timeToLearn: string;
    }[];
    improvements: {
      skill: string;
      currentLevel: number;
      requiredLevel: number;
      gap: number;
    }[];
    surplus: string[];
  };
  recommendations: {
    category: 'Learning' | 'Networking' | 'Projects' | 'Jobs' | 'Development';
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    actionItems: string[];
    resources: string[];
    timeline: string;
  }[];
  timeline: {
    past: {
      year: number;
      title: string;
      achieved: boolean;
    }[];
    future: {
      year: number;
      title: string;
      status: 'Planned' | 'In Progress' | 'Achieved';
    }[];
  };
}

interface CareerTwinStore {
  careerData: CareerTwinData | null;
  isLoading: boolean;
  error: string | null;
  selectedPath: string | null;
  generateCareerTwin: (refresh?: boolean) => Promise<void>;
  updatePathSelection: (pathId: string) => void;
  refreshRecommendations: () => Promise<void>;
  clearError: () => void;
}

export const useCareerTwinStore = create<CareerTwinStore>((set) => ({
  careerData: null,
  isLoading: false,
  error: null,
  selectedPath: null,

  generateCareerTwin: async (refresh = false) => {
    const resumeId = useResumeStore.getState().currentResumeId;
    if (!resumeId) {
      set({ error: "Please upload and analyze a resume first." });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await api.post('/ai/career-twin', {
        resume_id: resumeId,
        refresh
      });

      const data = response.data;
      const initialPath = data.careerPaths && data.careerPaths.length > 0 ? data.careerPaths[0].id : null;

      set({ careerData: data, selectedPath: initialPath, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || err.message || "Failed to generate AI Career Twin.", isLoading: false });
    }
  },

  updatePathSelection: (pathId) => {
    set({ selectedPath: pathId });
  },

  refreshRecommendations: async () => {
    set({ isLoading: true });
    try {
      const resumeId = useResumeStore.getState().currentResumeId;
      if (!resumeId) throw new Error("Missing resume ID");
      
      const response = await api.post('/ai/career-twin', {
        resume_id: resumeId,
        refresh: true
      });
      
      set({ careerData: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
