import React from 'react';
import { VisualizationStep } from '../../types';
import { LearningMode } from '../learning/LearningModeToggle';
import { HelpCircle, Lightbulb, Activity, BookOpen, Zap } from 'lucide-react';

interface StepExplanationCardProps {
  step?: VisualizationStep;
  mode: LearningMode;
}

export const StepExplanationCard: React.FC<StepExplanationCardProps> = ({ step, mode }) => {
  if (!step) return null;

  const modeExplanation =
    mode === 'BEGINNER'
      ? step.beginnerExplanation || step.message
      : mode === 'ADVANCED'
      ? step.advancedExplanation || step.message
      : step.message;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Primary Step Message */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
          <Activity className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Step {step.step} Execution
            </span>
            {step.action && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {step.action}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-snug">{step.message}</p>
        </div>
      </div>

      {/* Mode-Specific Detailed Explanation */}
      {modeExplanation && (
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          {mode === 'BEGINNER' ? (
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : mode === 'ADVANCED' ? (
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider block mb-0.5">
              {mode} Mode Insight
            </span>
            <span>{modeExplanation}</span>
          </div>
        </div>
      )}

      {/* Why & Complexity Impact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {step.whyMessage && (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Why this action?</span>
            </div>
            <p className="text-slate-300 leading-normal text-[11px]">{step.whyMessage}</p>
          </div>
        )}

        {step.complexityImpact && (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-400 text-[11px]">
              <Activity className="w-3.5 h-3.5" />
              <span>Complexity Impact</span>
            </div>
            <p className="text-slate-300 font-mono text-[11px]">{step.complexityImpact}</p>
          </div>
        )}
      </div>
    </div>
  );
};
