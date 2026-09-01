import React from 'react';
import { VisualizationStep } from '../../types';
import { LearningMode } from '../learning/LearningModeToggle';
import { HelpCircle, Lightbulb, Activity, BookOpen, Zap, CheckCircle, Code2, Compass } from 'lucide-react';

interface StepExplanationCardProps {
  step?: VisualizationStep;
  mode: LearningMode;
}

export const StepExplanationCard: React.FC<StepExplanationCardProps> = ({ step, mode }) => {
  if (!step) return null;

  // Action-based intelligent fallback generators for rich explanations
  const getFallbackBeginnerExplanation = (s: VisualizationStep): string => {
    switch (s.action?.toUpperCase()) {
      case 'INITIAL':
        return `We are setting up the initial workspace and data structures. Zero-indexed array indices and memory pointers are initialized before running the core algorithmic loop.`;
      case 'SELECT':
        return `The algorithm picks element at index ${s.indices?.[0] ?? 'current'} to inspect. In beginner terms, we fix our attention on one position before making decisions or comparisons.`;
      case 'COMPARE':
        return `Comparing values at indices ${s.indices?.join(' and ') ?? 'selected positions'}. We check if elements satisfy the ordering rule (e.g., left <= right or ascending sort order).`;
      case 'SWAP':
        return `The elements at indices ${s.indices?.join(' and ') ?? 'selected positions'} are out of order, so we swap their positions to move smaller values left and larger values right.`;
      case 'VISIT':
        return `Visiting element/node ${s.currentNode || s.indices?.[0] || ''}. Mark this element as inspected so we don't repeat work.`;
      case 'UPDATE':
        return `Updating state variable or array index ${s.indices?.[0] ?? ''}. This brings us one step closer to the algorithm's goal.`;
      case 'COMPLETE':
        return `Execution successfully finished! The data structure is now fully processed/sorted with optimal time and space usage.`;
      default:
        return `Step ${s.step}: The algorithm evaluates current state to determine the next state transition.`;
    }
  };

  const getFallbackAdvancedExplanation = (s: VisualizationStep): string => {
    switch (s.action?.toUpperCase()) {
      case 'INITIAL':
        return `State Space Initialization: Dynamic array bounds established. Space Complexity: O(N) auxiliary memory. Loop invariant holds trivially at start.`;
      case 'SELECT':
        return `Pointer positioning at index ${s.indices?.[0] ?? 0}. Evaluates base memory offset: address = base + index * sizeof(type).`;
      case 'COMPARE':
        return `Branch evaluation: T(N) comparison operation. Binary comparison opcode verifies relational predicate A[i] vs A[j].`;
      case 'SWAP':
        return `In-place element exchange: XOR or temp variable swap. Invariant maintained: subarray range [0..k] approaches sorted order.`;
      case 'VISIT':
        return `Node traversal: O(1) step execution. Call stack depth remains within logarithmic/linear bounds.`;
      case 'UPDATE':
        return `State transition update: Memory mutation step. Amortized time complexity cost: O(1).`;
      case 'COMPLETE':
        return `Post-condition satisfied. Loop invariant verified. Asymptotic Runtime: Optimal bound achieved.`;
      default:
        return `Formal state transition step ${s.step}. System invariant maintained under asymptotic bounds.`;
    }
  };

  const getFallbackWhyMessage = (s: VisualizationStep): string => {
    switch (s.action?.toUpperCase()) {
      case 'INITIAL':
        return `Necessary to establish clean boundary conditions and allocate contiguous memory before iteration begins.`;
      case 'COMPARE':
        return `To verify if elements satisfy the required invariant (e.g. sorted order, target match, or optimal subproblem sum).`;
      case 'SWAP':
        return `Exchanging out-of-order elements enforces correct relative positioning towards final sorted output.`;
      case 'SELECT':
        return `Isolating specific indices isolates candidate values for conditional testing.`;
      case 'COMPLETE':
        return `All array elements or graph vertices have satisfied termination conditions.`;
      default:
        return `Required step in algorithm logic flow to progress state towards termination.`;
    }
  };

  const getFallbackComplexity = (s: VisualizationStep): string => {
    switch (s.action?.toUpperCase()) {
      case 'COMPARE':
        return `Time: O(1) comparison | Total Cumulative: O(N log N) or O(N²)`;
      case 'SWAP':
        return `Time: O(1) memory write | Auxiliary Space: O(1)`;
      case 'INITIAL':
        return `Space: O(N) memory allocation | Time: O(1)`;
      case 'COMPLETE':
        return `Total Runtime: O(N) to O(N log N) | Space: O(1) in-place`;
      default:
        return `Time per step: O(1) | Space Impact: O(1)`;
    }
  };

  const modeExplanation =
    mode === 'BEGINNER'
      ? step.beginnerExplanation || getFallbackBeginnerExplanation(step)
      : mode === 'ADVANCED'
      ? step.advancedExplanation || getFallbackAdvancedExplanation(step)
      : step.message;

  const whyMessage = step.whyMessage || getFallbackWhyMessage(step);
  const complexityImpact = step.complexityImpact || getFallbackComplexity(step);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Primary Step Header & Message */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5 shadow-md shadow-indigo-950">
            <Activity className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Step {step.step} Execution
              </span>
              {step.action && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  {step.action}
                </span>
              )}
            </div>
            <p className="text-base font-bold text-slate-100 leading-snug">{step.message}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-400">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{mode} Mode</span>
        </div>
      </div>

      {/* Mode-Specific Detailed Pedagogical Explanation */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2">
          {mode === 'BEGINNER' ? (
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : mode === 'ADVANCED' ? (
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span className="font-extrabold text-slate-200 uppercase text-[11px] tracking-wider">
            {mode} Mode Intuition & Breakdown
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">{modeExplanation}</p>
      </div>

      {/* Deep Why & Complexity Impact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 font-extrabold text-amber-400 text-[11px] uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Why This Action?</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{whyMessage}</p>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 font-extrabold text-indigo-400 text-[11px] uppercase tracking-wider">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Complexity & Memory Impact</span>
          </div>
          <p className="text-slate-300 font-mono text-[11px] font-medium leading-relaxed">
            {complexityImpact}
          </p>
        </div>
      </div>
    </div>
  );
};
