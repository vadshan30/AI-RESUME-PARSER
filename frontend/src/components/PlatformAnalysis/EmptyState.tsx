import React from 'react';
import { FileText } from 'lucide-react';
import { UploadResume } from './UploadResume';

export const EmptyState: React.FC<{ onUpload: (file: File) => void, isUploading: boolean, error?: string }> = ({ onUpload, isUploading, error }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-800/30 rounded-3xl border border-slate-700/50 p-12">
      <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
        <FileText className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-3">No Resume Uploaded</h3>
      <p className="text-slate-400 text-center max-w-lg mb-10 text-lg">
        Upload your resume to get a comprehensive platform analysis containing real ATS scores, personalized job readiness insights, and massive dynamic data processing.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-400 mb-10 w-full max-w-2xl">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
          <div className="font-bold text-blue-400 mb-1 text-base">ATS Score Engine</div>
          <div className="text-xs">Actual keyword and formatting checks</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
          <div className="font-bold text-emerald-400 mb-1 text-base">Skill Intelligence</div>
          <div className="text-xs">Dynamic extraction and ranking</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
          <div className="font-bold text-purple-400 mb-1 text-base">Career Insights</div>
          <div className="text-xs">Role-specific projections and fit</div>
        </div>
      </div>
      
      <div className="w-full max-w-lg">
        <UploadResume onUpload={onUpload} isUploading={isUploading} error={error} />
      </div>
    </div>
  );
};
