import { InterviewQuestion, interviewQuestions } from '../data/interviewQuestions';

export class InterviewQuestionService {
  private questions: InterviewQuestion[] = [];

  constructor() {
    this.questions = interviewQuestions;
  }

  getQuestionsForRole(role: string, category: string, difficulty: string): InterviewQuestion[] {
    return this.questions.filter(q => {
      // Role matching is loose (e.g., 'React Developer' matches 'Junior React Developer' if in array)
      const matchesRole = q.role.some(r => r.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(r.toLowerCase()) || r === 'All');
      const matchesCategory = category === 'Mixed' ? true : q.category === category;
      const matchesDifficulty = q.difficulty === difficulty;
      return matchesRole && matchesCategory && matchesDifficulty;
    });
  }

  getRandomQuestions(role: string, category: string, difficulty: string, count: number = 5): InterviewQuestion[] {
    let filtered = this.getQuestionsForRole(role, category, difficulty);
    
    // If not enough questions match strict filters, fallback to looser matching
    if (filtered.length < count) {
      filtered = this.questions.filter(q => 
        q.role.some(r => r.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(r.toLowerCase()) || r === 'All')
      );
    }
    
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  calculateScore(answer: string, question: InterviewQuestion): number {
    const keywords = question.keywords || [];
    if (keywords.length === 0) return 50; // default if no keywords provided
    
    const matchedKeywords = keywords.filter(k => 
      answer.toLowerCase().includes(k.toLowerCase())
    );
    return Math.round((matchedKeywords.length / keywords.length) * 100);
  }

  getFeedback(score: number): string {
    if (score >= 80) return 'Excellent answer! You covered all the key points.';
    if (score >= 60) return 'Good answer! You covered most key points. Consider adding more details.';
    if (score >= 40) return 'Fair answer. You mentioned some key points but missed others.';
    return 'Your answer needs improvement. Review the key concepts and try again.';
  }
}
