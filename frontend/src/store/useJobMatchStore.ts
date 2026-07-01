import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useResumeStore } from './useResumeStore';
import { MatchScore } from '../lib/MatchAnalyzer';

export interface ExtractedJD {
  minExperience: number;
  maxExperience?: number;
  requiredSkills: string[];
  softSkills: string[];
}

export interface MatchHistory {
  id: string;
  resumeId: string;
  jobDescription: string;
  targetRole: string;
  matchScore: MatchScore;
  date: string;
}

interface JobMatchStore {
  jobDescription: string; 
  selectedRole: string;
  matchResult: MatchScore | null;
  history: MatchHistory[];
  isAnalyzing: boolean;
  isExtracting: boolean;
  extractedJD: ExtractedJD | null;
  error: string | null;

  setJobDescription: (text: string) => void;
  setSelectedRole: (role: string) => void;
  extractJD: () => Promise<void>;
  analyzeMatch: () => Promise<void>;
  clearResults: () => void;
  saveMatch: () => void;
}

export const useJobMatchStore = create<JobMatchStore>()(
  persist(
    (set, get) => ({
      jobDescription: '',
      selectedRole: '',
      matchResult: null,
      history: [],
      isAnalyzing: false,
      isExtracting: false,
      extractedJD: null,
      error: null,

      setJobDescription: (text) => set({ jobDescription: text }),
      setSelectedRole: (role) => set({ selectedRole: role }),
      
      extractJD: async () => {
        const { jobDescription } = get();
        if (!jobDescription.trim()) return;
        
        set({ isExtracting: true, error: null });
        
        // This can be further replaced with a backend call in the future
        return new Promise((resolve) => {
          setTimeout(() => {
            const textLower = jobDescription.toLowerCase();
            const skills = ["React", "Python", "Java", "Node", "AWS", "Docker", "SQL"].filter(s => textLower.includes(s.toLowerCase()));
            const soft = ["Communication", "Leadership", "Agile"].filter(s => textLower.includes(s.toLowerCase()));
            
            set({ 
              extractedJD: {
                minExperience: 3,
                requiredSkills: skills,
                softSkills: soft
              }, 
              isExtracting: false 
            });
            resolve();
          }, 1000);
        });
      },

      clearResults: () => set({ matchResult: null, jobDescription: '', selectedRole: '', extractedJD: null }),

      saveMatch: () => {
        const { matchResult, jobDescription, selectedRole, history } = get();
        if (!matchResult) return;
        
        const resumeId = useResumeStore.getState().currentResumeId?.toString() || 'unknown';

        const newHistory: MatchHistory = {
          id: Date.now().toString(),
          resumeId,
          jobDescription: jobDescription.substring(0, 100) + '...',
          targetRole: selectedRole || 'Unknown Role',
          matchScore: matchResult,
          date: new Date().toISOString()
        };
        set({ history: [newHistory, ...history] });
      },

      analyzeMatch: async () => {
        const { selectedRole, jobDescription } = get();
        const resumeId = useResumeStore.getState().currentResumeId;
        
        if (!selectedRole) {
          set({ error: "Please select a target role." });
          return;
        }
        
        if (!jobDescription.trim()) {
          set({ error: "Please paste a job description." });
          return;
        }

        if (!resumeId) {
          set({ error: "Please upload and analyze a resume first." });
          return;
        }

        set({ isAnalyzing: true, error: null, matchResult: null });

        try {
          const response = await api.post('/ai/match-job', {
            resume_id: resumeId,
            job_description: jobDescription
          });
          
          set({ matchResult: response.data, isAnalyzing: false });
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message || "Failed to analyze job match.", isAnalyzing: false });
        }
      }
    }),
    {
      name: 'job-match-storage-v5',
      partialize: (state) => ({ history: state.history }) 
    }
  )
);
