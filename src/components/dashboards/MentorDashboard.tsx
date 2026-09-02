import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Star,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MessageSquare,
  Sparkles,
  AlertCircle,
  FileText,
  Building2,
  TrendingUp,
  PlusCircle,
  Send,
  XCircle,
  User as UserIcon,
  ArrowUpRight
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const {
    currentUser,
    startups,
    mentorRequests,
    respondToMentorRequest,
    setSelectedStartupId,
    setSelectedUserId,
    setActiveView,
    sendMessage
  } = useApp();

  const [sessionNotes, setSessionNotes] = useState([
    {
      id: 'sn-1',
      date: '2025-05-12',
      topic: 'Pricing Model Optimization & Enterprise Pilot Terms',
      actionItems: ['Standardize pilot SLA to 30 days', 'Target 3 enterprise design partners in Q3'],
      status: 'completed'
    },
    {
      id: 'sn-2',
      date: '2025-05-24',
      topic: 'Series A Pitch Deck Narrative & Metric Refinement',
      actionItems: ['Emphasize Net Revenue Retention (135%)', 'Reformat competitor quadrant to focus on AI speed'],
      status: 'in-progress'
    }
  ]);

  const [newTopic, setNewTopic] = useState('');
  const [newActionItem, setNewActionItem] = useState('');

  // Active mentored startup (1 active startup constraint)
  const activeStartup = startups.find(s => s.assignedMentorId === currentUser.id);

  // Incoming mentor requests sent to or from this mentor
  const myMentorRequests = mentorRequests.filter(r => r.mentorId === currentUser.id);

  const handleAddSessionNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    setSessionNotes([
      {
        id: `sn-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        topic: newTopic,
        actionItems: newActionItem.trim() ? [newActionItem.trim()] : ['Review next milestone progress'],
        status: 'in-progress'
      },
      ...sessionNotes
    ]);

    setNewTopic('');
    setNewActionItem('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Mentor Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Verified Mentor & Advisor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentUser.title} • {currentUser.company || 'Tech Advisor'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200/60">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Rating: {currentUser.mentorRating || 4.9} / 5.0</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {currentUser.mentorAvailability || '1 Spot Available'}
          </div>
        </div>
      </div>

      {/* Ecosystem 1-to-1 Rule Alert */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">RiseUp 1-to-1 Dedicated Mentorship Protocol</h4>
          <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">
            To provide genuine depth, high-caliber feedback, and actionable guidance, mentors on RiseUp actively advise <strong>ONE startup at a time</strong>.
          </p>
        </div>
      </div>

      {/* Active Mentee Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Currently Mentored Startup Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Active Mentee Startup Workspace
              </h3>
              {activeStartup && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
                  Active Collaboration
                </span>
              )}
            </div>

            {activeStartup ? (
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    onClick={() => {
                      setSelectedStartupId(activeStartup.id);
                      setActiveView('startup-details');
                    }}
                    className="flex items-center gap-3 cursor-pointer group/mentee"
                  >
                    <img
                      src={activeStartup.logo}
                      alt={activeStartup.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 group-hover/mentee:ring-2 group-hover/mentee:ring-indigo-500 transition"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover/mentee:text-indigo-600 dark:group-hover/mentee:text-indigo-400 transition">
                        {activeStartup.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserId(activeStartup.founderId);
                          setActiveView('profile');
                        }}
                        className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        title={`View ${activeStartup.founderName}'s Profile`}
                      >
                        <span>Founder: {activeStartup.founderName}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedStartupId(activeStartup.id);
                        setActiveView('startup-details');
                      }}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUserId(activeStartup.founderId);
                        setActiveView('profile');
                      }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        sendMessage(activeStartup.founderId, `Hi ${activeStartup.founderName}, ready for our weekly advisory review?`);
                        setActiveView('messages');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Founder</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Target Raised</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${(activeStartup.fundingRaised / 1000).toFixed(0)}k / ${(activeStartup.fundingGoal / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Current Stage</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {activeStartup.stage}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Target Focus</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Series A Scaling
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-850/50 rounded-2xl text-xs text-slate-400 space-y-2">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  You are currently available to mentor 1 startup!
                </p>
                <p>Browse explore dealflow to offer advisory mentorship to high-potential founders.</p>
                <button
                  onClick={() => setActiveView('explore')}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Explore Startups
                </button>
              </div>
            )}
          </div>

          {/* Advisory Notes & Action Items Logger */}
          {activeStartup && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Advisory Session Notes & Strategic Roadmap
              </h3>

              {/* Log new session */}
              <form onSubmit={handleAddSessionNote} className="p-4 bg-slate-50 dark:bg-slate-850/60 rounded-xl space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Advisory Session Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    placeholder="e.g. Enterprise Sales Pipeline & Pitch Rehearsal"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Key Action Item
                  </label>
                  <input
                    type="text"
                    value={newActionItem}
                    onChange={e => setNewActionItem(e.target.value)}
                    placeholder="e.g. Founder to complete updated 3-year cash burn forecast"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log Advisory Note</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                {sessionNotes.map(n => (
                  <div
                    key={n.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {n.topic}
                      </h4>
                      <span className="text-[11px] text-slate-400">{n.date}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Action Deliverables:</span>
                      {n.actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Mentorship Proposals & History */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Mentorship Requests Status
            </h3>

            {myMentorRequests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No outgoing mentor requests.
              </p>
            ) : (
              <div className="space-y-2.5">
                {myMentorRequests.map(req => {
                  const targetStartup = startups.find(s => s.id === req.startupId);
                  return (
                    <div
                      key={req.id}
                      onClick={() => {
                        if (targetStartup) {
                          setSelectedStartupId(targetStartup.id);
                          setActiveView('startup-details');
                        }
                      }}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850/50 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        {targetStartup && (
                          <img
                            src={targetStartup.logo}
                            alt={targetStartup.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                            {targetStartup?.name || 'Startup'}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Status: {req.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            req.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {req.status}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Mentored Startups Legacy */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Mentorship Track Record
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-850/50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">NeuroPulse Labs</p>
                  <p className="text-[10px] text-slate-500">Graduated Series A • $4.5M Raised</p>
                </div>
                <span className="text-amber-500 font-bold">★ 5.0</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-850/50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Solaris Orbit</p>
                  <p className="text-[10px] text-slate-500">Seed Stage • 2024</p>
                </div>
                <span className="text-amber-500 font-bold">★ 4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
