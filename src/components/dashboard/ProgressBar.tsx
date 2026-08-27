import React from 'react';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'indigo' | 'emerald' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = true,
  size = 'md',
  variant = 'indigo',
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    indigo: 'bg-indigo-600 shadow-indigo-500/20',
    emerald: 'bg-emerald-500 shadow-emerald-500/20',
    amber: 'bg-amber-500 shadow-amber-500/20',
  };

  return (
    <div className="w-full space-y-1 select-none">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400 font-medium">Progress</span>
          <span className="text-slate-200 font-bold">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 ${sizeClasses[size]}`}>
        <div
          style={{ width: `${clampedValue}%` }}
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${variantClasses[variant]}`}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
