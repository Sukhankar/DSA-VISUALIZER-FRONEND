import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Shuffle, RotateCcw, Check, AlertTriangle, Hash } from 'lucide-react';

interface HashTableInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const HashTableInputEditor: React.FC<HashTableInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentKeys = inputState.hashTableInput?.keys || ['apple', 'banana', 'cat', 'dog'];
  const currentTableSize = inputState.hashTableInput?.tableSize || 7;

  const [rawText, setRawText] = useState<string>(currentKeys.join(', '));
  const [sizeVal, setSizeVal] = useState<string>(String(currentTableSize));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const keys = inputState.hashTableInput?.keys || ['apple', 'banana', 'cat', 'dog'];
    const sz = inputState.hashTableInput?.tableSize || 7;
    setRawText(keys.join(', '));
    setSizeVal(String(sz));
  }, [inputState.hashTableInput]);

  const update = (keys: string[], sz: number) => {
    if (sz <= 0 || sz > 20) {
      setErrorMsg('✕ Table size must be between 1 and 20.');
      return;
    }
    setErrorMsg(null);
    onChange({
      ...inputState,
      hashTableInput: { keys, tableSize: sz, collisionMethod: 'chaining' },
      customDataUsed: true,
    });
  };

  const handleKeysChange = (valStr: string) => {
    setRawText(valStr);
    const keys = valStr.split(/[\s,]+/).filter((t) => t.length > 0);
    if (keys.length === 0) {
      setErrorMsg('✕ Hash table keys list cannot be empty.');
      return;
    }
    update(keys, Number(sizeVal) || 7);
  };

  const handleSizeChange = (valStr: string) => {
    setSizeVal(valStr);
    const sz = Number(valStr);
    if (!isNaN(sz)) {
      update(currentKeys, sz);
    }
  };

  const handleRandomize = () => {
    const pool = ['apple', 'banana', 'cat', 'dog', 'elephant', 'falcon', 'giraffe', 'horse'];
    const count = 4;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
    setRawText(shuffled.join(', '));
    update(shuffled, 7);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1">
        <label className="text-slate-300 font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-purple-400" />
            <span>Keys to insert into Hash Table:</span>
          </span>
          <span className="text-[10px] text-purple-400 font-bold">{currentKeys.length} keys</span>
        </label>
        <input
          type="text"
          value={rawText}
          onChange={(e) => handleKeysChange(e.target.value)}
          placeholder="e.g. apple, banana, cat, dog"
          className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 outline-none transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label className="text-slate-300 font-bold">Bucket Size (h(k) = key % size):</label>
        <input
          type="number"
          value={sizeVal}
          onChange={(e) => handleSizeChange(e.target.value)}
          placeholder="e.g. 7"
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
          <span>✓ Valid Hash Table input ({currentKeys.length} keys, {currentTableSize} buckets)</span>
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
