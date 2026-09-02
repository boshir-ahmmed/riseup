import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StartupCard } from '../startup/StartupCard';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Bookmark,
  Search,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight,
  Target,
  ShieldCheck,
  User as UserIcon,
  Eye
} from 'lucide-react';

export const InvestorDashboard: React.FC = () => {
  const {
    currentUser,
    startups,
    investorRequests,
    savedStartupIds,
    setSelectedStartupId,
    setSelectedUserId,
    setActiveView,
    sendMessage
  } = useApp();

  const [filterStage, setFilterStage] = useState<string>('all');

  // Startups joined / invested by this investor
  const joinedStartups = startups.filter(
    s => s.joinedInvestorIds?.includes(currentUser.id) || currentUser.investedStartupIds?.includes(s.id)
  );

  // Saved bookmarks
  const savedStartups = startups.filter(s => savedStartupIds.includes(s.id));

  // My requests sent
  const mySentRequests = investorRequests.filter(r => r.investorId === currentUser.id);

  // Recommended startups
  const recommendedStartups = startups.filter(
    s => !joinedStartups.some(j => j.id === s.id)
  ).slice(0, 4);

  // Allocation metrics
  const totalCommitted = joinedStartups.reduce(
    (acc, s) => acc + (s.minInvestment || 50000) * 2,
    150000
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Verified Investor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentUser.company || 'Angel Syndicate Partner'} • Multi-Startup Portfolio Hub
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('explore')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <Search className="w-4 h-4" />
          <span>Explore New Dealflow</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Portfolio Startups</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {joinedStartups.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {joinedStartups.length ? 'Active Syndicates' : '0 Active Deals'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Capital Deployed/Committed</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            ${(totalCommitted / 1000).toFixed(0)}k USD
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ticket size: ${(currentUser.investmentRange?.min || 50000) / 1000}k - ${(currentUser.investmentRange?.max || 500000) / 1000}k
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Pipeline Requests</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {mySentRequests.length}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
            {mySentRequests.filter(r => r.status === 'accepted').length} accepted by founders
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Watchlist Bookmarks</span>
            <Bookmark className="w-4 h-4 text-purple-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {savedStartups.length}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">
            Saved for Diligence
          </span>
        </div>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Portfolio Companies & Active Pipeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Portfolio Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Active Portfolio & Joined Syndicates
                </h3>
                <p className="text-xs text-slate-500">
                  Direct visibility into cap table and milestone progress
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">
                {joinedStartups.length} Companies
              </span>
            </div>

            {joinedStartups.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-xs text-slate-400">
                You haven't joined any startup rounds yet. Browse the dealflow directory to express interest!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {joinedStartups.map(startup => (
                  <div
                    key={startup.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        onClick={() => {
                          setSelectedStartupId(startup.id);
                          setActiveView('startup-details');
                        }}
                        className="flex items-center gap-3 cursor-pointer group/card"
                      >
                        <img
                          src={startup.logo}
                          alt={startup.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover/card:ring-2 group-hover/card:ring-indigo-500 transition"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition">
                            {startup.name}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {startup.industry} • {startup.stage}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStartupId(startup.id);
                          setActiveView('startup-details');
                        }}
                        className="px-2 py-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg text-xs font-bold flex items-center gap-0.5 cursor-pointer"
                        title="View Startup Details"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Round Target</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ${(startup.fundingGoal / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Round Raised</span>
                        <span className="font-bold text-emerald-600">
                          ${(startup.fundingRaised / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedUserId(startup.founderId);
                          setActiveView('profile');
                        }}
                        className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer truncate max-w-[140px]"
                        title={`View ${startup.founderName}'s Profile`}
                      >
                        <img
                          src={startup.founderAvatar}
                          alt={startup.founderName}
                          className="w-4 h-4 rounded-full object-cover shrink-0"
                        />
                        <span className="truncate">{startup.founderName}</span>
                      </button>

                      <button
                        onClick={() => {
                          sendMessage(startup.founderId, `Hi ${startup.founderName}, let's schedule our quarterly portfolio review.`);
                          setActiveView('messages');
                        }}
                        className="py-1 px-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Interest Requests Pipeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Submitted Interest Requests & Status
            </h3>

            {mySentRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-850/50 rounded-xl">
                No active interest requests submitted.
              </div>
            ) : (
              <div className="space-y-3">
                {mySentRequests.map(req => {
                  const targetStartup = startups.find(s => s.id === req.startupId);
                  return (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/50 dark:bg-slate-850/40"
                    >
                      <div
                        onClick={() => {
                          if (targetStartup) {
                            setSelectedStartupId(targetStartup.id);
                            setActiveView('startup-details');
                          }
                        }}
                        className="flex items-center gap-3 cursor-pointer group/req"
                      >
                        {targetStartup && (
                          <img
                            src={targetStartup.logo}
                            alt={targetStartup.name}
                            className="w-9 h-9 rounded-lg object-cover group-hover/req:ring-2 group-hover/req:ring-indigo-500 transition"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover/req:text-indigo-600 dark:group-hover/req:text-indigo-400 transition">
                            {targetStartup?.name || 'Startup'}
                          </h4>
                          <p className="text-slate-500 text-[11px]">
                            Proposed Check: ${(req.checkSizeAmount / 1000).toFixed(0)}k USD
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {targetStartup && (
                          <button
                            onClick={() => {
                              setSelectedStartupId(targetStartup.id);
                              setActiveView('startup-details');
                            }}
                            className="px-2.5 py-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <span
                          className={`font-bold px-2.5 py-1 rounded-full text-[11px] capitalize ${
                            req.status === 'accepted'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : req.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Watchlist & Dealflow Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Watchlist Quick Access */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-purple-500" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Diligence Watchlist
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {savedStartups.length} Saved
              </span>
            </div>

            {savedStartups.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No bookmarks saved yet.</p>
            ) : (
              <div className="space-y-2">
                {savedStartups.slice(0, 3).map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedStartupId(s.id);
                      setActiveView('startup-details');
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img src={s.logo} alt={s.name} className="w-7 h-7 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.stage}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Dealflow */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Recommended For You
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {recommendedStartups.map(s => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedStartupId(s.id);
                    setActiveView('startup-details');
                  }}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {s.industry} • ${(s.fundingGoal / 1000000).toFixed(1)}M Goal
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
