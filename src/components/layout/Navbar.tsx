import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Rocket,
  Search,
  MessageSquare,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Users,
  Compass,
  Briefcase,
  FileCode2,
  Database,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  HelpCircle
} from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

interface NavbarProps {
  onOpenCreatePost?: () => void;
  onOpenCreateStartup?: () => void;
  onOpenArchitectureDocs?: () => void;
  onOpenSupabaseManager?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitectureDocs,
  onOpenSupabaseManager
}) => {
  const {
    currentUser,
    switchRole,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    soundMuted,
    toggleSoundMute,
    notifications,
    conversations,
    setShowAuthModal,
    setAuthModalMode,
    setSelectedStartupId,
    setExploreTab,
    logout
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifsCount = notifications.filter(
    n => (n.recipientId === currentUser.id || n.recipientId === 'all') && !n.isRead && n.type !== 'message'
  ).length;
  const unreadMessagesCount = conversations
    .filter(c => {
      const isParticipant = c.participantA === currentUser.id || c.participantB === currentUser.id;
      if (!isParticipant) return false;
      if (c.deletedFor && c.deletedFor.includes(currentUser.id)) return false;
      return true;
    })
    .reduce((acc, c) => acc + (c.unreadBy ? (c.unreadBy[currentUser.id] ?? 0) : (c.unreadCount || 0)), 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('explore');
    }
  };

  const getDashboardViewForRole = () => {
    if (currentUser.role === 'founder') return 'founder-dashboard';
    if (currentUser.role === 'investor') return 'investor-dashboard';
    if (currentUser.role === 'mentor') return 'mentor-dashboard';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    return 'founder-dashboard';
  };

  return (
    <>
      <header
        id="main-app-header"
        className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6 shrink-0">
              <button
                id="brand-logo-btn"
                onClick={() => setActiveView('feed')}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                      RiseUp
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800/40">
                      PROTOTYPE
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block -mt-0.5">
                    Connecting Startups with Opportunities
                  </span>
                </div>
              </button>

              {/* Primary Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1">
                <button
                  id="nav-feed"
                  onClick={() => setActiveView('feed')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    activeView === 'feed'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Feed</span>
                </button>

                <button
                  id="nav-explore"
                  onClick={() => {
                    if (currentUser.role === 'founder') {
                      setExploreTab('founders');
                    } else {
                      setExploreTab('startups');
                    }
                    setActiveView('explore');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    activeView === 'explore'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {currentUser.role === 'founder' ? (
                    <>
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      <span>Explore Investor</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>Explore Startups</span>
                    </>
                  )}
                </button>

                <button
                  id="nav-dashboard"
                  onClick={() => setActiveView(getDashboardViewForRole())}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    activeView.includes('dashboard')
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    {currentUser.role === 'founder'
                      ? 'Founder Hub'
                      : currentUser.role === 'investor'
                      ? 'Investor Hub'
                      : currentUser.role === 'mentor'
                      ? 'Mentor Hub'
                      : 'Admin Console'}
                  </span>
                </button>
              </nav>
            </div>

            {/* Search Input Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="global-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search startups, founders, investors, tags (e.g. AI, HealthTech)..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-150 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                />
              </form>
            </div>

            {/* Right Action Icons & User Dropdown */}
            <div className="flex items-center gap-1.5">
              {/* Architecture & Docs Button (For presentation) */}
              <button
                id="open-architecture-docs-btn"
                onClick={onOpenArchitectureDocs}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition cursor-pointer"
                title="View Database Schema, Architecture & ER Diagram"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span></span>
              </button>

              {/* Supabase Database & Table Editor Button */}
              <button
                id="open-supabase-manager-btn"
                onClick={onOpenSupabaseManager}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer"
                title="Supabase PostgreSQL Database & Table Editor"
              >
                <Database className="w-3.5 h-3.5" />
                <span></span>
              </button>

              {/* Message Box Icon Only */}
              <button
                id="navbar-messages-btn"
                onClick={() => setActiveView('messages')}
                className={`p-2.5 rounded-xl transition relative cursor-pointer flex items-center justify-center ${
                  activeView === 'messages'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Direct Messages"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 shadow-xs">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Notifications Bell */}
              <button
                id="notifications-toggle-btn"
                onClick={() => setIsNotifOpen(true)}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer flex items-center justify-center"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 shadow-xs">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Sound FX Toggle */}
              <button
                id="sound-toggle-btn"
                onClick={toggleSoundMute}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center"
                title={soundMuted ? 'Unmute Interaction Sounds' : 'Mute Interaction Sounds'}
              >
                {soundMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-indigo-500" />}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {currentUser.email}
                          </p>
                          <div className="mt-1">
                            <RoleBadge role={currentUser.role} isVerified={currentUser.isVerified} size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveView('profile');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>My Public Profile</span>
                      </button>

                      {currentUser.role === 'founder' && currentUser.startupId && (
                        <button
                          onClick={() => {
                            setSelectedStartupId(currentUser.startupId || 'startup-1');
                            setActiveView('startup-details');
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Rocket className="w-4 h-4 text-emerald-500" />
                          <span>View My Startup Page</span>
                        </button>
                      )}

                      <button
                        onClick={() => setActiveView(getDashboardViewForRole())}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        <span>Role Dashboard Hub</span>
                      </button>

                      <button
                        onClick={() => setActiveView('landing')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                        <span>Platform Landing & Overview</span>
                      </button>

                      {onOpenSupabaseManager && (
                        <button
                          onClick={onOpenSupabaseManager}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Database className="w-4 h-4 text-emerald-500" />
                          <span>Supabase Database & Tables</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Persona
                      </p>
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {(['founder', 'investor', 'mentor', 'admin'] as const).map(r => (
                          <button
                            key={r}
                            onClick={() => switchRole(r)}
                            className={`px-2 py-1.5 text-[11px] rounded font-medium text-center capitalize ${
                              currentUser.role === r
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <button
                        onClick={() => {
                          setAuthModalMode('login');
                          setShowAuthModal(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Switch / Manage Accounts</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Platform</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
