import { create } from 'zustand';
import { useResumeStore } from './useResumeStore';
import api from '../services/api';
import { RoleProfile } from '../data/RoleKnowledgeBase';

export interface GapItem {
  name: string;
  criticality: 'High' | 'Medium' | 'Low';
  userLevel: string;
  idealLevel: string;
}

export interface SkillItem {
  name: string;
  level?: string;
  category?: string;
}

export interface ExperienceComparison {
  userYears: number;
  idealYears: number;
  gapYears: number;
  missingRoles: string[];
  leadershipGap: boolean;
}

export interface ProjectComparison {
  userCount: number;
  idealCount: number;
  gapCount: number;
  missingComplexity: string;
}

export interface EducationComparison {
  userDegree: string;
  idealDegree: string;
  degreeGap: boolean;
}

export interface CertificationComparison {
  userCount: number;
  idealCount: number;
  gapCount: number;
  missingCerts: string[];
}

export interface ATSComparison {
  userScore: number;
  idealScore: number;
  scoreGap: number;
  formattingIssues: string[];
  keywordMatches: number;
}

export interface SalaryMilestone {
  name: string;
  addedValue: number;
}

export interface SalaryEstimate {
  currentValue: number;
  idealValue: number;
  gap: number;
  milestones: SalaryMilestone[];
}

export interface CompanyReadiness {
  companyName: string;
  type: string;
  readinessScore: number;
  status: 'Ready to Apply' | 'Needs Prep' | 'Long Term Goal';
}

export interface InterviewReadiness {
  overallScore: number;
  technicalScore: number;
  behavioralScore: number;
}

export interface RoadmapStep {
  timeframe: string;
  title: string;
  description: string;
  actionItems: string[];
}

export interface Recommendation {
  category: string;
  text: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface ExecutiveSummary {
  strengths: string[];
  weaknesses: string[];
  verdict: string;
}

export interface ComparisonResult {
  overallMatchScore: number;
  resumeRating: number;
  idealRating: number;
  categoryScores: {
    name: string;
    userScore: number;
    idealScore: number;
    gap: number;
    weight: number;
    status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';
  }[];
  skillGaps: GapItem[];
  masteredSkills: SkillItem[];
  missingSkills: SkillItem[];
  criticalSkills: SkillItem[];
  experienceComparison: ExperienceComparison;
  projectComparison: ProjectComparison;
  educationComparison: EducationComparison;
  certificationComparison: CertificationComparison;
  atsComparison: ATSComparison;
  salaryEstimate: SalaryEstimate;
  companyReadiness: CompanyReadiness[];
  interviewReadiness: InterviewReadiness;
  improvementRoadmap: RoadmapStep[];
  recommendations: Recommendation[];
  executiveSummary: ExecutiveSummary;
}

export type RoleData = RoleProfile;

export interface ComparisonHistory {
  id: string;
  date: string;
  resumeId: string | number;
  targetRole: string;
  overallMatchScore: number;
}

export interface ResumeVsTopCandidateStore {
  selectedResumeId: string | number | null;
  targetRole: string | null;
  roleData: RoleData | null;
  comparisonResult: ComparisonResult | null;
  isLoading: boolean;
  error: string | null;
  history: ComparisonHistory[];

  selectResume: (resumeId: string | number) => void;
  setTargetRole: (role: string) => void;
  loadRoleData: (role: string) => Promise<RoleData>;
  runComparison: () => Promise<void>;
  generateReport: () => Promise<void>;
  saveToHistory: () => void;
  reset: () => void;
}

export const useResumeVsTopCandidateStore = create<ResumeVsTopCandidateStore>((set, get) => ({
  selectedResumeId: null,
  targetRole: 'Software Engineer',
  roleData: null,
  comparisonResult: null,
  isLoading: false,
  error: null,
  history: [],

  selectResume: (resumeId) => {
    set({ selectedResumeId: resumeId });
    // Auto run comparison if role is already set
    if (get().targetRole) {
      get().runComparison();
    }
  },

  setTargetRole: (role) => {
    set({ targetRole: role });
    if (get().selectedResumeId) {
      get().runComparison();
    }
  },

  loadRoleData: async (role) => {
    try {
      const response = await api.post('/ai/role-profile', { target_role: role });
      const profile = response.data;
      if (profile.error) {
        throw new Error(profile.error);
      }
      set({ roleData: profile });
      return profile;
    } catch (error) {
      console.error("Failed to load dynamic role profile", error);
      throw error;
    }
  },

  runComparison: async () => {
    set({ isLoading: true, error: null });
    const { selectedResumeId, targetRole, loadRoleData } = get();
    
    if (!selectedResumeId || !targetRole) {
      set({ isLoading: false, error: "Missing resume or target role." });
      return;
    }

    try {
      const roleData = await loadRoleData(targetRole);

      // Fetch the active resume from the central resume store
      const resumes = useResumeStore.getState().history;
      const activeResume = resumes.find(r => r.id === selectedResumeId);

      if (!activeResume) {
        set({ isLoading: false, error: "Resume not found." });
        return;
      }

    const analysis = activeResume.analysis_data || {};
    
    // Extract User Metrics
    const expYears = analysis.experience_years || 0;
    const isMaster = (analysis.education || []).some((e: any) => String(e.degree).toUpperCase().includes('MASTER'));
    const isPhD = (analysis.education || []).some((e: any) => String(e.degree).toUpperCase().includes('PHD'));
    const degreeLevel = isPhD ? "PhD" : isMaster ? "Master's" : "Bachelor's";
    
    // Skill Extraction
    const rawSkills = activeResume.skills || [];
    const userSkills = rawSkills.map((s: any) => typeof s === 'string' ? s : s.skill_name).map((s: string) => s.toLowerCase());
    const userSkillsCount = userSkills.length;
    
    // Intersect Skills with Role Profile
    const requiredSkills = roleData.requiredSkills || [];
    const preferredSkills = roleData.preferredSkills || [];
    const missingRequired = requiredSkills.filter((req: string) => !userSkills.some((us: string) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us)));
    const masteredRequired = requiredSkills.filter((req: string) => userSkills.some((us: string) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us)));
    const missingPreferred = preferredSkills.filter((pref: string) => !userSkills.some((us: string) => us.includes(pref.toLowerCase()) || pref.toLowerCase().includes(us)));

    const userAtsScore = activeResume.resume_score || 65;
    const userProjectsCount = (activeResume.projects || []).length;
    const userCertsCount = (activeResume.certifications || []).length || 0;

    // Determine Career Tier (Entry, Mid, Senior, Lead)
    const salaryRange = roleData.salaryRange || { entry: 500000, mid: 1000000, senior: 2000000, lead: 3000000 };
    let curSalary = salaryRange.entry;
    if (expYears >= 7) curSalary = salaryRange.lead;
    else if (expYears >= 4) curSalary = salaryRange.senior;
    else if (expYears >= 2) curSalary = salaryRange.mid;

    // Calculate Dynamic Match Score using precise weights
    const weights = roleData.scoringWeights || { experience: 20, skills: 30, ats: 20, projects: 20, education: 10 };
    
    const idealExp = roleData.idealExperience || 1;
    const expScore = Math.min(100, Math.max(0, (expYears / idealExp) * 100));
    const skillScore = Math.min(100, Math.max(0, (masteredRequired.length / Math.max(1, requiredSkills.length)) * 100));
    const atsScore = Math.min(100, Math.max(0, (userAtsScore / 90) * 100));
    const expectedProjects = roleData.expectedProjects || [];
    const projScore = Math.min(100, Math.max(0, (userProjectsCount / Math.max(1, expectedProjects.length)) * 100));
    const eduScore = degreeLevel === roleData.idealEducation || degreeLevel === 'PhD' || (degreeLevel === "Master's" && roleData.idealEducation === "Bachelor's") ? 100 : 70;

    const matchScore = Math.round(
      (expScore * (weights.experience / 100)) +
      (skillScore * (weights.skills / 100)) +
      (atsScore * (weights.ats / 100)) +
      (projScore * (weights.projects / 100)) +
      (eduScore * (weights.education / 100))
    );

    // Category Scores (for Radar)
    const getStatus = (score: number): 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical' => {
      if (score >= 90) return 'Excellent';
      if (score >= 70) return 'Good';
      if (score >= 50) return 'Needs Improvement';
      return 'Critical';
    };

    const categoryScores = [
      { name: 'Experience', userScore: Math.round(expScore), idealScore: 100, gap: Math.max(0, idealExp - expYears), weight: weights.experience || 20, status: getStatus(expScore) },
      { name: 'Skills', userScore: Math.round(skillScore), idealScore: 100, gap: missingRequired.length, weight: weights.skills || 30, status: getStatus(skillScore) },
      { name: 'Education', userScore: Math.round(eduScore), idealScore: 100, gap: 0, weight: weights.education || 10, status: getStatus(eduScore) },
      { name: 'Projects', userScore: Math.round(projScore), idealScore: 100, gap: Math.max(0, expectedProjects.length - userProjectsCount), weight: weights.projects || 20, status: getStatus(projScore) },
      { name: 'ATS Score', userScore: Math.round(atsScore), idealScore: 100, gap: Math.max(0, 90 - userAtsScore), weight: weights.ats || 20, status: getStatus(atsScore) },
    ];

    const certs = roleData.certifications || [];
    const roadmap = roleData.roadmapTemplates || { immediate: ['Learn basics'], shortTerm: ['Build projects'], longTerm: ['Master advanced topics'] };
    const idealEdu = roleData.idealEducation || "Bachelor's";
    const roleName = roleData.name || targetRole;
    const topCompanies = roleData.topCompanies || [];

    // Company Readiness
    const companyReadiness: CompanyReadiness[] = topCompanies.map(c => {
      const companyScore = Math.max(10, matchScore - (c.diff === 'Very High' ? 25 : c.diff === 'High' ? 15 : 5));
      return {
        companyName: c.name,
        type: c.type,
        readinessScore: companyScore,
        status: companyScore >= 70 ? 'Ready to Apply' : companyScore >= 50 ? 'Needs Prep' : 'Long Term Goal'
      };
    });

    const comparisonResult: ComparisonResult = {
      overallMatchScore: matchScore,
      resumeRating: matchScore / 20, // 5 star scale
      idealRating: 5,
      categoryScores,
      skillGaps: missingRequired.map(skill => ({ name: skill, criticality: 'High', userLevel: 'None', idealLevel: 'Intermediate' })),
      masteredSkills: masteredRequired.map(skill => ({ name: skill, level: 'Advanced' })),
      missingSkills: missingPreferred.map(skill => ({ name: skill, level: 'Intermediate' })),
      criticalSkills: missingRequired.slice(0, 3).map(skill => ({ name: skill, level: 'Advanced' })),
      experienceComparison: {
        userYears: expYears,
        idealYears: idealExp,
        gapYears: Math.max(0, idealExp - expYears),
        missingRoles: expYears < idealExp ? ['Senior Capabilities'] : [],
        leadershipGap: expYears < 5
      },
      projectComparison: {
        userCount: userProjectsCount,
        idealCount: expectedProjects.length,
        gapCount: Math.max(0, expectedProjects.length - userProjectsCount),
        missingComplexity: `Missing role-specific projects like: ${expectedProjects.slice(0,2).join(', ')}`
      },
      educationComparison: {
        userDegree: degreeLevel,
        idealDegree: idealEdu,
        degreeGap: degreeLevel !== idealEdu
      },
      certificationComparison: {
        userCount: userCertsCount,
        idealCount: certs.length,
        gapCount: Math.max(0, certs.length - userCertsCount),
        missingCerts: certs
      },
      atsComparison: {
        userScore: userAtsScore,
        idealScore: 90,
        scoreGap: Math.max(0, 90 - userAtsScore),
        formattingIssues: ['Optimize action verbs for the target role'],
        keywordMatches: Math.round(userSkillsCount)
      },
      salaryEstimate: {
        currentValue: curSalary,
        idealValue: salaryRange.lead,
        gap: Math.max(0, salaryRange.lead - curSalary),
        milestones: [
          { name: `Learn ${missingRequired[0] || 'core skill'}`, addedValue: Math.round(Math.max(0, salaryRange.lead - curSalary) * 0.15) },
          { name: `Attain ${certs[0] || 'Certification'}`, addedValue: Math.round(Math.max(0, salaryRange.lead - curSalary) * 0.35) },
          { name: `Reach ${idealExp} Years Exp`, addedValue: Math.round(Math.max(0, salaryRange.lead - curSalary) * 0.5) }
        ]
      },
      companyReadiness,
      interviewReadiness: {
        overallScore: Math.round(matchScore * 0.9),
        technicalScore: Math.round(matchScore * 0.85),
        behavioralScore: Math.round(matchScore * 0.95)
      },
      improvementRoadmap: [
        {
          timeframe: 'Immediate (This Week)',
          title: 'Core Fundamentals',
          description: 'Acquire immediate missing required skills.',
          actionItems: roadmap.immediate || ['Review basics']
        },
        {
          timeframe: 'Short Term (1 Month)',
          title: 'Role Specifics',
          description: 'Build role-specific projects and competencies.',
          actionItems: roadmap.shortTerm || ['Build 1 project']
        },
        {
          timeframe: 'Long Term (3-6 Months)',
          title: 'Senior Capabilities',
          description: 'Closing the gap for FAANG level roles.',
          actionItems: roadmap.longTerm || ['Learn architecture']
        }
      ],
      recommendations: [
        { category: 'Skills', text: `You are missing ${missingRequired.length} core required skills for ${roleName}. Focus on ${missingRequired.slice(0,3).join(', ')} immediately.`, impact: 'High' }
      ],
      executiveSummary: {
        strengths: ['Solid foundational structure'],
        weaknesses: missingRequired.length > 0 ? [`Missing ${missingRequired.length} core skills`] : ['Needs more advanced projects'],
        verdict: `You have ${matchScore}% match for a ${roleName} role.`
      }
    };

    set({ comparisonResult, isLoading: false });
    } catch (err: any) {
      console.error("Error in runComparison:", err);
      set({ isLoading: false, error: err.message || "Failed to generate comparison." });
    }
  },

  generateReport: async () => {
    // Generate PDF logic would go here
    console.log("Generating report...");
  },

  saveToHistory: () => {
    const { comparisonResult, selectedResumeId, targetRole, history } = get();
    if (comparisonResult && selectedResumeId && targetRole) {
      set({
        history: [...history, {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          resumeId: selectedResumeId,
          targetRole,
          overallMatchScore: comparisonResult.overallMatchScore
        }]
      });
    }
  },

  reset: () => {
    set({ comparisonResult: null, roleData: null, error: null });
  }
}));
