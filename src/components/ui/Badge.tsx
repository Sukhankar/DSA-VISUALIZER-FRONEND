import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'indigo' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    secondary: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    neutral: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
