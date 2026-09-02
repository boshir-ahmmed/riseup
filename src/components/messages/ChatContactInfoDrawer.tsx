import React, { useState } from 'react';
import {
  X,
  Phone,
  Video,
  Pin,
  BellOff,
  Bell,
  Star,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Building2,
  Mail,
  UserCheck,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { Conversation, MessageItem, User } from '../../types';
import { RoleBadge } from '../layout/RoleBadge';

interface ChatContactInfoDrawerProps {
  conversation: Conversation;
  messages: MessageItem[];
  isOpen: boolean;
  onClose: () => void;
  onStartAudioCall: (user: User) => void;
  onStartVideoCall?: (user: User) => void;
  onTogglePin: (convId: string) => void;
  onToggleMute: (convId: string) => void;
  onImageClick?: (url: string) => void;
  onJumpToMessage?: (messageId: string) => void;
  allUsers: User[];
  onViewProfile?: (userId: string) => void;
  onViewStartup?: (startupId: string) => void;
}

export const ChatContactInfoDrawer: React.FC<ChatContactInfoDrawerProps> = ({
  conversation,
  messages,
  isOpen,
  onClose,
  onStartAudioCall,
  onTogglePin,
  onToggleMute,
  onImageClick,
  onJumpToMessage,
  allUsers,
  onViewProfile,
  onViewStartup
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'starred'>('media');

  if (!isOpen) return null;

  const targetUser = allUsers.find(u => u.id === conversation.otherUser.id) || {
    id: conversation.otherUser.id,
    name: conversation.otherUser.name,
    avatar: conversation.otherUser.avatar,
    role: conversation.otherUser.role,
    title: conversation.otherUser.title,
    company: conversation.otherUser.company,
    bio: 'Active member of the RiseUp Founder & Investor Ecosystem.',
    email: `${conversation.otherUser.name.toLowerCase().replace(/\s+/g, '.')}@riseup.eco`
  } as User;

  // Filter shared media, docs, and starred items
  const mediaItems = messages.filter(m => m.mediaUrl);
  const docItems = messages.filter(m => m.attachmentName);
  const starredItems = messages.filter(m => m.isStarred);

  return (
    <div
      id="chat-contact-info-drawer"
      className="w-80 lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right duration-200 shrink-0 z-20 shadow-lg lg:shadow-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Contact Info</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col items-center text-center border-b border-slate-200 dark:border-slate-800">
        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full ring-4 ring-indigo-500/20 overflow-hidden shadow-md">
            <img
              src={conversation.otherUser.avatar}
              alt={conversation.otherUser.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {conversation.otherUser.isOnline && (
            <span
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
              title="Online now"
            />
          )}
        </div>

        <h4 className="font-bold text-base text-slate-900 dark:text-white">
          {conversation.otherUser.name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 max-w-[240px]">
          {conversation.otherUser.title}
        </p>
        <div className="mt-2.5">
          <RoleBadge role={conversation.otherUser.role} />
        </div>

        {/* View Profile Action Button */}
        {onViewProfile && (
          <button
            type="button"
            onClick={() => onViewProfile(conversation.otherUser.id)}
            className="w-full mt-3 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-indigo-200/60 dark:border-indigo-800/40 transition cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>View Full Profile</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        )}

        {/* Quick actions bar */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4">
          <button
            type="button"
            onClick={() => onStartAudioCall(targetUser)}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <Phone className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-medium">Audio Call</span>
          </button>

          <button
            type="button"
            onClick={() => onTogglePin(conversation.id)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
              conversation.isPinned
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Pin className={`w-4 h-4 mb-1 ${conversation.isPinned ? 'fill-current' : ''}`} />
            <span className="text-[11px] font-medium">{conversation.isPinned ? 'Pinned' : 'Pin Chat'}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleMute(conversation.id)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
              conversation.isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            {conversation.isMuted ? <BellOff className="w-4 h-4 mb-1" /> : <Bell className="w-4 h-4 mb-1" />}
            <span className="text-[11px] font-medium">{conversation.isMuted ? 'Muted' : 'Mute'}</span>
          </button>
        </div>
      </div>

      {/* About / Bio Section */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 text-xs">
        <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">About & Organization</p>
        {conversation.otherUser.company && (
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="font-medium">{conversation.otherUser.company}</span>
            </div>
            {targetUser.startupId && onViewStartup && (
              <button
                type="button"
                onClick={() => onViewStartup(targetUser.startupId!)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Startup</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="truncate">{targetUser.email}</span>
        </div>
        {targetUser.bio && (
          <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-750 leading-relaxed">
            "{targetUser.bio}"
          </p>
        )}
        {targetUser.startupId && onViewStartup && (
          <button
            type="button"
            onClick={() => onViewStartup(targetUser.startupId!)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>View Startup Details</span>
          </button>
        )}
      </div>

      {/* Media, Documents & Starred Tabs */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'media'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media ({mediaItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Docs ({docItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('starred')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'starred'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Starred ({starredItems.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'media' && (
          <div>
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {mediaItems.map(m => (
                  <div
                    key={m.id}
                    onClick={() => m.mediaUrl && onImageClick && onImageClick(m.mediaUrl)}
                    className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 relative group cursor-pointer"
                  >
                    <img
                      src={m.mediaUrl}
                      alt="Shared media"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No shared photos or videos yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-2">
            {docItems.length > 0 ? (
              docItems.map(d => (
                <div
                  key={d.id}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{d.attachmentName}</p>
                      <p className="text-[10px] text-slate-400">{d.attachmentSize || 'PDF Document'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No shared pitch decks or documents.
              </div>
            )}
          </div>
        )}

        {activeTab === 'starred' && (
          <div className="space-y-2">
            {starredItems.length > 0 ? (
              starredItems.map(s => (
                <div
                  key={s.id}
                  onClick={() => onJumpToMessage && onJumpToMessage(s.id)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs cursor-pointer hover:border-amber-400 transition"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-slate-600 dark:text-slate-300">{s.senderName}</span>
                    <span>{new Date(s.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 line-clamp-2">{s.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No starred messages in this chat.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Encryption Footer Note */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>End-to-end encrypted ecosystem communication channel.</span>
      </div>
    </div>
  );
};
