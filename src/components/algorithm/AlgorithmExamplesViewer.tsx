import React, { useState } from 'react';
import { AlgorithmExample } from '../../types';
import { Play, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AlgorithmExamplesViewerProps {
  slug: string;
  examples?: AlgorithmExample[];
}

export const AlgorithmExamplesViewer: React.FC<AlgorithmExamplesViewerProps> = ({ slug, examples }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!examples || examples.length === 0) return null;

  const currentExample = examples[activeTab] || examples[0];

  const handleVisualizeExample = () => {
    navigate(`/visualization/${slug}`);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Algorithm Test Case Examples ({examples.length})
          </h3>
        </div>

        <button
          onClick={handleVisualizeExample}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Visualize Custom Input</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {examples.map((ex, idx) => (
          <button
            key={`ex-tab-${ex.exampleNumber || idx}`}
            onClick={() => setActiveTab(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === idx
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            Example {ex.exampleNumber || idx + 1}
          </button>
        ))}
      </div>

      {/* Selected Example Detail Card */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
        {currentExample.title && (
          <div className="font-sans font-bold text-sm text-slate-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{currentExample.title}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Input</span>
            <span className="text-amber-400 font-bold whitespace-pre-wrap">{currentExample.inputData}</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Output</span>
            <span className="text-emerald-400 font-bold whitespace-pre-wrap">{currentExample.outputData}</span>
          </div>
        </div>

        {currentExample.explanation && (
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 font-sans text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block mb-1">
              Explanation
            </span>
            <span>{currentExample.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
};
