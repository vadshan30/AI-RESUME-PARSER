import { RoleAnalysisData } from '../types/PlatformAnalysisData';
import { allRoleAnalyses } from '../data/mockAnalysisData';

export class PlatformAnalysisService {
  private roleDatabase: Map<string, RoleAnalysisData>;
  private apiUrl: string = 'http://localhost:8000';

  constructor() {
    this.roleDatabase = this.buildRoleDatabase();
  }

  async analyzeResume(file: File, role?: string): Promise<RoleAnalysisData> {
    try {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error("Only PDF files are supported by the backend AI parser.");
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append('file', file);
      if (role) {
        formData.append('target_role', role);
      }

      // Call Backend API
      const response = await fetch(`${this.apiUrl}/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to analyze resume';
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const backendData = await response.json();
      
      // Match Role based on extracted skills
      const matchedRole = this.matchRole(backendData, role);
      
      // Merge Backend AI data into our massive Role Profile
      const analysis = this.generateAnalysis(matchedRole, backendData);
      
      return analysis;
    } catch (error) {
      console.error("Platform Analysis Service Error:", error);
      throw error;
    }
  }
  
  private buildRoleDatabase(): Map<string, RoleAnalysisData> {
    const db = new Map();
    Object.values(allRoleAnalyses).forEach(analysis => {
      db.set(analysis.roleName, analysis);
    });
    return db;
  }

  private matchRole(backendData: any, specifiedRole?: string): RoleAnalysisData {
    if (specifiedRole && this.roleDatabase.has(specifiedRole)) {
      return this.roleDatabase.get(specifiedRole)!;
    }
    
    // Auto-detect role based on backend extracted skills and experience
    const detectedRole = this.detectRole(backendData);
    return this.roleDatabase.get(detectedRole) || this.roleDatabase.get("Full Stack Developer")!;
  }

  private detectRole(backendData: any): string {
    const flatSkills: string[] = backendData.skills?.map((s: any) => s.skill_name?.toLowerCase() || '') || [];
    const experienceList = backendData.experience || [];
    const experienceYears = experienceList.length > 0 ? experienceList.length * 1.5 : 1; // Rough estimation from list items
    
    if (flatSkills.some(s => ['react', 'angular', 'vue', 'next.js', 'typescript'].includes(s))) {
      if (experienceYears >= 5) return "Senior React Developer";
      if (experienceYears >= 3) return "Mid React Developer";
      return "Junior React Developer";
    }
    
    if (flatSkills.some(s => ['java', 'spring', 'spring boot', 'hibernate'].includes(s))) {
      return "Java Developer";
    }
    
    if (flatSkills.some(s => ['python', 'django', 'flask', 'fastapi'].includes(s))) {
      return "Python Developer";
    }
    
    if (flatSkills.some(s => ['docker', 'kubernetes', 'aws', 'terraform', 'ansible'].includes(s))) {
      return "DevOps Engineer";
    }
    
    if (flatSkills.some(s => ['tensorflow', 'pytorch', 'machine learning', 'scikit'].includes(s))) {
      return "Machine Learning Engineer";
    }
    
    if (flatSkills.some(s => ['data science', 'pandas', 'numpy', 'sql'].includes(s))) {
      return "Data Scientist";
    }
    
    if (flatSkills.some(s => ['security', 'owasp', 'penetration testing'].includes(s))) {
      return "Cybersecurity Analyst";
    }
    
    return "Full Stack Developer";
  }

  private generateAnalysis(baseData: RoleAnalysisData, backendData: any): RoleAnalysisData {
    // Deep copy to avoid mutating the local database object
    const analysis: RoleAnalysisData = JSON.parse(JSON.stringify(baseData));
    
    const analysisData = backendData.analysis_data || {};
    const atsScoreObj = analysisData.score_breakdown || {};
    const formattingChecks = analysisData.formatting || {};
    
    // Map Real ATS Scores
    analysis.atsScore = backendData.resume_score || baseData.atsScore;
    
    // Recalculate platform score based on real ATS score
    analysis.platformScore = Math.round((analysis.atsScore + analysis.careerReadiness) / 2);
    
    // Map extracted quantities
    analysis.totalSkills = backendData.skills?.length || baseData.totalSkills;
    analysis.totalProjects = backendData.projects?.length || baseData.totalProjects;
    analysis.educationCount = backendData.education?.length || baseData.educationCount;
    analysis.experienceYears = backendData.experience?.length ? Math.round(backendData.experience.length * 1.5) : baseData.experienceYears; // Simple rough estimate
    
    // Map Extracted Skills
    if (backendData.skills && backendData.skills.length > 0) {
      analysis.extractedSkills = backendData.skills.map((s: any) => s.skill_name);
    }
    
    // Map ATS Breakdown Performance
    analysis.atsPerformance = {
      ...analysis.atsPerformance,
      formatting: atsScoreObj.formatting || analysis.atsPerformance.formatting,
      skills: atsScoreObj.skills || analysis.atsPerformance.skills,
      keywords: atsScoreObj.keywords || analysis.atsPerformance.keywords,
      achievements: atsScoreObj.achievements || analysis.atsPerformance.achievements,
      readability: atsScoreObj.readability || analysis.atsPerformance.readability,
      actionVerbs: atsScoreObj.actionVerbs || analysis.atsPerformance.actionVerbs,
      education: atsScoreObj.education || analysis.atsPerformance.education,
      experience: atsScoreObj.experience || analysis.atsPerformance.experience,
    };
    
    // Map Quality Breakdown
    analysis.qualityBreakdown = {
      ...analysis.qualityBreakdown,
      formatting: atsScoreObj.formatting || analysis.qualityBreakdown.formatting,
      content: atsScoreObj.keywords || analysis.qualityBreakdown.content,
      skills: atsScoreObj.skills || analysis.qualityBreakdown.skills,
      experience: atsScoreObj.experience || analysis.qualityBreakdown.experience,
      education: atsScoreObj.education || analysis.qualityBreakdown.education,
      achievements: atsScoreObj.achievements || analysis.qualityBreakdown.achievements
    };
    
    // Inject Real AI Summary if available
    const strengths = analysisData.strengths || [];
    const weaknesses = analysisData.weaknesses || [];
    if (strengths.length > 0 || weaknesses.length > 0) {
      let aiSummary = '';
      if (strengths.length > 0) aiSummary += `Strengths: ${strengths.join('. ')}. `;
      if (weaknesses.length > 0) aiSummary += `Areas to improve: ${weaknesses.join('. ')}.`;
      if (aiSummary) analysis.aiSummary = aiSummary;
    }
    
    // Merge AI Recommendations into suggestions
    const aiRecommendations = analysisData.recommendations || [];
    if (aiRecommendations.length > 0) {
      const realSuggestions = aiRecommendations.map((rec: string) => ({
        text: rec,
        impact: 'HIGH', // Default mapping
        time: 'TBD',
        category: 'ATS'
      }));
      // Prepend the real AI suggestions to the mock ones
      analysis.suggestions = [...realSuggestions, ...analysis.suggestions].slice(0, 8); // Keep top 8
    }
    
    return analysis;
  }
}
