import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Brain, Target, Search, UserCheck, Rocket, Mic,
  UploadCloud, Loader, AlertCircle 
} from 'lucide-react';
import api from '../services/api';

const ResumeIntelligenceHub = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchActiveResume = async () => {
    try {
      setLoading(true);
      const activeId = localStorage.getItem('active_resume_id');
      if (activeId) {
        // Fetch specific resume logic (we don't have GET /resume/:id, but we can just use the latest if needed, 
        // wait, we can just GET /resume and find it, or we rely on the fact that if it's there it's active.
        // Actually, let's just get the latest resume for now and ensure it matches active_resume_id.
        // To be safe, let's just get the latest.)
        const response = await api.get('/resume?skip=0&limit=1');
        if (response.data && response.data.length > 0) {
          setResume(response.data[0]);
          localStorage.setItem('active_resume_id', response.data[0].id);
        } else {
          localStorage.removeItem('active_resume_id');
        }
      } else {
        const response = await api.get('/resume?skip=0&limit=1');
        if (response.data && response.data.length > 0) {
          setResume(response.data[0]);
          localStorage.setItem('active_resume_id', response.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch resume', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveResume();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Please upload a PDF file.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(response.data);
      localStorage.setItem('active_resume_id', response.data.id);
      setUploading(false);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploading(false);
      if (err.response?.data?.detail) {
        setErrorMsg(`Analysis Failed: ${err.response.data.detail}`);
      } else {
        setErrorMsg('Analysis Failed: Unable to connect to backend.');
      }
    }
  };

  const featureCards = [
    {
      id: 1,
      name: '🧠 AI Career Intelligence',
      description: 'Complete career analysis of the uploaded resume.',
      icon: <Brain className="h-8 w-8 text-indigo-400" />,
      path: '/dashboard/career-intelligence',
      color: 'from-indigo-500/20 to-purple-500/20',
      borderColor: 'group-hover:border-indigo-500/50'
    },
    {
      id: 2,
      name: '🎯 Hiring Probability',
      description: 'Shortlisting, interview, and hiring probability breakdown.',
      icon: <Target className="h-8 w-8 text-rose-400" />,
      path: '/dashboard/hiring-probability',
      color: 'from-rose-500/20 to-orange-500/20',
      borderColor: 'group-hover:border-rose-500/50'
    },
    {
      id: 3,
      name: '🔍 Resume X-Ray',
      description: 'Deep health scan, keyword density, and formatting check.',
      icon: <Search className="h-8 w-8 text-emerald-400" />,
      path: '/dashboard/resume-xray',
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'group-hover:border-emerald-500/50'
    },
    {
      id: 4,
      name: '👨‍💼 Recruiter View',
      description: 'Blunt recruiter assessment with technical & project ratings.',
      icon: <UserCheck className="h-8 w-8 text-blue-400" />,
      path: '/dashboard/recruiter-view',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'group-hover:border-blue-500/50'
    },
    {
      id: 5,
      name: '🚀 AI Career Twin',
      description: 'Your digital career profile, future roles, and learning timeline.',
      icon: <Rocket className="h-8 w-8 text-amber-400" />,
      path: '/dashboard/career-twin',
      color: 'from-amber-500/20 to-yellow-500/20',
      borderColor: 'group-hover:border-amber-500/50'
    },
    {
      id: 6,
      name: '🎤 Interview Simulator',
      description: 'Technical and HR questions, suggested answers, and readiness score.',
      icon: <Mic className="h-8 w-8 text-pink-400" />,
      path: '/dashboard/interview-simulator',
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'group-hover:border-pink-500/50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <nav className="flex items-center">
          <Link to="/dashboard" className="flex items-center text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
            Resume Intelligence Center
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose an advanced AI analysis for your uploaded resume
          </p>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading your intelligence hub...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upload or Active Resume Section */}
            {!resume ? (
              <div className="max-w-3xl mx-auto bg-slate-800/50 border border-slate-700/50 rounded-2xl p-10 text-center shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="bg-indigo-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UploadCloud className="h-10 w-10 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Upload Resume to Unlock Intelligence Hub</h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  Upload your PDF resume below to instantly unlock all 6 premium AI analysis modules shown below.
                </p>
                
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleUpload}
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center mx-auto min-w-[250px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader className="h-5 w-5 mr-3 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    'Select PDF Resume'
                  )}
                </button>

                {errorMsg && (
                  <div className="mt-6 flex items-start text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-left max-w-lg mx-auto">
                    <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{errorMsg}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                    <UserCheck className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Active Resume</p>
                    <p className="font-medium text-white">{resume.name || resume.filename || 'Uploaded Resume'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setResume(null);
                    localStorage.removeItem('active_resume_id');
                  }}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors px-4 py-2 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10"
                >
                  Upload Different Resume
                </button>
              </div>
            )}

            {/* Feature Cards Grid - strictly 1 on mobile, 2 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {!resume && (
                <div className="absolute inset-0 z-10 bg-[#0B1120]/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center pointer-events-none">
                  {/* Just a slight blur overlay to show they are locked */}
                </div>
              )}
              {featureCards.map((card) => (
                <div 
                  key={card.id} 
                  className={`group bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between ${
                    resume ? `hover:bg-slate-800 hover:-translate-y-1 ${card.borderColor}` : 'opacity-60 grayscale-[50%]'
                  }`}
                >
                  <div className="flex items-start space-x-5">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color} border border-white/5`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold text-white mb-2 ${resume ? 'group-hover:text-indigo-300 transition-colors' : ''}`}>
                        {card.name}
                      </h3>
                      <p className="text-slate-400 leading-relaxed mb-6">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex justify-end">
                    {resume ? (
                      <Link 
                        to={card.path}
                        className="bg-slate-700/50 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center border border-slate-600/50 group-hover:border-indigo-500/50"
                      >
                        Open Analysis
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="bg-slate-800 text-slate-500 px-5 py-2.5 rounded-lg font-medium flex items-center border border-slate-700 cursor-not-allowed"
                      >
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeIntelligenceHub;
