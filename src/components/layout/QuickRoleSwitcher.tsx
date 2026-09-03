import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Sparkles, Briefcase, Award, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useApp();

  const roles: { role: UserRole; name: string; title: string; desc: string; icon: any; color: string }[] = [
    {
      role: 'founder',
      name: 'Sarah Chen',
      title: 'Founder (NeuroPulse AI)',
      desc: 'Manages 1 startup, pitch deck, posts, investor & mentor requests',
      icon: Sparkles,
      color: 'hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
    },
    {
      role: 'investor',
      name: 'Marcus Vance',
      title: 'Investor (Apex Ventures)',
      desc: 'Browse dealflow, express interest, join startups, message founders',
      icon: Briefcase,
      color: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
    },
    {
      role: 'mentor',
      name: 'Dr. Elena Rostova',
      title: 'Mentor (Ex-VP Stripe)',
      desc: '1 active startup rule, provide reviews, advice notes, schedule sessions',
      icon: Award,
      color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400'
    },
   
  ];

  return (
    <div
      id="quick-demo-role-switcher"
      className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800 px-4 py-2 text-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide text-slate-200 uppercase text-[11px]">
            Live Demo Persona Switcher:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Switch instant roles to test role-specific workflows & rules
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {roles.map(r => {
            const isActive = currentUser.role === r.role;
            const Icon = r.icon;
            return (
              <button
                key={r.role}
                id={`switch-to-${r.role}`}
                onClick={() => switchRole(r.role)}
                title={r.desc}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs ring-1 ring-white/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.role.toUpperCase()}</span>
                {isActive && <UserCheck className="w-3 h-3 text-emerald-300 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
