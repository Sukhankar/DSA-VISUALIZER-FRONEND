import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { Layers, ArrowDown, CheckCircle2 } from 'lucide-react';

interface RecursionTreeVisualizerProps {
  currentStep?: VisualizationStep;
}

export const RecursionTreeVisualizer: React.FC<RecursionTreeVisualizerProps> = ({ currentStep }) => {
  const callStack = currentStep?.callStack || [
    { functionName: 'fib', args: 'n=5', depth: 1, status: 'CALL' },
    { functionName: 'fib', args: 'n=4', depth: 2, status: 'CALL' },
    { functionName: 'fib', args: 'n=3', depth: 3, status: 'EXECUTE' },
    { functionName: 'fib', args: 'n=2', depth: 4, status: 'RETURN', returnValue: '1' },
  ];

  const message = currentStep?.message || 'Recursion call stack execution...';
  const action = currentStep?.action || 'INITIAL';

  const MAX_VISIBLE_DEPTH = 5;
  const visibleFrames = callStack.slice(0, MAX_VISIBLE_DEPTH);
  const truncatedCount = Math.max(0, callStack.length - MAX_VISIBLE_DEPTH);

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-6 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden space-y-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-3xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-200 font-semibold">Recursion Call Tree & Stack Frame Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded font-bold">
            Stack Depth: {callStack.length}
          </span>
        </div>
      </div>

      {/* Call Stack Stage */}
      <div className="z-10 w-full max-w-xl py-2 flex flex-col items-center space-y-3">
        {visibleFrames.map((frame, idx) => {
          const isTop = idx === visibleFrames.length - 1;
          let statusBadge = 'bg-slate-800 text-slate-300 border-slate-700';
          if (frame.status === 'CALL') {
            statusBadge = 'bg-cyan-950 text-cyan-300 border-cyan-500/50';
          } else if (frame.status === 'EXECUTE') {
            statusBadge = 'bg-purple-950 text-purple-300 border-purple-500/50';
          } else if (frame.status === 'RETURN') {
            statusBadge = 'bg-emerald-950 text-emerald-300 border-emerald-500/50';
          }

          return (
            <React.Fragment key={idx}>
              {idx > 0 && <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />}
              <div
                className={`w-full p-3 rounded-xl border flex items-center justify-between font-mono text-xs shadow-md transition-all duration-300 ${
                  isTop
                    ? 'bg-purple-950/70 border-purple-500 shadow-purple-950 ring-2 ring-purple-500/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded text-[10px] font-bold">
                    Depth {frame.depth || idx + 1}
                  </span>
                  <span className="font-bold text-slate-100">
                    {frame.functionName}({frame.args})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {frame.returnValue && (
                    <span className="text-emerald-400 font-extrabold">⇒ {frame.returnValue}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}`}>
                    {frame.status || 'CALL'}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {truncatedCount > 0 && (
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-500 font-mono text-[11px] rounded-full">
            + {truncatedCount} deeper stack frames hidden for viewport clarity
          </div>
        )}
      </div>

      {/* Synchronized Message Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 w-full max-w-2xl text-center shadow-lg">
        {action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Recursive evaluation completed and base condition satisfied!
          </span>
        ) : (
          message
        )}
      </div>
    </Card>
  );
};
