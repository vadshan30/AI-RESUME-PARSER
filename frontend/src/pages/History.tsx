import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FileText, ChevronRight, Loader2, ArrowLeft, Activity, Trash2, Eye, Download, Search, AlertCircle, BarChart3, Clock, HardDrive } from 'lucide-react';
import { useResumeStore, BackendResumeData } from '../store/useResumeStore';
import ResumePreviewModal from '../components/resume/ResumePreviewModal';
import { formatDistanceToNow, format } from 'date-fns';

const History = () => {
  const [resumes, setResumes] = useState<BackendResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [selectedResume, setSelectedResume] = useState<BackendResumeData | null>(null);

  const { deleteResume } = useResumeStore();
  const navigate = useNavigate();

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/resume?skip=0&limit=50');
      setResumes(response.data);

      // Calculate manual stats since /resume/stats doesn't exist
      setStats({
        total_resumes: response.data.length,
        total_analyses: response.data.reduce((acc: number, r: any) => acc + (r.analysis_data ? 1 : 0), 0),
        latest_upload: response.data[0]?.created_at || null,
        total_storage_used: response.data.length * 150 * 1024 // mockup storage
      });
    } catch (err: any) {
      console.error('Failed to fetch history', err);
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleSelectResume = (resume: any) => {
    localStorage.setItem('active_resume_id', resume.id.toString());
    useResumeStore.setState({ currentResume: resume, currentResumeId: resume.id });
    navigate('/dashboard/analyze-resume');
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert("Failed to delete resume");
    }
  };

  const handleDownload = (e: React.MouseEvent, resume: BackendResumeData) => {
    e.stopPropagation();
    // Assuming backend data has content or we just mock a download for now
    const content = JSON.stringify(resume, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.filename || 'resume'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredResumes = resumes.filter(r =>
    (r.filename || r.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-indigo-500/30 pb-20">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Parser</span>
          </Link>
          <Link to="/dashboard" className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <FileText className="h-10 w-10 text-indigo-400" />
          Resume History
        </h1>
        <p className="text-slate-400 mb-8">View and manage all your uploaded resumes and their analyses.</p>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg"><FileText className="w-6 h-6 text-blue-400" /></div>
              <div>
                <p className="text-sm text-slate-400">Total Resumes</p>
                <p className="text-2xl font-bold">{stats.total_resumes}</p>
              </div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg"><BarChart3 className="w-6 h-6 text-emerald-400" /></div>
              <div>
                <p className="text-sm text-slate-400">Total Analyses</p>
                <p className="text-2xl font-bold">{stats.total_analyses}</p>
              </div>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-lg"><Clock className="w-6 h-6 text-amber-400" /></div>
              <div>
                <p className="text-sm text-slate-400">Latest Upload</p>
                <p className="text-md font-bold truncate">{stats.latest_upload ? new Date(stats.latest_upload).toLocaleDateString() : 'None'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            {filteredResumes.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <FileText className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                <p className="text-xl font-medium">No resumes found.</p>
                <Link to="/dashboard/upload" className="text-indigo-400 hover:text-indigo-300 font-bold mt-4 inline-block">
                  Upload a new resume
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400 uppercase tracking-wider text-xs font-bold">
                    <tr>
                      <th className="px-6 py-4">Filename</th>
                      <th className="px-6 py-4">Upload Date</th>
                      <th className="px-6 py-4">ATS Score</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredResumes.map((resume) => (
                      <tr key={resume.id} className="hover:bg-slate-700/30 transition-colors group">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedResume(resume)}>
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            <span className="font-bold text-white text-base">{resume.filename || resume.name || `Resume #${resume.id}`}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {new Date(resume.created_at || new Date()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-md text-xs font-bold ${(resume.resume_score || 0) >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              (resume.resume_score || 0) >= 60 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                            Score: {resume.resume_score || 0} / 100
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelectedResume(resume)} className="p-2 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDownload(e, resume)} className="p-2 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors" title="Download Source">
                              <Download className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDelete(e, resume.id)} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleSelectResume(resume)} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors ml-2" title="Full Analysis">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedResume && (
        <ResumePreviewModal
          resume={selectedResume as any}
          onClose={() => setSelectedResume(null)}
          onSelect={() => {
            handleSelectResume(selectedResume);
          }}
        />
      )}
    </div>
  );
};

export default History;
