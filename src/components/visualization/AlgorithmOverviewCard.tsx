import React, { useState } from 'react';
import { Algorithm, AlgorithmDetailRichResponse } from '../../types';
import { BookOpen, Lightbulb, Compass, HelpCircle, ChevronDown, ChevronUp, FileCode2, Layers, CheckCircle2, Zap } from 'lucide-react';

interface AlgorithmOverviewCardProps {
  algorithm: Algorithm;
  richDetails?: AlgorithmDetailRichResponse | null;
}

// Fallback theoretical & application knowledge base for key algorithms
const ALGORITHM_THEORY_DATABASE: Record<
  string,
  {
    whatIsIt: string;
    whyUsed: string;
    whereUsed: string;
    theory: string;

    examples: { input: string; output: string; explanation: string }[];
  }
> = {
  '0/1-knapsack-problem-dp': {
    whatIsIt:
      'The 0/1 Knapsack Problem is a classic optimization problem in Dynamic Programming where you are given a set of items, each with a weight and a value, and must determine the maximum value item combination that fits within a fixed capacity knapsack without breaking items.',
    whyUsed:
      'Brute-force checking all 2^N item combinations is exponentially slow O(2^N). Dynamic Programming stores optimal solutions to smaller subproblems in a 2D table (or 1D array), reducing the complexity to pseudo-polynomial O(N × W).',
    whereUsed:
      'Resource allocation in cloud computing, portfolio management & capital budgeting, cargo loading optimizations, and bandwidth allocation in network systems.',
    theory:
      'Dynamic Programming Recurrence: For item i and capacity w: DP[i][w] = max(DP[i-1][w], value[i-1] + DP[i-1][w - weight[i-1]]) if weight[i-1] <= w, else DP[i-1][w].',
    examples: [
      {
        input: 'Weights = [2, 3, 4, 5], Values = [3, 4, 5, 6], Capacity W = 5',
        output: 'Maximum Value = 7',
        explanation: 'Select items 1 and 2 (weights 2 + 3 = 5, total value 3 + 4 = 7).',
      },
    ],
  },
  'binary-search': {
    whatIsIt:
      'Binary Search is an efficient logarithmic search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search space in half.',
    whyUsed:
      'Unlike linear search which takes O(N) time, Binary Search eliminates half the remaining elements at each iteration, achieving optimal O(log N) efficiency for large datasets.',
    whereUsed:
      'Database B-Tree indexing, dictionary lookups, Git bisect for bug hunting, standard library lower_bound/upper_bound methods.',
    theory:
      'Loop Invariant: At any step k, if the target exists in the array, it lies strictly within the range [low..high]. Compute mid = low + (high - low) / 2.',
    examples: [
      {
        input: 'Array = [1, 3, 5, 7, 9, 12, 15], Target = 7',
        output: 'Index 3',
        explanation:
          'Mid element is 7 (index 3). Target matches mid value on 1st comparison.',
      },
    ],
  },
  'bubble-sort': {
    whatIsIt:
      'Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    whyUsed:
      'Ideal for educational purposes to demonstrate basic sorting logic, loop invariants, and early termination when an array is already sorted.',
    whereUsed:
      'Computer science pedagogy, nearly-sorted datasets where only a few adjacent swaps are needed, embedded systems with severe code space constraints.',
    theory:
      'Pass Invariant: After pass i (0 <= i < N-1), the largest element among the unSorted prefix bubbles up to its final correct sorted position at index N-1-i.',
    examples: [
      {
        input: 'Array = [5, 1, 4, 2, 8]',
        output: 'Sorted Array = [1, 2, 4, 5, 8]',
        explanation:
          'Pass 1 swaps 5 with 1, 4, 2 until 8 is placed at the end. Subsequent passes place 5, 4, 2, and 1.',
      },
    ],
  },
  'quick-sort': {
    whatIsIt:
      'Quick Sort is a highly efficient, comparison-based divide-and-conquer sorting algorithm that selects a pivot element and partitions the array around it.',
    whyUsed:
      'Exhibits outstanding cache locality and minimal memory overhead (O(log N) stack space) with average O(N log N) performance.',
    whereUsed:
      'C++ std::sort (IntroSort variant), Java primitive arrays sort (Dual-Pivot QuickSort), operating system file system sorting.',
    theory:
      'Partitioning Invariant: Reorder elements such that all elements <= pivot are placed before the pivot index, and all elements > pivot are placed after it.',
    examples: [
      {
        input: 'Array = [10, 80, 30, 90, 40, 50, 70], Pivot = 70',
        output: 'Partitioned around 70: [10, 30, 40, 50, 70, 90, 80]',
        explanation:
          'Elements less than 70 are moved left, 70 is placed at index 4, and recursive calls sort left and right subarrays.',
      },
    ],
  },
};

export const AlgorithmOverviewCard: React.FC<AlgorithmOverviewCardProps> = ({
  algorithm,
  richDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'why' | 'examples'>('theory');
  const [showFullTheory, setShowFullTheory] = useState<boolean>(false);

  const slugKey = algorithm.slug.toLowerCase();
  const fallbackInfo = ALGORITHM_THEORY_DATABASE[slugKey];

  const whatIsIt =
    richDetails?.overview ||
    fallbackInfo?.whatIsIt ||
    richDetails?.description ||
    algorithm.description ||
    `${algorithm.name} is a core algorithm in computer science.`;

  const whyUsed =
    richDetails?.whenToUse ||
    fallbackInfo?.whyUsed ||
    `Used to efficiently process data in ${algorithm.categoryName} problems.`;

  const whereUsed =
    fallbackInfo?.whereUsed ||
    'Software engineering, backend database query optimization, system performance tuning, and technical interview problem solving.';

  const theory =
    fallbackInfo?.theory ||
    `Theoretical Foundation: Executes operations with ${algorithm.timeComplexity || 'O(N)'} time complexity and ${algorithm.spaceComplexity || 'O(1)'} space complexity.`;

  const examples =
    richDetails?.examples && richDetails.examples.length > 0
      ? richDetails.examples.map((e) => ({
          input: e.inputData,
          output: e.outputData,
          explanation: e.explanation || 'Step-by-step algorithmic transformation.',
        }))
      : fallbackInfo?.examples || [
          {
            input: 'Sample Input: [5, 1, 4, 2, 8]',
            output: 'Sample Output: Processed Result',
            explanation: 'Algorithmic state transitions process elements sequentially.',
          },
        ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans text-xs">
      {/* Header with Title & Badges */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-200 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Algorithm Overview & Theory</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Theory
          </button>
          <button
            onClick={() => setActiveTab('why')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'why'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Why & Where
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'examples'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Examples ({examples.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Theory & Core Concepts */}
      {activeTab === 'theory' && (
        <div className="space-y-3">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-purple-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> What is {algorithm.name}?
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{whatIsIt}</p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-cyan-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Theoretical Recurrence & Invariants
            </span>
            <p className="text-slate-300 font-mono text-[11px] leading-relaxed font-medium bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              {theory}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Why & Where Used (Applications) */}
      {activeTab === 'why' && (
        <div className="space-y-3">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-amber-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" /> Why Use This Algorithm?
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{whyUsed}</p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-emerald-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Real-World Applications & Industry Use
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{whereUsed}</p>
          </div>
        </div>
      )}

      {/* Tab 3: Worked Examples */}
      {activeTab === 'examples' && (
        <div className="space-y-3 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
          {examples.map((ex, idx) => (
            <div key={`ex-${idx}`} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-400 uppercase text-[10px] tracking-wider">
                  Example {idx + 1}
                </span>
              </div>

              <div className="space-y-1 text-[11px] font-mono">
                <div className="text-slate-300">
                  <span className="text-slate-500 font-semibold">Input: </span>
                  <span className="text-emerald-300">{ex.input}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 font-semibold">Output: </span>
                  <span className="text-amber-300">{ex.output}</span>
                </div>
              </div>

              {ex.explanation && (
                <p className="text-[11px] text-slate-400 border-t border-slate-900 pt-1.5 leading-relaxed font-sans">
                  <span className="font-bold text-slate-300">Logic: </span>
                  {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Complexities Quick Bar */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 block">Time Complexity</span>
          <span className="text-xs font-mono font-bold text-emerald-400 block">
            {algorithm.timeComplexity || 'O(N)'}
          </span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 block">Space Complexity</span>
          <span className="text-xs font-mono font-bold text-cyan-400 block">
            {algorithm.spaceComplexity || 'O(1)'}
          </span>
        </div>
      </div>
    </div>
  );
};
