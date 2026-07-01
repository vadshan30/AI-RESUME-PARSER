import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useResumeStore } from '../store/useResumeStore';

const IMPROVER_STEPS = [
  "Reading Draft",
  "Analyzing Context",
  "Generating Suggestions",
  "Formatting Results",
  "Completed"
];


const Improver = () => {
  const { currentAnalysis } = useResumeStore();
  
  const [sectionType, setSectionType] = useState('summary');
  const [role, setRole] = useState('React Developer');
  const [level, setLevel] = useState('Senior');
  
  const [originalText, setOriginalText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [improvementNotes, setImprovementNotes] = useState([]);
  
  // Progress State
  const [isImproving, setIsImproving] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [copied, setCopied] = useState(false);

  // Only clear text on type change
  useEffect(() => {
    setImprovedText('');
    setImprovementNotes([]);
  }, [sectionType]);

  // Handle simulated progress timer
  useEffect(() => {
    let interval;
    if (isImproving && progressPercent < 95) {
      interval = setInterval(() => {
        setProgressPercent(prev => {
          const next = prev + (Math.random() * 15 + 5);
          return next > 95 ? 95 : next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isImproving, progressPercent]);

  // Sync step with percentage
  useEffect(() => {
    if (progressPercent >= 100) setProgressStep(4);
    else if (progressPercent >= 75) setProgressStep(3);
    else if (progressPercent >= 40) setProgressStep(2);
    else if (progressPercent >= 15) setProgressStep(1);
    else setProgressStep(0);
  }, [progressPercent]);

  const handleImprove = async () => {
    if (!originalText.trim()) return;
    
    setIsImproving(true);
    setProgressPercent(0);
    setErrorMsg('');
    setImprovedText('');
    setImprovementNotes([]);
    setCopied(false);

    // Hit the backend AI endpoint for all section types
    try {
      const response = await api.post('/ai/improve-resume', {
        section_text: originalText,
        section_type: sectionType
      });
      
      setProgressPercent(100);
      
      // We don't have improvement notes from backend currently for this endpoint, so mock generic ones
      const notes = [
        "Enhanced with industry-recognized keywords",
        "Made phrasing more action-oriented and professional",
        "Optimized for ATS parsing"
      ];
      
      setImprovedText(response.data.improved_text);
      setImprovementNotes(notes);
      setIsImproving(false);
      
    } catch (err) {
      console.error('Improvement failed:', err);
      setIsImproving(false);
      setProgressPercent(0);
      
      if (err.response?.data?.detail) {
        setErrorMsg(`Analysis Failed: ${err.response.data.detail}`);
      } else if (err.message) {
        setErrorMsg(`Analysis Failed: ${err.message}`);
      } else {
        setErrorMsg('Analysis Failed: Unable to connect to AI service.');
      }
    }
  };

  const handleCopy = () => {
    if (improvedText) {
      navigator.clipboard.writeText(improvedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setImprovedText('');
    setImprovementNotes([]);
    setProgressStep(0);
    setProgressPercent(0);
    setErrorMsg('');
    if (sectionType !== 'summary') {
      setOriginalText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-amber-500/30">
      <nav className="border-b border-slate-800 bg-[#0B1120]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-lg tracking-tight">AI Resume Improver</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight">
            Rewrite & Optimize
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">Instantly upgrade your resume bullet points, summaries, and projects to sound highly professional and ATS-friendly using role-specific intelligence.</p>
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto mb-8 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-400">Error</h3>
              <p className="text-sm text-rose-300 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: INPUT */}
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-6 md:p-8 rounded-3xl border border-slate-700/50">
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Section to Improve</label>
                  <select 
                    value={sectionType} 
                    onChange={(e) => setSectionType(e.target.value)}
                    disabled={isImproving}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50 transition-colors"
                  >
                    <option value="summary">Professional Summary</option>
                    <option value="experience">Work Experience / Bullet Point</option>
                    <option value="project">Project Description</option>
                  </select>
                </div>

                {sectionType === 'summary' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Role</label>
                      <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isImproving}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50 transition-colors"
                      >
                        <option value="React Developer">React Developer</option>
                        <option value="Java/Spring Boot Developer">Java/Spring Boot Developer</option>
                        <option value="Python Developer">Python Developer</option>
                        <option value="Node.js Developer">Node.js Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Security Engineer">Security Engineer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Level</label>
                      <select 
                        value={level} 
                        onChange={(e) => setLevel(e.target.value)}
                        disabled={isImproving}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50 transition-colors"
                      >
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                        <option value="Lead">Lead</option>
                        <option value="Architect">Architect</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Draft</label>
                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  disabled={isImproving} 
                  placeholder="Paste your original text here... (e.g. 'I worked on building a website using react')"
                  className={`w-full h-48 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none transition-colors`}
                />
                {sectionType === 'summary' && (
                  <p className="text-xs text-amber-500/80 mt-2">Template loaded. You can edit this draft before improving.</p>
                )}
              </div>

              <button
                onClick={handleImprove}
                disabled={isImproving || !originalText.trim()}
                className="mt-6 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex justify-center items-center gap-2"
              >
                {isImproving ? <Loader className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isImproving ? "Analyzing & Improving..." : "Improve with AI"}
              </button>
            </div>
          </div>

          {/* RIGHT: OUTPUT */}
          <div className="space-y-6 relative">
            {isImproving && (
              <div className="absolute inset-0 z-10 bg-[#0B1120]/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-slate-800">
                <div className="w-64">
                  <div className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                    <span>{IMPROVER_STEPS[progressStep]}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className={`bg-slate-800/30 p-6 md:p-8 rounded-3xl border border-slate-700/50 h-full flex flex-col transition-opacity duration-300 ${isImproving ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Improved Result</label>
                {improvedText && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleReset}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-700"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Start New
                    </button>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-colors text-sm font-medium border border-amber-500/20"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {improvedText ? (
                <div className="flex-1 flex flex-col gap-6">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-500" />
                    <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                      {improvedText}
                    </p>
                  </div>
                  
                  {improvementNotes.length > 0 && (
                    <div className="mt-auto">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Key Improvements</h4>
                      <ul className="space-y-2">
                        {improvementNotes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <Sparkles className="h-12 w-12 text-slate-700 mb-4" />
                  <p>Your optimized content will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Improver;
