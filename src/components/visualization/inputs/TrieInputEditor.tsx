import React, { useState, useEffect } from 'react';
import { VisualizationInputState } from '../../../types/inputState';
import { Button } from '../../ui/Button';
import { Shuffle, RotateCcw, Check, AlertTriangle, GitMerge } from 'lucide-react';

interface TrieInputEditorProps {
  inputState: VisualizationInputState;
  onChange: (newState: VisualizationInputState) => void;
  onResetSample: () => void;
}

export const TrieInputEditor: React.FC<TrieInputEditorProps> = ({
  inputState,
  onChange,
  onResetSample,
}) => {
  const currentWords = inputState.trieInput || ['cat', 'car', 'card', 'care', 'dog'];
  const [rawText, setRawText] = useState<string>(currentWords.join(', '));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setRawText((inputState.trieInput || ['cat', 'car', 'card', 'care', 'dog']).join(', '));
  }, [inputState.trieInput]);

  const parseAndValidate = (valStr: string) => {
    setRawText(valStr);
    const words = valStr.split(/[\s,]+/).filter((t) => t.length > 0);

    for (const w of words) {
      if (!/^[a-zA-Z]+$/.test(w)) {
        setErrorMsg('✕ Words must contain alphabetic characters only.');
        return;
      }
    }

    if (words.length === 0) {
      setErrorMsg('✕ Trie requires at least 1 word.');
      return;
    }

    setErrorMsg(null);
    onChange({
      ...inputState,
      trieInput: words,
      customDataUsed: true,
    });
  };

  const handleRandomize = () => {
    const pool = ['app', 'apple', 'application', 'bat', 'ball', 'code', 'coder', 'data'];
    const count = 4;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
    parseAndValidate(shuffled.join(', '));
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1">
        <label className="text-slate-300 font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GitMerge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Words to insert into Trie Prefix Tree:</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-bold">{currentWords.length} words</span>
        </label>
        <input
          type="text"
          value={rawText}
          onChange={(e) => parseAndValidate(e.target.value)}
          placeholder="e.g. cat, car, card, care, dog"
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
          <span>✓ Valid Trie word list ({currentWords.length} words)</span>
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
