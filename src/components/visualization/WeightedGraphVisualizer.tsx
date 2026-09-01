import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { Share2, CheckCircle2, Zap } from 'lucide-react';

interface WeightedGraphVisualizerProps {
  currentStep?: VisualizationStep;
}

export const WeightedGraphVisualizer: React.FC<WeightedGraphVisualizerProps> = ({ currentStep }) => {
  const distTable = currentStep?.array || [0, 4, 2, 999, 999];
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  // Fixed graph nodes with 2D layout & edge weights
  const graphNodes = [
    { id: 0, label: 'A', x: 100, y: 70 },
    { id: 1, label: 'B', x: 260, y: 40 },
    { id: 2, label: 'C', x: 260, y: 150 },
    { id: 3, label: 'D', x: 420, y: 40 },
    { id: 4, label: 'E', x: 420, y: 150 },
  ];

  const graphEdges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 4, weight: 3 },
    { from: 3, to: 4, weight: 1 },
  ];

  const activeNodeId = activeIndices.length > 0 ? activeIndices[0] : -1;

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-2xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-200 font-semibold">Weighted Graph & Shortest Path Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded font-bold">
            Selected: {activeNodeId !== -1 && activeNodeId < graphNodes.length ? graphNodes[activeNodeId].label : 'Source A'}
          </span>
        </div>
      </div>

      {/* Main Diagram & Distance Table Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-2xl z-10 items-center">
        {/* Graph Canvas (7 cols) */}
        <div className="md:col-span-7 h-[210px] relative flex items-center justify-center">
          <svg viewBox="0 0 520 200" className="w-full h-full overflow-visible">
            {/* Edges with Weight Badges */}
            {graphEdges.map((edge, idx) => {
              const u = graphNodes[edge.from];
              const v = graphNodes[edge.to];
              const midX = (u.x + v.x) / 2;
              const midY = (u.y + v.y) / 2;
              const isRelaxing = (edge.from === activeNodeId || edge.to === activeNodeId) && action === 'UPDATE';

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={isRelaxing ? '#f59e0b' : '#334155'}
                    strokeWidth={isRelaxing ? '3.5' : '2'}
                  />
                  {/* Weight Pill */}
                  <rect
                    x={midX - 10}
                    y={midY - 9}
                    width="20"
                    height="16"
                    rx="4"
                    fill="#0f172a"
                    stroke={isRelaxing ? '#f59e0b' : '#475569'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill={isRelaxing ? '#fbbf24' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {graphNodes.map((node) => {
              const isActive = node.id === activeNodeId;
              const distVal = node.id < distTable.length ? distTable[node.id] : 999;
              const isInf = distVal >= 999;

              return (
                <g key={`graph-node-${node.id}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={isActive ? '#0369a1' : '#0f172a'}
                    stroke={isActive ? '#38bdf8' : '#334155'}
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={isActive ? '#ffffff' : '#f8fafc'}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>

                  {/* Distance Badge Below Node */}
                  <rect
                    x={node.x - 18}
                    y={node.y + 24}
                    width="36"
                    height="16"
                    rx="4"
                    fill="#090d16"
                    stroke={isActive ? '#38bdf8' : '#1e293b'}
                    strokeWidth="1"
                  />
                  <text
                    x={node.x}
                    y={node.y + 36}
                    textAnchor="middle"
                    fill={isActive ? '#38bdf8' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    d={isInf ? '∞' : distVal}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Shortest Distance Table (5 cols) */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1 border-b border-slate-800 pb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Shortest Distance Table</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {graphNodes.map((node) => {
              const d = node.id < distTable.length ? distTable[node.id] : 999;
              const isActive = node.id === activeNodeId;

              return (
                <div
                  key={`dist-${node.id}`}
                  className={`flex items-center justify-between px-2.5 py-1 rounded border transition-colors ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <span>Vertex {node.label}</span>
                  <span>d = {d >= 999 ? '∞' : d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Execution Feedback */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {action === 'UPDATE' ? (
          <span className="text-amber-400 font-bold">Edge Relaxation Step: d[v] updated using formula d[u] + w.</span>
        ) : action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Shortest paths computed to all reachable vertices.
          </span>
        ) : (
          <span>Dijkstra Invariants: Minimum distance vertex extracted iteratively from unvisited set.</span>
        )}
      </div>
    </Card>
  );
};
