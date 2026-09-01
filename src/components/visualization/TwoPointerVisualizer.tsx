import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { ArrowDownLeft, ArrowDownRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface TwoPointerVisualizerProps {
  currentStep?: VisualizationStep;
}

export const TwoPointerVisualizer: React.FC<TwoPointerVisualizerProps> = ({ currentStep }) => {
  const array = currentStep?.array || [1, 3, 5, 8, 11, 15];
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  const leftPtr = activeIndices.length >= 1 ? activeIndices[0] : -1;
  const rightPtr = activeIndices.length >= 2 ? activeIndices[1] : -1;

  const isMatched = action === 'SELECT' || action === 'FOUND' || action === 'COMPLETE';

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-200 font-semibold">Two-Pointer Dual Scanning</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 rounded font-bold">
            Left Ptr: {leftPtr !== -1 ? `[${leftPtr}]` : 'N/A'}
          </span>
          <span className="px-2.5 py-1 bg-purple-950/80 text-purple-300 border border-purple-500/30 rounded font-bold">
            Right Ptr: {rightPtr !== -1 ? `[${rightPtr}]` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Array Elements with Animated Pointers */}
      <div className="w-full flex items-center justify-center gap-3 sm:gap-4 flex-wrap z-10 py-6">
        {array.map((val, idx) => {
          const isLeft = idx === leftPtr;
          const isRight = idx === rightPtr;
          const isSelected = isLeft || isRight;

          return (
            <div key={idx} className="flex flex-col items-center relative group">
              {/* Animated Top Pointers */}
              <div className="h-10 flex items-end justify-center mb-2 gap-1">
                {isLeft && (
                  <span className="px-2.5 py-1 bg-cyan-500 text-slate-950 font-mono text-[10px] font-extrabold rounded-lg flex items-center gap-1 shadow-md shadow-cyan-500/20 animate-bounce">
                    <ArrowDownRight className="w-3 h-3" /> LEFT
                  </span>
                )}
                {isRight && (
                  <span className="px-2.5 py-1 bg-purple-500 text-white font-mono text-[10px] font-extrabold rounded-lg flex items-center gap-1 shadow-md shadow-purple-500/20 animate-bounce">
                    <ArrowDownLeft className="w-3 h-3" /> RIGHT
                  </span>
                )}
              </div>

              {/* Element Card */}
              <div
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 flex items-center justify-center text-lg sm:text-xl font-mono font-bold transition-all duration-300 shadow-xl ${
                  isMatched && isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-500/30 scale-110 ring-4 ring-emerald-500/20'
                    : isLeft
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-500/20 scale-105 ring-2 ring-cyan-400/30'
                    : isRight
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-purple-500/20 scale-105 ring-2 ring-purple-400/30'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200 group-hover:border-slate-700'
                }`}
              >
                {val}
              </div>

              {/* Index Footer */}
              <div className="mt-2 text-xs font-mono font-semibold text-slate-500 group-hover:text-slate-400">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Traversal State Feedback */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {isMatched ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Target pair condition satisfied!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>Evaluating pair:</span>
            <span className="font-bold text-cyan-300">{leftPtr !== -1 ? array[leftPtr] : '?'}</span>
            <span className="text-slate-500">+</span>
            <span className="font-bold text-purple-300">{rightPtr !== -1 ? array[rightPtr] : '?'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-amber-300 font-bold">
              Sum: {leftPtr !== -1 && rightPtr !== -1 && leftPtr < array.length && rightPtr < array.length ? array[leftPtr] + array[rightPtr] : '?'}
            </span>
          </span>
        )}
      </div>
    </Card>
  );
};
