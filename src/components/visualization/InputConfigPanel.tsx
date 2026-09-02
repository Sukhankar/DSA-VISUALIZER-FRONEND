import React, { useState, useEffect } from 'react';
import { getAlgorithmConfig, getStoredInput, setStoredInput, VisualizationInputConfig } from '../../config/visualizationConfig';
import { VisualizationInputState } from '../../types/inputState';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Sliders, Info, AlertTriangle } from 'lucide-react';

import { InputPreview } from './inputs/InputPreview';
import { ConvexHullInputEditor } from './inputs/ConvexHullInputEditor';
import { ArrayInputEditor } from './inputs/ArrayInputEditor';
import { SearchingInputEditor } from './inputs/SearchingInputEditor';
import { TwoPointerInputEditor } from './inputs/TwoPointerInputEditor';
import { SlidingWindowInputEditor } from './inputs/SlidingWindowInputEditor';
import { LinkedListInputEditor } from './inputs/LinkedListInputEditor';
import { StackInputEditor } from './inputs/StackInputEditor';
import { QueueInputEditor } from './inputs/QueueInputEditor';
import { TreeInputEditor } from './inputs/TreeInputEditor';
import { AVLTreeInputEditor } from './inputs/AVLTreeInputEditor';
import { HeapInputEditor } from './inputs/HeapInputEditor';
import { HashTableInputEditor } from './inputs/HashTableInputEditor';
import { TrieInputEditor } from './inputs/TrieInputEditor';
import { GraphInputEditor } from './inputs/GraphInputEditor';
import { RecursionInputEditor } from './inputs/RecursionInputEditor';
import { getInputEditorComponent } from './inputs/InputEditorRegistry';

interface InputConfigPanelProps {
  algorithmSlug: string;
  onRunVisualization: (inputState: VisualizationInputState) => void;
  isLoading?: boolean;
}

export const InputConfigPanel: React.FC<InputConfigPanelProps> = ({
  algorithmSlug,
  onRunVisualization,
  isLoading = false,
}) => {
  const config: VisualizationInputConfig = getAlgorithmConfig(algorithmSlug);

  // Single Source of Truth Input State
  const [inputState, setInputState] = useState<VisualizationInputState>(() => {
    const stored = getStoredInput(algorithmSlug);
    if (stored) return stored;
    return config.defaultInput;
  });

  // Re-sync when algorithm slug changes
  useEffect(() => {
    const stored = getStoredInput(algorithmSlug);
    const initial = stored || config.defaultInput;
    setInputState(initial);
  }, [algorithmSlug]);

  const handleInputChange = (newState: VisualizationInputState) => {
    setInputState(newState);
    setStoredInput(algorithmSlug, newState);
  };

  const handleResetSample = () => {
    const defaultState = {
      ...config.defaultInput,
      algorithmSlug,
      customDataUsed: false,
    };
    setInputState(defaultState);
    setStoredInput(algorithmSlug, defaultState);
  };

  const handleGenerate = () => {
    setStoredInput(algorithmSlug, inputState);
    onRunVisualization(inputState);
  };

  // Dispatch structure-aware input editor
  const renderStructureEditor = () => {
    if (!config.acceptsUserInput && config.inputMode === 'FIXED_DEMO') {
      return (
        <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex items-center space-x-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Visualization configuration unavailable for this algorithm.</span>
        </div>
      );
    }

    const { visualizationType, dataStructureType } = config;
    const EditorComponent = getInputEditorComponent(dataStructureType || visualizationType) || ArrayInputEditor;

    return (
      <EditorComponent
        inputState={inputState}
        onChange={handleInputChange}
        onResetSample={handleResetSample}
      />
    );
  };

  const badgeText = config.dataStructureType
    ? `${config.visualizationType} / ${config.dataStructureType}`
    : config.visualizationType;

  return (
    <Card className="bg-slate-950/90 border-slate-800 p-4 rounded-2xl flex flex-col space-y-4 shadow-xl">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Data Structure Input Configuration
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {inputState.customDataUsed && (
            <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-mono font-bold">
              Custom Data
            </span>
          )}
          <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded text-[10px] font-mono font-bold">
            {badgeText}
          </span>
        </div>
      </div>

      {/* Concept & Input Meaning Explanation Callout */}
      {config.explanation && (
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
            {config.explanation}
          </p>
        </div>
      )}

      {/* Structure-Specific Input Editor */}
      <div className="space-y-3">{renderStructureEditor()}</div>

      {/* Live Preview Component */}
      <InputPreview inputState={inputState} />

      {/* Generate Visualization Main Action */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all"
      >
        <Play className="w-4 h-4 fill-current" />
        {isLoading ? 'Generating Visualization Payload...' : 'Generate Visualization'}
      </Button>
    </Card>
  );
};
