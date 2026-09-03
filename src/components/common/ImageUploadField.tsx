import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Camera,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Eye,
  Loader2,
  Cloud
} from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';
import { uploadFileToSupabaseStorage, isSupabaseConfigured } from '../../lib/supabase';

interface ImageUploadFieldProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: 'avatar' | 'banner' | 'logo' | 'media';
  folder?: 'avatars' | 'covers' | 'startups' | 'posts' | 'documents' | 'chat';
  presets?: string[];
  required?: boolean;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  sublabel,
  value,
  onChange,
  aspectRatio = 'avatar',
  folder,
  presets = [],
  required = false,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);

  const targetFolder = folder || (
    aspectRatio === 'avatar' ? 'avatars' :
    aspectRatio === 'banner' ? 'covers' :
    aspectRatio === 'logo' ? 'startups' : 'posts'
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WebP, GIF, SVG).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Image file size should be less than 20MB.');
      return;
    }

    setFileMeta({
      name: file.name,
      size: formatFileSize(file.size)
    });
    setPreviewError(false);
    setIsUploading(true);
    setUploadStatus('Optimizing image...');

    try {
      const maxWidth = aspectRatio === 'banner' ? 1400 : aspectRatio === 'avatar' || aspectRatio === 'logo' ? 400 : 1080;
      const maxHeight = aspectRatio === 'banner' ? 600 : aspectRatio === 'avatar' || aspectRatio === 'logo' ? 400 : 800;

      const compressedDataUrl = await compressImage(file, {
        maxWidth,
        maxHeight,
        quality: 0.82,
        mimeType: 'image/jpeg'
      });

      // Upload directly to Supabase Storage if configured
      if (isSupabaseConfigured) {
        setUploadStatus('Uploading to Supabase Storage...');
        const res = await fetch(compressedDataUrl);
        const blob = await res.blob();

        const uploadRes = await uploadFileToSupabaseStorage(blob, targetFolder, file.name);
        if (uploadRes.success && uploadRes.url) {
          onChange(uploadRes.url);
          setIsUploading(false);
          setUploadStatus(null);
          return;
        } else {
          console.warn('[Supabase Storage] Fallback to compressed data URL:', uploadRes.error);
        }
      }

      // Local fallback if Supabase Storage is not yet provisioned
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Failed to process/upload image:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          onChange(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
    setFileMeta(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {sublabel && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {sublabel}
            </p>
          )}
        </div>

        {presets.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>{showPresets ? 'Hide presets' : 'Preset gallery'}</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Preset Gallery if toggled */}
      {showPresets && presets.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Choose Quick Preset
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {presets.map((presetUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(presetUrl);
                  setShowPresets(false);
                }}
                className={`relative group rounded-xl overflow-hidden border-2 transition hover:scale-105 cursor-pointer ${
                  value === presetUrl
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                    : 'border-transparent hover:border-indigo-400'
                }`}
              >
                <img
                  src={presetUrl}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-12 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone / Preview */}
      {isUploading ? (
        <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col items-center justify-center text-center animate-pulse">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {uploadStatus || 'Uploading to Supabase Storage...'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Streaming file directly to cloud bucket...
          </p>
        </div>
      ) : value && !previewError ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 dark:bg-slate-900/40 p-2">
          {/* Avatar layout */}
          {aspectRatio === 'avatar' && (
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md bg-slate-800 shrink-0">
                <img
                  src={value}
                  alt="Avatar Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Profile Photo Loaded</span>
                  </div>
                  {value?.includes('supabase.co/storage') && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Cloud className="w-2.5 h-2.5" />
                      <span>Supabase Cloud</span>
                    </span>
                  )}
                </div>
                {fileMeta && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {fileMeta.name} • {fileMeta.size}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Banner layout */}
          {aspectRatio === 'banner' && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-750">
              <div className="h-32 sm:h-36 w-full relative bg-slate-950">
                <img
                  src={value}
                  alt="Banner Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold drop-shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cover Banner Loaded {fileMeta ? `(${fileMeta.size})` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Change Cover</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1 bg-black/60 hover:bg-rose-600 text-white rounded-lg text-xs transition cursor-pointer"
                      title="Remove banner"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logo / Media layout */}
          {(aspectRatio === 'logo' || aspectRatio === 'media') && (
            <div className="flex items-start gap-4 p-1">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 shadow-sm">
                <img
                  src={value}
                  alt="Media Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Image Uploaded Successfully</span>
                </div>
                {fileMeta && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {fileMeta.name} ({fileMeta.size})
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Different Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-1 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty Dropzone */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative rounded-2xl border-2 border-dashed transition p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/80 dark:bg-slate-850/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50 underline-offset-2">
                Click to upload
              </span>{' '}
              or drag & drop
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              PNG, JPG, WebP, GIF or SVG (Up to 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
