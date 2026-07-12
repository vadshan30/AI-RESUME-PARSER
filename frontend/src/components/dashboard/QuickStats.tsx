import React from 'react';
import { FileText, TrendingUp, Award, Clock } from 'lucide-react';
import { SavedResume } from '../../store/useUserStore';

interface Props {
  resumes: SavedResume[];
  isLoading: boolean;
}

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  gradient: string;
  iconBg: string;
}

export const QuickStats: React.FC<Props> = ({ resumes, isLoading }) => {
  const bestScore = resumes.length
    ? Math.max(...resumes.map(r => r.resume_score || 0))
    : 0;

  const lastUploadDate = resumes[0]?.lastUpdated
    ? new Date(resumes[0].lastUpdated)
    : null;

  const lastActivity = (() => {
    if (!lastUploadDate) return 'No uploads yet';
    const diffMs = Date.now() - lastUploadDate.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  })();

  const stats: StatCard[] = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Total Resumes',
      value: isLoading ? '—' : resumes.length,
      sub: resumes.length === 0 ? 'Upload your first!' : `${resumes.length} in library`,
      gradient: 'from-indigo-600/20 to-purple-600/20',
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Active Scans',
      value: isLoading ? '—' : resumes.filter(r => r.resume_score != null).length,
      sub: 'Analyzed resumes',
      gradient: 'from-rose-600/20 to-pink-600/20',
      iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: 'Best Score',
      value: isLoading ? '—' : bestScore > 0 ? `${bestScore}%` : 'N/A',
      sub: bestScore >= 80 ? '🏆 Excellent Match!' : bestScore > 0 ? 'Keep improving!' : 'No scans yet',
      gradient: 'from-amber-600/20 to-orange-600/20',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Last Activity',
      value: isLoading ? '—' : lastActivity,
      sub: lastUploadDate ? lastUploadDate.toLocaleDateString() : 'No activity',
      gradient: 'from-emerald-600/20 to-teal-600/20',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`relative bg-gradient-to-br ${stat.gradient} border border-slate-700/60 rounded-2xl p-5 overflow-hidden group hover:scale-[1.02] hover:shadow-xl hover:border-slate-600/60 transition-all duration-300`}
        >
          {/* Decorative circle */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5 group-hover:bg-white/8 transition-colors" />

          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${stat.iconBg} mb-4`}>
            {stat.icon}
          </div>

          <div className="text-2xl font-black text-white mb-0.5 relative z-10">
            {stat.value}
          </div>
          <div className="text-xs font-bold text-slate-400 mb-1">{stat.label}</div>
          <div className="text-xs text-slate-500 leading-tight">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
