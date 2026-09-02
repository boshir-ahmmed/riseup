import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../layout/RoleBadge';
import { PostCard } from '../feed/PostCard';
import { EditProfileModal } from './EditProfileModal';
import { PitchToFounderModal } from '../modals/PitchToFounderModal';
import { compressImage } from '../../utils/imageUtils';
import {
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  Globe,
  Linkedin,
  Twitter,
  Github,
  MessageSquare,
  Sparkles,
  Award,
  DollarSign,
  Users,
  Briefcase,
  Star,
  ShieldCheck,
  ArrowLeft,
  Camera,
  UploadCloud,
  FileText,
  Download,
  Paperclip,
  ExternalLink,
  Plus,
  Zap
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    selectedUserId,
    users,
    startups,
    posts,
    setSelectedStartupId,
    setActiveView,
    sendMessage,
    updateUserProfile,
    pitchFounderModalTarget,
    setPitchFounderModalTarget
  } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'documents'>('overview');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const profileUser = users.find(u => u.id === selectedUserId) || currentUser;
  const isOwnProfile = profileUser.id === currentUser.id;

  const userStartup = startups.find(
    s => s.id === profileUser.startupId || s.founderId === profileUser.id
  );

  const userPosts = posts.filter(p => p.authorId === profileUser.id);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressed = await compressImage(file, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.8,
          mimeType: 'image/jpeg'
        });
        updateUserProfile({ avatar: compressed });
      } catch (err) {
        console.error('Avatar upload failed:', err);
      }
    }
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressed = await compressImage(file, {
          maxWidth: 1400,
          maxHeight: 600,
          quality: 0.75,
          mimeType: 'image/jpeg'
        });
        updateUserProfile({ coverImage: compressed });
      } catch (err) {
        console.error('Cover upload failed:', err);
      }
    }
  };

  const handleDocFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formatSize = (bytes: number) => {
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
      };

      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result && typeof ev.target.result === 'string') {
          updateUserProfile({
            resumeUrl: ev.target.result,
            resumeName: file.name,
            resumeSize: formatSize(file.size)
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const coverUrl =
    profileUser.coverImage ||
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1400&auto=format&fit=crop&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hidden file inputs for direct 1-click uploads */}
      {isOwnProfile && (
        <>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
            className="hidden"
          />
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverFile}
            className="hidden"
          />
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            onChange={handleDocFile}
            className="hidden"
          />
        </>
      )}

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Profile Cover */}
        <div className="h-48 sm:h-60 relative overflow-hidden bg-slate-950">
          <img
            src={coverUrl}
            alt="Profile Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* 1-Click Change Cover Button */}
          {isOwnProfile && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => coverInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition border border-white/20 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Cover Photo</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Info Overlay */}
        <div className="p-6 sm:p-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with 1-Click Upload Overlay */}
            <div className="relative group">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-28 h-28 sm:w-34 sm:h-34 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-xl bg-white dark:bg-slate-800"
              />

              {isOwnProfile && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-3xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
                  title="Upload new profile picture"
                >
                  <Camera className="w-5 h-5" />
                  <span>Change Photo</span>
                </button>
              )}

              {profileUser.isVerified && (
                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full shadow-xs" />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {isOwnProfile ? (
                <>
                  <button
                    id="profile-upload-doc-quick-button"
                    onClick={() => docInputRef.current?.click()}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Upload File / Deck</span>
                  </button>

                  <button
                    id="profile-edit-button"
                    onClick={() => setIsEditOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {profileUser.role === 'founder' && currentUser.role === 'founder' && (
                    <button
                      id="profile-pitch-founder-button"
                      onClick={() => setPitchFounderModalTarget(profileUser)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md hover:shadow-indigo-500/20 transition cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Send Synergy Pitch</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sendMessage(
                        profileUser.id,
                        `Hi ${profileUser.name}, reaching out to connect on RiseUp.`
                      );
                      setActiveView('messages');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct Message</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white">
                {profileUser.name}
              </h1>
              <RoleBadge role={profileUser.role} size="md" />

              <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200/60 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>{profileUser.profileCompletion || 95}% Profile Completed</span>
              </div>
            </div>

            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              {profileUser.title} {profileUser.company ? `• ${profileUser.company}` : ''}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 max-w-3xl leading-relaxed">
              {profileUser.bio}
            </p>

            {/* Meta details & Socials */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 flex-wrap">
              {profileUser.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {profileUser.location}
                </span>
              )}

              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Joined{' '}
                {new Date(profileUser.joinedDate || '2024-01-01').toLocaleDateString(undefined, {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>

              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </a>
              )}

              {profileUser.linkedin && (
                <a
                  href={profileUser.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}

              {profileUser.twitter && (
                <a
                  href={profileUser.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  X / Twitter
                </a>
              )}

              {profileUser.github && (
                <a
                  href={profileUser.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mt-6 text-xs font-bold gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview & Focus
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Attached Documents & Deck</span>
              {profileUser.resumeUrl && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === 'posts'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Published Posts ({userPosts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Overview & Specific Role Details */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 8 Cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Uploaded File / Resume Quick Banner if available */}
            {profileUser.resumeUrl && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {profileUser.resumeName || 'Attached Professional Document'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {profileUser.resumeSize || 'Verified PDF Document'} • Available for ecosystem review
                    </p>
                  </div>
                </div>

                <a
                  href={profileUser.resumeUrl}
                  download={profileUser.resumeName || 'Document.pdf'}
                  className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            )}

            {/* Founder Startup & Synergy Profile Card */}
            {profileUser.role === 'founder' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                    <span>Founder Profile & Synergies</span>
                  </h3>
                  {userStartup && (
                    <button
                      onClick={() => {
                        setSelectedStartupId(userStartup.id);
                        setActiveView('startup-details');
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      View Startup Profile →
                    </button>
                  )}
                </div>

                {userStartup && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
                    <img
                      src={userStartup.logo}
                      alt={userStartup.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {userStartup.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {userStartup.tagline}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                        <span>{userStartup.stage} Stage</span>
                        <span>•</span>
                        <span>${(userStartup.fundingRaised / 1000).toFixed(0)}k Raised</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Looking For Synergies */}
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                      Open to Synergies & Collaborations
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      {profileUser.founderStage || 'Seed'} Stage
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(profileUser.founderLookingFor && profileUser.founderLookingFor.length > 0
                      ? profileUser.founderLookingFor
                      : [
                          'Tech & API Synergy',
                          'Strategic Alliance',
                          'Peer Review',
                          'Cross-Promotion'
                        ]
                    ).map((syn, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs"
                      >
                        ⚡ {syn}
                      </span>
                    ))}
                  </div>

                  {!isOwnProfile && currentUser.role === 'founder' && (
                    <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-between">
                      <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                        Have a joint venture, integration, or pitch for {profileUser.name}?
                      </p>
                      <button
                        onClick={() => setPitchFounderModalTarget(profileUser)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>Pitch {profileUser.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Investor Focus */}
            {profileUser.role === 'investor' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Investment Focus & Criteria
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Ticket Size Range</span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 block">
                      ${(profileUser.investmentRange?.min || 50000) / 1000}k - ${(profileUser.investmentRange?.max || 500000) / 1000}k USD
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Preferred Sectors</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileUser.investmentInterests?.map((item, i) => (
                        <span key={i} className="text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mentor Focus */}
            {profileUser.role === 'mentor' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Advisory Mentorship Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Mentorship Capacity</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300 mt-1 block">
                      {profileUser.mentorAvailability || 'Available (Accepting Startups)'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Advisor Rating</span>
                    <span className="font-extrabold text-amber-600 text-sm mt-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400" /> {profileUser.mentorRating || 5.0} / 5.0
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right 4 Cols: Skills & Expertise */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Skills & Industry Domains
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(profileUser.skills && profileUser.skills.length > 0
                  ? profileUser.skills
                  : ['Artificial Intelligence', 'B2B SaaS', 'Product Strategy', 'Growth Marketing', 'Fundraising']
                ).map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {profileUser.achievements && profileUser.achievements.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Achievements & Badges</span>
                </h3>
                <div className="space-y-2">
                  {profileUser.achievements.map((ach, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Attached Documents & Deck */}
      {activeTab === 'documents' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Attached Files, Resumes & Decks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official documents and files uploaded by {profileUser.name}
                </p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => docInputRef.current?.click()}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              )}
            </div>

            {profileUser.resumeUrl ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {profileUser.resumeName || 'Profile Document'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {profileUser.resumeSize || 'PDF File'} • Ready for download
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={profileUser.resumeUrl}
                    download={profileUser.resumeName || 'Document.pdf'}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                  {isOwnProfile && (
                    <button
                      onClick={() =>
                        updateUserProfile({
                          resumeUrl: undefined,
                          resumeName: undefined,
                          resumeSize: undefined
                        })
                      }
                      className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  No documents attached yet
                </p>
                {isOwnProfile && (
                  <button
                    onClick={() => docInputRef.current?.click()}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Click here to upload your Resume, Pitch Deck or CV
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Published Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4 max-w-3xl">
          {userPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
              No posts published yet by {profileUser.name}.
            </div>
          ) : (
            userPosts.map(p => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

      {/* Pitch to Founder Modal */}
      <PitchToFounderModal
        isOpen={!!pitchFounderModalTarget}
        targetFounder={pitchFounderModalTarget}
        onClose={() => setPitchFounderModalTarget(null)}
      />
    </div>
  );
};
