import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Shuffle, RotateCcw, Check, AlertTriangle } from 'lucide-react';

interface SlidingWindowInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const SlidingWindowInputEditor: React.FC<SlidingWindowInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentValues = inputState.slidingWindowInput?.values || inputState.input || [2, 1, 5, 1, 3, 2];
  const currentWindowSize = inputState.slidingWindowInput?.windowSize || inputState.target || 3;

  const [rawText, setRawText] = useState<string>(currentValues.join(', '));
  const [windowVal, setWindowVal] = useState<string>(String(currentWindowSize));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const vals = inputState.slidingWindowInput?.values || inputState.input || [2, 1, 5, 1, 3, 2];
    const k = inputState.slidingWindowInput?.windowSize || inputState.target || 3;
    setRawText(vals.join(', '));
    setWindowVal(String(k));
  }, [inputState.slidingWindowInput, inputState.input, inputState.target]);

  const update = (vals: number[], k: number) => {
    if (k <= 0) {
      setErrorMsg('✕ Window size must be greater than 0.');
      return;
    }
    if (k > vals.length) {
      setErrorMsg(`✕ Window size (${k}) cannot exceed array length (${vals.length}).`);
      return;
    }
    setErrorMsg(null);
    onChange({
      ...inputState,
      input: vals,
      target: k,
      slidingWindowInput: { values: vals, windowSize: k },
      customDataUsed: true,
    });
  };

  const handleArrayChange = (valStr: string) => {
    setRawText(valStr);
    const tokens = valStr.split(/[\s,]+/).filter((t) => t.length > 0);
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

    const k = Number(windowVal) || 3;
    update(nums, k);
  };

  const handleWindowChange = (valStr: string) => {
    setWindowVal(valStr);
    const k = Number(valStr);
    if (!isNaN(k)) {
      update(currentValues, k);
    }
  };

  const handleRandomize = () => {
    const count = 6;
    const nums = Array.from({ length: count }, () => Math.floor(Math.random() * 20) + 1);
    const k = 3;
    setRawText(nums.join(', '));
    setWindowVal(String(k));
    update(nums, k);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1">
        <label className="text-slate-300 font-bold">Array Elements:</label>
        <input
          type="text"
          value={rawText}
          onChange={(e) => handleArrayChange(e.target.value)}
          placeholder="e.g. 2, 1, 5, 1, 3, 2"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-300 font-bold">Window Size (k):</label>
        <input
          type="number"
          value={windowVal}
          onChange={(e) => handleWindowChange(e.target.value)}
          placeholder="e.g. 3"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      {errorMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>✓ Valid sliding window input (N={currentValues.length}, Window Size k={currentWindowSize})</span>
        </div>
      )}

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
