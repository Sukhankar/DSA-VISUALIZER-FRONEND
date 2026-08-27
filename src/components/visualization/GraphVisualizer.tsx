import React, { useMemo } from 'react';
import { GraphEdgeDto, ActionType } from '../../types';

interface GraphVisualizerProps {
  nodes?: string[];
  edges?: GraphEdgeDto[];
  currentNode?: string;
  visitedNodes?: string[];
  frontier?: string[];
  action?: ActionType;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes = [],
  edges = [],
  currentNode,
  visitedNodes = [],
  frontier = [],
  action,
}) => {
  // SVG Canvas Configuration
  const width = 600;
  const height = 360;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 130;
  const nodeRadius = 22;

  // Calculate deterministic circular coordinates for nodes
  const nodePositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    const count = nodes.length;

    if (count === 0) return map;

    nodes.forEach((node, idx) => {
      const angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      map[node] = { x, y };
    });

    return map;
  }, [nodes, cx, cy, radius]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-slate-500 font-mono">
        No graph node data available.
      </div>
    );
  }

  const getNodeStyle = (node: string) => {
    const isCurrent = currentNode === node;
    const isVisited = visitedNodes.includes(node);
    const isFrontier = frontier.includes(node);
    const isComplete = action === 'COMPLETE';

    if (isComplete || (isVisited && isCurrent)) {
      return {
        fill: '#059669', // Emerald 600
        stroke: '#34d399', // Emerald 400
        textColor: '#ffffff',
        filter: 'drop-shadow(0px 0px 8px rgba(52, 211, 153, 0.5))',
      };
    }

    if (isCurrent) {
      return {
        fill: '#4f46e5', // Indigo 600
        stroke: '#818cf8', // Indigo 400
        textColor: '#ffffff',
        filter: 'drop-shadow(0px 0px 10px rgba(129, 140, 248, 0.7))',
      };
    }

    if (isFrontier) {
      return {
        fill: '#d97706', // Amber 600
        stroke: '#fbbf24', // Amber 400
        textColor: '#ffffff',
        filter: 'drop-shadow(0px 0px 6px rgba(251, 191, 36, 0.4))',
      };
    }

    if (isVisited) {
      return {
        fill: '#047857', // Emerald 700
        stroke: '#10b981', // Emerald 500
        textColor: '#e2e8f0',
        filter: 'none',
      };
    }

    return {
      fill: '#0f172a', // Slate 900
      stroke: '#334155', // Slate 700
      textColor: '#94a3b8',
      filter: 'none',
    };
  };

  return (
    <div className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Legend Header */}
      <div className="w-full flex items-center justify-center gap-4 text-[11px] text-slate-400 mb-2 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400" />
          <span>Current Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-600 border border-amber-400" />
          <span>Frontier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-400" />
          <span>Visited</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-h-[360px] overflow-visible"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="28"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, idx) => {
          const fromPos = nodePositions[edge.from];
          const toPos = nodePositions[edge.to];
          if (!fromPos || !toPos) return null;

          return (
            <line
              key={`edge-${idx}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="#334155"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className="transition-colors duration-300"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = nodePositions[node];
          if (!pos) return null;
          const style = getNodeStyle(node);

          return (
            <g key={`node-${node}`} className="cursor-pointer transition-all duration-300">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth="2.5"
                style={{ filter: style.filter }}
                className="transition-all duration-300"
              />
              <text
                x={pos.x}
                y={pos.y}
                dy="4"
                textAnchor="middle"
                fill={style.textColor}
                className="text-xs font-mono font-bold pointer-events-none"
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
