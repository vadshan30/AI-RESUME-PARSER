export interface RoleAnalysisData {
  // Identity
  roleName: string;
  category: 'Frontend' | 'Backend' | 'Full Stack' | 'AI/ML' | 'Data' | 'DevOps' | 'Security' | 'Mobile' | 'Other';
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Architect';
  
  // Scores (calculated based on role requirements)
  platformScore: number;
  atsScore: number;
  hireProbability: number;
  careerReadiness: number;
  industryRank: string;
  
  // Resume Metrics (extracted from resume)
  totalSkills: number;
  totalProjects: number;
  experienceYears: number;
  educationCount: number;
  
  // Extracted Skills (role-specific)
  extractedSkills: string[];
  
  // Category Distribution
  categories: { name: string; count: number; demand: number }[];
  
  // ATS Performance (role-specific)
  atsPerformance: {
    formatting: number;
    skills: number;
    keywords: number;
    achievements: number;
    readability: number;
    actionVerbs: number;
    education: number;
    experience: number;
    projects: number;
  };
  
  // Quality Breakdown
  qualityBreakdown: {
    formatting: number;
    content: number;
    skills: number;
    experience: number;
    education: number;
    achievements: number;
    projects: number;
    leadership: number;
    communication: number;
  };
  
  // Industry Benchmarks (based on role)
  benchmarks: {
    freshers: number;
    junior: number;
    midLevel: number;
    senior: number;
    lead: number;
  };
  
  // Job Match Readiness
  jobReadiness: {
    startups: number;
    productCompanies: number;
    serviceMNCs: number;
    remoteJobs: number;
    faang: number;
    unicorns: number;
  };
  
  // Skill Intelligence
  skillIntelligence: {
    [category: string]: {
      skillsFound: number;
      marketDemand: number;
      growthRate: number;
      salaryImpact: number;
    };
  };
  
  // AI Summary
  aiSummary: string;
  
  // AI Suggestions (priority-based)
  suggestions: {
    text: string;
    impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    time: string;
    category: 'Skills' | 'Experience' | 'Projects' | 'Education' | 'Certifications' | 'ATS';
  }[];
  
  // Career Growth Prediction
  careerGrowth: {
    currentRole: string;
    nextRole: string;
    nextRoleTimeline: string;
    futureRole: string;
    futureRoleTimeline: string;
    leadershipRole: string;
    leadershipRoleTimeline: string;
    executiveRole: string;
    executiveRoleTimeline: string;
  };
  
  // Company Fit (role-specific)
  companyFit: {
    name: string;
    fitScore: number;
    missingSkills: string[];
    interviewDifficulty: string;
  }[];
  
  // Salary Data
  salary: {
    current: { min: number; average: number; max: number };
    afterImprovements: { min: number; average: number; max: number };
    currency: string;
  };
  
  // Interview Readiness
  interviewReadiness: {
    technical: number;
    behavioral: number;
    systemDesign: number;
    coding: number;
    communication: number;
  };
}
