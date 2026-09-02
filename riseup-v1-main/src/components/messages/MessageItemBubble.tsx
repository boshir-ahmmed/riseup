import React, { useState } from 'react';
import {
  Check,
  CheckCheck,
  FileText,
  Download,
  Calendar,
  Reply,
  Star,
  Copy,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  ZoomIn
} from 'lucide-react';
import { MessageItem, User } from '../../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';

const POPULAR_REACTIONS = ['❤️', '👍', '🔥', '🚀', '💡', '😂', '👏'];

interface MessageItemBubbleProps {
  message: MessageItem;
  isMine: boolean;
  currentUser: User;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: MessageItem) => void;
  onStar: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onRespondMeeting: (messageId: string, status: 'confirmed' | 'declined') => void;
  onImageClick?: (url: string) => void;
  onScrollToMessage?: (messageId: string) => void;
  searchHighlight?: string;
}

export const MessageItemBubble: React.FC<MessageItemBubbleProps> = ({
  message,
  isMine,
  currentUser,
  onReact,
  onReply,
  onStar,
  onDelete,
  onRespondMeeting,
  onImageClick,
  onScrollToMessage,
  searchHighlight
}) => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text highlight helper
  const renderHighlightedText = (text: string) => {
    if (!searchHighlight || !searchHighlight.trim()) {
      return text;
    }
    const parts = text.split(new RegExp(`(${searchHighlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchHighlight.toLowerCase() ? (
            <mark key={i} className="bg-amber-300 dark:bg-amber-500/50 text-slate-900 dark:text-white px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      id={`message-bubble-${message.id}`}
      className={`group relative flex gap-2.5 my-1.5 transition-all duration-200 ${
        isMine ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Incoming sender avatar */}
      {!isMine && (
        <div className="shrink-0 self-end mb-1">
          <img
            src={message.senderAvatar}
            alt={message.senderName}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover shadow-xs border border-slate-200 dark:border-slate-700"
          />
        </div>
      )}

      <div className={`relative max-w-[85%] sm:max-w-[72%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
        {/* Floating Quick Action Toolbar (WhatsApp/Messenger Style) */}
        <div
          className={`opacity-0 group-hover:opacity-100 transition-all duration-150 absolute -top-8 z-20 flex items-center gap-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-md rounded-full px-2 py-1 ${
            isMine ? 'right-2' : 'left-2'
          }`}
        >
          {/* Reaction Emojis */}
          <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1.5 mr-1">
            {POPULAR_REACTIONS.slice(0, 5).map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => onReact(message.id, emoji)}
                className="hover:scale-130 active:scale-95 transition-transform p-0.5 text-xs cursor-pointer"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Action Icons */}
          <button
            type="button"
            onClick={() => onReply(message)}
            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            title="Reply"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onStar(message.id)}
            className={`p-1 transition cursor-pointer ${
              message.isStarred
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-400 hover:text-amber-500'
            }`}
            title={message.isStarred ? 'Unstar message' : 'Star message'}
          >
            <Star className={`w-3.5 h-3.5 ${message.isStarred ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            title={copied ? 'Copied!' : 'Copy text'}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
            title="Delete message"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Message Bubble */}
        <div
          className={`relative p-3 rounded-2xl shadow-xs transition-shadow ${
            isMine
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
          }`}
        >
          {/* Quoted Message Preview (if reply) */}
          {message.replyTo && (
            <div
              onClick={() => message.replyTo?.id && onScrollToMessage && onScrollToMessage(message.replyTo.id)}
              className={`mb-2 p-2 rounded-xl text-xs border-l-4 cursor-pointer transition ${
                isMine
                  ? 'bg-indigo-800/60 border-indigo-300 text-indigo-100 hover:bg-indigo-800/80'
                  : 'bg-slate-100 dark:bg-slate-800 border-indigo-600 dark:border-indigo-400 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
              }`}
            >
              <p className="font-bold text-[11px] text-indigo-300 dark:text-indigo-400 truncate">
                {message.replyTo.senderName}
              </p>
              <p className="line-clamp-2 text-[11px] opacity-90">{message.replyTo.text}</p>
            </div>
          )}

          {/* Photo / Media Preview */}
          {message.mediaUrl && (
            <div className="mb-2 rounded-xl overflow-hidden border border-black/10 relative group/media cursor-pointer">
              <img
                src={message.mediaUrl}
                alt="Shared media"
                referrerPolicy="no-referrer"
                className="w-full max-h-64 object-cover rounded-xl transition-transform hover:scale-102"
                onClick={() => onImageClick && onImageClick(message.mediaUrl!)}
              />
              <div
                onClick={() => onImageClick && onImageClick(message.mediaUrl!)}
                className="absolute inset-0 bg-black/20 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5"
              >
                <ZoomIn className="w-4 h-4" />
                <span>View Full Size</span>
              </div>
            </div>
          )}

          {/* Voice Note Audio Component */}
          {message.voiceNote && (
            <div className="mb-1">
              <VoiceNotePlayer
                durationSec={message.voiceNote.durationSec}
                waveform={message.voiceNote.audioWaveform}
                isMine={isMine}
              />
            </div>
          )}

          {/* Document / Pitch Deck Attachment */}
          {message.attachmentName && (
            <div
              className={`p-2.5 rounded-xl flex items-center justify-between gap-3 border mb-2 ${
                isMine
                  ? 'bg-indigo-800/50 border-indigo-400/40 text-white'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-amber-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold truncate">{message.attachmentName}</p>
                  <p className="text-[10px] opacity-75">{message.attachmentSize || 'Verified PDF Document'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Downloaded file: ${message.attachmentName}`)}
                className={`p-2 rounded-lg transition shrink-0 cursor-pointer ${
                  isMine ? 'hover:bg-indigo-700 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400'
                }`}
                title="Download Attachment"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Text Body */}
          {message.text && !message.voiceNote && (
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
              {renderHighlightedText(message.text)}
            </p>
          )}

          {/* Meeting / Sync Card */}
          {message.meetingInvite && (
            <div
              className={`p-3 rounded-xl border space-y-2 mt-2 ${
                isMine
                  ? 'bg-indigo-800/60 border-indigo-400/30'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{message.meetingInvite.topic}</span>
              </div>
              <div className="text-[11px] opacity-90">
                📅 {message.meetingInvite.date} at {message.meetingInvite.time}
              </div>

              {message.meetingInvite.status === 'pending' ? (
                !isMine ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onRespondMeeting(message.id, 'confirmed')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition cursor-pointer"
                    >
                      Accept & Sync Calendar
                    </button>
                    <button
                      type="button"
                      onClick={() => onRespondMeeting(message.id, 'declined')}
                      className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-medium text-[11px] transition cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] opacity-75 italic">
                    Pending recipient confirmation...
                  </div>
                )
              ) : (
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{message.meetingInvite.status === 'confirmed' ? 'Meeting Confirmed & Synced' : 'Meeting Declined'}</span>
                </div>
              )}
            </div>
          )}

          {/* Message Meta Info: Timestamp, Starred status, and Double Blue Checkmarks */}
          <div
            className={`text-[10px] flex items-center justify-end gap-1.5 pt-1 mt-0.5 select-none ${
              isMine ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {message.isStarred && <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />}
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {isMine && (
              <span className="flex items-center ml-0.5">
                {message.status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-sky-300" title="Read (Double blue check)" />
                ) : message.status === 'delivered' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-indigo-300" title="Delivered" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-indigo-300" title="Sent" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Message Reactions Display (Bottom Pill) */}
        {hasReactions && (
          <div
            className={`flex flex-wrap gap-1 mt-0.5 z-10 ${
              isMine ? 'justify-end' : 'justify-start'
            }`}
          >
            {Object.entries(message.reactions!).map(([emoji, usersArr]) => {
              const reactionUsers = (usersArr || []) as string[];
              const isUserReacted = reactionUsers.includes(currentUser.name);

              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReact(message.id, emoji)}
                  className={`px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 border shadow-xs transition-transform active:scale-95 cursor-pointer ${
                    isUserReacted
                      ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                  title={reactionUsers.join(', ')}
                >
                  <span>{emoji}</span>
                  <span className="font-bold text-[10px]">{reactionUsers.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
