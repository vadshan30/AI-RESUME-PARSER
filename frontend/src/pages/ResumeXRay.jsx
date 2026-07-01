import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Activity, Search, AlertTriangle, FileSearch, RefreshCw, Loader, CheckCircle2, XCircle } from 'lucide-react';

const CircularGauge = ({ percentage, label, colorClass, gradientFrom, gradientTo }) => {
  const [offset, setOffset] = useState(251);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setTimeout(() => setOffset(progressOffset), 100);
  }, [percentage, circumference]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="relative w-24 h-24 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle className="text-slate-700/50" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white">{percentage || 0}%</span>
        </div>
      </div>
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center">{label}</h3>
    </div>
  );
};

const SectionGradeCard = ({ section, grade }) => {
  const getGradeStyles = () => {
    switch(grade?.toUpperCase()) {
      case 'EXCELLENT': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'STRONG': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'MODERATE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'WEAK': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MISSING': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className={`p-4 rounded-xl border flex justify-between items-center ${getGradeStyles()}`}>
      <span className="font-semibold capitalize text-slate-200">{section}</span>
      <span className="font-black tracking-wide uppercase text-sm px-2 py-1 bg-black/20 rounded">{grade || 'N/A'}</span>
    </div>
  );
};

const IssueList = ({ title, items, icon: Icon, colorClass }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
      <h3 className={`text-lg font-bold mb-4 flex items-center ${colorClass}`}>
        <Icon className="h-5 w-5 mr-2" />
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start text-slate-300 text-sm">
            <span className="mr-2 mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ResumeXRay = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const activeId = localStorage.getItem('active_resume_id');
      if (!activeId) {
        navigate('/dashboard');
        return;
      }

      const response = await api.post('/ai/resume-xray', { 
        resume_id: parseInt(activeId),
        refresh: forceRefresh
      });
      setData(response.data);
    } catch (err) {
      console.error('Failed to load resume xray', err);
      setError('Failed to scan Resume. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Deep scanning resume architecture...</p>
        </div>
      </div>
    );
  }

  if (error || !data || data.error) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white p-8 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl max-w-lg text-center">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-6">{error || data?.error || 'Something went wrong.'}</p>
          <div className="flex items-center justify-center space-x-4">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">Go Back</button>
            <button onClick={() => fetchData(true)} className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 flex items-center transition-colors">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-8 font-sans selection:bg-cyan-500/30 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <nav className="flex items-center justify-between">
          <Link to="/dashboard/analyze-resume" className="flex items-center text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Intelligence Hub</span>
          </Link>
          <button 
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center text-sm px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Scanning...' : 'Refresh Scan'}
          </button>
        </nav>

        <header className="border-b border-slate-800 pb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-cyan-500/20 p-3 rounded-xl border border-cyan-500/30">
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Resume X-Ray</h1>
              <p className="text-slate-400 mt-1">Deep structural and keyword diagnostic analysis</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CircularGauge percentage={data.health_score} label="Health Score" colorClass="text-emerald-500" gradientFrom="from-emerald-500" gradientTo="to-green-500" />
          <CircularGauge percentage={data.ats_compatibility} label="ATS Match" colorClass="text-blue-500" gradientFrom="from-blue-500" gradientTo="to-cyan-500" />
          <CircularGauge percentage={data.keyword_density} label="Keyword Density" colorClass="text-purple-500" gradientFrom="from-purple-500" gradientTo="to-indigo-500" />
          <CircularGauge percentage={data.completeness_score} label="Completeness" colorClass="text-amber-500" gradientFrom="from-amber-500" gradientTo="to-yellow-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Section Grades */}
          <div className="md:col-span-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Search className="h-5 w-5 text-cyan-400 mr-2" />
              Section Diagnostics
            </h3>
            <div className="space-y-3">
              {data.section_grades && Object.entries(data.section_grades).map(([section, grade]) => (
                <SectionGradeCard key={section} section={section} grade={grade} />
              ))}
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <IssueList title="Formatting Issues" items={data.formatting_issues} icon={FileSearch} colorClass="text-orange-400" />
            <IssueList title="Content Issues" items={data.content_issues} icon={AlertTriangle} colorClass="text-red-400" />
            <IssueList title="Missing Sections" items={data.missing_sections} icon={XCircle} colorClass="text-rose-400" />
            <IssueList title="Improvement Suggestions" items={data.improvement_suggestions} icon={CheckCircle2} colorClass="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeXRay;
