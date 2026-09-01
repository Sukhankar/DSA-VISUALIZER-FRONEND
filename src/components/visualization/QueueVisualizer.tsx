import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { ArrowLeftRight, CheckCircle2, ArrowDown } from 'lucide-react';

interface QueueVisualizerProps {
  currentStep?: VisualizationStep;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ currentStep }) => {
  const queueItems = currentStep?.queueItems || currentStep?.array || [10, 20, 30, 40];
  const action = currentStep?.action || 'INITIAL';

  return (
    <Card className="bg-slate-950/80 border-slate-800 p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden space-y-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Queue Header Info */}
      <div className="z-10 flex items-center justify-between w-full max-w-xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-200 font-semibold">FIFO Queue Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded font-bold">
            Front: [0]
          </span>
          <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded font-bold">
            Rear: [{queueItems.length > 0 ? queueItems.length - 1 : 0}]
          </span>
        </div>
      </div>

      {/* Horizontal FIFO Queue Pipe Container */}
      <div className="w-full max-w-2xl border-t-2 border-b-2 border-slate-700/80 bg-slate-900/40 p-4 min-h-[140px] flex items-center justify-start gap-3 z-10 overflow-x-auto rounded-xl">
        {queueItems.length === 0 ? (
          <div className="text-xs font-mono text-slate-500 mx-auto py-4">
            [ Queue is Empty ]
          </div>
        ) : (
          queueItems.map((item, idx) => {
            const isFront = idx === 0;
            const isRear = idx === queueItems.length - 1;

            return (
              <div key={idx} className="flex flex-col items-center shrink-0 group relative">
                {/* Pointer Labels Above */}
                <div className="h-6 flex items-end justify-center mb-1 gap-1">
                  {isFront && (
                    <span className="px-2 py-0.5 bg-cyan-500 text-slate-950 font-mono text-[9px] font-extrabold rounded flex items-center gap-0.5 shadow animate-pulse">
                      <ArrowDown className="w-2.5 h-2.5" /> FRONT
                    </span>
                  )}
                  {isRear && !isFront && (
                    <span className="px-2 py-0.5 bg-indigo-500 text-white font-mono text-[9px] font-extrabold rounded flex items-center gap-0.5 shadow">
                      <ArrowDown className="w-2.5 h-2.5" /> REAR
                    </span>
                  )}
                </div>

                {/* Queue Element Card */}
                <div
                  className={`w-14 h-16 sm:w-16 sm:h-18 rounded-xl border-2 flex items-center justify-center text-base sm:text-lg font-mono font-bold transition-all duration-300 shadow-lg ${
                    isFront
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-500/20 ring-2 ring-cyan-400/30 scale-105'
                      : isRear
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-indigo-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {item}
                </div>

                {/* Position Footer */}
                <div className="mt-1 text-[10px] font-mono text-slate-500">
                  [{idx}]
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Banner */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
        {action === 'INSERT' ? (
          <span className="text-indigo-400 font-bold">ENQUEUE operation: Element added at REAR.</span>
        ) : action === 'DELETE' ? (
          <span className="text-rose-400 font-bold">DEQUEUE operation: Element removed from FRONT.</span>
        ) : action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Queue processing complete.
          </span>
        ) : (
          <span>FIFO discipline: Elements enter at REAR, exit at FRONT.</span>
        )}
      </div>
    </Card>
  );
};
