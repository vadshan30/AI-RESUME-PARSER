import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft, User, Mail, Phone, Award, Briefcase,
  CheckCircle2, XCircle, FileText, TrendingUp,
  Download, MapPin, ExternalLink, ThumbsUp, ThumbsDown,
  Zap, LayoutTemplate, BarChart3, Globe, Target, Lightbulb,
  RefreshCw, AlertCircle
} from 'lucide-react';

const ProgressBar = ({ label, score: s, max }) => {
  const pct   = max > 0 ? Math.round((s / max) * 100) : 0;
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  const tColor = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className={`font-bold ${tColor}`}>{s} / {max}</span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const ScoreBar = ({ label, value }) => {
  const pct    = Math.min(100, Math.max(0, Math.round(Number(value) || 0)));
  const color  = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  const tColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className={`font-bold ${tColor}`}>{pct}%</span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (forceRegenerate = false) => {
    try {
      forceRegenerate ? setRegenerating(true) : setLoading(true);
      setError(null);
      const url = forceRegenerate
        ? `/resume/${id}/ats-report?force=true`
        : `/resume/${id}/ats-report`;
      const response = await api.get(url);
      setData(response.data);
    } catch (err) {
      console.error('Failed to load ATS report', err);
      setError(err?.response?.data?.detail || 'Failed to load analysis. Please try again.');
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchReport(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-indigo-400 font-medium">Generating ATS Report…</p>
          <p className="text-slate-500 text-sm">Analysing resume content, skills, and formatting</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-rose-400" />
          <p className="text-white font-semibold text-lg">Report Generation Failed</p>
          <p className="text-slate-400 text-sm">{error}</p>
          <div className="flex gap-3 mt-2">
            <button onClick={() => fetchReport()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
              Retry
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // ── Data extraction ──────────────────────────────────────────────────────
  const score    = data.resume_score || 0;
  const analysis = data.analysis_data || {};

  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400';
  const scoreBg   = score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20'
                  : score >= 60 ? 'bg-amber-500/10 border-amber-500/20'
                  : 'bg-rose-500/10 border-rose-500/20';
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good Match' : 'Needs Work';

  const strengths         = analysis.strengths        || [];
  const weaknesses        = analysis.weaknesses       || [];
  const rawRecs           = analysis.recommendations  || [];
  const categorizedSkills = analysis.categorized_skills || {};
  const breakdown         = analysis.score_breakdown  || {};
  const atsChecks         = analysis.ats_formatting_checks || [];
  const formattingScores  = analysis.formatting_scores || {};
  const detectedRole      = analysis.detected_role    || analysis.target_role || '';
  const experienceLevel   = analysis.experience_level || '';
  const keywordSuggestions = analysis.keyword_suggestions || [];
  const missingAnalysis   = analysis.missing_skills_analysis || {};
  const linkedin          = analysis.linkedin  || '';
  const github            = analysis.github    || '';
  const portfolio         = analysis.portfolio || '';
  const wordCount         = analysis.word_count || 0;

  // Normalise recommendations → [{priority, text}]
  const recommendations = rawRecs.map(r => {
    if (typeof r === 'string') return { priority: 'Medium', text: r };
    if (r && typeof r === 'object' && r.text) return r;
    return null;
  }).filter(Boolean);

  const priorityStyle = p =>
    p === 'High'   ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    : p === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-sky-400 bg-sky-500/10 border-sky-500/20';

  const handleExportPDF = () => {
    const el  = document.getElementById('report-content');
    const opt = {
      margin: 0.5,
      filename: `${data.name || 'Resume'}_ATS_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    if (window.html2pdf) window.html2pdf().set(opt).from(el).save();
    else alert('PDF library still loading — try again in a moment.');
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">

      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg text-white">ATS Analysis Report</h1>
              <p className="text-xs text-slate-400">{data.filename}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchReport(true)}
              disabled={regenerating}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
              {regenerating ? 'Regenerating…' : 'Regenerate'}
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <main id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 bg-slate-900">

        {/* Identity Banner */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">{data.name || 'Unknown Candidate'}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                {data.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{data.email}</span>}
                {data.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{data.phone}</span>}
                {linkedin   && <a href={linkedin}  target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline"><ExternalLink className="w-3 h-3" />LinkedIn</a>}
                {github     && <a href={github}    target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-300 hover:underline"><ExternalLink className="w-3 h-3" />GitHub</a>}
                {portfolio  && <a href={portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:underline"><Globe className="w-3 h-3" />Portfolio</a>}
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {detectedRole    && <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-1.5"><Target className="w-3.5 h-3.5" />{detectedRole}</span>}
            {experienceLevel && <span className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{experienceLevel}</span>}
            {wordCount > 0   && <span className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-full text-sm flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{wordCount} words</span>}
          </div>
        </div>

        {/* Score + Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Circular score */}
          <div className={`border rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center ${scoreBg}`}>
            <h2 className="text-sm font-bold text-slate-300 tracking-widest uppercase mb-4">Overall ATS Score</h2>
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-700/50" />
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={452}
                  strokeDashoffset={452 - (452 * score) / 100}
                  className={`${scoreColor} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black ${scoreColor}`}>{score}</span>
                <span className="text-xs text-slate-400 font-medium mt-1">out of 100</span>
              </div>
            </div>
            <p className={`mt-4 text-sm font-bold ${scoreColor}`}>{scoreLabel}</p>
            <p className="mt-2 text-xs text-slate-400">
              {score >= 80 ? 'Highly recommended for ATS screening.'
               : score >= 60 ? 'Review missing sections and keywords.'
               : 'Significant improvements needed.'}
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Scoring Breakdown
            </h2>
            {Object.keys(breakdown).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                  <ProgressBar label="Contact Information" score={breakdown.contact_info?.score ?? 0} max={breakdown.contact_info?.max ?? 10} />
                  <ProgressBar label="Technical Skills"    score={breakdown.skills?.score      ?? 0} max={breakdown.skills?.max      ?? 20} />
                  <ProgressBar label="Education"           score={breakdown.education?.score   ?? 0} max={breakdown.education?.max   ?? 15} />
                  <ProgressBar label="Work Experience"     score={breakdown.experience?.score  ?? 0} max={breakdown.experience?.max  ?? 20} />
                </div>
                <div>
                  <ProgressBar label="Projects"        score={breakdown.projects?.score   ?? 0} max={breakdown.projects?.max   ?? 15} />
                  <ProgressBar label="ATS Formatting"  score={breakdown.formatting?.score ?? 0} max={breakdown.formatting?.max ?? 10} />
                  <ProgressBar label="Resume Length"   score={breakdown.length?.score     ?? 0} max={breakdown.length?.max     ?? 10} />
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">Scoring breakdown not available — click Regenerate.</p>
            )}
          </div>
        </div>

        {/* Strengths / Weaknesses / Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" /> Strengths
            </h3>
            {strengths.length > 0 ? (
              <ul className="space-y-3">
                {strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">No strengths detected. Click Regenerate to analyse.</p>
            )}
          </div>

          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
              <ThumbsDown className="w-5 h-5" /> Weaknesses
            </h3>
            {weaknesses.length > 0 ? (
              <ul className="space-y-3">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">No weaknesses detected — great resume!</p>
            )}
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" /> AI Recommendations
            </h3>
            {recommendations.length > 0 ? (
              <ul className="space-y-3">
                {recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-xs font-bold border ${priorityStyle(r.priority)}`}>
                      {r.priority}
                    </span>
                    <span>{r.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">No recommendations generated.</p>
            )}
          </div>
        </div>

        {/* Formatting Scores + ATS Checks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {Object.keys(formattingScores).length > 0 && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" /> Formatting Analysis
              </h2>
              {Object.entries(formattingScores).map(([key, val]) => (
                <ScoreBar
                  key={key}
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  value={val}
                />
              ))}
            </div>
          )}

          {atsChecks.length > 0 && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-cyan-400" /> ATS Checklist
              </h2>
              <div className="space-y-2">
                {atsChecks.map((check, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${check.passed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    {check.passed
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <XCircle     className="w-4 h-4 text-rose-500 shrink-0" />}
                    <span className={`text-sm font-medium ${check.passed ? 'text-slate-300' : 'text-slate-400'}`}>{check.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categorized Skills */}
        {Object.keys(categorizedSkills).length > 0 && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Categorized Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Object.entries(categorizedSkills).map(([cat, skills]) =>
                Array.isArray(skills) && skills.length > 0 && (
                  <div key={cat} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {keywordSuggestions.length > 0 && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" /> Missing ATS Keywords
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Add these to your resume to improve keyword matching for{' '}
              <span className="text-indigo-300 font-medium">{detectedRole || 'your target role'}</span>:
            </p>
            <div className="flex flex-wrap gap-2">
              {keywordSuggestions.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 rounded-full text-sm font-medium">{kw}</span>
              ))}
            </div>
          </div>
        )}

        {/* Skill Gap */}
        {analysis.target_role && missingAnalysis.missing_core_skills?.length > 0 && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" /> Skill Gap — {analysis.target_role}
            </h2>
            <div className="flex flex-wrap gap-2">
              {missingAnalysis.missing_core_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Analysis;
