import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Brain, Target, Map, Sparkles, Zap } from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  to: string;
  gradient: string;
  shadow: string;
}

const actions: QuickAction[] = [
  {
    icon: <UploadCloud className="h-4 w-4" />,
    label: 'Upload',
    to: '#upload',
    gradient: 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
    shadow: 'shadow-indigo-600/30 hover:shadow-indigo-600/50',
  },
  {
    icon: <Brain className="h-4 w-4" />,
    label: 'Analyze',
    to: '/dashboard/analyze-resume',
    gradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
    shadow: 'shadow-emerald-600/30 hover:shadow-emerald-600/50',
  },
  {
    icon: <Target className="h-4 w-4" />,
    label: 'Job Match',
    to: '/dashboard/job-match',
    gradient: 'from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500',
    shadow: 'shadow-rose-600/30 hover:shadow-rose-600/50',
  },
  {
    icon: <Map className="h-4 w-4" />,
    label: 'Roadmap',
    to: '/dashboard/learning-roadmap',
    gradient: 'from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500',
    shadow: 'shadow-cyan-600/30 hover:shadow-cyan-600/50',
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    label: 'Improve',
    to: '/dashboard/resume-improver',
    gradient: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
    shadow: 'shadow-amber-600/30 hover:shadow-amber-600/50',
  },
];

export const QuickActionsBar: React.FC = () => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 relative overflow-hidden">
      {/* Subtle ambient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-bold text-white">Quick Actions</span>
          </div>
          <p className="text-xs text-slate-600 hidden sm:block">Jump straight to the most used tools</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {actions.map((action) =>
            action.to.startsWith('#') ? (
              <a
                key={action.label}
                href={action.to}
                className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${action.gradient} text-white text-xs font-bold rounded-xl shadow-lg ${action.shadow} transition-all hover:-translate-y-0.5`}
              >
                {action.icon}
                {action.label}
              </a>
            ) : (
              <Link
                key={action.label}
                to={action.to}
                className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${action.gradient} text-white text-xs font-bold rounded-xl shadow-lg ${action.shadow} transition-all hover:-translate-y-0.5`}
              >
                {action.icon}
                {action.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsBar;
