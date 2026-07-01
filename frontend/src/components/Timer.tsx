import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
}

export const Timer: React.FC<TimerProps> = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isLow = timeLeft < 30;

  return (
    <div className={`flex items-center px-4 py-2 rounded-full font-mono text-lg font-bold border ${
      isLow 
        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' 
        : 'bg-slate-800/50 text-slate-300 border-slate-700/50'
    }`}>
      <Clock size={18} className="mr-2 opacity-70" />
      {minutes}:{seconds < 10 ? '0' : ''}{seconds}
    </div>
  );
};
