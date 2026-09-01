import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { Table, CheckCircle2, ArrowLeft, ArrowUp, ArrowUpLeft } from 'lucide-react';

interface DPTableVisualizerProps {
  currentStep?: VisualizationStep;
}

export const DPTableVisualizer: React.FC<DPTableVisualizerProps> = ({ currentStep }) => {
  const dpArray = currentStep?.array || [0, 1, 1, 2, 3, 5, 8, 13];
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-purple-400" />
          <span className="text-slate-200 font-semibold">Dynamic Programming Table Metaphor</span>
        </div>

        <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded font-bold">
          DP Memo Size: {dpArray.length}
        </span>
      </div>

      {/* DP Table / Memoization Matrix View */}
      <div className="w-full flex items-center justify-center gap-2 flex-wrap z-10 py-4 max-w-2xl">
        {dpArray.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isLatest = idx === dpArray.length - 1;

          return (
            <div key={idx} className="flex flex-col items-center group">
              {/* Dependency Indicator Arrow */}
              <div className="h-6 flex items-center justify-center mb-1">
                {isActive && (
                  <span className="text-[10px] font-mono font-bold text-amber-400 animate-pulse flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" /> DEP
                  </span>
                )}
                {isLatest && !isActive && (
                  <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-0.5">
                    <ArrowUpLeft className="w-3 h-3" /> SOL
                  </span>
                )}
              </div>

              {/* Memoized Table Cell Card */}
              <div
                className={`w-14 h-16 sm:w-16 sm:h-18 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all duration-300 shadow-xl ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 ring-2 ring-amber-400/30 shadow-amber-500/20'
                    : isLatest
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 scale-105 shadow-purple-500/20'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200 group-hover:border-slate-700'
                }`}
              >
                <span className="text-base sm:text-lg">{val}</span>
              </div>

              {/* Index Subscript */}
              <div className="mt-1.5 text-[11px] font-mono font-semibold text-slate-500">
                DP[{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Recurrence Relation Formula Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 max-w-xl text-center">
        {action === 'COMPARE' ? (
          <span className="text-amber-300 font-bold">
            Recurrence Evaluation: Combining subproblem solutions DP[i-1] and DP[i-2].
          </span>
        ) : action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Optimal DP solution computed in O(N) time and memory.
          </span>
        ) : (
          <span>
            DP State Transition: Overlapping subproblems memoized to bypass exponential recomputation.
          </span>
        )}
      </div>
    </Card>
  );
};
