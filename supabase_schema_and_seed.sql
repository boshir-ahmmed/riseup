-- ==============================================================================
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

-- 3. Supabase Storage Setup (riseup-media bucket)
-- ------------------------------------------------------------------------------
-- Creates the public storage bucket for avatars, covers, startups, posts, pitch decks & documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'riseup-media',
  'riseup-media',
  true,
  52428800, -- 50MB file size limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- Storage Row Level Security (RLS) Policies
DROP POLICY IF EXISTS "Public read access to riseup-media" ON storage.objects;
CREATE POLICY "Public read access to riseup-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'riseup-media');

DROP POLICY IF EXISTS "Public upload access to riseup-media" ON storage.objects;
CREATE POLICY "Public upload access to riseup-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'riseup-media');

DROP POLICY IF EXISTS "Public update access to riseup-media" ON storage.objects;
CREATE POLICY "Public update access to riseup-media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'riseup-media');

DROP POLICY IF EXISTS "Public delete access to riseup-media" ON storage.objects;
CREATE POLICY "Public delete access to riseup-media"
ON storage.objects FOR DELETE
USING (bucket_id = 'riseup-media');

-- 4. Demo Data Seed
-- ------------------------------------------------------------------------------

-- Seed Users
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-admin', 'Alexander Mercer', 'admin@riseup.dev', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    NULL, 'Platform Chief Administrator & Trust & Safety Lead', 'RiseUp Global Ecosystem', 'San Francisco, CA, USA', 'Overseeing ecosystem integrity, startup verification, community health, and institutional venture partnerships on RiseUp.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2023-01-10', 100,
    '["Ecosystem Architect","Super Moderator","Verified Platform Lead","500+ Startups Vetted"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-founder-1', 'Sarah Chen', 'sarah.chen@neuropulse.ai', 'founder', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    NULL, 'Founder & CEO at NeuroPulse AI', 'NeuroPulse AI', 'Palo Alto, CA, USA', 'Stanford PhD in Computational Neuroscience. Building non-invasive neural interface diagnostics for early detection of neurological disorders.',
    'https://neuropulse.ai', 'https://linkedin.com/in/sarahchen-neuropulse', 'https://twitter.com/sarahchen_ai', 'https://github.com/sarahchen', TRUE,
    'active', '2024-02-15', 95,
    '["Y Combinator Alum","Forbes 30 Under 30","Stanford Bio-X Fellow","TechCrunch Disrupt Finalist"]'::jsonb, '["Computational Neuroscience","Deep Learning","Biomedical Sensing","Clinical Trials","Python","PyTorch"]'::jsonb, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    'startup-1', '["BioTech Synergies","Edge IoT Hardware Partners","Technical Co-Founders","Peer Feedback"]'::jsonb, 'Seed'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-investor-1', 'Marcus Vance', 'marcus@apexventures.vc', 'investor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    NULL, 'General Partner at Apex Venture Capital', 'Apex Venture Capital', 'New York, NY, USA', 'Investing $250k - $3M in Seed & Series A B2B SaaS, Applied AI, and DeepTech infrastructure. 12+ years in early-stage venture.',
    'https://apexventures.vc', 'https://linkedin.com/in/marcusvance-vc', 'https://twitter.com/marcusvance_vc', NULL, TRUE,
    'active', '2023-08-20', 100,
    '["Top Tier Lead Investor","Midas Seed List 2025","3 Unicorn Exits","50+ Verified Cheques"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, '["Applied AI","Enterprise SaaS","BioTech Diagnostics","Autonomous Systems","FinTech Infra"]'::jsonb, '["Artificial Intelligence","HealthTech","FinTech","CleanTech","Developer Tools"]'::jsonb, '["Seed","Series A"]'::jsonb,
    '{"min":250000,"max":2500000}'::jsonb, 38, '[{"name":"Stripe","stage":"Public / IPO","logo":"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80"},{"name":"DataRobot","stage":"Series G","logo":"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80"},{"name":"Synthesia","stage":"Series C","logo":"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80"}]'::jsonb, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-mentor-1', 'Dr. Elena Rostova', 'elena@productscale.io', 'mentor', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    NULL, 'Ex-VP Product at Stripe | Executive AI Advisor', 'Scale Advisory Labs', 'London, UK / Remote', 'Helping deep tech & B2B founders scale product-market fit, enterprise sales cycles, and pricing tiers from $0 to $20M ARR. Passionate about ethical AI.',
    'https://elenarostova.dev', 'https://linkedin.com/in/elena-rostova-product', 'https://twitter.com/elena_product', NULL, TRUE,
    'active', '2023-11-05', 100,
    '["Top Rated Mentor 2025","14 Cohorts Mentored","Keynote Speaker TechCrunch","Zero-to-One Master"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, '["Product-Market Fit","Go-To-Market Strategy","Enterprise Sales","Pricing & Monetization","AI System Architecture","Board Advisory"]'::jsonb,
    16, '["Artificial Intelligence","B2B SaaS","FinTech","HealthTech"]'::jsonb, 'Available (Accepting Startups)',
    'startup-1', 4.96, 42, '["Stanford Executive Leadership","Reforge Growth & PMF Fellow","Harvard Business Case Advisor"]'::jsonb,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-founder-2', 'Mateo Morales', 'mateo@verdetec.eco', 'founder', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    NULL, 'Founder & CTO at VerdeGrid', 'VerdeGrid', 'Austin, TX, USA', 'Former Tesla energy grid engineer developing automated micro-grid distribution software for renewable storage clusters.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2024-01-12', 90,
    '["CleanTech Breakthrough 2024","DOE Grant Winner"]'::jsonb, '["Renewable Energy","Grid Automation","IoT Micro-controllers","Rust","Embedded C++"]'::jsonb, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    'startup-2', '["Battery Supply Partners","AI Analytics Integration","Angel Syndicate Backing","Cross-Promotion"]'::jsonb, 'Series A'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-founder-3', 'Aisha Al-Mansoor', 'aisha@zenithquantum.tech', 'founder', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    NULL, 'CEO & Co-Founder at Zenith Quantum', 'Zenith Quantum', 'Dubai, UAE / Zurich, CH', 'Quantum algorithm simulator for accelerated cryptographic threat detection and high-density material modeling.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2024-03-01', 92,
    '["MIT Innovator Under 35","European Innovation Council Fellow"]'::jsonb, '["Quantum Information Science","Post-Quantum Cryptography","Qiskit","Linear Algebra","C++"]'::jsonb, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    'startup-3', '["Cybersecurity Integrations","Enterprise Pilot Partners","Co-Founder GTM Lead","Peer Feedback"]'::jsonb, 'Seed'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-founder-4', 'David Kim', 'david@soluxbio.com', 'founder', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    NULL, 'Founder & CSO at Solux BioSciences', 'Solux BioSciences', 'Boston, MA, USA', 'Synthesizing biodegradable protein polymers to replace petroleum plastics in biomedical packaging.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2024-04-10', 88,
    '["Harvard Biotech Lab Alum","DARPA Grant Recipient"]'::jsonb, '["Biopolymer Synthesis","Molecular Biology","Material Science","FDA Regulatory Pathway","Biochemistry"]'::jsonb, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    'startup-4', '["Medical Device Packaging Pilots","Lab Equipment Shared Services","Supply Chain Co-Founders"]'::jsonb, 'Seed'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-founder-5', 'Sophia Lindqvist', 'sophia@aurorasecure.io', 'founder', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    NULL, 'Co-Founder & CEO at Aurora Identity', 'Aurora Identity', 'Stockholm, Sweden', 'Decentralized zero-knowledge proof identity verification for cross-border banking compliance.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2024-02-28', 94,
    '["Nordic FinTech of the Year","Seedcamp Batch 2024"]'::jsonb, '["Zero-Knowledge Cryptography","ZK-SNARKs","FinTech Compliance","Go","Distributed Systems"]'::jsonb, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    'startup-5', '["Neobank Banking Pilots","B2B SaaS Security Partnerships","FinTech Co-Pitching"]'::jsonb, 'Series A'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-founder-6', 'Rajesh Patel', 'rajesh@agriorbit.ai', 'founder', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    NULL, 'Founder & CEO at AgriOrbit', 'AgriOrbit', 'Bengaluru, India', 'Autonomous crop health forecasting using hyper-spectral nanosatellite imagery and edge IoT sensors.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2024-01-20', 91,
    '["NASSCOM Top 10 AgriTech","Global Food Security Prize"]'::jsonb, '["Hyperspectral Analytics","Geospatial ML","Edge Hardware","Computer Vision","Drone Photogrammetry"]'::jsonb, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    'startup-6', '["Global Drone Operators","Supply Chain SaaS Integrations","Co-Founder (Sales/GTM)","Peer Review"]'::jsonb, 'Pre-Seed'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-investor-2', 'Claire Beauchamp', 'claire@horizoncapital.fr', 'investor', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    NULL, 'Partner at Horizon Climate Capital', 'Horizon Climate Capital', 'Paris, France', 'Backing decarbonization, grid modernization, and circular economy startups across Europe and North America.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2023-09-14', 95,
    '["EU Green Deal Angel of the Year","Climate Pledge Investor"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, '["CleanTech","Energy Storage","Carbon Capture","AgTech"]'::jsonb, '["CleanTech","AgTech","DeepTech"]'::jsonb, '["Seed","Series A","Series B"]'::jsonb,
    '{"min":500000,"max":4000000}'::jsonb, 24, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-investor-3', 'Jonathan Reynolds', 'jreynolds@sequoiapass.com', 'investor', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    NULL, 'Managing Director at Beacon Peak Ventures', 'Beacon Peak Ventures', 'San Francisco, CA, USA', 'Early backer in developer tools, infrastructure software, and AI agents. Passionate about technical founders.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2023-07-11', 100,
    '["AngelList Top Scout","GitHub Star Investor"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, '["Developer Tools","Open Source Commercialization","LLMOps","Security"]'::jsonb, '["Developer Tools","Artificial Intelligence","CyberSecurity"]'::jsonb, '["Pre-Seed","Seed"]'::jsonb,
    '{"min":100000,"max":1500000}'::jsonb, 45, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-investor-4', 'Amara Okafor', 'amara@savannahseed.vc', 'investor', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    NULL, 'Founding Partner at Savannah Growth Fund', 'Savannah Growth Fund', 'Nairobi, Kenya / London', 'Investing in high-impact emerging market fintech, logistics, and healthcare infrastructure.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2024-01-05', 92,
    '["Africa Tech Investor of 2024","World Bank Tech Fellow"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, '["FinTech","Supply Chain","HealthTech","B2B Commerce"]'::jsonb, '["FinTech","Logistics","HealthTech"]'::jsonb, '["Seed","Series A"]'::jsonb,
    '{"min":200000,"max":2000000}'::jsonb, 19, NULL, NULL,
    NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-mentor-2', 'Hiroshi Tanaka', 'hiroshi@tokyoangels.jp', 'mentor', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    NULL, 'Ex-VP Engineering at Sony Robotics | DeepTech Specialist', 'Quantum Edge Consulting', 'Tokyo, Japan', 'Mentoring robotics, hardware manufacturing, and computer vision founders on scaling supply chains and ISO certifications.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2023-12-01', 98,
    '["50+ Patents Granted","IEEE Senior Member","Robotics Mentor of the Year"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, '["Hardware Engineering","Robotics Architecture","Supply Chain Scaling","Patent Strategy","Manufacturing Compliance"]'::jsonb,
    22, '["Robotics","DeepTech","IoT","Hardware"]'::jsonb, 'Available (Accepting Startups)',
    NULL, 4.98, 35, NULL,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;
INSERT INTO public.users (
    id, name, email, role, avatar, "coverImage", title, company, location, bio,
    website, linkedin, twitter, github, "isVerified", status, "joinedDate", "profileCompletion",
    achievements, skills, "resumeUrl", "resumeName", "resumeSize", documents,
    "investmentInterests", "preferredIndustries", "preferredStages", "investmentRange",
    "portfolioCount", "portfolioCompanies", "mentorSkills", "mentorExperienceYears",
    "mentorIndustries", "mentorAvailability", "activeMentoredStartupId", "mentorRating",
    "mentorReviewCount", "mentorCertificates", "startupId", "founderLookingFor", "founderStage"
  ) VALUES (
    'user-mentor-3', 'Jessica Gomez', 'jessica@growthaccelerator.co', 'mentor', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    NULL, 'Ex-CMO at Figma & Miro | B2B Growth Architect', 'PLG Catalyst', 'San Francisco, CA, USA', 'Specialized in Product-Led Growth (PLG), viral loops, enterprise sales enablement, and positioning narrative for series A readiness.',
    NULL, NULL, NULL, NULL, TRUE,
    'active', '2024-02-10', 96,
    '["Reforge Faculty Member","Top 100 SaaS CMOs","3 IPO Growth Leader"]'::jsonb, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, '["Product-Led Growth","B2B Brand Positioning","Content Strategy","Funnel Optimization","Hiring Growth Teams"]'::jsonb,
    14, '["B2B SaaS","Developer Tools","EdTech","Design Tech"]'::jsonb, 'Available (Accepting Startups)',
    NULL, 4.92, 28, NULL,
    NULL, NULL, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio;

-- Seed Startups
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-1', 'NeuroPulse AI', 'Non-invasive neural biomarkers for precision cognitive healthcare', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    'user-founder-1', 'Sarah Chen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'Artificial Intelligence', 'HealthTech & Neuroscience', 'Palo Alto, CA, USA', 'United States', 'https://neuropulse.ai',
    2023, 'Seed', 'B2B SaaS',
    'NeuroPulse AI was born out of clinical research at Stanford Medicine where our team proved that ultra-low latency EEG signal processing paired with transformer models can predict neurodegenerative onset 4 years earlier than traditional MRI imaging.', 'To make early neurological health assessment as universal, painless, and accessible as a regular blood pressure check.', 'Empowering neurologists and research hospitals with AI-driven diagnostic telemetry that reduces misdiagnosis by 78%.', 'Over 55 million individuals suffer from neurodegenerative diseases globally. Current clinical detection requires expensive $4,000+ MRI scans that only identify damage after irreversible cognitive loss has occurred.', 'A 5-minute non-invasive wearable headset combined with our proprietary deep learning neural-feature engine that yields 94.2% diagnostic accuracy across 12 clinical partner institutions.',
    '$32.4 Billion Addressable Global Neuro-Diagnostics Market', 'Research Hospitals, Neurological Clinics, Clinical Trial CROs, and Neurological Rehabilitation Centers.',
    2000000, 1450000, 12000000, 15,
    50000, 42000, 28.5,
    'https://riseup.dev/decks/neuropulse-pitch-v3.pdf', 'NeuroPulse_AI_Seed_Deck_2025.pdf', 'https://riseup.dev/docs/neuropulse-exec-summary.pdf',
    '["https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80"]'::jsonb, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    '[{"id":"tm-1","name":"Sarah Chen, PhD","position":"Founder & Chief Executive Officer","photo":"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80","education":"PhD Computational Neuroscience, Stanford University","experience":"Former Postdoctoral Fellow at Stanford Bio-X; 8 Published Papers in Nature Neuroscience","skills":["EEG Signal Processing","Deep Learning","Venture Leadership","FDA Clinical Trials"],"linkedin":"https://linkedin.com/in/sarahchen","portfolio":"https://sarahchen.io","bio":"Sarah leads overall scientific direction and enterprise hospital partnerships at NeuroPulse."},{"id":"tm-2","name":"Marcus Lind, MS","position":"Co-Founder & Chief Technology Officer","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80","education":"MS Computer Science & Distributed Systems, MIT","experience":"Ex-Lead Machine Learning Architect at Neuralink; 7 years building high-throughput edge models","skills":["PyTorch","Edge Computing","DSP Hardware","Distributed Systems"],"linkedin":"https://linkedin.com/in/marcuslind","bio":"Marcus manages our 12-person engineering team, hardware embedded sensors, and ISO 13485 compliance."},{"id":"tm-3","name":"Dr. Rebecca Zhao, MD","position":"Chief Medical Officer","photo":"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80","education":"MD Neurology, Johns Hopkins School of Medicine","experience":"Attending Neurologist at UCSF Health; 14 years clinical experience in Alzheimer’s treatment","skills":["Clinical Trial Design","IRB Protocol","Medical Advisory","Hospital Integration"],"linkedin":"https://linkedin.com/in/rebeccazhao-md","bio":"Oversees multi-center clinical trials, IRB approvals, and hospital protocol integrations across 6 states."}]'::jsonb, '[{"id":"m-1","title":"Stanford Clinical IRB Approval","date":"2023-11-15","description":"Obtained multi-center IRB clearance for 400 patient trial cohort.","status":"completed"},{"id":"m-2","title":"94.2% Diagnostic Accuracy Benchmark","date":"2024-04-10","description":"Validated biomarker model against blinded biopsy and PET-scan database.","status":"completed"},{"id":"m-3","title":"5 Commercial Pilot Contracts Signed","date":"2024-09-01","description":"Onboarded Mayo Clinic affiliate network and UCSF Health for paid pilots.","status":"completed"},{"id":"m-4","title":"FDA 510(k) Pre-Submission Clearance","date":"2025-06-30","description":"Targeting formal clearance for Class II diagnostic medical software.","status":"in-progress"}]'::jsonb, '["Python","PyTorch","Rust","TensorRT","Next.js","FastAPI","HIPAA Cloud Engine","PostgreSQL"]'::jsonb, '["Artificial Intelligence","HealthTech","Neuroscience","Deep Learning","Biomarkers","B2B SaaS"]'::jsonb,
    '["user-investor-1","user-investor-3"]'::jsonb, '["user-investor-1"]'::jsonb,
    'user-mentor-1', 'Dr. Elena Rostova',
    3840, 294, 156,
    TRUE, TRUE, 'active', '2024-02-15'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-2', 'VerdeGrid', 'Autonomous AI micro-grid management for decentralized renewable storage', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80',
    'user-founder-2', 'Mateo Morales', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'CleanTech', 'Renewable Energy & IoT', 'Austin, TX, USA', 'United States', 'https://verdegrid.energy',
    2023, 'Seed', 'Enterprise SaaS',
    'Extreme weather events cause $40B in annual power grid curtailment and battery waste. VerdeGrid creates intelligent software orchestrating industrial solar and battery installations in real time.', 'A zero-blackout, 100% renewable decentralized energy internet.', 'Maximize utility arbitrage and battery lifespan with real-time predictive grid dispatch.', 'Industrial commercial facilities lose up to 30% of their generated solar power due to mismatched peak tariffs and rigid local grid constraints.', 'Our AI Edge Gateway connects directly to industrial inverter banks, forecasting weather and dynamic utility pricing every 5 seconds.',
    '$19.2B Industrial Battery Energy Storage Software Market', 'Data Centers, Manufacturing Plants, Solar Farm Operators, Commercial REITs.',
    1500000, 1200000, 9500000, 12.5,
    25000, 35000, 32,
    NULL, 'VerdeGrid_Seed_Deck_v2.pdf', NULL,
    '["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80"]'::jsonb, NULL,
    '[{"id":"tm-21","name":"Mateo Morales","position":"Chief Executive Officer","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80","education":"BS Mechanical & Power Systems Engineering, UT Austin","experience":"6 years Senior Systems Engineer at Tesla Energy Grid division","skills":["Power Electronics","Utility Protocols (MODBUS/DNP3)","SCADA Systems"],"bio":"Leading commercial grid deployments across ERCOT and CAISO territories."}]'::jsonb, '[{"id":"m-21","title":"50 MW Managed Capacity Milestone","date":"2024-05-15","description":"Connected 14 commercial manufacturing solar rooftops.","status":"completed"},{"id":"m-22","title":"CAISO Ancillary Services Certification","date":"2024-11-20","description":"Certified for automated frequency response trading.","status":"completed"}]'::jsonb, '["Go","TimescaleDB","Rust","WebSockets","Kubernetes","MQTT"]'::jsonb, '["CleanTech","Energy Storage","IoT","Smart Grid","B2B SaaS"]'::jsonb,
    '["user-investor-2","user-investor-1"]'::jsonb, '["user-investor-2"]'::jsonb,
    NULL, NULL,
    2980, 188, 92,
    TRUE, TRUE, 'active', '2024-01-12'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-3', 'Zenith Quantum', 'Post-quantum cryptographic simulation & zero-trust key distribution', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    'user-founder-3', 'Aisha Al-Mansoor', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'CyberSecurity', 'Quantum Cryptography', 'Dubai, UAE', 'United Arab Emirates', 'https://zenithquantum.tech',
    2024, 'Series A', 'Enterprise SaaS',
    'With NIST standardizing lattice-based post-quantum algorithms, enterprises face an existential security cliff before Q-Day. Zenith Quantum automates cryptographic migration.', 'Future-proofing all digital financial transactions against quantum decryption vectors.', 'Providing enterprise security teams with continuous post-quantum key rotations.', 'Symmetric and RSA public-key infrastructure will become vulnerable to Shor algorithm attacks within this decade, leaving banking databases exposed to retrospective decryption.', 'Our patented hybrid Kyber/Dilithium wrapper integrates into existing Kubernetes and TLS pipelines without degrading transaction latency.',
    '$14.8B Post-Quantum Migration Market by 2028', 'Global Tier-1 Banks, Sovereign Cloud Providers, Defense Contractors, Health Records Providers.',
    4500000, 3800000, 28000000, 10,
    100000, 85000, 44,
    NULL, 'Zenith_SeriesA_Global_Pitch.pdf', NULL,
    '["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80"]'::jsonb, NULL,
    '[{"id":"tm-31","name":"Dr. Aisha Al-Mansoor","position":"Co-Founder & CEO","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80","education":"PhD Cryptography, ETH Zurich","experience":"Author of 12 patents in lattice cryptography; former Principal Cryptographer at CERN","skills":["Lattice Cryptography","NIST PQC Standards","Enterprise Security"],"bio":"Championing quantum-resilient infrastructure globally."}]'::jsonb, '[{"id":"m-31","title":"NIST Standard Certification Benchmark","date":"2024-08-10","description":"Passed independent security audit by NCC Group.","status":"completed"}]'::jsonb, '["C++","Rust","eBPF","Linux Kernel Modules","Go","gRPC"]'::jsonb, '["CyberSecurity","Quantum","Enterprise SaaS","Zero Trust","FinTech"]'::jsonb,
    '["user-investor-3","user-investor-1"]'::jsonb, '["user-investor-3"]'::jsonb,
    NULL, NULL,
    4120, 310, 220,
    TRUE, TRUE, 'active', '2024-03-01'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-4', 'Solux BioSciences', 'Synthetic protein polymers replacing single-use medical plastics', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80',
    'user-founder-4', 'David Kim', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    'BioTech', 'Biomaterials & Circular Health', 'Boston, MA, USA', 'United States', 'https://soluxbio.com',
    2023, 'Pre-Seed', 'DeepTech / Hardware',
    'Hospitals generate 5.9 million tons of plastic waste annually. Solux bio-engineers microbial fermentation polymers that dissolve in marine compost within 45 days.', 'Eliminating fossil-fuel single-use plastics from every clinical operating room on earth.', 'Scaling cost-parity bio-resins that meet strict medical grade barrier standards.', 'Existing PLA biodegradable packaging degrades poorly in ambient conditions and lacks puncture resistance for sterilized surgical instruments.', 'Genetically optimized mycelial-silk protein matrix that offers 3x tensile strength of polypropylene at 15% lower production cost.',
    '$22.1B Medical Packaging Biopolymer Market', 'Surgical Device OEMs, Pharma Blister Packaging Manufacturers, Diagnostic Kit Suppliers.',
    850000, 620000, 5500000, 15,
    20000, 12000, 18,
    NULL, 'Solux_Biomaterials_Seed_Deck.pdf', NULL,
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80"]'::jsonb, NULL,
    '[{"id":"tm-41","name":"David Kim, PhD","position":"Founder & Chief Scientific Officer","photo":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80","education":"PhD Polymer Chemistry, Harvard University","experience":"Former Lead Materials Researcher at Wyss Institute","skills":["Polymer Synthesis","Bioreactor Scale-up","ISO 10993 Biocompatibility"],"bio":"Inventor of 4 biomaterial formulation patents."}]'::jsonb, '[{"id":"m-41","title":"500L Bioreactor Scale Run Verified","date":"2024-06-20","description":"Achieved 98.4% yield stability in pilot fermentation.","status":"completed"}]'::jsonb, '["Synthetic Biology","Precision Fermentation","Bio-Informatics","Microbial Sequencing"]'::jsonb, '["BioTech","CleanTech","Biomaterials","Healthcare","Circular Economy"]'::jsonb,
    '["user-investor-2"]'::jsonb, '[]'::jsonb,
    NULL, NULL,
    1850, 142, 78,
    FALSE, TRUE, 'active', '2024-04-10'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-5', 'Aurora Identity', 'Zero-knowledge cross-border compliance identity verification for global fintechs', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    'user-founder-5', 'Sophia Lindqvist', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'FinTech', 'RegTech & Identity', 'Stockholm, Sweden', 'Sweden', 'https://aurorasecure.io',
    2023, 'Seed', 'AI / API',
    'Fintechs lose 40% of international onboarding conversion due to clunky, repetitive passport selfies and privacy liabilities.', 'One-click instant KYC passport that preserves 100% consumer data privacy.', 'Enable seamless cross-border financial transactions using ZK cryptographic proofs.', 'GDPR fines and cross-border AML verification costs companies $18 per user onboarded, while retaining massive honeypots of customer passports.', 'A developer SDK that validates identity directly against sovereign eID chipsets without ever storing user personal data on third-party servers.',
    '$16.5B Identity Verification & RegTech Market', 'Neo-banks, Crypto Exchanges, Remittance Providers, WealthTech Platforms.',
    1800000, 1400000, 11000000, 12,
    50000, 54000, 36,
    NULL, 'Aurora_ID_Seed_2025.pdf', NULL,
    '["https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"]'::jsonb, NULL,
    '[{"id":"tm-51","name":"Sophia Lindqvist","position":"Co-Founder & CEO","photo":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80","education":"MSc Economics & Tech Law, Stockholm School of Economics","experience":"Former Head of European Compliance at Klarna","skills":["RegTech","FinTech Compliance","SDK Strategy","EU Digital Identity Framework"],"bio":"Leading fintech privacy innovations across 18 European markets."}]'::jsonb, '[{"id":"m-51","title":"500k KYC Verifications Processed","date":"2024-09-15","description":"Reduced customer onboarding dropout rate from 38% to 4.2%.","status":"completed"}]'::jsonb, '["Rust","Circom (zk-SNARKs)","TypeScript","Node.js","PostgreSQL","Docker"]'::jsonb, '["FinTech","Zero Knowledge","Identity","RegTech","API","B2B"]'::jsonb,
    '["user-investor-4","user-investor-1"]'::jsonb, '["user-investor-4"]'::jsonb,
    NULL, NULL,
    3240, 215, 110,
    TRUE, TRUE, 'active', '2024-02-28'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-6', 'AgriOrbit', 'Autonomous crop health forecasting with hyper-spectral satellite telemetry', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
    'user-founder-6', 'Rajesh Patel', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    'AgTech', 'Satellite Telemetry & AI', 'Bengaluru, India', 'India', 'https://agriorbit.ai',
    2023, 'Seed', 'B2B SaaS',
    'Pest outbreaks and soil salinity degradation destroy $220B in food crops before farmers spot visual symptoms on the ground. AgriOrbit spots stress 10 days earlier.', 'Predicting and mitigating global food supply volatility through continuous planetary sensor models.', 'Providing actionable fertilizer, irrigation, and pest intervention prescriptions directly to farmers.', 'Small and commercial farms lack affordable, timely soil health diagnostics, relying on slow manual lab samples.', 'Sub-meter multi-spectral satellite ingestion pipeline trained on 14 million farm acres in South Asia and Latin America.',
    '$11.4B Precision Agriculture & Satellite Analytics Market', 'Agri-input Companies, Crop Insurers, Agricultural Co-operatives, Government Ag Ministries.',
    1200000, 900000, 7500000, 14,
    25000, 28000, 25,
    NULL, 'AgriOrbit_Pitch_2025.pdf', NULL,
    '["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80"]'::jsonb, NULL,
    '[{"id":"tm-61","name":"Rajesh Patel","position":"Founder & CEO","photo":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80","education":"BTech Aerospace Engineering, IIT Madras","experience":"Former Remote Sensing Specialist at ISRO","skills":["GIS Analytics","Hyper-Spectral Imaging","Crop Modeling"],"bio":"Leading precision agriculture deployment across 400k+ hectares."}]'::jsonb, '[{"id":"m-61","title":"1.2 Million Farm Acres Under Monitoring","date":"2024-07-30","description":"Partnered with two major sugar and cotton federations.","status":"completed"}]'::jsonb, '["Python","Google Earth Engine","TensorFlow","PostGIS","React Native","AWS Lambda"]'::jsonb, '["AgTech","Artificial Intelligence","Satellite","ClimateTech","DeepTech"]'::jsonb,
    '["user-investor-4","user-investor-2"]'::jsonb, '["user-investor-4"]'::jsonb,
    NULL, NULL,
    2430, 167, 84,
    FALSE, TRUE, 'active', '2024-01-20'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-7', 'KiteFlow Logistics', 'Autonomous heavy-payload cargo drone freight networks for remote islands', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200&auto=format&fit=crop&q=80',
    'user-founder-1', 'Liam O’Connor', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'Robotics', 'Autonomous Aviation & Freight', 'Dublin, Ireland', 'Ireland', 'https://kiteflow.aero',
    2023, 'Seed', 'DeepTech / Hardware',
    'Islands and remote peninsulas face 4x shipping costs and 5-day ferry delays for essential medical supplies and industrial spare parts.', 'Connecting every offshore coastal community with same-day zero-emission autonomous air cargo.', 'Building 200kg payload hybrid-electric cargo UAVs with 400km range.', 'Maritime cargo is slow, while traditional helicopter charters cost upwards of $3,500/hour.', 'Autonomous VTOL fixed-wing drones operating on proprietary corridor navigation software approved by EASA.',
    '$8.2B Offshore & Remote Cargo Logistics Market', 'Pharma Distributors, Offshore Wind Farms, Island Health Services, Courier Fleets.',
    2500000, 1800000, 14000000, 14,
    50000, 38000, 22,
    NULL, 'KiteFlow_Aero_Seed.pdf', NULL,
    '["https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80"]'::jsonb, NULL,
    '[]'::jsonb, '[]'::jsonb, '["C++","PX4 Autopilot","ROS2","Carbon Fiber Composite","Rust"]'::jsonb, '["Robotics","Aviation","Logistics","Hardware","CleanTech"]'::jsonb,
    '["user-investor-1"]'::jsonb, '[]'::jsonb,
    NULL, NULL,
    1950, 138, 65,
    FALSE, TRUE, 'active', '2024-03-15'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;
INSERT INTO public.startups (
    id, name, tagline, logo, "coverImage", "founderId", "founderName", "founderAvatar",
    industry, "subIndustry", location, country, website, "foundedYear", stage, "businessModel",
    story, vision, mission, problem, solution, "marketSize", "targetCustomers",
    "fundingGoal", "fundingRaised", valuation, "equityOffered", "minInvestment", "revenueMRR", "growthRatePercent",
    "pitchDeckUrl", "pitchDeckName", "executiveSummaryUrl", gallery, "videoUrl",
    "teamMembers", milestones, "techStack", tags, "interestedInvestorIds", "joinedInvestorIds",
    "assignedMentorId", "assignedMentorName", "viewsCount", "likesCount", "savedCount",
    "isFeatured", "isVerified", status, "createdAt"
  ) VALUES (
    'startup-8', 'DevSentinel', 'AI security agents that patch zero-day vulnerabilities in CI/CD pipelines', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    'user-founder-1', 'Tariq Farooq', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'Developer Tools', 'Application Security & AI', 'Seattle, WA, USA', 'United States', 'https://devsentinel.security',
    2024, 'Pre-Seed', 'B2B SaaS',
    'Traditional SAST scanners generate 80% false positives, burying software engineers under endless tickets without providing actionable fixes.', 'Zero developer burnout from security tickets through verified autonomous pull requests.', 'Automatically generating unit-tested, zero-regression security patches in GitHub & GitLab in <60 seconds.', 'Developers ignore 70% of static security warnings because fixing them manually disrupts sprint deadlines.', 'A fine-tuned LLM security agent that runs inside CI/CD, creating deterministic pull requests with passing test suites.',
    '$12.6B DevSecOps & AppSec Market', 'Mid-to-Enterprise Software Companies, Cloud Native Engineering Teams.',
    1000000, 750000, 6500000, 12,
    25000, 19000, 48,
    NULL, 'DevSentinel_Pitch_2025.pdf', NULL,
    '["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"]'::jsonb, NULL,
    '[]'::jsonb, '[]'::jsonb, '["TypeScript","Python","LLMs","Tree-sitter","Docker","GitHub Actions"]'::jsonb, '["Developer Tools","CyberSecurity","Artificial Intelligence","B2B SaaS","DevOps"]'::jsonb,
    '["user-investor-3"]'::jsonb, '["user-investor-3"]'::jsonb,
    NULL, NULL,
    2890, 220, 140,
    TRUE, TRUE, 'active', '2024-04-02'
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    "fundingRaised" = EXCLUDED."fundingRaised",
    valuation = EXCLUDED.valuation;

-- Seed Posts
INSERT INTO public.posts (
    id, "startupId", "startupName", "startupLogo", "startupStage", "startupIndustry",
    "authorId", "authorName", "authorAvatar", "authorRole", "authorTitle",
    type, title, content, "mediaUrl", "mediaType", tags, "createdAt",
    "likesCount", "commentsCount", "sharesCount", "viewsCount", "isLiked", "isBookmarked",
    reactions, comments, "userReactions"
  ) VALUES (
    'post-1', 'startup-1', 'NeuroPulse AI', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    'Seed', 'Artificial Intelligence',
    'user-founder-1', 'Sarah Chen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'founder', 'Founder & CEO at NeuroPulse AI',
    'milestone', 'Breakthrough: 94.2% Diagnostic Accuracy in Blinded Multicenter Trial', 'Thrilled to announce that our clinical trial results with Stanford Medicine & Mayo Clinic network have officially benchmarked a 94.2% sensitivity rate in predicting cognitive degradation onset 4 years ahead of standard scans.

Our team processed over 1,200 blinded EEG telemetry sessions across 3 hospital groups. Huge gratitude to our lead mentor Dr. Elena Rostova and our seed partners at Apex Venture Capital for helping us navigate our FDA pre-sub pathway!', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80', 'image',
    '["#Neuroscience","#AIinHealth","#Biomarkers","#StanfordMedicine","#SeedMilestone"]'::jsonb, '2025-05-10T12:00:00Z',
    142, 18, 34, 2850,
    FALSE, FALSE,
    NULL, '[{"id":"c-1","postId":"post-1","userId":"user-mentor-1","userName":"Dr. Elena Rostova","userAvatar":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80","userRole":"mentor","userTitle":"Ex-VP Product at Stripe | Executive AI Advisor","content":"Extraordinary progress Sarah & Marcus! The clinical validation dataset is one of the strongest I have seen for early-stage neurotech. The regulatory committee will take notice.","createdAt":"2025-05-10T14:30:00Z","likes":24,"isLiked":true,"replies":[{"id":"r-1","postId":"post-1","commentId":"c-1","userId":"user-founder-1","userName":"Sarah Chen","userAvatar":"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80","userRole":"founder","userTitle":"Founder & CEO at NeuroPulse AI","content":"Thank you Elena! Your framework on clinical pilot SLAs was the exact bridge that unlocked the Mayo Clinic partnership.","createdAt":"2025-05-10T15:00:00Z","likes":12}]},{"id":"c-2","postId":"post-1","userId":"user-investor-1","userName":"Marcus Vance","userAvatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80","userRole":"investor","userTitle":"General Partner at Apex Venture Capital","content":"Proud to back this team. The speed of execution from lab proof-of-concept to 5 active paid hospital pilots in under 12 months is exceptional.","createdAt":"2025-05-10T16:15:00Z","likes":19,"replies":[]}]'::jsonb, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    "likesCount" = EXCLUDED."likesCount";
INSERT INTO public.posts (
    id, "startupId", "startupName", "startupLogo", "startupStage", "startupIndustry",
    "authorId", "authorName", "authorAvatar", "authorRole", "authorTitle",
    type, title, content, "mediaUrl", "mediaType", tags, "createdAt",
    "likesCount", "commentsCount", "sharesCount", "viewsCount", "isLiked", "isBookmarked",
    reactions, comments, "userReactions"
  ) VALUES (
    'post-2', 'startup-2', 'VerdeGrid', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=120&auto=format&fit=crop&q=80',
    'Seed', 'CleanTech',
    'user-founder-2', 'Mateo Morales', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'founder', 'Founder & CTO at VerdeGrid',
    'funding_update', 'VerdeGrid Welcomes Horizon Climate Capital to our $1.5M Seed Round!', 'Excited to share that Claire Beauchamp and Horizon Climate Capital have officially joined our round as co-leads alongside our existing angels. We are now 80% subscribed ($1.2M / $1.5M goal).

With this capital, we are expanding our field IoT deployment across Texas manufacturing clusters and hiring 3 distributed grid firmware engineers!', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80', 'image',
    '["#CleanTech","#SeedFunding","#GridModernization","#VentureCapital","#GreenEnergy"]'::jsonb, '2025-05-11T09:15:00Z',
    98, 11, 22, 1920,
    FALSE, NULL,
    NULL, '[{"id":"c-21","postId":"post-2","userId":"user-investor-2","userName":"Claire Beauchamp","userAvatar":"https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80","userRole":"investor","userTitle":"Partner at Horizon Climate Capital","content":"Delighted to partner with Mateo and the VerdeGrid team. Grid arbitrage and industrial storage resilience are top priorities for European & US energy transition.","createdAt":"2025-05-11T10:00:00Z","likes":15,"replies":[]}]'::jsonb, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    "likesCount" = EXCLUDED."likesCount";
INSERT INTO public.posts (
    id, "startupId", "startupName", "startupLogo", "startupStage", "startupIndustry",
    "authorId", "authorName", "authorAvatar", "authorRole", "authorTitle",
    type, title, content, "mediaUrl", "mediaType", tags, "createdAt",
    "likesCount", "commentsCount", "sharesCount", "viewsCount", "isLiked", "isBookmarked",
    reactions, comments, "userReactions"
  ) VALUES (
    'post-3', 'startup-8', 'DevSentinel', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    'Pre-Seed', 'Developer Tools',
    'user-founder-1', 'Tariq Farooq', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', 'founder', 'Founder & CEO at DevSentinel',
    'hiring', 'We are Hiring! Senior AI/Compiler Engineer & Lead Product Designer', 'DevSentinel is scaling! Following our launch on RiseUp, we have 40+ engineering teams in our private beta. We are looking for:

1. Senior Systems / Compiler Engineer (Rust, AST manipulation, Tree-sitter)
2. Senior Product Designer (Developer experience, complex data visualizers)

Remote-friendly (US/EU timezones). Competitive equity + salary. Check our startup profile or DM me directly!', NULL, NULL,
    '["#Hiring","#TechJobs","#RustLang","#AppSec","#StartupCareers"]'::jsonb, '2025-05-12T08:30:00Z',
    76, 9, 18, 1450,
    NULL, NULL,
    NULL, '[]'::jsonb, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    "likesCount" = EXCLUDED."likesCount";
INSERT INTO public.posts (
    id, "startupId", "startupName", "startupLogo", "startupStage", "startupIndustry",
    "authorId", "authorName", "authorAvatar", "authorRole", "authorTitle",
    type, title, content, "mediaUrl", "mediaType", tags, "createdAt",
    "likesCount", "commentsCount", "sharesCount", "viewsCount", "isLiked", "isBookmarked",
    reactions, comments, "userReactions"
  ) VALUES (
    'post-4', 'startup-3', 'Zenith Quantum', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=120&auto=format&fit=crop&q=80',
    'Series A', 'CyberSecurity',
    'user-founder-3', 'Aisha Al-Mansoor', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'founder', 'CEO & Co-Founder at Zenith Quantum',
    'product_update', 'Zenith Core v2.4 Released: Zero-Regression Kernel Cryptographic Acceleration', 'Today we deployed Zenith Core v2.4 to our enterprise banking cluster. We achieved 4.2 gigabits/sec throughput on Kyber-1024 encryption over standard 10GbE interconnects without any dedicated FPGA hardware.

Live interactive benchmarks are now visible on our RiseUp startup profile!', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80', 'image',
    '["#Cryptography","#PostQuantum","#CyberSecurity","#Performance","#Engineering"]'::jsonb, '2025-05-13T11:00:00Z',
    112, 14, 29, 2100,
    NULL, NULL,
    NULL, '[]'::jsonb, NULL
  ) ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    "likesCount" = EXCLUDED."likesCount";

-- Seed Conversations
INSERT INTO public.conversations (
    id, "participantIds", participants, "lastMessage", "lastMessageTime", "unreadCount", "isPinned", "isMuted", "startupId", "startupName"
  ) VALUES (
    'conv-1', NULL, NULL, 'Hi Sarah, loved the recent Mayo Clinic benchmark updates. Could we review your Cap Table data room this Thursday?',
    NULL, 1, TRUE, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.conversations (
    id, "participantIds", participants, "lastMessage", "lastMessageTime", "unreadCount", "isPinned", "isMuted", "startupId", "startupName"
  ) VALUES (
    'conv-2', NULL, NULL, '🎤 Voice note (0:34)',
    NULL, 0, TRUE, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.conversations (
    id, "participantIds", participants, "lastMessage", "lastMessageTime", "unreadCount", "isPinned", "isMuted", "startupId", "startupName"
  ) VALUES (
    'conv-3', NULL, NULL, 'Sent over the revised CleanTech co-syndicate allocations.',
    NULL, 0, NULL, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.conversations (
    id, "participantIds", participants, "lastMessage", "lastMessageTime", "unreadCount", "isPinned", "isMuted", "startupId", "startupName"
  ) VALUES (
    'conv-4', NULL, NULL, 'Let us cross-check cryptographic benchmark numbers for the summit demo.',
    NULL, 0, NULL, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;

-- Seed Messages
INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    'msg-1', 'conv-1', 'user-investor-1', 'Marcus Vance',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Hello Sarah! I saw your recent post on RiseUp regarding the 94.2% diagnostic accuracy rate. Truly impressive clinical milestone.', '2025-05-13T16:20:00Z', NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    'msg-2', 'conv-1', 'user-founder-1', 'Sarah Chen',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Thank you Marcus! We worked around the clock with the Mayo Clinic team to ensure clean blinded evaluation. We are aiming to close out the remaining $550k of our Seed round.', '2025-05-13T16:32:00Z', NULL,
    NULL, 'NeuroPulse_Clinical_Validation_Report.pdf', '4.2 MB', NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    'msg-3', 'conv-1', 'user-investor-1', 'Marcus Vance',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Hi Sarah, loved the recent Mayo Clinic benchmark updates. Could we review your Cap Table data room this Thursday?', '2025-05-13T16:45:00Z', NULL,
    NULL, NULL, NULL, NULL,
    '{"id":"msg-2","senderName":"Sarah Chen","text":"Thank you Marcus! We worked around the clock with the Mayo Clinic team..."}'::jsonb, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    'msg-201', 'conv-2', 'user-mentor-1', 'Dr. Elena Rostova',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Sarah, remember to highlight your multi-center dataset size in slide 4 of your deck before presenting to institutional leads.', '2025-05-12T16:50:00Z', NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    'msg-202', 'conv-2', 'user-founder-1', 'Sarah Chen',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Updated it just now! Slide 4 now leads with the 1,200 cohort breakdown.', '2025-05-12T17:05:00Z', NULL,
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80', NULL, NULL, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    'msg-203', 'conv-2', 'user-mentor-1', 'Dr. Elena Rostova',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Listen to my audio feedback on the FDA pre-sub Section 3 phrasing:', '2025-05-12T17:15:00Z', NULL,
    NULL, NULL, NULL, NULL,
    NULL, '{"durationSec":34,"audioWaveform":[30,45,60,85,40,75,90,65,50,80,95,70,45,60,75,40,65,80,55,30]}'::jsonb
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.messages (
    id, "conversationId", "senderId", "senderName", "senderAvatar", text, timestamp, "isRead",
    "mediaUrl", "attachmentName", "attachmentSize", "attachmentUrl", "replyTo", "voiceNote"
  ) VALUES (
    'msg-301', 'conv-3', 'user-investor-2', 'Claire Beauchamp',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', 'Hi Sarah, Horizon Climate is exploring HealthTech sensor integration for clean room deployments. Let us review synergy points.', '2025-05-11T11:20:00Z', NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL
  ) ON CONFLICT (id) DO NOTHING;

-- Seed Investor Requests
INSERT INTO public.investor_requests (
    id, "startupId", "startupName", "startupLogo", "investorId", "investorName",
    "investorAvatar", "investorCompany", "checkSize", status, message, stage,
    "equityAsked", notes, "createdAt", "updatedAt"
  ) VALUES (
    'req-inv-1', 'startup-1', 'NeuroPulse AI', NULL,
    'user-investor-1', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Apex Venture Capital',
    NULL, 'accepted', NULL, NULL,
    NULL, NULL, '2025-05-08T10:00:00Z', NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.investor_requests (
    id, "startupId", "startupName", "startupLogo", "investorId", "investorName",
    "investorAvatar", "investorCompany", "checkSize", status, message, stage,
    "equityAsked", notes, "createdAt", "updatedAt"
  ) VALUES (
    'req-inv-2', 'startup-1', 'NeuroPulse AI', NULL,
    'user-investor-3', 'Jonathan Reynolds', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', 'Beacon Peak Ventures',
    NULL, 'pending', NULL, NULL,
    NULL, NULL, '2025-05-13T15:30:00Z', NULL
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.investor_requests (
    id, "startupId", "startupName", "startupLogo", "investorId", "investorName",
    "investorAvatar", "investorCompany", "checkSize", status, message, stage,
    "equityAsked", notes, "createdAt", "updatedAt"
  ) VALUES (
    'req-inv-3', 'startup-2', 'VerdeGrid', NULL,
    'user-investor-2', 'Claire Beauchamp', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', 'Horizon Climate Capital',
    NULL, 'accepted', NULL, NULL,
    NULL, NULL, '2025-05-09T09:00:00Z', NULL
  ) ON CONFLICT (id) DO NOTHING;

-- Seed Mentor Requests
INSERT INTO public.mentor_requests (
    id, "startupId", "startupName", "startupLogo", "founderId", "founderName",
    "founderAvatar", "mentorId", "mentorName", "mentorAvatar", topic, message,
    status, "proposedDuration", "skillsNeeded", "meetingLink", notes, "createdAt"
  ) VALUES (
    'req-men-1', 'startup-1', 'NeuroPulse AI', NULL,
    'user-founder-1', NULL, NULL,
    'user-mentor-1', 'Dr. Elena Rostova', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    NULL, 'I am delighted to actively mentor NeuroPulse AI. My focus will be establishing reproducible clinical enterprise pilot contracts.', 'accepted',
    NULL, NULL, NULL,
    NULL, '2025-04-15T11:00:00Z'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.mentor_requests (
    id, "startupId", "startupName", "startupLogo", "founderId", "founderName",
    "founderAvatar", "mentorId", "mentorName", "mentorAvatar", topic, message,
    status, "proposedDuration", "skillsNeeded", "meetingLink", notes, "createdAt"
  ) VALUES (
    'req-men-2', 'startup-8', 'DevSentinel', NULL,
    'user-founder-1', NULL, NULL,
    'user-mentor-3', 'Jessica Gomez', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    NULL, 'Love what DevSentinel is building in developer security! Happy to dedicate 2 hours weekly on PLG funnel optimization.', 'pending',
    NULL, NULL, NULL,
    NULL, '2025-05-12T14:15:00Z'
  ) ON CONFLICT (id) DO NOTHING;

-- Seed Founder Pitches
INSERT INTO public.founder_pitches (
    id, "senderFounderId", "senderFounderName", "senderFounderAvatar", "senderFounderTitle",
    "senderStartupId", "senderStartupName", "senderStartupLogo", "recipientFounderId",
    "recipientFounderName", "recipientFounderAvatar", "recipientFounderTitle", "recipientStartupId",
    "recipientStartupName", "pitchType", title, summary, "synergyPoints", "deckUrl", "deckName",
    "proposedNextStep", status, "createdAt", note
  ) VALUES (
    'pitch-f-1', 'user-founder-2', 'Mateo Morales', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'Founder & CTO at VerdeGrid', 'startup-2', 'VerdeGrid', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=150&auto=format&fit=crop&q=80',
    'user-founder-1', 'Sarah Chen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'Founder & CEO at NeuroPulse AI', 'startup-1', 'NeuroPulse AI',
    'synergy', 'Edge Sensor Telemetry & Low-Latency AI Pipeline Synergy', 'Proposing an integrated pilot connecting VerdeGrid low-power micro-controllers with NeuroPulse signal-processing edge models to enable real-time anomaly detection.', '["Joint testbed using VerdeGrid hardware nodes with NeuroPulse firmware","Shared data pipeline minimizing latency by 64%","Co-marketing case study for edge computing conferences"]'::jsonb,
    'https://example.com/pitch/verdegrid_neuropulse_synergy.pdf', 'VerdeGrid_NeuroPulse_Tech_Synergy.pdf', 'intro_call', 'in_discussion',
    '2025-05-12T14:30:00Z', 'Hey Sarah! Loved your talk at Stanford Bio-X. We should explore integrating our low-power edge compute pipeline with your neural sensing arrays.'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.founder_pitches (
    id, "senderFounderId", "senderFounderName", "senderFounderAvatar", "senderFounderTitle",
    "senderStartupId", "senderStartupName", "senderStartupLogo", "recipientFounderId",
    "recipientFounderName", "recipientFounderAvatar", "recipientFounderTitle", "recipientStartupId",
    "recipientStartupName", "pitchType", title, summary, "synergyPoints", "deckUrl", "deckName",
    "proposedNextStep", status, "createdAt", note
  ) VALUES (
    'pitch-f-2', 'user-founder-1', 'Sarah Chen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'Founder & CEO at NeuroPulse AI', 'startup-1', 'NeuroPulse AI', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    'user-founder-4', 'David Kim', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    'Founder & CSO at Solux BioSciences', 'startup-4', 'Solux BioSciences',
    'cross_promo', 'Biocompatible Electrode Material Joint Testing', 'Evaluating Solux synthesized biodegradable protein polymers as structural substrates for non-invasive NeuroPulse neural sensor patches.', '["Zero skin irritation using Solux bio-polymers","Joint SBIR / NSF grant application for biomedical hardware","Mutual founder cross-referral to clinical labs in Boston"]'::jsonb,
    'https://example.com/pitch/neuropulse_solux_deck.pdf', 'NeuroPulse_Biomaterial_Partnership.pdf', 'demo_exchange', 'accepted',
    '2025-05-10T11:15:00Z', 'David, your biodegradable polymers could be an exact match for our electrode patches. Let’s do a quick demo swap!'
  ) ON CONFLICT (id) DO NOTHING;
