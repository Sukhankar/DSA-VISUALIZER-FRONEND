import React from 'react';
import { Sparkles, BookOpen, GraduationCap, Zap } from 'lucide-react';

export type LearningMode = 'BEGINNER' | 'STANDARD' | 'ADVANCED';

interface LearningModeToggleProps {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  compact?: boolean;
}

export const LearningModeToggle: React.FC<LearningModeToggleProps> = ({
  currentMode,
  onModeChange,
  compact = false,
}) => {
  const modes: { id: LearningMode; label: string; icon: React.ReactNode; color: string; description: string }[] = [
    {
      id: 'BEGINNER',
      label: 'Beginner',
      icon: <BookOpen className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'emerald',
      description: 'Fundamental explanations, index breakdowns, and simple analogies.',
    },
    {
      id: 'STANDARD',
      label: 'Standard',
      icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'cyan',
      description: 'Clean DSA logic and step-by-step walkthroughs.',
    },
    {
      id: 'ADVANCED',
      label: 'Advanced',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      color: 'amber',
      description: 'Invariants, mathematical proofs, edge cases & O(1) variants.',
    },
  ];

  if (compact) {
    return (
      <div className="inline-flex items-center p-1 bg-slate-950/90 border border-slate-800/80 rounded-xl">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-slate-100 shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={m.description}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Learning Explanation Mode
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Customize depth of step explanations</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-100 mb-1">
                {m.icon}
                <span>{m.label}</span>
              </div>
              <span className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {m.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
