import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CareerRoadmap } from '../data/roadmaps/types';
import { getRoadmapById, generateRoadmapDynamically } from '../data/roadmaps/db';
import { useUserStore } from './useUserStore';

export interface GapAnalysisData {
  matchScore: number;
  alreadyHave: string[];
  needToLearn: string[];
  missingExperience: string;
  missingProjects: string[];
  missingCertifications: string[];
}

interface RoadmapStore {
  selectedResumeId: string;
  targetRole: string;
  
  roadmap: CareerRoadmap | null;
  gapAnalysis: GapAnalysisData | null;
  
  isLoading: boolean;
  error: string | null;

  setTargetRole: (role: string) => void;
  selectResume: (id: string) => void;
  
  generateRoadmap: () => Promise<void>;
  clearRoadmap: () => void;
}

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      selectedResumeId: '',
      targetRole: '',
      
      roadmap: null,
      gapAnalysis: null,
      
      isLoading: false,
      error: null,

      setTargetRole: (role) => set({ targetRole: role }),
      selectResume: (id) => set({ selectedResumeId: id }),
      clearRoadmap: () => set({ roadmap: null, gapAnalysis: null, targetRole: '' }),

      generateRoadmap: async () => {
        const { selectedResumeId, targetRole } = get();
        
        if (!targetRole.trim()) {
          set({ error: "Please enter a target role." });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const userResumes = useUserStore.getState().getResumesForCurrentUser();
          const resume = userResumes.find(r => r.id === selectedResumeId);
          
          if (!resume) {
            set({ error: "Invalid resume selected. Please select a valid profile.", isLoading: false });
            return;
          }

          // 1. Fetch or Generate Roadmap
          let roadmapId = targetRole.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          let roadmapData = getRoadmapById(roadmapId);
          
          if (!roadmapData) {
            // AI Fallback Generation
            roadmapData = await generateRoadmapDynamically(targetRole);
          }

          // 2. Perform AI Gap Analysis (Phase 14)
          // Cross-reference user resume with roadmap core skills
          const userSkillsLower = resume.skills.map(s => s.toLowerCase());
          const alreadyHave = roadmapData.coreSkills.filter(s => userSkillsLower.some(us => s.toLowerCase().includes(us) || us.includes(s.toLowerCase())));
          const needToLearn = roadmapData.coreSkills.filter(s => !alreadyHave.includes(s));
          
          const matchScore = Math.round((alreadyHave.length / roadmapData.coreSkills.length) * 100) || 0;
          
          // Generate missing metrics
          const expNeeded = parseInt(roadmapData.careerProgression[1]?.timeline.split('-')[0]) || 2;
          const userExpYears = resume.experience?.length || 0;
          const missingExp = userExpYears < expNeeded ? `${expNeeded - userExpYears} more years required for mid-level` : 'Meets experience requirements';
          
          const gapAnalysis: GapAnalysisData = {
            matchScore,
            alreadyHave,
            needToLearn,
            missingExperience: missingExp,
            missingProjects: ["Enterprise Deployment", "CI/CD Pipeline"], // Mock AI evaluation
            missingCertifications: roadmapData.certifications.map(c => c.name)
          };

          set({ roadmap: roadmapData, gapAnalysis, isLoading: false });

        } catch (err) {
          console.error(err);
          set({ error: "Failed to generate roadmap.", isLoading: false });
        }
      }
    }),
    {
      name: 'career-roadmap-storage'
    }
  )
);
