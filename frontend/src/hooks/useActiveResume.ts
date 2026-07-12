import { useCallback, useEffect, useRef, useState } from 'react';
import { useResumeStore, BackendResumeData } from '../store/useResumeStore';
import {
  parseUploadError,
  UploadProgress,
  STAGE_LABELS,
  validateResumeFile,
  getFileExtension,
  formatFileSize,
} from '../utils/resumeUpload';

interface UseActiveResumeOptions {
  targetRole?: string;
  autoInit?: boolean;
}

export function useActiveResume(options: UseActiveResumeOptions = {}) {
  const { targetRole, autoInit = true } = options;
  const {
    currentResume,
    currentResumeId,
    history,
    isAnalyzing,
    error: storeError,
    uploadResume,
    fetchResumeById,
    setCurrentResumeId,
  } = useResumeStore();

  const [isInitializing, setIsInitializing] = useState(autoInit);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: 'idle',
    percent: 0,
    label: STAGE_LABELS.idle,
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearProgressTimer = () => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  const simulateServerStages = useCallback(() => {
    clearProgressTimer();
    const stages: UploadProgress[] = [
      { stage: 'uploading', percent: 20, label: STAGE_LABELS.uploading },
      { stage: 'extracting', percent: 45, label: STAGE_LABELS.extracting },
      { stage: 'parsing', percent: 70, label: STAGE_LABELS.parsing },
      { stage: 'scoring', percent: 90, label: STAGE_LABELS.scoring },
    ];
    let idx = 0;
    setUploadProgress(stages[0]);
    progressTimer.current = setInterval(() => {
      idx += 1;
      if (idx < stages.length) {
        setUploadProgress(stages[idx]);
      } else {
        clearProgressTimer();
      }
    }, 900);
  }, []);

  useEffect(() => {
    if (!autoInit) {
      setIsInitializing(false);
      return;
    }

    const init = async () => {
      setIsInitializing(true);
      try {
        if (localStorage.getItem('remember_resume') !== 'true') {
          // Clean up legacy caching for users who didn't opt in
          localStorage.removeItem('active_resume_id');
          localStorage.removeItem('resume-local-storage');
        }
        
        const activeId = localStorage.getItem('remember_resume') === 'true'
          ? localStorage.getItem('active_resume_id')
          : sessionStorage.getItem('active_resume_id');

        if (activeId && !currentResume) {
          await fetchResumeById(Number(activeId));
        }
      } catch {
        sessionStorage.removeItem('active_resume_id');
        localStorage.removeItem('active_resume_id');
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [autoInit, currentResume, fetchResumeById]);

  useEffect(() => () => clearProgressTimer(), []);

  const handleUpload = useCallback(
    async (file: File, role?: string): Promise<BackendResumeData | null> => {
      setUploadError(null);
      setUploadSuccess(false);
      setLastUploadedFile(file);

      const validationError = validateResumeFile(file);
      if (validationError) {
        setUploadError(validationError);
        setUploadProgress({ stage: 'error', percent: 0, label: STAGE_LABELS.error });
        return null;
      }

      setUploadProgress({ stage: 'checking', percent: 5, label: STAGE_LABELS.checking });
      simulateServerStages();

      try {
        const result = await uploadResume(file, role ?? targetRole);
        clearProgressTimer();
        setUploadProgress({ stage: 'complete', percent: 100, label: STAGE_LABELS.complete });
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 5000);
        return result;
      } catch (err) {
        clearProgressTimer();
        const message = parseUploadError(err);
        setUploadError(message);
        setUploadProgress({ stage: 'error', percent: 0, label: STAGE_LABELS.error });
        return null;
      }
    },
    [simulateServerStages, targetRole, uploadResume],
  );

  const retryUpload = useCallback(async (): Promise<BackendResumeData | null> => {
    if (!lastUploadedFile) return null;
    return handleUpload(lastUploadedFile, targetRole);
  }, [handleUpload, lastUploadedFile, targetRole]);

  const resetUploadState = useCallback(() => {
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress({ stage: 'idle', percent: 0, label: STAGE_LABELS.idle });
  }, []);

  return {
    resume: currentResume,
    resumeId: currentResumeId,
    history,
    isInitializing,
    isUploading: isAnalyzing,
    uploadProgress,
    uploadError: uploadError || storeError,
    uploadSuccess,
    lastUploadedFile,
    handleUpload,
    retryUpload,
    setCurrentResumeId,
    resetUploadState,
    hasResume: Boolean(currentResumeId && currentResume),
    lastUploadMeta: lastUploadedFile
      ? {
          name: lastUploadedFile.name,
          type: getFileExtension(lastUploadedFile.name).toUpperCase(),
          size: formatFileSize(lastUploadedFile.size),
          at: new Date().toLocaleTimeString(),
        }
      : null,
  };
}
