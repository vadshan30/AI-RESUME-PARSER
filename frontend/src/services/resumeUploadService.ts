import api from './api';
import { env } from '../utils/env';
import {
  validateResumeFile,
  parseUploadError,
  ResumeUploadError,
  UPLOAD_TIMEOUT_MS,
  MAX_FILE_SIZE,
} from '../utils/resumeUpload';
import type { BackendResumeData } from '../store/useResumeStore';

export interface UploadResult {
  resume: BackendResumeData;
  sessionSynced: boolean;
}

let lastHealthCheck: { at: number; ok: boolean } | null = null;
const HEALTH_CACHE_MS = 10_000;

/**
 * Verify the backend is reachable before attempting a file upload.
 */
export async function checkBackendReachable(force = false): Promise<void> {
  const now = Date.now();
  if (!force && lastHealthCheck && now - lastHealthCheck.at < HEALTH_CACHE_MS && lastHealthCheck.ok) {
    return;
  }

  try {
    const response = await api.get('/', { timeout: 8000 });
    if (response.status >= 200 && response.status < 500) {
      lastHealthCheck = { at: now, ok: true };
      return;
    }
    throw new ResumeUploadError(
      'Backend server responded with an unexpected status. Restart the backend and retry.',
      'backend_down',
    );
  } catch (error) {
    lastHealthCheck = { at: now, ok: false };
    if (error instanceof ResumeUploadError) throw error;
    throw new ResumeUploadError(parseUploadError(error), 'backend_down');
  }
}

function syncSessionOwnership(resumeId: number | string) {
  try {
    const storedIds: (number | string)[] = JSON.parse(
      sessionStorage.getItem('my_uploaded_resume_ids') || '[]',
    );
    if (!storedIds.includes(resumeId)) {
      storedIds.push(resumeId);
      sessionStorage.setItem('my_uploaded_resume_ids', JSON.stringify(storedIds));
    }
  } catch {
    sessionStorage.setItem('my_uploaded_resume_ids', JSON.stringify([resumeId]));
  }
}

/**
 * Single global resume upload — used by every dashboard module.
 * Do NOT set Content-Type manually; the browser must add the multipart boundary.
 */
export async function uploadResumeFile(
  file: File,
  targetRole?: string,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const validationError = validateResumeFile(file);
  if (validationError) {
    throw new ResumeUploadError(validationError, 'validation', true);
  }

  await checkBackendReachable();

  const formData = new FormData();
  formData.append('file', file, file.name);
  if (targetRole?.trim()) {
    formData.append('target_role', targetRole.trim());
  }

  try {
    const response = await api.post<BackendResumeData>('/resume/upload', formData, {
      timeout: UPLOAD_TIMEOUT_MS,
      maxContentLength: MAX_FILE_SIZE,
      maxBodyLength: MAX_FILE_SIZE,
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });

    const resume = response.data;
    if (!resume?.id) {
      throw new ResumeUploadError(
        'Resume saved but the server returned an invalid response. Please retry.',
        'server',
      );
    }

    sessionStorage.setItem('active_resume_id', String(resume.id));
    if (localStorage.getItem('remember_resume') === 'true') {
      localStorage.setItem('active_resume_id', String(resume.id));
    } else {
      localStorage.removeItem('active_resume_id');
    }
    syncSessionOwnership(resume.id);
    lastHealthCheck = { at: Date.now(), ok: true };

    if (env.getConfig().enableDebug) {
      console.info('[ResumeUpload] Success', { id: resume.id, name: resume.name || resume.filename });
    }

    return { resume, sessionSynced: true };
  } catch (error) {
    if (error instanceof ResumeUploadError) throw error;
    throw new ResumeUploadError(parseUploadError(error), 'unknown');
  }
}

export function invalidateBackendHealthCache() {
  lastHealthCheck = null;
}
