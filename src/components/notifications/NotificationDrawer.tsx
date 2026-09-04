import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  X,
  Sparkles,
  Briefcase,
  Award,
  ShieldAlert,
  MessageSquare,
  Heart,
  Radio,
  ExternalLink
} from 'lucide-react';
import { RoleBadge } from '../layout/RoleBadge';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    markAllNotificationsAsRead,
    setSelectedStartupId,
    setSelectedPostId,
    setActiveView
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'requests' | 'interactions' | 'system'>('all');

  if (!isOpen) return null;

  const userNotifs = notifications.filter(n => n.recipientId === currentUser.id || n.recipientId === 'all');

  const filteredNotifs = userNotifs.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'requests')
      return (
        n.type === 'investor_interest' ||
        n.type === 'mentor_request' ||
        n.type === 'mentor_accepted' ||
        n.type === 'investor_joined'
      );
    if (filter === 'interactions') return n.type === 'like' || n.type === 'comment' || n.type === 'message' || n.type === 'meeting';
    if (filter === 'system') return n.type === 'system_broadcast' || n.type === 'startup_verified';
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'investor_interest':
      case 'investor_joined':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'mentor_request':
      case 'mentor_accepted':
      case 'mentor_declined':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'message':
      case 'meeting':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'system_broadcast':
      case 'startup_verified':
        return <Radio className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleNotificationClick = (targetId?: string, type?: string) => {
    if (!targetId) return;
    if (type?.includes('investor') || type?.includes('mentor') || type === 'startup_verified') {
      setSelectedStartupId(targetId);
      setActiveView('startup-details');
    } else if (type === 'like' || type === 'comment') {
      setSelectedPostId(targetId);
      setActiveView('post-details');
    } else if (type === 'message' || type === 'meeting') {
      setActiveView('messages');
    }
    onClose();
  };

  return (
    <div
      id="notification-drawer-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div
        id="notification-drawer-panel"
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-50 animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Notifications</h3>
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-medium">
              {userNotifs.filter(n => !n.isRead).length} new
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="mark-all-read-btn"
              onClick={markAllNotificationsAsRead}
              className="p-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              id="close-notification-drawer"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'requests', label: 'Requests & Deals' },
            { id: 'interactions', label: 'Social & Feed' },
            { id: 'system', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition font-medium ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You will be notified when founders, investors, or mentors interact with you.
              </p>
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div
                key={notif.id}
                id={`notif-item-${notif.id}`}
                onClick={() => handleNotificationClick(notif.targetId, notif.type)}
                className={`p-3.5 rounded-lg transition cursor-pointer flex gap-3 ${
                  notif.isRead
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    : 'bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-l-2 border-indigo-500'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={notif.senderAvatar}
                    alt={notif.senderName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-white dark:bg-slate-900 rounded-full shadow-xs">
                    {getNotifIcon(notif.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.targetId && (
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Real-time ecosystem updates for {currentUser.name} ({currentUser.role.toUpperCase()})
          </p>
        </div>
      </div>
    </div>
  );
};
