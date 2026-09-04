import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  User,
  Startup,
  Post,
  Conversation,
  MessageItem,
  InvestorRequest,
  MentorRequest,
  FounderPitch,
  NotificationItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STARTUPS,
  INITIAL_POSTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_INVESTOR_REQUESTS,
  INITIAL_MENTOR_REQUESTS,
  INITIAL_FOUNDER_PITCHES
} from '../data/mockData';

const DEFAULT_SUPABASE_URL = 'https://uxsqqfjnakhvtqrbsljb.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_9D5ldXisHhE6S_WW59OfMg_lqiCJZvq';

const envUrl = (((import.meta as any).env?.VITE_SUPABASE_URL as string) || '').trim();
const envKey = (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '').trim();

const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem('riseup_supabase_url') || '' : '').trim();
const storedKey = (typeof window !== 'undefined' ? localStorage.getItem('riseup_supabase_key') || '' : '').trim();

export const supabaseUrl = envUrl || storedUrl || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = envKey || storedKey || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('supabase.co')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Tests connection with Supabase
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; tableCount?: number }> {
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are not set.'
    };
  }

  try {
    const { data, error } = await supabase.from('startups').select('id').limit(1);
    if (error) {
      // Check if table does not exist
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase project, but tables are not created yet! Run the provided SQL script in your Supabase SQL Editor.'
        };
      }
      return {
        success: false,
        message: `Supabase error: ${error.message} (${error.code || 'unknown'})`
      };
    }
    return {
      success: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      tableCount: data ? 1 : 0
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Connection failed. Please verify your Supabase project status.'
    };
  }
}

// ----------------------------------------------------------------------
// SUPABASE STORAGE SERVICES (Avatars, Covers, Startups, Posts, Documents)
// ----------------------------------------------------------------------

export const SUPABASE_STORAGE_BUCKET = 'riseup-media';

/**
 * Tests access to the Supabase Storage bucket
 */
export async function testSupabaseStorageConnection(): Promise<{ success: boolean; message: string; bucketExists?: boolean }> {
  if (!supabase) {
    return { success: false, message: 'Supabase client is not initialized.' };
  }
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      return {
        success: false,
        message: `Storage error: ${error.message}. Run the SQL storage script to create and enable the '${SUPABASE_STORAGE_BUCKET}' bucket.`,
        bucketExists: false
      };
    }
    const found = buckets?.some(b => b.name === SUPABASE_STORAGE_BUCKET);
    if (found) {
      return {
        success: true,
        message: `Storage bucket '${SUPABASE_STORAGE_BUCKET}' is active and ready for media uploads!`,
        bucketExists: true
      };
    }
    // Attempt automated creation if allowed by client policy
    try {
      const { error: createErr } = await supabase.storage.createBucket(SUPABASE_STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      if (!createErr) {
        return {
          success: true,
          message: `Storage bucket '${SUPABASE_STORAGE_BUCKET}' was automatically created and is ready!`,
          bucketExists: true
        };
      }
    } catch {}

    return {
      success: false,
      message: `Bucket '${SUPABASE_STORAGE_BUCKET}' not found. Run the provided SQL script in your Supabase SQL Editor to initialize it.`,
      bucketExists: false
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to connect to Supabase Storage.',
      bucketExists: false
    };
  }
}

/**
 * Uploads any File or Blob directly to Supabase Storage and returns its public HTTPS URL.
 */
export async function uploadFileToSupabaseStorage(
  file: File | Blob,
  folder: 'avatars' | 'covers' | 'startups' | 'posts' | 'documents' | 'chat' = 'avatars',
  customFileName?: string
): Promise<{ success: boolean; url: string; error?: string }> {
  if (!supabase) {
    return { success: false, url: '', error: 'Supabase client not initialized' };
  }

  try {
    const originalName = customFileName || (file instanceof File ? file.name : 'upload.jpg');
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanBaseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const filePath = `${folder}/${timestamp}_${randomSuffix}_${cleanBaseName}.${ext}`;

    const mimeType = (file as any).type || (ext === 'pdf' ? 'application/pdf' : ext === 'png' ? 'image/png' : 'image/jpeg');

    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true,
        contentType: mimeType
      });

    if (error) {
      console.warn('[Supabase Storage] Upload error:', error);
      return { success: false, url: '', error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return { success: false, url: '', error: 'Failed to retrieve public URL from Supabase Storage' };
    }

    console.log('[Supabase Storage] Successfully uploaded to:', publicUrlData.publicUrl);
    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.warn('[Supabase Storage] Exception:', err);
    return { success: false, url: '', error: err.message || 'Storage upload error' };
  }
}

/**
 * Converts a Base64 data URL into a Blob and uploads it directly to Supabase Storage,
 * replacing local Base64 strings with permanent Supabase public URLs.
 */
export async function uploadBase64ToSupabaseStorage(
  dataUrl: string,
  folder: 'avatars' | 'covers' | 'startups' | 'posts' | 'documents' | 'chat' = 'avatars',
  filename: string = 'media.jpg'
): Promise<{ success: boolean; url: string; error?: string }> {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    // If it's already an HTTP URL (Unsplash or Supabase), return it as-is
    return { success: true, url: dataUrl };
  }

  if (!supabase) {
    return { success: false, url: dataUrl, error: 'Supabase client not initialized' };
  }

  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return await uploadFileToSupabaseStorage(blob, folder, filename);
  } catch (err: any) {
    console.warn('[Supabase Storage] Base64 conversion/upload error:', err);
    return { success: false, url: dataUrl, error: err.message || 'Conversion error' };
  }
}

// ----------------------------------------------------------------------
// READ HELPERS
// ----------------------------------------------------------------------

export async function fetchStartupsFromSupabase(): Promise<Startup[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) {
      console.warn('[Supabase] fetch startups error:', error);
      return null;
    }
    return data as Startup[];
  } catch (err) {
    console.warn('[Supabase] fetch startups exception:', err);
    return null;
  }
}

export async function fetchPostsFromSupabase(): Promise<Post[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) {
      console.warn('[Supabase] fetch posts error:', error);
      return null;
    }
    return (data || []).map(dbRowToPost);
  } catch (err) {
    console.warn('[Supabase] fetch posts exception:', err);
    return null;
  }
}

export async function fetchUsersFromSupabase(): Promise<User[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.warn('[Supabase] fetch users error:', error);
      return null;
    }
    return data as User[];
  } catch (err) {
    console.warn('[Supabase] fetch users exception:', err);
    return null;
  }
}

export async function fetchConversationsFromSupabase(currentUserId?: string): Promise<Conversation[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('conversations').select('*');
    if (error) {
      console.warn('[Supabase] fetch conversations error:', error);
      return null;
    }
    return (data || []).map(row => dbRowToConversation(row, currentUserId));
  } catch (err) {
    console.warn('[Supabase] fetch conversations exception:', err);
    return null;
  }
}

export async function fetchMessagesFromSupabase(): Promise<MessageItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
    if (error) {
      console.warn('[Supabase] fetch messages error:', error);
      return null;
    }
    return (data || []).map(dbRowToMessage);
  } catch (err) {
    console.warn('[Supabase] fetch messages exception:', err);
    return null;
  }
}

export async function fetchInvestorRequestsFromSupabase(): Promise<InvestorRequest[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('investor_requests').select('*');
    if (error) return null;
    return data as InvestorRequest[];
  } catch {
    return null;
  }
}

export async function fetchMentorRequestsFromSupabase(): Promise<MentorRequest[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('mentor_requests').select('*');
    if (error) return null;
    return data as MentorRequest[];
  } catch {
    return null;
  }
}

export async function fetchFounderPitchesFromSupabase(): Promise<FounderPitch[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('founder_pitches').select('*');
    if (error) return null;
    return data as FounderPitch[];
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------
// DATA SERIALIZERS & DESERIALIZERS (Ensures 100% schema resilience)
// ----------------------------------------------------------------------

const POST_ALLOWED_COLUMNS = new Set([
  'id', 'startupId', 'startupName', 'startupLogo', 'startupStage', 'startupIndustry',
  'authorId', 'authorName', 'authorAvatar', 'authorRole', 'authorTitle',
  'type', 'title', 'content', 'mediaUrl', 'mediaType', 'tags', 'createdAt',
  'likesCount', 'commentsCount', 'sharesCount', 'viewsCount', 'isLiked', 'isBookmarked',
  'reactions', 'comments', 'userReactions'
]);

export function postToDbRow(post: Post) {
  const row: any = {};
  for (const [key, val] of Object.entries(post)) {
    if (POST_ALLOWED_COLUMNS.has(key) && val !== undefined) {
      row[key] = val;
    }
  }
  return row;
}

export function dbRowToPost(row: any): Post {
  return {
    id: row.id,
    startupId: row.startupId || '',
    startupName: row.startupName || '',
    startupLogo: row.startupLogo || '',
    startupStage: row.startupStage || 'Seed',
    startupIndustry: row.startupIndustry || 'Technology',
    authorId: row.authorId || '',
    authorName: row.authorName || '',
    authorAvatar: row.authorAvatar || '',
    authorRole: row.authorRole || 'founder',
    authorTitle: row.authorTitle || '',
    type: row.type || 'update',
    title: row.title || undefined,
    content: row.content || '',
    mediaUrl: row.mediaUrl || undefined,
    mediaType: row.mediaType || 'none',
    tags: Array.isArray(row.tags) ? row.tags : [],
    likesCount: Number(row.likesCount) || 0,
    commentsCount: Number(row.commentsCount) || (Array.isArray(row.comments) ? row.comments.length : 0),
    sharesCount: Number(row.sharesCount) || 0,
    viewsCount: Number(row.viewsCount) || 0,
    bookmarksCount: 0,
    isLiked: !!row.isLiked,
    isBookmarked: !!row.isBookmarked,
    userReaction: (row.userReaction as any) || (row.isLiked ? 'love' : null),
    reactions: row.reactions || { like: 0, celebrate: 0, insightful: 0, love: Number(row.likesCount) || 0, fire: 0 },
    comments: Array.isArray(row.comments) ? row.comments : [],
    status: 'approved',
    createdAt: row.createdAt || new Date().toISOString()
  };
}

export function messageToDbRow(msg: MessageItem) {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    senderName: msg.senderName,
    senderAvatar: msg.senderAvatar,
    text: msg.text,
    timestamp: msg.timestamp,
    isRead: msg.status === 'read',
    mediaUrl: msg.mediaUrl || null,
    attachmentName: msg.attachmentName || null,
    attachmentSize: msg.attachmentSize || null,
    attachmentUrl: msg.attachmentUrl || null,
    replyTo: (msg.reactions || msg.meetingInvite || msg.senderRole || msg.recipientId || msg.mediaType || msg.status || msg.replyTo) ? {
      _meta: {
        senderRole: msg.senderRole,
        recipientId: msg.recipientId,
        recipientName: msg.recipientName,
        status: msg.status,
        reactions: msg.reactions,
        meetingInvite: msg.meetingInvite,
        mediaType: msg.mediaType
      },
      ...(msg.replyTo || {})
    } : null,
    voiceNote: msg.voiceNote || null
  };
}

export function dbRowToMessage(row: any): MessageItem {
  const meta = row.replyTo?._meta || {};
  const replyToClean = row.replyTo ? { ...row.replyTo } : undefined;
  if (replyToClean) delete (replyToClean as any)._meta;

  return {
    id: row.id,
    conversationId: row.conversationId || '',
    senderId: row.senderId || '',
    senderName: row.senderName || '',
    senderAvatar: row.senderAvatar || '',
    senderRole: meta.senderRole || row.senderRole || 'founder',
    recipientId: meta.recipientId || row.recipientId || '',
    recipientName: meta.recipientName || row.recipientName || '',
    text: row.text || '',
    timestamp: row.timestamp || new Date().toISOString(),
    status: row.isRead ? 'read' : (meta.status || 'sent'),
    mediaUrl: row.mediaUrl || undefined,
    mediaType: meta.mediaType || undefined,
    attachmentName: row.attachmentName || undefined,
    attachmentSize: row.attachmentSize || undefined,
    attachmentUrl: row.attachmentUrl || undefined,
    voiceNote: row.voiceNote || undefined,
    replyTo: replyToClean && replyToClean.id ? replyToClean : undefined,
    reactions: meta.reactions || {},
    meetingInvite: meta.meetingInvite || undefined
  };
}

export function conversationToDbRow(conv: Conversation) {
  return {
    id: conv.id,
    participantIds: [conv.participantA, conv.participantB],
    participants: [
      { id: conv.participantA },
      { id: conv.participantB, ...conv.otherUser }
    ],
    lastMessage: conv.lastMessage || '',
    lastMessageTime: conv.lastTimestamp || new Date().toISOString(),
    unreadCount: conv.unreadCount || 0,
    isPinned: !!conv.isPinned,
    isMuted: !!conv.isMuted
  };
}

export function dbRowToConversation(row: any, currentUserId?: string): Conversation {
  const pIds = Array.isArray(row.participantIds) ? row.participantIds : [];
  const pList = Array.isArray(row.participants) ? row.participants : [];
  const otherP = (currentUserId ? pList.find((p: any) => p.id && p.id !== currentUserId) : null) || pList[1] || pList[0] || {};
  const otherId = (currentUserId ? pIds.find((id: string) => id !== currentUserId) : null) || otherP.id || pIds[1] || 'user-unknown';

  return {
    id: row.id,
    participantA: pIds[0] || currentUserId || '',
    participantB: pIds[1] || otherId,
    lastMessage: row.lastMessage || '',
    lastTimestamp: row.lastMessageTime || new Date().toISOString(),
    unreadCount: row.unreadCount || 0,
    isPinned: !!row.isPinned,
    isMuted: !!row.isMuted,
    otherUser: {
      id: otherId,
      name: otherP.name || 'Ecosystem Peer',
      avatar: otherP.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: otherP.role || 'founder',
      title: otherP.title || 'Startup Member',
      company: otherP.company || '',
      isOnline: !!otherP.isOnline,
      lastSeen: otherP.lastSeen || 'Active now'
    }
  };
}

// ----------------------------------------------------------------------
// WRITE / UPSERT HELPERS (Background & Live Cloud Sync)
// ----------------------------------------------------------------------

function cleanRecord<T extends Record<string, any>>(record: T): T {
  const clean: any = {};
  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean as T;
}

export async function syncStartupToSupabase(startup: Startup): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = cleanRecord(startup);
    const { error } = await supabase.from('startups').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncStartup error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncStartup error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function syncPostToSupabase(post: Post): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = postToDbRow(post);
    const { error } = await supabase.from('posts').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncPost error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncPost error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function deletePostFromSupabase(postId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      console.warn('[Supabase] deletePost error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] deletePost error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function syncUserToSupabase(user: User): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = cleanRecord(user);
    const { error } = await supabase.from('users').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncUser error:', error);
      return { success: false, error: error.message };
    }
    console.log('[Supabase] Successfully saved user to database:', user.name, user.id);
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncUser error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function syncMessageToSupabase(msg: MessageItem): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = messageToDbRow(msg);
    const { error } = await supabase.from('messages').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncMessage error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncMessage error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function deleteMessageFromSupabase(messageId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const { error } = await supabase.from('messages').delete().eq('id', messageId);
    if (error) {
      console.warn('[Supabase] deleteMessage error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] deleteMessage error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function syncConversationToSupabase(conv: Conversation): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = conversationToDbRow(conv);
    const { error } = await supabase.from('conversations').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncConversation error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncConversation error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function deleteConversationFromSupabase(conversationId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    await supabase.from('messages').delete().eq('conversationId', conversationId);
    const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
    if (error) {
      console.warn('[Supabase] deleteConversation error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] deleteConversation error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function syncInvestorRequestToSupabase(req: InvestorRequest): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = cleanRecord(req);
    const { error } = await supabase.from('investor_requests').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncInvestorRequest error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncInvestorRequest error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function syncMentorRequestToSupabase(req: MentorRequest): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = cleanRecord(req);
    const { error } = await supabase.from('mentor_requests').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncMentorRequest error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncMentorRequest error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function syncFounderPitchToSupabase(pitch: FounderPitch): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const clean = cleanRecord(pitch);
    const { error } = await supabase.from('founder_pitches').upsert(clean);
    if (error) {
      console.warn('[Supabase] syncFounderPitch error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] syncFounderPitch error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

// ----------------------------------------------------------------------
// REAL-TIME BROADCAST & POSTGRES_CHANGES SYNCHRONIZATION ENGINE
// ----------------------------------------------------------------------

export type RealtimeSyncEvent =
  | { type: 'message:new'; payload: { message: MessageItem; conversation?: Conversation } }
  | { type: 'message:update'; payload: { message: MessageItem } }
  | { type: 'message:delete'; payload: { messageId: string; conversationId: string } }
  | { type: 'conversation:new'; payload: { conversation: Conversation } }
  | { type: 'conversation:update'; payload: { conversation: Conversation } }
  | { type: 'conversation:delete'; payload: { conversationId: string } }
  | { type: 'post:new'; payload: { post: Post } }
  | { type: 'post:update'; payload: { post: Post } }
  | { type: 'post:delete'; payload: { postId: string } }
  | { type: 'notification:new'; payload: { notification: NotificationItem } };

let realtimeChannel: any = null;
let isRealtimeSubscribed = false;
let crossTabChannel: BroadcastChannel | null = null;
let currentActiveUserId: string | undefined = undefined;

// Internal subscriber registry
const syncSubscribers = new Set<(event: RealtimeSyncEvent) => void>();

function dispatchSyncEvent(event: RealtimeSyncEvent) {
  syncSubscribers.forEach(listener => {
    try {
      listener(event);
    } catch (err) {
      console.warn('[Sync Dispatcher] listener notice:', err);
    }
  });
}

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    crossTabChannel = new BroadcastChannel('riseup_cross_tab_sync');
    crossTabChannel.addEventListener('message', (e: MessageEvent) => {
      if (e.data && e.data.type) {
        dispatchSyncEvent(e.data as RealtimeSyncEvent);
      }
    });
  } catch (e) {
    console.warn('BroadcastChannel not supported', e);
  }
}

function ensureRealtimeChannel() {
  if (!supabase) return null;
  if (realtimeChannel && isRealtimeSubscribed) return realtimeChannel;

  if (!realtimeChannel) {
    try {
      realtimeChannel = supabase.channel('riseup-global-live-sync', {
        config: {
          broadcast: { self: false }
        }
      });

      // Register callbacks STRICTLY BEFORE subscribe()
      realtimeChannel
        .on('broadcast', { event: 'riseup_event' }, (msg: any) => {
          if (msg && msg.payload && msg.payload.type) {
            dispatchSyncEvent(msg.payload as RealtimeSyncEvent);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload: any) => {
          try {
            if (payload.eventType === 'INSERT') {
              const msg = dbRowToMessage(payload.new);
              dispatchSyncEvent({ type: 'message:new', payload: { message: msg } });
            } else if (payload.eventType === 'UPDATE') {
              const msg = dbRowToMessage(payload.new);
              dispatchSyncEvent({ type: 'message:update', payload: { message: msg } });
            } else if (payload.eventType === 'DELETE') {
              dispatchSyncEvent({
                type: 'message:delete',
                payload: { messageId: payload.old?.id || '', conversationId: payload.old?.conversationId || '' }
              });
            }
          } catch (e) {
            console.warn('[Realtime] messages sync error:', e);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload: any) => {
          try {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const conv = dbRowToConversation(payload.new, currentActiveUserId);
              dispatchSyncEvent({ type: 'conversation:update', payload: { conversation: conv } });
            } else if (payload.eventType === 'DELETE') {
              dispatchSyncEvent({ type: 'conversation:delete', payload: { conversationId: payload.old?.id || '' } });
            }
          } catch (e) {
            console.warn('[Realtime] conversations sync error:', e);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload: any) => {
          try {
            if (payload.eventType === 'INSERT') {
              const post = dbRowToPost(payload.new);
              dispatchSyncEvent({ type: 'post:new', payload: { post } });
            } else if (payload.eventType === 'UPDATE') {
              const post = dbRowToPost(payload.new);
              dispatchSyncEvent({ type: 'post:update', payload: { post } });
            } else if (payload.eventType === 'DELETE') {
              dispatchSyncEvent({ type: 'post:delete', payload: { postId: payload.old?.id || '' } });
            }
          } catch (e) {
            console.warn('[Realtime] posts sync error:', e);
          }
        });

      realtimeChannel.subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          isRealtimeSubscribed = true;
        }
      });
      isRealtimeSubscribed = true;
    } catch (err) {
      console.warn('[Supabase Realtime] Channel init error:', err);
    }
  }

  return realtimeChannel;
}

export function broadcastRealtimeEvent(event: RealtimeSyncEvent) {
  // 1. Instant local cross-tab broadcast (0 latency)
  if (crossTabChannel) {
    try {
      crossTabChannel.postMessage(event);
    } catch (err) {
      console.warn('Cross-tab broadcast error:', err);
    }
  }

  // 2. Supabase Realtime channel (remote devices & accounts)
  if (supabase) {
    const channel = ensureRealtimeChannel();
    try {
      channel?.send({
        type: 'broadcast',
        event: 'riseup_event',
        payload: event
      }).catch((err: any) => {
        console.warn('[Supabase Realtime] Broadcast send notice:', err);
      });
    } catch (err) {
      console.warn('[Supabase Realtime] Broadcast exception:', err);
    }
  }
}

export function subscribeToRealtimeSync(
  onEvent: (event: RealtimeSyncEvent) => void,
  currentUserId?: string
): () => void {
  if (currentUserId) {
    currentActiveUserId = currentUserId;
  }

  // Register listener in subscriber pool
  syncSubscribers.add(onEvent);

  // Initialize and subscribe underlying channel only once
  ensureRealtimeChannel();

  // Return unsubscribe cleanup function
  return () => {
    syncSubscribers.delete(onEvent);
  };
}

/**
 * Seeds or re-syncs all demo datasets into Supabase from client.
 */
export async function seedAllDemoDataToSupabase(onProgress?: (msg: string) => void): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client is not configured. Please set your credentials first.' };
  }

  try {
    onProgress?.('Uploading users...');
    const { error: errUsers } = await supabase.from('users').upsert(INITIAL_USERS);
    if (errUsers) throw new Error(`Users seed failed: ${errUsers.message}`);

    onProgress?.('Uploading startups...');
    const { error: errStartups } = await supabase.from('startups').upsert(INITIAL_STARTUPS);
    if (errStartups) throw new Error(`Startups seed failed: ${errStartups.message}`);

    onProgress?.('Uploading posts & discussions...');
    const dbPosts = INITIAL_POSTS.map(postToDbRow);
    const { error: errPosts } = await supabase.from('posts').upsert(dbPosts);
    if (errPosts) throw new Error(`Posts seed failed: ${errPosts.message}`);

    if (INITIAL_CONVERSATIONS.length > 0) {
      onProgress?.('Uploading conversations...');
      const dbConvs = INITIAL_CONVERSATIONS.map(conversationToDbRow);
      const { error: errConvs } = await supabase.from('conversations').upsert(dbConvs);
      if (errConvs) throw new Error(`Conversations seed failed: ${errConvs.message}`);
    }

    if (INITIAL_MESSAGES.length > 0) {
      onProgress?.('Uploading chat messages...');
      const dbMsgs = INITIAL_MESSAGES.map(messageToDbRow);
      const { error: errMsgs } = await supabase.from('messages').upsert(dbMsgs);
      if (errMsgs) throw new Error(`Messages seed failed: ${errMsgs.message}`);
    }

    onProgress?.('Uploading investor requests...');
    const { error: errInv } = await supabase.from('investor_requests').upsert(INITIAL_INVESTOR_REQUESTS);
    if (errInv) throw new Error(`Investor requests seed failed: ${errInv.message}`);

    onProgress?.('Uploading mentor requests...');
    const { error: errMen } = await supabase.from('mentor_requests').upsert(INITIAL_MENTOR_REQUESTS);
    if (errMen) throw new Error(`Mentor requests seed failed: ${errMen.message}`);

    onProgress?.('Uploading founder pitches...');
    const { error: errPitches } = await supabase.from('founder_pitches').upsert(INITIAL_FOUNDER_PITCHES);
    if (errPitches) throw new Error(`Founder pitches seed failed: ${errPitches.message}`);

    onProgress?.('Database seed completed successfully!');
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase seed error]:', err);
    return { success: false, error: err?.message || 'Unknown seed error' };
  }
}
