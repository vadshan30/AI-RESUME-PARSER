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
    lastUpdated: string;
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
    past: { year: number; title: string; achieved: boolean }[];
    future: { year: number; title: string; status: 'Planned' | 'In Progress' | 'Achieved' }[];
  };
}

export type RegenerateStep = 'idle' | 'loading_resume' | 'parsing' | 'generating' | 'done' | 'error';

interface CareerTwinStore {
  careerData: CareerTwinData | null;
  isLoading: boolean;
  error: string | null;
  selectedPath: string | null;
  regenerateStep: RegenerateStep;
  dataResumeId: number | null;
  generatedAt: Date | null;
  generateCareerTwin: (refresh?: boolean) => Promise<void>;
  updatePathSelection: (pathId: string) => void;
  refreshRecommendations: () => Promise<void>;
  clearData: () => void;
  clearError: () => void;
}

function isValidSchema(data: unknown): data is CareerTwinData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.profile === 'object' &&
    typeof d.careerHealth === 'object' &&
    Array.isArray(d.careerPaths) &&
    (d.careerPaths as unknown[]).length > 0 &&
    typeof d.skillGaps === 'object' &&
    Array.isArray(d.recommendations) &&
    typeof d.timeline === 'object'
  );
}

export const useCareerTwinStore = create<CareerTwinStore>((set, get) => ({
  careerData: null,
  isLoading: false,
  error: null,
  selectedPath: null,
  regenerateStep: 'idle',
  dataResumeId: null,
  generatedAt: null,

  generateCareerTwin: async (refresh = false) => {
    const resumeId = useResumeStore.getState().currentResumeId;
    if (!resumeId) {
      set({ error: 'Please upload and analyze a resume first.' });
      return;
    }

    const { careerData, dataResumeId, isLoading } = get();

    // Only skip if: same resume, valid data, not a forced refresh, not already loading
    if (!refresh && isValidSchema(careerData) && dataResumeId === resumeId && !isLoading) {
      return;
    }

    // If resume changed, clear stale data immediately before showing loader
    if (dataResumeId !== null && dataResumeId !== resumeId) {
      set({ careerData: null, selectedPath: null, generatedAt: null });
    }

    set({ isLoading: true, error: null, regenerateStep: 'loading_resume' });

    try {
      set({ regenerateStep: 'parsing' });
      await new Promise((r) => setTimeout(r, 300));

      set({ regenerateStep: 'generating' });
      const response = await api.post('/ai/career-twin', { resume_id: resumeId, refresh });
      const data = response.data;

      if (!isValidSchema(data)) {
        throw new Error('AI returned an incomplete response. Please retry.');
      }

      const initialPath = data.careerPaths[0]?.id ?? null;
      set({
        careerData: data,
        selectedPath: initialPath,
        isLoading: false,
        error: null,
        regenerateStep: 'done',
        dataResumeId: resumeId,
        generatedAt: new Date(),
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail ||
        (err as { message?: string })?.message ||
        'Failed to generate AI Career Twin.';
      set({ error: msg, isLoading: false, regenerateStep: 'error' });
    }
  },

  updatePathSelection: (pathId) => set({ selectedPath: pathId }),

  refreshRecommendations: async () => {
    set({ careerData: null, error: null, regenerateStep: 'idle', generatedAt: null });
    await get().generateCareerTwin(true);
  },

  // Called by useResumeStore whenever the active resume changes
  clearData: () =>
    set({
      careerData: null,
      isLoading: false,
      error: null,
      selectedPath: null,
      regenerateStep: 'idle',
      dataResumeId: null,
      generatedAt: null,
    }),

  clearError: () => set({ error: null, regenerateStep: 'idle' }),
}));
