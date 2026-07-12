import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { useResumeVsTopCandidateStore } from '../store/useResumeVsTopCandidateStore';
import { useActiveResume } from '../hooks/useActiveResume';
import { ModuleShell } from '../components/resume/ModuleShell';
import { GlobalResumeUpload } from '../components/resume/GlobalResumeUpload';
import { ActiveResumeBanner } from '../components/resume/ActiveResumeBanner';
import { RoleSelector } from '../components/resume/RoleSelector';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  LineChart, Line, CartesianGrid, ReferenceLine
} from 'recharts';
import {
  Target, FileText, CheckCircle, AlertTriangle, XCircle,
  Award, Briefcase, GraduationCap, DollarSign, TrendingUp,
  Activity, Clock, Map, RefreshCw, Loader, Play, ArrowLeft,
} from 'lucide-react';

export default function ResumeVsTopCandidate() {
  const navigate = useNavigate();
  const { history: resumes } = useResumeStore();
  const {
    selectedResumeId, targetRole, roleData, comparisonResult, isLoading, error,
    selectResume, setTargetRole, runComparison, reset,
  } = useResumeVsTopCandidateStore();

  const {
    resume,
    resumeId,
    hasResume,
    isInitializing,
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    handleUpload,
    retryUpload,
  } = useActiveResume({ targetRole: targetRole || undefined });

  const [showUpload, setShowUpload] = useState(false);
  const [localRole, setLocalRole] = useState(targetRole || 'Software Engineer');

  useEffect(() => {
    if (resumeId && !selectedResumeId) {
      selectResume(resumeId);
    }
  }, [resumeId, selectedResumeId, selectResume]);

  useEffect(() => {
    if (targetRole) setLocalRole(targetRole);
  }, [targetRole]);

  const handleUploadResume = async (file: File) => {
    const uploaded = await handleUpload(file, localRole);
    setShowUpload(false);
    if (uploaded?.id) {
      selectResume(uploaded.id);
    }
  };

  const handleCompare = async () => {
    if (!resumeId && !selectedResumeId) return;
    const id = selectedResumeId || resumeId;
    if (id) selectResume(id);
    setTargetRole(localRole);
    await runComparison();
  };

  const activeResume = resumes.find((r) => r.id === (selectedResumeId || resumeId)) || resume;

  if (error && !comparisonResult) {
    return (
      <ModuleShell icon={Target} title="Resume vs Top Candidate" subtitle="Compare against ideal profiles" accent="blue" showBackButton>
        <div className="max-w-lg mx-auto text-center py-16">
          <AlertTriangle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Comparison Failed</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleCompare}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold"
          >
            Try Again
          </button>
        </div>
      </ModuleShell>
    );
  }

  if (!comparisonResult || !roleData || !activeResume) {
    return (
      <ModuleShell icon={Target} title="Resume vs Top Candidate" subtitle="Compare against ideal profiles" accent="blue" showBackButton>
        {isInitializing ? (
          <div className="flex flex-col items-center py-20">
            <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading…</p>
          </div>
        ) : isLoading || isUploading ? (
          <div className="flex flex-col items-center py-20">
            <Loader className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              {isUploading ? 'Uploading & parsing resume…' : 'Generating comparison…'}
            </h2>
            <p className="text-slate-400 text-sm">Building ideal candidate profile and match analysis.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Compare Against the Top 1%
              </h1>
              <p className="text-slate-400">Upload your resume, pick a target role, and see how you stack up against an ideal candidate.</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-6">
              {!hasResume || showUpload ? (
                <GlobalResumeUpload
                  accent="blue"
                  onUpload={handleUploadResume}
                  onRetry={retryUpload}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  uploadSuccess={uploadSuccess}
                />
              ) : (
                <ActiveResumeBanner resume={resume!} onReplace={() => setShowUpload(true)} accent="blue" />
              )}

              <RoleSelector value={localRole} onChange={setLocalRole} accent="blue" label="Target Role" />

              <button
                onClick={handleCompare}
                disabled={!hasResume || isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <Play className="h-5 w-5 fill-current" /> Run Comparison
              </button>
            </div>
          </div>
        )}
      </ModuleShell>
    );
  }

  // Map Category Scores to Radar Chart format
  const radarData = comparisonResult.categoryScores.map(cat => ({
    subject: cat.name,
    User: cat.userScore,
    Ideal: cat.idealScore
  }));

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-24 selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block leading-tight">Resume vs Top Candidate</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Premium AI Analysis</span>
            </div>
          </div>
          <button
            onClick={reset}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Comparison
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-12">

        {/* Header Setup */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Discover What Separates You From The Top 1%
          </h1>
          <p className="text-slate-400 text-lg">
            Compare your resume against an ideal candidate profile and get an actionable roadmap to get hired.
          </p>
        </div>

        {/* Active resume & role summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActiveResumeBanner resume={activeResume} accent="blue" />
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Role</p>
            <p className="text-2xl font-black text-blue-400">{targetRole}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-slate-700 rounded-md text-slate-300">
                Match: {comparisonResult.overallMatchScore}%
              </span>
              <span className="text-xs px-2 py-1 bg-slate-700 rounded-md text-slate-300">
                ATS: {comparisonResult.atsComparison.userScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* PART 4: OVERALL COMPARISON DASHBOARD */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

            {/* Match Score Gauge */}
            <div className="flex flex-col items-center justify-center relative">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="112" stroke="#1e293b" strokeWidth="24" fill="transparent" />
                <motion.circle
                  initial={{ strokeDashoffset: 703 }}
                  animate={{ strokeDashoffset: 703 - (703 * comparisonResult.overallMatchScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="128" cy="128" r="112"
                  stroke={comparisonResult.overallMatchScore >= 80 ? "#10b981" : comparisonResult.overallMatchScore >= 60 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="24" fill="transparent" strokeDasharray={703} strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-white">{comparisonResult.overallMatchScore}%</span>
                <span className="text-sm font-bold text-slate-400 uppercase mt-1 tracking-widest">Match Score</span>
              </div>
            </div>

            {/* Side-by-Side Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
                <h3 className="text-lg font-bold text-white mb-4">Your Profile</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Experience:</span> <span className="font-medium text-white">{comparisonResult.experienceComparison.userYears} Years</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Skills Found:</span> <span className="font-medium text-white">{(activeResume.skills || []).length}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Education:</span> <span className="font-medium text-white">{comparisonResult.educationComparison.userDegree}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">ATS Score:</span> <span className="font-medium text-white">{comparisonResult.atsComparison.userScore}/100</span></div>
                </div>
              </div>

              <div className="bg-indigo-900/30 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold rounded">Target</div>
                <h3 className="text-lg font-bold text-white mb-4">Ideal {targetRole}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-indigo-200">Experience:</span> <span className="font-medium text-white">{roleData.idealExperience || 0} Years</span></div>
                  <div className="flex justify-between"><span className="text-indigo-200">Skills Req:</span> <span className="font-medium text-white">{(roleData.requiredSkills || []).length}+</span></div>
                  <div className="flex justify-between"><span className="text-indigo-200">Education:</span> <span className="font-medium text-white">{roleData.idealEducation || "Bachelor's"}</span></div>
                  <div className="flex justify-between"><span className="text-indigo-200">ATS Target:</span> <span className="font-medium text-white">90+/100</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* PART 16: VISUAL DASHBOARD (Radar & Heatmap) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" /> Dimension Analysis
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                  <Radar name="Ideal Candidate" dataKey="Ideal" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeDasharray="5 5" />
                  <Radar name="Your Resume" dataKey="User" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm text-slate-300">You</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-emerald-500 border-dashed rounded-full"></div><span className="text-sm text-slate-300">Ideal</span></div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl flex flex-col justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Critical Skill Gaps
            </h2>
            <div className="space-y-4 flex-grow">
              {comparisonResult.skillGaps.map((gap, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-rose-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white flex items-center gap-2"><XCircle className="w-4 h-4 text-rose-500" /> {gap.name}</span>
                    <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-400 rounded uppercase font-bold">{gap.criticality}</span>
                  </div>
                  <div className="text-sm text-slate-400">Required: {gap.idealLevel} | Your Level: {gap.userLevel}</div>
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors">Add to Learning Plan</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PART 5 & 7 & 8 & 9 & 10: Category Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Briefcase className="w-5 h-5 text-amber-400" /> Experience Match</h3>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-slate-400">Gap:</span>
              <span className="font-bold text-amber-400">{comparisonResult.experienceComparison.gapYears} Years Short</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (comparisonResult.experienceComparison.userYears / (roleData.idealExperience || 1)) * 100)}%` }}></div>
            </div>
            <p className="text-sm text-slate-400">
              {comparisonResult.experienceComparison.leadershipGap ? 'Ideal candidate has extensive leadership. You need to highlight mentorship or lead roles.' : 'Experience level is adequate.'}
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-400" /> ATS Compatibility</h3>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-slate-400">Gap:</span>
              <span className="font-bold text-rose-400">{comparisonResult.atsComparison.scoreGap} Points Short</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (comparisonResult.atsComparison.userScore / 90) * 100)}%` }}></div>
            </div>
            <p className="text-sm text-slate-400">{comparisonResult.atsComparison.formattingIssues.join(', ')}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-purple-400" /> Education & Certs</h3>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-slate-400">Gap:</span>
              <span className="font-bold text-slate-300">{comparisonResult.certificationComparison.gapCount} Certs Short</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, (comparisonResult.certificationComparison.userCount / comparisonResult.certificationComparison.idealCount) * 100)}%` }}></div>
            </div>
            <p className="text-sm text-slate-400">{comparisonResult.certificationComparison.missingCerts.length > 0 ? `Missing: ${comparisonResult.certificationComparison.missingCerts.join(', ')}` : 'You have all recommended certifications.'}</p>
          </div>

        </div>

        {/* PART 11: SALARY COMPARISON */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><DollarSign className="w-64 h-64 text-emerald-500" /></div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Salary Impact Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <div>
              <div className="mb-8">
                <div className="text-sm text-slate-400 mb-1">Your Estimated Value</div>
                <div className="text-4xl font-black text-white">₹{comparisonResult.salaryEstimate.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="mb-8">
                <div className="text-sm text-indigo-300 mb-1">Ideal Candidate Value</div>
                <div className="text-4xl font-black text-indigo-400">₹{comparisonResult.salaryEstimate.idealValue.toLocaleString('en-IN')}</div>
              </div>

              <h3 className="font-bold text-white mb-4">How to close the gap:</h3>
              <ul className="space-y-3">
                {comparisonResult.salaryEstimate.milestones.map((m, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> {m.name} adds ~₹{m.addedValue.toLocaleString('en-IN')}
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Current', salary: comparisonResult.salaryEstimate.currentValue },
                  ...comparisonResult.salaryEstimate.milestones.map((m, i) => ({
                    name: `+${i + 1} Goal`,
                    salary: comparisonResult.salaryEstimate.currentValue + comparisonResult.salaryEstimate.milestones.slice(0, i + 1).reduce((acc, curr) => acc + curr.addedValue, 0)
                  }))
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(val) => `₹${val / 100000}L`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
                  <Line type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PART 13: COMPANY READINESS */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Map className="w-5 h-5 text-cyan-400" /> Top Company Readiness
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {comparisonResult.companyReadiness.map((company, i) => {
              const ready = company.readinessScore >= 70;

              return (
                <div key={i} className={`p-5 rounded-2xl border ${ready ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
                  <div className="text-lg font-bold text-white mb-1">{company.companyName}</div>
                  <div className="text-xs text-slate-400 mb-4">{company.type}</div>
                  <div className={`text-2xl font-black mb-1 ${ready ? 'text-emerald-400' : 'text-amber-400'}`}>{company.readinessScore}%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">{company.status}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PART 14: IMPROVEMENT ROADMAP */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Actionable Improvement Roadmap
          </h2>
          <div className="space-y-6 border-l-2 border-slate-700 ml-4 pl-6 relative">
            {comparisonResult.improvementRoadmap.map((step, i) => (
              <div key={i} className="mb-8 mt-12 first:mt-0 relative">
                <div className={`absolute w-4 h-4 rounded-full -left-[33px] top-0 shadow-[0_0_10px] ${i === 0 ? 'bg-rose-500 shadow-rose-500' :
                  i === 1 ? 'bg-amber-500 shadow-amber-500' :
                    'bg-emerald-500 shadow-emerald-500'
                  }`}></div>
                <h3 className="text-lg font-bold text-white mb-1">{step.timeframe}</h3>
                <p className="text-slate-400 text-sm mb-3">{step.title} - {step.description}</p>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-sm text-slate-300">
                  {step.actionItems.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
