import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LucideIcon, ArrowLeft } from 'lucide-react';

interface ModuleShellProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: 'indigo' | 'emerald' | 'blue' | 'purple' | 'rose' | 'cyan';
  showBackButton?: boolean;
}

const accentMap = {
  indigo: { bg: 'bg-indigo-600/20', border: 'border-indigo-500/30', text: 'text-indigo-400' },
  emerald: { bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  rose: { bg: 'bg-rose-600/20', border: 'border-rose-500/30', text: 'text-rose-400' },
  cyan: { bg: 'bg-cyan-600/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
};

export const ModuleShell: React.FC<ModuleShellProps> = ({
  icon: Icon,
  title,
  subtitle,
  children,
  accent = 'indigo',
  showBackButton = false,
}) => {
  const colors = accentMap[accent];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-indigo-500/30 pb-16">
      <nav className="border-b border-slate-800/80 bg-[#0B1120]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200 group mr-1"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
            )}
            <div className={`p-2 rounded-lg border ${colors.bg} ${colors.border}`}>
              <Icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-tight">{title}</span>
              {subtitle && <span className="text-[11px] text-slate-500 hidden sm:block">{subtitle}</span>}
            </div>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            All Tools
          </Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};

export default ModuleShell;
