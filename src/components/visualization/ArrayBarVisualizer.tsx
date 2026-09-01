import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';

interface ArrayBarVisualizerProps {
  currentStep?: VisualizationStep;
}

export const ArrayBarVisualizer: React.FC<ArrayBarVisualizerProps> = ({ currentStep }) => {
  const array = currentStep?.array || [5, 1, 4, 2, 8];
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  const maxValue = Math.max(...array, 1);

  const getBarColor = (index: number) => {
    const isSelected = activeIndices.includes(index);
    if (!isSelected) {
      return action === 'COMPLETE'
        ? 'bg-emerald-500/90 border-emerald-400 shadow-emerald-500/20'
        : 'bg-indigo-600/70 border-indigo-500/60 text-slate-200';
    }

    switch (action) {
      case 'COMPARE':
      case 'SELECT':
        return 'bg-amber-500 border-amber-300 text-slate-950 shadow-amber-500/30 scale-105';
      case 'SWAP':
        return 'bg-rose-500 border-rose-300 text-white shadow-rose-500/30 scale-110';
      case 'FOUND':
      case 'UPDATE':
      case 'INSERT':
        return 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-cyan-500/30';
      case 'COMPLETE':
        return 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-500/30';
      default:
        return 'bg-purple-600 border-purple-400 text-white shadow-purple-500/30';
    }
  };

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-end min-h-[360px] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Visual Bars Container */}
      <div className="w-full flex items-end justify-center gap-2 sm:gap-3 h-[260px] z-10">
        {array.map((val, idx) => {
          const heightPercent = Math.max(15, Math.round((val / maxValue) * 85));
          const isSelected = activeIndices.includes(idx);

          return (
            <div key={idx} className="flex flex-col items-center justify-end h-full flex-1 max-w-[56px] group">
              {/* Top Value Tag */}
              <div
                className={`text-xs font-mono font-bold mb-2 px-1.5 py-0.5 rounded transition-all duration-300 ${
                  isSelected
                    ? 'bg-slate-900 border border-slate-700 text-amber-300 scale-110 shadow-md'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {val}
              </div>

              {/* Vertical Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg border transition-all duration-300 flex items-end justify-center pb-2 shadow-lg ${getBarColor(
                  idx
                )}`}
              >
                {isSelected && (
                  <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider opacity-90 animate-pulse">
                    {action === 'SWAP' ? 'SWAP' : action === 'COMPARE' ? 'CMP' : 'ACT'}
                  </span>
                )}
              </div>

              {/* Index Footer */}
              <div className="mt-2 text-[11px] font-mono font-semibold text-slate-500 group-hover:text-slate-400">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Indicator Footer */}
      <div className="mt-4 z-10 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span>Sorting Array Mode &bull; {array.length} Elements</span>
      </div>
    </Card>
  );
};
