import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Plus, Minus, RotateCcw, Check, AlertTriangle, Layers } from 'lucide-react';

interface StackInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const StackInputEditor: React.FC<StackInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentItems = inputState.stackInput || [10, 20, 30, 40];
  const [pushVal, setPushVal] = useState<string>('50');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateStack = (items: number[]) => {
    setErrorMsg(null);
    onChange({
      ...inputState,
      stackInput: items,
      input: items,
      customDataUsed: true,
    });
  };

  const handlePush = () => {
    const val = Number(pushVal);
    if (isNaN(val)) {
      setErrorMsg('✕ Value must be a valid number.');
      return;
    }
    updateStack([...currentItems, val]);
    setPushVal(String(val + 10));
  };

  const handlePop = () => {
    if (currentItems.length === 0) {
      setErrorMsg('✕ Stack is already empty.');
      return;
    }
    updateStack(currentItems.slice(0, currentItems.length - 1));
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
        <label className="text-slate-300 font-bold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>LIFO Stack Items:</span>
        </label>
        <span className="text-[11px] text-purple-400 font-bold">Size: {currentItems.length}</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={pushVal}
          onChange={(e) => setPushVal(e.target.value)}
          placeholder="Value to PUSH"
          className="w-32 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 outline-none"
        />
        <Button
          onClick={handlePush}
          size="sm"
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> PUSH
        </Button>

        <Button
          onClick={handlePop}
          variant="outline"
          size="sm"
          className="bg-rose-950/60 border-rose-500/50 hover:bg-rose-900 text-rose-200 font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1"
        >
          <Minus className="w-3.5 h-3.5" /> POP
        </Button>

        <Button
          onClick={onResetSample}
          variant="outline"
          size="sm"
          className="ml-auto bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-[11px] py-1.5"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" /> Reset
        </Button>
      </div>

      {errorMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>✓ Valid stack configuration ({currentItems.length} items)</span>
        </div>
      )}
    </div>
  );
};
