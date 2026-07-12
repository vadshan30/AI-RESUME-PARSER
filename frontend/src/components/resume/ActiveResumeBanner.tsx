import React from 'react';
import { FileText, CheckCircle2, Calendar, HardDrive } from 'lucide-react';
import { BackendResumeData } from '../../store/useResumeStore';
import { formatFileSize, getResumeStatus } from '../../utils/resumeUpload';

interface ActiveResumeBannerProps {
  resume: BackendResumeData;
  onReplace?: () => void;
  accent?: 'indigo' | 'emerald' | 'blue' | 'purple';
}

const scoreColor = (score?: number | null) => {
  if (score == null) return 'text-slate-400 bg-slate-500/15 border-slate-500/30';
  if (score >= 80) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
  if (score >= 60) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
};

export const ActiveResumeBanner: React.FC<ActiveResumeBannerProps> = ({
  resume,
  onReplace,
  accent = 'indigo',
}) => {
  const borderAccent = {
    indigo: 'border-emerald-500/30',
    emerald: 'border-emerald-500/30',
    blue: 'border-blue-500/30',
    purple: 'border-purple-500/30',
  }[accent];

  return (
    <div className={`bg-slate-800/50 border ${borderAccent} rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden`}>
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shrink-0">
            <FileText className="h-6 w-6 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 tracking-wider uppercase">Active Resume</span>
            </div>
            <h3 className="font-bold text-white truncate">{resume.name || resume.filename}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
              {resume.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(resume.created_at).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {resume.filename?.split('.').pop()?.toUpperCase() || 'PDF'}
              </span>
              <span>{getResumeStatus(resume)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {resume.resume_score != null && (
            <span className={`px-4 py-2 rounded-xl text-lg font-black border ${scoreColor(resume.resume_score)}`}>
              {resume.resume_score}
            </span>
          )}
          {onReplace && (
            <button
              onClick={onReplace}
              className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
            >
              Replace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveResumeBanner;
