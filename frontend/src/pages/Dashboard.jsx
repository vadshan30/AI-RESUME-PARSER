import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { AIToolsGrid } from '../components/dashboard/AIToolsGrid';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight text-white">
                AI ATS Platform
              </span>
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
            Everything you need to optimize your resume, match with job descriptions,
            and accelerate your career.
          </p>
        </div>

        <AIToolsGrid />
      </main>
    </div>
  );
};

export default Dashboard;
