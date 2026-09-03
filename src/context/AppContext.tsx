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
  FounderPitch,
  Milestone
} from '../types';
import {
  isSupabaseConfigured,
  fetchUsersFromSupabase,
  fetchStartupsFromSupabase,
  fetchPostsFromSupabase,
  fetchConversationsFromSupabase,
  fetchMessagesFromSupabase,
  fetchInvestorRequestsFromSupabase,
  fetchMentorRequestsFromSupabase,
  fetchFounderPitchesFromSupabase,
  syncPostToSupabase,
  syncStartupToSupabase,
  syncUserToSupabase,
  syncMessageToSupabase,
  syncInvestorRequestToSupabase,
  syncMentorRequestToSupabase,
  syncFounderPitchToSupabase
} from '../lib/supabase';
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
  exploreTab: 'startups' | 'founders' | 'investors';
  setExploreTab: (tab: 'startups' | 'founders' | 'investors') => void;
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
  reactToPost: (postId: string, reactionType?: ReactionType) => void;
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
  deleteConversation: (convId: string) => void;
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
  
  // Actions - Admin & Verification
  updateUserProfile: (data: Partial<User>) => void;
  updateUserStatus: (userId: string, status: 'active' | 'pending' | 'suspended') => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  verifyUser: (userId: string) => void;
  verifyStartup: (startupId: string) => void;
  deleteStartup: (startupId: string) => void;
  addMilestoneToStartup: (startupId: string, milestone: Milestone) => void;
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

// Resilient localStorage helpers that prevent QuotaExceededError and syntax errors from crashing React
function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.warn(`[Storage] Failed to parse cached ${key}:`, err);
    return fallback;
  }
}

function safeSetItem(key: string, value: any): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[Storage] Storage quota reached or write error for ${key}:`, err);
    // If quota is exceeded, clear non-critical logs to free up space
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_logs');
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      // In-memory fallback
      return false;
    }
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or use defaults
  const [users, setUsers] = useState<User[]>(() =>
    safeGetItem<User[]>(LOCAL_STORAGE_KEY + '_users', INITIAL_USERS)
  );

  const [currentUser, setCurrentUser] = useState<User>(() =>
    safeGetItem<User>(LOCAL_STORAGE_KEY + '_currUser', INITIAL_USERS[1])
  );

  const [startups, setStartups] = useState<Startup[]>(() =>
    safeGetItem<Startup[]>(LOCAL_STORAGE_KEY + '_startups', INITIAL_STARTUPS)
  );

  const [posts, setPosts] = useState<Post[]>(() =>
    safeGetItem<Post[]>(LOCAL_STORAGE_KEY + '_posts', INITIAL_POSTS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeGetItem<NotificationItem[]>(LOCAL_STORAGE_KEY + '_notifications', INITIAL_NOTIFICATIONS)
  );

  const DEMO_CONV_IDS = ['conv-1', 'conv-2', 'conv-3', 'conv-4'];
  const DEMO_MSG_IDS = ['msg-1', 'msg-2', 'msg-3', 'msg-201', 'msg-202', 'msg-203', 'msg-301'];

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const raw = safeGetItem<Conversation[]>(LOCAL_STORAGE_KEY + '_conversations', INITIAL_CONVERSATIONS);
    return (raw || []).filter(c => !DEMO_CONV_IDS.includes(c.id));
  });

  const [messages, setMessages] = useState<MessageItem[]>(() => {
    const raw = safeGetItem<MessageItem[]>(LOCAL_STORAGE_KEY + '_messages', INITIAL_MESSAGES);
    return (raw || []).filter(m => !DEMO_MSG_IDS.includes(m.id) && !DEMO_CONV_IDS.includes(m.conversationId));
  });

  const [investorRequests, setInvestorRequests] = useState<InvestorRequest[]>(() =>
    safeGetItem<InvestorRequest[]>(LOCAL_STORAGE_KEY + '_invRequests', INITIAL_INVESTOR_REQUESTS)
  );

  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>(() =>
    safeGetItem<MentorRequest[]>(LOCAL_STORAGE_KEY + '_menRequests', INITIAL_MENTOR_REQUESTS)
  );

  const [founderPitches, setFounderPitches] = useState<FounderPitch[]>(() =>
    safeGetItem<FounderPitch[]>(LOCAL_STORAGE_KEY + '_founderPitches', INITIAL_FOUNDER_PITCHES)
  );

  const [pitchFounderModalTarget, setPitchFounderModalTarget] = useState<User | null>(null);
  const [exploreTab, setExploreTab] = useState<'startups' | 'founders' | 'investors'>('founders');

  const [categories, setCategories] = useState<Category[]>(() =>
    safeGetItem<Category[]>(LOCAL_STORAGE_KEY + '_categories', INITIAL_CATEGORIES)
  );

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() =>
    safeGetItem<SystemAuditLog[]>(LOCAL_STORAGE_KEY + '_logs', INITIAL_AUDIT_LOGS)
  );

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    safeGetItem<boolean>(LOCAL_STORAGE_KEY + '_isLoggedIn', false)
  );
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
    showToast(`Calling ${user.name}...`, 'Live audio connection initiated.', 'message', user.avatar);
  };

  const endCall = () => {
    setActiveCallUser(null);
    soundManager.playPop();
  };

  // Persist key states
  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_users', users);
  }, [users]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_currUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_startups', startups);
  }, [startups]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_posts', posts);
  }, [posts]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_conversations', conversations);
  }, [conversations]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_messages', messages);
  }, [messages]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_invRequests', investorRequests);
  }, [investorRequests]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_menRequests', mentorRequests);
  }, [mentorRequests]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_founderPitches', founderPitches);
  }, [founderPitches]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY + '_isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  // If Supabase is connected, fetch and sync live PostgreSQL cloud database
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const initSupabaseData = async () => {
      try {
        const [
          remoteUsers,
          remoteStartups,
          remotePosts,
          remoteConvs,
          remoteMsgs,
          remoteInvReqs,
          remoteMenReqs,
          remotePitches
        ] = await Promise.all([
          fetchUsersFromSupabase(),
          fetchStartupsFromSupabase(),
          fetchPostsFromSupabase(),
          fetchConversationsFromSupabase(),
          fetchMessagesFromSupabase(),
          fetchInvestorRequestsFromSupabase(),
          fetchMentorRequestsFromSupabase(),
          fetchFounderPitchesFromSupabase()
        ]);

        if (remoteUsers && remoteUsers.length > 0) {
          setUsers(prev => {
            // Find custom users created by this client not yet in remote database
            const customLocalUsers = prev.filter(
              localU => !remoteUsers.some(rU => rU.id === localU.id)
            );
            // Automatically push any local newly created user accounts to Supabase
            customLocalUsers.forEach(u => {
              syncUserToSupabase(u);
            });
            return [...customLocalUsers, ...remoteUsers];
          });
        }

        // Guarantee current user is synced to Supabase if they are a newly created account
        if (currentUser && currentUser.id.startsWith('user-') && !['user-admin', 'user-founder-1', 'user-investor-1', 'user-mentor-1', 'user-founder-2', 'user-founder-3', 'user-founder-4'].includes(currentUser.id)) {
          syncUserToSupabase(currentUser);
        }

        if (remoteStartups && remoteStartups.length > 0) setStartups(remoteStartups);
        if (remotePosts && remotePosts.length > 0) setPosts(remotePosts);
        if (remoteConvs && remoteConvs.length > 0) {
          const filteredConvs = remoteConvs.filter(c => !DEMO_CONV_IDS.includes(c.id));
          setConversations(filteredConvs);
        }
        if (remoteMsgs && remoteMsgs.length > 0) {
          const filteredMsgs = remoteMsgs.filter(
            m => !DEMO_MSG_IDS.includes(m.id) && !DEMO_CONV_IDS.includes(m.conversationId)
          );
          setMessages(filteredMsgs);
        }
        if (remoteInvReqs && remoteInvReqs.length > 0) setInvestorRequests(remoteInvReqs);
        if (remoteMenReqs && remoteMenReqs.length > 0) setMentorRequests(remoteMenReqs);
        if (remotePitches && remotePitches.length > 0) setFounderPitches(remotePitches);
      } catch (err) {
        console.warn('Supabase cloud fetch notice:', err);
      }
    };
    initSupabaseData();
  }, [currentUser]);

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

    // Live sync new user to Supabase cloud database
    if (isSupabaseConfigured) {
      syncUserToSupabase(newUser).then(res => {
        if (res.success) {
          console.log('[Supabase Cloud] User successfully synced to database:', newUser.name);
        } else {
          console.warn('[Supabase Cloud Sync Notice]:', res.error);
        }
      });
    }

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
    if (isSupabaseConfigured) syncPostToSupabase(newPost);
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

  const reactToPost = (postId: string, _reactionType: ReactionType = 'love') => {
    soundManager.playReaction();

    let isLikedNow = false;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const currentlyLiked = !!p.isLiked || p.userReaction === 'love';
          isLikedNow = !currentlyLiked;

          return {
            ...p,
            userReaction: isLikedNow ? 'love' : null,
            isLiked: isLikedNow,
            likesCount: isLikedNow ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
            reactions: {
              like: 0,
              celebrate: 0,
              insightful: 0,
              love: isLikedNow ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
              fire: 0
            }
          };
        }
        return p;
      })
    );

    // Notify author if not self and becoming liked
    const targetPost = posts.find(p => p.id === postId);
    if (targetPost && targetPost.authorId !== currentUser.id && isLikedNow) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        recipientId: targetPost.authorId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        type: 'like',
        title: 'New Love on Your Post',
        message: `${currentUser.name} loved your post "${targetPost.title || 'Startup Update'}".`,
        targetId: postId,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const toggleLikePost = (postId: string) => {
    reactToPost(postId, 'love');
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
      pitchDeckUrl: startupData.pitchDeckUrl,
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
    if (isSupabaseConfigured) syncStartupToSupabase(newStartup);

    // Link startup to founder
    setCurrentUser(prev => ({ ...prev, startupId: newStartup.id }));
    setUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, startupId: newStartup.id } : u))
    );

    return newStartup;
  };

  const updateStartup = (startupId: string, data: Partial<Startup>) => {
    setStartups(prev =>
      prev.map(s => {
        if (s.id === startupId) {
          const updated = { ...s, ...data };
          if (isSupabaseConfigured) syncStartupToSupabase(updated);
          return updated;
        }
        return s;
      })
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
    if (isSupabaseConfigured) syncInvestorRequestToSupabase(newRequest);

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
    if (isSupabaseConfigured) syncInvestorRequestToSupabase(newReq);

    // Send formatted pitch message directly in conversation thread
    const pitchMessageText = `🚀 Direct Pitch: ${targetStartup.name} (${targetStartup.stage})\n\nRequested Allocation: $${requestedCheck.toLocaleString()}\nElevator Pitch: ${pitchSummary}\n\nKey Metrics: ${targetStartup.revenueMRR ? `$${targetStartup.revenueMRR.toLocaleString()} MRR` : 'Active Growth'}, ${targetStartup.growthRatePercent ? `+${targetStartup.growthRatePercent}% MoM` : '+34% MoM'}. Pitch Deck & Financial Model attached for due diligence.`;

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
    if (isSupabaseConfigured) syncMentorRequestToSupabase(newReq);

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
      prev.map(r => {
        if (r.id === requestId) {
          const updated = { ...r, status: (accept ? 'accepted' : 'declined') as any };
          if (isSupabaseConfigured) syncMentorRequestToSupabase(updated);
          return updated;
        }
        return r;
      })
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
    if (isSupabaseConfigured) syncFounderPitchToSupabase(newPitch);

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

  const reactToMessage = (messageId: string, _emoji: string = '❤️') => {
    const emoji = '❤️'; // Single love react from Instagram
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

          const updatedReactions: { [emoji: string]: string[] } = {};
          if (updatedUsers.length > 0) {
            updatedReactions[emoji] = updatedUsers;
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
    if (isSupabaseConfigured) syncMessageToSupabase(newMsg);

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

    // Delivered / sent status update
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 600);
  };

  const deleteMessage = (messageId: string) => {
    soundManager.playPop();
    setMessages(prev => prev.filter(m => m.id !== messageId));
    showToast('Message Deleted', 'Removed from conversation history.', 'info');
  };

  const deleteConversation = (convId: string) => {
    soundManager.playPop();
    setConversations(prev => prev.filter(c => c.id !== convId));
    setMessages(prev => prev.filter(m => m.conversationId !== convId));
    if (activeConversationId === convId) {
      setActiveConversationId(null);
    }
    showToast('Conversation Deleted', 'Chat history removed.', 'info');
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

    if (isSupabaseConfigured) syncUserToSupabase(updatedUser);

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

  const verifyUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, isVerified: !u.isVerified };
          if (isSupabaseConfigured) syncUserToSupabase(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const deleteStartup = (startupId: string) => {
    setStartups(prev => prev.filter(s => s.id !== startupId));
    showToast('Startup Deleted', 'Startup removed from platform.', 'info');
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, role };
          if (isSupabaseConfigured) syncUserToSupabase(updated);
          return updated;
        }
        return u;
      })
    );
    showToast('User Role Updated', `Role changed to ${role}.`, 'info');
  };

  const addMilestoneToStartup = (startupId: string, milestone: Milestone) => {
    setStartups(prev =>
      prev.map(s => {
        if (s.id === startupId) {
          const updated = {
            ...s,
            milestones: [milestone, ...(s.milestones || [])]
          };
          if (isSupabaseConfigured) syncStartupToSupabase(updated);
          return updated;
        }
        return s;
      })
    );
    showToast('Milestone Added', 'New milestone registered for startup.', 'success');
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
        deleteConversation,
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
        updateUserRole,
        verifyUser,
        verifyStartup,
        deleteStartup,
        addMilestoneToStartup,
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
