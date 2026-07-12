import { create } from 'zustand';
import api from '../services/api';
import { uploadResumeFile } from '../services/resumeUploadService';
import { parseUploadError } from '../utils/resumeUpload';
import { useResumeStore } from './useResumeStore';

export interface SavedResume {
  id: string | number;
  userId?: string;
  name: string;
  role?: string;
  skills: any[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  lastUpdated?: string;
  projects?: any[];
  analysis_data?: any;
  resume_score?: number;
  filename?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const mockCurrentUser: User | null = null;

interface UserStore {
  currentUser: User | null;
  resumes: SavedResume[];
  isLoading: boolean;
  error: string | null;

  setCurrentUser: (user: User | null) => void;
  getResumesForCurrentUser: () => SavedResume[];
  fetchResumes: () => Promise<void>;
  uploadResume: (file: File, targetRole?: string) => Promise<SavedResume | null>;
  deleteResume: (resumeId: string | number) => Promise<boolean>;
  renameResume: (resumeId: string | number, newName: string) => Promise<boolean>;
  duplicateResume: (resumeId: string | number) => Promise<boolean>;
}

const apiBase = () => import.meta.env.VITE_API_URL?.trim() || '';

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: mockCurrentUser,
  resumes: [],
  isLoading: false,
  error: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  getResumesForCurrentUser: () => get().resumes,

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/resume/');
      const data = res.data as SavedResume[];
      const storedIds = JSON.parse(sessionStorage.getItem('my_uploaded_resume_ids') || '[]');
      const myResumes = data.filter((r) => storedIds.includes(r.id));
      set({ resumes: myResumes, isLoading: false });
    } catch (err: unknown) {
      set({ error: parseUploadError(err), isLoading: false });
    }
  },

  uploadResume: async (file, targetRole) => {
    set({ isLoading: true, error: null });
    try {
      const { resume: newResume } = await uploadResumeFile(file, targetRole);
      const newHistory = [newResume, ...useResumeStore.getState().history.filter((h) => h.id !== newResume.id)].slice(0, 10);
      useResumeStore.setState({
        currentResume: newResume,
        currentResumeId: newResume.id,
        history: newHistory,
      });
      set({ resumes: [newResume as SavedResume, ...get().resumes], isLoading: false });
      return newResume as SavedResume;
    } catch (err: unknown) {
      const message = parseUploadError(err);
      set({ error: message, isLoading: false });
      return null;
    }
  },

  deleteResume: async (resumeId) => {
    try {
      await api.delete(`/resume/${resumeId}`);
      const storedIds = JSON.parse(sessionStorage.getItem('my_uploaded_resume_ids') || '[]');
      const newStoredIds = storedIds.filter((id: number | string) => id !== resumeId);
      sessionStorage.setItem('my_uploaded_resume_ids', JSON.stringify(newStoredIds));
      set({ resumes: get().resumes.filter((r) => r.id !== resumeId), isLoading: false });
      return true;
    } catch (err: unknown) {
      set({ error: parseUploadError(err) });
      return false;
    }
  },

  renameResume: async (resumeId, newName) => {
    try {
      const res = await api.put(`/resume/${resumeId}/rename`, { name: newName });
      const updatedResume = res.data;
      set({ resumes: get().resumes.map((r) => (r.id === resumeId ? updatedResume : r)) });
      return true;
    } catch (err: unknown) {
      set({ error: parseUploadError(err) });
      return false;
    }
  },

  duplicateResume: async (resumeId) => {
    try {
      const res = await api.post(`/resume/${resumeId}/duplicate`);
      const duplicatedResume = res.data;
      set({ resumes: [...get().resumes, duplicatedResume] });
      return true;
    } catch (err: unknown) {
      set({ error: parseUploadError(err) });
      return false;
    }
  },
}));

export { apiBase };
