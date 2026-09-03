import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostCard } from '../feed/PostCard';
import { ExpressInterestModal } from './ExpressInterestModal';
import { MentorRequestModal } from './MentorRequestModal';
import { PitchToInvestorModal } from './PitchToInvestorModal';
import { compressImage } from '../../utils/imageUtils';
import { uploadFileToSupabaseStorage, isSupabaseConfigured } from '../../lib/supabase';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Globe,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Award,
  Users,
  Briefcase,
  Layers,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Building,
  Target,
  Rocket,
  ArrowLeft,
  Linkedin,
  Clock,
  Play,
  User as UserIcon,
  Camera,
  UploadCloud,
  Edit3,
  Loader2,
  Cloud
} from 'lucide-react';

export const StartupDetailsPage: React.FC = () => {
  const {
    selectedStartupId,
    startups,
    posts,
    currentUser,
    toggleSaveStartup,
    savedStartupIds,
    joinStartupAsInvestor,
    verifyStartup,
    updateStartup,
    setActiveView,
    setSelectedUserId,
    sendMessage,
    setActiveConversationId
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'pitch_deck' | 'team' | 'milestones' | 'updates'
  >('overview');

  const [isExpressOpen, setIsExpressOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const deckInputRef = useRef<HTMLInputElement>(null);

  const startup = startups.find(s => s.id === selectedStartupId) || startups[0];
  const isSaved = savedStartupIds.includes(startup.id);
  const hasJoined = startup.joinedInvestorIds?.includes(currentUser.id);
  const startupPosts = posts.filter(p => p.startupId === startup.id);
  const isFounderOrAdmin = startup.founderId === currentUser.id || currentUser.role === 'admin';

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingMedia(true);
      setUploadMessage('Uploading startup logo to Supabase Storage...');
      try {
        const compressed = await compressImage(file, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.82,
          mimeType: 'image/jpeg'
        });

        if (isSupabaseConfigured) {
          const res = await fetch(compressed);
          const blob = await res.blob();
          const uploadRes = await uploadFileToSupabaseStorage(blob, 'startups', file.name);
          if (uploadRes.success && uploadRes.url) {
            updateStartup(startup.id, { logo: uploadRes.url });
            return;
          }
        }
        updateStartup(startup.id, { logo: compressed });
      } catch (err) {
        console.error('Logo upload failed:', err);
      } finally {
        setIsUploadingMedia(false);
        setUploadMessage(null);
      }
    }
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingMedia(true);
      setUploadMessage('Uploading startup banner to Supabase Storage...');
      try {
        const compressed = await compressImage(file, {
          maxWidth: 1400,
          maxHeight: 600,
          quality: 0.78,
          mimeType: 'image/jpeg'
        });

        if (isSupabaseConfigured) {
          const res = await fetch(compressed);
          const blob = await res.blob();
          const uploadRes = await uploadFileToSupabaseStorage(blob, 'covers', file.name);
          if (uploadRes.success && uploadRes.url) {
            updateStartup(startup.id, { coverImage: uploadRes.url });
            return;
          }
        }
        updateStartup(startup.id, { coverImage: compressed });
      } catch (err) {
        console.error('Cover upload failed:', err);
      } finally {
        setIsUploadingMedia(false);
        setUploadMessage(null);
      }
    }
  };

  const handleDeckFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingMedia(true);
      setUploadMessage('Uploading pitch deck to Supabase Storage...');
      try {
        if (isSupabaseConfigured) {
          const uploadRes = await uploadFileToSupabaseStorage(file, 'documents', file.name);
          if (uploadRes.success && uploadRes.url) {
            updateStartup(startup.id, {
              pitchDeckName: file.name,
              pitchDeckUrl: uploadRes.url
            });
            return;
          }
        }

        const reader = new FileReader();
        reader.onload = ev => {
          if (ev.target?.result && typeof ev.target.result === 'string') {
            updateStartup(startup.id, {
              pitchDeckName: file.name,
              pitchDeckUrl: ev.target.result
            });
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Pitch deck upload failed:', err);
      } finally {
        setIsUploadingMedia(false);
        setUploadMessage(null);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleMessageFounder = () => {
    sendMessage(
      startup.founderId,
      `Hello ${startup.founderName}, I'm reaching out after reviewing the ${startup.name} profile on RiseUp.`
    );
    setActiveView('messages');
  };

  const fundingPercentage = Math.min(
    100,
    Math.round((startup.fundingRaised / startup.fundingGoal) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('explore')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Startups</span>
        </button>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => verifyStartup(startup.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              startup.isVerified
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200'
                : 'bg-blue-600 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{startup.isVerified ? 'Revoke Verified Badge' : 'Grant Verified Badge'}</span>
          </button>
        )}
      </div>

      {/* Hidden file inputs for startup uploads */}
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoFile}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFile}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={deckInputRef}
        onChange={handleDeckFile}
        accept=".pdf,.ppt,.pptx"
        className="hidden"
      />

      {/* Floating Upload Notification */}
      {isUploadingMedia && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-950/90 text-white rounded-2xl shadow-2xl border border-indigo-500/50 flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-5">
          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
          <div>
            <p className="text-xs font-bold">{uploadMessage || 'Uploading file...'}</p>
            <p className="text-[11px] text-slate-400">Streaming directly to Supabase Storage</p>
          </div>
        </div>
      )}

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-64 sm:h-80 w-full relative bg-slate-950 overflow-hidden group">
          <img
            src={startup.coverImage}
            alt={startup.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Floating actions on cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isFounderOrAdmin && (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                title="Change Cover Banner"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload Cover</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition"
              title="Share Startup Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveStartup(startup.id)}
              className={`p-2 rounded-xl backdrop-blur-md transition ${
                isSaved
                  ? 'bg-amber-500 text-white'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              title="Bookmark Startup"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Startup Quick Identification in Cover */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group/logo">
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl bg-white dark:bg-slate-800"
                />
                {startup.logo?.includes('supabase.co/storage') && (
                  <div
                    className="absolute -top-1.5 -right-1.5 p-1 bg-emerald-500 text-white rounded-full shadow-md border-2 border-white dark:border-slate-900"
                    title="Logo hosted on Supabase Cloud Storage"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                  </div>
                )}
                {isFounderOrAdmin && (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-xs text-white opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center transition text-[10px] font-bold cursor-pointer gap-0.5"
                    title="Change Logo"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                )}
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight">
                    {startup.name}
                  </h1>
                  {startup.isVerified && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-700/80 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-white text-xs font-semibold">
                    {startup.stage}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl line-clamp-2">
                  {startup.tagline}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {startup.location}
                  </span>
                  <span>•</span>
                  <span>{startup.industry}</span>
                  <span>•</span>
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-indigo-300"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {startup.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {currentUser.role === 'investor' && (
                <>
                  <button
                    onClick={() => setIsExpressOpen(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Express Interest</span>
                  </button>

                  <button
                    onClick={() => joinStartupAsInvestor(startup.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      hasJoined
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{hasJoined ? 'Joined Syndicate' : 'Join Startup'}</span>
                  </button>
                </>
              )}

              {currentUser.role === 'mentor' && (
                <button
                  onClick={() => setIsMentorOpen(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Offer Mentorship</span>
                </button>
              )}

              {currentUser.role === 'founder' && (
                <button
                  onClick={() => setIsPitchOpen(true)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Pitch to Investors</span>
                </button>
              )}

              <button
                onClick={handleMessageFounder}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Founder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50/70 dark:bg-slate-850/50 p-4 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-2 sm:px-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider block">
              Funding Target
            </span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              ${(startup.fundingGoal / 1000000).toFixed(1)}M USD
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
              ${(startup.fundingRaised / 1000).toFixed(0)}k committed ({fundingPercentage}%)
            </span>
          </div>

          <div className="p-2 sm:px-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider block">
              Pre-Money Valuation
            </span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              ${((startup.valuation || 10000000) / 1000000).toFixed(1)}M
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {startup.equityOffered || 12}% Equity Offered
            </span>
          </div>

          <div className="p-2 sm:px-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider block">
              Stage & Structure
            </span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              {startup.stage} Round
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block mt-0.5">
              {startup.businessModel}
            </span>
          </div>

          <div className="p-2 sm:px-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider block">
              Active Network
            </span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              {startup.interestedInvestorIds?.length || 2} Investors • 1 Mentor
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              {startup.location}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold px-4 sm:px-6">
          {[
            { id: 'overview', label: 'Pitch & Overview' },
            { id: 'pitch_deck', label: 'Pitch Deck & Data Room' },
            { id: 'team', label: `Team Members (${startup.teamMembers?.length || 1})` },
            { id: 'milestones', label: `Roadmap (${startup.milestones?.length || 0})` },
            { id: 'updates', label: `Posts & Updates (${startupPosts.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Pane */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Fundraising Round Terms */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Fundraising Round Terms & Allocation
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Series {startup.stage}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Round Target</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      ${(startup.fundingGoal).toLocaleString()} USD
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Raised</span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      ${(startup.fundingRaised).toLocaleString()} USD
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Minimum Ticket</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      ${(startup.minInvestment || 25000).toLocaleString()} USD
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Equity Offered</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {startup.equityOffered || 12}%
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pre-Money Valuation</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      ${((startup.valuation || 8000000) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Security Type</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      SAFE (Post-Money)
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem & Solution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm mb-2">
                    <Target className="w-4 h-4" />
                    <h4>The Problem</h4>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {startup.problem}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <h4>The Solution</h4>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {startup.solution}
                  </p>
                </div>
              </div>

              {/* Startup Story & Vision */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    Startup Story & Background
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {startup.story}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      Vision
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {startup.vision}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      Mission
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {startup.mission}
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Size & Target Customers */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                  Market Opportunity & Target Customers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">
                      Total Addressable Market (TAM)
                    </span>
                    <p className="font-extrabold text-sm text-indigo-900 dark:text-indigo-100 mt-1">
                      {startup.marketSize}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                      Ideal Target Customers
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-1">
                      {startup.targetCustomers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                  Core Technology Architecture
                </h3>
                <div className="flex flex-wrap gap-2">
                  {startup.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Media Gallery */}
              {startup.gallery && startup.gallery.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                    Product & Lab Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {startup.gallery.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Gallery ${i}`}
                        className="rounded-xl object-cover h-36 w-full border border-slate-200 dark:border-slate-700 hover:scale-102 transition"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PITCH DECK & DOCUMENTS */}
          {activeTab === 'pitch_deck' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Pitch Deck & Institutional Data Room
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Confidential investor presentation and cap table audited materials.
                </p>
              </div>

              {/* Pitch Deck Preview Frame */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 p-8 text-center text-white space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{startup.pitchDeckName || `${startup.name}_Pitch_Deck.pdf`}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    18 Slides • Confidential Series {startup.stage} Deck • Updated this quarter
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {startup.pitchDeckUrl && (
                    <a
                      href={startup.pitchDeckUrl}
                      download={startup.pitchDeckName || 'Pitch_Deck.pdf'}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Deck</span>
                    </a>
                  )}
                  {isFounderOrAdmin && (
                    <button
                      type="button"
                      onClick={() => deckInputRef.current?.click()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload New Pitch Deck</span>
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Opening confidential data room for ${startup.name}. Cap table and audited financials accessible to verified investors.`)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition cursor-pointer"
                  >
                    Access Full Data Room
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Founding & Leadership Team
                </h3>
                <span className="text-xs text-slate-500">
                  {startup.teamMembers?.length || 1} Core Members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {startup.teamMembers?.map(member => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {member.name}
                          </h4>
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            {member.position}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {member.education}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
                        {member.bio || member.experience}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.skills?.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.portfolio && (
                        <a
                          href={member.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MILESTONES ROADMAP */}
          {activeTab === 'milestones' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Startup Execution Roadmap & Key Milestones
              </h3>

              <div className="space-y-4">
                {startup.milestones?.map((m, idx) => (
                  <div key={m.id || idx} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          m.status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : m.status === 'in-progress'
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {m.status === 'completed' ? '✓' : idx + 1}
                      </div>
                      {idx < (startup.milestones?.length || 0) - 1 && (
                        <div className="w-0.5 h-12 bg-slate-200 dark:bg-slate-800 my-1" />
                      )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {m.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            m.status === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                              : m.status === 'in-progress'
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {m.description}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Target Date: {m.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: UPDATES & POSTS */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              {startupPosts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                  <p className="text-xs text-slate-400">
                    No posts published yet by {startup.name}.
                  </p>
                </div>
              ) : (
                startupPosts.map(p => <PostCard key={p.id} post={p} />)
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Founder Profile & Ecosystem Relations */}
        <div className="lg:col-span-4 space-y-5">
          {/* Founder Bio Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Founder & Leadership
            </h3>
            <div
              onClick={() => {
                setSelectedUserId(startup.founderId);
                setActiveView('profile');
              }}
              className="flex items-center gap-3 mb-3 cursor-pointer group/founder"
              title="Click to view founder profile"
            >
              <img
                src={startup.founderAvatar}
                alt={startup.founderName}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 group-hover/founder:ring-2 group-hover/founder:ring-indigo-400 transition"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover/founder:text-indigo-600 dark:group-hover/founder:text-indigo-400 transition">
                  {startup.founderName}
                </h4>
                <p className="text-xs text-slate-500">
                  Founder & CEO at {startup.name}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Passionate founder leading deep technology and venture scaling across {startup.industry}.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedUserId(startup.founderId);
                  setActiveView('profile');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>View Profile</span>
              </button>
              <button
                onClick={handleMessageFounder}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Assigned Mentor Advisor */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Assigned Mentor & Advisor
              </h3>
            </div>

            {startup.assignedMentorName ? (
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-800/40 space-y-2.5">
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {startup.assignedMentorName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    1-to-1 Advisory Active • Bi-weekly Strategic Reviews
                  </p>
                </div>
                {startup.assignedMentorId && (
                  <button
                    onClick={() => {
                      setSelectedUserId(startup.assignedMentorId!);
                      setActiveView('profile');
                    }}
                    className="w-full py-1.5 bg-amber-100/80 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <UserIcon className="w-3 h-3" />
                    <span>View Mentor Profile</span>
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No mentor assigned yet. Mentors can offer advisory proposals above.
              </p>
            )}
          </div>

          {/* Interested Venture Investors */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Interested Investors & Angels
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Apex Venture Capital
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                  $350k Committed
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Beacon Peak Ventures
                </span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                  In Diligence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExpressInterestModal
        startup={startup}
        isOpen={isExpressOpen}
        onClose={() => setIsExpressOpen(false)}
      />

      <MentorRequestModal
        startup={startup}
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
      />

      <PitchToInvestorModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />
    </div>
  );
};
