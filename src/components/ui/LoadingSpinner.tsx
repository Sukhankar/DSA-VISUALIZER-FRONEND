import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label,
  message,
  size = 'md',
  className = '',
}) => {
  const displayText = message || label || 'Loading...';
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-slate-400 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-500 mb-3`} />
      {displayText && <p className="text-sm font-medium text-slate-300">{displayText}</p>}
    </div>
  );
};
