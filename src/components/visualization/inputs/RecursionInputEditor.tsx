import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { RotateCcw, Check, AlertTriangle, Layers } from 'lucide-react';

interface RecursionInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const RecursionInputEditor: React.FC<RecursionInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentN = inputState.recursionInput?.n || inputState.input?.[0] || 5;
  const [nVal, setNVal] = useState<string>(String(currentN));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const n = inputState.recursionInput?.n || inputState.input?.[0] || 5;
    setNVal(String(n));
  }, [inputState.recursionInput, inputState.input]);

  const handleNChange = (valStr: string) => {
    setNVal(valStr);
    const n = Number(valStr);
    if (isNaN(n) || n < 1 || n > 12) {
      setErrorMsg('✕ Recursion input N must be an integer between 1 and 12.');
      return;
    }
    setErrorMsg(null);
    onChange({
      ...inputState,
      input: [n],
      recursionInput: { n, maxDepth: 5 },
      customDataUsed: true,
    });
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1">
        <label className="text-slate-300 font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recursion Input Parameter (N):</span>
          </span>
          <span className="text-[10px] text-indigo-400 font-bold">N = {currentN}</span>
        </label>
        <input
          type="number"
          value={nVal}
          onChange={(e) => handleNChange(e.target.value)}
          placeholder="e.g. 5"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
        <p className="text-[10px] text-slate-400 leading-relaxed pt-0.5">
          Controls call stack recursion depth for f(N). Stack frames deeper than 5 are truncated for visual clarity.
        </p>
      </div>

      {errorMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>✓ Valid recursion parameter (N = {currentN})</span>
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
