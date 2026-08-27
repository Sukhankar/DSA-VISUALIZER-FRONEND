import React from 'react';
import { Button } from '../ui/Button';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Zap,
} from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlayPause: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlayPause,
  onReset,
  onPrev,
  onNext,
  onJumpToStart,
  onJumpToEnd,
  onSpeedChange,
}) => {
  const isAtStart = currentStep <= 0;
  const isAtEnd = totalSteps <= 0 || currentStep >= totalSteps - 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg">
      {/* Primary Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={isAtStart}
          onClick={onJumpToStart}
          title="Jump to Start (First Step)"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isAtStart}
          onClick={onPrev}
          title="Previous Step (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onPlayPause}
          title="Play / Pause (Spacebar)"
          className="min-w-[100px]"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white mr-1" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white mr-1" />
              <span>Play</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isAtEnd}
          onClick={onNext}
          title="Next Step (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isAtEnd}
          onClick={onJumpToEnd}
          title="Jump to End (Last Step)"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          title="Reset to Step 1"
          leftIcon={<RotateCcw className="w-4 h-4 text-slate-400" />}
        >
          Reset
        </Button>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-2 text-xs">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-slate-400 font-medium">Speed:</span>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[0.5, 1, 1.5, 2].map((s) => {
            const isActive = speed === s;
            return (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
