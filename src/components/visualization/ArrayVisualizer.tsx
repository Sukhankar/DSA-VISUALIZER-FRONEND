import React from 'react';
import { ActionType } from '../../types';

interface ArrayVisualizerProps {
  array: number[];
  indices?: number[];
  action?: ActionType;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array,
  indices = [],
  action = 'INITIAL',
}) => {
  if (!array || array.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 font-mono">
        No array data available to visualize.
      </div>
    );
  }

  // Calculate max value for height scaling
  const maxVal = Math.max(...array.map(Math.abs), 1);

  const getBarStyle = (index: number) => {
    const isHighlighted = indices.includes(index);
    const isComplete = action === 'COMPLETE';

    if (isComplete) {
      return {
        bg: 'bg-emerald-500/90 border-emerald-400 text-white shadow-lg shadow-emerald-500/20',
        text: 'text-emerald-300',
      };
    }

    if (!isHighlighted) {
      return {
        bg: 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700/90',
        text: 'text-slate-500',
      };
    }

    switch (action) {
      case 'COMPARE':
        return {
          bg: 'bg-amber-500 border-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105',
          text: 'text-amber-400 font-bold',
        };
      case 'SWAP':
        return {
          bg: 'bg-rose-500 border-rose-300 text-white font-bold shadow-lg shadow-rose-500/30 scale-105 animate-pulse',
          text: 'text-rose-400 font-bold',
        };
      case 'NO_SWAP':
        return {
          bg: 'bg-indigo-500 border-indigo-300 text-white font-bold shadow-lg shadow-indigo-500/30',
          text: 'text-indigo-400 font-bold',
        };
      case 'SELECT':
        return {
          bg: 'bg-purple-500 border-purple-300 text-white font-bold shadow-lg shadow-purple-500/30',
          text: 'text-purple-400 font-bold',
        };
      case 'FOUND':
        return {
          bg: 'bg-emerald-500 border-emerald-300 text-white font-bold shadow-lg shadow-emerald-500/30 scale-105',
          text: 'text-emerald-400 font-bold',
        };
      case 'NOT_FOUND':
        return {
          bg: 'bg-rose-900 border-rose-700 text-rose-200',
          text: 'text-rose-400',
        };
      default:
        return {
          bg: 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md shadow-indigo-500/20',
          text: 'text-indigo-300',
        };
    }
  };

  return (
    <div className="w-full h-72 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-x-auto select-none">
      {/* Bars Canvas */}
      <div className="flex-1 flex items-end justify-center gap-2 sm:gap-3 min-w-[280px] pb-2">
        {array.map((val, idx) => {
          const heightPercent = Math.max((Math.abs(val) / maxVal) * 82, 14);
          const style = getBarStyle(idx);

          return (
            <div
              key={`bar-${idx}`}
              className="flex-1 flex flex-col items-center justify-end h-full max-w-[56px] transition-all duration-300 ease-out"
            >
              {/* Bar Element */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg border-t border-x flex items-center justify-center transition-all duration-300 ${style.bg}`}
              >
                <span className="text-xs font-mono font-bold drop-shadow-sm px-1 truncate">
                  {val}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Index Labels Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 border-t border-slate-800/80 pt-2 min-w-[280px]">
        {array.map((_, idx) => {
          const style = getBarStyle(idx);
          return (
            <div key={`idx-${idx}`} className="flex-1 text-center max-w-[56px]">
              <span className={`text-[10px] font-mono font-semibold ${style.text}`}>
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
