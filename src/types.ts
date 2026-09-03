export type UserRole = 'founder' | 'investor' | 'mentor' | 'admin';

export type FundingStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Bootstrapped' | 'Grant Funded';

export type BusinessModel = 'B2B SaaS' | 'B2C Marketplace' | 'D2C' | 'Enterprise SaaS' | 'DeepTech / Hardware' | 'FinTech' | 'AI / API' | 'BioTech';

export type PostType = 'all' | 'announcement' | 'product_update' | 'milestone' | 'funding_update' | 'hiring' | 'achievement' | 'media';

export interface UserDocument {
  id: string;
  name: string;
  url: string;
  size?: string;
  type?: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  coverImage?: string;
  title: string;
  company?: string;
  location: string;
  bio: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  isOnline?: boolean;
  lastSeen?: string;
  joinedDate: string;
  profileCompletion: number;
  achievements: string[];
  skills?: string[];
  resumeUrl?: string;
  resumeName?: string;
  resumeSize?: string;
  documents?: UserDocument[];
  
  // Investor specific
  investmentInterests?: string[];
  preferredIndustries?: string[];
  preferredStages?: FundingStage[];
  investmentRange?: { min: number; max: number };
  portfolioCount?: number;
  portfolioCompanies?: { name: string; stage: string; logo: string }[];
  
  // Mentor specific
  mentorSkills?: string[];
  mentorExperienceYears?: number;
  mentorIndustries?: string[];
  mentorAvailability?: 'Available (Accepting Startups)' | 'At Capacity (1/1 Startup)' | 'Part-time Advisory';
  activeMentoredStartupId?: string | null;
  mentorRating?: number;
  mentorReviewCount?: number;
  mentorCertificates?: string[];
  
  // Founder specific
  startupId?: string;
  founderLookingFor?: string[];
  founderStage?: string;
  coFounderRolesLookingFor?: string[];
}

export type FounderPitchType =
  | 'synergy'
  | 'co_founder'
  | 'peer_review'
  | 'cross_promo'
  | 'angel_invest'
  | 'b2b_partnership';

export interface FounderPitch {
  id: string;
  senderFounderId: string;
  senderFounderName: string;
  senderFounderAvatar: string;
  senderFounderTitle?: string;
  senderStartupId?: string;
  senderStartupName?: string;
  senderStartupLogo?: string;
  
  recipientFounderId: string;
  recipientFounderName: string;
  recipientFounderAvatar: string;
  recipientFounderTitle?: string;
  recipientStartupId?: string;
  recipientStartupName?: string;
  
  pitchType: FounderPitchType;
  title: string;
  summary: string;
  synergyPoints: string[];
  deckUrl?: string;
  deckName?: string;
  deckSize?: string;
  proposedNextStep: 'intro_call' | 'coffee_chat' | 'demo_exchange' | 'advisory_swap' | 'nda_review';
  status: 'pending' | 'accepted' | 'declined' | 'in_discussion';
  createdAt: string;
  note?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  education: string;
  experience: string;
  skills: string[];
  portfolio?: string;
  linkedin?: string;
  bio: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  founderId: string;
  founderName: string;
  founderAvatar: string;
  industry: string;
  subIndustry?: string;
  location: string;
  country: string;
  website: string;
  foundedYear: number;
  stage: FundingStage;
  businessModel: BusinessModel;
  
  // Elevator & Pitch Details
  story: string;
  vision: string;
  mission: string;
  problem: string;
  solution: string;
  marketSize: string;
  targetCustomers: string;
  
  // Financials & Fundraising
  fundingGoal: number; // in USD
  fundingRaised: number;
  valuation?: number;
  equityOffered?: number; // percentage
  minInvestment?: number;
  revenueMRR?: number;
  growthRatePercent?: number;
  
  // Documents & Media
  pitchDeckUrl?: string;
  pitchDeckName?: string;
  executiveSummaryUrl?: string;
  gallery: string[];
  videoUrl?: string;
  
  // Team & Milestones
  teamMembers: TeamMember[];
  milestones: Milestone[];
  techStack: string[];
  tags: string[];
  
  // Ecosystem relations
  interestedInvestorIds: string[];
  joinedInvestorIds: string[];
  assignedMentorId?: string | null;
  assignedMentorName?: string;
  
  // Stats & Status
  viewsCount: number;
  likesCount: number;
  savedCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  status: 'active' | 'pending' | 'draft';
  createdAt: string;
}

export interface CommentReply {
  id: string;
  postId: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  userTitle: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export type ReactionType = 'love';

export interface PostReactionCounts {
  love: number;
  like?: number;
  celebrate?: number;
  insightful?: number;
  fire?: number;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'message' | 'deal' | 'mentor';
  senderAvatar?: string;
  timestamp: number;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  userTitle: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies: CommentReply[];
}

export interface Post {
  id: string;
  startupId: string;
  startupName: string;
  startupLogo: string;
  startupStage: FundingStage;
  startupIndustry: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorTitle: string;
  
  type: PostType;
  title?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | 'none';
  tags: string[];
  
  // Interaction Counters
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  bookmarksCount: number;
  
  isLiked?: boolean;
  isBookmarked?: boolean;
  userReaction?: ReactionType | null;
  reactions?: PostReactionCounts;
  
  comments: PostComment[];
  status: 'approved' | 'pending' | 'flagged';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  type:
    | 'like'
    | 'comment'
    | 'mentor_request'
    | 'mentor_accepted'
    | 'mentor_declined'
    | 'investor_interest'
    | 'investor_joined'
    | 'connection'
    | 'message'
    | 'system_broadcast'
    | 'startup_verified'
    | 'founder_pitch'
    | 'pitch_accepted'
    | 'pitch_declined';
  title: string;
  message: string;
  targetId?: string; // post ID or startup ID
  isRead: boolean;
  createdAt: string;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  pitchCard?: FounderPitch;
  voiceNote?: {
    durationSec: number;
    audioWaveform: number[];
  };
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
    attachmentName?: string;
  };
  isStarred?: boolean;
  isPinned?: boolean;
  deleted?: boolean;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user names
  meetingInvite?: {
    date: string;
    time: string;
    topic: string;
    status: 'pending' | 'confirmed' | 'declined';
  };
}

export interface Conversation {
  id: string;
  participantA: string;
  participantB: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    title: string;
    company?: string;
    isOnline: boolean;
    lastSeen?: string;
  };
}

export interface InvestorRequest {
  id: string;
  investorId: string;
  investorName: string;
  investorAvatar: string;
  investorCompany: string;
  startupId: string;
  startupName: string;
  founderId: string;
  checkSizeOffering: number;
  note: string;
  status: 'pending' | 'accepted' | 'declined' | 'due_diligence';
  createdAt: string;
}

export interface MentorRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  startupId: string;
  startupName: string;
  founderId: string;
  areasOfHelp: string[];
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'active' | 'completed';
  createdAt: string;
}

export interface MentorAdviceLog {
  id: string;
  mentorId: string;
  mentorName: string;
  startupId: string;
  date: string;
  focusArea: string;
  notes: string;
  actionItems: string[];
  ratingScore: number; // 1-5
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  targetType: 'User' | 'Startup' | 'Post' | 'System' | 'Category';
  targetName: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  startupCount: number;
  trendingScore: number;
}

export interface PlatformStats {
  totalUsers: number;
  totalFounders: number;
  totalInvestors: number;
  totalMentors: number;
  totalStartups: number;
  activeStartups: number;
  pendingVerifications: number;
  totalCapitalExpressedUSD: number;
  activeMentorships: number;
  totalPosts: number;
  dailyActiveUsers: number;
  monthlyGrowthRate: number;
}
