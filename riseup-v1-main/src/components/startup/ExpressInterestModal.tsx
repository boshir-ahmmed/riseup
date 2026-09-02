import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Startup } from '../../types';
import { X, DollarSign, Send, Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ExpressInterestModalProps {
  startup: Startup;
  isOpen: boolean;
  onClose: () => void;
}

export const ExpressInterestModal: React.FC<ExpressInterestModalProps> = ({
  startup,
  isOpen,
  onClose
}) => {
  const { currentUser, expressInvestorInterest } = useApp();

  const [checkSize, setCheckSize] = useState<number>(
    startup.minInvestment || 50000
  );
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    expressInvestorInterest(
      startup.id,
      checkSize,
      note || `Interested in reviewing your financial model and syndicate opportunities for ${startup.name}.`
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      id="express-interest-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="express-interest-modal-card"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Interest Expressed Successfully!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {startup.founderName} has been notified and granted you preliminary due diligence connection access.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Express Investment Interest
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connecting with {startup.name} ({startup.founderName})
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
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold mb-0.5">Non-binding Connection Protocol</p>
                <p className="text-[11px] opacity-90">
                  RiseUp connects verified investors and founders directly. No financial transactions occur inside the platform.
                </p>
              </div>

              {/* Check Size offering */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Proposed Check Size / Syndicate Allocation (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="10000"
                    min={startup.minInvestment || 10000}
                    value={checkSize}
                    onChange={e => setCheckSize(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Min Check: ${(startup.minInvestment || 25000).toLocaleString()}</span>
                  <span>Target Round: ${(startup.fundingGoal).toLocaleString()}</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex gap-2 text-xs">
                {[50000, 100000, 250000, 500000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCheckSize(val)}
                    className={`flex-1 py-1 rounded-lg border text-[11px] font-semibold transition ${
                      checkSize === val
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ${(val / 1000)}k
                  </button>
                ))}
              </div>

              {/* Note / Thesis */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Personal Note & Strategic Value Add
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={`Hi ${startup.founderName}, our fund focuses on ${startup.industry}. We'd like to review your data room and discuss terms...`}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Interest Request</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
