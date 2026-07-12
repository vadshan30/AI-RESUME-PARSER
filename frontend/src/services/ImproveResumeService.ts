/**
 * Resume Improver Service
 * Client-side validation, formatting, and history management
 */

export interface ImproveResult {
  success: boolean;
  improved_text: string;
  section_type: string;
  changes: string[];
  quality_score: number;
  sub_scores?: {
    overall: number;
    ats_score: number;
    grammar_score: number;
    readability_score: number;
    formatting_score: number;
  };
  ai_enhanced: boolean;
  fallback_used: boolean;
  stats?: {
    original_length: number;
    improved_length: number;
    word_count_original: number;
    word_count_improved: number;
    changes_count?: number;
    readability_original?: number;
    readability_improved?: number;
    ats_keywords_added?: number;
    grammar_corrections?: number;
    weak_verbs_replaced?: number;
    achievements_added?: number;
    reading_time?: number;
    action_verbs_original?: number;
    action_verbs_improved?: number;
    word_count_change?: number;
  };
  highlights?: Record<string, string[]>;
  role_suggestions?: string[];
  error?: string;
  detected_role?: string;
  detected_skills?: string[];
  missing_skills_for_role?: string[];
  action_verbs_count?: number;
  weak_verbs_count?: number;
  grammar_issues_count?: number;
  quality_report?: {
    grammar_issues: number;
    passive_voice_count: number;
    repeated_words: string[];
    weak_verbs: string[];
    long_sentences: number;
    buzzwords: string[];
    missing_metrics: number;
    spelling_errors: string[];
    missing_skills: string[];
    role_missing_skills: string[];
    detected_action_verbs: number;
    detected_projects: string[];
    detected_certifications: string[];
    detected_education: string[];
    detected_experience_years: number;
  };
}

export interface ImprovementHistory {
  id: string;
  timestamp: number;
  original: string;
  improved: string;
  section_type: string;
  quality_score: number;
  sub_scores?: ImproveResult['sub_scores'];
  changes: string[];
  role_suggestions?: string[];
}

class ImproveResumeService {
  private history: ImprovementHistory[] = [];
  private maxHistoryItems = 10;

  /**
   * Validate input before sending to backend
   */
  validateInput(text: string): { valid: boolean; error?: string } {
    if (!text || !text.trim()) {
      return { valid: false, error: 'Please enter a meaningful resume section.' };
    }

    const trimmed = text.trim();
    const wordCount = trimmed.split(/\s+/).length;

    if (wordCount < 10) {
      return { valid: false, error: 'Please enter a meaningful resume section.' };
    }

    if (trimmed.length > 5000) {
      return { valid: false, error: 'Resume section must not exceed 5000 characters.' };
    }

    // Keyboard spam detection
    const spamPatterns = [
      /^[a-z]{10,}$/i,
      /^[asdfghjkl;]{5,}/i,
      /^[qwertyuiop]{5,}/i,
      /^[zxcvbnm,./]{5,}/i,
      /(.)\1{4,}/,
      /^[dklfjsa]{5,}/i,
    ];
    for (const pattern of spamPatterns) {
      if (pattern.test(trimmed)) {
        return { valid: false, error: 'Unable to detect resume content. Please enter meaningful resume text.' };
      }
    }

    // Excessive character repetition
    const charCounts: Record<string, number> = {};
    for (const ch of trimmed) {
      charCounts[ch] = (charCounts[ch] || 0) + 1;
    }
    const maxRepeat = Math.max(...Object.values(charCounts), 0);
    if (maxRepeat > trimmed.length * 0.5) {
      return { valid: false, error: 'Unable to detect resume content. Please enter meaningful resume text.' };
    }

    // Symbols only
    if (!/[a-zA-Z0-9]/.test(trimmed)) {
      return { valid: false, error: 'Please enter a meaningful resume section.' };
    }

    // Numbers only
    if (/^[\d\s\-.]+$/.test(trimmed)) {
      return { valid: false, error: 'Please enter a meaningful resume section.' };
    }

    return { valid: true };
  }

  /**
   * Detect resume section type
   */
  detectSectionType(text: string): string {
    const lower = text.toLowerCase();

    // Professional Summary
    if (
      /passionate|motivated|dedicated|experienced professional|skilled|results-driven|seeking|objective|summary/.test(
        lower
      )
    ) {
      if (text.split(/\s+/).length < 100) {
        return 'summary';
      }
    }

    // Experience
    if (
      /responsible for|worked on|managed|led|developed|implemented|designed|built|created|at|for/.test(lower)
    ) {
      if (/[•\-*◦]/.test(text)) {
        return 'experience';
      }
    }

    // Project
    if (/project|built|developed|created|github|deployed|technologies|tech stack|tools used/.test(lower)) {
      return 'project';
    }

    // Education
    if (/bachelor|master|degree|university|college|b\.tech|b\.e|m\.tech|gpa|cgpa/.test(lower)) {
      return 'education';
    }

    // Skills
    if (/skills|proficient|expertise|languages|tools|technologies|programming|frameworks/.test(lower)) {
      return 'skills';
    }

    return 'experience';
  }

  /**
   * Get character and word count
   */
  getStats(text: string): { characters: number; words: number; sentences: number } {
    return {
      characters: text.length,
      words: text.split(/\s+/).filter((w) => w.length > 0).length,
      sentences: text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length,
    };
  }

  /**
   * Highlight changes between original and improved
   */
  highlightChanges(original: string, improved: string): Array<{ type: 'removed' | 'added' | 'unchanged'; text: string }> {
    const originalWords = original.split(/\s+/);
    const improvedWords = improved.split(/\s+/);

    const changes: Array<{ type: 'removed' | 'added' | 'unchanged'; text: string }> = [];

    // Simple diff - can be enhanced with a proper diff library
    const maxLen = Math.max(originalWords.length, improvedWords.length);

    for (let i = 0; i < maxLen; i++) {
      const origWord = originalWords[i] || '';
      const impWord = improvedWords[i] || '';

      if (origWord === impWord) {
        changes.push({ type: 'unchanged', text: origWord });
      } else {
        if (origWord) {
          changes.push({ type: 'removed', text: origWord });
        }
        if (impWord) {
          changes.push({ type: 'added', text: impWord });
        }
      }
    }

    return changes;
  }

  /**
   * Add to history
   */
  addToHistory(original: string, result: ImproveResult): void {
    const entry: ImprovementHistory = {
      id: `history_${Date.now()}`,
      timestamp: Date.now(),
      original,
      improved: result.improved_text,
      section_type: result.section_type,
      quality_score: result.quality_score,
      sub_scores: result.sub_scores,
      changes: result.changes,
      role_suggestions: result.role_suggestions,
    };

    this.history.unshift(entry);

    // Keep only last N items
    if (this.history.length > this.maxHistoryItems) {
      this.history = this.history.slice(0, this.maxHistoryItems);
    }

    // Persist to localStorage
    this.saveHistoryToStorage();
  }

  /**
   * Get history
   */
  getHistory(): ImprovementHistory[] {
    return this.history;
  }

  /**
   * Restore from history
   */
  restoreFromHistory(id: string): ImprovementHistory | null {
    return this.history.find((h) => h.id === id) || null;
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
    localStorage.removeItem('improver_history');
  }

  /**
   * Save history to localStorage
   */
  private saveHistoryToStorage(): void {
    try {
      localStorage.setItem('improver_history', JSON.stringify(this.history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }

  /**
   * Load history from localStorage
   */
  loadHistoryFromStorage(): void {
    try {
      const stored = localStorage.getItem('improver_history');
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }

  /**
   * Format text for display
   */
  formatForDisplay(text: string): string {
    // Ensure proper spacing
    text = text.replace(/\s+/g, ' ').trim();

    // Add line breaks for bullet points
    text = text.replace(/([•\-*◦]\s+)/g, '\n$1');

    return text;
  }

  /**
   * Copy to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
      return false;
    }
  }

  /**
   * Download as text file
   */
  downloadAsText(text: string, filename: string = 'improved_resume.txt'): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Download as DOCX (basic implementation)
   */
  downloadAsDocx(text: string, filename: string = 'improved_resume.docx'): void {
    // For a full implementation, use a library like docx or html-docx-js
    // This is a simplified version that creates a basic DOCX
    const docContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;

    const blob = new Blob([docContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get improvement suggestions based on quality score
   */
  getImprovementSuggestions(result: ImproveResult): string[] {
    const suggestions: string[] = [];
    const sub = result.sub_scores;

    if (sub) {
      if (sub.ats_score < 60) {
        suggestions.push('Add more ATS keywords relevant to your target role');
      }
      if (sub.grammar_score < 70) {
        suggestions.push('Review grammar and sentence structure for clarity');
      }
      if (sub.formatting_score < 60) {
        suggestions.push('Improve formatting with consistent bullet points and structure');
      }
      if (sub.readability_score < 70) {
        suggestions.push('Break down long sentences and vary sentence structure');
      }
    }

    if (result.quality_score < 60) {
      suggestions.push('Consider adding more quantified achievements (numbers, percentages)');
      suggestions.push('Use stronger action verbs to make your impact more clear');
    } else if (result.quality_score < 75) {
      suggestions.push('Add specific metrics or results to strengthen your claims');
      suggestions.push('Ensure each bullet point starts with a strong action verb');
    }

    return suggestions.slice(0, 3);
  }

}

export default new ImproveResumeService();
