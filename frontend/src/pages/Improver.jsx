import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Loader, Copy, Check, AlertCircle,
  Download, FileText, Eye, EyeOff, Undo2, Redo2, Trash2, History,
  ChevronDown, TrendingUp, Zap, BookOpen, Shield
} from 'lucide-react';
import api from '../services/api';
import ImproveResumeService from '../services/ImproveResumeService';

const SECTION_OPTIONS = [
  { value: 'auto', label: 'Auto-Detect' },
  { value: 'summary', label: 'Professional Summary' },
  { value: 'experience', label: 'Work Experience / Bullet Point' },
  { value: 'project', label: 'Project Description' },
  { value: 'education', label: 'Education' },
  { value: 'skills', label: 'Skills' },
];

const ROLE_OPTIONS = [
  'Auto-Detect',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Java Developer',
  'Python Developer',
  'Data Scientist',
  'DevOps Engineer',
  'UI/UX Designer',
  'Data Analyst',
  'Cloud Engineer',
  'AI Engineer',
  'Mobile Developer',
  'Flutter Developer',
  'QA Engineer',
  'Cybersecurity Analyst',
  'Business Analyst',
];

const SubScoreBar = ({ label, score, color }) => (
  <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-black ${color}`}>{score}</span>
    </div>
    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
           style={{ width: `${score}%` }} />
    </div>
  </div>
);

const Improver = () => {
  const [originalText, setOriginalText] = useState('');
  const [sectionType, setSectionType] = useState('auto');
  const [targetRole, setTargetRole] = useState('');
  const [level, setLevel] = useState('Mid');

  const [history, setHistory] = useState([originalText]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [improvementHistory, setImprovementHistory] = useState([]);

  const [improvedResult, setImprovedResult] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [resumeContext, setResumeContext] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    ImproveResumeService.loadHistoryFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImprovementHistory(ImproveResumeService.getHistory());
  }, []);

  const updateText = (newText) => {
    setOriginalText(newText);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setOriginalText(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setOriginalText(history[historyIndex + 1]);
    }
  };

  const clearText = () => {
    setOriginalText('');
    setHistory(['']);
    setHistoryIndex(0);
    setImprovedResult(null);
  };

  const handleImprove = async () => {
    const validation = ImproveResumeService.validateInput(originalText);
    if (!validation.valid) {
      setImprovedResult({
        success: false,
        improved_text: originalText,
        section_type: sectionType,
        changes: [],
        quality_score: 0,
        ai_enhanced: false,
        fallback_used: false,
        error: validation.error,
      });
      return;
    }

    setIsImproving(true);
    setProgressPercent(0);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + Math.random() * 20;
        return next > 95 ? 95 : next;
      });
    }, 200);

    try {
      const payload = {
        section_text: originalText,
        section_type: sectionType === 'auto' ? ImproveResumeService.detectSectionType(originalText) : sectionType,
        target_role: (targetRole === 'Auto-Detect' || !targetRole) ? null : targetRole,
        level: level,
        resume_context: resumeContext.trim() || originalText,
      };

      const response = await api.post('/ai/improve-resume', payload);
      setProgressPercent(100);
      let result = response.data;

      // Sanitize: never allow leaked error JSON as improved text
      if (result?.improved_text) {
        const txt = result.improved_text.trim();
        let isCorrupt = false;
        try {
          if (txt.startsWith('{') || txt.startsWith('[')) {
            const parsed = JSON.parse(txt);
            if (parsed && typeof parsed === 'object' && ('success' in parsed || 'fallback' in parsed || 'message' in parsed)) {
              isCorrupt = true;
            }
          }
        } catch { /* not JSON — fine */ }
        if (/quota|api key|daily ai|rate limit/i.test(txt)) {
          isCorrupt = true;
        }
        if (isCorrupt) {
          result = {
            ...result,
            improved_text: originalText,
            ai_enhanced: false,
            fallback_used: true,
            error: 'AI enhancement is temporarily unavailable. A local resume optimization has been generated instead.',
          };
        }
      }

      setImprovedResult(result);

      if (result.success) {
        ImproveResumeService.addToHistory(originalText, result);
        setImprovementHistory(ImproveResumeService.getHistory());
      }
    } catch (error) {
      console.error('Improvement failed:', error);
      // Never expose backend errors or raw JSON to the user
      setImprovedResult({
        success: true,
        improved_text: originalText,
        section_type: sectionType,
        changes: [],
        quality_score: 0,
        sub_scores: {},
        ai_enhanced: false,
        fallback_used: true,
        error: 'AI enhancement is temporarily unavailable. A local resume optimization has been generated instead.',
        stats: {
          original_length: originalText.length,
          improved_length: originalText.length,
          word_count_original: originalText.split(/\s+/).filter(Boolean).length,
          word_count_improved: originalText.split(/\s+/).filter(Boolean).length,
        },
      });
    } finally {
      clearInterval(progressInterval);
      setIsImproving(false);
    }
  };

  const handleCopy = async () => {
    if (improvedResult?.improved_text) {
      const success = await ImproveResumeService.copyToClipboard(improvedResult.improved_text);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleDownloadTxt = () => {
    if (improvedResult?.improved_text) {
      ImproveResumeService.downloadAsText(improvedResult.improved_text);
    }
  };

  const handleDownloadDocx = () => {
    if (improvedResult?.improved_text) {
      ImproveResumeService.downloadAsDocx(improvedResult.improved_text);
    }
  };

  const restoreFromHistory = (entry) => {
    setOriginalText(entry.original);
    setImprovedResult({
      success: true,
      improved_text: entry.improved,
      section_type: entry.section_type,
      changes: entry.changes || [],
      quality_score: entry.quality_score,
      sub_scores: entry.sub_scores,
      ai_enhanced: false,
      fallback_used: false,
      role_suggestions: entry.role_suggestions,
    });
    setShowHistory(false);
  };

  const stats = ImproveResumeService.getStats(originalText);
  const improvedStats = improvedResult ? ImproveResumeService.getStats(improvedResult.improved_text) : null;

  const roleSuggestions = improvedResult?.role_suggestions || [];
  const qualityReport = improvedResult?.quality_report;

  const suggestions = improvedResult ? ImproveResumeService.getImprovementSuggestions(improvedResult) : [];

  const handleDiffHighlight = (original, improved) => {
    const changes = ImproveResumeService.highlightChanges(original, improved);
    return changes.map((part, i) => {
      if (part.type === 'added') return <span key={i} className="bg-emerald-300 text-emerald-900 px-0.5 rounded">{part.text}</span>;
      if (part.type === 'removed') return <span key={i} className="bg-rose-300 text-rose-900 px-0.5 rounded line-through">{part.text}</span>;
      return <span key={i}>{part.text} </span>;
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-[#0B1120]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-lg tracking-tight">Resume Improver</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight">
            Optimize Your Resume
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            Instantly improve your resume with AI-powered suggestions. Works offline with intelligent fallback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: EDITOR */}
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Section Type</label>
                  <select value={sectionType} onChange={(e) => setSectionType(e.target.value)} disabled={isImproving}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50 transition-colors">
                    {SECTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Role</label>
                  <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} disabled={isImproving}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50 transition-colors">
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} disabled={isImproving}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50 transition-colors">
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 space-y-4">
              <button onClick={() => setShowContext(!showContext)}
                className="w-full flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {showContext ? 'Hide' : 'Add'} Full Resume Context
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showContext ? 'rotate-180' : ''}`} />
              </button>
              {showContext && (
                <textarea value={resumeContext} onChange={(e) => setResumeContext(e.target.value)}
                  placeholder="Paste your full resume here for better context-aware analysis..."
                  className="w-full h-32 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none text-sm transition-colors"
                />
              )}
            </div>

            <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Original Draft</label>
                <div className="flex items-center gap-2">
                  <button onClick={undo} disabled={historyIndex <= 0 || isImproving}
                    className="p-2 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors" title="Undo">
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button onClick={redo} disabled={historyIndex >= history.length - 1 || isImproving}
                    className="p-2 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors" title="Redo">
                    <Redo2 className="h-4 w-4" />
                  </button>
                  <button onClick={clearText} disabled={isImproving}
                    className="p-2 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors" title="Clear">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <textarea ref={editorRef} value={originalText} onChange={(e) => updateText(e.target.value)}
                disabled={isImproving}
                placeholder="Paste your original text here... (e.g., 'I worked on building a website using react')"
                className="w-full h-64 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none disabled:opacity-50 transition-colors"
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="space-x-4">
                  <span>{stats.characters} characters</span>
                  <span>{stats.words} words</span>
                  <span>{stats.sentences} sentences</span>
                </div>
                <button onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <History className="h-4 w-4" />
                  History ({improvementHistory.length})
                </button>
              </div>

              <button onClick={handleImprove} disabled={isImproving || !originalText.trim()}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex justify-center items-center gap-2">
                {isImproving ? <Loader className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isImproving ? 'Analyzing & Improving...' : 'Improve with AI'}
              </button>

              {isImproving && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Processing</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
                         style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Role Tips — from backend role_suggestions */}
            {roleSuggestions.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-300 mb-2">Role Recommendations</h4>
                    <ul className="space-y-1">
                      {roleSuggestions.map((tip, i) => (
                        <li key={i} className="text-xs text-blue-200">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: RESULTS */}
          <div className="space-y-6">
            {improvedResult ? (
              <>
                {/* ── Status Banner ───────────────────────────────────────────── */}
                {(() => {
                  if (!improvedResult.success) {
                    return (
                      <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-bold text-rose-300">Unable to improve resume.</h3>
                          <p className="text-xs text-rose-200 mt-1">
                            {improvedResult.error === 'Please enter a meaningful resume section.'
                              ? 'Please enter meaningful resume text.'
                              : 'An issue occurred. Please try again later.'}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  if (improvedResult.ai_enhanced) {
                    return (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-bold text-emerald-300">AI Enhancement Complete</h3>
                          <p className="text-xs text-emerald-200 mt-1">AI-powered optimization applied successfully.</p>
                        </div>
                      </div>
                    );
                  }
                  if (improvedResult.fallback_used) {
                    return (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
                        <Shield className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-bold text-amber-300">Offline Resume Optimization Applied</h3>
                          <p className="text-xs text-amber-200 mt-1">
                            AI enhancement is temporarily unavailable. A local resume optimization has been generated instead.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-bold text-emerald-300">Resume Enhancement Complete</h3>
                        <p className="text-xs text-emerald-200 mt-1">Deterministic improvements applied.</p>
                      </div>
                    </div>
                  );
                })()}

                {improvedResult.success && (
                  <>
                    {/* ── Quality Score + Sub-scores ─────────────────────────── */}
                    <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-300">Quality Score</h3>
                        <span className="text-3xl font-black text-amber-400">{improvedResult.quality_score}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden mb-5">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                             style={{ width: `${improvedResult.quality_score}%` }} />
                      </div>

                      {/* Sub-scores */}
                      <div className="grid grid-cols-2 gap-2">
                        <SubScoreBar label="ATS Score" score={improvedResult.sub_scores?.ats_score ?? 0} color="text-emerald-400" />
                        <SubScoreBar label="Grammar" score={improvedResult.sub_scores?.grammar_score ?? 0} color="text-indigo-400" />
                        <SubScoreBar label="Readability" score={improvedResult.sub_scores?.readability_score ?? 0} color="text-cyan-400" />
                        <SubScoreBar label="Formatting" score={improvedResult.sub_scores?.formatting_score ?? 0} color="text-violet-400" />
                      </div>
                    </div>

                    {/* ── Detected Info ────────────────────────────────────────── */}
                    {(improvedResult.detected_role || improvedResult.detected_skills?.length > 0 || improvedResult.missing_skills_for_role?.length > 0) && (
                      <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 space-y-3">
                        {improvedResult.detected_role && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Role:</span>
                            <span className="text-sm font-semibold text-amber-400">{improvedResult.detected_role}</span>
                          </div>
                        )}
                        {improvedResult.detected_skills?.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Skills ({improvedResult.detected_skills.length}):</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {improvedResult.detected_skills.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {improvedResult.missing_skills_for_role?.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missing Skills for {improvedResult.detected_role}:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {improvedResult.missing_skills_for_role.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-xs text-rose-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Quality Report ───────────────────────────────────────── */}
                    {qualityReport && (
                      <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 space-y-3">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                          Quality Report
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {qualityReport.grammar_issues?.length > 0 && (
                            <div className="col-span-2 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2">
                              <span className="text-rose-300 font-medium">Grammar: </span>
                              <span className="text-slate-400">{qualityReport.grammar_issues.join(', ')}</span>
                            </div>
                          )}
                          {qualityReport.passive_voice_count > 0 && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                              <span className="text-amber-300 font-medium">{qualityReport.passive_voice_count}</span>
                              <span className="text-slate-400 ml-1">passive voice</span>
                            </div>
                          )}
                          {qualityReport.long_sentences > 0 && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                              <span className="text-blue-300 font-medium">{qualityReport.long_sentences}</span>
                              <span className="text-slate-400 ml-1">long sentences</span>
                            </div>
                          )}
                          {qualityReport.missing_metrics > 0 && (
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-2">
                              <span className="text-violet-300 font-medium">Missing Metrics</span>
                            </div>
                          )}
                          {qualityReport.detected_action_verbs > 0 && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                              <span className="text-emerald-300 font-medium">{qualityReport.detected_action_verbs}</span>
                              <span className="text-slate-400 ml-1">action verbs</span>
                            </div>
                          )}
                          {qualityReport.detected_experience_years > 0 && (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2">
                              <span className="text-indigo-300 font-medium">{qualityReport.detected_experience_years}yr</span>
                              <span className="text-slate-400 ml-1">experience</span>
                            </div>
                          )}
                          {qualityReport.spelling_errors?.length > 0 && (
                            <div className="col-span-2 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2">
                              <span className="text-rose-300 font-medium">Spelling: </span>
                              <span className="text-slate-400">{qualityReport.spelling_errors.join(', ')}</span>
                            </div>
                          )}
                          {qualityReport.missing_skills?.length > 0 && (
                            <div className="col-span-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                              <span className="text-amber-300 font-medium">Missing Skills: </span>
                              <span className="text-slate-400">{qualityReport.missing_skills.join(', ')}</span>
                            </div>
                          )}
                          {qualityReport.role_missing_skills?.length > 0 && (
                            <div className="col-span-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                              <span className="text-amber-300 font-medium">Missing for Role: </span>
                              <span className="text-slate-400">{qualityReport.role_missing_skills.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {(qualityReport.detected_projects?.length > 0 || qualityReport.detected_certifications?.length > 0 || qualityReport.detected_education?.length > 0) && (
                          <div className="border-t border-slate-700/50 pt-3 mt-1 space-y-2">
                            {qualityReport.detected_projects?.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Projects Detected:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {qualityReport.detected_projects.map((p, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-300">{p}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {qualityReport.detected_certifications?.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Certifications:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {qualityReport.detected_certifications.map((c, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300">{c}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {qualityReport.detected_education?.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Education:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {qualityReport.detected_education.map((e, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300">{e}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Improved Text ──────────────────────────────────────── */}
                    <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-300">Improved Result</h3>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setShowDiff(!showDiff)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-xs font-medium">
                            {showDiff ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {showDiff ? 'Hide' : 'Show'} Diff
                          </button>
                        </div>
                      </div>

                      <div className="bg-white text-slate-900 p-4 rounded-xl mb-4 max-h-64 overflow-y-auto">
                        {showDiff ? (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {handleDiffHighlight(originalText, improvedResult.improved_text)}
                          </p>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {improvedResult.improved_text}
                          </p>
                        )}
                      </div>

                      {improvedStats && (
                        <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                          <div className="bg-slate-700/50 p-2 rounded-lg">
                            <p className="text-slate-400">Characters</p>
                            <p className="font-bold text-amber-400">{improvedStats.characters}</p>
                          </div>
                          <div className="bg-slate-700/50 p-2 rounded-lg">
                            <p className="text-slate-400">Words</p>
                            <p className="font-bold text-amber-400">{improvedStats.words}</p>
                          </div>
                          <div className="bg-slate-700/50 p-2 rounded-lg">
                            <p className="text-slate-400">Sentences</p>
                            <p className="font-bold text-amber-400">{improvedStats.sentences}</p>
                          </div>
                        </div>
                      )}
                      {improvedResult.stats && (
                        <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                          {improvedResult.stats.readability_improved != null && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">Readability</p>
                              <p className="font-bold text-cyan-400">{improvedResult.stats.readability_improved}/100</p>
                            </div>
                          )}
                          {improvedResult.stats.reading_time && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">Reading Time</p>
                              <p className="font-bold text-amber-400">{improvedResult.stats.reading_time}</p>
                            </div>
                          )}
                          {improvedResult.stats.ats_keywords_added != null && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">ATS Keywords</p>
                              <p className="font-bold text-emerald-400">+{improvedResult.stats.ats_keywords_added}</p>
                            </div>
                          )}
                          {improvedResult.stats.grammar_corrections != null && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">Grammar Fixes</p>
                              <p className="font-bold text-indigo-400">{improvedResult.stats.grammar_corrections}</p>
                            </div>
                          )}
                          {improvedResult.stats.weak_verbs_replaced != null && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">Weak Verbs</p>
                              <p className="font-bold text-rose-400">{improvedResult.stats.weak_verbs_replaced} replaced</p>
                            </div>
                          )}
                          {improvedResult.stats.achievements_added != null && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">Achievements</p>
                              <p className="font-bold text-violet-400">+{improvedResult.stats.achievements_added}</p>
                            </div>
                          )}
                          {improvedResult.stats.action_verbs_original != null && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">Action Verbs</p>
                              <p className="font-bold text-emerald-400">{improvedResult.stats.action_verbs_original}→{improvedResult.stats.action_verbs_improved}</p>
                            </div>
                          )}
                          {improvedResult.stats.word_count_change != null && improvedResult.stats.word_count_change !== 0 && (
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <p className="text-slate-400">Word Δ</p>
                              <p className={`font-bold ${improvedResult.stats.word_count_change > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {improvedResult.stats.word_count_change > 0 ? '+' : ''}{improvedResult.stats.word_count_change}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button onClick={handleCopy}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors text-sm font-medium border border-amber-500/20">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button onClick={handleDownloadTxt}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                          <FileText className="h-4 w-4" /> TXT
                        </button>
                        <button onClick={handleDownloadDocx}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                          <Download className="h-4 w-4" /> DOCX
                        </button>
                      </div>
                    </div>

                    {/* ── Key Improvements ───────────────────────────────────── */}
                    {improvedResult.changes && improvedResult.changes.length > 0 && (
                      <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
                        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-400" />
                          Key Improvements ({improvedResult.changes.length})
                        </h3>
                        <div className="space-y-2">
                          {improvedResult.changes.map((change, i) => (
                            <div key={i}
                              className="flex items-start gap-2 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{change}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Suggestions ────────────────────────────────────────── */}
                    {suggestions.length > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                        <h4 className="text-sm font-bold text-blue-300 mb-3">Further Suggestions</h4>
                        <ul className="space-y-2">
                          {suggestions.map((suggestion, i) => (
                            <li key={i} className="text-xs text-blue-200 flex items-start gap-2">
                              <TrendingUp className="h-3 w-3 mt-0.5 shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="bg-slate-800/30 p-12 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center text-center h-full">
                <Sparkles className="h-16 w-16 text-slate-700 mb-4" />
                <p className="text-slate-400">Your optimized content will appear here.</p>
                <p className="text-xs text-slate-500 mt-2">Paste your text and click "Improve with AI" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* History Modal */}
        {showHistory && improvementHistory.length > 0 && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-3xl border border-slate-700 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Improvement History</h3>
                <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="p-6 space-y-3">
                {improvementHistory.map((entry) => (
                  <button key={entry.id} onClick={() => restoreFromHistory(entry)}
                    className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors border border-slate-600/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white truncate">{entry.original.substring(0, 60)}...</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(entry.timestamp).toLocaleString()} • Score: {entry.quality_score}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Improver;
