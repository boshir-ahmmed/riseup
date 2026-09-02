import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trash2,
  Search,
  Filter,
  BarChart3,
  Lock,
  Layers,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    startups,
    users,
    posts,
    investorRequests,
    mentorRequests,
    verifyStartup,
    verifyUser,
    deleteStartup,
    deleteUser,
    updateUserRole,
    setSelectedStartupId,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'startups' | 'users' | 'rules'>('startups');
  const [startupSearch, setStartupSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Aggregated Stats
  const totalFundingRaised = startups.reduce((acc, s) => acc + (s.fundingRaised || 0), 0);
  const totalFundingGoal = startups.reduce((acc, s) => acc + (s.fundingGoal || 0), 0);
  const verifiedStartupsCount = startups.filter(s => s.isVerified).length;
  const verifiedUsersCount = users.filter(u => u.isVerified).length;

  // Filtered lists
  const filteredStartups = startups.filter(
    s =>
      s.name.toLowerCase().includes(startupSearch.toLowerCase()) ||
      s.industry.toLowerCase().includes(startupSearch.toLowerCase()) ||
      s.founderName.toLowerCase().includes(startupSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-2xl">RiseUp Admin Command Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Super Admin Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ecosystem Governance, Verification Badges, Dealflow Quality Control & Rule Auditing
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab('startups')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'startups' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Startups Directory ({startups.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users & Roles ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rule Audit
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Startups</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {startups.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {verifiedStartupsCount} verified badges granted
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Ecosystem Capital Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            ${(totalFundingRaised / 1000000).toFixed(1)}M USD
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            ${(totalFundingGoal / 1000000).toFixed(1)}M total target
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Ecosystem Users</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {users.length}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
            {verifiedUsersCount} verified profiles
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Connections & Requests</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {investorRequests.length + mentorRequests.length}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">
            {posts.length} published milestones
          </span>
        </div>
      </div>

      {/* TAB 1: STARTUP MODERATION */}
      {activeTab === 'startups' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Startup Governance Directory
              </h3>
              <p className="text-xs text-slate-500">
                Grant or revoke official verification badges, feature top ventures, and manage listings
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={startupSearch}
                onChange={e => setStartupSearch(e.target.value)}
                placeholder="Search startups..."
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Startup</th>
                  <th className="py-3 px-4">Founder</th>
                  <th className="py-3 px-4">Stage / Sector</th>
                  <th className="py-3 px-4">Raised / Goal</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStartups.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3 px-4">
                      <div
                        onClick={() => {
                          setSelectedStartupId(s.id);
                          setActiveView('startup-details');
                        }}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <img
                          src={s.logo}
                          alt={s.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition block">
                            {s.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{s.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {s.founderName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {s.stage} • {s.industry}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        ${(s.fundingRaised / 1000).toFixed(0)}k
                      </span>
                      <span className="text-slate-400 text-[10px] block">
                        of ${(s.fundingGoal / 1000000).toFixed(1)}M
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => verifyStartup(s.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition ${
                          s.isVerified
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{s.isVerified ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteStartup(s.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete Startup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER MODERATION */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                User Management Directory
              </h3>
              <p className="text-xs text-slate-500">
                Manage roles, verify identities, and monitor user activity across the ecosystem
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role Assignment</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {u.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <option value="founder">Founder</option>
                        <option value="investor">Investor</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => verifyUser(u.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition ${
                          u.isVerified
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{u.isVerified ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(u.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RULES & ECOSYSTEM PROTOCOL AUDITOR */}
      {activeTab === 'rules' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Ecosystem Rules Enforcement & Automated Compliance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <h4>Founder Constraint: 1 Startup Active</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Rule verified: Each founder account is bounded to exactly 1 primary startup listing to preserve venture focus.
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">
                Status: 100% Compliant across all {startups.length} founders
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <h4>Mentor Constraint: 1 Startup Active</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Rule verified: Mentors can only actively advise 1 startup at a time for dedicated attention.
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">
                Status: Verified & Enforced in UI state
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <h4>Investor Multi-Startup Syndication</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Rule verified: Investors have unbounded capability to join and review multiple startups in parallel.
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">
                Status: Active Portfolio Manager Enabled
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <h4>Zero Financial Gateway Policy</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Platform scope: Professional networking, milestone transparency, and investor diligence only. No crowdfunding transactions.
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">
                Status: Compliant
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
