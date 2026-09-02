import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Mic,
  MicOff,
  SquarePen,
  Pin,
  BellOff,
  Bell,
  Trash2,
  X,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  Info,
  Check,
  CheckCheck,
  Download,
  Flame,
  ArrowDown,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Conversation, MessageItem, User, UserRole } from '../../types';
import { RoleBadge } from '../layout/RoleBadge';
import { MessageItemBubble } from './MessageItemBubble';
import { ChatContactInfoDrawer } from './ChatContactInfoDrawer';
import { NewChatModal } from './NewChatModal';

const EMOJI_LIST = [
  '😀', '😂', '😊', '😍', '🤔', '😎', '🙌', '👍',
  '🔥', '🚀', '💡', '🎉', '💼', '📈', '🤝', '⭐',
  '💰', '🎯', '✨', '👏', '❤️', '💯', '🦾', '🏆'
];

export const MessagesPage: React.FC = () => {
  const {
    currentUser,
    users,
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    reactToMessage,
    respondToMeetingInvite,
    deleteMessage,
    toggleStarMessage,
    togglePinConversation,
    toggleMuteConversation,
    startConversationWithUser,
    isTyping,
    typingUser,
    startCallWithUser,
    showToast,
    setSelectedUserId,
    setSelectedStartupId,
    setActiveView
  } = useApp();

  // Local UI State
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'pinned' | UserRole>('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);

  // In-Chat Message Search State
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [inChatSearchTerm, setInChatSearchTerm] = useState('');
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);

  // Replying To Message State
  const [replyingToMessage, setReplyingToMessage] = useState<MessageItem | null>(null);

  // Voice Note Recording Simulation State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Meeting scheduler modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState('Product & Seed Round Advisory');
  const [meetingDate, setMeetingDate] = useState('Tomorrow');
  const [meetingTime, setMeetingTime] = useState('2:00 PM PST');

  // Media Lightbox Modal
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId, isTyping]);

  // Voice note timer effect
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecordingVoice]);

  // Active conversation object
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Set default active conversation if none is selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations, setActiveConversationId]);

  // Active thread messages
  const activeMessages = messages.filter(
    m => m.conversationId === (activeConversation ? activeConversation.id : '')
  );

  // In-chat search matched message IDs
  const matchedMessageIds = inChatSearchTerm.trim()
    ? activeMessages
        .filter(m => m.text && m.text.toLowerCase().includes(inChatSearchTerm.toLowerCase()))
        .map(m => m.id)
    : [];

  const handleNextSearchMatch = () => {
    if (matchedMessageIds.length === 0) return;
    const nextIdx = (searchMatchIndex + 1) % matchedMessageIds.length;
    setSearchMatchIndex(nextIdx);
    scrollToMessage(matchedMessageIds[nextIdx]);
  };

  const handlePrevSearchMatch = () => {
    if (matchedMessageIds.length === 0) return;
    const prevIdx = (searchMatchIndex - 1 + matchedMessageIds.length) % matchedMessageIds.length;
    setSearchMatchIndex(prevIdx);
    scrollToMessage(matchedMessageIds[prevIdx]);
  };

  const scrollToMessage = (messageId: string) => {
    const el = document.getElementById(`message-bubble-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2');
      }, 1500);
    }
  };

  // Filtered conversation list
  const filteredConversations = conversations
    .filter(c => {
      // Filter by chip
      if (activeFilter === 'unread' && c.unreadCount === 0) return false;
      if (activeFilter === 'pinned' && !c.isPinned) return false;
      if (['founder', 'investor', 'mentor', 'admin'].includes(activeFilter) && c.otherUser.role !== activeFilter) {
        return false;
      }
      // Filter by search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.otherUser.name.toLowerCase().includes(q) ||
        (c.otherUser.company && c.otherUser.company.toLowerCase().includes(q)) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      // Pinned items first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime();
    });

  // Send standard text / reply message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const options: Partial<MessageItem> = {};
    if (replyingToMessage) {
      options.replyTo = {
        id: replyingToMessage.id,
        senderName: replyingToMessage.senderName,
        text: replyingToMessage.text || 'Attachment / Media',
        attachmentName: replyingToMessage.attachmentName
      };
    }

    sendMessage(activeConversation.otherUser.id, inputText.trim(), undefined, options);
    setInputText('');
    setReplyingToMessage(null);
    setShowEmojiPicker(false);
  };

  // Send voice note
  const handleSendVoiceNote = () => {
    if (!activeConversation) return;
    setIsRecordingVoice(false);
    const duration = Math.max(2, recordingSeconds);

    sendMessage(
      activeConversation.otherUser.id,
      '',
      undefined,
      {
        voiceNote: {
          durationSec: duration,
          audioWaveform: Array.from({ length: 18 }, () => Math.floor(Math.random() * 70) + 25)
        }
      }
    );
  };

  const handleCancelVoiceNote = () => {
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  // Send sample photo attachment
  const handleSendPhoto = (sampleUrl?: string) => {
    if (!activeConversation) return;
    setShowAttachMenu(false);
    const imgUrl = sampleUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80';
    sendMessage(
      activeConversation.otherUser.id,
      '',
      undefined,
      {
        mediaUrl: imgUrl,
        mediaType: 'image'
      }
    );
  };

  // Send document attachment
  const handleSendDocument = (docName: string, docSize: string) => {
    if (!activeConversation) return;
    setShowAttachMenu(false);
    sendMessage(
      activeConversation.otherUser.id,
      '',
      docName,
      {
        attachmentName: docName,
        attachmentSize: docSize
      }
    );
  };

  // Send meeting invite
  const handleSendMeetingInvite = () => {
    if (!activeConversation) return;
    setShowScheduleModal(false);
    sendMessage(
      activeConversation.otherUser.id,
      `Scheduled ecosystem sync: "${meetingTopic}" on ${meetingDate} at ${meetingTime}.`,
      undefined,
      {
        meetingInvite: {
          topic: meetingTopic,
          date: meetingDate,
          time: meetingTime,
          status: 'pending'
        }
      }
    );
  };

  // Format message time
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationDate = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Group messages by date for WhatsApp-style date headers
  const getMessageDateLabel = (timestamp: string) => {
    const d = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (d.toDateString() === now.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div
      id="messages-system-container"
      className="max-w-7xl mx-auto h-[calc(100vh-5rem)] flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative select-text"
    >
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR: Conversation list & Search / Filter Controls   */}
      {/* ------------------------------------------------------------- */}
      <div
        id="messages-sidebar"
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-white dark:bg-slate-900 shrink-0 ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Chats</span>
                {conversations.reduce((acc, c) => acc + c.unreadCount, 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    {conversations.reduce((acc, c) => acc + c.unreadCount, 0)} new
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                {currentUser.role} Workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewChatModal(true)}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Start new conversation"
          >
            <SquarePen className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search or start new chat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Chips (WhatsApp style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {(['all', 'unread', 'pinned', 'investor', 'mentor', 'founder'] as const).map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter === 'all'
                  ? 'All'
                  : filter === 'unread'
                  ? 'Unread'
                  : filter === 'pinned'
                  ? '📌 Pinned'
                  : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conv => {
              const isSelected = activeConversation && activeConversation.id === conv.id;

              return (
                <div
                  key={conv.id}
                  id={`conversation-item-${conv.id}`}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition relative group ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-l-4 border-indigo-600 dark:border-indigo-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate flex-1 pr-2">
                    {/* User Avatar with live status indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.otherUser.avatar}
                        alt={conv.otherUser.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                      {conv.otherUser.isOnline && (
                        <span
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                          title="Online now"
                        />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="truncate flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`font-bold text-xs truncate ${
                              isSelected
                                ? 'text-indigo-900 dark:text-indigo-200'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {conv.otherUser.name}
                          </span>
                          <RoleBadge role={conv.otherUser.role} />
                        </div>
                        <span
                          className={`text-[10px] shrink-0 font-medium ${
                            conv.unreadCount > 0
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {formatConversationDate(conv.lastTimestamp)}
                        </span>
                      </div>

                      {/* Last message preview */}
                      <div className="flex items-center justify-between text-xs">
                        <p
                          className={`truncate text-[11px] ${
                            conv.unreadCount > 0
                              ? 'font-bold text-slate-900 dark:text-white'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {conv.lastMessage}
                        </p>

                        {/* Badges: Pin, Mute, Unread count */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {conv.isMuted && (
                            <BellOff className="w-3 h-3 text-slate-400" title="Muted" />
                          )}
                          {conv.isPinned && (
                            <Pin className="w-3 h-3 text-amber-500 fill-amber-500" title="Pinned" />
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pl-1">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        togglePinConversation(conv.id);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      title={conv.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${conv.isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        toggleMuteConversation(conv.id);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      title={conv.isMuted ? 'Unmute' : 'Mute'}
                    >
                      {conv.isMuted ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              <p>No conversations found.</p>
              <button
                type="button"
                onClick={() => setShowNewChatModal(true)}
                className="mt-3 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Start a new chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER PANEL: Active Conversation Chat Stream & Controls     */}
      {/* ------------------------------------------------------------- */}
      {activeConversation ? (
        <div
          id="messages-active-thread"
          className={`flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/60 relative overflow-hidden ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Active Chat Header */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Back to chats"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={activeConversation.otherUser.avatar}
                    alt={activeConversation.otherUser.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition"
                  />
                  {activeConversation.otherUser.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex items-center gap-1.5">
                      <span>{activeConversation.otherUser.name}</span>
                    </h3>
                    <RoleBadge role={activeConversation.otherUser.role} />
                  </div>

                  {/* Status / Typing subline */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    {isTyping && typingUser === activeConversation.otherUser.name ? (
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 animate-pulse">
                        <span>typing</span>
                        <span className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-indigo-600 animate-bounce" />
                          <span className="w-1 h-1 rounded-full bg-indigo-600 animate-bounce delay-100" />
                          <span className="w-1 h-1 rounded-full bg-indigo-600 animate-bounce delay-200" />
                        </span>
                      </span>
                    ) : activeConversation.otherUser.isOnline ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                    ) : (
                      <span>{activeConversation.otherUser.lastSeen || 'Offline'}</span>
                    )}
                    {activeConversation.otherUser.company && (
                      <span className="hidden sm:inline">• {activeConversation.otherUser.company}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons in Header */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedUserId(activeConversation.otherUser.id);
                  setActiveView('profile');
                }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition cursor-pointer border border-indigo-200/60 dark:border-indigo-800/40"
                title="View user profile"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>View Profile</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  startCallWithUser({
                    id: activeConversation.otherUser.id,
                    name: activeConversation.otherUser.name,
                    avatar: activeConversation.otherUser.avatar,
                    role: activeConversation.otherUser.role,
                    title: activeConversation.otherUser.title,
                    company: activeConversation.otherUser.company
                  } as User)
                }
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Start Encrypted Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  startCallWithUser({
                    id: activeConversation.otherUser.id,
                    name: activeConversation.otherUser.name,
                    avatar: activeConversation.otherUser.avatar,
                    role: activeConversation.otherUser.role,
                    title: activeConversation.otherUser.title,
                    company: activeConversation.otherUser.company
                  } as User)
                }
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Start Video Meeting"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowInChatSearch(!showInChatSearch)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  showInChatSearch
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Search within conversation"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  showInfoDrawer
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Contact Info & Shared Media"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* In-Chat Search Bar (Slide down) */}
          {showInChatSearch && (
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-750 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-150 z-10">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in this chat..."
                  value={inChatSearchTerm}
                  onChange={e => {
                    setInChatSearchTerm(e.target.value);
                    setSearchMatchIndex(0);
                  }}
                  className="w-full bg-transparent border-none focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 text-xs"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2">
                {matchedMessageIds.length > 0 && (
                  <span className="text-[11px] text-slate-500 font-medium">
                    {searchMatchIndex + 1} of {matchedMessageIds.length}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handlePrevSearchMatch}
                  disabled={matchedMessageIds.length === 0}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Previous match"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSearchMatch}
                  disabled={matchedMessageIds.length === 0}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Next match"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInChatSearch(false);
                    setInChatSearchTerm('');
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Messages Stream Content */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 relative"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.08) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          >
            {/* End to end encryption badge banner */}
            <div className="flex justify-center my-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>End-to-End Encrypted Ecosystem Connection</span>
              </div>
            </div>

            {/* Render grouped message bubbles */}
            {activeMessages.map((msg, index) => {
              const prevMsg = activeMessages[index - 1];
              const currentDateLabel = getMessageDateLabel(msg.timestamp);
              const prevDateLabel = prevMsg ? getMessageDateLabel(prevMsg.timestamp) : null;
              const showDateHeader = currentDateLabel !== prevDateLabel;

              return (
                <React.Fragment key={msg.id}>
                  {showDateHeader && (
                    <div className="flex justify-center my-3">
                      <span className="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-bold shadow-2xs backdrop-blur-xs">
                        {currentDateLabel}
                      </span>
                    </div>
                  )}

                  <MessageItemBubble
                    message={msg}
                    isMine={msg.senderId === currentUser.id}
                    currentUser={currentUser}
                    onReact={reactToMessage}
                    onReply={m => setReplyingToMessage(m)}
                    onStar={toggleStarMessage}
                    onDelete={deleteMessage}
                    onRespondMeeting={respondToMeetingInvite}
                    onImageClick={url => setLightboxImageUrl(url)}
                    onScrollToMessage={scrollToMessage}
                    searchHighlight={inChatSearchTerm}
                  />
                </React.Fragment>
              );
            })}

            {/* Live Typing indicator bubble */}
            {isTyping && typingUser === activeConversation.otherUser.name && (
              <div className="flex items-center gap-2 my-2 animate-in fade-in duration-200">
                <img
                  src={activeConversation.otherUser.avatar}
                  alt={activeConversation.otherUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shadow-xs"
                />
                <div className="px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Replying-To Bar (Sticky right above bottom input) */}
          {replyingToMessage && (
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 border-t border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center gap-2 truncate">
                <div className="w-1 h-8 rounded-full bg-indigo-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                    Replying to {replyingToMessage.senderName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 truncate text-[11px]">
                    {replyingToMessage.text || (replyingToMessage.attachmentName ? `📎 ${replyingToMessage.attachmentName}` : 'Media file')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyingToMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* BOTTOM COMPOSER BAR: Emojis, Attachments, Input, Voice Note  */}
          {/* ------------------------------------------------------------- */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative">
            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div
                id="emoji-picker-popover"
                className="absolute bottom-16 left-4 z-30 p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl w-64 animate-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-500">
                  <span>Quick Emojis</span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {EMOJI_LIST.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setInputText(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-lg hover:scale-125 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attachment Menu Popup */}
            {showAttachMenu && (
              <div
                id="attachment-menu-popover"
                className="absolute bottom-16 left-12 z-30 p-2 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl w-56 flex flex-col gap-1 text-xs animate-in zoom-in-95 duration-150"
              >
                <button
                  type="button"
                  onClick={() => handleSendPhoto()}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Photo / Screenshot</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSendDocument('NeuroPulse_Series_A_DataRoom.pdf', '3.8 MB')
                  }
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Pitch Deck (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(false);
                    setShowScheduleModal(true);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Schedule Meeting</span>
                </button>
              </div>
            )}

            {/* Active Voice Recording Bar vs Normal Message Input */}
            {isRecordingVoice ? (
              <div className="flex items-center justify-between gap-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-2.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                    Recording audio • {Math.floor(recordingSeconds / 60)}:
                    {(recordingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  {/* Wave animation */}
                  <div className="flex items-center gap-0.5 h-4">
                    {[30, 80, 45, 90, 60, 100, 50, 75, 40].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-rose-500 rounded-full animate-pulse"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelVoiceNote}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                    title="Cancel recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSendVoiceNote}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Voice</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Emoji Picker Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachMenu(false);
                  }}
                  className={`p-2.5 rounded-xl transition cursor-pointer ${
                    showEmojiPicker
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Insert emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Attachment Menu Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(!showAttachMenu);
                    setShowEmojiPicker(false);
                  }}
                  className={`p-2.5 rounded-xl transition cursor-pointer ${
                    showAttachMenu
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Attach file, photo or schedule sync"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-transparent rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>

                {/* Voice Note Trigger if empty, else Send Button */}
                {inputText.trim().length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setIsRecordingVoice(true)}
                    className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition transform active:scale-95 cursor-pointer shadow-xs"
                    title="Record voice note"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition transform hover:scale-105 active:scale-95 cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-950/50">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-xs">
            <SquarePen className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">RiseUp Ecosystem Messages</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Select a conversation on the left or initiate a new peer-to-peer sync with any founder, investor, or mentor.
          </p>
          <button
            type="button"
            onClick={() => setShowNewChatModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Start New Conversation
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* RIGHT SIDEBAR: Contact Info & Shared Media Drawer             */}
      {/* ------------------------------------------------------------- */}
      {activeConversation && (
        <ChatContactInfoDrawer
          conversation={activeConversation}
          messages={activeMessages}
          isOpen={showInfoDrawer}
          onClose={() => setShowInfoDrawer(false)}
          onStartAudioCall={user => startCallWithUser(user)}
          onTogglePin={togglePinConversation}
          onToggleMute={toggleMuteConversation}
          onImageClick={url => setLightboxImageUrl(url)}
          onJumpToMessage={scrollToMessage}
          allUsers={users}
          onViewProfile={userId => {
            setSelectedUserId(userId);
            setActiveView('profile');
          }}
          onViewStartup={startupId => {
            setSelectedStartupId(startupId);
            setActiveView('startup-details');
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: New Chat Modal                                      */}
      {/* ------------------------------------------------------------- */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        users={users}
        currentUserId={currentUser.id}
        onSelectUser={user => {
          startConversationWithUser(user);
          setShowNewChatModal(false);
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: Lightbox Image Viewer                                */}
      {/* ------------------------------------------------------------- */}
      {lightboxImageUrl && (
        <div
          id="media-lightbox-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setLightboxImageUrl(null)}
              className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImageUrl}
              alt="Expanded preview"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: Schedule Meeting Dialog                             */}
      {/* ------------------------------------------------------------- */}
      {showScheduleModal && (
        <div
          id="schedule-meeting-modal"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Propose Meeting Sync</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Meeting Topic</label>
                <input
                  type="text"
                  value={meetingTopic}
                  onChange={e => setMeetingTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Proposed Date</label>
                  <input
                    type="text"
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Proposed Time</label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendMeetingInvite}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
              >
                Send Invite Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
