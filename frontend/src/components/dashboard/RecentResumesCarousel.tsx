import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, ArrowRight, CheckCircle2, Star, MoreVertical, ChevronLeft } from 'lucide-react';
import { SavedResume } from '../../store/useUserStore';
import { useResumeStore } from '../../store/useResumeStore';

interface Props {
  resumes: SavedResume[];
  activeResumeId?: string | number | null;
  onSetActive: (resume: SavedResume) => void;
}

const ScoreBadge: React.FC<{ score?: number }> = ({ score }) => {
  if (score == null) return <span className="text-xs text-slate-600 font-medium">Not scanned</span>;
  const color = score >= 80 ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
    : score >= 60 ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    : 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black border ${color}`}>
      ATS {score}
    </span>
  );
};

const ScoreRing: React.FC<{ score?: number }> = ({ score }) => {
  if (score == null) return null;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
      <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx="24" cy="24" r="18" fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 24 24)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>{score}</text>
    </svg>
  );
};

export const RecentResumesCarousel: React.FC<Props> = ({ resumes, activeResumeId, onSetActive }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  if (resumes.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" /> Recent Resumes
          </h2>
        </div>
        <div className="bg-slate-900/40 border border-dashed border-slate-700/60 rounded-2xl p-10 text-center">
          <FileText className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">No resumes yet</p>
          <p className="text-slate-600 text-xs mt-1">Upload your first resume using the upload center above</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" /> Recent Resumes
          <span className="ml-1 text-xs font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
            {resumes.length}
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700/50 transition-colors">
            <ChevronLeft className="h-4 w-4 text-slate-400" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700/50 transition-colors">
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
          <button
            onClick={() => navigate('/dashboard/history')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-2 rounded-xl transition-all"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {resumes.map((r) => {
          const isActive = String(r.id) === String(activeResumeId);
          return (
            <div
              key={r.id}
              onClick={() => onSetActive(r)}
              className={`group shrink-0 w-[220px] cursor-pointer bg-slate-800/60 border-2 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isActive
                  ? 'border-indigo-500/70 shadow-lg shadow-indigo-500/20 bg-indigo-900/20'
                  : 'border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-black text-indigo-400 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-2.5 w-2.5" /> ACTIVE
                    </span>
                  )}
                  {!isActive && r.resume_score != null && r.resume_score >= 85 && (
                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      <Star className="h-2.5 w-2.5" /> BEST
                    </span>
                  )}
                </div>
                <ScoreRing score={r.resume_score} />
              </div>

              {/* Name */}
              <p className={`font-bold text-sm truncate mb-1 transition-colors ${isActive ? 'text-indigo-300' : 'text-white group-hover:text-indigo-300'}`}>
                {r.name || r.filename || 'Untitled Resume'}
              </p>

              {/* Date + Score badge */}
              <p className="text-[11px] text-slate-500 mb-3">
                {r.lastUpdated
                  ? new Date(r.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Recently added'}
              </p>

              <ScoreBadge score={r.resume_score} />

              {/* Set active CTA */}
              {!isActive && (
                <div className="mt-3 text-[11px] font-bold text-slate-600 group-hover:text-indigo-400 flex items-center gap-1 transition-colors">
                  Set Active <ChevronRight className="h-3 w-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentResumesCarousel;
