import React from 'react';
import { useApp } from '../../context/AppContext';
import { Startup } from '../../types';
import {
  Bookmark,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  CheckCircle2,
  MapPin,
  Globe,
  ArrowUpRight,
  Sparkles,
  Briefcase
} from 'lucide-react';

interface StartupCardProps {
  startup: Startup;
  onSelect?: () => void;
}

export const StartupCard: React.FC<StartupCardProps> = ({ startup, onSelect }) => {
  const {
    currentUser,
    toggleSaveStartup,
    savedStartupIds,
    setSelectedStartupId,
    setSelectedUserId,
    setActiveView,
    expressInvestorInterest
  } = useApp();

  const isSaved = savedStartupIds.includes(startup.id);
  const fundingPercent = Math.min(100, Math.round((startup.fundingRaised / startup.fundingGoal) * 100));

  const handleCardClick = () => {
    setSelectedStartupId(startup.id);
    setActiveView('startup-details');
    if (onSelect) onSelect();
  };

  const handleQuickSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveStartup(startup.id);
  };

  return (
    <div
      id={`startup-card-${startup.id}`}
      onClick={handleCardClick}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/60 transition duration-200 overflow-hidden flex flex-col group cursor-pointer"
    >
      {/* Cover Banner */}
      <div className="h-32 w-full relative bg-slate-950 overflow-hidden">
        <img
          src={startup.coverImage}
          alt={startup.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-xs">
            {startup.stage}
          </span>

          <div className="flex items-center gap-1.5">
            {startup.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
            <button
              onClick={handleQuickSave}
              className={`p-1.5 rounded-full backdrop-blur-md transition ${
                isSaved
                  ? 'bg-amber-500 text-white'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              title="Bookmark startup"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Floating Logo */}
        <div className="absolute -bottom-4 left-4">
          <img
            src={startup.logo}
            alt={startup.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-900 shadow-md bg-white dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 pt-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Title & Founder */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {startup.name}
                </h3>
                {startup.isVerified && (
                  <span title="Verified Startup">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{startup.location}</span>
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {startup.businessModel}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {startup.tagline}
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                Target / Goal
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                ${(startup.fundingGoal / 1000000).toFixed(1)}M USD
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                Valuation
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                ${((startup.valuation || 8000000) / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>

          {/* Funding Progress Meter */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-slate-500 dark:text-slate-400">
                ${(startup.fundingRaised / 1000).toFixed(0)}k raised
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{fundingPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${fundingPercent}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {startup.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUserId(startup.founderId);
              setActiveView('profile');
            }}
            className="flex items-center gap-2 group/founder hover:text-indigo-600 transition cursor-pointer"
            title={`View ${startup.founderName}'s Profile`}
          >
            <img
              src={startup.founderAvatar}
              alt={startup.founderName}
              className="w-6 h-6 rounded-full object-cover group-hover/founder:ring-2 group-hover/founder:ring-indigo-500 transition"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 group-hover/founder:text-indigo-600 dark:group-hover/founder:text-indigo-400 group-hover/founder:underline truncate max-w-[120px]">
              {startup.founderName}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition">
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
