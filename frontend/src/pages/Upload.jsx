import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { useResumeStore } from '../store/useResumeStore';
import { parseUploadError } from '../utils/resumeUpload';
import { UploadCloud, FileText, ChevronRight, Activity, Loader, ArrowLeft, AlertCircle } from 'lucide-react';
import { ALL_ROLES } from '../data/jobRoles';

const UPLOAD_STEPS = [
  "Uploading Resume",
  "Extracting Text",
  "Parsing Resume",
  "Calculating ATS Score",
  "Category Prediction",
  "Generating Recommendations",
  "Completed"
];

const Upload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { uploadResume } = useResumeStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [targetRole, setTargetRole] = useState('');
  const [recentResumes, setRecentResumes] = useState([]);

  async function fetchRecentResumes() {
    try {
      const response = await api.get('/resume?skip=0&limit=5');
      setRecentResumes(response.data);
    } catch (err) {
      console.error('Failed to fetch recent resumes', err);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecentResumes();
  }, []);

  // Handle simulated progress timer
  useEffect(() => {
    let interval;
    if (isUploading && progressPercent < 95) {
      interval = setInterval(() => {
        setProgressPercent(prev => {
          const next = prev + (Math.random() * 5 + 1);
          return next > 95 ? 95 : next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isUploading, progressPercent]);

  // Sync step with percentage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (progressPercent >= 100) setProgressStep(6);
    else if (progressPercent >= 85) setProgressStep(5);
    else if (progressPercent >= 70) setProgressStep(4);
    else if (progressPercent >= 50) setProgressStep(3);
    else if (progressPercent >= 30) setProgressStep(2);
    else if (progressPercent >= 15) setProgressStep(1);
    else setProgressStep(0);
  }, [progressPercent]);

  const resolveReturnTarget = () => {
    const stateReturnTo = location.state && location.state.returnTo;
    const queryReturnTo = new URLSearchParams(location.search).get('returnTo');
    const storedReturnTo = typeof window !== 'undefined'
      ? window.sessionStorage.getItem('resume_upload_return_to')
      : null;

    const candidate = stateReturnTo || queryReturnTo || storedReturnTo;
    if (!candidate || typeof candidate !== 'string') {
      return '/dashboard/analyze-resume';
    }

    if (candidate === '/dashboard/upload') {
      return '/dashboard/analyze-resume';
    }

    if (candidate.startsWith('/dashboard') || candidate.startsWith('/analysis')) {
      return candidate;
    }

    return '/dashboard/analyze-resume';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setErrorMsg('');
      } else {
        setErrorMsg('Please upload a PDF file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setErrorMsg('');
      } else {
        setErrorMsg('Please upload a PDF file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const returnTo = resolveReturnTarget();

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('resume_upload_return_to', returnTo);
    }

    // Reset States
    setIsUploading(true);
    setProgressPercent(0);
    setErrorMsg('');

    try {
      console.log('Upload request started...');
      const resume = await uploadResume(file, targetRole.trim() || undefined);
      setProgressPercent(100);
      setIsUploading(false);
      const destination = returnTo || `/dashboard/analysis/${resume?.id}`;
      setTimeout(() => {
        if (destination.startsWith('/dashboard/analysis/') && resume?.id) {
          navigate(destination, { replace: true });
        } else {
          navigate(destination, { replace: true });
        }
      }, 500);
    } catch (err) {
      console.error('Upload failed:', err);
      setIsUploading(false);
      setProgressPercent(0);
      setErrorMsg(parseUploadError(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight text-white hover:text-indigo-400 transition-colors">AI Parser</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Analyze New Resume
              </h1>
              <p className="mt-2 text-slate-400">
                Upload a PDF to instantly extract skills, experience, and get an ATS match score.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-rose-400">Error</h3>
                  <p className="text-sm text-rose-300 mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Job Title (Optional)</label>
              <input
                type="text"
                list="job-roles"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                disabled={isUploading}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
              <datalist id="job-roles">
                {ALL_ROLES.map((role) => (
                  <option key={role} value={role} />
                ))}
              </datalist>
              <p className="text-xs text-slate-500 mt-2">Providing a target role enables accurate Missing Skills analysis.</p>
            </div>

            <div
              className={`relative group rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-slate-800 rounded-full shadow-inner group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-10 w-10 text-indigo-400" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {file ? file.name : 'Drag & drop your resume here'}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Only PDF files are supported
                  </p>
                </div>
                
                {!file && !isUploading && (
                  <>
                    <div className="flex items-center gap-4 w-full max-w-xs my-4">
                      <div className="h-px bg-slate-700 flex-1"></div>
                      <span className="text-sm text-slate-500 uppercase font-medium">or</span>
                      <div className="h-px bg-slate-700 flex-1"></div>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
                    >
                      Browse Files
                    </button>
                  </>
                )}

                {file && !isUploading && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => { setFile(null); setErrorMsg(''); }}
                      className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      Analyze Resume
                    </button>
                  </div>
                )}

                {isUploading && (
                  <div className="w-full max-w-md mx-auto mt-8 text-left">
                    <div className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                      <span className="text-indigo-400 animate-pulse flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Step {progressStep + 1}: {UPLOAD_STEPS[progressStep]}
                      </span>
                      <span>{Math.floor(progressPercent)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Recent Scans Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                Recent Scans
              </h2>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              {recentResumes.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No recent scans found.</p>
                  <p className="text-sm mt-1">Upload your first resume to see it here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-700/50">
                  {recentResumes.map((resume) => (
                    <li key={resume.id} className="hover:bg-slate-700/30 transition-colors">
                      <button
                         onClick={() => navigate(`/dashboard/analysis/${resume.id}`)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium text-slate-200 truncate pr-4">
                            {resume.name || resume.filename}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span>Score: {resume.resume_score}/100</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span>{new Date(resume.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
