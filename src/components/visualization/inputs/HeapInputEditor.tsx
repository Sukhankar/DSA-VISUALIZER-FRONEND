import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Shuffle, RotateCcw, Check, AlertTriangle, Layers } from 'lucide-react';

interface HeapInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const HeapInputEditor: React.FC<HeapInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentValues = inputState.heapInput?.values || inputState.input || [20, 15, 30, 10, 25, 5];
  const currentHeapType = inputState.heapInput?.heapType || 'MIN';

  const [rawText, setRawText] = useState<string>(currentValues.join(', '));
  const [heapType, setHeapType] = useState<'MIN' | 'MAX'>(currentHeapType);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const vals = inputState.heapInput?.values || inputState.input || [20, 15, 30, 10, 25, 5];
    const type = inputState.heapInput?.heapType || 'MIN';
    setRawText(vals.join(', '));
    setHeapType(type);
  }, [inputState.heapInput, inputState.input]);

  const update = (vals: number[], type: 'MIN' | 'MAX') => {
    setErrorMsg(null);
    onChange({
      ...inputState,
      input: vals,
      heapInput: { values: vals, heapType: type },
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
        setErrorMsg('✕ Heap elements must be numeric.');
        return;
      }
      nums.push(num);
    }

    if (nums.length === 0) {
      setErrorMsg('✕ Heap cannot be empty.');
      return;
    }

    update(nums, heapType);
  };

  const handleHeapTypeChange = (type: 'MIN' | 'MAX') => {
    setHeapType(type);
    update(currentValues, type);
  };

  const handleRandomize = () => {
    const count = 6;
    const nums = Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 1);
    setRawText(nums.join(', '));
    update(nums, heapType);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1">
        <label className="text-slate-300 font-bold flex items-center justify-between">
          <span>Heap Array Elements:</span>
          <span className="text-[10px] text-amber-400 font-bold">{currentValues.length} items</span>
        </label>
        <input
          type="text"
          value={rawText}
          onChange={(e) => handleArrayChange(e.target.value)}
          placeholder="e.g. 20, 15, 30, 10, 25, 5"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-300 font-bold">Heap Variant Selector:</label>
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => handleHeapTypeChange('MIN')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              heapType === 'MIN'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Min Heap (Root = Min)
          </button>
          <button
            onClick={() => handleHeapTypeChange('MAX')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              heapType === 'MAX'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Max Heap (Root = Max)
          </button>
        </div>
      </div>

      {errorMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>✓ Valid {heapType} Heap input ({currentValues.length} elements)</span>
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
