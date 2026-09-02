import React, { useMemo } from 'react';
import { VisualizationStep, GraphStateSnapshot, GraphNodeDto, GraphEdgeDto } from '../../types';

interface GraphVisualizerProps {
  currentStep?: VisualizationStep;
  // Legacy / fallback props
  nodes?: string[];
  edges?: GraphEdgeDto[];
  currentNode?: string;
  visitedNodes?: string[];
  frontier?: string[];
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  currentStep,
  nodes: propNodes,
  edges: propEdges,
  currentNode: propCurrentNode,
  visitedNodes: propVisitedNodes,
  frontier: propFrontier,
}) => {
  const graphState: GraphStateSnapshot | undefined = currentStep?.graphState;

  // Extract Nodes
  const nodesList: GraphNodeDto[] = useMemo(() => {
    if (graphState?.nodes && graphState.nodes.length > 0) {
      return graphState.nodes;
    }
    if (propNodes && propNodes.length > 0) {
      return propNodes.map((id) => ({ id, label: id }));
    }
    const fallbackIds = ['A', 'B', 'C', 'D', 'E', 'F'];
    return fallbackIds.map((id) => ({ id, label: id }));
  }, [graphState?.nodes, propNodes]);

  // Extract Edges
  const edgesList: GraphEdgeDto[] = useMemo(() => {
    if (graphState?.edges && graphState.edges.length > 0) {
      return graphState.edges;
    }
    if (propEdges && propEdges.length > 0) {
      return propEdges.map((e) => ({
        id: e.id || `${e.source || e.from}-${e.target || e.to}`,
        source: e.source || e.from || 'A',
        target: e.target || e.to || 'B',
        from: e.from || e.source || 'A',
        to: e.to || e.target || 'B',
        weight: e.weight,
      }));
    }
    return [
      { id: 'A-B', source: 'A', target: 'B', from: 'A', to: 'B', weight: 4 },
      { id: 'A-C', source: 'A', target: 'C', from: 'A', to: 'C', weight: 2 },
      { id: 'B-D', source: 'B', target: 'D', from: 'B', to: 'D', weight: 5 },
      { id: 'C-E', source: 'C', target: 'E', from: 'C', to: 'E', weight: 3 },
    ];
  }, [graphState?.edges, propEdges]);

  // State sets
  const activeNodeIds = graphState?.activeNodeIds || (propCurrentNode ? [propCurrentNode] : []);
  const visitedNodeIds = graphState?.visitedNodeIds || propVisitedNodes || [];
  const queuedNodeIds = graphState?.queuedNodeIds || propFrontier || [];
  const stackNodeIds = graphState?.stackNodeIds || [];
  const activeEdgeIds = graphState?.activeEdgeIds || [];
  const traversedEdgeIds = graphState?.traversedEdgeIds || [];
  const mstEdgeIds = graphState?.mstEdgeIds || [];
  const rejectedEdgeIds = graphState?.rejectedEdgeIds || [];
  const pathEdgeIds = graphState?.pathEdgeIds || [];

  const isDirected = graphState?.directed ?? false;
  const isWeighted = graphState?.weighted ?? edgesList.some((e) => e.weight !== undefined);

  // SVG Canvas dimensions
  const width = 640;
  const height = 360;
  const cx = width / 2;
  const cy = height / 2 - 10;
  const radius = 125;
  const nodeRadius = 24;

  // Node circular placement
  const nodePositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    const count = nodesList.length;
    if (count === 0) return map;

    nodesList.forEach((n, idx) => {
      if (n.x !== undefined && n.x !== null && n.y !== undefined && n.y !== null) {
        map[n.id] = { x: n.x, y: n.y };
      } else {
        const angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        map[n.id] = { x, y };
      }
    });

    return map;
  }, [nodesList, cx, cy, radius]);

  // Style calculator for Nodes
  const getNodeStyle = (nodeId: string) => {
    const isActive = activeNodeIds.includes(nodeId) || graphState?.currentNodeId === nodeId;
    const isVisited = visitedNodeIds.includes(nodeId);
    const isQueued = queuedNodeIds.includes(nodeId);
    const isStack = stackNodeIds.includes(nodeId);

    if (isActive) {
      return {
        fill: '#4f46e5', // Indigo 600
        stroke: '#818cf8', // Indigo 400
        textColor: '#ffffff',
        filter: 'drop-shadow(0px 0px 10px rgba(129, 140, 248, 0.8))',
      };
    }

    if (isVisited) {
      return {
        fill: '#059669', // Emerald 600
        stroke: '#34d399', // Emerald 400
        textColor: '#ffffff',
        filter: 'none',
      };
    }

    if (isQueued) {
      return {
        fill: '#d97706', // Amber 600
        stroke: '#fbbf24', // Amber 400
        textColor: '#ffffff',
        filter: 'drop-shadow(0px 0px 6px rgba(251, 191, 36, 0.5))',
      };
    }

    if (isStack) {
      return {
        fill: '#0891b2', // Cyan 600
        stroke: '#22d3ee', // Cyan 400
        textColor: '#ffffff',
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

  // Style calculator for Edges
  const getEdgeStyle = (edge: GraphEdgeDto) => {
    const src = edge.source || edge.from || '';
    const tgt = edge.target || edge.to || '';
    const eId = edge.id || `${src}-${tgt}`;
    const altId = `${tgt}-${src}`;

    const isMST = mstEdgeIds.includes(eId) || mstEdgeIds.includes(altId);
    const isPath = pathEdgeIds.includes(eId) || pathEdgeIds.includes(altId);
    const isActive = activeEdgeIds.includes(eId) || activeEdgeIds.includes(altId);
    const isTraversed = traversedEdgeIds.includes(eId) || traversedEdgeIds.includes(altId);
    const isRejected = rejectedEdgeIds.includes(eId) || rejectedEdgeIds.includes(altId);

    if (isMST || isPath) {
      return {
        stroke: '#10b981', // Emerald 500
        strokeWidth: '3.5',
        strokeDasharray: 'none',
        filter: 'drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.6))',
      };
    }

    if (isActive) {
      return {
        stroke: '#818cf8', // Indigo 400
        strokeWidth: '3.5',
        strokeDasharray: 'none',
        filter: 'drop-shadow(0px 0px 8px rgba(129, 140, 248, 0.8))',
      };
    }

    if (isRejected) {
      return {
        stroke: '#f43f5e', // Rose 500
        strokeWidth: '2',
        strokeDasharray: '4 4',
        filter: 'none',
      };
    }

    if (isTraversed) {
      return {
        stroke: '#38bdf8', // Sky 400
        strokeWidth: '2.5',
        strokeDasharray: 'none',
        filter: 'none',
      };
    }

    return {
      stroke: '#334155', // Slate 700
      strokeWidth: '2',
      strokeDasharray: 'none',
      filter: 'none',
    };
  };

  return (
    <div className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center select-none overflow-hidden space-y-3 font-mono">
      {/* Legend Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-3 text-[11px] text-slate-400 border-b border-slate-800/60 pb-2">
        <div className="font-bold text-slate-200 flex items-center gap-2">
          <span>Graph Network Model</span>
          {isDirected && (
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">
              DIRECTED (→)
            </span>
          )}
          {isWeighted && (
            <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
              WEIGHTED (Wt)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-600 border border-amber-400" />
            <span>Queue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-400" />
            <span>Visited</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full relative flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-h-[340px] overflow-visible"
        >
          <defs>
            <marker
              id="graph-arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="27"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#818cf8" />
            </marker>
          </defs>

          {/* Edges rendering */}
          {edgesList.map((edge, idx) => {
            const src = edge.source || edge.from || '';
            const tgt = edge.target || edge.to || '';
            const fromPos = nodePositions[src];
            const toPos = nodePositions[tgt];
            if (!fromPos || !toPos) return null;

            const style = getEdgeStyle(edge);
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.strokeDasharray}
                  markerEnd={isDirected ? 'url(#graph-arrowhead)' : undefined}
                  style={{ filter: style.filter }}
                  className="transition-all duration-300"
                />

                {/* Edge Weight Label */}
                {edge.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-14"
                      y="-10"
                      width="28"
                      height="18"
                      rx="4"
                      fill="#090d16"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#fbbf24"
                      className="text-[10px] font-bold"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes rendering */}
          {nodesList.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            const style = getNodeStyle(node.id);

            return (
              <g key={`node-${node.id}`} className="cursor-pointer transition-all duration-300">
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
                  {node.label || node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* SVG Inspector Panel (Data Structure State) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-2 border-t border-slate-800/80">
        {/* Traversal Queue / Stack Inspector */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col space-y-1.5">
          <div className="font-bold text-slate-300 flex items-center justify-between border-b border-slate-800/80 pb-1">
            <span>
              {stackNodeIds.length > 0 ? '🥞 Call Stack (DFS)' : '📥 Frontier Queue (BFS)'}
            </span>
            <span className="text-[10px] text-indigo-400">
              {stackNodeIds.length > 0 ? `${stackNodeIds.length} frames` : `${queuedNodeIds.length} items`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {stackNodeIds.length > 0 ? (
              stackNodeIds.map((item, idx) => (
                <span
                  key={`stack-${idx}`}
                  className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-bold shrink-0"
                >
                  {item}
                </span>
              ))
            ) : queuedNodeIds.length > 0 ? (
              queuedNodeIds.map((item, idx) => (
                <span
                  key={`queue-${idx}`}
                  className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold shrink-0"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic text-[10px]">(Empty)</span>
            )}
          </div>
        </div>

        {/* Shortest Distances / MST Metrics Inspector */}
        {graphState?.shortestDistances && Object.keys(graphState.shortestDistances).length > 0 ? (
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col space-y-1.5">
            <div className="font-bold text-slate-300 flex items-center justify-between border-b border-slate-800/80 pb-1">
              <span>📊 Shortest Distance Table d[v]</span>
              <span className="text-[10px] text-emerald-400">Dijkstra State</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {Object.entries(graphState.shortestDistances).map(([v, dist]) => (
                <div
                  key={`dist-${v}`}
                  className="bg-slate-950 px-2 py-1 rounded border border-slate-800 flex flex-col items-center min-w-[36px]"
                >
                  <span className="text-[10px] text-slate-400 font-bold">{v}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">{dist}</span>
                </div>
              ))}
            </div>
          </div>
        ) : graphState?.totalWeight !== undefined && graphState?.totalWeight !== null ? (
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col space-y-1.5">
            <div className="font-bold text-slate-300 flex items-center justify-between border-b border-slate-800/80 pb-1">
              <span>🌲 Minimum Spanning Tree Metrics</span>
              <span className="text-[10px] text-amber-400">MST Engine</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Total MST Weight:</span>
              <span className="text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
                {graphState.totalWeight}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col space-y-1.5">
            <div className="font-bold text-slate-300 border-b border-slate-800/80 pb-1">
              👁️ Visited Vertices Order
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {visitedNodeIds.length > 0 ? (
                visitedNodeIds.map((item, idx) => (
                  <span
                    key={`visited-${idx}`}
                    className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold shrink-0"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic text-[10px]">None visited yet</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
