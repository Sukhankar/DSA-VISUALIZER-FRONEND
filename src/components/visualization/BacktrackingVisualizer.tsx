import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { Grid, Crown, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface BacktrackingVisualizerProps {
  currentStep?: VisualizationStep;
}

export const BacktrackingVisualizer: React.FC<BacktrackingVisualizerProps> = ({ currentStep }) => {
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  // N-Queens 4x4 Grid Board Layout
  const boardSize = 4;
  // Position queens according to active indices or default demonstration steps
  const queenRow0 = activeIndices.length > 0 ? activeIndices[0] : 1;
  const queenRow1 = activeIndices.length > 1 ? activeIndices[1] : 3;

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-md px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-amber-400" />
          <span className="text-slate-200 font-semibold">Backtracking State Space Search (N-Queens)</span>
        </div>

        <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/30 rounded font-bold">
          Board 4x4
        </span>
      </div>

      {/* 4x4 Chessboard Grid */}
      <div className="z-10 grid grid-cols-4 gap-1.5 p-2 bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl">
        {Array.from({ length: boardSize * boardSize }).map((_, idx) => {
          const r = Math.floor(idx / boardSize);
          const c = idx % boardSize;

          const isDarkSquare = (r + c) % 2 === 1;
          const hasQueen = (r === 0 && c === queenRow0) || (r === 1 && c === queenRow1);
          const isConflict = hasQueen && action === 'NO_SWAP';

          return (
            <div
              key={idx}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center font-mono font-bold transition-all duration-300 relative ${
                isConflict
                  ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-bounce'
                  : hasQueen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                  : isDarkSquare
                  ? 'bg-slate-950 border-slate-800/80 text-slate-600'
                  : 'bg-slate-900/80 border-slate-800 text-slate-500'
              }`}
            >
              {hasQueen ? (
                <Crown className={`w-7 h-7 ${isConflict ? 'text-rose-400' : 'text-amber-400'}`} />
              ) : (
                <span className="text-[10px] font-mono text-slate-700 opacity-60">
                  {r},{c}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Backtracking Feedback */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {action === 'NO_SWAP' || action === 'DELETE' ? (
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> CONFLICT: Backtracking & undoing placement.
          </span>
        ) : action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Valid non-attacking arrangement found!
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Exploring decision tree branch.
          </span>
        )}
      </div>
    </Card>
  );
};
