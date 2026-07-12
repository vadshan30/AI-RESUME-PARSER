import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export interface ValidationReport {
  score: number;
  status: 'VALID' | 'ACCEPTED' | 'WEAK' | 'INVALID';
  reason: string;
  detected_sections: Record<string, boolean>;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  chars_extracted: number;
  pages: number;
  text_preview: string;
}

export interface JobMatchResponse {
  success?: boolean;
  ats_score?: number;
  message?: string;
  resume_summary?: any;
  job_summary?: any;
  role_analysis?: any;
  match_analysis?: any;
  scores?: {
    overall_score: number;
    classification: {
      grade: string;
      color: string;
    };
    breakdown: Record<string, number>;
  };
  recommendations?: any;
  validation_report?: ValidationReport;
  /** Enhanced modules (added by report_generator STEP 10) */
  critical_gaps?: {
    gaps: Array<{
      id: string;
      skill: string;
      category: string;
      priority: string;
      type: string;
      reason: string;
      impact: string;
      estimated_score_gain: number;
    }>;
    summary: {
      total_gaps: number;
      critical_count: number;
      high_count: number;
      medium_count: number;
      low_count: number;
      estimated_total_gain: number;
    };
    missing_mandatory_skills?: string[];
    missing_preferred_skills?: string[];
    missing_certifications?: string[];
    missing_soft_skills?: string[];
    experience_gap_years?: number;
    education_gap?: string | null;
  };
  market_intelligence?: {
    salary: { india: string; usa: string; remote: string };
    next_level_salary?: { india: string; usa: string; remote: string } | null;
    next_level?: string | null;
    demand: string;
    hiring_demand?: string;
    growth_rate: string;
    competition_level: string;
    competitiveness_index?: number;
    salary_satisfaction_index?: number;
    open_positions: string;
    top_companies: string[];
    trending_skills: string[];
    industry?: string;
    promotion_potential?: string;
    market_insights: string[];
    career_outlook: string;
  };
  priority_learning_plan?: {
    phases: Record<string, {
      label?: string;
      weeks?: number[];
      focus?: string;
      tasks: Array<{
        id: string;
        week: number;
        skill: string;
        category: string;
        task: string;
        description: string;
        hours: number;
        difficulty: string;
        priority: string;
        type: string;
        resources: any[];
        impact: string;
        estimated_score_gain: number;
        completion_criteria: string;
      }>;
    }>;
    total_hours: number;
    total_weeks: number;
    weekly_commitment: number;
    daily_commitment?: number;
    total_estimated_score_gain: number;
    generated_for?: { role: string; level: string; gaps_analyzed: number };
  };
  role_info?: {
    detected_role: string;
    detected_level: string;
    requirements?: Record<string, any>;
    resume_summary?: Record<string, any>;
  };
  score_improvement?: {
    current_score: number;
    potential_score: number;
    total_gain: number;
    gap_percentage?: number;
    improvement_percentage?: number;
  };
  generated_at?: string;
}

export interface AnalysisError {
  success: boolean;
  failed_stage: string;
  reason: string;
  details: string;
  suggestion: string;
}

export interface ExtractedJD {
  requiredSkills: string[];
  softSkills: string[];
  minExperience: number;
  maxExperience: number | null;
}

interface JobMatchStore {
  analysisMode: 'role' | 'jd' | 'both';
  targetRole: string;
  jobDescription: string;
  
  isAnalyzing: boolean;
  error: AnalysisError | string | null;
  matchResult: JobMatchResponse | null;

  extractedJD: ExtractedJD | null;
  isExtracting: boolean;

  setAnalysisMode: (mode: 'role' | 'jd' | 'both') => void;
  setTargetRole: (role: string) => void;
  setJobDescription: (jd: string) => void;
  
  analyze: (resumeId: number) => Promise<void>;
  extractJD: () => Promise<void>;
  reset: () => void;
}

export const useJobMatchStore = create<JobMatchStore>()(
  persist(
    (set, get) => ({
      analysisMode: 'role',
      targetRole: '',
      jobDescription: '',
      
      isAnalyzing: false,
      error: null,
      matchResult: null,

      extractedJD: null,
      isExtracting: false,

      setAnalysisMode: (mode) => set({ analysisMode: mode, error: null }),
      setTargetRole: (role) => set({ targetRole: role, error: null }),
      setJobDescription: (jd) => set({ jobDescription: jd, error: null, extractedJD: null }),
      
      extractJD: async () => {
        const { jobDescription } = get();
        if (!jobDescription.trim()) return;

        set({ isExtracting: true, error: null });

        try {
          const response = await api.post('/api/job-match/extract-jd', {
            job_description: jobDescription
          });
          set({ extractedJD: response.data, isExtracting: false });
        } catch (err: any) {
          const errorDetail = err.response?.data?.detail;
          if (errorDetail && typeof errorDetail === 'object') {
            set({ error: errorDetail as AnalysisError, isExtracting: false });
          } else {
            set({
              error: typeof errorDetail === 'string' ? errorDetail : 'Failed to extract job description',
              isExtracting: false
            });
          }
        }
      },
      
      analyze: async (resumeId: number) => {
        const { analysisMode, targetRole, jobDescription } = get();
        
        // Validation
        if (!resumeId) {
          set({ error: "Resume not selected. Please upload or select a resume." });
          return;
        }
        if (analysisMode === 'role' && !targetRole) {
          set({ error: "Please select a target role." });
          return;
        }
        if (analysisMode === 'jd' && !jobDescription.trim()) {
          set({ error: "Job description required. Please paste a valid job description." });
          return;
        }
        if (analysisMode === 'both' && (!targetRole || !jobDescription.trim())) {
          set({ error: "Both Target Role and Job Description are required in this mode." });
          return;
        }

        set({ isAnalyzing: true, error: null, matchResult: null });

        try {
          // Add a timeout for the API call in case backend hangs
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s fallback

          const response = await api.post('/api/job-match', {
            resume_id: resumeId,
            target_role: analysisMode === 'jd' ? null : targetRole,
            job_description: analysisMode === 'role' ? null : jobDescription
          }, { signal: controller.signal });
          
          clearTimeout(timeoutId);
          set({ matchResult: response.data, isAnalyzing: false });
        } catch (err: any) {
          if (err.name === 'CanceledError' || err.code === 'ECONNABORTED') {
             set({ error: "Timeout. The analysis took too long. Please try again.", isAnalyzing: false });
          } else if (!err.response) {
             set({ error: "Backend unavailable or network disconnected.", isAnalyzing: false });
          } else {
              const errorDetail = err.response?.data?.detail;
              if (errorDetail && typeof errorDetail === 'object') {
                  set({ error: errorDetail as AnalysisError, isAnalyzing: false });
              } else {
                  let fallbackMsg = "Resume upload or processing failed.";
                  if (err.response?.status === 404) {
                      fallbackMsg = "Job Match endpoint not found";
                  } else if (err.response?.status === 500) {
                      fallbackMsg = "Internal Server Error";
                  }
                  set({ error: typeof errorDetail === 'string' ? errorDetail : fallbackMsg, isAnalyzing: false });
              }
          }
        }
      },
      
      reset: () => set({ 
        matchResult: null, 
        error: null, 
        isAnalyzing: false,
        extractedJD: null,
        isExtracting: false
      })
    }),
    {
      name: 'enterprise-job-match-storage',
      partialize: (state) => ({ 
        analysisMode: state.analysisMode,
        targetRole: state.targetRole,
        jobDescription: state.jobDescription
      })
    }
  )
);
