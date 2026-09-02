import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Plus, Trash2, RotateCcw, ArrowRight, Check, AlertTriangle } from 'lucide-react';

interface LinkedListInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const LinkedListInputEditor: React.FC<LinkedListInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentList = inputState.listInput || [10, 20, 30, 40, 50];
  const [newNodeVal, setNewNodeVal] = useState<string>('60');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateList = (newList: number[]) => {
    if (newList.length === 0) {
      setErrorMsg('✕ Linked list must contain at least 1 node.');
      return;
    }
    setErrorMsg(null);
    onChange({
      ...inputState,
      listInput: newList,
      input: newList,
      customDataUsed: true,
    });
  };

  const handleAddNode = () => {
    const val = Number(newNodeVal);
    if (isNaN(val)) {
      setErrorMsg('✕ Node value must be a valid number.');
      return;
    }
    updateList([...currentList, val]);
    setNewNodeVal(String(val + 10));
  };

  const handleRemoveNode = (index: number) => {
    const updated = currentList.filter((_, idx) => idx !== index);
    updateList(updated);
  };

  const handleEditNode = (index: number, valStr: string) => {
    const num = Number(valStr);
    if (!isNaN(num)) {
      const updated = [...currentList];
      updated[index] = num;
      updateList(updated);
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
        <label className="text-slate-300 font-bold flex items-center gap-1.5">
          <span>HEAD Node Sequence:</span>
        </label>
        <span className="text-[11px] text-purple-400 font-bold">{currentList.length} nodes</span>
      </div>

      {/* Interactive Node Cards List Editor */}
      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
        {currentList.map((val, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <span className="w-14 text-[10px] text-slate-500 font-bold">Node[{idx}]</span>
            <input
              type="number"
              value={val}
              onChange={(e) => handleEditNode(idx, e.target.value)}
              className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono font-bold text-slate-100 outline-none"
            />
            {idx < currentList.length - 1 ? (
              <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            ) : (
              <span className="text-[10px] text-rose-400 font-bold shrink-0">→ NULL</span>
            )}
            <button
              onClick={() => handleRemoveNode(idx)}
              className="ml-auto text-slate-500 hover:text-rose-400 p-1 transition-colors"
              title="Delete node"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Node Input Row */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="number"
          value={newNodeVal}
          onChange={(e) => setNewNodeVal(e.target.value)}
          placeholder="New value"
          className="w-28 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 outline-none"
        />
        <Button
          onClick={handleAddNode}
          size="sm"
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Node
        </Button>

        <Button
          onClick={onResetSample}
          variant="outline"
          size="sm"
          className="ml-auto bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-[11px] py-1.5"
        >
          <RotateCcw className="w-3 h-3 mr-1 text-cyan-400" /> Reset Sample
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
          <span>✓ Valid linked list configuration ({currentList.length} nodes)</span>
        </div>
      )}
    </div>
  );
};
