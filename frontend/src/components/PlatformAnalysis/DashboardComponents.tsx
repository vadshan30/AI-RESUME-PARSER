import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Building, IndianRupee, MessageSquare } from 'lucide-react';

export const ScoreCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    purple: 'text-purple-400',
    orange: 'text-amber-400',
    teal: 'text-teal-400'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-2xl font-black ${colorClasses[color] || 'text-white'}`}>
        {typeof value === 'number' && (label.includes('Probability') || label.includes('Readiness')) ? `${value}%` : value}
      </span>
    </motion.div>
  );
};

export const MetricCard = ({ label, value }: { label: string, value: number }) => (
  <div className="flex flex-col justify-center border-l-2 border-slate-700 pl-4">
    <div className="text-2xl font-black text-white mb-1">{value}</div>
    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</div>
  </div>
);

export const ProgressBar = ({ label, value }: { label: string, value: number }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
      <span className="capitalize">{label}</span>
      <span className="text-indigo-400">{value}%</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-indigo-500 rounded-full"></motion.div>
    </div>
  </div>
);

export const BenchmarkItem = ({ label, value }: { label: string, value: number }) => (
  <div>
    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
      <span>{label}</span>
      <span className="text-amber-400">{value}%</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-amber-500 rounded-full"></motion.div>
    </div>
  </div>
);

export const ReadinessCard = ({ label, value }: { label: string, value: number }) => (
  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
    <div className="text-xl font-bold text-emerald-400 mb-1">{value}%</div>
    <div className="text-xs font-bold text-slate-400 uppercase">{label}</div>
  </div>
);

export const SkillCard = ({ category, skillsFound, demand }: { category: string, skillsFound: number, demand: number }) => (
  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
    <div className="flex justify-between items-start mb-4">
      <span className="font-bold text-white">{category}</span>
      <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md font-bold">{demand}% Demand</span>
    </div>
    <div className="text-3xl font-black text-slate-300 mb-2">{skillsFound}</div>
    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Skills Found</div>
    <div className="w-full h-1 bg-slate-700 mt-4 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 w-3/4"></div>
    </div>
  </div>
);

export const SuggestionCard = ({ suggestion }: { suggestion: { text: string, impact: string, time: string, category?: string } }) => {
  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
      <div className={`p-2 rounded-lg shrink-0 border ${getImpactColor(suggestion.impact)}`}>
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="w-full">
        <p className="text-sm font-medium text-white mb-2">{suggestion.text}</p>
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-700 text-slate-300 rounded">Impact: {suggestion.impact}</span>
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-700 text-slate-300 rounded">Time: {suggestion.time}</span>
          </div>
          {suggestion.category && (
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">{suggestion.category}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CareerTimeline = ({ role, label }: { role: string, label: string }) => (
  <div className="relative pl-6 pb-6 border-l-2 border-slate-700 last:border-0 last:pb-0 ml-3 mt-3">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900"></div>
    <div className="font-bold text-white leading-none mb-1">{role}</div>
    <div className="text-xs font-bold text-slate-500">{label}</div>
  </div>
);

export const CompanyFitCard = ({ company }: { company: { name: string, fitScore: number, missingSkills: string[], interviewDifficulty: string } }) => (
  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <Building className="w-4 h-4 text-slate-400" />
        <span className="font-bold text-white">{company.name}</span>
      </div>
      <span className={`text-xs px-2 py-1 rounded-md font-bold ${
        company.fitScore > 80 ? 'bg-emerald-500/20 text-emerald-400' : 
        company.fitScore > 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
      }`}>
        {company.fitScore}% Fit
      </span>
    </div>
    <div className="text-xs text-slate-400 mb-2">Difficulty: <span className="font-semibold text-slate-300">{company.interviewDifficulty}</span></div>
    {company.missingSkills && company.missingSkills.length > 0 && (
      <div>
        <div className="text-xs text-slate-500 mb-1">Missing Skills:</div>
        <div className="flex flex-wrap gap-1">
          {company.missingSkills.map((skill, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded">{skill}</span>
          ))}
        </div>
      </div>
    )}
  </div>
);

export const SalaryCard = ({ label, salary, isProjection }: { label: string, salary: {min: number, average: number, max: number}, isProjection?: boolean }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };
  
  return (
    <div className={`p-5 rounded-2xl border ${isProjection ? 'bg-indigo-900/30 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{label}</div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-slate-500">Average</div>
          <div className={`text-2xl font-black ${isProjection ? 'text-indigo-400' : 'text-white'}`}>{formatCurrency(salary.average)}</div>
        </div>
        <div className="p-3 bg-slate-800 rounded-full shrink-0">
          <IndianRupee className={`w-6 h-6 ${isProjection ? 'text-indigo-400' : 'text-emerald-400'}`} />
        </div>
      </div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-400">Min: {formatCurrency(salary.min)}</span>
        <span className="text-slate-400">Max: {formatCurrency(salary.max)}</span>
      </div>
    </div>
  );
};

export const InterviewMetric = ({ label, value }: { label: string, value: number }) => (
  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
    <div className="flex items-center gap-3">
      <MessageSquare className="w-4 h-4 text-slate-400" />
      <span className="text-sm font-medium text-slate-200 capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value}%` }}></div>
      </div>
      <span className="text-xs font-bold text-slate-400 w-8 text-right">{value}%</span>
    </div>
  </div>
);
