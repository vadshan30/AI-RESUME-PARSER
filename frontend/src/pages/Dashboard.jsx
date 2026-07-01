import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, UploadCloud, Target, Sparkles, Map, 
  History, BarChart2, LayoutTemplate, Briefcase, Download 
} from 'lucide-react';

const Dashboard = () => {
  const modules = [
    {
      id: 1,
      name: '🧠 Analyze Resume',
      description: 'Upload & parse your resume to get an ATS match score.',
      icon: <UploadCloud className="h-8 w-8 text-indigo-400" />,
      link: '/dashboard/analyze-resume',
      color: 'border-indigo-500/30 hover:border-indigo-500'
    },
    {
      id: 2,
      name: 'Job Match Analyzer',
      description: 'Compare your resume against a specific job description.',
      icon: <Target className="h-8 w-8 text-rose-400" />,
      link: '/dashboard/job-match',
      color: 'border-rose-500/30 hover:border-rose-500'
    },
    {
      id: 3,
      name: '✍️ Original Draft',
      description: 'Instantly rewrite and optimize resume sections with AI.',
      icon: <Sparkles className="h-8 w-8 text-amber-400" />,
      link: '/dashboard/resume-improver',
      color: 'border-amber-500/30 hover:border-amber-500'
    },
    {
      id: 4,
      name: 'Skill Gap Analysis',
      description: 'Find missing skills for your target role.',
      icon: <Map className="h-8 w-8 text-emerald-400" />,
      link: '/dashboard/skill-gap',
      color: 'border-emerald-500/30 hover:border-emerald-500'
    },
    {
      id: 5,
      name: 'Learning Roadmap',
      description: 'Step-by-step AI career path to learn missing skills.',
      icon: <Activity className="h-8 w-8 text-cyan-400" />,
      link: '/dashboard/learning-roadmap',
      color: 'border-cyan-500/30 hover:border-cyan-500'
    },
    {
      id: 6,
      name: 'Career Insights',
      description: 'Discover alternate roles you are qualified for.',
      icon: <Briefcase className="h-8 w-8 text-purple-400" />,
      link: '/dashboard/career-insights',
      color: 'border-purple-500/30 hover:border-purple-500'
    },

    {
      id: 8,
      name: 'Resume vs Top Candidate',
      description: 'Compare your resume to the ideal candidate for 300+ roles.',
      icon: <Target className="h-8 w-8 text-blue-400" />,
      link: '/dashboard/resume-vs-top-candidate', 
      color: 'border-blue-500/30 hover:border-blue-500'
    },
    {
      id: 9,
      name: 'Resume History',
      description: 'View previously parsed and analyzed resumes.',
      icon: <History className="h-8 w-8 text-slate-400" />,
      link: '/dashboard/history',
      color: 'border-slate-500/30 hover:border-slate-500'
    },
    {
      id: 10,
      name: 'Platform Analysis',
      description: 'System-wide analytics and performance tracking.',
      icon: <BarChart2 className="h-8 w-8 text-teal-400" />,
      link: '/dashboard/platform-analysis',
      color: 'border-teal-500/30 hover:border-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight text-white">AI ATS Platform</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Professional AI Resume Suite
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to optimize your resume, match with job descriptions, and accelerate your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link 
              key={module.id} 
              to={module.link}
              className={`flex flex-col p-6 rounded-2xl bg-slate-800/40 border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:bg-slate-800 ${module.color}`}
            >
              <div className="bg-slate-900/50 p-4 rounded-xl w-16 h-16 flex items-center justify-center shadow-inner mb-6">
                {module.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{module.name}</h3>
              <p className="text-slate-400 text-sm flex-grow">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
