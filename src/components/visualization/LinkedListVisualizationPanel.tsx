import React from 'react';
import { VisualizationStep } from '../../types';
import { ArrowRight } from 'lucide-react';

interface LinkedListVisualizationPanelProps {
  step?: VisualizationStep;
}

export const LinkedListVisualizationPanel: React.FC<LinkedListVisualizationPanelProps> = ({ step }) => {
  const array = step?.array || [12, 99, 37, 45, 8];
  const highlighted = step?.indices || [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Linked List Pointer Visualizer
        </h3>
        <span className="text-xs text-indigo-400 font-mono font-semibold">HEAD ➜ NULL</span>
      </div>

      <div className="overflow-x-auto py-6 px-2 bg-slate-950/70 rounded-xl border border-slate-900 flex items-center justify-start gap-3 min-h-[140px]">
        {array.map((val, idx) => {
          const isCurrent = highlighted.includes(idx);
          return (
            <React.Fragment key={idx}>
              {/* Node Box */}
              <div
                className={`relative flex items-center border rounded-xl overflow-hidden transition-all duration-300 shadow-lg ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-500/10 text-amber-200 scale-105 shadow-amber-500/20'
                    : 'border-slate-800 bg-slate-900/80 text-slate-200'
                }`}
              >
                {/* Node Value */}
                <div className="px-4 py-3 font-bold text-sm font-mono border-r border-slate-800">
                  {val}
                </div>
                {/* Next Pointer Box */}
                <div className="px-3 py-3 text-[10px] font-mono text-slate-500 bg-slate-950/60">
                  next
                </div>

                {/* Head Pointer Label */}
                {idx === 0 && (
                  <div className="absolute -top-5 left-2 text-[10px] font-black text-emerald-400 tracking-wider">
                    HEAD
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -bottom-5 left-2 text-[10px] font-black text-amber-400 tracking-wider animate-pulse">
                    CURRENT
                  </div>
                )}
              </div>

              {/* Arrow Connector */}
              {idx < array.length - 1 ? (
                <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0" />
              ) : (
                <div className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-500">
                  NULL
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {step?.message && (
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <span className="text-emerald-400 font-bold">Execution Step: </span>
          {step.message}
        </div>
      )}

    </div>
  );
};
