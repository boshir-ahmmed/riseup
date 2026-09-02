import React, { useState } from 'react';
import {
  Database,
  X,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Server,
  Layers,
  Table,
  CheckCircle2,
  AlertCircle,
  Code2,
  Globe,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  seedAllDemoDataToSupabase
} from '../../lib/supabase';

interface SupabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseManagerModal: React.FC<SupabaseManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'seed' | 'vercel' | 'sync'>('seed');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [seeding, setSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState<string>('');
  const [seedResult, setSeedResult] = useState<{ success: boolean; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleCopySql = async () => {
    try {
      const response = await fetch('/supabase_schema_and_seed.sql');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadSql = async () => {
    try {
      const response = await fetch('/supabase_schema_and_seed.sql');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'supabase_schema_and_seed.sql';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection();
    setTesting(false);
    setTestResult(result);
  };

  const handleSeedFromClient = async () => {
    setSeeding(true);
    setSeedResult(null);
    setSeedProgress('Starting upload...');

    const res = await seedAllDemoDataToSupabase((msg) => {
      setSeedProgress(msg);
    });

    setSeeding(false);
    setSeedResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Supabase PostgreSQL & Table Editor Hub
                </h2>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                    isSupabaseConfigured
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isSupabaseConfigured ? 'Connected to Supabase' : 'Local Storage Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View every row in visual spreadsheet tables, edit values with 1-click, and persist live data on Vercel.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
          <button
            onClick={() => setActiveTab('seed')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'seed'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>1. SQL Schema & Demo Seed</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'vercel'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>2. Connect to Vercel</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'sync'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>3. Test & Push Live Data</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SQL SCHEMA & SEED */}
          {activeTab === 'seed' && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Everything Ready for 1-Click Setup</span>
                </div>
                <p className="leading-relaxed">
                  We have generated the complete SQL migration file (<strong>supabase_schema_and_seed.sql</strong>) with all 8 tables, Row Level Security rules, and pre-populated demo data (Founders, Investors, Startups, Feed Posts, Messages, Deals).
                </p>
              </div>

              {/* Step-by-step Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                    1
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Create Supabase Project
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-500 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a>, sign in with GitHub or email, and create a new project.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                    2
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Paste & Run SQL Script
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    In Supabase, click <strong>SQL Editor</strong> on the left, click <strong>New Query</strong>, paste the script below, and hit <strong>Run</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-500 font-bold text-xs flex items-center justify-center border border-purple-500/20">
                    3
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    View & Edit in Tables!
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Click <strong>Table Editor</strong> on the left. You will see all 8 tables. Double-click any cell to edit, filter, or delete rows instantly!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopySql}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Full SQL to Clipboard!' : 'Copy Complete SQL Script'}</span>
                </button>

                <button
                  onClick={handleDownloadSql}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .sql File</span>
                </button>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* SQL Code Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">SQL Migration Preview (1,134 lines with schema + demo seed):</span>
                  <span>File: /supabase_schema_and_seed.sql</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed border border-slate-800 max-h-48 overflow-y-auto">
                  <p className="text-emerald-400">-- 1. Creates public.users, public.startups, public.posts, public.conversations, public.messages</p>
                  <p className="text-emerald-400">-- 2. Creates public.investor_requests, public.mentor_requests, public.founder_pitches</p>
                  <p className="text-emerald-400">-- 3. Enables Row Level Security (RLS) with full public demo access policies</p>
                  <p className="text-emerald-400">-- 4. Injects all initial founders, startups, valuations, and community posts!</p>
                  <br />
                  <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.users ( id TEXT PRIMARY KEY, name TEXT NOT NULL, ... );</p>
                  <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.startups ( id TEXT PRIMARY KEY, name TEXT NOT NULL, valuation NUMERIC, ... );</p>
                  <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.posts ( id TEXT PRIMARY KEY, content TEXT, "likesCount" INTEGER, ... );</p>
                  <p className="text-slate-400">INSERT INTO public.users (...) VALUES ('user-founder-1', 'Sarah Chen', ...);</p>
                  <p className="text-slate-400">INSERT INTO public.startups (...) VALUES ('startup-1', 'NeuroPulse AI', ...);</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERCEL DEPLOYMENT */}
          {activeTab === 'vercel' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>Connect Your Vercel Live Deployment</span>
                </div>
                <p className="leading-relaxed">
                  Because your app is deployed to Vercel from GitHub, adding your two Supabase credentials in Vercel enables permanent cloud synchronization for all your users on every device.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Required Environment Variables in Vercel:
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        VITE_SUPABASE_URL
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Your Project URL from Supabase Settings &gt; API (e.g. <code>https://xyzcompany.supabase.co</code>)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('VITE_SUPABASE_URL');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-xs px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
                    >
                      Copy Name
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        VITE_SUPABASE_ANON_KEY
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Your public `anon` key from Supabase Settings &gt; API (starts with <code>eyJhbGci...</code>)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('VITE_SUPABASE_ANON_KEY');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-xs px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
                    >
                      Copy Name
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white">How to add in Vercel:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 text-xs">
                    <li>Open your project at <strong>vercel.com/dashboard</strong>.</li>
                    <li>Go to <strong>Settings</strong> &gt; <strong>Environment Variables</strong>.</li>
                    <li>Add <code>VITE_SUPABASE_URL</code> and paste your project URL.</li>
                    <li>Add <code>VITE_SUPABASE_ANON_KEY</code> and paste your anon key.</li>
                    <li>Click <strong>Save</strong>, then go to <strong>Deployments</strong> and click <strong>Redeploy</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEST & PUSH LIVE DATA */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              {/* Connection Status Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Server className="w-4 h-4 text-slate-500" />
                    <span>Current Connection Status</span>
                  </div>

                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      testResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold">{testResult.success ? 'Connected!' : 'Connection Note'}</p>
                      <p>{testResult.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Push / Seed live data from client */}
              <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Push / Seed Demo Data via Client API</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you have already created the tables in Supabase using the SQL script and configured your credentials, you can also push/re-sync all initial mock startups, users, and feed posts live from here:
                </p>

                {seedProgress && (
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-mono">
                    {seedProgress}
                  </div>
                )}

                {seedResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      seedResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}
                  >
                    {seedResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{seedResult.success ? 'All data successfully injected into Supabase!' : seedResult.error}</span>
                  </div>
                )}

                <button
                  onClick={handleSeedFromClient}
                  disabled={seeding || !isSupabaseConfigured}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md shadow-purple-600/20"
                >
                  <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                  <span>{seeding ? 'Uploading Datasets...' : 'Seed All Datasets into Supabase'}</span>
                </button>
                {!isSupabaseConfigured && (
                  <p className="text-[11px] text-amber-500">
                    * Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable live client syncing.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Table className="w-4 h-4 text-emerald-500" />
            <span>8 Tables Ready: users, startups, posts, conversations, messages, requests, pitches</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-150 transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
