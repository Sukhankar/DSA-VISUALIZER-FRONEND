import React, { useMemo } from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { GitBranch, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AVLTreeVisualizerProps {
  currentStep?: VisualizationStep;
}

interface AvlTreeNode {
  id: number;
  val: number;
  height: number;
  balanceFactor: number;
  x: number;
  y: number;
  leftId?: number;
  rightId?: number;
}

export const AVLTreeVisualizer: React.FC<AVLTreeVisualizerProps> = ({ currentStep }) => {
  const rawArray = currentStep?.array;
  const array = useMemo(() => {
    if (rawArray && rawArray.length > 0) return rawArray;
    return [35, 26, 55, 5, 28, 46, 99];
  }, [rawArray]);

  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';
  const stepMsg = currentStep?.message || '';

  // Dynamic AVL Tree layout generator for N nodes
  const { nodes: treeNodes, width, height } = useMemo(() => {
    if (!array || array.length === 0) return { nodes: [], width: 640, height: 270 };

    const n = array.length;
    const maxDepth = Math.floor(Math.log2(n)) + 1;
    const levelHeight = 75;
    const maxLeaves = Math.pow(2, maxDepth - 1);

    const calcWidth = Math.max(640, maxLeaves * 55);
    const calcHeight = Math.max(280, (maxDepth + 1) * 75);

    // Helper to calculate height & BF
    const getNodeHeight = (idx: number): number => {
      if (idx >= array.length || array[idx] == null) return 0;
      const leftH = getNodeHeight(2 * idx + 1);
      const rightH = getNodeHeight(2 * idx + 2);
      return 1 + Math.max(leftH, rightH);
    };

    const getBF = (idx: number): number => {
      if (idx >= array.length || array[idx] == null) return 0;
      const leftH = getNodeHeight(2 * idx + 1);
      const rightH = getNodeHeight(2 * idx + 2);
      return leftH - rightH;
    };

    const calculatedNodes: AvlTreeNode[] = [];

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
        height: getNodeHeight(i),
        balanceFactor: getBF(i),
        x,
        y,
        leftId: leftIdx < n && array[leftIdx] != null ? leftIdx : undefined,
        rightId: rightIdx < n && array[rightIdx] != null ? rightIdx : undefined,
      });
    }

    return { nodes: calculatedNodes, width: calcWidth, height: calcHeight };
  }, [array]);

  const isRotationStep = stepMsg.toLowerCase().includes('rotation') || action === 'SWAP';
  const isImbalanced = stepMsg.toLowerCase().includes('imbalance') || action === 'NO_SWAP';

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden space-y-4">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-2xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <span className="text-slate-200 font-semibold">Self-Balancing AVL Tree Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded font-bold">
            Nodes: {treeNodes.length}
          </span>
          <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> |BF| ≤ 1
          </span>
        </div>
      </div>

      {/* Rotation Banner Callout */}
      {isRotationStep && (
        <div className="z-10 w-full max-w-xl bg-gradient-to-r from-amber-950/90 via-orange-950/90 to-amber-950/90 border border-amber-500/50 p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-amber-200 animate-pulse shadow-lg">
          <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="font-extrabold uppercase tracking-wide">
            {stepMsg.includes('LL') ? 'LL (Right) Rotation' : stepMsg.includes('RR') ? 'RR (Left) Rotation' : stepMsg.includes('LR') ? 'LR Double Rotation' : stepMsg.includes('RL') ? 'RL Double Rotation' : 'AVL Tree Rotation Triggered'}
          </span>
        </div>
      )}

      {/* SVG Interactive & Animated AVL Tree Diagram */}
      <div className="w-full max-w-full overflow-x-auto relative z-10 flex items-center justify-center py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[750px] max-h-[380px] overflow-visible transition-all duration-500"
        >
          {/* Edges */}
          {treeNodes.map((node) => {
            const leftChild = treeNodes.find((n) => n.id === node.leftId);
            const rightChild = treeNodes.find((n) => n.id === node.rightId);

            const isCurrentNode = activeIndices.includes(node.id);

            return (
              <g key={`edges-${node.id}`}>
                {leftChild && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={leftChild.x}
                    y2={leftChild.y}
                    stroke={isCurrentNode || activeIndices.includes(leftChild.id) ? '#a855f7' : '#334155'}
                    strokeWidth={isCurrentNode || activeIndices.includes(leftChild.id) ? '3.5' : '2'}
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
                    stroke={isCurrentNode || activeIndices.includes(rightChild.id) ? '#a855f7' : '#334155'}
                    strokeWidth={isCurrentNode || activeIndices.includes(rightChild.id) ? '3.5' : '2'}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {treeNodes.map((node) => {
            const isActive = activeIndices.includes(node.id) || activeIndices.includes(node.val);
            const isRoot = node.id === 0;
            const isImbalancedNode = Math.abs(node.balanceFactor) > 1;

            let fillColor = '#0f172a';
            let strokeColor = '#334155';
            let textColor = '#f8fafc';

            if (isImbalancedNode || (isImbalanced && isActive)) {
              fillColor = '#881337'; // rose-900
              strokeColor = '#f43f5e'; // rose-500
              textColor = '#ffe4e6';
            } else if (isRotationStep && isActive) {
              fillColor = '#78350f'; // amber-900
              strokeColor = '#f59e0b'; // amber-500
              textColor = '#fef3c7';
            } else if (isActive) {
              fillColor = '#3b0764'; // purple-950
              strokeColor = '#a855f7'; // purple-500
              textColor = '#f3e8ff';
            }

            return (
              <g
                key={`avl-node-${node.id}`}
                className="transition-all duration-500 ease-out cursor-pointer transform hover:scale-110"
              >
                {/* Imbalance Ping Halo */}
                {(isImbalancedNode || isActive) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    fill="none"
                    stroke={isImbalancedNode ? '#f43f5e' : strokeColor}
                    strokeWidth="2.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="22"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className="transition-all duration-500 shadow-2xl"
                  style={{
                    filter: isActive ? `drop-shadow(0px 0px 10px ${strokeColor})` : 'none',
                  }}
                />

                {/* Value Label */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="select-none pointer-events-none"
                >
                  {node.val}
                </text>

                {/* Balance Factor & Height Badges */}
                <rect
                  x={node.x - 22}
                  y={node.y + 25}
                  width="44"
                  height="16"
                  rx="4"
                  fill="#030712"
                  stroke={Math.abs(node.balanceFactor) > 1 ? '#f43f5e' : '#1e293b'}
                  strokeWidth="1"
                />
                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  fill={Math.abs(node.balanceFactor) > 1 ? '#f43f5e' : '#a855f7'}
                  fontSize="9"
                  fontWeight="extrabold"
                  fontFamily="monospace"
                  className="select-none pointer-events-none"
                >
                  BF:{node.balanceFactor > 0 ? `+${node.balanceFactor}` : node.balanceFactor} H:{node.height}
                </text>

                {/* Root Badge */}
                {isRoot && (
                  <text
                    x={node.x}
                    y={node.y - 27}
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

      {/* Traversal State Feedback Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 max-w-xl text-center">
        {action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> AVL Tree insertion & rebalancing complete. All height invariants verified.
          </span>
        ) : isRotationStep ? (
          <span className="text-amber-300 font-bold flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> Rotation step in progress: Restoring height balance invariant.
          </span>
        ) : isImbalanced ? (
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Imbalance detected (|BF| {'>'} 1). Rotation required.
          </span>
        ) : (
          <span>
            {stepMsg || 'AVL Tree invariant: Height difference between left and right subtrees satisfies |BF| ≤ 1.'}
          </span>
        )}
      </div>
    </Card>
  );
};
