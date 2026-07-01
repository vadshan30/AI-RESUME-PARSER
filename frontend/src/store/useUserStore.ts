import { create } from 'zustand';

export interface SavedResume {
  id: string | number; // Updated to accept DB IDs
  userId?: string;
  name: string;
  role?: string;
  skills: any[]; // The DB returns a list of skill objects or strings
  experience?: any[]; // The DB returns a list of experience objects
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

const mockCurrentUser: User = {
  id: "user_123",
  name: "Sri Vadshan",
  email: "sri@example.com",
};

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

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: mockCurrentUser,
  resumes: [],
  isLoading: false,
  error: null,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  getResumesForCurrentUser: () => {
    // The DB returns all resumes currently since we haven't implemented full multi-tenant auth
    return get().resumes;
  },

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('http://localhost:8000/resume/');
      if (!res.ok) throw new Error("Failed to fetch resumes");
      const data = await res.json();
      set({ resumes: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  
  uploadResume: async (file, targetRole) => {
    set({ isLoading: true, error: null });
    const formData = new FormData();
    formData.append("file", file);
    if (targetRole) formData.append("target_role", targetRole);

    try {
      const res = await fetch('http://localhost:8000/resume/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const newResume = await res.json();
      set({ resumes: [...get().resumes, newResume], isLoading: false });
      return newResume;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },
  
  deleteResume: async (resumeId) => {
    try {
      const res = await fetch(`http://localhost:8000/resume/${resumeId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      set({ resumes: get().resumes.filter(r => r.id !== resumeId) });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  renameResume: async (resumeId, newName) => {
    try {
      const res = await fetch(`http://localhost:8000/resume/${resumeId}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (!res.ok) throw new Error("Rename failed");
      const updatedResume = await res.json();
      set({ resumes: get().resumes.map(r => r.id === resumeId ? updatedResume : r) });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  duplicateResume: async (resumeId) => {
    try {
      const res = await fetch(`http://localhost:8000/resume/${resumeId}/duplicate`, { method: 'POST' });
      if (!res.ok) throw new Error("Duplicate failed");
      const duplicatedResume = await res.json();
      set({ resumes: [...get().resumes, duplicatedResume] });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  }
}));
