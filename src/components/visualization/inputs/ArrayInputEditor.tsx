import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Shuffle, RotateCcw, AlertTriangle, Check } from 'lucide-react';

interface ArrayInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const ArrayInputEditor: React.FC<ArrayInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentArray = inputState.input || [5, 1, 4, 2, 8];
  const [rawText, setRawText] = useState<string>(currentArray.join(', '));
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  useEffect(() => {
    setRawText((inputState.input || [5, 1, 4, 2, 8]).join(', '));
  }, [inputState.input]);

  const parseAndValidate = (val: string) => {
    setRawText(val);
    const tokens = val.split(/[\s,]+/).filter((t) => t.length > 0);
    const nums: number[] = [];

    for (const t of tokens) {
      const num = Number(t);
      if (isNaN(num)) {
        setValidationMsg('✕ Invalid token: Contains non-numeric elements.');
        return;
      }
      nums.push(num);
    }

    if (nums.length === 0) {
      setValidationMsg('✕ Array cannot be empty.');
      return;
    }

    if (nums.length > 50) {
      setValidationMsg('✕ Maximum limit exceeded (max 50 elements).');
      return;
    }

    setValidationMsg(null);
    onChange({
      ...inputState,
      input: nums,
      customDataUsed: true,
    });
  };

  const handleRandomize = () => {
    const count = Math.floor(Math.random() * 6) + 4; // 4 to 9 elements
    const randomArray = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 5);
    parseAndValidate(randomArray.join(', '));
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 font-bold">Array Elements (comma-separated):</label>
        <span className="text-[11px] text-slate-500">{currentArray.length} elements</span>
      </div>

      <input
        type="text"
        value={rawText}
        onChange={(e) => parseAndValidate(e.target.value)}
        placeholder="e.g. 5, 1, 4, 2, 8"
        className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100 outline-none transition-colors"
      />

      {/* Validation Message */}
      {validationMsg ? (
        <div className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationMsg}</span>
        </div>
      ) : (
        <div className="text-emerald-400 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>✓ Valid input array ({currentArray.length} items)</span>
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
