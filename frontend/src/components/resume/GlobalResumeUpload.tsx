import React, { useCallback, useRef, useState } from 'react';
import {
  UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText, RefreshCw, Zap,
} from 'lucide-react';
import { ACCEPTED_EXTENSIONS, formatFileSize, getFileExtension } from '../../utils/resumeUpload';
import type { UploadProgress } from '../../utils/resumeUpload';
import type { BackendResumeData } from '../../store/useResumeStore';

interface GlobalResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  onRetry?: () => Promise<void | BackendResumeData | null>;
  isUploading?: boolean;
  uploadProgress?: UploadProgress;
  uploadError?: string | null;
  uploadSuccess?: boolean;
  variant?: 'default' | 'large';
  title?: string;
  description?: string;
  accent?: 'indigo' | 'emerald' | 'blue' | 'purple';
}

const accentStyles = {
  indigo: {
    border: 'border-indigo-500/40 hover:border-indigo-400',
    active: 'border-indigo-400 bg-indigo-500/10',
    btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25',
    bar: 'from-indigo-500 to-purple-500',
    icon: 'text-indigo-400',
  },
  emerald: {
    border: 'border-emerald-500/40 hover:border-emerald-400',
    active: 'border-emerald-400 bg-emerald-500/10',
    btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25',
    bar: 'from-emerald-500 to-teal-500',
    icon: 'text-emerald-400',
  },
  blue: {
    border: 'border-blue-500/40 hover:border-blue-400',
    active: 'border-blue-400 bg-blue-500/10',
    btn: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25',
    bar: 'from-blue-500 to-cyan-500',
    icon: 'text-blue-400',
  },
  purple: {
    border: 'border-purple-500/40 hover:border-purple-400',
    active: 'border-purple-400 bg-purple-500/10',
    btn: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25',
    bar: 'from-purple-500 to-pink-500',
    icon: 'text-purple-400',
  },
};

export const GlobalResumeUpload: React.FC<GlobalResumeUploadProps> = ({
  onUpload,
  onRetry,
  isUploading = false,
  uploadProgress,
  uploadError,
  uploadSuccess = false,
  variant = 'default',
  title = 'No Resume Uploaded',
  description = 'Upload your resume to use this feature.',
  accent = 'indigo',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rememberResume, setRememberResume] = useState(() => localStorage.getItem('remember_resume') === 'true');
  const styles = accentStyles[accent];
  const isLarge = variant === 'large';

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    await onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const retry = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRetry) {
      await onRetry();
      return;
    }
    if (selectedFile) {
      await onUpload(selectedFile);
      return;
    }
    fileInputRef.current?.click();
  };

  const acceptList = ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(',');

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm shadow-2xl ${isLarge ? 'p-8 sm:p-10' : 'p-6'}`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${styles.bar}`} />

      <div className={`text-center ${isLarge ? 'mb-8' : 'mb-5'}`}>
        <div className={`inline-flex items-center justify-center rounded-2xl bg-slate-900/60 border border-slate-700/50 mb-4 ${isLarge ? 'w-20 h-20' : 'w-14 h-14'}`}>
          <FileText className={`${isLarge ? 'h-10 w-10' : 'h-7 w-7'} ${styles.icon}`} />
        </div>
        <h2 className={`font-black text-white ${isLarge ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{title}</h2>
        <p className={`text-slate-400 mt-2 max-w-lg mx-auto ${isLarge ? 'text-base' : 'text-sm'}`}>{description}</p>
      </div>

      <div className={`grid gap-4 mb-6 ${isLarge ? 'sm:grid-cols-2' : ''}`}>
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Supported formats</p>
          <ul className="text-sm text-slate-300 space-y-1">
            {ACCEPTED_EXTENSIONS.map((ext) => (
              <li key={ext} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                .{ext.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Maximum size</p>
          <p className="text-sm text-slate-300 font-semibold">5 MB</p>
          {isLarge && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Tip: Legacy .DOC files should be saved as .DOCX or PDF for best results.
            </p>
          )}
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3
          ${isLarge ? 'py-10 px-6' : 'py-6 px-4'}
          ${isDragging ? styles.active : selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : `${styles.border} hover:bg-slate-700/20`}
          ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptList}
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />
        {selectedFile && !isUploading ? (
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        ) : (
          <UploadCloud className={`h-8 w-8 ${isDragging ? styles.icon : 'text-slate-500'}`} />
        )}
        <div className="text-center">
          <p className="text-sm font-bold text-slate-200">
            {selectedFile ? selectedFile.name : 'Drag & drop your resume here'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {selectedFile
              ? `${getFileExtension(selectedFile.name).toUpperCase()} · ${formatFileSize(selectedFile.size)}`
              : 'or click to browse files'}
          </p>
        </div>
      </div>

      {isUploading && uploadProgress && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {uploadProgress.label}
            </span>
            <span>{uploadProgress.percent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${styles.bar} rounded-full transition-all duration-500`}
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {uploadSuccess && selectedFile && (
        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm animate-fade-up space-y-1">
          <p className="font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Resume uploaded successfully
          </p>
          <p className="text-emerald-200/80 text-xs pl-6">
            {selectedFile.name} · {getFileExtension(selectedFile.name).toUpperCase()} · {formatFileSize(selectedFile.size)} · Ready for analysis
          </p>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
          <div className="flex items-start gap-2 text-rose-400 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{uploadError}</p>
              {selectedFile && (
                <p className="text-xs text-rose-300/70 mt-1">File kept: {selectedFile.name}</p>
              )}
              <button
                type="button"
                onClick={retry}
                disabled={isUploading}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white transition-colors disabled:opacity-50"
              >
                <RefreshCw className="h-3 w-3" /> Retry upload
              </button>
            </div>
          </div>
        </div>
      )}

      {!isUploading && !uploadSuccess && (
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full flex items-center justify-center gap-2 py-3.5 text-white rounded-xl text-sm font-bold transition-all shadow-lg ${styles.btn}`}
          >
            <Zap className="h-4 w-4" /> Upload Resume
          </button>
          
          <label className="flex items-center justify-center gap-2 cursor-pointer mt-2 text-slate-300 text-sm">
            <input 
              type="checkbox" 
              className="rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
              checked={rememberResume}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setRememberResume(isChecked);
                if (isChecked) {
                  localStorage.setItem('remember_resume', 'true');
                  const currentActiveId = sessionStorage.getItem('active_resume_id');
                  if (currentActiveId) {
                    localStorage.setItem('active_resume_id', currentActiveId);
                  }
                  const sessionState = sessionStorage.getItem('resume-local-storage');
                  if (sessionState) {
                    localStorage.setItem('resume-local-storage', sessionState);
                  }
                } else {
                  localStorage.removeItem('remember_resume');
                  localStorage.removeItem('active_resume_id');
                  localStorage.removeItem('resume-local-storage');
                }
              }}
            />
            <span>Remember my resume on this device</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default GlobalResumeUpload;
