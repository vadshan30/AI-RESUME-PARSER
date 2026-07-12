import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Zap } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { useResumeStore } from '../../store/useResumeStore';

const fmtSize = (b: number | undefined) => {
  if (!b) return '';
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

interface Props {
  onUploadSuccess: (resume: any) => void;
}

export const ResumeUploadCenter: React.FC<Props> = ({ onUploadSuccess }) => {
  const { uploadResume } = useUserStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStage, setUploadStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setUploadError('Please upload a PDF, DOCX, or TXT file.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5 MB.'); return;
    }
    setSelectedFile(file); setUploadError(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true); setUploadError(null); setProgress(10); setUploadStage('Uploading…');
    const stages = [
      { pct: 28, label: 'Extracting…' }, { pct: 52, label: 'Parsing…' },
      { pct: 75, label: 'Scoring…' }, { pct: 90, label: 'Done…' },
    ];
    let si = 0;
    const iv = setInterval(() => setProgress(p => {
      if (p < 90) {
        const n = p + Math.random() * 7 + 2;
        if (si < stages.length && n >= stages[si].pct) { setUploadStage(stages[si].label); si++; }
        return Math.round(n);
      }
      return p;
    }), 400);
    try {
      const res = await uploadResume(selectedFile, targetRole);
      clearInterval(iv);
      if (!res) throw new Error('Unable to parse. Try a different file.');
      setProgress(100); setUploadStage('Done ✓');
      sessionStorage.setItem('active_resume_id', String(res.id));
      if (localStorage.getItem('remember_resume') === 'true') {
        localStorage.setItem('active_resume_id', String(res.id));
      } else {
        localStorage.removeItem('active_resume_id');
      }
      useResumeStore.setState({ currentResume: res as any, currentResumeId: res.id as any });
      setTimeout(() => {
        setIsUploading(false); setSelectedFile(null); setProgress(0);
        onUploadSuccess(res);
      }, 600);
    } catch (err: any) {
      clearInterval(iv); setIsUploading(false); setProgress(0);
      setUploadError(err?.message || 'Upload failed.');
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 relative overflow-hidden">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-3">
        <input
          type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
          placeholder="🎯 Target job title (optional)" disabled={isUploading}
          className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
        />
      </div>

      {/* Drop zone — compact */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 py-5 px-4 ${isDragging ? 'border-indigo-400 bg-indigo-500/10' :
            selectedFile ? 'border-emerald-500/60 bg-emerald-500/5' :
              'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/20'
          }`}
      >
        <input type="file" ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          accept=".pdf,.docx,.txt" className="hidden" disabled={isUploading} />

        <div className={`p-2 rounded-lg ${selectedFile ? 'bg-emerald-500/20' : 'bg-slate-900/80'}`}>
          {selectedFile
            ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            : <UploadCloud className="h-5 w-5 text-slate-500" />
          }
        </div>
        <div>
          <p className="text-sm font-bold text-slate-200">
            {selectedFile ? selectedFile.name : 'Drag & drop or click to browse'}
          </p>
          <p className="text-[11px] text-slate-500">
            {selectedFile ? fmtSize(selectedFile.size) : 'PDF · DOCX · TXT — max 5 MB'}
          </p>
        </div>
      </div>

      {/* Error */}
      {uploadError && (
        <div className="mt-2 flex items-start gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />{uploadError}
        </div>
      )}

      {/* Progress */}
      {isUploading && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs font-bold text-indigo-400">
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />{uploadStage}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Buttons */}
      {selectedFile && !isUploading && (
        <div className="mt-3 flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setUploadError(null); }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-bold transition-colors">
            Clear
          </button>
          <button onClick={handleUpload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">
            <Zap className="h-3.5 w-3.5" /> Upload & Analyze
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadCenter;
