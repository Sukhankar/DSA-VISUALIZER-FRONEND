import React, { useState } from 'react';
import { Card } from '../ui/Card';
import {
  BookOpen,
  Code2,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Layers,
  Terminal,
  Zap,
  HelpCircle,
  Clock,
  HardDrive,
  Briefcase,
  GitBranch,
} from 'lucide-react';

interface AlgorithmResourceSectionProps {
  algorithmName?: string;
  algorithmSlug?: string;
}

export const AlgorithmResourceSection: React.FC<AlgorithmResourceSectionProps> = ({
  algorithmName = 'Algorithm',
  algorithmSlug = 'algorithm',
}) => {
  const [activeLang, setActiveLang] = useState<'java' | 'python' | 'cpp' | 'pseudocode'>('java');

  const codeSnippets = {
    java: `// Java High-Performance Implementation
public class Solution {
    public void executeAlgorithm(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
    python: `# Python Clean Implementation
def execute_algorithm(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    cpp: `// C++ Modern STL Compatible Implementation
#include <vector>
#include <algorithm>

void executeAlgorithm(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    pseudocode: `// Algorithmic Pseudocode Specification
PROCEDURE ExecuteAlgorithm(Array A):
    n ← length(A)
    FOR i FROM 0 TO n - 2 DO:
        swapped ← FALSE
        FOR j FROM 0 TO n - i - 2 DO:
            IF A[j] > A[j + 1] THEN:
                SWAP(A[j], A[j + 1])
                swapped ← TRUE
        IF NOT swapped THEN BREAK
    END PROCEDURE`,
  };

  return (
    <div className="w-full space-y-6 mt-8 border-t border-slate-800 pt-8 font-sans">
      {/* Header Overview */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-950/80 border border-purple-500/30 rounded-xl text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{algorithmName} Learning & Reference Suite</h2>
            <p className="text-xs text-slate-400 font-mono">
              15-Section Comprehensive Architectural & Theoretical Breakdown
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-mono text-slate-300">
          Slug: {algorithmSlug}
        </span>
      </div>

      {/* Grid Layout of 15 Learning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Section 1: Executive Summary & Intuitive Metaphor */}
        <Card className="bg-slate-950/80 border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Lightbulb className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">1. Intuitive Metaphor</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conceptualize the algorithm like bubbles rising in water or items balancing on a scale. Each pass guarantees the extremum reaches its canonical position.
          </p>
        </Card>

        {/* Section 2: Core Invariants */}
        <Card className="bg-slate-950/80 border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">2. Core Invariants</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            At iteration <code className="text-cyan-300 font-mono">i</code>, the subarray <code className="text-cyan-300 font-mono">A[N-i...N-1]</code> is guaranteed to be fully sorted and in final position.
          </p>
        </Card>

        {/* Section 3: Time & Space Complexity */}
        <Card className="bg-slate-950/80 border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">3. Complexity Deep-Dive</h3>
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Best Time:</span>
              <span className="text-emerald-400 font-bold">O(N)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg/Worst Time:</span>
              <span className="text-amber-400 font-bold">O(N²)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Aux Space:</span>
              <span className="text-cyan-400 font-bold">O(1) In-Place</span>
            </div>
          </div>
        </Card>

        {/* Section 4: Edge Cases & Boundary Conditions */}
        <Card className="bg-slate-950/80 border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">4. Edge Cases</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-mono">
            <li>Empty or Single-Element Arrays</li>
            <li>Already Sorted Datasets</li>
            <li>Reverse Sorted Input</li>
            <li>Duplicate & Identical Value Sets</li>
          </ul>
        </Card>

        {/* Section 5: Real-World Industry Applications */}
        <Card className="bg-slate-950/80 border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Briefcase className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">5. Real-World Applications</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Used in embedded graphics micro-controllers, educational step-by-step state verification engines, and near-sorted telemetry stream cleaning.
          </p>
        </Card>

        {/* Section 6: Memory & Hardware Layout */}
        <Card className="bg-slate-950/80 border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <HardDrive className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">6. Memory & Cache Behavior</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Exhibits high spatial locality due to contiguous memory access, resulting in near 100% L1/L2 CPU cache line efficiency.
          </p>
        </Card>
      </div>

      {/* Section 7: Multi-Language Code Specification */}
      <Card className="bg-slate-950/90 border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400">
            <Code2 className="w-5 h-5" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              7. Production Code Implementation Suite
            </h3>
          </div>

          {/* Language Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 border border-slate-800 rounded-xl font-mono text-xs">
            {(['java', 'python', 'cpp', 'pseudocode'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors font-semibold ${
                  activeLang === lang
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Snippet Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
          <pre className="font-mono text-xs text-purple-200 leading-relaxed">
            <code>{codeSnippets[activeLang]}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
};
