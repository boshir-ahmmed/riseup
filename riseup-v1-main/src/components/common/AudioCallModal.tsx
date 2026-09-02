import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { RoleBadge } from '../layout/RoleBadge';

export const AudioCallModal: React.FC = () => {
  const { activeCallUser, endCall } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([40, 65, 30, 85, 95, 45, 70, 55, 90, 60, 35, 75]);

  useEffect(() => {
    if (!activeCallUser) {
      setCallDuration(0);
      return;
    }

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
      // Animate waveform
      setWaveformData(
        Array.from({ length: 14 }, () => Math.floor(Math.random() * 70) + 20)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCallUser]);

  if (!activeCallUser) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="live-audio-call-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        id="live-audio-call-dialog"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white text-center flex flex-col items-center animate-in zoom-in-95 duration-200"
      >
        {/* Encrypted badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Peer-to-Peer 256-Bit Encrypted Sync</span>
        </div>

        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full ring-4 ring-indigo-500/30 overflow-hidden relative">
            <img
              src={activeCallUser.avatar}
              alt={activeCallUser.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
        </div>

        <h3 className="font-bold text-lg text-white">{activeCallUser.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{activeCallUser.title}</p>
        <div className="mt-2">
          <RoleBadge role={activeCallUser.role} />
        </div>

        {/* Live status and timer */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-indigo-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Connected • {formatTime(callDuration)}</span>
        </div>

        {/* Simulated Waveform Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-12 w-full my-6 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
          {waveformData.map((height, idx) => (
            <div
              key={idx}
              className="w-1.5 bg-indigo-500 rounded-full transition-all duration-300"
              style={{
                height: isMuted ? '4px' : `${height}%`,
                opacity: isMuted ? 0.3 : 0.85
              }}
            />
          ))}
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3.5 rounded-full border transition ${
              isVideoOn
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition transform hover:scale-105 active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
