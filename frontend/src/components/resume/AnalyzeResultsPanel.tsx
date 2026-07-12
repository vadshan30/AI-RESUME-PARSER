import React from 'react';
import {
  Award, TrendingUp, ThumbsUp, ThumbsDown, Lightbulb, BarChart3,
  CheckCircle2, XCircle, Sparkles, User, Mail, Phone,
} from 'lucide-react';
import { BackendResumeData } from '../../store/useResumeStore';

interface AnalyzeResultsPanelProps {
  resume: BackendResumeData;
}

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black" style={{ color }}>{score}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ATS Score</span>
      </div>
    </div>
  );
};

export const AnalyzeResultsPanel: React.FC<AnalyzeResultsPanelProps> = ({ resume }) => {
  const analysis = resume.analysis_data || {};
  const breakdown = analysis.score_breakdown || {};
  const strengths: string[] = analysis.strengths || [];
  const weaknesses: string[] = analysis.weaknesses || [];
  const recommendations: string[] = (analysis.recommendations || []).map((r: any) =>
    typeof r === 'string' ? r : r?.text || ''
  ).filter(Boolean);
  const skills = (resume.skills || []).map((s) => (typeof s === 'string' ? s : s.skill_name)).filter(Boolean);

  const breakdownItems = Object.entries(breakdown).map(([key, val]: [string, any]) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    score: val?.score ?? 0,
    max: val?.max ?? 10,
  }));

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-white">Resume Score</h3>
          </div>
          <ScoreRing score={resume.resume_score ?? 0} />
          <p className="text-xs text-slate-500 mt-4 text-center">
            Based on ATS formatting, skills, experience, and content quality
          </p>
        </div>

        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" /> Score Breakdown
          </h3>
          {breakdownItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {breakdownItems.map((item) => (
                <div key={item.label} className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{item.label}</span>
                    <span className="font-bold text-white">{item.score}/{item.max}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${Math.min(100, (item.score / item.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Detailed breakdown will appear after parsing.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-400" /> Resume Preview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="h-4 w-4 text-slate-500" /> {resume.name || 'Name not detected'}
          </div>
          {resume.email && (
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="h-4 w-4 text-slate-500" /> {resume.email}
            </div>
          )}
          {resume.phone && (
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="h-4 w-4 text-slate-500" /> {resume.phone}
            </div>
          )}
        </div>
        {skills.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skill Summary ({skills.length})</p>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 20).map((skill) => (
                <span key={skill} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/20">
                  {skill}
                </span>
              ))}
              {skills.length > 20 && (
                <span className="px-2.5 py-1 text-xs text-slate-500">+{skills.length - 20} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strengths.length > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" /> Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.slice(0, 5).map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {weaknesses.length > 0 && (
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
            <h4 className="font-bold text-rose-400 mb-3 flex items-center gap-2">
              <ThumbsDown className="h-4 w-4" /> Weak Areas
            </h4>
            <ul className="space-y-2">
              {weaknesses.slice(0, 5).map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {recommendations.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
            <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> Suggestions
            </h4>
            <ul className="space-y-2">
              {recommendations.slice(0, 5).map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <Award className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {analysis.quality_summary && (
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-indigo-300 mb-1">Resume Quality</h4>
            <p className="text-sm text-slate-400">{analysis.quality_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeResultsPanel;
