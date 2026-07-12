import React, { useRef } from 'react';
import { Briefcase, AlertCircle, Loader, Wand2, Trash2, ClipboardPaste } from 'lucide-react';
import { useJobMatchStore } from '../../store/useJobMatchStore';
import { motion, AnimatePresence } from 'framer-motion';

const JobDescriptionInput = () => {
  const { jobDescription, setJobDescription, extractedJD, isExtracting, extractJD, error } = useJobMatchStore();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(jobDescription + (jobDescription ? '\n\n' : '') + text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      // Fallback or user prompt could be handled here
    }
  };

  const handleAIEnhance = async () => {
    await extractJD();
  };

  return (
    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 shadow-xl mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Briefcase className="h-5 w-5 text-blue-400 mr-2" /> Paste Job Description
        </h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePaste}
            className="text-xs font-bold bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg flex items-center transition-colors"
          >
            <ClipboardPaste className="h-3 w-3 mr-1.5" /> Paste
          </button>
          <span className={`text-xs font-bold ${jobDescription.length > 5000 ? 'text-red-400' : 'text-slate-400'}`}>
            {jobDescription.length} / 5000
          </span>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          ref={textAreaRef}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          maxLength={5000}
          placeholder="Paste the complete job posting requirements, responsibilities, and details here. Our AI will automatically extract key requirements..."
          className="w-full h-80 bg-slate-900/80 border border-slate-600 rounded-xl p-5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none shadow-inner leading-relaxed"
        />
        
        <div className="absolute bottom-4 right-4 flex space-x-2">
           <button
            onClick={() => setJobDescription('')}
            disabled={isExtracting || !jobDescription}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 disabled:opacity-50 text-slate-300 rounded-xl font-bold transition-colors shadow-lg"
            title="Clear Input"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleAIEnhance}
            disabled={isExtracting || !jobDescription.trim()}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex items-center shadow-lg shadow-indigo-600/20"
          >
            {isExtracting ? <Loader className="h-5 w-5 animate-spin mr-2" /> : <Wand2 className="h-5 w-5 mr-2" />}
            {isExtracting ? "Extracting..." : "AI Enhance"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-sm text-red-400">
          <AlertCircle className="h-4 w-4 mr-2 shrink-0" /> {typeof error === 'string' ? error : error.reason || 'An error occurred'}
        </div>
      )}

      {/* AI Extraction Tags Preview */}
      <AnimatePresence>
        {extractedJD && !isExtracting && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 border-t border-slate-700/50 pt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center uppercase tracking-wider">
                <Wand2 className="h-4 w-4 mr-2" /> Extracted Requirements
              </h3>
              {extractedJD.minExperience > 0 && (
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                  Exp: {extractedJD.minExperience}{extractedJD.maxExperience ? `-${extractedJD.maxExperience}` : '+'} years
                </span>
              )}
            </div>

            <div className="space-y-4">
              {extractedJD.requiredSkills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">Core Technical Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {extractedJD.requiredSkills.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-bold rounded-md border border-indigo-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {extractedJD.softSkills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">Soft Skills & Competencies</p>
                  <div className="flex flex-wrap gap-2">
                    {extractedJD.softSkills.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded-md border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDescriptionInput;
