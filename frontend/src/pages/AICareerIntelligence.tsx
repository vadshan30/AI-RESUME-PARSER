import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, BrainCircuit, Target, Loader, AlertTriangle,
  CheckCircle, XCircle, DollarSign, TrendingUp, Award, BookOpen,
  Clock, Briefcase, Activity, Play, Zap, Compass, RefreshCw, UploadCloud
} from 'lucide-react';
import { useCareerIntelligenceStore } from '../store/useCareerIntelligenceStore';
import { useResumeStore } from '../store/useResumeStore';
import { useActiveResume } from '../hooks/useActiveResume';
import { GlobalResumeUpload } from '../components/resume/GlobalResumeUpload';
import { ActiveResumeBanner } from '../components/resume/ActiveResumeBanner';
import { JOB_CATEGORIES, ALL_ROLES } from '../data/jobRoles';

const CircularGauge = ({ score, title, colorClass }: any) => {
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
    </div>
  );
};

const AICareerIntelligence = () => {
  const navigate = useNavigate();
  const { selectedRole, setSelectedRole, analyzeCareer, isAnalyzing, error, analysisData, clearAnalysis } = useCareerIntelligenceStore();
  const { currentResume, currentResumeId } = useResumeStore();
  const { handleUpload, uploadProgress, uploadError, uploadSuccess, isUploading } = useActiveResume();

  const [searchTerm, setSearchTerm] = useState(selectedRole || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(!currentResumeId);

  useEffect(() => {
    setSearchTerm(selectedRole);
  }, [selectedRole]);

  // Auto-regenerate when resume changes
  useEffect(() => {
    if (currentResumeId && analysisData && analysisData._resume_id !== currentResumeId) {
      clearAnalysis();
    }
  }, [currentResumeId, analysisData, clearAnalysis]);

  const filteredCategories = JOB_CATEGORIES.map(cat => ({
    ...cat,
    roles: cat.roles.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.roles.length > 0);

  const isCustomRole = searchTerm.length > 0 && !ALL_ROLES.some(r => r.toLowerCase() === searchTerm.toLowerCase());

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setSearchTerm(role);
    setIsDropdownOpen(false);
  };

  const handleAnalyze = async () => {
    if (!currentResumeId) {
      alert('Please upload a resume first.');
      return;
    }
    await analyzeCareer();
  };

  const handleUploadResume = async (file: File) => {
    await handleUpload(file);
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-blue-500/30 pb-20">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
              <BrainCircuit className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Career Intelligence</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!analysisData ? (
          <div className="max-w-3xl mx-auto space-y-8 mt-10">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-black text-white mb-4">AI Career Intelligence</h1>
              <p className="text-slate-400">Select your target role and upload your resume. Our AI will analyze your career trajectory and provide personalized insights.</p>
            </div>

            {/* Step 1: Target Role Selection */}
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Step 1: Select Target Role
                </h2>
                <p className="text-sm text-slate-400">Choose from 500+ career paths or enter a custom role.</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500 shadow-inner"
                  placeholder="Search careers (e.g. AI Engineer, DevOps, UI Designer)..."
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
                              onClick={() => handleSelectRole(role)}
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
                        onClick={() => handleSelectRole(searchTerm)}
                      >
                        Use Custom Career: {searchTerm}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedRole && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2 text-sm text-blue-300">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Target role selected: <span className="font-bold">{selectedRole}</span>
                </div>
              )}
            </div>

            {/* Step 2: Resume Upload or Selection */}
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-blue-400" />
                  Step 2: Upload or Select Resume
                </h2>
                <p className="text-sm text-slate-400">Choose your resume for analysis.</p>
              </div>

              {currentResumeId && !showUpload ? (
                <div className="space-y-4">
                  <ActiveResumeBanner
                    resume={currentResume!}
                    onReplace={() => setShowUpload(true)}
                    accent="blue"
                  />
                  <button
                    onClick={() => setShowUpload(true)}
                    className="w-full py-3 text-sm font-bold text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-colors"
                  >
                    Use Different Resume
                  </button>
                </div>
              ) : (
                <GlobalResumeUpload
                  onUpload={handleUploadResume}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  uploadSuccess={uploadSuccess}
                  variant="large"
                  accent="blue"
                  title="Upload Your Resume"
                  description="Drag and drop your resume or click to browse. Supports PDF, DOCX, and TXT."
                />
              )}
            </div>

            {/* Step 3: Generate Report */}
            {currentResumeId && selectedRole && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Generating Career Intelligence...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    Generate AI Career Report
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3 text-rose-400">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-white">{analysisData.target_career?.role_name || selectedRole}</h2>
                <p className="text-slate-400 mt-1">Career Intelligence Report • {analysisData.target_career?.category}</p>
              </div>
              <button
                onClick={() => clearAnalysis()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                New Analysis
              </button>
            </div>

            {/* Career Readiness Scores */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-400" />
                  Career Readiness Breakdown
                </h3>
                <div className="flex flex-wrap justify-around items-center gap-4">
                  <CircularGauge score={analysisData.analysis?.readiness?.overall || 0} title="Overall Readiness" colorClass="text-blue-500" />
                  <CircularGauge score={analysisData.analysis?.readiness?.technical || 0} title="Technical" colorClass="text-indigo-500" />
                  <CircularGauge score={analysisData.analysis?.readiness?.industry || 0} title="Experience" colorClass="text-amber-500" />
                  <CircularGauge score={analysisData.analysis?.readiness?.interview || 0} title="Soft Skills" colorClass="text-emerald-500" />
                </div>
              </div>

              <div className="md:col-span-4 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-400" />
                  Readiness Scores
                </h3>
                <div className="space-y-3">
                  {Object.entries(analysisData.analysis?.progress_bars || {}).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-lg font-bold text-blue-400">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Summary */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Resume Summary</h3>
              <p className="text-slate-300 leading-relaxed">{analysisData.target_career?.resume_summary}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Strongest Skills
                </h3>
                <ul className="space-y-2">
                  {(analysisData.target_career?.strongest_skills || []).map((skill: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-500 mt-1">•</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Missing Skills
                </h3>
                <ul className="space-y-2">
                  {(analysisData.target_career?.missing_skills || []).map((skill: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-rose-500 mt-1">•</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Skill Gap Analysis
              </h3>
              <p className="text-slate-300 leading-relaxed">{analysisData.target_career?.skill_gap_analysis}</p>
            </div>

            {/* Salary & Market */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  Salary Estimation
                </h3>
                <div className="space-y-3">
                  {Object.entries(analysisData.target_career?.salary_range || {}).map(([region, salary]: [string, any]) => (
                    <div key={region} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <span className="text-sm text-slate-400 capitalize">{region}</span>
                      <span className="font-bold text-emerald-400">{salary}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Industry Demand
                </h3>
                <div className="space-y-3">
                  {Object.entries(analysisData.target_career?.industry_demand || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <span className="text-sm text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                      <span className="font-bold text-blue-400">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Priorities */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Priorities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysisData.target_career?.learning_recommendations || {}).map(([skill, rec]: [string, any], i: number) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">{skill}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        rec.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                        rec.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{rec.why}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.hours}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '30-Day Plan', data: analysisData.target_career?.action_plan_30_days, color: 'blue' },
                { title: '60-Day Plan', data: analysisData.target_career?.action_plan_60_days, color: 'amber' },
                { title: '90-Day Plan', data: analysisData.target_career?.action_plan_90_days, color: 'emerald' },
              ].map(({ title, data, color }) => (
                <div key={title} className={`bg-${color}-500/5 border border-${color}-500/20 rounded-3xl p-6`}>
                  <h3 className={`text-lg font-bold text-${color}-400 mb-4`}>{title}</h3>
                  <ul className="space-y-2">
                    {(data || []).map((action: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className={`text-${color}-500 mt-1`}>•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* AI Coach Advice */}
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                AI Career Coach Advice
              </h3>
              <p className="text-slate-300 leading-relaxed">{analysisData.target_career?.ai_coach_advice}</p>
            </div>

            {/* Alternative Roles */}
            {analysisData.analysis?.transitions && analysisData.analysis.transitions.length > 0 && (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-blue-400" />
                  Alternative Career Paths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisData.analysis.transitions.map((role: any, i: number) => (
                    <div key={i} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-bold text-white mb-2">{role.role}</h4>
                      <p className="text-sm text-slate-400 mb-3">{role.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Match</span>
                        <span className="text-lg font-bold text-blue-400">{role.match_percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Dashboard */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700/50 hover:border-slate-600 transition-all duration-200 shadow-lg group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AICareerIntelligence;
