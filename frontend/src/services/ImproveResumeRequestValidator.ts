/**
 * Enhanced Resume Improver Frontend Validation Service
 * Complete request pipeline with comprehensive validation and error handling
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
  field?: string;
}

export interface RequestPayload {
  section_text: string;
  section_type: string;
  target_role?: string;
  level?: string;
}

export class ImproveResumeRequestValidator {
  /**
   * STEP 1: Frontend Validation
   * Validate before sending to backend
   */
  
  static readonly VALID_SECTIONS = ['auto', 'summary', 'experience', 'project', 'education', 'skills'];
  static readonly VALID_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead'];
  static readonly MIN_DRAFT_LENGTH = 20;
  static readonly MAX_DRAFT_LENGTH = 5000;
  
  /**
   * Validate section text (original draft)
   */
  static validateSectionText(text: string | null | undefined): ValidationResult {
    // Check if empty
    if (!text || typeof text !== 'string') {
      return {
        valid: false,
        error: 'The original draft cannot be empty.',
        code: 'EMPTY_DRAFT',
        field: 'section_text'
      };
    }
    
    const trimmed = text.trim();
    
    // Check if empty after trim
    if (!trimmed) {
      return {
        valid: false,
        error: 'The original draft cannot be empty.',
        code: 'EMPTY_DRAFT',
        field: 'section_text'
      };
    }
    
    // Check minimum length
    if (trimmed.length < this.MIN_DRAFT_LENGTH) {
      return {
        valid: false,
        error: `The original draft must be at least ${this.MIN_DRAFT_LENGTH} characters.`,
        code: 'DRAFT_TOO_SHORT',
        field: 'section_text'
      };
    }
    
    // Check maximum length
    if (trimmed.length > this.MAX_DRAFT_LENGTH) {
      return {
        valid: false,
        error: `The original draft cannot exceed ${this.MAX_DRAFT_LENGTH} characters.`,
        code: 'DRAFT_TOO_LONG',
        field: 'section_text'
      };
    }
    
    // Check for keyboard spam
    const charCounts: Record<string, number> = {};
    for (const char of trimmed) {
      charCounts[char] = (charCounts[char] || 0) + 1;
    }
    
    const maxRepeat = Math.max(...Object.values(charCounts));
    if (maxRepeat > trimmed.length * 0.5) {
      return {
        valid: false,
        error: 'The original draft appears to contain keyboard spam.',
        code: 'DRAFT_SPAM',
        field: 'section_text'
      };
    }
    
    // Check for only symbols
    const hasAlphanumeric = /[a-zA-Z0-9]/.test(trimmed);
    if (!hasAlphanumeric) {
      return {
        valid: false,
        error: 'The original draft cannot contain only symbols.',
        code: 'DRAFT_SYMBOLS_ONLY',
        field: 'section_text'
      };
    }
    
    // Check for only numbers
    const hasNonNumeric = /[^0-9\s]/.test(trimmed);
    if (!hasNonNumeric) {
      return {
        valid: false,
        error: 'The original draft cannot contain only numbers.',
        code: 'DRAFT_NUMBERS_ONLY',
        field: 'section_text'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate section type
   */
  static validateSectionType(sectionType: string | null | undefined): ValidationResult {
    if (!sectionType || typeof sectionType !== 'string') {
      return {
        valid: false,
        error: 'Please select a section type.',
        code: 'INVALID_SECTION',
        field: 'section_type'
      };
    }
    
    if (!this.VALID_SECTIONS.includes(sectionType)) {
      return {
        valid: false,
        error: `Invalid section type. Valid options: ${this.VALID_SECTIONS.join(', ')}`,
        code: 'INVALID_SECTION',
        field: 'section_type'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate target role
   */
  static validateTargetRole(targetRole: string | null | undefined): ValidationResult {
    // Target role is optional
    if (!targetRole) {
      return { valid: true };
    }
    
    if (typeof targetRole !== 'string') {
      return {
        valid: false,
        error: 'Target role must be a string.',
        code: 'INVALID_ROLE',
        field: 'target_role'
      };
    }
    
    const trimmed = targetRole.trim();
    if (!trimmed) {
      return { valid: true }; // Empty string is acceptable
    }
    
    return { valid: true };
  }
  
  /**
   * Validate experience level
   */
  static validateLevel(level: string | null | undefined): ValidationResult {
    // Level is optional
    if (!level) {
      return { valid: true };
    }
    
    if (typeof level !== 'string') {
      return {
        valid: false,
        error: 'Experience level must be a string.',
        code: 'INVALID_LEVEL',
        field: 'level'
      };
    }
    
    if (!this.VALID_LEVELS.includes(level)) {
      return {
        valid: false,
        error: `Invalid experience level. Valid options: ${this.VALID_LEVELS.join(', ')}`,
        code: 'INVALID_LEVEL',
        field: 'level'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate entire request
   */
  static validateRequest(payload: RequestPayload): ValidationResult {
    // Validate section_text
    let result = this.validateSectionText(payload.section_text);
    if (!result.valid) return result;
    
    // Validate section_type
    result = this.validateSectionType(payload.section_type);
    if (!result.valid) return result;
    
    // Validate target_role
    result = this.validateTargetRole(payload.target_role);
    if (!result.valid) return result;
    
    // Validate level
    result = this.validateLevel(payload.level);
    if (!result.valid) return result;
    
    return { valid: true };
  }
}

export class ImproveResumeRequestBuilder {
  /**
   * STEP 2: Build Request Payload
   * Ensure all required fields are present
   */
  
  static buildPayload(
    sectionText: string,
    sectionType: string,
    targetRole?: string,
    level?: string
  ): RequestPayload {
    return {
      section_text: sectionText.trim(),
      section_type: sectionType || 'auto',
      target_role: targetRole?.trim() || undefined,
      level: level || 'Mid'
    };
  }
}

export class ImproveResumeErrorHandler {
  /**
   * STEP 3: Handle Errors
   * Convert raw HTTP errors to user-friendly messages
   */
  
  static readonly ERROR_MESSAGES: Record<string, string> = {
    EMPTY_DRAFT: 'The original draft cannot be empty.',
    DRAFT_TOO_SHORT: 'The original draft must be at least 20 characters.',
    DRAFT_TOO_LONG: 'The original draft cannot exceed 5000 characters.',
    DRAFT_SPAM: 'The original draft appears to contain keyboard spam.',
    DRAFT_SYMBOLS_ONLY: 'The original draft cannot contain only symbols.',
    DRAFT_NUMBERS_ONLY: 'The original draft cannot contain only numbers.',
    INVALID_SECTION: 'Please select a valid section type.',
    INVALID_ROLE: 'Please select a valid target role.',
    INVALID_LEVEL: 'Please select a valid experience level.',
    MISSING_FIELD: 'Please complete all required fields.',
    INVALID_TYPE: 'Invalid data type provided.',
    BACKEND_ERROR: 'Backend validation failed. Using intelligent offline optimization.',
    AI_UNAVAILABLE: 'AI enhancement is temporarily unavailable. Using intelligent offline optimization.',
    TIMEOUT: 'Request timed out. Using intelligent offline optimization.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Using intelligent offline optimization.'
  };
  
  /**
   * Get user-friendly error message
   */
  static getUserMessage(code: string): string {
    return this.ERROR_MESSAGES[code] || this.ERROR_MESSAGES.UNKNOWN_ERROR;
  }
  
  /**
   * Handle validation error
   */
  static handleValidationError(code: string, field?: string): string {
    const message = this.getUserMessage(code);
    if (field) {
      return `${field}: ${message}`;
    }
    return message;
  }
  
  /**
   * Handle API error
   */
  static handleApiError(error: any): string {
    // Check for structured error response
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    // Check for HTTP status codes
    if (error.response?.status === 400) {
      return this.ERROR_MESSAGES.BACKEND_ERROR;
    }
    if (error.response?.status === 429) {
      return this.ERROR_MESSAGES.AI_UNAVAILABLE;
    }
    if (error.response?.status === 504) {
      return this.ERROR_MESSAGES.TIMEOUT;
    }
    if (error.response?.status === 500) {
      return this.ERROR_MESSAGES.BACKEND_ERROR;
    }
    
    // Check for timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return this.ERROR_MESSAGES.TIMEOUT;
    }
    
    // Check for network error
    if (error.message?.includes('Network') || error.code === 'ERR_NETWORK') {
      return 'Unable to reach the server. Please check your internet connection.';
    }
    
    // Default
    return this.ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

export class ImproveResumeRequestLogger {
  /**
   * STEP 4: Debug Logging
   * Log every stage of the request pipeline
   */
  
  private static logs: Array<{ stage: string; timestamp: number; data: any }> = [];
  
  static logStage(stage: string, data: any = {}): void {
    const entry = {
      stage,
      timestamp: Date.now(),
      data
    };
    this.logs.push(entry);
    console.log(`[IMPROVE-RESUME] ${stage}`, data);
  }
  
  static logValidationStart(payload: RequestPayload): void {
    this.logStage('VALIDATION_START', {
      text_length: payload.section_text?.length || 0,
      section_type: payload.section_type,
      target_role: payload.target_role,
      level: payload.level
    });
  }
  
  static logValidationPassed(): void {
    this.logStage('VALIDATION_PASSED');
  }
  
  static logValidationFailed(error: ValidationResult): void {
    this.logStage('VALIDATION_FAILED', {
      code: error.code,
      message: error.error,
      field: error.field
    });
  }
  
  static logPayloadBuilt(payload: RequestPayload): void {
    this.logStage('PAYLOAD_BUILT', {
      text_length: payload.section_text.length,
      section_type: payload.section_type
    });
  }
  
  static logApiRequestSent(url: string): void {
    this.logStage('API_REQUEST_SENT', { url });
  }
  
  static logApiResponseReceived(status: number, data: any): void {
    this.logStage('API_RESPONSE_RECEIVED', {
      status,
      success: data?.success,
      quality_score: data?.quality_score
    });
  }
  
  static logApiError(error: any): void {
    this.logStage('API_ERROR', {
      status: error.response?.status,
      message: error.message,
      code: error.code
    });
  }
  
  static logFallbackUsed(reason: string): void {
    this.logStage('FALLBACK_USED', { reason });
  }
  
  static logResponseDisplayed(quality_score: number): void {
    this.logStage('RESPONSE_DISPLAYED', { quality_score });
  }
  
  static getLogs(): Array<{ stage: string; timestamp: number; data: any }> {
    return this.logs;
  }
  
  static clearLogs(): void {
    this.logs = [];
  }
}
