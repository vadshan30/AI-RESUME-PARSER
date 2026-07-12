import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Target, Loader, CheckCircle, XCircle, 
  UploadCloud, FileText, AlertCircle, Briefcase, Award, 
  Zap, User, RefreshCw, DollarSign, HelpCircle, Flame, 
  ChevronRight, Building, BookOpen, AlertTriangle,
  TrendingUp, BarChart3, GraduationCap, Layers, Lightbulb,
  Clock, Star, Globe, Shield, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { useJobMatchStore } from '../store/useJobMatchStore';
import { useResumeStore } from '../store/useResumeStore';
import api from '../services/api';

const CANONICAL_ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist",
  "Machine Learning Engineer", "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst",
  "Android Developer", "iOS Developer", "QA Engineer", "UI/UX Designer", "Game Developer",
  "Embedded Systems Engineer", "Python Developer", "Java Developer", ".NET Developer",
  "PHP Developer", "Ruby Developer", "Go Developer", "Rust Developer", "Node.js Developer",
  "React Developer", "Angular Developer", "Vue Developer", "AI Engineer", "Business Analyst",
  "Product Manager", "Data Analyst", "System Administrator", "Network Engineer",
  "Site Reliability Engineer", "Database Administrator", "Blockchain Developer"
];

const PIPELINE_STAGES = [
  { id: 'resume_loader', label: 'Loading Resume', backendStages: ['Resume Loader'] },
  { id: 'file_verified', label: 'File Verified', backendStages: ['File Verification'] },
  { id: 'text_extracted', label: 'Text Extracted', backendStages: ['Text Extraction'] },
  { id: 'resume_validated', label: 'Resume Quality Check', backendStages: ['Resume Validation'] },
  { id: 'resume_parsed', label: 'Resume Parsed', backendStages: ['Resume Parser'] },
  { id: 'jd_parsed', label: 'Job Description Parsed', backendStages: ['Job Description Validation', 'Job Description Parser'] },
  { id: 'ats_matching', label: 'ATS Matching & Calculation', backendStages: ['Role Classifier', 'Scoring Engine'] },
  { id: 'report_generated', label: 'Generating Reports', backendStages: ['Recommendation Engine', 'System Error'] }
];

const ProgressBar = ({ label, score }: { label: string, score: number }) => {
  let colorClass = "text-emerald-400";
  let bgClass = "bg-emerald-500";
  
  if (score <= 30) {
    colorClass = "text-rose-400";
    bgClass = "bg-rose-500";
  } else if (score <= 60) {
    colorClass = "text-orange-400";
    bgClass = "bg-orange-500";
  } else if (score <= 80) {
    colorClass = "text-amber-300";
    bgClass = "bg-amber-400";
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-bold text-slate-300">{label}</span>
        <span className={`text-sm font-black ${colorClass}`}>{score}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2 rounded-full ${bgClass}`} 
        />
      </div>
    </div>
  );
};

const JobMatch = () => {
  const navigate = useNavigate();
  const { currentResumeId, currentResume, uploadResume, fetchResumeById } = useResumeStore();
  const { 
    analysisMode, setAnalysisMode, 
    targetRole, setTargetRole, 
    jobDescription, setJobDescription,
    isAnalyzing, error, matchResult, analyze, reset 
  } = useJobMatchStore();

  const [isUploading, setIsUploading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isHydrating, setIsHydrating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Re-hydrate active resume from localStorage on mount ──────────────
  React.useEffect(() => {
    const storedId = localStorage.getItem('active_resume_id');
    if (storedId && !currentResumeId) {
      const numId = parseInt(storedId, 10);
      if (!isNaN(numId)) {
        setIsHydrating(true);
        fetchResumeById(numId).finally(() => setIsHydrating(false));
      }
    }
  }, []);

  React.useEffect(() => {
    let interval: number;
    if (isAnalyzing) {
      setCurrentStageIndex(0);
      interval = setInterval(() => {
        setCurrentStageIndex((prev) => (prev < PIPELINE_STAGES.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadResume(file, 'Enterprise ATS Scan');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      // reset the input so the same file can be re-selected
      e.target.value = '';
    }
  };

  const getValidationMessage = () => {
    if (!currentResumeId) return "Please select a resume.";
    if (analysisMode === 'role' && !targetRole) return "Please select a target role.";
    if (analysisMode === 'jd' && !jobDescription.trim()) return "Please enter a job description.";
    if (analysisMode === 'both' && (!targetRole || !jobDescription.trim())) return "Please select a role and enter a job description.";
    return null;
  };

  const isFormValid = () => {
    return getValidationMessage() === null;
  };

  const handleRunScan = () => {
    if (currentResumeId) analyze(currentResumeId);
  };

  const handleImproveResume = () => {
    if (!currentResumeId) return;
    navigate('/dashboard/improve-resume', {
      state: {
        resumeId: currentResumeId,
        jobDescription,
        atsResult: matchResult
      }
    });
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      const element = document.getElementById('ats-report');
      const opt = {
        margin:       0.5,
        filename:     `${currentResume?.name || 'ATS_Scan'}_Report.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0B1120' },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => setIsExporting(false));
    };
    document.body.appendChild(script);
  };

  if (matchResult) {
    if (matchResult.success === false) {
      const vr = matchResult.validation_report;
      return (
        <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-20 flex flex-col items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h1 className="text-3xl font-black text-rose-500">Invalid Resume Uploaded</h1>
              <p className="text-slate-400 mt-2">The uploaded file does not meet the minimum requirements for a valid resume.</p>
            </div>
            
            {vr && (
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="font-bold text-slate-300 text-sm">File Name</span>
                  <span className="text-sm font-medium text-slate-400 truncate max-w-[280px]">{vr.file_name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="font-bold text-slate-300 text-sm">Validation Score</span>
                  <span className="text-xl font-black text-rose-400">{vr.score} / 100</span>
                </div>
                {vr.reason && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-semibold">
                    Reason: {vr.reason}
                  </div>
                )}
                
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Detected Sections</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(vr.detected_sections).map(([sect, found]) => (
                      <div key={sect} className="flex items-center text-sm font-semibold p-2 bg-slate-850 rounded-lg">
                        {found ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500 mr-2 shrink-0" />
                        )}
                        <span className={found ? "text-slate-300" : "text-slate-500 line-through"}>{sect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center pt-4">
              <button onClick={reset} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors flex items-center shadow-lg shadow-indigo-600/20">
                <RefreshCw className="h-4 w-4 mr-2" /> Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Type Guard for results view
    if (!matchResult.scores) return null;

    // RESULTS VIEW
    const scores = matchResult.scores.breakdown || {};
    const { role_analysis, match_analysis, recommendations } = matchResult;

    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-20">
        <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-indigo-400" />
              <span className="font-bold text-xl tracking-tight">Enterprise ATS Results</span>
            </div>
            <button onClick={reset} className="text-sm font-medium flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
              <RefreshCw className="h-4 w-4" /> New Analysis
            </button>
          </div>
        </nav>

        <main id="ats-report" className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {matchResult.validation_report && (matchResult.validation_report.status === 'WEAK' || matchResult.validation_report.status === 'ACCEPTED') && (
            <div className={`p-5 rounded-3xl border flex items-start gap-4 shadow-lg
              ${matchResult.validation_report.status === 'WEAK' 
                ? "bg-orange-500/10 border-orange-500/30 text-orange-400" 
                : "bg-amber-500/10 border-amber-500/30 text-amber-350"}`}>
              <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-base">
                  {matchResult.validation_report.status === 'WEAK' ? 'Weak Resume Structure Warning' : 'Resume Missing Sections'} 
                  (Validation Score: {matchResult.validation_report.score}/100)
                </h4>
                <p className="text-sm opacity-90 mt-1.5 font-medium leading-relaxed">
                  {matchResult.validation_report.reason || 'We noticed some standard sections are missing from this resume. The ATS calculation has proceeded but results may be lower than expected.'}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Score Card */}
            <div className="lg:col-span-1 bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col items-center justify-center text-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Overall ATS Match</h2>
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle className="text-slate-800" strokeWidth="12" stroke="currentColor" fill="transparent" r="60" cx="70" cy="70" />
                  <circle
                    className={matchResult.scores.overall_score >= 85 ? "text-emerald-500" : matchResult.scores.overall_score >= 70 ? "text-lime-500" : matchResult.scores.overall_score >= 50 ? "text-amber-500" : "text-orange-500"}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={(2 * Math.PI * 60) * (1 - (matchResult.scores.overall_score || 0) / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="60"
                    cx="70"
                    cy="70"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black">{matchResult.scores.overall_score || 0}</span>
                  <span className="text-xs font-bold text-slate-500 tracking-widest mt-1">/ 100</span>
                </div>
              </div>
              {matchResult.scores.classification && (
                <div className={`mt-2 mb-4 px-4 py-2 rounded-lg font-bold border 
                  ${matchResult.scores.classification.grade.includes('Excellent') ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : matchResult.scores.classification.grade.includes('Good') ? "bg-lime-500/10 border-lime-500/20 text-lime-400" 
                  : matchResult.scores.classification.grade.includes('Average') ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                  : "bg-orange-500/10 border-orange-500/20 text-orange-400"}`}>
                  {matchResult.scores.classification.grade}
                </div>
              )}
              <div className={`px-4 py-2 rounded-lg font-bold border ${matchResult.scores.overall_score >= 75 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : matchResult.scores.overall_score >= 50 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
                {recommendations?.hiring_probability || 'Unknown'} Probability
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="lg:col-span-2 bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Zap className="h-5 w-5 text-indigo-400 mr-2" /> Match Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <ProgressBar label="Role Similarity" score={scores.role_similarity} />
                <ProgressBar label="Mandatory Skills" score={scores.mandatory_skills} />
                <ProgressBar label="Experience Match" score={scores.experience} />
                <ProgressBar label="Projects Relevance" score={scores.projects} />
                <ProgressBar label="Education Match" score={scores.education} />
                <ProgressBar label="Frameworks Match" score={scores.frameworks} />
                <ProgressBar label="Tools Match" score={scores.tools} />
                <ProgressBar label="Certifications" score={scores.certifications} />
              </div>
            </div>
          </div>

          {/* ENHANCED: Critical Gaps, Market Intelligence, Learning Plan */}
          {(matchResult.critical_gaps || matchResult.market_intelligence || matchResult.priority_learning_plan) ? (
            <EnhancedJobMatchModules matchResult={matchResult} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fallback: Original Skills Gap Analysis */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" /> Critical Gaps
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 mb-3">Missing Mandatory Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {match_analysis?.missing_mandatory_skills?.length > 0 ? match_analysis.missing_mandatory_skills.map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm font-bold">{s}</span>
                      )) : <span className="text-slate-500 italic">None! Perfect match.</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 mb-3">Missing Frameworks & Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {[...(match_analysis?.missing_frameworks || []), ...(match_analysis?.missing_tools || [])].map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-sm font-bold">{s}</span>
                      ))}
                      {!(match_analysis?.missing_frameworks?.length || match_analysis?.missing_tools?.length) && <span className="text-slate-500 italic">No gaps detected.</span>}
                    </div>
                  </div>
                  {match_analysis?.experience_gap_years > 0 && (
                    <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                      <span className="text-rose-400 font-bold flex items-center"><XCircle className="h-4 w-4 mr-2" /> Experience Shortfall: {match_analysis.experience_gap_years} years</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 shadow-xl">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" /> Market Intelligence
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                      <span className="text-slate-400 font-bold">Estimated Salary</span>
                      <span className="text-emerald-400 font-black">{recommendations?.salary_estimate || 'Unknown'}</span>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-xl">
                      <span className="text-slate-400 font-bold block mb-2">Top Hiring Companies</span>
                      <div className="flex flex-wrap gap-2">
                        {recommendations?.top_companies?.map((c: string) => (
                          <span key={c} className="px-2 py-1 bg-slate-800 rounded text-xs font-bold text-slate-300 flex items-center"><Building className="h-3 w-3 mr-1 text-slate-500"/> {c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/20 shadow-xl">
                  <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" /> Priority Learning Plan
                  </h3>
                  <ul className="space-y-3">
                    {recommendations?.priority_learning_plan?.map((step: string, i: number) => (
                      <li key={i} className="flex items-start text-sm text-slate-300 p-3 bg-slate-900/50 rounded-xl">
                        <ChevronRight className="h-4 w-4 text-indigo-500 mr-2 mt-0.5 shrink-0" /> {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4" data-html2canvas-ignore="true">
            <button onClick={handleImproveResume} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors flex items-center">
              <Zap className="h-4 w-4 mr-2"/> Improve Resume
            </button>
            <button onClick={handleExportPDF} disabled={isExporting} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
              {isExporting ? <Loader className="h-4 w-4 animate-spin mr-2"/> : null}
              {isExporting ? 'Generating Report...' : 'Export PDF Report'}
            </button>
          </div>

          {/* Back to Dashboard */}
          <div className="flex justify-center mt-10 mb-8" data-html2canvas-ignore="true">
            <Link
              to="/dashboard"
              aria-label="Back to Dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold transition-all duration-200 hover:scale-105 border border-slate-700/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-20">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Target className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">Enterprise ATS Job Matcher</span>
          </div>
          <Link to="/dashboard" className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Step 1: Resume */}
        <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><FileText className="h-32 w-32" /></div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center relative z-10">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-sm mr-3">1</span> 
            Select Resume
          </h2>
          
          <div className="relative z-10">
            {currentResumeId ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl">
                <div>
                  <h3 className="font-bold text-lg text-indigo-300">{currentResume?.name || currentResume?.filename || "Target Resume"}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center"><Award className="h-4 w-4 mr-1 text-slate-500"/> {currentResume?.resume_score || 0}% Base ATS</span>
                    <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1 text-slate-500"/> Active Resume</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <input type="file" accept=".pdf,.docx,.txt" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center">
                    {isUploading ? <Loader className="h-4 w-4 animate-spin mr-2"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                    Change Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isHydrating && (
                  <div className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-700 rounded-2xl text-slate-400 text-sm">
                    <Loader className="h-4 w-4 animate-spin text-indigo-400" />
                    Loading your active resume…
                  </div>
                )}
                {!isHydrating && (
                  <div className="p-6 bg-amber-500/5 border-2 border-dashed border-amber-500/30 rounded-2xl">
                    <input type="file" accept=".pdf,.docx,.txt" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-8 w-8 text-amber-400 shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white mb-1">No Active Resume Found</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          Upload a resume below, or go to the Dashboard to select an existing one.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-colors text-sm"
                          >
                            {isUploading ? <Loader className="h-4 w-4 animate-spin mr-2"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                            {isUploading ? 'Uploading…' : 'Upload Resume'}
                          </button>
                          <Link
                            to="/dashboard"
                            className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-colors text-sm"
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Go to Dashboard
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Analysis Mode */}
        <section className={`bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl transition-opacity ${currentResumeId ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-sm mr-3">2</span> 
            Choose Analysis Mode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { id: 'role', title: 'Target Role', desc: 'Match against a standard industry role profile.' },
              { id: 'jd', title: 'Paste JD', desc: 'Match against a specific job description.' },
              { id: 'both', title: 'Role + JD', desc: 'Most accurate. Uses both for deep analysis.' }
            ].map(mode => (
              <button 
                key={mode.id}
                onClick={() => setAnalysisMode(mode.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${analysisMode === mode.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold ${analysisMode === mode.id ? 'text-indigo-400' : 'text-slate-300'}`}>{mode.title}</h4>
                  {analysisMode === mode.id && <CheckCircle className="h-5 w-5 text-indigo-500" />}
                </div>
                <p className="text-xs text-slate-500">{mode.desc}</p>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {(analysisMode === 'role' || analysisMode === 'both') && (
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Target Role</label>
                <select 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select a role...</option>
                  {CANONICAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}
            
            {(analysisMode === 'jd' || analysisMode === 'both') && (
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Job Description</label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none custom-scrollbar"
                />
              </div>
            )}
          </div>
        </section>

        {/* Step 3: Action */}
        <section>
          {(isAnalyzing || error) ? (
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl mb-6">
              <h3 className="text-lg font-bold text-white mb-6">Analysis Progress</h3>
              <div className="space-y-4 relative">
                {PIPELINE_STAGES.map((stage, idx) => {
                  const isErrorObj = error && typeof error === 'object';
                  const failedStageStr = isErrorObj ? (error as any).failed_stage : null;
                  
                  let status: 'done' | 'active' | 'pending' | 'error' = 'pending';
                  
                  if (isErrorObj && failedStageStr) {
                     const failedIdx = PIPELINE_STAGES.findIndex(s => s.backendStages.includes(failedStageStr));
                     if (idx < failedIdx) status = 'done';
                     else if (idx === failedIdx) status = 'error';
                     else status = 'pending';
                  } else if (error && !isErrorObj) {
                     if (idx === 0) status = 'error';
                  } else if (isAnalyzing) {
                     if (idx < currentStageIndex) status = 'done';
                     else if (idx === currentStageIndex) status = 'active';
                     else status = 'pending';
                  }

                  return (
                    <div key={stage.id} className="flex items-start">
                      <div className="mt-1 mr-4 flex-shrink-0">
                        {status === 'done' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                        {status === 'active' && <Loader className="h-5 w-5 text-indigo-400 animate-spin" />}
                        {status === 'error' && <XCircle className="h-5 w-5 text-rose-500" />}
                        {status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-slate-600" />}
                      </div>
                      <div className="flex-1">
                         <span className={`font-bold ${status === 'active' ? 'text-indigo-300' : status === 'done' ? 'text-slate-300' : status === 'error' ? 'text-rose-400' : 'text-slate-500'}`}>
                           {stage.label}
                         </span>
                         {status === 'error' && isErrorObj && (
                           <div className="mt-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                             <h4 className="text-sm font-bold text-rose-400 mb-1">{(error as any).reason}</h4>
                             <p className="text-xs text-rose-300/80 mb-3">{(error as any).details}</p>
                             <div className="p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300 border border-slate-700">
                               <span className="font-bold text-emerald-400 mb-1 block">Suggestion</span> 
                               {(error as any).suggestion}
                             </div>
                           </div>
                         )}
                         {status === 'error' && !isErrorObj && (
                           <div className="mt-2 text-sm text-rose-400 font-bold">{error as string}</div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {error && (
                <div className="mt-6 space-y-4">
                  {/* Friendly error card for generic string errors */}
                  {typeof error === 'string' && (
                    <div className="p-5 bg-rose-500/8 border border-rose-500/20 rounded-2xl space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-rose-300 text-sm mb-1">What went wrong</h4>
                          <p className="text-rose-300/80 text-xs">{error}</p>
                        </div>
                      </div>
                      <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common causes &amp; fixes</p>
                        <ul className="space-y-1.5 text-xs text-slate-400">
                          <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" /> Resume not uploaded — go to Dashboard and upload first</li>
                          <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" /> Scanned / image PDF — use a text-based PDF or convert with OCR</li>
                          <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" /> Password-protected file — remove protection before uploading</li>
                          <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" /> Job description too short — add at least 50 characters</li>
                          <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" /> Server timeout — wait a moment and retry</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-700/50">
                    <button onClick={handleRunScan} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors flex items-center text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" /> Retry Analysis
                    </button>
                    <Link to="/dashboard" className="px-5 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-bold transition-colors flex items-center text-sm">
                      <UploadCloud className="h-4 w-4 mr-2" /> Upload Different Resume
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              {!isFormValid() && (
                <div className="absolute -top-12 left-0 right-0 text-center">
                  <span className="inline-block bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold px-4 py-2 rounded-xl">
                    {getValidationMessage()}
                  </span>
                </div>
              )}
              <button
                onClick={handleRunScan}
                disabled={!isFormValid()}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:border text-white rounded-2xl font-black text-lg transition-all flex justify-center items-center shadow-lg shadow-indigo-600/20"
              >
                <Zap className="h-6 w-6 mr-3" /> Run ATS Scan
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

/* ─── Enhanced Job Match Modules ─────────────────────────────────── */

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    Critical: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors[priority] || colors.Medium}`}>
      {priority}
    </span>
  );
};

const CriticalGapsCard = ({ criticalGaps }: { criticalGaps: any }) => {
  if (!criticalGaps || !criticalGaps.gaps || criticalGaps.gaps.length === 0) {
    return (
      <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" /> Critical Gaps
        </h3>
        <div className="text-center py-8 text-slate-500">
          <Shield className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No critical gaps detected</p>
          <p className="text-xs mt-1">Your profile aligns well with this role</p>
        </div>
      </div>
    );
  }

  const summary = criticalGaps.summary || {};
  const gaps = criticalGaps.gaps || [];

  return (
    <div className="bg-slate-800/40 p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" /> Critical Gaps
        </h3>
        {summary.estimated_total_gain > 0 && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            +{summary.estimated_total_gain} potential ATS gain
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Critical", count: summary.critical_count, color: "text-rose-400" },
          { label: "High", count: summary.high_count, color: "text-orange-400" },
          { label: "Medium", count: summary.medium_count, color: "text-amber-400" },
          { label: "Low", count: summary.low_count, color: "text-slate-400" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-900/50 rounded-xl p-3 text-center border border-slate-700/50">
            <div className={`text-2xl font-black ${item.color}`}>{item.count}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {gaps.slice(0, 12).map((gap: any) => (
          <div key={gap.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-white truncate">{gap.skill}</span>
                  <PriorityBadge priority={gap.priority} />
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{gap.category}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{gap.reason}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{gap.impact}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-emerald-400 font-black text-sm">+{gap.estimated_score_gain}</div>
                <div className="text-[9px] text-slate-600 font-medium uppercase tracking-wider">ATS pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketIntelligenceCard = ({ marketIntel }: { marketIntel: any }) => {
  if (!marketIntel) {
    return (
      <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 shadow-xl">
        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" /> Market Intelligence
        </h3>
        <div className="text-center py-6 text-slate-500">
          <Globe className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Market data loading...</p>
        </div>
      </div>
    );
  }

  const salary = marketIntel.salary || {};
  const companies = marketIntel.top_companies || [];
  const trending = marketIntel.trending_skills || [];
  const insights = marketIntel.market_insights || [];

  return (
    <div className="bg-emerald-500/5 p-6 md:p-8 rounded-3xl border border-emerald-500/20 shadow-xl">
      <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" /> Market Intelligence
      </h3>

      <div className="space-y-5">
        {/* Salary */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Salary Benchmark</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "India", value: salary.india },
              { label: "USA", value: salary.usa },
              { label: "Remote", value: salary.remote },
            ].map((item) => (
              <div key={item.label} className="bg-slate-800/60 rounded-lg p-2.5 text-center">
                <div className="text-xs font-bold text-slate-500">{item.label}</div>
                <div className="text-emerald-400 font-black text-sm mt-0.5">{item.value || "—"}</div>
              </div>
            ))}
          </div>
          {marketIntel.next_level && marketIntel.next_level_salary && (
            <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2.5 text-center">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Next: {marketIntel.next_level}
              </span>
              <div className="text-indigo-300 font-black text-sm mt-0.5">
                {marketIntel.next_level_salary.india || ""}
                {marketIntel.next_level_salary.usa ? ` / ${marketIntel.next_level_salary.usa}` : ""}
              </div>
            </div>
          )}
        </div>

        {/* Demand & Growth */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hiring Demand</span>
            <div className={`text-lg font-black mt-1 ${
              marketIntel.demand === "Very High" || marketIntel.demand === "High"
                ? "text-emerald-400" : marketIntel.demand === "Moderate" ? "text-amber-400" : "text-slate-400"
            }`}>
              {marketIntel.demand || "High"}
            </div>
            {marketIntel.open_positions && (
              <div className="text-xs text-slate-500 mt-1">{marketIntel.open_positions} open</div>
            )}
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Rate</span>
            <div className="text-lg font-black mt-1 text-amber-400">{marketIntel.growth_rate || "8%"}</div>
            {marketIntel.competition_level && (
              <div className="text-xs text-slate-500 mt-1">Competition: {marketIntel.competition_level}</div>
            )}
          </div>
        </div>

        {/* Top Companies */}
        {companies.length > 0 && (
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Top Hiring Companies</span>
            <div className="flex flex-wrap gap-2">
              {companies.slice(0, 8).map((c: string) => (
                <span key={c} className="px-2.5 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 border border-slate-700/50 flex items-center gap-1.5">
                  <Building className="h-3 w-3 text-slate-500" /> {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Trending Skills */}
        {trending.length > 0 && (
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Trending Skills</span>
            <div className="flex flex-wrap gap-2">
              {trending.map((s: string) => (
                <span key={s} className="px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Market Insights */}
        {insights.length > 0 && (
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Market Insights</span>
            <ul className="space-y-2">
              {insights.slice(0, 3).map((insight: string, i: number) => (
                <li key={i} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const LearningPlanCard = ({ learningPlan, criticalGaps }: { learningPlan: any; criticalGaps: any }) => {
  if (!learningPlan || !learningPlan.phases) {
    return (
      <div className="bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/20 shadow-xl">
        <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" /> Priority Learning Plan
        </h3>
        <div className="text-center py-6 text-slate-500">
          <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Learning plan will be generated from your skill gaps.</p>
        </div>
      </div>
    );
  }

  const phases = learningPlan.phases;
  const phaseKeys = ["30_days", "60_days", "90_days"];
  const phaseLabels: Record<string, { label: string; focus: string; icon: any; color: string; border: string; bg: string }> = {
    "30_days": { label: "Next 30 Days", focus: "Critical gaps — highest impact first", icon: Zap, color: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/[0.04]" },
    "60_days": { label: "30–60 Days", focus: "High-priority skills — build depth", icon: Star, color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/[0.04]" },
    "90_days": { label: "60–90 Days", focus: "Preferred skills & certifications", icon: Clock, color: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-500/[0.04]" },
  };

  const difficultyColors: Record<string, string> = {
    Beginner: "text-emerald-400 bg-emerald-500/10",
    Easy: "text-green-400 bg-green-500/10",
    Medium: "text-amber-400 bg-amber-500/10",
    Hard: "text-orange-400 bg-orange-500/10",
    Expert: "text-rose-400 bg-rose-500/10",
  };

  return (
    <div className="bg-indigo-500/5 p-6 md:p-8 rounded-3xl border border-indigo-500/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-indigo-400 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" /> Priority Learning Plan
        </h3>
        {learningPlan.total_hours > 0 && (
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            ~{learningPlan.weekly_commitment}h/week · {learningPlan.total_weeks} weeks
          </span>
        )}
      </div>

      <div className="space-y-6">
        {phaseKeys.map((key) => {
          const phase = phases[key];
          if (!phase || !phase.tasks || phase.tasks.length === 0) return null;
          const meta = phaseLabels[key];
          const Icon = meta.icon;

          return (
            <div key={key} className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden`}>
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${meta.color}`} />
                  <span className={`font-bold text-sm ${meta.color}`}>{meta.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{meta.focus}</p>
              </div>
              <div className="p-4 space-y-3">
                {phase.tasks.map((task: any) => {
                  const DiffIcon = task.difficulty && (task.difficulty === "Hard" || task.difficulty === "Expert")
                    ? Shield : task.difficulty === "Beginner" ? Star : Layers;
                  return (
                    <div key={task.id} className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-700/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-white">{task.task}</span>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          <p className="text-xs text-slate-400 mt-1.5">{task.description}</p>
                          {task.resources && task.resources.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {task.resources.slice(0, 2).map((r: any, ri: number) => (
                                <span key={ri} className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                                  <ExternalLink className="h-3 w-3 mr-0.5 shrink-0" /> {r.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 text-right flex flex-col items-end gap-1">
                          <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${difficultyColors[task.difficulty] || "text-slate-400 bg-slate-500/10"}`}>
                            {task.difficulty || "Medium"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">{task.hours}h</div>
                          {task.estimated_score_gain && (
                            <div className="text-[10px] font-bold text-emerald-400">+{task.estimated_score_gain}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {learningPlan.total_estimated_score_gain > 0 && (
        <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
          <span className="text-sm font-bold text-indigo-300">
            Estimated Impact: <span className="text-indigo-200">+{learningPlan.total_estimated_score_gain} ATS Score Points</span>
          </span>
          <p className="text-xs text-indigo-400/70 mt-1">Complete all phases to maximize your match score</p>
        </div>
      )}
    </div>
  );
};

const EnhancedJobMatchModules = ({ matchResult }: { matchResult: any }) => {
  const criticalGaps = matchResult.critical_gaps;
  const marketIntel = matchResult.market_intelligence;
  const learningPlan = matchResult.priority_learning_plan;

  return (
    <div className="space-y-8">
      {/* Module 1: Critical Gaps (full width) */}
      <CriticalGapsCard criticalGaps={criticalGaps} />

      {/* Module 2 & 3: side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketIntelligenceCard marketIntel={marketIntel} />
        <LearningPlanCard learningPlan={learningPlan} criticalGaps={criticalGaps} />
      </div>
    </div>
  );
};

export default JobMatch;
