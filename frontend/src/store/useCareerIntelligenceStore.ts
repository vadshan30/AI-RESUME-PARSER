import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';
import { useResumeStore } from './useResumeStore';

interface CareerIntelligenceStore {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  isAnalyzing: boolean;
  error: string | null;
  analysisData: any | null;
  lastAnalyzedResumeId: number | null;

  analyzeCareer: () => Promise<void>;
  clearAnalysis: () => void;
  clearData: () => void;
}

function mapBackendResponse(data: any, targetRole?: string) {
  if (!data || typeof data !== 'object') return data;

  const role = targetRole || data.detected_role || data.career_stage || 'Software Engineer';
  const readiness = data.readiness_breakdown || {};
  const radar = data.skill_balance_radar || readiness;

  return {
    _resume_id: data._resume_id,
    _target_role: data._target_role,
    target_career: {
      role_name: data.detected_role || role,
      category: data.detected_domain || data.career_stage || 'Mid-Level',
      industry_demand: data.industry_demand || {},
      salary_range: data.salary_estimation || {},
      learning_recommendations: Object.fromEntries(
        (data.learning_priorities || []).map((lp: any) => [
          lp.skill,
          { priority: lp.priority || 'Medium', hours: lp.estimated_time || '4 weeks', why: lp.reason || '' },
        ])
      ),
      resume_summary: data.resume_summary || '',
      strongest_skills: data.strongest_skills || [],
      missing_skills: data.missing_skills || [],
      skill_gap_analysis: data.skill_gap_analysis || '',
      experience_assessment: data.experience_assessment || '',
      project_quality: data.project_quality || '',
      leadership_evaluation: data.leadership_evaluation || '',
      communication_evaluation: data.communication_evaluation || '',
      ai_coach_advice: data.ai_coach_advice || '',
      action_plan_30_days: data.action_plan_30_days || [],
      action_plan_60_days: data.action_plan_60_days || [],
      action_plan_90_days: data.action_plan_90_days || [],
      interview_topics: data.interview_topics || [],
      recommended_projects: data.recommended_projects || [],
      recommended_technologies: data.recommended_technologies || [],
      long_term_roadmap: data.long_term_roadmap || [],
      promotion_readiness: data.promotion_readiness || {},
    },
    analysis: {
      readiness: {
        overall: data.career_readiness_score || data.target_role_match || 0,
        technical: radar.Technical || readiness.technical || 0,
        industry: radar.Experience || readiness.experience || 0,
        interview: radar['Soft Skills'] || readiness.soft_skills || 0,
      },
      progress_bars: radar,
      critical_gaps: data.critical_gaps || [],
      high_priority_items: data.high_priority_items || [],
      optional_skills: data.optional_skills || [],
      missing_critical: [
        ...((data.critical_gaps || []).map((g: any) => ({
          skill: g.skill,
          severity: g.priority || 'Critical',
          reason: g.reason || '',
          industry_demand: g.industry_demand || '',
          companies_requiring: g.companies_requiring || [],
          ats_impact: g.ats_impact || '',
        }))),
        ...((data.career_risk_factors || []).slice(0, 3).map((f: string) => ({
          skill: f,
          severity: 'High',
          reason: f,
        }))),
      ],
      optional: (data.recommended_technologies || data.optional_skills || []).map((s: string) => ({ skill: s })),
      transitions: (data.alternative_roles || []).map((r: any) => ({
        role: r.role || '',
        added_skills: r.skills_to_add || [],
        match_percent: r.match_percent || 0,
        reason: r.reason || '',
      })),
      certifications: (data.recommended_certifications || []).map((c: any) =>
        typeof c === 'string' ? { name: c, difficulty: 'Medium', duration: '2 months', career_impact: 'Medium' } : c
      ),
      risk_factors: data.career_risk_factors || [],
    },
  };
}

export const useCareerIntelligenceStore = create<CareerIntelligenceStore>()(
  persist(
    (set, get) => ({
      selectedRole: '',
      setSelectedRole: (role) => set({ selectedRole: role }),
      isAnalyzing: false,
      error: null,
      analysisData: null,
      lastAnalyzedResumeId: null,

      analyzeCareer: async () => {
        const resumeId = useResumeStore.getState().currentResumeId;
        if (!resumeId) {
          set({ error: 'Please upload a resume first.' });
          return;
        }

        set({ isAnalyzing: true, error: null, analysisData: null });

        try {
          const response = await api.post('/ai/career-intelligence', {
            resume_id: resumeId,
            target_role: get().selectedRole || undefined,
          });
          const mapped = mapBackendResponse(response.data, get().selectedRole);
          set({ analysisData: mapped, isAnalyzing: false, lastAnalyzedResumeId: resumeId });
        } catch (err: any) {
          set({
            error: err.response?.data?.detail || err.message || 'Unable to generate Career Intelligence.',
            isAnalyzing: false,
          });
        }
      },

      clearAnalysis: () => set({ analysisData: null, error: null, lastAnalyzedResumeId: null }),

      clearData: () => set({ analysisData: null, error: null, lastAnalyzedResumeId: null }),
    }),
    {
      name: 'career-intelligence-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedRole: state.selectedRole }),
    },
  ),
);
