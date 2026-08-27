import React from 'react';
import { AlgorithmExample } from '../../types';
import { Terminal, FileInput, FileOutput, Info } from 'lucide-react';

interface ExampleCardProps {
  example: AlgorithmExample;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({ example }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
      {/* Title */}
      <div className="flex items-center gap-2 font-bold text-xs text-indigo-400">
        <Terminal className="w-4 h-4 text-indigo-400" />
        <span>Example {example.exampleNumber}: {example.title}</span>
      </div>

      {/* Input / Output Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Input */}
        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <FileInput className="w-3.5 h-3.5 text-indigo-400" />
            <span>Input</span>
          </div>
          <p className="font-mono text-xs text-slate-100 font-medium break-all">
            {example.inputData}
          </p>
        </div>

        {/* Output */}
        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <FileOutput className="w-3.5 h-3.5 text-emerald-400" />
            <span>Output</span>
          </div>
          <p className="font-mono text-xs text-emerald-300 font-bold break-all">
            {example.outputData}
          </p>
        </div>
      </div>

      {/* Explanation */}
      {example.explanation && (
        <div className="pt-2 border-t border-slate-800/60 flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">Explanation: </span>
            {example.explanation}
          </div>
        </div>
      )}
    </div>
  );
};
