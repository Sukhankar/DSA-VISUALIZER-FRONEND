import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Shuffle, RotateCcw, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AVLTreeInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const AVLTreeInputEditor: React.FC<AVLTreeInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentNodes = inputState.input || [30, 20, 10, 25, 40, 50];
  const [rawText, setRawText] = useState<string>(currentNodes.join(', '));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setRawText((inputState.input || [30, 20, 10, 25, 40, 50]).join(', '));
  }, [inputState.input]);

  const parseAndValidate = (valStr: string) => {
    setRawText(valStr);
    const tokens = valStr.split(/[\s,]+/).filter((t) => t.length > 0);
    const nums: number[] = [];

    for (const t of tokens) {
      const num = Number(t);
      if (isNaN(num)) {
        setErrorMsg('✕ AVL node values must be numeric.');
        return;
      }
      nums.push(num);
    }

    if (nums.length === 0) {
      setErrorMsg('✕ AVL tree must contain at least 1 root node.');
      return;
    }

    setErrorMsg(null);
    onChange({
      ...inputState,
      input: nums,
      customDataUsed: true,
    });
  };

  const handleRandomize = () => {
    const nums = [30, 20, 10, 25, 40, 50].map(() => Math.floor(Math.random() * 80) + 10);
    const unique = Array.from(new Set(nums));
    parseAndValidate(unique.join(', '));
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1">
        <label className="text-slate-300 font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AVL Insertion Sequence:</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">{currentNodes.length} nodes</span>
        </label>
        <input
          type="text"
          value={rawText}
          onChange={(e) => parseAndValidate(e.target.value)}
          placeholder="e.g. 30, 20, 10, 25, 40, 50"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
        <p className="text-[10px] text-slate-400 leading-relaxed pt-0.5">
          AVL self-balancing tree calculates height balance factor |BF| ≤ 1 on each insertion and triggers LL, RR, LR, or RL rotations when imbalanced.
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
          <span>✓ Valid AVL insertion sequence ({currentNodes.length} nodes)</span>
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
