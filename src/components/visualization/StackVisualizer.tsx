import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';

interface StackVisualizerProps {
  currentStep?: VisualizationStep;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ currentStep }) => {
  const stackItems = currentStep?.stackItems || currentStep?.array || [10, 20, 30];
  const action = currentStep?.action || 'INITIAL';

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info */}
      <div className="z-10 flex items-center justify-between w-full max-w-md px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span className="text-slate-200 font-semibold">LIFO Stack Metaphor</span>
        </div>

        <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded font-bold">
          Size: {stackItems.length}
        </span>
      </div>

      {/* Vertical Glassmorphism Stack Column Container */}
      <div className="w-full max-w-[240px] border-b-4 border-l-4 border-r-4 border-slate-700/80 rounded-b-2xl bg-slate-900/40 p-3 min-h-[220px] flex flex-col-reverse justify-start items-center gap-2 z-10 shadow-2xl relative">
        {stackItems.length === 0 ? (
          <div className="text-xs font-mono text-slate-500 my-auto py-8">
            [ Stack is Empty ]
          </div>
        ) : (
          stackItems.map((item, idx) => {
            const isTop = idx === stackItems.length - 1;

            return (
              <div
                key={idx}
                className={`w-full py-3 px-4 rounded-xl border-2 font-mono text-center text-sm font-bold transition-all duration-300 flex items-center justify-between shadow-lg ${
                  isTop
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200 ring-2 ring-purple-500/30 shadow-purple-500/20 scale-102'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <span>{item}</span>
                {isTop && (
                  <span className="text-[10px] font-extrabold bg-purple-500 text-white px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                    <ArrowLeft className="w-3 h-3" /> TOP
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Operation Feedback */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {action === 'INSERT' ? (
          <span className="text-purple-400 font-bold">PUSH operation: Element added onto stack top.</span>
        ) : action === 'DELETE' ? (
          <span className="text-rose-400 font-bold">POP operation: Element removed from stack top.</span>
        ) : action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Stack processing completed.
          </span>
        ) : (
          <span>LIFO discipline: Elements enter and exit strictly from TOP.</span>
        )}
      </div>
    </Card>
  );
};
