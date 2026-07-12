import { create } from 'zustand';
import api from '../services/api';

interface InsightsStore {
  isAnalyzing: boolean;
  error: string | null;
  recruiterViewData: any | null;
  resumeXrayData: any | null;
  insightsData: any | null;

  fetchRecruiterView: (resumeId: number, refresh?: boolean) => Promise<void>;
  fetchResumeXray: (resumeId: number, refresh?: boolean) => Promise<void>;
  analyzeInsights: (resumeId: number, targetRole?: string, refresh?: boolean) => Promise<void>;
  clearRecruiterView: () => void;
  clearInsights: () => void;
}

export const useInsightsStore = create<InsightsStore>((set) => ({
  isAnalyzing: false,
  error: null,
  recruiterViewData: null,
  resumeXrayData: null,
  insightsData: null,

  fetchRecruiterView: async (resumeId: number, refresh = false) => {
    set({ recruiterViewData: null, isAnalyzing: true, error: null });
    try {
      const response = await api.post('/ai/recruiter-view', { resume_id: resumeId, refresh });
      set({ recruiterViewData: response.data, isAnalyzing: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || err.message || "Failed to fetch recruiter view.", isAnalyzing: false });
    }
  },

  fetchResumeXray: async (resumeId: number, refresh = false) => {
    set({ isAnalyzing: true, error: null });
    try {
      const response = await api.post('/ai/resume-xray', { resume_id: resumeId, refresh });
      set({ resumeXrayData: response.data, isAnalyzing: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || err.message || "Failed to fetch resume xray.", isAnalyzing: false });
    }
  },

  analyzeInsights: async (resumeId: number, targetRole = "General", refresh = false) => {
    set({ isAnalyzing: true, error: null });
    try {
      const response = await api.post('/ai/career-intelligence', { 
        resume_id: resumeId,
        target_role: targetRole,
        refresh
      });
      set({ insightsData: response.data, isAnalyzing: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || err.message || "Failed to analyze career intelligence.", isAnalyzing: false });
    }
  },

  clearRecruiterView: () => set({ recruiterViewData: null, error: null, isAnalyzing: false }),

  clearInsights: () => set({ 
    recruiterViewData: null, 
    resumeXrayData: null, 
    insightsData: null,
    error: null,
    isAnalyzing: false,
  })
}));
