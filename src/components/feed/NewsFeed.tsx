import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostCard } from './PostCard';
import { RoleBadge } from '../layout/RoleBadge';
import { PostType } from '../../types';
import {
  Sparkles,
  Award,
  DollarSign,
  Users,
  Rocket,
  PlusCircle,
  TrendingUp,
  Briefcase,
  Star,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Building2
} from 'lucide-react';

interface NewsFeedProps {
  onOpenCreatePost: () => void;
  onOpenCreateStartup: () => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  onOpenCreatePost,
  onOpenCreateStartup
}) => {
  const {
    posts,
    startups,
    users,
    currentUser,
    setSelectedStartupId,
    setActiveView,
    setSelectedUserId
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<PostType>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = posts.filter(p => {
    if (activeFilter !== 'all' && p.type !== activeFilter) return false;
    if (selectedTag && !p.tags?.includes(selectedTag)) return false;
    return true;
  });

  const trendingStartups = startups.slice(0, 4);
  const featuredInvestors = users.filter(u => u.role === 'investor').slice(0, 3);
  const topMentors = users.filter(u => u.role === 'mentor').slice(0, 3);
  const myStartup = startups.find(s => s.id === currentUser.startupId);

  const filterTabs: { id: PostType; label: string; icon: any }[] = [
    { id: 'all', label: 'All Feed', icon: Sparkles },
    { id: 'milestone', label: 'Milestones', icon: Award },
    { id: 'funding_update', label: 'Funding Rounds', icon: DollarSign },
    { id: 'product_update', label: 'Product Releases', icon: Rocket },
    { id: 'hiring', label: 'Hiring', icon: Users }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Profile & Quick Hub */}
        <aside className="lg:col-span-3 space-y-5">
          {/* User Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                />
                {currentUser.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 absolute bottom-0 right-0 bg-white dark:bg-slate-900 rounded-full" />
                )}
              </div>

              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 px-2">
                {currentUser.title}
              </p>

              <div className="mt-2.5">
                <RoleBadge role={currentUser.role} isVerified={currentUser.isVerified} size="sm" />
              </div>

              {/* Startup Link for Founder */}
              {currentUser.role === 'founder' && myStartup ? (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full text-left">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-medium">My Startup</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {myStartup.stage}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStartupId(myStartup.id);
                      setActiveView('startup-details');
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700/60 transition group cursor-pointer"
                  >
                    <img
                      src={myStartup.logo}
                      alt={myStartup.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {myStartup.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        ${(myStartup.fundingRaised / 1000000).toFixed(1)}M / ${(myStartup.fundingGoal / 1000000).toFixed(1)}M Raised
                      </p>
                    </div>
                  </button>
                </div>
              ) : currentUser.role === 'investor' ? (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full text-left">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Investment Focus</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentUser.investmentInterests?.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : currentUser.role === 'mentor' ? (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full text-left">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Mentorship Status</span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {currentUser.mentorRating || 4.9}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-900/40">
                    {currentUser.mentorAvailability}
                  </p>
                </div>
              ) : null}

              {/* View Profile Action */}
              <button
                onClick={() => setActiveView('profile')}
                className="mt-4 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
              >
                View Full Profile
              </button>
            </div>
          </div>

          {/* Quick Ecosystem Navigation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveView('explore')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>Explore Dealflow</span>
              </div>
              <span className="text-[11px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                {startups.length}
              </span>
            </button>

            <button
              onClick={() => {
                if (currentUser.role === 'founder') setActiveView('founder-dashboard');
                else if (currentUser.role === 'investor') setActiveView('investor-dashboard');
                else if (currentUser.role === 'mentor') setActiveView('mentor-dashboard');
                else setActiveView('admin-dashboard');
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition"
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>
                {currentUser.role === 'founder'
                  ? 'Founder Management Hub'
                  : currentUser.role === 'investor'
                  ? 'Investor Pipeline Hub'
                  : currentUser.role === 'mentor'
                  ? 'Mentor Advisory Workspace'
                  : 'System Admin Panel'}
              </span>
            </button>

            <button
              onClick={() => setActiveView('messages')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition"
            >
              <Users className="w-4 h-4 text-amber-500" />
              <span>Direct Founder/Investor Chat</span>
            </button>
          </div>

          {/* Quick Launch Callout */}
          {currentUser.role === 'founder' && !myStartup && (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-4 text-white shadow-md">
              <h4 className="font-bold text-sm mb-1">Launch Your Startup</h4>
              <p className="text-xs text-indigo-100 leading-relaxed mb-3">
                List your pitch deck, team members, and funding goals to connect with verified investors & mentors.
              </p>
              <button
                onClick={onOpenCreateStartup}
                className="w-full py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow-xs transition"
              >
                Create Startup Profile
              </button>
            </div>
          )}
        </aside>

        {/* Center Column: Main News Stream */}
        <main className="lg:col-span-6 space-y-5">
          {/* Post Composer Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <button
                id="feed-open-composer-input"
                onClick={onOpenCreatePost}
                className="flex-1 text-left px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-150 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 rounded-full transition cursor-pointer"
              >
                Share a milestone, funding round, product release, or hiring update...
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                <button
                  onClick={onOpenCreatePost}
                  className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 px-2.5 py-1 rounded-lg transition font-medium"
                >
                  <Award className="w-4 h-4" />
                  <span>Milestone</span>
                </button>

                <button
                  onClick={onOpenCreatePost}
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-2.5 py-1 rounded-lg transition font-medium"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Funding</span>
                </button>

                <button
                  onClick={onOpenCreatePost}
                  className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-2.5 py-1 rounded-lg transition font-medium"
                >
                  <Users className="w-4 h-4" />
                  <span>Hiring</span>
                </button>
              </div>

              <button
                onClick={onOpenCreatePost}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>

          {/* Feed Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {filterTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setSelectedTag(null);
                  }}
                  className={`px-3 py-1.5 rounded-full font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tag Filter indicator */}
          {selectedTag && (
            <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800/50 text-xs text-indigo-800 dark:text-indigo-200">
              <span>
                Showing posts tagged with <strong>{selectedTag}</strong>
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="font-bold hover:underline"
              >
                Clear Tag
              </button>
            </div>
          )}

          {/* Post Stream */}
          <div className="space-y-5">
            {filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  No posts in this category yet
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Be the first founder to publish a milestone or announcement to the RiseUp startup network!
                </p>
                <button
                  onClick={onOpenCreatePost}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Create New Post
                </button>
              </div>
            ) : (
              filteredPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </main>

        {/* Right Column: Network Growth & Trending Startups */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Network Growth Metric Card */}
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-indigo-100 text-[11px] font-semibold uppercase tracking-wider">Your Network Growth</p>
              <h4 className="text-3xl font-extrabold mt-1 tracking-tight">+248%</h4>
              <p className="text-xs text-indigo-100 mt-1">Since joining RiseUp ecosystem</p>
              <div className="mt-3.5 flex gap-2">
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4 rounded-full"></div>
                </div>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-1/2 rounded-full"></div>
                </div>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-5/6 rounded-full"></div>
                </div>
              </div>
            </div>
            <TrendingUp className="absolute -right-4 -bottom-4 w-28 h-28 text-white/10" />
          </div>

          {/* Trending Startups Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Trending Startups
                </h3>
              </div>
              <button
                onClick={() => setActiveView('explore')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {trendingStartups.map(startup => (
                <div
                  key={startup.id}
                  id={`trending-startup-${startup.id}`}
                  onClick={() => {
                    setSelectedStartupId(startup.id);
                    setActiveView('startup-details');
                  }}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={startup.logo}
                      alt={startup.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {startup.name}
                        </h4>
                        {startup.isVerified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-700 dark:text-blue-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {startup.industry} • {startup.stage}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded-md">
                    <span>Raised: <strong className="text-slate-800 dark:text-slate-200">${(startup.fundingRaised / 1000000).toFixed(1)}M</strong></span>
                    <span className="text-emerald-600 font-bold">+{startup.growthRatePercent || 25}% MoM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Investors Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Active Investors
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {featuredInvestors.map(inv => (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedUserId(inv.id);
                    setActiveView('profile');
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <img
                    src={inv.avatar}
                    alt={inv.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {inv.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {inv.company || 'Venture Partner'} • ${(inv.investmentRange?.min || 100000) / 1000}k+
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Mentors Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Top Advisors & Mentors
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {topMentors.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedUserId(m.id);
                    setActiveView('profile');
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {m.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {m.title}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                    ★ {m.mentorRating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Global Pitch Summit Event Promo Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white border border-indigo-500/30 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Ecosystem Demo Day</span>
            </div>
            <h4 className="font-extrabold text-sm mb-1.5 text-white">
              RiseUp Global Pitch Summit 2025
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              50 selected Seed/Series A startups pitching live to 200+ tier-1 venture funds and institutional angels.
            </p>
            <button
              onClick={() => setActiveView('explore')}
              className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>Explore Participating Startups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
