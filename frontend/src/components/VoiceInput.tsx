import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  isRecording, 
  onToggleRecording 
}) => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  if (!isSupported) {
    return (
      <div className="text-amber-500 text-xs flex items-center bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
        <AlertCircle size={14} className="mr-1.5" />
        Voice input not supported in this browser.
      </div>
    );
  }

  return (
    <button
      onClick={onToggleRecording}
      className={`p-3 rounded-full transition-all flex items-center justify-center ${
        isRecording 
          ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse' 
          : 'bg-violet-500 hover:bg-violet-600 shadow-lg shadow-violet-500/20'
      } text-white`}
      title={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};
