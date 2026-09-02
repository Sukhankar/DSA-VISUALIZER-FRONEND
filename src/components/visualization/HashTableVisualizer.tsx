import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { Hash, ArrowRight, Layers } from 'lucide-react';

interface HashTableVisualizerProps {
  currentStep?: VisualizationStep;
}

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({ currentStep }) => {
  const activeIndices = currentStep?.indices || [];
  const message = currentStep?.message || 'Hash Table bucket storage operations...';
  const action = currentStep?.action || 'INITIAL';

  const keys = currentStep?.array && currentStep.array.length > 0
    ? currentStep.array
    : [12, 22, 32, 15, 25];

  const bucketSize = 7;
  const buckets: Record<number, number[]> = {};

  for (let i = 0; i < bucketSize; i++) {
    buckets[i] = [];
  }

  keys.forEach((key) => {
    const bucketIdx = Math.abs(key) % bucketSize;
    buckets[bucketIdx].push(key);
  });

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-6 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden space-y-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-3xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-400" />
          <span className="text-slate-200 font-semibold">Hash Table Chaining Metaphor</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded font-bold">
            h(k) = key % {bucketSize}
          </span>
          <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded font-bold">
            Buckets: {bucketSize}
          </span>
        </div>
      </div>

      {/* Hash Table Bucket Rows Stage */}
      <div className="z-10 w-full max-w-3xl space-y-3 overflow-y-auto max-h-[300px] pr-2">
        {Object.entries(buckets).map(([bucketIdxStr, nodeKeys]) => {
          const bIdx = parseInt(bucketIdxStr, 10);
          const hasCollision = nodeKeys.length > 1;
          const isActiveBucket = activeIndices.includes(bIdx);

          return (
            <div
              key={bIdx}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${
                isActiveBucket
                  ? 'bg-purple-950/60 border-purple-500/80 shadow-lg shadow-purple-950'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Bucket Index Header Box */}
              <div className="w-14 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                Index [{bIdx}]
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

              {/* Bucket Chaining Nodes */}
              <div className="flex items-center gap-2 overflow-x-auto min-h-[40px] py-1">
                {nodeKeys.length === 0 ? (
                  <span className="text-xs font-mono text-slate-600 italic">EMPTY BUCKET</span>
                ) : (
                  nodeKeys.map((kVal, kIdx) => (
                    <React.Fragment key={kIdx}>
                      {kIdx > 0 && <span className="text-purple-400 font-bold font-mono">──→</span>}
                      <div
                        className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 shadow-md ${
                          hasCollision && kIdx > 0
                            ? 'bg-amber-950/90 text-amber-200 border-amber-500/50'
                            : 'bg-slate-950 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        <span>Key: {kVal}</span>
                      </div>
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Synchronized Message Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 w-full max-w-2xl text-center shadow-lg">
        {message}
      </div>
    </Card>
  );
};
