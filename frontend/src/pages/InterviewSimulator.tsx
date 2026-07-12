import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Mic, Play, Loader, CheckCircle2, 
  AlertTriangle, Target, RefreshCw
} from 'lucide-react';
import { useInterviewStore, InterviewConfig } from '../store/useInterviewStore';
import { useResumeStore } from '../store/useResumeStore';
import { VoiceInput } from '../components/VoiceInput';
import { Timer } from '../components/Timer';
import { VoiceInputService } from '../services/VoiceInputService';

const InterviewSimulator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    currentSession, isLoading, isRecording,
    startInterview, submitAnswer, nextQuestion, quitSession,
    startRecording, stopRecording
  } = useInterviewStore();
  const { currentResumeId } = useResumeStore();

  const [config, setConfig] = useState<InterviewConfig>({
    role: 'React Developer',
    level: 'Mid',
    type: 'Technical',
    difficulty: 'Medium',
    questionCount: 5
  });

  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceService, setVoiceService] = useState<VoiceInputService | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  
  // Track the text that was in the box before the current recording session started
  const baseTextRef = useRef<string | null>(null);

  // Setup Voice Service
  useEffect(() => {
    // Reset recording state on mount to prevent persist bugs
    if (isRecording) stopRecording();

    const service = new VoiceInputService(
      (transcript) => {
        setMicError(null);
        setAnswerText(prev => {
          // If we haven't stored a base text yet for this recording session, store what's in the box
          if (baseTextRef.current === null) {
            baseTextRef.current = prev;
          }
          
          // The new text should simply be the base text plus the transcript
          const base = baseTextRef.current || '';
          const spacer = base && !base.endsWith(' ') ? ' ' : '';
          return base + spacer + transcript;
        });
      },
      (error) => {
        console.error(error);
        setMicError(error);
        stopRecording();
      },
      () => {
        // Called when recognition stops (by user, browser timeout, or error)
        // Sync the store so the UI updates
        stopRecording();
      }
    );
    setVoiceService(service);
    
    return () => {
      service.destroy();
    };
  }, []);

  // Sync Voice Service with Store State
  useEffect(() => {
    if (voiceService) {
      if (isRecording) voiceService.startListening();
      else voiceService.stopListening();
    }
  }, [isRecording, voiceService]);

  // Track time taken per question
  useEffect(() => {
    if (currentSession?.status === 'InProgress') {
      const timer = setInterval(() => setTimeTaken(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [currentSession?.currentQuestionIndex, currentSession?.status]);

  // Stop recording and clear answer when moving to next question
  useEffect(() => {
    if (isRecording) {
      stopRecording();
    }
    setAnswerText('');
    setTimeTaken(0);
    baseTextRef.current = null;
    setMicError(null);
  }, [currentSession?.currentQuestionIndex]);

  const handleStart = () => startInterview(config);

  const handleSubmit = async () => {
    if (!answerText.trim()) return;
    setIsSubmitting(true);
    // Stop any active recording before submitting
    if (isRecording) stopRecording();
    await submitAnswer(answerText, timeTaken);
    setAnswerText('');
    setTimeTaken(0);
    baseTextRef.current = null;
    setIsSubmitting(false);
    nextQuestion();
  };

  // Resume required before starting a session
  if (!currentResumeId && !currentSession) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-8 font-sans selection:bg-violet-500/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <nav className="flex items-center justify-between">
            <Link to="/dashboard/analyze-resume" className="flex items-center text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Intelligence Hub</span>
            </Link>
          </nav>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 text-center">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center">
              <Mic className="h-10 w-10 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Upload Your Resume</h1>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              A resume is required to generate interview questions tailored to your profile. Upload once and return directly to Interview Simulator.
            </p>
            <button
              onClick={() => navigate('/dashboard/upload', { state: { returnTo: location.pathname + location.search } })}
              className="mt-8 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-500/20"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1. CONFIGURATION VIEW
  if (!currentSession) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-8 font-sans selection:bg-violet-500/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <nav className="flex items-center justify-between">
            <Link to="/dashboard/analyze-resume" className="flex items-center text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Intelligence Hub</span>
            </Link>
          </nav>

          <header className="border-b border-slate-800 pb-8 flex items-center space-x-4">
            <div className="bg-violet-500/20 p-3 rounded-xl border border-violet-500/30">
              <Mic className="h-8 w-8 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Interview Simulator</h1>
              <p className="text-slate-400 mt-1">Configure your mock interview session</p>
            </div>
          </header>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Role</label>
                <select value={config.role} onChange={(e) => setConfig({...config, role: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none">
                  {['React Developer', 'Java Developer', 'Python Developer', 'Node.js Developer', 'Machine Learning Engineer', 'DevOps Engineer', 'Data Scientist'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select value={config.type} onChange={(e) => setConfig({...config, type: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none">
                  {['Technical', 'Behavioral', 'System Design', 'Mixed'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
                <select value={config.difficulty} onChange={(e) => setConfig({...config, difficulty: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none">
                  {['Easy', 'Medium', 'Hard', 'Expert'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Questions Count</label>
                <select value={config.questionCount} onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none">
                  {[3, 5, 10, 15].map(c => <option key={c} value={c}>{c} Questions</option>)}
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleStart} disabled={isLoading}
              className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader className="animate-spin mr-2" /> : <Play className="mr-2 fill-current" />}
              {isLoading ? 'Preparing Questions...' : 'Start Interview Session'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. SESSION VIEW
  if (currentSession.status === 'InProgress') {
    const question = currentSession.questions[currentSession.currentQuestionIndex];

    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
             <button onClick={quitSession} className="text-sm font-medium flex items-center text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quit Session
            </button>
            <Timer duration={300} />
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-700">
              <div 
                className="h-full bg-violet-500 transition-all duration-500" 
                style={{ width: `${((currentSession.currentQuestionIndex) / currentSession.questions.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-bold uppercase tracking-wide">
                Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
              </span>
              <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-bold uppercase tracking-wide">
                {question.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                question.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                question.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {question.difficulty}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-medium text-white mb-8 leading-tight">
              {question.question}
            </h2>

            <div className="space-y-4">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your answer here, or click the mic to speak..."
                className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-5 text-lg text-white focus:border-violet-500 outline-none resize-none"
                disabled={isSubmitting}
              />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <VoiceInput 
                    isRecording={isRecording}
                    onToggleRecording={() => {
                      setMicError(null);
                      if (isRecording) {
                        stopRecording();
                      } else {
                        baseTextRef.current = null;
                        startRecording();
                      }
                    }}
                    onTranscript={(text) => setAnswerText(text)} // Backup
                  />
                  {micError && (
                    <div className="text-rose-400 text-xs flex items-center bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 max-w-xs">
                      <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                      {micError}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !answerText.trim()}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white font-bold rounded-xl flex items-center transition-colors"
                >
                  {isSubmitting ? <Loader className="animate-spin mr-2 h-5 w-5" /> : null}
                  {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULTS VIEW
  const totalScore = Math.round(
    currentSession.responses.reduce((acc, curr) => acc + curr.score, 0) / currentSession.responses.length
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-8 font-sans selection:bg-violet-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="flex items-center justify-between">
          <Link to="/dashboard/analyze-resume" className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Intelligence Hub
          </Link>
          <button onClick={quitSession} className="flex items-center text-sm px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20 hover:bg-violet-500/20 transition-all">
            <RefreshCw className="h-4 w-4 mr-2" /> Start New Interview
          </button>
        </nav>

        <header className="text-center py-10 bg-slate-800/30 border border-slate-700/50 rounded-3xl">
          <div className="w-24 h-24 mx-auto bg-violet-500/20 border border-violet-500/30 rounded-full flex items-center justify-center mb-4">
            <Target className="h-10 w-10 text-violet-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Interview Complete</h1>
          <p className="text-slate-400 text-lg">Overall Performance Score: <span className="text-white font-bold">{totalScore}%</span></p>
        </header>

        <div className="space-y-6">
          {currentSession.responses.map((response, idx) => {
            const question = currentSession.questions.find(q => q.id === response.questionId);
            return (
              <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex-1 mr-4">Q{idx + 1}: {question?.question}</h3>
                  <div className={`px-4 py-1 rounded-full font-bold text-sm ${response.score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {response.score}% Match
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Answer</h4>
                    <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg italic">"{response.answer}"</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Feedback</h4>
                    <div className="flex items-start text-slate-300 bg-violet-500/10 border border-violet-500/20 p-4 rounded-lg">
                      {response.score >= 70 ? <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-rose-400 mr-3 shrink-0" />}
                      <span>{response.feedback}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Concept</h4>
                    <p className="text-emerald-400/80 bg-emerald-500/5 p-4 rounded-lg text-sm border border-emerald-500/10">
                      {question?.sampleAnswer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
