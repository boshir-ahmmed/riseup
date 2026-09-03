import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { FileUploadField } from '../common/FileUploadField';
import {
  X,
  Building2,
  Sparkles,
  DollarSign,
  Users,
  Target,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  Layers,
  Rocket
} from 'lucide-react';
import { FundingStage } from '../../types';

interface CreateStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateStartupModal: React.FC<CreateStartupModalProps> = ({
  isOpen,
  onClose
}) => {
  const { createStartup, currentUser, setActiveView, setSelectedStartupId } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState('Artificial Intelligence');
  const [stage, setStage] = useState<FundingStage>('Seed');
  const [location, setLocation] = useState('San Francisco, CA, USA');
  const [website, setWebsite] = useState('https://');

  // Media state (uploads)
  const [logo, setLogo] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
  );
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80'
  );

  // Pitch Deck upload
  const [pitchDeckUrl, setPitchDeckUrl] = useState('');
  const [pitchDeckName, setPitchDeckName] = useState('');
  const [pitchDeckSize, setPitchDeckSize] = useState('');

  // Deep Details
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [story, setStory] = useState('');
  const [fundingGoal, setFundingGoal] = useState(1500000);
  const [valuation, setValuation] = useState(8000000);
  const [equityOffered, setEquityOffered] = useState(12);
  const [minInvestment, setMinInvestment] = useState(25000);
  const [businessModel, setBusinessModel] = useState<any>('B2B SaaS');
  const [marketSize, setMarketSize] = useState('$35B Total Addressable Market');
  const [targetCustomers, setTargetCustomers] = useState('Mid-market enterprise engineering teams');
  const [tagsInput, setTagsInput] = useState('AI, SaaS, B2B, Automation');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagline.trim()) return;

    const newCreated = createStartup({
      name: name.trim(),
      tagline: tagline.trim(),
      industry,
      stage,
      location: location.trim(),
      website: website.trim(),
      logo,
      coverImage,
      pitchDeckName: pitchDeckName || 'Investor_Pitch_Deck_2025.pdf',
      pitchDeckUrl: pitchDeckUrl || undefined,
      problem:
        problem ||
        `${name} addresses acute operational friction and lack of modern automated tools in the ${industry} space.`,
      solution:
        solution ||
        `An intelligent, full-stack platform delivering high-speed automation and actionable insights.`,
      story:
        story ||
        `Founded by ${currentUser.name} with extensive background in building scalable enterprise systems.`,
      vision: `Empowering global teams with world-class autonomous infrastructure.`,
      mission: `Accelerating industry transformation through modern, accessible tooling.`,
      businessModel,
      fundingGoal: Number(fundingGoal),
      fundingRaised: 0,
      valuation: Number(valuation),
      equityOffered: Number(equityOffered),
      minInvestment: Number(minInvestment),
      marketSize,
      targetCustomers,
      tags: tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    });

    onClose();
    if (newCreated && newCreated.id) {
      setSelectedStartupId(newCreated.id);
      setActiveView('startup-details');
    }
  };

  const sampleLogos = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
  ];

  const sampleCovers = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
  ];

  return (
    <div
      id="create-startup-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="create-startup-modal-card"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Launch Startup Profile
              </h3>
              <p className="text-xs text-slate-500">
                Step {step} of 3: {step === 1 ? 'Identity & Visuals' : step === 2 ? 'Problem & Pitch' : 'Funding & Term Sheet'}
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

        {/* Step Indicator */}
        <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <div
            className={`flex-1 h-1.5 rounded-full transition-all ${
              step >= 1 ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          />
          <div
            className={`flex-1 h-1.5 rounded-full transition-all ${
              step >= 2 ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          />
          <div
            className={`flex-1 h-1.5 rounded-full transition-all ${
              step >= 3 ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: IDENTITY, LOGO & COVER BANNER */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Startup Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. NexusFlow AI"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Sector <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option>Artificial Intelligence</option>
                    <option>B2B SaaS</option>
                    <option>FinTech</option>
                    <option>HealthTech</option>
                    <option>CleanTech & Energy</option>
                    <option>DeepTech / Hardware</option>
                    <option>Cybersecurity</option>
                    <option>BioTech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / One-Liner Pitch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. Autonomous real-time analytics for modern software engineering teams"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Venture Stage
                  </label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value as FundingStage)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option>Pre-Seed</option>
                    <option>Seed</option>
                    <option>Series A</option>
                    <option>Series B</option>
                    <option>Series C+</option>
                    <option>Bootstrapped</option>
                    <option>Grant Funded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Logo Upload Field */}
              <ImageUploadField
                label="Startup Logo"
                sublabel="Upload a clean brand logo image from your device (PNG, JPG, SVG)"
                value={logo}
                onChange={setLogo}
                aspectRatio="logo"
                presets={sampleLogos}
                folder="startups"
                required
              />

              {/* Cover Banner Upload Field */}
              <ImageUploadField
                label="Startup Cover Banner"
                sublabel="Upload a high-resolution hero banner for the startup profile"
                value={coverImage}
                onChange={setCoverImage}
                aspectRatio="banner"
                presets={sampleCovers}
                folder="covers"
              />
            </div>
          )}

          {/* STEP 2: PROBLEM, SOLUTION & PITCH DECK */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Problem Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  placeholder="Describe the critical pain point your target customer currently suffers from..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Solution & Value Proposition <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={solution}
                  onChange={e => setSolution(e.target.value)}
                  placeholder="How does your technology or platform solve this problem 10x better?"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Customers
                  </label>
                  <input
                    type="text"
                    value={targetCustomers}
                    onChange={e => setTargetCustomers(e.target.value)}
                    placeholder="e.g. Mid-market engineering leads"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Market Size (TAM)
                  </label>
                  <input
                    type="text"
                    value={marketSize}
                    onChange={e => setMarketSize(e.target.value)}
                    placeholder="e.g. $45B Global TAM"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Pitch Deck File Upload */}
              <FileUploadField
                label="Investor Pitch Deck (File Upload)"
                sublabel="Upload your official presentation deck (PDF or PPTX) for accredited investors"
                fileName={pitchDeckName}
                fileSize={pitchDeckSize}
                fileUrl={pitchDeckUrl}
                folder="documents"
                onChange={file => {
                  setPitchDeckName(file.name);
                  setPitchDeckSize(file.size);
                  setPitchDeckUrl(file.url);
                }}
                onRemove={() => {
                  setPitchDeckName('');
                  setPitchDeckSize('');
                  setPitchDeckUrl('');
                }}
              />
            </div>
          )}

          {/* STEP 3: FINANCIALS & TERM SHEET */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Funding Target Goal ($USD)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={fundingGoal}
                    onChange={e => setFundingGoal(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pre-Money Valuation ($USD)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={valuation}
                    onChange={e => setValuation(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Equity Offered (%)
                  </label>
                  <input
                    type="number"
                    value={equityOffered}
                    onChange={e => setEquityOffered(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Check Size ($USD)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={minInvestment}
                    onChange={e => setMinInvestment(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Business Model
                  </label>
                  <select
                    value={businessModel}
                    onChange={e => setBusinessModel(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option>B2B SaaS</option>
                    <option>B2C Marketplace</option>
                    <option>Enterprise SaaS</option>
                    <option>DeepTech / Hardware</option>
                    <option>FinTech</option>
                    <option>AI / API</option>
                    <option>BioTech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="AI, SaaS, B2B, GenerativeAI"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!name.trim() || !tagline.trim())}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Launch Startup Profile</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
