import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { 
  ArrowLeft, BrainCircuit, Target, Loader, AlertTriangle, 
  CheckCircle, XCircle, ChevronDown, ChevronUp, DollarSign,
  TrendingUp, Award, BookOpen, Clock, Briefcase, Activity, Play, Zap, Compass, RefreshCw, UploadCloud
} from 'lucide-react';
import { useCareerIntelligenceStore } from '../store/useCareerIntelligenceStore';
import { useUserStore } from '../store/useUserStore';
import { JOB_CATEGORIES, ALL_ROLES } from '../data/jobRoles';

const CircularGauge = ({ score, title, colorClass, subtitle }: any) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
          <motion.circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${colorClass}`}>{score}</span>
        </div>
      </div>
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest text-center">{title}</h3>
      {subtitle && <p className="text-[10px] text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const AICareerIntelligence = () => {
  const location = useLocation();
  const isFromDashboard = location.pathname === '/dashboard/skill-gap';
  const { 
    selectedRole, setSelectedRole, analyzeCareer, 
    isAnalyzing, error, analysisData, clearAnalysis 
  } = useCareerIntelligenceStore();
  
  const { currentUser, getResumesForCurrentUser } = useUserStore();
  const resumes = getResumesForCurrentUser();
  const [searchTerm, setSearchTerm] = useState(selectedRole || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(selectedRole);
  }, [selectedRole]);

  const filteredCategories = JOB_CATEGORIES.map(cat => ({
    ...cat,
    roles: cat.roles.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.roles.length > 0);

  const isCustomRole = searchTerm.length > 0 && !ALL_ROLES.some(r => r.toLowerCase() === searchTerm.toLowerCase());

  const handleAnalyze = async () => {
    await analyzeCareer();
  };

  const renderRadarChart = () => {
    if (!analysisData) return null;
    const pBars = analysisData.analysis.progress_bars;
    const data = Object.keys(pBars).map(key => ({
      subject: key,
      score: pBars[key],
      fullMark: 100
    }));

    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Proficiency" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-blue-500/30 pb-20">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
              <BrainCircuit className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">Enterprise Career Intelligence</span>
          </div>
          <Link 
            to={isFromDashboard ? "/dashboard" : "/dashboard/analyze-resume"} 
            className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            {isFromDashboard ? "Back to Dashboard" : "Back to Intelligence Hub"}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!analysisData ? (
          <div className="max-w-3xl mx-auto space-y-8 mt-10">
            <div className="text-center">
              <h1 className="text-4xl font-black text-white mb-4">Select Your Target Career</h1>
              <p className="text-slate-400">Our AI will deeply analyze your resume against an enterprise intelligence database of 500+ job roles to map your career trajectory.</p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 block">Target Role</label>
              
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500 shadow-inner mb-4"
                  placeholder="Search 500+ careers (e.g. AI Engineer, DevOps)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                />
                
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-80 overflow-y-auto -mt-2">
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

              {resumes.length === 0 ? (
                <div className="mt-8 p-8 bg-slate-900/80 border border-slate-700/50 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-rose-500/10 p-4 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Resume Required</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-md">Our AI needs your resume data to build your career intelligence profile. Please upload a resume to unlock these features.</p>
                  <Link 
                    to="/dashboard/upload" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <UploadCloud className="h-5 w-5" />
                    Upload Your Resume Now
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !selectedRole}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 mt-6"
                >
                  {isAnalyzing ? <Loader className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
                  {isAnalyzing ? "Analyzing Career Gap..." : "Generate AI Career Report"}
                </button>
              )}

              {error && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center text-sm text-rose-400">
                  <AlertTriangle className="h-4 w-4 mr-2 shrink-0" /> {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-white">{analysisData.target_career.role_name}</h2>
                <p className="text-slate-400 mt-1">{analysisData.target_career.category} • AI Career Intelligence Report</p>
              </div>
              <button onClick={clearAnalysis} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" /> New Career
              </button>
            </div>

            {/* Core Readiness */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Activity className="h-6 w-6 text-blue-400 mr-2" /> Overall Career Readiness
                </h3>
                <div className="flex flex-wrap justify-around items-center gap-4">
                  <CircularGauge score={analysisData.analysis.readiness.overall} title="Overall Match" colorClass="text-blue-500" />
                  <CircularGauge score={analysisData.analysis.readiness.technical} title="Technical" colorClass="text-emerald-500" />
                  <CircularGauge score={analysisData.analysis.readiness.industry} title="Industry Fit" colorClass="text-indigo-500" />
                  <CircularGauge score={analysisData.analysis.readiness.interview} title="Interview" colorClass="text-amber-500" />
                </div>
              </div>
              
              <div className="md:col-span-4 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center">
                  <Target className="h-4 w-4 text-blue-400 mr-2" /> Skill Category Balance
                </h3>
                {renderRadarChart()}
              </div>
            </div>

            {/* Missing Skills Severity Matrix */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 text-rose-500 mr-2" /> Skill Gap Severity Matrix
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Critical */}
                <div className="bg-slate-900/50 border border-rose-500/30 rounded-2xl p-6">
                  <h4 className="font-bold text-rose-400 mb-4 uppercase tracking-widest text-xs flex items-center">
                    <XCircle className="h-4 w-4 mr-2" /> Critical Priorities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.analysis.missing_critical.filter((s: any) => s.severity === 'Critical').map((s: any) => (
                      <span key={s.skill} className="px-3 py-1.5 bg-rose-500/10 text-rose-300 text-sm font-bold rounded-lg border border-rose-500/20">{s.skill}</span>
                    ))}
                    {analysisData.analysis.missing_critical.filter((s: any) => s.severity === 'Critical').length === 0 && <span className="text-slate-500 text-sm italic">None missing!</span>}
                  </div>
                </div>

                {/* High */}
                <div className="bg-slate-900/50 border border-amber-500/30 rounded-2xl p-6">
                  <h4 className="font-bold text-amber-400 mb-4 uppercase tracking-widest text-xs flex items-center">
                    <Zap className="h-4 w-4 mr-2" /> High Priorities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.analysis.missing_critical.filter((s: any) => s.severity === 'High').map((s: any) => (
                      <span key={s.skill} className="px-3 py-1.5 bg-amber-500/10 text-amber-300 text-sm font-bold rounded-lg border border-amber-500/20">{s.skill}</span>
                    ))}
                    {analysisData.analysis.missing_critical.filter((s: any) => s.severity === 'High').length === 0 && <span className="text-slate-500 text-sm italic">None missing!</span>}
                  </div>
                </div>

                {/* Optional */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                  <h4 className="font-bold text-slate-400 mb-4 uppercase tracking-widest text-xs flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" /> Optional / Nice-to-have
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.analysis.optional.map((s: any) => (
                      <span key={s.skill} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700">{s.skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Plan */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-2" /> AI Learning Recommendations
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(analysisData.target_career.learning_recommendations || {}).map(([skill, details]: [string, any]) => (
                  <div key={skill} className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${details.priority === 'Critical' ? 'bg-rose-500' : details.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-lg">{skill}</h4>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold border border-slate-700 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {details.hours} Hours
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{details.why}</p>
                    <div className="pt-4 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Recommended Projects</span>
                      <ul className="space-y-1">
                        {details.projects.map((p: string, i: number) => (
                          <li key={i} className="text-xs text-indigo-300 flex items-start">
                            <span className="mr-2 text-indigo-500">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Industry Demand */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400 mr-2" /> Industry Demand
                </h3>
                <div className="space-y-4">
                  {Object.entries(analysisData.target_career.industry_demand).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-sm font-bold capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-emerald-400 font-black tracking-wide">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Matrix */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <DollarSign className="h-6 w-6 text-emerald-400 mr-2" /> Global Salary Estimates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysisData.target_career.salary_range).map(([country, range]: [string, any]) => (
                    <div key={country} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-1">{country}</span>
                      <span className="text-white font-bold">{range}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Career Transitions */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center">
                <Compass className="h-6 w-6 mr-2" /> Alternative Career Paths
              </h3>
              <p className="text-sm text-slate-400 mb-6">Based on your current trajectory towards {analysisData.target_career.role_name}, you could easily pivot to these roles with minor upskilling:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisData.analysis.transitions.map((t: any, i: number) => (
                  <div key={i} className="p-6 bg-slate-900/80 rounded-2xl border border-slate-700">
                    <h4 className="font-bold text-white text-lg mb-3">{t.role}</h4>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Required Additions</span>
                    <div className="flex flex-wrap gap-2">
                      {t.added_skills.map((s: string) => (
                        <span key={s} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AICareerIntelligence;
