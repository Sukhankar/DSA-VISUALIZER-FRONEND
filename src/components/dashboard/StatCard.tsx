import React from 'react';
import { Card } from '../ui/Card';

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: React.ReactNode;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor = 'indigo',
}) => {
  const accentStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <Card className="p-5 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="text-2xl font-extrabold text-slate-100 font-mono">
          {value}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-500 font-medium">
            {subtext}
          </p>
        )}
      </div>

      <div className={`p-3 rounded-xl border ${accentStyles[accentColor]} shrink-0`}>
        {icon}
      </div>
    </Card>
  );
};
