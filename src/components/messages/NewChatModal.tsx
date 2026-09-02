import React, { useState } from 'react';
import { Search, X, MessageSquarePlus, Building2, Check } from 'lucide-react';
import { User, UserRole } from '../../types';
import { RoleBadge } from '../layout/RoleBadge';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onSelectUser: (user: User) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUserId,
  onSelectUser
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  if (!isOpen) return null;

  const filteredUsers = users
    .filter(u => u.id !== currentUserId)
    .filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.title.toLowerCase().includes(q) ||
        (u.company && u.company.toLowerCase().includes(q))
      );
    });

  return (
    <div
      id="new-chat-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="new-chat-modal-card"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">New Conversation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Connect with founders, investors, and mentors</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['all', 'founder', 'investor', 'mentor'] as const).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap font-medium transition cursor-pointer ${
                  roleFilter === role
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {role === 'all' ? 'All Roles' : `${role}s`}
              </button>
            ))}
          </div>
        </div>

        {/* User list */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover shadow-xs ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {user.name}
                      </span>
                      <RoleBadge role={user.role} />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.title} {user.company ? `• ${user.company}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 group-hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 group-hover:text-white font-bold text-xs transition shadow-xs shrink-0 cursor-pointer"
                >
                  Message
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching ecosystem members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
