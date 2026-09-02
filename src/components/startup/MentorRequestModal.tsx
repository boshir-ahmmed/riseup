import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Startup } from '../../types';
import { X, Award, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface MentorRequestModalProps {
  startup: Startup;
  isOpen: boolean;
  onClose: () => void;
}

export const MentorRequestModal: React.FC<MentorRequestModalProps> = ({
  startup,
  isOpen,
  onClose
}) => {
  const { currentUser, sendMentorRequest, startups } = useApp();

  const [areas, setAreas] = useState<string[]>([
    'Product-Market Fit',
    'Go-To-Market Strategy'
  ]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMentoring = startups.find(s => s.assignedMentorId === currentUser.id);
  const isAtCapacity = currentMentoring && currentMentoring.id !== startup.id;

  const availableAreas = [
    'Product-Market Fit',
    'Go-To-Market Strategy',
    'Series A Pitch & Fundraising',
    'Enterprise Sales & Pricing',
    'Technical / AI Architecture',
    'Hiring & Team Scaling',
    'Regulatory & Clinical Approvals',
    'Supply Chain & Manufacturing'
  ];

  const toggleArea = (area: string) => {
    if (areas.includes(area)) {
      setAreas(areas.filter(a => a !== area));
    } else {
      setAreas([...areas, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const success = sendMentorRequest(
      startup.id,
      areas,
      message || `I would like to offer advisory mentorship to help ${startup.name} scale operations and product strategy.`
    );

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } else {
      setErrorMsg(
        `Ecosystem Rule: You are currently active mentor for ${currentMentoring?.name}. Mentors can actively mentor only 1 startup at a time.`
      );
    }
  };

  return (
    <div
      id="mentor-request-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="mentor-request-modal-card"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Mentorship Request Sent!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {startup.founderName} will review your advisory proposal. You will be notified upon confirmation.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Offer Advisory Mentorship
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Collaborating with {startup.name}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Mentorship Rule Callout */}
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RiseUp High-Impact 1-to-1 Mentorship Rule</span>
                </div>
                <p className="text-[11px] opacity-90">
                  To ensure quality focus, one mentor can actively mentor only <strong>ONE startup at a time</strong>.
                </p>
              </div>

              {isAtCapacity && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800/50 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Currently at Mentorship Capacity</p>
                    <p className="text-[11px]">
                      You are already actively mentoring <strong>{currentMentoring?.name}</strong>. You must conclude that mentorship before starting another.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 text-xs text-rose-700">
                  {errorMsg}
                </div>
              )}

              {/* Areas of Help */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Areas of Advisory Focus
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableAreas.map(area => {
                    const isSelected = areas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArea(area)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Introductory Advisory Note
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={`Share how your background (${currentUser.title}) can help ${startup.founderName} hit their next key milestone...`}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAtCapacity || areas.length === 0}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Advisory Offer</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
