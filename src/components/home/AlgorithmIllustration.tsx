import React, { useEffect, useState } from 'react';

const BARS = [42, 18, 75, 29, 63, 51, 88, 34];

export const AlgorithmIllustration: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number[]>([1, 4]);
  const [bars, setBars] = useState(BARS);
  const [codeStep, setCodeStep] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setCodeStep((s) => (s + 1) % 4);
      const i = Math.floor(Math.random() * bars.length);
      const j = Math.floor(Math.random() * bars.length);
      setActiveIdx([i, j]);
      setBars((prev) => {
        const next = [...prev];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 1600);
    return () => clearInterval(iv);
  }, []);

  const codeLines = [
    'function quickSort(arr, lo, hi) {',
    '  const pivot = arr[hi];',
    '  let i = lo - 1;',
    '  for (let j = lo; j < hi; j++) {',
  ];

  // Simple graph nodes
  const nodes = [
    { x: 48,  y: 30,  label: 'A', color: '#7c6cff' },
    { x: 82,  y: 55,  label: 'B', color: '#4da3ff' },
    { x: 30,  y: 68,  label: 'C', color: '#e879f9' },
    { x: 65,  y: 80,  label: 'D', color: '#38bdf8' },
  ];
  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 3],
  ];

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none" style={{ minHeight: 260 }}>

      {/* ── Ambient glows ── */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Main "screen" card ── */}
      <div className="relative rounded-2xl border border-slate-700/60 bg-[#0d1526]/90 backdrop-blur-sm shadow-2xl overflow-hidden">
        
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/50">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 font-mono text-[11px] text-slate-500">QuickSort.java — Step {codeStep + 1}/4</span>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          {/* Left: code trace */}
          <div className="space-y-1">
            {codeLines.map((line, idx) => (
              <div
                key={idx}
                className={`font-mono text-[10px] px-2 py-0.5 rounded transition-colors ${
                  idx === codeStep
                    ? 'bg-indigo-500/20 text-indigo-200'
                    : 'text-slate-500'
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Right: mini graph */}
          <div className="relative" style={{ height: 100 }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Edges */}
              {edges.map(([a, b], i) => (
                <line
                  key={i}
                  x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
                  x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
                  stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"
                />
              ))}
              {/* Nodes */}
              {nodes.map((node, i) => (
                <g key={i}>
                  <circle
                    cx={`${node.x}%`} cy={`${node.y}%`} r="6"
                    fill={node.color} fillOpacity={0.25}
                    stroke={node.color} strokeWidth="1.5"
                  />
                  <text
                    x={`${node.x}%`} y={`${node.y}%`}
                    textAnchor="middle" dominantBaseline="central"
                    fill={node.color} fontSize="5" fontWeight="bold"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Array bars */}
        <div className="px-4 pb-4">
          <div className="text-[10px] text-slate-500 font-mono mb-2">Array State</div>
          <div className="flex items-end gap-1 h-16 bg-slate-950/50 rounded-lg p-2">
            {bars.map((val, idx) => {
              const active = activeIdx.includes(idx);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      active
                        ? 'bg-gradient-to-t from-pink-500 to-purple-500 shadow-sm shadow-pink-500/30'
                        : 'bg-gradient-to-t from-indigo-700 to-cyan-500 opacity-60'
                    }`}
                    style={{ height: `${Math.max(10, (val / 100) * 100)}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Floating complexity badge ── */}
      <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d1526] border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold shadow-lg">
        ✓ O(n log n)
      </div>

      {/* ── Floating array badge ── */}
      <div className="absolute -top-3 -left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0d1526] border border-indigo-500/40 text-indigo-300 text-[10px] font-mono shadow-lg">
        Array[
        {bars.slice(0, 3).join(', ')}
        ...]
      </div>
    </div>
  );
};
