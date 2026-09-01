import React, { useMemo } from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { GitBranch, CheckCircle2, Activity } from 'lucide-react';

interface TreeVisualizerProps {
  currentStep?: VisualizationStep;
}

interface TreeNodeData {
  id: number;
  val: number;
  x: number;
  y: number;
  level: number;
  leftId?: number;
  rightId?: number;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ currentStep }) => {
  const rawArray = currentStep?.array;
  const array = useMemo(() => {
    if (rawArray && rawArray.length > 0) return rawArray;
    return [15, 10, 20, 8, 12, 17, 25];
  }, [rawArray]);

  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';
  const currentNode = currentStep?.currentNode;
  const visitedNodes = currentStep?.visitedNodes || [];

  // Dynamic Tree Layout Engine: Handles arbitrary N nodes without clipping
  const { nodes: treeNodes, width, height } = useMemo(() => {
    if (!array || array.length === 0) {
      return { nodes: [], width: 600, height: 260 };
    }

    const n = array.length;
    const maxDepth = Math.floor(Math.log2(n)) + 1;
    const levelHeight = 70;
    const maxLeaves = Math.pow(2, maxDepth - 1);

    const calcWidth = Math.max(640, maxLeaves * 55);
    const calcHeight = Math.max(280, (maxDepth + 1) * 70);

    const calculatedNodes: TreeNodeData[] = [];

    for (let i = 0; i < n; i++) {
      const val = array[i];
      if (val == null) continue;

      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);

      const stepX = calcWidth / (nodesInLevel + 1);
      const x = stepX * (posInLevel + 1);
      const y = 50 + level * levelHeight;

      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;

      calculatedNodes.push({
        id: i,
        val,
        x,
        y,
        level,
        leftId: leftIdx < n && array[leftIdx] != null ? leftIdx : undefined,
        rightId: rightIdx < n && array[rightIdx] != null ? rightIdx : undefined,
      });
    }

    return { nodes: calculatedNodes, width: calcWidth, height: calcHeight };
  }, [array]);

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-5 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden space-y-4">
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-2xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-200 font-semibold">Dynamic Tree Diagram & Hierarchy Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded font-bold flex items-center gap-1">
            <Activity className="w-3 h-3 text-indigo-400" />
            <span>Nodes: {treeNodes.length}</span>
          </span>
        </div>
      </div>

      {/* Interactive & Animated SVG Tree Canvas */}
      <div className="w-full max-w-full overflow-x-auto relative z-10 flex items-center justify-center py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[750px] max-h-[380px] overflow-visible transition-all duration-500"
        >
          {/* Dynamic Branches / Parent-Child Links */}
          {treeNodes.map((node) => {
            const leftChild = treeNodes.find((n) => n.id === node.leftId);
            const rightChild = treeNodes.find((n) => n.id === node.rightId);

            const isCurrentNode =
              activeIndices.includes(node.id) ||
              currentNode === String(node.val) ||
              currentNode === String(node.id);

            return (
              <g key={`edges-${node.id}`}>
                {leftChild && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={leftChild.x}
                    y2={leftChild.y}
                    stroke={
                      isCurrentNode || activeIndices.includes(leftChild.id)
                        ? '#10b981'
                        : '#334155'
                    }
                    strokeWidth={
                      isCurrentNode || activeIndices.includes(leftChild.id)
                        ? '3.5'
                        : '2'
                    }
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                )}
                {rightChild && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={rightChild.x}
                    y2={rightChild.y}
                    stroke={
                      isCurrentNode || activeIndices.includes(rightChild.id)
                        ? '#10b981'
                        : '#334155'
                    }
                    strokeWidth={
                      isCurrentNode || activeIndices.includes(rightChild.id)
                        ? '3.5'
                        : '2'
                    }
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                )}
              </g>
            );
          })}

          {/* Animated Tree Nodes */}
          {treeNodes.map((node) => {
            const isActive =
              activeIndices.includes(node.id) ||
              activeIndices.includes(node.val) ||
              currentNode === String(node.val) ||
              currentNode === String(node.id);

            const isVisited =
              visitedNodes.includes(String(node.val)) ||
              visitedNodes.includes(String(node.id));

            const isRoot = node.id === 0;

            let fillColor = '#0f172a'; // slate-900
            let strokeColor = '#334155'; // slate-700
            let textColor = '#f8fafc';

            if (isActive) {
              if (action === 'COMPARE' || action === 'SELECT') {
                fillColor = '#78350f'; // amber-900
                strokeColor = '#f59e0b'; // amber-500
                textColor = '#fef3c7';
              } else if (action === 'INSERT' || action === 'FOUND') {
                fillColor = '#064e3b'; // emerald-900
                strokeColor = '#10b981'; // emerald-500
                textColor = '#d1fae5';
              } else {
                fillColor = '#4338ca'; // indigo-700
                strokeColor = '#6366f1';
                textColor = '#ffffff';
              }
            } else if (isVisited) {
              fillColor = '#064e3b';
              strokeColor = '#10b981';
            }

            return (
              <g
                key={`tree-node-${node.id}`}
                className="transition-all duration-500 ease-out cursor-pointer transform hover:scale-110"
              >
                {/* Outer Animated Glow Halo on Active Step */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="26"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Node Main Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className="transition-all duration-500 shadow-xl"
                  style={{
                    filter: isActive
                      ? `drop-shadow(0px 0px 10px ${strokeColor})`
                      : 'none',
                  }}
                />

                {/* Node Value Label */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="select-none pointer-events-none"
                >
                  {node.val}
                </text>

                {/* Root Badge */}
                {isRoot && (
                  <text
                    x={node.x}
                    y={node.y - 25}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="10"
                    fontWeight="extrabold"
                    fontFamily="monospace"
                  >
                    ROOT
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal Step & Action Feedback Banner */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Tree traversal & dynamic construction complete.
          </span>
        ) : (
          <span>
            {currentStep?.message || 'Binary Tree traversal in progress.'}
          </span>
        )}
      </div>
    </Card>
  );
};
