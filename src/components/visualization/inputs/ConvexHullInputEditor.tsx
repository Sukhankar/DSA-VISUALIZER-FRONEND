import React from 'react';
import { VisualizationInputState, Point2D } from '../../../types/inputState';
import { Plus, Trash2, RotateCcw, Shuffle } from 'lucide-react';

interface ConvexHullInputEditorProps {
  inputState?: VisualizationInputState;
  value?: VisualizationInputState;
  onChange: (state: VisualizationInputState) => void;
  onResetSample?: () => void;
}

const DEFAULT_POINTS: Point2D[] = [
  { x: 1, y: 1, label: 'P1' },
  { x: 2, y: 5, label: 'P2' },
  { x: 5, y: 4, label: 'P3' },
  { x: 7, y: 2, label: 'P4' },
  { x: 4, y: 0, label: 'P5' },
  { x: 2, y: 2, label: 'P6' },
];

export const ConvexHullInputEditor: React.FC<ConvexHullInputEditorProps> = ({
  inputState,
  value,
  onChange,
}) => {
  const currentState: VisualizationInputState = inputState || value || { algorithmSlug: 'convex-hull-jarvis-march', structureType: 'POINT_SET' };
  const points: Point2D[] = currentState.pointsInput || DEFAULT_POINTS;

  const updatePoints = (newPoints: Point2D[]) => {
    onChange({
      ...currentState,
      pointsInput: newPoints,
      customDataUsed: true,
    });
  };

  const handlePointChange = (index: number, field: 'x' | 'y', valStr: string) => {
    const num = parseFloat(valStr) || 0;
    const updated = points.map((p: Point2D, idx: number) => {
      if (idx === index) {
        return { ...p, [field]: num };
      }
      return p;
    });
    updatePoints(updated);
  };

  const handleAddPoint = () => {
    if (points.length >= 20) return;
    const newPoint: Point2D = {
      x: Math.floor(Math.random() * 8) + 1,
      y: Math.floor(Math.random() * 8) + 1,
      label: `P${points.length + 1}`,
    };
    updatePoints([...points, newPoint]);
  };

  const handleDeletePoint = (index: number) => {
    if (points.length <= 3) return;
    const updated = points.filter((_: Point2D, idx: number) => idx !== index);
    // Relabel
    const relabeled = updated.map((p: Point2D, idx: number) => ({ ...p, label: `P${idx + 1}` }));
    updatePoints(relabeled);
  };

  const handleRandomize = () => {
    const count = 6;
    const randomized: Point2D[] = [];
    for (let i = 0; i < count; i++) {
      randomized.push({
        x: Math.floor(Math.random() * 8) + 1,
        y: Math.floor(Math.random() * 8) + 1,
        label: `P${i + 1}`,
      });
    }
    updatePoints(randomized);
  };

  const handleResetSample = () => {
    updatePoints(DEFAULT_POINTS);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
          2D Point Coordinates ({points.length} points)
        </span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-purple-900/40 text-purple-300 hover:bg-purple-800/50 transition-colors border border-purple-500/30"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>
          <button
            type="button"
            onClick={handleResetSample}
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample</span>
          </button>
        </div>
      </div>

      {/* Point List Editor */}
      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {points.map((pt: Point2D, idx: number) => (
          <div
            key={idx}
            className="flex items-center space-x-3 bg-slate-900/60 p-2 rounded-lg border border-purple-900/30 hover:border-purple-500/40 transition-colors"
          >
            <span className="w-8 text-center text-xs font-mono font-bold text-cyan-400">
              {pt.label || `P${idx + 1}`}
            </span>
            <div className="flex items-center space-x-1 flex-1">
              <span className="text-xs text-slate-400 font-mono">X:</span>
              <input
                type="number"
                value={pt.x}
                onChange={(e) => handlePointChange(idx, 'x', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center space-x-1 flex-1">
              <span className="text-xs text-slate-400 font-mono">Y:</span>
              <input
                type="number"
                value={pt.y}
                onChange={(e) => handlePointChange(idx, 'y', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="button"
              onClick={() => handleDeletePoint(idx)}
              disabled={points.length <= 3}
              className={`p-1 rounded text-xs transition-colors ${
                points.length <= 3
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-rose-400 hover:bg-rose-950/50 hover:text-rose-300'
              }`}
              title={points.length <= 3 ? 'Minimum 3 points required' : 'Delete point'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Point Button */}
      <button
        type="button"
        onClick={handleAddPoint}
        disabled={points.length >= 20}
        className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Coordinate Point</span>
      </button>

      {/* Status indicator */}
      {points.length < 3 ? (
        <p className="text-xs text-amber-400 font-mono">
          ⚠ Minimum 3 non-collinear points required for Convex Hull.
        </p>
      ) : (
        <p className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
          <span>✓ Valid point set ({points.length} points ready)</span>
        </p>
      )}
    </div>
  );
};
