import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Target, Search, UserCheck, Rocket, Mic, FileText, Loader, ChevronRight,
} from 'lucide-react';
import { ModuleShell } from '../components/resume/ModuleShell';
import { GlobalResumeUpload } from '../components/resume/GlobalResumeUpload';
import { ActiveResumeBanner } from '../components/resume/ActiveResumeBanner';
import { AnalyzeResultsPanel } from '../components/resume/AnalyzeResultsPanel';
import { useActiveResume } from '../hooks/useActiveResume';

const ResumeIntelligenceHub = () => {
  const {
    resume,
    isInitializing,
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    handleUpload,
    retryUpload,
    hasResume,
  } = useActiveResume();

  const [showUpload, setShowUpload] = useState(false);

  const featureCards = [
    {
      name: 'Enterprise ATS Scorecard',
      description: 'Detailed ATS scoring, breakdown, strengths, weaknesses, and format check.',
      icon: <FileText className="h-7 w-7 text-indigo-400" />,
      path: resume ? `/dashboard/analysis/${resume.id}` : '#',
      color: 'from-blue-500/20 to-indigo-500/20',
    },
    {
      name: 'AI Career Intelligence',
      description: 'Complete career analysis of the uploaded resume.',
      icon: <Brain className="h-7 w-7 text-indigo-400" />,
      path: '/dashboard/career-intelligence',
      color: 'from-indigo-500/20 to-purple-500/20',
    },
    {
      name: 'Resume X-Ray',
      description: 'Deep health scan, keyword density, and formatting check.',
      icon: <Search className="h-7 w-7 text-emerald-400" />,
      path: '/dashboard/resume-xray',
      color: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      name: 'Recruiter View',
      description: 'Blunt recruiter assessment with technical and project ratings.',
      icon: <UserCheck className="h-7 w-7 text-blue-400" />,
      path: '/dashboard/recruiter-view',
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      name: 'AI Career Twin',
      description: 'Your digital career profile, future roles, and learning timeline.',
      icon: <Rocket className="h-7 w-7 text-amber-400" />,
      path: '/dashboard/career-twin',
      color: 'from-amber-500/20 to-yellow-500/20',
    },
    {
      name: 'Interview Simulator',
      description: 'Technical and HR questions, suggested answers, and readiness score.',
      icon: <Mic className="h-7 w-7 text-pink-400" />,
      path: '/dashboard/interview-simulator',
      color: 'from-pink-500/20 to-rose-500/20',
    },
  ];

  return (
    <ModuleShell
      icon={Target}
      title="Analyze Resume"
      subtitle="Upload, parse, and analyze your resume in one place"
      accent="indigo"
    >
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Resume Intelligence Center
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upload your resume to get instant ATS scoring, skill analysis, and access to advanced AI tools.
        </p>
      </div>

      {isInitializing ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading resume data…</p>
        </div>
      ) : !hasResume || showUpload ? (
        <div className="max-w-2xl mx-auto">
          <GlobalResumeUpload
            variant="large"
            accent="indigo"
            title="Upload Your Resume"
            description="Upload once — your resume will be available across all dashboard modules automatically."
            onUpload={async (file) => { await handleUpload(file); setShowUpload(false); }}
            onRetry={retryUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <ActiveResumeBanner resume={resume} onReplace={() => setShowUpload(true)} accent="indigo" />
          <AnalyzeResultsPanel resume={resume} />

          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Advanced Analysis</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureCards.map((card) => (
                <Link
                  key={card.name}
                  to={card.path}
                  className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 transition-all hover:bg-slate-800 hover:-translate-y-1 hover:border-indigo-500/40 flex flex-col"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border border-white/5 w-fit mb-4`}>
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{card.name}</h3>
                  <p className="text-sm text-slate-400 flex-grow mb-4">{card.description}</p>
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
};

export default ResumeIntelligenceHub;
