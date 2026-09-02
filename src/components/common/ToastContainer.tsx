import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, MessageSquare, Briefcase, Award, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'deal':
      case 'success':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'message':
        return (
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case 'mentor':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div
      id="live-toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          id={`toast-item-${toast.id}`}
          className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl rounded-xl p-3.5 flex items-start gap-3 transform transition-all duration-200 animate-in slide-in-from-bottom-4 fade-in"
        >
          {toast.senderAvatar ? (
            <img
              src={toast.senderAvatar}
              alt=""
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
          ) : (
            getToastIcon(toast.type)
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {toast.title}
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Just now</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded transition shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
