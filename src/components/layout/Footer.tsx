import React from 'react';
import { useApp } from '../../context/AppContext';
import { Rocket, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, switchRole } = useApp();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                RiseUp
              </span>
            </div>
            <p className="leading-relaxed">
              Connecting Startups with Opportunities. The premier ecosystem for founders, investors, mentors, and innovators.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Ecosystem Hubs
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveView('explore')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Explore Dealflow
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('feed')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Milestone Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('messages')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Direct Messaging
                </button>
              </li>
            </ul>
          </div>

         

          {/* Col 4: Legal & Guidelines */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Information
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  About RiseUp
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('features')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Platform Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('help')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('terms')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Privacy & Terms
                </button>
              </li>
            </ul>
          </div>
        </div>


   {/* Col 4: Legal & Guidelines */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Information
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  About RiseUp
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('features')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Platform Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('help')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('terms')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Privacy & Terms
                </button>
              </li>
            </ul>
          </div>
        </div>
        

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© 2025 RiseUp Startup Ecosystem. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
            <span>Zero-transaction professional networking architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
