import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { RotateCcw, Check, AlertTriangle, Table } from 'lucide-react';

interface DPInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const DPInputEditor: React.FC<DPInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const isKnapsack = inputState.algorithmSlug.includes('knapsack') || !!inputState.knapsackInput;

  // Fibonacci state
  const currentN = inputState.input?.[0] || 7;
  const [nVal, setNVal] = useState<string>(String(currentN));

  // Knapsack state
  const currentWeights = inputState.knapsackInput?.weights || [2, 3, 4, 5];
  const currentValues = inputState.knapsackInput?.values || [3, 4, 5, 7];
  const currentCapacity = inputState.knapsackInput?.capacity || 7;

  const [weightsText, setWeightsText] = useState<string>(currentWeights.join(', '));
  const [valuesText, setValuesText] = useState<string>(currentValues.join(', '));
  const [capacityVal, setCapacityVal] = useState<string>(String(currentCapacity));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (inputState.knapsackInput) {
      setWeightsText(inputState.knapsackInput.weights.join(', '));
      setValuesText(inputState.knapsackInput.values.join(', '));
      setCapacityVal(String(inputState.knapsackInput.capacity));
    } else {
      setNVal(String(inputState.input?.[0] || 7));
    }
  }, [inputState.knapsackInput, inputState.input]);

  const handleNChange = (valStr: string) => {
    setNVal(valStr);
    const n = Number(valStr);
    if (isNaN(n) || n < 1 || n > 20) {
      setErrorMsg('✕ Fibonacci target N must be between 1 and 20.');
      return;
    }
    setErrorMsg(null);
    onChange({
      ...inputState,
      input: [n],
      customDataUsed: true,
    });
  };

  const updateKnapsack = (wStr: string, vStr: string, cStr: string) => {
    setWeightsText(wStr);
    setValuesText(vStr);
    setCapacityVal(cStr);

    const wTokens = wStr.split(/[\s,]+/).filter((t) => t.length > 0).map(Number);
    const vTokens = vStr.split(/[\s,]+/).filter((t) => t.length > 0).map(Number);
    const cap = Number(cStr);

    if (wTokens.some(isNaN) || vTokens.some(isNaN) || isNaN(cap)) {
      setErrorMsg('✕ Knapsack weights, values, and capacity must be numeric.');
      return;
    }

    if (wTokens.length !== vTokens.length) {
      setErrorMsg(`✕ Mismatch: ${wTokens.length} weights vs ${vTokens.length} values.`);
      return;
    }

    if (cap <= 0) {
      setErrorMsg('✕ Knapsack capacity must be greater than 0.');
      return;
    }

    setErrorMsg(null);
    onChange({
      ...inputState,
      knapsackInput: {
        weights: wTokens,
        values: vTokens,
        capacity: cap,
      },
      customDataUsed: true,
    });
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {!isKnapsack ? (
        <div className="space-y-1">
          <label className="text-slate-300 font-bold flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-purple-400" />
            <span>Target Fibonacci DP Number (N):</span>
          </label>
          <input
            type="number"
            value={nVal}
            onChange={(e) => handleNChange(e.target.value)}
            placeholder="e.g. 7"
            className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Item Weights:</label>
            <input
              type="text"
              value={weightsText}
              onChange={(e) => updateKnapsack(e.target.value, valuesText, capacityVal)}
              placeholder="e.g. 2, 3, 4, 5"
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Item Values:</label>
            <input
              type="text"
              value={valuesText}
              onChange={(e) => updateKnapsack(weightsText, e.target.value, capacityVal)}
              placeholder="e.g. 3, 4, 5, 7"
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Max Knapsack Capacity:</label>
            <input
              type="number"
              value={capacityVal}
              onChange={(e) => updateKnapsack(weightsText, valuesText, e.target.value)}
              placeholder="e.g. 7"
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 outline-none"
            />
          </div>
        </div>
      )}

      {errorMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>✓ Valid DP configuration</span>
        </div>
      )}

      <div className="flex items-center justify-end pt-1">
        <Button
          onClick={onResetSample}
          variant="outline"
          size="sm"
          className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-[11px] py-1.5"
        >
          <RotateCcw className="w-3 h-3 mr-1.5 text-cyan-400" /> Reset Sample
        </Button>
      </div>
    </div>
  );
};
