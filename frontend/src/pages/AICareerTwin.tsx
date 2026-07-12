import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Rocket, Target, Compass, Clock, CheckCircle2, 
  Loader, AlertTriangle, RefreshCw, Zap, BookOpen, AlertCircle, TrendingUp, FileText
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useCareerTwinStore, CareerTwinData } from '../store/useCareerTwinStore';
import { useResumeStore } from '../store/useResumeStore';

const HealthGauge = ({ percentage, label }: { percentage: number, label: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-amber-400';
  if (percentage >= 80) colorClass = 'text-emerald-400';
  else if (percentage < 50) colorClass = 'text-rose-400';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-2">
        <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 100 100">
          <circle className="text-slate-700/30" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
          <motion.circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-black ${colorClass}`}>{percentage}</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider text-center">{label}</span>
    </div>
  );
};

const AICareerTwin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentResumeId, currentResume, history, setCurrentResumeId } = useResumeStore();
  const { careerData, isLoading, error, generateCareerTwin, refreshRecommendations, selectedPath, updatePathSelection, dataResumeId, generatedAt } = useCareerTwinStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'paths' | 'skills' | 'timeline'>('dashboard');

  // Trigger generation whenever the active resume ID changes or data is missing.
  // Using currentResumeId as the primary dependency ensures a new upload always
  // causes a re-generation even if careerData is non-null (stale from old resume).
  useEffect(() => {
    if (!currentResumeId) return;
    // dataResumeId !== currentResumeId means stale data — always regenerate
    if (!isLoading) {
      generateCareerTwin();
    }
  }, [currentResumeId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || (!careerData && !error)) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Constructing your digital career twin...</p>
        </div>
      </div>
    );
  }

  if (!currentResumeId || error === "Please upload and analyze a resume first.") {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-8">
        <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700/50 text-center max-w-md w-full shadow-xl">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-white mb-2">Select a Resume</h2>
          <p className="text-slate-400 mb-6 text-sm">You need to select an uploaded resume to generate your Career Twin profile.</p>
          
          {history.length > 0 ? (
            <div className="space-y-4">
              <select 
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all appearance-none"
                onChange={(e) => setCurrentResumeId(parseInt(e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>-- Choose a Resume --</option>
                {history.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.name} - {resume.filename}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">Select a resume to instantly generate your profile.</p>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/dashboard/upload', { state: { returnTo: location.pathname + location.search } })}
              className="px-6 py-3 w-full bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-yellow-600/20"
            >
              Upload New Resume
            </button>
          )}
        </div>
      </div>
    );
  }

  if (error || !careerData) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-8">
        <div className="bg-red-500/10 p-6 rounded-xl text-center border border-red-500/20">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-6">{error || 'Failed to load Twin'}</p>
          <button onClick={() => generateCareerTwin()} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 transition-colors font-medium rounded-lg">Retry Generation</button>
        </div>
      </div>
    );
  }

  const { profile, careerHealth, careerPaths, skillGaps, recommendations, timeline } = careerData;

  const currentPath = careerPaths.find(p => p.id === selectedPath) || careerPaths[0];

  const radarData = [
    { subject: 'Diversity', A: careerHealth.skillDiversity },
    { subject: 'Progression', A: careerHealth.careerProgression },
    { subject: 'Alignment', A: careerHealth.industryAlignment },
    { subject: 'Readiness', A: careerHealth.futureReadiness },
    { subject: 'Overall', A: careerHealth.overall }
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-yellow-500/30 pb-20">
      
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800 p-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard/analyze-resume" className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Intelligence Hub</span>
          </Link>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            {['dashboard', 'paths', 'skills', 'timeline'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-yellow-500 text-[#0B1120]' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button 
            onClick={() => refreshRecommendations()}
            className="flex items-center text-sm px-3 py-2 bg-slate-800 text-yellow-400 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 mt-4">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-500/30">
              <Rocket className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">AI Career Twin</h1>
              <p className="text-slate-400 mt-1">Your personalized career intelligence dashboard</p>
            </div>
          </div>

          {/* Active Resume Banner */}
          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl px-5 py-3">
            <FileText className="h-5 w-5 text-yellow-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Resume</p>
              <p className="text-sm text-white font-bold truncate max-w-[200px]">
                {currentResume?.filename || currentResume?.name || `Resume #${currentResumeId}`}
              </p>
            </div>
            <div className="ml-2 shrink-0">
              {generatedAt ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {Math.floor((Date.now() - generatedAt.getTime()) / 60000) < 1
                    ? 'Just now'
                    : `${Math.floor((Date.now() - generatedAt.getTime()) / 60000)}m ago`}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                  Generating...
                </span>
              )}
            </div>
          </div>
        </header>

        {/* TAB CONTENT: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Digital Twin Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Rocket className="h-48 w-48 text-yellow-500" />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <img src={profile.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-yellow-500/30 mb-4 shadow-xl shadow-yellow-500/10" />
                <h2 className="text-2xl font-black text-white">{profile.name}</h2>
                <div className="inline-flex items-center px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold mt-2">
                  {profile.experienceLevel} • {profile.currentRole}
                </div>
                <p className="text-slate-400 mt-6 text-sm leading-relaxed">{profile.summary}</p>
                
                <div className="mt-8 w-full bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-xs uppercase text-slate-500 font-bold mb-1">Unique Value Proposition</p>
                  <p className="text-emerald-400 font-medium text-sm">{profile.uniqueValue}</p>
                </div>
              </div>
            </div>

            {/* Health Scores */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Target className="h-6 w-6 text-yellow-400 mr-2" /> Career Health Score
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <HealthGauge percentage={careerHealth.skillDiversity} label="Diversity" />
                  <HealthGauge percentage={careerHealth.careerProgression} label="Progression" />
                  <HealthGauge percentage={careerHealth.industryAlignment} label="Alignment" />
                  <HealthGauge percentage={careerHealth.futureReadiness} label="Readiness" />
                </div>
                
                {/* Radar */}
                <div className="h-64 bg-slate-900/50 rounded-2xl border border-slate-700/50 pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Radar name="Score" dataKey="A" stroke="#eab308" fill="#eab308" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recommendations Summary */}
            <div className="lg:col-span-12 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="h-6 w-6 text-emerald-400 mr-2" /> Top AI Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, i) => (
                  <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">{rec.title}</h4>
                      <span className={`px-2 py-1 text-xs font-bold rounded ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{rec.description}</p>
                    <ul className="space-y-2 mb-4">
                      {rec.actionItems.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-slate-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> Estimated timeline: {rec.timeline}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: CAREER PATHS */}
        {activeTab === 'paths' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
              {careerPaths.map(path => (
                <button
                  key={path.id}
                  onClick={() => updatePathSelection(path.id)}
                  className={`px-6 py-4 rounded-xl border flex flex-col min-w-[200px] text-left transition-all ${selectedPath === path.id ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'}`}
                >
                  <span className="font-bold text-lg mb-1">{path.title}</span>
                  <span className="text-xs uppercase tracking-wider">{path.timeToReach} years to reach</span>
                </button>
              ))}
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">{currentPath.title} Pathway</h3>
              
              <div className="relative border-l-2 border-slate-700 ml-4 md:ml-8 space-y-12">
                {currentPath.roles.map((role, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-12">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-indigo-500 border-4 border-[#0f172a]" />
                    <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                        <div>
                          <h4 className="text-xl font-bold text-white">{role.title}</h4>
                          <span className="text-indigo-400 text-sm font-medium">{role.timeline}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-bold">{role.salaryRange}</div>
                          <div className="text-xs text-slate-500 uppercase">Match Prob: {role.probability}%</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.skills.map(s => (
                          <span key={s} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: SKILLS GAP */}
        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2" /> Missing Critical Skills
              </h3>
              <div className="space-y-4">
                {skillGaps.missing.map(m => (
                  <div key={m.skill} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white text-lg">{m.skill}</span>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${m.urgency === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {m.urgency} Priority
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">Action: {m.actionPlan}</p>
                    <p className="text-xs text-slate-500"><Clock className="h-3 w-3 inline mr-1" />{m.timeToLearn}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" /> Skills to Improve
                </h3>
                <div className="space-y-6">
                  {skillGaps.improvements.map(imp => (
                    <div key={imp.skill}>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-white">{imp.skill}</span>
                        <span className="text-amber-400">Target: {imp.requiredLevel}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex relative">
                        <div className="bg-emerald-500 h-full" style={{ width: `${imp.currentLevel}%` }} />
                        <div className="bg-amber-500/40 h-full relative" style={{ width: `${imp.gap}%` }}>
                           <span className="absolute inset-0 pattern-diagonal-lines opacity-20" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">Current: {imp.currentLevel}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center">
                  <CheckCircle2 className="h-6 w-6 mr-2" /> Surplus Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGaps.surplus.map(s => (
                     <span key={s} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-full font-medium">
                       {s}
                     </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: TIMELINE */}
        {activeTab === 'timeline' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
             <h3 className="text-2xl font-bold text-white mb-12 text-center">Interactive Career Timeline</h3>
             
             <div className="max-w-3xl mx-auto relative border-l-2 border-slate-700 ml-4 md:ml-auto">
               
               <div className="mb-8 font-black text-slate-500 tracking-widest uppercase pl-8 text-sm">Past Milestones</div>
               {timeline.past.map((t, idx) => (
                 <div key={idx} className="relative pl-8 pb-8 opacity-60 hover:opacity-100 transition-opacity">
                   <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-emerald-500 border-4 border-[#0f172a] flex items-center justify-center">
                     <CheckCircle2 className="h-3 w-3 text-[#0f172a]" />
                   </div>
                   <div className="text-emerald-500 font-bold mb-1">{t.year}</div>
                   <div className="text-white font-medium bg-slate-900/50 p-4 rounded-xl border border-slate-700/30 inline-block">
                     {t.title}
                   </div>
                 </div>
               ))}

               <div className="my-8 font-black text-yellow-500 tracking-widest uppercase pl-8 text-sm flex items-center">
                 <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                 Current Position
               </div>

               <div className="mb-8 font-black text-slate-500 tracking-widest uppercase pl-8 text-sm">Future Goals</div>
               {timeline.future.map((t, idx) => (
                 <div key={idx} className="relative pl-8 pb-8">
                   <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-slate-700 border-4 border-[#0f172a]" />
                   <div className="text-indigo-400 font-bold mb-1">{t.year}</div>
                   <div className="text-slate-300 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 inline-block shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                     <span className="font-bold text-white block">{t.title}</span>
                     <span className="text-xs text-indigo-300 uppercase tracking-wider">{t.status}</span>
                   </div>
                 </div>
               ))}

             </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AICareerTwin;
