import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, PostComment, ReactionType } from '../../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  CornerDownRight,
  TrendingUp,
  Sparkles,
  Award,
  Users,
  Briefcase,
  DollarSign,
  Rocket,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Flame,
  Lightbulb,
  ThumbsUp,
  PhoneCall,
  User as UserIcon
} from 'lucide-react';
import { RoleBadge } from '../layout/RoleBadge';

interface PostCardProps {
  post: Post;
  onOpenDetails?: () => void;
}

const REACTION_CONFIGS: { type: ReactionType; label: string; emoji: string; icon: typeof ThumbsUp; color: string }[] = [
  { type: 'like', label: 'Like', emoji: '👍', icon: ThumbsUp, color: 'text-blue-500 hover:text-blue-600' },
  { type: 'celebrate', label: 'Celebrate', emoji: '🚀', icon: Rocket, color: 'text-emerald-500 hover:text-emerald-600' },
  { type: 'insightful', label: 'Insightful', emoji: '💡', icon: Lightbulb, color: 'text-amber-500 hover:text-amber-600' },
  { type: 'love', label: 'Love', emoji: '❤️', icon: Heart, color: 'text-rose-500 hover:text-rose-600' },
  { type: 'fire', label: 'Hot', emoji: '🔥', icon: Flame, color: 'text-orange-500 hover:text-orange-600' }
];

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenDetails }) => {
  const {
    currentUser,
    reactToPost,
    toggleBookmarkPost,
    addCommentToPost,
    addReplyToComment,
    toggleLikeComment,
    deletePost,
    setSelectedStartupId,
    setSelectedUserId,
    setActiveView,
    sendMessage,
    startCallWithUser,
    users
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSelectReaction = (type: ReactionType) => {
    reactToPost(post.id, type);
    setShowReactionPicker(false);
  };

  const handleBookmark = () => {
    toggleBookmarkPost(post.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToPost(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  const handleReplySubmit = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addReplyToComment(post.id, commentId, replyText);
    setReplyText('');
    setReplyingToId(null);
  };

  const getPostTypeBadge = (type: string) => {
    switch (type) {
      case 'milestone':
        return {
          label: 'Milestone Achieved',
          icon: Award,
          class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
        };
      case 'funding_update':
        return {
          label: 'Funding Round Update',
          icon: DollarSign,
          class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        };
      case 'hiring':
        return {
          label: 'We Are Hiring',
          icon: Users,
          class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        };
      case 'product_update':
        return {
          label: 'Product Release',
          icon: Rocket,
          class: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
        };
      default:
        return {
          label: 'Announcement',
          icon: Sparkles,
          class: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
        };
    }
  };

  const typeConfig = getPostTypeBadge(post.type);
  const TypeIcon = typeConfig.icon;
  const canDelete = currentUser.id === post.authorId || currentUser.role === 'admin';
  const authorUser = users.find(u => u.id === post.authorId);

  const activeReactionConfig = post.userReaction
    ? REACTION_CONFIGS.find(r => r.type === post.userReaction)
    : null;

  return (
    <article
      id={`post-card-${post.id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition duration-200 overflow-visible relative"
    >
      {/* Post Header */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Startup Logo with Click navigation */}
            <div
              onClick={() => {
                setSelectedStartupId(post.startupId);
                setActiveView('startup-details');
              }}
              className="relative cursor-pointer group"
              title={`View ${post.startupName} Details`}
            >
              <img
                src={post.startupLogo}
                alt={post.startupName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs group-hover:scale-105 transition"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUserId(post.authorId);
                  setActiveView('profile');
                }}
                className="absolute -bottom-1 -right-1 group/avatar cursor-pointer"
                title={`View ${post.authorName}'s Profile`}
              >
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-xs group-hover/avatar:ring-2 group-hover/avatar:ring-indigo-500 transition"
                />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedStartupId(post.startupId);
                    setActiveView('startup-details');
                  }}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition cursor-pointer"
                  title="View Startup Details"
                >
                  {post.startupName}
                </button>
                <RoleBadge role={post.authorRole} size="sm" showLabel={false} />
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {post.startupStage}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedUserId(post.authorId);
                    setActiveView('profile');
                  }}
                  className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer transition"
                  title="View User Profile"
                >
                  {post.authorName}
                </button>
                <span>•</span>
                <span>{post.authorTitle}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeConfig.class}`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              <span>{typeConfig.label}</span>
            </span>

            {/* Menu button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 top-8 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 text-xs z-30 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setShowMenu(false)}
                >
                  <button
                    onClick={() => {
                      setSelectedStartupId(post.startupId);
                      setActiveView('startup-details');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                    <span>View Startup Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUserId(post.authorId);
                      setActiveView('profile');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>View Author Profile</span>
                  </button>

                  {authorUser && authorUser.id !== currentUser.id && (
                    <>
                      <button
                        onClick={() => {
                          sendMessage(authorUser.id, `Hi ${authorUser.name}, saw your update on ${post.startupName}! Would love to connect.`);
                          setActiveView('messages');
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center gap-2 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Direct Message</span>
                      </button>

                      <button
                        onClick={() => startCallWithUser(authorUser)}
                        className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center gap-2 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Encrypted Audio Call</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleBookmark}
                    className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                    <span>{post.isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}</span>
                  </button>

                  {canDelete && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 sm:px-5 pb-3">
        {post.title && (
          <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2 leading-snug">
            {post.title}
          </h4>
        )}
        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media attachment */}
      {post.mediaUrl && (
        <div className="relative mt-2 bg-slate-950 border-y border-slate-200 dark:border-slate-800">
          <img
            src={post.mediaUrl}
            alt={post.title || 'Startup media'}
            referrerPolicy="no-referrer"
            className="w-full max-h-96 object-cover hover:opacity-95 transition"
          />
        </div>
      )}

      {/* Interaction Metrics Bar */}
      <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          {/* Reaction icons stack */}
          <div className="flex items-center -space-x-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/10 text-[11px]">👍</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-[11px]">🚀</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/10 text-[11px]">❤️</span>
          </div>

          <span className="font-medium text-slate-700 dark:text-slate-300">
            <strong>{post.likesCount}</strong> {post.likesCount === 1 ? 'reaction' : 'reactions'}
          </span>

          <span>•</span>

          <span
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <strong>{post.commentsCount}</strong> {post.commentsCount === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span>{post.viewsCount} views</span>
          <span>•</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Action Buttons Row with Real-Time Reaction Bar */}
      <div className="px-3 sm:px-4 py-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-around text-xs font-semibold relative">
        {/* Floating Multi-Reaction Tray */}
        {showReactionPicker && (
          <div
            id={`reaction-picker-tray-${post.id}`}
            className="absolute bottom-11 left-3 bg-white dark:bg-slate-850 shadow-2xl border border-slate-200 dark:border-slate-750 rounded-full py-1.5 px-3 flex items-center gap-2 z-40 animate-in slide-in-from-bottom-2 fade-in duration-150"
            onMouseLeave={() => setShowReactionPicker(false)}
          >
            {REACTION_CONFIGS.map(reaction => (
              <button
                key={reaction.type}
                onClick={() => handleSelectReaction(reaction.type)}
                className="hover:scale-125 transform transition duration-150 p-1 text-base flex flex-col items-center cursor-pointer group"
                title={reaction.label}
              >
                <span>{reaction.emoji}</span>
              </button>
            ))}
          </div>
        )}

        {/* Reaction Button */}
        <button
          id={`post-like-btn-${post.id}`}
          onClick={() => handleSelectReaction(post.userReaction || 'like')}
          onMouseEnter={() => setShowReactionPicker(true)}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            post.userReaction
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {activeReactionConfig ? (
            <span className="text-sm">{activeReactionConfig.emoji}</span>
          ) : (
            <ThumbsUp className="w-4 h-4" />
          )}
          <span>{activeReactionConfig ? activeReactionConfig.label : 'Like'}</span>
        </button>

        <button
          id={`post-comment-btn-${post.id}`}
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button
          id={`post-share-btn-${post.id}`}
          onClick={handleShare}
          className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
        </button>

        <button
          id={`post-bookmark-btn-${post.id}`}
          onClick={handleBookmark}
          className={`p-2 rounded-lg transition cursor-pointer ${
            post.isBookmarked
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Save post"
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-slate-50/70 dark:bg-slate-950/50 p-4 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-200">
          {/* Quick Comment Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2.5 text-[11px] no-scrollbar">
            {[
              'Congrats on the traction! 🚀',
              'Reviewing your pitch deck now 📄',
              'Would love to sync on advisory! 💡',
              'Impressive MoM growth 📈'
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCommentText(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-500 transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Write comment */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2.5 mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={`Comment as ${currentUser.name} (${currentUser.role})...`}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-3">
                No comments yet. Start the conversation!
              </p>
            ) : (
              post.comments.map(c => (
                <div key={c.id} className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.userName}
                          </span>
                          <RoleBadge role={c.userRole} size="sm" showLabel={false} />
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{c.content}</p>

                      {/* Comment Actions */}
                      <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <button
                          onClick={() => toggleLikeComment(post.id, c.id)}
                          className={`flex items-center gap-1 hover:text-rose-500 cursor-pointer ${
                            c.isLiked ? 'text-rose-500 font-bold' : ''
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${c.isLiked ? 'fill-rose-500' : ''}`} />
                          <span>{c.likes > 0 ? c.likes : 'Like'}</span>
                        </button>

                        <button
                          onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nested Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="pl-9 space-y-2">
                      {c.replies.map(r => (
                        <div key={r.id} className="flex items-start gap-2">
                          <CornerDownRight className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                          <img
                            src={r.userAvatar}
                            alt={r.userName}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {r.userName}
                              </span>
                              <RoleBadge role={r.userRole} size="sm" showLabel={false} />
                            </div>
                            <p className="text-slate-700 dark:text-slate-200">{r.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Reply Form */}
                  {replyingToId === c.id && (
                    <form
                      onSubmit={e => handleReplySubmit(c.id, e)}
                      className="pl-9 flex gap-2 pt-1 animate-in fade-in duration-100"
                    >
                      <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={`Reply to ${c.userName}...`}
                        className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Reply
                      </button>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
};

