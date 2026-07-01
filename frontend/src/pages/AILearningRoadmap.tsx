import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Map, BookOpen, Clock, Target, Loader, AlertTriangle, 
  ChevronDown, ChevronUp, CheckCircle, Circle, Play, Calendar, 
  TrendingUp, Award, Briefcase, DollarSign, Activity, FileText
} from 'lucide-react';
import { useRoadmapGeneratorStore } from '../store/useRoadmapGeneratorStore';
import { useUserStore } from '../store/useUserStore';
import { JOB_CATEGORIES, ALL_ROLES } from '../data/jobRoles';

const PhaseAccordion = ({ phase, index, toggleTask }: any) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const completedCount = phase.tasks?.filter((t: any) => t.completed).length || 0;
  const totalTasks = phase.tasks?.length || 0;
  const progress = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden mb-4 shadow-lg">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-slate-700/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black border border-blue-500/30">
            {phase.id}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{phase.title}</h3>
            <p className="text-sm text-slate-400">{phase.duration_weeks} Weeks • {phase.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 mb-1">{progress}% Completed</span>
            <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
          {isOpen ? <ChevronUp className="h-6 w-6 text-slate-400" /> : <ChevronDown className="h-6 w-6 text-slate-400" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50"
          >
            <div className="p-6 space-y-6">
              
              {/* Dynamic Content based on phase type */}
              {phase.modules && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.modules.map((mod: any, i: number) => (
                    <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-blue-400">{mod.skill}</h4>
                        <span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded border border-slate-600">{mod.study_hours}h</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{mod.why}</p>
                      <ul className="space-y-1">
                        {mod.practice_tasks.map((pt: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>{pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {phase.projects && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {phase.projects.map((proj: any, i: number) => (
                    <div key={i} className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                      <h4 className="font-bold text-emerald-400 mb-1">{proj.name}</h4>
                      <div className="flex justify-between items-center mb-3 text-xs text-slate-400">
                        <span>{proj.difficulty}</span>
                        <span>{proj.time}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {proj.skills_used.map((s: string) => (
                          <span key={s} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {phase.interview_topics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(phase.interview_topics).map(([cat, topics]: [string, any]) => (
                    <div key={cat} className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                      <h4 className="font-bold text-amber-400 mb-2 uppercase tracking-widest text-xs">{cat.replace('_', ' ')}</h4>
                      <ul className="space-y-1">
                        {topics.map((t: string, idx: number) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start">
                            <span className="text-amber-500 mr-2">•</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {phase.certifications && (
                <div className="space-y-3">
                  {phase.certifications.map((c: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                      <span className="font-bold text-blue-300">{c.name}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">{c.study_time}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* General Topics List if no specific modules */}
              {phase.topics && !phase.modules && (
                <div className="flex flex-wrap gap-2">
                  {phase.topics.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg">{t}</span>
                  ))}
                </div>
              )}

              {/* Progress Checklist */}
              {phase.tasks && phase.tasks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-blue-400" /> Action Checklist
                  </h4>
                  <div className="space-y-2">
                    {phase.tasks.map((task: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                          ${task.completed ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-800'}
                        `}
                        onClick={() => toggleTask(phase.id, idx)}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-blue-500 mr-3 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-500 mr-3 shrink-0" />
                        )}
                        <span className={`text-sm ${task.completed ? 'text-blue-300 line-through opacity-70' : 'text-slate-300 font-medium'}`}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AILearningRoadmap = () => {
  const { 
    selectedRole, missingSkills, setSelectedRole, setMissingSkills,
    generateRoadmap, isGenerating, error, roadmapData, 
    clearRoadmap, toggleTaskCompletion 
  } = useRoadmapGeneratorStore();
  
  const { currentUser, getResumesForCurrentUser } = useUserStore();
  const resumes = getResumesForCurrentUser();
  const [searchTerm, setSearchTerm] = useState(selectedRole || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localMissingSkills, setLocalMissingSkills] = useState("");

  useEffect(() => {
    setSearchTerm(selectedRole);
  }, [selectedRole]);

  // Pre-fill missing skills based on resume analysis if available, otherwise just use empty and let backend handle
  useEffect(() => {
    if (resumes.length > 0 && missingSkills.length === 0) {
      // Mocking auto-detection for the UI
      setMissingSkills(["Docker", "Kubernetes", "GraphQL"]);
      setLocalMissingSkills("Docker, Kubernetes, GraphQL");
    }
  }, [resumes, missingSkills.length, setMissingSkills]);

  const filteredCategories = JOB_CATEGORIES.map(cat => ({
    ...cat,
    roles: cat.roles.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.roles.length > 0);

  const isCustomRole = searchTerm.length > 0 && !ALL_ROLES.some(r => r.toLowerCase() === searchTerm.toLowerCase());

  const handleGenerate = async () => {
    const parsedSkills = localMissingSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setMissingSkills(parsedSkills);
    await generateRoadmap();
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-blue-500/30 pb-20">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
              <Map className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Career Mentor</span>
          </div>
          <Link to="/dashboard" className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!roadmapData ? (
          <div className="max-w-3xl mx-auto space-y-8 mt-10">
            <div className="text-center">
              <h1 className="text-4xl font-black text-white mb-4">Generate Your Path</h1>
              <p className="text-slate-400">Our AI Mentor dynamically structures a completely personalized, 8-phase roadmap based on your missing skills and target career.</p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-2xl space-y-6">
              
              {/* Role Selection */}
              <div>
                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 block">Target Role</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500 shadow-inner"
                    placeholder="Search 500+ careers (e.g. AI Engineer, React Developer)..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (!isDropdownOpen) setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-80 overflow-y-auto mt-2">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, idx) => (
                          <div key={idx} className="border-b border-slate-700/50 last:border-0">
                            <div className="bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                              {category.name}
                            </div>
                            {category.roles.map(role => (
                              <div 
                                key={role}
                                className="px-6 py-3 hover:bg-blue-500/10 cursor-pointer text-slate-300 font-medium hover:text-blue-300 transition-colors"
                                onClick={() => {
                                  setSelectedRole(role);
                                  setSearchTerm(role);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {role}
                              </div>
                            ))}
                          </div>
                        ))
                      ) : (
                         <div className="p-4 text-center text-slate-400 text-sm">No exact matches. Type to use custom role.</div>
                      )}
                      {isCustomRole && (
                        <div 
                          className="px-6 py-4 bg-blue-600/20 hover:bg-blue-600/30 cursor-pointer border-t border-blue-500/30 text-white font-bold"
                          onClick={() => {
                            setSelectedRole(searchTerm);
                            setIsDropdownOpen(false);
                          }}
                        >
                          Use Custom Career: {searchTerm}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Extracted Missing Skills Override */}
              <div>
                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Detected Missing Skills</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Auto-extracted from Resume</span>
                </label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500 shadow-inner"
                  value={localMissingSkills}
                  onChange={(e) => setLocalMissingSkills(e.target.value)}
                  placeholder="e.g. Python, Docker, React (comma separated)"
                />
                <p className="text-xs text-slate-500 mt-2">These skills will drive the Core Technologies learning phase.</p>
              </div>

              {resumes.length === 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center text-amber-400 text-sm font-bold">
                  <AlertTriangle className="h-5 w-5 mr-2 shrink-0" /> No resume uploaded. You will need to manually enter your missing skills.
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedRole}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 mt-6"
              >
                {isGenerating ? <Loader className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
                {isGenerating ? "Synthesizing Roadmap..." : "Generate Deep Roadmap"}
              </button>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center text-sm text-rose-400">
                  <AlertTriangle className="h-4 w-4 mr-2 shrink-0" /> {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
              <div>
                <h2 className="text-4xl font-black text-white flex items-center">
                  {roadmapData.role_name} <span className="ml-3 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm uppercase tracking-widest rounded-lg border border-blue-500/30">Roadmap</span>
                </h2>
                <div className="flex items-center gap-6 mt-4 text-slate-400 text-sm font-medium">
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-slate-500" /> {roadmapData.timeline.total_months} Months Total</span>
                  <span className="flex items-center"><Target className="h-4 w-4 mr-2 text-slate-500" /> {roadmapData.phases.length} Phases</span>
                </div>
              </div>
              <button onClick={clearRoadmap} className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-sm font-bold transition-colors">
                Regenerate Map
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Timeline Column */}
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Map className="h-6 w-6 mr-3 text-blue-400" /> 8-Phase Mentorship Path
                </h3>
                
                <div className="space-y-4">
                  {roadmapData.phases.map((phase: any, idx: number) => (
                    <PhaseAccordion key={phase.id} phase={phase} index={idx} toggleTask={toggleTaskCompletion} />
                  ))}
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Global Salary Trajectory */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" /> Expected Salary Trajectory
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(roadmapData.salary_growth).map(([level, salary]: [string, any], idx) => (
                      <div key={level} className="relative">
                        {idx !== 0 && <div className="absolute w-0.5 h-4 bg-emerald-500/20 left-4 -top-4" />}
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 z-10">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <div className="ml-4 flex-1 flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <span className="text-slate-300 font-bold text-sm">{level}</span>
                            <span className="text-emerald-400 font-black tracking-wide">{salary}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Plan Snapshot */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-400" /> 12-Week Sprint Snapshot
                  </h3>
                  <div className="space-y-3">
                    {roadmapData.weekly_plan.map((wp: any) => (
                      <div key={wp.week} className="flex gap-4">
                        <div className="w-12 text-center shrink-0">
                          <span className="text-[10px] uppercase font-black text-slate-500 block">Wk</span>
                          <span className="text-xl font-black text-white">{wp.week}</span>
                        </div>
                        <div className="flex-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                          <span className="text-xs font-bold text-blue-400 mb-1 block">{wp.focus}</span>
                          <p className="text-sm text-slate-400 truncate w-48">{wp.tasks[0]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Targeted Missing Skills */}
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" /> Targeting Identified Gaps
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">This roadmap explicitly integrates core modules for the following missing skills detected from your resume.</p>
                  <div className="flex flex-wrap gap-2">
                    {roadmapData.missing_skills_targeted.map((s: string) => (
                      <span key={s} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AILearningRoadmap;
