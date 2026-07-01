import { MockResume } from '../data/MockResumes';

export interface SkillMatch {
  skill: string;
  score: number;
  level: 'Expert' | 'Advanced' | 'Proficient';
  importance: 'Critical' | 'Important' | 'Nice to have';
}

export interface GapItem {
  skill: string;
  currentLevel: string;
  requiredLevel: string;
  urgency: 'High' | 'Medium' | 'Optional';
  action: string;
}

export interface ProjectMatch {
  projectName: string;
  relevanceScore: number;
  isRelevant: boolean;
  matchedKeywords: string[];
}

export interface CategoryAnalysis {
  name: string;
  score: number;
  weight: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export interface MatchScore {
  overall: number;
  hiringProbability: number;
  status: 'Excellent Match' | 'Good Match' | 'Needs Improvement';
  categoryScores: Record<string, CategoryAnalysis>;
  matches: SkillMatch[];
  gaps: GapItem[];
  projectMatches: {
    projects: ProjectMatch[];
    relevantCount: number;
    expectedCount: number;
    missingKeywords: string[];
  };
  recruiterNotes: string;
  interviewTopics: string[];
  salaryEstimation: { india: string; usa: string };
  recommendations: {
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Optional';
  }[];
}

export class MatchAnalyzer {
  public analyze(resume: MockResume, targetRole: string, jobDescription: string): MatchScore {
    const jdKeywords = this.extractKeywords(jobDescription, targetRole);
    
    // 1. Calculate skill match (35% weight)
    const skillMatch = this.calculateSkillMatch(resume.skills, jdKeywords);
    
    // 2. Calculate experience match (25% weight)
    const experienceMatch = this.calculateExperienceMatch(resume.experience, jdKeywords);
    
    // 3. Calculate education match (15% weight)
    const educationMatch = this.calculateEducationMatch(resume.education, jdKeywords);
    
    // 4. Calculate project match (15% weight)
    const projectMatch = this.calculateProjectMatch(resume.projects, jdKeywords);
    
    // 5. Calculate certification match (10% weight)
    const certificationMatch = this.calculateCertificationMatch(resume.certifications, jdKeywords);
    
    // Calculate overall score
    const overall = Math.round(
      (skillMatch * 0.35) + 
      (experienceMatch * 0.25) + 
      (educationMatch * 0.15) + 
      (projectMatch * 0.15) + 
      (certificationMatch * 0.10)
    );

    let status: MatchScore['status'] = 'Needs Improvement';
    if (overall >= 75) status = 'Excellent Match';
    else if (overall >= 50) status = 'Good Match';

    const rawMatches = this.findMatches(resume.skills, jdKeywords);
    const rawGaps = this.findGaps(resume.skills, jdKeywords);

    const matches: SkillMatch[] = rawMatches.map(m => ({
      skill: m,
      score: Math.floor(Math.random() * 20) + 80,
      level: 'Expert',
      importance: 'Critical'
    }));

    const gaps: GapItem[] = rawGaps.map(g => ({
      skill: g,
      currentLevel: 'None',
      requiredLevel: 'Proficient',
      urgency: 'High',
      action: `Add ${g} experience or complete a certification.`
    }));

    const projectMatches: ProjectMatch[] = resume.projects.map(p => {
      const isRel = Math.random() > 0.3; // mock relevance
      return {
        projectName: p.name,
        relevanceScore: isRel ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 20,
        isRelevant: isRel,
        matchedKeywords: isRel ? [rawMatches[Math.floor(Math.random() * rawMatches.length)] || 'Technology'] : []
      };
    });

    return {
      overall,
      hiringProbability: Math.max(10, overall - Math.floor(Math.random() * 10)),
      status,
      categoryScores: {
        skills: {
          name: 'Technical Skills', score: skillMatch, weight: 35,
          strengths: rawMatches.slice(0, 3), gaps: rawGaps.slice(0, 3), recommendations: ['Focus on core technologies.']
        },
        experience: {
          name: 'Experience Match', score: experienceMatch, weight: 25,
          strengths: [`${resume.experience} years experience`], gaps: [], recommendations: []
        },
        projects: {
          name: 'Project Relevance', score: projectMatch, weight: 15,
          strengths: projectMatches.filter(p => p.isRelevant).map(p => p.projectName), gaps: [], recommendations: []
        },
        education: {
          name: 'Education Match', score: educationMatch, weight: 15,
          strengths: resume.education.map(e => e.degree), gaps: [], recommendations: []
        },
        certifications: {
          name: 'Certifications', score: certificationMatch, weight: 10,
          strengths: resume.certifications, gaps: [], recommendations: []
        }
      },
      matches,
      gaps,
      projectMatches: {
        projects: projectMatches,
        relevantCount: projectMatches.filter(p => p.isRelevant).length,
        expectedCount: 3,
        missingKeywords: []
      },
      recruiterNotes: overall >= 75 ? "Strong candidate. Move to technical screen." : "Lacks some core requirements.",
      interviewTopics: jdKeywords.slice(0, 4),
      salaryEstimation: { india: "₹15L - ₹25L", usa: "$120k - $160k" },
      recommendations: rawGaps.slice(0, 3).map(g => ({
        title: `Upskill in ${g}`,
        description: `Learn ${g} to improve your match score.`,
        priority: 'High'
      }))
    };
  }

  private extractKeywords(text: string, targetRole: string): string[] {
    const textLower = text.toLowerCase();
    const possibleKeywords = ["react", "node.js", "python", "java", "spring", "aws", "docker", "kubernetes", "sql", "typescript", "javascript", "machine learning", "pytorch", "terraform", "c++", "c#", "agile", "mongodb"];
    const found = possibleKeywords.filter(k => textLower.includes(k) || targetRole.toLowerCase().includes(k));
    
    if (targetRole.toLowerCase().includes('react')) found.push('react', 'javascript', 'frontend');
    if (targetRole.toLowerCase().includes('java ')) found.push('java', 'spring', 'backend');
    if (targetRole.toLowerCase().includes('python')) found.push('python', 'backend');
    if (targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine')) found.push('python', 'machine learning', 'pytorch');
    
    return [...new Set(found)];
  }

  private calculateSkillMatch(skills: string[], jdKeywords: string[]): number {
    if (jdKeywords.length === 0) return 80;
    const lowerSkills = skills.map(s => s.toLowerCase());
    const matched = jdKeywords.filter(k => lowerSkills.some(s => s.includes(k) || k.includes(s)));
    return Math.round((matched.length / jdKeywords.length) * 100) || 40;
  }

  private calculateExperienceMatch(experienceYears: number, jdKeywords: string[]): number {
    let expectedYears = 3;
    if (jdKeywords.includes("senior") || jdKeywords.includes("lead")) expectedYears = 6;
    if (jdKeywords.includes("junior")) expectedYears = 1;
    
    if (experienceYears >= expectedYears) return 100;
    return Math.max(40, Math.round((experienceYears / expectedYears) * 100));
  }

  private calculateEducationMatch(education: any[], jdKeywords: string[]): number {
    let score = education.length > 0 ? 80 : 50;
    const hasMaster = education.some(e => e.degree.toLowerCase().includes('master'));
    if (hasMaster) score = 100;
    return score;
  }

  private calculateProjectMatch(projects: any[], jdKeywords: string[]): number {
    if (projects.length === 0) return 30;
    if (projects.length >= 3) return 100;
    return Math.round((projects.length / 3) * 100);
  }

  private calculateCertificationMatch(certifications: string[], jdKeywords: string[]): number {
    return certifications.length > 0 ? 100 : 60;
  }

  private findMatches(skills: string[], jdKeywords: string[]): string[] {
    const lowerSkills = skills.map(s => s.toLowerCase());
    return jdKeywords.filter(k => lowerSkills.some(s => s.includes(k) || k.includes(s)));
  }

  private findGaps(skills: string[], jdKeywords: string[]): string[] {
    const lowerSkills = skills.map(s => s.toLowerCase());
    return jdKeywords.filter(k => !lowerSkills.some(s => s.includes(k) || k.includes(s)));
  }
}
