import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  isInitializing?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  isRecording, 
  onToggleRecording,
  isInitializing = false,
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs">
        <Loader size={14} className="animate-spin" />
        Checking mic support…
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="text-amber-400 text-xs flex items-center bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
        <AlertCircle size={14} className="mr-1.5 shrink-0" />
        Voice input not supported — use Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggleRecording}
        disabled={isInitializing}
        className={`p-3 rounded-full transition-all flex items-center justify-center relative ${
          isRecording 
            ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
            : 'bg-violet-500 hover:bg-violet-600 shadow-lg shadow-violet-500/20'
        } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isInitializing ? (
          <Loader size={20} className="animate-spin" />
        ) : isRecording ? (
          <MicOff size={20} />
        ) : (
          <Mic size={20} />
        )}
        {isRecording && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full animate-ping" />
        )}
      </button>

      {/* Status label */}
      <span className={`text-xs font-semibold transition-colors ${
        isRecording ? 'text-rose-400' : 'text-slate-500'
      }`}>
        {isInitializing ? (
          'Initializing…'
        ) : isRecording ? (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
            Listening…
          </span>
        ) : (
          '🎤 Ready'
        )}
      </span>
    </div>
  );
};

// Tiny inline loader to avoid importing from lucide separately
function Loader({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
