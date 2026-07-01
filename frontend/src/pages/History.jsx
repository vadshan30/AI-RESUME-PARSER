import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FileText, ChevronRight, Loader2, ArrowLeft, Activity } from 'lucide-react';

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resume?skip=0&limit=50');
        setResumes(response.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight text-white hover:text-indigo-400 transition-colors">AI Parser</span>
            </Link>
            <div className="flex items-center">
              <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FileText className="h-8 w-8 text-indigo-400" />
          Resume History
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            {resumes.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p className="text-lg">No resumes found in history.</p>
                <Link to="/dashboard/upload" className="text-indigo-400 hover:text-indigo-300 font-medium mt-4 inline-block">
                  Upload your first resume
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-700/50">
                {resumes.map((resume) => (
                  <li key={resume.id} className="hover:bg-slate-700/30 transition-colors">
                    <button
                      onClick={() => navigate(`/dashboard/analysis/${resume.id}`)}
                      className="w-full text-left px-8 py-6 flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-lg text-slate-200 truncate pr-4">
                          {resume.name || resume.filename}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${resume.resume_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : resume.resume_score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            Score: {resume.resume_score}/100
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                          <span>{new Date(resume.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="bg-slate-800 p-3 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                        <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
