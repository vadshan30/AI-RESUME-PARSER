import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Globe, Briefcase, TrendingUp, Cpu, Award, Target, FileText, 
  AlertTriangle, Loader, ChevronRight, Activity, BookOpen, Star, Sparkles
} from 'lucide-react';
import { useInsightsStore } from '../store/useInsightsStore';
import { useUserStore } from '../store/useUserStore';

const AICareerInsights = () => {
  const { isAnalyzing, error, insightsData, analyzeInsights, clearInsights } = useInsightsStore();
  const { getResumesForCurrentUser } = useUserStore();
  
  const resumes = getResumesForCurrentUser();
  const activeResume = resumes[0]; // Just picking the first one for demonstration

  const handleAnalyze = () => {
    // If no active resume, use a mock for the demo
    const resumeData = activeResume || {
      skills: ["Python", "JavaScript", "React", "Docker", "AWS", "Machine Learning", "FastAPI"]
    };
    analyzeInsights(resumeData);
  };

  const dnaData = insightsData ? [
    { subject: 'Innovation', A: insightsData.dna['Innovation'] },
    { subject: 'Leadership', A: insightsData.dna['Leadership'] },
    { subject: 'Technical', A: insightsData.dna['Technical Depth'] },
    { subject: 'Problem Solving', A: insightsData.dna['Problem Solving'] },
    { subject: 'Communication', A: insightsData.dna['Communication'] },
    { subject: 'Adaptability', A: insightsData.dna['Adaptability'] },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-indigo-500/30 pb-20">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Globe className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">Enterprise Career Intelligence</span>
          </div>
          <Link to="/dashboard" className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!insightsData ? (
          <div className="max-w-3xl mx-auto mt-20 text-center space-y-8">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-4">
              <Sparkles className="h-12 w-12 text-indigo-400" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight">Global Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Intelligence</span></h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We analyze your resume against 500+ global careers simultaneously to extract your unique Career DNA, predict salary trajectories, and identify your absolute strongest market fits.
            </p>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-2xl max-w-md mx-auto">
              {!activeResume && (
                 <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start text-amber-400 text-sm font-medium text-left">
                   <AlertTriangle className="h-5 w-5 mr-3 shrink-0 mt-0.5" /> 
                   No resume uploaded. We will use a mock profile (Full Stack / AI) to demonstrate the intelligence center.
                 </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {isAnalyzing ? <Loader className="h-5 w-5 animate-spin" /> : <Activity className="h-5 w-5" />}
                {isAnalyzing ? "Scanning 500+ Roles..." : "Run Global Analysis"}
              </button>

              {error && (
                <p className="mt-4 text-sm text-rose-400 flex justify-center items-center"><AlertTriangle className="h-4 w-4 mr-2" /> {error}</p>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Header / Primary Domain */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-2" /> Primary Career Domain
                </h2>
                <h1 className="text-4xl font-black text-white">{insightsData.primary_domain} Engineering</h1>
              </div>
              <button onClick={clearInsights} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors border border-slate-700">
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: DNA and Readiness */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Career DNA Radar */}
                <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center"><Target className="h-5 w-5 mr-2 text-indigo-400" /> Your Career DNA</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dnaData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="DNA" dataKey="A" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {dnaData.map(d => (
                      <div key={d.subject} className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">{d.subject}</span>
                        <span className="font-bold text-white">{d.A}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Readiness Metrics */}
                <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 space-y-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center"><Activity className="h-5 w-5 mr-2 text-emerald-400" /> Career Readiness</h3>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Overall Readiness</span><span className="font-bold text-white">{insightsData.readiness.overall}%</span></div>
                    <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${insightsData.readiness.overall}%` }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Technical Competence</span><span className="font-bold text-white">{insightsData.readiness.technical}%</span></div>
                    <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${insightsData.readiness.technical}%` }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">ATS Score</span><span className="font-bold text-white">{insightsData.readiness.ats_score}%</span></div>
                    <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: `${insightsData.readiness.ats_score}%` }}></div></div>
                  </div>
                </div>

                {/* Success Probability */}
                <div className="bg-indigo-500/10 p-6 rounded-3xl border border-indigo-500/20">
                  <h3 className="text-lg font-bold text-indigo-400 mb-4">Probability of Success</h3>
                  <div className="flex items-end gap-4">
                    <div className="text-4xl font-black text-white">{insightsData.success_probability.current}%</div>
                    <div className="text-sm text-slate-400 mb-1">Current Base Chance</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-indigo-500/20 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-300">After Upskilling</span>
                      <span className="font-bold text-emerald-400">~{insightsData.success_probability.after_upskilling}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-300">After Portfolio Prep</span>
                      <span className="font-bold text-emerald-400">~{insightsData.success_probability.after_portfolio}%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Top Matches, Salaries, Timeline */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Top Matches Feed */}
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center"><Cpu className="h-6 w-6 mr-3 text-indigo-400" /> Top 10 Career Matches</h3>
                      <p className="text-sm text-slate-400 mt-1">Out of 500+ analyzed global roles.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {insightsData.top_matches.map((match: any, idx: number) => (
                      <div key={idx} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">{match.role}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-black ${
                            match.match_percentage >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            match.match_percentage >= 80 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {match.match_percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{match.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Salary Intelligence */}
                  <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center"><Globe className="h-5 w-5 mr-2 text-blue-400" /> Global Salary Bands</h3>
                    <div className="space-y-4">
                      {Object.entries(insightsData.salary_intelligence).map(([region, bands]: [string, any]) => (
                        <div key={region}>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{region}</div>
                          <div className="flex justify-between text-sm bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <div className="text-center"><div className="text-[10px] text-slate-500 mb-0.5">ENTRY</div><div className="text-slate-300">{bands.Entry}</div></div>
                            <div className="text-center"><div className="text-[10px] text-slate-500 mb-0.5">MID</div><div className="text-blue-400 font-bold">{bands.Mid}</div></div>
                            <div className="text-center"><div className="text-[10px] text-slate-500 mb-0.5">SENIOR</div><div className="text-emerald-400 font-bold">{bands.Senior}</div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Market Demand */}
                  <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-rose-400" /> Market Intelligence</h3>
                    <div className="space-y-4">
                      {Object.entries(insightsData.market_demand).map(([key, val]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0">
                          <span className="text-sm text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                          <span className="text-sm font-bold text-white">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Career Trajectory Timeline */}
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center"><Briefcase className="h-6 w-6 mr-3 text-amber-400" /> Projected Career Trajectory</h3>
                  <div className="relative">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-700 rounded-full"></div>
                    <div className="space-y-6 relative">
                      {insightsData.timeline.map((stage: any, idx: number) => (
                        <div key={idx} className="flex gap-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-[#0B1120] ${idx === 0 ? 'bg-amber-400' : 'bg-slate-600'}`}>
                            <div className="w-2 h-2 rounded-full bg-[#0B1120]"></div>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-white">{stage.title}</h4>
                              <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded font-bold">{stage.years}</span>
                            </div>
                            <p className="text-sm text-slate-400">{stage.milestone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Advice & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center"><Award className="h-5 w-5 mr-2" /> Recommended Certifications</h3>
                    <div className="space-y-3">
                      {insightsData.certifications.map((cert: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                          <h4 className="font-bold text-white text-sm mb-2">{cert.name}</h4>
                          <div className="flex gap-2 text-[10px] font-bold">
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded">{cert.difficulty}</span>
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded">{cert.time}</span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">ROI: {cert.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20">
                    <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center"><BookOpen className="h-5 w-5 mr-2" /> Personal AI Mentor Notes</h3>
                    <ul className="space-y-4">
                      {insightsData.ai_advice.map((advice: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start">
                          <ChevronRight className="h-4 w-4 mr-2 text-blue-500 shrink-0 mt-0.5" /> {advice}
                        </li>
                      ))}
                    </ul>
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

export default AICareerInsights;
