import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Grid, List as ListIcon, MoreVertical, 
  Trash2, Copy, Edit2, FileText, Star, Eye, CheckCircle, Clock, Upload, X
} from 'lucide-react';
import { useUserStore, SavedResume } from '../../store/useUserStore';

interface ResumeLibraryProps {
  selectedResumeId: string | number | null;
  onSelectResume: (id: string | number) => void;
  onPreviewResume: (resume: SavedResume) => void;
}

export default function ResumeLibrary({ selectedResumeId, onSelectResume, onPreviewResume }: ResumeLibraryProps) {
  const { resumes, fetchResumes, isLoading, deleteResume, renameResume, duplicateResume } = useUserStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [renamingId, setRenamingId] = useState<string | number | null>(null);
  const [newName, setNewName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const processedResumes = useMemo(() => {
    let result = resumes;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        (r.name || '').toLowerCase().includes(q) || 
        (r.role || '').toLowerCase().includes(q) ||
        (r.analysis_data?.target_role || '').toLowerCase().includes(q) ||
        (r.skills || []).some(s => typeof s === 'string' ? s.toLowerCase().includes(q) : s.skill_name?.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'Newest') return (b.id as number) - (a.id as number); // Mock sort by ID desc
      if (sortBy === 'Oldest') return (a.id as number) - (b.id as number);
      if (sortBy === 'Highest ATS') return (b.resume_score || 0) - (a.resume_score || 0);
      if (sortBy === 'A-Z') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return result;
  }, [resumes, searchQuery, sortBy]);

  const handleDelete = async (id: string | number) => {
    await deleteResume(id);
    setOpenMenuId(null);
  };

  const handleDuplicate = async (id: string | number) => {
    await duplicateResume(id);
    setOpenMenuId(null);
  };

  const handleRenameSubmit = async (id: string | number) => {
    if (newName.trim()) {
      await renameResume(id, newName.trim());
    }
    setRenamingId(null);
    setOpenMenuId(null);
  };

  const { uploadResume } = useUserStore();
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const newResume = await uploadResume(e.target.files[0]);
      setIsUploading(false);
      if (newResume) {
        onSelectResume(newResume.id);
      }
    }
  };

  if (isLoading && resumes.length === 0) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-400 font-medium">Loading your Resume Library...</div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Resume...</h2>
            <p className="text-slate-400 text-center max-w-sm">Please wait while our AI extracts your skills and calculates your ATS score.</p>
          </div>
        ) : (
          <>
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 border-4 border-slate-800 shadow-2xl">
              <FileText className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No Resumes Found</h3>
            <p className="text-slate-400 max-w-md mb-8">
              Your Resume Library is currently empty. Upload your first resume to unlock ATS scoring, AI improvements, and top candidate comparisons.
            </p>
            <label className="cursor-pointer px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
              <Upload className="w-5 h-5" /> Upload Resume
              <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} />
            </label>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, role, or skills..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select 
              className="appearance-none bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Highest ATS</option>
              <option>A-Z</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* GRID / LIST VIEW */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        <AnimatePresence>
          {processedResumes.map(resume => {
            const isSelected = selectedResumeId === resume.id;
            const atsScore = resume.resume_score || 0;
            const expLevel = resume.analysis_data?.experience_years || 0;
            const skillsCount = (resume.skills || []).length;
            const targetRole = resume.analysis_data?.target_role || resume.role || "General";
            
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={resume.id}
                className={`relative group rounded-2xl border transition-all duration-300 ${viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col p-5'} ${isSelected ? 'bg-indigo-900/30 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}
              >
                
                {/* Selection Ring */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full border-4 border-[#0B1120] flex items-center justify-center z-10">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Header Row */}
                <div className={`flex justify-between items-start ${viewMode === 'list' ? 'w-1/4 pr-4 border-r border-slate-700' : 'mb-4'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                      <FileText className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      {renamingId === resume.id ? (
                        <div className="flex items-center gap-1">
                          <input 
                            autoFocus
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-white outline-none w-32"
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(resume.id)}
                          />
                          <button onClick={() => handleRenameSubmit(resume.id)} className="p-1 text-emerald-400 hover:bg-emerald-400/20 rounded"><CheckCircle className="w-3 h-3"/></button>
                          <button onClick={() => setRenamingId(null)} className="p-1 text-rose-400 hover:bg-rose-400/20 rounded"><X className="w-3 h-3"/></button>
                        </div>
                      ) : (
                        <h4 className="font-bold text-white text-sm truncate w-40" title={resume.name}>{resume.name}</h4>
                      )}
                      <div className="text-xs text-slate-500 truncate">{targetRole}</div>
                    </div>
                  </div>

                  {/* Popover Menu Trigger */}
                  {viewMode === 'grid' && (
                    <div className="relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === resume.id ? null : resume.id)}
                        className="p-1.5 text-slate-500 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Popover */}
                      <AnimatePresence>
                        {openMenuId === resume.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-1 w-36 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden"
                          >
                            <button onClick={() => { setRenamingId(resume.id); setNewName(resume.name); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> Rename</button>
                            <button onClick={() => handleDuplicate(resume.id)} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Duplicate</button>
                            <div className="h-px bg-slate-700 my-1"></div>
                            <button onClick={() => handleDelete(resume.id)} className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Metrics Row */}
                <div className={`${viewMode === 'list' ? 'flex-1 flex justify-around px-4' : 'grid grid-cols-3 gap-2 mb-4'}`}>
                  <div className="flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                    <span className={`font-bold ${atsScore >= 80 ? 'text-emerald-400' : atsScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{atsScore}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">ATS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                    <span className="font-bold text-white">{expLevel}y</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Exp</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                    <span className="font-bold text-white">{skillsCount}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Skills</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-2 ${viewMode === 'list' ? 'w-1/4 justify-end pl-4 border-l border-slate-700' : 'mt-auto'}`}>
                  <button 
                    onClick={() => onPreviewResume(resume)}
                    className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button 
                    onClick={() => onSelectResume(resume.id)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>

                  {/* List mode popover trigger */}
                  {viewMode === 'list' && (
                    <div className="relative">
                      <button onClick={() => setOpenMenuId(openMenuId === resume.id ? null : resume.id)} className="p-2 text-slate-500 hover:bg-slate-700 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      <AnimatePresence>
                        {openMenuId === resume.id && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 bottom-full mb-1 w-36 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <button onClick={() => { setRenamingId(resume.id); setNewName(resume.name); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-2"><Edit2 className="w-3 h-3" /> Rename</button>
                            <button onClick={() => handleDuplicate(resume.id)} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-2"><Copy className="w-3 h-3" /> Duplicate</button>
                            <button onClick={() => handleDelete(resume.id)} className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"><Trash2 className="w-3 h-3" /> Delete</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
