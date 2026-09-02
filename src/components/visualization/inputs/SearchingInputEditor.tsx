import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Shuffle, RotateCcw, AlertTriangle, Check, ArrowRight } from 'lucide-react';

interface SearchingInputEditorProps {
  inputState: VisualizationInputState;
  isBinarySearch?: boolean;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const SearchingInputEditor: React.FC<SearchingInputEditorProps> = ({
  inputState,
  isBinarySearch = false,
  onChange,
  onResetSample,
}) => {
  const currentArray = inputState.input || [1, 3, 5, 7, 9, 11, 13, 15];
  const currentTarget = inputState.target !== undefined ? inputState.target : 7;

  const [rawText, setRawText] = useState<string>(currentArray.join(', '));
  const [targetVal, setTargetVal] = useState<string>(String(currentTarget));
  const [isSorted, setIsSorted] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkSorted = (arr: number[]): boolean => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };

  useEffect(() => {
    setRawText((inputState.input || [1, 3, 5, 7, 9, 11, 13, 15]).join(', '));
    setTargetVal(String(inputState.target !== undefined ? inputState.target : 7));
    setIsSorted(checkSorted(inputState.input || []));
  }, [inputState.input, inputState.target]);

  const updateState = (arr: number[], target: number) => {
    const sorted = checkSorted(arr);
    setIsSorted(sorted);

    onChange({
      ...inputState,
      input: arr,
      target: target,
      customDataUsed: true,
    });
  };

  const handleArrayChange = (val: string) => {
    setRawText(val);
    const tokens = val.split(/[\s,]+/).filter((t) => t.length > 0);
    const nums: number[] = [];

    for (const t of tokens) {
      const num = Number(t);
      if (isNaN(num)) {
        setErrorMsg('✕ Array contains non-numeric values.');
        return;
      }
      nums.push(num);
    }

    if (nums.length === 0) {
      setErrorMsg('✕ Array cannot be empty.');
      return;
    }

    setErrorMsg(null);
    const target = targetVal !== '' ? Number(targetVal) : 7;
    updateState(nums, target);
  };

  const handleTargetChange = (val: string) => {
    setTargetVal(val);
    const tNum = Number(val);
    if (!isNaN(tNum)) {
      updateState(currentArray, tNum);
    }
  };

  const handleAutoSort = () => {
    const sorted = [...currentArray].sort((a, b) => a - b);
    setRawText(sorted.join(', '));
    setErrorMsg(null);
    updateState(sorted, Number(targetVal) || 7);
  };

  const handleRandomize = () => {
    const count = 7;
    const nums = Array.from({ length: count }, () => Math.floor(Math.random() * 80) + 1);
    if (isBinarySearch) {
      nums.sort((a, b) => a - b);
    }
    setRawText(nums.join(', '));
    const randomTarget = nums[Math.floor(Math.random() * nums.length)];
    setTargetVal(String(randomTarget));
    updateState(nums, randomTarget);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Array Elements Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-slate-300 font-bold">
            {isBinarySearch ? 'Sorted Array Elements:' : 'Array Elements:'}
          </label>
          <span className="text-[11px] text-slate-500">{currentArray.length} items</span>
        </div>
        <input
          type="text"
          value={rawText}
          onChange={(e) => handleArrayChange(e.target.value)}
          placeholder="e.g. 1, 3, 5, 7, 9, 11, 13, 15"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      {/* Target Element Field */}
      <div className="space-y-1">
        <label className="text-slate-300 font-bold">Search Target Value:</label>
        <input
          type="number"
          value={targetVal}
          onChange={(e) => handleTargetChange(e.target.value)}
          placeholder="e.g. 7"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      {/* Validation Message & Binary Search Sorted Check */}
      {errorMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : isBinarySearch && !isSorted ? (
        <div className="bg-amber-950/70 border border-amber-500/50 p-2.5 rounded-xl space-y-2 text-amber-200">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>⚠ Binary Search requires a sorted array.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAutoSort}
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-1 px-3 rounded-lg"
            >
              <Check className="w-3 h-3 mr-1" /> Auto Sort
            </Button>
            <span className="text-[10px] text-amber-300">Click to automatically sort array in ascending order.</span>
          </div>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>✓ Valid search input (Array: {currentArray.length} items, Target: {currentTarget})</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          onClick={handleRandomize}
          variant="outline"
          size="sm"
          className="flex-1 bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-[11px] py-1.5"
        >
          <Shuffle className="w-3 h-3 mr-1.5 text-purple-400" /> Randomize
        </Button>

        <Button
          onClick={onResetSample}
          variant="outline"
          size="sm"
          className="flex-1 bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-[11px] py-1.5"
        >
          <RotateCcw className="w-3 h-3 mr-1.5 text-cyan-400" /> Reset Sample
        </Button>
      </div>
    </div>
  );
};
