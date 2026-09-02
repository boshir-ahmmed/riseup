import React from 'react';
import { useApp } from '../../context/AppContext';
import { StartupCard } from '../startup/StartupCard';
import {
  Rocket,
  ShieldCheck,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Compass,
  Play,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { startups, switchRole, setActiveView } = useApp();

  const featuredStartups = startups.slice(0, 3);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>The Next-Gen Startup Ecosystem Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">Startups</span> with Opportunities.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The all-in-one professional ecosystem where founders publish audited milestones, investors discover high-growth dealflow, and expert advisors provide 1-to-1 mentorship.
        </p>

        {/* CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveView('explore')}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Dealflow Directory</span>
          </button>

          <button
            onClick={() => setActiveView('feed')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Live Milestone Feed</span>
          </button>
        </div>

        {/* Live Ecosystem Metrics Ribbon */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <p className="font-black text-2xl sm:text-3xl text-indigo-600 dark:text-indigo-400">
                $48.5M+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Capital Volume Listed
              </p>
            </div>
            <div>
              <p className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {startups.length}+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Vetted Startups
              </p>
            </div>
            <div>
              <p className="font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">
                120+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Active Investors
              </p>
            </div>
            <div>
              <p className="font-black text-2xl sm:text-3xl text-amber-500">
                1-to-1
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                High-Impact Mentorship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Experience Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Tailored Experiences for Every Ecosystem Role
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click any role to test drive its specialized workspace and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Founder Role */}
          <div
            onClick={() => {
              switchRole('founder');
              setActiveView('founder-dashboard');
            }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                For Founders
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Manage your startup profile, publish milestones, view traction charts, and review investor check proposals.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Launch as Founder</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Investor Role */}
          <div
            onClick={() => {
              switchRole('investor');
              setActiveView('investor-dashboard');
            }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                For Investors
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Discover pre-screened dealflow, evaluate cap table metrics, express non-binding interest, and join syndicates.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch as Investor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Mentor Role */}
          <div
            onClick={() => {
              switchRole('mentor');
              setActiveView('mentor-dashboard');
            }}
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-amber-400 transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition">
                For Mentors
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Provide dedicated 1-to-1 strategic counsel, log session deliverables, and help startups reach venture scale.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Launch as Mentor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Admin Role */}
          <div
            onClick={() => {
              switchRole('admin');
              setActiveView('admin-dashboard');
            }}
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-rose-400 transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-rose-600 transition">
                For Admins
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Governance command center to audit compliance, grant verification badges, and monitor platform health.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>Super Admin Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Startups Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Featured Trending Startups
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-growth rounds actively in progress on RiseUp
            </p>
          </div>

          <button
            onClick={() => setActiveView('explore')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStartups.map(startup => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>
    </div>
  );
};
