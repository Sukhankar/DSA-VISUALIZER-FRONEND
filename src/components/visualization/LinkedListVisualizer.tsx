import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

interface LinkedListVisualizerProps {
  currentStep?: VisualizationStep;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ currentStep }) => {
  const array = currentStep?.array || [10, 20, 30, 40, 50];
  const activeIndices = currentStep?.indices || [];
  const action = currentStep?.action || 'INITIAL';

  const currIdx = activeIndices.length >= 1 ? activeIndices[0] : 0;
  const prevIdx = currIdx > 0 ? currIdx - 1 : -1;
  const nextIdx = currIdx < array.length - 1 ? currIdx + 1 : -1;

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Linked List Header Status */}
      <div className="z-10 flex items-center justify-between w-full max-w-xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-slate-200 font-semibold">Node-Based Linked List Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded font-bold">
            Head: Node[0]
          </span>
          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded font-bold">
            Size: {array.length}
          </span>
        </div>
      </div>

      {/* Nodes Diagram Container */}
      <div className="w-full flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto py-6 z-10 px-2 scrollbar-thin scrollbar-thumb-slate-800">
        {array.map((val, idx) => {
          const isCurr = idx === currIdx;
          const isPrev = idx === prevIdx;
          const isNext = idx === nextIdx;

          return (
            <React.Fragment key={idx}>
              {/* Single Node Component */}
              <div className="flex flex-col items-center shrink-0 relative group">
                {/* Pointer Callouts */}
                <div className="h-8 flex items-end justify-center mb-2 gap-1">
                  {isCurr && (
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold rounded flex items-center gap-1 shadow animate-bounce">
                      <CornerDownRight className="w-3 h-3" /> CURR
                    </span>
                  )}
                  {isPrev && !isCurr && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold rounded shadow">
                      PREV
                    </span>
                  )}
                  {isNext && !isCurr && (
                    <span className="px-2 py-0.5 bg-purple-600 text-white font-mono text-[10px] font-bold rounded shadow">
                      NEXT
                    </span>
                  )}
                </div>

                {/* Node Box [Value | Next Pointer] */}
                <div
                  className={`flex rounded-xl border-2 overflow-hidden shadow-xl transition-all duration-300 ${
                    isCurr
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 ring-2 ring-amber-400/30'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200 group-hover:border-slate-700'
                  }`}
                >
                  {/* Node Value Partition */}
                  <div className="px-4 py-3 text-lg font-mono font-bold flex items-center justify-center min-w-[50px]">
                    {val}
                  </div>

                  {/* Next Pointer Field Partition */}
                  <div className="px-2.5 py-3 bg-slate-950/80 border-l border-slate-800 text-[10px] font-mono font-bold flex items-center justify-center text-slate-400">
                    {idx < array.length - 1 ? `ptr` : `null`}
                  </div>
                </div>

                {/* Node Index Footer */}
                <div className="mt-2 text-xs font-mono font-semibold text-slate-500">
                  Node[{idx}]
                </div>
              </div>

              {/* Connecting Pointer Arrow */}
              {idx < array.length - 1 ? (
                <div className="flex items-center shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors pt-4">
                  <ArrowRight className={`w-5 h-5 ${isCurr ? 'text-amber-400 animate-pulse' : ''}`} />
                </div>
              ) : (
                <div className="flex items-center shrink-0 font-mono text-xs text-rose-400/80 bg-rose-950/30 border border-rose-500/20 px-2 py-1 rounded pt-1">
                  &rarr; NULL
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Execution Feedback Banner */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Reached tail of Linked List (current == null).
          </span>
        ) : (
          <span>
            Visiting Node[{currIdx}] value <strong className="text-amber-300">{array[currIdx]}</strong>. Next reference points to {currIdx < array.length - 1 ? `Node[${currIdx + 1}]` : 'NULL'}.
          </span>
        )}
      </div>
    </Card>
  );
};
