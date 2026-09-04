import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Award,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  ArrowRight,
  Target,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          The Professional Startup Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering the Next Generation of Global Ventures
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          RiseUp is the dedicated professional ecosystem combining the social connectivity of LinkedIn with the deep venture data of AngelList & Crunchbase — designed solely for startups, investors, and expert mentors.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            1-to-1 Founder Focus
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Founders represent their primary venture, showcasing audited milestones, cap table goals, and real-time traction transparently.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Unbounded Investor Syndication
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Verified angel syndicates and venture capitalists discover pre-screened dealflow and express direct ticket interests without intermediation.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            High-Impact Mentorship
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            To prevent dilution of advice, mentors actively guide one startup at a time, providing hands-on strategic counsel on product and scaling.
          </p>
        </div>
      </div>
    </div>
  );
};

export const FeaturesPage: React.FC = () => {
  const { setActiveView } = useApp();

  const features = [
    {
      title: 'Interactive Startup Profile & Data Room',
      desc: 'Showcase your Problem, Solution, Pitch Deck, Team Bios, MRR Trajectory, and Milestones Roadmap in one unified AngelList-grade deal profile.',
      icon: Building2,
      role: 'Founders'
    },
    {
      title: 'Real-time Milestone News Feed',
      desc: 'Broadcast funding updates, product releases, hires, and traction metrics to an active network of thousands of vetted startup operators.',
      icon: Sparkles,
      role: 'All Members'
    },
    {
      title: 'Venture Pipeline & Check Allocation Hub',
      desc: 'Track opportunities in diligence, filter by sector/stage/model, review confidential pitch materials, and express non-binding investment interest.',
      icon: DollarSign,
      role: 'Investors'
    },
    {
      title: '1-to-1 Advisory Workspace',
      desc: 'Maintain bi-weekly meeting logs, track milestone action items, and guide high-growth founding teams to Series A graduation.',
      icon: Award,
      role: 'Mentors'
    },
    {
      title: 'Direct Messaging & Real-Time Chat',
      desc: 'Seamless 1-to-1 direct messaging between founders, investors, and mentors with instant delivery and clean conversation management.',
      icon: Users,
      role: 'All Members'
    },
    {
      title: 'Ecosystem Governance & Verification Badges',
      desc: 'Super Admin moderation with automated compliance audits ensuring high-caliber listings and zero fraudulent transactions.',
      icon: ShieldCheck,
      role: 'Admins'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Architecture & Core Features
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Engineered to accelerate startup execution, capital formation, and strategic collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {f.role}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HelpCenterPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does RiseUp process financial transactions or investments directly?',
      a: 'No. RiseUp is strictly a professional ecosystem and discovery platform for founders, investors, and mentors. All legal agreements, due diligence, and financial closings occur outside the platform.'
    },
    {
      q: 'Why can a mentor only actively mentor ONE startup at a time?',
      a: 'To maintain exceptional quality of advice and real commitment, mentors are restricted to one active advisory role. Once the startup hits its key milestones, the mentorship concludes, allowing the mentor to advise a new startup.'
    },
    {
      q: 'Can investors join and track multiple startups?',
      a: 'Yes! Investors and angel syndicates can express interest, join multiple startup rounds, and build a diversified portfolio.'
    },
    {
      q: 'How does a startup earn the blue Verified Badge?',
      a: 'Admins verify founder identity, legal entity status, and pitch deck materials before granting the official Verified Badge.'
    },
    {
      q: 'How do I switch roles for testing or exploring?',
      a: 'Use the floating Quick Role Switcher in the top navigation bar to toggle between Founder, Investor, Mentor, and Admin roles instantly!'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Help Center & Ecosystem FAQs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about the RiseUp platform rules, roles, and features.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="p-5">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PrivacyTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-slate-500">Last updated: May 2025</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6">
        <div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
            1. Ecosystem Overview
          </h2>
          <p>
            RiseUp provides an enterprise-grade platform connecting founders, verified venture investors, and startup mentors. RiseUp is not a broker-dealer or crowdfunding intermediary.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
            2. Confidentiality of Pitch Materials
          </h2>
          <p>
            Pitch decks and cap table metrics shared by founders remain the proprietary intellectual property of the respective startup. Members agree to review data room materials in good faith.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
            3. Non-binding Connection Terms
          </h2>
          <p>
            Expressions of investor interest and check sizes entered on the platform represent non-binding interest intended to facilitate direct conversations and due diligence.
          </p>
        </div>
      </div>
    </div>
  );
};
