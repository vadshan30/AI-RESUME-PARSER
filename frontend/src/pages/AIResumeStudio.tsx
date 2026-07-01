import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, FileText, CheckCircle, Palette, Type, Layout, 
  Wand2, Settings, AlertTriangle, ChevronRight, Eye, Grid 
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { useUserStore } from '../store/useUserStore';

const AIResumeStudio = () => {
  const { 
    templates, selectedTemplate, isDownloading, error, 
    fetchTemplates, selectTemplate, setResumeData, downloadDocument 
  } = useStudioStore();
  
  const { getResumesForCurrentUser, currentUser } = useUserStore();
  const resumes = getResumesForCurrentUser();
  const activeResume = resumes[0]; 

  const [activeTab, setActiveTab] = useState('templates');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    fetchTemplates();
    setResumeData(activeResume || {
      personal_info: { name: "Mock User", email: "mock@example.com" },
      skills: ["React", "Python", "TypeScript"]
    } as any);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0B1120] h-16 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
            <Layout className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="font-bold text-xl tracking-tight">AI Resume Studio</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" /> ATS Score: {selectedTemplate?.ats_score_modifier || 90}%
          </div>
          <Link to="/dashboard" className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Exit Studio
          </Link>
        </div>
      </nav>

      {/* Main Studio Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Toolbar */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
          
          <div className="flex p-4 gap-2 border-b border-slate-800 bg-[#0B1120] sticky top-0 z-10">
            <button onClick={() => setActiveTab('templates')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-2 ${activeTab === 'templates' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              <Grid className="h-4 w-4" /> Templates
            </button>
            <button onClick={() => setActiveTab('customize')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-2 ${activeTab === 'customize' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              <Palette className="h-4 w-4" /> Customize
            </button>
          </div>

          <div className="p-4 flex-1">
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">100+ AI Generated Templates</h3>
                  <div className="space-y-2">
                    {templates.slice(0, 50).map(tpl => (
                      <div 
                        key={tpl.id} 
                        onClick={() => selectTemplate(tpl)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTemplate?.id === tpl.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/40 hover:border-slate-600'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold ${selectedTemplate?.id === tpl.id ? 'text-indigo-400' : 'text-slate-200'}`}>{tpl.name}</h4>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{tpl.category}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <Type className="h-3 w-3" /> {tpl.font} • {tpl.layout}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customize' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Color Theme</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Blue Professional", "Green Corporate", "Dark Mode", "Elegant Slate", "Startup Purple"].map(c => (
                      <div key={c} className={`p-2 border rounded-lg text-xs text-center cursor-pointer ${selectedTemplate?.color === c ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Typography</h3>
                  <div className="space-y-2">
                    {["Inter", "Roboto", "Merriweather", "Outfit"].map(f => (
                      <div key={f} className={`p-3 border rounded-lg text-sm cursor-pointer ${selectedTemplate?.font === f ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 text-slate-400 hover:bg-slate-800'}`} style={{ fontFamily: f }}>
                        {f} - The quick brown fox
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Enhancements</h3>
                  <button className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                    <Wand2 className="h-4 w-4" /> AI Rewrite Bullets
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Live Preview */}
        <div className="flex-1 bg-[#050810] flex flex-col relative overflow-hidden">
          
          {/* Zoom controls */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-xl">
            <button onClick={() => setScale(Math.max(0.5, scale - 0.1))} className="p-1.5 hover:bg-slate-700 rounded text-slate-300">-</button>
            <span className="p-1.5 text-xs font-bold text-slate-300 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(Math.min(1.5, scale + 0.1))} className="p-1.5 hover:bg-slate-700 rounded text-slate-300">+</button>
          </div>

          <div className="flex-1 overflow-auto p-12 flex justify-center items-start">
            {/* The A4 Canvas Mock */}
            <div 
              className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out flex flex-col"
              style={{ 
                width: '210mm', minHeight: '297mm', transform: `scale(${scale})`,
                fontFamily: selectedTemplate?.font || 'sans-serif'
              }}
            >
              <div className={`h-4 ${
                selectedTemplate?.color === 'Blue Professional' ? 'bg-blue-600' :
                selectedTemplate?.color === 'Green Corporate' ? 'bg-emerald-600' :
                selectedTemplate?.color === 'Startup Purple' ? 'bg-purple-600' :
                selectedTemplate?.color === 'Dark Mode' ? 'bg-slate-900' : 'bg-slate-700'
              }`}></div>
              
              <div className="p-12 flex-1">
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  {currentUser?.name || "JOHN DOE"}
                </h1>
                <div className="text-sm text-slate-500 font-medium mb-8 pb-4 border-b border-slate-200">
                  {currentUser?.email || "john.doe@example.com"} • 
                  {"+1 234 567 8900"}
                </div>

                <div className={`grid ${selectedTemplate?.layout === 'Split-Pane' ? 'grid-cols-3 gap-8' : 'grid-cols-1 gap-6'}`}>
                  <div className={selectedTemplate?.layout === 'Split-Pane' ? 'col-span-2' : ''}>
                    
                    <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest mb-4">Experience</h2>
                    <div className="space-y-6">
                      <div className="border-l-2 border-slate-200 pl-4">
                        <h3 className="font-bold text-slate-900">Senior Software Engineer</h3>
                        <div className="text-sm text-slate-500 mb-2">Tech Solutions Inc. • 2021 - Present</div>
                        <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                          <li>Spearheaded backend microservices architecture serving 1M+ DAU.</li>
                          <li>Optimized database queries reducing latency by 40%.</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                  
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {(activeResume?.skills || ["Python", "React", "Docker"]).map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Actions & Downloads */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col p-6 space-y-6">
          
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center"><FileText className="h-5 w-5 mr-2 text-indigo-400" /> Export Options</h3>
            <div className="space-y-3">
              <button 
                onClick={() => downloadDocument('pdf')}
                disabled={isDownloading}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Download PDF File
              </button>
              
              <button 
                onClick={() => downloadDocument('docx')}
                disabled={isDownloading}
                className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Download DOCX File
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Downloads are generated dynamically via our Python backend Document Builder Engine. If dependencies are missing, the server will alert you.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center"><Eye className="h-5 w-5 mr-2 text-indigo-400" /> Recruiter View</h3>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Readability</span>
                <span className="text-emerald-400 font-bold">Excellent</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Keyword Coverage</span>
                <span className="text-amber-400 font-bold">Needs Work</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Length</span>
                <span className="text-emerald-400 font-bold">Perfect (1 Page)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AIResumeStudio;
