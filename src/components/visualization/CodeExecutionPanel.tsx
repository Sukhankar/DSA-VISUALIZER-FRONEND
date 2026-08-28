import React, { useState } from 'react';
import { ActionType, VisualizationStep, AlgorithmImplementation } from '../../types';
import { Code2, Play, Cpu, Check, Layers } from 'lucide-react';

export interface CodeExecutionPanelProps {
  slug: string;
  currentStepData?: VisualizationStep;
  implementations?: AlgorithmImplementation[];
}

type SupportedLanguage = 'pseudocode' | 'java' | 'python' | 'cpp';

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
    },
  },
};


export const CodeExecutionPanel: React.FC<CodeExecutionPanelProps> = ({
  slug,
  currentStepData,
  implementations,
}) => {

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('java');

  const javaImpl = implementations?.find((i) => i.language.toUpperCase() === 'JAVA')?.code;
  const pythonImpl = implementations?.find((i) => i.language.toUpperCase() === 'PYTHON')?.code;
  const cppImpl = implementations?.find((i) => i.language.toUpperCase() === 'CPP' || i.language.toUpperCase() === 'C++')?.code;

  const defaultDef: LanguageCodeDef = {
    lines: [
      `function executeAlgorithm(input):`,
      `  // Initialize data structure`,
      `  initializeState(input)`,
      `  // Process current step`,
      `  processStep(currentElement)`,
      `  // Update state`,
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
  } else {
    langDef = codeSet?.languages[selectedLang] || defaultDef;
  }

  const activeLineNumber = langDef.getActionLine(currentStepData?.action);


  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono select-none">
      {/* Panel Header with Language Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Synchronized Code Execution Line</span>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['pseudocode', 'java', 'python', 'cpp'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                selectedLang === lang
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Body with Line-by-Line Highlight */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 overflow-x-auto text-xs space-y-1.5 leading-relaxed">
        {langDef.lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLineNumber;

          return (
            <div
              key={`code-line-${lineNumber}`}
              className={`flex items-center gap-4 px-3 py-1 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10 translate-x-1'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-6 text-right shrink-0 text-[11px] font-bold ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                {lineNumber}
              </span>

              <div className="flex-1 flex items-center justify-between overflow-x-auto">
                <span className="whitespace-pre font-mono text-slate-200">{line}</span>

                {isActive && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    <Play className="w-2.5 h-2.5 fill-emerald-400" /> Active Line
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Variable & Action State Inspector */}
      {currentStepData && (
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Active Indices:</span>
            <span className="font-bold text-amber-400 font-mono">
              {currentStepData.indices && currentStepData.indices.length > 0
                ? `[${currentStepData.indices.join(', ')}]`
                : 'None'}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Step Action:</span>
            <span className="font-bold text-indigo-400 font-mono">
              {currentStepData.action || 'IDLE'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
