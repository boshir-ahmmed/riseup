import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostType } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  X,
  Sparkles,
  Award,
  DollarSign,
  Users,
  Rocket,
  Tag,
  Send,
  Building2
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addPost, startups } = useApp();

  const [type, setType] = useState<PostType>('milestone');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['#StartupMilestone', '#Innovation']);

  if (!isOpen) return null;

  const myStartup = startups.find(s => s.id === currentUser.startupId) || startups[0];

  const presetImages = [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80'
  ];

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const formatted = tagInput.startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
    if (!tags.includes(formatted)) {
      setTags([...tags, formatted]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addPost({
      type,
      title: title.trim() || undefined,
      content,
      mediaUrl: mediaUrl.trim() || undefined,
      mediaType: mediaUrl.trim() ? 'image' : 'none',
      tags
    });

    onClose();
    setTitle('');
    setContent('');
    setMediaUrl('');
  };

  const postTypes: { id: PostType; label: string; icon: any; color: string }[] = [
    { id: 'milestone', label: 'Milestone', icon: Award, color: 'text-amber-500' },
    { id: 'funding_update', label: 'Funding Round', icon: DollarSign, color: 'text-emerald-500' },
    { id: 'hiring', label: 'Hiring Notice', icon: Users, color: 'text-blue-500' },
    { id: 'product_update', label: 'Product Update', icon: Rocket, color: 'text-purple-500' },
    { id: 'announcement', label: 'Announcement', icon: Sparkles, color: 'text-indigo-500' }
  ];

  return (
    <div
      id="create-post-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="create-post-modal-card"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={myStartup.logo}
              alt={myStartup.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Publish Startup Post
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Broadcasting as <strong className="text-slate-800 dark:text-slate-200">{myStartup.name}</strong> • {currentUser.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Post Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Post Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {postTypes.map(pt => {
                const Icon = pt.icon;
                const isSelected = type === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setType(pt.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${pt.color}`} />
                    <span className="text-[11px] text-center leading-tight">{pt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Headline Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Headline (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Closed $1.5M Seed Round or Launched v2.0 Platform Beta"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Post Story & Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share the milestones, traction metrics, investor opportunities, or open roles..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Media Image Upload Field */}
          <ImageUploadField
            label="Attach Media Image"
            sublabel="Upload an image, chart, team photo or diagram from your device"
            value={mediaUrl}
            onChange={setMediaUrl}
            aspectRatio="media"
            presets={presetImages}
          />

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hashtags & Sector Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="e.g. HealthTech, AI, SeedRound (Press enter to add)"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-300"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
