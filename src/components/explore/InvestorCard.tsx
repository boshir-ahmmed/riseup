import React from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  ShieldCheck,
  MapPin,
  Building2,
  Sparkles,
  MessageSquare,
  ChevronRight,
  DollarSign,
  Briefcase,
  TrendingUp,
  FolderKanban,
  Award
} from 'lucide-react';

interface InvestorCardProps {
  investor: User;
  onPitch: (investor: User) => void;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({ investor, onPitch }) => {
  const {
    currentUser,
    setSelectedUserId,
    setActiveView,
    startConversationWithUser
  } = useApp();

  const isMe = currentUser.id === investor.id;

  const industries = investor.preferredIndustries || investor.investmentInterests || [
    'Artificial Intelligence',
    'Enterprise SaaS',
    'FinTech'
  ];

  const stages = investor.preferredStages || ['Pre-Seed', 'Seed', 'Series A'];

  const minRange = investor.investmentRange?.min
    ? investor.investmentRange.min >= 1000000
      ? `$${(investor.investmentRange.min / 1000000).toFixed(1)}M`
      : `$${(investor.investmentRange.min / 1000).toFixed(0)}k`
    : '$100k';

  const maxRange = investor.investmentRange?.max
    ? investor.investmentRange.max >= 1000000
      ? `$${(investor.investmentRange.max / 1000000).toFixed(1)}M`
      : `$${(investor.investmentRange.max / 1000).toFixed(0)}k`
    : '$2.5M';

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Header */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

      <div className="p-5 flex-1 space-y-4">
        {/* Investor Avatar & Identity */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={investor.avatar}
                alt={investor.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100 dark:border-emerald-900/60 shadow-sm group-hover:scale-105 transition duration-200"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedUserId(investor.id);
                    setActiveView('profile');
                  }}
                  className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition truncate text-left cursor-pointer"
                >
                  {investor.name}
                </button>
                {investor.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-500/10 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                {investor.title || `Partner at ${investor.company || 'Venture Capital'}`}
              </p>

              {investor.location && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{investor.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Persona Chip */}
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 uppercase tracking-wider shrink-0">
            INVESTOR
          </span>
        </div>

        {/* Bio / Thesis */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {investor.bio || 'Backing visionary early-stage founders and leading high-conviction syndicate allocations.'}
        </p>

        {/* Check Size & Portfolio Quick Metric Row */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Check / Ticket Size
            </span>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span>{minRange} - {maxRange}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Portfolio Deals
            </span>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{investor.portfolioCount || 12}+ Investments</span>
            </div>
          </div>
        </div>

        {/* Focus Stages */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-500" />
            Stage Focus
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stages.map((stg, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40"
              >
                {stg}
              </span>
            ))}
          </div>
        </div>

        {/* Focus Industries */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Sector Interests
          </span>
          <div className="flex flex-wrap gap-1">
            {industries.slice(0, 4).map((ind, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
              >
                {ind}
              </span>
            ))}
            {industries.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium">
                +{industries.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            setSelectedUserId(investor.id);
            setActiveView('profile');
          }}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
        >
          <span>Profile</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="flex items-center gap-2">
          {!isMe && (
            <button
              onClick={() => startConversationWithUser(investor)}
              title="Direct Message"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}

          {!isMe ? (
            <button
              onClick={() => onPitch(investor)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-100" />
              <span>Pitch Startup</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              Your Profile
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
