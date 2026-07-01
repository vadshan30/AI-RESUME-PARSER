import React from 'react';
import { Star } from 'lucide-react';
import { RoleAnalysisData } from '../../types/PlatformAnalysisData';
import { UploadResume } from './UploadResume';
import {
  ScoreCard, MetricCard, ProgressBar, BenchmarkItem,
  ReadinessCard, SkillCard, SuggestionCard, CareerTimeline,
  CompanyFitCard, SalaryCard, InterviewMetric
} from './DashboardComponents';

interface DashboardProps {
  data: RoleAnalysisData;
  onUpload: (file: File) => void;
  isUploading: boolean;
  error?: string;
}

export const AnalysisDashboard: React.FC<DashboardProps> = ({ data, onUpload, isUploading, error }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold mb-2">Analysis Results for {data.roleName}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 font-bold rounded">{data.category}</span>
            <span className="text-slate-400">Level: {data.experienceLevel}</span>
          </div>
        </div>
        <div className="w-80">
          <UploadResume onUpload={onUpload} isUploading={isUploading} error={error} />
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreCard label="Platform Score" value={data.platformScore} color="blue" />
        <ScoreCard label="ATS Score" value={data.atsScore} color="green" />
        <ScoreCard label="Hire Probability" value={data.hireProbability} color="purple" />
        <ScoreCard label="Career Readiness" value={data.careerReadiness} color="orange" />
        <ScoreCard label="Industry Rank" value={data.industryRank} color="teal" />
      </div>

      {/* Platform Health Metrics */}
      <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Platform Health Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex flex-col justify-center items-center">
            <div className={`text-5xl font-black mb-2 ${data.platformScore > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {data.platformScore}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {data.platformScore > 70 ? 'Strong Profile' : 'Needs Work'}
            </div>
          </div>
          <MetricCard value={data.totalSkills} label="Total Skills" />
          <MetricCard value={data.totalProjects} label="Projects" />
          <MetricCard value={data.experienceYears} label="Experience (Yrs)" />
          <MetricCard value={data.educationCount} label="Education" />
        </div>
      </div>

      {/* Salary Impact & Company Fit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Salary Estimation ({data.salary.currency})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SalaryCard label="Current Market Value" salary={data.salary.current} />
            <SalaryCard label="Potential After Fixes" salary={data.salary.afterImprovements} isProjection={true} />
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Target Company Fit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.companyFit.map((company, i) => (
              <CompanyFitCard key={i} company={company} />
            ))}
          </div>
        </div>
      </div>

      {/* Resume Quality & Interview Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl col-span-2">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Resume Quality Breakdown</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
             {Object.entries(data.qualityBreakdown).map(([key, value]) => (
                <ProgressBar key={key} label={key} value={value} />
             ))}
           </div>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Interview Readiness</h2>
          <div className="space-y-3">
             {Object.entries(data.interviewReadiness).map(([key, value]) => (
                <InterviewMetric key={key} label={key} value={value as number} />
             ))}
          </div>
        </div>
      </div>

      {/* ATS & Industry Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">ATS Performance Engine</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(data.atsPerformance).map(([key, value]) => (
              <ProgressBar key={key} label={key} value={value} />
            ))}
          </div>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Industry Benchmarks</h2>
          <div className="space-y-5">
            <BenchmarkItem label="Freshers" value={data.benchmarks.freshers} />
            <BenchmarkItem label="Junior Developers" value={data.benchmarks.junior} />
            <BenchmarkItem label="Mid-Level Engineers" value={data.benchmarks.midLevel} />
            <BenchmarkItem label="Senior Engineers" value={data.benchmarks.senior} />
            <BenchmarkItem label="Leads / Architects" value={data.benchmarks.lead} />
          </div>
        </div>
      </div>

      {/* Skill Intelligence */}
      <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Skill Intelligence & Market Demand</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(data.skillIntelligence).map(([category, info]) => (
            <SkillCard key={category} category={category} skillsFound={info.skillsFound} demand={info.marketDemand} />
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-700">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Extracted Technical Skills</h3>
           <div className="flex flex-wrap gap-2">
             {data.extractedSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm font-medium text-slate-300">
                    {skill}
                </span>
             ))}
           </div>
        </div>
      </div>

      {/* AI Summary & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" /> AI Career Summary
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg relative z-10">
            {data.aiSummary}
          </p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Critical AI Suggestions</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {data.suggestions.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>
      </div>

      {/* Career Growth Prediction */}
      <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-3xl shadow-xl">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Career Growth Prediction</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-between px-4">
          <CareerTimeline role={data.careerGrowth.currentRole} label="Current Role" />
          <CareerTimeline role={data.careerGrowth.nextRole} label={data.careerGrowth.nextRoleTimeline} />
          <CareerTimeline role={data.careerGrowth.futureRole} label={data.careerGrowth.futureRoleTimeline} />
          <CareerTimeline role={data.careerGrowth.leadershipRole} label={data.careerGrowth.leadershipRoleTimeline} />
          {data.careerGrowth.executiveRole && (
             <CareerTimeline role={data.careerGrowth.executiveRole} label={data.careerGrowth.executiveRoleTimeline} />
          )}
        </div>
      </div>
    </div>
  );
};
