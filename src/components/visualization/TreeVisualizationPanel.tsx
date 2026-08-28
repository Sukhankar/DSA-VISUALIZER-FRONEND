import React from 'react';
import { VisualizationStep } from '../../types';

interface TreeNode {
  id: number;
  val: number;
  x: number;
  y: number;
  left?: TreeNode;
  right?: TreeNode;
}

interface TreeVisualizationPanelProps {
  step?: VisualizationStep;
}

export const TreeVisualizationPanel: React.FC<TreeVisualizationPanelProps> = ({ step }) => {
  const array = step?.array || [10, 5, 15, 3, 7, 12, 18];
  const highlighted = step?.indices || [];
  const action = step?.action;

  // Generate binary tree nodes from array representation
  const buildTree = (): { nodes: { id: number; val: number; x: number; y: number }[]; edges: { x1: number; y1: number; x2: number; y2: number }[] } => {
    const nodes: { id: number; val: number; x: number; y: number }[] = [];
    const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];

    if (array.length === 0) return { nodes, edges };

    const positions = [
      { x: 250, y: 40 },  // Root (0)
      { x: 140, y: 110 }, // Left (1)
      { x: 360, y: 110 }, // Right (2)
      { x: 80,  y: 180 }, // 3
      { x: 200, y: 180 }, // 4
      { x: 300, y: 180 }, // 5
      { x: 420, y: 180 }, // 6
    ];

    array.forEach((val, idx) => {
      if (idx >= positions.length) return;
      const pos = positions[idx];
      nodes.push({ id: idx, val, x: pos.x, y: pos.y });

      // Edge to parent
      if (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2);
        if (parentIdx < positions.length) {
          const parentPos = positions[parentIdx];
          edges.push({
            x1: parentPos.x,
            y1: parentPos.y,
            x2: pos.x,
            y2: pos.y,
          });
        }
      }
    });

    return { nodes, edges };
  };

  const { nodes, edges } = buildTree();

  const getNodeColor = (nodeIdx: number) => {
    if (highlighted.includes(nodeIdx)) {
      if (action === 'SWAP') return 'fill-rose-500 stroke-rose-300 shadow-rose-500';
      if (action === 'COMPARE') return 'fill-amber-500 stroke-amber-300 shadow-amber-500';
      return 'fill-indigo-500 stroke-indigo-300';
    }
    return 'fill-slate-800 stroke-slate-600';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Binary Tree / Hierarchy Visualizer
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Active Node
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Inactive
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto flex justify-center py-4 bg-slate-950/70 rounded-xl border border-slate-900">
        <svg viewBox="0 0 500 240" className="w-full max-w-[550px] h-auto">
          {/* Edges */}
          {edges.map((edge, idx) => (
            <line
              key={idx}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="rgba(148, 163, 184, 0.25)"
              strokeWidth="2"
            />
          ))}

          {/* Nodes */}
          {nodes.map((node) => {
            const isHighlighted = highlighted.includes(node.id);
            return (
              <g key={node.id} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="22"
                  className={`${getNodeColor(node.id)} stroke-2 transition-colors duration-300`}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className="fill-white font-bold text-xs font-mono"
                >
                  {node.val}
                </text>
                {isHighlighted && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="26"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin-slow"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {step?.message && (
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <span className="text-amber-400 font-bold">Step Detail: </span>
          {step.message}
        </div>
      )}

    </div>
  );
};
