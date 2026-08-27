import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center glass-panel rounded-xl border border-slate-800 ${className}`}>
      <div className="p-3 bg-slate-900/80 text-slate-400 rounded-full border border-slate-800 mb-4">
        {icon || <Inbox className="w-8 h-8 text-indigo-400" />}
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      {description && <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">{description}</p>}
      {action ? (
        <div>{action}</div>
      ) : actionLabel && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
