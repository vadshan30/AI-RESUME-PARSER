import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export interface BackendResumeData {
  id: number;
  filename: string;
  name: string;
  email: string;
  phone: string;
  resume_score: number;
  analysis_data: any;
  skills: { id: number; skill_name: string }[];
  experience: { id: number; experience_detail: string }[];
  education: { id: number; degree_name: string }[];
  projects: { id: number; project_name: string }[];
  created_at: string;
}

interface ResumeState {
  currentResume: BackendResumeData | null;
  currentResumeId: number | null;
  history: BackendResumeData[];
  isAnalyzing: boolean;
  error: string | null;
  
  uploadResume: (file: File, targetRole?: string) => Promise<void>;
  clearHistory: () => void;
  setCurrentResumeId: (id: number) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      currentResume: null,
      currentResumeId: null,
      history: [],
      isAnalyzing: false,
      error: null,

      uploadResume: async (file: File, targetRole?: string) => {
        set({ isAnalyzing: true, error: null });
        try {
          if (!file.name.toLowerCase().endsWith('.pdf')) {
            throw new Error("Only PDF files are supported by the backend.");
          }

          const formData = new FormData();
          formData.append('file', file);
          if (targetRole) {
            formData.append('target_role', targetRole);
          }

          const response = await api.post('/resume/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });

          const backendData: BackendResumeData = response.data;
          
          const newHistory = [backendData, ...get().history].slice(0, 5); // Keep last 5

          set({ 
            currentResume: backendData,
            currentResumeId: backendData.id,
            history: newHistory,
            isAnalyzing: false 
          });
        } catch (error: any) {
          console.error("Upload Error:", error);
          const errorMsg = error.response?.data?.detail || error.message || "Failed to upload resume";
          set({ error: errorMsg, isAnalyzing: false });
          throw error;
        }
      },
      
      setCurrentResumeId: (id: number) => {
        const historyItem = get().history.find(h => h.id === id);
        if (historyItem) {
          set({ currentResumeId: id, currentResume: historyItem });
        }
      },

      clearHistory: () => set({ history: [], currentResume: null, currentResumeId: null })
    }),
    {
      name: 'resume-global-storage'
    }
  )
);
