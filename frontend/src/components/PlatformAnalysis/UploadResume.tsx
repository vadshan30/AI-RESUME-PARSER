import React, { useState, useRef } from 'react';
import { UploadCloud as FileUpload, Loader } from 'lucide-react';

interface UploadResumeProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  error?: string;
}

export const UploadResume: React.FC<UploadResumeProps> = ({ onUpload, isUploading, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [rememberResume, setRememberResume] = useState(() => localStorage.getItem('remember_resume') === 'true');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
        dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 bg-slate-800/30'
      }`}
      onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-3">
        <FileUpload className={`w-12 h-12 ${dragActive ? 'text-blue-400' : 'text-slate-400'}`} />
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 font-bold hover:underline"
            disabled={isUploading}
          >
            Click to upload
          </button>
          <span className="text-slate-400"> or drag and drop</span>
        </div>
        <p className="text-sm text-slate-500">PDF only (max 5MB)</p>
        
        {!isUploading && (
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-slate-300">
            <input
              type="checkbox"
              className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
              checked={rememberResume}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setRememberResume(isChecked);
                if (isChecked) {
                  localStorage.setItem('remember_resume', 'true');
                  const currentActiveId = sessionStorage.getItem('active_resume_id');
                  if (currentActiveId) localStorage.setItem('active_resume_id', currentActiveId);
                  const sessionState = sessionStorage.getItem('resume-local-storage');
                  if (sessionState) localStorage.setItem('resume-local-storage', sessionState);
                } else {
                  localStorage.removeItem('remember_resume');
                  localStorage.removeItem('active_resume_id');
                  localStorage.removeItem('resume-local-storage');
                }
              }}
            />
            <span>Remember my resume on this device</span>
          </label>
        )}

        {error && <p className="text-rose-500 text-sm mt-2">{error}</p>}
        {isUploading && (
          <div className="flex items-center gap-2 mt-2">
            <Loader className="animate-spin text-blue-400" size={20} />
            <span className="text-slate-300 font-medium">Analyzing your resume...</span>
          </div>
        )}
      </div>
    </div>
  );
};
