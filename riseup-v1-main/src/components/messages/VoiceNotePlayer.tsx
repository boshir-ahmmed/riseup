import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  durationSec: number;
  waveform?: number[];
  isMine?: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  durationSec,
  waveform = [30, 45, 60, 85, 40, 75, 90, 65, 50, 80, 95, 70, 45, 60, 75, 40, 65, 80, 55, 30],
  isMine = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSec, setPlaybackSec] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / speed);
      timerRef.current = setInterval(() => {
        setPlaybackSec(prev => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, durationSec]);

  const togglePlay = () => {
    if (playbackSec >= durationSec) {
      setPlaybackSec(0);
    }
    setIsPlaying(prev => !prev);
  };

  const handleSpeedToggle = () => {
    if (speed === 1) setSpeed(1.5);
    else if (speed === 1.5) setSpeed(2);
    else setSpeed(1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentDisplayTime = isPlaying
    ? formatTime(playbackSec)
    : formatTime(durationSec);

  const progressPercent = (playbackSec / durationSec) * 100;

  return (
    <div
      className={`p-2.5 rounded-2xl flex items-center gap-3 select-none min-w-[240px] sm:min-w-[280px] ${
        isMine
          ? 'bg-indigo-700/60 text-white border border-indigo-500/40'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95 cursor-pointer ${
          isMine
            ? 'bg-white text-indigo-700 hover:bg-slate-100'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        title={isPlaying ? 'Pause voice note' : 'Play voice note'}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
      </button>

      {/* Waveform & Duration */}
      <div className="flex-1 flex flex-col justify-center gap-1">
        {/* Waveform Bars */}
        <div className="flex items-center gap-1 h-7">
          {waveform.map((height, i) => {
            const barPercent = (i / waveform.length) * 100;
            const isPassed = progressPercent >= barPercent;

            return (
              <div
                key={i}
                onClick={() => {
                  const targetSec = Math.round((i / waveform.length) * durationSec);
                  setPlaybackSec(targetSec);
                }}
                className={`w-1 rounded-full cursor-pointer transition-all duration-150 ${
                  isMine
                    ? isPassed
                      ? 'bg-white'
                      : 'bg-indigo-400/50 hover:bg-indigo-300'
                    : isPassed
                    ? 'bg-indigo-600'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-indigo-400'
                }`}
                style={{
                  height: `${Math.max(18, height)}%`
                }}
              />
            );
          })}
        </div>

        {/* Time Stamp and Speed Selector */}
        <div className="flex items-center justify-between text-[10px] font-medium opacity-85">
          <span>{currentDisplayTime}</span>
          <button
            type="button"
            onClick={handleSpeedToggle}
            className={`px-1.5 py-0.2 rounded-md font-bold text-[9px] uppercase tracking-wider transition cursor-pointer ${
              isMine
                ? 'bg-indigo-800/80 hover:bg-indigo-900 text-indigo-100'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200'
            }`}
            title="Toggle playback speed"
          >
            {speed}x
          </button>
        </div>
      </div>
    </div>
  );
};
