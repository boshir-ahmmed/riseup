import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  Rocket,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    loginWithRole,
    login,
    registerUser,
    users
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('founder');
  const [name, setName] = useState('');

  if (!showAuthModal) return null;

  const handleQuickLogin = (role: UserRole) => {
    loginWithRole(role);
    setShowAuthModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      login(email, password);
    } else {
      registerUser(name.trim() || 'New Member', email.trim() || `user-${Date.now()}@riseup.eco`, selectedRole, password);
    }
    setShowAuthModal(false);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setShowAuthModal(false)}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {authModalMode === 'login' ? 'Sign In to RiseUp' : 'Create RiseUp Account'}
              </h3>
              <p className="text-[11px] text-slate-500">
                The Dedicated Professional Startup Ecosystem
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAuthModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Quick Demo Switcher Presets */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Prototype Persona Sign-In:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('founder')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  F
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-[11px]">
                    Alex Rivera
                  </span>
                  <span className="text-[10px] text-indigo-600">Founder</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('investor')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  I
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-[11px]">
                    Sarah Chen
                  </span>
                  <span className="text-[10px] text-emerald-600">Investor</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('mentor')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-left transition flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-xs font-bold">
                  M
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-[11px]">
                    Marcus Vance
                  </span>
                  <span className="text-[10px] text-amber-600">Mentor</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-left transition flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-[11px]">
                    Victoria Sterling
                  </span>
                  <span className="text-[10px] text-rose-600">Super Admin</span>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-2 text-slate-400 text-[10px] uppercase font-bold">Or Email</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@startup.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ecosystem Role
                </label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="founder">Founder (1 Startup Focus)</option>
                  <option value="investor">Investor (Multi-Startup Syndication)</option>
                  <option value="mentor">Mentor (1 Active Startup Mentee)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  * Note: Admin accounts cannot be self-registered (governance policy).
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer"
            >
              {authModalMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setAuthModalMode(authModalMode === 'login' ? 'register' : 'login')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              {authModalMode === 'login'
                ? "Don't have an account? Register here"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
