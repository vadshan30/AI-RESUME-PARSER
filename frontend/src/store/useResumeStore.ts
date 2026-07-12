import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';
import { uploadResumeFile } from '../services/resumeUploadService';
import { parseUploadError } from '../utils/resumeUpload';
import { useInsightsStore } from './useInsightsStore';
import { useCareerTwinStore } from './useCareerTwinStore';
import { useCareerIntelligenceStore } from './useCareerIntelligenceStore';
// NOTE: Career Intelligence analysis is NOT triggered here.
// It runs ONLY when the user clicks "Run Career Analysis" in the Career Insights UI.

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
  certifications?: any[];
  created_at: string;
}

interface ResumeState {
  currentResume: BackendResumeData | null;
  currentResumeId: number | null;
  history: BackendResumeData[];
  isAnalyzing: boolean;
  error: string | null;

  uploadResume: (file: File, targetRole?: string) => Promise<BackendResumeData | null>;
  deleteResume: (id: number) => Promise<void>;
  clearHistory: () => void;
  setCurrentResumeId: (id: number) => void;
  fetchResumeById: (id: number) => Promise<BackendResumeData | null>;
}

const invalidateAll = () => {
  useInsightsStore.getState().clearInsights();
  useCareerTwinStore.getState().clearData();
  useCareerIntelligenceStore.getState().clearData();
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      currentResume: null,
      currentResumeId: null,
      history: [],
      isAnalyzing: false,
      error: null,

      uploadResume: async (file: File, targetRole?: string) => {
        invalidateAll();
        set({ isAnalyzing: true, error: null });
        try {
          const { resume: backendData } = await uploadResumeFile(file, targetRole);
          const newHistory = [backendData, ...get().history.filter((h) => h.id !== backendData.id)].slice(0, 10);

          set({
            currentResume: backendData,
            currentResumeId: backendData.id,
            history: newHistory,
            isAnalyzing: false,
            error: null,
          });
          return backendData;
        } catch (error: unknown) {
          const errorMsg = parseUploadError(error);
          set({ error: errorMsg, isAnalyzing: false });
          throw new Error(errorMsg);
        }
      },

      fetchResumeById: async (id: number) => {
        invalidateAll();
        try {
          const response = await api.get(`/resume/${id}`);
          const backendData: BackendResumeData = response.data;
          const newHistory = [backendData, ...get().history.filter((h) => h.id !== backendData.id)].slice(0, 10);
          
          sessionStorage.setItem('active_resume_id', String(backendData.id));
          if (localStorage.getItem('remember_resume') === 'true') {
            localStorage.setItem('active_resume_id', String(backendData.id));
          } else {
            localStorage.removeItem('active_resume_id');
          }

          set({ currentResume: backendData, currentResumeId: backendData.id, history: newHistory });
          return backendData;
        } catch (err) {
          console.error('fetchResumeById failed:', err);
          return null;
        }
      },

      deleteResume: async (id: number) => {
        try {
          await api.delete(`/resume/${id}`);
          const newHistory = get().history.filter((h) => h.id !== id);
          const cleared = get().currentResumeId === id;
          if (cleared) {
            sessionStorage.removeItem('active_resume_id');
            localStorage.removeItem('active_resume_id');
          }
          set({
            history: newHistory,
            currentResumeId: cleared ? null : get().currentResumeId,
            currentResume: cleared ? null : get().currentResume,
          });
        } catch (error: unknown) {
          console.error('Delete Error:', error);
          throw error;
        }
      },

      setCurrentResumeId: (id: number) => {
        invalidateAll();
        const historyItem = get().history.find((h) => h.id === id);
        if (historyItem) {
          sessionStorage.setItem('active_resume_id', String(id));
          if (localStorage.getItem('remember_resume') === 'true') {
            localStorage.setItem('active_resume_id', String(id));
          } else {
            localStorage.removeItem('active_resume_id');
          }
          set({ currentResumeId: id, currentResume: historyItem });
        }
      },

      clearHistory: () => {
        sessionStorage.removeItem('active_resume_id');
        localStorage.removeItem('active_resume_id');
        set({ history: [], currentResume: null, currentResumeId: null });
      },
    }),
    {
      name: 'resume-local-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          if (localStorage.getItem('remember_resume') === 'true') {
            return localStorage.getItem(name);
          }
          return sessionStorage.getItem(name);
        },
        setItem: (name: string, value: string) => {
          sessionStorage.setItem(name, value);
          if (localStorage.getItem('remember_resume') === 'true') {
            localStorage.setItem(name, value);
          } else {
            localStorage.removeItem(name);
          }
        },
        removeItem: (name: string) => {
          sessionStorage.removeItem(name);
          localStorage.removeItem(name);
        },
      })),
    },
  ),
);
