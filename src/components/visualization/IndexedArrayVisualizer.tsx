import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { ArrowDown, Search, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface IndexedArrayVisualizerProps {
  currentStep?: VisualizationStep;
}

export const IndexedArrayVisualizer: React.FC<IndexedArrayVisualizerProps> = ({ currentStep }) => {
  const array = currentStep?.array || [1, 3, 5, 7, 9, 11, 13, 15];
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  // Infer Pointers from indices (Binary Search conventions: indices[0]=low, indices[1]=mid, indices[2]=high)
  let lowIndex = -1;
  let midIndex = -1;
  let highIndex = -1;

  if (activeIndices.length === 3) {
    lowIndex = activeIndices[0];
    midIndex = activeIndices[1];
    highIndex = activeIndices[2];
  } else if (activeIndices.length === 2) {
    lowIndex = activeIndices[0];
    highIndex = activeIndices[1];
  } else if (activeIndices.length === 1) {
    midIndex = activeIndices[0];
  }

  // Determine if index is in active search range
  const isDiscarded = (idx: number) => {
    if (lowIndex !== -1 && highIndex !== -1) {
      return idx < lowIndex || idx > highIndex;
    }
    return false;
  };

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden space-y-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Active Bounds & Status Callout */}
      <div className="z-10 flex flex-wrap items-center justify-between w-full max-w-2xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-semibold">Indexed Search Space</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          {lowIndex !== -1 && (
            <span className="bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
              Low: {lowIndex}
            </span>
          )}
          {midIndex !== -1 && (
            <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
              Mid: {midIndex}
            </span>
          )}
          {highIndex !== -1 && (
            <span className="bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              High: {highIndex}
            </span>
          )}
        </div>
      </div>

      {/* Indexed Array Box Cards */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 flex-wrap z-10 py-6">
        {array.map((val, idx) => {
          const isMid = idx === midIndex;
          const isLow = idx === lowIndex;
          const isHigh = idx === highIndex;
          const isFound = action === 'FOUND' && (isMid || activeIndices.includes(idx));
          const discarded = isDiscarded(idx);

          return (
            <div key={idx} className="flex flex-col items-center group relative">
              {/* Top Pointer Badge Callouts */}
              <div className="h-10 flex items-end justify-center mb-2 gap-1">
                {isFound && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-mono text-[10px] font-extrabold rounded-full flex items-center gap-1 animate-bounce shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> MATCH
                  </span>
                )}
                {!isFound && isMid && (
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold rounded-md flex items-center gap-1 shadow-md animate-pulse">
                    <ArrowDown className="w-3 h-3" /> MID
                  </span>
                )}
                {!isFound && !isMid && isLow && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold rounded-md shadow">
                    LOW
                  </span>
                )}
                {!isFound && !isMid && isHigh && (
                  <span className="px-2 py-0.5 bg-purple-600 text-white font-mono text-[10px] font-bold rounded-md shadow">
                    HIGH
                  </span>
                )}
              </div>

              {/* Indexed Box Card */}
              <div
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 flex items-center justify-center text-lg sm:text-xl font-mono font-bold transition-all duration-300 shadow-lg ${
                  isFound
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-500/30 scale-110'
                    : isMid
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/20 scale-105 ring-2 ring-amber-400/30'
                    : discarded
                    ? 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-40 grayscale'
                    : isLow || isHigh
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900/90 border-slate-800 text-slate-100 group-hover:border-slate-700'
                }`}
              >
                {val}
              </div>

              {/* Index Number */}
              <div className="mt-2 text-xs font-mono font-semibold text-slate-500 group-hover:text-slate-400">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Explanation */}
      <div className="z-10 text-xs font-mono text-slate-400 flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800">
        {action === 'FOUND' ? (
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Target located at highlighted index.
          </span>
        ) : action === 'NOT_FOUND' ? (
          <span className="text-rose-400 font-semibold flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Search space exhausted: target is not present.
          </span>
        ) : (
          <span className="text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Active range: index [{lowIndex !== -1 ? lowIndex : 0} .. {highIndex !== -1 ? highIndex : array.length ? array.length - 1 : 0}]
          </span>
        )}
      </div>
    </Card>
  );
};
