import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Rocket, Send, ShieldCheck, CheckCircle2, FileText, DollarSign, Sparkles } from 'lucide-react';
import { User } from '../../types';

interface PitchToInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetInvestor?: User | null;
}

export const PitchToInvestorModal: React.FC<PitchToInvestorModalProps> = ({
  isOpen,
  onClose,
  targetInvestor
}) => {
  const { currentUser, users, startups, pitchStartupToInvestor } = useApp();

  const myStartups = startups.filter(s => s.founderId === currentUser.id);
  const activeStartup = myStartups[0] || startups[0];

  const investors = users.filter(u => u.role === 'investor');
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>(
    targetInvestor?.id || investors[0]?.id || ''
  );
  const [selectedStartupId, setSelectedStartupId] = useState<string>(activeStartup?.id || '');
  const [customPitchNote, setCustomPitchNote] = useState('');
  const [fundingAsk, setFundingAsk] = useState('$500,000 SAFE');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const chosenInvestor = users.find(u => u.id === selectedInvestorId) || targetInvestor;
  const chosenStartup = startups.find(s => s.id === selectedStartupId) || activeStartup;

  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenInvestor || !chosenStartup) return;

    pitchStartupToInvestor(
      chosenStartup.id,
      chosenInvestor.id,
      customPitchNote ||
        `Hi ${chosenInvestor.name}, we are raising ${fundingAsk} for ${chosenStartup.name} (${chosenStartup.tagline}). Would love to share our due diligence deck and sync for 15 mins.`
    );

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      id="pitch-investor-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="pitch-investor-modal-card"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Pitch Transmitted in Real-Time!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Your deal memorandum and pitch attachment were securely delivered to{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {chosenInvestor?.name}
              </strong>
              . Check your messages for real-time due diligence updates.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Direct Pitch to Investor
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verified Angel & Venture Capital Dispatch
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handlePitchSubmit} className="p-5 space-y-4">
              {/* Select Target Investor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Target Investor
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedInvestorId}
                    onChange={e => setSelectedInvestorId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    {investors.map(inv => (
                      <option key={inv.id} value={inv.id}>
                        {inv.name} — {inv.title} ({inv.company || 'Angel Partner'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Startup Being Pitched */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pitching Startup
                </label>
                <select
                  value={selectedStartupId}
                  onChange={e => setSelectedStartupId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  {startups.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.stage} • ${st.fundingRaised.toLocaleString()} raised of $
                      {st.fundingGoal.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Funding Round & Ask */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Instrument
                  </label>
                  <input
                    type="text"
                    value={fundingAsk}
                    onChange={e => setFundingAsk(e.target.value)}
                    placeholder="e.g. $500,000 SAFE"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Deck Attached
                  </label>
                  <div className="px-3.5 py-2 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 rounded-xl text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate font-semibold">{chosenStartup?.name}_PitchDeck.pdf</span>
                  </div>
                </div>
              </div>

              {/* Pitch note message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Personalized Note / Thesis Fit
                </label>
                <textarea
                  rows={3}
                  value={customPitchNote}
                  onChange={e => setCustomPitchNote(e.target.value)}
                  placeholder={`Hi ${chosenInvestor?.name || 'Investor'}, we are seeing strong traction with ${chosenStartup?.name} (${chosenStartup?.growthRatePercent || 40}% MoM) and would love to explore synergy...`}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Pitch to Investor</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
