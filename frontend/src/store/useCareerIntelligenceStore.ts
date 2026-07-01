import { create } from 'zustand';
import api from '../services/api';
import { useResumeStore } from './useResumeStore';

interface CareerIntelligenceStore {
  isAnalyzing: boolean;
  error: string | null;
  analysisData: any | null;

  analyzeCareer: () => Promise<void>;
  clearAnalysis: () => void;
}

export const useCareerIntelligenceStore = create<CareerIntelligenceStore>((set) => ({
  isAnalyzing: false,
  error: null,
  analysisData: null,

  analyzeCareer: async () => {
    const resumeId = useResumeStore.getState().currentResumeId;
    if (!resumeId) {
      set({ error: "Please upload and analyze a resume first." });
      return;
    }

    set({ isAnalyzing: true, error: null, analysisData: null });

    try {
      const response = await api.post('/ai/career-intelligence', {
        resume_id: resumeId
      });

      set({ analysisData: response.data, isAnalyzing: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || err.message || "Failed to analyze career.", isAnalyzing: false });
    }
  },

  clearAnalysis: () => set({ analysisData: null, error: null })
}));
