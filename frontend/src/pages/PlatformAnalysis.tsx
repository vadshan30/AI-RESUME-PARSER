import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { usePlatformAnalysis } from '../hooks/usePlatformAnalysis';
import { EmptyState } from '../components/PlatformAnalysis/EmptyState';
import { AnalysisDashboard } from '../components/PlatformAnalysis/AnalysisDashboard';

const PlatformAnalysis = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { data, analyzeResume, loading } = usePlatformAnalysis();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(undefined);
    try {
      await analyzeResume(file);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-20 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Platform Analysis</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Resume...</h2>
            <p className="text-slate-400">Our AI is extracting and parsing massive career data.</p>
          </div>
        ) : !data ? (
          <EmptyState onUpload={handleUpload} isUploading={isUploading} error={error} />
        ) : (
          <AnalysisDashboard data={data} onUpload={handleUpload} isUploading={isUploading || loading} error={error} />
        )}
      </main>
    </div>
  );
};

export default PlatformAnalysis;
