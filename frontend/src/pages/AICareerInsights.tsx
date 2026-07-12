import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import {
  Globe, Briefcase, TrendingUp, Target, Award, BookOpen, Clock,
  AlertTriangle, Loader, Activity, RefreshCw, DollarSign, Compass,
  CheckCircle, XCircle, Zap, Star, ArrowRight, Upload,
} from 'lucide-react';
import { useCareerIntelligenceStore } from '../store/useCareerIntelligenceStore';
import { useActiveResume } from '../hooks/useActiveResume';
import { ModuleShell } from '../components/resume/ModuleShell';
import { GlobalResumeUpload } from '../components/resume/GlobalResumeUpload';
import { ActiveResumeBanner } from '../components/resume/ActiveResumeBanner';
import { RoleSelector } from '../components/resume/RoleSelector';

const CircularGauge = ({ score, title, colorClass }: { score: number; title: string; colorClass: string }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-28 h-28 mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-black ${colorClass}`}>{score}</span>
        </div>
      </div>
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{title}</h3>
    </div>
  );
};

const AICareerInsights = () => {
  const {
    selectedRole,
    setSelectedRole,
    analyzeCareer,
    isAnalyzing,
    error,
    analysisData,
    clearAnalysis,
  } = useCareerIntelligenceStore();

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
  } = useActiveResume({ targetRole: selectedRole });

  const [showUpload, setShowUpload] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const handleAnalyze = async () => {
    if (!hasResume) return;
    await analyzeCareer();
  };

  const handleUploadOnly = async (file: File) => {
    clearAnalysis();
    setUploadDone(false);
    const uploaded = await handleUpload(file, selectedRole || 'General');
    setShowUpload(false);
    if (uploaded) {
      setUploadDone(true);
    }
  };

  const handleNewAnalysis = () => {
    clearAnalysis();
    setUploadDone(false);
  };

  const analysis = analysisData?.analysis;

  const renderRadarChart = () => {
    const radar = analysis?.progress_bars;
    if (!radar || typeof radar !== 'object') return null;
    const data = Object.entries(radar).map(([key, score]) => ({
      subject: key,
      score: score as number,
    }));
    if (data.length === 0) return null;
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Proficiency" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <ModuleShell icon={Globe} title="Career Insights" subtitle="AI-powered career paths, salary, and market intelligence" accent="purple" showBackButton>
      {!analysisData ? (
        isInitializing ? (
          <div className="flex flex-col items-center py-20">
            <Loader className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading resume…</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 bg-indigo-500/10 rounded-full mb-2">
                <Star className="h-10 w-10 text-indigo-400" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Global Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Intelligence</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Analyze your resume to discover career paths, salary predictions, industry demand, and personalized growth recommendations.
              </p>
            </div>

            <div className="bg-slate-800/40 p-6 sm:p-8 rounded-3xl border border-slate-700/50 shadow-2xl space-y-6">
              {!hasResume || showUpload ? (
                <GlobalResumeUpload
                  accent="purple"
                  onUpload={handleUploadOnly}
                  onRetry={retryUpload}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  uploadSuccess={uploadSuccess}
                  description="Upload your resume to unlock dynamic career analysis — no redirect needed."
                />
              ) : (
                <>
                  <ActiveResumeBanner resume={resume!} onReplace={() => {
                    setUploadDone(false);
                    setShowUpload(true);
                  }} accent="purple" />

                  {/* Upload success message */}
                  {uploadDone && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3"
                    >
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-300">Resume uploaded successfully</p>
                        <p className="text-xs text-emerald-400/70 mt-0.5">
                          {resume?.name || 'Resume'} ready. Click <strong>Run Career Analysis</strong> to generate personalized insights.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <RoleSelector
                    value={selectedRole}
                    onChange={setSelectedRole}
                    accent="purple"
                    label="Target Career (optional — leave blank for general analysis)"
                    placeholder="Search roles or leave empty for broad analysis"
                  />

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    {isAnalyzing ? <Loader className="h-5 w-5 animate-spin" /> : <Activity className="h-5 w-5" />}
                    {isAnalyzing ? 'Analyzing career profile…' : 'Run Career Analysis'}
                  </button>
                </>
              )}

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center text-sm text-rose-400">
                  <AlertTriangle className="h-4 w-4 mr-2 shrink-0" /> {error}
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-3xl font-black text-white">{analysisData.target_career?.role_name || 'Career Profile'}</h2>
              <p className="text-slate-400 mt-1">{analysisData.target_career?.category} • Dynamic AI Career Report</p>
            </div>
            <button
              onClick={handleNewAnalysis}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> New Analysis
            </button>
          </div>

          {/* ── SECTION 1: CAREER READINESS + RADAR ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-400" /> Career Readiness
              </h3>
              <div className="flex flex-wrap justify-around gap-2">
                <CircularGauge score={analysis?.readiness?.overall || 0} title="Overall" colorClass="text-indigo-400" />
                <CircularGauge score={analysis?.readiness?.technical || 0} title="Technical" colorClass="text-emerald-400" />
                <CircularGauge score={analysis?.readiness?.industry || 0} title="Experience" colorClass="text-purple-400" />
                <CircularGauge score={analysis?.readiness?.interview || 0} title="Soft Skills" colorClass="text-amber-400" />
              </div>
            </div>
            <div className="md:col-span-4 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Skill Balance</h3>
              {renderRadarChart()}
            </div>
          </div>

          {/* ── SECTION 2: CRITICAL GAPS ── */}
          {(analysis?.critical_gaps || []).length > 0 && (
            <div className="bg-slate-900/50 border border-rose-500/30 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5" /> Critical Gaps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.critical_gaps.map((gap: any, i: number) => (
                  <div key={i} className="bg-slate-900/80 border border-rose-500/20 rounded-2xl p-4 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${gap.priority === 'Critical' ? 'bg-rose-500' : gap.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <h4 className="font-bold text-white mb-2">{gap.skill}</h4>
                    <p className="text-xs text-slate-400 mb-2">{gap.reason}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded ${gap.priority === 'Critical' ? 'bg-rose-500/10 text-rose-300' : gap.priority === 'High' ? 'bg-amber-500/10 text-amber-300' : 'bg-blue-500/10 text-blue-300'}`}>{gap.priority}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded">{gap.industry_demand} Demand</span>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded">ATS {gap.ats_impact}</span>
                    </div>
                    {(gap.companies_requiring || []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {gap.companies_requiring.map((c: string) => (
                          <span key={c} className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 3: HIGH PRIORITY ITEMS ── */}
          {(analysis?.high_priority_items || []).length > 0 && (
            <div className="bg-slate-900/50 border border-amber-500/30 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" /> High Priority Actions
              </h3>
              <div className="space-y-3">
                {analysis.high_priority_items.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-900/80 border border-slate-700/50 rounded-xl p-4">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${item.effort === 'Critical' ? 'bg-rose-500' : item.effort === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{item.priority}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.reason}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 ${item.effort === 'Critical' ? 'bg-rose-500/10 text-rose-300' : item.effort === 'High' ? 'bg-amber-500/10 text-amber-300' : 'bg-blue-500/10 text-blue-300'}`}>
                      {item.effort}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 4: OPTIONAL SKILLS ── */}
          {(analysis?.optional_skills || []).length > 0 && (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Optional Skills
                <span className="text-xs font-normal text-slate-500 ml-2">Role-specific skills that add value</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.optional_skills.map((s: string) => (
                  <span key={s} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg border border-slate-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 5: INDUSTRY DEMAND + SALARY ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" /> Industry Demand
              </h3>
              <div className="space-y-3">
                {Object.entries(analysisData.target_career?.industry_demand || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-sm capitalize">{String(key).replace(/_/g, ' ')}</span>
                    <span className="text-emerald-400 font-bold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" /> Salary Predictions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(analysisData.target_career?.salary_range || {}).map(([region, range]) => (
                  <div key={region} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">{region}</span>
                    <span className="text-white font-bold text-sm">{String(range)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 6: RECOMMENDED CERTIFICATIONS ── */}
          {(analysis?.certifications || []).length > 0 && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" /> Recommended Certifications
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {analysis.certifications.map((cert: any, i: number) => (
                  <div key={i} className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${cert.career_impact === 'Very High' ? 'bg-rose-500' : cert.career_impact === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-white text-sm flex-1 pr-2">{cert.name}</h4>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded shrink-0">{cert.difficulty}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {cert.duration || '2 months'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">{cert.career_impact} Impact</span>
                      {cert.ats_score_improvement && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded">ATS {cert.ats_score_improvement}</span>
                      )}
                    </div>
                    {(cert.free_resources || []).length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Free Resources</p>
                        <div className="flex flex-wrap gap-1">
                          {cert.free_resources.map((r: string) => (
                            <span key={r} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(cert.paid_resources || []).length > 0 && (
                      <div>
                        <p className="text-[10px] text-amber-400 font-bold uppercase mb-1">Paid Resources</p>
                        <div className="flex flex-wrap gap-1">
                          {cert.paid_resources.map((r: string) => (
                            <span key={r} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Plan */}
          {analysisData.target_career?.learning_recommendations && Object.keys(analysisData.target_career.learning_recommendations).length > 0 && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Learning Plan
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(analysisData.target_career.learning_recommendations).map(([skill, details]: [string, any]) => (
                  <div key={skill} className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${details.priority === 'Critical' ? 'bg-rose-500' : details.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white">{skill}</h4>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {details.hours || details.estimated_time || '4 weeks'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{details.why || details.reason || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 7: ALTERNATIVE CAREER PATHS ── */}
          {(analysis?.transitions || []).length > 0 && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5" /> Alternative Career Paths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.transitions.map((t: any, i: number) => (
                  <div key={i} className="p-5 bg-slate-900/80 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-400" /> {t.role}
                      </h4>
                      {t.match_percent > 0 && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded font-bold">{t.match_percent}%</span>
                      )}
                    </div>
                    {t.reason && <p className="text-xs text-slate-400 mb-3">{t.reason}</p>}
                    {(t.added_skills || []).length > 0 && (
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Skills to Add</p>
                        <div className="flex flex-wrap gap-1">
                          {t.added_skills.map((s: string) => (
                            <span key={s} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 8: RISK FACTORS ── */}
          {(analysis?.risk_factors || []).length > 0 && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Career Risk Factors
              </h3>
              <div className="space-y-2">
                {analysis.risk_factors.map((factor: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                    <ArrowRight className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </ModuleShell>
  );
};

export default AICareerInsights;