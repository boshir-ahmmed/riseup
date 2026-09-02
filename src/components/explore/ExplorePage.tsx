import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StartupCard } from '../startup/StartupCard';
import { FounderCard } from './FounderCard';
import { InvestorCard } from './InvestorCard';
import { PitchToFounderModal } from '../modals/PitchToFounderModal';
import { PitchToInvestorModal } from '../startup/PitchToInvestorModal';
import { User } from '../../types';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  X,
  Users,
  Zap,
  ShieldCheck,
  Briefcase,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  Rocket
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
    setActiveView,
    startConversationWithUser
  } = useApp();

  // Search and general filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedSynergy, setSelectedSynergy] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedTicketSize, setSelectedTicketSize] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [raisingOnly, setRaisingOnly] = useState(false);
  const [seekingCoFounderOnly, setSeekingCoFounderOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'raised' | 'recent' | 'name' | 'completion'>('raised');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal target for pitching an investor
  const [pitchInvestorTarget, setPitchInvestorTarget] = useState<User | null>(null);

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

  const ticketSizes = ['All', '< $500k', '$500k - $2M', '$2M+'];

  // Base directory collections
  const foundersList = users.filter(u => u.role === 'founder');
  const investorsList = users.filter(u => u.role === 'investor');

  // Filter Founders list
  const filteredFounders = foundersList
    .filter(founder => {
      const startup = startups.find(s => s.id === founder.startupId);

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
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

      // Industry filter (via associated startup or skills)
      if (selectedIndustry !== 'All') {
        const indLower = selectedIndustry.toLowerCase();
        const startupMatch = startup && startup.industry.toLowerCase().includes(indLower.split(' ')[0]);
        const skillMatch = (founder.skills || []).some(sk => sk.toLowerCase().includes(indLower.split(' ')[0]));
        if (!startupMatch && !skillMatch) return false;
      }

      // Stage filter
      if (selectedStage !== 'All') {
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
        if (selectedLocation === 'Europe' && !loc.includes('uk') && !loc.includes('sweden') && !loc.includes('zurich') && !loc.includes('ch') && !loc.includes('france') && !loc.includes('paris') && !loc.includes('london')) {
          return false;
        }
        if (selectedLocation === 'Asia / MENA' && !loc.includes('india') && !loc.includes('dubai') && !loc.includes('uae') && !loc.includes('bengaluru') && !loc.includes('tokyo') && !loc.includes('singapore')) {
          return false;
        }
        if (selectedLocation === 'Remote' && !loc.includes('remote')) {
          return false;
        }
      }

      // Verified Only
      if (verifiedOnly && !founder.isVerified) return false;

      // Actively Raising Only
      if (raisingOnly) {
        if (!startup || startup.fundingRaised >= startup.fundingGoal) return false;
      }

      // Seeking Co-Founder / Team
      if (seekingCoFounderOnly) {
        const lookingFor = founder.founderLookingFor || [];
        const matchesCoFounder = lookingFor.some(t =>
          t.toLowerCase().includes('co-founder') || t.toLowerCase().includes('team') || t.toLowerCase().includes('gtm')
        );
        if (!matchesCoFounder) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'raised') {
        const stA = startups.find(s => s.id === a.startupId)?.fundingRaised || 0;
        const stB = startups.find(s => s.id === b.startupId)?.fundingRaised || 0;
        return stB - stA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'completion') {
        return (b.profileCompletion || 0) - (a.profileCompletion || 0);
      }
      return new Date(b.joinedDate || '').getTime() - new Date(a.joinedDate || '').getTime();
    });

  // Filter Investors list
  const filteredInvestors = investorsList
    .filter(investor => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = investor.name.toLowerCase().includes(q);
        const matchesTitle = (investor.title || '').toLowerCase().includes(q);
        const matchesCompany = (investor.company || '').toLowerCase().includes(q);
        const matchesBio = (investor.bio || '').toLowerCase().includes(q);
        const matchesLocation = (investor.location || '').toLowerCase().includes(q);
        const matchesInterests = (investor.investmentInterests || []).some(i => i.toLowerCase().includes(q));
        const matchesIndustries = (investor.preferredIndustries || []).some(i => i.toLowerCase().includes(q));

        if (!matchesName && !matchesTitle && !matchesCompany && !matchesBio && !matchesLocation && !matchesInterests && !matchesIndustries) {
          return false;
        }
      }

      // Industry / Sector filter
      if (selectedIndustry !== 'All') {
        const indLower = selectedIndustry.toLowerCase().split(' ')[0];
        const allInterests = [...(investor.preferredIndustries || []), ...(investor.investmentInterests || [])];
        const hasMatch = allInterests.some(i => i.toLowerCase().includes(indLower));
        if (!hasMatch) return false;
      }

      // Stage filter
      if (selectedStage !== 'All') {
        const stagesPref = investor.preferredStages || [];
        if (!stagesPref.includes(selectedStage as any)) return false;
      }

      // Ticket size filter
      if (selectedTicketSize !== 'All') {
        const maxCheck = investor.investmentRange?.max || 1000000;
        if (selectedTicketSize === '< $500k' && maxCheck > 500000) return false;
        if (selectedTicketSize === '$500k - $2M' && (maxCheck < 500000 || maxCheck > 2500000)) return false;
        if (selectedTicketSize === '$2M+' && maxCheck < 2000000) return false;
      }

      // Location filter
      if (selectedLocation !== 'All') {
        const loc = (investor.location || '').toLowerCase();
        if (selectedLocation === 'United States' && !loc.includes('usa') && !loc.includes('ca') && !loc.includes('ny') && !loc.includes('san francisco')) return false;
        if (selectedLocation === 'Europe' && !loc.includes('france') && !loc.includes('paris') && !loc.includes('london') && !loc.includes('uk')) return false;
        if (selectedLocation === 'Asia / MENA' && !loc.includes('nairobi') && !loc.includes('kenya') && !loc.includes('dubai')) return false;
        if (selectedLocation === 'Remote' && !loc.includes('remote')) return false;
      }

      // Verified
      if (verifiedOnly && !investor.isVerified) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      const dealsA = a.portfolioCount || 0;
      const dealsB = b.portfolioCount || 0;
      return dealsB - dealsA;
    });

  // Filter Startups list
  const filteredStartups = startups
    .filter(s => {
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
      if (selectedIndustry !== 'All' && s.industry !== selectedIndustry) return false;
      if (selectedStage !== 'All' && s.stage !== selectedStage) return false;
      if (verifiedOnly && !s.isVerified) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'raised') return b.fundingRaised - a.fundingRaised;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setSelectedStage('All');
    setSelectedSynergy('All');
    setSelectedLocation('All');
    setSelectedTicketSize('All');
    setVerifiedOnly(false);
    setRaisingOnly(false);
    setSeekingCoFounderOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedIndustry !== 'All' ||
    selectedStage !== 'All' ||
    selectedSynergy !== 'All' ||
    selectedLocation !== 'All' ||
    selectedTicketSize !== 'All' ||
    verifiedOnly ||
    raisingOnly ||
    seekingCoFounderOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              {exploreTab === 'founders'
                ? 'FOUNDER SYNERGY & PEER NETWORK'
                : exploreTab === 'investors'
                ? 'VENTURE CAPITAL & INVESTORS'
                : 'STARTUP DEALFLOW DIRECTORY'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {exploreTab === 'founders'
                ? `${filteredFounders.length} Verified Founders`
                : exploreTab === 'investors'
                ? `${filteredInvestors.length} Active Investors`
                : `${filteredStartups.length} Startups`}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {exploreTab === 'founders'
              ? 'Explore Founders & Peer Synergies'
              : exploreTab === 'investors'
              ? 'Explore Investors & Backers'
              : 'Startup Dealflow & Ecosystem Directory'}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {exploreTab === 'founders'
              ? 'Connect directly with fellow founders across AI, DeepTech, CleanTech, and BioTech. Filter by stage, domain, and synergy goals to pitch joint ventures, partnerships, and technical alliances.'
              : exploreTab === 'investors'
              ? 'Discover vetted early-stage VCs, angel investors, and fund leads. Review ticket sizes and sector focus, then pitch your startup deck directly.'
              : 'Discover vetted high-growth startups, review pitch decks and milestones, and participate in syndicate allocations.'}
          </p>
        </div>

        {/* 3-Way Tab Switcher */}
        <div className="relative z-10 flex flex-wrap items-center p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 self-start md:self-center shrink-0 gap-1">
          {/* Explore Founders Tab */}
          <button
            id="tab-explore-founders"
            onClick={() => setExploreTab('founders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              exploreTab === 'founders'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>Founders</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {foundersList.length}
            </span>
          </button>

          {/* Explore Investors Tab */}
          <button
            id="tab-explore-investors"
            onClick={() => setExploreTab('investors')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              exploreTab === 'investors'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-300" />
            <span>Investors</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {investorsList.length}
            </span>
          </button>

          {/* Explore Startups Tab */}
          <button
            id="tab-explore-startups"
            onClick={() => setExploreTab('startups')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              exploreTab === 'startups'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-300" />
            <span>Startups</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {startups.length}
            </span>
          </button>
        </div>
      </div>

      {/* Comprehensive Filter & Search Suite */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Primary Search and Dropdown Filter Row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="explore-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                exploreTab === 'founders'
                  ? 'Search founders by name, startup, bio, skills, synergy tags, location...'
                  : exploreTab === 'investors'
                  ? 'Search investors by name, firm, investment thesis, sector interests, location...'
                  : 'Search startups by name, tagline, industry, founder, tech stack...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Industry Filter Dropdown */}
          <div className="w-full md:w-48 shrink-0">
            <select
              id="filter-industry-select"
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
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
              id="filter-stage-select"
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
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
                id="filter-synergy-select"
                value={selectedSynergy}
                onChange={e => setSelectedSynergy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All Synergy Types</option>
                {synergies.filter(s => s !== 'All').map(syn => (
                  <option key={syn} value={syn}>{syn}</option>
                ))}
              </select>
            </div>
          )}

          {/* Ticket Size Filter (For Investors Mode) */}
          {exploreTab === 'investors' && (
            <div className="w-full md:w-40 shrink-0">
              <select
                id="filter-ticket-size-select"
                value={selectedTicketSize}
                onChange={e => setSelectedTicketSize(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="All">Check Size</option>
                {ticketSizes.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Secondary Quick Filter Pills & Location Selection */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filters:
            </span>

            {/* Verified Only Toggle */}
            <button
              id="filter-verified-toggle"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                verifiedOnly
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Verified Only</span>
            </button>

            {/* Founder-specific Quick Filters */}
            {exploreTab === 'founders' && (
              <>
                <button
                  id="filter-fundraising-toggle"
                  onClick={() => setRaisingOnly(!raisingOnly)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                    raisingOnly
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Actively Fundraising</span>
                </button>

                <button
                  id="filter-cofounder-toggle"
                  onClick={() => setSeekingCoFounderOnly(!seekingCoFounderOnly)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                    seekingCoFounderOnly
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Seeking Co-Founders</span>
                </button>
              </>
            )}

            {/* Region / Location Filter Buttons */}
            <div className="flex items-center gap-1 ml-1 pl-2 border-l border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Region:</span>
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    selectedLocation === loc
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Layout Controls */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle (For Founders) */}
            {exploreTab === 'founders' && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded-md transition cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1 rounded-md transition cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Table / List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">Sort:</span>
              <select
                id="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="raised">Highest Capital Raised</option>
                <option value="recent">Recently Joined</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="completion">Profile Completion</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px]">
            <span className="text-slate-400 font-medium">Active:</span>
            {selectedIndustry !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 font-semibold">
                Industry: {selectedIndustry}
                <button onClick={() => setSelectedIndustry('All')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedStage !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 font-semibold">
                Stage: {selectedStage}
                <button onClick={() => setSelectedStage('All')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSynergy !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-semibold">
                Synergy: {selectedSynergy}
                <button onClick={() => setSelectedSynergy('All')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedLocation !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                Location: {selectedLocation}
                <button onClick={() => setSelectedLocation('All')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-semibold">
                Verified Only
                <button onClick={() => setVerifiedOnly(false)} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {raisingOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-semibold">
                Actively Fundraising
                <button onClick={() => setRaisingOnly(false)} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {seekingCoFounderOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-semibold">
                Seeking Co-Founders
                <button onClick={() => setSeekingCoFounderOnly(false)} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 1. FOUNDERS DIRECTORY VIEW (Requested: Founders list with filter) */}
      {/* ============================================================ */}
      {exploreTab === 'founders' && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>Verified Founders Directory</span>
              <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                {filteredFounders.length} {filteredFounders.length === 1 ? 'Founder' : 'Founders'}
              </span>
            </h2>
          </div>

          {filteredFounders.length > 0 ? (
            viewMode === 'grid' ? (
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
              /* Compact Table / List View */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Founder</th>
                        <th className="px-4 py-3">Startup & Industry</th>
                        <th className="px-4 py-3">Stage & Capital Raised</th>
                        <th className="px-4 py-3">Synergies & Looking For</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredFounders.map(founder => {
                        const associatedStartup = startups.find(s => s.id === founder.startupId);
                        const isMe = currentUser.id === founder.id;

                        return (
                          <tr key={founder.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition">
                            {/* Founder Info */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={founder.avatar}
                                  alt={founder.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedUserId(founder.id);
                                        setActiveView('profile');
                                      }}
                                      className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate text-left cursor-pointer"
                                    >
                                      {founder.name}
                                    </button>
                                    {founder.isVerified && (
                                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    {founder.title || `Founder at ${founder.company || 'Venture'}`}
                                  </p>
                                  {founder.location && (
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-2.5 h-2.5" />
                                      <span>{founder.location}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Startup & Industry */}
                            <td className="px-4 py-3.5">
                              {associatedStartup ? (
                                <button
                                  onClick={() => {
                                    setSelectedStartupId(associatedStartup.id);
                                    setActiveView('startup-details');
                                  }}
                                  className="text-left group cursor-pointer"
                                >
                                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition flex items-center gap-1">
                                    {associatedStartup.name}
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                                  </span>
                                  <span className="text-[11px] text-slate-500 block mt-0.5">
                                    {associatedStartup.industry}
                                  </span>
                                </button>
                              ) : (
                                <span className="text-slate-400 italic">Stealth Venture</span>
                              )}
                            </td>

                            {/* Stage & Capital */}
                            <td className="px-4 py-3.5">
                              {associatedStartup ? (
                                <div>
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                                    {associatedStartup.stage}
                                  </span>
                                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs mt-1">
                                    ${(associatedStartup.fundingRaised / 1000).toFixed(0)}k raised
                                  </p>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>

                            {/* Synergy Tags */}
                            <td className="px-4 py-3.5 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {(founder.founderLookingFor || ['Peer Review', 'Tech Alliance']).slice(0, 2).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 text-[10px] rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-semibold"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!isMe && (
                                  <button
                                    onClick={() => startConversationWithUser(founder)}
                                    title="Send Message"
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {!isMe ? (
                                  <button
                                    onClick={() => setPitchFounderModalTarget(founder)}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  >
                                    <Zap className="w-3 h-3 text-amber-300" />
                                    <span>Pitch</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400">You</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Founders Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No founder profiles matched your active filters. Try adjusting your search query, industry, or synergy selection.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 2. INVESTORS DIRECTORY VIEW (Improvised: Explore Investors) */}
      {/* ============================================================ */}
      {exploreTab === 'investors' && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>Active Venture Capital & Angel Directory</span>
              <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                {filteredInvestors.length} {filteredInvestors.length === 1 ? 'Investor' : 'Investors'}
              </span>
            </h2>
          </div>

          {filteredInvestors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  onPitch={inv => setPitchInvestorTarget(inv)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Investors Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No investors matched your active filters. Try broadening your sector focus or check size range.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 3. STARTUPS DIRECTORY VIEW */}
      {/* ============================================================ */}
      {exploreTab === 'startups' && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>Vetted Startup Dealflow</span>
              <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                {filteredStartups.length} Startups
              </span>
            </h2>
          </div>

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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
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

      {/* Pitch to Investor Modal */}
      <PitchToInvestorModal
        isOpen={!!pitchInvestorTarget}
        targetInvestor={pitchInvestorTarget}
        onClose={() => setPitchInvestorTarget(null)}
      />
    </div>
  );
};
