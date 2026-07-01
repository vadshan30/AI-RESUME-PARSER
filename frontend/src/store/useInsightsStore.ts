import { create } from 'zustand';
import api from '../services/api';

interface InsightsStore {
  isAnalyzing: boolean;
  error: string | null;
  hiringProbabilityData: any | null;
  recruiterViewData: any | null;
  resumeXrayData: any | null;

  fetchHiringProbability: (resumeId: number, refresh?: boolean) => Promise<void>;
  fetchRecruiterView: (resumeId: number, refresh?: boolean) => Promise<void>;
  fetchResumeXray: (resumeId: number, refresh?: boolean) => Promise<void>;
  analyzeInsights: (resumeData: any) => Promise<void>;
  clearInsights: () => void;
  insightsData: any | null;
}

export const useInsightsStore = create<InsightsStore>((set) => ({
  isAnalyzing: false,
  error: null,
  hiringProbabilityData: null,
  recruiterViewData: null,
  resumeXrayData: null,
  insightsData: null,

  fetchHiringProbability: async (resumeId: number, refresh = false) => {
    set({ isAnalyzing: true, error: null });
    try {
      const response = await api.post('/ai/hiring-probability', { resume_id: resumeId, refresh });
      set({ hiringProbabilityData: response.data, isAnalyzing: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || err.message || "Failed to fetch hiring probability.", isAnalyzing: false });
    }
  },

  fetchRecruiterView: async (resumeId: number, refresh = false) => {
    set({ isAnalyzing: true, error: null });
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

  analyzeInsights: async (resumeData: any) => {
    set({ isAnalyzing: true, error: null });
    // Mock processing delay
    setTimeout(() => {
      set({
        isAnalyzing: false,
        insightsData: {
          primary_domain: "Software",
          dna: { 'Innovation': 85, 'Leadership': 70, 'Technical Depth': 92, 'Problem Solving': 88, 'Communication': 75, 'Adaptability': 80 },
          readiness: { overall: 82, technical: 90, ats_score: 74 },
          success_probability: { current: 65, after_upskilling: 88, after_portfolio: 95 },
          top_matches: [
            { role: "Frontend Architect", match_percentage: 94, reason: "Strong alignment with React and modern UI patterns." },
            { role: "Full Stack Engineer", match_percentage: 86, reason: "Good cross-functional skills but backend needs some depth." }
          ],
          salary_intelligence: {
            "North America": { Entry: "$90k", Mid: "$140k", Senior: "$180k" },
            "Europe": { Entry: "€60k", Mid: "€90k", Senior: "€120k" },
          },
          market_demand: {
            "remote_jobs_available": "24,500+",
            "yoy_growth": "14%",
          },
          timeline: [
            { title: "Mid-Level Engineer", years: "1-3", milestone: "Mastered core frameworks and independent delivery." },
            { title: "Senior Engineer", years: "3-5", milestone: "System design and cross-team leadership." }
          ],
          certifications: [
            { name: "AWS Certified Solutions Architect", difficulty: "Hard", time: "4 Months", impact: "Very High" },
            { name: "Certified Kubernetes Administrator", difficulty: "Hard", time: "3 Months", impact: "High" }
          ],
          ai_advice: [
            "Your technical depth is excellent, but highlighting leadership experiences could unlock senior roles faster.",
            "Consider contributing to open-source projects to boost your public profile."
          ]
        }
      });
    }, 1500);
  },

  clearInsights: () => set({ 
    hiringProbabilityData: null, 
    recruiterViewData: null, 
    resumeXrayData: null, 
    insightsData: null,
    error: null 
  })
}));
