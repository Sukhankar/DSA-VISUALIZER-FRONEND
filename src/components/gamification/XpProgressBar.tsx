import React from 'react';
import { LevelProgressDto } from '../../types';
import { Zap, Award } from 'lucide-react';

interface XpProgressBarProps {
  levelProgress?: LevelProgressDto;
  totalXp?: number;
  currentLevel?: number;
  compact?: boolean;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({
  levelProgress,
  totalXp = 0,
  currentLevel = 1,
  compact = false,
}) => {
  const percent = levelProgress?.progressPercentage ?? Math.min(100, Math.round(((totalXp || 0) % 500) / 5));
  const currentXp = levelProgress?.currentXp ?? totalXp ?? 0;
  const xpInCurrent = levelProgress?.xpInCurrentLevel ?? ((totalXp || 0) % 500) ?? 0;
  const xpForNext = levelProgress?.xpRequiredForNextLevel ?? 500;
  const title = levelProgress?.title || `Level ${currentLevel} Explorer`;

  if (compact) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1 font-medium">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" /> Lv {currentLevel} • {title}
          </span>
          <span>{xpInCurrent} / {xpForNext} XP ({percent}%)</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            style={{ width: `${Math.max(3, percent)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
            {currentLevel}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Level {currentLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Total XP Earned: <span className="text-amber-300 font-semibold">{(currentXp ?? 0).toLocaleString()} XP</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {(xpInCurrent ?? 0).toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-slate-400"> / {(xpForNext ?? 500).toLocaleString()} XP</span>
          <p className="text-xs text-slate-500 font-medium">{(xpForNext ?? 500) - (xpInCurrent ?? 0)} XP until Level {currentLevel + 1}</p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative pt-1">
        <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-1 border border-slate-800 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.6)] relative"
            style={{ width: `${Math.max(2, percent)}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
          <span>Level {currentLevel}</span>
          <span className="text-emerald-400 font-bold">{percent}% Completed</span>
          <span>Level {currentLevel + 1}</span>
        </div>
      </div>
    </div>
  );
};
