import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

interface SlidingWindowVisualizerProps {
  currentStep?: VisualizationStep;
}

export const SlidingWindowVisualizer: React.FC<SlidingWindowVisualizerProps> = ({ currentStep }) => {
  const array = currentStep?.array || [2, 1, 5, 1, 3, 2];
  const activeIndices = currentStep?.indices || [];
  const message = currentStep?.message || 'Sliding window processing active range...';
  const action = currentStep?.action || 'INITIAL';

  const leftIndex = activeIndices.length > 0 ? activeIndices[0] : 0;
  const rightIndex = activeIndices.length > 1 ? activeIndices[activeIndices.length - 1] : leftIndex;

  const currentSubarray = array.slice(leftIndex, rightIndex + 1);
  const currentSum = currentSubarray.reduce((acc, curr) => acc + curr, 0);

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-6 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden space-y-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-3xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <span className="text-slate-200 font-semibold">Sliding Window Metaphor</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded font-bold">
            Window Range: [{leftIndex} ... {rightIndex}]
          </span>
          <span className="px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded font-bold">
            Window Sum: {currentSum}
          </span>
        </div>
      </div>

      {/* Stage: Array Cells with Translucent Window Overlay */}
      <div className="z-10 w-full max-w-4xl overflow-x-auto py-8 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center gap-3 min-w-max px-6 py-4">
          {array.map((val, idx) => {
            const inWindow = idx >= leftIndex && idx <= rightIndex;
            const isLeft = idx === leftIndex;
            const isRight = idx === rightIndex;

            let borderStyle = 'border-slate-800 bg-slate-900/80 text-slate-300';
            if (inWindow) {
              borderStyle = 'border-purple-500 bg-purple-950/80 text-purple-100 shadow-lg shadow-purple-950 ring-2 ring-purple-500/50';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-2 relative">
                {/* Pointer Label Above Window Borders */}
                <div className="h-6 flex items-center justify-center">
                  {isLeft && (
                    <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono font-bold rounded">
                      L
                    </span>
                  )}
                  {isRight && !isLeft && (
                    <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/50 text-[10px] font-mono font-bold rounded">
                      R
                    </span>
                  )}
                  {isLeft && isRight && (
                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/50 text-[10px] font-mono font-bold rounded">
                      L & R
                    </span>
                  )}
                </div>

                {/* Array Cell */}
                <div
                  className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-300 font-mono text-xl font-bold ${borderStyle}`}
                >
                  {val}
                </div>

                {/* Index Label */}
                <span className="text-[11px] font-mono text-slate-500">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Window Subarray Inspection Callout */}
        <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
          <span>Active Window Subarray:</span>
          <span className="font-bold text-cyan-300">[{currentSubarray.join(', ')}]</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span>Sum = </span>
          <span className="font-bold text-purple-300">{currentSum}</span>
        </div>
      </div>

      {/* Synchronized Message Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 w-full max-w-2xl text-center shadow-lg">
        {action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Sliding window processing completed successfully!
          </span>
        ) : (
          message
        )}
      </div>
    </Card>
  );
};
