import React from 'react';
import { VisualizationStep } from '../../types';
import { Card } from '../ui/Card';
import { GitMerge, CheckCircle2 } from 'lucide-react';

interface TrieVisualizerProps {
  currentStep?: VisualizationStep;
}

export const TrieVisualizer: React.FC<TrieVisualizerProps> = ({ currentStep }) => {
  const message = currentStep?.message || 'Trie prefix tree operation...';
  const action = currentStep?.action || 'INITIAL';

  const sampleWords = ['cat', 'car', 'card', 'dog'];

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-6 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden space-y-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Info Banner */}
      <div className="z-10 flex items-center justify-between w-full max-w-3xl px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-200 font-semibold">Trie (Prefix Tree) Metaphor</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded font-bold">
            Words: [{sampleWords.join(', ')}]
          </span>
        </div>
      </div>

      {/* Trie Diagram Stage */}
      <div className="z-10 w-full max-w-2xl py-4 flex flex-col items-center justify-center space-y-6">
        {/* Root Node */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center font-mono font-bold text-cyan-300 shadow-lg shadow-cyan-950">
            ROOT
          </div>
        </div>

        {/* Level 1 Characters */}
        <div className="grid grid-cols-2 gap-16 w-full max-w-md">
          {/* 'c' branch */}
          <div className="flex flex-col items-center gap-3">
            <div className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-500/50 rounded-lg font-mono font-extrabold text-sm shadow-md">
              'c'
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="px-2.5 py-1 bg-slate-900 text-slate-200 border border-slate-700 rounded font-mono text-xs">
                'a' → 't'
              </div>
              <div className="px-2.5 py-1 bg-slate-900 text-slate-200 border border-slate-700 rounded font-mono text-xs">
                'r' → 'd'
              </div>
            </div>
          </div>

          {/* 'd' branch */}
          <div className="flex flex-col items-center gap-3">
            <div className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-500/50 rounded-lg font-mono font-extrabold text-sm shadow-md">
              'd'
            </div>
            <div className="px-2.5 py-1 bg-slate-900 text-slate-200 border border-slate-700 rounded font-mono text-xs">
              'o' → 'g'
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Message Footer */}
      <div className="z-10 text-xs font-mono text-slate-300 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 w-full max-w-2xl text-center shadow-lg">
        {action === 'COMPLETE' ? (
          <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Trie prefix insertion & search verified!
          </span>
        ) : (
          message
        )}
      </div>
    </Card>
  );
};
