import fs from 'fs';
import path from 'path';
import {
  INITIAL_USERS,
  INITIAL_STARTUPS,
  INITIAL_POSTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_INVESTOR_REQUESTS,
  INITIAL_MENTOR_REQUESTS,
  INITIAL_FOUNDER_PITCHES
} from '../src/data/mockData';

function escapeSql(str: any): string {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return String(str);
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (typeof str === 'object') {
    const jsonStr = JSON.stringify(str);
    return `'${jsonStr.replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(str).replace(/'/g, "''")}'`;
}

let sql = `-- ==============================================================================
-- RISEUP ECOSYSTEM PLATFORM - SUPABASE FULL SCHEMA & DEMO DATA SEED
-- ==============================================================================
-- Run this entire script in your Supabase Dashboard:
-- 1. Open your Supabase project (https://app.supabase.com)
-- 2. Click "SQL Editor" on the left sidebar
-- 3. Click "New Query", paste this entire script, and click "RUN"
-- 4. Go to "Table Editor" to see and edit your data in spreadsheet view!
-- ==============================================================================

-- 1. Create Tables
-- ------------------------------------------------------------------------------

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'founder',
  avatar TEXT,
  "coverImage" TEXT,
  title TEXT,
  company TEXT,
  location TEXT,
  bio TEXT,
  website TEXT,
  linkedin TEXT,
  twitter TEXT,
  github TEXT,
  "isVerified" BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  "joinedDate" TEXT,
  "profileCompletion" INTEGER DEFAULT 80,
  achievements JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  "resumeUrl" TEXT,
  "resumeName" TEXT,
  "resumeSize" TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  "investmentInterests" JSONB DEFAULT '[]'::jsonb,
  "preferredIndustries" JSONB DEFAULT '[]'::jsonb,
  "preferredStages" JSONB DEFAULT '[]'::jsonb,
  "investmentRange" JSONB,
  "portfolioCount" INTEGER DEFAULT 0,
  "portfolioCompanies" JSONB DEFAULT '[]'::jsonb,
  "mentorSkills" JSONB DEFAULT '[]'::jsonb,
  "mentorExperienceYears" INTEGER DEFAULT 0,
  "mentorIndustries" JSONB DEFAULT '[]'::jsonb,
  "mentorAvailability" TEXT,
  "activeMentoredStartupId" TEXT,
  "mentorRating" NUMERIC,
  "mentorReviewCount" INTEGER DEFAULT 0,
  "mentorCertificates" JSONB DEFAULT '[]'::jsonb,
  "startupId" TEXT,
  "founderLookingFor" JSONB DEFAULT '[]'::jsonb,
  "founderStage" TEXT,
  "coFounderRolesLookingFor" JSONB DEFAULT '[]'::jsonb
);

-- Startups Table
CREATE TABLE IF NOT EXISTS public.startups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  logo TEXT,
  "coverImage" TEXT,
  "founderId" TEXT,
  "founderName" TEXT,
  "founderAvatar" TEXT,
  industry TEXT,
  "subIndustry" TEXT,
  location TEXT,
  country TEXT,
  website TEXT,
  "foundedYear" INTEGER,
  stage TEXT,
  "businessModel" TEXT,
  story TEXT,
  vision TEXT,
  mission TEXT,
  problem TEXT,
  solution TEXT,
  "marketSize" TEXT,
  "targetCustomers" TEXT,
  "fundingGoal" NUMERIC DEFAULT 0,
  "fundingRaised" NUMERIC DEFAULT 0,
  valuation NUMERIC DEFAULT 0,
  "equityOffered" NUMERIC DEFAULT 0,
  "minInvestment" NUMERIC DEFAULT 0,
  "revenueMRR" NUMERIC DEFAULT 0,
  "growthRatePercent" NUMERIC DEFAULT 0,
  "pitchDeckUrl" TEXT,
  "pitchDeckName" TEXT,
  "executiveSummaryUrl" TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  "videoUrl" TEXT,
  "teamMembers" JSONB DEFAULT '[]'::jsonb,
  milestones JSONB DEFAULT '[]'::jsonb,
  "techStack" JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  "interestedInvestorIds" JSONB DEFAULT '[]'::jsonb,
  "joinedInvestorIds" JSONB DEFAULT '[]'::jsonb,
  "assignedMentorId" TEXT,
  "assignedMentorName" TEXT,
  "viewsCount" INTEGER DEFAULT 0,
  "likesCount" INTEGER DEFAULT 0,
  "savedCount" INTEGER DEFAULT 0,
  "isFeatured" BOOLEAN DEFAULT false,
  "isVerified" BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  "createdAt" TEXT
);

-- Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  "startupId" TEXT,
  "startupName" TEXT,
  "startupLogo" TEXT,
  "startupStage" TEXT,
  "startupIndustry" TEXT,
  "authorId" TEXT,
  "authorName" TEXT,
  "authorAvatar" TEXT,
  "authorRole" TEXT,
  "authorTitle" TEXT,
  type TEXT DEFAULT 'announcement',
  title TEXT,
  content TEXT,
  "mediaUrl" TEXT,
  "mediaType" TEXT DEFAULT 'none',
  tags JSONB DEFAULT '[]'::jsonb,
  "createdAt" TEXT,
  "likesCount" INTEGER DEFAULT 0,
  "commentsCount" INTEGER DEFAULT 0,
  "sharesCount" INTEGER DEFAULT 0,
  "viewsCount" INTEGER DEFAULT 0,
  "isLiked" BOOLEAN DEFAULT false,
  "isBookmarked" BOOLEAN DEFAULT false,
  reactions JSONB DEFAULT '{"love": 0}'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  "userReactions" JSONB DEFAULT '{}'::jsonb
);

-- Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY,
  "participantIds" JSONB DEFAULT '[]'::jsonb,
  participants JSONB DEFAULT '[]'::jsonb,
  "lastMessage" TEXT,
  "lastMessageTime" TEXT,
  "unreadCount" INTEGER DEFAULT 0,
  "isPinned" BOOLEAN DEFAULT false,
  "isMuted" BOOLEAN DEFAULT false,
  "startupId" TEXT,
  "startupName" TEXT
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  "conversationId" TEXT,
  "senderId" TEXT,
  "senderName" TEXT,
  "senderAvatar" TEXT,
  text TEXT,
  timestamp TEXT,
  "isRead" BOOLEAN DEFAULT false,
  "mediaUrl" TEXT,
  "attachmentName" TEXT,
  "attachmentSize" TEXT,
  "attachmentUrl" TEXT,
  "replyTo" JSONB,
  "voiceNote" JSONB
);

-- Investor Requests Table
CREATE TABLE IF NOT EXISTS public.investor_requests (
  id TEXT PRIMARY KEY,
  "startupId" TEXT,
  "startupName" TEXT,
  "startupLogo" TEXT,
  "investorId" TEXT,
  "investorName" TEXT,
  "investorAvatar" TEXT,
  "investorCompany" TEXT,
  "checkSize" NUMERIC,
  status TEXT DEFAULT 'pending',
  message TEXT,
  stage TEXT,
  "equityAsked" NUMERIC,
  notes TEXT,
  "createdAt" TEXT,
  "updatedAt" TEXT
);

-- Mentor Requests Table
CREATE TABLE IF NOT EXISTS public.mentor_requests (
  id TEXT PRIMARY KEY,
  "startupId" TEXT,
  "startupName" TEXT,
  "startupLogo" TEXT,
  "founderId" TEXT,
  "founderName" TEXT,
  "founderAvatar" TEXT,
  "mentorId" TEXT,
  "mentorName" TEXT,
  "mentorAvatar" TEXT,
  topic TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  "proposedDuration" TEXT,
  "skillsNeeded" JSONB DEFAULT '[]'::jsonb,
  "meetingLink" TEXT,
  notes TEXT,
  "createdAt" TEXT
);

-- Founder Pitches Table
CREATE TABLE IF NOT EXISTS public.founder_pitches (
  id TEXT PRIMARY KEY,
  "senderFounderId" TEXT,
  "senderFounderName" TEXT,
  "senderFounderAvatar" TEXT,
  "senderFounderTitle" TEXT,
  "senderStartupId" TEXT,
  "senderStartupName" TEXT,
  "senderStartupLogo" TEXT,
  "recipientFounderId" TEXT,
  "recipientFounderName" TEXT,
  "recipientFounderAvatar" TEXT,
  "recipientFounderTitle" TEXT,
  "recipientStartupId" TEXT,
  "recipientStartupName" TEXT,
  "pitchType" TEXT,
  title TEXT,
  summary TEXT,
  "synergyPoints" JSONB DEFAULT '[]'::jsonb,
  "deckUrl" TEXT,
  "deckName" TEXT,
  "proposedNextStep" TEXT,
  status TEXT DEFAULT 'pending',
  "createdAt" TEXT,
  note TEXT
);

-- 2. Enable Row Level Security (RLS) and grant public access
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_pitches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access on users" ON public.users;
CREATE POLICY "Public full access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on startups" ON public.startups;
CREATE POLICY "Public full access on startups" ON public.startups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on posts" ON public.posts;
CREATE POLICY "Public full access on posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on conversations" ON public.conversations;
CREATE POLICY "Public full access on conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on messages" ON public.messages;
CREATE POLICY "Public full access on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on investor_requests" ON public.investor_requests;
CREATE POLICY "Public full access on investor_requests" ON public.investor_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on mentor_requests" ON public.mentor_requests;
CREATE POLICY "Public full access on mentor_requests" ON public.mentor_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on founder_pitches" ON public.founder_pitches;
CREATE POLICY "Public full access on founder_pitches" ON public.founder_pitches FOR ALL USING (true) WITH CHECK (true);

-- 3. Demo Data Seed
-- ------------------------------------------------------------------------------
`;

// Populate Users
sql += '\n-- Seed Users\n';
for (const u of INITIAL_USERS) {
  sql += `INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    ${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.role)}, ${escapeSql(u.avatar)},
    ${escapeSql(u.coverImage)}, ${escapeSql(u.title)}, ${escapeSql(u.company)}, ${escapeSql(u.location)}, ${escapeSql(u.bio)},
    ${escapeSql(u.website)}, ${escapeSql(u.linkedin)}, ${escapeSql(u.twitter)}, ${escapeSql(u.github)}, ${escapeSql(u.isVerified)},
    ${escapeSql(u.status)}, ${escapeSql(u.joinedDate)}, ${escapeSql(u.profileCompletion)},
    ${escapeSql(u.achievements)}, ${escapeSql(u.skills)}, ${escapeSql(u.resumeUrl)}, ${escapeSql(u.resumeName)}, ${escapeSql(u.resumeSize)},
    ${escapeSql(u.documents)}, ${escapeSql(u.investmentInterests)}, ${escapeSql(u.preferredIndustries)}, ${escapeSql(u.preferredStages)},
    ${escapeSql(u.investmentRange)}, ${escapeSql(u.portfolioCount)}, ${escapeSql(u.portfolioCompanies)}, ${escapeSql(u.mentorSkills)},
    ${escapeSql(u.mentorExperienceYears)}, ${escapeSql(u.mentorIndustries)}, ${escapeSql(u.mentorAvailability)},
    ${escapeSql(u.activeMentoredStartupId)}, ${escapeSql(u.mentorRating)}, ${escapeSql(u.mentorReviewCount)}, ${escapeSql(u.mentorCertificates)},
    ${escapeSql(u.startupId)}, ${escapeSql(u.founderLookingFor)}, ${escapeSql(u.founderStage)}
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;\n`;
}

// Populate Startups
sql += '\n-- Seed Startups\n';
for (const s of INITIAL_STARTUPS) {
  sql += `INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    ${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.tagline)}, ${escapeSql(s.logo)}, ${escapeSql(s.coverImage)},
    ${escapeSql(s.founderId)}, ${escapeSql(s.founderName)}, ${escapeSql(s.founderAvatar)},
    ${escapeSql(s.industry)}, ${escapeSql(s.subIndustry)}, ${escapeSql(s.location)}, ${escapeSql(s.country)}, ${escapeSql(s.website)},
    ${escapeSql(s.foundedYear)}, ${escapeSql(s.stage)}, ${escapeSql(s.businessModel)},
    ${escapeSql(s.story)}, ${escapeSql(s.vision)}, ${escapeSql(s.mission)}, ${escapeSql(s.problem)}, ${escapeSql(s.solution)},
    ${escapeSql(s.marketSize)}, ${escapeSql(s.targetCustomers)},
    ${escapeSql(s.fundingGoal)}, ${escapeSql(s.fundingRaised)}, ${escapeSql(s.valuation)}, ${escapeSql(s.equityOffered)},
    ${escapeSql(s.minInvestment)}, ${escapeSql(s.revenueMRR)}, ${escapeSql(s.growthRatePercent)},
    ${escapeSql(s.pitchDeckUrl)}, ${escapeSql(s.pitchDeckName)}, ${escapeSql(s.executiveSummaryUrl)},
    ${escapeSql(s.gallery)}, ${escapeSql(s.videoUrl)},
    ${escapeSql(s.teamMembers)}, ${escapeSql(s.milestones)}, ${escapeSql(s.techStack)}, ${escapeSql(s.tags)},
    ${escapeSql(s.interestedInvestorIds)}, ${escapeSql(s.joinedInvestorIds)},
    ${escapeSql(s.assignedMentorId)}, ${escapeSql(s.assignedMentorName)},
    ${escapeSql(s.viewsCount)}, ${escapeSql(s.likesCount)}, ${escapeSql(s.savedCount)},
    ${escapeSql(s.isFeatured)}, ${escapeSql(s.isVerified)}, ${escapeSql(s.status)}, ${escapeSql(s.createdAt)}
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;\n`;
}

// Populate Posts
sql += '\n-- Seed Posts\n';
for (const p of INITIAL_POSTS) {
  sql += `INSERT INTO public.posts (
    id, "startupId", "startupName", "startupLogo", "startupStage", "startupIndustry",
    "authorId", "authorName", "authorAvatar", "authorRole", "authorTitle",
    type, title, content, "mediaUrl", "mediaType", tags, "createdAt",
    "likesCount", "commentsCount", "sharesCount", "viewsCount", "isLiked", "isBookmarked",
    reactions, comments, "userReactions"
  ) VALUES (
    ${escapeSql(p.id)}, ${escapeSql(p.startupId)}, ${escapeSql(p.startupName)}, ${escapeSql(p.startupLogo)},
    ${escapeSql(p.startupStage)}, ${escapeSql(p.startupIndustry)},
    ${escapeSql(p.authorId)}, ${escapeSql(p.authorName)}, ${escapeSql(p.authorAvatar)}, ${escapeSql(p.authorRole)}, ${escapeSql(p.authorTitle)},
    ${escapeSql(p.type)}, ${escapeSql(p.title)}, ${escapeSql(p.content)}, ${escapeSql(p.mediaUrl)}, ${escapeSql(p.mediaType)},
    ${escapeSql(p.tags)}, ${escapeSql(p.createdAt)},
    ${escapeSql(p.likesCount)}, ${escapeSql(p.commentsCount)}, ${escapeSql(p.sharesCount)}, ${escapeSql(p.viewsCount)},
    ${escapeSql(p.isLiked)}, ${escapeSql(p.isBookmarked)},
    ${escapeSql(p.reactions)}, ${escapeSql(p.comments)}, ${escapeSql(p.userReactions)}
  ) ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    "likesCount" = EXCLUDED."likesCount";\n`;
}

// Populate Conversations
sql += '\n-- Seed Conversations\n';
for (const c of INITIAL_CONVERSATIONS) {
  sql += `INSERT INTO public.conversations (
    id, "participantIds", participants, "lastMessage", "lastMessageTime", "unreadCount", "isPinned", "isMuted", "startupId", "startupName"
  ) VALUES (
    ${escapeSql(c.id)}, ${escapeSql(c.participantIds)}, ${escapeSql(c.participants)}, ${escapeSql(c.lastMessage)},
    ${escapeSql(c.lastMessageTime)}, ${escapeSql(c.unreadCount)}, ${escapeSql(c.isPinned)}, ${escapeSql(c.isMuted)},
    ${escapeSql(c.startupId)}, ${escapeSql(c.startupName)}
  ) ON CONFLICT (id) DO NOTHING;\n`;
}

// Populate Messages
sql += '\n-- Seed Messages\n';
for (const m of INITIAL_MESSAGES) {
  sql += `INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    ${escapeSql(m.id)}, ${escapeSql(m.conversationId)}, ${escapeSql(m.senderId)}, ${escapeSql(m.senderName)},
    ${escapeSql(m.senderAvatar)}, ${escapeSql(m.text)}, ${escapeSql(m.timestamp)}, ${escapeSql(m.isRead)},
    ${escapeSql(m.mediaUrl)}, ${escapeSql(m.attachmentName)}, ${escapeSql(m.attachmentSize)}, ${escapeSql(m.attachmentUrl)},
    ${escapeSql(m.replyTo)}, ${escapeSql(m.voiceNote)}
  ) ON CONFLICT (id) DO NOTHING;\n`;
}

// Populate Investor Requests
sql += '\n-- Seed Investor Requests\n';
for (const r of INITIAL_INVESTOR_REQUESTS) {
  sql += `INSERT INTO public.investor_requests (
    id, "startupId", "startupName", "startupLogo", "investorId", "investorName",
    "investorAvatar", "investorCompany", "checkSize", status, message, stage,
    "equityAsked", notes, "createdAt", "updatedAt"
  ) VALUES (
    ${escapeSql(r.id)}, ${escapeSql(r.startupId)}, ${escapeSql(r.startupName)}, ${escapeSql(r.startupLogo)},
    ${escapeSql(r.investorId)}, ${escapeSql(r.investorName)}, ${escapeSql(r.investorAvatar)}, ${escapeSql(r.investorCompany)},
    ${escapeSql(r.checkSize)}, ${escapeSql(r.status)}, ${escapeSql(r.message)}, ${escapeSql(r.stage)},
    ${escapeSql(r.equityAsked)}, ${escapeSql(r.notes)}, ${escapeSql(r.createdAt)}, ${escapeSql(r.updatedAt)}
  ) ON CONFLICT (id) DO NOTHING;\n`;
}

// Populate Mentor Requests
sql += '\n-- Seed Mentor Requests\n';
for (const mr of INITIAL_MENTOR_REQUESTS) {
  sql += `INSERT INTO public.mentor_requests (
    id, "startupId", "startupName", "startupLogo", "founderId", "founderName",
    "founderAvatar", "mentorId", "mentorName", "mentorAvatar", topic, message,
    status, "proposedDuration", "skillsNeeded", "meetingLink", notes, "createdAt"
  ) VALUES (
    ${escapeSql(mr.id)}, ${escapeSql(mr.startupId)}, ${escapeSql(mr.startupName)}, ${escapeSql(mr.startupLogo)},
    ${escapeSql(mr.founderId)}, ${escapeSql(mr.founderName)}, ${escapeSql(mr.founderAvatar)},
    ${escapeSql(mr.mentorId)}, ${escapeSql(mr.mentorName)}, ${escapeSql(mr.mentorAvatar)},
    ${escapeSql(mr.topic)}, ${escapeSql(mr.message)}, ${escapeSql(mr.status)},
    ${escapeSql(mr.proposedDuration)}, ${escapeSql(mr.skillsNeeded)}, ${escapeSql(mr.meetingLink)},
    ${escapeSql(mr.notes)}, ${escapeSql(mr.createdAt)}
  ) ON CONFLICT (id) DO NOTHING;\n`;
}

// Populate Founder Pitches
sql += '\n-- Seed Founder Pitches\n';
for (const fp of INITIAL_FOUNDER_PITCHES) {
  sql += `INSERT INTO public.founder_pitches (
    id, "senderFounderId", "senderFounderName", "senderFounderAvatar", "senderFounderTitle",
    "senderStartupId", "senderStartupName", "senderStartupLogo", "recipientFounderId",
    "recipientFounderName", "recipientFounderAvatar", "recipientFounderTitle", "recipientStartupId",
    "recipientStartupName", "pitchType", title, summary, "synergyPoints", "deckUrl", "deckName",
    "proposedNextStep", status, "createdAt", note
  ) VALUES (
    ${escapeSql(fp.id)}, ${escapeSql(fp.senderFounderId)}, ${escapeSql(fp.senderFounderName)}, ${escapeSql(fp.senderFounderAvatar)},
    ${escapeSql(fp.senderFounderTitle)}, ${escapeSql(fp.senderStartupId)}, ${escapeSql(fp.senderStartupName)}, ${escapeSql(fp.senderStartupLogo)},
    ${escapeSql(fp.recipientFounderId)}, ${escapeSql(fp.recipientFounderName)}, ${escapeSql(fp.recipientFounderAvatar)},
    ${escapeSql(fp.recipientFounderTitle)}, ${escapeSql(fp.recipientStartupId)}, ${escapeSql(fp.recipientStartupName)},
    ${escapeSql(fp.pitchType)}, ${escapeSql(fp.title)}, ${escapeSql(fp.summary)}, ${escapeSql(fp.synergyPoints)},
    ${escapeSql(fp.deckUrl)}, ${escapeSql(fp.deckName)}, ${escapeSql(fp.proposedNextStep)}, ${escapeSql(fp.status)},
    ${escapeSql(fp.createdAt)}, ${escapeSql(fp.note)}
  ) ON CONFLICT (id) DO NOTHING;\n`;
}

const outputPath = path.join(process.cwd(), 'supabase_schema_and_seed.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Successfully generated supabase_schema_and_seed.sql at', outputPath);
