import React, { useState } from 'react';
import { ActionType, VisualizationStep, AlgorithmImplementation } from '../../types';
import { Code2, Play, Cpu, Check, Layers, Variable } from 'lucide-react';

import { LearningLevel } from '../../types';

export interface CodeExecutionPanelProps {
  slug: string;
  currentStepData?: VisualizationStep;
  implementations?: AlgorithmImplementation[];
  level?: LearningLevel;
}


type SupportedLanguage = 'pseudocode' | 'java' | 'python' | 'cpp' | 'javascript';

interface LanguageCodeDef {
  lines: string[];
  getActionLine: (action?: ActionType) => number;
}

interface AlgorithmCodeSet {
  title: string;
  languages: Record<SupportedLanguage, LanguageCodeDef>;
}

const ALGORITHM_CODE_SETS: Record<string, AlgorithmCodeSet> = {
  'bubble-sort': {
    title: 'Bubble Sort Algorithm',
    languages: {
      pseudocode: {
        lines: [
          'function bubbleSort(arr):',
          '  n = arr.length',
          '  for i = 0 to n - 1:',
          '    for j = 0 to n - i - 2:',
          '      if arr[j] > arr[j + 1]:',
          '        swap(arr[j], arr[j + 1])',
          '      else: no swap required',
          '  return arr',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'COMPARE': return 5;
            case 'SWAP': return 6;
            case 'NO_SWAP': return 7;
            case 'COMPLETE': return 8;
            default: return 5;
          }
        },
      },
      java: {
        lines: [
          'public void bubbleSort(int[] arr) {',
          '    int n = arr.length;',
          '    for (int i = 0; i < n - 1; i++) {',
          '        for (int j = 0; j < n - i - 1; j++) {',
          '            if (arr[j] > arr[j + 1]) {',
          '                int temp = arr[j];',
          '                arr[j] = arr[j + 1];',
          '                arr[j + 1] = temp;',
          '            }',
          '        }',
          '    }',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'COMPARE': return 5;
            case 'SWAP': return 6;
            case 'NO_SWAP': return 4;
            case 'COMPLETE': return 12;
            default: return 5;
          }
        },
      },
      python: {
        lines: [
          'def bubble_sort(arr):',
          '    n = len(arr)',
          '    for i in range(n - 1):',
          '        for j in range(n - i - 1):',
          '            if arr[j] > arr[j + 1]:',
          '                arr[j], arr[j + 1] = arr[j + 1], arr[j]',
          '    return arr',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'COMPARE': return 5;
            case 'SWAP': return 6;
            case 'NO_SWAP': return 4;
            case 'COMPLETE': return 7;
            default: return 5;
          }
        },
      },
      cpp: {
        lines: [
          'void bubbleSort(vector<int>& arr) {',
          '    int n = arr.size();',
          '    for (int i = 0; i < n - 1; i++) {',
          '        for (int j = 0; j < n - i - 1; j++) {',
          '            if (arr[j] > arr[j + 1]) {',
          '                std::swap(arr[j], arr[j + 1]);',
          '            }',
          '        }',
          '    }',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'COMPARE': return 5;
            case 'SWAP': return 6;
            case 'NO_SWAP': return 4;
            case 'COMPLETE': return 10;
            default: return 5;
          }
        },
      },
      javascript: {
        lines: [
          'function bubbleSort(arr) {',
          '  const n = arr.length;',
          '  for (let i = 0; i < n - 1; i++) {',
          '    for (let j = 0; j < n - i - 1; j++) {',
          '      if (arr[j] > arr[j + 1]) {',
          '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
          '      }',
          '    }',
          '  }',
          '  return arr;',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'COMPARE': return 5;
            case 'SWAP': return 6;
            case 'NO_SWAP': return 4;
            case 'COMPLETE': return 10;
            default: return 5;
          }
        },
      },
    },
  },
  'quick-sort': {
    title: 'Quick Sort Algorithm',
    languages: {
      pseudocode: {
        lines: [
          'function quickSort(arr, low, high):',
          '  if low < high:',
          '    pivot = arr[high]',
          '    pIndex = partition(arr, low, high)',
          '    if arr[j] <= pivot:',
          '      swap(arr[i], arr[j])',
          '    swap(arr[i + 1], arr[high])',
          '  return arr',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'SELECT': return 3;
            case 'COMPARE': return 5;
            case 'SWAP': return 6;
            case 'COMPLETE': return 8;
            default: return 5;
          }
        },
      },
      java: {
        lines: [
          'public void quickSort(int[] arr, int low, int high) {',
          '    if (low < high) {',
          '        int pivot = arr[high];',
          '        int i = low - 1;',
          '        for (int j = low; j < high; j++) {',
          '            if (arr[j] <= pivot) {',
          '                i++;',
          '                swap(arr, i, j);',
          '            }',
          '        }',
          '        swap(arr, i + 1, high);',
          '    }',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'SELECT': return 3;
            case 'COMPARE': return 6;
            case 'SWAP': return 8;
            case 'COMPLETE': return 13;
            default: return 6;
          }
        },
      },
      python: {
        lines: [
          'def quick_sort(arr, low, high):',
          '    if low < high:',
          '        pivot = arr[high]',
          '        i = low - 1',
          '        for j in range(low, high):',
          '            if arr[j] <= pivot:',
          '                i += 1',
          '                arr[i], arr[j] = arr[j], arr[i]',
          '        arr[i + 1], arr[high] = arr[high], arr[i + 1]',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'SELECT': return 3;
            case 'COMPARE': return 6;
            case 'SWAP': return 8;
            case 'COMPLETE': return 9;
            default: return 6;
          }
        },
      },
      cpp: {
        lines: [
          'void quickSort(vector<int>& arr, int low, int high) {',
          '    if (low < high) {',
          '        int pivot = arr[high];',
          '        int i = low - 1;',
          '        for (int j = low; j < high; j++) {',
          '            if (arr[j] <= pivot) {',
          '                i++;',
          '                swap(arr[i], arr[j]);',
          '            }',
          '        }',
          '        swap(arr[i + 1], arr[high]);',
          '    }',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'SELECT': return 3;
            case 'COMPARE': return 6;
            case 'SWAP': return 8;
            case 'COMPLETE': return 13;
            default: return 6;
          }
        },
      },
      javascript: {
        lines: [
          'function quickSort(arr, low = 0, high = arr.length - 1) {',
          '  if (low < high) {',
          '    const pivot = arr[high];',
          '    let i = low - 1;',
          '    for (let j = low; j < high; j++) {',
          '      if (arr[j] <= pivot) {',
          '        i++;',
          '        [arr[i], arr[j]] = [arr[j], arr[i]];',
          '      }',
          '    }',
          '    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];',
          '  }',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 1;
            case 'SELECT': return 3;
            case 'COMPARE': return 6;
            case 'SWAP': return 8;
            case 'COMPLETE': return 12;
            default: return 6;
          }
        },
      },
    },
  },
  'binary-search': {
    title: 'Binary Search Algorithm',
    languages: {
      pseudocode: {
        lines: [
          'function binarySearch(arr, target):',
          '  low = 0, high = arr.length - 1',
          '  while low <= high:',
          '    mid = Math.floor((low + high) / 2)',
          '    if arr[mid] == target: return mid',
          '    else if arr[mid] < target: low = mid + 1',
          '    else: high = mid - 1',
          '  return -1',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 2;
            case 'SELECT': return 4;
            case 'FOUND': return 5;
            case 'COMPARE': return 6;
            case 'NOT_FOUND': return 8;
            case 'COMPLETE': return 8;
            default: return 4;
          }
        },
      },
      java: {
        lines: [
          'public int binarySearch(int[] arr, int target) {',
          '    int low = 0, high = arr.length - 1;',
          '    while (low <= high) {',
          '        int mid = low + (high - low) / 2;',
          '        if (arr[mid] == target) return mid;',
          '        else if (arr[mid] < target) low = mid + 1;',
          '        else high = mid - 1;',
          '    }',
          '    return -1;',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 2;
            case 'SELECT': return 4;
            case 'FOUND': return 5;
            case 'COMPARE': return 6;
            case 'NOT_FOUND': return 9;
            case 'COMPLETE': return 9;
            default: return 4;
          }
        },
      },
      python: {
        lines: [
          'def binary_search(arr, target):',
          '    low, high = 0, len(arr) - 1',
          '    while low <= high:',
          '        mid = (low + high) // 2',
          '        if arr[mid] == target:',
          '            return mid',
          '        elif arr[mid] < target:',
          '            low = mid + 1',
          '        else:',
          '            high = mid - 1',
          '    return -1',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 2;
            case 'SELECT': return 4;
            case 'FOUND': return 6;
            case 'COMPARE': return 7;
            case 'NOT_FOUND': return 11;
            case 'COMPLETE': return 11;
            default: return 4;
          }
        },
      },
      cpp: {
        lines: [
          'int binarySearch(const vector<int>& arr, int target) {',
          '    int low = 0, high = arr.size() - 1;',
          '    while (low <= high) {',
          '        int mid = low + (high - low) / 2;',
          '        if (arr[mid] == target) return mid;',
          '        else if (arr[mid] < target) low = mid + 1;',
          '        else high = mid - 1;',
          '    }',
          '    return -1;',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 2;
            case 'SELECT': return 4;
            case 'FOUND': return 5;
            case 'COMPARE': return 6;
            case 'NOT_FOUND': return 9;
            case 'COMPLETE': return 9;
            default: return 4;
          }
        },
      },
      javascript: {
        lines: [
          'function binarySearch(arr, target) {',
          '  let low = 0, high = arr.length - 1;',
          '  while (low <= high) {',
          '    const mid = Math.floor(low + (high - low) / 2);',
          '    if (arr[mid] === target) return mid;',
          '    if (arr[mid] < target) low = mid + 1;',
          '    else high = mid - 1;',
          '  }',
          '  return -1;',
          '}',
        ],
        getActionLine: (action) => {
          switch (action) {
            case 'INITIAL': return 2;
            case 'SELECT': return 4;
            case 'FOUND': return 5;
            case 'COMPARE': return 6;
            case 'NOT_FOUND': return 9;
            case 'COMPLETE': return 9;
            default: return 4;
          }
        },
      },
    },
  },
};

export const CodeExecutionPanel: React.FC<CodeExecutionPanelProps> = ({
  slug,
  currentStepData,
  implementations,
  level = 'BEGINNER',
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('java');

  // Helper for Why This Line explanations
  const getLineExplanation = (action?: ActionType, lvl?: LearningLevel): string => {
    if (lvl === 'BEGINNER') {
      switch (action) {
        case 'INITIAL': return 'Line initializes tracking variables so we know where to start looking.';
        case 'COMPARE': return 'Line compares two values to see if they need to be reordered or selected.';
        case 'SWAP': return 'Line swaps out-of-order elements so larger items move right.';
        case 'FOUND': return 'Line returns the matching target index since we found our item!';
        case 'COMPLETE': return 'Line finishes execution and returns the final optimal result.';
        default: return 'Line advances algorithm execution state.';
      }
    } else if (lvl === 'ADVANCED') {
      switch (action) {
        case 'INITIAL': return 'Allocates stack memory and sets loop invariants P(0).';
        case 'COMPARE': return 'Executes relational comparison opcode; branch prediction target evaluated.';
        case 'SWAP': return 'Performs in-place element permutation (XOR/temp) maintaining range invariant.';
        case 'FOUND': return 'Evaluates search space termination predicate and returns index offset.';
        case 'COMPLETE': return 'Loop post-condition holds; satisfies worst-case asymptotic upper bounds.';
        default: return 'Performs atomic state transition operation.';
      }
    } else {
      // INTERMEDIATE
      switch (action) {
        case 'INITIAL': return 'Sets up array length and loop pointers for boundary tracking.';
        case 'COMPARE': return 'Evaluates conditional logic A[j] vs A[j+1] against sorting criteria.';
        case 'SWAP': return 'Mutates array state in-place to resolve inversion pairs.';
        case 'FOUND': return 'Target value located in O(log N) or O(N) operations.';
        case 'COMPLETE': return 'Algorithm completes processing with zero remaining inversions.';
        default: return 'Executes current step logic.';
      }
    }
  };

  const lineExplanation = getLineExplanation(currentStepData?.action, level);


  const javaImpl = implementations?.find((i) => i.language.toUpperCase() === 'JAVA')?.code;
  const pythonImpl = implementations?.find((i) => i.language.toUpperCase() === 'PYTHON')?.code;
  const cppImpl = implementations?.find((i) => i.language.toUpperCase() === 'CPP' || i.language.toUpperCase() === 'C++')?.code;
  const jsImpl = implementations?.find((i) => i.language.toUpperCase() === 'JAVASCRIPT' || i.language.toUpperCase() === 'JS')?.code;

  const defaultDef: LanguageCodeDef = {
    lines: [
      `function executeAlgorithm(input):`,
      `  // Initialize state and pointers`,
      `  initializeState(input)`,
      `  // Process current element step`,
      `  processStep(currentElement)`,
      `  // Update indices and variables`,
      `  updateState(indices)`,
      `  return result`,
    ],
    getActionLine: (action) => {
      switch (action) {
        case 'INITIAL': return 3;
        case 'COMPARE': return 5;
        case 'SWAP': return 7;
        case 'COMPLETE': return 8;
        default: return 5;
      }
    },
  };

  const codeSet = ALGORITHM_CODE_SETS[slug];

  let langDef: LanguageCodeDef;

  if (selectedLang === 'java' && javaImpl) {
    langDef = {
      lines: javaImpl.split('\n'),
      getActionLine: (action) => (action === 'COMPLETE' ? javaImpl.split('\n').length : 3),
    };
  } else if (selectedLang === 'python' && pythonImpl) {
    langDef = {
      lines: pythonImpl.split('\n'),
      getActionLine: (action) => (action === 'COMPLETE' ? pythonImpl.split('\n').length : 3),
    };
  } else if (selectedLang === 'cpp' && cppImpl) {
    langDef = {
      lines: cppImpl.split('\n'),
      getActionLine: (action) => (action === 'COMPLETE' ? cppImpl.split('\n').length : 3),
    };
  } else if (selectedLang === 'javascript' && jsImpl) {
    langDef = {
      lines: jsImpl.split('\n'),
      getActionLine: (action) => (action === 'COMPLETE' ? jsImpl.split('\n').length : 3),
    };
  } else {
    langDef = codeSet?.languages[selectedLang] || defaultDef;
  }

  const activeLineNumber =
    currentStepData?.codeLineMap?.[selectedLang] ??
    langDef.getActionLine(currentStepData?.action);

  const codeContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!codeContainerRef.current) return;
    const activeEl = codeContainerRef.current.querySelector('.code-line-active');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeLineNumber]);

  // Extract runtime variables for inspector
  const indicesStr =
    currentStepData?.indices && currentStepData.indices.length > 0
      ? `[${currentStepData.indices.join(', ')}]`
      : 'None';

  const valuesStr =
    currentStepData?.array && currentStepData.indices && currentStepData.indices.length > 0
      ? currentStepData.indices.map((i) => currentStepData.array?.[i]).filter((v) => v !== undefined).join(', ')
      : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 font-sans">
      {/* Panel Header with Language Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Code Execution</span>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full custom-scrollbar">
          {(['pseudocode', 'java', 'python', 'cpp', 'javascript'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer whitespace-nowrap ${
                selectedLang === lang
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'javascript' ? 'JS' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Body with Line-by-Line Highlight and max height scrolling */}
      <div
        ref={codeContainerRef}
        className="bg-slate-950 rounded-xl p-3 border border-slate-900 overflow-y-auto max-h-[280px] text-xs space-y-1 leading-relaxed custom-scrollbar font-mono"
      >
        {langDef.lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLineNumber;

          return (
            <div
              key={`code-line-${lineNumber}`}
              className={`flex items-center gap-3 px-2.5 py-1 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'code-line-active bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10 translate-x-0.5'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-5 text-right shrink-0 text-[10px] font-bold ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                {lineNumber}
              </span>

              <div className="flex-1 flex items-center justify-between overflow-x-auto">
                <span className="whitespace-pre font-mono text-[11px] text-slate-200">{line}</span>

                {isActive && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0 ml-2 font-sans font-bold">
                    <Play className="w-2 h-2 fill-emerald-400" /> Line {lineNumber} Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>


      {/* WHY THIS LINE? Pedagogical Callout */}
      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1 font-sans">
        <span className="font-extrabold text-emerald-400 uppercase text-[10px] tracking-wider block">
          Why Line #{activeLineNumber}? ({level} Level)
        </span>
        <p className="text-slate-300 leading-relaxed font-medium">{lineExplanation}</p>
      </div>

      {/* CURRENT STATE Runtime Variable Inspector (Requirement #9 & #10) */}

      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 font-sans">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <Variable className="w-3.5 h-3.5" /> Current State Inspector
          </span>
          {currentStepData?.action && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              {currentStepData.action}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-500 font-medium">Indices:</span>
            <span className="font-bold text-amber-400">{indicesStr}</span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-500 font-medium">Current Line:</span>
            <span className="font-bold text-emerald-400">#{activeLineNumber}</span>
          </div>

          {valuesStr !== null && (
            <div className="col-span-2 flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 font-medium">Inspected Values:</span>
              <span className="font-bold text-cyan-300">{valuesStr}</span>
            </div>
          )}

          {currentStepData?.currentNode && (
            <div className="col-span-2 flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 font-medium">Current Node:</span>
              <span className="font-bold text-purple-300">{currentStepData.currentNode}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
