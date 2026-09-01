import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Play, Shuffle, AlertCircle } from 'lucide-react';

interface ArrayInputProps {
  onGenerate: (input: number[], target?: number) => void;
  isSearching?: boolean;
  isBinarySearch?: boolean;
  isLoading?: boolean;
  defaultInput?: string;
  defaultTarget?: number;
  label?: string;
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
  onGenerate,
  isSearching = false,
  isBinarySearch = false,
  isLoading = false,
  defaultInput = '5, 1, 4, 2, 8',
  defaultTarget = 4,
  label = 'Input Elements (comma-separated, max 50)',
}) => {
  const [arrayStr, setArrayStr] = useState<string>(defaultInput);
  const [targetStr, setTargetStr] = useState<string>(
    defaultTarget !== undefined ? defaultTarget.toString() : '4'
  );
  const [error, setError] = useState<string | null>(null);

  const parseAndValidate = (): { input: number[]; target?: number } | null => {
    setError(null);
    const trimmed = arrayStr.trim();
    if (!trimmed) {
      setError('Please enter array values separated by commas.');
      return null;
    }

    const rawParts = trimmed.split(',').map((p) => p.trim()).filter((p) => p !== '');
    if (rawParts.length === 0) {
      setError('Please enter valid numerical array elements.');
      return null;
    }

    if (rawParts.length > 50) {
      setError('Array size must not exceed 50 elements.');
      return null;
    }

    const nums: number[] = [];
    for (const part of rawParts) {
      const num = Number(part);
      if (isNaN(num)) {
        setError(`Invalid number: "${part}". Please enter numbers only.`);
        return null;
      }
      nums.push(num);
    }

    let targetNum: number | undefined = undefined;
    if (isSearching) {
      const trimmedTarget = targetStr.trim();
      if (!trimmedTarget) {
        setError('Search target value is required.');
        return null;
      }
      targetNum = Number(trimmedTarget);
      if (isNaN(targetNum)) {
        setError(`Invalid target value: "${trimmedTarget}".`);
        return null;
      }
    }

    return { input: nums, target: targetNum };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseAndValidate();
    if (result) {
      onGenerate(result.input, result.target);
    }
  };

  const handlePresetUnsorted = () => {
    setArrayStr('5, 1, 4, 2, 8, 3, 9, 6');
    if (isSearching) setTargetStr('8');
    setError(null);
  };

  const handlePresetSorted = () => {
    setArrayStr('1, 3, 5, 7, 9, 12, 15, 20');
    if (isSearching) setTargetStr('7');
    setError(null);
  };

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 6) + 5; // 5 to 10 elements
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 45) + 5);
    if (isBinarySearch) {
      arr.sort((a, b) => a - b);
    }
    setArrayStr(arr.join(', '));
    if (isSearching) {
      const randomTarget = arr[Math.floor(Math.random() * arr.length)];
      setTargetStr(randomTarget.toString());
    }
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            {label}
          </label>
          <input
            type="text"
            value={arrayStr}
            onChange={(e) => setArrayStr(e.target.value)}
            placeholder="e.g. 5, 1, 4, 2, 8"
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {isSearching && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Search Target Value
            </label>
            <input
              type="text"
              value={targetStr}
              onChange={(e) => setTargetStr(e.target.value)}
              placeholder="e.g. 4"
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {isBinarySearch && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Note: Binary Search requires elements to be in ascending sorted order.</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Preset Action Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Presets:</span>
        <button
          type="button"
          onClick={handlePresetUnsorted}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-md transition-colors cursor-pointer"
        >
          Unsorted
        </button>
        <button
          type="button"
          onClick={handlePresetSorted}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-md transition-colors cursor-pointer"
        >
          Sorted
        </button>
        <button
          type="button"
          onClick={handleRandom}
          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Shuffle className="w-3 h-3" />
          <span>Randomize</span>
        </button>
      </div>

      {/* Generate Visualization Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isLoading={isLoading}
        leftIcon={<Play className="w-4 h-4 fill-white" />}
      >
        Generate Visualization
      </Button>
    </form>
  );
};
