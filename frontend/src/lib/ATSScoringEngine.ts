export interface ATSScore {
  overall: number;
  breakdown: {
    formatting: number;
    keywords: number;
    experience: number;
    skills: number;
    education: number;
    achievements: number;
    readability: number;
    actionVerbs: number;
  };
  details: string[];
}

export class ATSScoringEngine {
  calculateScore(resumeContent: string): ATSScore {
    const scores = {
      formatting: this.calculateFormattingScore(resumeContent),
      keywords: this.calculateKeywordScore(resumeContent),
      experience: this.calculateExperienceScore(resumeContent),
      skills: this.calculateSkillsScore(resumeContent),
      education: this.calculateEducationScore(resumeContent),
      achievements: this.calculateAchievementsScore(resumeContent),
      readability: this.calculateReadabilityScore(resumeContent),
      actionVerbs: this.calculateActionVerbsScore(resumeContent)
    };

    return {
      overall: Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length),
      breakdown: scores,
      details: this.generateDetails(scores)
    };
  }

  private calculateFormattingScore(text: string): number {
    let score = 0;
    // Check for proper sections
    if (/education/i.test(text)) score += 10;
    if (/experience/i.test(text)) score += 10;
    if (/skills/i.test(text)) score += 10;
    if (/projects/i.test(text)) score += 10;
    if (/summary|profile/i.test(text)) score += 10;
    
    // Check for bullet points
    const bulletCount = (text.match(/[•●■▪▸➢▶·-]/g) || []).length;
    if (bulletCount > 10) score += 15;
    else if (bulletCount > 5) score += 10;
    else score += 5;

    // Check for consistent formatting
    if (!text.includes('{') && !text.includes('}')) score += 10;
    if (!text.includes('<') && !text.includes('>')) score += 10;

    // Check for proper spacing
    if (!text.includes('  ')) score += 10;

    return Math.min(score, 100);
  }

  private calculateKeywordScore(text: string): number {
    const keywords = [
      // Technical Skills
      'react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css',
      'python', 'java', 'c++', 'c#', 'node.js', 'express', 'django', 'flask',
      'spring', 'hibernate', 'sql', 'mongodb', 'postgresql', 'mysql', 'redis',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ansible',
      'jenkins', 'git', 'ci/cd', 'linux', 'bash', 'agile', 'scrum',
      // Soft Skills
      'leadership', 'communication', 'problem-solving', 'teamwork', 'collaboration',
      'analytical', 'critical thinking', 'innovation', 'strategy', 'management',
      // Action Words
      'developed', 'built', 'led', 'implemented', 'designed', 'architected',
      'created', 'optimized', 'improved', 'managed', 'delivered', 'executed'
    ];

    const found = keywords.filter(k => text.toLowerCase().includes(k.toLowerCase()));
    return Math.min(Math.round((found.length / 30) * 100), 100);
  }

  private calculateExperienceScore(text: string): number {
    let totalYears = 0;
    const matches = text.match(/(\d+)\+?\s*(?:year|yr)/gi) || [];
    matches.forEach(m => {
      const num = parseInt(m);
      if (!isNaN(num)) totalYears = Math.max(totalYears, num);
    });

    if (totalYears >= 8) return 100;
    if (totalYears >= 5) return 85;
    if (totalYears >= 3) return 70;
    if (totalYears >= 1) return 50;
    return 30;
  }

  private calculateSkillsScore(text: string): number {
    const skillCount = (text.match(/[•●■▪▸➢▶·-]\s*([A-Za-z0-9#+.]{2,})/g) || []).length;
    if (skillCount >= 20) return 100;
    if (skillCount >= 15) return 85;
    if (skillCount >= 10) return 70;
    if (skillCount >= 5) return 50;
    return 30;
  }

  private calculateEducationScore(text: string): number {
    let score = 0;
    if (/phd|doctorate/i.test(text)) score = 100;
    else if (/master|m\.?s\.?|mba/i.test(text)) score = 85;
    else if (/bachelor|b\.?s\.?|b\.?e\.?|b\.?tech/i.test(text)) score = 75;
    else if (/associate|diploma/i.test(text)) score = 50;
    else if (/high school/i.test(text)) score = 30;
    else score = 20;

    // Bonus for relevant field
    if (/computer|software|engineering|information|technology|data|science/i.test(text)) {
      score = Math.min(score + 15, 100);
    }

    return score;
  }

  private calculateAchievementsScore(text: string): number {
    const achievementPatterns = [
      /increased/i, /decreased/i, /reduced/i, /improved/i,
      /saved/i, /generated/i, /delivered/i, /achieved/i,
      /won/i, /awarded/i, /recognized/i, /certified/i
    ];

    const found = achievementPatterns.filter(p => p.test(text));
    return Math.min(Math.round((found.length / 12) * 100), 100);
  }

  private calculateReadabilityScore(text: string): number {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);

    if (avgWordsPerSentence < 12) return 90;
    if (avgWordsPerSentence < 16) return 80;
    if (avgWordsPerSentence < 20) return 65;
    if (avgWordsPerSentence < 25) return 50;
    return 35;
  }

  private calculateActionVerbsScore(text: string): number {
    const actionVerbs = [
      'led', 'managed', 'developed', 'built', 'designed', 'architected',
      'created', 'implemented', 'improved', 'optimized', 'increased',
      'decreased', 'reduced', 'saved', 'generated', 'delivered',
      'executed', 'launched', 'transformed', 'revolutionized', 'spearheaded',
      'established', 'initiated', 'mentored', 'coached', 'trained'
    ];

    const found = actionVerbs.filter(v => text.toLowerCase().includes(v.toLowerCase()));
    return Math.min(Math.round((found.length / 10) * 100), 100);
  }

  private generateDetails(scores: any): string[] {
    const details = [];
    if (scores.formatting < 70) details.push('Improve resume formatting and structure');
    if (scores.keywords < 60) details.push('Add more industry keywords to pass ATS filters');
    if (scores.experience < 70) details.push('Highlight more years of relevant experience');
    if (scores.skills < 60) details.push('Add more technical skills to your resume');
    if (scores.achievements < 60) details.push('Quantify achievements with metrics');
    if (scores.actionVerbs < 60) details.push('Use stronger action verbs in bullet points');
    return details;
  }
}
