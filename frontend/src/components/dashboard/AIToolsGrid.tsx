import React from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud, Target, Sparkles, Map, Activity, Briefcase,
  History, BarChart2,
} from 'lucide-react';

const tools = [
  {
    name: '🧠 Analyze Resume',
    desc: 'Upload & parse your resume to get an ATS match score.',
    icon: <UploadCloud className="h-8 w-8 text-indigo-400" />,
    link: '/dashboard/analyze-resume',
    borderClass: 'border-indigo-500/30 hover:border-indigo-500',
  },
  {
    name: 'Job Match Analyzer',
    desc: 'Compare your resume against a specific job description.',
    icon: <Target className="h-8 w-8 text-rose-400" />,
    link: '/dashboard/job-match',
    borderClass: 'border-rose-500/30 hover:border-rose-500',
  },
  {
    name: '✍️ Original Draft',
    desc: 'Instantly rewrite and optimize resume sections with AI.',
    icon: <Sparkles className="h-8 w-8 text-amber-400" />,
    link: '/dashboard/resume-improver',
    borderClass: 'border-amber-500/30 hover:border-amber-500',
  },
  {
    name: 'Skill Gap Analysis',
    desc: 'Find missing skills for your target role.',
    icon: <Map className="h-8 w-8 text-emerald-400" />,
    link: '/dashboard/skill-gap',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500',
  },
  {
    name: 'Learning Roadmap',
    desc: 'Step-by-step AI career path to learn missing skills.',
    icon: <Activity className="h-8 w-8 text-cyan-400" />,
    link: '/dashboard/learning-roadmap',
    borderClass: 'border-cyan-500/30 hover:border-cyan-500',
  },
  {
    name: 'Career Insights',
    desc: 'Discover alternate roles you are qualified for.',
    icon: <Briefcase className="h-8 w-8 text-purple-400" />,
    link: '/dashboard/career-insights',
    borderClass: 'border-purple-500/30 hover:border-purple-500',
  },
  {
    name: 'Resume vs Top Candidate',
    desc: 'Compare your resume to the ideal candidate for 300+ roles.',
    icon: <Target className="h-8 w-8 text-blue-400" />,
    link: '/dashboard/resume-vs-top-candidate',
    borderClass: 'border-blue-500/30 hover:border-blue-500',
  },
  {
    name: 'Resume History',
    desc: 'View previously parsed and analyzed resumes.',
    icon: <History className="h-8 w-8 text-slate-400" />,
    link: '/dashboard/history',
    borderClass: 'border-slate-500/30 hover:border-slate-500',
  },
  {
    name: 'Platform Analysis',
    desc: 'System-wide analytics and performance tracking.',
    icon: <BarChart2 className="h-8 w-8 text-teal-400" />,
    link: '/dashboard/platform-analysis',
    borderClass: 'border-teal-500/30 hover:border-teal-500',
  },
];

export const AIToolsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((t) => (
        <Link
          key={t.name}
          to={t.link}
          className={`flex flex-col p-6 rounded-2xl bg-slate-800/40 border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:bg-slate-800 ${t.borderClass}`}
        >
          <div className="bg-slate-900/50 p-4 rounded-xl w-16 h-16 flex items-center justify-center shadow-inner mb-6">
            {t.icon}
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">{t.name}</h3>
          <p className="text-slate-400 text-sm flex-grow">{t.desc}</p>
        </Link>
      ))}
    </div>
  );
};

export default AIToolsGrid;
