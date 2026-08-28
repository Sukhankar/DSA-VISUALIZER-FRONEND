import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  value: string | number;
  label: string;
  subtitle?: string;
  trend?: string;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBgColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  value,
  label,
  subtitle,
  trend,
}) => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-slate-800/80 bg-[#0B1020]/80 flex flex-col justify-between space-y-3 relative overflow-hidden group">
      {/* Icon & Trend */}
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-xl border ${iconBgColor} shadow-sm transition-transform group-hover:scale-105`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {value}
        </div>
        <div className="text-xs font-semibold text-slate-300 mt-0.5">{label}</div>
      </div>

      {/* Subtitle Footer */}
      {subtitle && (
        <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
