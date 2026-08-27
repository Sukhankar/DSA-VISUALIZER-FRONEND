import React from 'react';
import { ActionType, VisualizationStep } from '../../types';
import { Badge } from '../ui/Badge';
import { Info } from 'lucide-react';

interface StepTimelineProps {
  currentStepIndex: number; // 0-based index
  totalSteps: number;
  currentStepData?: VisualizationStep;
  onStepSelect: (index: number) => void;
}

export const StepTimeline: React.FC<StepTimelineProps> = ({
  currentStepIndex,
  totalSteps,
  currentStepData,
  onStepSelect,
}) => {
  if (totalSteps <= 0) return null;

  const currentDisplayStep = currentStepIndex + 1;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  const getActionBadge = (action?: ActionType) => {
    if (!action) return <Badge variant="neutral">STEP</Badge>;
    switch (action) {
      case 'INITIAL':
        return <Badge variant="neutral">INITIAL</Badge>;
      case 'COMPARE':
        return <Badge variant="warning">COMPARE</Badge>;
      case 'SWAP':
        return <Badge variant="danger">SWAP</Badge>;
      case 'NO_SWAP':
        return <Badge variant="indigo">NO SWAP</Badge>;
      case 'SELECT':
        return <Badge variant="secondary">SELECT</Badge>;
      case 'VISIT':
        return <Badge variant="primary">VISIT</Badge>;
      case 'FOUND':
        return <Badge variant="success">FOUND</Badge>;
      case 'NOT_FOUND':
        return <Badge variant="danger">NOT FOUND</Badge>;
      case 'COMPLETE':
        return <Badge variant="success">COMPLETE</Badge>;
      default:
        return <Badge variant="indigo">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          {getActionBadge(currentStepData?.action)}
          <span className="font-mono text-slate-300">
            Step <strong className="text-white">{currentDisplayStep}</strong> of{' '}
            <strong className="text-white">{totalSteps}</strong>
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {Math.round(progressPercent)}% Completed
        </span>
      </div>

      {/* Range Slider / Progress Track */}
      <div className="relative flex items-center">
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => onStepSelect(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
        />
      </div>

      {/* Message Output Card */}
      {currentStepData?.message && (
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex items-start gap-2.5 text-xs text-slate-200">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-mono text-[13px]">
            {currentStepData.message}
          </span>
        </div>
      )}
    </div>
  );
};
