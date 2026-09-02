import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StartupCard } from '../startup/StartupCard';
import { FounderCard } from './FounderCard';
import { PitchToFounderModal } from '../modals/PitchToFounderModal';
import { User } from '../../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowUpDown,
  MapPin,
  DollarSign,
  TrendingUp,
  X,
  Users,
  Zap,
  Globe,
  ShieldCheck
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const {
    startups,
    users,
    currentUser,
    exploreTab,
    setExploreTab,
    pitchFounderModalTarget,
    setPitchFounderModalTarget,
    setSelectedStartupId,
    setSelectedUserId,
    setActiveView
  } = useApp();

  // Search and general filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedSynergy, setSelectedSynergy] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'raised' | 'goal' | 'views' | 'synergy'>('raised');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const industries = [
    'All',
    'AI & Machine Learning',
    'HealthTech & Biotech',
    'CleanTech & Energy',
    'FinTech & Payments',
    'Enterprise SaaS',
    'Quantum Computing',
    'AgriTech & Food'
  ];

  const stages = ['All', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];
  
  const synergies = [
    'All',
    'Tech & API Synergy',
    'Strategic Alliance',
    'Peer Review & Advisory',
    'Cross-Promotion',
    'Angel Syndicate Backing',
    'B2B Pilot & Integration'
  ];

  const locations = ['All', 'United States', 'Europe', 'Asia / MENA', 'Remote'];

  // Filter Founders list
  const foundersList = users.filter(u => u.role === 'founder');

  const filteredFounders = foundersList
    .filter(founder => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const startup = startups.find(s => s.id === founder.startupId);
        const matchesName = founder.name.toLowerCase().includes(q);
        const matchesTitle = (founder.title || '').toLowerCase().includes(q);
        const matchesCompany = (founder.company || '').toLowerCase().includes(q);
        const matchesBio = (founder.bio || '').toLowerCase().includes(q);
        const matchesLocation = (founder.location || '').toLowerCase().includes(q);
        const matchesSkills = (founder.skills || []).some(s => s.toLowerCase().includes(q));
        const matchesLookingFor = (founder.founderLookingFor || []).some(l => l.toLowerCase().includes(q));
        const matchesStartup = startup
          ? startup.name.toLowerCase().includes(q) ||
            startup.industry.toLowerCase().includes(q) ||
            startup.tagline.toLowerCase().includes(q)
          : false;

        if (
          !matchesName &&
          !matchesTitle &&
          !matchesCompany &&
          !matchesBio &&
          !matchesLocation &&
          !matchesSkills &&
          !matchesLookingFor &&
          !matchesStartup
        ) {
          return false;
        }
      }

      // Industry filter (via associated startup)
      if (selectedIndustry !== 'All') {
        const startup = startups.find(s => s.id === founder.startupId);
        if (!startup) return false;
        const indLower = selectedIndustry.toLowerCase();
        const startupIndLower = startup.industry.toLowerCase();
        if (!startupIndLower.includes(indLower.split(' ')[0]) && !indLower.includes(startupIndLower.split(' ')[0])) {
          return false;
        }
      }

      // Stage filter
      if (selectedStage !== 'All') {
        const startup = startups.find(s => s.id === founder.startupId);
        if (founder.founderStage !== selectedStage && startup?.stage !== selectedStage) {
          return false;
        }
      }

      // Synergy / Looking For filter
      if (selectedSynergy !== 'All') {
        const lookingFor = founder.founderLookingFor || [];
        const hasMatch = lookingFor.some(tag =>
          tag.toLowerCase().includes(selectedSynergy.toLowerCase().split(' ')[0])
        );
        if (!hasMatch) return false;
      }

      // Location filter
      if (selectedLocation !== 'All') {
        const loc = (founder.location || '').toLowerCase();
        if (selectedLocation === 'United States' && !loc.includes('usa') && !loc.includes('ca') && !loc.includes('tx') && !loc.includes('ny') && !loc.includes('ma')) {
          return false;
        }
        if (selectedLocation === 'Europe' && !loc.includes('uk') && !loc.includes('sweden') && !loc.includes('zurich') && !loc.includes('ch') && !loc.includes('london')) {
          return false;
        }
        if (selectedLocation === 'Asia / MENA' && !loc.includes('india') && !loc.includes('dubai') && !loc.includes('uae') && !loc.includes('bengaluru')) {
          return false;
        }
        if (selectedLocation === 'Remote' && !loc.includes('remote')) {
          return false;
        }
      }

      // Verified
      if (verifiedOnly && !founder.isVerified) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'raised') {
        const stA = startups.find(s => s.id === a.startupId)?.fundingRaised || 0;
        const stB = startups.find(s => s.id === b.startupId)?.fundingRaised || 0;
        return stB - stA;
      }
      return new Date(b.joinedDate || '').getTime() - new Date(a.joinedDate || '').getTime();
    });

  // Filter Startups list
  const filteredStartups = startups
    .filter(s => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesTagline = s.tagline.toLowerCase().includes(q);
        const matchesIndustry = s.industry.toLowerCase().includes(q);
        const matchesFounder = s.founderName.toLowerCase().includes(q);
        const matchesTags = s.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesIndustry && !matchesFounder && !matchesTags) {
          return false;
        }
      }

      // Industry
      if (selectedIndustry !== 'All' && s.industry !== selectedIndustry) return false;

      // Stage
      if (selectedStage !== 'All' && s.stage !== selectedStage) return false;

      // Business Model
      if (selectedModel !== 'All' && s.businessModel !== selectedModel) return false;

      // Verified
      if (verifiedOnly && !s.isVerified) return false;

      // Featured
      if (featuredOnly && !s.isFeatured) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'raised') return b.fundingRaised - a.fundingRaised;
      if (sortBy === 'goal') return b.fundingGoal - a.fundingGoal;
      if (sortBy === 'growth') return (b.growthRatePercent || 0) - (a.growthRatePercent || 0);
      if (sortBy === 'views') return b.viewsCount - a.viewsCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setSelectedStage('All');
    setSelectedSynergy('All');
    setSelectedLocation('All');
    setSelectedModel('All');
    setVerifiedOnly(false);
    setFeaturedOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedIndustry !== 'All' ||
    selectedStage !== 'All' ||
    selectedSynergy !== 'All' ||
    selectedLocation !== 'All' ||
    selectedModel !== 'All' ||
    verifiedOnly ||
    featuredOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              {exploreTab === 'founders' ? 'FOUNDER SYNERGY NETWORK' : 'VENTURE DEALFLOW DIRECTORY'}
            </span>
            <span className="text-xs text-slate-400">
              {exploreTab === 'founders'
                ? `${filteredFounders.length} Verified Founders`
                : `${filteredStartups.length} Startups`}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {exploreTab === 'founders'
              ? 'Explore Founders & Peer Synergies'
              : 'Startup Dealflow & Ecosystem Directory'}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {exploreTab === 'founders'
              ? 'Connect directly with visionary founders across AI, DeepTech, CleanTech, and BioTech. Pitch joint ventures, technical integrations, and strategic alliances.'
              : 'Discover vetted high-growth startups, review pitch decks and milestones, and participate in syndicate allocations.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 flex items-center p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 self-start md:self-center shrink-0">
          <button
            onClick={() => setExploreTab('founders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              exploreTab === 'founders'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>Explore Founders</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {foundersList.length}
            </span>
          </button>

          <button
            onClick={() => setExploreTab('startups')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              exploreTab === 'startups'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-300" />
            <span>Explore Startups</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {startups.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                exploreTab === 'founders'
                  ? 'Search founders by name, startup, bio, skills, synergy tags, location...'
                  : 'Search startups by name, tagline, industry, founder, tech stack...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Industry Filter Dropdown */}
          <div className="w-full md:w-48 shrink-0">
            <select
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Industries</option>
              {industries.filter(i => i !== 'All').map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Stage Filter Dropdown */}
          <div className="w-full md:w-36 shrink-0">
            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Stages</option>
              {stages.filter(s => s !== 'All').map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          {/* Synergy Filter (For Founders Mode) */}
          {exploreTab === 'founders' && (
            <div className="w-full md:w-48 shrink-0">
              <select
                value={selectedSynergy}
                onChange={e => setSelectedSynergy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="All">All Synergy Types</option>
                {synergies.filter(s => s !== 'All').map(syn => (
                  <option key={syn} value={syn}>{syn}</option>
                ))}
              </select>
            </div>
          )}

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Secondary Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filters:
            </span>

            {/* Verified Only Pill */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                verifiedOnly
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Verified Only</span>
            </button>

            {/* Region Filter for Founders */}
            {exploreTab === 'founders' && (
              <div className="flex items-center gap-1">
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                      selectedLocation === loc
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="raised">Highest Capital Raised</option>
              <option value="recent">Recently Joined</option>
              {exploreTab === 'startups' && (
                <>
                  <option value="goal">Funding Target</option>
                  <option value="views">Most Viewed</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* FOUNDERS DIRECTORY VIEW */}
      {exploreTab === 'founders' && (
        <>
          {filteredFounders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFounders.map(founder => (
                <FounderCard
                  key={founder.id}
                  founder={founder}
                  onPitch={f => setPitchFounderModalTarget(f)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Founders Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No founder profiles matched your active filters. Try adjusting your search query or industry selection.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* STARTUPS DIRECTORY VIEW */}
      {exploreTab === 'startups' && (
        <>
          {filteredStartups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map(startup => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Startups Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No startup profiles matched your active filters. Try broadening your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Global Pitch to Founder Modal */}
      <PitchToFounderModal
        isOpen={!!pitchFounderModalTarget}
        targetFounder={pitchFounderModalTarget}
        onClose={() => setPitchFounderModalTarget(null)}
      />
    </div>
  );
};
