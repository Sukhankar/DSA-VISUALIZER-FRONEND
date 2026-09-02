import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { ArrowDown, ArrowUp, Target, Search } from 'lucide-react';

interface PointerArrayVisualizerProps {
  currentStep?: VisualizationStep;
}

export const PointerArrayVisualizer: React.FC<PointerArrayVisualizerProps> = ({ currentStep }) => {
  const array = currentStep?.array || [3, 8, 12, 17, 21, 26, 30];
  const activeIndices = currentStep?.indices || [];
  const pointers = currentStep?.pointers || [];
  const pointerRecord = currentStep?.pointerRecord || {};
  const message = currentStep?.message || 'Searching elements in array with pointers...';
  const action = currentStep?.action || 'INITIAL';

  // Group pointers by index to prevent collisions
  const pointerMap: Record<number, { name: string; color?: string; direction?: string }[]> = {};

  // 1. Process structured pointers array
  pointers.forEach((p) => {
    if (p.index !== undefined && p.index >= 0 && p.index < array.length) {
      if (!pointerMap[p.index]) pointerMap[p.index] = [];
      pointerMap[p.index].push({ name: p.name, color: p.color, direction: p.direction });
    }
  });

  // 2. Process record map { left: 0, mid: 3, right: 6 }
  Object.entries(pointerRecord).forEach(([name, idx]) => {
    if (idx >= 0 && idx < array.length) {
      if (!pointerMap[idx]) pointerMap[idx] = [];
      if (!pointerMap[idx].some((p) => p.name.toUpperCase() === name.toUpperCase())) {
        pointerMap[idx].push({ name: name.toUpperCase() });
      }
    }
  });

  // 3. Fallback: Parse common pointer names from step message if missing
  if (Object.keys(pointerMap).length === 0 && activeIndices.length > 0) {
    if (activeIndices.length === 3) {
      pointerMap[activeIndices[0]] = [{ name: 'LEFT', color: 'cyan' }];
      pointerMap[activeIndices[1]] = [{ name: 'MID', color: 'amber' }];
      pointerMap[activeIndices[2]] = [{ name: 'RIGHT', color: 'purple' }];
    } else if (activeIndices.length === 1) {
      pointerMap[activeIndices[0]] = [{ name: 'POINTER', color: 'cyan' }];
    }
  }

  const getPointerBadgeStyle = (name: string) => {
    const upper = name.toUpperCase();
    if (upper.includes('LEFT') || upper === 'L') {
      return 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-cyan-950';
    }
    if (upper.includes('MID') || upper === 'M') {
      return 'bg-amber-950 text-amber-300 border-amber-500/50 shadow-amber-950';
    }
    if (upper.includes('RIGHT') || upper === 'R') {
      return 'bg-purple-950 text-purple-300 border-purple-500/50 shadow-purple-950';
    }
    return 'bg-indigo-950 text-indigo-300 border-indigo-500/50 shadow-indigo-950';
  };

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-6 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden space-y-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-3xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-200 font-semibold">Pointer Array Search Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
            Size: {array.length}
          </span>
          {action === 'FOUND' && (
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded font-bold flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" /> Found
            </span>
          )}
        </div>
      </div>

      {/* Pointer Array Display Stage */}
      <div className="z-10 w-full max-w-4xl overflow-x-auto py-6 flex items-center justify-center">
        <div className="flex items-end justify-center gap-2 sm:gap-3 min-w-max px-4">
          {array.map((val, idx) => {
            const isActive = activeIndices.includes(idx);
            const isFound = action === 'FOUND' && isActive;
            const cellPointers = pointerMap[idx] || [];

            let bgStyle = 'bg-slate-900/90 border-slate-800 text-slate-200';
            if (isFound) {
              bgStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950 ring-2 ring-emerald-500/50';
            } else if (isActive) {
              bgStyle = 'bg-indigo-950/90 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-950 ring-2 ring-indigo-500/50';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                {/* Stacked Pointer Badges Above Cell */}
                <div className="flex flex-col items-center gap-1 min-h-[64px] justify-end">
                  {cellPointers.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-extrabold border flex items-center gap-1 animate-bounce shadow-md ${getPointerBadgeStyle(
                        p.name
                      )}`}
                    >
                      <span>{p.name}</span>
                      <ArrowDown className="w-3 h-3 stroke-[3]" />
                    </div>
                  ))}
                </div>

                {/* Array Cell */}
                <div
                  className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 font-mono ${bgStyle}`}
                >
                  <span className="text-lg font-bold">{val}</span>
                </div>

                {/* Index Badge Below Cell */}
                <span className="text-[11px] font-mono font-semibold text-slate-500">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synchronized Message Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 w-full max-w-2xl text-center shadow-lg">
        {message}
      </div>
    </Card>
  );
};
