import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserCircle, Star, ThumbsUp, AlertCircle, FileText, CheckCircle2, RefreshCw, Loader, DollarSign, Target, XCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useResumeStore } from '../store/useResumeStore';
import { useInsightsStore } from '../store/useInsightsStore';
import { useUserStore } from '../store/useUserStore';
import { recruiterConcerns } from '../data/recruiterConcerns';

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
  const { currentResumeId, currentResume } = useResumeStore();
  const { recruiterViewData, isAnalyzing, fetchRecruiterView } = useInsightsStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (currentResumeId && !recruiterViewData && !isAnalyzing) {
      fetchRecruiterView(currentResumeId);
    }
  }, [currentResumeId, recruiterViewData, isAnalyzing, fetchRecruiterView]);

  if (!currentResumeId) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6">
        <div className="text-center bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50">
          <AlertCircle className="h-16 w-16 text-indigo-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-white mb-2">No Resume Found</h2>
          <p className="text-slate-400 mb-6 max-w-md">You need to upload and analyze a resume before the AI Recruiter can review it.</p>
          <button 
            onClick={() => navigate('/dashboard/platform-analysis')}
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

  // Intelligent Fallback System
  // Fallback calculations for the radar chart if properties missing
  const radarData = [
    { subject: 'Technical', A: (data.technical_score || 5) * 10, fullMark: 100 },
    { subject: 'Experience', A: (data.experience_score || 5) * 10, fullMark: 100 },
    { subject: 'Projects', A: (data.projects_score || 5) * 10, fullMark: 100 },
    { subject: 'Communication', A: (data.communication_score || 5) * 10, fullMark: 100 },
    { subject: 'Leadership', A: (data.leadership_score || 5) * 10, fullMark: 100 },
    { subject: 'Overall', A: (data.overall_score || 5) * 10, fullMark: 100 },
  ];



  const getDecisionColor = (decision: string) => {
    switch(decision?.toUpperCase()) {
      case 'LIKELY SHORTLIST': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'MAYBE SHORTLIST': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'NEEDS IMPROVEMENT': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'REJECT RISK': return 'bg-red-500/20 text-red-400 border-red-500/30';
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
          <div className={`px-6 py-3 rounded-xl border-2 font-black tracking-widest uppercase shadow-lg ${getDecisionColor(data.decision)}`}>
            {data.decision || "AWAITING DECISION"}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Ratings */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Star className="h-6 w-6 text-indigo-400 mr-3" />
                Recruiter Evaluation Matrix
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard label="Overall Match" score={data.overall_score} delay={0.1} />
                <ScoreCard label="Technical Depth" score={data.technical_score} delay={0.2} />
                <ScoreCard label="Projects/Impact" score={data.projects_score} delay={0.3} />
                <ScoreCard label="Experience Lvl" score={data.experience_score} delay={0.4} />
                <ScoreCard label="Communication" score={data.communication_score} delay={0.5} />
                <ScoreCard label="Leadership" score={data.leadership_score} delay={0.6} />
              </div>
            </div>

            {/* Strengths & Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                  <ThumbsUp className="h-5 w-5 mr-2" /> Strong Points
                </h3>
                <ul className="space-y-3">
                  {data.strengths?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" /> Major Concerns
                </h3>
                
                  {/* Concerns from AI */}
                  <div>
                    <h4 className="text-sm font-semibold text-rose-400 mb-2">NOTED CONCERNS</h4>
                    <ul className="space-y-2">
                      {data.concerns?.map((item: string, i: number) => (
                        <li key={`crit-${i}`} className="flex items-start text-slate-300 text-sm">
                          <XCircle className="h-4 w-4 text-rose-500 mr-2 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Radar Chart */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 h-80">
              <h3 className="text-md font-bold text-white mb-2 text-center">Skills Profile Radar</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Radar name="Candidate" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Assessment Details */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 text-indigo-400 mr-2" />
                Recommendation
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                  <div className="text-sm text-slate-400 mb-1">Target Role AI Inference</div>
                  <div className="font-bold text-white">{currentResume?.analysis_data?.target_role || "Role Inference Missing"}</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                  <div className="text-sm text-slate-400 mb-1 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-emerald-400"/> AI ATS Score
                  </div>
                  <div className="font-bold text-white">{currentResume?.resume_score}/100</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Private Notes
              </h3>
              <ul className="space-y-4 text-sm">
                {data.recruiter_notes?.map((note: string, idx: number) => (
                  <li key={idx} className="flex items-start text-slate-300">
                    <span className="text-amber-400 mr-2 font-bold">&gt;</span>
                    <span>{note}</span>
                  </li>
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
