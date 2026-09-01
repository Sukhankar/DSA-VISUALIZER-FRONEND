import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { Layers, ArrowDownUp, CheckCircle2 } from 'lucide-react';

interface HeapVisualizerProps {
  currentStep?: VisualizationStep;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ currentStep }) => {
  const array = currentStep?.array || [90, 50, 70, 20, 40, 60, 30];
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  // Build binary heap tree node positions
  const width = 600;
  const levelHeight = 55;
  const nodePositions = [
    { id: 0, x: width / 2, y: 40 },
    { id: 1, x: width / 2 - 130, y: 40 + levelHeight },
    { id: 2, x: width / 2 + 130, y: 40 + levelHeight },
    { id: 3, x: width / 2 - 190, y: 40 + levelHeight * 2 },
    { id: 4, x: width / 2 - 70, y: 40 + levelHeight * 2 },
    { id: 5, x: width / 2 + 70, y: 40 + levelHeight * 2 },
    { id: 6, x: width / 2 + 190, y: 40 + levelHeight * 2 },
  ];

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Dual Synchronized Header */}
      <div className="z-10 flex items-center justify-between w-full max-w-2xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span className="text-slate-200 font-semibold">Dual Synchronized Heap Representation (Tree + Array)</span>
        </div>

        <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded font-bold">
          Heap Size: {array.length}
        </span>
      </div>

      {/* Representation 1: Binary Heap Tree View */}
      <div className="w-full max-w-[620px] h-[190px] relative z-10">
        <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
          {/* Branch Edges */}
          {array.map((_, idx) => {
            const leftChildIdx = 2 * idx + 1;
            const rightChildIdx = 2 * idx + 2;

            return (
              <g key={`heap-edges-${idx}`}>
                {leftChildIdx < array.length && leftChildIdx < nodePositions.length && (
                  <line
                    x1={nodePositions[idx].x}
                    y1={nodePositions[idx].y}
                    x2={nodePositions[leftChildIdx].x}
                    y2={nodePositions[leftChildIdx].y}
                    stroke="#334155"
                    strokeWidth="2.5"
                  />
                )}
                {rightChildIdx < array.length && rightChildIdx < nodePositions.length && (
                  <line
                    x1={nodePositions[idx].x}
                    y1={nodePositions[idx].y}
                    x2={nodePositions[rightChildIdx].x}
                    y2={nodePositions[rightChildIdx].y}
                    stroke="#334155"
                    strokeWidth="2.5"
                  />
                )}
              </g>
            );
          })}

          {/* Tree Nodes */}
          {array.map((val, idx) => {
            if (idx >= nodePositions.length) return null;
            const pos = nodePositions[idx];
            const isActive = activeIndices.includes(idx);
            const isSwap = action === 'SWAP' && isActive;

            return (
              <g key={`heap-node-${idx}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={isSwap ? '#9f1239' : isActive ? '#78350f' : '#0f172a'}
                  stroke={isSwap ? '#f43f5e' : isActive ? '#f59e0b' : '#334155'}
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={isActive ? '#fef3c7' : '#f8fafc'}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Representation 2: Synchronized Array View */}
      <div className="w-full flex flex-col items-center gap-2 z-10">
        <div className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
          <ArrowDownUp className="w-3.5 h-3.5 text-purple-400" />
          <span>Synchronized Contiguous Array Buffer</span>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {array.map((val, idx) => {
            const isActive = activeIndices.includes(idx);
            const isSwap = action === 'SWAP' && isActive;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                    isSwap
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 scale-105 shadow-rose-500/20'
                      : isActive
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {val}
                </div>
                <div className="mt-1 text-[10px] font-mono text-slate-500">
                  [{idx}]
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {action === 'SWAP' ? (
          <span className="text-rose-400 font-bold">Percolate Swap: Exchanging parent/child elements on Tree & Array simultaneously.</span>
        ) : action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Heap property restored completely.
          </span>
        ) : (
          <span>Heap Invariant: Parent node at index i satisfies heap property relative to children at 2i+1 and 2i+2.</span>
        )}
      </div>
    </Card>
  );
};
