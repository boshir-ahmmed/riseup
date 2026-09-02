import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Share2,
  FileText,
  Sparkles,
  MessageSquare,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Check,
  User as UserIcon,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PitchToFounderModal } from '../modals/PitchToFounderModal';

interface FounderDashboardProps {
  onOpenCreateStartup: () => void;
  onOpenCreatePost: () => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  onOpenCreateStartup,
  onOpenCreatePost
}) => {
  const {
    currentUser,
    startups,
    investorRequests,
    mentorRequests,
    founderPitches,
    respondToFounderPitch,
    respondToInvestorRequest,
    respondToMentorRequest,
    pitchFounderModalTarget,
    setPitchFounderModalTarget,
    setExploreTab,
    setSelectedStartupId,
    setSelectedUserId,
    setActiveView,
    addMilestoneToStartup,
    startConversationWithUser,
    sendMessage
  } = useApp();

  const myStartup = startups.find(s => s.id === currentUser.startupId) || startups[0];

  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('2025-06');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [pitchFilterTab, setPitchFilterTab] = useState<'inbound' | 'outbound'>('inbound');

  // Filter requests directed to my startup
  const myInvestorRequests = investorRequests.filter(r => r.startupId === myStartup?.id);
  const myMentorRequests = mentorRequests.filter(r => r.startupId === myStartup?.id);

  // Filter founder pitches
  const inboundPitches = founderPitches.filter(p => p.recipientFounderId === currentUser.id);
  const outboundPitches = founderPitches.filter(p => p.senderFounderId === currentUser.id);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim() || !myStartup) return;

    addMilestoneToStartup(myStartup.id, {
      title: milestoneTitle,
      description: milestoneDesc,
      date: milestoneDate,
      status: 'in-progress'
    });

    setMilestoneTitle('');
    setMilestoneDesc('');
    setShowMilestoneForm(false);
  };

  if (!myStartup) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Startup Profile Registered
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          As a founder, you can register and manage 1 primary startup profile on RiseUp.
        </p>
        <button
          onClick={onOpenCreateStartup}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          Create Startup Profile Now
        </button>
      </div>
    );
  }

  const fundingPercent = Math.min(
    100,
    Math.round((myStartup.fundingRaised / myStartup.fundingGoal) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={myStartup.logo}
            alt={myStartup.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                {myStartup.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {myStartup.stage} Stage
              </span>
              {myStartup.isVerified && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Founder Portal • {currentUser.name} ({currentUser.title})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setSelectedStartupId(myStartup.id);
              setActiveView('startup-details');
            }}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>

          <button
            onClick={onOpenCreatePost}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Milestone</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Capital Committed</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-extrabold text-xl text-slate-900 dark:text-white">
            ${(myStartup.fundingRaised / 1000).toFixed(0)}k
          </p>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${fundingPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {fundingPercent}% of ${(myStartup.fundingGoal / 1000000).toFixed(1)}M target
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Investor Pipeline</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="font-extrabold text-xl text-slate-900 dark:text-white">
            {myInvestorRequests.length}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-1">
            {myInvestorRequests.filter(r => r.status === 'pending').length} pending review
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Advisory Mentor</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-extrabold text-base text-slate-900 dark:text-white truncate">
            {myStartup.assignedMentorName || 'None Assigned'}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">
            {myMentorRequests.filter(r => r.status === 'pending').length} proposals received
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Milestones Roadmap</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-extrabold text-xl text-slate-900 dark:text-white">
            {myStartup.milestones?.filter(m => m.status === 'completed').length || 0} / {myStartup.milestones?.length || 0}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            Key Objectives Met
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Investor Inquiries & Roadmaps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Investor Deal Inquiries Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Investor Inquiries & Syndicate Expressions
                </h3>
                <p className="text-xs text-slate-500">
                  Review check sizes, investor theses, and accept connection permissions
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">
                {myInvestorRequests.length} Requests
              </span>
            </div>

            {myInvestorRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-xs text-slate-400">
                No active investor inquiries at this moment. Share milestones to boost deal discovery!
              </div>
            ) : (
              <div className="space-y-3">
                {myInvestorRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={req.investorAvatar}
                        alt={req.investorName}
                        onClick={() => {
                          setSelectedUserId(req.investorId);
                          setActiveView('profile');
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
                        title={`View ${req.investorName}'s Profile`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUserId(req.investorId);
                              setActiveView('profile');
                            }}
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer text-left"
                            title={`View ${req.investorName}'s Profile`}
                          >
                            {req.investorName}
                          </button>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                            Offer: ${(req.checkSizeAmount / 1000).toFixed(0)}k USD
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          "{req.message}"
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Submitted {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedUserId(req.investorId);
                          setActiveView('profile');
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        title="View Profile"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                        <span>View Profile</span>
                      </button>

                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => respondToInvestorRequest(req.id, 'accepted')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => respondToInvestorRequest(req.id, 'rejected')}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-lg capitalize ${
                            req.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}

                      <button
                        onClick={() => {
                          sendMessage(req.investorId, `Hi ${req.investorName}, thanks for expressing interest in ${myStartup.name}!`);
                          setActiveView('messages');
                        }}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Direct Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Founder-to-Founder Pitches & Synergies Hub */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Founder-to-Founder Synergies & Pitches
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage direct joint venture proposals, tech integrations, and peer reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setExploreTab('founders');
                    setActiveView('explore');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800/40 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Explore & Pitch Founders</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Inbound vs Outbound Toggle */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <button
                onClick={() => setPitchFilterTab('inbound')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  pitchFilterTab === 'inbound'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Inbound Pitches</span>
                <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">
                  {inboundPitches.length}
                </span>
              </button>

              <button
                onClick={() => setPitchFilterTab('outbound')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  pitchFilterTab === 'outbound'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Sent Pitches</span>
                <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">
                  {outboundPitches.length}
                </span>
              </button>
            </div>

            {/* Inbound Tab Content */}
            {pitchFilterTab === 'inbound' && (
              <>
                {inboundPitches.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-xs text-slate-400 space-y-2">
                    <p>No inbound pitches from peer founders yet.</p>
                    <p className="text-[11px] text-slate-500">
                      Explore the founder ecosystem and initiate collaborations!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inboundPitches.map(pitch => (
                      <div
                        key={pitch.id}
                        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <img
                              src={pitch.senderFounderAvatar}
                              alt={pitch.senderFounderName}
                              onClick={() => {
                                setSelectedUserId(pitch.senderFounderId);
                                setActiveView('profile');
                              }}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => {
                                    setSelectedUserId(pitch.senderFounderId);
                                    setActiveView('profile');
                                  }}
                                  className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-indigo-600 transition"
                                >
                                  {pitch.senderFounderName}
                                </button>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                                  {pitch.pitchType.replace(/_/g, ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {pitch.senderFounderTitle || 'Founder'} • {pitch.senderStartupName || 'Peer Venture'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg capitalize ${
                                pitch.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : pitch.status === 'in_discussion'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : pitch.status === 'declined'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                              }`}
                            >
                              {pitch.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Title & Summary */}
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {pitch.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {pitch.summary}
                          </p>

                          {/* Synergy Points */}
                          {pitch.synergyPoints && pitch.synergyPoints.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Mutual Synergies:
                              </span>
                              {pitch.synergyPoints.map((pt, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Attached Deck */}
                          {pitch.deckName && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                  {pitch.deckName}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">{pitch.deckSize || 'PDF'}</span>
                            </div>
                          )}
                        </div>

                        {/* Inbound Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                sendMessage(
                                  pitch.senderFounderId,
                                  `Hi ${pitch.senderFounderName}, I reviewed your pitch "${pitch.title}"!`
                                );
                                setActiveView('messages');
                              }}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Direct Chat</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {pitch.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => respondToFounderPitch(pitch.id, 'accepted')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept Synergy</span>
                                </button>
                                <button
                                  onClick={() => respondToFounderPitch(pitch.id, 'in_discussion')}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition"
                                >
                                  Discuss
                                </button>
                                <button
                                  onClick={() => respondToFounderPitch(pitch.id, 'declined')}
                                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition"
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-slate-500 italic">
                                Action recorded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Outbound Tab Content */}
            {pitchFilterTab === 'outbound' && (
              <>
                {outboundPitches.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-xs text-slate-400 space-y-2">
                    <p>You have not sent any founder pitches yet.</p>
                    <button
                      onClick={() => {
                        setExploreTab('founders');
                        setActiveView('explore');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-md mt-2"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Explore Founders & Send First Pitch</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {outboundPitches.map(pitch => (
                      <div
                        key={pitch.id}
                        className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <img
                              src={pitch.recipientFounderAvatar}
                              alt={pitch.recipientFounderName}
                              onClick={() => {
                                setSelectedUserId(pitch.recipientFounderId);
                                setActiveView('profile');
                              }}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-slate-400 font-medium">Sent to:</span>
                                <button
                                  onClick={() => {
                                    setSelectedUserId(pitch.recipientFounderId);
                                    setActiveView('profile');
                                  }}
                                  className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-indigo-600 transition"
                                >
                                  {pitch.recipientFounderName}
                                </button>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                                  {pitch.pitchType.replace(/_/g, ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {pitch.recipientFounderTitle || 'Founder'} • {pitch.recipientStartupName || 'Peer Venture'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg capitalize ${
                                pitch.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : pitch.status === 'in_discussion'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : pitch.status === 'declined'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                              }`}
                            >
                              {pitch.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {pitch.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {pitch.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400">
                            Sent on {new Date(pitch.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => {
                              sendMessage(
                                pitch.recipientFounderId,
                                `Hi ${pitch.recipientFounderName}, checking in regarding our synergy pitch!`
                              );
                              setActiveView('messages');
                            }}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Follow Up in Chat</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mentor Proposals Received */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Incoming Mentor Advisory Proposals
                </h3>
                <p className="text-xs text-slate-500">
                  Accept a high-impact 1-to-1 mentor to guide key milestones
                </p>
              </div>
            </div>

            {myMentorRequests.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-xs text-slate-400">
                No active mentor proposals right now.
              </div>
            ) : (
              <div className="space-y-3">
                {myMentorRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={req.mentorAvatar}
                        alt={req.mentorName}
                        onClick={() => {
                          setSelectedUserId(req.mentorId);
                          setActiveView('profile');
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-amber-400 shrink-0 cursor-pointer hover:ring-2 hover:ring-amber-500 transition"
                        title={`View ${req.mentorName}'s Profile`}
                      />
                      <div>
                        <button
                          onClick={() => {
                            setSelectedUserId(req.mentorId);
                            setActiveView('profile');
                          }}
                          className="font-bold text-xs text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer text-left"
                          title={`View ${req.mentorName}'s Profile`}
                        >
                          {req.mentorName}
                        </button>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          "{req.message}"
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {req.areasOfHelp?.map((a, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200/60"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedUserId(req.mentorId);
                          setActiveView('profile');
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        title="View Profile"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-amber-500" />
                        <span>View Profile</span>
                      </button>

                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => respondToMentorRequest(req.id, 'accepted')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Mentor</span>
                          </button>
                          <button
                            onClick={() => respondToMentorRequest(req.id, 'rejected')}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-lg">
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Roadmap Milestone Management */}
        <div className="lg:col-span-4 space-y-6">
          {/* Milestone Quick Manager */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Execution Roadmap
              </h3>
              <button
                onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {showMilestoneForm ? 'Close' : '+ Add Milestone'}
              </button>
            </div>

            {showMilestoneForm && (
              <form
                onSubmit={handleAddMilestone}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2.5 text-xs animate-in fade-in"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    required
                    value={milestoneTitle}
                    onChange={e => setMilestoneTitle(e.target.value)}
                    placeholder="e.g. Launch Enterprise Beta"
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Details
                  </label>
                  <textarea
                    rows={2}
                    value={milestoneDesc}
                    onChange={e => setMilestoneDesc(e.target.value)}
                    placeholder="Onboarding 20 enterprise pilots..."
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  Save Milestone
                </button>
              </form>
            )}

            <div className="space-y-3">
              {myStartup.milestones?.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                        m.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">{m.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Target: {m.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pitch to Founder Modal */}
      <PitchToFounderModal
        isOpen={!!pitchFounderModalTarget}
        targetFounder={pitchFounderModalTarget}
        onClose={() => setPitchFounderModalTarget(null)}
      />
    </div>
  );
};
