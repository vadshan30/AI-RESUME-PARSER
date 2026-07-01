import { professionalSummaries } from '../data/professionalSummaries';

export class SummaryImprovementService {
  getImprovedSummary(role: string, level: string): string {
    const key = `${level} ${role}`;
    // First try exact match (e.g. "Junior React Developer")
    if (professionalSummaries[key]) {
      return professionalSummaries[key].improved;
    }
    
    // Try matching just the role if the exact level+role combo isn't found
    const roleOnlyKey = Object.keys(professionalSummaries).find(k => k.includes(role));
    if (roleOnlyKey) {
      return professionalSummaries[roleOnlyKey].improved;
    }

    // Fallback to generic if not found
    return "Experienced professional with strong technical skills and a passion for building innovative solutions. Proven ability to work in collaborative environments and deliver high-quality results. Committed to continuous learning and professional growth.";
  }

  getOriginalSummary(role: string, level: string): string {
    const key = `${level} ${role}`;
    if (professionalSummaries[key]) {
      return professionalSummaries[key].original;
    }
    
    const roleOnlyKey = Object.keys(professionalSummaries).find(k => k.includes(role));
    if (roleOnlyKey) {
      return professionalSummaries[roleOnlyKey].original;
    }

    return "Highly motivated and results-oriented professional with a strong track record of success. Proven ability to learn quickly and adapt to new technologies. Seeking to leverage expertise to drive innovation and growth.";
  }

  getImprovementNotes(original: string, improved: string): string[] {
    return [
      "Added role-specific expertise and technologies",
      "Included quantifiable achievements and metrics",
      "Enhanced with industry-recognized keywords",
      "Added leadership and collaboration skills",
      "Included career progression and goals"
    ];
  }
}
