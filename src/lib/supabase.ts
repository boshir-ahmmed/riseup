import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  User,
  Startup,
  Post,
  Conversation,
  MessageItem,
  InvestorRequest,
  MentorRequest,
  FounderPitch
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
    return data as Post[];
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

export async function fetchConversationsFromSupabase(): Promise<Conversation[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('conversations').select('*');
    if (error) return null;
    return data as Conversation[];
  } catch {
    return null;
  }
}

export async function fetchMessagesFromSupabase(): Promise<MessageItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
    if (error) return null;
    return data as MessageItem[];
  } catch {
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
// WRITE / UPSERT HELPERS (Background Sync)
// ----------------------------------------------------------------------

export async function syncStartupToSupabase(startup: Startup): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('startups').upsert(startup);
  } catch (err) {
    console.warn('[Supabase] syncStartup error:', err);
  }
}

export async function syncPostToSupabase(post: Post): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('posts').upsert(post);
  } catch (err) {
    console.warn('[Supabase] syncPost error:', err);
  }
}

export async function syncUserToSupabase(user: User): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('users').upsert(user);
  } catch (err) {
    console.warn('[Supabase] syncUser error:', err);
  }
}

export async function syncMessageToSupabase(msg: MessageItem): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('messages').upsert(msg);
  } catch (err) {
    console.warn('[Supabase] syncMessage error:', err);
  }
}

export async function syncInvestorRequestToSupabase(req: InvestorRequest): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('investor_requests').upsert(req);
  } catch (err) {
    console.warn('[Supabase] syncInvestorRequest error:', err);
  }
}

export async function syncMentorRequestToSupabase(req: MentorRequest): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('mentor_requests').upsert(req);
  } catch (err) {
    console.warn('[Supabase] syncMentorRequest error:', err);
  }
}

export async function syncFounderPitchToSupabase(pitch: FounderPitch): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('founder_pitches').upsert(pitch);
  } catch (err) {
    console.warn('[Supabase] syncFounderPitch error:', err);
  }
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
    const { error: errPosts } = await supabase.from('posts').upsert(INITIAL_POSTS);
    if (errPosts) throw new Error(`Posts seed failed: ${errPosts.message}`);

    onProgress?.('Uploading conversations...');
    const { error: errConvs } = await supabase.from('conversations').upsert(INITIAL_CONVERSATIONS);
    if (errConvs) throw new Error(`Conversations seed failed: ${errConvs.message}`);

    onProgress?.('Uploading chat messages...');
    const { error: errMsgs } = await supabase.from('messages').upsert(INITIAL_MESSAGES);
    if (errMsgs) throw new Error(`Messages seed failed: ${errMsgs.message}`);

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
