import React from 'react';
import {
  X,
  Database,
  Layers,
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  Award,
  Sparkles,
  GitBranch,
  Server,
  FileCode2
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="architecture-docs-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="architecture-docs-modal-content"
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                RiseUp Platform Architecture & ER Data Model
              </h3>
              <p className="text-xs text-slate-500">
                Specification of Ecosystem Schemas, User Constraints & Security Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Section 1: Architectural Philosophy */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>1. Ecosystem Architecture & Role Matrix</span>
            </h4>
            <p>
              RiseUp bridges professional social connectivity (Facebook/LinkedIn feed & messaging) with structured venture dealflow (AngelList/Crunchbase cap tables & diligence).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  Founder Role (1:1 Venture Binding)
                </span>
                <p className="text-[11px]">
                  Each founder represents <strong>one active startup entity</strong>. Can publish updates, manage fundraising goals, and accept/reject investor requests.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Investor Role (1:N Portfolio Syndication)
                </span>
                <p className="text-[11px]">
                  Investors discover dealflow, express non-binding check interests, join multi-startup syndicates, and track portfolio company traction.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  Mentor Role (1:1 Dedicated Advisory)
                </span>
                <p className="text-[11px]">
                  Mentors actively advise <strong>one startup at a time</strong> to prevent advice dilution. Complete session deliverables and review traction.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                  Admin Role (Governance & Verified Badges)
                </span>
                <p className="text-[11px]">
                  Login-only privileged access for moderating listings, granting blue verification badges, and auditing compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Entity Relationship Diagram (ER Model) */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-violet-500" />
              <span>2. Relational Database Schema & Entities</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-3 overflow-x-auto border border-slate-800">
              <div>
                <span className="text-violet-400 font-bold">TABLE users</span> (
                <br />
                &nbsp;&nbsp;id: UUID PRIMARY KEY,
                <br />
                &nbsp;&nbsp;role: ENUM('founder', 'investor', 'mentor', 'admin'),
                <br />
                &nbsp;&nbsp;name: VARCHAR(255), email: VARCHAR(255) UNIQUE,
                <br />
                &nbsp;&nbsp;title: VARCHAR(255), bio: TEXT, isVerified: BOOLEAN,
                <br />
                &nbsp;&nbsp;startupId: UUID REFERENCES startups(id) -- [If Founder],
                <br />
                &nbsp;&nbsp;investedStartupIds: UUID[] REFERENCES startups(id) -- [If Investor],
                <br />
                &nbsp;&nbsp;activeMenteeStartupId: UUID REFERENCES startups(id) -- [If Mentor]
                <br />
                );
              </div>

              <div>
                <span className="text-emerald-400 font-bold">TABLE startups</span> (
                <br />
                &nbsp;&nbsp;id: UUID PRIMARY KEY,
                <br />
                &nbsp;&nbsp;founderId: UUID REFERENCES users(id),
                <br />
                &nbsp;&nbsp;name: VARCHAR(255), tagline: VARCHAR(255),
                <br />
                &nbsp;&nbsp;stage: ENUM('Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B'),
                <br />
                &nbsp;&nbsp;fundingGoal: NUMERIC, fundingRaised: NUMERIC,
                <br />
                &nbsp;&nbsp;assignedMentorId: UUID REFERENCES users(id),
                <br />
                &nbsp;&nbsp;joinedInvestorIds: UUID[] REFERENCES users(id),
                <br />
                &nbsp;&nbsp;isVerified: BOOLEAN, isFeatured: BOOLEAN
                <br />
                );
              </div>

              <div>
                <span className="text-amber-400 font-bold">TABLE investor_requests</span> (
                <br />
                &nbsp;&nbsp;id: UUID PRIMARY KEY,
                <br />
                &nbsp;&nbsp;startupId: UUID REFERENCES startups(id),
                <br />
                &nbsp;&nbsp;investorId: UUID REFERENCES users(id),
                <br />
                &nbsp;&nbsp;checkSizeAmount: NUMERIC, message: TEXT,
                <br />
                &nbsp;&nbsp;status: ENUM('pending', 'accepted', 'rejected')
                <br />
                );
              </div>

              <div>
                <span className="text-indigo-400 font-bold">TABLE posts</span> (
                <br />
                &nbsp;&nbsp;id: UUID PRIMARY KEY, authorId: UUID REFERENCES users(id),
                <br />
                &nbsp;&nbsp;startupId: UUID REFERENCES startups(id),
                <br />
                &nbsp;&nbsp;content: TEXT, type: ENUM('update', 'milestone', 'launch', 'hiring', 'fundraising')
                <br />
                );
              </div>
            </div>
          </div>

          {/* Section 3: Compliance & Zero Financial Transaction Policy */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1">
            <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Zero-Intermediation Regulatory Compliance</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              RiseUp provides discovery, networking, and diligence tooling. All funding expressions are non-binding expressions of interest (EOIs) to facilitate direct accredited founder-investor conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
