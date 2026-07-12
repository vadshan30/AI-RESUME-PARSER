import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, UserCircle, Star, ThumbsUp, AlertCircle, FileText, CheckCircle2, RefreshCw, Loader, DollarSign, Target, XCircle, Award, ShieldCheck, Globe, BarChart3 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useResumeStore } from '../store/useResumeStore';
import { useInsightsStore } from '../store/useInsightsStore';
import { useUserStore } from '../store/useUserStore';

const ScoreCard = ({ label, score, delay }: { label: string, score: number, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-center items-center hover:border-slate-500 transition-colors"
  >
    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500 mb-1">
      {score?.toFixed(1) || '0.0'}
    </div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">{label}</div>
  </motion.div>
);

const RecruiterView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentResumeId, currentResume } = useResumeStore();
  const { recruiterViewData, isAnalyzing, fetchRecruiterView, clearRecruiterView } = useInsightsStore();
  const { currentUser } = useUserStore();
  const previousResumeIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!currentResumeId) {
      if (previousResumeIdRef.current !== null || recruiterViewData) {
        clearRecruiterView();
      }
      previousResumeIdRef.current = null;
      return;
    }

    if (previousResumeIdRef.current !== null && previousResumeIdRef.current !== currentResumeId) {
      clearRecruiterView();
      fetchRecruiterView(currentResumeId);
    } else if (!recruiterViewData && !isAnalyzing) {
      fetchRecruiterView(currentResumeId);
    }

    previousResumeIdRef.current = currentResumeId;
  }, [currentResumeId, recruiterViewData, isAnalyzing, fetchRecruiterView, clearRecruiterView]);

  if (!currentResumeId) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6">
        <div className="text-center bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50">
          <AlertCircle className="h-16 w-16 text-indigo-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-white mb-2">No Resume Found</h2>
          <p className="text-slate-400 mb-6 max-w-md">You need to upload and analyze a resume before the AI Recruiter can review it.</p>
          <button 
            onClick={() => navigate('/dashboard/upload', { state: { returnTo: location.pathname + location.search } })}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all"
          >
            Go to Upload Resume
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing || !recruiterViewData) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Recruiter AI is evaluating your profile...</p>
        </div>
      </div>
    );
  }

  // Map Backend Data
  const data = recruiterViewData;
  const chartData = Object.entries(data.radar || {}).map(([subject, value]) => ({ subject, A: value, fullMark: 100 }));
  const decisionColor = (decision: string) => {
    switch ((decision || '').toUpperCase()) {
      case 'STRONG HIRE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'HIRE': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'LIKELY HIRE': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'BORDERLINE': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'NEED MORE INFORMATION': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'REJECT': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-8 font-sans selection:bg-indigo-500/30 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-sm font-bold text-slate-300">{currentUser.name}</span>
              </div>
            )}
            <Link to="/dashboard/analyze-resume" className="flex items-center text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Intelligence Hub</span>
            </Link>
          </div>
          <button 
            onClick={() => fetchRecruiterView(currentResumeId, true)}
            className="flex items-center text-sm px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Request New Review
          </button>
        </nav>

        <header className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
              <UserCircle className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Recruiter View</h1>
              <p className="text-slate-400 mt-1">A blunt, realistic assessment from a senior technical recruiter</p>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-xl border-2 font-black tracking-widest uppercase shadow-lg ${decisionColor(data.decision)}`}>
            {data.decision || "AWAITING DECISION"}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Ratings */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Recruiter Evaluation Matrix</h3>
                  <p className="text-slate-400 text-sm mt-1">Scores based on actual resume content and resume metadata.</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${decisionColor(data.decision)}`}>
                  {data.decision || 'AWAITING DECISION'}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Overall Match" score={data.overall_score} delay={0.1} />
                <ScoreCard label="Technical Depth" score={data.technical_score} delay={0.2} />
                <ScoreCard label="Projects & Impact" score={data.projects_score} delay={0.3} />
                <ScoreCard label="Experience" score={data.experience_score} delay={0.4} />
                <ScoreCard label="Communication" score={data.communication_score} delay={0.5} />
                <ScoreCard label="Leadership" score={data.leadership_score} delay={0.6} />
                <ScoreCard label="Problem Solving" score={data.problem_solving_score} delay={0.7} />
                <ScoreCard label="ATS Readiness" score={data.ats_score} delay={0.8} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">Hiring Confidence</p>
                <div className="text-5xl font-black text-white">{data.hiring_confidence}%</div>
                <p className="text-slate-400 mt-3 text-sm">{data.hiring_reason || 'Recruiter confidence in a next-stage interview or offer.'}</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">Interview Probability</p>
                <div className="text-5xl font-black text-white">{data.interview_probability?.percent || 0}%</div>
                <p className="text-slate-400 mt-3 text-sm">{data.interview_probability?.reason || 'Probability based on resume and recruiter evaluation.'}</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">Candidate Type</p>
                <div className="text-2xl font-bold text-white">{data.candidate_type || 'Unknown'}</div>
                <p className="text-slate-400 mt-3 text-sm">{data.candidate_summary || 'Inferred candidate classification from resume content.'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><ThumbsUp className="h-5 w-5" /> Resume Strengths</h3>
                <ul className="space-y-3">
                  {data.strengths?.map((item: string, i: number) => (
                    <li key={i} className="text-slate-200 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Major Concerns</h3>
                <ul className="space-y-3">
                  {data.concerns?.map((item: string, i: number) => (
                    <li key={i} className="text-slate-200 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-indigo-400" /> Candidate Highlights</h3>
                <ul className="space-y-3">
                  {data.highlights?.map((item: string, idx: number) => (
                    <li key={idx} className="text-slate-200 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-sky-400" /> Risk Assessment</h3>
                <p className="text-sm text-slate-400 mb-3">Severity: <span className="font-semibold text-white">{data.risk_assessment?.severity || 'Low'}</span></p>
                <ul className="space-y-2 text-slate-200 text-sm">
                  {data.risk_assessment?.items?.length ? data.risk_assessment.items.map((item: string, idx: number) => (
                    <li key={idx}>• {item}</li>
                  )) : <li>• No major risks detected.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 h-96">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-indigo-400" /> Recruiter Radar</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} itemStyle={{ color: '#818cf8' }} />
                  <Radar name="Candidate" dataKey="A" stroke="#76c7ff" fill="#76c7ff" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/40">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Salary Estimate</p>
                <div className="text-white font-bold text-lg">{data.salary_estimate?.expected_salary}</div>
                <p className="text-slate-400 text-sm">Market Average: {data.salary_estimate?.market_salary}</p>
                <p className="text-slate-400 text-sm">Suggested Range: {data.salary_estimate?.suggested_range}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/40">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Company Match</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-200">
                  {Object.entries(data.company_match || {}).map(([company, value]: any) => (
                    <div key={company} className="bg-slate-800/80 rounded-lg p-3">
                      <div className="font-semibold text-white">{company}</div>
                      <div className="text-slate-400">{value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2"><FileText className="h-5 w-5" /> Recruiter Notes</h3>
              <ul className="space-y-3 text-slate-200 text-sm">
                {data.recruiter_notes?.map((note: string, idx: number) => (
                  <li key={idx}>• {note}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-700/40 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-cyan-400" /> Improvement Plan</h3>
              <ul className="space-y-3 text-slate-200 text-sm">
                {data.improvement_suggestions?.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecruiterView;
