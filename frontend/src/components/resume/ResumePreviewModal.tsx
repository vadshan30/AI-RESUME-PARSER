import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, CheckCircle, Zap, Briefcase, GraduationCap } from 'lucide-react';
import { SavedResume } from '../../store/useUserStore';

interface ResumePreviewModalProps {
  resume: SavedResume;
  onClose: () => void;
  onSelect: () => void;
}

export default function ResumePreviewModal({ resume, onClose, onSelect }: ResumePreviewModalProps) {
  const atsScore = resume.resume_score || 0;
  const analysis = resume.analysis_data || {};
  const strengths = analysis.strengths || [];
  const expYears = analysis.experience_years || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0B1120]/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/30">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-400" />
              {resume.name}
            </h2>
            <div className="text-slate-400 text-sm mt-1">{resume.filename || "Uploaded Resume"} • {resume.lastUpdated}</div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Top Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-black mb-1 ${atsScore >= 80 ? 'text-emerald-400' : atsScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{atsScore}</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">ATS Score</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white mb-1">{expYears}</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Years Exp</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white mb-1">{(resume.skills || []).length}</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Skills</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white mb-1">{(resume.projects || []).length}</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Projects</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" /> Top Strengths
                </h3>
                {strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {strengths.slice(0, 4).map((s: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300 bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/50">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-500 bg-slate-800/30 p-4 rounded-lg">No advanced insights available for this resume yet.</div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" /> Experience Timeline
                </h3>
                <div className="space-y-3">
                  {(resume.experience || []).slice(0, 3).map((exp: any, i: number) => {
                    const title = typeof exp === 'string' ? exp.substring(0, 40) + "..." : exp.experience_detail?.substring(0, 40) + "...";
                    return (
                      <div key={i} className="border-l-2 border-amber-500/50 pl-3 py-1">
                        <div className="text-sm text-white font-medium">{title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" /> Education
                </h3>
                <div className="space-y-2">
                  {(resume.education || []).map((edu: any, i: number) => {
                    const deg = typeof edu === 'string' ? edu : edu.degree_name;
                    return (
                      <div key={i} className="text-sm text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                        {deg}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(resume.skills || []).slice(0, 15).map((skill: any, i: number) => {
                    const sName = typeof skill === 'string' ? skill : skill.skill_name;
                    return (
                      <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg">
                        {sName}
                      </span>
                    );
                  })}
                  {(resume.skills || []).length > 15 && (
                    <span className="px-2.5 py-1 bg-slate-800/50 border border-slate-700 text-slate-500 text-xs font-medium rounded-lg">
                      +{(resume.skills || []).length - 15} more
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => { onSelect(); onClose(); }}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <CheckCircle className="w-5 h-5" /> Select This Resume
          </button>
        </div>
      </motion.div>
    </div>
  );
}
