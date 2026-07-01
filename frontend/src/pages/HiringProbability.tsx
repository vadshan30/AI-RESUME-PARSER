import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, Loader, CheckCircle2, RefreshCw, BarChart2, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeStore } from '../store/useResumeStore';
import { useInsightsStore } from '../store/useInsightsStore';
import { hiringRecommendations } from '../data/hiringRecommendations';

const CircularGauge = ({ percentage, label }: { percentage: number, label: string }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-rose-500';
  let glowClass = 'shadow-rose-500/50';
  if (percentage >= 75) {
    colorClass = 'text-emerald-500';
    glowClass = 'shadow-emerald-500/50';
  } else if (percentage >= 50) {
    colorClass = 'text-amber-400';
    glowClass = 'shadow-amber-400/50';
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl relative overflow-hidden">
      <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 140 140">
          <circle
            className="text-slate-700/30"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
          />
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
            style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-5xl font-black ${colorClass}`}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-200 uppercase tracking-widest text-center">{label}</h3>
    </div>
  );
};

const CategoryCard = ({ label, score, delay }: { label: string, score: number, delay: number }) => {
  let colorClass = 'bg-rose-500';
  if (score >= 75) colorClass = 'bg-emerald-500';
  else if (score >= 50) colorClass = 'bg-amber-400';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-300 font-semibold">{label}</span>
        <span className="text-white font-bold">{Math.round(score)}%</span>
      </div>
      <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}

const HiringProbability = () => {
  const navigate = useNavigate();
  const { currentResumeId, currentResume } = useResumeStore();
  const { hiringProbabilityData, isAnalyzing, fetchHiringProbability } = useInsightsStore();

  useEffect(() => {
    if (currentResumeId && !hiringProbabilityData && !isAnalyzing) {
      fetchHiringProbability(currentResumeId);
    }
  }, [currentResumeId, hiringProbabilityData, isAnalyzing, fetchHiringProbability]);

  if (!currentResumeId) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6">
        <div className="text-center bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50">
          <AlertCircle className="h-16 w-16 text-blue-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-white mb-2">No Resume Found</h2>
          <p className="text-slate-400 mb-6 max-w-md">You need to upload and analyze a resume before we can predict your hiring probability.</p>
          <button 
            onClick={() => navigate('/dashboard/platform-analysis')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all"
          >
            Go to Upload Resume
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing || !hiringProbabilityData) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Calculating hiring probability with AI models...</p>
        </div>
      </div>
    );
  }

  // Fallbacks if data shapes are missing
  const overallScore = hiringProbabilityData.hiring_probability || 50;
  const placementReadiness = hiringProbabilityData.placement_readiness || 50;
  const shortlisting = hiringProbabilityData.shortlisting_probability || 50;
  const interview = hiringProbabilityData.interview_probability || 50;

  // Intelligent Fallback System for mock recommendations if AI fails to return enough
  let specificRole = "Senior React Developer"; // Default
  const targetRole = currentResume?.analysis_data?.target_role;
  
  if (targetRole) {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes('back') || roleLower.includes('java') || roleLower.includes('python')) specificRole = "Java/Spring Boot Developer";
    else if (roleLower.includes('full')) specificRole = "Senior Full Stack";
    else if (roleLower.includes('data') || roleLower.includes('ml') || roleLower.includes('ai')) specificRole = "Machine Learning Engineer";
    else if (roleLower.includes('junior') || roleLower.includes('entry')) specificRole = "Junior React Developer";
    else if (roleLower.includes('mid')) specificRole = "Mid React Developer";
  }

  const staticRecs = hiringRecommendations[specificRole as keyof typeof hiringRecommendations] || hiringRecommendations["Senior React Developer"];
  const dynamicRecs = hiringProbabilityData.improvement_suggestions || [];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-8 font-sans selection:bg-blue-500/30 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <nav className="flex items-center justify-between">
          <Link to="/dashboard/analyze-resume" className="flex items-center text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Intelligence Hub</span>
          </Link>
          <button 
            onClick={() => fetchHiringProbability(currentResumeId, true)}
            className="flex items-center text-sm px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Analysis
          </button>
        </nav>

        <header className="border-b border-slate-800 pb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
              <Target className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Hiring Probability</h1>
              <p className="text-slate-400 mt-1">AI-driven prediction of your hiring success rate based on deep matching</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Gauge */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <CircularGauge percentage={overallScore} label="AI Hiring Probability" />
          </div>

          {/* Categories */}
          <div className="lg:col-span-7 bg-slate-800/20 rounded-3xl p-6 border border-slate-700/30">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart2 className="h-6 w-6 text-blue-400 mr-3" />
              Category Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CategoryCard label="Shortlisting Odds" score={shortlisting} delay={0.1} />
              <CategoryCard label="Interview Win Rate" score={interview} delay={0.2} />
              <CategoryCard label="Placement Readiness" score={placementReadiness} delay={0.3} />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 text-blue-400 mr-3" />
            Improvement Recommendations
          </h3>
          {/* High Priority */}
          <div className="space-y-4 mb-6">
            <h4 className="text-rose-400 font-semibold flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5" /> AI Priority Actions (Critical)
            </h4>
            {(dynamicRecs.length > 0 ? dynamicRecs : staticRecs.high).map((item: string, i: number) => (
              <motion.div 
                key={`high-${i}`} 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex items-start bg-rose-500/5 p-4 rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-colors"
              >
                <div className="bg-rose-500/20 p-2 rounded-lg mr-4 shrink-0"><CheckCircle2 className="h-5 w-5 text-rose-400" /></div>
                <div>
                  <h4 className="text-white font-medium mb-1">Priority Action {i + 1}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Medium Priority */}
          <div className="space-y-4 mb-6">
            <h4 className="text-amber-400 font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" /> Recommended Improvements
            </h4>
            {staticRecs.medium.map((item: string, i: number) => (
              <motion.div 
                key={`med-${i}`} 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + (i * 0.1) }}
                className="flex items-start bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-colors"
              >
                <div className="bg-amber-500/20 p-2 rounded-lg mr-4 shrink-0"><CheckCircle2 className="h-5 w-5 text-amber-400" /></div>
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed mt-1">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Low Priority */}
          <div className="space-y-4">
            <h4 className="text-blue-400 font-semibold flex items-center gap-2 mb-3">
              <Info className="w-5 h-5" /> Best Practices (Nice to Have)
            </h4>
            {staticRecs.low.map((item: string, i: number) => (
              <motion.div 
                key={`low-${i}`} 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + (i * 0.1) }}
                className="flex items-start bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors"
              >
                <div className="bg-blue-500/20 p-2 rounded-lg mr-4 shrink-0"><CheckCircle2 className="h-5 w-5 text-blue-400" /></div>
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed mt-1">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringProbability;
