import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface RoadmapStore {
  selectedRole: string;
  missingSkills: string[];
  isGenerating: boolean;
  error: string | null;
  roadmapData: any | null;

  setSelectedRole: (role: string) => void;
  setMissingSkills: (skills: string[]) => void;
  generateRoadmap: () => Promise<void>;
  clearRoadmap: () => void;
  toggleTaskCompletion: (phaseId: number, taskIndex: number) => void;
}

function isValidRoadmapData(data: unknown): boolean {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.role_name === 'string' &&
    typeof d.timeline === 'object' && d.timeline !== null &&
    typeof d.salary_growth === 'object' && d.salary_growth !== null &&
    Array.isArray(d.phases) &&
    Array.isArray(d.weekly_plan) &&
    Array.isArray(d.missing_skills_targeted)
  );
}

export const useRoadmapGeneratorStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      selectedRole: '',
      missingSkills: [],
      isGenerating: false,
      error: null,
      roadmapData: null,

      setSelectedRole: (role) => set({ selectedRole: role, error: null }),
      setMissingSkills: (skills) => set({ missingSkills: skills }),

      generateRoadmap: async () => {
        const { selectedRole, missingSkills } = get();
        
        if (!selectedRole) {
          set({ error: "Please select a target career to generate a roadmap." });
          return;
        }

        set({ isGenerating: true, error: null, roadmapData: null });

        try {
          const response = await api.post('/ai/career-roadmap', {
            category: selectedRole,
            missing_skills: missingSkills.length > 0 ? missingSkills : ["System Design", "Cloud Architecture"]
          });

          set({ roadmapData: response.data, isGenerating: false });
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message || "Failed to generate roadmap.", isGenerating: false });
        }
      },

      clearRoadmap: () => set({ roadmapData: null, error: null }),

      toggleTaskCompletion: (phaseId: number, taskIndex: number) => {
        const { roadmapData } = get();
        if (!roadmapData) return;

        const newPhases = roadmapData.phases.map((phase: any) => {
          if (phase.id === phaseId) {
            const newTasks = [...phase.tasks];
            newTasks[taskIndex].completed = !newTasks[taskIndex].completed;
            return { ...phase, tasks: newTasks };
          }
          return phase;
        });

        set({ roadmapData: { ...roadmapData, phases: newPhases } });
      }
    }),
    {
      name: 'roadmap-generator-storage-v2',
      partialize: (state) => ({ roadmapData: state.roadmapData, selectedRole: state.selectedRole }),
      onRehydrateStorage: () => (state) => {
        if (state?.roadmapData && !isValidRoadmapData(state.roadmapData)) {
          state.roadmapData = null;
        }
      },
    }
  )
);
