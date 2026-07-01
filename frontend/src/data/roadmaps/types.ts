export interface PhaseFoundations {
  role: string;
  responsibilities: string[];
  mindset: string;
  opportunities: string;
  salaryRange: string;
  futureDemand: string;
}

export interface PhaseResources {
  books: string[];
  courses: string[];
  websites: string[];
  youtube: string[];
  blogs: string[];
}

export interface WeekPlan {
  week: number;
  topic: string;
  description: string;
}

export interface ProjectItem {
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  techStack: string[];
}

export interface CertItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Professional';
  provider: string;
}

export interface InterviewPrep {
  topics: string[];
  questions: string[];
  systemDesign: string[];
}

export interface CareerProgression {
  level: string;
  title: string;
  timeline: string;
}

export interface SalaryGrowth {
  level: string;
  estimatedSalary: string;
  numericValue: number; // for charts
}

export interface DailyPlan {
  day: string;
  topic: string;
}

export interface MonthPlan {
  month: number;
  focus: string;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  
  // Phase 1: Foundations
  foundations: PhaseFoundations;
  
  // Phase 2: Prerequisites
  prerequisites: string[];
  
  // Phase 3: Core Skills
  coreSkills: string[];
  
  // Phase 4: Learning Resources
  resources: PhaseResources;
  
  // Phase 5: Weekly Study Plan
  weeklyPlan: WeekPlan[];
  
  // Phase 6: Projects
  projects: ProjectItem[];
  
  // Phase 7: Certifications
  certifications: CertItem[];
  
  // Phase 8: Interview Preparation
  interviewPrep: InterviewPrep;
  
  // Phase 9: Portfolio Checklist
  portfolioChecklist: string[];
  
  // Phase 10: Job Readiness
  jobReadiness: string[];
  
  // Phase 11: Career Progression
  careerProgression: CareerProgression[];
  
  // Phase 12: Salary Growth
  salaryGrowth: SalaryGrowth[];
  
  // Phase 13: Skill Progress Tracker (Initialized by user state, dynamic)
  
  // Phase 14: AI Gap Analysis (Dynamic based on resume)
  
  // Phase 15: Estimated Timeline
  estimatedTimeline: {
    fastTrack: string;
    normal: string;
    partTime: string;
  };
  
  // Phase 16: Daily Roadmap
  dailyRoadmap: DailyPlan[];
  
  // Phase 17: Monthly Milestones
  monthlyMilestones: MonthPlan[];
  
  // Phase 18: Industry Tools
  industryTools: string[];
  
  // Phase 19: Practice Platforms
  practicePlatforms: string[];
  
  // Phase 20: Final Career Checklist
  finalChecklist: string[];
}
