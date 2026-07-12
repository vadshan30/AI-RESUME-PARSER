import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Target, AlertTriangle, TrendingUp, CheckCircle2, Clock, BookOpen, Loader, RefreshCw, Zap, ArrowLeft } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useSkillGapStore } from '../store/useSkillGapStore';
import { useActiveResume } from '../hooks/useActiveResume';
import { ModuleShell } from '../components/resume/ModuleShell';
import { GlobalResumeUpload } from '../components/resume/GlobalResumeUpload';
import { ActiveResumeBanner } from '../components/resume/ActiveResumeBanner';
import { RoleSelector } from '../components/resume/RoleSelector';

const SkillGap = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    setTargetRole,
    gapAnalysisResults,
    isLoading,
    error,
    analyzeGaps,
    clearResults,
  } = useSkillGapStore();

  const {
    resume,
    hasResume,
    isInitializing,
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    handleUpload,
    retryUpload,
    history,
    setCurrentResumeId,
    resumeId,
  } = useActiveResume({ targetRole });

  const [showUpload, setShowUpload] = useState(false);

  const handleAnalyze = async () => {
    if (!targetRole.trim()) return;
    await analyzeGaps();
  };

  if (!gapAnalysisResults) {
    return (
      <ModuleShell icon={Map} title="Skill Gap Analyzer" subtitle="Compare your resume against any target role" accent="emerald" showBackButton={true}>
        {isInitializing ? (
          <div className="flex flex-col items-center py-20">
            <Loader className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Checking resume status…</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200 group w-fit"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Dashboard
            </button>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tight">Discover Your Missing Skills</h1>
              <p className="text-slate-400">Compare your resume against your dream role to find exactly what you need to learn.</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Target className="h-48 w-48 text-emerald-500" />
              </div>

              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Step 1 — Resume</p>
                  {!hasResume || showUpload ? (
                    <GlobalResumeUpload
                      accent="emerald"
                      onUpload={async (file) => { await handleUpload(file, targetRole); setShowUpload(false); }}
                      onRetry={retryUpload}
                      isUploading={isUploading}
                      uploadProgress={uploadProgress}
                      uploadError={uploadError}
                      uploadSuccess={uploadSuccess}
                    />
                  ) : (
                    <div className="space-y-3">
                      <ActiveResumeBanner resume={resume!} onReplace={() => setShowUpload(true)} accent="emerald" />
                      {history.length > 1 && (
                        <div className="pt-3 border-t border-slate-700/50">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Switch resume</p>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto">
                            {history.map((h) => (
                              <button
                                key={h.id}
                                onClick={() => setCurrentResumeId(h.id)}
                                className={`w-full text-left p-2.5 rounded-lg border text-sm transition-colors ${
                                  resumeId === h.id
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                              >
                                {h.name || h.filename}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Step 2 — Target Role</p>
                  <RoleSelector value={targetRole} onChange={setTargetRole} accent="emerald" label="" />
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Step 3 — Analyze</p>
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !targetRole.trim() || !hasResume}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                    {isLoading ? 'Running skill gap analysis…' : 'Analyze Skill Gaps'}
                  </button>
                  {!hasResume && (
                    <p className="text-xs text-amber-400/80 mt-2 text-center">Upload a resume in Step 1 to continue.</p>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center text-rose-400">
                    <AlertTriangle className="h-5 w-5 mr-3 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </ModuleShell>
    );
  }

  const {
    matchScore, gapScore, summary, criticalGaps, highPriorityGaps, 
    mediumPriorityGaps, strongSkills, radarData, learningPlan, careerImpact
  } = gapAnalysisResults;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-emerald-500/30 pb-20">
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800 p-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200 group mr-1"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <div className="bg-emerald-600/20 p-2 rounded-lg border border-emerald-500/30">
              <Map className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="font-bold text-white tracking-tight">Skill Gap Results</span>
          </div>
          <button
            onClick={clearResults}
            className="flex items-center text-sm px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors font-bold"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> New Analysis
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 mt-4">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
              <Map className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Gap Analysis: <span className="text-emerald-400">{targetRole}</span></h1>
              <p className="text-slate-400 mt-1 font-medium">{summary}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 px-6 py-3 rounded-xl text-center">
              <div className="text-3xl font-black text-emerald-400">{matchScore}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Match Score</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 px-6 py-3 rounded-xl text-center">
              <div className="text-3xl font-black text-amber-400">{gapScore}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gap Score</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Gaps Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Critical Gaps */}
            {criticalGaps && criticalGaps.length > 0 && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2" /> Critical Missing Skills
                </h3>
                <div className="space-y-4">
                  {criticalGaps.map((gap, i) => (
                    <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-rose-500/20 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
                        <h4 className="text-xl font-bold text-white">{gap.skill}</h4>
                        <span className="text-xs px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full font-bold uppercase tracking-wider self-start sm:self-auto">Required: {gap.requiredLevel}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4">{gap.description}</p>
                      
                      {gap.learningResources && gap.learningResources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                          <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Suggested Resources</p>
                          {gap.learningResources.map((res, j) => (
                            <a href={res.url || '#'} key={j} className="flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors group">
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
                                <div>
                                  <p className="text-sm font-bold text-white">{res.title}</p>
                                  <p className="text-xs text-slate-400">{res.provider} • {res.cost}</p>
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center bg-slate-900 px-2 py-1 rounded">
                                <Clock className="h-3 w-3 mr-1" /> {res.timeToComplete}
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High & Medium Priority Gaps */}
            {(highPriorityGaps?.length > 0 || mediumPriorityGaps?.length > 0) && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" /> Areas for Improvement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityGaps?.map((gap, i) => (
                    <div key={`h-${i}`} className="bg-slate-900/50 p-5 rounded-2xl border border-amber-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-white text-lg">{gap.skill}</span>
                        <span className="text-[10px] px-2 py-1 bg-amber-500/20 text-amber-400 rounded font-bold uppercase">High</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{gap.description}</p>
                      <div className="text-xs text-slate-500 mt-auto pt-2"><Clock className="h-3 w-3 inline mr-1" /> {gap.estimatedTime}</div>
                    </div>
                  ))}
                  {mediumPriorityGaps?.map((gap, i) => (
                    <div key={`m-${i}`} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-white text-lg">{gap.skill}</span>
                        <span className="text-[10px] px-2 py-1 bg-slate-800 text-slate-400 rounded font-bold uppercase">Med</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{gap.description}</p>
                      <div className="text-xs text-slate-500 mt-auto pt-2"><Clock className="h-3 w-3 inline mr-1" /> {gap.estimatedTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Strong Skills */}
            {strongSkills && strongSkills.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center">
                  <CheckCircle2 className="h-6 w-6 mr-2" /> Your Strengths
                </h3>
                <div className="flex flex-wrap gap-3">
                  {strongSkills.map((skill, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-900/80 border border-emerald-500/30 rounded-xl flex items-center">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                      <span className="font-bold text-white text-sm">{skill.skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Radar Chart */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Competency Radar</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Radar name="Required" dataKey="B" stroke="#64748b" fill="#64748b" fillOpacity={0.2} strokeDasharray="3 3" />
                    <Radar name="Current" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs font-medium">
                <div className="flex items-center"><span className="w-3 h-3 bg-emerald-500/50 border border-emerald-500 mr-2 rounded-sm"></span> You</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-slate-500/20 border border-slate-500 border-dashed mr-2 rounded-sm"></span> Required</div>
              </div>
            </div>

            {/* Action Plan Summary */}
            {learningPlan && (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Fast-Track Plan</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  {learningPlan.roadmap.map((step, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:text-emerald-500 group-[.is-active]:border-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <span className="text-sm font-bold">{i + 1}</span>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-700 bg-slate-800/50 shadow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-white text-sm">{step.title}</div>
                        </div>
                        <div className="text-xs text-slate-400">{step.description}</div>
                        <div className="text-[10px] text-emerald-400 mt-2 font-medium bg-emerald-500/10 inline-block px-2 py-0.5 rounded uppercase">{step.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact */}
            {careerImpact && (
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Career Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-indigo-500/20 pb-2">
                    <span className="text-slate-400 text-sm">Salary Potential</span>
                    <span className="text-emerald-400 font-bold">{careerImpact.salaryIncrease}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-indigo-500/20 pb-2">
                    <span className="text-slate-400 text-sm">Time to Hire</span>
                    <span className="text-white font-bold">{careerImpact.timeToHire}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Market Demand</span>
                    <span className="text-white font-bold">{careerImpact.marketDemand}</span>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
