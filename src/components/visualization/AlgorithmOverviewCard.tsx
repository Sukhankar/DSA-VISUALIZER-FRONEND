import React, { useState } from 'react';
import { Algorithm, AlgorithmDetailRichResponse } from '../../types';
import {
  BookOpen,
  Lightbulb,
  Compass,
  FileCode2,
  Layers,
  CheckCircle2,
  Code2,
  ListOrdered,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';

interface AlgorithmOverviewCardProps {
  algorithm: Algorithm;
  richDetails?: AlgorithmDetailRichResponse | null;
}

interface AlgorithmicExample {
  title: string;
  input: string;
  output: string;
  explanation: string;
  dryRun?: string[];
}

interface ComprehensiveAlgorithmTheory {
  whatIsIt: string;
  howItWorks: string[];
  whyUsed: string;
  whereUsed: string;
  theory: string;
  edgeCases: string[];
  examples: AlgorithmicExample[];
  codeSnippets: Record<string, string>;
}

// GeeksforGeeks & W3Schools-grade comprehensive algorithm knowledge base
const COMPREHENSIVE_THEORY_DB: Record<string, ComprehensiveAlgorithmTheory> = {
  '0/1-knapsack-problem-dp': {
    whatIsIt:
      'The 0/1 Knapsack Problem is a classic algorithmic optimization problem in Computer Science and Operations Research. Given a set of N items, each with a specific weight and monetary value, along with a knapsack of capacity W, the goal is to choose a subset of items to maximize the total value such that the cumulative weight does not exceed W. The "0/1" constraint dictates that each item must either be taken in its entirety (1) or left behind (0)—fractional items are not allowed.',
    howItWorks:
      [
        'Create a 2D Dynamic Programming table DP of size (N+1) x (W+1), initialized to 0.',
        'Iterate through each item i from 1 to N, and for each possible sub-capacity w from 0 to W:',
        'If the weight of item i-1 exceeds capacity w, item i-1 cannot be included: DP[i][w] = DP[i-1][w].',
        'Otherwise, compute the maximum between excluding the item (DP[i-1][w]) and including it (values[i-1] + DP[i-1][w - weights[i-1]]).',
        'The cell DP[N][W] contains the optimal maximum value achievable.',
      ],
    whyUsed:
      'A brute-force solution checks all 2^N possible item subsets, which becomes computationally infeasible for N > 30. Dynamic Programming avoids redundant computations by building solutions to overlapping subproblems, reducing runtime to O(N × W).',
    whereUsed:
      'Cloud Resource Allocation (fitting virtual machines into server hardware), Financial Portfolio Optimization, Freight Logistics & Cargo Loading, Submarine Energy Management, and Cryptographic Knapsack Systems.',
    theory:
      'Dynamic Programming State & Recurrence: DP[i][w] = max(DP[i-1][w], values[i-1] + DP[i-1][w - weights[i-1]]) for weights[i-1] <= w.',
    edgeCases: [
      'Capacity W = 0: Maximum value achievable is always 0.',
      'All item weights exceed capacity W: Result is 0.',
      'Item weights or values are zero or single-item array.',
    ],
    examples: [
      {
        title: 'Example 1: Standard Knapsack Capacity (N=4, W=5)',
        input: 'Weights = [2, 3, 4, 5], Values = [3, 4, 5, 6], Knapsack W = 5',
        output: 'Maximum Achievable Value = 7',
        explanation:
          'We evaluate item subsets. Selecting Item 1 (wt=2, val=3) and Item 2 (wt=3, val=4) gives total weight 2+3=5 <= 5 and total value 3+4=7. Selecting Item 3 alone gives val=5; Item 4 alone gives val=6. Thus, {Item 1, Item 2} is optimal.',
        dryRun: [
          'Item 1 (wt 2, val 3): DP[1][2..5] = 3',
          'Item 2 (wt 3, val 4): DP[2][3]=4, DP[2][5] = max(3, 4 + DP[1][2]) = 4 + 3 = 7',
          'Item 3 (wt 4, val 5): DP[3][5] = max(7, 5 + DP[2][1]) = max(7, 5) = 7',
          'Final optimal cell DP[4][5] = 7',
        ],
      },
      {
        title: 'Example 2: High Value Heavy Item Choice (N=3, W=6)',
        input: 'Weights = [3, 2, 4], Values = [6, 8, 12], Knapsack W = 6',
        output: 'Maximum Achievable Value = 20',
        explanation:
          'Item 2 (wt=2, val=8) and Item 3 (wt=4, val=12) sum to weight 2+4=6 <= 6, producing total value 8+12=20.',
        dryRun: [
          'Subproblem capacity W=6:',
          'Option A: Item 1 + Item 2 (wt 5, val 14)',
          'Option B: Item 2 + Item 3 (wt 6, val 20) -> OPTIMAL',
        ],
      },
    ],
    codeSnippets: {
      java: `public class Knapsack {
    public static int solveKnapsack(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];
        
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][W];
    }
}`,
      python: `def solve_knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(W + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`,
      cpp: `#include <vector>
#include <algorithm>

int solveKnapsack(const std::vector<int>& weights, const std::vector<int>& values, int W) {
    int n = weights.size();
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(W + 1, 0));
    
    for (int i = 1; i <= n; ++i) {
        for (int w = 0; w <= W; ++w) {
            if (weights[i - 1] <= w) {
                dp[i][w] = std::max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
      javascript: `function solveKnapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}`,
    },
  },
  'binary-search': {
    whatIsIt:
      'Binary Search is a benchmark logarithmic divide-and-conquer searching algorithm. It rapidly locates the position of a target key within a strictly sorted array by repeatedly inspecting the middle element andhalving the search range.',
    howItWorks: [
      'Initialize pointer low = 0 and high = array.length - 1.',
      'While low <= high, compute middle index mid = low + (high - low) / 2 to prevent integer overflow.',
      'Compare array[mid] with the target key:',
      'If array[mid] == target, return index mid (target found!).',
      'If array[mid] < target, discard the left half by setting low = mid + 1.',
      'If array[mid] > target, discard the right half by setting high = mid - 1.',
      'If low exceeds high, return -1 (target not present).',
    ],
    whyUsed:
      'Linear Search requires inspecting every element (O(N) time), whereas Binary Search eliminates 50% of the remaining search space per step, taking only O(log N) time (e.g., searching 1,000,000 items takes at most 20 comparisons).',
    whereUsed:
      'Database B-Tree and LSM-Tree indexing, Git Bisect regression debugging, Dictionary lookup engines, Standard Template Library (std::lower_bound), and Autocomplete systems.',
    theory:
      'Search Space Invariant: At iteration k, search interval length L_k = N / 2^k. Solving N / 2^k = 1 yields k = log2(N).',
    edgeCases: [
      'Target element is smaller than array[0] or larger than array[N-1].',
      'Array contains 1 element.',
      'Array contains duplicate values (requires lower_bound variant).',
    ],
    examples: [
      {
        title: 'Example 1: Target Exists in Middle Range',
        input: 'Array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target = 23',
        output: 'Target Index = 5',
        explanation:
          'Pass 1: low=0, high=9 -> mid=4 (arr[4]=16 < 23) -> low=5.\nPass 2: low=5, high=9 -> mid=7 (arr[7]=56 > 23) -> high=6.\nPass 3: low=5, high=6 -> mid=5 (arr[5]=23 == 23) -> Match Found at Index 5.',
        dryRun: [
          'Pass 1: low=0, high=9, mid=4 (val=16) -> 16 < 23 -> low=5',
          'Pass 2: low=5, high=9, mid=7 (val=56) -> 56 > 23 -> high=6',
          'Pass 3: low=5, high=6, mid=5 (val=23) -> MATCH FOUND!',
        ],
      },
      {
        title: 'Example 2: Target Absent from Array',
        input: 'Array = [1, 3, 7, 9, 14, 20], Target = 12',
        output: 'Index = -1 (Not Found)',
        explanation:
          'Range shrinks from [0..5] to [4..5] to [4..3]. Search terminates with low > high.',
        dryRun: [
          'Pass 1: mid=2 (val=7 < 12) -> low=3',
          'Pass 2: mid=4 (val=14 > 12) -> high=3',
          'Terminates: low(3) > high(3) -> return -1',
        ],
      },
    ],
    codeSnippets: {
      java: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      cpp: `int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    },
  },
  'bubble-sort': {
    whatIsIt:
      'Bubble Sort is an elementary comparison-based sorting algorithm. It works by repeatedly traversing the input array, comparing adjacent element pairs, and swapping them if they are out of order. Smaller values "bubble" towards the beginning while larger values sink towards the end.',
    howItWorks: [
      'Pass i ranges from 0 to N-2.',
      'Inner loop j ranges from 0 to N - i - 2.',
      'Compare arr[j] and arr[j+1]. If arr[j] > arr[j+1], swap them.',
      'Maintain a boolean swapped flag. If no swaps occur during an entire pass, terminate early (array is sorted).',
    ],
    whyUsed:
      'Serves as an essential educational foundation for understanding algorithmic invariants, adjacent comparisons, and early-exit flags. It is O(N) for pre-sorted input.',
    whereUsed:
      'Computer Science education curricula, detecting near-sorted state in low-power microcontrollers, graphics hardware register sorting.',
    theory:
      'Bubble Invariant: After pass i, the largest unSorted element is guaranteed to occupy its final correct index N - 1 - i.',
    edgeCases: [
      'Array is already sorted in ascending order (best case O(N)).',
      'Array is sorted in reverse descending order (worst case O(N^2)).',
      'Array contains all identical elements.',
    ],
    examples: [
      {
        title: 'Example 1: Unsorted 5-Element Array',
        input: 'Array = [5, 1, 4, 2, 8]',
        output: 'Sorted Array = [1, 2, 4, 5, 8]',
        explanation:
          'Pass 1 compares (5,1)->swap[1,5,4,2,8], (5,4)->swap[1,4,5,2,8], (5,2)->swap[1,4,2,5,8], (5,8)->no swap. Largest 8 placed at end.\nSubsequent passes sort 5, 4, 2, 1.',
        dryRun: [
          'Pass 1 Result: [1, 4, 2, 5, 8] (8 sorted)',
          'Pass 2 Result: [1, 2, 4, 5, 8] (5 sorted)',
          'Pass 3: No swaps -> Early Exit!',
        ],
      },
    ],
    codeSnippets: {
      java: `public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      cpp: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    for (int i = 0; i < n - 1; ++i) {
        swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    },
  },
};

export const AlgorithmOverviewCard: React.FC<AlgorithmOverviewCardProps> = ({
  algorithm,
  richDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'why' | 'examples' | 'code'>('theory');
  const [selectedCodeLang, setSelectedCodeLang] = useState<'java' | 'python' | 'cpp' | 'javascript'>('java');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const slugKey = algorithm.slug.toLowerCase();
  const dbInfo = COMPREHENSIVE_THEORY_DB[slugKey];

  const whatIsIt =
    richDetails?.overview ||
    dbInfo?.whatIsIt ||
    richDetails?.description ||
    algorithm.description ||
    `${algorithm.name} is an important algorithm in computer science.`;

  const howItWorks = dbInfo?.howItWorks || [
    'Initialize required data structures and state variables.',
    'Iterate through elements or state space step-by-step.',
    'Apply core algorithmic comparison or transition logic.',
    'Return processed optimal result.',
  ];

  const whyUsed =
    richDetails?.whenToUse ||
    dbInfo?.whyUsed ||
    `Provides optimal performance when processing ${algorithm.categoryName} problems compared to naive brute-force approaches.`;

  const whereUsed =
    dbInfo?.whereUsed ||
    'Software systems, query processing engines, technical interview challenges, and enterprise algorithm pipelines.';

  const theory =
    dbInfo?.theory ||
    `Theoretical Complexity Bounds: Operates in ${algorithm.timeComplexity || 'O(N)'} time complexity and ${algorithm.spaceComplexity || 'O(1)'} space complexity.`;

  const edgeCases = dbInfo?.edgeCases || [
    'Empty input array or single element.',
    'Input contains duplicates or extreme values.',
    'Boundary threshold capacities.',
  ];

  const examples: AlgorithmicExample[] =
    dbInfo?.examples ||
    (richDetails?.examples && richDetails.examples.length > 0
      ? richDetails.examples.map((e) => ({
          title: `Example ${e.exampleNumber}: ${e.title || 'Algorithmic Sample'}`,
          input: e.inputData,
          output: e.outputData,
          explanation: e.explanation || 'Step-by-step logic processing.',
        }))
      : [
          {
            title: 'Example 1: Default Test Input',
            input: 'Input = [5, 1, 4, 2, 8]',
            output: 'Output = Processed Result',
            explanation: 'Algorithmic state transitions process elements sequentially.',
          },
        ]);

  // Code snippets resolution
  const codeSnippets = dbInfo?.codeSnippets || {
    java: richDetails?.implementations?.find((i) => i.language.toUpperCase() === 'JAVA')?.code || '// Code snippet loading...',
    python: richDetails?.implementations?.find((i) => i.language.toUpperCase() === 'PYTHON')?.code || '# Code snippet loading...',
    cpp: richDetails?.implementations?.find((i) => i.language.toUpperCase() === 'CPP' || i.language.toUpperCase() === 'C++')?.code || '// Code snippet loading...',
    javascript: '// JavaScript code implementation...',
  };

  const handleCopyCode = () => {
    const codeToCopy = codeSnippets[selectedCodeLang];
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans text-xs">
      {/* Card Header with Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-200 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Algorithm Master Guide</span>
        </div>

        {/* Tab Navigation Controls (GFG / W3Schools style) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap">
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

          <button
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code Snippets
          </button>
        </div>
      </div>

      {/* Tab 1: Detailed Theory & Step-by-Step Execution */}
      {activeTab === 'theory' && (
        <div className="space-y-3.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {/* Concept Overview */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-purple-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> What is {algorithm.name}?
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{whatIsIt}</p>
          </div>

          {/* How It Works Step-by-Step */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <span className="font-extrabold text-indigo-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <ListOrdered className="w-3.5 h-3.5" /> How It Works (Step-by-Step Algorithm Strategy)
            </span>
            <ul className="space-y-1.5 pl-1">
              {howItWorks.map((step, idx) => (
                <li key={`step-${idx}`} className="flex items-start gap-2 text-[11px] text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-indigo-950 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Theoretical Recurrence & Formulas */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-cyan-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Mathematical Invariants & Recurrence
            </span>
            <p className="text-slate-300 font-mono text-[11px] leading-relaxed font-medium bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 whitespace-pre-wrap">
              {theory}
            </p>
          </div>

          {/* Corner & Edge Cases */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-amber-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Corner & Edge Cases to Consider
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400 font-medium">
              {edgeCases.map((ec, idx) => (
                <li key={`ec-${idx}`}>{ec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Why & Where Used (Real-World Applications) */}
      {activeTab === 'why' && (
        <div className="space-y-3.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-amber-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" /> Why Use {algorithm.name}?
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{whyUsed}</p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="font-extrabold text-emerald-400 uppercase text-[10px] tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Real-World Systems & Industry Applications
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{whereUsed}</p>
          </div>
        </div>
      )}

      {/* Tab 3: Multiple Worked Examples with Step-by-Step Dry Runs */}
      {activeTab === 'examples' && (
        <div className="space-y-3.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {examples.map((ex, idx) => (
            <div key={`ex-${idx}`} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-extrabold text-indigo-400 text-xs">
                  {ex.title}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Input Data:</span>
                  <span className="text-emerald-300 block">{ex.input}</span>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Expected Output:</span>
                  <span className="text-amber-300 block">{ex.output}</span>
                </div>
              </div>

              <div className="pt-1 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Intuition & Explanation:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{ex.explanation}</p>
              </div>

              {ex.dryRun && ex.dryRun.length > 0 && (
                <div className="pt-2 border-t border-slate-900 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase block">Step-by-Step Dry Run:</span>
                  <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/60 font-mono text-[10px] space-y-1 text-slate-300">
                    {ex.dryRun.map((dr, drIdx) => (
                      <div key={`dr-${drIdx}`} className="flex items-center gap-2">
                        <span className="text-cyan-500 font-bold">•</span>
                        <span>{dr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Multi-Language Code Snippets (GFG / W3Schools Style) */}
      {activeTab === 'code' && (
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1">
              {(['java', 'python', 'cpp', 'javascript'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedCodeLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    selectedCodeLang === lang
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" /> Copy Code
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-900 max-h-[300px] overflow-y-auto text-[11px] leading-relaxed custom-scrollbar">
            <pre className="text-slate-200 whitespace-pre font-mono">
              {codeSnippets[selectedCodeLang] || '// Code snippet not available.'}
            </pre>
          </div>
        </div>
      )}

      {/* Complexities Footer Bar */}
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
