import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { User, FounderPitchType } from '../../types';
import {
  X,
  Sparkles,
  Send,
  Zap,
  Users,
  Lightbulb,
  Share2,
  DollarSign,
  Briefcase,
  Upload,
  FileText,
  CheckCircle2,
  Building2,
  MapPin,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  Flame,
  ArrowRight
} from 'lucide-react';

interface PitchToFounderModalProps {
  isOpen: boolean;
  targetFounder: User | null;
  onClose: () => void;
}

export const PitchToFounderModal: React.FC<PitchToFounderModalProps> = ({
  isOpen,
  targetFounder,
  onClose
}) => {
  const {
    currentUser,
    startups,
    sendFounderPitch,
    setActiveView,
    setActiveConversationId,
    startConversationWithUser
  } = useApp();

  const senderStartup = startups.find(s => s.id === currentUser.startupId) || startups[0];
  const targetStartup = startups.find(s => s.id === targetFounder?.startupId);

  const [pitchType, setPitchType] = useState<FounderPitchType>('synergy');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [synergyPoints, setSynergyPoints] = useState<string[]>([
    'Shared technical integrations and mutual API connectivity',
    'Co-marketing opportunities and ecosystem cross-promotion'
  ]);
  const [newSynergyInput, setNewSynergyInput] = useState('');
  const [proposedNextStep, setProposedNextStep] = useState<
    'intro_call' | 'coffee_chat' | 'demo_exchange' | 'advisory_swap' | 'nda_review'
  >('intro_call');
  const [personalNote, setPersonalNote] = useState('');
  
  // Pitch deck attachment state
  const [deckName, setDeckName] = useState<string>(
    senderStartup?.pitchDeckName || `${(senderStartup?.name || 'Startup').replace(/\s+/g, '_')}_Synergy_Deck.pdf`
  );
  const [deckUrl, setDeckUrl] = useState<string>(senderStartup?.pitchDeckUrl || '');
  const [deckSize, setDeckSize] = useState<string>('3.8 MB');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !targetFounder) return null;

  const pitchTypesList: {
    type: FounderPitchType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      type: 'synergy',
      label: 'Tech & Product Synergy',
      description: 'API integration, shared data pipelines, or hardware/software synergy',
      icon: Zap,
      accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    },
    {
      type: 'co_founder',
      label: 'Strategic Alliance / Co-Founder',
      description: 'Long-term joint venture, executive partnership, or co-building',
      icon: Users,
      accentColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      type: 'peer_review',
      label: 'Peer Feedback & Teardown',
      description: 'Constructive product critique, pitch deck teardown, and mutual advisory',
      icon: Lightbulb,
      accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      type: 'cross_promo',
      label: 'Cross-Promotion & Co-Marketing',
      description: 'Joint webinar, bundle offering, ecosystem co-launch, or shared audience',
      icon: Share2,
      accentColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
    },
    {
      type: 'angel_invest',
      label: 'Peer Angel Backing',
      description: 'Founder-to-founder angel check, founder syndicate, or co-investment',
      icon: DollarSign,
      accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    },
    {
      type: 'b2b_partnership',
      label: 'B2B Pilot & Integration',
      description: 'Enterprise trial, pilot deployment, or vendor-partner onboarding',
      icon: Briefcase,
      accentColor: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
    }
  ];

  const handleApplyTemplate = (type: FounderPitchType) => {
    setPitchType(type);
    const myName = senderStartup?.name || 'our startup';
    const targetName = targetStartup?.name || targetFounder.name;

    if (type === 'synergy') {
      setTitle(`${myName} × ${targetName}: Product & Infrastructure Synergy`);
      setSummary(`We propose an integration between ${myName} and ${targetName} to combine our core strengths, streamline end-to-end customer workflows, and eliminate redundant pipeline friction.`);
      setSynergyPoints([
        `Direct API and data sync between ${myName} and ${targetName}`,
        'Shared telemetry and automated intelligence pipeline',
        'Co-published engineering case study to attract early adopter clients'
      ]);
    } else if (type === 'co_founder') {
      setTitle(`Strategic Partnership & Joint Ecosystem Expansion`);
      setSummary(`Exploring a high-trust strategic alignment between our teams to cross-leverage go-to-market channels, shared technical architecture, and joint industry grant pursuits.`);
      setSynergyPoints([
        'Joint sales introductions to mutual enterprise enterprise prospects',
        'Shared infrastructure blueprints and developer tooling',
        'Quarterly founder strategic check-ins'
      ]);
    } else if (type === 'peer_review') {
      setTitle(`Peer Deck & Product Architecture Exchange`);
      setSummary(`I would love to swap constructive peer feedback on your product roadmap and share our current pitch deck for your candid founder teardown.`);
      setSynergyPoints([
        'Actionable feedback on go-to-market and pricing positioning',
        'Technical review of infrastructure scaling and API design',
        'Warm introductions to relevant founders in our mutual network'
      ]);
    } else if (type === 'cross_promo') {
      setTitle(`Joint Co-Marketing & Ecosystem Community Webinar`);
      setSummary(`Let's host a high-impact joint technical session or offer a bundled perk to our collective community of founders and technology leaders.`);
      setSynergyPoints([
        'Joint live demo & thought leadership panel',
        'Mutual newsletter and platform spotlight',
        'Exclusive perks package for our users'
      ]);
    } else if (type === 'angel_invest') {
      setTitle(`Founder Angel Interest & Syndicate Co-Investment`);
      setSummary(`Extremely bullish on what you are building with ${targetName}. Exploring peer founder participation in your current or upcoming financing round.`);
      setSynergyPoints([
        'Fast founder-friendly angel ticket and diligence turnaround',
        'Hands-on technical advisory and hiring support',
        'Introductions to top-tier lead seed and series A venture funds'
      ]);
    } else {
      setTitle(`B2B Pilot Integration & Beta Enterprise Testing`);
      setSummary(`We would love to pilot ${myName} within your technology stack or explore deploying ${targetName} across our infrastructure.`);
      setSynergyPoints([
        'Zero-risk 60-day pilot deployment with dedicated support',
        'Custom feature prioritization to solve your core operational bottlenecks',
        'Shared analytics dashboard and ROI benchmark reporting'
      ]);
    }
  };

  const handleAddSynergyPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSynergyInput.trim()) return;
    setSynergyPoints(prev => [...prev, newSynergyInput.trim()]);
    setNewSynergyInput('');
  };

  const handleRemoveSynergyPoint = (index: number) => {
    setSynergyPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDeckName(file.name);
      setDeckSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDeckUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    setIsSubmitting(true);

    try {
      sendFounderPitch({
        senderFounderId: currentUser.id,
        senderFounderName: currentUser.name,
        senderFounderAvatar: currentUser.avatar,
        senderFounderTitle: currentUser.title,
        senderStartupId: senderStartup?.id,
        senderStartupName: senderStartup?.name,
        senderStartupLogo: senderStartup?.logo,
        
        recipientFounderId: targetFounder.id,
        recipientFounderName: targetFounder.name,
        recipientFounderAvatar: targetFounder.avatar,
        recipientFounderTitle: targetFounder.title,
        recipientStartupId: targetStartup?.id,
        recipientStartupName: targetStartup?.name,
        
        pitchType,
        title: title.trim(),
        summary: summary.trim(),
        synergyPoints: synergyPoints.length > 0 ? synergyPoints : ['Mutually beneficial founder collaboration'],
        deckUrl: deckUrl || 'https://example.com/pitch/founder_synergy_deck.pdf',
        deckName: deckName || 'Founder_Synergy_Proposal.pdf',
        deckSize: deckSize || '3.5 MB',
        proposedNextStep,
        note: personalNote.trim() || undefined
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Send Pitch to Founder
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                  FOUNDER TO FOUNDER
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct peer-to-peer synergy, joint ventures, tech integration & co-building
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Target Founder Card Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={targetFounder.avatar}
                alt={targetFounder.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {targetFounder.name}
                  </span>
                  {targetFounder.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {targetFounder.title || targetFounder.company || 'Founder'}
                </p>
                {targetFounder.location && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{targetFounder.location}</span>
                  </div>
                )}
              </div>
            </div>

            {targetStartup && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 self-stretch sm:self-auto justify-center">
                <img
                  src={targetStartup.logo}
                  alt={targetStartup.name}
                  className="w-6 h-6 rounded object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {targetStartup.name}
                  </p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold leading-tight">
                    {targetStartup.stage} Stage • {targetStartup.industry}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Pitch Purpose Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>Select Pitch Collaboration Type</span>
              <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400">
                Click template to auto-populate
              </span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pitchTypesList.map(item => {
                const IconComponent = item.icon;
                const isSelected = pitchType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleApplyTemplate(item.type)}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${item.accentColor} shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pitch Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Pitch Headline / Topic <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Edge Telemetry & Real-Time AI Pipeline Integration"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Executive Summary / Value Prop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Executive Value Proposition & Collaboration Plan</span>
              <span className="text-[11px] font-normal text-slate-400">
                {summary.length} characters
              </span>
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Detail how both startups can unlock exponential leverage together..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none custom-scrollbar"
            />
          </div>

          {/* Synergy & Win-Win Points */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Key Synergy & Mutual Benefit Points
            </label>
            
            <div className="space-y-2 mb-2">
              {synergyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{point}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSynergyPoint(idx)}
                    className="text-slate-400 hover:text-rose-500 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSynergyInput}
                onChange={e => setNewSynergyInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSynergyPoint(e);
                  }
                }}
                placeholder="Add custom synergy point and press enter..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSynergyPoint}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Proposed Next Step */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Proposed Next Action
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'intro_call', label: '15-min Intro Call', icon: Calendar },
                { id: 'coffee_chat', label: 'Virtual Coffee Chat', icon: MessageSquare },
                { id: 'demo_exchange', label: 'Tech Demo Swap', icon: Sparkles },
                { id: 'advisory_swap', label: 'Peer Advisory Swap', icon: Users },
                { id: 'nda_review', label: 'NDA & Architecture Review', icon: ShieldCheck }
              ].map(step => {
                const StepIcon = step.icon;
                const isSelected = proposedNextStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setProposedNextStep(step.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <StepIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attach Pitch Deck / One-Pager File */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Attached Pitch Deck & Synergy Deck</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Auto-linked from your startup profile
              </span>
            </label>

            <div className="p-3.5 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {deckName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    PDF Document • {deckSize} • Secure Cloud Room
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/60 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Deck</span>
                </button>
              </div>
            </div>
          </div>

          {/* Personal Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Personal Founder Note <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={personalNote}
              onChange={e => setPersonalNote(e.target.value)}
              placeholder={`Hey ${targetFounder.name}, loved your recent milestones! Looking forward to connecting...`}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none custom-scrollbar"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !summary.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Deliver Pitch to {targetFounder.name.split(' ')[0]}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
