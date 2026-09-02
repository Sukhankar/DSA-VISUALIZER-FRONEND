import React from 'react';
import { VisualizationStep } from '../../types';

interface ConvexHullVisualizerProps {
  currentStep?: VisualizationStep;
}

interface Point2D {
  x: number;
  y: number;
  label: string;
}

const DEFAULT_POINTS: Point2D[] = [
  { x: 1, y: 1, label: 'P1' },
  { x: 2, y: 5, label: 'P2' },
  { x: 5, y: 4, label: 'P3' },
  { x: 7, y: 2, label: 'P4' },
  { x: 4, y: 0, label: 'P5' },
  { x: 2, y: 2, label: 'P6' },
];

export const ConvexHullVisualizer: React.FC<ConvexHullVisualizerProps> = ({ currentStep }) => {
  const customState = currentStep?.customState || {};

  const rawPoints = customState.points as any[];
  const points: Point2D[] = (rawPoints && rawPoints.length > 0)
    ? rawPoints.map((p, idx) => ({
        x: typeof p.x === 'number' ? p.x : parseFloat(p.x) || 0,
        y: typeof p.y === 'number' ? p.y : parseFloat(p.y) || 0,
        label: p.label || `P${idx + 1}`,
      }))
    : DEFAULT_POINTS;

  const hullLabels: string[] = Array.isArray(customState.hull) ? customState.hull : [];
  const anchorPoint: string | null = customState.anchorPoint || null;
  const candidatePoint: string | null = customState.candidatePoint || null;
  const testPoint: string | null = customState.testPoint || null;
  const crossProduct: number | null = typeof customState.crossProduct === 'number' ? customState.crossProduct : null;

  // Viewport dimensions
  const svgWidth = 640;
  const svgHeight = 440;
  const margin = 50;

  // Compute dynamic bounds
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);

  const minX = Math.min(0, Math.floor(Math.min(...xValues) - 1));
  const maxX = Math.max(8, Math.ceil(Math.max(...xValues) + 1));
  const minY = Math.min(0, Math.floor(Math.min(...yValues) - 1));
  const maxY = Math.max(8, Math.ceil(Math.max(...yValues) + 1));

  // Scale functions: Math (x, y) -> SVG (cx, cy)
  const scaleX = (x: number) => {
    return margin + ((x - minX) / (maxX - minX)) * (svgWidth - 2 * margin);
  };

  const scaleY = (y: number) => {
    // Invert Y axis for SVG (higher Y is higher on screen)
    return svgHeight - margin - ((y - minY) / (maxY - minY)) * (svgHeight - 2 * margin);
  };

  // Find point coordinates by label
  const getPoint = (label: string | null) => points.find((p) => p.label === label);

  const anchorPt = getPoint(anchorPoint);
  const candidatePt = getPoint(candidatePoint);
  const testPt = getPoint(testPoint);

  // Hull points in order
  const hullPoints = hullLabels.map((lbl) => getPoint(lbl)).filter((p): p is Point2D => p !== undefined);

  // Hull polygon path string
  const hullPolygonPoints = hullPoints.map((p) => `${scaleX(p.x)},${scaleY(p.y)}`).join(' ');

  // Grid tick marks
  const xTicks: number[] = [];
  for (let x = minX; x <= maxX; x += 1) xTicks.push(x);

  const yTicks: number[] = [];
  for (let y = minY; y <= maxY; y += 1) yTicks.push(y);

  return (
    <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden select-none">
      {/* Background glow accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Math & Status Overlay Callout */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl z-10 font-mono text-xs shadow-lg">
        <div className="flex items-center space-x-2 text-slate-300">
          <span className="text-purple-400 font-bold">2D CARTESIAN PLANE</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">
            Anchor: <strong className="text-cyan-200">{anchorPoint || 'None'}</strong>
          </span>
          {candidatePoint && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-purple-300">
                Candidate: <strong className="text-purple-200">{candidatePoint}</strong>
              </span>
            </>
          )}
          {testPoint && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-amber-300">
                Testing: <strong className="text-amber-200">{testPoint}</strong>
              </span>
            </>
          )}
        </div>

        {crossProduct !== null && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-slate-400">Cross-Product:</span>
            <span
              className={`font-bold font-mono ${
                crossProduct > 0
                  ? 'text-emerald-400'
                  : crossProduct < 0
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {crossProduct.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400">
              ({crossProduct > 0 ? 'CCW / Left Turn' : crossProduct < 0 ? 'CW / Right Turn' : 'Collinear'})
            </span>
          </div>
        )}
      </div>

      {/* SVG Cartesian Coordinate Canvas */}
      <div className="w-full flex-1 flex items-center justify-center my-2 relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-h-[420px] drop-shadow-md"
        >
          <defs>
            {/* Arrowhead marker for vectors */}
            <marker
              id="arrow-candidate"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
            </marker>
            <marker
              id="arrow-test"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>

            {/* Gradient fill for Hull polygon */}
            <linearGradient id="hull-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {xTicks.map((x) => (
            <line
              key={`grid-x-${x}`}
              x1={scaleX(x)}
              y1={margin}
              x2={scaleX(x)}
              y2={svgHeight - margin}
              stroke="#1e293b"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          ))}

          {yTicks.map((y) => (
            <line
              key={`grid-y-${y}`}
              x1={margin}
              y1={scaleY(y)}
              x2={svgWidth - margin}
              y2={scaleY(y)}
              stroke="#1e293b"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          ))}

          {/* X & Y Axes */}
          <line
            x1={margin}
            y1={scaleY(0)}
            x2={svgWidth - margin}
            y2={scaleY(0)}
            stroke="#475569"
            strokeWidth="2"
          />
          <line
            x1={scaleX(0)}
            y1={margin}
            x2={scaleX(0)}
            y2={svgHeight - margin}
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text
            x={svgWidth - margin + 15}
            y={scaleY(0) + 4}
            fill="#94a3b8"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            X
          </text>
          <text
            x={scaleX(0) - 4}
            y={margin - 12}
            fill="#94a3b8"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Y
          </text>

          {/* Axis Tick Numbers */}
          {xTicks.map((x) => (
            <text
              key={`tick-x-${x}`}
              x={scaleX(x)}
              y={scaleY(0) + 16}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {x}
            </text>
          ))}

          {yTicks.map((y) => (
            <text
              key={`tick-y-${y}`}
              x={scaleX(0) - 10}
              y={scaleY(y) + 3}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="end"
            >
              {y}
            </text>
          ))}

          {/* Hull Polygon Fill & Border */}
          {hullPoints.length > 2 && (
            <polygon
              points={hullPolygonPoints}
              fill="url(#hull-gradient)"
              stroke="#a855f7"
              strokeWidth="3"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* Partial Hull Path Lines (if size <= 2) */}
          {hullPoints.length === 2 && (
            <line
              x1={scaleX(hullPoints[0].x)}
              y1={scaleY(hullPoints[0].y)}
              x2={scaleX(hullPoints[1].x)}
              y2={scaleY(hullPoints[1].y)}
              stroke="#a855f7"
              strokeWidth="3"
            />
          )}

          {/* Candidate Vector (Anchor -> Candidate) */}
          {anchorPt && candidatePt && (
            <line
              x1={scaleX(anchorPt.x)}
              y1={scaleY(anchorPt.y)}
              x2={scaleX(candidatePt.x)}
              y2={scaleY(candidatePt.y)}
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              markerEnd="url(#arrow-candidate)"
            />
          )}

          {/* Test Vector (Anchor -> Test) */}
          {anchorPt && testPt && (
            <line
              x1={scaleX(anchorPt.x)}
              y1={scaleY(anchorPt.y)}
              x2={scaleX(testPt.x)}
              y2={scaleY(testPt.y)}
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="2 2"
              markerEnd="url(#arrow-test)"
            />
          )}

          {/* Points Nodes */}
          {points.map((pt) => {
            const isAnchor = pt.label === anchorPoint;
            const isCandidate = pt.label === candidatePoint;
            const isTest = pt.label === testPoint;
            const isHull = hullLabels.includes(pt.label);

            let nodeFill = '#1e293b';
            let nodeStroke = '#475569';
            let nodeRadius = 8;
            let glow = false;

            if (isAnchor) {
              nodeFill = '#06b6d4';
              nodeStroke = '#22d3ee';
              nodeRadius = 12;
              glow = true;
            } else if (isCandidate) {
              nodeFill = '#a855f7';
              nodeStroke = '#c084fc';
              nodeRadius = 11;
              glow = true;
            } else if (isTest) {
              nodeFill = '#f59e0b';
              nodeStroke = '#fbbf24';
              nodeRadius = 11;
              glow = true;
            } else if (isHull) {
              nodeFill = '#10b981';
              nodeStroke = '#34d399';
              nodeRadius = 9.5;
            }

            return (
              <g key={pt.label} className="transition-all duration-300">
                {/* Glow ring */}
                {glow && (
                  <circle
                    cx={scaleX(pt.x)}
                    cy={scaleY(pt.y)}
                    r={nodeRadius + 6}
                    fill={nodeFill}
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}

                {/* Point Circle */}
                <circle
                  cx={scaleX(pt.x)}
                  cy={scaleY(pt.y)}
                  r={nodeRadius}
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth="2"
                  className="shadow-md"
                />

                {/* Point Label & Coordinates */}
                <text
                  x={scaleX(pt.x)}
                  y={scaleY(pt.y) - nodeRadius - 6}
                  fill={isAnchor || isCandidate || isTest || isHull ? '#f8fafc' : '#94a3b8'}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {pt.label} ({pt.x},{pt.y})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="w-full flex flex-wrap items-center justify-center gap-4 py-1 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500 border border-cyan-300" />
          <span>Anchor Point</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-300" />
          <span>Candidate Edge</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
          <span>Test Vector</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
          <span>Hull Boundary</span>
        </div>
      </div>
    </div>
  );
};
