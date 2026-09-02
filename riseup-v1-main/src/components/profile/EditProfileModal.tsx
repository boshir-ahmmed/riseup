import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { FileUploadField } from '../common/FileUploadField';
import {
  X,
  User as UserIcon,
  CheckCircle2,
  Building2,
  MapPin,
  Briefcase,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Award,
  Sparkles,
  FileText,
  DollarSign,
  Star,
  Camera,
  Layers
} from 'lucide-react';
import { FundingStage, UserRole } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [activeTab, setActiveTab] = useState<'media' | 'general' | 'role' | 'documents' | 'social'>('media');

  // Media state
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [coverImage, setCoverImage] = useState(
    currentUser.coverImage ||
      'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80'
  );

  // General details
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [company, setCompany] = useState(currentUser.company || '');
  const [location, setLocation] = useState(currentUser.location || 'San Francisco, CA, USA');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [skillsInput, setSkillsInput] = useState(currentUser.skills?.join(', ') || '');

  // Social & Web Links
  const [website, setWebsite] = useState(currentUser.website || '');
  const [linkedin, setLinkedin] = useState(currentUser.linkedin || '');
  const [twitter, setTwitter] = useState(currentUser.twitter || '');
  const [github, setGithub] = useState(currentUser.github || '');

  // Document & Files state
  const [resumeUrl, setResumeUrl] = useState(currentUser.resumeUrl || '');
  const [resumeName, setResumeName] = useState(currentUser.resumeName || '');
  const [resumeSize, setResumeSize] = useState(currentUser.resumeSize || '');

  // Founder specific fields
  const [founderStage, setFounderStage] = useState<string>(
    currentUser.founderStage || 'Seed'
  );
  const [founderLookingForInput, setFounderLookingForInput] = useState<string>(
    currentUser.founderLookingFor?.join(', ') ||
      'Tech & API Synergy, Strategic Alliance, Peer Review, Cross-Promotion'
  );

  // Investor specific fields
  const [investmentInterestsInput, setInvestmentInterestsInput] = useState(
    currentUser.investmentInterests?.join(', ') || 'AI, SaaS, FinTech, DeepTech'
  );
  const [preferredIndustriesInput, setPreferredIndustriesInput] = useState(
    currentUser.preferredIndustries?.join(', ') || 'Artificial Intelligence, B2B SaaS'
  );
  const [minCheck, setMinCheck] = useState(currentUser.investmentRange?.min || 50000);
  const [maxCheck, setMaxCheck] = useState(currentUser.investmentRange?.max || 500000);
  const [selectedStages, setSelectedStages] = useState<FundingStage[]>(
    currentUser.preferredStages || ['Seed', 'Series A']
  );

  // Mentor specific fields
  const [mentorSkillsInput, setMentorSkillsInput] = useState(
    currentUser.mentorSkills?.join(', ') || 'Product Strategy, Go-to-Market, Fundraising'
  );
  const [mentorExperienceYears, setMentorExperienceYears] = useState(
    currentUser.mentorExperienceYears || 8
  );
  const [mentorAvailability, setMentorAvailability] = useState<
    'Available (Accepting Startups)' | 'At Capacity (1/1 Startup)' | 'Part-time Advisory'
  >(currentUser.mentorAvailability || 'Available (Accepting Startups)');

  if (!isOpen) return null;

  const toggleStage = (stg: FundingStage) => {
    setSelectedStages(prev =>
      prev.includes(stg) ? prev.filter(s => s !== stg) : [...prev, stg]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateUserProfile({
      name: name.trim(),
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
      coverImage: coverImage.trim(),
      website: website.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      twitter: twitter.trim() || undefined,
      github: github.trim() || undefined,
      skills: skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      resumeUrl: resumeUrl || undefined,
      resumeName: resumeName || undefined,
      resumeSize: resumeSize || undefined,
      ...(currentUser.role === 'founder'
        ? {
            founderStage,
            founderLookingFor: founderLookingForInput
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          }
        : {}),
      ...(currentUser.role === 'investor'
        ? {
            investmentInterests: investmentInterestsInput
              .split(',')
              .map(s => s.trim())
              .filter(Boolean),
            preferredIndustries: preferredIndustriesInput
              .split(',')
              .map(s => s.trim())
              .filter(Boolean),
            investmentRange: { min: Number(minCheck), max: Number(maxCheck) },
            preferredStages: selectedStages
          }
        : {}),
      ...(currentUser.role === 'mentor'
        ? {
            mentorSkills: mentorSkillsInput
              .split(',')
              .map(s => s.trim())
              .filter(Boolean),
            mentorExperienceYears: Number(mentorExperienceYears),
            mentorAvailability
          }
        : {})
    });

    onClose();
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
  ];

  const sampleCovers = [
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80'
  ];

  const allStages: FundingStage[] = [
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C+',
    'Bootstrapped',
    'Grant Funded'
  ];

  return (
    <div
      id="edit-profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="edit-profile-modal-card"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Edit Profile & Media
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload profile photo, banner cover, documents & bio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-850 px-5 gap-4 overflow-x-auto text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos & Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Bio & Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'documents'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Files & Resume</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('role')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'role'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{currentUser.role.toUpperCase()} Focus</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'social'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Links & Web</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: MEDIA (PHOTOS & BANNER) */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Profile Avatar Upload */}
              <ImageUploadField
                label="Profile Picture"
                sublabel="Upload a clear headshot or avatar from your device (JPG, PNG, WebP)"
                value={avatar}
                onChange={setAvatar}
                aspectRatio="avatar"
                presets={sampleAvatars}
                required
              />

              {/* Cover Banner Upload */}
              <ImageUploadField
                label="Profile Cover Banner"
                sublabel="Upload a custom wide header banner to customize your profile background"
                value={coverImage}
                onChange={setCoverImage}
                aspectRatio="banner"
                presets={sampleCovers}
              />
            </div>
          )}

          {/* TAB 2: GENERAL BIO & DETAILS */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sarah Chen"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. NeuroPulse AI or Apex Capital"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Headline / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Founder & CEO | AI Research Engineer | Angel Investor"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA, USA"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Biography & Executive Summary
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell your story, background, track record, and what you are looking for in the RiseUp ecosystem..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills & Core Focus Areas (Comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  placeholder="e.g. Artificial Intelligence, B2B SaaS, Seed Fundraising, DeepTech, GTM"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS & RESUME/PITCH FILES */}
          {activeTab === 'documents' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Profile Attachment & Credentials</span>
                </h4>
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                  Upload your CV, Founder Deck, Executive Portfolio, or Certifications so other ecosystem members can review and download them directly from your profile.
                </p>
              </div>

              <FileUploadField
                label="Resume / Portfolio / Deck File"
                sublabel="Accepted formats: PDF, DOCX, PPTX (Up to 25MB)"
                fileName={resumeName}
                fileSize={resumeSize}
                fileUrl={resumeUrl}
                onChange={file => {
                  setResumeName(file.name);
                  setResumeSize(file.size);
                  setResumeUrl(file.url);
                }}
                onRemove={() => {
                  setResumeName('');
                  setResumeSize('');
                  setResumeUrl('');
                }}
              />
            </div>
          )}

          {/* TAB 4: ROLE SPECIFIC FOCUS */}
          {activeTab === 'role' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {currentUser.role === 'investor' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Minimum Check Size ($USD)
                      </label>
                      <input
                        type="number"
                        step="10000"
                        value={minCheck}
                        onChange={e => setMinCheck(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Maximum Check Size ($USD)
                      </label>
                      <input
                        type="number"
                        step="50000"
                        value={maxCheck}
                        onChange={e => setMaxCheck(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Preferred Venture Stages
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allStages.map(stg => {
                        const isSelected = selectedStages.includes(stg);
                        return (
                          <button
                            key={stg}
                            type="button"
                            onClick={() => toggleStage(stg)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {stg}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Investment Sectors (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={investmentInterestsInput}
                      onChange={e => setInvestmentInterestsInput(e.target.value)}
                      placeholder="Applied AI, B2B SaaS, HealthTech, CleanTech"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {currentUser.role === 'mentor' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mentoring Availability Status
                    </label>
                    <select
                      value={mentorAvailability}
                      onChange={e => setMentorAvailability(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="Available (Accepting Startups)">
                        Available (Accepting Startups)
                      </option>
                      <option value="At Capacity (1/1 Startup)">
                        At Capacity (1/1 Startup)
                      </option>
                      <option value="Part-time Advisory">
                        Part-time Advisory
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Years of Industry Experience
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={mentorExperienceYears}
                      onChange={e => setMentorExperienceYears(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Advisory Expertise & Domains (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={mentorSkillsInput}
                      onChange={e => setMentorSkillsInput(e.target.value)}
                      placeholder="Product Strategy, Seed Fundraising, GTM Scaling, System Architecture"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {currentUser.role === 'founder' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Founder Synergy & Ecosystem Preferences</span>
                    </h4>
                    <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                      Configure what synergies and collaboration proposals you want to attract from peer founders in the Explore Founders network.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Current Venture Stage
                    </label>
                    <select
                      value={founderStage}
                      onChange={e => setFounderStage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="Idea">Idea</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Bootstrapped">Bootstrapped</option>
                      <option value="Growth">Growth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Looking For & Synergy Focus (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={founderLookingForInput}
                      onChange={e => setFounderLookingForInput(e.target.value)}
                      placeholder="Tech & API Synergy, Strategic Alliance, Peer Review, Co-Marketing, B2B Pilot"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        'Tech & API Synergy',
                        'Strategic Alliance',
                        'Peer Review & Teardown',
                        'Cross-Promotion',
                        'Angel Syndicate Backing',
                        'B2B Pilot & Integration'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!founderLookingForInput.includes(tag)) {
                              setFounderLookingForInput(prev =>
                                prev ? `${prev}, ${tag}` : tag
                              );
                            }
                          }}
                          className="px-2 py-0.5 text-[10px] rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 transition"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentUser.role === 'admin' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Active ADMIN Persona</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Platform moderation, system configuration, audit logs, and user verification tools are enabled.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SOCIAL & WEB LINKS */}
          {activeTab === 'social' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website / Portfolio URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://mywebsite.com"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  X / Twitter Handle / URL
                </label>
                <input
                  type="url"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={e => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Auto-syncs across feed, dashboards & messaging
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
