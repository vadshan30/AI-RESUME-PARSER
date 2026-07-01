import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Target, Loader, CheckCircle, XCircle, 
  UploadCloud, FileText, ChevronDown, ChevronUp, AlertCircle, 
  Briefcase, Award, Zap, BookOpen, User, RefreshCw, MessageSquare, 
  DollarSign, HelpCircle, ShieldAlert, CheckSquare, Flame, TrendingUp
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useJobMatchStore } from '../store/useJobMatchStore';
import { useResumeStore } from '../store/useResumeStore';
import { CategoryAnalysis } from '../lib/MatchAnalyzer';
import JobRoleSelector from '../components/job-match/JobRoleSelector';
import JobDescriptionInput from '../components/job-match/JobDescriptionInput';

const CircularGauge = ({ score, title, colorClass, badgeClass, subtitle, icon: Icon }: any) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/40 border border-slate-700/50 rounded-3xl shadow-xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Icon className={`h-32 w-32 ${colorClass}`} />
      </div>
      <div className="relative w-48 h-48 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle className="text-slate-800" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="70" cy="70" />
          <motion.circle
            className={colorClass}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-black ${colorClass}`}>{score}{subtitle === '%' ? '%' : ''}</span>
          {!subtitle || subtitle !== '%' ? <span className="text-xs font-bold text-slate-500 tracking-widest mt-1">/ 100</span> : null}
        </div>
      </div>
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 text-center">{title}</h3>
      {subtitle && subtitle !== '%' && (
        <span className={`px-4 py-1.5 rounded-full border text-xs font-bold ${badgeClass} text-center`}>
          {subtitle}
        </span>
      )}
    </div>
  );
};

const SkillRadarChart = ({ categories }: { categories: Record<string, CategoryAnalysis> }) => {
  const data = Object.values(categories).map(cat => ({
    subject: cat.name.replace(' Match', ''),
    score: cat.score,
    fullMark: 100,
  }));

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Score" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#c4b5fd', fontWeight: 'bold' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const JobMatch = () => {
  const navigate = useNavigate();
  const { 
    matchResult, 
    isAnalyzing, 
    analyzeMatch, 
    selectedRole, 
    clearResults, 
    saveMatch,
    error 
  } = useJobMatchStore();

  const { currentResumeId, currentResume } = useResumeStore();

  const handleAnalyze = async () => {
    await analyzeMatch();
    saveMatch();
  };

  const selectedResume = currentResume;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 75) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-indigo-500/30 pb-20">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Target className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">Enterprise ATS Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!matchResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <JobRoleSelector />
              <JobDescriptionInput />
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <FileText className="h-32 w-32 text-indigo-500" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                    <User className="h-5 w-5 text-indigo-400 mr-2" /> Target Resume
                  </h2>
                  <div className="relative">
                    {!currentResumeId ? (
                      <div className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-4 text-slate-400 font-medium text-center">
                        You haven't uploaded any resumes yet.
                      </div>
                    ) : (
                      <div className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-4 text-white font-medium shadow-inner">
                        {currentResume?.name || "Target Resume"} • Active
                      </div>
                    )}
                  </div>

                  {selectedResume ? (
                    <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                      <p className="text-sm font-bold text-white mb-1">{selectedResume.analysis_data?.target_role || "Role Inference Missing"}</p>
                      <p className="text-xs text-slate-400 mb-3">{selectedResume.experience?.length || 0} experiences listed</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.skills?.slice(0, 6).map(s => (
                          <span key={s.skill_name || s} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] uppercase font-bold rounded">{s.skill_name || s}</span>
                        ))}
                        {(selectedResume.skills?.length || 0) > 6 && <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] uppercase font-bold rounded">+{(selectedResume.skills?.length || 0) - 6} more</span>}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 relative">
                    <button 
                      onClick={() => navigate('/dashboard/platform-analysis')}
                      className="w-full py-4 border-2 border-dashed border-slate-600 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors font-bold text-sm flex justify-center items-center gap-2"
                    >
                      <UploadCloud className="h-5 w-5" /> {selectedResume ? "Upload Another Resume" : "Upload Your First Resume"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl sticky top-24">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                   <Target className="h-5 w-5 text-indigo-400 mr-2" /> Start Analysis
                </h2>
                <p className="text-sm text-slate-400 mb-6">Our enterprise matching engine will simulate an ATS scan against the role requirements to calculate your Hiring Probability.</p>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !selectedRole}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {isAnalyzing ? <Loader className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                  {isAnalyzing ? "Running ATS Scan..." : "Run ATS Scan"}
                </button>
                {error && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center text-sm text-rose-400">
                    <AlertCircle className="h-4 w-4 mr-2 shrink-0" /> {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-white">{selectedRole} Analysis</h2>
                <p className="text-slate-400 mt-1">Enterprise ATS simulation and recruiter readiness report</p>
              </div>
              <button 
                onClick={clearResults}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold flex items-center transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> New Analysis
              </button>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CircularGauge 
                score={matchResult.overall} 
                title="ATS Match Score" 
                colorClass={getScoreColor(matchResult.overall)} 
                badgeClass={getScoreBadge(matchResult.overall)} 
                subtitle={matchResult.status}
                icon={Target} 
              />
              <CircularGauge 
                score={matchResult.hiringProbability} 
                title="Hiring Probability" 
                colorClass={getScoreColor(matchResult.hiringProbability)} 
                badgeClass={getScoreBadge(matchResult.hiringProbability)} 
                subtitle="%"
                icon={TrendingUp} 
              />
              <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-2 text-indigo-400" /> Skill Radar Match
                </h3>
                <SkillRadarChart categories={matchResult.categoryScores} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recruiter & Interview Column */}
              <div className="lg:col-span-4 space-y-8">
                {/* Recruiter Notes */}
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageSquare className="h-24 w-24 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" /> Recruiter Notes
                  </h3>
                  <p className="text-slate-300 italic text-sm leading-relaxed relative z-10 border-l-2 border-indigo-500/50 pl-4">
                    "{matchResult.recruiterNotes}"
                  </p>
                </div>

                {/* Salary Estimation */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" /> Salary Estimation
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-sm font-bold">India</span>
                      <span className="text-emerald-400 font-black tracking-wide">{matchResult.salaryEstimation.india}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-sm font-bold">USA</span>
                      <span className="text-emerald-400 font-black tracking-wide">{matchResult.salaryEstimation.usa}</span>
                    </div>
                  </div>
                </div>

                {/* Interview Readiness */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" /> Expected Interview Topics
                  </h3>
                  <ul className="space-y-3">
                    {matchResult.interviewTopics.map((topic, i) => (
                      <li key={i} className="flex items-start text-slate-300 text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        <Flame className="h-4 w-4 text-amber-500 mr-3 mt-0.5 shrink-0" />
                        <span className="font-medium">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Analysis Column */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Priority Heatmap (Gaps) */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <XCircle className="h-6 w-6 text-rose-500 mr-2" /> Missing Skills Priority
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchResult.gaps.length > 0 ? matchResult.gaps.map((g, i) => (
                      <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-white text-lg">{g.skill}</h4>
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border
                            ${g.urgency === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 
                              g.urgency === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                              'bg-slate-700/30 text-slate-400 border-slate-600'}
                          `}>
                            {g.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded">{g.action}</p>
                      </div>
                    )) : (
                       <div className="col-span-2 flex items-center justify-center p-8 text-slate-500 border border-slate-700 border-dashed rounded-xl">
                         No missing skills detected!
                       </div>
                    )}
                  </div>
                </div>

                {/* Projects Match */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Briefcase className="h-6 w-6 text-indigo-400 mr-2" /> Expected Projects Match
                    </h3>
                    <span className="text-sm font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                      {matchResult.projectMatches.relevantCount} / {matchResult.projectMatches.expectedCount} Relevant
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {matchResult.projectMatches.projects.map((p, i) => (
                      <div key={i} className={`flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border ${p.isRelevant ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
                        <div>
                          <h4 className={`font-bold ${p.isRelevant ? 'text-emerald-400' : 'text-slate-400'}`}>{p.projectName}</h4>
                          {p.isRelevant && p.matchedKeywords.length > 0 && (
                            <p className="text-xs text-emerald-500/70 mt-1 uppercase font-bold tracking-wider flex gap-2">
                              Matches: {p.matchedKeywords.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <span className={`text-sm font-black ${p.isRelevant ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {p.relevanceScore}% Relevance
                          </span>
                        </div>
                      </div>
                    ))}
                    {matchResult.projectMatches.missingKeywords.length > 0 && (
                      <div className="mt-6 p-4 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5">
                        <h4 className="text-sm font-bold text-amber-400 mb-2">Missing Expected Projects:</h4>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.projectMatches.missingKeywords.map(mk => (
                            <span key={mk} className="px-2 py-1 bg-amber-500/10 text-amber-300 text-xs rounded border border-amber-500/20">
                              {mk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Strong Matches */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center">
                    <CheckSquare className="h-6 w-6 mr-2" /> Strong Role Competencies
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {matchResult.matches.map((m, i) => (
                      <div key={i} className="flex flex-col items-center justify-center bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3 text-center">
                        <span className="font-bold text-slate-200 text-sm truncate w-full">{m.skill}</span>
                        <span className="text-[10px] text-emerald-500 uppercase tracking-widest mt-1 font-bold">{m.importance}</span>
                      </div>
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

export default JobMatch;
