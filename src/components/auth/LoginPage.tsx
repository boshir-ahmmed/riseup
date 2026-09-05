import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Rocket,
  Lock,
  Mail,
  User,
  ShieldCheck,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  CheckCircle2,
  Building2,
  ChevronRight,
  HelpCircle,
  Briefcase
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    loginWithRole,
    loginWithUser,
    registerUser,
    users,
    theme,
    toggleTheme,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('founder');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Find demo users for 1-click login
  const founderDemo = users.find(u => u.role === 'founder') || users[1];
  const investorDemo = users.find(u => u.role === 'investor') || users[0];
  const mentorDemo = users.find(u => u.role === 'mentor') || users[2];
  const adminDemo = users.find(u => u.role === 'admin') || users[3];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const success = login(email, password);
      if (!success) {
        setErrorMessage('Invalid credentials. You can select one of the Quick Demo Personas below.');
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid work email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      registerUser(name.trim(), email.trim(), selectedRole, password);
    }, 400);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      loginWithRole(role);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  RiseUp
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800/40">
                  PLATFORM ACCESS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                The Dedicated Professional Startup Ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-850/60 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Value Prop & Trust (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Verified Members & Accredited Network</span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Connecting. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">Startups</span> with Opportunities.
              </h1>

              <p className="text-sm xl:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Enter the global marketplace where audited founders publish milestones, accredited investors discover real-time dealflow, and experienced venture mentors provide 1-to-1 strategic guidance.
              </p>
            </div>

            {/* Feature Highlights Bento */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Founder Milestone Hub</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Publish audited product, revenue & fundraising updates directly to the ecosystem.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Investor Dealflow</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Filter by stage, revenue MRR, valuation, and express interest in vetted startups.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">1-to-1 Advisory</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Match with dedicated industry mentors for bi-weekly operational sprint reviews.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Due Diligence Vault</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Review deck vaults, executive summaries, cap tables, and compliance badges.
                </p>
              </div>
            </div>

            {/* Platform live metrics snippet */}
            <div className="flex items-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <div>
                <p className="font-extrabold text-lg text-slate-900 dark:text-white">$48.5M+</p>
                <p className="text-[11px] text-slate-500">Pipeline Listed</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="font-extrabold text-lg text-slate-900 dark:text-white">350+</p>
                <p className="text-[11px] text-slate-500">Vetted Ventures</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="font-extrabold text-lg text-slate-900 dark:text-white">99.8%</p>
                <p className="text-[11px] text-slate-500">Verified Network</p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              
              {/* Form Navigation Tabs */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className={`py-2.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Member Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className={`py-2.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-7 space-y-5">
                <div>
                  <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    {mode === 'login' ? 'Welcome to RiseUp' : 'Join the Ecosystem'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {mode === 'login'
                      ? 'Sign in to access your ecosystem hub, dealflow, and network.'
                      : 'Create your verified account and select your platform role.'}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                    {errorMessage}
                  </div>
                )}

                {mode === 'login' ? (
                  /* Sign In Form */
                  <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Work Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          placeholder="e.g. alex@neuralflow.ai"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => showToast('Password Recovery', 'Demo mode: Click any Quick Persona below for instant access.', 'info')}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">Keep me logged in</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In to Member Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Register Form */
                  <form onSubmit={handleRegister} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Jordan Miller"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Work Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          placeholder="e.g. jordan@techventures.io"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create strong password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Role Selection Grid */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block">
                        Select Your Ecosystem Role
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          onClick={() => setSelectedRole('founder')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-start gap-2 ${
                            selectedRole === 'founder'
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                          }`}
                        >
                          <Rocket className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[11px] text-slate-900 dark:text-white">Founder</p>
                            <p className="text-[10px] text-slate-500">Raise & Build</p>
                          </div>
                        </div>

                        <div
                          onClick={() => setSelectedRole('investor')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-start gap-2 ${
                            selectedRole === 'investor'
                              ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                          }`}
                        >
                          <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[11px] text-slate-900 dark:text-white">Investor</p>
                            <p className="text-[10px] text-slate-500">Fund & Discover</p>
                          </div>
                        </div>

                        <div
                          onClick={() => setSelectedRole('mentor')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-start gap-2 ${
                            selectedRole === 'mentor'
                              ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-1 ring-amber-500'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                          }`}
                        >
                          <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[11px] text-slate-900 dark:text-white">Mentor</p>
                            <p className="text-[10px] text-slate-500">Advise & Guide</p>
                          </div>
                        </div>

                        <div
                          onClick={() => setSelectedRole('admin')}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-start gap-2 ${
                            selectedRole === 'admin'
                              ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40 ring-1 ring-rose-500'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[11px] text-slate-900 dark:text-white">Admin</p>
                            <p className="text-[10px] text-slate-500">Governance</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Create Account & Enter RiseUp</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Quick 1-Click Persona Sign-In Ribbon */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Or 1-Click Instant Persona Sign-In:
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      Sandbox Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('founder')}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition flex items-center gap-2 cursor-pointer group"
                    >
                      <img
                        src={founderDemo.avatar}
                        alt={founderDemo.name}
                        className="w-7 h-7 rounded-full object-cover border border-indigo-400 group-hover:scale-105 transition"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate">
                          {founderDemo.name}
                        </span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                          Founder
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('investor')}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition flex items-center gap-2 cursor-pointer group"
                    >
                      <img
                        src={investorDemo.avatar}
                        alt={investorDemo.name}
                        className="w-7 h-7 rounded-full object-cover border border-emerald-400 group-hover:scale-105 transition"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate">
                          {investorDemo.name}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                          Investor
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('mentor')}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-left transition flex items-center gap-2 cursor-pointer group"
                    >
                      <img
                        src={mentorDemo.avatar}
                        alt={mentorDemo.name}
                        className="w-7 h-7 rounded-full object-cover border border-amber-400 group-hover:scale-105 transition"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate">
                          {mentorDemo.name}
                        </span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
                          Mentor
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('admin')}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-left transition flex items-center gap-2 cursor-pointer group"
                    >
                      <img
                        src={adminDemo.avatar}
                        alt={adminDemo.name}
                        className="w-7 h-7 rounded-full object-cover border border-rose-400 group-hover:scale-105 transition"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate">
                          {adminDemo.name}
                        </span>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block">
                          Admin
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">RiseUp Ecosystem</span>
            <span>•</span>
            <span>All Members Must Authenticate</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>SOC2 Type II Certified</span>
            <span>•</span>
            <span>© 2026 RiseUp Global Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
