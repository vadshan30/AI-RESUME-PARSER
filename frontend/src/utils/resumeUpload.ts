import { AxiosError } from 'axios';
import { env } from './env';

export const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'txt'] as const;
export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const;

export const MAX_FILE_SIZE = env.getConfig().maxFileSize || 5 * 1024 * 1024;
export const UPLOAD_TIMEOUT_MS = env.getConfig().uploadTimeout || 120000;

export type UploadStage =
  | 'idle'
  | 'checking'
  | 'uploading'
  | 'extracting'
  | 'parsing'
  | 'scoring'
  | 'complete'
  | 'error';

export interface UploadProgress {
  stage: UploadStage;
  percent: number;
  label: string;
}

export const STAGE_LABELS: Record<UploadStage, string> = {
  idle: 'Ready to upload',
  checking: 'Checking backend connection…',
  uploading: 'Uploading file…',
  extracting: 'Extracting text…',
  parsing: 'Parsing resume…',
  scoring: 'Generating ATS score…',
  complete: 'Resume uploaded successfully',
  error: 'Upload failed',
};

export class ResumeUploadError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'validation'
      | 'backend_down'
      | 'cors'
      | 'timeout'
      | 'network'
      | 'server'
      | 'parse'
      | 'unknown' = 'unknown',
    public readonly recoverable = true,
  ) {
    super(message);
    this.name = 'ResumeUploadError';
  }
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(filename: string): string {
  return filename.toLowerCase().split('.').pop() || '';
}

export function validateResumeFile(file: File | null | undefined): string | null {
  if (!file) return 'No file selected. Please choose a resume file.';
  const ext = getFileExtension(file.name);
  if (!ext || !ACCEPTED_EXTENSIONS.includes(ext as typeof ACCEPTED_EXTENSIONS[number])) {
    return `File format not supported (.${ext || 'unknown'}). Please upload PDF, DOC, DOCX, or TXT.`;
  }
  if (file.size === 0) return 'The selected file is empty and cannot be read.';
  if (file.size > MAX_FILE_SIZE) {
    return `File exceeds the size limit (${formatFileSize(MAX_FILE_SIZE)} max).`;
  }
  return null;
}

function extractDetailMessage(detail: unknown): string | null {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => (typeof d === 'object' && d && 'msg' in d ? String((d as { msg: string }).msg) : String(d))).join('; ');
  }
  if (detail && typeof detail === 'object') {
    const d = detail as { error?: string; message?: string; stage?: string };
    if (d.stage === 'extract_text') {
      if (d.error?.includes('not a valid resume')) {
        return 'Resume appears to be empty or is not a valid resume document.';
      }
      if (d.error?.toLowerCase().includes('.doc')) {
        return 'Legacy .DOC files could not be read. Please save as .DOCX or PDF and retry.';
      }
      return d.error || 'Text extraction failed. The file may be image-only (OCR required) or corrupted.';
    }
    if (d.stage === 'parse') return d.error || 'Resume parsing failed. Please upload a text-based resume.';
    if (d.stage === 'upload') return d.error || 'File upload failed on the server.';
    if (d.error) return d.error;
    if (d.message) return d.message;
  }
  return null;
}

export function parseUploadError(error: unknown): string {
  if (error instanceof ResumeUploadError) return error.message;

  const err = error as AxiosError<{ detail?: unknown; error?: { message?: string } }> & {
    code?: string;
    message?: string;
  };

  const detailMsg = extractDetailMessage(err?.response?.data?.detail);
  if (detailMsg) return detailMsg;

  const wrappedMsg = err?.response?.data?.error?.message;
  if (wrappedMsg) return wrappedMsg;

  if (err?.code === 'ECONNABORTED' || err?.message?.toLowerCase().includes('timeout')) {
    return 'Upload timed out. The server may still be processing — wait a moment and check History, or retry.';
  }

  if (err?.response) {
    const status = err.response.status;
    if (status === 404) return 'Invalid upload endpoint (/resume/upload). Check backend route registration.';
    if (status === 413) return `File exceeds the size limit (${formatFileSize(MAX_FILE_SIZE)} max).`;
    if (status === 422) return 'Invalid upload request. The file may be corrupted or unreadable.';
    if (status === 400) return 'Resume parsing failed. Please upload a text-based PDF, DOCX, or TXT file.';
    if (status === 503) return 'Backend server is temporarily unavailable. Please retry in a moment.';
    if (status >= 500) return 'File upload failed due to a server error. Please retry.';
    return `Upload failed (HTTP ${status}). Please retry.`;
  }

  // No HTTP response — connection-level failure
  const apiBase = env.getApiUrl() || '(same origin via dev proxy)';
  const msg = (err?.message || '').toLowerCase();

  if (msg.includes('network error') || err?.code === 'ERR_NETWORK') {
    if (import.meta.env.DEV && !env.getApiUrl()) {
      return 'Unable to reach the upload API. Ensure the backend is running on port 8000 (python -m uvicorn backend.main:app --reload) and retry.';
    }
    return `Unable to reach the upload API at ${apiBase}. Ensure the backend server is running and CORS is configured, then retry.`;
  }

  if (err?.code === 'ECONNREFUSED' || msg.includes('econnrefused')) {
    return 'Backend server is not running. Start it with: python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000';
  }

  if (msg.includes('cors')) {
    return 'Cross-origin request blocked (CORS). Restart the backend after updating CORS settings.';
  }

  return err?.message || 'Upload failed due to an unexpected error. Please retry.';
}

export function getResumeStatus(resume: { resume_score?: number | null } | null): string {
  if (!resume) return 'Not uploaded';
  if (resume.resume_score == null) return 'Parsed — pending score';
  if (resume.resume_score >= 80) return 'Excellent — ready to analyze';
  if (resume.resume_score >= 60) return 'Good — minor improvements suggested';
  return 'Needs improvement';
}
