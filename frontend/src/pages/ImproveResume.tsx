import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Target, Loader, CheckCircle, 
  FileText, Flame, Zap, AlertCircle
} from 'lucide-react';
import api from '../services/api';

const ImproveResume = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { resumeId: number, jobDescription: string, atsResult: any } | null;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [originalResume, setOriginalResume] = useState<string>('');
  const [improvedResume, setImprovedResume] = useState<string>('');
  const [atsBefore, setAtsBefore] = useState<number>(0);
  const [atsAfter, setAtsAfter] = useState<number>(0);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!state?.resumeId) {
      navigate('/dashboard/job-match');
      return;
    }

    const fetchImprovement = async () => {
      try {
        const response = await api.post(`/resume/${state.resumeId}/improve`, {
          job_description: state.jobDescription,
          ats_result: state.atsResult
        });
        const data = response.data;
        if (data.success) {
          setOriginalResume(data.original_resume);
          setImprovedResume(data.improved_resume_markdown);
          setAtsBefore(data.ats_before);
          setAtsAfter(data.ats_after);
          setImprovements(data.improvements || []);
        } else {
          setError("Failed to improve resume.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.detail || "An unexpected error occurred while improving the resume.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImprovement();
  }, [state, navigate]);

  const handleExportPDF = () => {
    setIsExporting(true);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      const element = document.getElementById('improved-resume-content');
      const opt = {
        margin:       1,
        filename:     `Improved_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => setIsExporting(false));
    };
    document.body.appendChild(script);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center items-center text-slate-100">
        <Loader className="h-16 w-16 text-indigo-500 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">AI is Improving Your Resume</h2>
        <p className="text-slate-400">This may take 15-30 seconds. We are rewriting content and recalculating ATS metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center items-center text-slate-100 p-6 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Improvement Failed</h2>
        <p className="text-rose-400 font-mono bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 max-w-2xl">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-20">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Zap className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">Resume Improver</span>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Top Score Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">ATS Before</p>
              <p className="text-4xl font-black text-slate-300">{atsBefore}</p>
            </div>
            <Target className="h-12 w-12 text-slate-600" />
          </div>
          <div className="bg-indigo-900/20 p-6 rounded-3xl border border-indigo-500/30 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-300 mb-1">ATS After</p>
              <p className="text-4xl font-black text-indigo-400">{atsAfter}</p>
            </div>
            <Flame className="h-12 w-12 text-indigo-500" />
          </div>
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-center">
            <button onClick={handleExportPDF} disabled={isExporting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center disabled:opacity-50">
              {isExporting ? <Loader className="h-5 w-5 animate-spin mr-2"/> : <FileText className="h-5 w-5 mr-2"/>}
              {isExporting ? 'Generating PDF...' : 'Download Improved Resume'}
            </button>
          </div>
        </section>

        {/* Suggestions */}
        <section className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Improvement Suggestions Applied</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {improvements.map((imp, idx) => (
              <div key={idx} className="flex items-start text-sm text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 shrink-0" /> {imp}
              </div>
            ))}
          </div>
        </section>

        {/* Split Pane */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
          <div className="flex flex-col bg-slate-800/40 rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-700">
              <h3 className="font-bold text-slate-300">Original Resume (Raw Text)</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-900/20 text-slate-400 font-mono text-sm whitespace-pre-wrap">
              {originalResume || "No original text found."}
            </div>
          </div>
          
          <div className="flex flex-col bg-slate-800/40 rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
            <div className="p-4 bg-indigo-900/30 border-b border-indigo-500/30">
              <h3 className="font-bold text-indigo-300">Improved Resume (Ready for Export)</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white" id="improved-resume-content">
              <div className="p-10 text-slate-900 font-sans whitespace-pre-wrap">
                {improvedResume}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImproveResume;
