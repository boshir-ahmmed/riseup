import React from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  ShieldCheck,
  MapPin,
  Building2,
  Sparkles,
  Zap,
  MessageSquare,
  ArrowUpRight,
  ExternalLink,
  Users,
  Award,
  ChevronRight,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface FounderCardProps {
  founder: User;
  onPitch: (founder: User) => void;
}

export const FounderCard: React.FC<FounderCardProps> = ({ founder, onPitch }) => {
  const {
    currentUser,
    startups,
    setSelectedUserId,
    setSelectedStartupId,
    setActiveView,
    startConversationWithUser
  } = useApp();

  const associatedStartup = startups.find(s => s.id === founder.startupId);
  const isMe = currentUser.id === founder.id;

  const lookingForTags = founder.founderLookingFor || [
    'Tech & API Synergy',
    'Strategic Alliance',
    'Peer Review & Advisory',
    'Cross-Promotion'
  ];

  const skillsList = founder.skills || [
    'Product Architecture',
    'Go-To-Market Strategy',
    'Full-Stack AI',
    'Fundraising'
  ];

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Header */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500" />

      <div className="p-5 flex-1 space-y-4">
        {/* Founder Avatar & Core Bio Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={founder.avatar}
                alt={founder.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 dark:border-indigo-900/60 shadow-sm group-hover:scale-105 transition duration-200"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedUserId(founder.id);
                    setActiveView('profile');
                  }}
                  className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate text-left"
                >
                  {founder.name}
                </button>
                {founder.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-500/10 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                {founder.title || `Founder at ${founder.company || 'Venture'}`}
              </p>

              {founder.location && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{founder.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Persona Chip */}
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 uppercase tracking-wider shrink-0">
            FOUNDER
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {founder.bio || 'Building disruptive technology solutions and exploring ecosystem partnerships.'}
        </p>

        {/* Associated Startup Block */}
        {associatedStartup ? (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={associatedStartup.logo}
                alt={associatedStartup.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <button
                  onClick={() => {
                    setSelectedStartupId(associatedStartup.id);
                    setActiveView('startup-details');
                  }}
                  className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate flex items-center gap-1 text-left"
                >
                  <span className="truncate">{associatedStartup.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {associatedStartup.stage} Stage
                  </span>
                  <span>•</span>
                  <span className="truncate">{associatedStartup.industry}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                ${(associatedStartup.fundingRaised / 1000).toFixed(0)}k Raised
              </span>
              <span className="text-[10px] text-slate-400">
                Goal: ${(associatedStartup.fundingGoal / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Serial Entrepreneur • Stealth Venture</span>
          </div>
        )}

        {/* Looking For / Synergy Tags */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Looking For & Synergy Focus
          </span>
          <div className="flex flex-wrap gap-1.5">
            {lookingForTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Founder Skills / Tech Stack Chips */}
        <div>
          <div className="flex flex-wrap gap-1">
            {skillsList.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium">
                +{skillsList.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            setSelectedUserId(founder.id);
            setActiveView('profile');
          }}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1"
        >
          <span>Profile</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="flex items-center gap-2">
          {!isMe && (
            <button
              onClick={() => startConversationWithUser(founder)}
              title="Direct Message"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}

          {!isMe ? (
            <button
              onClick={() => onPitch(founder)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Pitch to Founder</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/40">
              Your Profile
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
