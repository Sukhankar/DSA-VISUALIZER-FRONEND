import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Shuffle, RotateCcw, Check, AlertTriangle } from 'lucide-react';

interface TwoPointerInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const TwoPointerInputEditor: React.FC<TwoPointerInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentValues = inputState.twoPointerInput?.values || inputState.input || [3, 8, 12, 17, 21, 26, 30];
  const currentTargetSum = inputState.twoPointerInput?.targetSum || inputState.target || 29;

  const [rawText, setRawText] = useState<string>(currentValues.join(', '));
  const [targetSumVal, setTargetSumVal] = useState<string>(String(currentTargetSum));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const vals = inputState.twoPointerInput?.values || inputState.input || [3, 8, 12, 17, 21, 26, 30];
    const target = inputState.twoPointerInput?.targetSum || inputState.target || 29;
    setRawText(vals.join(', '));
    setTargetSumVal(String(target));
  }, [inputState.twoPointerInput, inputState.input, inputState.target]);

  const update = (vals: number[], target: number) => {
    onChange({
      ...inputState,
      input: vals,
      target: target,
      twoPointerInput: { values: vals, targetSum: target },
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

    if (nums.length < 2) {
      setErrorMsg('✕ Two pointers algorithm requires at least 2 elements.');
      return;
    }

    setErrorMsg(null);
    update(nums, Number(targetSumVal) || 29);
  };

  const handleTargetChange = (valStr: string) => {
    setTargetSumVal(valStr);
    const num = Number(valStr);
    if (!isNaN(num)) {
      update(currentValues, num);
    }
  };

  const handleRandomize = () => {
    const sortedNums = [3, 8, 12, 17, 21, 26, 30].map(() => Math.floor(Math.random() * 40) + 1).sort((a, b) => a - b);
    const randomTarget = sortedNums[0] + sortedNums[sortedNums.length - 1];
    setRawText(sortedNums.join(', '));
    setTargetSumVal(String(randomTarget));
    update(sortedNums, randomTarget);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1">
        <label className="text-slate-300 font-bold">Sorted Array Elements:</label>
        <input
          type="text"
          value={rawText}
          onChange={(e) => handleArrayChange(e.target.value)}
          placeholder="e.g. 3, 8, 12, 17, 21, 26, 30"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-300 font-bold">Target Sum:</label>
        <input
          type="number"
          value={targetSumVal}
          onChange={(e) => handleTargetChange(e.target.value)}
          placeholder="e.g. 29"
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
          <span>✓ Valid two pointers input (Array length: {currentValues.length}, Target Sum: {currentTargetSum})</span>
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
