import React from 'react';
import { UserRole } from '../../types';
import { ShieldCheck, Award, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  isVerified = false,
  size = 'md',
  showLabel = true
}) => {
  const getRoleConfig = () => {
    switch (role) {
      case 'founder':
        return {
          label: 'Founder',
          icon: Sparkles,
          bg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
          dot: 'bg-indigo-500'
        };
      case 'investor':
        return {
          label: 'Investor',
          icon: Briefcase,
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
          dot: 'bg-emerald-500'
        };
      case 'mentor':
        return {
          label: 'Mentor & Advisor',
          icon: Award,
          bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          dot: 'bg-amber-500'
        };
      case 'admin':
        return {
          label: 'Platform Admin',
          icon: ShieldCheck,
          bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
          dot: 'bg-rose-500'
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  }[size];

  return (
    <div
      id={`role-badge-${role}`}
      className={`inline-flex items-center rounded-full border shadow-xs transition-all ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {showLabel && <span>{config.label}</span>}
      {isVerified && (
        <span title="Verified Profile">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
        </span>
      )}
    </div>
  );
};
