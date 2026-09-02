import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Startup,
  Post,
  NotificationItem,
  Conversation,
  MessageItem,
  InvestorRequest,
  MentorRequest,
  Category,
  SystemAuditLog,
  UserRole,
  PostComment,
  CommentReply,
  ReactionType,
  ToastNotification,
  FounderPitch
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STARTUPS,
  INITIAL_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_INVESTOR_REQUESTS,
  INITIAL_MENTOR_REQUESTS,
  INITIAL_CATEGORIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLATFORM_STATS,
  INITIAL_FOUNDER_PITCHES
} from '../data/mockData';
import { soundManager } from '../utils/soundEffects';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  startups: Startup[];
  posts: Post[];
  notifications: NotificationItem[];
  conversations: Conversation[];
  messages: MessageItem[];
  investorRequests: InvestorRequest[];
  mentorRequests: MentorRequest[];
  founderPitches: FounderPitch[];
  sendFounderPitch: (pitchData: Omit<FounderPitch, 'id' | 'createdAt' | 'status'>) => FounderPitch;
  respondToFounderPitch: (pitchId: string, status: 'accepted' | 'declined' | 'in_discussion') => void;
  pitchFounderModalTarget: User | null;
  setPitchFounderModalTarget: (user: User | null) => void;
  exploreTab: 'startups' | 'founders';
  setExploreTab: (tab: 'startups' | 'founders') => void;
  categories: Category[];
  auditLogs: SystemAuditLog[];
  platformStats: typeof INITIAL_PLATFORM_STATS;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Navigation & Active View
  activeView: string;
  setActiveView: (view: string) => void;
  selectedStartupId: string | null;
  setSelectedStartupId: (id: string | null) => void;
  selectedPostId: string | null;
  setSelectedPostId: (id: string | null) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedIndustryFilter: string;
  setSelectedIndustryFilter: (ind: string) => void;
  selectedStageFilter: string;
  setSelectedStageFilter: (stage: string) => void;
  
  // Actions - Posts
  addPost: (post: Partial<Post>) => void;
  toggleLikePost: (postId: string) => void;
  reactToPost: (postId: string, reactionType: ReactionType) => void;
  toggleBookmarkPost: (postId: string) => void;
  addCommentToPost: (postId: string, content: string) => void;
  addReplyToComment: (postId: string, commentId: string, content: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  deletePost: (postId: string) => void;
  
  // Actions - Startups & Pitching
  createStartup: (startupData: Partial<Startup>) => Startup;
  updateStartup: (startupId: string, data: Partial<Startup>) => void;
  toggleSaveStartup: (startupId: string) => void;
  expressInvestorInterest: (startupId: string, checkSize: number, note: string) => void;
  pitchStartupToInvestor: (startupId: string, investorId: string, pitchSummary: string, requestedCheck: number) => void;
  joinStartupAsInvestor: (startupId: string) => void;
  sendMentorRequest: (startupId: string, areasOfHelp: string[], message: string) => boolean;
  respondToMentorRequest: (requestId: string, accept: boolean) => void;
  respondToInvestorRequest: (requestId: string, accept: boolean) => void;
  
  // Actions - Messages & Real-time Chat
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (recipientId: string, text: string, attachmentName?: string, options?: Partial<MessageItem>) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  respondToMeetingInvite: (messageId: string, status: 'confirmed' | 'declined') => void;
  deleteMessage: (messageId: string) => void;
  toggleStarMessage: (messageId: string) => void;
  togglePinConversation: (convId: string) => void;
  toggleMuteConversation: (convId: string) => void;
  startConversationWithUser: (user: User) => void;
  isTyping: boolean;
  typingUser: string | null;
  
  // Audio / Video Call Simulation
  activeCallUser: User | null;
  startCallWithUser: (user: User) => void;
  endCall: () => void;
  
  // Actions - Notifications & Real-Time Toasts
  toasts: ToastNotification[];
  showToast: (title: string, message: string, type?: ToastNotification['type'], senderAvatar?: string) => void;
  dismissToast: (id: string) => void;
  soundMuted: boolean;
  toggleSoundMute: () => boolean;
  markAllNotificationsAsRead: () => void;
  broadcastSystemNotification: (title: string, message: string) => void;
  
  // Actions - Admin
  updateUserProfile: (data: Partial<User>) => void;
  updateUserStatus: (userId: string, status: 'active' | 'pending' | 'suspended') => void;
  verifyStartup: (startupId: string) => void;
  deleteUser: (userId: string) => void;
  addCategory: (name: string, icon: string) => void;
  deleteCategory: (id: string) => void;
  
  // Auth Simulation & Gating
  isLoggedIn: boolean;
  login: (email?: string, password?: string) => boolean;
  loginWithRole: (role: UserRole) => void;
  loginWithUser: (user: User) => void;
  registerUser: (name: string, email: string, role: UserRole, password?: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  
  // Misc
  savedStartupIds: string[];
  bookmarkedPostIds: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'riseup_ecosystem_v2_auth_state';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or use defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_currUser');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Sarah Chen (Founder) by default
  });

  const [startups, setStartups] = useState<Startup[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_startups');
    return saved ? JSON.parse(saved) : INITIAL_STARTUPS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<MessageItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [investorRequests, setInvestorRequests] = useState<InvestorRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_invRequests');
    return saved ? JSON.parse(saved) : INITIAL_INVESTOR_REQUESTS;
  });

  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_menRequests');
    return saved ? JSON.parse(saved) : INITIAL_MENTOR_REQUESTS;
  });

  const [founderPitches, setFounderPitches] = useState<FounderPitch[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_founderPitches');
    return saved ? JSON.parse(saved) : INITIAL_FOUNDER_PITCHES;
  });

  const [pitchFounderModalTarget, setPitchFounderModalTarget] = useState<User | null>(null);
  const [exploreTab, setExploreTab] = useState<'startups' | 'founders'>('founders');

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [platformStats] = useState(INITIAL_PLATFORM_STATS);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Navigation states
  const [activeView, setActiveView] = useState<string>('feed');
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState('All');
  const [selectedStageFilter, setSelectedStageFilter] = useState('All');

  // Bookmarks and Saved
  const [savedStartupIds, setSavedStartupIds] = useState<string[]>(['startup-1', 'startup-3']);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>(['post-1']);

  // Auth states & Gating: Default strictly to false so everyone must log in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_isLoggedIn');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Real-time Chat & Interaction states
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [activeCallUser, setActiveCallUser] = useState<User | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(() => soundManager.getMuted());
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const toggleSoundMute = () => {
    const muted = soundManager.toggleMute();
    setSoundMuted(muted);
    return muted;
  };

  const showToast = (
    title: string,
    message: string,
    type: ToastNotification['type'] = 'info',
    senderAvatar?: string
  ) => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      senderAvatar,
      timestamp: Date.now()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    if (type === 'deal' || type === 'success') {
      soundManager.playSuccess();
    } else if (type === 'message') {
      soundManager.playChime();
    } else {
      soundManager.playPop();
    }

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const startCallWithUser = (user: User) => {
    setActiveCallUser(user);
    soundManager.playPop();
    showToast(`Calling ${user.name}...`, 'Live encrypted peer audio connection initiated.', 'message', user.avatar);
  };

  const endCall = () => {
    setActiveCallUser(null);
    soundManager.playPop();
  };

  // Persist key states
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_currUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_startups', JSON.stringify(startups));
  }, [startups]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_invRequests', JSON.stringify(investorRequests));
  }, [investorRequests]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_menRequests', JSON.stringify(mentorRequests));
  }, [mentorRequests]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_founderPitches', JSON.stringify(founderPitches));
  }, [founderPitches]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      // Auto switch view to relevant dashboard if currently on a dashboard
      if (role === 'founder') setActiveView('founder-dashboard');
      else if (role === 'investor') setActiveView('investor-dashboard');
      else if (role === 'mentor') setActiveView('mentor-dashboard');
      else if (role === 'admin') setActiveView('admin-dashboard');
    }
  };

  const login = (email?: string, _password?: string): boolean => {
    if (!email || !email.trim()) {
      setIsLoggedIn(true);
      showToast(`Welcome back, ${currentUser.name}!`, `Signed in as ${currentUser.role}.`, 'success');
      return true;
    }
    const cleanEmail = email.trim().toLowerCase();
    const match = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (match) {
      setCurrentUser(match);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      showToast(`Welcome back, ${match.name}!`, `Signed in as ${match.role.toUpperCase()}.`, 'success');
      if (match.role === 'founder') setActiveView('founder-dashboard');
      else if (match.role === 'investor') setActiveView('investor-dashboard');
      else if (match.role === 'mentor') setActiveView('mentor-dashboard');
      else if (match.role === 'admin') setActiveView('admin-dashboard');
      else setActiveView('feed');
      return true;
    }

    // Fuzzy match by name or role keyword
    const fuzzyMatch = users.find(u =>
      u.name.toLowerCase().includes(cleanEmail) ||
      cleanEmail.includes(u.role)
    );
    if (fuzzyMatch) {
      setCurrentUser(fuzzyMatch);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      showToast(`Welcome back, ${fuzzyMatch.name}!`, `Signed in as ${fuzzyMatch.role.toUpperCase()}.`, 'success');
      if (fuzzyMatch.role === 'founder') setActiveView('founder-dashboard');
      else if (fuzzyMatch.role === 'investor') setActiveView('investor-dashboard');
      else if (fuzzyMatch.role === 'mentor') setActiveView('mentor-dashboard');
      else if (fuzzyMatch.role === 'admin') setActiveView('admin-dashboard');
      else setActiveView('feed');
      return true;
    }

    return false;
  };

  const loginWithRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      showToast(`Signed In as ${targetUser.name}`, `Active Persona: ${targetUser.role.toUpperCase()}`, 'success');
      if (role === 'founder') setActiveView('founder-dashboard');
      else if (role === 'investor') setActiveView('investor-dashboard');
      else if (role === 'mentor') setActiveView('mentor-dashboard');
      else if (role === 'admin') setActiveView('admin-dashboard');
    }
  };

  const loginWithUser = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    showToast(`Signed In as ${user.name}`, `Active Persona: ${user.role.toUpperCase()}`, 'success');
    if (user.role === 'founder') setActiveView('founder-dashboard');
    else if (user.role === 'investor') setActiveView('investor-dashboard');
    else if (user.role === 'mentor') setActiveView('mentor-dashboard');
    else if (user.role === 'admin') setActiveView('admin-dashboard');
    else setActiveView('feed');
  };

  const registerUser = (name: string, email: string, role: UserRole, _password?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 900000)}?w=150&auto=format&fit=crop&q=80`,
      title: role === 'founder' ? 'Founder & CEO' : role === 'investor' ? 'Venture Investor' : role === 'mentor' ? 'Startup Advisor & Mentor' : 'Platform Administrator',
      location: 'San Francisco, CA, USA',
      bio: `Verified ${role} on RiseUp ecosystem connecting high-impact founders, accredited capital, and active advisory.`,
      isVerified: true,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      profileCompletion: 85,
      achievements: ['Verified RiseUp Member', 'Early Ecosystem Pioneer'],
      ...(role === 'investor' ? {
        investmentInterests: ['Artificial Intelligence', 'B2B SaaS', 'FinTech'],
        preferredIndustries: ['AI', 'FinTech', 'HealthTech'],
        preferredStages: ['Seed', 'Series A'],
        investmentRange: { min: 50000, max: 500000 },
        portfolioCount: 0
      } : {}),
      ...(role === 'mentor' ? {
        mentorSkills: ['Product Strategy', 'Fundraising', 'Growth Marketing'],
        mentorExperienceYears: 10,
        mentorIndustries: ['AI / API', 'B2B SaaS'],
        mentorAvailability: 'Available (Accepting Startups)',
        mentorRating: 5.0,
        mentorReviewCount: 0
      } : {})
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    showToast(`Account Created!`, `Welcome to RiseUp, ${name}.`, 'success');

    if (role === 'founder') setActiveView('founder-dashboard');
    else if (role === 'investor') setActiveView('investor-dashboard');
    else if (role === 'mentor') setActiveView('mentor-dashboard');
    else if (role === 'admin') setActiveView('admin-dashboard');
    else setActiveView('feed');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveConversationId(null);
    setShowAuthModal(false);
    showToast('Signed Out', 'You have been signed out. Please login to continue.', 'info');
  };

  // Posts operations
  const addPost = (postData: Partial<Post>) => {
    let startupInfo = startups.find(s => s.id === currentUser.startupId) || startups[0];
    const newPost: Post = {
      id: `post-${Date.now()}`,
      startupId: startupInfo.id,
      startupName: startupInfo.name,
      startupLogo: startupInfo.logo,
      startupStage: startupInfo.stage,
      startupIndustry: startupInfo.industry,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorTitle: currentUser.title,
      type: postData.type || 'announcement',
      title: postData.title,
      content: postData.content || '',
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType || (postData.mediaUrl ? 'image' : 'none'),
      tags: postData.tags || ['#StartupUpdate', `#${startupInfo.industry.replace(/\s+/g, '')}`],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      bookmarksCount: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [newPost, ...prev]);
    soundManager.playSuccess();
    showToast('Post Published', `Your post has been broadcast to the ecosystem feed.`, 'info');

    // Add notification to admin
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: 'user-admin',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      type: 'comment',
      title: 'New Post Published',
      message: `${currentUser.name} published a new ${newPost.type} post for ${startupInfo.name}.`,
      targetId: newPost.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const reactToPost = (postId: string, reactionType: ReactionType) => {
    soundManager.playReaction();

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const currentReaction = p.userReaction;
          const currentCounts = p.reactions || {
            like: Math.max(1, p.likesCount),
            celebrate: 0,
            insightful: 0,
            love: 0,
            fire: 0
          };

          if (currentReaction === reactionType) {
            // Remove reaction
            const newCounts = {
              ...currentCounts,
              [reactionType]: Math.max(0, currentCounts[reactionType] - 1)
            };
            const totalLikes = Object.values(newCounts).reduce((a: number, b: number) => a + b, 0);
            return {
              ...p,
              userReaction: null,
              isLiked: false,
              likesCount: totalLikes,
              reactions: newCounts
            };
          } else {
            // Switch reaction or add new
            const newCounts = { ...currentCounts };
            if (currentReaction) {
              newCounts[currentReaction] = Math.max(0, newCounts[currentReaction] - 1);
            }
            newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
            const totalLikes = Object.values(newCounts).reduce((a: number, b: number) => a + b, 0);

            return {
              ...p,
              userReaction: reactionType,
              isLiked: true,
              likesCount: totalLikes,
              reactions: newCounts
            };
          }
        }
        return p;
      })
    );

    // Notify author if not self
    const targetPost = posts.find(p => p.id === postId);
    if (targetPost && targetPost.authorId !== currentUser.id) {
      const emojiMap = { like: '👍', celebrate: '🚀', insightful: '💡', love: '❤️', fire: '🔥' };
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        recipientId: targetPost.authorId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        type: 'like',
        title: 'New Reaction on Your Post',
        message: `${currentUser.name} reacted with ${emojiMap[reactionType]} to "${targetPost.title || 'Startup Update'}".`,
        targetId: postId,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const toggleLikePost = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (target?.userReaction) {
      reactToPost(postId, target.userReaction);
    } else {
      reactToPost(postId, 'like');
    }
  };

  const toggleBookmarkPost = (postId: string) => {
    soundManager.playPop();
    setBookmarkedPostIds(prev => {
      if (prev.includes(postId)) {
        showToast('Bookmark Removed', 'Post removed from saved items.', 'info');
        return prev.filter(id => id !== postId);
      } else {
        showToast('Post Bookmarked', 'Saved to your private reading list.', 'info');
        return [...prev, postId];
      }
    });

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isBookmarked = !p.isBookmarked;
          return {
            ...p,
            isBookmarked,
            bookmarksCount: isBookmarked ? p.bookmarksCount + 1 : Math.max(0, p.bookmarksCount - 1)
          };
        }
        return p;
      })
    );
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    soundManager.playPop();
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map(c => {
              if (c.id === commentId) {
                const isLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked,
                  likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
                };
              }
              // Check replies
              return {
                ...c,
                replies: c.replies.map(r => {
                  if (r.id === commentId) {
                    const isLiked = !r.isLiked;
                    return {
                      ...r,
                      isLiked,
                      likes: isLiked ? r.likes + 1 : Math.max(0, r.likes - 1)
                    };
                  }
                  return r;
                })
              };
            })
          };
        }
        return p;
      })
    );
  };

  const addCommentToPost = (postId: string, content: string) => {
    if (!content.trim()) return;
    soundManager.playPop();

    const newComment: PostComment = {
      id: `c-${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      userTitle: currentUser.title,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );

    showToast('Comment Posted', 'Your reply is live in the discussion.', 'info');

    // Notify post author if not self
    const targetPost = posts.find(p => p.id === postId);
    if (targetPost && targetPost.authorId !== currentUser.id) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        recipientId: targetPost.authorId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        type: 'comment',
        title: 'New Comment on Your Post',
        message: `${currentUser.name} commented on your post "${targetPost.title || 'Startup Update'}".`,
        targetId: postId,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }

    // Real-time simulated peer interaction after 2.8s
    if (targetPost) {
      setTimeout(() => {
        const potentialPeers = users.filter(u => u.id !== currentUser.id && u.id !== 'user-admin');
        const peer = potentialPeers[Math.floor(Math.random() * potentialPeers.length)] || users[2];
        const peerReplyText =
          peer.role === 'investor'
            ? `Great insights @${currentUser.name}. We are monitoring this space closely from our seed fund.`
            : peer.role === 'mentor'
            ? `Spot on point @${currentUser.name}! The execution cadence here is critical for early scale.`
            : `Thanks for the valuable feedback @${currentUser.name}, really appreciate this perspective!`;

        const autoReply: CommentReply = {
          id: `r-peer-${Date.now()}`,
          postId,
          commentId: newComment.id,
          userId: peer.id,
          userName: peer.name,
          userAvatar: peer.avatar,
          userRole: peer.role,
          userTitle: peer.title,
          content: peerReplyText,
          createdAt: new Date().toISOString(),
          likes: 1,
          isLiked: false
        };

        setPosts(prevPosts =>
          prevPosts.map(postItem => {
            if (postItem.id === postId) {
              return {
                ...postItem,
                commentsCount: postItem.commentsCount + 1,
                comments: postItem.comments.map(c => {
                  if (c.id === newComment.id) {
                    return {
                      ...c,
                      replies: [...c.replies, autoReply]
                    };
                  }
                  return c;
                })
              };
            }
            return postItem;
          })
        );

        showToast(
          `New reply from ${peer.name}`,
          peerReplyText.length > 55 ? `${peerReplyText.substring(0, 55)}...` : peerReplyText,
          'message',
          peer.avatar
        );
      }, 3000);
    }
  };

  const addReplyToComment = (postId: string, commentId: string, content: string) => {
    if (!content.trim()) return;
    soundManager.playPop();

    const newReply: CommentReply = {
      id: `r-${Date.now()}`,
      postId,
      commentId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      userTitle: currentUser.title,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: p.comments.map(c => {
              if (c.id === commentId) {
                return {
                  ...c,
                  replies: [...c.replies, newReply]
                };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    const audit: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName: currentUser.name,
      action: 'DELETED_POST',
      targetType: 'Post',
      targetName: `Post ${postId}`,
      details: 'Post removed from ecosystem feed by authorized user/admin.',
      severity: 'warning'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // Startups operations
  const createStartup = (startupData: Partial<Startup>): Startup => {
    const newStartup: Startup = {
      id: `startup-${Date.now()}`,
      name: startupData.name || 'Untitled Startup',
      tagline: startupData.tagline || 'Revolutionizing the industry with cutting-edge technology',
      logo: startupData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      coverImage: startupData.coverImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      founderId: currentUser.id,
      founderName: currentUser.name,
      founderAvatar: currentUser.avatar,
      industry: startupData.industry || 'Artificial Intelligence',
      subIndustry: startupData.subIndustry || 'Applied AI',
      location: startupData.location || currentUser.location || 'San Francisco, CA, USA',
      country: startupData.country || 'United States',
      website: startupData.website || 'https://example.com',
      foundedYear: startupData.foundedYear || new Date().getFullYear(),
      stage: startupData.stage || 'Seed',
      businessModel: startupData.businessModel || 'B2B SaaS',
      story: startupData.story || 'Founded with a mission to deliver game-changing value.',
      vision: startupData.vision || 'Empowering millions with innovative solutions.',
      mission: startupData.mission || 'Building best-in-class product infrastructure.',
      problem: startupData.problem || 'Existing legacy workflows are inefficient and costly.',
      solution: startupData.solution || 'Our platform automates core operations with 10x ROI.',
      marketSize: startupData.marketSize || '$10 Billion Global Market',
      targetCustomers: startupData.targetCustomers || 'Enterprise and Mid-Market companies',
      fundingGoal: startupData.fundingGoal || 1000000,
      fundingRaised: startupData.fundingRaised || 100000,
      valuation: startupData.valuation || 5000000,
      equityOffered: startupData.equityOffered || 15,
      minInvestment: startupData.minInvestment || 25000,
      revenueMRR: startupData.revenueMRR || 15000,
      growthRatePercent: startupData.growthRatePercent || 20,
      pitchDeckName: startupData.pitchDeckName || 'Pitch_Deck_2025.pdf',
      gallery: startupData.gallery || [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'
      ],
      teamMembers: startupData.teamMembers || [
        {
          id: `tm-${Date.now()}`,
          name: currentUser.name,
          position: 'Founder & CEO',
          photo: currentUser.avatar,
          education: 'Stanford University',
          experience: '10+ Years Building High-Growth Products',
          skills: ['Leadership', 'Product Vision', 'Fundraising'],
          bio: currentUser.bio
        }
      ],
      milestones: startupData.milestones || [
        {
          id: `m-${Date.now()}`,
          title: 'Platform Public Beta Launch',
          date: new Date().toISOString().split('T')[0],
          description: 'Launched initial product to early access beta cohort.',
          status: 'completed'
        }
      ],
      techStack: startupData.techStack || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AI Engine'],
      tags: startupData.tags || ['Innovation', 'Startup', 'High Growth'],
      interestedInvestorIds: [],
      joinedInvestorIds: [],
      viewsCount: 120,
      likesCount: 15,
      savedCount: 5,
      isFeatured: false,
      isVerified: false,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setStartups(prev => [newStartup, ...prev]);

    // Link startup to founder
    setCurrentUser(prev => ({ ...prev, startupId: newStartup.id }));
    setUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, startupId: newStartup.id } : u))
    );

    return newStartup;
  };

  const updateStartup = (startupId: string, data: Partial<Startup>) => {
    setStartups(prev =>
      prev.map(s => (s.id === startupId ? { ...s, ...data } : s))
    );
  };

  const toggleSaveStartup = (startupId: string) => {
    setSavedStartupIds(prev => {
      const exists = prev.includes(startupId);
      const next = exists ? prev.filter(id => id !== startupId) : [...prev, startupId];

      setStartups(sList =>
        sList.map(s => {
          if (s.id === startupId) {
            return {
              ...s,
              savedCount: exists ? Math.max(0, s.savedCount - 1) : s.savedCount + 1
            };
          }
          return s;
        })
      );

      return next;
    });
  };

  const expressInvestorInterest = (startupId: string, checkSize: number, note: string) => {
    const targetStartup = startups.find(s => s.id === startupId);
    if (!targetStartup) return;

    const newRequest: InvestorRequest = {
      id: `req-inv-${Date.now()}`,
      investorId: currentUser.id,
      investorName: currentUser.name,
      investorAvatar: currentUser.avatar,
      investorCompany: currentUser.company || 'Venture Syndicate',
      startupId,
      startupName: targetStartup.name,
      founderId: targetStartup.founderId,
      checkSizeOffering: checkSize,
      note,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setInvestorRequests(prev => [newRequest, ...prev]);

    // Update startup interested investors list
    setStartups(prev =>
      prev.map(s => {
        if (s.id === startupId && !s.interestedInvestorIds.includes(currentUser.id)) {
          return {
            ...s,
            interestedInvestorIds: [...s.interestedInvestorIds, currentUser.id]
          };
        }
        return s;
      })
    );

    // Notify founder
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: targetStartup.founderId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      type: 'investor_interest',
      title: 'New Investor Interest Expressed',
      message: `${currentUser.name} (${currentUser.company || 'Investor'}) expressed interest in ${targetStartup.name} with a potential $${checkSize.toLocaleString()} ticket.`,
      targetId: startupId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    soundManager.playSuccess();
    showToast(
      'Interest Registered!',
      `You expressed $${checkSize.toLocaleString()} allocation interest in ${targetStartup.name}.`,
      'deal'
    );
  };

  const pitchStartupToInvestor = (
    startupId: string,
    investorId: string,
    pitchSummary: string,
    requestedCheck: number
  ) => {
    const targetStartup = startups.find(s => s.id === startupId);
    const investor = users.find(u => u.id === investorId);
    if (!targetStartup || !investor) return;

    soundManager.playSuccess();

    const newReq: InvestorRequest = {
      id: `req-pitch-${Date.now()}`,
      investorId,
      investorName: investor.name,
      investorAvatar: investor.avatar,
      investorCompany: investor.company || 'Angel Partner',
      startupId,
      startupName: targetStartup.name,
      founderId: targetStartup.founderId,
      checkSizeOffering: requestedCheck,
      note: pitchSummary,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setInvestorRequests(prev => [newReq, ...prev]);

    // Send formatted pitch message directly in conversation thread
    const pitchMessageText = `🚀 Direct Pitch: ${targetStartup.name} (${targetStartup.stage})\n\nRequested Allocation: $${requestedCheck.toLocaleString()}\nElevator Pitch: ${pitchSummary}\n\nKey Metrics: ${targetStartup.mrr ? `$${targetStartup.mrr.toLocaleString()} MRR` : 'Active Growth'}, ${targetStartup.growthRate || '+34% MoM'}. Pitch Deck & Financial Model attached for due diligence.`;

    sendMessage(investorId, pitchMessageText, `${targetStartup.name.replace(/\s+/g, '_')}_Pitch_Deck_2026.pdf`);

    showToast(
      'Pitch Dispatched!',
      `Direct investment inquiry sent to ${investor.name}.`,
      'deal',
      investor.avatar
    );
  };

  const joinStartupAsInvestor = (startupId: string) => {
    soundManager.playSuccess();
    setStartups(prev =>
      prev.map(s => {
        if (s.id === startupId) {
          const joined = s.joinedInvestorIds.includes(currentUser.id)
            ? s.joinedInvestorIds
            : [...s.joinedInvestorIds, currentUser.id];
          return {
            ...s,
            joinedInvestorIds: joined,
            fundingRaised: s.fundingRaised + (s.minInvestment || 50000)
          };
        }
        return s;
      })
    );

    const st = startups.find(s => s.id === startupId);
    showToast(
      'Syndicate Ticket Joined!',
      `You joined the investor syndicate for ${st?.name || 'the startup'}.`,
      'deal'
    );
  };

  const sendMentorRequest = (startupId: string, areasOfHelp: string[], message: string): boolean => {
    // Check 1-mentor rule: A mentor can actively mentor ONLY 1 startup at a time
    if (currentUser.role === 'mentor') {
      const alreadyMentoring = startups.find(s => s.assignedMentorId === currentUser.id);
      if (alreadyMentoring && alreadyMentoring.id !== startupId) {
        alert(`Rule Enforced: As a Mentor, you can actively mentor only ONE startup at a time. You are currently mentoring ${alreadyMentoring.name}.`);
        return false;
      }
    }

    const targetStartup = startups.find(s => s.id === startupId);
    if (!targetStartup) return false;

    const newReq: MentorRequest = {
      id: `req-men-${Date.now()}`,
      mentorId: currentUser.id,
      mentorName: currentUser.name,
      mentorAvatar: currentUser.avatar,
      mentorTitle: currentUser.title,
      startupId,
      startupName: targetStartup.name,
      founderId: targetStartup.founderId,
      areasOfHelp,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setMentorRequests(prev => [newReq, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: targetStartup.founderId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      type: 'mentor_request',
      title: 'New Mentorship Collaboration Request',
      message: `${currentUser.name} offered advisory mentorship to ${targetStartup.name}.`,
      targetId: startupId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    soundManager.playSuccess();
    showToast('Mentor Request Sent', `Offered mentorship guidance to ${targetStartup.name}.`, 'mentor');
    return true;
  };

  const respondToMentorRequest = (requestId: string, accept: boolean) => {
    const req = mentorRequests.find(r => r.id === requestId);
    if (!req) return;

    setMentorRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: accept ? 'accepted' : 'declined' } : r))
    );

    if (accept) {
      soundManager.playSuccess();
      // Assign mentor to startup (1 mentor rule)
      setStartups(prev =>
        prev.map(s => {
          if (s.id === req.startupId) {
            return {
              ...s,
              assignedMentorId: req.mentorId,
              assignedMentorName: req.mentorName
            };
          }
          return s;
        })
      );

      // Update mentor user record
      setUsers(prev =>
        prev.map(u => (u.id === req.mentorId ? { ...u, activeMentoredStartupId: req.startupId, mentorAvailability: 'At Capacity (1/1 Startup)' } : u))
      );
    }

    // Notify mentor
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: req.mentorId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      type: accept ? 'mentor_accepted' : 'mentor_declined',
      title: accept ? 'Mentorship Request Accepted!' : 'Mentorship Request Update',
      message: `${currentUser.name} has ${accept ? 'accepted' : 'declined'} your advisory mentorship for ${req.startupName}.`,
      targetId: req.startupId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const respondToInvestorRequest = (requestId: string, accept: boolean) => {
    const req = investorRequests.find(r => r.id === requestId);
    if (!req) return;

    setInvestorRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: accept ? 'accepted' : 'declined' } : r))
    );

    if (accept) {
      soundManager.playSuccess();
      setStartups(prev =>
        prev.map(s => {
          if (s.id === req.startupId) {
            const joined = s.joinedInvestorIds.includes(req.investorId)
              ? s.joinedInvestorIds
              : [...s.joinedInvestorIds, req.investorId];
            return {
              ...s,
              joinedInvestorIds: joined,
              fundingRaised: s.fundingRaised + req.checkSizeOffering
            };
          }
          return s;
        })
      );

      showToast(
        'Investor Ticket Accepted!',
        `Added $${req.checkSizeOffering.toLocaleString()} to ${req.startupName} round.`,
        'deal'
      );
    }

    // Notify investor
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: req.investorId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      type: 'connection',
      title: accept ? 'Investor Request Accepted' : 'Investor Request Update',
      message: `${currentUser.name} ${accept ? 'accepted your interest' : 'declined the request'} for ${req.startupName}. Data room access granted.`,
      targetId: req.startupId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const sendFounderPitch = (
    pitchData: Omit<FounderPitch, 'id' | 'createdAt' | 'status'>
  ): FounderPitch => {
    const newPitch: FounderPitch = {
      ...pitchData,
      id: `pitch-f-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setFounderPitches(prev => [newPitch, ...prev]);

    const pitchEmoji =
      pitchData.pitchType === 'synergy'
        ? '⚡'
        : pitchData.pitchType === 'co_founder'
        ? '🤝'
        : pitchData.pitchType === 'peer_review'
        ? '💡'
        : pitchData.pitchType === 'cross_promo'
        ? '🚀'
        : pitchData.pitchType === 'angel_invest'
        ? '💰'
        : '💼';

    const pitchTypeLabel =
      pitchData.pitchType === 'synergy'
        ? 'Product & Tech Synergy'
        : pitchData.pitchType === 'co_founder'
        ? 'Co-Founder & Strategic Alliance'
        : pitchData.pitchType === 'peer_review'
        ? 'Peer Feedback & Review'
        : pitchData.pitchType === 'cross_promo'
        ? 'Cross-Promotion & Co-Marketing'
        : pitchData.pitchType === 'angel_invest'
        ? 'Founder Angel Backing'
        : 'B2B Pilot & Integration';

    const messageText = `${pitchEmoji} Founder-to-Founder Pitch: ${pitchData.title}\n\nType: ${pitchTypeLabel}\n\nSummary: ${pitchData.summary}\n\nProposed Next Step: ${pitchData.proposedNextStep.replace(/_/g, ' ').toUpperCase()}${pitchData.note ? `\n\nPersonal Note: "${pitchData.note}"` : ''}`;

    sendMessage(
      pitchData.recipientFounderId,
      messageText,
      pitchData.deckName || 'Startup_Synergy_Deck.pdf',
      {
        attachmentUrl: pitchData.deckUrl,
        attachmentName: pitchData.deckName || 'Startup_Synergy_Deck.pdf',
        pitchCard: newPitch
      }
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: pitchData.recipientFounderId,
      senderId: pitchData.senderFounderId,
      senderName: pitchData.senderFounderName,
      senderAvatar: pitchData.senderFounderAvatar,
      senderRole: 'founder',
      type: 'founder_pitch',
      title: `New Founder Pitch from ${pitchData.senderFounderName}`,
      message: `${pitchData.senderFounderName} (${pitchData.senderStartupName || 'Peer Founder'}) sent a ${pitchTypeLabel} proposal: "${pitchData.title}".`,
      targetId: newPitch.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    soundManager.playSuccess();
    showToast(
      'Pitch Delivered to Founder!',
      `Your pitch was delivered to ${pitchData.recipientFounderName}. A collaboration chat thread and deck link were created.`,
      'success',
      pitchData.recipientFounderAvatar
    );

    return newPitch;
  };

  const respondToFounderPitch = (pitchId: string, status: 'accepted' | 'declined' | 'in_discussion') => {
    setFounderPitches(prev =>
      prev.map(p => {
        if (p.id === pitchId) {
          const updated = { ...p, status };

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            recipientId: p.senderFounderId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            senderRole: 'founder',
            type: status === 'accepted' ? 'pitch_accepted' : status === 'declined' ? 'pitch_declined' : 'founder_pitch',
            title: `Pitch Update: ${status === 'accepted' ? 'Accepted!' : status === 'in_discussion' ? 'In Discussion' : 'Declined'}`,
            message: `${currentUser.name} responded to your pitch "${p.title}" with status: ${status.replace('_', ' ').toUpperCase()}.`,
            targetId: p.id,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(prevNotifs => [notif, ...prevNotifs]);

          return updated;
        }
        return p;
      })
    );

    soundManager.playPop();
    showToast(
      'Pitch Response Sent',
      `Pitch status updated to ${status.replace('_', ' ')}.`,
      'info'
    );
  };

  const reactToMessage = (messageId: string, emoji: string) => {
    soundManager.playPop();
    setMessages(prev =>
      prev.map(m => {
        if (m.id === messageId) {
          const currentReactions = m.reactions || {};
          const usersForEmoji = currentReactions[emoji] || [];
          const hasReacted = usersForEmoji.includes(currentUser.name);

          const updatedUsers = hasReacted
            ? usersForEmoji.filter(name => name !== currentUser.name)
            : [...usersForEmoji, currentUser.name];

          const updatedReactions = { ...currentReactions };
          if (updatedUsers.length > 0) {
            updatedReactions[emoji] = updatedUsers;
          } else {
            delete updatedReactions[emoji];
          }

          return { ...m, reactions: updatedReactions };
        }
        return m;
      })
    );
  };

  const respondToMeetingInvite = (messageId: string, status: 'confirmed' | 'declined') => {
    soundManager.playSuccess();
    setMessages(prev =>
      prev.map(m => {
        if (m.id === messageId && m.meetingInvite) {
          return {
            ...m,
            meetingInvite: {
              ...m.meetingInvite,
              status
            }
          };
        }
        return m;
      })
    );

    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      showToast(
        status === 'confirmed' ? 'Meeting Confirmed!' : 'Invite Declined',
        `Sync with ${msg.senderName} is ${status}. Added to ecosystem calendar.`,
        'success'
      );
    }
  };

  // Messaging operations with real-time feedback and intelligent auto-replies
  const sendMessage = (
    recipientId: string,
    text: string,
    attachmentName?: string,
    options?: Partial<MessageItem>
  ) => {
    if (!text.trim() && !attachmentName && !options?.mediaUrl && !options?.voiceNote) return;

    soundManager.playPop();

    const recipientUser = users.find(u => u.id === recipientId);
    if (!recipientUser) return;

    let conv = conversations.find(
      c =>
        (c.participantA === currentUser.id && c.participantB === recipientId) ||
        (c.participantB === currentUser.id && c.participantA === recipientId)
    );

    const convId = conv ? conv.id : `conv-${Date.now()}`;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      recipientId,
      recipientName: recipientUser.name,
      text: text || (options?.voiceNote ? '🎤 Voice note' : options?.attachmentName ? `📎 ${options.attachmentName}` : options?.mediaUrl ? '🖼️ Photo' : ''),
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachmentName,
      ...options
    };

    setMessages(prev => [...prev, newMsg]);

    const lastPreview = text || (options?.voiceNote ? '🎤 Voice note' : options?.attachmentName ? `📎 ${options.attachmentName}` : options?.mediaUrl ? '🖼️ Photo' : 'Message');

    if (conv) {
      setConversations(prev =>
        prev.map(c =>
          c.id === convId
            ? {
                ...c,
                lastMessage: lastPreview,
                lastTimestamp: new Date().toISOString()
              }
            : c
        )
      );
    } else {
      const newConv: Conversation = {
        id: convId,
        participantA: currentUser.id,
        participantB: recipientId,
        lastMessage: lastPreview,
        lastTimestamp: new Date().toISOString(),
        unreadCount: 0,
        otherUser: {
          id: recipientUser.id,
          name: recipientUser.name,
          avatar: recipientUser.avatar,
          role: recipientUser.role,
          title: recipientUser.title,
          company: recipientUser.company,
          isOnline: true,
          lastSeen: 'Active now'
        }
      };
      setConversations(prev => [newConv, ...prev]);
    }

    setActiveConversationId(convId);

    // Simulate real-time read receipt after 700ms
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
      );
    }, 700);

    // Simulate real-time typing and smart context reply from other user
    setTimeout(() => {
      setIsTyping(true);
      setTypingUser(recipientUser.name);
    }, 1200);

    setTimeout(() => {
      setIsTyping(false);
      setTypingUser(null);

      // Generate intelligent contextual response
      let replyText = '';
      let includeMeeting: MessageItem['meetingInvite'] | undefined = undefined;

      const lower = text.toLowerCase();
      if (options?.voiceNote) {
        replyText = `Thanks for the audio update, ${currentUser.name}! Heard you loud and clear. Let's incorporate this into our next milestone checklist.`;
      } else if (lower.includes('pitch') || lower.includes('deck') || lower.includes('round') || lower.includes('invest') || lower.includes('mrr') || lower.includes('allocation')) {
        if (recipientUser.role === 'investor') {
          replyText = `Thanks for sharing this, ${currentUser.name}! The growth metrics and unit economics look very promising. I would love to review the data room and discuss our typical check terms. Are you free for a quick 15-min sync?`;
          includeMeeting = {
            date: 'Tomorrow',
            time: '2:30 PM PST',
            topic: 'Due Diligence & Syndicate Sync',
            status: 'pending'
          };
        } else {
          replyText = `Thanks for getting in touch! We are actively closing out this round and would be delighted to walk you through our product demo and traction milestones.`;
        }
      } else if (lower.includes('mentor') || lower.includes('advice') || lower.includes('roadmap') || lower.includes('help')) {
        replyText = `Hello ${currentUser.name}, I reviewed your latest progress. Let's carve out time to refine the go-to-market funnel and positioning during our advisory sync.`;
        includeMeeting = {
          date: 'Friday',
          time: '11:00 AM PST',
          topic: '1-on-1 Product Advisory & Strategy',
          status: 'pending'
        };
      } else {
        const casualReplies = [
          `Hi ${currentUser.name}, thanks for reaching out! Excited to collaborate with you inside the RiseUp ecosystem.`,
          `Got your message! Let's stay closely connected on this. Let me know if you need any references or introductions.`,
          `Great connecting with you! Everything looks solid on our end.`
        ];
        replyText = casualReplies[Math.floor(Math.random() * casualReplies.length)];
      }

      const autoReplyMsg: MessageItem = {
        id: `msg-reply-${Date.now()}`,
        conversationId: convId,
        senderId: recipientUser.id,
        senderName: recipientUser.name,
        senderAvatar: recipientUser.avatar,
        senderRole: recipientUser.role,
        recipientId: currentUser.id,
        recipientName: currentUser.name,
        text: replyText,
        timestamp: new Date().toISOString(),
        status: 'read',
        meetingInvite: includeMeeting
      };

      setMessages(prev => [...prev, autoReplyMsg]);

      setConversations(prev =>
        prev.map(c =>
          c.id === convId
            ? {
                ...c,
                lastMessage: replyText,
                lastTimestamp: new Date().toISOString()
              }
            : c
        )
      );

      soundManager.playChime();
      showToast(
        `Message from ${recipientUser.name}`,
        replyText.length > 55 ? `${replyText.substring(0, 55)}...` : replyText,
        'message',
        recipientUser.avatar
      );
    }, 2800);
  };

  const deleteMessage = (messageId: string) => {
    soundManager.playPop();
    setMessages(prev => prev.filter(m => m.id !== messageId));
    showToast('Message Deleted', 'Removed from conversation history.', 'info');
  };

  const toggleStarMessage = (messageId: string) => {
    soundManager.playPop();
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m))
    );
  };

  const togglePinConversation = (convId: string) => {
    soundManager.playPop();
    setConversations(prev =>
      prev.map(c => (c.id === convId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const toggleMuteConversation = (convId: string) => {
    soundManager.playPop();
    setConversations(prev =>
      prev.map(c => (c.id === convId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const startConversationWithUser = (user: User) => {
    let conv = conversations.find(
      c =>
        (c.participantA === currentUser.id && c.participantB === user.id) ||
        (c.participantB === currentUser.id && c.participantA === user.id)
    );

    if (conv) {
      setActiveConversationId(conv.id);
    } else {
      const convId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        participantA: currentUser.id,
        participantB: user.id,
        lastMessage: `Started a new conversation with ${user.name}`,
        lastTimestamp: new Date().toISOString(),
        unreadCount: 0,
        otherUser: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          title: user.title,
          company: user.company,
          isOnline: true,
          lastSeen: 'Active now'
        }
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(convId);
    }
    setActiveView('messages');
  };

  // Notifications operations
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const broadcastSystemNotification = (title: string, message: string) => {
    const newNotifs: NotificationItem[] = users.map(u => ({
      id: `notif-broadcast-${Date.now()}-${u.id}`,
      recipientId: u.id,
      senderId: currentUser.id,
      senderName: 'RiseUp Official Announcement',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'admin',
      type: 'system_broadcast',
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    }));

    setNotifications(prev => [...newNotifs, ...prev]);

    const audit: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName: currentUser.name,
      action: 'BROADCAST_SYSTEM_ALERT',
      targetType: 'System',
      targetName: 'Global Platform',
      details: `Broadcasted "${title}" to all active platform users.`,
      severity: 'info'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // User Profile operations
  const updateUserProfile = (data: Partial<User>) => {
    // Recalculate profile completion
    const updatedUser: User = {
      ...currentUser,
      ...data
    };

    let score = 30;
    if (updatedUser.avatar) score += 15;
    if (updatedUser.coverImage) score += 10;
    if (updatedUser.bio && updatedUser.bio.length > 20) score += 15;
    if (updatedUser.title) score += 10;
    if (updatedUser.location) score += 5;
    if (updatedUser.company) score += 5;
    if (updatedUser.linkedin || updatedUser.website || updatedUser.twitter) score += 5;
    if (updatedUser.resumeUrl || (updatedUser.documents && updatedUser.documents.length > 0)) score += 5;
    updatedUser.profileCompletion = Math.min(100, score);

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    // Synchronize founder name and avatar on linked startups
    if (updatedUser.role === 'founder' && (data.name || data.avatar)) {
      setStartups(prev =>
        prev.map(s =>
          s.founderId === currentUser.id
            ? {
                ...s,
                founderName: data.name || s.founderName,
                founderAvatar: data.avatar || s.founderAvatar
              }
            : s
        )
      );
    }

    // Synchronize author data on posts
    if (data.name || data.avatar || data.title) {
      setPosts(prev =>
        prev.map(p =>
          p.authorId === currentUser.id
            ? {
                ...p,
                authorName: data.name || p.authorName,
                authorAvatar: data.avatar || p.authorAvatar,
                authorTitle: data.title || p.authorTitle
              }
            : p
        )
      );
    }

    soundManager.playSuccess();
    showToast('Profile Updated', 'Your profile details and uploaded media have been saved.', 'success');
  };

  // Admin operations
  const updateUserStatus = (userId: string, status: 'active' | 'pending' | 'suspended') => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status } : u)));
    const target = users.find(u => u.id === userId);
    const audit: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName: currentUser.name,
      action: `USER_STATUS_${status.toUpperCase()}`,
      targetType: 'User',
      targetName: target ? target.name : userId,
      details: `User status changed to ${status}.`,
      severity: status === 'suspended' ? 'warning' : 'info'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const verifyStartup = (startupId: string) => {
    setStartups(prev =>
      prev.map(s => (s.id === startupId ? { ...s, isVerified: !s.isVerified } : s))
    );
    const target = startups.find(s => s.id === startupId);
    if (target) {
      const audit: SystemAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: currentUser.name,
        action: target.isVerified ? 'REVOKED_VERIFICATION' : 'VERIFIED_STARTUP',
        targetType: 'Startup',
        targetName: target.name,
        details: `Updated official due diligence verification status.`,
        severity: 'info'
      };
      setAuditLogs(prev => [audit, ...prev]);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const addCategory = (name: string, icon: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      icon,
      startupCount: 1,
      trendingScore: 75
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        startups,
        posts,
        notifications,
        conversations,
        messages,
        investorRequests,
        mentorRequests,
        founderPitches,
        sendFounderPitch,
        respondToFounderPitch,
        pitchFounderModalTarget,
        setPitchFounderModalTarget,
        exploreTab,
        setExploreTab,
        categories,
        auditLogs,
        platformStats,
        theme,
        toggleTheme,
        activeView,
        setActiveView,
        selectedStartupId,
        setSelectedStartupId,
        selectedPostId,
        setSelectedPostId,
        selectedUserId,
        setSelectedUserId,
        searchQuery,
        setSearchQuery,
        selectedIndustryFilter,
        setSelectedIndustryFilter,
        selectedStageFilter,
        setSelectedStageFilter,
        addPost,
        toggleLikePost,
        reactToPost,
        toggleBookmarkPost,
        addCommentToPost,
        addReplyToComment,
        toggleLikeComment,
        deletePost,
        createStartup,
        updateStartup,
        toggleSaveStartup,
        expressInvestorInterest,
        pitchStartupToInvestor,
        joinStartupAsInvestor,
        sendMentorRequest,
        respondToMentorRequest,
        respondToInvestorRequest,
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
        activeCallUser,
        startCallWithUser,
        endCall,
        toasts,
        showToast,
        dismissToast,
        soundMuted,
        toggleSoundMute,
        markAllNotificationsAsRead,
        broadcastSystemNotification,
        updateUserProfile,
        updateUserStatus,
        verifyStartup,
        deleteUser,
        addCategory,
        deleteCategory,
        isLoggedIn,
        login,
        loginWithRole,
        loginWithUser,
        registerUser,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        savedStartupIds,
        bookmarkedPostIds
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
