import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  File,
  X,
  CheckCircle2,
  Download,
  Eye,
  Paperclip,
  Trash2,
  FileCode,
  FileSpreadsheet,
  Loader2,
  Cloud
} from 'lucide-react';
import { uploadFileToSupabaseStorage, isSupabaseConfigured } from '../../lib/supabase';

interface FileUploadFieldProps {
  label: string;
  sublabel?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  folder?: 'documents' | 'startups' | 'posts' | 'avatars' | 'covers' | 'chat';
  onChange: (fileData: { name: string; size: string; url: string; type: string }) => void;
  onRemove?: () => void;
  accept?: string;
  className?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  sublabel,
  fileName,
  fileSize,
  fileUrl,
  folder = 'documents',
  onChange,
  onRemove,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.csv,.xlsx',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (name: string = '') => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-6 h-6 text-rose-500" />;
    if (ext === 'doc' || ext === 'docx') return <FileText className="w-6 h-6 text-blue-500" />;
    if (ext === 'ppt' || ext === 'pptx') return <FileSpreadsheet className="w-6 h-6 text-amber-500" />;
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
    return <File className="w-6 h-6 text-indigo-500" />;
  };

  const handleFileSelect = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds the 50MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Streaming to Supabase Storage...');

    try {
      if (isSupabaseConfigured) {
        const uploadRes = await uploadFileToSupabaseStorage(file, folder, file.name);
        if (uploadRes.success && uploadRes.url) {
          onChange({
            name: file.name,
            size: formatFileSize(file.size),
            url: uploadRes.url,
            type: file.type || file.name.split('.').pop() || 'document'
          });
          setIsUploading(false);
          setUploadStatus(null);
          return;
        } else {
          console.warn('[Supabase Storage] Fallback to reader:', uploadRes.error);
        }
      }

      // Local fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          onChange({
            name: file.name,
            size: formatFileSize(file.size),
            url: e.target.result,
            type: file.type || file.name.split('.').pop() || 'document'
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload exception:', err);
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
    if (onRemove) {
      onRemove();
    } else {
      onChange({ name: '', size: '', url: '', type: '' });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div>
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
        {sublabel && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {sublabel}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col items-center justify-center text-center animate-pulse">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {uploadStatus || 'Uploading document to Supabase Storage...'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Storing file securely in the cloud bucket...
          </p>
        </div>
      ) : fileUrl && fileName ? (
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">
              {getFileIcon(fileName)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {fileName}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                <span>{fileSize || 'Uploaded file'}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
                {fileUrl?.includes('supabase.co/storage') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Cloud className="w-2.5 h-2.5" /> Supabase Storage
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={fileName}
              className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition"
              title="Download / Open File"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
              title="Remove File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group rounded-2xl border-2 border-dashed transition p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/80 dark:bg-slate-850/50 hover:bg-indigo-50/20'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition shadow-xs">
            <Paperclip className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
              Upload Document / File
            </span>{' '}
            or drop here
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            PDF, DOCX, PPTX, XLSX (Up to 25MB)
          </p>
        </div>
      )}
    </div>
  );
};
